import { Link, useLocation } from 'react-router-dom';
import { FaRegSun, FaShoppingBasket, FaRegStar, FaRegMap, FaUserFriends } from 'react-icons/fa';
import { BsCreditCard } from 'react-icons/bs';

// =======================
// Composant SideNavItem
// =======================

// Dictionnaire des icônes pour les éléments de navigation
const sideNavIcons = {
  settings: FaRegSun,
  basket: FaShoppingBasket,
  star: FaRegStar,
  card: BsCreditCard,
  map: FaRegMap,
  users: FaUserFriends,
};

// Composant pour afficher une icône
const SideNavIcon = ({ Icon }) => {
  return <Icon className='text-4xl lg:text-5xl text-textLight mr-7' />;
};

// Composant pour afficher un élément de la barre de navigation latérale
const SideNavItem = ({ link, text, icon }) => {
  const location = useLocation(); // Récupère l'URL actuelle
  const isActive = location.pathname === link; // Vérifie si l'élément est actif

  return (
    <li
      className={`${
        isActive ? 'bg-accentHover text-textLight' : 'text-textLight'
      } hover:bg-accentHover hover:text-textLight transition-all duration-200 rounded-xl`}>
      {/* Lien de navigation */}
      <Link
        to={link}
        className='flex items-center py-5 px-8 lg:px-12 text-1.5xl lg:text-2.25xl font-medium'>
        {/* Icône associée à l'élément */}
        <SideNavIcon Icon={sideNavIcons[icon]} />
        {text}
      </Link>
    </li>
  );
};

export default SideNavItem;
