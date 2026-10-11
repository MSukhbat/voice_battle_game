import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBngR0iiAxjcsNpCfAZwBjK7LLwrU3ETGk",
  authDomain: "voice-battle-ba99d.firebaseapp.com",
  projectId: "voice-battle-ba99d",
  storageBucket: "voice-battle-ba99d.firebasestorage.app",
  messagingSenderId: "536637674317",
  appId: "1:536637674317:web:f139117cbb501a7e8b9d04",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
