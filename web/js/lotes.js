import { db } from './firebaseConfig.js';
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// SELECCIÓN DE ELEMENTOS
const inputCantidad = document.getElementById('cantidad-ladrillos');
const txtFibra = document.getElementById('calc-fibra');
const txtAglutinante = document.getElementById('calc-aglutinante');
const formLote = document.getElementById('form-lote');

// RECETA ESTÁNDAR (PB-06)
const RECETA = { fibra: 0.5, aglutinante: 0.2 };

// --- FUNCIÓN DE CÁLCULO (Liam - PB-07 Visual) ---
if (inputCantidad) {
    inputCantidad.addEventListener('input', () => {
        const cantidad = parseFloat(inputCantidad.value);

        if (!isNaN(cantidad) && cantidad > 0) {
            const necesitaFibra = (cantidad * RECETA.fibra).toFixed(2);
            const necesitaAglu = (cantidad * RECETA.aglutinante).toFixed(2);

            // Actualizamos el texto en el HTML
            txtFibra.innerText = `${necesitaFibra} kg`;
            txtAglutinante.innerText = `${necesitaAglu} kg`;
            
            console.log(`Calculando para ${cantidad} ladrillos: ${necesitaFibra}kg fibra`);
        } else {
            txtFibra.innerText = `0 kg`;
            txtAglutinante.innerText = `0 kg`;
        }
    });
}

// --- GUARDAR EN FIRESTORE (Rafa - PB-09) ---
if (formLote) {
    formLote.addEventListener('submit', async (e) => {
        e.preventDefault();
        const cantidad = parseFloat(inputCantidad.value);

        if (isNaN(cantidad) || cantidad <= 0) {
            alert("Por favor, ingresa una cantidad válida.");
            return;
        }

        try {
            const docRef = await addDoc(collection(db, "lotes"), {
                cantidad_ladrillos: cantidad,
                materiales_usados: {
                    fibra_kg: cantidad * RECETA.fibra,
                    aglutinante_kg: cantidad * RECETA.aglutinante
                },
                fecha_creacion: serverTimestamp(),
                estado: "Pendiente"
            });

            alert("✅ Lote registrado con éxito");
            window.location.href = 'tech-home.html';
        } catch (error) {
            console.error("Error al guardar:", error);
            alert("Hubo un error al conectar con Firebase.");
        }
    });
}