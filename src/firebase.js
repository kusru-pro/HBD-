// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBMvl7Q5fL3QJHYOzZ2t_s14ubLz2cZ7Dc",
  authDomain: "hbdd-b8dbb.firebaseapp.com",
  projectId: "hbdd-b8dbb",
  storageBucket: "hbdd-b8dbb.firebasestorage.app",
  messagingSenderId: "238254837014",
  appId: "1:238254837014:web:c99d2f392f5973a764d437",
  measurementId: "G-7DXPM8677E"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore database for real-time cloud sync
export const db = getFirestore(app);

// Initialize Analytics (supported only in browser contexts)
export let analytics = null;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch(() => {});
}

export default app;
