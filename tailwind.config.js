/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./**/*.{html,js,md,liquid}",
  ],
  theme: {
    fontFamily: {
      'mono': ['Fira Code', 'ui-monospace', 'SFMono-Regular'],
    },
    container: {
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        lg: '4rem',
        xl: '5rem',
        '2xl': '6rem',
      },
    },
    colors: {
      'pink': {
        600: '#FE0170',
      },
      'yellow': {
        400: '#FFC403',
      },
      'light': "#FFFFFF",
      'dark': "#1B1237"
    },
  },
  plugins: [],
}

