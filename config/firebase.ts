import { initializeApp, getApps, getApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDXNKjxyYpvsEVz1sk2vy4bs7hkzfQAh1Q",
  authDomain: "testing-c46b8.firebaseapp.com",
  projectId: "testing-c46b8",
  storageBucket: "testing-c46b8.firebasestorage.app",
  messagingSenderId: "830611207034",
  appId: "1:830611207034:web:91395e8e7cd43070c85cc3",
  measurementId: "G-ZP2NF34QNZ"
};

// Cegah inisialisasi ganda
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const storage = getStorage(app);
const db = getFirestore(app);

export { app, storage, db };
