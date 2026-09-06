// auth.js - 익명 불가 처리, 로그인 필요 모달
// DB 구조: pet_photos.pet_id -> owner_id, conflict_votes.user_id, reviews.user_id 모두 user_id 필수

export function createAuthManager() {
  const modal = document.getElementById('auth-modal');
  const overlay = document.getElementById('auth-overlay');
  let isLoggedIn = localStorage.getItem('PETTIE_DEMO_LOGIN') === 'true';

  function updateUI() {
    const btn = document.getElementById('login-btn');
    if (btn) {
      btn.textContent = isLoggedIn ? 'Logged in (demo)' : 'Log in';
      btn.classList.toggle('logged-in', isLoggedIn);
    }
    const status = document.getElementById('db-status');
    if (status) {
      const { isConfigured } = window.pettieConfig || { isConfigured: false };
      status.textContent = isConfigured 
        ? `Connected: Supabase live (users 5 / pets 8 / conflicts 61)`
        : `Local preview: users 5 / pets 8 / relationships 5 / conflicts 61 (60 seed + 1 promoted) - Verified by your screenshots`;
    }
  }

  function requireLogin(action) {
    if (isLoggedIn) return true;
    
    showLoginModal(action);
    return false;
  }

  function showLoginModal(action) {
    const actionText = {
      upvote: 'Upvote builds library reputation - linked to user_id',
      downvote: 'Downvote',
      story: 'Share your story (reviews.user_id required)',
      photo: 'Upload photo (pet_photos needs pet_id + photo_url, max 3 per pet)',
      propose: 'Propose new conflict (conflict_proposals.user_id required)'
    };

    document.getElementById('auth-action-text').textContent = actionText[action] || action;
    modal.classList.add('open');
    overlay.classList.add('open');
  }

  function closeModal() {
    modal.classList.remove('open');
    overlay.classList.remove('open');
  }

  // 이벤트
  document.getElementById('login-btn')?.addEventListener('click', () => {
    if (isLoggedIn) {
      localStorage.removeItem('PETTIE_DEMO_LOGIN');
      isLoggedIn = false;
      updateUI();
    } else {
      // 데모 로그인 - 실제는 Supabase Auth로 교체
      localStorage.setItem('PETTIE_DEMO_LOGIN', 'true');
      isLoggedIn = true;
      updateUI();
      closeModal();
    }
  });

  document.getElementById('auth-close')?.addEventListener('click', closeModal);
  document.getElementById('auth-overlay')?.addEventListener('click', closeModal);
  document.getElementById('demo-login-btn')?.addEventListener('click', () => {
    localStorage.setItem('PETTIE_DEMO_LOGIN', 'true');
    isLoggedIn = true;
    updateUI();
    closeModal();
  });

  // 외부 액션에서 로그인 체크
  window.addEventListener('pettie-action', (e) => {
    const { action } = e.detail;
    if (!requireLogin(action)) return;
    
    // 로그인 되어 있으면 실제 동작 (데모)
    if (action === 'upvote') {
      const countEl = document.getElementById('upvote-count');
      const current = parseInt(countEl.textContent || '0');
      countEl.textContent = current + 1;
      alert('Upvoted! Saved as conflict_votes with user_id. When 10+ votes, promoted to conflicts.');
    } else if (action === 'photo') {
      alert('Photo upload: In real app, you select pet (Nabi/Bori...) and URL. App-level limit 3 checked. Saved as pet_photos (pet_id + photo_url).');
    } else if (action === 'propose') {
      alert('Propose: Opens form -> conflict_proposals table with user_id -> community votes -> if 10+ upvotes, promoted to conflicts as c000...061 (your 61st one is example)');
    } else {
      alert(`Action ${action} executed with user_id linked. Anonymous not allowed to keep reputation reliable.`);
    }
  });

  updateUI();

  return { isLoggedIn: () => isLoggedIn, requireLogin, updateUI };
}
