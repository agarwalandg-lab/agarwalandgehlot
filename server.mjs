import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { createClient } from '@supabase/supabase-js';

const port = Number(process.env.PORT || 8787);
const apiKey = process.env.OPENAI_API_KEY;
const model = process.env.OPENAI_MODEL || 'gpt-5-mini';
const distRoot = join(process.cwd(), 'dist');
const requestLog = new Map();
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const hasServiceKey = Boolean(supabaseServiceKey && !/^your_|^YOUR_|^replace/i.test(supabaseServiceKey));
const supabaseAdmin = supabaseUrl && hasServiceKey ? createClient(supabaseUrl, supabaseServiceKey) : null;
const supabaseAuth = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

const instructions = `You are Aira, the A&G real-estate customer support assistant.
Voice: concise, confident, warm Gen-Z with light playful sass. Never be cruel, discriminatory, sexual, threatening, or insulting. If a user is abusive, set a witty but professional boundary and invite them to restart respectfully. Do not abuse them back.
Use the supplied PROPERTY CATALOGUE as the source of truth for project facts. Never invent price, availability, returns, legal status, or amenities. Say that live price and inventory require confirmation by an A&G advisor. For RERA/legal/financial matters, give general information and recommend official verification. Keep most replies under 90 words. Ask one useful follow-up when needed. For off-topic questions, answer briefly if harmless, then smoothly bring the conversation back to property. Encourage the Contact page for site visits or human help.`;

function json(response, status, body) {
  response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  response.end(JSON.stringify(body));
}

async function readBody(request) {
  let body = '';
  for await (const chunk of request) {
    body += chunk;
    if (body.length > 80_000) throw new Error('Request too large');
  }
  return JSON.parse(body || '{}');
}

function rateLimited(ip) {
  const now = Date.now();
  const recent = (requestLog.get(ip) || []).filter((time) => now - time < 60_000);
  recent.push(now);
  requestLog.set(ip, recent);
  return recent.length > 20;
}

async function chat(request, response) {
  if (!apiKey) return json(response, 503, { error: 'AI is not configured yet.' });
  const ip = request.socket.remoteAddress || 'unknown';
  if (rateLimited(ip)) return json(response, 429, { error: 'Too many messages. Please wait a moment.' });

  try {
    const { messages, catalogue } = await readBody(request);
    if (!Array.isArray(messages) || !messages.length) return json(response, 400, { error: 'A message is required.' });

    const safeMessages = messages.slice(-10).map(({ role, text }) => ({
      role: role === 'assistant' ? 'assistant' : 'user',
      content: String(text || '').slice(0, 1500),
    }));
    const propertyContext = JSON.stringify(Array.isArray(catalogue) ? catalogue.slice(0, 30) : []).slice(0, 30_000);

    const aiResponse = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        instructions: `${instructions}\n\nPROPERTY CATALOGUE:\n${propertyContext}`,
        input: safeMessages,
        max_output_tokens: 220,
        store: false,
      }),
    });
    const result = await aiResponse.json();
    if (!aiResponse.ok) {
      console.error('OpenAI error:', result?.error?.message || aiResponse.statusText);
      return json(response, 502, { error: 'Aira is taking a quick coffee break.' });
    }
    const reply = result.output?.flatMap((item) => item.content || []).find((item) => item.type === 'output_text')?.text;
    if (!reply) return json(response, 502, { error: 'No AI response received.' });
    return json(response, 200, { reply });
  } catch (error) {
    console.error(error);
    return json(response, 400, { error: 'Could not process that message.' });
  }
}

async function requirePortalAdmin(request, response) {
  const token = request.headers.authorization?.replace(/^Bearer\s+/i, '');
  if (!token || !supabaseAuth) { json(response, 503, { error: 'Employee administration needs the Supabase URL and anon key.' }); return null; }
  if (!supabaseAdmin) { json(response, 503, { error: 'Employee administration needs SUPABASE_SERVICE_ROLE_KEY in the server .env file.' }); return null; }
  const { data, error } = await supabaseAuth.auth.getUser(token);
  if (error || !data.user) { json(response, 401, { error: 'Your admin session has expired. Sign in again.' }); return null; }
  const { data: employee } = await supabaseAdmin.from('employee_profiles').select('id').eq('id', data.user.id).maybeSingle();
  if (employee) { json(response, 403, { error: 'Employee accounts cannot access administration.' }); return null; }
  return data.user;
}

