// tailwind.config.js
const colors = require('tailwindcss/colors');

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primaryBg: '#151a1e',
        secondaryBg: '#192127',
        tertiaryBg: '#233039',
        //
        accentBg: '#5b6d70',
        accentHover: '#76a6a0',
        //
        textColor: '#d5d6d7',
        textLight: '#ffffff',
        textMuted: '#9aa1a5',
        //
        highlightBg: '#3e7c7b',
        warningBg: '#ffb74d',
        errorBg: '#f44336',
      },
      fontSize: {
        '1.25xl': '1.25rem',
        '1.5xl': '1.375rem',
        '1.75xl': '1.5rem',
        '2xl': '1.625rem',
        '2.25xl': '1.6875rem',
        '2.5xl': '1.875rem',
        '2.75xl': '2rem',
      },
    },
  },
  plugins: [],
};
