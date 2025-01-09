// =======================
// Composant FormGroup
// =======================

const FormGroup = ({ label, id, ...inputAttributes }) => {
  return (
    <div className='space-y-3'>
      {/* Label pour le champ de formulaire */}
      <label htmlFor={id} className='block text-xl md:text-2.25xl font-medium text-textLight'>
        {label}
      </label>
      {/* Champ de saisie avec des attributs dynamiques */}
      <input
        id={id}
        className='block w-full h-20 text-xl md:text-2.25xl text-textColor bg-secondaryBg border rounded-md py-4 px-5 border-secondaryBg focus:outline-none focus:ring-2 focus:ring-accentBg focus:border-transparent transition duration-300'
        {...inputAttributes}
      />
    </div>
  );
};

export default FormGroup;
