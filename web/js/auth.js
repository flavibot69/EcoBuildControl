// SELECCIÓN DE ELEMENTOS DEL DOM

const loginContainer = document.getElementById('login-form');
const registerContainer = document.getElementById('register-form');
const btnGoToRegister = document.getElementById('go-to-register');
const btnGoToLogin = document.getElementById('go-to-login');

const formLogin = document.getElementById('form-login');
const formRegister = document.getElementById('form-register');
const loginError = document.getElementById('login-error');


// NAVEGACIÓN ENTRE FORMULARIOS

btnGoToRegister.addEventListener('click', (e) => {
    e.preventDefault();
    loginContainer.classList.add('hidden');
    registerContainer.classList.remove('hidden');
    loginError.innerText = ""; // Limpiar errores al cambiar
});

btnGoToLogin.addEventListener('click', (e) => {
    e.preventDefault();
    registerContainer.classList.add('hidden');
    loginContainer.classList.remove('hidden');
});


// LÓGICA DE LOGIN (Punto: Conectar login + Redirección)

formLogin.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('login-email').value;
    const pass = document.getElementById('login-password').value;

    console.log("Iniciando validación para:", email);

    // SIMULACIÓN: Aquí luego conectarás con Firebase signInWithEmailAndPassword
    let userRole = '';

    if (email === "admin@test.com" && pass === "123456") {
        userRole = 'admin';
    } else if (email === "user@test.com" && pass === "123456") {
        userRole = 'user';
    }

    if (userRole) {
        // Guardar sesión en LocalStorage (Simula persistencia de Firebase)
        const sessionData = { 
            email: email, 
            role: userRole,
            token: "fake-jwt-token-123" 
        };
        localStorage.setItem('currentUser', JSON.stringify(sessionData));

        // Redirección por Roles
        if (userRole === 'admin') {
            window.location.href = 'admin.html';
        } else {
            window.location.href = 'dashboard.html';
        }
    } else {
        // Manejo de errores local
        loginError.innerText = "Credenciales inválidas. Usa admin@test.com o user@test.com (Clave: 123456)";
    }
});

// LÓGICA DE REGISTRO (Punto: Guardar usuario en BD)
formRegister.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('reg-email').value;
    const pass = document.getElementById('reg-password').value;
    const role = document.getElementById('reg-role').value;

    // Validación básica de frontend
    if (pass.length < 6) {
        alert("La contraseña debe tener al menos 6 caracteres.");
        return;
    }

    // SIMULACIÓN: Aquí luego conectarás con createUserWithEmailAndPassword
    console.log("Registrando en 'Base de Datos'...", { email, role });

    alert(`¡Cuenta creada con éxito para ${email}! Ahora puedes iniciar sesión.`);
    
    // Resetear y volver al login
    formRegister.reset();
    btnGoToLogin.click();
});


// INICIALIZACIÓN (Protección de ruta inversa)

// Si el usuario ya está logueado y entra al index.html, lo mandamos a su dashboard
const checkExistingSession = () => {
    const session = JSON.parse(localStorage.getItem('currentUser'));
    if (session) {
        if (session.role === 'admin') window.location.href = 'admin.html';
        else window.location.href = 'dashboard.html';
    }
};

checkExistingSession();