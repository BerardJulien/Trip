# <p align="center">Trip - Plateforme de Réservation d'Excursions</p>
  
Trip est une application web moderne conçue pour faciliter la découverte et la réservation d'excursions en ligne. Le projet allie une interface utilisateur intuitive, un système de gestion robuste et des mesures de sécurité avancées pour offrir une expérience utilisateur optimale.


## Fonctionnalités principales :
    
- Exploration d'Excursions : Les utilisateurs peuvent parcourir une large sélection d'excursions grâce à des pages dédiées contenant des descriptions détaillées, des images, et des informations clés (prix, horaires, lieu).

- Gestion des Comptes :
    - Création de comptes utilisateurs avec gestion sécurisée des mots de passe grâce à bcryptjs.
    - Authentification avec des JSON Web Tokens (JWT), incluant des rôles (utilisateurs, administrateurs).

- Réservations en Ligne :
    - Processus simplifié pour réserver des excursions.
    - Suivi des réservations dans un tableau de bord utilisateur.

- Paiements Sécurisés : Intégration de Stripe pour des transactions en ligne sécurisées et fiables.

- Notifications Automatisées : Envoi d'e-mails transactionnels et d'informations via SendGrid.


## Gestion par Rôles
    
- Utilisateurs : 
    - Gestion du profil : modification des informations personnelles (nom, email, mot de passe, photo).
    - Gestion des réservations : consultation et annulation des excursions.
    - Gestion des avis : modification et suppression de ses avis.
- Administrateurs : 
    - Accès au tableau de bord d'administration
    - Gestion complète des excursions, utilisateurs, avis et réservations
    - Droits étendus de modification et suppression


 ## Architecture et Technologies :
    
- Front-End :
    - Développé avec React et Tailwind CSS, garantissant un design réactif et attrayant.
    - Mapbox GL pour l'intégration de cartes interactives, permettant de visualiser les itinéraires et les     localisations.
    - Gestion du routage avec React Router DOM et des notifications utilisateurs avec React Toastify.
    - Configuration et optimisation via Vite pour des temps de chargement rapides.
- Back-End
    - Construit avec Node.js et Express, offrant des performances élevées et une structure modulaire.
    - Sécurisation du serveur grâce à des outils tels que :
        - Helmet : Protection des en-têtes HTTP.
        - xss-clean : Prévention des attaques XSS.
        - express-rate-limit : Limitation des requêtes pour éviter les abus.

- Base de Données
    - Stockage des données dans MongoDB, assurant une flexibilité et une rapidité d'accès.
    - Utilisation de Mongoose pour une modélisation efficace des données.

- Paiements et Services
    - Paiements sécurisés via Stripe, intégrés avec des retours en temps réel.
    - Gestion des e-mails automatisés via @sendgrid/mail.


## Points techniques et DevOps :
  
- Gestion des dépendances :Utilisation d’outils modernes comme Prettier, ESLint (Airbnb), et Tailwind CSS pour maintenir un code propre et structuré.

- Optimisation des performances :
    - Compression des réponses avec compression.
    - Optimisation des images avec sharp.

- Environnement de Développement :
    - Scripts personnalisés pour un déploiement fluide en développement (nodemon) et en production.
    - Respect des meilleures pratiques grâce aux configurations avancées d’ESLint et Prettier.


## Voir le Site en Ligne   

[Découvrir le Site](https://trip-julien.netlify.app/)
        
