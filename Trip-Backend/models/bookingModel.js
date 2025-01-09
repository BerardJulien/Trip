// Définition du schéma Mongoose pour les réservations
const mongoose = require('mongoose');

// Schéma de réservation
const bookingSchema = new mongoose.Schema({
  // Référence au tour associé
  tour: {
    type: mongoose.Schema.ObjectId, // Type : ID d'un document MongoDB
    ref: 'Tour', // Modèle référencé (Tour)
    required: [true, 'Une réservation doit être liée à un tour.'], // Validation de présence
  },
  // Référence à l'utilisateur associé
  user: {
    type: mongoose.Schema.ObjectId, // Type : ID d'un document MongoDB
    ref: 'User', // Modèle référencé (User)
    required: [true, 'Une réservation doit être liée à un utilisateur.'], // Validation de présence
  },
  // Prix de la réservation
  price: {
    type: Number, // Type : nombre
    required: [true, 'Une réservation doit avoir un prix.'], // Validation de présence
  },
  // Date de création de la réservation
  createdAt: {
    type: Date, // Type : date
    default: Date.now(), // Valeur par défaut : date actuelle
  },
  // Statut du paiement (payé ou non)
  paid: {
    type: Boolean, // Type : booléen
    default: true, // Par défaut : payé
  },
});

// Middleware pré-requête pour les opérations `find`
/* !!! */
// bookingSchema.pre(/^find/, function (next) {
//   this.populate('user').populate({
//     path: 'tour',
//     select: 'name imageCover', // Limite les champs retournés pour le tour
//   });
//   next();
// });

bookingSchema.pre(/^find/, (next) => {
  next();
});

// Création du modèle Booking à partir du schéma
const Booking = mongoose.model('Booking', bookingSchema);

// Exportation du modèle
module.exports = Booking;
