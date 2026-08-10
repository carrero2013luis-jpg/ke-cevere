/* =========================================================
   Kè Cévere / Sabor Criollo
   main.js — Lógica GLOBAL compartida por TODAS las páginas
   (navegación, carrito base, descuento global)
   Se debe cargar en TODAS las páginas, antes de los demás JS.
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

/* ---------- Carrello (base, usado en todas las páginas) ---------- */

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

/* ---------- Inicialización global (corre en TODAS las páginas) ---------- */

document.addEventListener("DOMContentLoaded", () => {
    initNavigation();
    updateCartCount();
    updateGlobalDiscount();

    window.addEventListener('storage', (e) => {
        if (e.key === DISCOUNT_KEY) updateGlobalDiscount();
    });

    // MODO DESARROLLADOR: Bypass intentos de juego
    const todayKey = new Date().toISOString().slice(0, 10);
    localStorage.setItem('kecevere_arcade', JSON.stringify({ date: todayKey, plays: 0 }));
});
