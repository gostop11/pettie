// data.js - 60개 갈등 데이터 로더 (Supabase 있으면 실시간, 없으면 로컬 JSON)
import { getSupabaseClient } from './supabase-client.js';

let cache = null;

export async function loadConflicts() {
  if (cache) return cache;

  const client = await getSupabaseClient();
  
  if (client) {
    try {
      // 네가 검증한 쿼리: is_seed=true 12개씩 5개 유형
      const { data, error } = await client
        .from('conflicts')
        .select('id, relationship_type, title_en, why_en, gentle_idea_en, steps_en, tags_en, related_dimension, is_seed, view_count')
        .eq('is_seed', true)
        .order('id');

      if (error) throw error;
      if (data && data.length >= 60) {
        // Supabase 데이터를 우리 포맷으로 변환
        cache = data.map(c => ({
          id: c.id,
          type: c.relationship_type,
          title_en: c.title_en,
          why_en: c.why_en,
          gentle_idea_en: c.gentle_idea_en,
          steps_en: c.steps_en || [],
          tags_en: c.tags_en || [],
          dim: c.related_dimension || 'EI'
        }));
        console.log(`Loaded ${cache.length} conflicts from Supabase`);
        return cache;
      }
    } catch (e) {
      console.warn('Supabase load failed, falling back to local JSON:', e.message);
    }
  }

  // Fallback: 로컬 JSON (네가 스크린샷으로 검증한 60개)
  const res = await fetch('./data/conflicts.json');
  const localData = await res.json();
  cache = localData;
  console.log(`Loaded ${cache.length} conflicts from local JSON`);
  return cache;
}

export function getCountsByType(conflicts) {
  const counts = {};
  conflicts.forEach(c => {
    counts[c.type] = (counts[c.type] || 0) + 1;
  });
  return counts;
}
