// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDhXBRwsVbeKkQzrg7ku55-CaBqJFI2F2Y",
  authDomain: "cryptoglance-c8cb5.firebaseapp.com",
  projectId: "cryptoglance-c8cb5",
  storageBucket: "cryptoglance-c8cb5.firebasestorage.app",
  messagingSenderId: "299593271972",
  appId: "1:299593271972:web:37c8ca0a2f20c04014f431",
  measurementId: "G-LL37H1DT28",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
