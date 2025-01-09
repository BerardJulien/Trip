import axios from 'axios';
import { SERVER_BASE_URL } from '../constants/serverConstants';

// =======================
// Récupération de tous les utilisateurs
// =======================

export const getAllUsers = async () => {
  try {
    // Configuration des options pour inclure le token JWT dans les en-têtes
    const options = {
      headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` }, // Authentification avec JWT
    };

    // Envoi de la requête pour récupérer tous les utilisateurs
    const { data } = await axios.get(`${SERVER_BASE_URL}/api/v1/users`, options);

    // Si la requête réussit, retourne les données des utilisateurs
    if (data.status === 'success') {
      return data.data;
    }
  } catch (err) {
    // Gestion des erreurs
    console.error('Erreur lors de la récupération des utilisateurs :', err);
    return false; // Retourne false en cas d'échec
  }
};

// =======================
// Suppression d'un utilisateur
// =======================

export const deleteUser = async userId => {
  try {
    // Configuration des options pour inclure le token JWT dans les en-têtes
    const options = {
      headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` }, // Authentification avec JWT
    };

    // Envoi de la requête pour supprimer un utilisateur spécifique
    await axios.delete(`${SERVER_BASE_URL}/api/v1/users/${userId}`, options);

    return true; // Retourne true si la suppression est réussie
  } catch (err) {
    // Gestion des erreurs
    console.error("Erreur lors de la suppression de l'utilisateur :", err);
    return false; // Retourne false en cas d'échec
  }
};
