(function () {
    "use strict";

    // URL base de tu API en Render
    const API_BASE = "https://tu-api-backend.onrender.com/api";
    const articulosContainer = document.getElementById("articulos-container");

    function createElement(tag, className, text) {
        const element = document.createElement(tag);
        if (className) element.className = className;
        if (text !== undefined) element.textContent = text;
        return element;
    }

    function createPlaceholderBlock(widthClass, height) {
        const block = createElement("span", "placeholder-block " + widthClass);
        block.style.height = height;
        return block;
    }

    function setProjectImage(image, source) {
        image.setAttribute("src", source || "assets/images/project-placeholder.svg");
        image.addEventListener("error", function handleImageError() {
            image.removeEventListener("error", handleImageError);
            image.setAttribute("src", "assets/images/project-placeholder.svg");
        });
    }

    function createPlaceholderCard() {
        const card = createElement("article", "post-card post-card--placeholder");
        const top = createElement("div", "post-card__top");
        top.appendChild(createPlaceholderBlock("placeholder-block--short", "14px"));
        top.appendChild(createPlaceholderBlock("placeholder-block--tiny", "12px"));
        
        const title = createPlaceholderBlock("placeholder-block--full", "18px");
        title.style.marginTop = "0.25rem";
        
        const description = createElement("div", "post-card__description");
        description.appendChild(createPlaceholderBlock("placeholder-block--full", "10px"));
        description.appendChild(createPlaceholderBlock("placeholder-block--medium", "10px"));
        
        const footer = createElement("div", "post-card__footer");
        footer.appendChild(createPlaceholderBlock("placeholder-block--tiny", "10px"));
        
        card.append(top, title, description, footer);
        return card;
    }

    function renderArticulos(articulos) {
        const fragment = document.createDocumentFragment();
        if (articulos.length) {
            articulos.forEach(articulo => {
                const card = createElement("article", "post-card");

                const top = createElement("div", "post-card__top");
                top.appendChild(createElement("span", "badge", articulo.categoria || "General"));
                top.appendChild(createElement("span", "post-card__time", articulo.lectura || "3 min"));

                const title = createElement("h3", "post-card__title", articulo.titulo);
                const description = createElement("p", "post-card__description", articulo.descripcion);

                const footer = createElement("div", "post-card__footer");
                const dateText = articulo.fecha ? new Date(articulo.fecha).toLocaleDateString("es-MX") : "Reciente";
                const date = createElement("time", "", "▣ " + dateText);
                
                const link = createElement("a", "post-card__link", "Leer Artículo →");
                if (articulo.enlace) link.setAttribute("href", articulo.enlace);
                
                footer.append(date, link);
                card.append(top, title, description, footer);
                fragment.appendChild(card);
            });
        } else {
            fragment.appendChild(createPlaceholderCard());
        }
        articulosContainer.replaceChildren(fragment);
    }

    function renderProyectos(proyectos) {
        const featuredProject = document.querySelector(".featured-project");
        const secondaryProjects = document.querySelector(".projects__secondary");
        const count = document.querySelector(".projects__title-group .badge--count");

        if (!proyectos.length || !featuredProject || !secondaryProjects) return;
        if (count) count.textContent = String(proyectos.length);

        // Renderizar el proyecto destacado (el primero)
        const featured = proyectos[0];
        const fImage = createElement("img", "featured-project__image");
        setProjectImage(fImage, featured.imagen);
        fImage.setAttribute("alt", featured.titulo || "");
        
        featuredProject.querySelector(".featured-project__media .featured-project__image").replaceWith(fImage);
        featuredProject.querySelector(".featured-project__title").textContent = featured.titulo || "";
        featuredProject.querySelector(".featured-project__description").textContent = featured.descripcion || "";

        // Reconstruir tecnologías del destacado
        const fTechContainer = featuredProject.querySelector(".featured-project__tech");
        fTechContainer.replaceChildren();
        if (featured.tecnologias) {
            const techs = featured.tecnologias.split(",");
            techs.forEach(t => fTechContainer.appendChild(createElement("li", "tech-chip", t.trim())));
        }

        // Reconstruir acciones del destacado (añadir GitHub)
        const fActions = featuredProject.querySelector(".featured-project__actions");
        fActions.replaceChildren();
        if (featured.repositorio) {
            const repoBtn = createElement("a", "btn btn--secondary", "Ver en GitHub");
            repoBtn.setAttribute("href", featured.repositorio);
            repoBtn.setAttribute("target", "_blank");
            fActions.appendChild(repoBtn);
        }

        // Limpiar sub-nodos no utilizados del HTML estático
        const status = featuredProject.querySelector(".featured-project__status");
        if(status) status.remove();
        const features = featuredProject.querySelector(".featured-project__features");
        if(features) features.remove();

        // Renderizar proyectos secundarios
        secondaryProjects.replaceChildren();
        proyectos.slice(1).forEach(proyecto => {
            const card = createElement("article", "project-mini");
            
            const img = createElement("img", "project-mini__image");
            setProjectImage(img, proyecto.imagen);
            img.setAttribute("alt", proyecto.titulo || "");
            card.appendChild(img);
            
            card.appendChild(createElement("h3", "project-mini__title", proyecto.titulo || ""));
            card.appendChild(createElement("p", "project-mini__description", proyecto.descripcion || ""));
            
            // Tecnologías mini
            if (proyecto.tecnologias) {
                const techList = createElement("ul", "project-mini__tech");
                proyecto.tecnologias.split(",").forEach(t => {
                    techList.appendChild(createElement("li", "tech-chip", t.trim()));
                });
                card.appendChild(techList);
            }

            // Footer con enlace a GitHub
            const footer = createElement("div", "project-mini__footer");
            if (proyecto.repositorio) {
                const repoLink = createElement("a", "", "GitHub ↗");
                repoLink.setAttribute("href", proyecto.repositorio);
                repoLink.setAttribute("target", "_blank");
                repoLink.style.color = "var(--blog-green-soft)";
                footer.appendChild(repoLink);
            }
            card.appendChild(footer);
            
            secondaryProjects.appendChild(card);
        });
    }

    // Inicializar y obtener datos de la API
    async function init() {
        try {
            // Se añaden place-holders mientras carga
            articulosContainer.appendChild(createPlaceholderCard());

            // Llamada paralela a tus endpoints
            const [articulosRes, proyectosRes] = await Promise.all([
                fetch(`${API_BASE}/articulos`),
                fetch(`${API_BASE}/proyectos`)
            ]);

            const articulos = await articulosRes.json();
            const proyectos = await proyectosRes.json();

            renderArticulos(articulos);
            renderProyectos(proyectos);
        } catch (error) {
            console.error("Error al conectar con la API:", error);
            articulosContainer.innerHTML = "<p>No se pudo cargar el contenido. Intenta más tarde.</p>";
        }
    }

    init();
})();