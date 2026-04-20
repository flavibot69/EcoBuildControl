// firebaseConfig.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDk2PF_CTLfM61MPKsIkA7r3_4a2MSBjI0",

  authDomain: "ecobuildcontrol-mmds2.firebaseapp.com",

  projectId: "ecobuildcontrol-mmds2",

  storageBucket: "ecobuildcontrol-mmds2.firebasestorage.app",

  messagingSenderId: "161619557628",

};

const app = initializeApp(firebaseConfig);

export default app;
export const db = getFirestore(app);