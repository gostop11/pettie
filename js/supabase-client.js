// supabase-client.js - Supabase 연결, 키는 config.js에서만 가져옴
import { config } from './config.js';

let supabaseClient = null;

export async function getSupabaseClient() {
  if (!config.isConfigured) {
    console.log('Supabase not configured - using local JSON fallback (data/conflicts.json)');
    return null;
  }

  if (supabaseClient) return supabaseClient;

  // CDN에서 supabase-js 로드 (Vanilla JS 방식)
  if (!window.supabase) {
    await loadSupabaseScript();
  }

  supabaseClient = window.supabase.createClient(config.supabaseUrl, config.supabaseAnonKey);
  return supabaseClient;
}

function loadSupabaseScript() {
  return new Promise((resolve, reject) => {
    if (document.querySelector('script[data-supabase]')) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
    script.dataset.supabase = 'true';
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

export async function testConnection() {
  const client = await getSupabaseClient();
  if (!client) return { connected: false, reason: 'local-fallback' };
  
  try {
    const { count, error } = await client.from('conflicts').select('*', { count: 'exact', head: true }).eq('is_seed', true);
    if (error) throw error;
    return { connected: true, count };
  } catch (e) {
    return { connected: false, reason: e.message };
  }
}
