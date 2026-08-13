/* =========================================================
   Kè Cévere — menu.js
   Lee assets/data/menu.json y construye los submenús del header.
   Para cambiar categorías, edita SOLO menu.json.
   ========================================================= */

async function cargarMenuDinamico() {
    const navList = document.querySelector("#main-nav > ul");
    if (!navList) return;

    try {
        const response = await fetch(`${APP_ROOT}assets/data/menu.json`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const menu = await response.json();

        const menuLink = navList.querySelector('a[href*="tienda.html"]');
        if (!menuLink) return;

        const menuItem = menuLink.closest("li");
        menuItem.classList.add("nav-menu-main");
        menuLink.textContent = "Menu";

        // Evita duplicar el submenú si el script se ejecuta otra vez.
        menuItem.querySelectorAll(":scope > .mega-nav, :scope > .nav-dropdown-trigger").forEach(el => el.remove());

        const trigger = document.createElement("button");
        trigger.className = "nav-dropdown-trigger";
        trigger.type = "button";
        trigger.setAttribute("aria-expanded", "false");
        trigger.innerHTML = `Menu <span aria-hidden="true">⌄</span>`;
        menuLink.replaceWith(trigger);

        const mega = document.createElement("div");
        mega.className = "mega-nav";
        mega.setAttribute("aria-label", "Categorie del menu");

        menu.categorie.forEach(categoria => {
            const col = document.createElement("div");
            col.className = "mega-nav-column";

            const title = document.createElement("a");
            title.className = "mega-nav-title";
            title.href = `${APP_ROOT}pages/tienda.html?categoria=${encodeURIComponent(categoria.slug)}`;
            title.textContent = categoria.nome;
            col.appendChild(title);

            const list = document.createElement("ul");
            categoria.sottocategorie.forEach(sub => {
                const li = document.createElement("li");
                const a = document.createElement("a");
                a.href = `${APP_ROOT}pages/tienda.html?categoria=${encodeURIComponent(categoria.slug)}&sottocategoria=${encodeURIComponent(sub.slug)}`;
                a.textContent = sub.nome;
                li.appendChild(a);
                list.appendChild(li);
            });
            col.appendChild(list);
            mega.appendChild(col);
        });

        menuItem.appendChild(mega);

        trigger.addEventListener("click", (event) => {
            event.stopPropagation();
            const open = menuItem.classList.toggle("menu-open");
            trigger.setAttribute("aria-expanded", String(open));
        });

        document.addEventListener("click", (event) => {
            if (!menuItem.contains(event.target)) {
                menuItem.classList.remove("menu-open");
                trigger.setAttribute("aria-expanded", "false");
            }
        });
    } catch (error) {
        console.error("No se pudo cargar assets/data/menu.json", error);
    }
}

document.addEventListener("DOMContentLoaded", cargarMenuDinamico);
