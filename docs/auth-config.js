import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js';

// Paste your Firebase config here (from Firebase console -> Web app)
const firebaseConfig = {
  apiKey: 'AIzaSyBUZzQwgo_j1-eL6p3jiq_gSAOxBSUjHQk',
  authDomain: 'myportfolio-f9b16.firebaseapp.com',
  projectId: 'myportfolio-f9b16',
  appId: '1:288033050147:web:358ae22b206e46cfd82b96',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
