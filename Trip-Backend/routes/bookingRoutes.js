const express = require('express');

const router = express.Router();
const bookingController = require('../controllers/bookingController');
const authController = require('../controllers/authController');

// Middleware global pour protéger les routes
router.use(authController.protect); // Toutes les routes nécessitent une authentification

// =======================
// Routes pour les utilisateurs connectés
// =======================

// Récupère une session de paiement Stripe pour un tour spécifique
router.get('/checkout-session/:tourId', bookingController.getCheckoutSession);

// Récupère toutes les réservations de l'utilisateur connecté
router.get('/bookings', bookingController.getCurrentUserBookings);

// Permet à l'utilisateur connecté d'annuler une réservation spécifique
router.delete(
  '/bookings/:id',
  bookingController.checkUserBookingOwnership, // Vérifie que la réservation appartient à l'utilisateur
  bookingController.deleteBooking // Supprime la réservation
);

// =======================
// Routes réservées aux administrateurs
// =======================

// Middleware pour restreindre l'accès uniquement aux administrateurs
router.use(authController.restrictTo('admin'));

// Récupère toutes les réservations avec des détails supplémentaires
router.get('/booked-tours', bookingController.getAllBookingsWithDetails);

// =======================
// Routes pour administrateurs et lead-guides
// =======================

// Middleware pour restreindre l'accès aux administrateurs et lead-guides
router.use(authController.restrictTo('admin', 'lead-guide'));

// Routes générales pour la gestion des réservations
router
  .route('/')
  .get(bookingController.getAllBookings) // Récupère toutes les réservations
  .post(bookingController.createBooking); // Crée une nouvelle réservation

// Routes spécifiques pour une réservation par ID
router
  .route('/:id')
  .get(bookingController.getBooking) // Récupère une réservation par ID
  .patch(bookingController.updateBooking) // Met à jour une réservation par ID
  .delete(bookingController.deleteBooking); // Supprime une réservation par ID

// Export du routeur
module.exports = router;
