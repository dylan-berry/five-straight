const colors = require('tailwindcss/colors');

module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        teal: colors.teal,
        orange: colors.orange,
        gray: colors.trueGray
      },
      width: {
        '1/10': '10%',
        '100px': '100px'
      },
      height: {
        '150px': '150px'
      }
    }
  },
  variants: {
    extend: {}
  },
  plugins: []
};
