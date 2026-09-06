// cards.js - 갈등 카드 컴포넌트 (한 카드 = 한 기능)
export function renderCards(container, conflicts, onSelect) {
  if (conflicts.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <p>No conflicts found for this filter.</p>
        <p class="empty-sub">Try "All" or search for guest, walk, bed</p>
      </div>
    `;
    return;
  }

  container.innerHTML = conflicts.map(c => `
    <article class="conflict-card" data-id="${c.id}" tabindex="0">
      <div class="card-top">
        <span class="type-badge type-${c.type}">${formatType(c.type)}</span>
        <span class="dim-pill dim-${c.dim}">${c.dim}</span>
      </div>
      <h3 class="card-title">${escapeHtml(c.title_en)}</h3>
      <p class="card-why">${escapeHtml(truncate(c.why_en, 100))}</p>
      <div class="card-tags">
        ${c.tags_en.slice(0,3).map(t => `<span class="tag">#${escapeHtml(t)}</span>`).join('')}
      </div>
      <div class="card-footer">
        <span class="card-steps">${c.steps_en.length} gentle steps</span>
        <span class="card-arrow">→</span>
      </div>
    </article>
  `).join('');

  container.querySelectorAll('.conflict-card').forEach(card => {
    card.addEventListener('click', () => onSelect(card.dataset.id));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') onSelect(card.dataset.id);
    });
  });
}

function formatType(type) {
  const map = {
    human_cat: 'Human + Cat',
    human_dog: 'Human + Dog',
    cat_cat: 'Cat + Cat',
    dog_dog: 'Dog + Dog',
    dog_cat: 'Dog + Cat'
  };
  return map[type] || type;
}

function truncate(str, len) {
  return str.length > len ? str.slice(0, len) + '…' : str;
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
