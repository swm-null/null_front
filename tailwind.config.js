/** @type {import('tailwindcss').Config} */
export default {
  mode: 'jit',
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        gray0: '#F9F9F9',
        gray1: '#DCDDDC',
        gray2: '#828282',
        brown0: '#877263',
        brown1: '#6A5344',
        peach0: '#FCF3E6CC',
        peach1: '#FCE1CF',
        'peach1-transparent': '#FCF3E6',
        peach2: '#F7DBC2',
        shadow0: '#0000001A',
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
