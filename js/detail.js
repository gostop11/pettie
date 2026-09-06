// detail.js - 상세 드로어 (오른쪽 / 모바일 바텀시트)
export function createDetailManager() {
  const drawer = document.getElementById('detail-drawer');
  const overlay = document.getElementById('drawer-overlay');
  const content = document.getElementById('detail-content');
  let current = null;

  function open(conflict) {
    current = conflict;
    content.innerHTML = renderDetail(conflict);
    drawer.classList.add('open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    bindActions(conflict);
  }

  function close() {
    drawer.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    current = null;
  }

  overlay.addEventListener('click', close);
  document.getElementById('detail-close')?.addEventListener('click', close);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });

  return { open, close };
}

function renderDetail(c) {
  return `
    <div class="detail-header">
      <span class="type-badge type-${c.type}">${formatType(c.type)}</span>
      <span class="dim-pill dim-${c.dim}">${c.dim} style</span>
    </div>
    <h2 class="detail-title">${escapeHtml(c.title_en)}</h2>
    
    <section class="detail-section">
      <h4>Why this may happen</h4>
      <p>${escapeHtml(c.why_en)}</p>
    </section>

    <section class="detail-section gentle-box">
      <div class="gentle-icon">🌿</div>
      <div>
        <h4>Many families find it helps</h4>
        <p>${escapeHtml(c.gentle_idea_en)}</p>
      </div>
    </section>

    <section class="detail-section">
      <h4>3 gentle steps</h4>
      <ol class="steps-list">
        ${c.steps_en.map(s => `<li>${escapeHtml(s)}</li>`).join('')}
      </ol>
    </section>

    <section class="detail-section">
      <h4>Tags</h4>
      <div class="card-tags">${c.tags_en.map(t => `<span class="tag">#${escapeHtml(t)}</span>`).join('')}</div>
    </section>

    <div class="detail-actions">
      <h4>Community actions (login required)</h4>
      <p class="action-note">All photos, votes, and edits are linked to user_id in DB. Anonymous not allowed to keep reputation reliable.</p>
      
      <div class="action-grid">
        <button class="action-btn" data-action="upvote">👍 Upvote <span id="upvote-count">0</span></button>
        <button class="action-btn" data-action="downvote">👎 Downvote</button>
        <button class="action-btn" data-action="story">💬 Share story</button>
        <button class="action-btn" data-action="photo">📸 Upload photo (pet_id + photo_url, max 3)</button>
        <button class="action-btn primary" data-action="propose">➕ Propose new conflict</button>
      </div>
      
      <div class="db-info">
        <p>DB: conflicts table has title_en, why_en, gentle_idea_en, steps_en, tags_en, related_dimension</p>
        <p>Expansion: 60 seed → proposals (5 now) → votes → promoted to 61 (1 community promoted)</p>
      </div>
    </div>
  `;
}

function bindActions(conflict) {
  document.querySelectorAll('.action-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.action;
      // auth.js에서 처리 - 로그인 필요 체크
      window.dispatchEvent(new CustomEvent('pettie-action', { detail: { action, conflict } }));
    });
  });
}

function formatType(type) {
  const map = { human_cat: 'Human + Cat', human_dog: 'Human + Dog', cat_cat: 'Cat + Cat', dog_dog: 'Dog + Dog', dog_cat: 'Dog + Cat' };
  return map[type] || type;
}
function escapeHtml(str) { const d=document.createElement('div'); d.textContent=str; return d.innerHTML; }
