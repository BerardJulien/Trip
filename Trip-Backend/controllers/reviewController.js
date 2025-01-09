const factory = require('./handlerFactory');
const Review = require('../models/reviewModel');

// Middleware pour définir les IDs de l'utilisateur et du tour dans le corps de la requête
exports.setTourUserIds = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId; // Ajoute `tourId` si absent
  if (!req.body.user) req.body.user = req.user.id; // Ajoute l'ID de l'utilisateur connecté si absent

  next(); // Passe au middleware suivant
};

// Route pour récupérer tous les avis
exports.getAllReviews = factory.getAll(Review);

// Route pour récupérer un avis spécifique par ID
exports.getReview = factory.getOne(Review);

// Route pour récupérer tous les avis d'un utilisateur
exports.getUserReviews = async (req, res, next) => {
  try {
    // Recherche des avis liés à l'utilisateur connecté
    const reviews = await Review.find({ user: req.user.id });

    // Réponse avec les avis trouvés
    res.status(200).json({
      status: 'success',
      results: reviews.length, // Nombre d'avis trouvés
      data: {
        reviews, // Liste des avis
      },
    });
  } catch (err) {
    // Gestion des erreurs
    res.status(400).json({
      status: 'fail',
      message: 'Impossible de récupérer les avis.',
      error: err.message, // Message d'erreur détaillé
    });
  }
};

// Route pour récupérer tous les avis liés à un tour spécifique
exports.getReviewsByTour = async (req, res, next) => {
  try {
    // Recherche des avis liés au tour spécifié
    const reviews = await Review.find({ tour: req.params.tourId });

    // Réponse avec les avis trouvés
    res.status(200).json({
      status: 'success',
      results: reviews.length, // Nombre d'avis trouvés
      data: {
        reviews, // Liste des avis
      },
    });
  } catch (err) {
    // Gestion des erreurs
    res.status(400).json({
      status: 'fail',
      message: 'Impossible de récupérer les avis.',
      error: err.message, // Message d'erreur détaillé
    });
  }
};

// Route pour créer un nouvel avis
exports.createReview = factory.createOne(Review);

// Route pour mettre à jour un avis existant
exports.updateReview = factory.updateOne(Review);

// Route pour supprimer un avis existant
exports.deleteReview = factory.deleteOne(Review);
