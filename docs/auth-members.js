// auth-members.js
import { auth } from './auth-config.js';
import {
  onAuthStateChanged,
  signOut,
} from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js';

// Keep your existing behavior: 1 day strict expiry, key name unchanged
const EXPIRY_MS = 24 * 60 * 60 * 1000;
const LAST_LOGIN_KEY = 'dp_last_login_at';

// DOM used by your private templates
const who = document.getElementById('who');
const content = document.getElementById('content');
const logoutBtn = document.getElementById('logout');

// Keep the loader behavior your indexWK.html expects.
// pageshow also covers Safari back/forward cache restores.
window.addEventListener('pageshow', () => {
  document.documentElement.classList.add('auth-pending');
});

// ---- helpers ----
function log(...args) {
  // Flip to false if you ever want to silence these.
  const DEBUG = true;
  if (DEBUG) console.log('[auth-members]', ...args);
}

function clearLastLogin() {
  try {
    localStorage.removeItem(LAST_LOGIN_KEY);
  } catch {}
}

function isExpired() {
  try {
    const raw = localStorage.getItem(LAST_LOGIN_KEY);
    if (!raw) return true;

    const ts = Number(raw);
    if (!Number.isFinite(ts)) return true;

    return Date.now() - ts > EXPIRY_MS;
  } catch {
    return true;
  }
}

function revealPrivateContent(user) {
  document.documentElement.classList.remove('auth-pending');

  if (who && user?.email) who.textContent = `Signed in as: ${user.email}`;
  if (content) content.style.display = 'block';
}

function buildNextFromCurrentPage() {
  // Convert current path to a repo-relative "next" like:
  // ./work/indexWK.html or ./work/24pipes.html
  const path = window.location.pathname;
  const workIdx = path.indexOf('/work/');
  if (workIdx !== -1) return `.${path.slice(workIdx)}`;
  return './work/indexWK.html';
}

/**
 * SAFETY: Keep next restricted to ./work/*.html
 * (matches the allowlist in auth-login.js)
 */
function sanitizeNext(next) {
  if (!next || typeof next !== 'string') return './work/indexWK.html';

  const trimmed = next.trim();
  const allowed = /^\.\/work\/[a-zA-Z0-9_-]+\.html$/;
  return allowed.test(trimmed) ? trimmed : './work/indexWK.html';
}

function redirectToLoginPreserveNext(reason) {
  const next = sanitizeNext(buildNextFromCurrentPage());
  const url = `../login.html?next=${encodeURIComponent(next)}`;

  log(`${reason} → redirecting to login`, { next });
  window.location.replace(url);
}

// ---- auth gate ----
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    redirectToLoginPreserveNext('no-user');
    return;
  }

  if (isExpired()) {
    log('session-expired → signing out');
    try {
      await signOut(auth);
    } catch (e) {
      log('signOut error (ignored)', e);
    }
    clearLastLogin();
    redirectToLoginPreserveNext('expired');
    return;
  }

  log('auth-ok');
  revealPrivateContent(user);
});

// ---- logout ----
if (logoutBtn) {
  logoutBtn.addEventListener('click', async () => {
    log('manual-logout');
    try {
      await signOut(auth);
    } catch (e) {
      log('signOut error (ignored)', e);
    }
    clearLastLogin();
    window.location.replace('../login.html');
  });
}
