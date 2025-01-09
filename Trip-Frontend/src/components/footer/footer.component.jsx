import logoWhite from '../../assets/img/logo-white.png';

// =======================
// Composant Footer
// =======================

const Footer = () => {
  return (
    <footer className='bg-secondaryBg p-12 text-textColor flex justify-end items-center'>
      {/* Conteneur pour le contenu du pied de page */}
      <div className='flex flex-col items-end gap-4'>
        {/* Affichage du logo */}
        <img src={logoWhite} alt='Trip logo' className='h-16' />
        {/* Texte du pied de page avec copyright */}
        <p className='text-center mt-2 text-xl'>© by B. Julien 2024</p>
      </div>
    </footer>
  );
};

export default Footer;
