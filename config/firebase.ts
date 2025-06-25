import { initializeApp, getApps, getApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAjy2oolM8x5eQp0iQ84cwrTddKsryPKEA",
  authDomain: "kisah-caa77.firebaseapp.com",
  projectId: "kisah-caa77",
  storageBucket: "kisah-caa77.firebasestorage.app",
  messagingSenderId: "726398034876",
  appId: "1:726398034876:web:f1c73d073f6a96f49381b9",
  measurementId: "G-1QKLNPFWSS"
};

// Cegah inisialisasi ganda
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const storage = getStorage(app);
const db = getFirestore(app);

export { app, storage, db };
