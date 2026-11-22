class ContentController {
  constructor(service) { this.service = service; }
  
  // Helpers
  async handle(req, res, next, action) {
    try { const result = await action(); res.status(200).json(result); } catch (e) { next(e); }
  }
  async handleCreate(req, res, next, action) {
    try { const result = await action(); res.status(201).json(result); } catch (e) { next(e); }
  }
  async handleEmpty(req, res, next, action) {
    try { await action(); res.status(204).send(); } catch (e) { next(e); }
  }

  // Posts (6)
  listPosts = (req, res, next) => this.handle(req, res, next, () => this.service.getAllPosts());
  getPost = (req, res, next) => this.handle(req, res, next, () => this.service.getPost(req.params.id));
  createPost = (req, res, next) => this.handleCreate(req, res, next, () => this.service.createPost(req.body));
  updatePost = (req, res, next) => this.handle(req, res, next, () => this.service.updatePost(req.params.id, req.body));
  publishPost = (req, res, next) => this.handle(req, res, next, () => this.service.publishPost(req.params.id));
  archivePost = (req, res, next) => this.handle(req, res, next, () => this.service.archivePost(req.params.id));

  // Proyectos (5)
  listProyectos = (req, res, next) => this.handle(req, res, next, () => this.service.getAllProyectos());
  getProyecto = (req, res, next) => this.handle(req, res, next, () => this.service.getProyecto(req.params.id));
  createProyecto = (req, res, next) => this.handleCreate(req, res, next, () => this.service.createProyecto(req.body));
  updateProyecto = (req, res, next) => this.handle(req, res, next, () => this.service.updateProyecto(req.params.id, req.body));
  deleteProyecto = (req, res, next) => this.handleEmpty(req, res, next, () => this.service.deleteProyecto(req.params.id));

  // Certificados (5)
  listCertificados = (req, res, next) => this.handle(req, res, next, () => this.service.getAllCertificados());
  getCertificado = (req, res, next) => this.handle(req, res, next, () => this.service.getCertificado(req.params.id));
  createCertificado = (req, res, next) => this.handleCreate(req, res, next, () => this.service.createCertificado(req.body));
  updateCertificado = (req, res, next) => this.handle(req, res, next, () => this.service.updateCertificado(req.params.id, req.body));
  deleteCertificado = (req, res, next) => this.handleEmpty(req, res, next, () => this.service.deleteCertificado(req.params.id));
}
module.exports = ContentController;