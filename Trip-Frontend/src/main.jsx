import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { UserProvider } from './context/userContext';
// Importation des styles globaux
import './App.css';

// ==========================
// Point d'entrée de l'application
// ==========================

// Montre l'application React dans l'élément HTML ayant l'id "root"
ReactDOM.createRoot(document.getElementById('root')).render(
  // Fournit un contexte de navigation avec BrowserRouter
  <BrowserRouter>
    {/* Active des vérifications strictes pour détecter les problèmes potentiels */}
    <React.StrictMode>
      {/* Fournit le contexte utilisateur à tous les composants de l'application */}
      <UserProvider>
        {/* Composant principal contenant la structure de l'application */}
        <App />
      </UserProvider>
    </React.StrictMode>
  </BrowserRouter>
);
