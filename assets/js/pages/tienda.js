/* =========================================================
   Kè Cévere — tienda.js
   Filtros y carrito para el catálogo dinámico.
   Las categorías vienen de menu.json y los productos de productos.json.
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
    document.querySelectorAll(".add-to-cart:not([data-cart-ready])").forEach((button) => {
        button.dataset.cartReady = "true";
        button.addEventListener("click", () => {
            addToCart({
                nome: button.dataset.name,
                prezzo: button.dataset.price,
                immagine: button.dataset.image
            });
        });
    });
}

function getQueryFilters() {
    const params = new URLSearchParams(window.location.search);
    return {
        categoria: params.get("categoria") || "tutti",
        sottocategoria: params.get("sottocategoria") || "tutte"
    };
}

function crearFiltroButton(label, categoria, sottocategoria = "tutte", active = false) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `catalog-filter ${active ? "active" : ""}`;
    button.textContent = label;
    button.dataset.categoria = categoria;
    button.dataset.sottocategoria = sottocategoria;
    return button;
}

async function construirFiltros() {
    const container = document.querySelector("#catalog-filters");
    if (!container) return;

    try {
        const response = await fetch(`${APP_ROOT}assets/data/menu.json`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const menu = await response.json();
        const filters = getQueryFilters();

        container.innerHTML = "";
        container.appendChild(crearFiltroButton("Tutti", "tutti", "tutte", filters.categoria === "tutti"));

        menu.categorie.forEach(categoria => {
            container.appendChild(crearFiltroButton(categoria.nome, categoria.slug, "tutte", filters.categoria === categoria.slug && filters.sottocategoria === "tutte"));
            categoria.sottocategorie.forEach(sub => {
                container.appendChild(crearFiltroButton(`↳ ${sub.nome}`, categoria.slug, sub.slug,
                    filters.categoria === categoria.slug && filters.sottocategoria === sub.slug));
            });
        });

        container.addEventListener("click", (event) => {
            const button = event.target.closest("button.catalog-filter");
            if (!button) return;
            const params = new URLSearchParams();
            if (button.dataset.categoria !== "tutti") {
                params.set("categoria", button.dataset.categoria);
                if (button.dataset.sottocategoria !== "tutte") params.set("sottocategoria", button.dataset.sottocategoria);
            }
            const query = params.toString();
            window.history.pushState({}, "", `${window.location.pathname}${query ? `?${query}` : ""}`);
            aplicarFiltros();
        });
    } catch (error) {
        console.error("No se pudo cargar assets/data/menu.json", error);
    }
}

function aplicarFiltros() {
    const grid = document.querySelector("#product-grid");
    const empty = document.querySelector("#catalog-empty");
    if (!grid || !Array.isArray(window.catalogoProductos)) return;

    const { categoria, sottocategoria } = getQueryFilters();
    const productos = window.catalogoProductos.filter(producto => {
        if (categoria !== "tutti" && producto.categoria !== categoria) return false;
        if (sottocategoria !== "tutte" && producto.sottocategoria !== sottocategoria) return false;
        return true;
    });

    grid.innerHTML = "";
    productos.forEach(producto => grid.appendChild(crearTarjetaTienda(producto)));
    initAddToCartButtons();

    if (empty) empty.hidden = productos.length !== 0;

    document.querySelectorAll(".catalog-filter").forEach(button => {
        button.classList.toggle("active", button.dataset.categoria === categoria && button.dataset.sottocategoria === sottocategoria);
    });
}

window.renderizarCatalogo = function(productos) {
    window.catalogoProductos = productos;
    aplicarFiltros();
};

document.addEventListener("DOMContentLoaded", () => {
    construirFiltros();
    window.addEventListener("popstate", aplicarFiltros);
});
