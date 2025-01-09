import { useState } from 'react';
import { updateSettings } from '../../../api/userSettings';

// ==========================
// Composant UserPasswordUpdate
// ==========================

const UserPasswordUpdate = () => {
  // Gestion des états pour les champs de mot de passe
  const [passwordCurrent, setPasswordCurrent] = useState(''); // Mot de passe actuel
  const [newPassword, setNewPassword] = useState(''); // Nouveau mot de passe
  const [newPasswordConfirm, setNewPasswordConfirm] = useState(''); // Confirmation du nouveau mot de passe

  // Fonction pour gérer la soumission du formulaire
  const handleUpdatePassword = async e => {
    e.preventDefault(); // Empêche le rechargement de la page lors de la soumission

    // Appel à l'API pour mettre à jour le mot de passe
    const updatedData = await updateSettings(
      { passwordCurrent, newPassword, newPasswordConfirm },
      'password' // Spécifie que les données concernent le mot de passe
    );

    if (updatedData) {
      // Réinitialisation des champs si la mise à jour a réussi
      setPasswordCurrent('');
      setNewPassword('');
      setNewPasswordConfirm('');
    }
  };

  return (
    <div className='max-w-4xl mx-auto bg-primaryBg shadow-lg p-14 lg:p-18 rounded-lg mt-16'>
      {/* Titre de la section */}
      <h2 className='text-5xl lg:text-6xl font-semibold text-textLight mb-12'>
        Changer le mot de passe
      </h2>
      {/* Formulaire de mise à jour du mot de passe */}
      <form className='space-y-14' onSubmit={handleUpdatePassword}>
        {/* Champ pour le mot de passe actuel */}
        <div className='space-y-8'>
          <label
            htmlFor='password-current'
            className='block text-2xl lg:text-3xl font-medium text-textLight'>
            Mot de passe actuel
          </label>
          <input
            id='password-current'
            type='password'
            value={passwordCurrent}
            onChange={e => setPasswordCurrent(e.target.value)}
            className='w-full h-20 px-6 py-5 rounded-md bg-secondaryBg text-textColor focus:outline-none text-xl lg:text-2xl'
          />
        </div>
        {/* Champ pour le nouveau mot de passe */}
        <div className='space-y-8'>
          <label
            htmlFor='new-password'
            className='block text-2xl lg:text-3xl font-medium text-textLight'>
            Nouveau mot de passe
          </label>
          <input
            id='new-password'
            type='password'
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            className='w-full h-20 px-6 py-5 rounded-md bg-secondaryBg text-textColor focus:outline-none text-xl lg:text-2xl'
          />
        </div>
        {/* Champ pour confirmer le nouveau mot de passe */}
        <div className='space-y-8'>
          <label
            htmlFor='confirm-password'
            className='block text-2xl lg:text-3xl font-medium text-textLight'>
            Confirmer le mot de passe
          </label>
          <input
            id='confirm-password'
            type='password'
            value={newPasswordConfirm}
            onChange={e => setNewPasswordConfirm(e.target.value)}
            className='w-full h-20 px-6 py-5 rounded-md bg-secondaryBg text-textColor focus:outline-none text-xl lg:text-2xl'
          />
        </div>
        {/* Bouton pour soumettre les modifications */}
        <button className='w-full bg-accentBg hover:bg-accentHover text-textLight py-5 px-10 rounded-md text-2xl lg:text-3xl'>
          Enregistrer le mot de passe
        </button>
      </form>
    </div>
  );
};

export default UserPasswordUpdate;
