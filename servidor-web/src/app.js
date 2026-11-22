const express = require('express');
const path = require('path');
const JsonRepository = require('./repositories/JsonRepository');
const PublicService = require('./services/PublicService');
const PublicController = require('./controllers/PublicController');
const errorHandler = require('./middlewares/errorHandler');

const repos = {
  posts: new JsonRepository('posts.json'),
  proyectos: new JsonRepository('proyectos.json'),
  certificados: new JsonRepository('certificados.json')
};

const service = new PublicService(repos);
const controller = new PublicController(service);
const routes = require('./routes')(controller);

const app = express();

app.use(express.static(path.join(__dirname, '../public')));
app.use(routes);
app.use(errorHandler); // El middleware captura los errores delegados por next(e)

module.exports = app;