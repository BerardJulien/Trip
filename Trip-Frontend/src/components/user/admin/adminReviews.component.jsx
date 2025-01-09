import { useEffect, useState } from 'react';
import { deleteReview, getAllReviews, sortReviewsByTourName } from '../../../api/reviews';
import { getAllTours, getTourNameById } from '../../../api/tours';
import { FaStar } from 'react-icons/fa';
import Loader from '../../loader/loader.component';
import { showToast } from '../../../utils/alert';
import { SERVER_BASE_URL } from '../../../constants/serverConstants';

// =======================
// Composant AdminReviews
// =======================

const AdminReviews = () => {
  // Gestion des états pour les avis, les tours, et les actions utilisateur
  const [reviews, setReviews] = useState([]); // Liste des avis filtrés et affichés
  const [allReviews, setAllReviews] = useState([]); // Tous les avis disponibles
  const [tours, setTours] = useState([]); // Liste des tours disponibles
  const [selectedTour, setSelectedTour] = useState(''); // Filtrage par ID de tour
  const [loading, setLoading] = useState(true); // Indique si les données sont en cours de chargement
  const [deleteModalOpen, setDeleteModalOpen] = useState(false); // Gère l'affichage de la modal de suppression
  const [currentReview, setCurrentReview] = useState(null); // L'avis actuellement sélectionné pour suppression

  // Chargement des avis et des tours lors de l'initialisation du composant
  useEffect(() => {
    const fetchTours = async () => {
      try {
        const allTours = await getAllTours(); // Récupération des données des tours
        setTours(allTours || []);
      } catch (err) {
        console.error('Erreur lors du chargement des tours :', err);
        showToast('error', 'Erreur lors du chargement des tours.');
      }
    };

    const fetchReviews = async () => {
      try {
        const allReviewsData = await getAllReviews(); // Récupération des avis
        setAllReviews(allReviewsData || []);
      } catch (err) {
        console.error('Erreur lors du chargement des avis :', err);
        showToast('error', 'Erreur lors du chargement des avis.');
      } finally {
        setLoading(false);
      }
    };
    fetchTours();
    fetchReviews();
  }, []);

  // Filtrage des avis selon le tour sélectionné
  useEffect(() => {
    if (tours.length > 0 && allReviews.length > 0) {
      if (selectedTour) {
        const filteredReviews = allReviews.filter(review => review.tour === selectedTour);
        setReviews(sortReviewsByTourName(filteredReviews, tours)); // Tri des avis par nom de tour
      } else {
        setReviews(sortReviewsByTourName(allReviews, tours)); // Tous les avis triés par tour
      }
    }
  }, [tours, allReviews, selectedTour]);

  // Gestion de la sélection d'un tour dans le filtre
  const handleTourSelection = async tourId => {
    setSelectedTour(tourId);
    if (!tourId) {
      setReviews(sortReviewsByTourName(allReviews, tours)); // Affichage de tous les avis
      return;
    }
    try {
      const filteredReviews = allReviews.filter(review => review.tour === tourId);
      setReviews(sortReviewsByTourName(filteredReviews, tours));
    } catch (err) {
      console.error('Erreur lors du filtrage des avis :', err);
      showToast('error', 'Erreur lors du filtrage des avis.');
    }
  };

  // Ouverture de la modal de suppression pour un avis
  const openDeleteModal = review => {
    setCurrentReview(review);
    setDeleteModalOpen(true);
  };

  // Fermeture de la modal de suppression
  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setCurrentReview(null);
  };

  // Gestion de la suppression d'un avis
  const handleDelete = async () => {
    if (!currentReview) return;
    try {
      const response = await deleteReview(currentReview._id); // Suppression de l'avis
      if (response) {
        const updatedAllReviews = allReviews.filter(review => review._id !== currentReview._id);
        setAllReviews(updatedAllReviews);
        if (selectedTour) {
          const updatedTourReviews = updatedAllReviews.filter(
            review => review.tour === selectedTour
          );
          setReviews(sortReviewsByTourName(updatedTourReviews, tours));
        } else {
          setReviews(sortReviewsByTourName(updatedAllReviews, tours));
        }
        showToast('success', 'Avis supprimé avec succès');
        closeDeleteModal();
      }
    } catch (err) {
      console.error("Erreur lors de la suppression de l'avis :", err);
      showToast('error', 'Une erreur est survenue lors de la suppression.');
    }
  };

  return (
    <div className='py-12 mt-8 space-y-6'>
      {/* Filtre par tour */}
      <div className='flex justify-center mb-16'>
        <select
          id='tour-filter'
          value={selectedTour}
          onChange={e => handleTourSelection(e.target.value)}
          className='bg-secondaryBg text-textColor p-4 rounded-lg text-xl lg:text-2xl w-full max-w-md'>
          <option value=''>Tous les avis</option>
          {tours.map(tour => (
            <option key={tour._id} value={tour._id}>
              {tour.name}
            </option>
          ))}
        </select>
      </div>

      {/* Loader pour le chargement des données */}
      {loading && (
        <div className='loader-wrapper'>
          <Loader />
        </div>
      )}

      {/* Message si aucun avis n'est trouvé */}
      {!loading && reviews.length === 0 && (
        <div className='text-center mt-20 text-4xl text-textColor'>Aucun avis trouvé.</div>
      )}

      {/* Affichage des avis */}
      {!loading && reviews.length > 0 && (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-8'>
          {reviews.map(review => (
            <div
              key={review._id}
              className='flex flex-col rounded-xl shadow-xl bg-secondaryBg mx-auto w-full max-w-[45rem] mb-8 h-full'>
              {/* Nom de l'utilisateur ayant laissé l'avis */}
              <div className='bg-accentHover text-textLight text-center uppercase py-4 sm:py-6 text-xl sm:text-2xl font-bold'>
                {review.user?.name}
              </div>
              {/* Contenu de l'avis */}
              <div className='flex flex-col items-center p-8 sm:p-12 flex-grow'>
                {review.user?.photo && (
                  <img
                    className='h-32 w-32 sm:h-40 sm:w-40 rounded-full object-cover mb-4 sm:mb-6'
                    src={`${SERVER_BASE_URL}/img/users/${review.user?.photo}`}
                    alt={review.user?.name}
                  />
                )}
                <p className='text-lg sm:text-xl md:text-2xl text-center text-textColor leading-relaxed flex-grow mt-2 mb-4'>
                  {getTourNameById(review.tour, tours)}
                </p>
                <p className='text-lg sm:text-xl md:text-2xl italic text-center text-textColor leading-relaxed flex-grow'>
                  "{review.review}"
                </p>
                {/* Évaluation sous forme d'étoiles */}
                <div className='flex items-center justify-center gap-2 mt-4 sm:mt-5'>
                  {[1, 2, 3, 4, 5].map(star => (
                    <FaStar
                      key={star}
                      className={`h-6 w-6 sm:h-8 sm:w-8 ${
                        review.rating >= star ? 'text-highlightBg' : 'text-textMuted'
                      }`}
                    />
                  ))}
                </div>
              </div>
              {/* Actions disponibles */}
              <div className='p-6 sm:p-8'>
                <div className='flex gap-4 justify-center'>
                  <button
                    onClick={() => openDeleteModal(review)}
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
            <h3 className='text-3xl sm:text-4xl font-bold text-textLight mb-8 text-center'>
              Confirmer la suppression
            </h3>
            <p className='text-textColor text-2xl flex items-center justify-center mb-14'>
              Êtes-vous sûr de vouloir supprimer cet avis ?
            </p>
            <div className='flex justify-center gap-x-12'>
              <button
                onClick={handleDelete}
                className='bg-accentBg hover:bg-accentHover text-textLight py-4 px-12 rounded-md text-lg sm:text-xl lg:text-2xl transition min-w-[9rem]'>
                Supprimer
              </button>
              <button
                onClick={closeDeleteModal}
                className='bg-accentBg hover:bg-accentHover text-textLight py-4 px-12 rounded-md text-lg sm:text-xl lg:text-2xl transition min-w-[9rem]'>
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReviews;
