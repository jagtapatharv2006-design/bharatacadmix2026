// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB78ADQwwajQ1-u-bJonnFxk9YD8L1qxWo",
  authDomain: "pinapple-c6017.firebaseapp.com",
  projectId: "pinapple-c6017",
  storageBucket: "pinapple-c6017.firebasestorage.app",
  messagingSenderId: "689951494095",
  appId: "1:689951494095:web:c7661c03a9e327848fccba"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const db= getFirestore(); 
export const auth = getAuth();