const express = require('express');
const setupDependencies = require('./config/dependencias');
const createRoutes = require('./routes');
const authMiddleware = require('./middlewares/authMiddleware');
const errorHandler = require('./middlewares/errorHandler');

async function createApp() {
  if (!process.env.ADMIN_API_KEY) {
    throw new Error('ADMIN_API_KEY no está configurada');
  }

  const { controller } = await setupDependencies();

  const app = express();
  const allowedOrigin = process.env.CORS_ORIGIN || 'https://devblog-public.onrender.com';

  // Permitir peticiones desde el frontend en Render
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', allowedOrigin);
    res.header('Vary', 'Origin');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Idempotency-Key');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  app.use(express.json());
  app.use('/api/v1/admin', authMiddleware);
  app.use(createRoutes(controller));
  app.use(errorHandler);

  return app;
}

module.exports = createApp;