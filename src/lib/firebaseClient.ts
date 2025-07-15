import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAPg7G0QumifGQmMJGTlToNUrw0epPL4X8",
  authDomain: "chine-ton-usine-2c999.firebaseapp.com",
  projectId: "chine-ton-usine-2c999",
  storageBucket: "chine-ton-usine-2c999.firebasestorage.app",
  messagingSenderId: "528021984213",
  appId: "1:528021984213:web:9d5e249e7c6c2ddcd1635c",
  measurementId: "G-23BQZPXP86"
};

if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  throw new Error('Missing Firebase environment variables');
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Firebase Storage and get a reference to the service
export const storage = getStorage(app);

// Initialize Analytics (optional, only in production)
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export default app; 