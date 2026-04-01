/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{tsx,ts,jsx,js,html}',
    './public/**/*.{html,js}',
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
