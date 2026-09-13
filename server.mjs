import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

const port = Number(process.env.PORT || 8787);
const apiKey = process.env.OPENAI_API_KEY;
const model = process.env.OPENAI_MODEL || 'gpt-5-mini';
const distRoot = join(process.cwd(), 'dist');
const requestLog = new Map();

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

const mimeTypes = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif', '.mp4': 'video/mp4' };

createServer(async (request, response) => {
  const url = new URL(request.url || '/', `http://${request.headers.host || 'localhost'}`);
  if (url.pathname === '/api/chat' && request.method === 'POST') return chat(request, response);
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
