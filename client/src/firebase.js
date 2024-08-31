// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "bupt-mern-blog.firebaseapp.com",
  projectId: "bupt-mern-blog",
  storageBucket: "bupt-mern-blog.appspot.com",
  messagingSenderId: "336766565209",
  appId: "1:336766565209:web:dc8eceb614065d0313ea48",
  measurementId: "G-3YWZTDJCT3"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);