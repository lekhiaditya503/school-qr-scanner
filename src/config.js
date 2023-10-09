// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBx1_bbCCkrmPE0hEOmEBZaOweTUsQg5pk",
  authDomain: "ihfcscanner.firebaseapp.com",
  projectId: "ihfcscanner",
  storageBucket: "ihfcscanner.appspot.com",
  messagingSenderId: "538210762650",
  appId: "1:538210762650:web:00482bc25b9b6a8efa4423"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const db = getFirestore();

