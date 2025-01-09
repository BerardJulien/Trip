import { Route, Switch } from 'react-router-dom';
import ErrorPage from '../errors/errorPage.component';
import Login from '../login/login.component';
import Signup from '../signup/signup.component';
import AllTours from '../tour/allTours.component';
import SingleTour from '../tour/singleTour/singleTour.component';

// =======================
// Composant LoginSignup
// =======================

const LoginSignup = () => {
  return (
    <Switch>
      {/* Route principale affichant tous les tours */}
      <Route exact path='/'>
        <AllTours />
      </Route>

      {/* Route pour afficher un tour spécifique, basé sur le paramètre :tour */}
      <Route path='/tour/:tour' component={SingleTour} />

      {/* Route pour la page de connexion */}
      <Route path='/login'>
        <Login />
      </Route>

      {/* Route pour la page d'inscription */}
      <Route path='/signup'>
        <Signup />
      </Route>

      {/* Route pour les chemins non définis affichant une page d'erreur */}
      <Route path='*'>
        <ErrorPage message='404 Page non trouvée' />
      </Route>
    </Switch>
  );
};

export default LoginSignup;
