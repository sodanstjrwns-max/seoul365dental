import { Hono } from 'hono'
import { html, raw } from 'hono/html'
import type { Bindings } from '../lib/types'
import { CLINIC } from '../data/clinic'
import { getSetting, initSettingsTable } from '../lib/db'
import { Icon } from '../lib/icons'

declare const __TAILWIND_RU_CSS_V__: string

const ruRoutes = new Hono<{ Bindings: Bindings }>()

// 인라인 선 아이콘(2026-11-05 4차 손질: FontAwesome 제거). Icon 은 raw 문자열이라 html 템플릿에 그대로 넣는다.
const ic = (name: string, size = 18) => Icon({ name, size })
// 텔레그램(종이비행기) — 공용 아이콘 세트에 없어 이 문서 안에만 둔다.
const tgIcon = (size: number) => raw(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M21.4 3.6 2.9 10.8c-.8.3-.7 1.4.1 1.6l4.6 1.4 1.8 5.4c.2.7 1.1.9 1.6.3l2.5-2.8 4.6 3.4c.5.4 1.3.1 1.4-.6l2.9-14.6c.1-.8-.5-1.4-1.2-1.1Z"/><path d="m7.6 13.8 9.9-6.5-7 8"/></svg>`)
const TG = tgIcon(18)
const TG14 = tgIcon(14)
const TG20 = tgIcon(20)

// ══════════════════════════════════════════════════════════
// 🇷🇺 Russian Landing Page — /ru
// Полностью русскоязычная посадочная страница
// DB-driven pricing via getSetting()
// ══════════════════════════════════════════════════════════
ruRoutes.get('/ru', async (c) => {
  await initSettingsTable(c.env.DB)
  const currentYear = new Date().getFullYear() // 저작권 연도 자동 갱신 (F2)

  // DB에서 이벤트 수가 설정 로딩
  const brand = await getSetting(c.env.DB, 'EVENT_IMPLANT_BRAND', '오스템')
  const brandEn = await getSetting(c.env.DB, 'EVENT_IMPLANT_BRAND_EN', 'Osstem')
  const model = await getSetting(c.env.DB, 'EVENT_IMPLANT_MODEL', 'TS III SA')
  const price = await getSetting(c.env.DB, 'EVENT_IMPLANT_PRICE', '69')
  const originalPrice = await getSetting(c.env.DB, 'EVENT_IMPLANT_ORIGINAL_PRICE', '89')
  const periodText = await getSetting(c.env.DB, 'EVENT_IMPLANT_PERIOD', '2026.05.01 ~ до окончания запасов')
  const isActive = await getSetting(c.env.DB, 'EVENT_IMPLANT_ACTIVE', '1')

  const priceWon = parseInt(price) * 10000
  const originalWon = parseInt(originalPrice) * 10000

  // 루블 환산 (대략 1₩ ≈ 0.068₽, 2026 기준 근사치)
  const rubRate = 0.068
  const priceRub = Math.round(priceWon * rubRate).toLocaleString('ru-RU')
  const originalRub = Math.round(originalWon * rubRate).toLocaleString('ru-RU')

  const pageTitle = `Имплант ${brandEn} ${price}0,000₩ | Стоматология Сеул 365 | Инчхон`
  const pageDesc = `Стоматология Seoul 365 в Инчхоне — импланты ${brandEn} от ${price}0,000₩ (≈${priceRub}₽). Врачи из Сеульского университета. Навигационная хирургия. Собственная зуботехническая лаборатория. 365 дней в году. ☎ 032-432-0365`

  const pageHtml = html`<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover"/>
  <title>${pageTitle}</title>
  <meta name="description" content="${pageDesc}"/>
  <meta name="keywords" content="стоматология Инчхон, имплант Инчхон, зубной имплант Корея, имплант цена Инчхон, Osstem имплант, Straumann имплант, стоматолог Инчхон, русскоговорящий стоматолог Инчхон, Seoul 365 Dental, зубная клиника Инчхон, дентальная имплантация Корея"/>
  <link rel="canonical" href="https://seoul365dc.kr/ru"/>
  <meta name="robots" content="index, follow"/>

  <!-- Language -->
  <meta http-equiv="content-language" content="ru"/>
  <link rel="alternate" hreflang="ru" href="https://seoul365dc.kr/ru"/>
  <link rel="alternate" hreflang="ko-KR" href="https://seoul365dc.kr"/>
  <link rel="alternate" hreflang="x-default" href="https://seoul365dc.kr"/>

  <!-- Geo -->
  <meta name="geo.region" content="KR-28"/>
  <meta name="geo.placename" content="Инчхон, Намдон-гу"/>
  <meta name="geo.position" content="37.4482;126.7042"/>

  <!-- OG -->
  <meta property="og:type" content="website"/>
  <meta property="og:site_name" content="Seoul 365 Dental — Стоматология"/>
  <meta property="og:title" content="${pageTitle}"/>
  <meta property="og:description" content="${pageDesc}"/>
  <meta property="og:url" content="https://seoul365dc.kr/ru"/>
  <meta property="og:image" content="https://seoul365dc.kr/static/og-image.png"/>
  <meta property="og:locale" content="ru_RU"/>

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image"/>
  <meta name="twitter:title" content="${pageTitle}"/>
  <meta name="twitter:description" content="${pageDesc}"/>

  <!-- Theme -->
  <meta name="theme-color" content="#0B1530"/>
  <link rel="icon" href="/favicon.ico?v=fav20261014" sizes="any"/>
  <link rel="icon" type="image/png" sizes="48x48" href="/favicon-48.png?v=fav20261014"/>
  <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96.png?v=fav20261014"/>
  <link rel="icon" type="image/png" sizes="192x192" href="/favicon-192.png?v=fav20261014"/>
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png?v=fav20261014"/>

  <!-- Fonts: Geist·Geist Mono(키릴 지원 확인) + Pretendard 동적 서브셋(한글·₩) — 2026-11-05 4차 손질. 아이콘은 인라인 SVG(FontAwesome 제거) -->
  <link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin/>
  <link rel="preload" href="https://cdn.jsdelivr.net/npm/geist@1.3.1/dist/fonts/geist-sans/Geist-Variable.woff2" as="font" type="font/woff2" crossorigin/>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css" media="print" onload="this.media='all'"/>
  <noscript><link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"/></noscript>

  <!-- Schema.org -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Dentist",
    "name": "Seoul 365 Dental Clinic — Стоматология Сеул 365",
    "url": "https://seoul365dc.kr/ru",
    "telephone": "+82-32-432-0365",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Yesul-ro 138, ITO Tower 2F",
      "addressLocality": "Incheon, Namdong-gu",
      "addressCountry": "KR"
    },
    "geo": { "@type": "GeoCoordinates", "latitude": "37.4482", "longitude": "126.7042" },
    "openingHoursSpecification": [
      { "@type": "OpeningHoursSpecification", "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday"], "opens": "10:00", "closes": "21:00" },
      { "@type": "OpeningHoursSpecification", "dayOfWeek": "Friday", "opens": "10:00", "closes": "19:00" },
      { "@type": "OpeningHoursSpecification", "dayOfWeek": "Saturday", "opens": "10:00", "closes": "14:00" },
      { "@type": "OpeningHoursSpecification", "dayOfWeek": "Sunday", "opens": "14:00", "closes": "18:00" }
    ],
    "availableLanguage": ["Korean", "English", "Russian"],
    "priceRange": "₩₩~₩₩₩",
    "image": "https://seoul365dc.kr/static/og-image.png"
  }
  </script>

  <!-- Tailwind 빌드 CSS(tailwind.ru.config.cjs, npm run css:build:ru): 4차 손질부터 이 문서는 유틸리티를 쓰지 않고 preflight(초기화)만 쓴다. 아래 <style> 이 뒤에 와야 이긴다. ?v= 는 내용 해시(vite.config) -->
  <link rel="stylesheet" href="/static/tailwind-ru.css?v=${__TAILWIND_RU_CSS_V__}"/>
  <style>
    /* ===== /ru — "낮과 밤, 365" 러시아어 랜딩 (2026-11-05 4차 손질) =====
       독립 문서라 main.css 를 쓰지 않는다. 토큰·조형만 본 사이트와 맞춘다.
       iOS Safari 12 대응(css:build:ru 의 BROWSERSLIST): flex gap·aspect-ratio·inset·clamp()·color-mix·rgb(a b c / d) 를 쓰지 않는다. */
    @font-face { font-family: 'Geist'; font-weight: 100 900; font-display: swap; src: url('https://cdn.jsdelivr.net/npm/geist@1.3.1/dist/fonts/geist-sans/Geist-Variable.woff2') format('woff2'); }
    @font-face { font-family: 'Geist Mono'; font-weight: 100 900; font-display: swap; src: url('https://cdn.jsdelivr.net/npm/geist@1.3.1/dist/fonts/geist-mono/GeistMono-Variable.woff2') format('woff2'); }
    :root {
      --paper: #F6F7FA; --paper-2: #EEF1F7; --card: #FFFFFF;
      --ink: #0B1530; --ink-2: #3D4A63; --ink-3: #6C7892; --ink-4: #A3ACBE;
      --hair: #DDE3EE;
      --blue: #1E4BD8; --blue-2: #1538A8; --blue-tint: rgba(30, 75, 216, .08); --blue-tint-2: rgba(30, 75, 216, .16);
      --sky: #8FB4FF; --sun: #FFC54D; --open: #12B76A;
      --night: #0B1530; --night-2: #102048; --night-3: #152653;
      --on-night: #F6F7FA; --on-night-2: rgba(246, 247, 250, .72); --on-night-3: rgba(246, 247, 250, .48); --hair-night: rgba(246, 247, 250, .12);
      --sans: 'Geist', 'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, system-ui, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      --mono: 'Geist Mono', 'Pretendard Variable', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      --r: 14px; --r-lg: 22px; --r-pill: 999px;
      --sh-card: 0 1px 2px rgba(11, 21, 48, .04), 0 16px 40px -24px rgba(11, 21, 48, .22);
      --sh-float: 0 24px 60px -24px rgba(11, 21, 48, .35);
      --ease: cubic-bezier(.2, .8, .2, 1);
    }
    html { -webkit-text-size-adjust: 100%; scroll-behavior: smooth; }
    body.ru { margin: 0; background: var(--paper); color: var(--ink-2); font-family: var(--sans); font-size: 16px; line-height: 1.7; letter-spacing: -.005em; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; overflow-x: hidden; overflow-wrap: break-word; word-wrap: break-word; }
    .ru a { color: inherit; text-decoration: none; }
    .ru img { display: block; max-width: 100%; height: auto; }
    .ru svg { display: block; flex: none; }
    .ru-wrap { width: calc(100% - 40px); max-width: 1200px; margin-left: auto; margin-right: auto; }
    .ru-wrap.n { max-width: 880px; }
    .ru-mono { font-family: var(--mono); font-variant-numeric: tabular-nums; letter-spacing: -.01em; }
    .ru-ko { font-family: 'Pretendard Variable', Pretendard, -apple-system, system-ui, 'Apple SD Gothic Neo', sans-serif; }

    /* 제목·꼬리표 */
    .ru-h1 { font-weight: 800; font-size: 2.5rem; font-size: max(2.4rem, min(1.2rem + 4.2vw, 4.8rem)); line-height: 1.05; letter-spacing: -.04em; color: var(--on-night); margin: 0 0 1.2rem; }
    .ru-h1 .p { display: inline-block; color: var(--sky); font-variant-numeric: tabular-nums; margin-top: .08em; }
    .ru-h2 { font-weight: 700; font-size: 1.8rem; font-size: max(1.7rem, min(1.15rem + 1.9vw, 2.7rem)); line-height: 1.15; letter-spacing: -.032em; color: var(--ink); margin: 0; text-wrap: balance; }
    .ru-eyebrow { display: inline-flex; align-items: center; margin: 0 0 1rem; font-family: var(--mono); font-size: .72rem; font-weight: 500; letter-spacing: .14em; text-transform: uppercase; color: var(--blue); line-height: 1.3; }
    .ru-eyebrow::before { content: ''; width: 22px; height: 1px; background: currentColor; opacity: .7; margin-right: .6rem; }
    .ru-eyebrow.live::before { width: 8px; height: 8px; border-radius: 50%; background: var(--open); opacity: 1; box-shadow: 0 0 0 0 rgba(18, 183, 106, .5); animation: ru-pulse 2.2s infinite; }
    @keyframes ru-pulse { 0% { box-shadow: 0 0 0 0 rgba(18, 183, 106, .5); } 70% { box-shadow: 0 0 0 9px rgba(18, 183, 106, 0); } 100% { box-shadow: 0 0 0 0 rgba(18, 183, 106, 0); } }
    .ru-lead { font-size: 1.06rem; line-height: 1.75; color: var(--ink-3); margin: 1rem 0 0; }
    .ru-head { max-width: 760px; margin: 0 0 2.6rem; }
    .ru-head.c { margin-left: auto; margin-right: auto; text-align: center; }
    .ru-sec { padding: 4.2rem 0; }
    .ru-sec.alt { background: var(--paper-2); }
    .ru-sec[id], .ru-anchor { scroll-margin-top: 80px; }

    /* 버튼 */
    .ru-btn { display: inline-flex; align-items: center; justify-content: center; padding: .95rem 1.6rem; border-radius: var(--r-pill); font-weight: 600; font-size: .98rem; letter-spacing: -.01em; line-height: 1.1; border: 1px solid transparent; cursor: pointer; white-space: nowrap; transition: transform .32s var(--ease), background .32s, border-color .32s, box-shadow .32s; }
    .ru-btn svg { margin-right: .55rem; width: 1.05em; height: 1.05em; }
    .ru-btn:hover { transform: translateY(-2px); }
    .ru-btn.primary { background: var(--blue); color: #fff; box-shadow: 0 12px 26px -14px rgba(30, 75, 216, .7); }
    .ru-btn.primary:hover { background: var(--blue-2); }
    .ru-btn.white { background: #fff; color: var(--ink); }
    .ru-btn.tg { background: #0088CC; color: #fff; }
    .ru-btn.tg:hover { background: #007AB8; }
    .ru-btn.kakao { background: #FEE500; color: #191919; }
    .ru-btn.kakao:hover { background: #F7DC00; }
    .ru-btn.sm { padding: .62rem 1.1rem; font-size: .86rem; }
    .ru-btn.lg { padding: 1.1rem 1.9rem; font-size: 1.04rem; }
    .ru-btns { display: flex; flex-wrap: wrap; margin: -.35rem; }
    .ru-btns > * { margin: .35rem; }
    .ru-btns.c { justify-content: center; }

    /* 상단 띠·머리 */
    .ru-top { background: var(--night); color: var(--on-night-3); font-size: .76rem; padding: .5rem 0; }
    .ru-top .ru-wrap { display: flex; align-items: center; justify-content: space-between; }
    .ru-top span, .ru-top a { margin-right: .8rem; } .ru-top .r > :last-child { margin-right: 0; }
    .ru-top b { font-weight: 600; color: var(--on-night-2); }
    .ru-top .sep { opacity: .35; }
    .ru-top a { display: inline-flex; align-items: center; } .ru-top a:hover { color: var(--sky); }
    .ru-top a svg { margin-right: .3rem; }
    .ru-top .l, .ru-top .r { display: flex; align-items: center; }
    .ru-flag { display: inline-block; font-size: 1rem; }
    .ru-header { position: -webkit-sticky; position: sticky; top: 0; z-index: 50; background: rgba(246, 247, 250, .92); -webkit-backdrop-filter: blur(14px); backdrop-filter: blur(14px); border-bottom: 1px solid var(--hair); }
    .ru-nav { height: 64px; display: flex; align-items: center; justify-content: space-between; }
    .ru-logo { display: flex; align-items: center; }
    .ru-logo .mark { width: 38px; height: 38px; border-radius: 12px; background: var(--blue); display: flex; align-items: center; justify-content: center; flex: none; margin-right: .65rem; box-shadow: 0 6px 16px -8px rgba(30, 75, 216, .7); }
    .ru-logo .mark img { width: 24px; height: 24px; object-fit: contain; }
    .ru-logo span { display: flex; flex-direction: column; line-height: 1; }
    .ru-logo b { font-size: .98rem; font-weight: 800; letter-spacing: -.03em; color: var(--ink); }
    .ru-logo small { font-family: var(--mono); font-size: .56rem; letter-spacing: .16em; color: var(--ink-3); margin-top: .3rem; }
    .ru-menu { display: none; }
    .ru-menu a { font-size: .9rem; font-weight: 500; color: var(--ink-3); margin: 0 .75rem; transition: color .3s; }
    .ru-menu a:hover { color: var(--blue); }
    .ru-nav .act { display: flex; align-items: center; }
    .ru-nav .tel { display: none; align-items: center; font-family: var(--mono); font-size: .86rem; color: var(--ink-2); margin-right: .9rem; }
    .ru-nav .tel svg { margin-right: .4rem; }

    /* 히어로(밤) */
    .ru-hero { position: relative; background: var(--night); color: var(--on-night); overflow: hidden; padding: 3.6rem 0 3.8rem; }
    .ru-hero::before { content: ''; position: absolute; top: 0; right: 0; bottom: 0; left: 0; background: radial-gradient(55% 60% at 15% 30%, rgba(30, 75, 216, .38), transparent 60%), radial-gradient(40% 50% at 90% 90%, rgba(143, 180, 255, .14), transparent 60%); pointer-events: none; }
    .ru-hero::after { content: ''; position: absolute; top: 0; right: 0; bottom: 0; left: 0; background-image: linear-gradient(rgba(255, 255, 255, .05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, .05) 1px, transparent 1px); background-size: 72px 72px; -webkit-mask-image: radial-gradient(60% 70% at 70% 50%, #000, transparent 100%); mask-image: radial-gradient(60% 70% at 70% 50%, #000, transparent 100%); pointer-events: none; }
    .ru-hero > .ru-wrap { position: relative; z-index: 1; }
    .ru-hero-in { display: grid; grid-template-columns: minmax(0, 1fr); grid-gap: 2.2rem; gap: 2.2rem; align-items: center; }
    .ru-hero .ru-eyebrow { color: var(--sky); }
    .ru-hero .ru-lead { color: var(--on-night-2); margin: 0 0 1.8rem; max-width: 34em; }
    .ru-hero .ru-lead br { display: none; }
    .ru-period { display: flex; align-items: center; font-size: .84rem; color: var(--on-night-3); margin: 1.4rem 0 0; }
    .ru-period svg { margin-right: .45rem; }
    .ru-fact { background: rgba(255, 255, 255, .06); border: 1px solid var(--hair-night); border-radius: var(--r-lg); padding: 1.5rem 1.6rem; -webkit-backdrop-filter: blur(10px); backdrop-filter: blur(10px); }
    .ru-fact .row { padding: .2rem 0; }
    .ru-fact .k { display: block; font-family: var(--mono); font-size: .7rem; letter-spacing: .12em; text-transform: uppercase; color: var(--on-night-3); margin-bottom: .35rem; }
    .ru-fact .row.now .k { color: var(--sun); }
    .ru-fact .old { font-variant-numeric: tabular-nums; font-size: 1.5rem; font-weight: 600; letter-spacing: -.03em; color: var(--on-night-3); text-decoration: line-through; margin: 0; line-height: 1.2; }
    .ru-fact .new { font-variant-numeric: tabular-nums; font-weight: 800; font-size: 3rem; font-size: max(2.6rem, min(1.8rem + 2.4vw, 3.8rem)); letter-spacing: -.05em; line-height: 1; color: var(--on-night); margin: 0; }
    .ru-fact .new span { font-size: .5em; letter-spacing: -.03em; color: var(--sky); }
    .ru-fact .s { display: block; font-family: var(--mono); font-size: .8rem; color: var(--on-night-3); margin-top: .35rem; }
    .ru-fact .row.now .s { color: var(--sky); font-size: .92rem; }
    .ru-fact .arr { font-family: var(--mono); color: var(--on-night-3); font-size: 1.2rem; line-height: 1; margin: .9rem 0; padding-bottom: .9rem; border-bottom: 1px solid var(--hair-night); transform-origin: left center; }

    /* 숫자 띠 */
    .ru-stats { display: grid; grid-template-columns: 1fr 1fr; border-top: 1px solid var(--hair); border-left: 1px solid var(--hair); background: var(--card); border-radius: var(--r-lg); overflow: hidden; box-shadow: var(--sh-card); }
    .ru-stat { padding: 1.4rem 1.3rem; border-right: 1px solid var(--hair); border-bottom: 1px solid var(--hair); }
    .ru-stat .v { font-family: var(--mono); font-weight: 600; font-size: 2.2rem; letter-spacing: -.05em; line-height: 1; color: var(--ink); margin-bottom: .6rem; min-height: 2.2rem; display: flex; align-items: center; }
    .ru-stat .v svg { color: var(--blue); }
    .ru-stat .d { font-size: .84rem; line-height: 1.5; color: var(--ink-3); }
    .ru-statband { padding: 2.2rem 0 0; margin-top: -1px; }

    /* 카드 */
    .ru-card { background: var(--card); border: 1px solid var(--hair); border-radius: var(--r-lg); box-shadow: var(--sh-card); }
    .ru-grid3 { display: grid; grid-template-columns: minmax(0, 1fr); grid-gap: .9rem; gap: .9rem; }
    .ru-svc { padding: 1.5rem 1.5rem 1.6rem; transition: transform .32s var(--ease), box-shadow .32s, border-color .32s; }
    .ru-svc:hover { transform: translateY(-4px); box-shadow: var(--sh-float); border-color: var(--blue-tint-2); }
    .ru-n { display: block; font-family: var(--mono); font-size: .74rem; color: var(--blue); margin-bottom: .8rem; }
    .ru-svc h3, .ru-why h3 { font-weight: 700; font-size: 1.14rem; letter-spacing: -.02em; line-height: 1.3; color: var(--ink); margin: 0 0 .5rem; }
    .ru-svc p, .ru-why p { font-size: .92rem; line-height: 1.7; color: var(--ink-2); margin: 0; }

    /* 대표원장 */
    .ru-two { display: grid; grid-template-columns: minmax(0, 1fr); grid-gap: 2.6rem; gap: 2.6rem; align-items: center; }
    .ru-photo-wrap { position: relative; }
    .ru-photo { position: relative; border-radius: var(--r-lg); overflow: hidden; background: var(--paper-2); box-shadow: var(--sh-float); }
    .ru-photo img { width: 100%; }
    .ru-photo .ov { position: absolute; left: 0; right: 0; bottom: 0; padding: 3.5rem 1.2rem 1.2rem; background: linear-gradient(to top, rgba(11, 21, 48, .82), rgba(11, 21, 48, 0)); display: flex; flex-wrap: wrap; }
    .ru-badge { display: inline-flex; align-items: center; font-size: .72rem; font-weight: 600; padding: .32rem .7rem; border-radius: var(--r-pill); background: rgba(255, 255, 255, .16); color: #fff; margin: .2rem .4rem .2rem 0; -webkit-backdrop-filter: blur(6px); backdrop-filter: blur(6px); }
    .ru-badge.b { background: var(--blue); }
    .ru-cred { position: absolute; right: 14px; top: 14px; display: flex; align-items: center; padding: .7rem .9rem; max-width: 210px; border-radius: var(--r); }
    .ru-cred .m { width: 38px; height: 38px; border-radius: 12px; background: var(--sun); color: var(--ink); display: flex; align-items: center; justify-content: center; margin-right: .7rem; flex: none; }
    .ru-cred b { display: block; font-size: .82rem; color: var(--ink); line-height: 1.2; }
    .ru-cred small { display: block; font-family: var(--mono); font-size: .66rem; color: var(--ink-3); margin-top: .15rem; }
    .ru-bio .ko { font-size: 1.05rem; font-weight: 600; color: var(--blue); margin: .5rem 0 1.5rem; }
    .ru-checks { list-style: none; margin: 0 0 1.8rem; padding: 0; border-top: 1px solid var(--hair); }
    .ru-checks li { display: flex; align-items: flex-start; padding: .75rem 0; border-bottom: 1px solid var(--hair); font-size: .93rem; line-height: 1.55; color: var(--ink-2); }
    .ru-checks svg { width: 20px; height: 20px; color: #fff; background: var(--blue); border-radius: 50%; padding: 4px; margin: .05rem .8rem 0 0; }
    .ru-quote { border-left: 4px solid var(--blue); padding: .2rem 0 .2rem 1.2rem; margin: 0 0 1.8rem; }
    .ru-quote p { font-size: 1.04rem; font-weight: 500; line-height: 1.65; letter-spacing: -.012em; color: var(--ink); margin: 0; }
    .ru-quote cite { display: block; font-style: normal; font-size: .8rem; color: var(--ink-3); margin-top: .6rem; }

    /* 가격 표 */
    .ru-table-wrap { overflow: hidden; }
    .ru-table-scroll { overflow-x: auto; -webkit-overflow-scrolling: touch; }
    .ru-table { width: 100%; min-width: 560px; border-collapse: collapse; font-size: .92rem; }
    .ru-table th, .ru-table td { padding: 1rem 1.1rem; text-align: center; border-bottom: 1px solid var(--hair); vertical-align: middle; }
    .ru-table th:first-child, .ru-table td:first-child { text-align: left; padding-left: 1.5rem; }
    .ru-table thead th { font-family: var(--mono); font-size: .7rem; letter-spacing: .1em; text-transform: uppercase; color: var(--ink-3); font-weight: 500; background: var(--paper-2); white-space: nowrap; }
    .ru-table tbody tr:last-child td { border-bottom: 0; }
    .ru-table .name { font-weight: 700; color: var(--ink); }
    .ru-table .tag { display: block; font-family: var(--mono); font-size: .66rem; letter-spacing: .12em; color: var(--blue); margin-top: .2rem; }
    .ru-table .c { display: inline-block; font-size: .74rem; color: var(--ink-2); background: var(--paper-2); padding: .22rem .6rem; border-radius: var(--r-pill); white-space: nowrap; }
    .ru-table .won { font-family: var(--mono); font-weight: 600; color: var(--ink); white-space: nowrap; }
    .ru-table .rub { font-family: var(--mono); font-size: .86rem; color: var(--ink-3); white-space: nowrap; }
    .ru-table tr.ev td { background: var(--blue-tint); }
    .ru-table tr.ev .won { font-family: var(--sans); font-weight: 800; font-size: 1.5rem; letter-spacing: -.04em; color: var(--blue); }
    .ru-table tr.ev .rub, .ru-table tr.ev2 .rub, .ru-table tr.ev2 .won { color: var(--blue); font-weight: 600; }
    .ru-table tr.ev .c { background: var(--card); }
    .ru-table-note { padding: 1rem 1.5rem; border-top: 1px solid var(--hair); background: var(--paper); font-size: .78rem; line-height: 1.7; color: var(--ink-3); margin: 0; }

    /* 팀 */
    .ru-team-photo { position: relative; border-radius: var(--r-lg); overflow: hidden; background: var(--night-3); box-shadow: var(--sh-float); margin-bottom: 1.6rem; }
    .ru-team-photo img { width: 100%; }
    .ru-team-photo .ov { padding: 1.3rem 1.3rem 1.2rem; background: var(--night); }
    .ru-team-photo h3 { font-weight: 800; font-size: 1.5rem; letter-spacing: -.035em; line-height: 1.15; color: #fff; margin: 0 0 .4rem; }
    .ru-team-photo p { font-size: .88rem; line-height: 1.5; color: rgba(246, 247, 250, .72); margin: 0 0 .7rem; }
    .ru-chips { display: flex; flex-wrap: wrap; }
    .ru-docs { display: grid; grid-template-columns: 1fr 1fr; grid-gap: .8rem; gap: .8rem; }
    .ru-doc { text-align: center; }
    .ru-doc .ph { position: relative; padding-top: 133.333%; border-radius: var(--r-lg); overflow: hidden; background: var(--paper-2); margin-bottom: .7rem; }
    .ru-doc .ph img { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; object-position: top; transition: transform .8s var(--ease); }
    .ru-doc:hover .ph img { transform: scale(1.04); }
    .ru-doc .ph .ru-badge { position: absolute; left: .6rem; bottom: .6rem; margin: 0; font-size: .64rem; }
    .ru-doc b { display: block; font-size: .96rem; font-weight: 700; letter-spacing: -.02em; color: var(--ink); line-height: 1.3; }
    .ru-doc small { display: block; font-size: .76rem; color: var(--ink-3); margin-top: .15rem; }
    .ru-cap { text-align: center; font-size: .86rem; color: var(--ink-3); margin: 1.8rem 0 0; }

    /* 이유(가는 선 그리드) */
    .ru-whys { display: grid; grid-template-columns: minmax(0, 1fr); border-top: 1px solid var(--hair); }
    .ru-why { padding: 1.5rem 0; border-bottom: 1px solid var(--hair); }

    /* 단계 */
    .ru-steps { list-style: none; margin: 0; padding: 0; position: relative; }
    .ru-steps::before { content: ''; position: absolute; left: 1.35rem; top: .8rem; bottom: .8rem; width: 1px; background: var(--hair); }
    .ru-step { position: relative; display: flex; flex-wrap: wrap; align-items: flex-start; padding: 0 0 1.7rem; }
    .ru-step:last-child { padding-bottom: 0; }
    .ru-step .no { width: 2.7rem; height: 2.7rem; border-radius: 50%; background: var(--card); border: 1px solid var(--hair); display: flex; align-items: center; justify-content: center; font-family: var(--mono); font-size: .78rem; color: var(--blue); position: relative; z-index: 1; flex: none; margin-right: 1.2rem; }
    .ru-step .tx { flex: 1 1 calc(100% - 3.9rem); min-width: 0; padding-top: .5rem; }
    .ru-step h3 { font-weight: 700; font-size: 1.08rem; letter-spacing: -.02em; line-height: 1.3; color: var(--ink); margin: 0 0 .25rem; }
    .ru-step p { font-size: .92rem; line-height: 1.65; color: var(--ink-2); margin: 0; }
    .ru-step .du { display: inline-block; font-family: var(--mono); font-size: .72rem; color: var(--blue); background: var(--blue-tint); padding: .3rem .7rem; border-radius: var(--r-pill); white-space: nowrap; margin: .55rem 0 0 3.9rem; }

    /* FAQ */
    .ru-fq { background: var(--card); border: 1px solid var(--hair); border-radius: var(--r); margin-bottom: .6rem; transition: border-color .32s; }
    .ru-fq[open] { border-color: var(--blue-tint-2); }
    .ru-fq summary { list-style: none; cursor: pointer; display: flex; align-items: center; justify-content: space-between; padding: 1.1rem 1.25rem; font-weight: 600; font-size: 1rem; line-height: 1.45; letter-spacing: -.012em; color: var(--ink); -webkit-user-select: none; user-select: none; }
    .ru-fq summary::-webkit-details-marker { display: none; }
    .ru-fq summary .pm { flex: none; width: 30px; height: 30px; border-radius: 50%; border: 1px solid var(--hair); display: flex; align-items: center; justify-content: center; color: var(--ink-3); margin-left: 1rem; transition: transform .35s var(--ease), background .32s, color .32s; }
    .ru-fq[open] summary .pm { transform: rotate(45deg); background: var(--blue); border-color: var(--blue); color: #fff; }
    .ru-fq .a { padding: 0 1.25rem 1.25rem; font-size: .95rem; line-height: 1.8; color: var(--ink-2); }
    .ru-fq .a strong { color: var(--ink); font-weight: 600; }

    /* 연락처 */
    .ru-contact { display: grid; grid-template-columns: minmax(0, 1fr); grid-gap: 1rem; gap: 1rem; align-items: start; }
    .ru-box { padding: 1.6rem 1.5rem; }
    .ru-box h3 { display: flex; align-items: center; font-family: var(--mono); font-size: .74rem; letter-spacing: .14em; text-transform: uppercase; font-weight: 500; color: var(--blue); margin: 0 0 1.1rem; }
    .ru-box h3 svg { margin-right: .5rem; }
    .ru-hours { background: var(--night); border-color: var(--night); color: var(--on-night); position: relative; overflow: hidden; }
    .ru-hours::before { content: ''; position: absolute; left: 0; right: 0; bottom: 0; height: 70%; background: radial-gradient(60% 70% at 50% 110%, rgba(30, 75, 216, .45), transparent 70%); pointer-events: none; }
    .ru-hours > * { position: relative; }
    .ru-hours h3 { color: var(--sky); }
    .ru-hrow { display: flex; justify-content: space-between; align-items: center; padding: .85rem 0; border-bottom: 1px solid var(--hair-night); font-size: .95rem; }
    .ru-hrow span:first-child { color: var(--on-night-2); padding-right: 1rem; }
    .ru-hrow span:last-child { font-family: var(--mono); color: var(--on-night); white-space: nowrap; }
    .ru-open { display: flex; align-items: center; margin: 1.2rem 0 0; color: var(--open); font-weight: 600; font-size: .9rem; }
    .ru-open::before { content: ''; width: 8px; height: 8px; border-radius: 50%; background: var(--open); margin-right: .5rem; animation: ru-pulse 2.2s infinite; }
    .ru-addr .nm { font-weight: 700; font-size: 1.15rem; letter-spacing: -.02em; color: var(--ink); margin: 0; }
    .ru-addr .sub { font-size: .86rem; color: var(--ink-3); margin: .2rem 0 1rem; }
    .ru-arow { display: flex; align-items: flex-start; padding: .75rem 0; border-top: 1px solid var(--hair); font-size: .94rem; color: var(--ink-2); }
    .ru-arow svg { color: var(--blue); margin: .25rem .7rem 0 0; }
    .ru-arow p { margin: 0; line-height: 1.55; }
    .ru-arow .sm { font-size: .84rem; color: var(--ink-3); margin-top: .25rem; }
    .ru-arow a { font-family: var(--mono); font-weight: 600; font-size: 1.1rem; color: var(--blue); }
    .ru-arow a:hover { text-decoration: underline; }
    .ru-map { border-radius: var(--r); overflow: hidden; border: 1px solid var(--hair); margin-top: 1rem; }
    .ru-map iframe { display: block; width: 100%; height: 220px; border: 0; }

    /* 마지막 상담 띠·푸터 */
    .ru-cta { position: relative; background: var(--night); color: var(--on-night); overflow: hidden; padding: 4.6rem 0; text-align: center; }
    .ru-cta::before { content: ''; position: absolute; left: -10%; right: -10%; bottom: -40%; height: 70%; background: radial-gradient(50% 60% at 50% 100%, rgba(30, 75, 216, .55), transparent 70%); pointer-events: none; }
    .ru-cta > .ru-wrap { position: relative; }
    .ru-cta .ru-h2 { color: var(--on-night); font-weight: 800; font-size: 2.1rem; font-size: max(2rem, min(1.2rem + 3.2vw, 3.6rem)); letter-spacing: -.04em; line-height: 1.08; }
    .ru-cta .ru-h2 span { color: var(--sky); }
    .ru-cta .ru-lead { color: var(--on-night-2); margin: 1.2rem 0 2.2rem; }
    .ru-meta { display: flex; flex-wrap: wrap; justify-content: center; margin: 1.8rem 0 0; font-size: .86rem; color: var(--on-night-3); }
    .ru-meta span { display: inline-flex; align-items: center; margin: .2rem .8rem; }
    .ru-meta svg { margin-right: .4rem; }
    .ru-footer { background: var(--night); border-top: 1px solid var(--hair-night); padding: 2.4rem 0 5.6rem; }
    .ru-footer .top { display: flex; flex-direction: column; align-items: center; margin-bottom: 1.8rem; }
    .ru-footer .ru-logo { margin-bottom: 1.2rem; }
    .ru-footer .ru-logo .mark { width: 34px; height: 34px; border-radius: 10px; }
    .ru-footer .ru-logo .mark img { width: 21px; height: 21px; }
    .ru-footer .ru-logo b { color: #fff; font-size: .9rem; }
    .ru-footer .ru-logo small { color: var(--on-night-3); }
    .ru-flinks { display: flex; flex-wrap: wrap; justify-content: center; }
    .ru-flinks a { display: inline-flex; align-items: center; font-size: .86rem; color: var(--on-night-2); margin: .3rem .7rem; transition: color .3s; }
    .ru-flinks a:hover { color: var(--sky); }
    .ru-flinks a svg { margin-right: .35rem; }
    .ru-legal { border-top: 1px solid var(--hair-night); padding-top: 1.4rem; font-size: .72rem; line-height: 1.75; color: var(--on-night-3); text-align: center; max-width: 780px; margin: 0 auto; }

    /* 모바일 하단 바 */
    .ru-bar { position: fixed; left: 0; right: 0; bottom: 0; z-index: 50; background: rgba(255, 255, 255, .95); -webkit-backdrop-filter: blur(14px); backdrop-filter: blur(14px); border-top: 1px solid var(--hair); display: grid; grid-template-columns: repeat(4, 1fr); padding-bottom: env(safe-area-inset-bottom); }
    .ru-bar a { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: .7rem 0 .6rem; color: var(--ink-3); font-size: .64rem; font-weight: 500; }
    .ru-bar a svg { margin-bottom: .3rem; }
    .ru-bar a.tg { color: #0088CC; }
    .ru-bar a:active { background: var(--paper); }

    /* 등장 연출: JS 가 켠 경우(html.ru-mx)에만 숨김 시작 */
    html.ru-mx [data-rv] { opacity: 0; transform: translateY(18px); transition: opacity .7s var(--ease), transform .7s var(--ease); }
    html.ru-mx [data-rv].in { opacity: 1; transform: none; }

    @media (min-width: 640px) {
      .ru-nav .tel { display: inline-flex; }
      .ru-stats { grid-template-columns: repeat(4, 1fr); }
      .ru-grid3 { grid-template-columns: 1fr 1fr; }
      .ru-docs { grid-template-columns: repeat(3, 1fr); }
      .ru-whys { grid-template-columns: 1fr 1fr; grid-column-gap: 2.5rem; column-gap: 2.5rem; }
      .ru-step { flex-wrap: nowrap; align-items: center; }
      .ru-step .tx { flex: 1 1 0; padding-top: 0; }
      .ru-step .du { margin: 0 0 0 1rem; flex: none; }
      .ru-hero .ru-lead br { display: inline; }
      .ru-team-photo .ov { position: absolute; left: 0; right: 0; bottom: 0; padding: 6rem 2rem 1.8rem; background: linear-gradient(to top, rgba(11, 21, 48, .92), rgba(11, 21, 48, .45) 55%, rgba(11, 21, 48, 0)); }
      .ru-team-photo h3 { font-size: 2rem; }
    }
    @media (min-width: 768px) {
      .ru-menu { display: flex; align-items: center; }
      .ru-bar { display: none; }
      .ru-footer { padding-bottom: 2.6rem; }
      .ru-footer .top { flex-direction: row; justify-content: space-between; }
      .ru-footer .ru-logo { margin-bottom: 0; }
      .ru-sec { padding: 6rem 0; }
      .ru-cta { padding: 6.5rem 0; }
      .ru-two { grid-template-columns: minmax(0, .9fr) minmax(0, 1.1fr); grid-gap: 4rem; gap: 4rem; }
      .ru-contact { grid-template-columns: minmax(0, .85fr) minmax(0, 1.15fr); }
      .ru-box { padding: 2rem; }
    }
    @media (min-width: 1024px) {
      .ru-hero { padding: 5.5rem 0 6rem; }
      .ru-hero-in { grid-template-columns: minmax(0, 1.2fr) minmax(0, .8fr); grid-gap: 4.5rem; gap: 4.5rem; }
      .ru-grid3 { grid-template-columns: repeat(3, 1fr); }
      .ru-docs { grid-template-columns: repeat(5, 1fr); grid-gap: 1rem; gap: 1rem; }
      .ru-whys { grid-template-columns: repeat(3, 1fr); }
    }
    @media (max-width: 639px) {
      .ru-table { min-width: 0; display: block; }
      .ru-table thead { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
      .ru-table tbody { display: block; }
      .ru-table tr { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; padding: .95rem 1.2rem; border-bottom: 1px solid var(--hair); }
      .ru-table tbody tr:last-child { border-bottom: 0; }
      .ru-table tr.ev { background: var(--blue-tint); }
      .ru-table td, .ru-table td:first-child { display: block; padding: 0; border: 0; text-align: left; background: none; }
      .ru-table tr.ev td { background: none; }
      .ru-table td:nth-child(1) { flex: 1 1 55%; padding-right: .8rem; }
      .ru-table td:nth-child(3) { flex: 1 1 50%; margin-top: .55rem; }
      .ru-table td:nth-child(4) { margin-top: .55rem; }
      .ru-table .won::after { content: '₩'; }
      .ru-top .hide-s { display: none; }
      .ru-btns.stack > * { width: calc(100% - .7rem); }
    }
    @media (prefers-reduced-motion: reduce) {
      html { scroll-behavior: auto; }
      .ru *, .ru *::before, .ru *::after { animation: none !important; transition: none !important; }
    }
  </style>
  <script>
    /* 등장 연출: IntersectionObserver 가 있고 동작 줄이기가 꺼져 있을 때만 켠다. 실패하면 전부 보이는 상태로 둔다. */
    (function () {
      var d = document.documentElement;
      try {
        if (!('IntersectionObserver' in window)) return;
        if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        d.className += ' ru-mx';
        document.addEventListener('DOMContentLoaded', function () {
          try {
            var io = new IntersectionObserver(function (es) {
              for (var i = 0; i < es.length; i++) { if (es[i].isIntersecting) { es[i].target.classList.add('in'); io.unobserve(es[i].target); } }
            }, { rootMargin: '0px 0px -2% 0px', threshold: 0 });
            var els = document.querySelectorAll('[data-rv]');
            for (var j = 0; j < els.length; j++) io.observe(els[j]);
          } catch (e) { d.className = d.className.replace(' ru-mx', ''); }
        });
      } catch (e) { d.className = d.className.replace(' ru-mx', ''); }
    })();
  </script>
</head>
<body class="ru">

  <!-- ===== TOP BAR ===== -->
  <div class="ru-top">
    <div class="ru-wrap">
      <div class="l">
        <span class="ru-flag">🇷🇺</span>
        <b>Говорим по-русски</b>
        <span class="sep hide-s">|</span>
        <span class="hide-s">Русскоязычное обслуживание</span>
      </div>
      <div class="r">
        <a href="/" class="ru-ko">🇰🇷 한국어</a>
        <span class="sep">|</span>
        <a href="${CLINIC.phoneTel}" class="ru-mono">
          ${ic('phone', 12)}${CLINIC.phone}
        </a>
      </div>
    </div>
  </div>

  <!-- ===== HEADER ===== -->
  <header class="ru-header">
    <nav class="ru-wrap ru-nav">
      <a href="/ru" class="ru-logo">
        <span class="mark"><img src="/static/logo-v2.png" alt="Seoul 365 Dental" width="174" height="180"/></span>
        <span>
          <b>Seoul 365</b>
          <small>СТОМАТОЛОГИЯ</small>
        </span>
      </a>
      <div class="ru-menu">
        <a href="#services">Услуги</a>
        <a href="#pricing">Цены</a>
        <a href="#about">О клинике</a>
        <a href="#faq">Вопросы</a>
        <a href="#contact">Контакты</a>
      </div>
      <div class="act">
        <a href="${CLINIC.phoneTel}" class="tel">
          ${ic('phone', 14)} ${CLINIC.phone}
        </a>
        <a href="${CLINIC.phoneTel}" class="ru-btn primary sm">
          Позвонить
        </a>
      </div>
    </nav>
  </header>

  <!-- ===== HERO ===== -->
  <section class="ru-hero">
    <div class="ru-wrap ru-hero-in">
      <div>
        <!-- Russian flag badge -->
        <p class="ru-eyebrow live">
          СПЕЦИАЛЬНАЯ АКЦИЯ
        </p>

        <h1 class="ru-h1">
          Имплант ${brandEn}<br/>
          <span class="p">
          ${price}0,000₩
          </span>
        </h1>

        <p class="ru-lead">
          ${brandEn} ${model} · корейский имплант<br/>
          Врачи Сеульского университета · Навигационная хирургия
        </p>

        <!-- CTA buttons -->
        <div class="ru-btns stack">
          <a href="${CLINIC.phoneTel}" class="ru-btn primary lg">
            ${ic('phone')}
            Позвонить сейчас
          </a>
          <a href="https://t.me/seoul365dental" target="_blank" rel="noopener noreferrer" class="ru-btn tg lg">
            ${TG}
            Telegram
          </a>
          <a href="${CLINIC.kakao}" target="_blank" rel="noopener noreferrer" class="ru-btn kakao lg">
            ${ic('chat')}
            KakaoTalk
          </a>
        </div>

        <p class="ru-period">
          ${ic('clock', 15)}
          ${periodText}
        </p>
      </div>

      <!-- Price comparison -->
      <div class="ru-fact">
        <div class="row">
          <span class="k">Обычная цена</span>
          <p class="old">${originalPrice}0,000₩</p>
          <span class="s">≈ ${originalRub} ₽</span>
        </div>
        <div class="arr">→</div>
        <div class="row now">
          <span class="k">Акция</span>
          <p class="new">
            ${price}0<span>,000₩</span>
          </p>
          <span class="s">≈ ${priceRub} ₽</span>
        </div>
      </div>
    </div>
  </section>

  <!-- ===== TRUST BAR ===== -->
  <section class="ru-statband">
    <div class="ru-wrap">
      <div class="ru-stats" data-rv>
        <div class="ru-stat">
          <div class="v">5</div>
          <div class="d">Врачей из<br/>Сеульского университета</div>
        </div>
        <div class="ru-stat">
          <div class="v">365</div>
          <div class="d">Дней в году<br/>Работаем без выходных</div>
        </div>
        <div class="ru-stat">
          <div class="v">21:00</div>
          <div class="d">Вечерний приём<br/>Пн–Чт</div>
        </div>
        <div class="ru-stat">
          <div class="v">
            ${ic('check', 30)}
          </div>
          <div class="d">Своя<br/>зуботехническая лаборатория</div>
        </div>
      </div>
    </div>
  </section>

  <!-- ===== CHIEF DOCTOR ===== -->
  <section class="ru-sec">
    <div class="ru-wrap">
      <div class="ru-two">
        <!-- Photo -->
        <div class="ru-photo-wrap" data-rv>
          <div class="ru-photo">
            <img src="/static/dr-park.jpg" alt="Доктор Пак Чунгю — главный врач Seoul 365 Dental" loading="lazy"/>
            <div class="ov">
              <span class="ru-badge b">Главный врач</span>
              <span class="ru-badge">🇰🇷 Сеульский университет</span>
            </div>
          </div>
          <!-- Floating credential badge -->
          <div class="ru-card ru-cred">
            <div class="m">
              ${ic('check', 18)}
            </div>
            <div>
              <b>Harvard</b>
              <small>Implant Course</small>
            </div>
          </div>
        </div>

        <!-- Bio -->
        <div class="ru-bio" data-rv>
          <span class="ru-eyebrow">ГЛАВНЫЙ ВРАЧ</span>
          <h2 class="ru-h2">
            Доктор Пак Чунгю
          </h2>
          <p class="ko ru-ko">박준규 대표원장</p>

          <ul class="ru-checks">
            <li>
              ${ic('check')}
              <span>Сеульский национальный университет — стоматологический факультет</span>
            </li>
            <li>
              ${ic('check')}
              <span>Сертифицированный специалист по общей стоматологии (Министерство здравоохранения)</span>
            </li>
            <li>
              ${ic('check')}
              <span>Гарвардский университет — курс повышения квалификации по имплантологии</span>
            </li>
            <li>
              ${ic('check')}
              <span>Сертифицированный врач Invisalign</span>
            </li>
            <li>
              ${ic('check')}
              <span>Более 10 000 случаев имплантации</span>
            </li>
          </ul>

          <blockquote class="ru-quote">
            <p>
              «Каждый пациент заслуживает лучшего лечения — независимо от языка и национальности. Мы рады принять вас в Seoul 365.»
            </p>
            <cite>— Д-р Пак Чунгю</cite>
          </blockquote>

          <a href="${CLINIC.phoneTel}" class="ru-btn primary">
            ${ic('phone')}
            Записаться к главному врачу
          </a>
        </div>
      </div>
    </div>
  </section>

  <!-- ===== SERVICES ===== -->
  <section id="services" class="ru-sec alt">
    <div class="ru-wrap">
      <div class="ru-head c" data-rv>
        <span class="ru-eyebrow">НАШИ УСЛУГИ</span>
        <h2 class="ru-h2">Полный спектр стоматологических услуг</h2>
        <p class="ru-lead">Современное оборудование и специалисты мирового уровня</p>
      </div>

      <div class="ru-grid3">
        <div class="ru-card ru-svc" data-rv>
          <span class="ru-n">01</span>
          <h3>Имплантация</h3>
          <p>Osstem, Straumann, MegaGen. Навигационная хирургия с точностью 0,1мм. Возможна седация.</p>
        </div>

        <div class="ru-card ru-svc" data-rv>
          <span class="ru-n">02</span>
          <h3>Ортодонтия</h3>
          <p>Invisalign, керамические брекеты, частичная коррекция. Сертифицированный врач Invisalign.</p>
        </div>

        <div class="ru-card ru-svc" data-rv>
          <span class="ru-n">03</span>
          <h3>Седация (лечение во сне)</h3>
          <p>Безболезненное лечение для тех, кто боится стоматолога. Вы уснёте — и проснётесь здоровым.</p>
        </div>

        <div class="ru-card ru-svc" data-rv>
          <span class="ru-n">04</span>
          <h3>Протезирование</h3>
          <p>Циркониевые коронки, виниры, ламинаты. Собственная лаборатория — быстро и точно.</p>
        </div>

        <div class="ru-card ru-svc" data-rv>
          <span class="ru-n">05</span>
          <h3>Эстетика</h3>
          <p>Отбеливание, виниры без обточки, гингивопластика. Красивая улыбка — это доступно.</p>
        </div>

        <div class="ru-card ru-svc" data-rv>
          <span class="ru-n">06</span>
          <h3>Детская стоматология</h3>
          <p>Мягкий подход к маленьким пациентам. Фторирование, лечение кариеса, профилактика.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- ===== PRICING ===== -->
  <section id="pricing" class="ru-sec">
    <div class="ru-wrap n">
      <div class="ru-head c" data-rv>
        <span class="ru-eyebrow">ПРОЗРАЧНЫЕ ЦЕНЫ</span>
        <h2 class="ru-h2">Стоимость имплантации</h2>
        <p class="ru-lead">Без скрытых доплат — все расходы озвучиваются заранее</p>
      </div>

      <div class="ru-card ru-table-wrap" data-rv>
        <div class="ru-table-scroll">
          <table class="ru-table">
            <thead>
              <tr>
                <th>Бренд</th>
                <th>Страна</th>
                <th>Цена (₩)</th>
                <th>≈ Рубли</th>
              </tr>
            </thead>
            <tbody>
              <!-- Event brand -->
              <tr class="ev">
                <td>
                  <span class="name">${brandEn} ${model}</span>
                  <span class="tag">АКЦИЯ</span>
                </td>
                <td>
                  <span class="c">🇰🇷 Корея</span>
                </td>
                <td>
                  <span class="won">${price}0,000</span>
                </td>
                <td><span class="rub">≈ ${priceRub} ₽</span></td>
              </tr>
              <tr>
                <td>
                  <span class="name">MegaGen AnyRidge</span>
                </td>
                <td><span class="c">🇰🇷 Корея</span></td>
                <td><span class="won">790,000</span></td>
                <td><span class="rub">≈ ${Math.round(790000 * rubRate).toLocaleString('ru-RU')} ₽</span></td>
              </tr>
              <tr>
                <td>
                  <span class="name">Osstem (стандарт)</span>
                </td>
                <td><span class="c">🇰🇷 Корея</span></td>
                <td><span class="won">890,000</span></td>
                <td><span class="rub">≈ ${Math.round(890000 * rubRate).toLocaleString('ru-RU')} ₽</span></td>
              </tr>
              <tr>
                <td>
                  <span class="name">Osstem Premium SOI</span>
                </td>
                <td><span class="c">🇰🇷 Корея</span></td>
                <td><span class="won">1,040,000</span></td>
                <td><span class="rub">≈ ${Math.round(1040000 * rubRate).toLocaleString('ru-RU')} ₽</span></td>
              </tr>
              <tr class="ev2">
                <td>
                  <span class="name">Straumann BLX</span>
                  <span class="tag">АКЦИЯ</span>
                </td>
                <td><span class="c">🇨🇭 Швейцария</span></td>
                <td><span class="won">1,290,000</span></td>
                <td><span class="rub">≈ ${Math.round(1290000 * rubRate).toLocaleString('ru-RU')} ₽</span></td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="ru-table-note">
          Цена включает: имплант (фикстура) + абатмент + циркониевая коронка.
          Дополнительно: навигационный гид 100,000₩, седация 200,000₩, КТ 50,000₩, костная пластика — по показаниям.
          Курс рубля — ориентировочный.
        </p>
      </div>
    </div>
  </section>

  <!-- ===== CLINIC TOUR + TEAM ===== -->
  <section class="ru-sec alt">
    <div class="ru-wrap">
      <div class="ru-head c" data-rv>
        <span class="ru-eyebrow">НАША КЛИНИКА</span>
        <h2 class="ru-h2">Seoul 365 Dental Clinic</h2>
        <p class="ru-lead">Современная клиника с полным оборудованием и дружной командой профессионалов</p>
      </div>

      <!-- Team Photo — Full Width -->
      <div class="ru-team-photo" data-rv>
        <img src="/static/team-photo.jpg" alt="Команда Seoul 365 Dental — 25+ специалистов" loading="lazy"/>
        <div class="ov">
          <h3>25+ специалистов</h3>
          <p>Врачи, ассистенты и зубные техники — одна команда, одна цель</p>
          <div class="ru-chips">
            <span class="ru-badge">
              5 врачей
            </span>
            <span class="ru-badge">
              Своя лаборатория
            </span>
            <span class="ru-badge">
              С 2019 года
            </span>
          </div>
        </div>
      </div>

      <!-- Doctors Grid -->
      <div class="ru-docs" data-rv>
        <div class="ru-doc">
          <div class="ph">
            <img src="/static/dr-park-junkyu-profile.jpg" alt="Д-р Пак Чунгю" loading="lazy"/>
            <span class="ru-badge b">Главный</span>
          </div>
          <b>Пак Чунгю</b>
          <small>Имплантация · Общая</small>
        </div>

        <div class="ru-doc">
          <div class="ph">
            <img src="/static/dr-choi-dabin-profile.jpg" alt="Д-р Чхве Дабин" loading="lazy"/>
          </div>
          <b>Чхве Дабин</b>
          <small>Ортодонтия</small>
        </div>

        <div class="ru-doc">
          <div class="ph">
            <img src="/static/dr-jung-munhee-profile.jpg" alt="Д-р Чон Мунхи" loading="lazy"/>
          </div>
          <b>Чон Мунхи</b>
          <small>Протезирование</small>
        </div>

        <div class="ru-doc">
          <div class="ph">
            <img src="/static/dr-ha-nuri-profile.jpg" alt="Д-р Ха Нури" loading="lazy"/>
          </div>
          <b>Ха Нури</b>
          <small>Эстетика · Детская</small>
        </div>
      </div>

      <!-- Caption -->
      <p class="ru-cap">
        Все врачи — выпускники Сеульского национального университета (서울대학교)
      </p>
    </div>
  </section>

  <!-- ===== WHY US ===== -->
  <section id="about" class="ru-sec">
    <div class="ru-wrap">
      <div class="ru-head" data-rv>
        <span class="ru-eyebrow">ПОЧЕМУ МЫ</span>
        <h2 class="ru-h2">Почему выбирают Seoul 365</h2>
      </div>

      <div class="ru-whys" data-rv>
        <div class="ru-why">
          <span class="ru-n">01</span>
          <h3>5 врачей из Сеульского университета</h3>
          <p>Специалисты высшей квалификации. Гарвардский курс имплантологии. Коллегиальное обсуждение каждого случая.</p>
        </div>

        <div class="ru-why">
          <span class="ru-n">02</span>
          <h3>Навигационная хирургия</h3>
          <p>3D-моделирование по КТ. Установка импланта с точностью до 0,1мм. Успешность свыше 97%.</p>
        </div>

        <div class="ru-why">
          <span class="ru-n">03</span>
          <h3>Собственная лаборатория</h3>
          <p>Протезы изготавливаются прямо в клинике. Быстро, точно, без посредников.</p>
        </div>

        <div class="ru-why">
          <span class="ru-n">04</span>
          <h3>Седация (лечение во сне)</h3>
          <p>Вы спите — мы лечим. Для тех, кто боится стоматолога. Под наблюдением анестезиолога.</p>
        </div>

        <div class="ru-why">
          <span class="ru-n">05</span>
          <h3>365 дней · до 21:00</h3>
          <p>Работаем каждый день, включая выходные и праздники. Вечерний приём Пн–Чт до 21:00.</p>
        </div>

        <div class="ru-why">
          <span class="ru-n">06</span>
          <h3>Сертификат подлинности</h3>
          <p>Только оригинальные импланты. Официальный сертификат на каждый имплант. Гарантия производителя.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- ===== TREATMENT PROCESS ===== -->
  <section class="ru-sec alt">
    <div class="ru-wrap n">
      <div class="ru-head c" data-rv>
        <span class="ru-eyebrow">ЭТАПЫ ЛЕЧЕНИЯ</span>
        <h2 class="ru-h2">Как проходит имплантация</h2>
      </div>

      <ol class="ru-steps">
        <li class="ru-step" data-rv>
          <span class="no">01</span>
          <div class="tx">
            <h3>КТ-диагностика</h3>
            <p>Трёхмерная томография для анализа костной ткани и планирования</p>
          </div>
          <span class="du">30 мин</span>
        </li>

        <li class="ru-step" data-rv>
          <span class="no">02</span>
          <div class="tx">
            <h3>3D-планирование</h3>
            <p>Виртуальная операция и изготовление хирургического шаблона</p>
          </div>
          <span class="du">1–2 нед.</span>
        </li>

        <li class="ru-step" data-rv>
          <span class="no">03</span>
          <div class="tx">
            <h3>Установка импланта</h3>
            <p>Навигационная хирургия. Возможна седация (сон). Безболезненно.</p>
          </div>
          <span class="du">30–60 мин</span>
        </li>

        <li class="ru-step" data-rv>
          <span class="no">04</span>
          <div class="tx">
            <h3>Приживление</h3>
            <p>SA-поверхность ускоряет остеоинтеграцию (сращение с костью)</p>
          </div>
          <span class="du">6–8 нед.</span>
        </li>

        <li class="ru-step" data-rv>
          <span class="no">05</span>
          <div class="tx">
            <h3>Установка коронки</h3>
            <p>Циркониевая коронка из нашей лаборатории. Идеальный прикус.</p>
          </div>
          <span class="du">1 день</span>
        </li>
      </ol>
    </div>
  </section>

  <!-- ===== FAQ ===== -->
  <section id="faq" class="ru-sec">
    <div class="ru-wrap n">
      <div class="ru-head c" data-rv>
        <span class="ru-eyebrow">ВОПРОСЫ И ОТВЕТЫ</span>
        <h2 class="ru-h2">Часто задаваемые вопросы</h2>
      </div>

      <div id="faq-list" data-rv>
        <details class="ru-fq">
          <summary>
            <span>Есть ли русскоговорящий персонал?</span>
            <span class="pm">${ic('plus', 14)}</span>
          </summary>
          <div class="a">
            Мы обеспечиваем поддержку на русском языке через переводчика. Также вы можете связаться с нами через Telegram, где мы поможем на русском языке. Запишитесь заранее, и мы организуем сопровождение.
          </div>
        </details>

        <details class="ru-fq">
          <summary>
            <span>Почему имплант ${brandEn} стоит всего ${price}0,000₩?</span>
            <span class="pm">${ic('plus', 14)}</span>
          </summary>
          <div class="a">
            Seoul 365 — официальный партнёр ${brandEn}. Мы закупаем импланты крупным оптом напрямую у производителя, исключая посредников. На каждый имплант выдаётся сертификат подлинности.
          </div>
        </details>

        <details class="ru-fq">
          <summary>
            <span>Что входит в стоимость?</span>
            <span class="pm">${ic('plus', 14)}</span>
          </summary>
          <div class="a">
            В стоимость входит: имплант (фикстура) + абатмент + циркониевая коронка. Дополнительно оплачиваются: навигационный хирургический шаблон (100,000₩), седация (200,000₩), КТ-снимок (50,000₩) и костная пластика (по показаниям).
          </div>
        </details>

        <details class="ru-fq">
          <summary>
            <span>Боюсь стоматолога. Можно ли лечиться во сне?</span>
            <span class="pm">${ic('plus', 14)}</span>
          </summary>
          <div class="a">
            Да, конечно! Седация (200,000₩) — это лечение в медикаментозном сне. Вы засыпаете — и просыпаетесь уже после завершения всех процедур. Абсолютно безболезненно и безопасно. Под наблюдением анестезиолога.
          </div>
        </details>

        <details class="ru-fq">
          <summary>
            <span>В чём разница между Osstem и Straumann?</span>
            <span class="pm">${ic('plus', 14)}</span>
          </summary>
          <div class="a">
            <strong>Osstem</strong> — корейский бренд, доступная цена. <strong>Straumann</strong> — швейцарский бренд, премиальные материалы Roxolid® и SLActive®. Врач подберёт оптимальный вариант на консультации, исходя из вашей ситуации.
          </div>
        </details>

        <details class="ru-fq">
          <summary>
            <span>Как записаться на приём?</span>
            <span class="pm">${ic('plus', 14)}</span>
          </summary>
          <div class="a">
            Позвоните по номеру <strong>${CLINIC.phone}</strong>, напишите в <strong>Telegram</strong>, или отправьте сообщение через <strong>KakaoTalk</strong>. Мы ответим на русском языке и подберём удобное время.
          </div>
        </details>
      </div>
    </div>
  </section>

  <!-- ===== HOURS & LOCATION ===== -->
  <section id="contact" class="ru-sec alt">
    <div class="ru-wrap">
      <div class="ru-head c" data-rv>
        <span class="ru-eyebrow">КОНТАКТЫ</span>
        <h2 class="ru-h2">Как нас найти</h2>
      </div>

      <div class="ru-contact">
        <!-- Hours -->
        <div class="ru-card ru-box ru-hours" data-rv>
          <h3>
            ${ic('clock', 16)} Часы работы
          </h3>
          <div>
            <div class="ru-hrow">
              <span>Понедельник – Четверг</span>
              <span>10:00 – 21:00</span>
            </div>
            <div class="ru-hrow">
              <span>Пятница</span>
              <span>10:00 – 19:00</span>
            </div>
            <div class="ru-hrow">
              <span>Суббота</span>
              <span>10:00 – 14:00</span>
            </div>
            <div class="ru-hrow">
              <span>Воскресенье · Праздники</span>
              <span>14:00 – 18:00</span>
            </div>
          </div>
          <div class="ru-open">
            Без перерыва на обед
          </div>
        </div>

        <!-- Address & Map -->
        <div class="ru-card ru-box ru-addr" data-rv>
          <h3>
            ${ic('pin', 16)} Адрес
          </h3>

          <div>
            <p class="nm">Seoul 365 Dental Clinic</p>
            <p class="sub ru-ko">서울365치과의원</p>
            <div class="ru-arow">
              ${ic('pin', 16)}
              <div>
                <p>ITO Tower 2F, 212</p>
                <p>Yesul-ro 138, Namdong-gu, Incheon</p>
                <p class="sm ru-ko">인천 남동구 예술로 138 이토타워 2층</p>
              </div>
            </div>
            <div class="ru-arow">
              ${ic('map', 16)}
              <p>Станция Yesulhoeggwan (예술회관역) — напротив выхода 6</p>
            </div>
            <div class="ru-arow">
              ${ic('phone', 16)}
              <a href="${CLINIC.phoneTel}">${CLINIC.phone}</a>
            </div>
          </div>

          <!-- Map -->
          <div class="ru-map">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3167.0!2d126.7042!3d37.4482!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzfCsDI2JzUzLjUiTiAxMjbCsDQyJzE1LjEiRQ!5e0!3m2!1sru!2skr!4v1"
              width="100%"
              height="200"
              style="border:0"
              allowfullscreen=""
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
              title="Seoul 365 Dental location on map"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ===== FINAL CTA ===== -->
  <section class="ru-cta">
    <div class="ru-wrap n">
      <h2 class="ru-h2" data-rv>
        Запишитесь на<br/>
        <span>
          бесплатную консультацию
        </span>
      </h2>
      <p class="ru-lead" data-rv>
        КТ-диагностика · План лечения · Точная стоимость<br/>
        Всё это — на первом визите, бесплатно
      </p>

      <div class="ru-btns c stack" data-rv>
        <a href="${CLINIC.phoneTel}" class="ru-btn white lg ru-mono">
          ${ic('phone')}
          ${CLINIC.phone}
        </a>
        <a href="https://t.me/seoul365dental" target="_blank" rel="noopener noreferrer" class="ru-btn tg lg">
          ${TG}
          Написать в Telegram
        </a>
      </div>

      <div class="ru-meta">
        <span>${ic('pin', 14)} Инчхон, Намдон-гу</span>
        <span>${ic('calendar', 14)} 365 дней</span>
        <span>🇷🇺 Русский язык</span>
      </div>
    </div>
  </section>

  <!-- ===== FOOTER ===== -->
  <footer class="ru-footer">
    <div class="ru-wrap">
      <div class="top">
        <a href="/ru" class="ru-logo">
          <span class="mark"><img src="/static/logo-v2.png" alt="Seoul 365 Dental" width="174" height="180"/></span>
          <span>
            <b>Seoul 365 Dental</b>
            <small>СТОМАТОЛОГИЯ</small>
          </span>
        </a>
        <div class="ru-flinks">
          <a href="${CLINIC.phoneTel}" class="ru-mono">
            ${ic('phone', 14)} ${CLINIC.phone}
          </a>
          <a href="https://t.me/seoul365dental" target="_blank" rel="noopener noreferrer">
            ${TG14} Telegram
          </a>
          <a href="${CLINIC.kakao}" target="_blank" rel="noopener noreferrer">
            ${ic('chat', 14)} KakaoTalk
          </a>
          <a href="/" class="ru-ko">
            🇰🇷 한국어
          </a>
        </div>
      </div>

      <p class="ru-legal">
        Данная информация носит ознакомительный характер и не является публичной офертой.
        Имплантация — хирургическая процедура, результаты которой зависят от индивидуальных особенностей пациента.
        Возможны осложнения: кровотечение, отёк, инфекция, повреждение нерва. Проконсультируйтесь со специалистом.
        <br/>© 2019–${currentYear} Seoul 365 Dental Clinic (서울365치과의원) | ИНН: 395-37-00559 | Директор: Пак Чунгю
      </p>
    </div>
  </footer>

  <!-- ===== MOBILE BOTTOM BAR ===== -->
  <div class="ru-bar">
    <a href="${CLINIC.phoneTel}">
      ${ic('phone', 20)}
      <span>Звонок</span>
    </a>
    <a href="https://t.me/seoul365dental" target="_blank" rel="noopener noreferrer" class="tg">
      ${TG20}
      <span>Telegram</span>
    </a>
    <a href="${CLINIC.kakao}" target="_blank" rel="noopener noreferrer">
      ${ic('chat', 20)}
      <span>KakaoTalk</span>
    </a>
    <a href="#contact">
      ${ic('pin', 20)}
      <span>Карта</span>
    </a>
  </div>

</body>
</html>`

  return c.html(pageHtml)
})

export default ruRoutes
