import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { userSignup } from '../../api/auth';
import User from '../../context/userContext';
import { setPageTitle } from '../../utils/pageHead';
import FormGroup from '../formGroup/formGroup.component';

// =======================
// Composant Signup
// =======================

const Signup = () => {
  const { setUserInfo } = User(); // Fonction pour définir les informations utilisateur dans le contexte
  const history = useHistory(); // Permet la redirection après inscription

  // État pour stocker les données d'inscription
  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
  });

  // Gère la mise à jour des champs du formulaire
  const handleInputChange = (e, key) => {
    const val = e.target.value;
    setSignupData(prev => ({ ...prev, [key]: val }));
  };

  // Gère la soumission du formulaire d'inscription
  const handleSignup = async e => {
    e.preventDefault(); // Empêche le rechargement de la page
    const res = await userSignup(signupData); // Appelle l'API pour l'inscription

    if (res) {
      setUserInfo(res); // Met à jour les informations utilisateur
      history.push('/'); // Redirige vers la page d'accueil après succès
    }
  };

  // Définit le titre de la page lors du montage du composant
  useEffect(() => setPageTitle('Trip | Inscription'), []);

  return (
    <main className='flex items-start justify-center min-h-screen bg-tertiaryBg px-4 pt-20'>
      <div className='max-w-4xl w-full bg-primaryBg shadow-lg p-12 md:p-20 rounded-lg'>
        <h2 className='text-center text-textLight font-bold text-4xl md:text-5xl mb-14'>
          Créez votre compte
        </h2>
        {/* Formulaire d'inscription */}
        <form className='space-y-10' onSubmit={handleSignup}>
          <FormGroup
            label='Nom'
            id='name'
            type='text'
            required
            onChange={e => handleInputChange(e, 'name')} // Met à jour le champ "name"
          />
          <FormGroup
            label='Adresse e-mail'
            id='email'
            type='email'
            required
            onChange={e => handleInputChange(e, 'email')} // Met à jour le champ "email"
          />
          <FormGroup
            label='Mot de passe'
            id='password'
            type='password'
            required
            minLength='8'
            onChange={e => handleInputChange(e, 'password')} // Met à jour le champ "password"
          />
          <FormGroup
            label='Confirmer le mot de passe'
            id='confirm-password'
            type='password'
            required
            minLength='8'
            onChange={e => handleInputChange(e, 'passwordConfirm')} // Met à jour le champ "passwordConfirm"
          />
          <button className='w-full bg-accentBg hover:bg-accentHover text-textLight text-1.75xl font-semibold py-5 rounded-md transition'>
            S'inscrire
          </button>
        </form>
      </div>
    </main>
  );
};

export default Signup;
