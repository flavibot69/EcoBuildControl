// session.js
export const getSession = () => {
    const session = JSON.parse(localStorage.getItem('currentUser'));
    return session || null;
}

export const requireLogin = (allowedRoles = []) => {
    const session = getSession();
    if (!session || (allowedRoles.length && !allowedRoles.includes(session.role))) {
        // No autorizado, redirigir
        window.location.href = 'index.html';
        return false;
    }
    return true;
}