/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{tsx,ts,jsx,js}',
  ],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#0066FF', bright: '#2979FF', dark: '#0050CC', light: '#E3F0FF', lighter: '#F0F7FF' },
        navy: { DEFAULT: '#040B18', light: '#0A1628', lighter: '#111827' },
        accent: '#00E5FF',
        cyan: '#00E5FF',
      },
      fontFamily: {
        sans: ['Pretendard Variable', 'Pretendard', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'Roboto', 'Helvetica Neue', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
