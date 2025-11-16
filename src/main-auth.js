import { onAuthenticationChanged, signInWithGoogle, signOutUser } from './firebase-auth.js';

const playerAuthContainer = document.getElementById('player-auth-container');

/**
 * 更新使用者介面 (UI)
 * @param {User|null} user - Firebase 的使用者物件，如果未登入則為 null
 */
function updateUserUI(user) {
  // 如果頁面上沒有這個容器，就直接返回
  if (!playerAuthContainer) return;
  
  // 清空容器
  playerAuthContainer.innerHTML = '';

  if (user) {
    // 使用者已登入
    playerAuthContainer.innerHTML = `
      <div class="player-profile">
        <img src="${user.photoURL}" alt="${user.displayName}" class="player-avatar">
        <span class="player-name">${user.displayName}</span>
      </div>
      <button id="sign-out-btn" class="auth-button">登出</button>
    `;
    // 為登出按鈕加上事件監聽器
    document.getElementById('sign-out-btn').addEventListener('click', signOutUser);
  } else {
    // 使用者未登入
    playerAuthContainer.innerHTML = `
      <button id="sign-in-btn" class="auth-button">使用 Google 登入</button>
    `;
    // 為登入按鈕加上事件監聽器
    document.getElementById('sign-in-btn').addEventListener('click', signInWithGoogle);
  }
}

// 監聽驗證狀態的變化
onAuthenticationChanged(user => {
  // 更新 UI
  updateUserUI(user);

  // 處理跳轉邏輯
  if (user) {
    // 如果用戶已登入，且當前頁面不是 index.html，則跳轉
    if (window.location.pathname.indexOf('index.html') === -1 && window.location.pathname.indexOf('main.html') > -1) {
      window.location.href = 'index.html';
    }
  }
});
