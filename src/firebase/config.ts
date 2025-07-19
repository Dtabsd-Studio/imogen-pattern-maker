import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  setPersistence, 
  browserLocalPersistence,
  type Auth
} from 'firebase/auth';
import { 
  getFirestore, 
  type Firestore,
  enableIndexedDbPersistence,
  CACHE_SIZE_UNLIMITED
} from 'firebase/firestore';
import { 
  getStorage, 
  type FirebaseStorage 
} from 'firebase/storage';
import { 
  getAnalytics, 
  isSupported, 
  type Analytics 
} from 'firebase/analytics';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAT8gwrMuqJNh1eUxPyUo27b451jSPwJfQ",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "imogen-ai-studio.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "imogen-ai-studio",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "imogen-ai-studio.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1094550334243",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1094550334243:web:9ffde69a3a327b11853a96",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-5XRRKDD6J3"
};

// Initialize Firebase
const app: FirebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);
const storage: FirebaseStorage = getStorage(app);

// Set auth persistence
setPersistence(auth, browserLocalPersistence)
  .catch((error) => {
    console.error("Error setting auth persistence:", error);
  });

// Enable offline persistence for Firestore
if (typeof window !== 'undefined') {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn("Multiple tabs open, persistence can only be enabled in one tab at a time.");
    } else if (err.code === 'unimplemented') {
      console.warn("The current browser doesn't support all of the features required to enable persistence.");
    }
  });
}

// Initialize Analytics
let analytics: Analytics | null = null;
if (typeof window !== 'undefined') {
  isSupported().then(yes => {
    if (yes) {
      analytics = getAnalytics(app);
    }
  });
}

export { app, auth, db, storage, analytics };
