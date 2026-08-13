/* =========================================================
   Kè Cévere — productos.js
   Catálogo 100% controlado desde assets/data/productos.json.
   No hace falta crear HTML para cada producto.
   ========================================================= */

function formatPriceEUR(precio) {
    return new Intl.NumberFormat("it-IT", {
        style: "currency",
        currency: "EUR"
    }).format(Number(precio) || 0);
}

function escaparHTML(value = "") {
    const element = document.createElement("div");
    element.textContent = String(value);
    return element.innerHTML;
}

function imagenProducto(producto, root = APP_ROOT) {
    if (producto.imagen) {
        // Mantener exactamente la capitalización del nombre definido en productos.json.
        const rutaImagen = `${root}assets/img/productos/${producto.imagen}`;

        return `
            <div class="card-image">
                <img src="${rutaImagen}"
                     alt="${escaparHTML(producto.nombre)}" loading="lazy">
            </div>`;
    }

    return `
        <div class="card-image card-image-placeholder" aria-label="Foto in arrivo">
            <span>🇻🇪</span>
            <small>Foto in arrivo</small>
        </div>`;
}

function crearTarjetaTienda(producto) {
    const article = document.createElement("article");
    article.className = `card product-card ${producto.disponibile === false ? "is-unavailable" : ""}`;
    article.dataset.id = producto.id;
    article.dataset.categoria = producto.categoria || "";
    article.dataset.sottocategoria = producto.sottocategoria || "";

    const disabled = producto.disponibile === false ? "disabled" : "";
    const buttonText = producto.disponibile === false ? "Prossimamente" : "Aggiungi al Carrello";

    article.innerHTML = `
        ${imagenProducto(producto)}
        <div class="card-body">
            <div class="product-card-topline">
                <span class="product-category-label">${escaparHTML(producto.categoria === "salato" ? "Salato" : "Dolce")}</span>
                ${producto.destacado ? '<span class="product-featured-label">★ Preferito</span>' : ""}
            </div>
            <h2 class="card-title">${escaparHTML(producto.nombre)}</h2>
            <p>${escaparHTML(producto.descripcion)}</p>
            <div class="card-footer">
                <span class="card-price">${formatPriceEUR(producto.precio)}</span>
                <span class="card-info">${escaparHTML(producto.info || "Artigianale")}</span>
            </div>
            <button class="btn card-button add-to-cart" type="button"
                data-name="${escaparHTML(producto.nombre)}"
                data-price="${Number(producto.precio) || 0}"
                data-image="${escaparHTML(producto.imagen || "")}" ${disabled}>
                ${buttonText}
            </button>
        </div>
    `;

    return article;
}

function crearTarjetaDestacada(producto) {
    const article = document.createElement("article");
    article.className = "card";
    article.innerHTML = `
        ${imagenProducto(producto)}
        <div class="card-body">
            <h3 class="card-title">${escaparHTML(producto.nombre)}</h3>
            <p>${escaparHTML(producto.descripcion)}</p>
            <div class="card-footer">
                <span class="card-price">${formatPriceEUR(producto.precio)}</span>
                <span class="card-info">${escaparHTML(producto.info || "Artigianale")}</span>
            </div>
            <a href="${APP_ROOT}pages/tienda.html?prodotto=${encodeURIComponent(producto.id)}" class="btn card-button">Vedi prodotto</a>
        </div>
    `;
    return article;
}

async function cargarProductos() {
    const gridTienda = document.querySelector("#product-grid");
    const gridDestacados = document.querySelector("#featured-grid");
    if (!gridTienda && !gridDestacados) return;

    try {
        const response = await fetch(`${APP_ROOT}assets/data/productos.json`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const productos = await response.json();

        productos.sort((a, b) => (a.ordine ?? 999) - (b.ordine ?? 999));

        if (gridTienda) {
            window.catalogoProductos = productos;
            if (typeof window.renderizarCatalogo === "function") {
                window.renderizarCatalogo(productos);
            } else {
                gridTienda.innerHTML = "";
                productos.forEach(producto => gridTienda.appendChild(crearTarjetaTienda(producto)));
            }

            if (typeof initAddToCartButtons === "function") initAddToCartButtons();
        }

        if (gridDestacados) {
            gridDestacados.innerHTML = "";
            productos.filter(producto => producto.destacado && producto.disponibile !== false)
                .slice(0, 6)
                .forEach(producto => gridDestacados.appendChild(crearTarjetaDestacada(producto)));
        }
    } catch (error) {
        console.error("No se pudo cargar assets/data/productos.json", error);
    }
}

document.addEventListener("DOMContentLoaded", cargarProductos);
