import { toast } from 'react-toastify';

// ===============================
// Fonction pour afficher un toast
// ===============================

export const showToast = (type, msg, duration = 2) => {
  // Définition des options pour le toast
  const options = {
    autoClose: duration * 1000, // Durée de fermeture automatique en millisecondes (par défaut 2 secondes)
  };

  // Affiche un toast selon le type spécifié
  if (type === 'success') {
    toast.success(msg, options); // Toast de succès
  } else if (type === 'error') {
    toast.error(msg, options); // Toast d'erreur
  }
};

// ===================================
// Fonction pour gérer les erreurs
// ===================================

export const handleErrorToast = err => {
  let errMsg = ''; // Message d'erreur à afficher

  // En mode développement, affiche des informations détaillées sur l'erreur
  if (import.meta.env.MODE === 'development') {
    errMsg = err.response?.data?.message || err.message || 'Erreur inattendue.'; // Priorité : message du serveur > message générique > message par défaut
  }
  // En mode production, masque les détails de l'erreur
  else if (import.meta.env.MODE === 'production') {
    errMsg = err.response?.data?.message || 'Une erreur est survenue.'; // Priorité : message du serveur > message générique
  }

  // Affiche le message d'erreur sous forme de toast
  showToast('error', errMsg);
};
