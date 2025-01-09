// =============================
// Fonction pour récupérer un paramètre d'URL
// =============================

export const getQueryParam = (queryParam, key) => {
  // Crée une instance de URLSearchParams avec la chaîne de requête
  const urlParams = new URLSearchParams(queryParam);

  // Récupère la valeur du paramètre correspondant à la clé spécifiée
  const paramVal = urlParams.get(key);

  // Retourne la valeur du paramètre ou null si elle n'existe pas
  return paramVal;
};
