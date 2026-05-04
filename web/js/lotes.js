import { db } from './firebaseConfig.js'; // Ruta corregida a tu archivo actual
import { collection, addDoc, serverTimestamp, doc, updateDoc, increment } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// SELECCIÓN DE ELEMENTOS (Asegúrate que estos IDs existan en tu HTML)
const inputCantidad = document.getElementById('cantidad-ladrillos');
const txtFibra = document.getElementById('calc-fibra');
const txtAglutinante = document.getElementById('calc-aglutinante');
const formLote = document.getElementById('form-lote');

// RECETA ESTÁNDAR (PB-06)
const RECETA = { fibra: 0.5, aglutinante: 0.2 };

// --- 1. CÁLCULO EN TIEMPO REAL (PB-07) ---
if (inputCantidad) {
    inputCantidad.addEventListener('input', () => {
        const cantidad = parseFloat(inputCantidad.value);

        if (!isNaN(cantidad) && cantidad > 0) {
            const necesitaFibra = (cantidad * RECETA.fibra).toFixed(2);
            const necesitaAglu = (cantidad * RECETA.aglutinante).toFixed(2);

            txtFibra.innerText = `${necesitaFibra} kg`;
            txtAglutinante.innerText = `${necesitaAglu} kg`;
        } else {
            txtFibra.innerText = `0 kg`;
            txtAglutinante.innerText = `0 kg`;
        }
    });
}

// --- 2. GUARDAR EN FIRESTORE Y DESCONTAR STOCK (PB-09 y PB-11) ---
if (formLote) {
    formLote.addEventListener('submit', async (e) => {
        e.preventDefault();
        const cantidad = parseFloat(inputCantidad.value);

        if (isNaN(cantidad) || cantidad <= 0) {
            alert("⚠️ Por favor, ingresa una cantidad válida.");
            return;
        }

        // Calculamos cuánto vamos a descontar
        const gastoFibra = cantidad * RECETA.fibra;
        const gastoAglu = cantidad * RECETA.aglutinante;

        try {
            // A. CREAR EL LOTE EN LA COLECCIÓN "LOTES"
            const docRef = await addDoc(collection(db, "lotes"), {
                cantidad_ladrillos: cantidad,
                materiales_usados: {
                    fibra_kg: gastoFibra,
                    aglutinante_kg: gastoAglu
                },
                fecha_creacion: serverTimestamp(),
                estado: "Pendiente" // Pendiente de prueba de resistencia
            });

            // B. ACTUALIZAR INVENTARIO (RESTAMOS LO USADO)
            // Usamos increment con valor negativo para restar
            const fibraRef = doc(db, "inventario", "fibra");
            const agluRef = doc(db, "inventario", "aglutinante");

            await updateDoc(fibraRef, {
                cantidad: increment(-gastoFibra)
            });

            await updateDoc(agluRef, {
                cantidad: increment(-gastoAglu)
            });

            alert(`✅ Lote registrado. Se descontaron ${gastoFibra}kg de fibra y ${gastoAglu}kg de aglutinante.`);
            window.location.href = 'tech-home.html';

        } catch (error) {
            console.error("Error en la operación:", error);
            alert("❌ Hubo un error al procesar el lote. Revisa la consola.");
        }
    });
}