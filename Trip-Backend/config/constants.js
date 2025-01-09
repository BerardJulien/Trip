// Définition de l'URL du client en fonction de l'environnement
const clientUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://trip-julien.netlify.app' // URL pour l'environnement de production
    : 'http://localhost:5173'; // URL pour l'environnement de développement

// Exportation de l'URL de base du client
exports.CLIENT_BASE_URL = clientUrl;
