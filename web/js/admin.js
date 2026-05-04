import { db } from './firebaseConfig.js';
import { collection, onSnapshot, query, orderBy, limit } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

let qualityChartInstance;
let prodChartInstance;
let datosLotes = []; // Para el reporte PDF

// --- ESCUCHA DE DATOS ---
const q = query(collection(db, "lotes"), orderBy("fecha_creacion", "desc"));

onSnapshot(q, (snapshot) => {
    let countAptos = 0;
    let countRechazados = 0;
    let labelsProgreso = [];
    let valoresProgreso = [];
    datosLotes = [];

    snapshot.forEach((doc) => {
        const data = doc.data();
        datosLotes.push({ id: doc.id, ...data });

        if (data.estado === "Apto ✅") countAptos++;
        if (data.estado === "Rechazado ❌") countRechazados++;

        if (data.fecha_creacion) {
            labelsProgreso.push(data.fecha_creacion.toDate().toLocaleDateString());
            valoresProgreso.push(data.cantidad_ladrillos || 0);
        }
    });

    document.getElementById('total-lotes').innerText = snapshot.size;
    updateQualityChart(countAptos, countRechazados);
    updateProdChart(labelsProgreso.slice(0,7).reverse(), valoresProgreso.slice(0,7).reverse());
});

// --- FUNCIÓN DESCARGAR PDF (PB-23) ---
document.getElementById('btn-descargar-reporte')?.addEventListener('click', () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("EcoBuild - Reporte de Calidad y Producción", 20, 20);
    doc.setFontSize(10);
    doc.text(`Fecha: ${new Date().toLocaleString()}`, 20, 30);

    const filas = datosLotes.map(l => [
        l.id.slice(-5), 
        l.cantidad_ladrillos, 
        l.resistencia_mpa || 'N/A', 
        l.estado
    ]);

    doc.autoTable({
        startY: 40,
        head: [['ID', 'Cantidad', 'Resistencia (MPa)', 'Estado']],
        body: filas,
        theme: 'striped',
        headStyles: { fillColor: [43, 66, 51] }
    });

    doc.save("Reporte_EcoBuild.pdf");
});

// --- FUNCIONES DE GRÁFICAS ---
function updateQualityChart(aptos, rechazados) {
    const ctx = document.getElementById('qualityChart');
    if (!ctx) return;
    if (qualityChartInstance) qualityChartInstance.destroy();
    qualityChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Aptos', 'Rechazados'],
            datasets: [{ data: [aptos, rechazados], backgroundColor: ['#2b4233', '#dc3545'] }]
        }
    });
}

function updateProdChart(labels, valores) {
    const ctx = document.getElementById('prodChart');
    if (!ctx) return;
    if (prodChartInstance) prodChartInstance.destroy();
    prodChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{ label: 'Ladrillos', data: valores, backgroundColor: '#6c757d' }]
        }
    });
}