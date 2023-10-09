import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyBU_A6R5e4urDiq43e27LMsqlyIYL1xq44",
  authDomain: "school-scanner-18847.firebaseapp.com",
  projectId: "school-scanner-18847",
  storageBucket: "school-scanner-18847.appspot.com",
  messagingSenderId: "564922448060",
  appId: "1:564922448060:web:d27696c868298ad702b8b9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore()

export const storage = getStorage();
