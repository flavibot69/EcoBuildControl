// SELECCIÓN DE ELEMENTOS DEL DOM
const loginContainer = document.getElementById('login-form');
const registerContainer = document.getElementById('register-form');
const btnGoToRegister = document.getElementById('go-to-register');
const btnGoToLogin = document.getElementById('go-to-login');

const formLogin = document.getElementById('form-login');
const formRegister = document.getElementById('form-register');
const loginError = document.getElementById('login-error');

// --- NUEVO: Capturar el botón de logout ---
// Usamos querySelector porque puede haber uno en cada página
const logoutBtn = document.getElementById('logout-btn');

// NAVEGACIÓN ENTRE FORMULARIOS
if (btnGoToRegister) {
    btnGoToRegister.addEventListener('click', (e) => {
        e.preventDefault();
        loginContainer.classList.add('hidden');
        registerContainer.classList.remove('hidden');
        if(loginError) loginError.innerText = "";
    });
}

if (btnGoToLogin) {
    btnGoToLogin.addEventListener('click', (e) => {
        e.preventDefault();
        registerContainer.classList.add('hidden');
        loginContainer.classList.remove('hidden');
    });
}

// LÓGICA DE LOGIN
if (formLogin) {
    formLogin.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const pass = document.getElementById('login-password').value;

        let userRole = '';
        if (email === "admin@test.com" && pass === "123456") {
            userRole = 'admin';
        } else if (email === "tecnico@test.com" && pass === "123456") {
            userRole = 'tecnico';
        }

        if (userRole) {
            const sessionData = { email, role: userRole };
            localStorage.setItem('currentUser', JSON.stringify(sessionData));

            // REDIRECCIÓN A LAS NUEVAS PÁGINAS HOME
            window.location.href = (userRole === 'admin') ? 'admin-home.html' : 'tech-home.html';
        } else {
            if(loginError) loginError.innerText = "Error: Usa admin@test.com o tecnico@test.com";
        }
    });
}

// --- LÓGICA DE CERRAR SESIÓN (LOGOUT) ---
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('currentUser'); // Borramos la sesión
        window.location.href = 'index.html';    // Pa' fuera al login
    });
}

// INICIALIZACIÓN Y PROTECCIÓN DE RUTAS
const checkExistingSession = () => {
    const session = JSON.parse(localStorage.getItem('currentUser'));
    const path = window.location.pathname;

    // Si estamos en el Login pero ya tenemos sesión, saltamos al home
    if (path.endsWith('index.html') || path.endsWith('/')) {
        if (session) {
            window.location.href = (session.role === 'admin') ? 'admin-home.html' : 'tech-home.html';
        }
    } 
    // Si estamos en un Home pero NO hay sesión, mandamos al Login
    else if (path.includes('-home.html')) {
        if (!session) {
            window.location.href = 'index.html';
        }
    }
};

checkExistingSession();