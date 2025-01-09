// =======================
// Configuration de Mapbox
// =======================

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_KEY;

// =======================
// Initialisation de la carte
// =======================

export const showMap = mapId => {
  const map = new mapboxgl.Map({
    container: mapId, // ID du conteneur HTML où afficher la carte
    style: 'mapbox://styles/mapbox/light-v11', // Style prédéfini de Mapbox
    scrollZoom: false, // Désactive le zoom avec la molette de la souris
    projection: 'mercator', // Utilise la projection Mercator
  });

  // Ajoute les contrôles de navigation (zoom et orientation)
  map.addControl(new mapboxgl.NavigationControl(), 'top-right');

  return map; // Retourne l'instance de la carte
};

// =======================
// Ajout de marqueurs et de popups
// =======================

export const setMarker = (map, coordinates, description) => {
  // Crée un élément HTML pour représenter le marqueur
  const el = document.createElement('div');
  el.className = 'marker'; // Classe CSS pour styliser le marqueur

  // Ajoute un marqueur sur la carte
  new mapboxgl.Marker({
    element: el, // Élément HTML utilisé pour le marqueur
    anchor: 'bottom', // Ancrage au bas du marqueur
  })
    .setLngLat(coordinates) // Définit les coordonnées du marqueur
    .addTo(map); // Ajoute le marqueur à la carte

  // Ajoute un popup associé au marqueur
  new mapboxgl.Popup({
    offset: 30, // Décalage pour éviter de recouvrir le marqueur
    closeOnClick: false, // Empêche la fermeture du popup au clic
    focusAfterOpen: false, // Empêche de focaliser sur le popup après ouverture
  })
    .setLngLat(coordinates) // Définit les coordonnées du popup
    .setHTML(`${description}`) // Contenu HTML du popup
    .addTo(map); // Ajoute le popup à la carte
};

// =======================
// Ajustement des limites de la carte
// =======================

export const adjustBounds = (map, locationData) => {
  // Initialise les limites pour ajuster la vue
  const bounds = new mapboxgl.LngLatBounds();

  // Étend les limites pour inclure chaque localisation
  locationData.forEach(loc => {
    bounds.extend(loc.coordinates);
  });

  // Ajuste la vue de la carte pour inclure toutes les localisations
  map.fitBounds(bounds, {
    padding: {
      top: 200, // Marge en haut
      bottom: 150, // Marge en bas
      left: 100, // Marge à gauche
      right: 100, // Marge à droite
    },
  });
};
