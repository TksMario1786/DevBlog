(function () {
    "use strict";

    const container = document.getElementById("articulos-container");

    function createElement(tag, className, text) {
        const element = document.createElement(tag);
        if (className) {
            element.className = className;
        }
        if (text !== undefined) {
            element.textContent = text;
        }
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

    if (container && typeof articulos !== "undefined" && Array.isArray(articulos)) {
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
            description.appendChild(createPlaceholderBlock("placeholder-block--short", "10px"));

            const footer = createElement("div", "post-card__footer");
            footer.appendChild(createPlaceholderBlock("placeholder-block--tiny", "10px"));
            footer.appendChild(createPlaceholderBlock("placeholder-block--short", "10px"));

            card.appendChild(top);
            card.appendChild(title);
            card.appendChild(description);
            card.appendChild(footer);

            return card;
        }

        function createPostCard(articulo) {
            const card = createElement("article", "post-card");

            const top = createElement("div", "post-card__top");
            top.appendChild(createElement("span", "badge", articulo.categoria));
            top.appendChild(createElement("span", "post-card__time", articulo.lectura));

            const title = createElement("h3", "post-card__title", articulo.titulo);
            const description = createElement("p", "post-card__description", articulo.descripcion);

            const footer = createElement("div", "post-card__footer");
            const date = createElement("time", "", "▣ " + articulo.fecha);
            date.setAttribute("datetime", articulo.fecha);
            const link = createElement("a", "post-card__link", "Leer Proyecto →");
            if (articulo.enlace) {
                link.setAttribute("href", articulo.enlace);
            }
            footer.appendChild(date);
            footer.appendChild(link);

            card.appendChild(top);
            card.appendChild(title);
            card.appendChild(description);
            card.appendChild(footer);

            return card;
        }

        const fragment = document.createDocumentFragment();
        const validArticulos = articulos.filter(function (articulo) {
            return [articulo.titulo, articulo.descripcion, articulo.fecha, articulo.categoria, articulo.lectura, articulo.imagen, articulo.enlace].some(Boolean);
        });

        if (validArticulos.length) {
            validArticulos.forEach(function (articulo) {
                fragment.appendChild(createPostCard(articulo));
            });
        } else {
            fragment.appendChild(createPlaceholderCard());
        }

        container.replaceChildren(fragment);
    }

    const projects = typeof proyectos !== "undefined" && Array.isArray(proyectos)
        ? proyectos.filter(function (proyecto) {
            return proyecto && [proyecto.titulo, proyecto.descripcion, proyecto.imagen].some(Boolean);
        })
        : [];
    const featuredProject = document.querySelector(".featured-project");
    const secondaryProjects = document.querySelector(".projects__secondary");

    if (projects.length && featuredProject && secondaryProjects) {
        const featured = projects[0];
        const image = createElement("img", "featured-project__image");
        setProjectImage(image, featured.imagen);
        image.setAttribute("alt", featured.titulo || "");
        featuredProject.querySelector(".featured-project__media .featured-project__image").replaceWith(image);
        featuredProject.querySelector(".featured-project__title").textContent = featured.titulo || "";
        featuredProject.querySelector(".featured-project__description").textContent = featured.descripcion || "";

        featuredProject.querySelector(".featured-project__status").remove();
        featuredProject.querySelector(".featured-project__tags").remove();
        featuredProject.querySelector(".featured-project__features").remove();
        featuredProject.querySelector(".featured-project__tech").remove();
        featuredProject.querySelector(".featured-project__actions").remove();

        secondaryProjects.replaceChildren();
        projects.slice(1).forEach(function (proyecto) {
            const card = createElement("article", "project-mini");
            const image = createElement("img", "project-mini__image");
            setProjectImage(image, proyecto.imagen);
            image.setAttribute("alt", proyecto.titulo || "");
            card.appendChild(image);
            card.appendChild(createElement("h3", "project-mini__title", proyecto.titulo || ""));
            card.appendChild(createElement("p", "project-mini__description", proyecto.descripcion || ""));
            secondaryProjects.appendChild(card);
        });

        const count = document.querySelector(".projects__title-group .badge--count");
        if (count) {
            count.textContent = String(projects.length);
        }
    }
})();