// auth-login.js
import { auth } from './auth-config.js';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js';

const EXPIRY_MS = 24 * 60 * 60 * 1000;
const LAST_LOGIN_KEY = 'dp_last_login_at';
const DEFAULT_REDIRECT = './work/indexWK.html';

const form = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const msg = document.getElementById('msg');

let loginInProgress = false;

function showMessage(text) {
  if (!msg) return;
  msg.textContent = text || '';
}

function setLastLoginNow() {
  try {
    localStorage.setItem(LAST_LOGIN_KEY, String(Date.now()));
  } catch {}
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

function sanitizeNext(nextRaw) {
  if (!nextRaw) return null;

  let next = String(nextRaw).trim();
  if (!next) return null;

  try {
    next = decodeURIComponent(next);
  } catch {}

  const lower = next.toLowerCase();
  if (
    lower.includes('://') ||
    lower.startsWith('//') ||
    lower.startsWith('javascript:') ||
    lower.startsWith('data:')
  ) {
    return null;
  }

  if (next.startsWith('work/')) next = `./${next}`;

  const allowed = /^\.\/work\/[a-zA-Z0-9_-]+\.html$/;
  if (!allowed.test(next)) return null;

  return next;
}

function getNextParam() {
  try {
    const url = new URL(window.location.href);
    return url.searchParams.get('next');
  } catch {
    return null;
  }
}

function getRedirectTarget() {
  const raw = getNextParam();
  const safe = sanitizeNext(raw);
  return safe || DEFAULT_REDIRECT;
}

onAuthStateChanged(auth, async (user) => {
  if (!user) return;

  // Important: do not run expiry enforcement while a login submit is happening
  if (loginInProgress) return;

  if (isExpired()) {
    try {
      await signOut(auth);
    } catch {}
    clearLastLogin();
    showMessage('Session expired. Please sign in again.');
    return;
  }

  window.location.replace(getRedirectTarget());
});

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    showMessage('');

    const email = (emailInput?.value || '').trim();
    const password = passwordInput?.value || '';

    if (!email || !password) {
      showMessage('Please enter email and password.');
      return;
    }

    loginInProgress = true;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setLastLoginNow();
      window.location.replace(getRedirectTarget());
    } catch (err) {
      loginInProgress = false;

      const code = err?.code || '';
      if (code.includes('auth/invalid-credential')) {
        showMessage('Invalid email or password.');
      } else if (code.includes('auth/too-many-requests')) {
        showMessage('Too many attempts. Try again later.');
      } else {
        showMessage('Sign-in failed. Please try again.');
      }
      console.log(err);
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.auth-password-toggle');
  if (!toggle || !passwordInput) return;

  toggle.addEventListener('click', () => {
    const isHidden = passwordInput.type === 'password';
    passwordInput.type = isHidden ? 'text' : 'password';

    toggle.textContent = isHidden ? 'Hide' : 'Show';
    toggle.setAttribute('aria-pressed', isHidden ? 'true' : 'false');
    toggle.setAttribute(
      'aria-label',
      isHidden ? 'Hide password' : 'Show password',
    );
  });
});
