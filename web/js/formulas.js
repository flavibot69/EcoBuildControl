// DATOS INICIALES (Simulando la base de datos)
let formulas = [
    { id: 1, nombre: "Mezcla Estándar", fibra: 0.15, aglutinante: 0.25, activa: true },
    { id: 2, nombre: "Reforzado Coco+", fibra: 0.25, aglutinante: 0.30, activa: false }
];

const container = document.getElementById('formulas-container');
const form = document.getElementById('form-formula');

function renderFormulas() {
    container.innerHTML = '';
    formulas.forEach(f => {
        container.innerHTML += `
            <div class="col-12 col-md-6 mb-4">
                <div class="auth-card p-4 shadow-sm border-0 ${f.activa ? 'border-start border-success border-4' : ''}">
                    <div class="d-flex justify-content-between align-items-start mb-3">
                        <h5 class="fw-bold mb-0">${f.nombre} ${f.activa ? '✅' : ''}</h5>
                        <span class="badge ${f.activa ? 'bg-success' : 'bg-secondary'}">${f.activa ? 'Activa' : 'Inactiva'}</span>
                    </div>
                    <div class="row text-center bg-light rounded-3 py-3 mb-3">
                        <div class="col-6">
                            <small class="text-muted d-block">Fibra de Coco</small>
                            <span class="fw-bold">${f.fibra} kg/u</span>
                        </div>
                        <div class="col-6">
                            <small class="text-muted d-block">Aglutinante</small>
                            <span class="fw-bold">${f.aglutinante} kg/u</span>
                        </div>
                    </div>
                    <button class="btn btn-sm btn-outline-dark w-100" onclick="alert('Función para editar próximamente')">Editar Proporciones</button>
                </div>
            </div>
        `;
    });
}

if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const nueva = {
            id: formulas.length + 1,
            nombre: document.getElementById('formula-name').value,
            fibra: document.getElementById('fibra-ratio').value,
            aglutinante: document.getElementById('aglutinante-ratio').value,
            activa: false
        };
        formulas.push(nueva);
        renderFormulas();
        bootstrap.Modal.getInstance(document.getElementById('modalFormula')).hide();
        form.reset();
    });
}

renderFormulas();