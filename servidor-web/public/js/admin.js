(function () {
    "use strict";

    // 1. VALIDACIÓN DE AUTENTICACIÓN
    // Utilizamos el nombre de variable que tu backend / login espera
    const adminToken = sessionStorage.getItem("devblog_admin_token");
    
    // Si no hay token, lo mandamos al login de inmediato y detenemos la ejecución
    if (!adminToken) {
        window.location.href = "login.html";
        return; 
    }

    // 2. CONFIGURACIÓN BASE
    // URL base de tu API en Render (cámbiala por tu dominio real si difiere)
    const API_BASE = "https://cms-admin.onrender.com/api/v1/admin";

    // 3. CAPTURA DE ELEMENTOS DEL DOM
    const postForm = document.getElementById("post-form");
    const projectForm = document.getElementById("project-form");
    const titleInput = document.getElementById("post-title");
    const slugInput = document.getElementById("post-slug");
    const categoryInput = document.getElementById("post-category");
    const bodyInput = document.getElementById("post-body");
    const saveBtn = document.getElementById("save-post-btn");
    const feedback = document.getElementById("editor-feedback");
    const container = document.getElementById("admin-posts-container");
    const countBadge = document.getElementById("posts-count");
    const logoutBtn = document.getElementById("logout-btn");
    const refreshBtn = document.getElementById("refresh-btn");

    // 4. MANEJO DE PESTAÑAS (UI)
    const tabs = {
        articulos: { btn: document.getElementById("tab-articulos"), sec: document.getElementById("sec-articulos") },
        proyectos: { btn: document.getElementById("tab-proyectos"), sec: document.getElementById("sec-proyectos") },
        perfil: { btn: document.getElementById("tab-perfil"), sec: document.getElementById("sec-perfil") }
    };

    function switchTab(activeKey) {
        Object.keys(tabs).forEach(key => {
            const isActive = key === activeKey;
            tabs[key].btn.className = isActive ? "btn btn--primary" : "btn btn--secondary";
            tabs[key].btn.setAttribute("aria-selected", String(isActive));
            tabs[key].sec.hidden = !isActive;
        });
    }

    Object.keys(tabs).forEach(key => {
        tabs[key].btn.addEventListener("click", () => switchTab(key));
    });

    function showFeedback(message, isError = false) {
        feedback.textContent = message;
        feedback.className = isError ? "status-banner status-banner--error" : "status-banner";
        feedback.style.display = "block";
        setTimeout(() => { feedback.style.display = "none"; }, 4000);
    }

    titleInput.addEventListener("input", function () {
        slugInput.value = titleInput.value
            .toLowerCase()
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");
    });

    logoutBtn.addEventListener("click", () => {
        sessionStorage.removeItem("devblog_admin_token");
        window.location.href = "login.html";
    });

    // ─── 5. LÓGICA DE ARTÍCULOS ──────────────────────────────────────────────

    async function loadPosts() {
        container.replaceChildren();
        try {
            const response = await fetch(`${API_BASE}/posts`, {
                headers: { "Authorization": `Bearer ${adminToken}` }
            });
            if (!response.ok) throw new Error("Error al cargar artículos");
            const posts = await response.json();
            
            countBadge.textContent = String(posts.length);

            if (!posts.length) {
                container.innerHTML = '<p style="font-size: 0.75rem;">Aún no hay artículos en la base de datos.</p>';
                return;
            }

            posts.forEach(post => {
                const card = document.createElement("article");
                card.className = "post-card";
                const isPublished = post.status === "PUBLISHED";
                const badgeClass = isPublished ? "badge" : "badge badge--warning";
                const dateText = post.created_at ? new Date(post.created_at).toLocaleDateString("es-MX") : "Sin fecha";

                card.innerHTML = `
                    <div class="post-card__top">
                        <span class="badge">${post.category_id || "general"}</span>
                        <span class="${badgeClass}">${post.status || "DRAFT"}</span>
                    </div>
                    <h3 class="post-card__title">${post.title}</h3>
                    <p class="post-card__description">${(post.body || "").slice(0, 140)}...</p>
                    <div class="post-card__footer">
                        <span>▣ ${dateText}</span>
                        <div class="card-actions">
                            ${!isPublished ? `<button type="button" class="btn btn--primary" data-publish-id="${post.id}">Publicar</button>` : ""}
                        </div>
                    </div>
                `;

                const pubBtn = card.querySelector("[data-publish-id]");
                if (pubBtn) {
                    pubBtn.addEventListener("click", () => publishPost(post.id, pubBtn));
                }
                container.appendChild(card);
            });
        } catch (error) {
            showFeedback(error.message, true);
        }
    }

    // AQUI ESTÁ EL FETCH DE PUBLICAR CORREGIDO CON SU AWAIT DENTRO DE UNA FUNCION ASYNC
    async function publishPost(postId, buttonEl) {
        buttonEl.disabled = true;
        buttonEl.textContent = "Publicando...";
        try {
            const response = await fetch(`${API_BASE}/posts/${postId}/publish`, {
                method: "PATCH",
                headers: {
                    "Authorization": `Bearer ${adminToken}`,
                    "X-Idempotency-Key": crypto.randomUUID()
                }
            });
            if (!response.ok) throw new Error("No se pudo publicar");
            showFeedback("¡Artículo publicado correctamente!");
            loadPosts();
        } catch (error) {
            showFeedback(error.message, true);
            buttonEl.disabled = false;
            buttonEl.textContent = "Publicar";
        }
    }

    // FETCH PARA GUARDAR UN NUEVO BORRADOR CON AUTORIZACIÓN
    postForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        saveBtn.disabled = true;
        saveBtn.textContent = "Guardando...";

        const newPost = {
            title: titleInput.value.trim(),
            slug: slugInput.value.trim(),
            category_id: categoryInput.value,
            body: bodyInput.value.trim(),
            status: "DRAFT"
        };

        try {
            const response = await fetch(`${API_BASE}/posts`, { // Ajustado a /posts en lugar de /articulos según tu URL base
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${adminToken}`, // <- Añadido para seguridad
                    "X-Idempotency-Key": crypto.randomUUID() // <- Añadido para pasar el middleware del backend
                },
                body: JSON.stringify(newPost)
            });
            if (!response.ok) throw new Error("Error al guardar el borrador");
            
            postForm.reset();
            showFeedback("¡Artículo guardado en borrador!");
            loadPosts();
        } catch (error) {
            showFeedback(error.message, true);
        } finally {
            saveBtn.disabled = false;
            saveBtn.textContent = "Guardar borrador";
        }
    });

    // ─── 6. LÓGICA DE PROYECTOS ──────────────────────────────────────────────

    // FETCH PARA GUARDAR PROYECTOS CON AUTORIZACIÓN
    projectForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const btn = projectForm.querySelector('button[type="submit"]');
        btn.disabled = true;
        btn.textContent = "Guardando...";

        const formData = new FormData();
        formData.append("titulo", document.getElementById("project-name").value.trim());
        formData.append("repositorio", document.getElementById("project-repository").value.trim());
        formData.append("tecnologias", document.getElementById("project-technologies").value.trim());
        formData.append("descripcion", document.getElementById("project-description").value.trim());
        
        const imageFile = document.getElementById("project-image").files[0];
        if (imageFile) formData.append("imagen", imageFile);

        try {
            const response = await fetch(`${API_BASE}/proyectos`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${adminToken}`,
                    "X-Idempotency-Key": crypto.randomUUID() // <-- Agrega esta línea
                },
                body: formData 
            });
            if (!response.ok) throw new Error("Error al guardar el proyecto");
            
            projectForm.reset();
            showFeedback("¡Proyecto registrado exitosamente!");
        } catch (error) {
            showFeedback(error.message, true);
        } finally {
            btn.disabled = false;
            btn.textContent = "Guardar proyecto";
        }
    });

    refreshBtn.addEventListener("click", loadPosts);
    
    // 7. INICIALIZAR
    loadPosts();
})();