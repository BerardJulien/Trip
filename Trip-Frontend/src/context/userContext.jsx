import { createContext, useContext, useReducer } from 'react';

// =============================
// Initialisation et constantes
// =============================

// Objet utilisateur vide par défaut
const EMPTY_USER_OBJECT = {
  userInfo: {
    _id: '', // Identifiant unique de l'utilisateur
    name: '', // Nom de l'utilisateur
    email: '', // Email de l'utilisateur
    photo: '', // URL de la photo de l'utilisateur
    role: '', // Rôle de l'utilisateur (e.g., 'admin', 'user')
  },
};

// Récupère les informations utilisateur depuis le localStorage ou initialise avec un objet vide
const INITIAL_USER_STATE = JSON.parse(localStorage.getItem('userInfo')) || EMPTY_USER_OBJECT;

// Types d'actions possibles pour le reducer utilisateur
const USER_REDUCER_ACTION_TYPES = {
  SET_USER_INFO: 'SET_USER_INFO', // Action pour définir les informations utilisateur
};

// Création du contexte utilisateur avec l'état initial
const UserContext = createContext(INITIAL_USER_STATE);

// =======================
// Reducer utilisateur
// =======================

// Fonction reducer pour gérer les actions liées à l'utilisateur
const userReducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    // Action pour mettre à jour les informations utilisateur
    case USER_REDUCER_ACTION_TYPES.SET_USER_INFO:
      return { ...state, ...payload };

    // Gestion des types d'action non définis
    default:
      throw new Error(`Type d'action non défini : ${type} dans userReducer`);
  }
};

// =========================
// Provider utilisateur
// =========================

// Composant fournisseur pour encapsuler les enfants avec le contexte utilisateur
export const UserProvider = ({ children }) => {
  // Initialisation du state utilisateur avec useReducer
  const [{ userInfo }, dispatch] = useReducer(userReducer, INITIAL_USER_STATE);

  // Fonction pour définir les informations utilisateur et les sauvegarder dans le localStorage
  const setUserInfo = data => {
    localStorage.setItem('userInfo', JSON.stringify({ userInfo: data })); // Mise à jour dans le localStorage

    dispatch({
      type: USER_REDUCER_ACTION_TYPES.SET_USER_INFO, // Type d'action
      payload: {
        userInfo: data, // Nouvelles informations utilisateur
      },
    });
  };

  // Fonction pour supprimer les informations utilisateur
  const removeUser = () => {
    localStorage.removeItem('userInfo'); // Suppression des informations utilisateur
    localStorage.removeItem('jwt'); // Suppression du token JWT

    dispatch({
      type: USER_REDUCER_ACTION_TYPES.SET_USER_INFO, // Réinitialisation des informations utilisateur
      payload: EMPTY_USER_OBJECT,
    });
  };

  // Vérifie si l'utilisateur est connecté en fonction du token JWT
  const isUserLoggedIn = !!localStorage.getItem('jwt');

  // Si l'utilisateur n'est pas connecté mais a des informations en mémoire, les supprimer
  if (!isUserLoggedIn && userInfo._id) removeUser();

  // Valeurs exposées via le contexte
  const value = { userInfo, isUserLoggedIn, setUserInfo, removeUser };

  // Fournit le contexte utilisateur aux composants enfants
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

// ======================
// Hook utilisateur
// ======================

// Hook personnalisé pour consommer le contexte utilisateur
const User = () => useContext(UserContext);

export default User;
