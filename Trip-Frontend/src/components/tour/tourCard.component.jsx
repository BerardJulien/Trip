import { Link } from 'react-router-dom';
import {
  FaMapMarkerAlt,
  FaRegCalendar,
  FaRegFlag,
  FaRegUser,
  FaStar,
  FaClock,
  FaMountain,
} from 'react-icons/fa';
import { SERVER_BASE_URL } from '../../constants/serverConstants';
import { translateDifficulty } from '../../utils/translate';

// =======================
// Composant TourCard
// =======================

const TourCard = ({ tourData }) => {
  return (
    <div className='flex flex-col rounded-lg overflow-hidden shadow-md bg-primaryBg mx-auto w-full max-w-lg sm:max-w-xl lg:max-w-2xl'>
      {/* Titre du tour */}
      <div className='bg-secondaryBg text-textColor text-center uppercase py-8 px-6 text-xl sm:text-2xl font-bold'>
        {tourData.name}
      </div>
      {/* Image de couverture avec overlay */}
      <div className='relative h-64 sm:h-72 lg:h-80 clip-path-card'>
        <div className='absolute inset-0 bg-gradient-to-br from-gray-700/70 to-gray-400/70' />
        <img
          className='w-full h-full object-cover'
          src={`${SERVER_BASE_URL}/img/tours/${tourData.imageCover}`}
          alt={tourData.name}
        />
      </div>
      {/* Description et caractéristiques principales */}
      <div className='flex flex-col flex-grow p-6 sm:p-8'>
        <p className='text-lg sm:text-xl lg:text-2xl italic text-textColor leading-relaxed mb-4 sm:mb-6 h-16 sm:h-20 lg:h-24 mt-2 overflow-hidden'>
          {tourData.summary}
        </p>
        {/* Détails du tour sous forme de grille */}
        <div className='grid grid-cols-2 gap-4 sm:gap-6'>
          {[
            {
              icon: <FaClock className='h-6 w-6 sm:h-7 sm:w-7' />,
              text: `${tourData.duration} jours`,
            },
            {
              icon: <FaMountain className='h-6 w-6 sm:h-7 sm:w-7' />,
              text: translateDifficulty(tourData.difficulty),
            },
            {
              icon: <FaMapMarkerAlt className='h-6 w-6 sm:h-7 sm:w-7' />,
              text: tourData.startLocation.description,
            },
            {
              icon: <FaRegFlag className='h-6 w-6 sm:h-7 sm:w-7' />,
              text: `${tourData.locations.length} étapes`,
            },
            {
              icon: <FaRegCalendar className='h-6 w-6 sm:h-7 sm:w-7' />,
              text: new Date(tourData.startDates[0])
                .toLocaleString('fr-FR', { month: 'long', year: 'numeric' })
                .replace(/^\w/, c => c.toUpperCase()),
            },
            {
              icon: <FaRegUser className='h-6 w-6 sm:h-7 sm:w-7' />,
              text: `${tourData.maxGroupSize} personnes`,
            },
          ].map((item, index) => (
            <div key={index} className='flex items-center text-base sm:text-lg lg:text-xl mb-1'>
              {item.icon}
              <span className='ml-3'>{item.text}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Section prix et bouton de détails */}
      <div className='bg-secondaryBg flex justify-between items-center p-6 sm:p-8 lg:p-10 mt-2'>
        <div>
          {/* Prix par personne */}
          <p className='text-base sm:text-lg lg:text-xl font-bold'>
            {tourData.price} <span className='text-textColor'>€ par personne</span>
          </p>
          {/* Notes et nombre d'évaluations */}
          <p className='flex items-center text-base sm:text-lg mt-2'>
            <span className='font-bold'>{tourData.ratingsAverage}</span>
            <span className='ml-2 flex items-center text-textColor'>
              <FaStar className='ml-1' />
              <span className='ml-1'>({tourData.ratingsQuantity})</span>
            </span>
          </p>
        </div>
        {/* Bouton pour accéder aux détails du tour */}
        <Link
          className='bg-accentBg hover:bg-accentHover text-textColor text-base sm:text-lg lg:text-1.5xl py-3 px-6 sm:py-4 sm:px-8 rounded transition'
          to={`/tour/${tourData.slug}`}>
          Détails
        </Link>
      </div>
    </div>
  );
};

export default TourCard;
