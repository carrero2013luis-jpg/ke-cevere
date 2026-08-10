/* =========================================================
   Kè Cévere / Sabor Criollo
   JavaScript principale
   ========================================================= */

const CART_KEY = "carrello";
const PROFILE_KEY = "cliente";
const SHIPPING_COST = 5;
const DISCOUNT_KEY = "kecevere_discount";

let carrello = loadCart();

/* ---------- Utilità ---------- */

function loadCart() {
    try {
        const savedCart = JSON.parse(localStorage.getItem(CART_KEY));
        return Array.isArray(savedCart) ? savedCart : [];
    } catch (error) {
        return [];
    }
}

function saveCart() {
    localStorage.setItem(CART_KEY, JSON.stringify(carrello));
}

function formatPrice(value) {
    return new Intl.NumberFormat("it-IT", {
        style: "currency",
        currency: "EUR"
    }).format(value);
}

function escapeHtml(value) {
    const element = document.createElement("div");
    element.textContent = value;
    return element.innerHTML;
}

/* ---------- Navegazione & Sincronizzazione ---------- */

function initNavigation() {
    const toggle = document.querySelector(".nav-toggle");
    const nav = document.querySelector("#main-nav");
    if (!toggle || !nav) return;

    toggle.addEventListener("click", () => {
        const isOpen = nav.classList.toggle("open");
        toggle.setAttribute("aria-expanded", String(isOpen));
        document.body.classList.toggle("menu-open", isOpen);
    });
}

function updateGlobalDiscount() {
    const discountBadge = document.getElementById('global-discount-counter');
    if (discountBadge) {
        const currentDiscount = parseFloat(localStorage.getItem(DISCOUNT_KEY)) || 0.00;
        discountBadge.innerText = formatPrice(currentDiscount);
    }
}

/* ---------- Carrello ---------- */

function updateCartCount() {
    const count = carrello.reduce((total, product) => total + product.quantita, 0);
    document.querySelectorAll(".cart-count").forEach((el) => {
        el.textContent = count;
        el.hidden = count === 0;
    });
}

function showToast(message) {
    let toast = document.querySelector(".toast");
    if (!toast) {
        toast = document.createElement("div");
        toast.className = "toast";
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(showToast.timeout);
    showToast.timeout = setTimeout(() => toast.classList.remove("show"), 2600);
}

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

function initRegistration() {
    const form = document.querySelector("#registro-form");
    form?.addEventListener("submit", (e) => {
        e.preventDefault();
        showToast("Profilo creato!");
    });
}

/* ---------- Inicialización Unificada ---------- */

document.addEventListener("DOMContentLoaded", () => {
    initNavigation();
    initAddToCartButtons();
    updateCartCount();
    renderCart();
    initClearCart();
    initCheckout();
    initRegistration();
    updateGlobalDiscount();

    window.addEventListener('storage', (e) => {
        if (e.key === DISCOUNT_KEY) updateGlobalDiscount();
    });

    // MODO DESARROLLADOR: Bypass intentos de juego
    const todayKey = new Date().toISOString().slice(0, 10);
    localStorage.setItem('kecevere_arcade', JSON.stringify({ date: todayKey, plays: 0 }));
});