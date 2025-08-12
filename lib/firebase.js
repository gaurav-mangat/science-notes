
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA_4UmVmhji3DG06-EOlwof4ZhKbG4Ayjw",
  authDomain: "science-notes-79d57.firebaseapp.com",
  projectId: "science-notes-79d57",
  storageBucket: "science-notes-79d57.firebasestorage.app",
  messagingSenderId: "320800551670",
  appId: "1:320800551670:web:b849993b7f5237a00472d7",
  // Add these if they're missing from your config:
  // measurementId: "G-XXXXXXXXXX" // Optional: for Analytics
};


const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);