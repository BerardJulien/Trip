const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('../../models/tourModel');
const User = require('../../models/userModel');
const Review = require('../../models/reviewModel');
const Booking = require('../../models/bookingModel');

// Chargement des variables d'environnement depuis le fichier config.env
dotenv.config({ path: './config.env' });

// Configuration de la chaîne de connexion MongoDB
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

// Connexion à la base de données
mongoose
  .connect(DB)
  .then(() => console.log('Connexion à la base de données réussie'));

// Lecture des fichiers JSON contenant les données
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8')
);

// Fonction pour importer les données dans la base de données
const importData = async () => {
  try {
    await Tour.create(tours); // Importation des tours
    await User.create(users, { validateBeforeSave: false }); // Importation des utilisateurs (désactive la validation des mots de passe)
    await Review.create(reviews); // Importation des avis
    console.log('Les données ont été importées avec succès !');
    process.exit(); // Termine le processus après l'importation
  } catch (err) {
    console.error(err); // Affiche l'erreur si l'importation échoue
  }
};

// Fonction pour supprimer les données de la base de données
const deleteData = async () => {
  try {
    await Tour.deleteMany(); // Suppression de tous les documents de la collection tours
    await User.deleteMany(); // Suppression de tous les utilisateurs
    await Review.deleteMany(); // Suppression de tous les avis
    await Booking.deleteMany(); // Suppression de toutes les réservations
    console.log('Les données ont été supprimées avec succès !');
    process.exit(); // Termine le processus après la suppression
  } catch (err) {
    console.error(err); // Affiche l'erreur si la suppression échoue
  }
};

// Gestion des arguments CLI pour choisir l'opération à exécuter
if (process.argv[2] === '--import') {
  // Si le deuxième argument CLI est '--import', lance l'importation
  importData();
} else if (process.argv[2] === '--delete') {
  // Si le deuxième argument CLI est '--delete', lance la suppression
  deleteData();
}

// Affiche les arguments reçus depuis la ligne de commande (utile pour le débogage)
console.log('Arguments CLI reçus :', process.argv);

// userModel => // *** Import *** //
// node dev-data/data/import-dev-data.js --import
// node dev-data/data/import-dev-data.js --delete
