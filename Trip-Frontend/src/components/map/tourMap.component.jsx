import { useEffect } from 'react';
import { showMap, setMarker, adjustBounds } from '../../api/mapbox';

// =======================
// Composant TourMap
// =======================

const TourMap = ({ locationData, mapId }) => {
  useEffect(() => {
    // Vérifie si les données de localisation sont disponibles
    if (!locationData || !locationData.length) return;

    // Initialisation de la carte avec l'ID donné
    const map = showMap(mapId);

    // Ajoute des marqueurs sur la carte pour chaque localisation
    locationData.forEach(location => {
      setMarker(map, location.coordinates, location.description);
    });

    // Ajuste les limites de la carte pour inclure toutes les localisations
    adjustBounds(map, locationData);

    // Nettoie la carte lorsqu'elle est démontée
    return () => map.remove();
  }, [locationData, mapId]); // Dépend des données de localisation et de l'ID de la carte

  return (
    <section className='section-map'>
      {/* Conteneur pour la carte avec un ID unique */}
      <div id={mapId} className='map-container'></div>
    </section>
  );
};

export default TourMap;
