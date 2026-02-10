// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBHk0QJYgvkEjysCeLkKHdK4jfclisvgJs",
    authDomain: "valentines-bouquet-e8703.firebaseapp.com",
    projectId: "valentines-bouquet-e8703",
    storageBucket: "valentines-bouquet-e8703.firebasestorage.app",
    messagingSenderId: "809810354634",
    appId: "1:809810354634:web:1708beb6970c408c676f33",
    measurementId: "G-Q8KRGWJHY7"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);