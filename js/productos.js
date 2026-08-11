/* =========================================================
   Kè Cévere
   productos.js — Carga el catálogo desde data/productos.json
   y genera las tarjetas de producto automáticamente.

   Se usa en DOS páginas:
   - tienda.html  → pinta TODOS los productos (contenedor #product-grid)
   - index.html   → pinta solo los "destacado": true (contenedor #featured-grid)

   Para agregar un producto nuevo, NO se toca este archivo:
   solo se agrega un objeto nuevo en data/productos.json
   ========================================================= */

function formatPriceEUR(precio) {
    return new Intl.NumberFormat("it-IT", {
        style: "currency",
        currency: "EUR"
    }).format(precio);
}

function crearTarjetaTienda(producto) {
    const article = document.createElement("article");
    article.className = "card";

    article.innerHTML = `
        <div class="card-image">
            <img src="img/productos/${producto.imagen}" alt="${producto.nombre}" loading="lazy">
        </div>
        <div class="card-body">
            <h2 class="card-title">${producto.nombre}</h2>
            <p>${producto.descripcion}</p>
            <div class="card-footer">
                <span class="card-price">${formatPriceEUR(producto.precio)}</span>
                <span class="card-info">${producto.info}</span>
            </div>
            <button class="btn card-button add-to-cart" type="button"
                data-name="${producto.nombre}"
                data-price="${producto.precio}"
                data-image="${producto.imagen}">
                Aggiungi al Carrello
            </button>
        </div>
    `;

    return article;
}

function crearTarjetaDestacada(producto) {
    const article = document.createElement("article");
    article.className = "card";

    article.innerHTML = `
        <div class="card-image">
            <img src="img/productos/${producto.imagen}" alt="${producto.nombre}" loading="lazy">
        </div>
        <div class="card-body">
            <h3 class="card-title">${producto.nombre}</h3>
            <div class="card-footer">
                <span class="card-price">${formatPriceEUR(producto.precio)}</span>
                <span class="card-info">${producto.info}</span>
            </div>
            <a href="tienda.html" class="btn card-button">Vedi prodotto</a>
        </div>
    `;

    return article;
}

async function cargarProductos() {
    const gridTienda = document.querySelector("#product-grid");
    const gridDestacados = document.querySelector("#featured-grid");

    if (!gridTienda && !gridDestacados) return;

    try {
        const response = await fetch("data/productos.json");
        const productos = await response.json();

        if (gridTienda) {
            gridTienda.innerHTML = "";
            productos.forEach((producto) => {
                gridTienda.appendChild(crearTarjetaTienda(producto));
            });

            // Los botones "Aggiungi al Carrello" se acaban de crear:
            // le avisamos a tienda.js que vuelva a engancharlos.
            if (typeof initAddToCartButtons === "function") {
                initAddToCartButtons();
            }
        }

        if (gridDestacados) {
            gridDestacados.innerHTML = "";
            productos
                .filter((producto) => producto.destacado)
                .forEach((producto) => {
                    gridDestacados.appendChild(crearTarjetaDestacada(producto));
                });
        }

    } catch (error) {
        console.error("No se pudo cargar data/productos.json", error);
    }
}

document.addEventListener("DOMContentLoaded", cargarProductos);
