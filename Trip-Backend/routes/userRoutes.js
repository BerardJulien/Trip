const express = require('express');

const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

// =======================
// Routes d'authentification
// =======================

// Inscription
router.post('/signup', authController.signup);

// Connexion
router.post('/login', authController.login);

// Déconnexion
router.get('/logout', authController.logout);

// Mot de passe oublié
router.post('/forgotPassword', authController.forgotPassword);

// Réinitialisation du mot de passe
router.patch('/resetPassword/:token', authController.resetPassword);

// =======================
// Routes pour les utilisateurs connectés
// =======================

// Middleware pour protéger les routes suivantes (nécessite une connexion)
router.use(authController.protect);

// Mise à jour du mot de passe connecté
router.patch('/update-password', authController.updatePassword);

// Récupère les informations de l'utilisateur connecté
router.get('/me', userController.getMe, userController.getUser);

// Mise à jour des informations personnelles de l'utilisateur connecté
router.patch(
  '/update-me',
  userController.uploadUserPhoto, // Middleware pour uploader la photo
  userController.resizeUserPhoto, // Middleware pour redimensionner la photo
  userController.updateMe // Met à jour les informations
);

// Désactive le compte de l'utilisateur connecté
router.delete('/delete-me', userController.deleteMe);

// =======================
// Routes réservées aux administrateurs
// =======================

// Middleware pour restreindre l'accès aux administrateurs
router.use(authController.restrictTo('admin'));

// Gestion des utilisateurs
router
  .route('/')
  .get(userController.getAllUsers) // Récupère tous les utilisateurs
  .post(userController.createUser); // Crée un nouvel utilisateur

router
  .route('/:id')
  .get(userController.getUser) // Récupère un utilisateur par ID
  .patch(userController.updateUser) // Met à jour un utilisateur par ID
  .delete(userController.deleteUser); // Supprime un utilisateur par ID

// Exportation du routeur
module.exports = router;
