import { useEffect } from 'react';
import User from '../../../context/userContext';
import { setPageTitle } from '../../../utils/pageHead';
import SideNavItem from '../../sideNavItem/sideNavItem.component';
import UserAccountSettings from './userAccountSettings.component';
import UserPasswordUpdate from './userPasswordUpdate.component';

// ==========================
// Composant UserProfile
// ==========================

const UserProfile = () => {
  const { userInfo } = User(); // Récupération des informations utilisateur depuis le contexte

  // Définition du titre de la page lors du montage du composant
  useEffect(() => setPageTitle('Trip | Profil'), []);

  return (
    <main className='bg-tertiaryBg min-h-screen p-8 lg:p-16'>
      {/* Conteneur principal pour la section profil */}
      <div className='bg-primaryBg shadow-lg rounded-2xl flex flex-col lg:flex-row'>
        {/* Barre latérale de navigation */}
        <nav className='bg-accentBg p-10 lg:p-12 w-full lg:w-1/3 rounded-2xl lg:rounded-r-none'>
          <ul className='space-y-6'>
            {/* Liens de navigation pour les paramètres utilisateur */}
            <SideNavItem link='/me' text='Paramètres' icon='settings' />
            <SideNavItem link='/bookings' text='Mes réservations' icon='basket' />
            <SideNavItem link='/reviews' text='Mes avis' icon='star' />
          </ul>
          {/* Section Administration visible uniquement pour les administrateurs */}
          {userInfo.role === 'admin' && (
            <div className='mt-12'>
              <h5 className='text-xl lg:text-2xl uppercase text-textLight border-b border-textLight pb-3 mb-6'>
                Administration
              </h5>
              <ul className='space-y-6'>
                <SideNavItem link='/admin/manage-tours' text='Gérer les tours' icon='map' />
                <SideNavItem
                  link='/admin/manage-users'
                  text='Gérer les utilisateurs'
                  icon='users'
                />
                <SideNavItem link='/admin/manage-reviews' text='Gérer les avis' icon='star' />
                <SideNavItem
                  link='/admin/manage-bookings'
                  text='Gérer les réservations'
                  icon='basket'
                />
              </ul>
            </div>
          )}
        </nav>

        {/* Contenu principal pour les paramètres utilisateur */}
        <div className='w-full lg:w-2/3 p-10 lg:p-16'>
          {/* Composant pour les paramètres de compte utilisateur */}
          <UserAccountSettings userInfo={userInfo} />
          {/* Ligne de séparation */}
          <div className='border-t border-accentHover my-12' />
          {/* Composant pour la mise à jour du mot de passe */}
          <UserPasswordUpdate />
        </div>
      </div>
    </main>
  );
};

export default UserProfile;
