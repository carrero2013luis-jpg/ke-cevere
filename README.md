# Kè Cévere / Sabor Criollo — versión profesional

Esta versión está construida sobre la estructura y contenido del proyecto original, pero con una capa de diseño y funcionalidad más profesional.

## Cambios principales

### Diseño
- Sistema visual centralizado en `css/estilos.css`.
- Variables de color, sombras, radios y tamaños.
- Componentes reutilizables para botones, tarjetas, formularios, paneles y footer.
- Diseño responsive para escritorio, tablet y móvil.
- Navegación móvil con menú desplegable.
- Mejor jerarquía visual y espaciado.
- Estados hover y focus.
- Soporte para `prefers-reduced-motion`.

### Carrito
- Añadir productos sin `onclick` inline.
- Aumentar/disminuir cantidades.
- Eliminar productos.
- Vaciar carrito con confirmación.
- Imágenes de producto.
- Subtotal, envío y total.
- Contador del carrito en toda la navegación.
- Persistencia mediante `localStorage`.
- Checkout visual de demostración.

### Código
- HTML indentado y comentado.
- CSS separado del HTML.
- JavaScript centralizado en `script.js`.
- Se eliminó la dependencia de estilos inline para las partes principales.
- Se evita guardar contraseñas en `localStorage`.
- Se añadieron pequeñas mejoras de accesibilidad: `aria-label`, `aria-current`, `aria-live`, labels asociados y botones reales.

## Archivos que reemplazan al proyecto original

- `index.html`
- `tienda.html`
- `carrito.html`
- `quienes-somos.html`
- `registrarse.html`
- `terminos.html`
- `script.js`
- `css/estilos.css`

Las imágenes `producto1.jpg` a `producto4.jpg` se mantienen.

## Importante

El registro, el carrito y el checkout son funcionalidades frontend/demo. Para producción habría que añadir backend, autenticación segura, base de datos y una pasarela de pago real.
