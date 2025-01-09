import axios from 'axios';
import { SERVER_BASE_URL } from '../constants/serverConstants';
import { handleErrorToast, showToast } from '../utils/alert';

// =======================
// Fonction pour inscrire un nouvel utilisateur
// =======================

export const userSignup = async formData => {
  try {
    // Envoi des données du formulaire d'inscription au backend
    const { data: signupData } = await axios.post(
      `${SERVER_BASE_URL}/api/v1/users/signup`, // Endpoint d'inscription
      formData // Données du formulaire
    );

    // Si l'inscription réussit
    if (signupData.status === 'success') {
      showToast('success', 'Inscription réussie'); // Affiche un toast de succès
      localStorage.setItem('jwt', signupData.token); // Stocke le token JWT dans le localStorage
      return signupData.data.user; // Retourne les informations de l'utilisateur
    }
  } catch (err) {
    // Gestion des erreurs (ex : email déjà utilisé)
    handleErrorToast(err); // Affiche un toast d'erreur
  }
};

// =======================
// Fonction pour connecter un utilisateur
// =======================

export const userLogin = async (email, password) => {
  try {
    // Envoi des informations de connexion au backend
    const { data: loginData } = await axios.post(`${SERVER_BASE_URL}/api/v1/users/login`, {
      email, // Email de l'utilisateur
      password, // Mot de passe de l'utilisateur
    });

    // Si la connexion réussit
    if (loginData.status === 'success') {
      showToast('success', 'Connexion réussie'); // Affiche un toast de succès
      localStorage.setItem('jwt', loginData.token); // Stocke le token JWT dans le localStorage
      return loginData.data.user; // Retourne les informations de l'utilisateur
    }
  } catch (err) {
    // Gestion des erreurs (ex : email ou mot de passe incorrect)
    handleErrorToast(err); // Affiche un toast d'erreur
  }
};

// =======================
// Fonction pour déconnecter un utilisateur
// =======================

export const userLogout = async () => {
  try {
    // Envoi de la requête de déconnexion au backend
    const { data } = await axios.get(`${SERVER_BASE_URL}/api/v1/users/logout`);

    // Si la déconnexion réussit
    if (data.status === 'success') {
      showToast('success', 'Déconnexion réussie'); // Affiche un toast de succès
    }
  } catch (err) {
    // Gestion des erreurs (ex : problème serveur)
    handleErrorToast(err); // Affiche un toast d'erreur
  }
};
