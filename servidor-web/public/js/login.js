(function () {
    "use strict";

    const API_BASE = "https://cms-admin-nrsh.onrender.com/api/v1/admin";
    const form = document.getElementById("login-form");
    const input = document.getElementById("admin-key");
    const errorBox = document.getElementById("login-error");
    const btn = document.getElementById("login-btn");

    // Si ya hay sesión activa en esta pestaña, ir directo al panel
    if (sessionStorage.getItem("devblog_admin_token")) {
        window.location.href = "admin.html";
        return;
    }

    function showError(msg) {
        errorBox.textContent = msg;
        errorBox.style.display = "block";
    }

    form.addEventListener("submit", async function (e) {
        e.preventDefault();
        errorBox.style.display = "none";

        const token = input.value.trim();
        if (!token) return;

        btn.disabled = true;
        btn.textContent = "Verificando con el servidor...";

        try {
            const response = await fetch(`${API_BASE}/posts`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.ok) {
                sessionStorage.setItem("devblog_admin_token", token);
                window.location.href = "admin.html";
                return;
            }

            if (response.status === 401) {
                showError("Llave incorrecta. Acceso denegado.");
            } else {
                showError(`Error del servidor (${response.status}). Intenta de nuevo.`);
            }
        } catch (err) {
            showError("No se pudo conectar con la API (puede estar despertando en Render, espera 30s e intenta de nuevo).");
        } finally {
            btn.disabled = false;
            btn.textContent = "Autenticar y entrar →";
        }
    });
})();