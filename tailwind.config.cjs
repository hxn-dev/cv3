/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        'red-main': '#D44545',
        'red-main-darker': '#B63B3B'
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
