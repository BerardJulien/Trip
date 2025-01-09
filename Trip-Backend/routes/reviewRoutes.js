const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

// Création d'un routeur avec l'option `mergeParams` pour accéder aux paramètres des routeurs parents
const router = express.Router({
  mergeParams: true, // Permet d'accéder aux `tourId` transmis par d'autres routeurs
});

// Middleware global pour protéger toutes les routes
router.use(authController.protect); // Toutes les routes nécessitent une authentification

// =======================
// Routes pour les utilisateurs connectés
// =======================

// Récupère tous les avis
router.get('/', reviewController.getAllReviews);

// Permet aux utilisateurs connectés de créer un avis
router.post(
  '/',
  authController.restrictTo('user'), // Seuls les utilisateurs peuvent créer un avis
  reviewController.setTourUserIds, // Définit automatiquement les IDs de l'utilisateur et du tour
  reviewController.createReview // Crée un nouvel avis
);

// Récupère les avis de l'utilisateur connecté
router.get('/my-reviews', reviewController.getUserReviews);

// =======================
// Routes pour récupérer les avis d'un tour
// =======================

// Récupère les avis d'un tour spécifique
router.get(
  '/tour/:tourId',
  authController.restrictTo('admin'), // Seuls les administrateurs peuvent accéder aux avis d'un tour
  reviewController.getReviewsByTour
);

// =======================
// Routes spécifiques pour les avis individuels
// =======================

router
  .route('/:id')
  .get(reviewController.getReview) // Récupère un avis par son ID
  .patch(
    authController.restrictTo('user', 'admin'), // Seuls les utilisateurs et administrateurs peuvent modifier un avis
    reviewController.updateReview // Met à jour un avis
  )
  .delete(
    authController.restrictTo('user', 'admin'), // Seuls les utilisateurs et administrateurs peuvent supprimer un avis
    reviewController.deleteReview // Supprime un avis
  );

// Exportation du routeur
module.exports = router;
