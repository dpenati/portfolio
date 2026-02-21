import { auth } from './auth-config.js';
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js';

const form = document.getElementById('loginForm');
const msg = document.getElementById('msg');

const pwInput = document.getElementById('password');
const pwToggle = document.querySelector('.auth-password-toggle');

if (pwInput && pwToggle) {
  pwToggle.addEventListener('click', () => {
    const isHidden = pwInput.type === 'password';
    pwInput.type = isHidden ? 'text' : 'password';

    pwToggle.textContent = isHidden ? 'Hide' : 'Show';
    pwToggle.setAttribute('aria-pressed', String(isHidden));
    pwToggle.setAttribute(
      'aria-label',
      isHidden ? 'Hide password' : 'Show password',
    );
  });
}

onAuthStateChanged(auth, (user) => {
  if (user) window.location.href = './work/indexWK.html';
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  msg.textContent = 'Signing in...';
  try {
    await signInWithEmailAndPassword(
      auth,
      document.getElementById('email').value,
      document.getElementById('password').value,
    );
    try {
      localStorage.setItem('dp_last_login_at', String(Date.now()));
    } catch {}
    window.location.href = './work/indexWK.html';
  } catch (err) {
    msg.textContent = err.code || err.message;
  }
});
