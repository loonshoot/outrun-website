/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./**/*.{html,js,md,liquid}",
  ],
  theme: {
    fontFamily: {
      'mono': ['Fira Code', 'ui-monospace', 'SFMono-Regular'],
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

