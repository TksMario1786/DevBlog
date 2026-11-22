const { Router } = require('express');

module.exports = (controller) => {
  const router = Router();
  router.get('/health', (req, res) => res.json({ status: 'OK' }));
  
  // Publicos (5 Endpoints)
  router.get('/api/v1/public/posts', controller.getPosts);
  router.get('/api/v1/public/posts/:slug', controller.getPostBySlug);
  router.get('/api/v1/public/proyectos', controller.getProyectos);
  router.get('/api/v1/public/certificados', controller.getCertificados);

  return router;
};