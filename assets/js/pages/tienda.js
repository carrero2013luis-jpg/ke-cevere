/* =========================================================
   Kè Cévere / Sabor Criollo
   tienda.js — Lógica específica de tienda.html (agregar al carrito)
   Requiere que js/main.js esté cargado ANTES que este archivo.
   ========================================================= */

function addToCart(product) {
    const existing = carrello.find((item) => item.nome === product.nome);
    if (existing) existing.quantita += 1;
    else carrello.push({ ...product, prezzo: Number(product.prezzo), quantita: 1 });

    saveCart();
    updateCartCount();
    showToast(`${product.nome} aggiunto al carrello! 🍰`);
}

function initAddToCartButtons() {
    document.querySelectorAll(".add-to-cart").forEach((button) => {
        button.addEventListener("click", () => {
            addToCart({
                nome: button.dataset.name,
                prezzo: button.dataset.price,
                immagine: button.dataset.image
            });
        });
    });
}

/* ---------- Inicialización de la página tienda ---------- */

document.addEventListener("DOMContentLoaded", () => {
    initAddToCartButtons();
});
