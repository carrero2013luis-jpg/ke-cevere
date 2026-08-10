/* =========================================================
   Kè Cévere / Sabor Criollo
   carrito.js — Lógica específica de carrito.html
   Requiere que js/main.js esté cargado ANTES que este archivo.
   ========================================================= */

function renderCart() {
    const container = document.querySelector("#lista-carrello");
    if (!container) return;

    const subtotalElement = document.querySelector("#subtotale-prezzo");
    const shippingElement = document.querySelector("#spedizione-prezzo");
    const totalElement = document.querySelector("#totale-prezzo");
    const discount = parseFloat(localStorage.getItem(DISCOUNT_KEY)) || 0;

    let subtotal = carrello.reduce((sum, p) => sum + (p.prezzo * p.quantita), 0);
    const finalTotal = Math.max(0, subtotal + SHIPPING_COST - discount);

    if (carrello.length === 0) {
        container.innerHTML = `<div class="empty-cart"><h3>Il tuo carrello è vuoto</h3></div>`;
        subtotalElement.textContent = formatPrice(0);
        totalElement.textContent = formatPrice(0);
        return;
    }

    container.innerHTML = carrello.map((product, index) => `
        <article class="cart-item">
            <p>${product.nome} - ${product.quantita}x</p>
        </article>
    `).join("");

    subtotalElement.textContent = formatPrice(subtotal);
    totalElement.textContent = formatPrice(finalTotal);
}

function initClearCart() {
    document.querySelector("#svuota-carrello")?.addEventListener("click", () => {
        carrello = [];
        saveCart();
        updateCartCount();
        renderCart();
    });
}

function initCheckout() {
    document.querySelector("#completa-ordine")?.addEventListener("click", () => {
        showToast("Checkout demo completato!");
    });
}

/* ---------- Inicialización de la página carrito ---------- */

document.addEventListener("DOMContentLoaded", () => {
    renderCart();
    initClearCart();
    initCheckout();
});
