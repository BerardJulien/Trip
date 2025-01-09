const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

// Définition du schéma Mongoose pour les utilisateurs
const userSchema = new mongoose.Schema({
  // Nom de l'utilisateur
  name: {
    type: String,
    required: [true, 'Veuillez indiquer votre nom.'], // Validation obligatoire
  },
  // Adresse email
  email: {
    type: String,
    required: [true, 'Veuillez fournir votre adresse email.'], // Validation obligatoire
    unique: true, // Doit être unique dans la base de données
    lowerCase: true, // Convertir en minuscules
    validate: [validator.isEmail, 'Veuillez fournir une adresse email valide.'], // Vérification du format email
  },
  // Photo de profil
  photo: {
    type: String,
    default: 'default.jpg', // Photo par défaut
  },
  // Rôle de l'utilisateur
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'], // Liste des rôles autorisés
    default: 'user', // Par défaut : utilisateur simple
  },
  // Mot de passe
  password: {
    type: String,
    required: [true, 'Veuillez fournir un mot de passe.'], // Validation obligatoire
    minlength: 8, // Longueur minimale
    select: false, // Ne pas inclure ce champ dans les requêtes par défaut
  },
  // Confirmation du mot de passe
  passwordConfirm: {
    type: String,
    required: [true, 'Veuillez confirmer votre mot de passe.'], // Validation obligatoire
    validate: {
      // Vérification que les mots de passe correspondent
      validator(passwordConfirm) {
        return this.password === passwordConfirm; // `this` fait référence au document en cours
      },
      message: 'Les mots de passe ne correspondent pas.', // Message d'erreur
    },
  },
  // Date de modification du mot de passe
  passwordChangedAt: Date,
  // Token de réinitialisation du mot de passe
  passwordResetToken: String,
  // Date d'expiration du token de réinitialisation
  passwordResetExpires: Date,
  // Statut de l'utilisateur (actif ou non)
  active: {
    type: Boolean,
    default: true, // Par défaut : actif
    select: false, // Ne pas inclure ce champ dans les requêtes par défaut
  },
});

// Middleware `pre` pour exclure les utilisateurs inactifs des requêtes `find`
userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } }); // Exclut les utilisateurs avec `active: false`
  next();
});

// Middleware `pre` pour hacher le mot de passe avant de sauvegarder
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // Si le mot de passe n'est pas modifié, passe au middleware suivant

  this.password = await bcrypt.hash(this.password, 12); // Hachage du mot de passe avec un coût de 12
  this.passwordConfirm = undefined; // Supprime la confirmation (non stockée en base)
  next();
});

// Middleware `pre` pour mettre à jour le champ `passwordChangedAt` lors d'un changement de mot de passe
userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next(); // Passe au middleware suivant si le mot de passe n'a pas été modifié ou si le document est nouveau

  this.passwordChangedAt = Date.now() - 1000; // Réduit d'une seconde pour éviter les problèmes avec les tokens
  next();
});

// Méthode d'instance pour vérifier la correspondance des mots de passe
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword); // Compare le mot de passe fourni avec celui stocké
};

// Méthode d'instance pour vérifier si le mot de passe a été changé après la génération d'un token JWT
userSchema.methods.changedPasswordAfter = function (jwtTimeStamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    ); // Convertit la date en timestamp
    return jwtTimeStamp < changedTimeStamp; // Vérifie si le token a été émis avant le changement de mot de passe
  }
  return false; // Si le champ n'existe pas, le mot de passe n'a pas été modifié
};

// Méthode d'instance pour générer un token de réinitialisation de mot de passe
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex'); // Génère un token aléatoire
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex'); // Hache le token avant de le stocker
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // Expire dans 10 minutes
  return resetToken; // Retourne le token brut (non haché)
};

// Création du modèle User à partir du schéma
const User = mongoose.model('User', userSchema);

// Exportation du modèle
module.exports = User;
