import { db } from './firebaseConfig.js';
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const html5QrCode = new Html5Qrcode("reader");
const infoContainer = document.getElementById('info-lote');

const onScanSuccess = async (decodedText) => {
    try {
        // Detener la cámara al detectar el código
        await html5QrCode.stop();
        
        // Extraer el ID (asumiendo formato "ID: id_valor" o "EcoBuild-ID: id_valor")
        const loteId = decodedText.includes("ID: ") 
            ? decodedText.split("ID: ")[1].split("\n")[0].trim() 
            : decodedText.trim();

        // PB-15: Obtener datos completos del ciclo de vida
        const docRef = doc(db, "lotes", loteId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            
            // Llenar la interfaz
            document.getElementById('det-id').innerText = `Lote: ...${loteId.slice(-6)}`;
            document.getElementById('det-estado').innerText = data.estado;
            document.getElementById('det-estado').className = data.estado.includes("Apto") 
                ? "badge bg-success" : "badge bg-danger";
            document.getElementById('det-mpa').innerText = data.resistencia_mpa || "N/A";
            document.getElementById('det-abs').innerText = data.absorcion_agua_porcentaje || "N/A";

            // Mostrar el resultado
            infoContainer.classList.remove('d-none');
        } else {
            alert("❌ El código QR no pertenece a un lote registrado.");
            location.reload();
        }
    } catch (err) {
        console.error("Error al procesar QR:", err);
    }
};

// Iniciar cámara automáticamente (PB-26: Funciona en móvil)
html5QrCode.start(
    { facingMode: "environment" }, 
    { fps: 10, qrbox: 250 }, 
    onScanSuccess
).catch(err => {
    console.error("Error al iniciar cámara:", err);
    alert("No se pudo acceder a la cámara. Asegúrate de dar permisos HTTPS.");
});