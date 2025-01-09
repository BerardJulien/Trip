// Importation des modules nécessaires
const express = require('express');
const tourController = require('../controllers/tourController'); // Contrôleur pour les tours
const authController = require('../controllers/authController'); // Contrôleur pour l'authentification
const reviewRouter = require('./reviewRoutes'); // Routeur pour les avis

const router = express.Router();

// Montre les avis d'un tour spécifique en utilisant le routeur des avis
router.use('/:tourId/reviews', reviewRouter);

// =======================
// Routes pour les utilisateurs connectés
// =======================

// Récupère les réservations de l'utilisateur connecté
router.get('/bookings', authController.protect, tourController.getMyTours);

// Récupère les tours à proximité d'une localisation
router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(tourController.getToursWithin);

// Calcule les distances des tours par rapport à une localisation
router.route('/distances/:latlng/unit/:unit').get(tourController.getDistances);

// =======================
// Routes publiques
// =======================

// Récupère les 5 meilleurs tours
router
  .route('/top-5-tours')
  .get(tourController.getTopTours, tourController.getAllTours);

// Récupère les statistiques globales des tours
router.route('/stats').get(tourController.getTourStats);

// Recherche un tour par son nom
router.get('/name/:tourName', tourController.getTourByName);

// Récupère tous les tours ou crée un nouveau tour (restreint aux administrateurs et lead-guides)
router
  .route('/')
  .get(tourController.getAllTours)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.createTour
  );

// =======================
// Routes réservées aux administrateurs et lead-guides
// =======================

// Planification mensuelle des tours pour une année donnée
router
  .route('/montlhy-plan/:year')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide', 'guide'),
    tourController.getMonthlyPlan
  );

// Récupère, met à jour, ou supprime un tour spécifique
router
  .route('/:id')
  .get(tourController.getTour) // Récupère un tour par son ID
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.uploadTourImages, // Middleware pour uploader des images
    tourController.resizeTourImages, // Middleware pour redimensionner les images
    tourController.updateTour // Met à jour le tour
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour // Supprime le tour
  );

// Exportation du routeur
module.exports = router;
