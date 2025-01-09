import { useEffect } from 'react';
import { setPageTitle } from '../../utils/pageHead';

// =======================
// Composant ErrorPage
// =======================

const ErrorPage = ({ message }) => {
  // Effet pour mettre à jour le titre de la page au montage du composant
  useEffect(() => {
    setPageTitle('Erreur | Trip'); // Définit le titre de la page
  }, []); // Le tableau de dépendances vide garantit que l'effet s'exécute une seule fois

  return (
    <div className='py-12 mt-8 space-y-6'>
      <div className='text-center mt-20 text-4xl text-textColor'>
        {/* Affiche un titre d'erreur */}
        <h2 className='font-bold text-textLight mb-4'>Quelque chose a mal tourné ! 🤯</h2>
        {/* Affiche le message d'erreur passé en prop */}
        <p>{message}</p>
      </div>
    </div>
  );
};

export default ErrorPage;
