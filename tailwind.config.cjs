/** @type {import('tailwindcss').Config} */
// 서울365치과 — 비주얼 시스템 v6 (2026-11-04 전면 리디자인)
// 팔레트: 종이 흰색(paper) + 잉크 네이비(ink/night) + 코발트 한 가지(primary). 네온·그라데이션 글씨 금지.
// gray 스케일은 잉크 계열로 재정의 → 하위페이지의 text-gray-*·bg-gray-* 가 그대로 새 톤을 입는다.
module.exports = {
  content: [
    './src/**/*.{tsx,ts,jsx,js}',
  ],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#1E4BD8', bright: '#3B63E8', dark: '#1538A8', light: '#E6ECFA', lighter: '#F2F5FC' },
        navy: { DEFAULT: '#0B1530', light: '#102048', lighter: '#152653' },
        accent: '#8FB4FF',
        cyan: '#8FB4FF',
        paper: { DEFAULT: '#F6F7FA', 2: '#EEF1F7' },
        ink: { DEFAULT: '#0B1530', 2: '#3D4A63', 3: '#6C7892' },
        gray: {
          50: '#F6F7FA', 100: '#EEF1F7', 200: '#DDE3EE', 300: '#C3CBDB', 400: '#8D97AD',
          500: '#6C7892', 600: '#4E5A75', 700: '#3D4A63', 800: '#1F2A45', 900: '#0B1530', 950: '#070D1F',
        },
      },
      fontFamily: {
        sans: ['Pretendard Variable', 'Pretendard', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'Roboto', 'Helvetica Neue', 'sans-serif'],
        display: ['Paperlogy', 'Pretendard Variable', 'Pretendard', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
        mono: ['Geist Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
}
