const { Pool } = require('pg');

async function initDB() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgres://usuario:password@localhost:5432/cms',
    // Render requiere SSL en conexiones externas, lo habilitamos solo en producción
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  await pool.query(`
    CREATE TABLE IF NOT EXISTS posts (
      id TEXT PRIMARY KEY, title TEXT, slug TEXT, body TEXT, category_id TEXT,
      status TEXT, version INTEGER, is_edited BOOLEAN, created_at TEXT, updated_at TEXT
    );
    CREATE TABLE IF NOT EXISTS proyectos (
      id TEXT PRIMARY KEY, title TEXT, description TEXT, tags TEXT, features TEXT,
      github_url TEXT, created_at TEXT, updated_at TEXT
    );
    CREATE TABLE IF NOT EXISTS certificados (
      id TEXT PRIMARY KEY, name TEXT, issuer TEXT, issue_date TEXT, url TEXT, created_at TEXT
    );
  `);
  
  return pool;
}

module.exports = initDB;