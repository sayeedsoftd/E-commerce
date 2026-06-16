/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f7ff',
          100: '#ebf0ff',
          200: '#d6e0ff',
          300: '#adc2ff',
          400: '#7594ff',
          500: '#3b66ff',
          600: '#2544e6',
          700: '#1a30bf',
          800: '#152699',
          900: '#111e7a',
        },
      },
    },
  },
  plugins: [],
}
