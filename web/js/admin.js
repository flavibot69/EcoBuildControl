// CONFIGURACIÓN DE GRÁFICAS ADMIN (SIMULADAS)
const prodCtx = document.getElementById('prodChart').getContext('2d');
const qualCtx = document.getElementById('qualityChart').getContext('2d');

// 1. Gráfica de Producción (Barras)
new Chart(prodCtx, {
    type: 'bar',
    data: {
        labels: ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'],
        datasets: [{
            label: 'Unidades',
            data: [420, 380, 500, 600, 550, 200, 80],
            backgroundColor: '#795548', // Color Café EcoBuild
            borderRadius: 8
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false }
        }
    }
});

// 2. Gráfica de Calidad (Dona)
new Chart(qualCtx, {
    type: 'doughnut',
    data: {
        labels: ['Aptos', 'No Aptos'],
        datasets: [{
            data: [88, 12],
            backgroundColor: ['#2e7d32', '#c62828'], // Verde y Rojo
            hoverOffset: 10
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false
    }
});