// Définition du schéma Mongoose pour les tours
const mongoose = require('mongoose');
const slugify = require('slugify');

// Schéma pour les tours
const tourSchema = new mongoose.Schema(
  {
    // Nom du tour
    name: {
      type: String,
      required: [true, 'Un tour doit avoir un nom.'], // Validation : champ obligatoire
      unique: true, // Doit être unique
      trim: true, // Supprime les espaces en début/fin de chaîne
      maxlength: [40, "Le nom d'un tour ne peut pas dépasser 40 caractères."], // Longueur maximale
      minlength: [10, "Le nom d'un tour doit contenir au moins 10 caractères."], // Longueur minimale
    },
    // Slug généré automatiquement pour les URL
    slug: String,
    // Note moyenne
    ratingsAverage: {
      type: Number,
      default: 4.5, // Valeur par défaut
      min: [1, 'La note doit être supérieure ou égale à 1.0.'], // Note minimale
      max: [5, 'La note doit être inférieure ou égale à 5.0.'], // Note maximale
      set: (val) => Math.round(val * 10) / 10, // Arrondi à une décimale
    },
    // Nombre de notes
    ratingsQuantity: {
      type: Number,
      default: 0, // Par défaut : aucune note
    },
    // Durée du tour (en jours)
    duration: {
      type: Number,
      required: [true, 'Un tour doit avoir une durée.'], // Validation : champ obligatoire
    },
    // Taille maximale du groupe
    maxGroupSize: {
      type: Number,
      required: [true, 'Un tour doit avoir une taille maximale de groupe.'], // Validation : champ obligatoire
    },
    // Niveau de difficulté
    difficulty: {
      type: String,
      required: [true, 'Un tour doit avoir un niveau de difficulté.'], // Validation : champ obligatoire
      enum: {
        values: ['easy', 'medium', 'difficult'], // Valeurs autorisées
        message: 'La difficulté doit être "facile", "moyenne" ou "difficile".',
      },
    },
    // Prix du tour
    price: {
      type: Number,
      required: [true, 'Un tour doit avoir un prix.'], // Validation : champ obligatoire
    },
    // Prix réduit (doit être inférieur au prix normal)
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price; // Vérifie que le prix réduit est inférieur au prix normal
        },
        message: 'Le prix réduit ({VALUE}) doit être inférieur au prix normal.', // Message d'erreur
      },
    },
    // Résumé du tour
    summary: {
      type: String,
      required: [true, 'Un tour doit avoir un résumé.'], // Validation : champ obligatoire
      trim: true, // Supprime les espaces inutiles
    },
    // Description détaillée
    description: {
      type: String,
      trim: true, // Supprime les espaces inutiles
    },
    // Image de couverture
    imageCover: {
      type: String,
      required: [true, 'Un tour doit avoir une image de couverture.'], // Validation : champ obligatoire
    },
    // Images supplémentaires
    images: [String], // Tableau de chaînes représentant les noms de fichiers
    // Date de création (non accessible dans les réponses par défaut)
    createdAt: {
      type: Date,
      default: Date.now,
      select: false,
    },
    // Dates de début disponibles pour le tour
    startDates: [Date],
    // Indicateur pour les tours secrets
    secretTour: {
      type: Boolean,
      default: false,
    },
    // Localisation de départ (géospatiale)
    startLocation: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'], // Type géospatial autorisé
      },
      coordinates: [Number], // Tableau de coordonnées [longitude, latitude]
      address: String,
      description: String,
    },
    // Étapes du tour avec localisation
    locations: [
      {
        type: { type: String, default: 'Point', enum: ['Point'] },
        coordinates: [Number], // Coordonnées [longitude, latitude]
        address: String,
        description: String,
        day: Number, // Jour où cette étape se produit
      },
    ],
    // Guides du tour (références aux utilisateurs)
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User', // Modèle référencé (User)
      },
    ],
  },
  {
    toJSON: { virtuals: true }, // Active les champs virtuels dans les réponses JSON
    toObject: { virtuals: true }, // Active les champs virtuels dans les réponses Objet
  }
);

// Index pour améliorer les performances des requêtes
tourSchema.index({ price: 1, ratingsAverage: -1 }); // Tri par prix croissant et note moyenne décroissante
tourSchema.index({ slug: 1 }); // Recherche rapide par slug
tourSchema.index({ startLocation: '2dsphere' }); // Index géospatial

// Champ virtuel pour calculer la durée en semaines
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7; // Durée (en jours) convertie en semaines
});

// Relation virtuelle avec les avis
tourSchema.virtual('reviews', {
  ref: 'Review', // Modèle référencé
  foreignField: 'tour', // Champ dans le modèle Review
  localField: '_id', // Champ dans le modèle actuel
});

// Middleware `pre` pour générer un slug avant la sauvegarde
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true }); // Génère un slug basé sur le nom
  next();
});

// Middleware `pre` pour exclure les tours secrets des requêtes `find`
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } }); // Exclut les tours secrets
  this.start = Date.now(); // Enregistre le moment où la requête commence
  next();
});

// Middleware `pre` pour remplir les informations des guides dans les requêtes `find`
tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides', // Remplit le champ guides avec les données des utilisateurs
    select: '-__v -passwordChangedAt', // Exclut certains champs
  });
  next();
});

// Création du modèle Tour à partir du schéma
const Tour = mongoose.model('Tour', tourSchema);

// Exportation du modèle
module.exports = Tour;
