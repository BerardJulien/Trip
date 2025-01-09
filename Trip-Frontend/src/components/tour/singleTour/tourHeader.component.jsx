import { FaRegClock, FaMapMarkerAlt } from 'react-icons/fa';
import { SERVER_BASE_URL } from '../../../constants/serverConstants';

// =======================
// Composant TourHeader
// =======================

const TourHeader = ({ name, duration, startLocation, imageCover }) => {
  return (
    <section className='relative h-[40vh] sm:h-[50vh] lg:h-[38vw] clip-path-header'>
      <div className='relative h-full'>
        {/* Image de couverture du tour */}
        <img
          className='absolute inset-0 w-full h-full object-cover object-[50%_25%] z-[-1]'
          src={`${SERVER_BASE_URL}/img/tours/${imageCover}`}
          alt={name}
        />
        {/* Overlay avec un dégradé pour le texte */}
        <div className='absolute inset-0 bg-gradient-to-br from-gray-400/70 to-gray-600/70' />
      </div>
      <div className='absolute inset-0 flex flex-col items-center justify-start text-white pt-40 sm:pt-48 lg:pt-56'>
        {/* Nom du tour */}
        <h1 className='uppercase font-semibold text-4xl sm:text-6xl lg:text-8xl mt-5'>{name}</h1>
        {/* Informations sur la durée et l'emplacement */}
        <div className='mt-10 flex gap-8 text-xl sm:text-4xl'>
          <div className='flex items-center gap-4'>
            <FaRegClock className='h-8 w-8' />
            <span>{duration} jours</span>
          </div>
          <div className='flex items-center gap-4'>
            <FaMapMarkerAlt className='h-8 w-8' />
            <span>{startLocation?.description}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TourHeader;
