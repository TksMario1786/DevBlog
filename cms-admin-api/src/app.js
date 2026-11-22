const express = require('express');
const { controller } = require('./config/dependencias');
const routes = require('./routes')(controller);
const errorHandler = require('./middlewares/errorHandler');

const app = express();
app.use(express.json());
app.use(routes);
app.use(errorHandler);

module.exports = app;