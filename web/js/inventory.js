import { requireLogin } from './session.js';

// Solo permitir acceso a admin o técnico
requireLogin(['admin', 'tecnico']);

import { db } from "./firebaseConfig.js";
import {collection} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
const usersCollection = collection(db, "users");
import { doc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { setDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


//ELementos DOM
const cantidadAglutinante = document.getElementById('aglutinante-stock');
const estadoAglutinante = document.getElementById('aglutinante-state');
const cantidadFibra = document.getElementById('fibra-stock');
const estadoFibra = document.getElementById('fibra-state');

// Consultar datos con la bdd
const consultarBD = async (coleccion, id) => {
    try {
        const docRef = doc(db, coleccion, id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()){
            return docSnap.data();
        }else{
            return null;
        }
    } catch(error){
        console.error("Error al consultar", coleccion, id), error;
        return null;
    }
}

function actualizarEstado(elemento, cantidad){
    if (cantidad > 32){
        elemento.innerText = "Óptimo"
        if (elemento.classList.contains('bg-warning')) elemento.classList.remove('bg-warning');
        elemento.classList.add('bg-success');
    }else{
        elemento.innerText = "Revisar"
        if (elemento.classList.contains('bg-success')) elemento.classList.remove('bg-success');
        elemento.classList.add('bg-warning');
    }
}

async function refrescarDatos(){
    let datos = await consultarBD("inventario", "aglutinante");
    if (datos){
        cantidadAglutinante.innerText = datos.cantidad + "kg";
        actualizarEstado(estadoAglutinante, datos.cantidad);
    }else{
        cantidadAglutinante.innerText = "-";
        estadoAglutinante.innerText = "No existe";
        
    }
    datos = await consultarBD("inventario", "fibra");
    if (datos){
        cantidadFibra.innerText = datos.cantidad + "kg";
        actualizarEstado(estadoFibra, datos.cantidad);
    }else{
        cantidadFibra.innerText = "-";
        estadoFibra.innerText = "No existe";
    }
}

refrescarDatos();