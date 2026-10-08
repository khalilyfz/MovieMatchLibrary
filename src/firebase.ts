// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBPnGXuws2pKkKa3_lHoIO22n1zouOWsy4",
  authDomain: "random-9c302.firebaseapp.com",
  projectId: "random-9c302",
  storageBucket: "random-9c302.firebasestorage.app",
  messagingSenderId: "502174145287",
  appId: "1:502174145287:web:717c88af5017e9dfa583a2",
  measurementId: "G-2EV88SFT6C"
};



// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
