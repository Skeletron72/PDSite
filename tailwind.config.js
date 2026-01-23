/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        pixel: ['"Press Start 2P"', 'system-ui'],
      },
      colors: {
        pixel: {
          black: '#000000',
          white: '#ffffff',
          primary: '#e76e55',
          secondary: '#209cee',
          success: '#92cc41',
          warning: '#f7d51d',
          error: '#e76e55',
        }
      }
    },
  },
  plugins: [],
}
