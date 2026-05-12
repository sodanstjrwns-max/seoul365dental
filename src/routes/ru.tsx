import { Hono } from 'hono'
import { html } from 'hono/html'
import type { Bindings } from '../lib/types'
import { CLINIC } from '../data/clinic'
import { getSetting, initSettingsTable } from '../lib/db'

const ruRoutes = new Hono<{ Bindings: Bindings }>()

// ══════════════════════════════════════════════════════════
// 🇷🇺 Russian Landing Page — /ru
// Полностью русскоязычная посадочная страница
// DB-driven pricing via getSetting()
// ══════════════════════════════════════════════════════════
ruRoutes.get('/ru', async (c) => {
  await initSettingsTable(c.env.DB)

  // DB에서 이벤트 수가 설정 로딩
  const brand = await getSetting(c.env.DB, 'EVENT_IMPLANT_BRAND', '오스템')
  const brandEn = await getSetting(c.env.DB, 'EVENT_IMPLANT_BRAND_EN', 'Osstem')
  const model = await getSetting(c.env.DB, 'EVENT_IMPLANT_MODEL', 'TS III SA')
  const price = await getSetting(c.env.DB, 'EVENT_IMPLANT_PRICE', '64')
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
  <meta name="theme-color" content="#040B18"/>
  <link rel="icon" type="image/x-icon" href="/static/favicon.ico"/>

  <!-- Fonts & Icons -->
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet"/>
  <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet"/>

  <!-- Tailwind -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
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
          }
        }
      }
    }
  </script>

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

  <style>
    /* Custom styles for Russian landing */
    * { box-sizing: border-box; margin: 0; padding: 0; }

    .hero-ru {
      background: linear-gradient(135deg, #040B18 0%, #0A1628 40%, #0D1B33 100%);
      position: relative;
      overflow: hidden;
    }
    .hero-ru::before {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(ellipse at 30% 20%, rgba(0,102,255,0.08) 0%, transparent 50%),
                  radial-gradient(ellipse at 70% 80%, rgba(0,229,255,0.05) 0%, transparent 50%);
      animation: float 20s ease-in-out infinite;
    }
    @keyframes float {
      0%, 100% { transform: translate(0, 0); }
      50% { transform: translate(-2%, 2%); }
    }
    .glass-card-ru {
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: 1rem;
      backdrop-filter: blur(20px);
    }
    .glass-card-light {
      background: white;
      border: 1px solid rgba(0,0,0,0.06);
      border-radius: 1rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.04);
      transition: all 0.3s;
    }
    .glass-card-light:hover {
      border-color: rgba(0,102,255,0.15);
      box-shadow: 0 4px 20px rgba(0,102,255,0.06);
      transform: translateY(-2px);
    }
    .badge-ru {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.4rem 1rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
    }
    .price-strike { position: relative; }
    .price-strike::after {
      content: '';
      position: absolute;
      left: -4px; right: -4px;
      top: 50%;
      height: 2px;
      background: rgba(239,68,68,0.5);
      transform: rotate(-5deg);
    }

    /* Smooth scroll */
    html { scroll-behavior: smooth; }

    /* Flag animation */
    @keyframes wave {
      0%, 100% { transform: rotate(0deg); }
      25% { transform: rotate(3deg); }
      75% { transform: rotate(-3deg); }
    }
    .flag-wave { animation: wave 3s ease-in-out infinite; display: inline-block; }

    /* Telegram button pulse */
    .tg-pulse {
      animation: tgpulse 2s infinite;
    }
    @keyframes tgpulse {
      0% { box-shadow: 0 0 0 0 rgba(0,136,204,0.4); }
      70% { box-shadow: 0 0 0 12px rgba(0,136,204,0); }
      100% { box-shadow: 0 0 0 0 rgba(0,136,204,0); }
    }
  </style>
