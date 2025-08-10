// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCYwxxcABau-T4Te4rya6noQ7P61FO_STk",
  authDomain: "friendsbook-ab9e8.firebaseapp.com",
  projectId: "friendsbook-ab9e8",
  storageBucket: "friendsbook-ab9e8.firebasestorage.app",
  messagingSenderId: "704597068080",
  appId: "1:704597068080:web:7bc30a3905dc7f1bd8a0f5",
  measurementId: "G-CDQJ9ND964"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);
// const analytics = getAnalytics(app);

// ✅ Make `messaging` available globally
window.messaging = messaging;



export { messaging, getToken, onMessage };