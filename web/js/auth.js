// 1. SELECCIÓN DE ELEMENTOS (IDs sincronizados con el HTML)
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
if (formLogin) {
    formLogin.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const pass = document.getElementById('login-password').value;

        let userRole = '';
        // Credenciales de prueba
        if (email === "admin@test.com" && pass === "123456") {
            userRole = 'admin';
        } else if (email === "tecnico@test.com" && pass === "123456") {
            userRole = 'tecnico';
        }

        if (userRole) {
            const sessionData = { email, role: userRole };
            localStorage.setItem('currentUser', JSON.stringify(sessionData));
            // Redirección según el rol
            window.location.href = (userRole === 'admin') ? 'admin-home.html' : 'tech-home.html';
        } else {
            if(loginError) loginError.innerText = "Error: Credenciales incorrectas.";
        }
    });
}

// 4. LÓGICA DE REGISTRO (Simulado)
if (formRegister) {
    formRegister.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('reg-email').value;
        const role = document.getElementById('reg-role').value;

        alert(`Cuenta creada para: ${email} con rol: ${role}. Ahora puedes iniciar sesión.`);
        
        // Volver al login automáticamente
        registerContainer.classList.add('hidden');
        loginContainer.classList.remove('hidden');
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