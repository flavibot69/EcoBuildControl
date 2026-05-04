import { db } from './firebaseConfig.js'; 
import { collection, query, where, onSnapshot, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const loteSelector = document.getElementById('lote-selector');
const formPrueba = document.getElementById('form-prueba');
const mpaInput = document.getElementById('mpa-input');
const absorcionInput = document.getElementById('absorcion-input'); // Asegúrate de que este ID esté en tu HTML
const resultadoContainer = document.getElementById('resultado-container');
const resultadoLabel = document.getElementById('resultado-label');
const qrSection = document.getElementById('qr-result-section');
const qrInfo = document.getElementById('qr-text-info');

// 1. CARGAR LOTES PENDIENTES
const q = query(collection(db, "lotes"), where("estado", "==", "Pendiente"));

onSnapshot(q, (snapshot) => {
    loteSelector.innerHTML = '<option value="">-- Seleccione un lote --</option>';
    snapshot.forEach((doc) => {
        const lote = doc.data();
        const option = document.createElement('option');
        option.value = doc.id;
        option.textContent = `Lote ID: ...${doc.id.slice(-5)} (${lote.cantidad_ladrillos} uds)`;
        loteSelector.appendChild(option);
    });
});

// 2. LÓGICA DE VALIDACIÓN (PB-25)
formPrueba.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const loteId = loteSelector.value;
    const mpa = parseFloat(mpaInput.value);
    const absorcion = parseFloat(absorcionInput.value);
    
    if (!loteId) return alert("Selecciona un lote");

    try {
        // Criterios de Aceptación (PB-25)
        const esAptoResistencia = mpa >= 10; 
        const esAptoAbsorcion = absorcion <= 15;
        
        const esAptoTotal = esAptoResistencia && esAptoAbsorcion;
        const nuevoEstado = esAptoTotal ? "Apto ✅" : "Rechazado ❌";
        const colorClase = esAptoTotal ? "bg-success-subtle text-success" : "bg-danger-subtle text-danger";

        // Actualizar en Firebase (PB-19 y PB-20)
        const loteRef = doc(db, "lotes", loteId);
        await updateDoc(loteRef, {
            resistencia_mpa: mpa,
            absorcion_agua_porcentaje: absorcion,
            estado: nuevoEstado,
            fecha_prueba: new Date()
        });

        // Mostrar resultado visual
        resultadoContainer.className = `p-3 mb-4 rounded-4 text-center ${colorClase}`;
        resultadoLabel.innerText = `RESULTADO: ${nuevoEstado}`;
        resultadoContainer.classList.remove('d-none');

        // Generar QR (PB-13)
        generarEtiquetaQR(loteId, mpa, absorcion, nuevoEstado);

    } catch (error) {
        console.error("Error al registrar prueba:", error);
        alert("Hubo un error al guardar los resultados.");
    }
});

function generarEtiquetaQR(id, mpa, abs, estado) {
    const qrDiv = document.getElementById('qrcode');
    qrDiv.innerHTML = ""; 

    const dataString = `ID: ${id}\nResistencia: ${mpa} MPa\nAbsorcion: ${abs}%\nEstado: ${estado}`;
    
    new QRCode(qrDiv, {
        text: dataString,
        width: 150,
        height: 150,
        colorDark : "#2b4233",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H
    });

    qrInfo.innerText = `Folio: ${id}`;
    qrSection.classList.remove('d-none');
}