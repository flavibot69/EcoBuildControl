import { crearLote } from "./lotes.js";

const form = document.getElementById("formLote");

if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const fibra = parseInt(document.getElementById("fibra").value);
    const aglutinante = parseInt(document.getElementById("aglutinante").value);

    crearLote(fibra, aglutinante);
  });
}