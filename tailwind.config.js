/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        gray0: '#F9F9F9',
        gray1: '#DCDDDC',
        gray2: '#828282',
      },
      maxWidth: {
        '1/2': '50%',
        '1/4': '25%',
        '2/4': '50%',
        '3/4': '75%',
        '1/10': '10%',
        '2/10': '20%',
        '3/10': '30%',
        '4/10': '40%',
        '5/10': '50%',
        '6/10': '60%',
        '7/10': '70%',
        '8/10': '80%',
        '9/10': '90%',
        full: '100%',
      },
      width: {
        '1/2': '50%',
        '1/4': '25%',
        '2/4': '50%',
        '3/4': '75%',
        '1/10': '10%',
        '2/10': '20%',
        '3/10': '30%',
        '4/10': '40%',
        '5/10': '50%',
        '6/10': '60%',
        '7/10': '70%',
        '8/10': '80%',
        '9/10': '90%',
        full: '100%',
      },
      backgroundImage: {
        'custom-gradient-basic':
          'linear-gradient(270deg, #FFF3C7 0%, #FFDBB1 49%, #F7CABB 100%)',
      },
      fontWeight: {
        regular: 400,
      },
      boxShadow: {
        custom: '0px 4px 20px 0px rgba(44, 27, 11, 0.08)',
      },
    },
  },
  plugins: [],
};
