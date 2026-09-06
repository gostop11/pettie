// config.js - Keys are NEVER hardcoded here
// 원칙: 키는 외부에 둔다. 소스코드에 직접 적지 않는다.

/**
 * 설정 로드 우선순위:
 * 1. window.__ENV__ (배포시 env.js에서 주입)
 * 2. localStorage (로컬 개발시 개발자가 직접 입력)
 * 3. 빈 값 -> 로컬 JSON fallback으로 동작
 * 
 * .env 파일은 git에 올리지 않음. .env.example 참고
 */

export const config = {
  // Supabase URL: https://your-project.supabase.co
  get supabaseUrl() {
    return window.__ENV__?.SUPABASE_URL 
      || localStorage.getItem('PETTIE_SUPABASE_URL') 
      || '';
  },
  // anon key는 RLS로 보호되므로 프론트에 있어도 되지만 외부 분리 원칙 유지
  get supabaseAnonKey() {
    return window.__ENV__?.SUPABASE_ANON_KEY 
      || localStorage.getItem('PETTIE_SUPABASE_ANON_KEY') 
      || '';
  },
  get isConfigured() {
    return !!(this.supabaseUrl && this.supabaseAnonKey);
  },
  // 개발자용: 로컬에서 키 설정
  setKeys(url, anonKey) {
    if (url) localStorage.setItem('PETTIE_SUPABASE_URL', url);
    if (anonKey) localStorage.setItem('PETTIE_SUPABASE_ANON_KEY', anonKey);
    location.reload();
  },
  clearKeys() {
    localStorage.removeItem('PETTIE_SUPABASE_URL');
    localStorage.removeItem('PETTIE_SUPABASE_ANON_KEY');
    location.reload();
  }
};
