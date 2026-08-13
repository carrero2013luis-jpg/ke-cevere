/* =========================================================
   Kè Cévere — utils.js
   Funciones compartidas reutilizables en todo el proyecto
   Se debe cargar ANTES de otros scripts que las dependan
   ========================================================= */

/**
 * Formatea un número a formato de moneda EUR (Italiano)
 * @param {number} value - Valor numérico a formatear
 * @returns {string} Valor formateado (ej: "€25,00")
 */
function formatPrice(value) {
    return new Intl.NumberFormat("it-IT", {
        style: "currency",
        currency: "EUR"
    }).format(Number(value) || 0);
}

/**
 * Escapa caracteres HTML para evitar inyecciones XSS
 * @param {string} value - Texto a escapar
 * @returns {string} HTML escapado seguro
 */
function escapeHtml(value = "") {
    const element = document.createElement("div");
    element.textContent = String(value);
    return element.innerHTML;
}

/**
 * Obtiene la ruta base de la aplicación
 * Lee el atributo data-root de <body> o retorna "./""
 * @returns {string} Ruta base (ej: "../" o "./")
 */
function getAppRoot() {
    return document.body?.dataset.root || "./";
}

/**
 * Genera una URL absoluta relativa al root de la app
 * @param {string} relativePath - Ruta relativa (ej: "pages/tienda.html")
 * @returns {string} URL completa respecto al root
 */
function getAssetPath(relativePath) {
    return getAppRoot() + relativePath;
}

/**
 * Carga datos JSON de manera segura
 * @param {string} url - URL del archivo JSON
 * @returns {Promise<object>} Objeto parseado o {}
 */
async function loadJSON(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error(`Error cargando ${url}:`, error);
        return null;
    }
}

/**
 * Intenta obtener un elemento del DOM con validación
 * @param {string} selector - Selector CSS
 * @returns {Element|null} Elemento encontrado o null
 */
function safeGetElement(selector) {
    try {
        return document.querySelector(selector);
    } catch (error) {
        console.warn(`Selector inválido: ${selector}`, error);
        return null;
    }
}

/**
 * Debounce - retrasa la ejecución de una función
 * Útil para eventos que se disparan múltiples veces (resize, scroll, input)
 * @param {Function} func - Función a ejecutar
 * @param {number} delay - Retraso en ms
 * @returns {Function} Función debounced
 */
function debounce(func, delay = 300) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}