</head>
<body class="font-sans text-gray-900 bg-white antialiased">

  <!-- ===== TOP BAR ===== -->
  <div class="bg-navy text-white/60 text-xs py-2">
    <div class="max-w-6xl mx-auto px-5 flex items-center justify-between">
      <div class="flex items-center gap-4">
        <span class="flag-wave text-base">🇷🇺</span>
        <span class="font-semibold text-white/80">Говорим по-русски</span>
        <span class="hidden sm:inline text-white/30">|</span>
        <span class="hidden sm:inline">Русскоязычное обслуживание</span>
      </div>
      <div class="flex items-center gap-3">
        <a href="/" class="hover:text-accent transition-colors">🇰🇷 한국어</a>
        <span class="text-white/20">|</span>
        <a href="${CLINIC.phoneTel}" class="hover:text-accent transition-colors">
          <i class="fa-solid fa-phone text-[0.6rem] mr-1"></i>${CLINIC.phone}
        </a>
      </div>
    </div>
  </div>

  <!-- ===== HEADER ===== -->
  <header class="bg-white/95 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-50">
    <nav class="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
      <a href="/ru" class="flex items-center gap-2.5">
        <img src="/static/logo-v2.png" alt="Seoul 365 Dental" class="w-9 h-9 object-contain"/>
        <div class="flex flex-col leading-none">
          <span class="text-[0.95rem] font-extrabold tracking-tight text-gray-900">Seoul 365</span>
          <span class="text-[0.55rem] font-medium text-gray-400 tracking-[0.15em] mt-0.5">СТОМАТОЛОГИЯ</span>
        </div>
      </a>
      <div class="hidden md:flex items-center gap-5 text-sm">
        <a href="#services" class="text-gray-500 hover:text-primary transition-colors font-medium">Услуги</a>
        <a href="#pricing" class="text-gray-500 hover:text-primary transition-colors font-medium">Цены</a>
        <a href="#about" class="text-gray-500 hover:text-primary transition-colors font-medium">О клинике</a>
        <a href="#faq" class="text-gray-500 hover:text-primary transition-colors font-medium">Вопросы</a>
        <a href="#contact" class="text-gray-500 hover:text-primary transition-colors font-medium">Контакты</a>
      </div>
      <div class="flex items-center gap-2">
        <a href="${CLINIC.phoneTel}" class="hidden sm:flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-primary transition-colors">
          <i class="fa-solid fa-phone text-xs"></i> ${CLINIC.phone}
        </a>
        <a href="${CLINIC.phoneTel}" class="bg-primary text-white text-sm font-bold px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors">
          Позвонить
        </a>
      </div>
    </nav>
  </header>

  <!-- ===== HERO ===== -->
  <section class="hero-ru min-h-[90vh] flex items-center relative">
    <div class="relative z-10 max-w-6xl mx-auto px-5 py-20 md:py-32 text-center w-full">

      <!-- Russian flag badge -->
      <div class="badge-ru bg-gradient-to-r from-emerald-500/20 to-emerald-400/10 border border-emerald-400/30 text-emerald-300 mb-8 mx-auto w-fit">
        <span class="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
        СПЕЦИАЛЬНАЯ АКЦИЯ
      </div>

      <h1 class="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-[1.1] mb-6">
        Имплант ${brandEn}<br/>
        <span class="bg-gradient-to-r from-emerald-300 via-emerald-400 to-teal-400 bg-clip-text" style="color:transparent;-webkit-background-clip:text">
          ${price}0,000₩
        </span>
      </h1>

      <p class="text-lg md:text-xl text-white/40 max-w-2xl mx-auto mb-4">
        ${brandEn} ${model} · Бренд №1 в Корее · 40 лет опыта<br class="hidden md:block"/>
        Врачи Сеульского университета · Навигационная хирургия
      </p>

      <!-- Price comparison -->
      <div class="flex items-center justify-center gap-4 sm:gap-8 mb-10">
        <div class="text-center">
          <span class="text-white/25 text-xs block">Обычная цена</span>
          <p class="text-white/30 text-2xl font-bold price-strike">${originalPrice}0,000₩</p>
          <span class="text-white/15 text-xs">≈ ${originalRub} ₽</span>
        </div>
        <div class="text-3xl text-white/15">→</div>
        <div class="text-center">
          <span class="text-emerald-400 text-xs font-bold block">Акция</span>
          <p class="text-5xl md:text-6xl font-black bg-gradient-to-r from-emerald-300 via-emerald-400 to-teal-400 bg-clip-text" style="color:transparent;-webkit-background-clip:text">
            ${price}0<span class="text-3xl">,000₩</span>
          </p>
          <span class="text-emerald-400/60 text-sm font-bold">≈ ${priceRub} ₽</span>
        </div>
      </div>

      <!-- CTA buttons -->
      <div class="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-6">
        <a href="${CLINIC.phoneTel}" class="w-full sm:w-auto bg-gradient-to-r from-primary to-blue-600 text-white text-lg font-bold px-8 py-4 rounded-2xl hover:shadow-lg hover:shadow-blue-500/20 transition-all flex items-center justify-center gap-2">
          <i class="fa-solid fa-phone"></i>
          Позвонить сейчас
        </a>
        <a href="https://t.me/seoul365dental" target="_blank" rel="noopener noreferrer" class="w-full sm:w-auto bg-[#0088CC] text-white text-lg font-bold px-8 py-4 rounded-2xl hover:bg-[#007AB8] transition-all tg-pulse flex items-center justify-center gap-2">
          <i class="fa-brands fa-telegram"></i>
          Telegram
        </a>
        <a href="${CLINIC.kakao}" target="_blank" rel="noopener noreferrer" class="w-full sm:w-auto bg-[#FEE500] text-[#3C1E1E] text-lg font-bold px-8 py-4 rounded-2xl hover:bg-[#FDD835] transition-all flex items-center justify-center gap-2">
          <i class="fa-solid fa-comment"></i>
          KakaoTalk
        </a>
      </div>

      <p class="text-white/20 text-sm">
        <i class="fa-regular fa-clock mr-1"></i>
        ${periodText}
      </p>
    </div>
  </section>

  <!-- ===== TRUST BAR ===== -->
  <section class="bg-gray-50 border-b border-gray-100 py-8">
    <div class="max-w-6xl mx-auto px-5">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        <div>
          <div class="text-3xl font-black text-primary mb-1">5</div>
          <div class="text-sm text-gray-500">Врачей из<br/>Сеульского университета</div>
        </div>
        <div>
          <div class="text-3xl font-black text-primary mb-1">365</div>
          <div class="text-sm text-gray-500">Дней в году<br/>Работаем без выходных</div>
        </div>
        <div>
          <div class="text-3xl font-black text-primary mb-1">21:00</div>
          <div class="text-sm text-gray-500">Вечерний приём<br/>Пн–Чт</div>
        </div>
        <div>
          <div class="text-3xl font-black text-primary mb-1">
            <i class="fa-solid fa-gear text-2xl"></i>
          </div>
          <div class="text-sm text-gray-500">Своя<br/>зуботехническая лаборатория</div>
        </div>
      </div>
    </div>
  </section>

  <!-- ===== CHIEF DOCTOR ===== -->
  <section class="py-16 md:py-24 bg-white overflow-hidden">
    <div class="max-w-6xl mx-auto px-5">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
        <!-- Photo -->
        <div class="relative">
          <div class="relative rounded-3xl overflow-hidden shadow-2xl shadow-primary/10">
            <img src="/static/dr-park.jpg" alt="Доктор Пак Чунгю — главный врач Seoul 365 Dental" class="w-full h-auto object-cover" loading="lazy"/>
            <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-navy/80 to-transparent p-6 pt-16">
              <div class="flex items-center gap-2">
                <span class="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">Главный врач</span>
                <span class="bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full">🇰🇷 Сеульский университет</span>
              </div>
            </div>
          </div>
          <!-- Floating credential badge -->
          <div class="absolute -bottom-4 -right-4 md:right-4 bg-white rounded-2xl shadow-lg border border-gray-100 p-4 max-w-[200px]">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
                <i class="fa-solid fa-award text-amber-500"></i>
              </div>
              <div>
                <p class="text-xs font-bold text-gray-900">Harvard</p>
                <p class="text-[0.65rem] text-gray-400">Implant Course</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Bio -->
        <div>
          <span class="badge-ru bg-primary/5 text-primary border border-primary/10 w-fit mb-6">ГЛАВНЫЙ ВРАЧ</span>
          <h2 class="text-3xl md:text-4xl font-black text-gray-900 mt-4 mb-2">
            Доктор Пак Чунгю
          </h2>
          <p class="text-lg text-primary font-semibold mb-6">박준규 대표원장</p>

          <div class="space-y-3 mb-8">
            <div class="flex items-start gap-3">
              <i class="fa-solid fa-graduation-cap text-primary mt-1 flex-shrink-0"></i>
              <span class="text-gray-700 text-sm">Сеульский национальный университет — стоматологический факультет</span>
            </div>
            <div class="flex items-start gap-3">
              <i class="fa-solid fa-user-doctor text-primary mt-1 flex-shrink-0"></i>
              <span class="text-gray-700 text-sm">Сертифицированный специалист по общей стоматологии (Министерство здравоохранения)</span>
            </div>
            <div class="flex items-start gap-3">
              <i class="fa-solid fa-globe text-primary mt-1 flex-shrink-0"></i>
              <span class="text-gray-700 text-sm">Гарвардский университет — курс повышения квалификации по имплантологии</span>
            </div>
            <div class="flex items-start gap-3">
              <i class="fa-solid fa-certificate text-primary mt-1 flex-shrink-0"></i>
              <span class="text-gray-700 text-sm">Сертифицированный врач Invisalign</span>
            </div>
            <div class="flex items-start gap-3">
              <i class="fa-solid fa-tooth text-primary mt-1 flex-shrink-0"></i>
              <span class="text-gray-700 text-sm">Более 10 000 случаев имплантации</span>
            </div>
          </div>

          <blockquote class="border-l-4 border-primary/20 pl-4 py-2 mb-8">
            <p class="text-gray-500 text-sm italic leading-relaxed">
              «Каждый пациент заслуживает лучшего лечения — независимо от языка и национальности. Мы рады принять вас в Seoul 365.»
            </p>
            <cite class="text-xs text-gray-400 not-italic mt-2 block">— Д-р Пак Чунгю</cite>
          </blockquote>

          <a href="${CLINIC.phoneTel}" class="inline-flex items-center gap-2 bg-primary text-white font-bold px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors text-sm">
            <i class="fa-solid fa-phone"></i>
            Записаться к главному врачу
          </a>
        </div>
      </div>
    </div>
  </section>

  <!-- ===== SERVICES ===== -->
  <section id="services" class="py-16 md:py-24 bg-white">
    <div class="max-w-6xl mx-auto px-5">
      <div class="text-center mb-14">
        <span class="badge-ru bg-primary/5 text-primary border border-primary/10 mx-auto w-fit mb-4">НАШИ УСЛУГИ</span>
        <h2 class="text-3xl md:text-4xl font-black text-gray-900 mb-3">Полный спектр стоматологических услуг</h2>
        <p class="text-gray-400 max-w-xl mx-auto">Современное оборудование и специалисты мирового уровня</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div class="glass-card-light p-7 text-center">
          <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/10 to-blue-400/5 flex items-center justify-center mx-auto mb-5">
            <i class="fa-solid fa-tooth text-blue-500 text-xl"></i>
          </div>
          <h3 class="font-bold text-lg mb-2">Имплантация</h3>
          <p class="text-gray-500 text-sm leading-relaxed">Osstem, Straumann, MegaGen. Навигационная хирургия с точностью 0,1мм. Возможна седация.</p>
        </div>

        <div class="glass-card-light p-7 text-center">
          <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/10 to-purple-400/5 flex items-center justify-center mx-auto mb-5">
            <i class="fa-solid fa-teeth text-purple-500 text-xl"></i>
          </div>
          <h3 class="font-bold text-lg mb-2">Ортодонтия</h3>
          <p class="text-gray-500 text-sm leading-relaxed">Invisalign, керамические брекеты, частичная коррекция. Сертифицированный врач Invisalign.</p>
        </div>

        <div class="glass-card-light p-7 text-center">
          <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-emerald-400/5 flex items-center justify-center mx-auto mb-5">
            <i class="fa-solid fa-bed text-emerald-500 text-xl"></i>
          </div>
          <h3 class="font-bold text-lg mb-2">Седация (лечение во сне)</h3>
          <p class="text-gray-500 text-sm leading-relaxed">Безболезненное лечение для тех, кто боится стоматолога. Вы уснёте — и проснётесь здоровым.</p>
        </div>

        <div class="glass-card-light p-7 text-center">
          <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/10 to-amber-400/5 flex items-center justify-center mx-auto mb-5">
            <i class="fa-solid fa-crown text-amber-500 text-xl"></i>
          </div>
          <h3 class="font-bold text-lg mb-2">Протезирование</h3>
          <p class="text-gray-500 text-sm leading-relaxed">Циркониевые коронки, виниры, ламинаты. Собственная лаборатория — быстро и точно.</p>
        </div>

        <div class="glass-card-light p-7 text-center">
          <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500/10 to-pink-400/5 flex items-center justify-center mx-auto mb-5">
            <i class="fa-solid fa-star text-pink-500 text-xl"></i>
          </div>
          <h3 class="font-bold text-lg mb-2">Эстетика</h3>
          <p class="text-gray-500 text-sm leading-relaxed">Отбеливание, виниры без обточки, гингивопластика. Красивая улыбка — это доступно.</p>
        </div>

        <div class="glass-card-light p-7 text-center">
          <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-cyan-400/5 flex items-center justify-center mx-auto mb-5">
            <i class="fa-solid fa-child text-cyan-500 text-xl"></i>
          </div>
          <h3 class="font-bold text-lg mb-2">Детская стоматология</h3>
          <p class="text-gray-500 text-sm leading-relaxed">Мягкий подход к маленьким пациентам. Фторирование, лечение кариеса, профилактика.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- ===== PRICING ===== -->
  <section id="pricing" class="py-16 md:py-24 bg-gray-50">
    <div class="max-w-4xl mx-auto px-5">
      <div class="text-center mb-14">
        <span class="badge-ru bg-primary/5 text-primary border border-primary/10 mx-auto w-fit mb-4">ПРОЗРАЧНЫЕ ЦЕНЫ</span>
        <h2 class="text-3xl md:text-4xl font-black text-gray-900 mb-3">Стоимость имплантации</h2>
        <p class="text-gray-400">Без скрытых доплат — все расходы озвучиваются заранее</p>
      </div>

      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-gray-100 bg-gray-50/50">
                <th class="text-left px-6 py-4 font-bold text-gray-700">Бренд</th>
                <th class="text-center px-4 py-4 font-bold text-gray-700">Страна</th>
                <th class="text-center px-4 py-4 font-bold text-gray-700">Цена (₩)</th>
                <th class="text-center px-4 py-4 font-bold text-gray-700">≈ Рубли</th>
              </tr>
            </thead>
            <tbody>
              <!-- Event brand -->
              <tr class="bg-gradient-to-r from-emerald-50/80 to-teal-50/50 border-b border-emerald-100">
                <td class="px-6 py-5">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center flex-shrink-0">
                      <i class="fa-solid fa-crown text-white text-sm"></i>
                    </div>
                    <div>
                      <span class="font-bold text-gray-900">${brandEn} ${model}</span>
                      <span class="block text-xs text-emerald-600 font-bold">АКЦИЯ</span>
                    </div>
                  </div>
                </td>
                <td class="text-center px-4 py-5">
                  <span class="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">🇰🇷 Корея</span>
                </td>
                <td class="text-center px-4 py-5">
                  <span class="text-2xl font-black text-emerald-600">${price}0,000</span>
                </td>
                <td class="text-center px-4 py-5 text-emerald-600 font-bold">≈ ${priceRub} ₽</td>
              </tr>
              <tr class="border-b border-gray-50">
                <td class="px-6 py-4">
                  <span class="font-bold text-gray-800">MegaGen AnyRidge</span>
                </td>
                <td class="text-center px-4 py-4"><span class="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">🇰🇷 Корея</span></td>
                <td class="text-center px-4 py-4 font-bold text-gray-700">790,000</td>
                <td class="text-center px-4 py-4 text-gray-500">≈ ${Math.round(790000 * rubRate).toLocaleString('ru-RU')} ₽</td>
              </tr>
              <tr class="border-b border-gray-50">
                <td class="px-6 py-4">
                  <span class="font-bold text-gray-800">Osstem (стандарт)</span>
                </td>
                <td class="text-center px-4 py-4"><span class="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">🇰🇷 Корея</span></td>
                <td class="text-center px-4 py-4 font-bold text-gray-700">890,000</td>
                <td class="text-center px-4 py-4 text-gray-500">≈ ${Math.round(890000 * rubRate).toLocaleString('ru-RU')} ₽</td>
              </tr>
              <tr class="border-b border-gray-50">
                <td class="px-6 py-4">
                  <span class="font-bold text-gray-800">Osstem Premium SOI</span>
                </td>
                <td class="text-center px-4 py-4"><span class="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">🇰🇷 Корея</span></td>
                <td class="text-center px-4 py-4 font-bold text-gray-700">1,040,000</td>
                <td class="text-center px-4 py-4 text-gray-500">≈ ${Math.round(1040000 * rubRate).toLocaleString('ru-RU')} ₽</td>
              </tr>
              <tr>
                <td class="px-6 py-4">
                  <div>
                    <span class="font-bold text-gray-800">Straumann BLX</span>
                    <span class="block text-xs text-blue-600 font-bold">АКЦИЯ</span>
                  </div>
                </td>
                <td class="text-center px-4 py-4"><span class="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">🇨🇭 Швейцария</span></td>
                <td class="text-center px-4 py-4 font-bold text-blue-600">1,290,000</td>
                <td class="text-center px-4 py-4 text-blue-600 font-bold">≈ ${Math.round(1290000 * rubRate).toLocaleString('ru-RU')} ₽</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="px-6 py-4 bg-gray-50/50 border-t border-gray-100">
          <p class="text-xs text-gray-400 leading-relaxed">
            <i class="fa-solid fa-circle-info mr-1 text-gray-300"></i>
            Цена включает: имплант (фикстура) + абатмент + циркониевая коронка.
            Дополнительно: навигационный гид 100,000₩, седация 200,000₩, КТ 50,000₩, костная пластика — по показаниям.
            Курс рубля — ориентировочный.
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- ===== CLINIC TOUR + TEAM ===== -->
  <section class="py-16 md:py-24 bg-white">
    <div class="max-w-6xl mx-auto px-5">
      <div class="text-center mb-14">
        <span class="badge-ru bg-primary/5 text-primary border border-primary/10 mx-auto w-fit mb-4">НАША КЛИНИКА</span>
        <h2 class="text-3xl md:text-4xl font-black text-gray-900 mb-3">Seoul 365 Dental Clinic</h2>
        <p class="text-gray-400 max-w-xl mx-auto">Современная клиника с полным оборудованием и дружной командой профессионалов</p>
      </div>

      <!-- Team Photo — Full Width -->
      <div class="relative rounded-3xl overflow-hidden shadow-xl mb-10">
        <img src="/static/team-photo.jpg" alt="Команда Seoul 365 Dental — 25+ специалистов" class="w-full h-auto object-cover" loading="lazy"/>
        <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-navy/90 via-navy/40 to-transparent p-6 md:p-10 pt-20">
          <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h3 class="text-white text-2xl md:text-3xl font-black mb-2">25+ специалистов</h3>
              <p class="text-white/50 text-sm md:text-base">Врачи, ассистенты и зубные техники — одна команда, одна цель</p>
            </div>
            <div class="flex flex-wrap gap-2">
              <span class="bg-white/10 backdrop-blur-sm text-white/80 text-xs font-bold px-3 py-1.5 rounded-full border border-white/10">
                <i class="fa-solid fa-user-doctor mr-1"></i> 5 врачей
              </span>
              <span class="bg-white/10 backdrop-blur-sm text-white/80 text-xs font-bold px-3 py-1.5 rounded-full border border-white/10">
                <i class="fa-solid fa-gear mr-1"></i> Своя лаборатория
              </span>
              <span class="bg-white/10 backdrop-blur-sm text-white/80 text-xs font-bold px-3 py-1.5 rounded-full border border-white/10">
                <i class="fa-solid fa-calendar-check mr-1"></i> С 2019 года
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Doctors Grid -->
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        <div class="text-center group">
          <div class="relative rounded-2xl overflow-hidden mb-3 shadow-sm border border-gray-100 group-hover:shadow-md group-hover:border-primary/20 transition-all">
            <img src="/static/dr-park-junkyu-profile.jpg" alt="Д-р Пак Чунгю" class="w-full aspect-[3/4] object-cover object-top" loading="lazy"/>
            <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-navy/70 to-transparent p-3 pt-8">
              <span class="text-white text-[0.6rem] font-bold bg-primary/80 px-2 py-0.5 rounded-full">Главный</span>
            </div>
          </div>
          <p class="font-bold text-gray-900 text-sm">Пак Чунгю</p>
          <p class="text-[0.65rem] text-gray-400">Имплантация · Общая</p>
        </div>

        <div class="text-center group">
          <div class="relative rounded-2xl overflow-hidden mb-3 shadow-sm border border-gray-100 group-hover:shadow-md group-hover:border-primary/20 transition-all">
            <img src="/static/dr-choi-dabin-profile.jpg" alt="Д-р Чхве Дабин" class="w-full aspect-[3/4] object-cover object-top" loading="lazy"/>
          </div>
          <p class="font-bold text-gray-900 text-sm">Чхве Дабин</p>
          <p class="text-[0.65rem] text-gray-400">Ортодонтия</p>
        </div>

        <div class="text-center group">
          <div class="relative rounded-2xl overflow-hidden mb-3 shadow-sm border border-gray-100 group-hover:shadow-md group-hover:border-primary/20 transition-all">
            <img src="/static/dr-jung-munhee-profile.jpg" alt="Д-р Чон Мунхи" class="w-full aspect-[3/4] object-cover object-top" loading="lazy"/>
          </div>
          <p class="font-bold text-gray-900 text-sm">Чон Мунхи</p>
          <p class="text-[0.65rem] text-gray-400">Протезирование</p>
        </div>

        <div class="text-center group">
          <div class="relative rounded-2xl overflow-hidden mb-3 shadow-sm border border-gray-100 group-hover:shadow-md group-hover:border-primary/20 transition-all">
            <img src="/static/dr-sang-sehoon-profile.jpg" alt="Д-р Сан Сехун" class="w-full aspect-[3/4] object-cover object-top" loading="lazy"/>
          </div>
          <p class="font-bold text-gray-900 text-sm">Сан Сехун</p>
          <p class="text-[0.65rem] text-gray-400">Имплантация</p>
        </div>

        <div class="text-center group">
          <div class="relative rounded-2xl overflow-hidden mb-3 shadow-sm border border-gray-100 group-hover:shadow-md group-hover:border-primary/20 transition-all">
            <img src="/static/dr-ha-nuri-profile.jpg" alt="Д-р Ха Нури" class="w-full aspect-[3/4] object-cover object-top" loading="lazy"/>
          </div>
          <p class="font-bold text-gray-900 text-sm">Ха Нури</p>
          <p class="text-[0.65rem] text-gray-400">Эстетика · Детская</p>
        </div>
      </div>

      <!-- Caption -->
      <p class="text-center text-sm text-gray-400 mt-8">
        <i class="fa-solid fa-graduation-cap mr-1"></i>
        Все врачи — выпускники Сеульского национального университета (서울대학교)
      </p>
    </div>
  </section>

  <!-- ===== WHY US ===== -->
  <section id="about" class="py-16 md:py-24 bg-white">
    <div class="max-w-6xl mx-auto px-5">
      <div class="text-center mb-14">
        <span class="badge-ru bg-primary/5 text-primary border border-primary/10 mx-auto w-fit mb-4">ПОЧЕМУ МЫ</span>
        <h2 class="text-3xl md:text-4xl font-black text-gray-900 mb-3">Почему выбирают Seoul 365</h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div class="glass-card-light p-7 flex gap-5">
          <div class="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
            <i class="fa-solid fa-user-doctor text-blue-500"></i>
          </div>
          <div>
            <h3 class="font-bold text-gray-900 mb-1">5 врачей из Сеульского университета</h3>
            <p class="text-sm text-gray-500 leading-relaxed">Специалисты высшей квалификации. Гарвардский курс имплантологии. Коллегиальное обсуждение каждого случая.</p>
          </div>
        </div>

        <div class="glass-card-light p-7 flex gap-5">
          <div class="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
            <i class="fa-solid fa-crosshairs text-emerald-500"></i>
          </div>
          <div>
            <h3 class="font-bold text-gray-900 mb-1">Навигационная хирургия</h3>
            <p class="text-sm text-gray-500 leading-relaxed">3D-моделирование по КТ. Установка импланта с точностью до 0,1мм. Успешность свыше 97%.</p>
          </div>
        </div>

        <div class="glass-card-light p-7 flex gap-5">
          <div class="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
            <i class="fa-solid fa-gear text-amber-500"></i>
          </div>
          <div>
            <h3 class="font-bold text-gray-900 mb-1">Собственная лаборатория</h3>
            <p class="text-sm text-gray-500 leading-relaxed">Протезы изготавливаются прямо в клинике. Быстро, точно, без посредников.</p>
          </div>
        </div>

        <div class="glass-card-light p-7 flex gap-5">
          <div class="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0">
            <i class="fa-solid fa-bed text-purple-500"></i>
          </div>
          <div>
            <h3 class="font-bold text-gray-900 mb-1">Седация (лечение во сне)</h3>
            <p class="text-sm text-gray-500 leading-relaxed">Вы спите — мы лечим. Для тех, кто боится стоматолога. Под наблюдением анестезиолога.</p>
          </div>
        </div>

        <div class="glass-card-light p-7 flex gap-5">
          <div class="w-12 h-12 rounded-xl bg-cyan-50 flex items-center justify-center flex-shrink-0">
            <i class="fa-solid fa-calendar-check text-cyan-500"></i>
          </div>
          <div>
            <h3 class="font-bold text-gray-900 mb-1">365 дней · до 21:00</h3>
            <p class="text-sm text-gray-500 leading-relaxed">Работаем каждый день, включая выходные и праздники. Вечерний приём Пн–Чт до 21:00.</p>
          </div>
        </div>

        <div class="glass-card-light p-7 flex gap-5">
          <div class="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center flex-shrink-0">
            <i class="fa-solid fa-shield-halved text-rose-500"></i>
          </div>
          <div>
            <h3 class="font-bold text-gray-900 mb-1">Сертификат подлинности</h3>
            <p class="text-sm text-gray-500 leading-relaxed">Только оригинальные импланты. Официальный сертификат на каждый имплант. Гарантия производителя.</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ===== TREATMENT PROCESS ===== -->
  <section class="py-16 md:py-24 bg-gray-50">
    <div class="max-w-4xl mx-auto px-5">
      <div class="text-center mb-14">
        <span class="badge-ru bg-primary/5 text-primary border border-primary/10 mx-auto w-fit mb-4">ЭТАПЫ ЛЕЧЕНИЯ</span>
        <h2 class="text-3xl md:text-4xl font-black text-gray-900 mb-3">Как проходит имплантация</h2>
      </div>

      <div class="space-y-4">
        <div class="bg-white rounded-2xl border border-gray-100 p-6 flex items-center gap-5">
          <span class="text-3xl font-black text-primary/10 flex-shrink-0 w-12 text-center">01</span>
          <div class="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
            <i class="fa-solid fa-x-ray text-blue-500 text-sm"></i>
          </div>
          <div class="flex-1">
            <h3 class="font-bold text-gray-900">КТ-диагностика</h3>
            <p class="text-sm text-gray-500">Трёхмерная томография для анализа костной ткани и планирования</p>
          </div>
          <span class="hidden sm:block text-xs text-primary bg-primary/5 px-3 py-1.5 rounded-full font-medium flex-shrink-0">30 мин</span>
        </div>

        <div class="bg-white rounded-2xl border border-gray-100 p-6 flex items-center gap-5">
          <span class="text-3xl font-black text-primary/10 flex-shrink-0 w-12 text-center">02</span>
          <div class="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0">
            <i class="fa-solid fa-laptop-medical text-purple-500 text-sm"></i>
          </div>
          <div class="flex-1">
            <h3 class="font-bold text-gray-900">3D-планирование</h3>
            <p class="text-sm text-gray-500">Виртуальная операция и изготовление хирургического шаблона</p>
          </div>
          <span class="hidden sm:block text-xs text-primary bg-primary/5 px-3 py-1.5 rounded-full font-medium flex-shrink-0">1–2 нед.</span>
        </div>

        <div class="bg-white rounded-2xl border border-gray-100 p-6 flex items-center gap-5">
          <span class="text-3xl font-black text-primary/10 flex-shrink-0 w-12 text-center">03</span>
          <div class="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
            <i class="fa-solid fa-screwdriver-wrench text-emerald-500 text-sm"></i>
          </div>
          <div class="flex-1">
            <h3 class="font-bold text-gray-900">Установка импланта</h3>
            <p class="text-sm text-gray-500">Навигационная хирургия. Возможна седация (сон). Безболезненно.</p>
          </div>
          <span class="hidden sm:block text-xs text-primary bg-primary/5 px-3 py-1.5 rounded-full font-medium flex-shrink-0">30–60 мин</span>
        </div>

        <div class="bg-white rounded-2xl border border-gray-100 p-6 flex items-center gap-5">
          <span class="text-3xl font-black text-primary/10 flex-shrink-0 w-12 text-center">04</span>
          <div class="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
            <i class="fa-solid fa-bone text-amber-500 text-sm"></i>
          </div>
          <div class="flex-1">
            <h3 class="font-bold text-gray-900">Приживление</h3>
            <p class="text-sm text-gray-500">SA-поверхность ускоряет остеоинтеграцию (сращение с костью)</p>
          </div>
          <span class="hidden sm:block text-xs text-primary bg-primary/5 px-3 py-1.5 rounded-full font-medium flex-shrink-0">6–8 нед.</span>
        </div>

        <div class="bg-white rounded-2xl border border-gray-100 p-6 flex items-center gap-5">
          <span class="text-3xl font-black text-primary/10 flex-shrink-0 w-12 text-center">05</span>
          <div class="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center flex-shrink-0">
            <i class="fa-solid fa-face-smile text-rose-500 text-sm"></i>
          </div>
          <div class="flex-1">
            <h3 class="font-bold text-gray-900">Установка коронки</h3>
            <p class="text-sm text-gray-500">Циркониевая коронка из нашей лаборатории. Идеальный прикус.</p>
          </div>
          <span class="hidden sm:block text-xs text-primary bg-primary/5 px-3 py-1.5 rounded-full font-medium flex-shrink-0">1 день</span>
        </div>
      </div>
    </div>
  </section>

  <!-- ===== FAQ ===== -->
  <section id="faq" class="py-16 md:py-24 bg-white">
    <div class="max-w-3xl mx-auto px-5">
      <div class="text-center mb-14">
        <span class="badge-ru bg-primary/5 text-primary border border-primary/10 mx-auto w-fit mb-4">ВОПРОСЫ И ОТВЕТЫ</span>
        <h2 class="text-3xl md:text-4xl font-black text-gray-900 mb-3">Часто задаваемые вопросы</h2>
      </div>

      <div class="space-y-3" id="faq-list">
        <details class="group bg-gray-50 rounded-2xl border border-gray-100">
          <summary class="flex items-center justify-between cursor-pointer p-5 select-none list-none font-medium text-gray-800">
            <span>Есть ли русскоговорящий персонал?</span>
            <i class="fa-solid fa-chevron-down text-gray-300 text-xs transition-transform group-open:rotate-180"></i>
          </summary>
          <div class="px-5 pb-5 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
            Мы обеспечиваем поддержку на русском языке через переводчика. Также вы можете связаться с нами через Telegram, где мы поможем на русском языке. Запишитесь заранее, и мы организуем сопровождение.
          </div>
        </details>

        <details class="group bg-gray-50 rounded-2xl border border-gray-100">
          <summary class="flex items-center justify-between cursor-pointer p-5 select-none list-none font-medium text-gray-800">
            <span>Почему имплант ${brandEn} стоит всего ${price}0,000₩?</span>
            <i class="fa-solid fa-chevron-down text-gray-300 text-xs transition-transform group-open:rotate-180"></i>
          </summary>
          <div class="px-5 pb-5 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
            Seoul 365 — официальный партнёр ${brandEn}. Мы закупаем импланты крупным оптом напрямую у производителя, исключая посредников. На каждый имплант выдаётся сертификат подлинности.
          </div>
        </details>

        <details class="group bg-gray-50 rounded-2xl border border-gray-100">
          <summary class="flex items-center justify-between cursor-pointer p-5 select-none list-none font-medium text-gray-800">
            <span>Что входит в стоимость?</span>
            <i class="fa-solid fa-chevron-down text-gray-300 text-xs transition-transform group-open:rotate-180"></i>
          </summary>
          <div class="px-5 pb-5 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
            В стоимость входит: имплант (фикстура) + абатмент + циркониевая коронка. Дополнительно оплачиваются: навигационный хирургический шаблон (100,000₩), седация (200,000₩), КТ-снимок (50,000₩) и костная пластика (по показаниям).
          </div>
        </details>

        <details class="group bg-gray-50 rounded-2xl border border-gray-100">
          <summary class="flex items-center justify-between cursor-pointer p-5 select-none list-none font-medium text-gray-800">
            <span>Боюсь стоматолога. Можно ли лечиться во сне?</span>
            <i class="fa-solid fa-chevron-down text-gray-300 text-xs transition-transform group-open:rotate-180"></i>
          </summary>
          <div class="px-5 pb-5 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
            Да, конечно! Седация (200,000₩) — это лечение в медикаментозном сне. Вы засыпаете — и просыпаетесь уже после завершения всех процедур. Абсолютно безболезненно и безопасно. Под наблюдением анестезиолога.
          </div>
        </details>

        <details class="group bg-gray-50 rounded-2xl border border-gray-100">
          <summary class="flex items-center justify-between cursor-pointer p-5 select-none list-none font-medium text-gray-800">
            <span>В чём разница между Osstem и Straumann?</span>
            <i class="fa-solid fa-chevron-down text-gray-300 text-xs transition-transform group-open:rotate-180"></i>
          </summary>
          <div class="px-5 pb-5 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
            <strong>Osstem</strong> — бренд №1 в Корее, 40 лет истории, отличная цена. <strong>Straumann</strong> — бренд №1 в мире (Швейцария), премиальные материалы Roxolid® и SLActive®. Врач подберёт оптимальный вариант на консультации, исходя из вашей ситуации.
          </div>
        </details>

        <details class="group bg-gray-50 rounded-2xl border border-gray-100">
          <summary class="flex items-center justify-between cursor-pointer p-5 select-none list-none font-medium text-gray-800">
            <span>Как записаться на приём?</span>
            <i class="fa-solid fa-chevron-down text-gray-300 text-xs transition-transform group-open:rotate-180"></i>
          </summary>
          <div class="px-5 pb-5 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
            Позвоните по номеру <strong>${CLINIC.phone}</strong>, напишите в <strong>Telegram</strong>, или отправьте сообщение через <strong>KakaoTalk</strong>. Мы ответим на русском языке и подберём удобное время.
          </div>
        </details>
      </div>
    </div>
  </section>

  <!-- ===== HOURS & LOCATION ===== -->
  <section id="contact" class="py-16 md:py-24 bg-gray-50">
    <div class="max-w-6xl mx-auto px-5">
      <div class="text-center mb-14">
        <span class="badge-ru bg-primary/5 text-primary border border-primary/10 mx-auto w-fit mb-4">КОНТАКТЫ</span>
        <h2 class="text-3xl md:text-4xl font-black text-gray-900 mb-3">Как нас найти</h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Hours -->
        <div class="bg-white rounded-2xl border border-gray-100 p-8">
          <h3 class="font-bold text-lg mb-6 flex items-center gap-2">
            <i class="fa-solid fa-clock text-primary"></i> Часы работы
          </h3>
          <div class="space-y-0">
            <div class="flex justify-between items-center py-3 border-b border-gray-50">
              <span class="text-gray-600">Понедельник – Четверг</span>
              <span class="font-bold text-gray-900">10:00 – 21:00</span>
            </div>
            <div class="flex justify-between items-center py-3 border-b border-gray-50">
              <span class="text-gray-600">Пятница</span>
              <span class="font-bold text-gray-900">10:00 – 19:00</span>
            </div>
            <div class="flex justify-between items-center py-3 border-b border-gray-50">
              <span class="text-gray-600">Суббота</span>
              <span class="font-bold text-gray-900">10:00 – 14:00</span>
            </div>
            <div class="flex justify-between items-center py-3 border-b border-gray-50">
              <span class="text-gray-600">Воскресенье · Праздники</span>
              <span class="font-bold text-gray-900">14:00 – 18:00</span>
            </div>
          </div>
          <div class="mt-4 flex items-center gap-2 text-sm text-emerald-600 font-semibold">
            <span class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            Без перерыва на обед
          </div>
        </div>

        <!-- Address & Map -->
        <div class="bg-white rounded-2xl border border-gray-100 p-8">
          <h3 class="font-bold text-lg mb-6 flex items-center gap-2">
            <i class="fa-solid fa-location-dot text-primary"></i> Адрес
          </h3>

          <div class="space-y-4 mb-6">
            <div>
              <p class="font-bold text-gray-900 text-lg">Seoul 365 Dental Clinic</p>
              <p class="text-gray-500 text-sm mt-1">서울365치과의원</p>
            </div>
            <div class="flex items-start gap-3">
              <i class="fa-solid fa-map-marker-alt text-primary mt-1 flex-shrink-0"></i>
              <div>
                <p class="text-gray-700">ITO Tower 2F, 212</p>
                <p class="text-gray-700">Yesul-ro 138, Namdong-gu, Incheon</p>
                <p class="text-gray-400 text-sm mt-1">인천 남동구 예술로 138 이토타워 2층</p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <i class="fa-solid fa-train-subway text-primary flex-shrink-0"></i>
              <p class="text-gray-700">Станция Yesulhoeggwan (예술회관역) — выход 5, 250м</p>
            </div>
            <div class="flex items-center gap-3">
              <i class="fa-solid fa-phone text-primary flex-shrink-0"></i>
              <a href="${CLINIC.phoneTel}" class="text-primary font-bold text-lg hover:underline">${CLINIC.phone}</a>
            </div>
          </div>

          <!-- Map -->
          <div class="rounded-xl overflow-hidden border border-gray-100">
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
  <section class="hero-ru py-20 md:py-28 relative">
    <div class="relative z-10 max-w-3xl mx-auto px-5 text-center">
      <h2 class="text-3xl md:text-5xl font-black text-white mb-4">
        Запишитесь на<br/>
        <span class="bg-gradient-to-r from-emerald-300 via-emerald-400 to-teal-400 bg-clip-text" style="color:transparent;-webkit-background-clip:text">
          бесплатную консультацию
        </span>
      </h2>
      <p class="text-white/35 mb-8">
        КТ-диагностика · План лечения · Точная стоимость<br/>
        Всё это — на первом визите, бесплатно
      </p>

      <div class="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-6">
        <a href="${CLINIC.phoneTel}" class="w-full sm:w-auto bg-white text-gray-900 text-lg font-bold px-8 py-4 rounded-2xl hover:bg-gray-100 transition-all flex items-center justify-center gap-2">
          <i class="fa-solid fa-phone text-primary"></i>
          ${CLINIC.phone}
        </a>
        <a href="https://t.me/seoul365dental" target="_blank" rel="noopener noreferrer" class="w-full sm:w-auto bg-[#0088CC] text-white text-lg font-bold px-8 py-4 rounded-2xl hover:bg-[#007AB8] transition-all tg-pulse flex items-center justify-center gap-2">
          <i class="fa-brands fa-telegram"></i>
          Написать в Telegram
        </a>
      </div>

      <div class="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-white/20 text-sm mt-6">
        <span><i class="fa-solid fa-map-marker-alt mr-1"></i> Инчхон, Намдон-гу</span>
        <span><i class="fa-solid fa-calendar-check mr-1"></i> 365 дней</span>
        <span>🇷🇺 Русский язык</span>
      </div>
    </div>
  </section>

  <!-- ===== FOOTER ===== -->
  <footer class="bg-navy py-10">
    <div class="max-w-6xl mx-auto px-5">
      <div class="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
        <a href="/ru" class="flex items-center gap-2.5">
          <img src="/static/logo-v2.png" alt="Seoul 365 Dental" class="w-8 h-8 object-contain"/>
          <div class="flex flex-col leading-none">
            <span class="text-sm font-extrabold text-white tracking-tight">Seoul 365 Dental</span>
            <span class="text-[0.5rem] text-white/25 tracking-[0.15em] mt-0.5">СТОМАТОЛОГИЯ</span>
          </div>
        </a>
        <div class="flex items-center gap-4">
          <a href="${CLINIC.phoneTel}" class="text-white/40 hover:text-accent transition-colors text-sm">
            <i class="fa-solid fa-phone mr-1"></i> ${CLINIC.phone}
          </a>
          <a href="https://t.me/seoul365dental" target="_blank" rel="noopener noreferrer" class="text-white/40 hover:text-[#0088CC] transition-colors text-sm">
            <i class="fa-brands fa-telegram mr-1"></i> Telegram
          </a>
          <a href="${CLINIC.kakao}" target="_blank" rel="noopener noreferrer" class="text-white/40 hover:text-[#FEE500] transition-colors text-sm">
            <i class="fa-solid fa-comment mr-1"></i> KakaoTalk
          </a>
          <a href="/" class="text-white/40 hover:text-white/60 transition-colors text-sm">
            🇰🇷 한국어
          </a>
        </div>
      </div>

      <div class="border-t border-white/5 pt-6">
        <p class="text-[0.65rem] text-white/15 leading-relaxed text-center max-w-3xl mx-auto">
          Данная информация носит ознакомительный характер и не является публичной офертой.
          Имплантация — хирургическая процедура, результаты которой зависят от индивидуальных особенностей пациента.
          Возможны осложнения: кровотечение, отёк, инфекция, повреждение нерва. Проконсультируйтесь со специалистом.
          <br/>© 2019–2026 Seoul 365 Dental Clinic (서울365치과의원) | ИНН: 395-37-00559 | Директор: Пак Чунгю
        </p>
      </div>
    </div>
  </footer>

  <!-- ===== MOBILE BOTTOM BAR ===== -->
  <div class="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-gray-200 safe-area-inset-bottom">
    <div class="grid grid-cols-4">
      <a href="${CLINIC.phoneTel}" class="flex flex-col items-center justify-center py-3 text-gray-400 active:bg-gray-50 transition-colors">
        <i class="fa-solid fa-phone text-lg"></i>
        <span class="text-[10px] mt-1 font-medium">Звонок</span>
      </a>
      <a href="https://t.me/seoul365dental" target="_blank" rel="noopener noreferrer" class="flex flex-col items-center justify-center py-3 text-[#0088CC] active:bg-gray-50 transition-colors">
        <i class="fa-brands fa-telegram text-lg"></i>
        <span class="text-[10px] mt-1 font-medium">Telegram</span>
      </a>
      <a href="${CLINIC.kakao}" target="_blank" rel="noopener noreferrer" class="flex flex-col items-center justify-center py-3 text-gray-400 active:bg-gray-50 transition-colors">
        <i class="fa-solid fa-comment text-lg"></i>
        <span class="text-[10px] mt-1 font-medium">KakaoTalk</span>
      </a>
      <a href="#contact" class="flex flex-col items-center justify-center py-3 text-gray-400 active:bg-gray-50 transition-colors">
        <i class="fa-solid fa-location-dot text-lg"></i>
        <span class="text-[10px] mt-1 font-medium">Карта</span>
      </a>
    </div>
  </div>

</body>
</html>`

  return c.html(pageHtml)
})

export default ruRoutes
