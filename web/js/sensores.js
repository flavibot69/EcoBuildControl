// CONFIGURACIÓN DE GRÁFICAS
const envCtx = document.getElementById('envChart').getContext('2d');
const loadCtx = document.getElementById('loadChart').getContext('2d');

// 1. Gráfica Ambiental (Tiempo Real)
const envChart = new Chart(envCtx, {
    type: 'line',
    data: {
        labels: [], 
        datasets: [{
            label: 'Temperatura (°C)',
            data: [],
            borderColor: '#ff5722',
            backgroundColor: 'rgba(255, 87, 34, 0.1)',
            fill: true,
            tension: 0.4
        }, {
            label: 'Humedad (%)',
            data: [],
            borderColor: '#03a9f4',
            backgroundColor: 'rgba(3, 169, 244, 0.1)',
            fill: true,
            tension: 0.4
        }]
    },
    options: { 
        responsive: true, 
        maintainAspectRatio: false,
        animation: false, // Desactivado para evitar saltos visuales
        scales: {
            y: { beginAtZero: false }
        }
    }
});

// 2. Gráfica de Carga (Comparativa)
const loadChart = new Chart(loadCtx, {
    type: 'bar',
    data: {
        labels: ['Lote Anterior', 'Promedio Diario', 'Lote Actual'],
        datasets: [{
            label: 'Carga Máxima (kN)',
            data: [120, 110, 0],
            backgroundColor: ['#a1887f', '#d7ccc8', '#795548'],
            borderRadius: 8
        }]
    },
    options: { 
        responsive: true, 
        maintainAspectRatio: false,
        scales: {
            y: { beginAtZero: true, max: 200 }
        }
    }
});

// FUNCIÓN DE ACTUALIZACIÓN (Simulación PB-16 y PB-18)
function updateSensors() {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    
    // Simular valores que vendrían de los sensores
    const temp = (23 + Math.random() * 2).toFixed(1);
    const hum = (58 + Math.random() * 4).toFixed(1);
    const pressure = Math.floor(Math.random() * 160); // Valor de 0 a 160 kN

    // --- MANEJO DE DATOS (Scroll de la gráfica) ---
    const MAX_PUNTOS = 12; // Muestra solo los últimos 12 registros
    
    if (envChart.data.labels.length >= MAX_PUNTOS) {
        envChart.data.labels.shift();
        envChart.data.datasets[0].data.shift();
        envChart.data.datasets[1].data.shift();
    }
    
    envChart.data.labels.push(now);
    envChart.data.datasets[0].data.push(temp);
    envChart.data.datasets[1].data.push(hum);
    envChart.update();

    // Actualizar barra del Lote Actual
    loadChart.data.datasets[0].data[2] = pressure;
    loadChart.update();

    // --- ACTUALIZAR UI (PB-25) ---
    const pressureDisplay = document.getElementById('current-pressure');
    const statusLabel = document.getElementById('batch-status');

    if (pressureDisplay) pressureDisplay.innerText = pressure.toFixed(1);

    if (statusLabel) {
        if (pressure >= 100) {
            statusLabel.innerText = "✅ APTO";
            statusLabel.style.color = "#2e7d32"; // Verde oscuro
        } else if (pressure > 60) {
            statusLabel.innerText = "⚠️ EN PROCESO";
            statusLabel.style.color = "#f9a825"; // Amarillo/Naranja
        } else {
            statusLabel.innerText = "❌ NO APTO";
            statusLabel.style.color = "#c62828"; // Rojo oscuro
        }
    }
}

// Intervalo de 2 segundos (PB-18)
const sensorInterval = setInterval(updateSensors, 2000);

// Ejecutar al cargar para no esperar los 2 seg iniciales
updateSensors();