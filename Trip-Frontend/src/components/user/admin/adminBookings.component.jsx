import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getBookedToursAdmin, deleteBookingAdmin } from '../../../api/bookings';
import Loader from '../../loader/loader.component';
import { showToast } from '../../../utils/alert';
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
// Composant AdminBookings
// =======================

const AdminBookings = () => {
  // Gestion des états pour les réservations, le chargement et la modal
  const [bookings, setBookings] = useState([]); // Liste des réservations
  const [loading, setLoading] = useState(true); // Indique si les données sont en cours de chargement
  const [deleteModalOpen, setDeleteModalOpen] = useState(false); // Gestion de l'affichage de la modal de suppression
  const [currentBooking, setCurrentBooking] = useState(null); // Réservation sélectionnée pour suppression

  // Chargement initial des réservations
  useEffect(() => {
    (async () => {
      try {
        const allBookings = await getBookedToursAdmin(); // Récupération des réservations
        setTimeout(() => setLoading(false), 1000); // Simule un délai de chargement pour l'expérience utilisateur
        if (allBookings) setBookings(allBookings || []);
      } catch (err) {
        console.error('Erreur lors du chargement des réservations :', err);
        setLoading(false); // Arrête le chargement même en cas d'erreur
      }
    })();
  }, []);

  // Ouverture de la modal de suppression pour une réservation
  const openDeleteModal = booking => {
    setCurrentBooking(booking);
    setDeleteModalOpen(true);
  };

  // Fermeture de la modal de suppression
  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setCurrentBooking(null);
  };

  // Gestion de la suppression d'une réservation
  const handleDelete = async () => {
    if (!currentBooking) return;

    const response = await deleteBookingAdmin(currentBooking._id); // Suppression via l'API
    if (response) {
      setBookings(prev => prev.filter(booking => booking._id !== currentBooking._id)); // Mise à jour de la liste
      showToast('success', 'Réservation supprimée avec succès');
      closeDeleteModal();
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

      {/* Message si aucune réservation n'est trouvée */}
      {!loading && bookings.length === 0 && (
        <div className='text-center mt-20 text-4xl text-textColor'>Aucune réservation trouvée.</div>
      )}

      {/* Affichage des réservations */}
      {!loading && bookings.length > 0 && (
        <div className='py-12'>
          <div className='flex flex-wrap gap-8 justify-center items-center max-w-[160rem] mx-auto md:grid md:grid-cols-2 lg:grid-cols-3 lg:gap-12'>
            {bookings.map(booking => (
              <div
                key={booking._id}
                className='flex flex-col rounded-lg overflow-hidden shadow-md bg-primaryBg mx-auto w-full max-w-lg sm:max-w-xl lg:max-w-2xl'>
                {/* En-tête avec le nom du tour */}
                <div className='bg-secondaryBg text-textColor text-center uppercase py-8 px-6 text-xl sm:text-2xl font-bold'>
                  {booking.tour.name}
                </div>
                {/* Image du tour */}
                <div className='relative h-64 sm:h-72 lg:h-80 clip-path-card'>
                  <div className='absolute inset-0 bg-gradient-to-br from-gray-700/70 to-gray-400/70' />
                  <img
                    className='w-full h-full object-cover'
                    src={`${SERVER_BASE_URL}/img/tours/${booking.tour.imageCover}`}
                    alt={booking.tour.name}
                  />
                </div>
                {/* Détails du tour */}
                {/* <div className='flex flex-col flex-grow p-6 sm:p-8'>
                  <p className='text-lg sm:text-xl lg:text-2xl italic text-textColor leading-relaxed mb-4 sm:mb-6 h-16 sm:h-20 lg:h-24 mt-2 overflow-hidden'>
                    {booking.tour.summary}
                  </p>
                  <div className='grid grid-cols-2 gap-4 sm:gap-6'>
                    {[
                      {
                        icon: <FaClock className='h-6 w-6 sm:h-7 sm:w-7' />,
                        text: `${booking.tour.duration} jours`,
                      },
                      {
                        icon: <FaMountain className='h-6 w-6 sm:h-7 sm:w-7' />,
                        text: translateDifficulty(booking.tour.difficulty),
                      },
                      {
                        icon: <FaMapMarkerAlt className='h-6 w-6 sm:h-7 sm:w-7' />,
                        text: booking.tour.startLocation?.description,
                      },
                      {
                        icon: <FaRegFlag className='h-6 w-6 sm:h-7 sm:w-7' />,
                        text: `${booking.tour.locations.length} étapes`,
                      },
                      {
                        icon: <FaRegCalendar className='h-6 w-6 sm:h-7 sm:w-7' />,
                        text: new Date(booking.tour.startDates[0])
                          .toLocaleString('fr-FR', { month: 'long', year: 'numeric' })
                          .replace(/^\w/, c => c.toUpperCase()),
                      },
                      {
                        icon: <FaRegUser className='h-6 w-6 sm:h-7 sm:w-7' />,
                        text: `${booking.tour.maxGroupSize} personnes`,
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
                </div> */}

                {/* Ligne de séparation */}
                {/* <div className='my-4 border-t border-accentBg' /> */}

                {/* Informations sur l'utilisateur ayant réservé */}
                <div className='grid grid-cols-2 gap-4 sm:gap-6 p-6 sm:p-8 mt-6 mb-6'>
                  <div className='col-span-2 flex items-center gap-6'>
                    <img
                      className='w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover'
                      src={`${SERVER_BASE_URL}/img/users/${booking.user.photo}`}
                      alt={booking.user.name}
                    />
                    <p className='text-xl sm:text-2xl text-textColor'>
                      Réservé par : <span>{booking.user.name}</span>
                    </p>
                  </div>
                  <p className='col-span-2 text-xl sm:text-2xl text-textColor'>
                    Email : <span>{booking.user.email}</span>
                  </p>
                  <p className='col-span-2 text-xl sm:text-2xl text-textColor'>
                    Date de réservation :{' '}
                    <span>{new Date(booking.createdAt).toLocaleDateString('fr-FR')}</span>
                  </p>
                </div>
                {/* Footer avec les actions disponibles */}
                <div className='bg-secondaryBg flex justify-between items-center p-6 sm:p-8 lg:p-10 mt-2'>
                  <div>
                    <p className='text-base sm:text-lg lg:text-xl font-bold'>
                      {booking.tour.price} <span className='text-textColor'>€ par personne</span>
                    </p>
                    <p className='flex items-center text-base sm:text-lg mt-2'>
                      <span className='font-bold'>{booking.tour.ratingsAverage}</span>
                      <span className='ml-2 flex items-center text-textColor'>
                        <FaStar className='ml-1' />
                        <span className='ml-1'>({booking.tour.ratingsQuantity})</span>
                      </span>
                    </p>
                  </div>
                  <Link
                    className='bg-accentBg hover:bg-accentHover text-textColor text-base sm:text-lg lg:text-1.5xl py-3 px-6 sm:py-4 sm:px-8 rounded transition'
                    to={`/tour/${booking.tour.slug}`}>
                    Détails
                  </Link>
                  <button
                    onClick={() => openDeleteModal(booking)}
                    className='bg-accentBg hover:bg-accentHover text-textColor text-base sm:text-lg lg:text-1.5xl py-3 px-6 sm:py-4 sm:px-8 rounded transition'>
                    Annuler
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
              Confirmer l'annulation
            </h3>
            <p className='text-textColor text-3xl flex items-center justify-center mb-14'>
              Êtes-vous sûr de vouloir annuler cette réservation ?
            </p>
            <div className='flex justify-center gap-x-12'>
              <button
                onClick={handleDelete}
                className='bg-accentBg hover:bg-accentHover text-textLight py-4 px-12 rounded-md text-xl sm:text-2xl transition min-w-[9rem]'>
                Annuler la réservation
              </button>
              <button
                onClick={closeDeleteModal}
                className='bg-accentBg hover:bg-accentHover text-textLight py-4 px-12 rounded-md text-xl sm:text-2xl transition min-w-[9rem]'>
                Retour
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBookings;
