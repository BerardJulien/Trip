// Définition du schéma Mongoose pour les avis
const mongoose = require('mongoose');
const Tour = require('./tourModel');

// Schéma pour les avis
const reviewSchema = new mongoose.Schema(
  {
    // Contenu de l'avis
    review: {
      type: String,
      required: [true, 'Un avis ne peut pas être vide.'], // Validation : champ obligatoire
    },
    // Note de l'avis (entre 1 et 5)
    rating: {
      type: Number,
      min: [1, 'La note doit être au moins de 1.'], // Note minimale
      max: [5, 'La note ne peut pas dépasser 5.'], // Note maximale
    },
    // Date de création de l'avis
    createdAt: {
      type: Date,
      default: Date.now, // Par défaut : date actuelle
    },
    // Référence au tour concerné
    tour: {
      type: mongoose.Schema.ObjectId, // Type : ID d'un document MongoDB
      ref: 'Tour', // Référence au modèle Tour
      required: [true, 'Un avis doit être associé à un tour.'], // Validation : champ obligatoire
    },
    // Référence à l'utilisateur ayant laissé l'avis
    user: {
      type: mongoose.Schema.ObjectId, // Type : ID d'un document MongoDB
      ref: 'User', // Référence au modèle User
      required: [true, 'Un avis doit être associé à un utilisateur.'], // Validation : champ obligatoire
    },
  },
  {
    toJSON: { virtuals: true }, // Active les champs virtuels dans les réponses JSON
    toObject: { virtuals: true }, // Active les champs virtuels dans les réponses Objet
  }
);

// Indexation pour garantir qu'un utilisateur ne peut laisser qu'un avis par tour
reviewSchema.index({ user: 1, tour: 1 }, { unique: true });

// Méthode statique pour calculer les notes moyennes et la quantité d'avis d'un tour
reviewSchema.statics.calcAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    { $match: { tour: tourId } }, // Filtrer les avis liés au tour
    {
      $group: {
        _id: '$tour', // Regrouper par tour
        numRatings: { $sum: 1 }, // Compter le nombre d'avis
        avgRating: { $avg: '$rating' }, // Calculer la note moyenne
      },
    },
  ]);

  // Mise à jour des valeurs par défaut si aucune statistique n'est trouvée
  const ratingsQuantity = stats[0]?.numRatings ?? 0;
  const ratingsAverage = stats[0]?.avgRating ?? 4;

  // Mettre à jour les statistiques dans le modèle Tour
  await Tour.findByIdAndUpdate(tourId, {
    ratingsQuantity,
    ratingsAverage,
  });
};

// Middleware `pre` pour remplir automatiquement les données utilisateur dans les requêtes `find`
reviewSchema.pre(/^find/, function (next) {
  this.populate({ path: 'user', select: 'name photo' }); // Inclut le nom et la photo de l'utilisateur
  next();
});

// Middleware `post` après la sauvegarde d'un avis pour mettre à jour les notes moyennes
reviewSchema.post('save', function () {
  this.constructor.calcAverageRatings(this.tour); // Appelle la méthode statique
});

// Middleware `post` après les opérations `findOneAnd*` pour recalculer les notes moyennes
reviewSchema.post(/^findOneAnd/, async (doc) => {
  if (doc) await doc.constructor.calcAverageRatings(doc.tour); // Recalcule les statistiques si un avis est modifié ou supprimé
});

// Création du modèle Review à partir du schéma
const Review = mongoose.model('Review', reviewSchema);

// Exportation du modèle
module.exports = Review;
