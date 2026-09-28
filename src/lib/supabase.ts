import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

// Fallback to example values for development/demo purposes
const fallbackUrl = 'https://miihavdmvvfthivkdimz.supabase.co';
const fallbackKey = 'sb_publishable_iftKO98ItmyarrCgNyR7xA_9LKDVEsC';

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createClient(fallbackUrl, fallbackKey);

export const supabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
