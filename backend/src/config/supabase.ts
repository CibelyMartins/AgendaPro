import { createClient } from '@supabase/supabase-js';
import { env } from './env.js';

export function getSupabaseClient() {
  if (!env.supabaseUrl || !env.supabaseSecretKey) {
    throw new Error(
      'As variáveis SUPABASE_URL e SUPABASE_SECRET_KEY devem ser configuradas no arquivo .env.',
    );
  }

  return createClient(env.supabaseUrl, env.supabaseSecretKey, {
    auth: { persistSession: false },
  });
}
