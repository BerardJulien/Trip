import axios from 'axios';
import { SERVER_BASE_URL } from '../constants/serverConstants';
import { handleErrorToast, showToast } from '../utils/alert';

// =======================
// Mise à jour des paramètres utilisateur
// =======================

export const updateSettings = async (data, type) => {
  try {
    // Détermine l'URL en fonction du type de mise à jour (mot de passe ou informations personnelles)
    const url =
      type === 'password'
        ? `${SERVER_BASE_URL}/api/v1/users/update-password` // Endpoint pour la mise à jour du mot de passe
        : `${SERVER_BASE_URL}/api/v1/users/update-me`; // Endpoint pour la mise à jour des informations personnelles

    // Configuration des options pour inclure le token JWT dans les en-têtes
    const options = {
      headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` }, // Authentification avec JWT
    };

    // Envoi de la requête de mise à jour
    const { data: updatedData } = await axios.patch(url, data, options);

    // Si la mise à jour réussit
    if (updatedData.status === 'success') {
      showToast('success', 'Données mises à jour avec succès'); // Affiche un toast de succès
      return updatedData.data.user; // Retourne les données mises à jour de l'utilisateur
    }
  } catch (err) {
    // Gestion des erreurs via un toast
    handleErrorToast(err);
  }
};
