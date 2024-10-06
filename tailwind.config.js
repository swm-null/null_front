/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        gray0: '#F9F9F9',
        gray1: '#DCDDDC',
        gray2: '#828282',
        brown2: '#6A5344',
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
