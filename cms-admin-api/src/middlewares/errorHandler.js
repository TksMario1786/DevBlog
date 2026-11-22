const { DomainError } = require('../errors/DomainErrors');
module.exports = (err, req, res, next) => {
  if (err instanceof DomainError) return res.status(err.status).json({ error: err.message });
  console.error('[Unhandled Error]', err);
  res.status(500).json({ error: 'Internal Server Error' });
};