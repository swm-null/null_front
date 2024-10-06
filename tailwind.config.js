/** @type {import('tailwindcss').Config} */
export default {
  mode: 'jit',
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        gray0: '#F9F9F9',
        gray1: '#DCDDDC',
        gray2: '#9A9A9A',
        gray3: '#828282',
        brown0: '#877263',
        brown1: '#866D5D',
        brown2: '#6A5344',
        peach0: '#FCF3E6',
        peach1: '#FCE1CF',
        'peach1-transparent': '#FCF3E6',
        peach2: '#F7DBC2',
      },
      backgroundImage: {
        'custom-gradient-basic':
          'linear-gradient(270deg, #FFF3C7 0%, #FFDBB1 49%, #F7CABB 100%)',
      },
      fontWeight: {
        regular: 400,
      },
      boxShadow: {
        custom: '0px 4px 20px rgba(44, 27, 11, 0.08)',
      },
    },
  },
  plugins: [require('tailwindcss-filters')],
};
