import { createClient } from '@supabase/supabase-js';

export default async function handler(request, response) {
  response.setHeader('Cache-Control', 'no-store');
  if (request.method !== 'POST') return response.status(405).json({ error: 'Method not allowed.' });

  const expectedEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const url = process.env.VITE_SUPABASE_URL;
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!expectedEmail || !url || !anonKey || !serviceKey) return response.status(503).json({ error: 'Configure ADMIN_EMAIL and server-side Supabase credentials before admin bootstrap.' });

  const token = request.headers.authorization?.replace(/^Bearer\s+/i, '');
  if (!token) return response.status(401).json({ error: 'Sign in first.' });

  const authClient = createClient(url, anonKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const adminClient = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data, error } = await authClient.auth.getUser(token);
  if (error || !data.user) return response.status(401).json({ error: 'Your session is invalid. Sign in again.' });
  if (data.user.email?.trim().toLowerCase() !== expectedEmail) return response.status(403).json({ error: 'This account is not authorized for the blog dashboard.' });
  if (data.user.app_metadata?.role === 'admin') return response.status(200).json({ authorized: true });

  const { error: updateError } = await adminClient.auth.admin.updateUserById(data.user.id, {
    app_metadata: { ...data.user.app_metadata, role: 'admin' },
  });
  if (updateError) return response.status(500).json({ error: 'Could not grant the configured administrator role.' });
  return response.status(200).json({ authorized: true });
}
