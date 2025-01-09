// Fonction utilitaire pour gérer automatiquement les erreurs dans les fonctions asynchrones
const catchAsync =
  (fn) =>
  // Retourne une fonction middleware qui intercepte les erreurs
  (req, res, next) =>
    // Exécute la fonction asynchrone et capture les erreurs avec .catch
    fn(req, res, next).catch(next);

// Exportation de la fonction pour une utilisation dans les contrôleurs
module.exports = catchAsync;
