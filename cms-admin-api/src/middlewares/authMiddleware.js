function authMiddleware(req, res, next) {
  const expectedSecret = process.env.ADMIN_API_KEY;

  if (!expectedSecret) {
    return res.status(500).json({ error: 'Configuración de autenticación incompleta' });
  }

  const authHeader = req.headers['authorization'] || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : null;

  if (!token || token !== expectedSecret) {
    return res.status(401).json({ error: 'No autorizado: clave de administrador inválida' });
  }

  next();
}

module.exports = authMiddleware;