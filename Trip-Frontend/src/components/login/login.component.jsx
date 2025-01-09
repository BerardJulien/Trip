import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { userLogin } from '../../api/auth';
import { setPageTitle } from '../../utils/pageHead';
import User from '../../context/userContext';
import FormGroup from '../formGroup/formGroup.component';

// =======================
// Composant Login
// =======================

const Login = () => {
  const { setUserInfo } = User(); // Récupère la fonction pour mettre à jour les informations utilisateur
  const history = useHistory(); // Accès à l'historique pour la redirection
  const [email, setEmail] = useState(''); // État pour l'adresse e-mail
  const [password, setPassword] = useState(''); // État pour le mot de passe

  // Fonction pour gérer la soumission du formulaire
  const handleLogin = async e => {
    e.preventDefault(); // Empêche le rechargement de la page
    const res = await userLogin(email, password); // Tente de se connecter avec les informations fournies
    if (res) {
      setUserInfo(res); // Met à jour les informations utilisateur dans le contexte
      history.push('/'); // Redirige vers la page d'accueil
    }
  };

  // Définition du titre de la page au montage du composant
  useEffect(() => setPageTitle('Trip | Connexion'), []);

  return (
    <main className='flex items-start justify-center min-h-screen bg-tertiaryBg px-4 pt-20'>
      <div className='max-w-4xl w-full bg-primaryBg shadow-lg p-12 md:p-20 rounded-lg'>
        <h2 className='text-center text-textLight font-bold text-4xl md:text-5xl mb-14'>
          Connectez-vous à votre compte
        </h2>
        {/* Formulaire de connexion */}
        <form className='space-y-10' onSubmit={handleLogin}>
          <FormGroup
            label='Adresse e-mail'
            id='email'
            type='email'
            required
            onChange={e => setEmail(e.target.value)} // Met à jour l'état pour l'adresse e-mail
          />
          <FormGroup
            label='Mot de passe'
            id='password'
            type='password'
            required
            minLength='8'
            onChange={e => setPassword(e.target.value)} // Met à jour l'état pour le mot de passe
          />
          <button className='w-full bg-accentBg hover:bg-accentHover text-textLight text-1.75xl font-semibold py-5 rounded-md transition'>
            Se connecter
          </button>
        </form>
      </div>
    </main>
  );
};

export default Login;
