/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mana: {
          w: '#f0e68c',
          u: '#4a90e2',
          b: '#b19cd9',
          r: '#ff6b6b',
          g: '#51cf66',
          c: '#9ca3af',
        }
      }
    },
  },
  plugins: [],
}