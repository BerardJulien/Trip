import { useEffect, useState } from 'react';
import {
  getUserReviews,
  updateReview,
  deleteReview,
  sortReviewsByTourName,
} from '../../../api/reviews';
import { getAllTours, getTourNameById } from '../../../api/tours';
import { FaStar } from 'react-icons/fa';
import { SERVER_BASE_URL } from '../../../constants/serverConstants';
import { showToast } from '../../../utils/alert';
import Loader from '../../loader/loader.component';

// =======================
// Composant UserReviews
// =======================

const UserReviews = () => {
  // États pour les avis, les tours et les modales
  const [reviews, setReviews] = useState([]); // Liste des avis de l'utilisateur
  const [tours, setTours] = useState([]); // Liste des tours disponibles
  const [loading, setLoading] = useState(true); // Indique si les données sont en cours de chargement
  const [editModalOpen, setEditModalOpen] = useState(false); // Gestion de la modale d'édition
  const [currentReview, setCurrentReview] = useState(null); // Avis en cours d'édition ou suppression
  const [deleteModalOpen, setDeleteModalOpen] = useState(false); // Gestion de la modale de suppression

  // Chargement initial des avis et des tours
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Récupération des tours
        const allTours = await getAllTours();
        setTours(allTours || []);

        // Récupération et tri des avis utilisateur
        const userReviews = await getUserReviews();
        if (userReviews) {
          const sortedReviews = sortReviewsByTourName(userReviews, allTours);
          setReviews(sortedReviews);
        }
      } catch (err) {
        console.error('Erreur lors du chargement des données :', err);
        showToast('error', 'Erreur lors du chargement des données.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Ouvre la modale d'édition
  const openEditModal = review => {
    setCurrentReview({ ...review }); // Clone les données de l'avis
    setEditModalOpen(true);
  };

  // Ferme la modale d'édition
  const closeEditModal = () => {
    setEditModalOpen(false);
    setCurrentReview(null);
  };

  // Ouvre la modale de suppression
  const openDeleteModal = review => {
    setCurrentReview({ ...review });
    setDeleteModalOpen(true);
  };

  // Ferme la modale de suppression
  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setCurrentReview(null);
  };

  // Met à jour un champ dans l'avis en cours d'édition
  const handleEditField = (field, value) => {
    setCurrentReview(prev => ({ ...prev, [field]: value }));
  };

  // Enregistre les modifications d'un avis
  const handleSave = async () => {
    if (!currentReview) return;

    try {
      const updatedReview = await updateReview(currentReview._id, {
        review: currentReview.review,
        rating: currentReview.rating,
      });

      if (updatedReview) {
        // Recharge les avis après mise à jour
        const userReviews = await getUserReviews();
        const sortedReviews = sortReviewsByTourName(userReviews, tours);
        setReviews(sortedReviews);
        showToast('success', 'Avis mis à jour avec succès !');
        closeEditModal();
      }
    } catch (err) {
      console.error("Erreur lors de la mise à jour de l'avis :", err);
      showToast('error', 'Une erreur est survenue lors de la mise à jour.');
    }
  };

  // Supprime un avis
  const handleDelete = async () => {
    if (!currentReview) return;

    try {
      const isDeleted = await deleteReview(currentReview._id);
      if (isDeleted) {
        // Mise à jour de la liste des avis après suppression
        const remainingReviews = reviews.filter(review => review._id !== currentReview._id);
        const sortedReviews = sortReviewsByTourName(remainingReviews, tours);
        setReviews(sortedReviews);
        showToast('success', 'Avis supprimé avec succès !');
        closeDeleteModal();
      }
    } catch (err) {
      console.error("Erreur lors de la suppression de l'avis :", err);
      showToast('error', 'Une erreur est survenue lors de la suppression.');
    }
  };

  return (
    <div className='py-12 mt-8 space-y-6'>
      {/* Loader pendant le chargement */}
      {loading && (
        <div className='loader-wrapper'>
          <Loader />
        </div>
      )}

      {/* Message si aucun avis n'est trouvé */}
      {!loading && reviews.length === 0 && (
        <div className='text-center mt-20 text-4xl text-textColor'>
          Vous n'avez posté aucun avis pour le moment.
        </div>
      )}

      {/* Liste des avis */}
      {!loading && reviews.length > 0 && (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-8'>
          {reviews.map(review => (
            <div
              key={review._id}
              className='flex flex-col rounded-xl shadow-xl bg-secondaryBg mx-auto w-full max-w-[45rem] mb-8 h-full'>
              <div className='bg-accentHover text-textLight text-center uppercase py-4 sm:py-6 text-xl sm:text-2xl font-bold'>
                {review.user?.name}
              </div>
              <div className='flex flex-col items-center p-8 sm:p-12 flex-grow'>
                {review.user?.photo && (
                  <img
                    className='h-32 w-32 sm:h-40 sm:w-40 rounded-full object-cover mb-4 sm:mb-6'
                    src={`${SERVER_BASE_URL}/img/users/${review.user.photo}`}
                    alt={review.user?.name}
                  />
                )}
                <p className='text-lg sm:text-xl md:text-2xl text-center text-textColor leading-relaxed flex-grow mt-2 mb-4'>
                  {getTourNameById(review.tour, tours)}
                </p>
                <p className='text-lg sm:text-xl md:text-2xl italic text-center text-textColor leading-relaxed flex-grow'>
                  "{review.review}"
                </p>
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
              <div className='p-6 sm:p-8'>
                <div className='flex gap-4 justify-center'>
                  <button
                    onClick={() => openEditModal(review)}
                    className='bg-accentBg hover:bg-accentHover text-textColor text-base sm:text-lg lg:text-1.5xl py-3 px-6 sm:py-4 sm:px-8 rounded transition'>
                    Modifier
                  </button>
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

      {/* Modale d'édition */}
      {editModalOpen && (
        <div className='overlay-modal'>
          <div className='bg-primaryBg p-8 sm:p-12 rounded-lg w-[95%] max-w-4xl'>
            <h3 className='text-3xl sm:text-4xl font-bold text-textLight mb-8 text-center'>
              Modifier l'avis
            </h3>
            <textarea
              className='w-full p-6 rounded-md bg-secondaryBg text-textColor focus:outline-none text-lg sm:text-xl lg:text-2xl mb-8 leading-relaxed'
              rows='6'
              value={currentReview?.review}
              onChange={e => handleEditField('review', e.target.value)}
            />
            <div className='flex items-center justify-center gap-2 mb-20'>
              {[1, 2, 3, 4, 5].map(star => (
                <FaStar
                  key={star}
                  onClick={() => handleEditField('rating', star)}
                  className={`h-10 w-10 cursor-pointer ${
                    currentReview?.rating >= star ? 'text-highlightBg' : 'text-textMuted'
                  }`}
                />
              ))}
            </div>
            <div className='flex justify-center gap-x-12'>
              <button
                onClick={handleSave}
                className='bg-accentBg hover:bg-accentHover text-textLight py-4 px-12 rounded-md text-lg sm:text-xl lg:text-2xl transition'>
                Sauvegarder
              </button>
              <button
                onClick={closeEditModal}
                className='bg-accentBg hover:bg-accentHover text-textLight py-4 px-12 rounded-md text-lg sm:text-xl lg:text-2xl transition'>
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modale de suppression */}
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
                className='bg-accentBg hover:bg-accentHover text-textLight py-4 px-12 rounded-md text-lg sm:text-xl lg:text-2xl transition'>
                Supprimer
              </button>
              <button
                onClick={closeDeleteModal}
                className='bg-accentBg hover:bg-accentHover text-textLight py-4 px-12 rounded-md text-lg sm:text-xl lg:text-2xl transition'>
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserReviews;
