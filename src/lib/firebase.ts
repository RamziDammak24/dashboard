import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDXf1yEhs4mBrcMhaDrIoKLhPjS-CWpzqs",
  authDomain: "patisserie-app-test.firebaseapp.com",
  projectId: "patisserie-app-test",
  storageBucket: "patisserie-app-test.firebasestorage.app",
  messagingSenderId: "1071129609762",
  appId: "1:1071129609762:web:2434a54e4c143477346c7b",
  measurementId: "G-R33C4N3DWS"
};

// Initialize Firebase only if it hasn't been initialized yet
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

export { db };
