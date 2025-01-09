import { ToastContainer } from 'react-toastify';

// =======================
// Composant Toast
// =======================

const Toast = () => {
  return (
    <ToastContainer
      position='top-center' // Position des toasts sur l'écran
      hideProgressBar={false} // Affiche la barre de progression
      newestOnTop={true} // Affiche les toasts les plus récents en haut
      closeOnClick // Ferme le toast lorsqu'on clique dessus
      rtl={false} // Désactive le mode droite à gauche
      pauseOnHover // Met en pause le toast lorsque l'utilisateur le survole
      theme='dark' // Thème sombre
    />
  );
};

export default Toast;
