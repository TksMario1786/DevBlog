class PublicController {
  constructor(service) { this.service = service; }

  getPosts = async (req, res, next) => {
    try { res.json(await this.service.getPosts()); } catch (e) { next(e); }
  };
  
  getPostBySlug = async (req, res, next) => {
    try { res.json(await this.service.getPostBySlug(req.params.slug)); } catch (e) { next(e); }
  };
  
  getProyectos = async (req, res, next) => {
    try { res.json(await this.service.getProyectos()); } catch (e) { next(e); }
  };
  
  getCertificados = async (req, res, next) => {
    try { res.json(await this.service.getCertificados()); } catch (e) { next(e); }
  };
}
module.exports = PublicController;