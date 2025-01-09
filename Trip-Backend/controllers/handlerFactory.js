const ApiFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// Fonction générique pour supprimer un document par ID
exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    // Recherche et suppression du document
    const document = await Model.findByIdAndDelete(req.params.id);

    // Vérification si le document existe
    if (!document) {
      return next(new AppError('Aucun document trouvé avec cet ID.', 404));
    }

    // Réponse avec un statut 204 (No Content) pour indiquer la suppression réussie
    res.status(204).json({
      status: 'success',
      data: null, // Aucune donnée renvoyée après la suppression
    });
  });

// Fonction générique pour mettre à jour un document par ID
exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    // Recherche et mise à jour du document avec les données de la requête
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Retourne le document mis à jour
      runValidators: true, // Valide les données mises à jour selon le schéma
    });

    // Vérification si le document existe
    if (!document) {
      return next(new AppError('Aucun document trouvé avec cet ID.', 404));
    }

    // Réponse avec le document mis à jour
    res.status(200).json({
      status: 'success',
      data: {
        data: document,
      },
    });
  });

// Fonction générique pour créer un nouveau document
exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    // Création d'un nouveau document avec les données de la requête
    const newDocument = await Model.create(req.body);

    // Réponse avec le document créé
    res.status(201).json({
      status: 'success',
      data: {
        data: newDocument,
      },
    });
  });

// Fonction générique pour récupérer un document par ID
exports.getOne = (Model, populateOptions) =>
  catchAsync(async (req, res, next) => {
    // Recherche du document par ID
    let query = Model.findById(req.params.id);

    // Option de "populate" pour inclure les champs liés
    if (populateOptions) query = query.populate(populateOptions);

    const document = await query;

    // Vérification si le document existe
    if (!document) {
      return next(new AppError('Aucun document trouvé avec cet ID.', 404));
    }

    // Réponse avec le document trouvé
    res.status(200).json({
      status: 'success',
      data: {
        data: document,
      },
    });
  });

// Fonction générique pour récupérer tous les documents ou filtrer par une condition
exports.getAll = (Model) =>
  catchAsync(async (req, res) => {
    // Filtrage conditionnel basé sur des paramètres (ex : `tourId`)
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    // Application des fonctionnalités de filtrage, tri, limitation des champs et pagination
    const features = new ApiFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const documents = await features.query; // Exécution de la requête

    // Réponse avec tous les documents trouvés
    res.status(200).json({
      status: 'success',
      results: documents.length, // Nombre de documents retournés
      data: {
        data: documents,
      },
    });
  });
