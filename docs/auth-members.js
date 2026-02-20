import { auth } from './auth-config.js';
import {
  onAuthStateChanged,
  signOut,
} from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js';

/**
 * auth-members.js
 * Guard protected pages (e.g., /work/indexWK.html).
 *
 * Important: This file may run on pages that do NOT have header auth UI elements.
 * So we must null-check optional DOM nodes.
 */

const who = document.getElementById('who');
const content = document.getElementById('content');
const logoutBtn = document.getElementById('logout');

// Keep page hidden while we re-confirm auth (helps with back/forward cache restores)
window.addEventListener('pageshow', () => {
  document.documentElement.classList.add('auth-pending');
});

onAuthStateChanged(auth, async (user) => {
  // If not signed in, send to root login
  if (!user) {
    window.location.replace('../login.html');
    return;
  }

// Enforce re-auth after 1 day (app-level session expiry)
const KEY_LAST = 'dp_last_login_at';
const MAX_AGE_MS = 24 * 60 * 60 * 1000; // 1 day
let last = 0;
try {
  last = Number(localStorage.getItem(KEY_LAST) || 0);
} catch {}
const expired = !last || Date.now() - last > MAX_AGE_MS;

if (expired) {
  // Force a fresh credential entry
  try {
    await signOut(auth);
  } catch {}
  try {
    localStorage.removeItem(KEY_LAST);
  } catch {}
  const loginUrl = window.location.pathname.includes('/work/') ? '../login.html' : './login.html';
  window.location.replace(loginUrl);
  return;
}

  // Signed in: reveal page
  document.documentElement.classList.remove('auth-pending');

  // Optional UI wiring (only if elements exist on this page)
  if (who) who.textContent = `Signed in as: ${user.email}`;
  if (content) content.style.display = 'block';
});

// Logout button is optional; only bind if present
if (logoutBtn) {
  logoutBtn.addEventListener('click', async () => {
    await signOut(auth);
    window.location.replace('../login.html');
  });
}
