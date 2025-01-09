// Définition de la classe AppError pour gérer les erreurs personnalisées
class AppError extends Error {
  // Constructeur pour initialiser une nouvelle erreur
  constructor(message, statusCode) {
    super(message); // Appelle le constructeur parent (Error) avec le message d'erreur

    // Code de statut HTTP (ex : 404, 500)
    this.statusCode = statusCode;

    // Définit le statut en fonction du code (fail pour les erreurs 4xx, error pour 5xx)
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';

    // Identifie les erreurs comme "opérationnelles" (prévues, gérables)
    this.isOperational = true;

    // Capture la trace de l'erreur pour exclure le constructeur de la trace
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