async function employeeApi(request, response) {
  const admin = await requirePortalAdmin(request, response);
  if (!admin) return;
  try {
    const body = request.method === 'GET' ? {} : await readBody(request);
    if (request.method === 'GET') {
      const [profiles, tasks, attendance, sales, leaves, notices] = await Promise.all([
        supabaseAdmin.from('employee_profiles').select('*').order('full_name'),
        supabaseAdmin.from('employee_tasks').select('*').order('deadline'),
        supabaseAdmin.from('employee_attendance').select('*').order('attendance_date', { ascending: false }).limit(500),
        supabaseAdmin.from('employee_sales').select('*').order('report_date', { ascending: false }).limit(500),
        supabaseAdmin.from('employee_leaves').select('*').order('created_at', { ascending: false }),
        supabaseAdmin.from('employee_notices').select('*').order('created_at', { ascending: false }),
      ]);
      const failed = [profiles, tasks, attendance, sales, leaves, notices].find((result) => result.error);
      if (failed) return json(response, 400, { error: failed.error.message });
      return json(response, 200, { profiles: profiles.data, tasks: tasks.data, attendance: attendance.data, sales: sales.data, leaves: leaves.data, notices: notices.data });
    }
    if (request.method !== 'POST') return json(response, 405, { error: 'Method not allowed.' });
    if (body.action === 'create-employee') {
      const employeeCode = String(body.employeeCode || '').trim();
      const fullName = String(body.fullName || '').trim();
      const email = String(body.email || '').trim().toLowerCase();
      const password = String(body.password || '');
      if (!employeeCode || !fullName || !email || !password) return json(response, 400, { error: 'Full name, employee ID, email and password are required.' });
      if (password.length < 8) return json(response, 400, { error: 'Temporary password must be at least 8 characters.' });
      const { data: existingProfile, error: existingProfileError } = await supabaseAdmin.from('employee_profiles').select('id').eq('employee_code', employeeCode).maybeSingle();
      if (existingProfileError) return json(response, 400, { error: existingProfileError.message });
      if (existingProfile) return json(response, 409, { error: 'That employee ID is already in use.' });
      const created = await supabaseAdmin.auth.admin.createUser({ email, password, email_confirm: true, app_metadata: { role: 'employee' } });
      if (created.error || !created.data.user) return json(response, 400, { error: created.error?.message || 'Could not create account.' });
      const { data: profile, error } = await supabaseAdmin.from('employee_profiles').insert({ id: created.data.user.id, employee_code: employeeCode, full_name: fullName, email, role: body.role || 'employee', department: String(body.department || 'General').trim() || 'General', phone: String(body.phone || '').trim() }).select('*').single();
      if (error) { await supabaseAdmin.auth.admin.deleteUser(created.data.user.id); return json(response, 400, { error: error.message }); }
      return json(response, 201, { ok: true, profile, employee: { employeeCode, fullName, email, password, portalPath: '/9654322224' } });
    }
    if (body.action === 'update-leave') {
      const { error } = await supabaseAdmin.from('employee_leaves').update({ status: body.status }).eq('id', body.id);
      if (error) return json(response, 400, { error: error.message });
      return json(response, 200, { ok: true });
    }
    if (body.action === 'update-profile') {
      const { error } = await supabaseAdmin.from('employee_profiles').update(body.record).eq('id', body.id);
      if (error) return json(response, 400, { error: error.message });
      return json(response, 200, { ok: true });
    }
    if (body.action === 'update-task') {
      const { error } = await supabaseAdmin.from('employee_tasks').update(body.record).eq('id', body.id);
      if (error) return json(response, 400, { error: error.message });
      return json(response, 200, { ok: true });
    }
    if (body.action === 'delete-task') {
      const { error } = await supabaseAdmin.from('employee_tasks').delete().eq('id', body.id);
      if (error) return json(response, 400, { error: error.message });
      return json(response, 200, { ok: true });
    }
    if (body.action === 'attendance' || body.action === 'sales') {
      const table = body.action === 'attendance' ? 'employee_attendance' : 'employee_sales';
      const conflict = body.action === 'attendance' ? 'employee_id,attendance_date' : 'employee_id,report_date';
      const { error } = await supabaseAdmin.from(table).upsert(body.record, { onConflict: conflict });
      if (error) return json(response, 400, { error: error.message });
      return json(response, 200, { ok: true });
    }
    if (body.action === 'attendance-bulk') {
      const records = Array.isArray(body.records) ? body.records : [];
      if (!records.length) return json(response, 400, { error: 'Add at least one employee attendance record.' });
      if (records.some((record) => !record?.employee_id || !record?.attendance_date || !['present', 'absent', 'half_day', 'leave'].includes(record?.status))) return json(response, 400, { error: 'One or more attendance records are invalid.' });
      const { error } = await supabaseAdmin.from('employee_attendance').upsert(records, { onConflict: 'employee_id,attendance_date' });
      if (error) return json(response, 400, { error: error.message });
      return json(response, 200, { ok: true });
    }
    if (body.action === 'delete-notice') {
      const { error } = await supabaseAdmin.from('employee_notices').delete().eq('id', body.id);
      if (error) return json(response, 400, { error: error.message });
      return json(response, 200, { ok: true });
    }
    const tableByAction = { task: 'employee_tasks', notice: 'employee_notices' };
    const table = tableByAction[body.action];
    if (!table) return json(response, 400, { error: 'Unknown employee action.' });
    const { error } = await supabaseAdmin.from(table).insert(body.record);
    if (error) return json(response, 400, { error: error.message });
    return json(response, 201, { ok: true });
  } catch (error) { console.error(error); return json(response, 400, { error: error instanceof Error ? error.message : 'Employee operation failed.' }); }
}

