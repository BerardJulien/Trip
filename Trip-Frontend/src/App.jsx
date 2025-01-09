import Footer from './components/footer/footer.component';
import Navbar from './components/navbar/navbar.component';
import Main from './components/main/main.component';
import LoginSignup from './components/loginSignup/loginSignup.component';
import User from './context/userContext';
// Toastify
import 'react-toastify/dist/ReactToastify.css';
import Toast from './components/toast/toast';

// ===============================
// Composant principal de l'application
// ===============================

const App = () => {
  // Récupère l'état de connexion de l'utilisateur depuis le contexte
  const { isUserLoggedIn } = User();

  return (
    <div className='flex flex-col min-h-screen'>
      {/* Barre de navigation */}
      <Navbar />
      {/* Section principale */}
      <main className='flex-grow'>
        {/* Si l'utilisateur est connecté, affiche le composant principal */}
        {/* Sinon, affiche le composant de connexion/inscription */}
        {isUserLoggedIn ? <Main /> : <LoginSignup />}
      </main>
      {/* Pied de page */}
      <Footer />
      {/* Composant pour les notifications */}
      <Toast />
    </div>
  );
};

export default App;
