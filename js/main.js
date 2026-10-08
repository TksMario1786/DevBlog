(function () {
    "use strict";

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

    function createProjectPlaceholder() {
        const card = createElement("article", "project-card project-card--placeholder");
        const image = createElement("div", "project-card__image placeholder-card__media");
        image.appendChild(createPlaceholderBlock("placeholder-block--full", "100%"));
        card.appendChild(image);

        const content = createElement("div", "project-card__content");
        content.appendChild(createPlaceholderBlock("placeholder-block--full", "18px"));
        content.appendChild(createPlaceholderBlock("placeholder-block--medium", "10px"));
        content.appendChild(createPlaceholderBlock("placeholder-block--short", "10px"));
        card.appendChild(content);

        return card;
    }

    function createCertificatePlaceholder() {
        const card = createElement("article", "certificate-card surface-box certificate-card--placeholder");
        const media = createElement("div", "certificate-card__image placeholder-card__media");
        media.appendChild(createPlaceholderBlock("placeholder-block--full", "100%"));
        card.appendChild(media);
        card.appendChild(createPlaceholderBlock("placeholder-block--full", "14px"));
        return card;
    }

    function setProjectImage(image, source) {
        image.setAttribute("src", source || "assets/images/project-placeholder.svg");
        image.addEventListener("error", function handleImageError() {
            image.removeEventListener("error", handleImageError);
            image.setAttribute("src", "assets/images/project-placeholder.svg");
        });
    }

    const projectsContainer = document.getElementById("proyectos-container");
    if (projectsContainer && typeof proyectos !== "undefined" && Array.isArray(proyectos)) {
        const projectsFragment = document.createDocumentFragment();
        const validProjects = proyectos.filter(function (proyecto) {
            return [proyecto.titulo, proyecto.descripcion, proyecto.imagen].some(Boolean);
        });

        if (validProjects.length) {
            validProjects.forEach(function (proyecto) {
                const card = createElement("article", "project-card");
                const image = createElement("img", "project-card__image");
                setProjectImage(image, proyecto.imagen);
                image.setAttribute("alt", proyecto.titulo || "");
                card.appendChild(image);

                const content = createElement("div", "project-card__content");
                content.appendChild(createElement("h3", "project-card__title", proyecto.titulo));
                content.appendChild(createElement("p", "project-card__description", proyecto.descripcion));
                card.appendChild(content);
                projectsFragment.appendChild(card);
            });
        } else {
            projectsFragment.appendChild(createProjectPlaceholder());
        }

        projectsContainer.replaceChildren(projectsFragment);
    }

    const certificatesContainer = document.getElementById("certificados-container");
    if (certificatesContainer && typeof certificados !== "undefined" && Array.isArray(certificados)) {
        const certificatesFragment = document.createDocumentFragment();
        const validCertificates = certificados.filter(function (certificado) {
            return [certificado.titulo, certificado.fecha, certificado.imagen].some(Boolean);
        });

        if (validCertificates.length) {
            validCertificates.forEach(function (certificado) {
                const card = createElement("article", "certificate-card surface-box");
                if (certificado.imagen) {
                    const image = createElement("img", "certificate-card__image");
                    image.setAttribute("src", certificado.imagen);
                    image.setAttribute("alt", "");
                    card.appendChild(image);
                }

                const title = [certificado.titulo, certificado.fecha].filter(Boolean).join(" ");
                card.appendChild(createElement("h3", "certificate-card__title", title));
                certificatesFragment.appendChild(card);
            });
        } else {
            certificatesFragment.appendChild(createCertificatePlaceholder());
        }

        certificatesContainer.replaceChildren(certificatesFragment);
    }
})();
