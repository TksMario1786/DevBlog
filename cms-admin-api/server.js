const createApp = require('./src/app');

const PORT = process.env.PORT || 3000;

createApp()
  .then((app) => {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`[CMS Admin API] Escuchando en puerto ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('[CMS Admin API] Error fatal al iniciar:', err);
    process.exit(1);
  });