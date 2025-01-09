// =======================
// Composant ToursOverview
// =======================

const ToursOverview = ({ children }) => {
  return (
    <div className='py-12'>
      {/* Conteneur principal des tours */}
      <div className='flex flex-wrap gap-8 justify-center items-center max-w-[160rem] mx-auto md:grid md:grid-cols-2 lg:grid-cols-3 lg:gap-12'>
        {children} {/* Affiche les enfants passés au composant */}
      </div>
    </div>
  );
};

export default ToursOverview;
