// Firebase v9 Modular SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut,
  deleteUser,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBoGc0XcBdL-dwTx5jUdblUXGcf1vVXDTc",
  authDomain: "shadowbank-portfolio.firebaseapp.com",
  projectId: "shadowbank-portfolio",
  storageBucket: "shadowbank-portfolio.firebasestorage.app",
  messagingSenderId: "573639582706",
  appId: "1:573639582706:web:263b0c56d9e35abe0fc16b"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const provider = new GoogleAuthProvider();

export {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut,
  deleteUser,
  onAuthStateChanged,
  signInWithPopup,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion
};
