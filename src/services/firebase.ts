import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

/**
 * Firebase Client SDK Configuration for CampusSoko
 * Values are loaded from Vite environment variables (starting with VITE_)
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyDemoApiKeyForCampusSokoMVP',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'campussoko-udsm.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'campussoko-udsm',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'campussoko-udsm.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '123456789012',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:123456789012:web:abcdef123456',
};

// Initialize Firebase only once
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