async function employeeLogin(request, response) {
  if (!supabaseAdmin || !supabaseAuth) return json(response, 503, { error: 'Employee login is not configured.' });
  try {
    const { employeeCode: rawEmployeeCode, password } = await readBody(request);
    const employeeCode = String(rawEmployeeCode || '').trim();
    if (!employeeCode || !password) return json(response, 400, { error: 'Employee ID and password are required.' });
    const { data: profile, error: profileError } = await supabaseAdmin.from('employee_profiles').select('email, active').eq('employee_code', employeeCode).maybeSingle();
    if (profileError || !profile || !profile.active) return json(response, 401, { error: 'Invalid employee ID or password.' });
    const { data, error } = await supabaseAuth.auth.signInWithPassword({ email: profile.email, password });
    if (error || !data.session) return json(response, 401, { error: 'Invalid employee ID or password.' });
    return json(response, 200, { session: { access_token: data.session.access_token, refresh_token: data.session.refresh_token } });
  } catch { return json(response, 400, { error: 'Could not sign in.' }); }
}

const mimeTypes = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif', '.mp4': 'video/mp4' };

createServer(async (request, response) => {
  const url = new URL(request.url || '/', `http://${request.headers.host || 'localhost'}`);
  if (url.pathname === '/api/chat' && request.method === 'POST') return chat(request, response);
  if (url.pathname === '/api/employees' && ['GET', 'POST'].includes(request.method || '')) return employeeApi(request, response);
  if (url.pathname === '/api/employee-login' && request.method === 'POST') return employeeLogin(request, response);
  if (url.pathname === '/api/health') return json(response, 200, { ok: true, aiConfigured: Boolean(apiKey) });

  try {
    const requested = normalize(url.pathname).replace(/^(\.\.[/\\])+/, '');
    let filePath = join(distRoot, requested === '/' ? 'index.html' : requested);
    const info = await stat(filePath).catch(() => null);
    if (!info?.isFile()) filePath = join(distRoot, 'index.html');
    const file = await readFile(filePath);
    response.writeHead(200, { 'Content-Type': `${mimeTypes[extname(filePath)] || 'application/octet-stream'}; charset=utf-8` });
    response.end(file);
  } catch {
    response.writeHead(404);
    response.end('Build the site first with npm run build.');
  }
}).listen(port, () => console.log(`A&G server running at http://localhost:${port}`));
