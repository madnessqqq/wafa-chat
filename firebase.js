import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyD2NSBi2ApKIfTe8V3nKFAzkCryXKWheFQ",
  authDomain: "wafa-chat.firebaseapp.com",
  projectId: "wafa-chat",
  storageBucket: "wafa-chat.firebasestorage.app",
  messagingSenderId: "799178426367",
  appId: "1:799178426367:web:dd292ac10f109de42489ca"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
