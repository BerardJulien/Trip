const { promisify } = require('util');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Email = require('../utils/email');
const User = require('../models/userModel');
const { CLIENT_BASE_URL } = require('../config/constants');

// Fonction pour signer un token JWT avec l'identifiant utilisateur
const signJwtToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

// Fonction pour créer et envoyer un token, et configurer les options de cookie
const createSendToken = (user, statusCode, req, res) => {
  const token = signJwtToken(user._id);

  // Masquer les champs sensibles avant de répondre
  user.password = undefined;
  user.__v = undefined;

  // Options de configuration du cookie
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true, // Empêche l'accès au cookie côté client
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https', // Active HTTPS si nécessaire
  };

  // Envoi du cookie
  res.cookie('jwt', token, cookieOptions);

  // Réponse avec le token et les données utilisateur
  res.status(statusCode).json({
    status: 'success',
    token,
    data: { user },
  });
};

// Route pour l'inscription des utilisateurs
exports.signup = catchAsync(async (req, res) => {
  const { name, email, password, passwordConfirm, role = 'user' } = req.body;

  // Création d'un nouvel utilisateur
  const newUser = await User.create({
    name,
    email,
    password,
    passwordConfirm,
    role,
  });

  // Envoi d'un e-mail de bienvenue
  /* *** */
  const url = `${CLIENT_BASE_URL}/me`;
  await new Email(newUser, url).sendWelcome();

  // Génération et envoi du token
  createSendToken(newUser, 201, req, res);
});

// Route pour la connexion des utilisateurs
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // Vérification des champs requis
  if (!email || !password) {
    return next(
      new AppError('Veuillez fournir un e-mail et un mot de passe.', 400)
    );
  }

  // Recherche de l'utilisateur avec le mot de passe
  const user = await User.findOne({ email }).select('+password');

  // Vérification des identifiants
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('E-mail ou mot de passe incorrect.', 401));
  }

  // Génération et envoi du token
  createSendToken(user, 200, req, res);
});

// Route pour la déconnexion des utilisateurs
exports.logout = (req, res) => {
  // Remplacement du token par un cookie invalide
  res.cookie('jwt', 'loggedOut', {
    expires: new Date(Date.now() + 10 * 1000), // Expiration rapide
    httpOnly: true,
  });

  res.status(200).json({ status: 'success' });
};

// Middleware pour protéger les routes avec vérification du token
exports.protect = catchAsync(async (req, res, next) => {
  let token = '';

  // Extraction du token depuis les en-têtes ou les cookies
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  // Vérification de la présence du token
  if (!token) {
    return next(
      new AppError(
        "Vous n'êtes pas connecté. Veuillez vous connecter pour accéder à cette ressource.",
        401
      )
    );
  }

  // Décodage et validation du token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // Vérification de l'existence de l'utilisateur
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError("Cet utilisateur n'existe plus.", 401));
  }

  // Vérification de la modification récente du mot de passe
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError(
        'Mot de passe récemment modifié. Veuillez vous reconnecter.',
        401
      )
    );
  }

  // Ajout de l'utilisateur à la requête
  req.user = currentUser;
  next();
});

// Middleware pour restreindre l'accès à certaines rôles
// eslint-disable-next-line arrow-body-style
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // Vérification du rôle de l'utilisateur
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          "Vous n'avez pas la permission pour effectuer cette action.",
          403
        )
      );
    }
    next();
  };
};

// Route pour demander une réinitialisation de mot de passe
exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  // Vérification de l'existence de l'utilisateur
  if (!user) {
    return next(new AppError('Aucun utilisateur trouvé avec cet e-mail.', 404));
  }

  // Génération du token de réinitialisation
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  try {
    // Envoi de l'e-mail de réinitialisation
    const resetUrl = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/users/resetPassword/${resetToken}`;

    await new Email(user, resetUrl).sendPasswordReset();

    res.status(200).json({
      status: 'success',
      message: 'Un lien de réinitialisation a été envoyé à votre e-mail.',
    });
  } catch (error) {
    // Nettoyage des champs de réinitialisation en cas d'erreur
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        "Erreur lors de l'envoi de l'e-mail. Veuillez réessayer.",
        500
      )
    );
  }
});

// Route pour réinitialiser le mot de passe
exports.resetPassword = catchAsync(async (req, res, next) => {
  // Hachage du token reçu
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  // Recherche de l'utilisateur correspondant au token
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // Vérification de l'existence et de la validité du token
  if (!user) {
    return next(new AppError('Le token est invalide ou a expiré.', 400));
  }

  // Mise à jour du mot de passe
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // Génération et envoi du token
  createSendToken(user, 200, req, res);
});

// Route pour mettre à jour le mot de passe connecté
exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  const { passwordCurrent, newPassword, newPasswordConfirm } = req.body;

  // Vérification de l'ancien mot de passe
  if (!(await user.correctPassword(passwordCurrent, user.password))) {
    return next(new AppError('Votre mot de passe actuel est incorrect.', 401));
  }

  // Vérification si le nouveau mot de passe est différent
  if (
    newPassword === newPasswordConfirm &&
    (await user.correctPassword(newPassword, user.password))
  ) {
    return next(
      new AppError(
        "Le nouveau mot de passe ne peut pas être identique à l'ancien.",
        403
      )
    );
  }

  // Mise à jour du mot de passe
  user.password = newPassword;
  user.passwordConfirm = newPasswordConfirm;
  await user.save();

  // Génération et envoi du token
  createSendToken(user, 200, req, res);
});
