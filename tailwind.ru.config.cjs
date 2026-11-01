// /ru(러시아어 랜딩) 전용 Tailwind 설정 — 2026-11-01 CDN 실행(cdn.tailwindcss.com + 인라인 tailwind.config)에서 이동.
// 본 사이트(tailwind.config.cjs)와 색·폰트가 달라(navy 단색·Inter) 별도 파일로 빌드한다. 테마 값은 옛 인라인 설정 그대로.
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/routes/ru.tsx'],
  theme: {
    extend: {
      colors: {
        navy: '#040B18',
        'navy-light': '#0A1628',
        primary: '#0066FF',
        accent: '#00E5FF',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
