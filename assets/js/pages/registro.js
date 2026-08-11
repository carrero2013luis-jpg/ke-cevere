/* =========================================================
   Kè Cévere / Sabor Criollo
   registro.js — Lógica específica de registrarse.html
   Requiere que js/main.js esté cargado ANTES que este archivo.
   ========================================================= */

function initRegistration() {
    const form = document.querySelector("#registro-form");
    form?.addEventListener("submit", (e) => {
        e.preventDefault();
        showToast("Profilo creato!");
    });
}

/* ---------- Inicialización de la página de registro ---------- */

document.addEventListener("DOMContentLoaded", () => {
    initRegistration();
});
