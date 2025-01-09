import axios from 'axios';
import { SERVER_BASE_URL } from '../constants/serverConstants';

// =======================
// Fonction pour récupérer toutes les réservations
// =======================

export const getBookedToursAdmin = async () => {
  try {
    const options = {
      headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` }, // Envoi du token JWT pour l'authentification
    };

    // Requête pour obtenir toutes les réservations
    const { data } = await axios.get(`${SERVER_BASE_URL}/api/v1/bookings/booked-tours`, options);

    // Si la requête réussit, retourne les données des réservations
    if (data.status === 'success') return data.data;
  } catch (err) {
    // En cas d'erreur, affiche un message dans la console
    console.error('Erreur lors de la récupération des réservations admin :', err);
    return []; // Retourne un tableau vide en cas d'échec
  }
};

// =======================
// Fonction pour récupérer les réservations d'un utilisateur
// =======================

export const getUserBookings = async () => {
  try {
    const options = {
      headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` }, // Envoi du token JWT pour l'authentification
    };

    // Requête pour obtenir les réservations utilisateur
    const { data } = await axios.get(`${SERVER_BASE_URL}/api/v1/bookings/bookings`, options);

    // Si la requête réussit, retourne les données des réservations utilisateur
    if (data.status === 'success') {
      return data.data;
    }
  } catch (err) {
    // En cas d'erreur, affiche un message dans la console
    console.error('Erreur lors de la récupération des réservations utilisateur :', err);
    return []; // Retourne un tableau vide en cas d'échec
  }
};

// =======================
// Fonction pour supprimer une réservation en tant qu'administrateur
// =======================

export const deleteBookingAdmin = async bookingId => {
  try {
    const options = {
      headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` }, // Envoi du token JWT pour l'authentification
    };

    // Envoie une requête pour supprimer une réservation spécifique
    await axios.delete(`${SERVER_BASE_URL}/api/v1/bookings/${bookingId}`, options);

    return true; // Retourne true en cas de succès
  } catch (err) {
    // En cas d'erreur, affiche un message dans la console
    console.error('Erreur lors de la suppression admin :', err);
    return false; // Retourne false en cas d'échec
  }
};

// =======================
// Fonction pour supprimer une réservation en tant qu'utilisateur
// =======================

export const deleteUserBooking = async bookingId => {
  try {
    const options = {
      headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` }, // Envoi du token JWT pour l'authentification
    };

    // Envoie une requête pour supprimer une réservation utilisateur spécifique
    await axios.delete(`${SERVER_BASE_URL}/api/v1/bookings/bookings/${bookingId}`, options);

    return true; // Retourne true en cas de succès
  } catch (err) {
    // En cas d'erreur, affiche un message dans la console
    console.error('Erreur lors de la suppression utilisateur :', err);
    return false; // Retourne false en cas d'échec
  }
};
