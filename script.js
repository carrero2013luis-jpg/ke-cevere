/* =========================================================
   Kè Cévere / Sabor Criollo
   JavaScript principale
   ========================================================= */

const CART_KEY = "carrello";
const PROFILE_KEY = "cliente";
const SHIPPING_COST = 5;

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

/* ---------- Navegazione mobile ---------- */

function initNavigation() {
    const toggle = document.querySelector(".nav-toggle");
    const nav = document.querySelector("#main-nav");

    if (!toggle || !nav) {
        return;
    }

    toggle.addEventListener("click", () => {
        const isOpen = nav.classList.toggle("open");
        toggle.setAttribute("aria-expanded", String(isOpen));
        toggle.setAttribute("aria-label", isOpen ? "Chiudi menu" : "Apri menu");
        document.body.classList.toggle("menu-open", isOpen);
    });

    nav.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            nav.classList.remove("open");
            toggle.setAttribute("aria-expanded", "false");
            toggle.setAttribute("aria-label", "Apri menu");
            document.body.classList.remove("menu-open");
        });
    });
}

/* ---------- Contatore del carrello ---------- */

function updateCartCount() {
    const count = carrello.reduce((total, product) => total + product.quantita, 0);

    document.querySelectorAll(".cart-count").forEach((element) => {
        element.textContent = count;
        element.hidden = count === 0;
    });
}

/* ---------- Notifica ---------- */

function showToast(message) {
    let toast = document.querySelector(".toast");

    if (!toast) {
        toast = document.createElement("div");
        toast.className = "toast";
        toast.setAttribute("role", "status");
        document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(showToast.timeout);
    showToast.timeout = setTimeout(() => {
        toast.classList.remove("show");
    }, 2600);
}

/* ---------- Aggiunta al carrello ---------- */

function addToCart(product) {
    const existingProduct = carrello.find((item) => item.nome === product.nome);

    if (existingProduct) {
        existingProduct.quantita += 1;
    } else {
        carrello.push({
            nome: product.nome,
            prezzo: Number(product.prezzo),
            quantita: 1,
            immagine: product.immagine
        });
    }

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

/* ---------- Render del carrello ---------- */

function renderCart() {
    const container = document.querySelector("#lista-carrello");

    if (!container) {
        return;
    }

    const subtotalElement = document.querySelector("#subtotale-prezzo");
    const shippingElement = document.querySelector("#spedizione-prezzo");
    const totalElement = document.querySelector("#totale-prezzo");
    const checkoutButton = document.querySelector("#completa-ordine");
    const clearButton = document.querySelector("#svuota-carrello");

    if (carrello.length === 0) {
        container.innerHTML = `
            <div class="empty-cart">
                <div class="empty-cart-icon">🛒</div>
                <h3 style="color: var(--secondary); margin-bottom: .35rem;">Il tuo carrello è vuoto</h3>
                <p>Scopri i nostri dolci e aggiungi i tuoi preferiti.</p>
            </div>
        `;

        subtotalElement.textContent = formatPrice(0);
        shippingElement.textContent = formatPrice(0);
        totalElement.textContent = formatPrice(0);

        if (checkoutButton) checkoutButton.disabled = true;
        if (clearButton) clearButton.disabled = true;
        return;
    }

    let subtotal = 0;

    container.innerHTML = carrello.map((product, index) => {
        const lineTotal = product.prezzo * product.quantita;
        subtotal += lineTotal;

        const image = product.immagine || "producto1.jpg";

        return `
            <article class="cart-item">
                <div class="cart-item-image">
                    <img src="${escapeHtml(image)}" alt="${escapeHtml(product.nome)}">
                </div>

                <div>
                    <h3>${escapeHtml(product.nome)}</h3>
                    <p class="cart-item-price">${formatPrice(product.prezzo)} cad.</p>

                    <div class="cart-item-actions">
                        <div class="qty-control" aria-label="Quantità di ${escapeHtml(product.nome)}">
                            <button type="button" class="qty-minus" data-index="${index}" aria-label="Diminuisci quantità">−</button>
                            <span class="qty-value">${product.quantita}</span>
                            <button type="button" class="qty-plus" data-index="${index}" aria-label="Aumenta quantità">+</button>
                        </div>

                        <button type="button" class="cart-remove" data-index="${index}">Rimuovi</button>
                    </div>
                </div>

                <div class="cart-item-total">
                    ${formatPrice(lineTotal)}
                </div>
            </article>
        `;
    }).join("");

    const shipping = SHIPPING_COST;
    const total = subtotal + shipping;

    subtotalElement.textContent = formatPrice(subtotal);
    shippingElement.textContent = formatPrice(shipping);
    totalElement.textContent = formatPrice(total);

    if (checkoutButton) checkoutButton.disabled = false;
    if (clearButton) clearButton.disabled = false;

    container.querySelectorAll(".qty-plus").forEach((button) => {
        button.addEventListener("click", () => changeQuantity(Number(button.dataset.index), 1));
    });

    container.querySelectorAll(".qty-minus").forEach((button) => {
        button.addEventListener("click", () => changeQuantity(Number(button.dataset.index), -1));
    });

    container.querySelectorAll(".cart-remove").forEach((button) => {
        button.addEventListener("click", () => removeProduct(Number(button.dataset.index)));
    });
}

function changeQuantity(index, amount) {
    if (!carrello[index]) {
        return;
    }

    carrello[index].quantita += amount;

    if (carrello[index].quantita <= 0) {
        carrello.splice(index, 1);
    }

    saveCart();
    updateCartCount();
    renderCart();
}

function removeProduct(index) {
    if (!carrello[index]) {
        return;
    }

    const productName = carrello[index].nome;
    carrello.splice(index, 1);

    saveCart();
    updateCartCount();
    renderCart();
    showToast(`${productName} rimosso dal carrello.`);
}

function clearCart() {
    if (carrello.length === 0) {
        return;
    }

    const confirmed = window.confirm("Vuoi davvero svuotare il carrello?");

    if (!confirmed) {
        return;
    }

    carrello = [];
    saveCart();
    updateCartCount();
    renderCart();
    showToast("Carrello svuotato.");
}

/* ---------- Checkout dimostrativo ---------- */

function initCheckout() {
    const button = document.querySelector("#completa-ordine");

    if (!button) {
        return;
    }

    button.addEventListener("click", () => {
        if (carrello.length === 0) {
            showToast("Il carrello è vuoto.");
            return;
        }

        const paymentMethod = document.querySelector("input[name='pago']:checked")?.value || "Carta";

        showToast(`Checkout demo: metodo selezionato ${paymentMethod}.`);
    });
}

function initClearCart() {
    const button = document.querySelector("#svuota-carrello");

    if (button) {
        button.addEventListener("click", clearCart);
    }
}

/* ---------- Account demo ---------- */

function initRegistration() {
    const form = document.querySelector("#registro-form");
    const message = document.querySelector("#registro-messaggio");

    if (!form || !message) {
        return;
    }

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const profile = {
            nome: document.querySelector("#nome").value.trim(),
            email: document.querySelector("#email").value.trim(),
            zona: document.querySelector("#zona").value
        };

        localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));

        message.hidden = false;
        message.textContent = `Grazie ${profile.nome}! Il tuo profilo demo è stato creato correttamente.`;

        form.reset();
        showToast("Profilo creato correttamente.");
    });
}

/* ---------- Inicialización ---------- */

document.addEventListener("DOMContentLoaded", () => {
    initNavigation();
    initAddToCartButtons();
    updateCartCount();
    renderCart();
    initClearCart();
    initCheckout();
    initRegistration();
});
