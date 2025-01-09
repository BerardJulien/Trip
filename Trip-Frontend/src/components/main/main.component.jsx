// =======================
// Composant Main
// =======================
import { Redirect, Route, Switch } from 'react-router-dom';
import AllTours from '../tour/allTours.component';
import SingleTour from '../tour/singleTour/singleTour.component';
import UserBookings from '../user/userBookings/userBookings.component';
import UserProfile from '../user/userProfile/userProfile.component';
import UserReviews from '../user/userReviews/userReviews.component';
import AdminTours from '../user/admin/adminTours.component';
import AdminReviews from '../user/admin/adminReviews.component';
import AdminBookings from '../user/admin/adminBookings.component';
import AdminUsers from '../user/admin/adminUsers.component';

const Main = () => {
  return (
    <Switch>
      {/* Route principale affichant tous les tours */}
      <Route exact path='/'>
        <AllTours />
      </Route>

      {/* Route pour afficher les réservations de l'utilisateur */}
      <Route exact path='/bookings'>
        <UserBookings />
      </Route>

      {/* Route pour afficher et modifier le profil de l'utilisateur */}
      <Route exact path='/me' component={UserProfile} />

      {/* Route pour afficher un tour spécifique en fonction de son paramètre :tour */}
      <Route path='/tour/:tour' component={SingleTour} />

      {/* Route pour afficher les avis de l'utilisateur */}
      <Route path='/reviews' component={UserReviews} />

      {/* Route pour les administrateurs - gestion des tours */}
      <Route path='/admin/manage-tours' component={AdminTours} />

      {/* Route pour les administrateurs - gestion des utilisateurs */}
      <Route path='/admin/manage-users' component={AdminUsers} />

      {/* Route pour les administrateurs - gestion des avis */}
      <Route path='/admin/manage-reviews' component={AdminReviews} />

      {/* Route pour les administrateurs - gestion des réservations */}
      <Route path='/admin/manage-bookings' component={AdminBookings} />

      {/* Redirection vers la page principale pour les routes non définies */}
      <Redirect to='/' />
    </Switch>
  );
};

export default Main;
