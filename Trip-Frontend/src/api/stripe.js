import axios from 'axios';
import { SERVER_BASE_URL } from '../constants/serverConstants';
import { handleErrorToast } from '../utils/alert';

// =======================
// Réservation d'un tour
// =======================

export const bookTour = async tourId => {
  try {
    // Configuration des options pour inclure le token JWT dans les en-têtes
    const options = {
      headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` },
    };

    // Envoi de la requête pour obtenir la session de paiement Stripe pour le tour
    const { data } = await axios.get(
      `${SERVER_BASE_URL}/api/v1/bookings/checkout-session/${tourId}`, // Endpoint pour la réservation
      options
    );

    // Si la requête réussit et que le statut est "success"
    if (data.status === 'success') {
      return data.sessionUrl; // Retourne l'URL de la session Stripe
    }

    // Si la réponse n'est pas un succès, lance une erreur
    throw new Error('Quelque chose a mal tourné !');
  } catch (err) {
    // Gestion des erreurs via un toast
    handleErrorToast(err);
  }
};
