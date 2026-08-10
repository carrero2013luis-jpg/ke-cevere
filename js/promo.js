/* =========================================================
   Kè Cévere
   promo.js — Anuncio flotante del giococoin en index.html
   Se muestra solo la primera vez que el visitante abre la página.
   ========================================================= */

const GAME_PROMO_SEEN_KEY = "kecevere_promo_visto";

document.addEventListener("DOMContentLoaded", () => {
    const overlay = document.getElementById("game-promo-overlay");
    const closeBtn = document.getElementById("game-promo-close");
    if (!overlay || !closeBtn) return;

    const yaVisto = localStorage.getItem(GAME_PROMO_SEEN_KEY);

    if (!yaVisto) {
        overlay.hidden = false;
        // pequeño delay para que la animación de entrada se note
        setTimeout(() => {
            overlay.classList.add("show");
        }, 400);
    }

    function closePromo() {
        overlay.classList.remove("show");
        overlay.classList.add("hide");
        localStorage.setItem(GAME_PROMO_SEEN_KEY, "1");
        setTimeout(() => {
            overlay.hidden = true;
        }, 400);
    }

    closeBtn.addEventListener("click", closePromo);

    // cerrar también si el usuario hace click fuera de la tarjeta
    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) closePromo();
    });

    // cerrar con tecla Escape
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && overlay.classList.contains("show")) closePromo();
    });
});
