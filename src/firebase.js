// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCRAGQWlxA897l-9tdPWbBoLD-UfdTiDtE",
  authDomain: "portfolioshakya.firebaseapp.com",
  projectId: "portfolioshakya",
  storageBucket: "portfolioshakya.firebasestorage.app",
  messagingSenderId: "497291229290",
  appId: "1:497291229290:web:c7b56c8ac316f920b1b213",
  measurementId: "G-8YRGYYCKZD"
};

// Init Firebase
const app = initializeApp(firebaseConfig);

// Auth
export const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export const loginWithGoogle = () => signInWithPopup(auth, provider);
export const logout = () => signOut(auth);

// Firestore
export const db = getFirestore(app);
