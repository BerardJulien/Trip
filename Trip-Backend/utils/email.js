// Importation des modules nécessaires
const sgMail = require('@sendgrid/mail');
const nodemailer = require('nodemailer'); // Envoi d'emails avec Mailtrap pour développement
const pug = require('pug'); // Génération de templates HTML
const { htmlToText } = require('html-to-text'); // Conversion d'HTML en texte brut

// Configuration de l'API Key de SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Classe pour gérer l'envoi des e-mails
module.exports = class Email {
  // Constructeur pour initialiser les informations de base
  constructor(user, url) {
    this.to = user.email; // Adresse e-mail du destinataire
    this.firstName = user.name.split(' ')[0]; // Prénom de l'utilisateur
    this.url = url; // URL à inclure dans l'e-mail
    this.from = `Julien B <${process.env.EMAIL_FROM}>`; // Adresse e-mail de l'expéditeur
  }

  // Méthode pour configurer le transport d'e-mail
  newTransport() {
    if (process.env.NODE_ENV === 'development') {
      // Environnement de développement - Utilisation de Mailtrap
      return nodemailer.createTransport({
        host: process.env.EMAIL_HOST, // Serveur d'envoi
        port: process.env.EMAIL_PORT, // Port utilisé
        auth: {
          user: process.env.EMAIL_USERNAME, // Nom d'utilisateur pour l'authentification
          pass: process.env.EMAIL_PASSWORD, // Mot de passe pour l'authentification
        },
      });
    }
    // Environnement de production - Utilisation de SendGrid
    return sgMail;
  }

  // Méthode pour envoyer un e-mail avec un contenu spécifique
  async send(template, subject) {
    // Génération du contenu HTML en utilisant Pug
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName, // Prénom de l'utilisateur
      url: this.url, // URL à inclure dans l'e-mail
      subject, // Objet de l'e-mail
    });

    // Options pour l'e-mail
    const mailOptions = {
      to: this.to, // Destinataire
      from: this.from, // Expéditeur
      subject, // Objet
      html, // Contenu HTML de l'e-mail
      text: htmlToText(html), // Conversion du contenu HTML en texte brut
    };

    // Envoi de l'e-mail
    try {
      if (process.env.NODE_ENV === 'development') {
        // Envoi via Mailtrap en développement
        const transporter = this.newTransport();
        await transporter.sendMail(mailOptions);
        console.log('E-mail envoyé avec succès via Mailtrap.');
      } else {
        // Envoi via SendGrid en production
        await this.newTransport().send(mailOptions);
        console.log('E-mail envoyé avec succès via SendGrid.');
      }
    } catch (error) {
      console.error(
        "Erreur lors de l'envoi de l'e-mail :",
        error.response ? error.response.body.errors : error
      );
    }
  }

  // Méthode pour envoyer un e-mail de bienvenue
  async sendWelcome() {
    await this.send('welcome', 'Bienvenue dans la famille Trip!');
  }

  // Méthode pour envoyer un e-mail de réinitialisation de mot de passe
  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Votre lien de réinitialisation de mot de passe (valide 10 minutes)'
    );
  }
};