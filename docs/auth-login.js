// auth-login.js
import { auth } from './auth-config.js';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js';

// Keep your existing behavior: 1 day strict expiry, key name unchanged
const EXPIRY_MS = 24 * 60 * 60 * 1000;
const LAST_LOGIN_KEY = 'dp_last_login_at';

// Default landing page (your current behavior)
const DEFAULT_REDIRECT = './work/indexWK.html';

// DOM
const form = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const msg = document.getElementById('msg');

// ---- helpers ----
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

/**
 * SAFETY: only allow redirects to your private Work HTML pages.
 * - Blocks protocols (https://), protocol-relative (//), javascript:, data:
 * - Forces a "./work/..." relative path
 * - Forces ".html" extension
 */
function sanitizeNext(nextRaw) {
  if (!nextRaw) return null;

  let next = String(nextRaw).trim();
  if (!next) return null;

  // Decode once if needed (avoid throwing on malformed encodings)
  try {
    next = decodeURIComponent(next);
  } catch {
    // keep original string if decode fails
  }

  // Hard blocks
  const lower = next.toLowerCase();
  if (
    lower.includes('://') ||
    lower.startsWith('//') ||
    lower.startsWith('javascript:') ||
    lower.startsWith('data:')
  ) {
    return null;
  }

  // Normalize: allow "work/24pipes.html" -> "./work/24pipes.html"
  if (next.startsWith('work/')) next = `./${next}`;

  // Allowlist: only private work pages (html only)
  // Examples allowed:
  // ./work/indexWK.html
  // ./work/24pipes.html
  // ./work/16canopy.html
  // ./work/12cyber.html
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

// ---- automatic redirect if already signed in & still valid ----
onAuthStateChanged(auth, async (user) => {
  if (!user) return;

  // Signed in but expired → force sign out and stay on login page
  if (isExpired()) {
    try {
      await signOut(auth);
    } catch {}
    clearLastLogin();
    showMessage('Session expired. Please sign in again.');
    return;
  }

  // Signed in + valid → go to requested target (sanitized)
  window.location.replace(getRedirectTarget());
});

// ---- form submit ----
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

    try {
      await signInWithEmailAndPassword(auth, email, password);

      // Keep strict 1-day behavior
      setLastLoginNow();

      // Go where the user intended (or default)
      window.location.replace(getRedirectTarget());
    } catch (err) {
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

// ---- password show/hide (matches your existing markup) ----
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
