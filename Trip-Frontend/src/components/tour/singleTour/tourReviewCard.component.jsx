import { FaStar } from 'react-icons/fa';
import { SERVER_BASE_URL } from '../../../constants/serverConstants';

// =======================
// Composant TourReviews
// =======================

const TourReviews = ({ reviews }) => {
  return (
    <section className='clip-path-reviews bg-primaryBg py-10'>
      {/* Conteneur scrollable horizontalement pour les avis */}
      <div className='flex overflow-x-auto snap-x snap-mandatory gap-8 sm:gap-10 px-6 sm:px-10'>
        {reviews.map(review => (
          <div
            key={review._id}
            className='flex flex-col rounded-xl shadow-xl bg-secondaryBg mx-auto w-full max-w-[45rem] min-h-[40rem]'>
            {/* Nom de l'utilisateur en en-tête */}
            <div className='bg-accentHover text-textLight text-center uppercase py-4 sm:py-6 text-xl sm:text-2xl font-bold'>
              {review.user.name}
            </div>
            {/* Contenu principal de l'avis */}
            <div className='flex flex-col items-center p-8 sm:p-12 flex-grow'>
              {/* Photo de l'utilisateur */}
              <img
                className='h-32 w-32 sm:h-40 sm:w-40 rounded-full object-cover mb-4 sm:mb-6'
                src={`${SERVER_BASE_URL}/img/users/${review.user.photo}`}
                alt={review.user.name}
              />
              {/* Texte de l'avis */}
              <p className='text-lg sm:text-xl md:text-2xl italic text-center text-textColor leading-relaxed flex-grow'>
                "{review.review}"
              </p>
              {/* Évaluation sous forme d'étoiles */}
              <div className='flex items-center justify-center gap-1 mt-3 sm:mt-4'>
                {[1, 2, 3, 4, 5].map(star => (
                  <FaStar
                    key={star}
                    className={`h-8 w-8 sm:h-10 sm:w-10 ${
                      review.rating >= star ? 'text-highlightBg' : 'text-textMuted'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TourReviews;
