/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}"
  ],
  darkMode: ['class', 'dark'],
  important: '#wrapper',
  theme: {
    extend: {
      colors: {
        bg: {
          main: 'var(--main-bg)',
          DEFAULT: 'var(--default-bg)',
          primary: 'var(--primary)',
        },
        fg: {
          DEFAULT: 'var(--default-fg)',
          primary: 'var(--primary-fg)',
          muted: 'var(--muted-fg)',
        },
        primary: {
          DEFAULT: 'var(--primary)',
          light: 'var(--primary-light)',
          dark: 'var(--primary-dark)',
          fg: 'var(--primary-fg)',
        },
        danger: {
          DEFAULT: 'var(--danger)',
          // light: 'var(--danger-light)',
          dark: 'var(--danger-dark)',
          fg: 'var(--danger-fg)',
        },
        muted: {
          DEFAULT: 'var(--muted-fg)',
        },
        sidebar: {
          DEFAULT: 'var(--sidebar-bg)',
        },
      },
    },
    plugins: [],
  }
}
