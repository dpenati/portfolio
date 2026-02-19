import { auth } from './auth-config.js';
import {
  onAuthStateChanged,
  signOut,
} from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js';

const who = document.getElementById('who');
const content = document.getElementById('content');
const logoutBtn = document.getElementById('logout');

window.addEventListener('pageshow', () => {
  // If the page was restored from the back-forward cache, keep it hidden
  // until auth state is confirmed again.
  document.documentElement.classList.add('auth-pending');
});

onAuthStateChanged(auth, (user) => {
  console.log('USer --> ', user);
  if (!user) {
    window.location.replace('../login.html');
    return;
  }

  document.documentElement.classList.remove('auth-pending');
  who.textContent = `Signed in as: ${user.email}`;
  content.style.display = 'block';
});

logoutBtn.addEventListener('click', async () => {
  await signOut(auth);
  window.location.replace('../login.html');
});
