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
      'purple': {
        500: '#471695',
      },
      'red': {
        600: '#FF404D',
      },
      'grey': {
        500: "#D9D9D9",
      },
      'cyan': {
        500: "#00f3ff",
      },
      'blue': {
        500: "#3b82f6",
        600: "#0080ff",
        700: "#1e40af",
      },
      'orange': {
        500: "#f97316",
      },
      'light': "#FFFFFF",
      'dark': "#1B1237"
    },
  },
  plugins: [],
}

