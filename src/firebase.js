// firebase.js
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBR5Mh285XrFaSKqm2HmpMMmrZSerWL7xQ",
  authDomain: "final-year-project-d0a57.firebaseapp.com",
  projectId: "final-year-project-d0a57",
  storageBucket: "final-year-project-d0a57.appspot.com", // corrected domain
  messagingSenderId: "939945129633",
  appId: "1:939945129633:web:a91115d6891ac41f76e2e0",
  measurementId: "G-ERNZR495TJ"
};

// Initialize Firebase app
const firebaseApp = firebase.initializeApp(firebaseConfig);

// Exports
const db = firebaseApp.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { auth, provider };
export default db;
