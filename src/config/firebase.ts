import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// REEMPLAZA CON TUS DATOS DE FIREBASE CONSOLE
const firebaseConfig = {
  apiKey: "AIzaSyC5AiAk1NqSN4DDqaXYcJtcEMBw98WZGaE",
  authDomain: "community-events-a77d4.firebaseapp.com",
  projectId: "community-events-a77d4",
  storageBucket: "community-events-a77d4.firebasestorage.app",
  messagingSenderId: "482820004444",
  appId: "1:482820004444:web:e0f3f8cc8e9e8f6de5a499"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);