const { Post, Proyecto, Certificado } = require('../models/Entidades');

class PostgresPostRepository {
  constructor(pool) { this.pool = pool; }
  async findAll() {
    const { rows } = await this.pool.query('SELECT * FROM posts');
    return rows.map(r => new Post(r));
  }
  async findById(id) {
    const { rows } = await this.pool.query('SELECT * FROM posts WHERE id = $1', [id]);
    return rows.length ? new Post(rows[0]) : null;
  }
  async save(post) {
    await this.pool.query(`
      INSERT INTO posts (id, title, slug, body, category_id, status, version, is_edited, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      ON CONFLICT(id) DO UPDATE SET 
      title=EXCLUDED.title, slug=EXCLUDED.slug, body=EXCLUDED.body, category_id=EXCLUDED.category_id,
      status=EXCLUDED.status, version=EXCLUDED.version, is_edited=EXCLUDED.is_edited, updated_at=EXCLUDED.updated_at
    `, [post.id, post.title, post.slug, post.body, post.category_id, post.status, post.version, post.is_edited, post.created_at, post.updated_at]);
    return post;
  }
  async delete(id) { await this.pool.query('DELETE FROM posts WHERE id = $1', [id]); }
}

class PostgresProyectoRepository {
  constructor(pool) { this.pool = pool; }
  async findAll() {
    const { rows } = await this.pool.query('SELECT * FROM proyectos');
    return rows.map(r => new Proyecto(r));
  }
  async findById(id) {
    const { rows } = await this.pool.query('SELECT * FROM proyectos WHERE id = $1', [id]);
    return rows.length ? new Proyecto(rows[0]) : null;
  }
  async save(p) {
    await this.pool.query(`
      INSERT INTO proyectos (id, title, description, tags, features, github_url, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT(id) DO UPDATE SET 
      title=EXCLUDED.title, description=EXCLUDED.description, tags=EXCLUDED.tags, 
      features=EXCLUDED.features, github_url=EXCLUDED.github_url, updated_at=EXCLUDED.updated_at
    `, [p.id, p.title, p.description, JSON.stringify(p.tags), JSON.stringify(p.features), p.github_url, p.created_at, p.updated_at]);
    return p;
  }
  async delete(id) { await this.pool.query('DELETE FROM proyectos WHERE id = $1', [id]); }
}

class PostgresCertificadoRepository {
  constructor(pool) { this.pool = pool; }
  async findAll() {
    const { rows } = await this.pool.query('SELECT * FROM certificados');
    return rows.map(r => new Certificado(r));
  }
  async findById(id) {
    const { rows } = await this.pool.query('SELECT * FROM certificados WHERE id = $1', [id]);
    return rows.length ? new Certificado(rows[0]) : null;
  }
  async save(c) {
    await this.pool.query(`
      INSERT INTO certificados (id, name, issuer, issue_date, url, created_at)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT(id) DO UPDATE SET 
      name=EXCLUDED.name, issuer=EXCLUDED.issuer, issue_date=EXCLUDED.issue_date, url=EXCLUDED.url
    `, [c.id, c.name, c.issuer, c.issue_date, c.url, c.created_at]);
    return c;
  }
  async delete(id) { await this.pool.query('DELETE FROM certificados WHERE id = $1', [id]); }
}

module.exports = { PostgresPostRepository, PostgresProyectoRepository, PostgresCertificadoRepository };