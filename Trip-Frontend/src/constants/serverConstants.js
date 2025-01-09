// Définition de l'URL de base du serveur backend en fonction de l'environnement d'exécution
export const SERVER_BASE_URL =
  // Vérifie si l'application est en mode production
  import.meta.env.MODE === 'production'
    ? // Si en production, utilise l'URL du serveur déployé
      'https://trip-backend-production.up.railway.app'
    : // Sinon, utilise l'URL du serveur local (mode développement)
      'http://localhost:3000';
