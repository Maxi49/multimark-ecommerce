import 'server-only';
import { createClient } from '@supabase/supabase-js';

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is not set`);
  }
  return value;
}

const supabaseUrl = requireEnv('SUPABASE_URL');
const supabaseKey = requireEnv('SUPABASE_ANON_KEY');

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
});
