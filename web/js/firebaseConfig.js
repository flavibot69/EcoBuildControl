// js/firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyDk2PF_CTLfM61MPKsIkA7r3_4a2MSBjI0",
    authDomain: "ecobuildcontrol-mmds2.firebaseapp.com",
    projectId: "ecobuildcontrol-mmds2",
    storageBucket: "ecobuildcontrol-mmds2.firebasestorage.app",
    messagingSenderId: "161619557628",
    appId: "1:161619557628:web:069439a62a683bfff1ab79",
    measurementId: "G-TY0HPGFLLD"
};

// Inicializamos
const app = initializeApp(firebaseConfig);

// EXPORTAMOS para que otros archivos los usen
export const db = getFirestore(app);
export const auth = getAuth(app);