// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDTrKn8D_rQj1SKyafW2ezhCzqvCJpLRxY",
  authDomain: "testburger-3c134.firebaseapp.com",
  databaseURL: "https://testburger-3c134-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "testburger-3c134",
  storageBucket: "testburger-3c134.firebasestorage.app",
  messagingSenderId: "1094242539708",
  appId: "1:1094242539708:web:8d82efff51a005302898b9",
  measurementId: "G-NF06JRX6D4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db };
