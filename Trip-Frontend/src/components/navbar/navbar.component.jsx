import { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Menu, X, LogIn, LogOut, UserPlus } from 'lucide-react';
import { userLogout } from '../../api/auth';
import { SERVER_BASE_URL } from '../../constants/serverConstants';
import User from '../../context/userContext';

// =======================
// Composant Navbar
// =======================

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Gère l'état du menu mobile
  const { userInfo, isUserLoggedIn, removeUser } = User(); // Contexte utilisateur
  const history = useHistory(); // Utilisé pour la navigation

  // Gère l'affichage du menu en fonction de la taille de la fenêtre
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsMenuOpen(false);
    };

    window.addEventListener('resize', handleResize); // Ajoute un écouteur d'événement pour la redimension de la fenêtre
    return () => window.removeEventListener('resize', handleResize); // Nettoyage
  }, []);

  // Gère la déconnexion de l'utilisateur
  const handleUserLogout = () => {
    userLogout(); // Appelle la fonction de déconnexion
    removeUser(); // Supprime l'utilisateur du contexte
    history.push('/login'); // Redirige vers la page de connexion
  };

  return (
    <header className='bg-secondaryBg h-32 px-8 relative z-50 flex justify-between items-center'>
      {/* Lien vers la page d'accueil */}
      <nav className='flex items-center flex-[0_1_40%]'>
        <Link className='text-textColor uppercase text-2xl no-underline font-normal' to='/'>
          Accueil
        </Link>
      </nav>

      {/* Bouton pour le menu mobile */}
      <button
        className='md:hidden text-textColor'
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label='Menu mobile'>
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Navigation principale */}
      <nav
        className={`flex items-center flex-[0_1_40%] justify-end ${
          isMenuOpen
            ? 'md:flex absolute top-full left-0 right-0 bg-primaryBg border-t border-primaryBg/10'
            : 'hidden md:flex'
        }`}>
        {isUserLoggedIn ? (
          <div className='flex items-center gap-4 md:flex-row flex-row-reverse w-full md:w-auto justify-between md:justify-start px-8 md:px-0'>
            {/* Bouton de déconnexion */}
            <button
              className='text-textColor uppercase text-2xl inline-flex items-center font-normal h-32 md:h-auto ml-4 md:ml-0'
              onClick={handleUserLogout}
              aria-label='Déconnexion'>
              <LogOut size={20} />
            </button>
            {/* Lien vers le profil utilisateur */}
            <Link
              className='text-textColor uppercase text-2xl inline-flex items-center font-normal gap-4 h-32 md:h-auto'
              to='/me'>
              <img
                className='h-14 w-14 rounded-full md:ml-6 ml-0'
                src={`${SERVER_BASE_URL}/img/users/${userInfo.photo}`}
                alt={userInfo.name.split(' ')[0]}
              />
              <span>{userInfo.name.split(' ')[0]}</span>
            </Link>
          </div>
        ) : (
          <div className='flex items-center gap-8 md:flex-row flex-row-reverse w-full md:w-auto justify-between md:justify-start px-8 md:px-0'>
            {/* Lien vers la page de connexion */}
            <Link
              className='text-textColor uppercase text-2xl inline-flex items-center font-normal h-32 md:h-auto'
              to='/login'
              aria-label='Connexion'>
              <LogIn size={20} />
            </Link>
            {/* Lien vers la page d'inscription */}
            <Link
              className='text-textColor uppercase text-2xl inline-flex items-center font-normal h-32 md:h-auto'
              to='/signup'
              aria-label='Inscription'>
              <UserPlus size={20} />
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
