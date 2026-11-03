import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, processLock } from '@supabase/supabase-js';

const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const key = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
export const cloudConfigured = Boolean(url && key);

async function fetchWithTimeout(input, options = {}) {
  const controller = new AbortController();
  const cancel = () => controller.abort();
  if (options.signal?.aborted) controller.abort();
  options.signal?.addEventListener('abort', cancel);
  const timer = setTimeout(cancel, 15000);
  try {
    return await fetch(input, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
    options.signal?.removeEventListener('abort', cancel);
  }
}

export const supabase = cloudConfigured ? createClient(url, key, {
  global: { fetch: fetchWithTimeout },
  auth: {
    storage: AsyncStorage, autoRefreshToken: true, persistSession: true,
    detectSessionInUrl: false, lock: processLock,
  },
}) : null;

export function requireSupabase() {
  if (!supabase) throw new Error('Configure a URL e a chave pública do Supabase no arquivo .env e reinicie o Expo.');
  return supabase;
}
