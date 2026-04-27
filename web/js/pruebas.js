// SELECCIÓN DE ELEMENTOS
const mpaInput = document.getElementById('mpa-input');
const resContainer = document.getElementById('resultado-container');
const resLabel = document.getElementById('resultado-label');
const formPrueba = document.getElementById('form-prueba');

const qrSection = document.getElementById('qr-result-section');
const qrContainer = document.getElementById('qrcode');
const qrTextInfo = document.getElementById('qr-text-info');

// UMDRAL DE CALIDAD (PB-25)
const MIN_MPA = 10.0;

// 1. VALIDACIÓN VISUAL EN TIEMPO REAL
if (mpaInput) {
    mpaInput.addEventListener('input', () => {
        const valor = parseFloat(mpaInput.value);

        if (!isNaN(valor)) {
            resContainer.classList.remove('d-none');
            
            if (valor >= MIN_MPA) {
                resContainer.style.backgroundColor = "#d4edda"; // Verde Eco-Apto
                resLabel.style.color = "#155724";
                resLabel.innerText = "✅ LOTE APTO";
            } else {
                resContainer.style.backgroundColor = "#f8d7da"; // Rojo Eco-Falla
                resLabel.style.color = "#721c24";
                resLabel.innerText = "❌ NO APTO (Baja Resistencia)";
            }
        } else {
            resContainer.classList.add('d-none');
        }
    });
}

// 2. ENVÍO Y GENERACIÓN DE QR (PB-13)
if (formPrueba) {
    formPrueba.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const lote = document.getElementById('lote-selector').value;
        const mpa = mpaInput.value;
        const esApto = parseFloat(mpa) >= MIN_MPA;

        if (!lote) {
            alert("Por favor selecciona un lote.");
            return;
        }

        // Mostrar sección QR y limpiar anterior
        qrSection.classList.remove('d-none');
        qrContainer.innerHTML = ""; 

        // Datos que irán dentro del QR
        const qrData = {
            id_lote: lote,
            resistencia: mpa + " MPa",
            calidad: esApto ? "APTO" : "RECHAZADO",
            fecha: new Date().toLocaleDateString(),
            empresa: "EcoBuild Control"
        };

        // Crear el QR (Librería QRCode.js)
        new QRCode(qrContainer, {
            text: JSON.stringify(qrData),
            width: 160,
            height: 160,
            colorDark : "#3e2723", // Café EcoBuild
            colorLight : "#ffffff",
            correctLevel : QRCode.CorrectLevel.H
        });

        qrTextInfo.innerText = `Certificado generado para ${lote}`;
        
        // Efecto visual: Scroll suave al QR
        qrSection.scrollIntoView({ behavior: 'smooth' });

        console.log("Prueba registrada localmente:", qrData);
    });
}