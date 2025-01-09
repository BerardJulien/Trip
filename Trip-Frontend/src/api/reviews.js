import axios from 'axios';
import { SERVER_BASE_URL } from '../constants/serverConstants';

// =======================
// Récupération des avis de l'utilisateur connecté
// =======================

export const getUserReviews = async () => {
  try {
    const options = {
      headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` }, // Authentification avec JWT
    };

    // Envoi de la requête pour récupérer les avis de l'utilisateur
    const { data } = await axios.get(`${SERVER_BASE_URL}/api/v1/reviews/my-reviews`, options);

    // Si la requête réussit, retourne les avis
    if (data.status === 'success') {
      return data.data.reviews;
    }
  } catch (err) {
    // Gestion des erreurs
    console.error('Erreur lors de la récupération des avis utilisateur :', err);
  }
};

// =======================
// Mise à jour d'un avis existant
// =======================

export const updateReview = async (reviewId, updateData) => {
  try {
    const options = {
      headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` }, // Authentification avec JWT
    };

    // Envoi de la requête pour mettre à jour un avis spécifique
    const { data } = await axios.patch(
      `${SERVER_BASE_URL}/api/v1/reviews/${reviewId}`,
      updateData, // Données mises à jour pour l'avis
      options
    );

    return data.data; // Retourne les données mises à jour
  } catch (err) {
    // Gestion des erreurs
    console.error("Erreur lors de la mise à jour de l'avis :", err);
  }
};

// =======================
// Suppression d'un avis
// =======================

export const deleteReview = async reviewId => {
  try {
    const options = {
      headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` }, // Authentification avec JWT
    };

    // Envoi de la requête pour supprimer un avis spécifique
    await axios.delete(`${SERVER_BASE_URL}/api/v1/reviews/${reviewId}`, options);

    return true; // Retourne true si la suppression est réussie
  } catch (err) {
    // Gestion des erreurs
    console.error("Erreur lors de la suppression de l'avis :", err);
    return false; // Retourne false en cas d'échec
  }
};

// =======================
// Récupération de tous les avis
// =======================

export const getAllReviews = async () => {
  try {
    const options = {
      headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` }, // Authentification avec JWT
    };

    // Envoi de la requête pour récupérer tous les avis
    const { data } = await axios.get(`${SERVER_BASE_URL}/api/v1/reviews`, options);

    // Si la requête réussit, retourne les avis
    if (data.status === 'success') {
      return data.data.data;
    }
  } catch (err) {
    // Gestion des erreurs
    console.error('Erreur lors de la récupération de tous les avis :', err);
  }
};

// =======================
// Récupération des avis pour un tour spécifique
// =======================

export const getReviewsByTour = async tourId => {
  try {
    const options = {
      headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` }, // Authentification avec JWT
    };

    // Envoi de la requête pour récupérer les avis d'un tour spécifique
    const { data } = await axios.get(`${SERVER_BASE_URL}/api/v1/reviews/tour/${tourId}`, options);

    // Si la requête réussit, retourne les avis
    if (data.status === 'success') {
      return data.data.reviews;
    }
  } catch (err) {
    // Gestion des erreurs
    console.error('Erreur lors de la récupération des avis pour le tour :', err);
  }
};

// =======================
// Récupération du nom d'un tour par son ID
// =======================

export const getTourNameById = (tourId, tours) => {
  // Recherche du tour correspondant dans la liste
  const tour = tours.find(t => t._id === tourId);
  return tour?.name; // Retourne le nom du tour ou undefined si non trouvé
};

// =======================
// Tri des avis par nom de tour
// =======================

export const sortReviewsByTourName = (reviewsToSort, toursList) => {
  if (!toursList || toursList.length === 0) return reviewsToSort; // Si aucun tour, retourne les avis sans tri

  // Trie les avis en fonction des noms des tours
  return [...reviewsToSort].sort((a, b) => {
    const nameA = getTourNameById(a.tour, toursList)?.toLowerCase() || ''; // Nom du premier tour
    const nameB = getTourNameById(b.tour, toursList)?.toLowerCase() || ''; // Nom du second tour
    return nameA.localeCompare(nameB); // Comparaison des noms
  });
};
