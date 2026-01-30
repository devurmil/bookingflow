import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAeDqdOlhLcsk6dQKoGYih5z69Pj13qQkg",
    authDomain: "booking-flow-138bb.firebaseapp.com",
    projectId: "booking-flow-138bb",
    storageBucket: "booking-flow-138bb.firebasestorage.app",
    messagingSenderId: "907977686479",
    appId: "1:907977686479:web:b11b4bdd9a510c81a926ba",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);