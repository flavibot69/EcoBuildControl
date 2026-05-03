import { db } from './firebaseConfig.js';
import { collection, onSnapshot, doc, updateDoc, increment } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const tableBody = document.getElementById('inventory-body');
const formSurtir = document.getElementById('form-surtir');

// 1. ESCUCHAR INVENTARIO EN TIEMPO REAL (PB-10)
function startInventoryListener() {
    // Escuchamos la colección "inventario"
    onSnapshot(collection(db, "inventario"), (snapshot) => {
        tableBody.innerHTML = ''; // Limpiamos tabla
        
        snapshot.forEach((doc) => {
            const item = doc.data();
            const id = doc.id; // Puede ser 'fibra' o 'aglutinante'

            let statusBadge = item.cantidad < 10 
                ? '<span class="badge bg-warning text-dark">Stock Bajo</span>' 
                : '<span class="badge bg-success text-white">Disponible</span>';
            
            if(item.cantidad <= 0) statusBadge = '<span class="badge bg-danger text-white">Agotado</span>';

            tableBody.innerHTML += `
                <tr>
                    <td class="p-3"><strong>${item.nombre}</strong></td>
                    <td class="p-3 text-center">${item.cantidad.toFixed(1)} ${item.unidad}</td>
                    <td class="p-3 text-center">${statusBadge}</td>
                    <td class="p-3 text-center">
                        <small class="text-muted">ID: ${id}</small>
                    </td>
                </tr>
            `;
        });
    });
}

// 2. LÓGICA PARA SURTIR (PB-11)
if (formSurtir) {
    formSurtir.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Obtenemos el ID del documento (asegúrate que en el HTML los values coincidan con los IDs de Firebase)
        const tipoId = document.getElementById('add-material-type').value; // 'fibra' o 'aglutinante'
        const cantidadASumar = parseFloat(document.getElementById('add-amount').value);

        try {
            // Referencia al documento en Firebase
            const docRef = doc(db, "inventario", tipoId);
            
            // Actualizamos usando increment() para que Firebase haga la suma solito
            await updateDoc(docRef, {
                cantidad: increment(cantidadASumar)
            });

            // Cerrar el modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('modalAdd'));
            modal.hide();
            formSurtir.reset();
            
        } catch (error) {
            console.error("Error al surtir:", error);
            alert("Error al conectar con la base de datos");
        }
    });
}

// Iniciar proceso
startInventoryListener();