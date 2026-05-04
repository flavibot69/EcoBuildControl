import { db } from './firebaseConfig.js';
import { collection, onSnapshot, addDoc, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const userForm = document.getElementById('user-form');
const tableBody = document.getElementById('user-table-body');

// 1. LISTAR USUARIOS DE LA COLECCIÓN "users" (PB-05)
onSnapshot(collection(db, "users"), (snapshot) => {
    tableBody.innerHTML = ''; 
    
    if (snapshot.empty) {
        tableBody.innerHTML = '<tr><td colspan="3" class="text-center text-muted">No hay usuarios en la colección "users"</td></tr>';
        return;
    }

    snapshot.forEach((userDoc) => {
        const user = userDoc.data();
        const id = userDoc.id;
        
        // Usamos user.email y user.role (asegúrate que así se llamen los campos en tu Firestore)
        const row = `
            <tr>
                <td>${user.email || 'Sin email'}</td>
                <td><span class="badge bg-secondary">${user.role || 'sin-rol'}</span></td>
                <td class="text-end">
                    <button class="btn btn-sm btn-outline-danger btn-borrar" data-id="${id}">
                        Eliminar
                    </button>
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });

    // Re-asignar eventos de eliminar
    document.querySelectorAll('.btn-borrar').forEach(boton => {
        boton.addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            eliminarUsuario(id);
        });
    });
});

// 2. REGISTRAR EN LA COLECCIÓN "users" (PB-04)
userForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('user-email').value;
    const role = document.getElementById('user-role').value;

    try {
        await addDoc(collection(db, "users"), {
            email: email,
            role: role,
            fecha_registro: new Date()
        });
        alert("Usuario agregado a la colección 'users'.");
        userForm.reset();
    } catch (error) {
        console.error("Error al guardar:", error);
        alert("Error al guardar en Firestore.");
    }
});

// 3. ELIMINAR DE "users" (PB-05)
async function eliminarUsuario(id) {
    if (confirm("¿Eliminar este usuario de la base de datos?")) {
        try {
            await deleteDoc(doc(db, "users", id));
            alert("Usuario eliminado.");
        } catch (error) {
            console.error("Error al eliminar:", error);
        }
    }
}