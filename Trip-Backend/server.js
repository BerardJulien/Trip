// Imports nécessaires
const mongoose = require('mongoose'); // Bibliothèque pour gérer la base de données MongoDB
const dotenv = require('dotenv'); // Module pour gérer les variables d'environnement

// Gestion des exceptions non interceptées
process.on('uncaughtException', (err) => {
  console.log('🚨 UNCAUGHT EXCEPTION! 💥 Fermeture du serveur...');
  console.error(`${err.name}: ${err.message}`);
  process.exit(1); // Arrêt immédiat du processus
});

// Chargement du fichier de configuration .env
dotenv.config({ path: './config.env' });

// Chargement de l'application principale
const app = require('./app');

// Construction de la chaîne de connexion MongoDB
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

// Désactivation de strictQuery pour des requêtes plus flexibles
mongoose.set('strictQuery', false);

// Connexion à la base de données MongoDB
mongoose
  .connect(DB)
  .then(() => console.log('✅ Connexion à la base de données réussie !'))
  .catch((err) => {
    console.error('❌ Échec de connexion à la base de données :', err.message);
    process.exit(1); // Arrêt du processus en cas d'échec
  });

// Définition du port pour le serveur
const port = process.env.PORT || 3000;

// Démarrage du serveur sur le port spécifié
const server = app.listen(port, () => {
  console.log(`🚀 Application en cours d'exécution sur le port ${port}...`);
});

// Gestion des promesses rejetées non interceptées
process.on('unhandledRejection', (err) => {
  console.log('🚨 UNHANDLED REJECTION! 💥 Fermeture du serveur...');
  console.error(`${err.name}: ${err.message}`);

  // Fermeture propre du serveur avant d'arrêter le processus
  server.close(() => {
    process.exit(1);
  });
});
