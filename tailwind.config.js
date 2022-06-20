/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    colors: {
      dark: {
        100: '#C1C2C5',
        200: '#A6A7AB',
        300: '#909296',
        400: '#5C5F66',
        500: '#373A40',
        600: '#2C2E33',
        700: '#25262B',
        800: '#1A1B1E',
        900: '#141517',
        1000: '#101113',
      },
      blue: {
        200: '#4dabf7',
        400: '#1971c2',
      },
    },
    extend: {},
    screens: {
      xxs: '290px',
      xs: '576px',
      sm: '768px',
      md: '992px',
      lg: '1200px',
      xl: '1400px',
    },
  },
  plugins: [],
}
