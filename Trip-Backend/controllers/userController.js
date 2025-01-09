const multer = require('multer');
const sharp = require('sharp');
const factory = require('./handlerFactory');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/userModel');
const Review = require('../models/reviewModel');
const Booking = require('../models/bookingModel');

// Configuration de multer pour le stockage en mémoire
const multerStorage = multer.memoryStorage();

// Filtrage pour accepter uniquement les fichiers d'image
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true); // Accepte le fichier
  } else {
    cb(new AppError("Ce fichier n'est pas une image.", 400), false); // Rejette le fichier
  }
};

// Configuration de multer pour le téléchargement des fichiers
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

// Middleware pour gérer l'upload de la photo de l'utilisateur
exports.uploadUserPhoto = upload.single('photo');

// Middleware pour redimensionner la photo de l'utilisateur
exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next(); // Si aucun fichier n'est fourni, passe au middleware suivant

  // Génère un nom unique pour le fichier
  req.file.fileName = `user-${req.user.id}-${Date.now()}.jpeg`;

  // Redimensionne et sauvegarde la photo
  await sharp(req.file.buffer)
    .resize(500, 500) // Taille : 500x500 pixels
    .toFormat('jpeg')
    .jpeg({ quality: 90 }) // Qualité : 90%
    .toFile(`public/img/users/${req.file.fileName}`);
  next();
});

// Fonction pour filtrer un objet selon les champs autorisés
const filterObj = (obj, ...allowedFields) => {
  const filteredObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) filteredObj[el] = obj[el]; // Ajoute uniquement les champs autorisés
  });
  return filteredObj;
};

// Middleware pour récupérer l'utilisateur connecté
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id; // Ajoute l'ID de l'utilisateur connecté à la requête
  next();
};

// Route pour mettre à jour les informations d'un utilisateur
exports.updateMe = catchAsync(async (req, res, next) => {
  // Vérifie si la requête tente de modifier le mot de passe
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "Cette route n'est pas destinée à la mise à jour des mots de passe.",
        400
      )
    );
  }

  // Filtre les champs autorisés à être mis à jour
  const filteredBody = filterObj(req.body, 'name', 'email');
  if (req.file) filteredBody.photo = req.file.fileName; // Ajoute la photo si elle existe

  // Met à jour les informations de l'utilisateur
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true, // Retourne le document mis à jour
    runValidators: true, // Valide les modifications selon le modèle
  });

  // Réponse avec l'utilisateur mis à jour
  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

// Route pour désactiver un compte utilisateur
exports.deleteMe = catchAsync(async (req, res, next) => {
  // Met à jour le champ `active` à `false` pour désactiver le compte
  await User.findByIdAndUpdate(req.user.id, { active: false });

  // Réponse avec un statut 204 (No Content)
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

// Route pour créer un utilisateur (non définie ici)
exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: "Cette route n'est pas définie. Veuillez utiliser /signup.",
  });
};

// Route pour récupérer un utilisateur par ID
exports.getUser = factory.getOne(User);

// Route pour récupérer tous les utilisateurs
exports.getAllUsers = factory.getAll(User);

// Route pour mettre à jour un utilisateur (réservée à l'administrateur)
exports.updateUser = factory.updateOne(User);

// Route pour supprimer définitivement un utilisateur et ses dépendances
exports.deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id;

    // Supprime l'utilisateur par son ID
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({
        status: 'fail',
        message: 'Utilisateur non trouvé.',
      });
    }

    // Supprime tous les avis et réservations associés à l'utilisateur
    await Review.deleteMany({ user: userId });
    await Booking.deleteMany({ user: userId });

    // Réponse avec un statut 204 (No Content)
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    next(err); // Passe l'erreur au middleware global de gestion des erreurs
  }
};
