// filters.js - 5개 relationship_type 필터 + 검색
export const RELATIONSHIP_TYPES = [
  { id: 'all', label: 'All', icon: '🐾', count: 60 },
  { id: 'human_cat', label: 'Human + Cat', icon: '🧑‍🦰🐱', short: 'H+Cat' },
  { id: 'human_dog', label: 'Human + Dog', icon: '🧑‍🦰🐶', short: 'H+Dog' },
  { id: 'cat_cat', label: 'Cat + Cat', icon: '🐱🐱', short: 'Cat+Cat' },
  { id: 'dog_dog', label: 'Dog + Dog', icon: '🐶🐶', short: 'Dog+Dog' },
  { id: 'dog_cat', label: 'Dog + Cat', icon: '🐶🐱', short: 'Dog+Cat' },
];

export function createFilterState() {
  return {
    activeType: 'all',
    searchQuery: '',
    setType(type) { this.activeType = type; },
    setSearch(q) { this.searchQuery = q.toLowerCase(); }
  };
}

export function filterConflicts(conflicts, state) {
  return conflicts.filter(c => {
    const typeMatch = state.activeType === 'all' || c.type === state.activeType;
    const searchMatch = !state.searchQuery || 
      c.title_en.toLowerCase().includes(state.searchQuery) ||
      c.why_en.toLowerCase().includes(state.searchQuery) ||
      c.tags_en.join(' ').toLowerCase().includes(state.searchQuery);
    return typeMatch && searchMatch;
  });
}

export function renderFilters(container, state, counts, onChange) {
  const typesWithCounts = RELATIONSHIP_TYPES.map(t => ({
    ...t,
    count: t.id === 'all' ? counts.all || 60 : counts[t.id] || 12
  }));

  container.innerHTML = typesWithCounts.map(t => `
    <button data-type="${t.id}" class="filter-btn ${state.activeType === t.id ? 'active' : ''}">
      <span class="filter-icon">${t.icon}</span>
      <span class="filter-label">${t.label}</span>
      <span class="filter-count">${t.count}</span>
    </button>
  `).join('');

  container.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      state.setType(btn.dataset.type);
      onChange();
      renderFilters(container, state, counts, onChange);
    });
  });
}
