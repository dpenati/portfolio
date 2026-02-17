import { auth } from './auth-config.js';
import {
  onAuthStateChanged,
  signOut,
} from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js';

const who = document.getElementById('who');
const content = document.getElementById('content');
const logoutBtn = document.getElementById('logout');

onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = '../login.html';
    return;
  }
  who.textContent = `Signed in as: ${user.email}`;
  content.style.display = 'block';
});

logoutBtn.addEventListener('click', async () => {
  await signOut(auth);
  window.location.href = '../login.html';
});
