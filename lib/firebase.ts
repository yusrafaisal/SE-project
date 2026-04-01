// // lib/firebase.ts  ← put this in your /lib folder
// // Replace ALL the values below with your actual Firebase project config
// // Get them from: Firebase Console → Project Settings → Your apps → Web app

// import { initializeApp, getApps } from 'firebase/app'
// import { getAuth } from 'firebase/auth'

// const firebaseConfig = {
//   apiKey:            "YOUR_API_KEY",
//   authDomain:        "YOUR_PROJECT_ID.firebaseapp.com",
//   projectId:         "YOUR_PROJECT_ID",
//   storageBucket:     "YOUR_PROJECT_ID.appspot.com",
//   messagingSenderId: "YOUR_SENDER_ID",
//   appId:             "YOUR_APP_ID",
// }

// // Prevent re-initializing on hot reload (Next.js dev mode)
// const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]

// export const auth = getAuth(app)
// export default app


import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD0sWcMJ6brvy3U5Z8aSVaJTH3UBww-rnQ",
  authDomain: "se-project-c83f0.firebaseapp.com",
  projectId: "se-project-c83f0",
  storageBucket: "se-project-c83f0.firebasestorage.app",
  messagingSenderId: "156825823785",
  appId: "1:156825823785:web:605c7cd57fefc228288a38"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);