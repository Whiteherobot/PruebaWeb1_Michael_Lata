import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAbSmjsZveAxoBeKQ11LZij9Oy8oCSg-U8",
  authDomain: "prueba1-michael-lata.firebaseapp.com",
  projectId: "prueba1-michael-lata",
  storageBucket: "prueba1-michael-lata.firebasestorage.app",
  messagingSenderId: "1093457790896",
  appId: "1:1093457790896:web:133af2d7c7c559f58f3875",
  measurementId: "G-K23850YMDY"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);