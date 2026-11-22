const processedKeys = new Set();
module.exports = (req, res, next) => {
  if (req.method === 'GET') return next();
  const key = req.headers['x-idempotency-key'];
  if (!key) return res.status(400).json({ error: 'Falta cabecera X-Idempotency-Key' });
  if (processedKeys.has(key)) return res.status(409).json({ error: 'Petición duplicada (Idempotency)' });
  processedKeys.add(key);
  next();
};