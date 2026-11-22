const { NotFoundError } = require('../errors/DomainErrors');

class PublicService {
  constructor(repos) { this.repos = repos; }

  async getPosts() { 
    return await this.repos.posts.findAll(); 
  }
  
  async getPostBySlug(slug) {
    const posts = await this.repos.posts.findAll();
    const post = posts.find(p => p.slug === slug);
    if (!post) throw new NotFoundError("Post no encontrado");
    return post;
  }
  
  async getProyectos() { 
    return await this.repos.proyectos.findAll(); 
  }
  
  async getCertificados() { 
    return await this.repos.certificados.findAll(); 
  }
}
module.exports = PublicService;