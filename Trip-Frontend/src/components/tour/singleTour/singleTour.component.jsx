import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getOneTour } from '../../../api/tours';
import Loader from '../../loader/loader.component';
import TourHeader from './tourHeader.component';
import TourMap from '../../map/tourMap.component';
import TourCta from './tourCta.component';
import { setPageTitle } from '../../../utils/pageHead';
import TourDetails from './tourDetails.component';
import TourReviews from './tourReviewCard.component';

// =======================
// Composant SingleTour
// =======================

const SingleTour = () => {
  const { tour: tourName } = useParams(); // Récupère le paramètre de l'URL
  const [tour, setTour] = useState(null); // État pour stocker les données du tour
  const [isLoading, setIsLoading] = useState(true); // État pour gérer le chargement

  // Effet pour charger les données du tour
  useEffect(() => {
    (async () => {
      try {
        const tourData = await getOneTour(tourName); // Appelle l'API pour récupérer le tour
        if (tourData) {
          setTour(tourData.data); // Met à jour les données du tour
          setPageTitle(`Trip | ${tourData.data.name}`); // Met à jour le titre de la page
        }
      } catch (error) {
        console.error('Erreur lors du chargement du tour :', error); // Gère les erreurs
      } finally {
        setIsLoading(false); // Désactive l'état de chargement
      }
    })();
  }, [tourName]); // Exécute l'effet lorsque `tourName` change

  // Affiche le loader pendant le chargement
  if (isLoading) return <Loader />;

  // Formate la première date de départ du tour
  const tourDate = tour.startDates
    ? new Date(tour.startDates[0]).toLocaleString('fr-FR', { month: 'long', year: 'numeric' })
    : '';

  return (
    <>
      {/* Affiche l'en-tête du tour */}
      <TourHeader
        name={tour.name}
        duration={tour.duration}
        startLocation={tour.startLocation}
        imageCover={tour.imageCover}
      />
      {/* Affiche les détails du tour */}
      <TourDetails tour={tour} tourDate={tourDate} />
      {/* Affiche la carte des emplacements du tour */}
      <TourMap locationData={tour.locations} mapId='map' />
      {/* Affiche les avis sur le tour */}
      <TourReviews reviews={tour.reviews} />
      {/* Bouton d'appel à l'action pour réserver */}
      <TourCta tourId={tour.id} />
    </>
  );
};

export default SingleTour;
