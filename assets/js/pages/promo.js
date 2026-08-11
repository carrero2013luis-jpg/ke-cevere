/* =========================================================
   Kè Cévere
   promo.js — Anuncio flotante del giococoin en index.html
   Se muestra al abrir la página, y luego vuelve a aparecer
   solo después de que pase el tiempo de espera (COOLDOWN_MINUTES).
   Cambiar de pestaña y volver NO lo hace reaparecer antes de tiempo.
   ========================================================= */

const GAME_PROMO_LAST_SHOWN_KEY = "kecevere_promo_ultima_vez";
const GAME_PROMO_COOLDOWN_MINUTES = 30;

document.addEventListener("DOMContentLoaded", () => {
    const overlay = document.getElementById("game-promo-overlay");
    const closeBtn = document.getElementById("game-promo-close");
    if (!overlay || !closeBtn) return;

    const lastShown = parseInt(localStorage.getItem(GAME_PROMO_LAST_SHOWN_KEY), 10) || 0;
    const cooldownMs = GAME_PROMO_COOLDOWN_MINUTES * 60 * 1000;
    const yaPaso = (Date.now() - lastShown) >= cooldownMs;

    if (yaPaso) {
        overlay.hidden = false;
        // pequeño delay para que la animación de entrada se note
        setTimeout(() => {
            overlay.classList.add("show");
        }, 400);
        localStorage.setItem(GAME_PROMO_LAST_SHOWN_KEY, String(Date.now()));
    }

    function closePromo() {
        overlay.classList.remove("show");
        overlay.classList.add("hide");
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
