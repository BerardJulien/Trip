const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const compression = require('compression');

const AppError = require('./utils/appError');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const bookingController = require('./controllers/bookingController');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

// Activation de l'option "trust proxy" pour les proxys (ex : Heroku)
app.enable('trust proxy');

// Définition du répertoire public pour les fichiers statiques
app.use(express.static(path.join(__dirname, 'public')));

// Sécurisation des headers HTTP
app.use(helmet());

// Protection contre les attaques MongoDB et XSS
app.use(mongoSanitize()); // Suppression des caractères spéciaux des entrées
app.use(xss()); // Nettoyage des entrées pour éviter les scripts malveillants

// Prévention des pollutions des paramètres HTTP
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsAverage',
      'ratingsQuantity',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

// Activation de CORS pour permettre les requêtes multi-origines
app.use(cors());
app.options('*', cors());

// Logging des requêtes en mode développement
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Middleware pour limiter le nombre de requêtes
/* *** */
// const limiter = rateLimit({
//   max: 100,
//   windowMs: 60 * 60 * 1000, // Fenêtre de temps : 1 heure
//   message: 'Trop de requêtes envoyées depuis cette IP, réessayez dans une heure !',
// });
// app.use('/api', limiter);

// Gestion des webhooks Stripe avec traitement brut des données
app.post(
  '/webhook-checkout',
  express.raw({ type: 'application/json' }),
  bookingController.webhookCheckout
);

// Middleware pour parser les données des requêtes
app.use(
  express.json({
    limit: '20kb', // Taille maximale des requêtes JSON
  })
);
app.use(express.urlencoded({ extended: true })); // Parsing des données encodées en URL
app.use(cookieParser()); // Parsing des cookies

// Compression des réponses HTTP
app.use(compression());

// Définition des routes principales
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

// Gestion des routes non définies
app.all('*', (req, res, next) => {
  next(
    new AppError(
      `Impossible de trouver ${req.originalUrl} sur ce serveur.`,
      404
    )
  );
});

// Gestion globale des erreurs
app.use(globalErrorHandler);

module.exports = app;
