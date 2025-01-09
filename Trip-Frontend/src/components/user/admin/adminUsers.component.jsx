import { useState, useEffect } from 'react';
import { getAllUsers, deleteUser } from '../../../api/users';
import Loader from '../../loader/loader.component';
import { showToast } from '../../../utils/alert';
import { SERVER_BASE_URL } from '../../../constants/serverConstants';
import { translateRole } from '../../../utils/translate';

// =======================
// Composant AdminUsers
// =======================

const AdminUsers = () => {
  // Gestion des états pour les utilisateurs, les rôles, le chargement et la modal
  const [users, setUsers] = useState([]); // Liste des utilisateurs affichés
  const [allUsers, setAllUsers] = useState([]); // Liste complète des utilisateurs
  const [selectedRole, setSelectedRole] = useState(''); // Filtre par rôle
  const [loading, setLoading] = useState(true); // Indique si les données sont en cours de chargement
  const [deleteModalOpen, setDeleteModalOpen] = useState(false); // Gère l'affichage de la modal de suppression
  const [currentUser, setCurrentUser] = useState(null); // Utilisateur sélectionné pour suppression

  // Ordre de tri des rôles
  const roleOrder = ['admin', 'lead-guide', 'guide', 'user'];

  // Fonction pour trier les utilisateurs selon l'ordre des rôles
  const sortByRoleOrder = users => {
    return users.sort((a, b) => {
      const roleIndexA = roleOrder.indexOf(a.role);
      const roleIndexB = roleOrder.indexOf(b.role);
      return roleIndexA - roleIndexB;
    });
  };

  // Chargement initial des utilisateurs
  useEffect(() => {
    (async () => {
      try {
        const allUsersData = await getAllUsers(); // Récupération des utilisateurs
        const sortedUsers = sortByRoleOrder(allUsersData?.data || []); // Tri des utilisateurs
        setAllUsers(sortedUsers);
        setUsers(sortedUsers);
      } catch (err) {
        console.error('Erreur lors du chargement des utilisateurs :', err);
        showToast('error', 'Erreur lors du chargement des utilisateurs.');
      } finally {
        setLoading(false); // Arrête le chargement
      }
    })();
  }, []);

  // Filtrage et tri des utilisateurs selon le rôle sélectionné
  useEffect(() => {
    if (selectedRole) {
      const filteredUsers = allUsers.filter(user => user.role === selectedRole); // Filtrage par rôle
      setUsers(filteredUsers);
    } else {
      const sortedUsers = sortByRoleOrder([...allUsers]); // Tri des utilisateurs
      setUsers(sortedUsers);
    }
  }, [selectedRole, allUsers]);

  // Ouverture de la modal de suppression pour un utilisateur
  const openDeleteModal = user => {
    setCurrentUser(user);
    setDeleteModalOpen(true);
  };

  // Fermeture de la modal de suppression
  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setCurrentUser(null);
  };

  // Gestion de la suppression d'un utilisateur
  const handleDeleteUser = async () => {
    if (!currentUser) return;

    try {
      const success = await deleteUser(currentUser._id); // Suppression via l'API
      if (success) {
        const updatedAllUsers = allUsers.filter(user => user._id !== currentUser._id); // Mise à jour de la liste des utilisateurs
        setAllUsers(updatedAllUsers);
        if (selectedRole) {
          const filteredUsers = updatedAllUsers.filter(user => user.role === selectedRole); // Mise à jour après filtrage
          setUsers(filteredUsers);
        } else {
          const sortedUsers = sortByRoleOrder([...updatedAllUsers]); // Mise à jour après tri
          setUsers(sortedUsers);
        }
        showToast('success', 'Utilisateur supprimé avec succès.');
        closeDeleteModal();
      }
    } catch (err) {
      console.error("Erreur lors de la suppression de l'utilisateur :", err);
      showToast('error', "Erreur lors de la suppression de l'utilisateur.");
    }
  };

  return (
    <div className='py-12 mt-8 space-y-6'>
      {/* Filtre par rôle */}
      <div className='mb-16 flex justify-center'>
        <select
          id='role-filter'
          value={selectedRole}
          onChange={e => setSelectedRole(e.target.value)}
          className='bg-secondaryBg text-textColor p-4 rounded-lg text-xl lg:text-2xl w-full max-w-md'>
          <option value=''>Tous les rôles</option>
          <option value='admin'>Administrateur</option>
          <option value='lead-guide'>Guide principal</option>
          <option value='guide'>Guide</option>
          <option value='user'>Utilisateur</option>
        </select>
      </div>

      {/* Loader pendant le chargement */}
      {loading && (
        <div className='loader-wrapper'>
          <Loader />
        </div>
      )}

      {/* Message si aucun utilisateur n'est trouvé */}
      {!loading && users.length === 0 && (
        <div className='text-center mt-20 text-4xl text-textColor'>Aucun utilisateur trouvé.</div>
      )}

      {/* Affichage des utilisateurs */}
      {!loading && users.length > 0 && (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-8'>
          {users.map(user => (
            <div
              key={user._id}
              className='flex flex-col rounded-xl shadow-xl bg-secondaryBg mx-auto w-full max-w-[45rem] mb-2 h-full'>
              {/* En-tête avec le nom de l'utilisateur */}
              <div className='bg-accentHover text-textLight text-center uppercase py-4 sm:py-6 text-xl sm:text-2xl font-bold'>
                {user.name}
              </div>
              {/* Image de l'utilisateur */}
              <div className='flex flex-col items-center p-8 sm:p-12 flex-grow'>
                <img
                  className='h-32 w-32 sm:h-40 sm:w-40 rounded-full object-cover mb-4 sm:mb-6'
                  src={`${SERVER_BASE_URL}/img/users/${user.photo}`}
                  alt={user.name}
                />
              </div>
              {/* Détails de l'utilisateur */}
              <div className='flex flex-col items-center px-6 py-4 sm:px-8 sm:py-6 lg:px-10'>
                <p className='text-textColor text-xl sm:text-1.5xl lg:text-2xl font-bold mb-2'>
                  Email :{' '}
                  <span className='text-textColor text-lg sm:text-xl lg:text-1.5xl'>
                    {user.email}
                  </span>
                </p>
                <p className='text-textColor text-xl sm:text-1.5xl lg:text-2xl font-bold mt-4 mb-2'>
                  Rôle :{' '}
                  <span className='text-textColor text-lg sm:text-xl lg:text-1.5xl capitalize'>
                    {translateRole(user.role)}
                  </span>
                </p>
              </div>
              {/* Bouton de suppression */}
              <div className='p-6 sm:p-8'>
                <div className='flex gap-4 justify-center'>
                  <button
                    onClick={() => openDeleteModal(user)}
                    className='bg-accentBg hover:bg-accentHover text-textColor text-base sm:text-lg lg:text-1.5xl py-3 px-6 sm:py-4 sm:px-8 rounded transition'>
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de confirmation de suppression */}
      {deleteModalOpen && (
        <div className='overlay-modal'>
          <div className='bg-primaryBg p-8 sm:p-12 rounded-lg w-[95%] max-w-4xl'>
            <h3 className='text-4xl sm:text-5xl text-textLight mb-8 text-center'>
              Confirmer la suppression
            </h3>
            <p className='text-textColor text-3xl flex items-center justify-center mb-14'>
              Êtes-vous sûr de vouloir supprimer cet utilisateur ?
            </p>
            <div className='flex justify-center gap-x-12'>
              <button
                onClick={handleDeleteUser}
                className='bg-accentBg hover:bg-accentHover text-textLight py-4 px-12 rounded-md text-xl sm:text-2xl transition min-w-[9rem]'>
                Supprimer
              </button>
              <button
                onClick={closeDeleteModal}
                className='bg-accentBg hover:bg-accentHover text-textLight py-4 px-12 rounded-md text-xl sm:text-2xl transition min-w-[9rem]'>
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
