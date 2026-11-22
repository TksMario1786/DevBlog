const { DomainError } = require('../errors/DomainErrors');

module.exports = (err, req, res, next) => {
  if (err instanceof DomainError) return res.status(err.status).json({ error: err.message });
  console.error('[Public API Error]', err);
  res.status(500).json({ error: 'Error interno del servidor web' });
};