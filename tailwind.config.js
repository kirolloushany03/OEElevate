/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}"
  ],
  darkMode: ['class', 'dark'],
  theme: {
    extend: {
      colors: {
        bg: {
          main: 'var(--main-bg)',
          DEFAULT: 'var(--default-bg)',
          primary: 'var(--primary-bg)',
        },
        fg: {
          DEFAULT: 'var(--default-fg)',
          primary: 'var(--primary-fg)',
        }
      },
    },
    plugins: [],
  }
}
