const multer = require('multer');
const sharp = require('sharp');
const factory = require('./handlerFactory');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const Tour = require('../models/tourModel');
const Booking = require('../models/bookingModel');
const Review = require('../models/reviewModel');

// Configuration de multer pour le stockage des fichiers en mémoire
const multerStorage = multer.memoryStorage();

// Filtrage des fichiers pour accepter uniquement les images
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true); // Accepte le fichier
  } else {
    cb(new AppError("Ce fichier n'est pas une image.", 400), false); // Rejette le fichier
  }
};

// Configuration de multer avec le stockage et le filtre
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

// Middleware pour gérer le téléchargement des images d'un tour
exports.uploadTourImages = upload.fields([
  { name: 'imageCover', maxCount: 1 }, // Image de couverture
  { name: 'images', maxCount: 3 }, // Autres images
]);

// Middleware pour redimensionner les images téléchargées
exports.resizeTourImages = catchAsync(async (req, res, next) => {
  if (!req.files.imageCover && !req.files.images) return next();

  // Traitement de l'image de couverture
  if (req.files.imageCover) {
    req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;
    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`public/img/tours/${req.body.imageCover}`);
  }

  // Traitement des autres images
  if (req.files.images) {
    req.body.images = [];
    await Promise.all(
      req.files.images.map(async (file, i) => {
        const fileName = `tour-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;
        await sharp(file.buffer)
          .resize(2000, 1333)
          .toFormat('jpeg')
          .jpeg({ quality: 90 })
          .toFile(`public/img/tours/${fileName}`);
        req.body.images.push(fileName);
      })
    );
  }

  next();
});

// Middleware pour définir les paramètres pour les top tours
exports.getTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

// Route pour récupérer tous les tours avec tri et filtrage
exports.getAllTours = catchAsync(async (req, res, next) => {
  let query = Tour.find();

  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('name'); // Tri par nom par défaut
  }

  const tours = await query;

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: tours,
  });
});

// Route pour récupérer un tour avec les avis associés
exports.getTour = factory.getOne(Tour, { path: 'reviews' });

// Route pour créer un nouveau tour
exports.createTour = factory.createOne(Tour);

// Route pour mettre à jour un tour
exports.updateTour = factory.updateOne(Tour);

// Route pour supprimer un tour et ses dépendances (avis, réservations)
exports.deleteTour = catchAsync(async (req, res, next) => {
  const tourId = req.params.id;

  await Review.deleteMany({ tour: tourId }); // Suppression des avis associés
  await Booking.deleteMany({ tour: tourId }); // Suppression des réservations associées

  const tour = await Tour.findByIdAndDelete(tourId);

  if (!tour) {
    return next(new AppError('Aucun tour trouvé avec cet ID.', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

// Route pour récupérer les tours réservés par l'utilisateur connecté
exports.getMyTours = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find({ user: req.user.id });
  const tourIds = bookings.map((el) => el.tour);
  const tours = await Tour.find({ _id: { $in: tourIds } });

  res.status(200).json({
    status: 'success',
    data: tours,
  });
});

// Route pour récupérer un tour par son nom (slug)
exports.getTourByName = catchAsync(async (req, res, next) => {
  const tour = await Tour.findOne({ slug: req.params.tourName }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });

  if (!tour) {
    return next(new AppError('Aucun tour trouvé avec ce nom.', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      data: tour,
    },
  });
});

// Statistiques sur les tours basées sur leurs difficultés
exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    { $match: { ratingsAverage: { $gte: 4.5 } } }, // Filtre sur les tours avec de bonnes notes
    {
      $group: {
        _id: '$difficulty', // Regroupe par difficulté
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    { $sort: { avgPrice: 1 } }, // Tri par prix moyen
  ]);

  res.status(200).json({
    status: 'success',
    data: stats,
  });
});

// Planification mensuelle des tours pour une année donnée
exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;

  const plan = await Tour.aggregate([
    { $unwind: '$startDates' }, // Décompose les dates de début
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    { $addFields: { month: '$_id' } },
    { $project: { _id: 0 } }, // Exclut l'ID du résultat
    { $sort: { numTourStarts: -1 } },
    { $limit: 12 },
  ]);

  res.status(200).json({
    status: 'success',
    results: plan.length,
    data: plan,
  });
});

// Recherche des tours dans une zone donnée
exports.getToursWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  if (!lat || !lng) {
    return next(
      new AppError(
        'Veuillez fournir la latitude et la longitude au format lat,lng.',
        400
      )
    );
  }

  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1; // Conversion selon l'unité

  const tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: tours,
  });
});

// Calcul des distances des tours par rapport à un point donné
exports.getDistances = catchAsync(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  if (!lat || !lng) {
    return next(
      new AppError(
        'Veuillez fournir la latitude et la longitude au format lat,lng.',
        400
      )
    );
  }

  const multiplier = unit === 'mi' ? 0.000621371 : 0.001; // Conversion des distances

  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1],
        },
        distanceField: 'distance',
        distanceMultiplier: multiplier,
      },
    },
    { $project: { distance: 1, name: 1 } }, // Inclut uniquement la distance et le nom
  ]);

  res.status(200).json({
    status: 'success',
    data: distances,
  });
});
