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
      gridTemplateRows: {
        '1/3': 'repeat(3, minmax(0, 33%))'
      },
      width: {
        '1/10': '10%',
        '100px': '100px'
      },
      height: {
        '150px': '150px'
      },
      screens: {
        sm: '640px',
        // => @media (min-width: 640px) { ... }

        md: '769px',
        // => @media (min-width: 768px) { ... }

        lg: '1024px',
        // => @media (min-width: 1024px) { ... }

        xl: '1280px',
        // => @media (min-width: 1280px) { ... }

        '2xl': '1536px'
        // => @media (min-width: 1536px) { ... }
      }
    }
  },
  variants: {
    extend: {
      opacity: ['disabled']
    }
  },
  plugins: []
};
