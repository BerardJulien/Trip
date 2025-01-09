import { useState } from 'react';
import { Link } from 'react-router-dom';
import { bookTour } from '../../../api/stripe';
import User from '../../../context/userContext';
import logo from '../../../assets/img/logo.png';

// =======================
// Composant TourCta
// =======================

const TourCta = ({ tourId }) => {
  const [creatingCheckout, setCreatingCheckout] = useState(false); // État pour gérer le processus de checkout
  const { isUserLoggedIn } = User(); // Vérifie si l'utilisateur est connecté

  // Fonction pour initier le processus de réservation
  const buyTour = async e => {
    setCreatingCheckout(true); // Active l'état "Traitement"
    const sessionUrl = await bookTour(e.target.dataset.tourId); // Appelle l'API pour obtenir l'URL de session
    setCreatingCheckout(false); // Désactive l'état "Traitement"

    if (sessionUrl) {
      window.open(sessionUrl, '_blank'); // Ouvre la page de paiement dans un nouvel onglet
    }
  };

  return (
    <section className='bg-tertiaryBg px-4 md:px-16 py-20 md:py-32 lg:py-40'>
      <div className='w-full max-w-[115rem] mx-auto bg-primaryBg p-12 md:p-20 lg:p-28 rounded-2xl shadow-lg flex flex-col lg:flex-row items-center gap-12'>
        {/* Logo dans un conteneur circulaire avec un dégradé */}
        <div className='flex-shrink-0 flex items-center justify-center h-64 w-64 rounded-full bg-gradient-to-br from-accentBg to-accentHover'>
          <img src={logo} alt='Trip logo' className='h-5/6 object-contain' />
        </div>
        {/* Texte d'appel à l'action */}
        <div className='flex-grow text-center lg:text-left'>
          <h2 className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-textLight uppercase mb-4'>
            Qu'attendez-vous ?
          </h2>
          <p className='text-base sm:text-lg md:text-2xl lg:text-3xl text-textColor leading-relaxed'>
            Un monde d’aventure en quelques jours. Des souvenirs pour la vie. Vivez-le dès
            maintenant !
          </p>
        </div>
        {/* Bouton pour réserver ou lien vers la connexion */}
        <div className='flex-shrink-0'>
          {isUserLoggedIn ? (
            // Bouton de réservation pour les utilisateurs connectés
            <button
              className='bg-accentBg hover:bg-accentHover text-textColor text-xl md:text-2xl py-7 px-12 rounded-md transition font-semibold'
              data-tour-id={tourId}
              onClick={buyTour}>
              {creatingCheckout ? 'Traitement...' : 'Réserver !'}
            </button>
          ) : (
            // Lien vers la page de connexion pour les utilisateurs non connectés
            <Link
              className='bg-accentBg hover:bg-accentHover text-textColor text-xl md:text-2xl py-7 px-12 rounded-md transition font-semibold text-center'
              to='/login'>
              Se connecter pour réserver
            </Link>
          )}
        </div>
      </div>
    </section>
  );
};

export default TourCta;
