/* =========================================================
   Kè Cévere — index.js
   GUÍA DE ARQUITECTURA JAVASCRIPT
   
   Este archivo NO se carga directamente en HTML.
   Es una REFERENCIA visual del flujo de módulos y dependencias.
   
   ORDEN DE CARGA CORRECTO (en los HTML):
   =========================================================
   
   1. GLOBAL UTILITIES
      └─ assets/js/utils.js         ✓ Funciones compartidas
   
   2. CORE (carga automáticamente)
      └─ assets/js/core/main.js     ✓ Sistema de carrito, localStorage, etc.
   
   3. COMPONENTES (reutilizables)
      ├─ assets/js/components/menu.js       ✓ Dinámico desde menu.json
      └─ assets/js/components/productos.js  ✓ Dinámico desde productos.json
   
   4. PÁGINAS (específicas de cada ruta)
      ├─ assets/js/pages/tienda.js    ✓ Catálogo y filtros
      ├─ assets/js/pages/carrito.js   ✓ Gestión del carrito
      ├─ assets/js/pages/juego.js     ✓ Arcade giococoin
      ├─ assets/js/pages/promo.js     ✓ Promociones especiales
      ├─ assets/js/pages/registro.js  ✓ Crear cuenta
      └─ assets/js/pages/... (resto)
   
   =========================================================
   
   DIAGRAMA DE DEPENDENCIAS:
   
        ┌─ utils.js (funciones base)
        │
        ├─ main.js (carrito, localStorage, UI base)
        │     │
        │     ├─ menu.js (componente dinámico)
        │     │
        │     └─ productos.js (componente dinámico)
        │           │
        │           └─ tienda.js (página específica)
        │           └─ carrito.js (página específica)
        │           └─ ... (otros)
   
   =========================================================
   
   CONVENCIONES:
   
   • Archivos con guion bajo (_) = Parciales (CSS)
   • Archivos sin guion = Módulos (JS)
   • data/*.json = Datos centralizados (no duplicar)
   • img/productos/ = Assets específicos
   
   =========================================================
   
   VARIABLES GLOBALES DISPONIBLES:
   
   • APP_ROOT          Ruta base ("./" o "../")
   • carrello          Array del carrito (desde localStorage)
   • CART_KEY          Clave de localStorage
   • SHIPPING_COST     €5 (costo de envío)
   • DISCOUNT_KEY      Clave de descuentos
   
   =========================================================
   
   FUNCIONES COMPARTIDAS (desde utils.js):
   
   • formatPrice(valor)           → "€25,00"
   • escapeHtml(texto)            → HTML seguro
   • getAppRoot()                 → "./" o "../"
   • getAssetPath("path")         → Ruta completa
   • loadJSON(url)                → Promise<json>
   • safeGetElement(selector)     → Element|null
   • debounce(func, delay)        → Función retardada
   
   =========================================================
*/
