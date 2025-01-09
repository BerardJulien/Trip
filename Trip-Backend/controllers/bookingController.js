const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Booking = require('../models/bookingModel');
const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const { CLIENT_BASE_URL } = require('../config/constants');

// Récupération des réservations de l'utilisateur connecté
exports.getCurrentUserBookings = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find({ user: req.user.id })
    .populate({
      path: 'tour',
      select:
        'name imageCover ratingsAverage ratingsQuantity summary duration startLocation price difficulty slug locations startDates maxGroupSize',
    })
    .populate('user', 'name email photo');

  res.status(200).json({
    status: 'success',
    results: bookings.length,
    data: bookings,
  });
});

// Vérification de la propriété de la réservation par l'utilisateur connecté
exports.checkUserBookingOwnership = catchAsync(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id).populate('tour user');

  if (!booking) {
    return next(new AppError('Aucune réservation trouvée avec cet ID.', 404));
  }

  if (!booking.user.equals(req.user.id)) {
    return next(
      new AppError(
        "Vous n'avez pas l'autorisation d'accéder à cette réservation.",
        403
      )
    );
  }

  req.booking = booking; // Ajout de la réservation à la requête pour les middlewares suivants
  next();
});

// Création d'une session de paiement Stripe pour le tour
exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.tourId);

  // Construction de l'URL de l'image du tour
  const imageCover = tour.imageCover.replace('.avif', '.jpg');
  const imageUrl = `${req.protocol}://${req.get(
    'host'
  )}/img/tours/${imageCover}`;

  // Création de la session Stripe
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${CLIENT_BASE_URL}/bookings?booking=success`,
    cancel_url: `${CLIENT_BASE_URL}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    line_items: [
      {
        price_data: {
          currency: 'usd',
          unit_amount: tour.price * 100, // Conversion en cents
          product_data: {
            name: `${tour.name} Tour`,
            description: tour.summary,
            images: [imageUrl],
          },
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
  });

  res.status(200).json({
    status: 'success',
    sessionUrl: session.url,
  });
});

// Fonction interne pour créer une réservation après le paiement réussi
const createBookingCheckout = async (session) => {
  const tour = session.client_reference_id;

  const userDoc = await User.findOne({ email: session.customer_email });
  if (!userDoc) return; // Arrêt si l'utilisateur n'est pas trouvé

  const price = session.amount_total / 100; // Conversion du prix en dollars

  await Booking.create({ tour, user: userDoc.id, price }); // Création de la réservation
};

// Webhook Stripe pour gérer les paiements réussis
exports.webhookCheckout = (req, res, next) => {
  const signature = req.headers['stripe-signature'];

  let event;
  try {
    // Vérification de la signature du webhook
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_CHECKOUT_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Erreur Webhook: ${err.message}`);
  }

  // Gestion des sessions de paiement réussies
  if (event.type === 'checkout.session.completed') {
    createBookingCheckout(event.data.object);
  }

  res.status(200).json({ received: true });
};

// Récupération de toutes les réservations avec des détails supplémentaires
exports.getAllBookingsWithDetails = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find()
    // .populate('tour', 'name imageCover duration')
    /* *** */
    .populate(
      'tour',
      'name imageCover ratingsAverage ratingsQuantity summary duration startLocation price difficulty slug locations startDates maxGroupSize'
    )
    .populate('user', 'name email photo');

  res.status(200).json({
    status: 'success',
    results: bookings.length,
    data: bookings,
  });
});

// Création d'une réservation (via le modèle factory)
exports.createBooking = factory.createOne(Booking);

// Récupération d'une réservation par ID (via le modèle factory)
exports.getBooking = factory.getOne(Booking);

// Récupération de toutes les réservations (via le modèle factory)
exports.getAllBookings = factory.getAll(Booking);

// Mise à jour d'une réservation (via le modèle factory)
exports.updateBooking = factory.updateOne(Booking);

// Suppression d'une réservation (via le modèle factory)
exports.deleteBooking = factory.deleteOne(Booking);
