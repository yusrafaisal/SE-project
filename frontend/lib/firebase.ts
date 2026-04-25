import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD2OzCdVvP_XJwbQmRnw2ef7mQbnqTO230",
  authDomain: "proj-login-2a051.firebaseapp.com",
  projectId: "proj-login-2a051",
  storageBucket: "proj-login-2a051.firebasestorage.app",
  messagingSenderId: "571825739967",
  appId: "1:571825739967:web:02a0a1d44b814015dd4e0a",
  measurementId: "G-EQ8WE56GSQ"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);