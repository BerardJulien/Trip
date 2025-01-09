import { useState, useEffect } from 'react';
import { getAllTours } from '../../api/tours';
import { setPageTitle } from '../../utils/pageHead';
import Loader from '../loader/loader.component';
import TourCard from './tourCard.component';
import ToursOverview from './toursOverview.component';

// =======================
// Composant AllTours
// =======================

const AllTours = () => {
  const [allTours, setAllTours] = useState([]); // État pour stocker les tours
  const [loadingTours, setLoadingTours] = useState(true); // État pour le chargement des données
  const [sortOption, setSortOption] = useState('default'); // Option de tri sélectionnée

  // Effet pour charger les tours et définir le titre de la page
  useEffect(() => {
    setPageTitle('Trip'); // Met à jour le titre de la page

    (async () => {
      try {
        const tours = await getAllTours(); // Récupère les tours depuis l'API
        setTimeout(() => setLoadingTours(false), 1000); // Simule un délai de chargement
        if (Array.isArray(tours)) {
          setAllTours(tours); // Met à jour les tours si c'est un tableau
        } else if (tours?.data && Array.isArray(tours.data)) {
          setAllTours(tours.data); // Gestion alternative des données de l'API
        } else {
          console.error('Les données reçues ne sont ni un tableau ni un objet attendu.', tours);
          setAllTours([]);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des tours :', error); // Gestion des erreurs
        setLoadingTours(false);
      }
    })();
  }, []);

  // Tri des tours en fonction de l'option sélectionnée
  const sortedTours = [...allTours].sort((a, b) => {
    if (sortOption === 'price') {
      return a.price - b.price; // Tri par prix croissant
    } else if (sortOption === '-price') {
      return b.price - a.price; // Tri par prix décroissant
    } else if (sortOption === 'ratingsAverage') {
      return b.ratingsAverage - a.ratingsAverage; // Tri par notes décroissantes
    } else if (sortOption === 'nearestDate') {
      const dateA = new Date(a.startDates[0]);
      const dateB = new Date(b.startDates[0]);
      return dateA - dateB; // Tri par date la plus proche
    } else if (sortOption === 'default') {
      return a.name.localeCompare(b.name); // Tri alphabétique
    }
    return 0;
  });

  return (
    <div className='py-12 mt-8 space-y-6'>
      {/* Sélecteur pour trier les tours */}
      <div className='flex justify-center mb-8'>
        <select
          value={sortOption}
          onChange={e => setSortOption(e.target.value)} // Change l'option de tri
          className='bg-secondaryBg text-textColor p-4 rounded-lg text-xl lg:text-2xl'>
          <option value='default'>Tri par défaut</option>
          <option value='nearestDate'>Date la plus proche</option>
          <option value='price'>Prix croissant</option>
          <option value='-price'>Prix décroissant</option>
          <option value='ratingsAverage'>Meilleures notes</option>
        </select>
      </div>

      {/* Affiche le loader pendant le chargement */}
      {loadingTours && (
        <div className='loader-wrapper'>
          <Loader />
        </div>
      )}

      {/* Message si aucun tour n'est disponible */}
      {!loadingTours && allTours.length === 0 && (
        <div className='flex items-center justify-center text-center mt-20 text-4xl text-textColor'>
          Aucun tour n'est disponible pour le moment.
        </div>
      )}

      {/* Affiche les tours triés si disponibles */}
      {!loadingTours && allTours.length > 0 && (
        <ToursOverview>
          {sortedTours.map(tour => (
            <TourCard key={tour.id} tourData={tour} />
          ))}
        </ToursOverview>
      )}
    </div>
  );
};

export default AllTours;
