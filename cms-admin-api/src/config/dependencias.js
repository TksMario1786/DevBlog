const initDB = require('./database');
const { PostgresPostRepository, PostgresProyectoRepository, PostgresCertificadoRepository } = require('../repositories/PostgresRepository');
const GeneratorClient = require('../clients/GeneratorClient');
const ContentService = require('../services/ContentService');
const ContentController = require('../controllers/ContentController');

async function setupDependencies() {
  const pool = await initDB();
  
  const repos = { 
    posts: new PostgresPostRepository(pool), 
    proyectos: new PostgresProyectoRepository(pool), 
    certificados: new PostgresCertificadoRepository(pool) 
  };
  
  // Render o local
  const grpcHost = process.env.GRPC_HOST || 'localhost:50051';
  
  const client = new GeneratorClient(grpcHost);
  const service = new ContentService(repos, client);
  const controller = new ContentController(service);

  return { controller };
}

module.exports = setupDependencies;