const { v4: uuidv4 } = require('uuid');
const { ConflictError, ValidationError } = require('../errors/DomainErrors');

class Post {
  constructor(data) {
    if (!data.title || !data.slug || !data.body) throw new ValidationError("title, slug y body son obligatorios");
    this.id = data.id || uuidv4();
    this.title = data.title; 
    this.slug = data.slug; 
    this.body = data.body; 
    this.category_id = data.category_id || 'general';
    this.status = data.status || 'DRAFT'; 
    this.version = data.version || 1; 
    this.is_edited = data.is_edited === true || data.is_edited === 1;
    this.created_at = data.created_at || new Date().toISOString(); 
    this.updated_at = data.updated_at || this.created_at;
  }
  update(data) {
    if (this.status === 'ARCHIVED') throw new ConflictError("Un post archivado no se puede editar");
    Object.assign(this, data);
    this.version++;
    if (this.status === 'PUBLISHED') this.is_edited = true;
    this.updated_at = new Date().toISOString();
  }
  publish() {
    if (this.status === 'ARCHIVED') throw new ConflictError("No se puede publicar un post archivado");
    this.status = 'PUBLISHED';
    this.updated_at = new Date().toISOString();
  }
  archive() {
    this.status = 'ARCHIVED';
    this.updated_at = new Date().toISOString();
  }
}

class Proyecto {
  constructor(data) {
    if (!data.title || !data.description) throw new ValidationError("title y description son obligatorios");
    this.id = data.id || uuidv4();
    this.title = data.title; 
    this.description = data.description; 
    this.tags = typeof data.tags === 'string' ? JSON.parse(data.tags) : (data.tags || []); 
    this.features = typeof data.features === 'string' ? JSON.parse(data.features) : (data.features || []); 
    this.github_url = data.github_url;
    this.created_at = data.created_at || new Date().toISOString(); 
    this.updated_at = data.updated_at || this.created_at;
  }
  update(data) { Object.assign(this, data); this.updated_at = new Date().toISOString(); }
}

class Certificado {
  constructor(data) {
    if (!data.name || !data.issuer) throw new ValidationError("name e issuer son obligatorios");
    this.id = data.id || uuidv4();
    this.name = data.name; 
    this.issuer = data.issuer; 
    this.issue_date = data.issue_date; 
    this.url = data.url;
    this.created_at = data.created_at || new Date().toISOString();
  }
  update(data) { Object.assign(this, data); }
}

module.exports = { Post, Proyecto, Certificado };