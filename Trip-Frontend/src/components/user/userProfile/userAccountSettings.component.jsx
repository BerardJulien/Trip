import { useRef, useState } from 'react';
import { updateSettings } from '../../../api/userSettings';
import User from '../../../context/userContext';
import { SERVER_BASE_URL } from '../../../constants/serverConstants';

// ==========================
// Composant UserAccountSettings
// ==========================

const UserAccountSettings = ({ userInfo }) => {
  // Gestion des états pour les champs de formulaire (nom et email)
  const [name, setName] = useState(userInfo.name); // Nom de l'utilisateur
  const [email, setEmail] = useState(userInfo.email); // Email de l'utilisateur
  const fileInput = useRef(); // Référence pour accéder à l'input de fichier
  const { setUserInfo } = User(); // Accès au contexte utilisateur pour mettre à jour les informations globales

  // Fonction pour gérer la soumission du formulaire de mise à jour
  const handleUpdateUserData = async e => {
    e.preventDefault();

    // Récupération du fichier de photo téléchargé
    const photo = fileInput.current.files[0];

    // Création d'un objet FormData pour envoyer les données utilisateur au serveur
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('photo', photo);

    // Appel à l'API pour mettre à jour les informations utilisateur
    const updatedDetails = await updateSettings(formData, 'data');
    if (updatedDetails) {
      setUserInfo(updatedDetails); // Mise à jour des informations utilisateur dans le contexte
    }
  };

  return (
    <div className='max-w-5xl mx-auto bg-primaryBg shadow-lg p-14 lg:p-18 rounded-lg'>
      {/* Titre de la section */}
      <h2 className='text-5xl lg:text-6xl font-semibold text-textLight mb-12'>
        Paramètres de votre compte
      </h2>
      {/* Formulaire de mise à jour des informations utilisateur */}
      <form className='space-y-14' onSubmit={handleUpdateUserData}>
        {/* Champ de saisie pour le nom */}
        <div className='space-y-8'>
          <label htmlFor='name' className='block text-2xl lg:text-3xl font-medium text-textLight'>
            Nom
          </label>
          <input
            id='name'
            type='text'
            value={name}
            onChange={e => setName(e.target.value)}
            className='w-full h-20 px-6 py-5 rounded-md bg-secondaryBg text-textColor focus:outline-none text-xl lg:text-2xl'
          />
        </div>
        {/* Champ de saisie pour l'email */}
        <div className='space-y-8'>
          <label htmlFor='email' className='block text-2xl lg:text-3xl font-medium text-textLight'>
            Adresse e-mail
          </label>
          <input
            id='email'
            type='email'
            value={email}
            onChange={e => setEmail(e.target.value)}
            className='w-full h-20 px-6 py-5 rounded-md bg-secondaryBg text-textColor focus:outline-none text-xl lg:text-2xl'
          />
        </div>
        {/* Section pour la photo de l'utilisateur */}
        <div className='flex items-center space-x-10'>
          {/* Aperçu de la photo actuelle */}
          <img
            src={`${SERVER_BASE_URL}/img/users/${userInfo.photo}`}
            alt='User photo'
            className='h-28 w-28 rounded-full object-cover'
          />
          <div>
            {/* Input fichier pour télécharger une nouvelle photo */}
            <input type='file' accept='image/*' ref={fileInput} className='hidden' id='photo' />
            <span className='block text-2xl lg:text-3xl text-textLight mb-4'>Photo</span>
            <button
              onClick={() => fileInput.current.click()} // Ouvre l'explorateur de fichiers
              type='button'
              className='bg-accentBg hover:bg-accentHover text-textLight py-4 px-8 rounded-md text-xl lg:text-2xl'>
              Choisir une nouvelle photo
            </button>
          </div>
        </div>
        {/* Bouton pour soumettre les modifications */}
        <button className='w-full bg-accentBg hover:bg-accentHover text-textLight py-5 px-10 rounded-md text-2xl lg:text-3xl mt-8'>
          Enregistrer les paramètres
        </button>
      </form>
    </div>
  );
};

export default UserAccountSettings;
