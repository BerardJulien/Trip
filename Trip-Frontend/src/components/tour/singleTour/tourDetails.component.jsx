import { FaRegCalendar, FaRegUser, FaRegStar, FaSignal } from 'react-icons/fa';
import { SERVER_BASE_URL } from '../../../constants/serverConstants';
import { translateDifficulty } from '../../../utils/translate';

// =======================
// Composant TourDetails
// =======================

const TourDetails = ({ tour, tourDate }) => {
  const { guides, description, name } = tour;

  // Fonction pour capitaliser la première lettre d'une chaîne
  const capitalizeFirstLetter = string => {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  return (
    <section className='relative clip-path-details bg-primaryBg'>
      <div className='grid grid-cols-1 lg:grid-cols-12 gap-10 px-10 lg:px-20 py-16'>
        {/* Section "En Bref" */}
        <div className='lg:col-span-3 bg-secondaryBg p-10 rounded-lg shadow-lg flex flex-col items-center lg:items-start space-y-10'>
          <h2 className='text-textColor text-4xl font-bold uppercase mb-8 text-center lg:text-left'>
            En Bref
          </h2>
          <div className='flex flex-col gap-8 w-full'>
            {[
              {
                icon: <FaRegCalendar className='h-8 w-8' />,
                label: 'Prochaine Date',
                value: capitalizeFirstLetter(tourDate),
              },
              {
                icon: <FaSignal className='h-8 w-8' />,
                label: 'Difficulté',
                value: translateDifficulty(tour.difficulty),
              },
              {
                icon: <FaRegUser className='h-8 w-8' />,
                label: 'Participants',
                value: `${tour.maxGroupSize} personnes`,
              },
              {
                icon: <FaRegStar className='h-8 w-8' />,
                label: 'Note',
                value: `${tour.ratingsAverage} / 5`,
              },
            ].map((item, index) => (
              <div
                key={index}
                className='flex items-center gap-6 text-lg sm:text-xl md:text-2xl text-textColor space-x-2'>
                <div className='flex-shrink-0'>{item.icon}</div>
                <div className='space-y-2'>
                  <p className='text-textColor font-bold'>{item.label}</p>
                  <p className='text-textColor'>{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Section "Vos Guides" */}
        {guides && (
          <div className='lg:col-span-3 bg-secondaryBg p-10 rounded-lg shadow-lg flex flex-col items-center lg:items-start space-y-10'>
            <h2 className='text-textColor text-4xl font-bold uppercase mb-8 text-center lg:text-left'>
              Vos Guides
            </h2>
            <div className='flex flex-col gap-8 w-full'>
              {guides.map(guide => (
                <div className='flex items-center gap-6 sm:gap-8 ' key={guide._id}>
                  <img
                    className='h-24 w-24 sm:h-28 sm:w-28 lg:h-32 lg:w-32 rounded-full object-cover flex-shrink-0'
                    src={`${SERVER_BASE_URL}/img/users/${guide.photo}`}
                    alt={guide.name}
                  />
                  <div className='space-y-2 text-lg sm:text-xl md:text-2xl'>
                    <p className='text-textColor font-bold'>
                      {guide.role === 'lead-guide' ? 'Guide principal' : 'Guide'}
                    </p>
                    <p className='text-textColor'>{guide.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Section "À propos" */}
        <div className='lg:col-span-6 bg-secondaryBg p-6 sm:p-8 lg:p-10 rounded-lg shadow-lg flex flex-col items-center lg:items-start'>
          <h2 className='text-textColor text-2xl sm:text-3xl lg:text-4xl font-bold uppercase mb-4 sm:mb-6 lg:mb-8 text-center lg:text-left'>
            À propos de : {name}
          </h2>
          <div className='flex flex-col gap-4 sm:gap-5 lg:gap-6 w-full text-xl sm:text-2.25xl leading-relaxed'>
            {description.split('\n').map((paragraph, index) => (
              <p className='text-textColor' key={index}>
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TourDetails;
