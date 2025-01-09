import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllTours, deleteTour } from '../../../api/tours';
import { showToast } from '../../../utils/alert';
import Loader from '../../loader/loader.component';
import {
  FaStar,
  FaClock,
  FaMountain,
  FaMapMarkerAlt,
  FaRegFlag,
  FaRegCalendar,
  FaRegUser,
} from 'react-icons/fa';
import { SERVER_BASE_URL } from '../../../constants/serverConstants';
import { translateDifficulty } from '../../../utils/translate';

// =======================
// Composant AdminTours
// =======================

const AdminTours = () => {
  // Gestion des états pour les tours, le chargement et la modal de suppression
  const [tours, setTours] = useState([]); // Liste des tours
  const [loading, setLoading] = useState(true); // Indique si les données sont en cours de chargement
  const [deleteModalOpen, setDeleteModalOpen] = useState(false); // Gestion de l'affichage de la modal de suppression
  const [currentTour, setCurrentTour] = useState(null); // Tour sélectionné pour suppression

  // Chargement des tours lors de l'initialisation du composant
  useEffect(() => {
    (async () => {
      try {
        const fetchedTours = await getAllTours(); // Récupération de tous les tours
        setTours(fetchedTours || []);
      } catch (err) {
        showToast('error', 'Erreur lors du chargement des tours.');
      } finally {
        setLoading(false); // Indique que le chargement est terminé
      }
    })();
  }, []);

  // Ouverture de la modal de suppression pour un tour
  const openDeleteModal = tour => {
    setCurrentTour(tour);
    setDeleteModalOpen(true);
  };

  // Fermeture de la modal de suppression
  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setCurrentTour(null);
  };

  // Gestion de la suppression d'un tour
  const handleDeleteTour = async () => {
    if (!currentTour) return;
    const success = await deleteTour(currentTour._id); // Suppression du tour via l'API
    if (success) {
      setTours(prev => prev.filter(tour => tour._id !== currentTour._id)); // Mise à jour de la liste des tours
      showToast('success', 'Tour supprimé avec succès.');
      closeDeleteModal();
    } else {
      showToast('error', 'Erreur lors de la suppression du tour.');
    }
  };

  return (
    <div className='py-12 mt-8 space-y-6'>
      {/* Loader pendant le chargement des données */}
      {loading && (
        <div className='loader-wrapper'>
          <Loader />
        </div>
      )}

      {/* Message si aucun tour n'est disponible */}
      {!loading && tours.length === 0 && (
        <div className='text-center mt-20 text-4xl text-textColor'>
          Aucun tour disponible pour le moment.
        </div>
      )}

      {/* Affichage des tours */}
      {!loading && tours.length > 0 && (
        <div className='py-12'>
          <div className='flex flex-wrap gap-8 justify-center items-center max-w-[160rem] mx-auto md:grid md:grid-cols-2 lg:grid-cols-3 lg:gap-12'>
            {tours.map(tour => (
              <div
                key={tour._id}
                className='flex flex-col rounded-lg overflow-hidden shadow-md bg-primaryBg mx-auto w-full max-w-lg sm:max-w-xl lg:max-w-2xl'>
                {/* En-tête avec le nom du tour */}
                <div className='bg-secondaryBg text-textColor text-center uppercase py-8 px-6 text-xl sm:text-2xl font-bold'>
                  {tour.name}
                </div>
                {/* Image du tour */}
                <div className='relative h-64 sm:h-72 lg:h-80 clip-path-card'>
                  <div className='absolute inset-0 bg-gradient-to-br from-gray-700/70 to-gray-400/70' />
                  <img
                    className='w-full h-full object-cover'
                    src={`${SERVER_BASE_URL}/img/tours/${tour.imageCover}`}
                    alt={tour.name}
                  />
                </div>
                {/* Détails du tour */}
                <div className='flex flex-col flex-grow p-6 sm:p-8'>
                  <p className='text-lg sm:text-xl lg:text-2xl italic text-textColor leading-relaxed mb-4 sm:mb-6 h-16 sm:h-20 lg:h-24 mt-2 overflow-hidden'>
                    {tour.summary}
                  </p>
                  {/* Informations supplémentaires sur le tour */}
                  <div className='grid grid-cols-2 gap-4 sm:gap-6'>
                    {[
                      {
                        icon: <FaClock className='h-6 w-6 sm:h-7 sm:w-7' />,
                        text: `${tour.duration} jours`,
                      },
                      {
                        icon: <FaMountain className='h-6 w-6 sm:h-7 sm:w-7' />,
                        text: translateDifficulty(tour.difficulty),
                      },
                      {
                        icon: <FaMapMarkerAlt className='h-6 w-6 sm:h-7 sm:w-7' />,
                        text: tour.startLocation?.description,
                      },
                      {
                        icon: <FaRegFlag className='h-6 w-6 sm:h-7 sm:w-7' />,
                        text: `${tour.locations.length} étapes`,
                      },
                      {
                        icon: <FaRegCalendar className='h-6 w-6 sm:h-7 sm:w-7' />,
                        text: new Date(tour.startDates[0])
                          .toLocaleString('fr-FR', { month: 'long', year: 'numeric' })
                          .replace(/^\w/, c => c.toUpperCase()),
                      },
                      {
                        icon: <FaRegUser className='h-6 w-6 sm:h-7 sm:w-7' />,
                        text: `${tour.maxGroupSize} personnes`,
                      },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className='flex items-center text-base sm:text-lg lg:text-xl mb-1'>
                        {item.icon}
                        <span className='ml-3'>{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Footer avec les actions disponibles */}
                <div className='bg-secondaryBg flex justify-between items-center p-6 sm:p-8 lg:p-10 mt-2'>
                  <div>
                    <p className='text-base sm:text-lg lg:text-xl font-bold'>
                      {tour.price} <span className='text-textColor'>€ par personne</span>
                    </p>
                    <p className='flex items-center text-base sm:text-lg mt-2'>
                      <span className='font-bold'>{tour.ratingsAverage}</span>
                      <span className='ml-2 flex items-center text-textColor'>
                        <FaStar className='ml-1' />
                        <span className='ml-1'>({tour.ratingsQuantity})</span>
                      </span>
                    </p>
                  </div>
                  <Link
                    className='bg-accentBg hover:bg-accentHover text-textColor text-base sm:text-lg lg:text-1.5xl py-3 px-6 sm:py-4 sm:px-8 rounded transition'
                    to={`/tour/${tour.slug}`}>
                    Détails
                  </Link>
                  <button
                    onClick={() => openDeleteModal(tour)}
                    className='bg-accentBg hover:bg-accentHover text-textColor text-base sm:text-lg lg:text-1.5xl py-3 px-6 sm:py-4 sm:px-8 rounded transition'>
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
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
              Êtes-vous sûr de vouloir supprimer ce tour ?
            </p>
            <div className='flex justify-center gap-x-12'>
              <button
                onClick={handleDeleteTour}
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

export default AdminTours;
