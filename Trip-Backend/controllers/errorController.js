const AppError = require('../utils/appError');

// Gestion des erreurs liées aux IDs ou chemins invalides dans MongoDB
const handleCastErrorDB = (err) => {
  const message = `Valeur invalide pour le champ ${err.path} : ${err.value}.`;
  return new AppError(message, 400); // Erreur opérationnelle avec code 400
};

// Gestion des erreurs de duplication de champs uniques dans MongoDB
const handleDuplicateFieldsDB = (err) => {
  const value = err.message.match(/(["'])(\\?.)*?\1/)[0]; // Extraction de la valeur dupliquée
  const message = `Valeur dupliquée : ${value}. Veuillez utiliser une autre valeur.`;
  return new AppError(message, 400); // Erreur opérationnelle avec code 400
};

// Gestion des erreurs de validation des champs dans MongoDB
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message); // Récupération des messages d'erreur
  const message = `Données invalides : ${errors.join('. ')}`;
  return new AppError(message, 400); // Erreur opérationnelle avec code 400
};

// Gestion des erreurs de token JWT invalide
const handleJwtError = () =>
  new AppError('Token invalide. Veuillez vous reconnecter.', 401);

// Gestion des erreurs de token JWT expiré
const handleJwtExpiredError = () =>
  new AppError('Votre token a expiré. Veuillez vous reconnecter.', 401);

// Envoi des erreurs en mode développement
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status, // Statut de l'erreur (ex : 'fail' ou 'error')
    error: err, // Objet d'erreur brut
    message: err.message, // Message détaillé
    stack: err.stack, // Stack trace pour le débogage
  });
};

// Envoi des erreurs en mode production
const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    // Erreurs opérationnelles connues
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  // Erreurs inconnues ou non gérées
  console.error('ERREUR 💥', err);

  res.status(500).json({
    status: 'error',
    message: 'Une erreur interne est survenue. Veuillez réessayer plus tard.',
  });
};

// Middleware global de gestion des erreurs
module.exports = (err, req, res, next) => {
  // Définit les valeurs par défaut pour le code d'erreur et le statut
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Gestion des erreurs en fonction de l'environnement
  if (process.env.NODE_ENV === 'development') {
    // Mode développement : affichage détaillé des erreurs
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    // Mode production : gestion des erreurs spécifiques et réponse épurée
    let error = { ...err };
    error.message = err.message;

    // Gestion des erreurs spécifiques MongoDB ou JWT
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJwtError();
    if (error.name === 'TokenExpiredError') error = handleJwtExpiredError();

    // Envoi de l'erreur en mode production
    sendErrorProd(error, res);
  }
};
