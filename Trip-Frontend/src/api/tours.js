import axios from 'axios';
import { SERVER_BASE_URL } from '../constants/serverConstants';

// =======================
// Récupération de tous les tours
// =======================

export const getAllTours = async () => {
  try {
    // Requête pour récupérer tous les tours depuis l'API
    const { data: tourData } = await axios.get(`${SERVER_BASE_URL}/api/v1/tours`);

    // Si la requête réussit, retourne les données des tours
    if (tourData.status === 'success') {
      return tourData.data;
    }

    // Retourne un tableau vide si la requête échoue sans erreur explicite
    return [];
  } catch (err) {
    // Gestion des erreurs
    console.error('Erreur lors de la récupération des tours :', err);
    return []; // Retourne un tableau vide en cas d'erreur
  }
};

// =======================
// Récupération d'un tour spécifique par son nom
// =======================

export const getOneTour = async tourName => {
  try {
    // Requête pour récupérer les détails d'un tour spécifique via son nom
    const { data: tourData } = await axios.get(`${SERVER_BASE_URL}/api/v1/tours/name/${tourName}`);

    // Si la requête réussit, retourne les données du tour
    if (tourData.status === 'success') return tourData.data;
  } catch (err) {
    // Gestion des erreurs
    console.error('Erreur lors de la récupération du tour:', err);
    return false; // Retourne false en cas d'erreur
  }
};

// =======================
// Récupération du nom d'un tour par son ID
// =======================

export const getTourNameById = (tourId, tours) => {
  // Recherche dans la liste des tours pour trouver celui correspondant à l'ID
  const tour = tours.find(t => t._id === tourId);

  // Retourne le nom du tour ou undefined si non trouvé
  return tour?.name;
};

// =======================
// Suppression d'un tour
// =======================

export const deleteTour = async tourId => {
  try {
    // Configuration des options pour inclure le token JWT dans les en-têtes
    const options = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('jwt')}`, // Authentification avec JWT
      },
    };

    // Envoi de la requête pour supprimer un tour spécifique
    await axios.delete(`${SERVER_BASE_URL}/api/v1/tours/${tourId}`, options);

    return true; // Retourne true si la suppression est réussie
  } catch (err) {
    // Gestion des erreurs
    console.error('Erreur lors de la suppression du tour :', err);
    return false; // Retourne false en cas d'échec
  }
};
