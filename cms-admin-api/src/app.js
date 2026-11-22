const express = require('express');
const setupDependencies = require('./config/dependencias');
const createRoutes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');

async function createApp() {
  const { controller } = await setupDependencies();

  const app = express();
  app.use(express.json());
  app.use(createRoutes(controller));
  app.use(errorHandler);

  return app;
}

module.exports = createApp;