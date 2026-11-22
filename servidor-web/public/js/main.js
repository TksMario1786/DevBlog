document.addEventListener('DOMContentLoaded', async () => {
    try {
        const resProyectos = await fetch('/api/v1/public/proyectos');
        const proyectos = await resProyectos.json();
        
        const projContainer = document.getElementById('proyectos-container');
        if (projContainer) {
            projContainer.innerHTML = proyectos.map(p => `
                <article class="project-card">
                    <img src="${p.image_url || '/assets/images/placeholder.jpg'}" alt="${p.title}" class="project-card__image">
                    <div class="project-card__content">
                        <h3 class="project-card__title">${p.title}</h3>
                        <p class="project-card__description">${p.description}</p>
                    </div>
                </article>
            `).join('');
        }

        const resCerts = await fetch('/api/v1/public/certificados');
        const certs = await resCerts.json();
        
        const certContainer = document.getElementById('certificados-container');
        if (certContainer) {
            certContainer.innerHTML = certs.map(c => `
                <article class="certificate-card">
                    <img src="${c.url || '/assets/images/placeholder.jpg'}" alt="${c.name}" class="certificate-card__image">
                    <h3 class="certificate-card__title">${c.name}</h3>
                </article>
            `).join('');
        }
    } catch (e) { console.error('Error al cargar datos de la API', e); }
});