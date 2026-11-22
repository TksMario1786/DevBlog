document.addEventListener('DOMContentLoaded', async () => {
    try {
        const res = await fetch('/api/v1/public/posts');
        const posts = await res.json();
        
        const container = document.getElementById('articulos-container');
        if (container) {
            container.innerHTML = posts.map(p => `
                <article class="post-card">
                    <div class="post-card__top">
                        <span class="badge">${p.category_id}</span>
                        <time class="post-card__time">${new Date(p.created_at).toLocaleDateString()}</time>
                    </div>
                    <h3 class="post-card__title">${p.title}</h3>
                    <p class="post-card__description">${p.body}</p>
                    <div class="post-card__footer">
                        ${p.is_edited ? '<span style="color:var(--blog-yellow)">* Editado</span>' : '<span></span>'}
                        <a href="#" class="post-card__link">Leer más →</a>
                    </div>
                </article>
            `).join('');
            
            // Actualiza el contador
            const badgeCount = document.querySelector('.badge--count');
            if (badgeCount) badgeCount.textContent = posts.length;
        }
    } catch (e) { console.error('Error al cargar posts', e); }
});