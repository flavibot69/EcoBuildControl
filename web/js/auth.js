// FIREBASE
import { db } from "./firebaseConfig.js";

import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const auth = getAuth();

console.log("Firebase inicializado:", auth);


// SELECCIÓN DE ELEMENTOS DEL DOM
const loginContainer = document.getElementById('login-form');
const registerContainer = document.getElementById('register-form');
const btnGoToRegister = document.getElementById('go-to-register');
const btnGoToLogin = document.getElementById('go-to-login');

const formLogin = document.getElementById('form-login');
const formRegister = document.getElementById('form-register');
const loginError = document.getElementById('login-error');
const logoutBtn = document.getElementById('logout-btn');


// NAVEGACIÓN ENTRE LOGIN Y REGISTRO
if (btnGoToRegister && loginContainer && registerContainer) {
    btnGoToRegister.addEventListener('click', (e) => {
        e.preventDefault();
        loginContainer.classList.add('hidden');
        registerContainer.classList.remove('hidden');
    });
}

if (btnGoToLogin && loginContainer && registerContainer) {
    btnGoToLogin.addEventListener('click', (e) => {
        e.preventDefault();
        registerContainer.classList.add('hidden');
        loginContainer.classList.remove('hidden');
    });
}


// LÓGICA DE REGISTRO
if (formRegister) {
    formRegister.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('reg-email').value;
        const pass = document.getElementById('reg-password').value;
        const userRole = document.getElementById('reg-role').value;

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
            const user = userCredential.user;

            console.log("Usuario creado: ", user.uid);

            const sessionData = {
                email: user.email,
                uid: user.uid,
                role: userRole
            };

            // Guardamos el rol en Firestore
            const userDoc = doc(db, "users", user.uid);
            await setDoc(userDoc, {
                role: userRole,
            });

            localStorage.setItem('currentUser', JSON.stringify(sessionData));
            alert("Cuenta creada con éxito");
            window.location.href = 'index.html';

        } catch (error) {
            console.error("Error en registro:", error);
            if (loginError) {
                loginError.innerText = "No se pudo crear la cuenta";
            }
        }
    });
}


// LÓGICA DE LOGIN
if (formLogin) {
    formLogin.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('login-email').value;
        const pass = document.getElementById('login-password').value;

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, pass);
            const user = userCredential.user;

            // Obtenemos el rol de Firestore
            const userDoc = doc(db, "users", user.uid);
            const docSnap = await getDoc(userDoc);

            const sessionData = {
                email: user.email,
                uid: user.uid,
                role: ""
            };

            if (docSnap.exists()) {
                sessionData.role = docSnap.data().role;
            } else {
                sessionData.role = user.email.includes("admin") ? "admin" : "tecnico";
            }

            console.log("El usuario: ", user.email);
            localStorage.setItem('currentUser', JSON.stringify(sessionData));

            // Redirección según rol
            window.location.href = (sessionData.role === 'admin')
                ? 'admin-home.html'
                : 'tech-home.html';

        } catch (error) {
            console.error("Error login Firebase:", error);
            if (loginError) {
                loginError.innerText = "Email o contraseña incorrectos";
            }
        }
    });
}


// CERRAR SESIÓN
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    });
}


// PROTECCIÓN DE RUTAS
const checkSession = () => {
    const session = JSON.parse(localStorage.getItem('currentUser'));
    console.log("Sesión: ", session);
    const path = window.location.pathname;

    if (path.endsWith('index.html') || path.endsWith('/')) {
        if (session) {
            window.location.href = (session.role === 'admin') ? 'admin-home.html' : 'tech-home.html';
        }
    } else if (path.includes('-home.html') || path.includes('inventory.html')) {
        if (!session) {
            window.location.href = 'index.html';
        }
    }
};

checkSession();