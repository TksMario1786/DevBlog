const { Post, Proyecto, Certificado } = require('../models/Entidades');
const { NotFoundError, ConflictError } = require('../errors/DomainErrors');

class ContentService {
  constructor(repos, generatorClient) {
    this.repos = repos;
    this.generator = generatorClient;
  }

  // --- POSTS ---
  getAllPosts() { return this.repos.posts.findAll(); }
  getPost(id) { 
    const p = this.repos.posts.findById(id); 
    if (!p) throw new NotFoundError("Post no encontrado"); 
    return p; 
  }
  createPost(data) {
    const p = new Post(data);
    return this.repos.posts.save(p);
  }
  async updatePost(id, data) {
    const p = this.getPost(id);
    p.update(data);
    this.repos.posts.save(p);
    if (p.status === 'PUBLISHED') await this.generator.sync('POST', 'UPSERT', p.id, p);
    return p;
  }
  async publishPost(id) {
    const p = await this.repos.posts.findById(id); // <-- Aquí faltaba el await
    if (!p) {
        const err = new Error('Artículo no encontrado');
        err.status = 404;
        throw err;
    }
    p.status = 'PUBLISHED';
    return await this.repos.posts.save(p);
  }

  async archivePost(id) {
      const p = await this.repos.posts.findById(id); // <-- Verifica también aquí
      if (!p) {
          const err = new Error('Artículo no encontrado');
          err.status = 404;
          throw err;
      }
      p.status = 'ARCHIVED';
      return await this.repos.posts.save(p);
  }

  // --- PROYECTOS ---
  getAllProyectos() { return this.repos.proyectos.findAll(); }
  getProyecto(id) { 
    const p = this.repos.proyectos.findById(id); 
    if (!p) throw new NotFoundError("Proyecto no encontrado"); return p; 
  }
  async createProyecto(data) {
    const p = new Proyecto(data);
    this.repos.proyectos.save(p);
    await this.generator.sync('PROYECTO', 'UPSERT', p.id, p);
    return p;
  }
  async updateProyecto(id, data) {
    const p = this.getProyecto(id);
    p.update(data);
    this.repos.proyectos.save(p);
    await this.generator.sync('PROYECTO', 'UPSERT', p.id, p);
    return p;
  }
  async deleteProyecto(id) {
    const p = this.getProyecto(id);
    this.repos.proyectos.delete(id);
    await this.generator.sync('PROYECTO', 'DELETE', id);
  }

  // --- CERTIFICADOS ---
  getAllCertificados() { return this.repos.certificados.findAll(); }
  getCertificado(id) { 
    const c = this.repos.certificados.findById(id); 
    if (!c) throw new NotFoundError("Certificado no encontrado"); return c; 
  }
  async createCertificado(data) {
    const c = new Certificado(data);
    this.repos.certificados.save(c);
    await this.generator.sync('CERTIFICADO', 'UPSERT', c.id, c);
    return c;
  }
  async updateCertificado(id, data) {
    const c = this.getCertificado(id);
    c.update(data);
    this.repos.certificados.save(c);
    await this.generator.sync('CERTIFICADO', 'UPSERT', c.id, c);
    return c;
  }
  async deleteCertificado(id) {
    this.getCertificado(id);
    this.repos.certificados.delete(id);
    await this.generator.sync('CERTIFICADO', 'DELETE', id);
  }
}
module.exports = ContentService;