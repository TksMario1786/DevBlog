const { Router } = require('express');
const idempotency = require('../middlewares/idempotency');

module.exports = (controller) => {
  const router = Router();
  router.get('/health', (req, res) => res.json({ status: 'OK' }));

  // Posts (Usan idempotencia para POST y PUT)
  router.get('/api/v1/admin/posts', controller.listPosts);
  router.get('/api/v1/admin/posts/:id', controller.getPost);
  router.post('/api/v1/admin/posts', idempotency, controller.createPost);
  router.put('/api/v1/admin/posts/:id', idempotency, controller.updatePost);
  router.post('/api/v1/admin/posts/:id/publish', idempotency, controller.publishPost);
  router.post('/api/v1/admin/posts/:id/archive', idempotency, controller.archivePost);

  // Proyectos
  router.get('/api/v1/admin/proyectos', controller.listProyectos);
  router.get('/api/v1/admin/proyectos/:id', controller.getProyecto);
  router.post('/api/v1/admin/proyectos', idempotency, controller.createProyecto);
  router.put('/api/v1/admin/proyectos/:id', idempotency, controller.updateProyecto);
  router.delete('/api/v1/admin/proyectos/:id', idempotency, controller.deleteProyecto);

  // Certificados
  router.get('/api/v1/admin/certificados', controller.listCertificados);
  router.get('/api/v1/admin/certificados/:id', controller.getCertificado);
  router.post('/api/v1/admin/certificados', idempotency, controller.createCertificado);
  router.put('/api/v1/admin/certificados/:id', idempotency, controller.updateCertificado);
  router.delete('/api/v1/admin/certificados/:id', idempotency, controller.deleteCertificado);

  return router;
};