// DATOS INICIALES
let stockData = [
    { id: 1, nombre: "Fibra de Coco", cantidad: 8, unidad: "kg", icon: "🥥" },
    { id: 2, nombre: "Aglutinante", cantidad: 25, unidad: "kg", icon: "🧪" }
];

const tableBody = document.getElementById('inventory-body');
const formSurtir = document.getElementById('form-surtir');

// FUNCIÓN PARA RENDERIZAR LA TABLA (PB-10)
function renderInventory() {
    tableBody.innerHTML = '';
    stockData.forEach(item => {
        let statusBadge = item.cantidad < 10 
            ? '<span class="badge bg-warning text-dark">Stock Bajo</span>' 
            : '<span class="badge bg-success text-white">Disponible</span>';
        
        if(item.cantidad <= 0) statusBadge = '<span class="badge bg-danger text-white">Agotado</span>';

        tableBody.innerHTML += `
            <tr>
                <td class="p-3"><strong>${item.icon} ${item.nombre}</strong></td>
                <td class="p-3 text-center">${item.cantidad} ${item.unidad}</td>
                <td class="p-3 text-center">${statusBadge}</td>
                <td class="p-3 text-center">
                    <button class="btn btn-sm btn-outline-dark opacity-50">Ver Movimientos</button>
                </td>
            </tr>
        `;
    });
}

// LÓGICA PARA SURTIR (PB-11)
if (formSurtir) {
    formSurtir.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const tipo = document.getElementById('add-material-type').value;
        const cantidadASumar = parseFloat(document.getElementById('add-amount').value);

        // Buscar el material y sumar
        const material = stockData.find(m => m.nombre === tipo);
        if (material) {
            material.cantidad += cantidadASumar;
            renderInventory(); // Refrescar tabla
            
            // Cerrar el modal (usando Bootstrap)
            const modal = bootstrap.Modal.getInstance(document.getElementById('modalAdd'));
            modal.hide();
            formSurtir.reset();
        }
    });
}

renderInventory();