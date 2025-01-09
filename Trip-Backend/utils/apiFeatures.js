// Classe ApiFeatures pour gérer les fonctionnalités avancées de requêtes MongoDB
class ApiFeatures {
  constructor(query, queryString) {
    this.query = query; // Requête MongoDB initiale
    this.queryString = queryString; // Requête utilisateur (ex : req.query)
  }

  // =======================
  // Méthode pour filtrer les résultats
  // =======================

  filter() {
    // Exclut les paramètres spécifiques (sort, fields) pour conserver uniquement les filtres
    const { sort, fields, ...queryObj } = this.queryString;

    // Convertit les opérateurs MongoDB (`gte`, `gt`, `lte`, `lt`) en syntaxe MongoDB (`$gte`, `$gt`, etc.)
    let queryString = JSON.stringify(queryObj);
    queryString = queryString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );

    // Applique les filtres à la requête
    this.query = this.query.find(JSON.parse(queryString));

    return this; // Permet le chaînage des méthodes
  }

  // =======================
  // Méthode pour trier les résultats
  // =======================

  sort() {
    if (this.queryString.sort) {
      // Trie les champs spécifiés par l'utilisateur (ex : `sort=price,-ratings`)
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      // Tri par défaut : par date de création décroissante
      this.query = this.query.sort('-createdAt');
    }
    return this; // Permet le chaînage des méthodes
  }

  // =======================
  // Méthode pour limiter les champs retournés
  // =======================

  limitFields() {
    if (this.queryString.fields) {
      // Sélectionne uniquement les champs spécifiés par l'utilisateur (ex : `fields=name,price`)
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      // Exclut le champ `__v` par défaut
      this.query = this.query.select('-__v');
    }
    return this; // Permet le chaînage des méthodes
  }

  // =======================
  // Méthode pour la pagination
  // =======================

  paginate() {
    const page = this.queryString.page * 1 || 1; // Page actuelle (par défaut : 1)
    const limit = this.queryString.limit * 1 || 40; // Limite d'éléments par page (par défaut : 10) /* *** */
    const skip = (page - 1) * limit; // Calcule le nombre de documents à sauter

    // Applique la pagination à la requête
    this.query = this.query.skip(skip).limit(limit);

    return this; // Permet le chaînage des méthodes
  }
}

module.exports = ApiFeatures;
