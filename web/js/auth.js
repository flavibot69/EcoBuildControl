
// 1. SELECCIÓN DE ELEMENTOS (IDs sincronizados con el HTML)

//FIREBASE
import { db } from "./firebaseConfig.js";

import {
  getAuth
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
//Firestore
import {collection} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
const usersCollection = collection(db, "users");
import { doc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { setDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
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

// 2. NAVEGACIÓN ENTRE LOGIN Y REGISTRO
// Verificamos que los elementos existan antes de añadir el evento
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


// 3. LÓGICA DE INICIO DE SESIÓN

// LÓGICA DE REGISTRO
if (formRegister){
    formRegister.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('reg-email').value;
        const pass = document.getElementById('reg-password').value;
        const userRole = document.getElementById('reg-role').value;

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
            const user = userCredential.user;
            

            console.log("USuario creado: ", user.uid);
            const sessionData = {
                email: user.email,
                uid: user.uid,
                role: userRole
            };

            //guardamos el rol en la firestore
            const userDoc = doc(db, "users", user.uid);
            await setDoc(userDoc, {
                role: userRole,
            });

            localStorage.setItem('currentUser', JSON.stringify(sessionData));

            alert("Cuenta creada con éxito");

            window.location.href = 'index.html';
        }catch(error){
            console.error("Error en registro:", error);

            if (loginError) {
                loginError.innerText = "No se pudo crear la cuenta";
            }
        }
    });
}


// LÓGICA DE LOGIN --YA AHORA SI CON FIREBASE 

if (formLogin) {
    formLogin.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const pass = document.getElementById('login-password').value;

        try{
            const userCredential = await signInWithEmailAndPassword(auth, email, pass);
            const user = userCredential.user;
            //agarramos el rol de firestore
            const userDoc = doc(db, "users", userCredential.user.uid);
            const docSnap = await getDoc(userDoc);
            
            const  sessionData = {
                email: user.email,
                uid: user.uid,
                role: ""
            };

            if (docSnap.exists()){
                sessionData.role = docSnap.data().role
            }else{
                sessionData.role = user.email.includes("admin") ? "admin" : "tecnico"
            }
            console.log("El usuario: ", user.email)

            //local storage para roles de mientras
            
            localStorage.setItem('currentUser', JSON.stringify(sessionData));

            //redireccion
            window.location.href = (sessionData.role === 'admin')
            ? 'admin-home.html'
            : 'tech-home.html';

        }catch (error){
            console.error("Error login Firebase:", error);
            if (loginError) {
                loginError.innerText = "Email o contraseña incorrectos";
            }
        }

    });
}


// 5. CERRAR SESIÓN
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    });
}

// 6. PROTECCIÓN DE RUTAS (Evita entrar sin loguearse)
const checkSession = () => {
    const session = JSON.parse(localStorage.getItem('currentUser'));
    console.log("SEsion: ",session);
    const path = window.location.pathname;

    // Si estamos en el Login pero ya hay sesión activa
    if (path.endsWith('index.html') || path.endsWith('/')) {
        if (session) {
            window.location.href = (session.role === 'admin') ? 'admin-home.html' : 'tech-home.html';
        }
    } 
    // Si intentamos entrar a un home sin haber iniciado sesión
    else if (path.includes('-home.html') || path.includes('inventory.html')) {
        if (!session) {
            window.location.href = 'index.html';
        }
    }
};

checkSession();