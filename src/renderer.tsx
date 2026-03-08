import { jsxRenderer } from 'hono/jsx-renderer'
import { CLINIC, HOURS } from './data/clinic'
import { MESSAGING } from './data/brand'

export const renderer = jsxRenderer(({ children, title, description, canonical, jsonLd }) => {
  const pageTitle = title || `서울365치과 | 인천 구월동 치과 - 서울대 5인 전문의, 365일 진료`;
  const pageDesc = description || `인천 구월동 서울365치과. 서울대 출신 5인 원장, 365일 진료, 자체 기공실 보유. 임플란트·교정·수면진료. 032-432-0365`;
  const canonicalUrl = canonical || 'https://seoul365dental.com';

  return (
    <html lang="ko">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <link rel="canonical" href={canonicalUrl} />
        <meta name="theme-color" content="#0066FF" />

        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="서울365치과의원" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:locale" content="ko_KR" />
        <meta name="twitter:card" content="summary_large_image" />

        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css" />
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet" />

        <script dangerouslySetInnerHTML={{__html: `
          tailwind.config = {
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
              }
            }
          }
        `}} />

        <link href="/static/style.css" rel="stylesheet" />

        {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}} />}
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({
          "@context": "https://schema.org", "@type": "Dentist",
          "name": "서울365치과의원", "alternateName": "Seoul 365 Dental Clinic",
          "url": "https://seoul365dental.com", "telephone": "+82-32-432-0365",
          "address": { "@type": "PostalAddress", "streetAddress": "예술로 138 이토타워 2층", "addressLocality": "인천광역시 남동구", "addressRegion": "인천", "postalCode": "21556", "addressCountry": "KR" },
          "geo": { "@type": "GeoCoordinates", "latitude": "37.4482", "longitude": "126.7042" },
          "openingHoursSpecification": [
            {"dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday"], "opens": "10:00", "closes": "21:00"},
            {"dayOfWeek": "Friday", "opens": "10:00", "closes": "19:00"},
            {"dayOfWeek": "Saturday", "opens": "10:00", "closes": "14:00"},
            {"dayOfWeek": "Sunday", "opens": "14:00", "closes": "18:00"}
          ],
          "founder": {"@type": "Person", "name": "박준규"}, "foundingDate": "2019",
          "medicalSpecialty": ["Implantology","Orthodontics","Prosthodontics","Endodontics","Pediatric Dentistry"]
        })}} />
      </head>
      <body class="font-sans text-gray-900 bg-white antialiased">

        {/* === PRELOADER === */}
        <div id="preloader" class="preloader">
          <div class="preloader-logo">
            <i class="fa-solid fa-tooth text-white text-2xl"></i>
          </div>
          <p class="text-white/20 text-xs font-semibold tracking-[0.3em] uppercase mt-5">Seoul 365 Dental</p>
          <div class="preloader-bar">
            <div class="preloader-bar-inner"></div>
          </div>
        </div>

        {/* === SCROLL PROGRESS === */}
        <div id="scroll-progress" class="scroll-progress"></div>

        {/* === CUSTOM CURSOR (Desktop only) === */}
        <div id="cursor-dot" class="cursor-dot hidden lg:block"></div>
        <div id="cursor-ring" class="cursor-ring hidden lg:block"></div>

        {/* === PREMIUM HEADER === */}
        <header id="main-header" class="header-premium">
          <nav class="max-w-[1400px] mx-auto px-5 md:px-8 h-[72px] flex items-center justify-between">
            {/* Logo */}
            <a href="/" class="flex items-center gap-2.5 group relative z-10">
              <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0066FF] to-[#00E5FF] flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-[#0066FF]/30 logo-pulse">
                <i class="fa-solid fa-tooth text-white text-sm"></i>
              </div>
              <div class="flex flex-col leading-none">
                <span class="logo-text text-[1.05rem] font-extrabold tracking-tight text-gray-900">서울365치과</span>
                <span class="logo-text text-[0.6rem] font-medium text-gray-400 tracking-[0.15em] mt-0.5">SEOUL 365 DENTAL</span>
              </div>
            </a>

            {/* Desktop Nav */}
            <div class="hidden lg:flex items-center gap-7">
              {[
                { href: '/treatments', label: '진료안내' },
                { href: '/doctors', label: '의료진' },
                { href: '/pricing', label: '비용안내' },
                { href: '/cases/gallery', label: '치료사례' },
                { href: '/directions', label: '오시는길' },
                { href: '/faq', label: 'FAQ' },
              ].map(item => (
                <a href={item.href} class="nav-link link-underline text-[0.88rem] font-medium text-gray-600 hover:text-primary transition-colors" data-cursor-hover>{item.label}</a>
              ))}
            </div>

            {/* Desktop CTA */}
            <div class="hidden lg:flex items-center gap-3">
              <a href={CLINIC.phoneTel} class="nav-link flex items-center gap-1.5 text-[0.82rem] font-medium text-gray-500 hover:text-primary transition-colors" data-cursor-hover>
                <i class="fa-solid fa-phone text-[0.7rem]"></i> {CLINIC.phone}
              </a>
              {/* Auth buttons — dynamically updated by JS */}
              <div id="auth-nav" class="flex items-center gap-2">
                <a href="/login" id="auth-login-btn" class="nav-link flex items-center gap-1.5 text-[0.82rem] font-medium text-gray-500 hover:text-primary transition-colors" data-cursor-hover>
                  <i class="fa-solid fa-right-to-bracket text-[0.7rem]"></i> 로그인
                </a>
                <a href="/register" id="auth-register-btn" class="btn-premium btn-premium-outline text-[0.82rem] px-4 py-2" data-cursor-hover>
                  <i class="fa-solid fa-user-plus text-[0.7rem]"></i> 회원가입
                </a>
              </div>
              <div id="auth-user" class="hidden flex items-center gap-2">
                <span id="auth-user-name" class="text-[0.82rem] font-medium text-gray-600"></span>
                <button id="auth-logout-btn" class="nav-link text-[0.82rem] font-medium text-gray-400 hover:text-red-500 transition-colors" data-cursor-hover>
                  <i class="fa-solid fa-right-from-bracket text-[0.7rem]"></i>
                </button>
              </div>
              <a href="/reservation" class="btn-premium btn-premium-fill text-[0.82rem] px-5 py-2.5" data-cursor-hover>
                <i class="fa-solid fa-calendar-check text-[0.75rem]"></i> 예약하기
              </a>
            </div>

            {/* Mobile Menu Btn */}
            <button id="mobile-menu-btn" class="lg:hidden mobile-menu-icon p-2 text-gray-700 relative z-10" aria-label="메뉴 열기">
              <i class="fa-solid fa-bars text-xl"></i>
            </button>
          </nav>

          {/* Mobile Menu */}
          <div id="mobile-menu" class="hidden lg:hidden absolute top-full left-0 right-0 glass-white border-t border-gray-100/50">
            <div class="max-w-[1400px] mx-auto px-5 py-4 space-y-0.5">
              {[
                { href: '/', label: '홈', icon: 'fa-house' },
                { href: '/treatments', label: '진료안내', icon: 'fa-teeth' },
                { href: '/doctors', label: '의료진', icon: 'fa-user-doctor' },
                { href: '/pricing', label: '비용안내', icon: 'fa-won-sign' },
                { href: '/cases/gallery', label: '치료사례', icon: 'fa-images' },
                { href: '/directions', label: '오시는길', icon: 'fa-location-dot' },
                { href: '/faq', label: 'FAQ', icon: 'fa-circle-question' },
              ].map(item => (
                <a href={item.href} class="flex items-center gap-3 py-3.5 px-4 text-gray-700 font-medium text-[0.95rem] rounded-2xl hover:bg-primary/5 transition-colors">
                  <i class={`fa-solid ${item.icon} text-primary/60 w-5 text-center text-sm`}></i>
                  {item.label}
                </a>
              ))}
              <div class="pt-3 pb-1 space-y-2">
                <div id="mobile-auth-nav" class="grid grid-cols-2 gap-2">
                  <a href="/login" class="btn-premium btn-premium-outline text-[0.82rem] py-3 justify-center">
                    <i class="fa-solid fa-right-to-bracket text-[0.7rem]"></i> 로그인
                  </a>
                  <a href="/register" class="btn-premium btn-premium-outline text-[0.82rem] py-3 justify-center">
                    <i class="fa-solid fa-user-plus text-[0.7rem]"></i> 회원가입
                  </a>
                </div>
                <div id="mobile-auth-user" class="hidden text-center py-2">
                  <span id="mobile-user-name" class="text-sm font-medium text-gray-600"></span>
                  <button id="mobile-logout-btn" class="ml-2 text-sm text-gray-400 hover:text-red-500">로그아웃</button>
                </div>
                <div class="grid grid-cols-2 gap-2">
                  <a href={CLINIC.phoneTel} class="btn-premium btn-premium-outline text-[0.82rem] py-3 justify-center">
                    <i class="fa-solid fa-phone text-[0.7rem]"></i> 전화상담
                  </a>
                  <a href="/reservation" class="btn-premium btn-premium-fill text-[0.82rem] py-3 justify-center">
                    <i class="fa-solid fa-calendar-check text-[0.7rem]"></i> 예약하기
                  </a>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* === MAIN === */}
        <main>{children}</main>

        {/* === PREMIUM FOOTER === */}
        <footer class="bg-navy pb-28 md:pb-0 relative overflow-hidden">
          {/* Aurora footer accent */}
          <div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#0066FF]/30 to-transparent"></div>
          <div class="absolute top-0 left-1/4 w-1/2 h-64 bg-[#0066FF]/[0.03] blur-[100px] pointer-events-none"></div>

          <div class="max-w-[1400px] mx-auto px-5 md:px-8 relative">
            {/* Top */}
            <div class="py-16 md:py-20 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8">
              {/* Brand */}
              <div class="md:col-span-4">
                <a href="/" class="flex items-center gap-2.5 mb-6">
                  <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0066FF] to-[#00E5FF] flex items-center justify-center">
                    <i class="fa-solid fa-tooth text-white text-sm"></i>
                  </div>
                  <div class="flex flex-col leading-none">
                    <span class="text-[1.05rem] font-extrabold text-white tracking-tight">서울365치과</span>
                    <span class="text-[0.6rem] font-medium text-white/25 tracking-[0.15em] mt-0.5">SEOUL 365 DENTAL</span>
                  </div>
                </a>
                <p class="text-sm leading-relaxed text-white/35 max-w-xs">
                  {MESSAGING.brandSlogan}<br/>
                  서울대 출신 5인 원장 · 365일 진료 · 자체 기공실.
                </p>
                <div class="flex gap-2.5 mt-6">
                  {[
                    { href: CLINIC.instagram, icon: 'fa-brands fa-instagram', label: 'Instagram' },
                    { href: CLINIC.naverBlog, icon: 'fa-solid fa-n', label: 'Blog' },
                    { href: CLINIC.kakao, icon: 'fa-solid fa-comment', label: 'KakaoTalk' },
                  ].map(s => (
                    <a href={s.href} target="_blank" rel="noopener" class="w-10 h-10 rounded-full bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-white/30 hover:text-[#00E5FF] hover:bg-[#0066FF]/10 hover:border-[#0066FF]/20 transition-all text-sm" aria-label={s.label} data-cursor-hover>
                      <i class={s.icon}></i>
                    </a>
                  ))}
                </div>
              </div>

              {/* Navigation */}
              <div class="md:col-span-2">
                <h4 class="text-[0.68rem] font-bold text-[#0066FF]/40 tracking-[0.2em] uppercase mb-5">진료</h4>
                <ul class="space-y-3 text-[0.85rem]">
                  {[
                    { name: '전체임플란트', slug: 'full-implant' },
                    { name: '교정', slug: 'orthodontics' },
                    { name: '수면진료', slug: 'sedation' },
                    { name: '심미치료', slug: 'cosmetic' },
                  ].map(t => (
                    <li><a href={`/treatments/${t.slug}`} class="text-white/35 hover:text-[#00E5FF] transition-colors">{t.name}</a></li>
                  ))}
                </ul>
              </div>

              <div class="md:col-span-2">
                <h4 class="text-[0.68rem] font-bold text-[#0066FF]/40 tracking-[0.2em] uppercase mb-5">안내</h4>
                <ul class="space-y-3 text-[0.85rem]">
                  <li><a href="/doctors" class="text-white/35 hover:text-[#00E5FF] transition-colors">의료진</a></li>
                  <li><a href="/pricing" class="text-white/35 hover:text-[#00E5FF] transition-colors">비용안내</a></li>
                  <li><a href="/directions" class="text-white/35 hover:text-[#00E5FF] transition-colors">오시는길</a></li>
                  <li><a href="/faq" class="text-white/35 hover:text-[#00E5FF] transition-colors">FAQ</a></li>
                </ul>
              </div>

              {/* Hours */}
              <div class="md:col-span-4">
                <h4 class="text-[0.68rem] font-bold text-[#0066FF]/40 tracking-[0.2em] uppercase mb-5">진료시간</h4>
                <div class="space-y-0 text-[0.85rem]">
                  {HOURS.map(h => (
                    <div class="flex justify-between items-center py-2.5 border-b border-white/[0.04]">
                      <span class="text-white/40">{h.day}</span>
                      <span class="text-white/70 font-semibold tabular-nums">{h.time}</span>
                    </div>
                  ))}
                  <div class="pt-3 flex items-center gap-2">
                    <span class="w-1.5 h-1.5 bg-[#0066FF] rounded-full animate-pulse"></span>
                    <span class="text-[#00E5FF] text-[0.78rem] font-semibold">점심시간 없이 연속 진료</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom */}
            <div class="border-t border-white/[0.04] py-6 flex flex-col md:flex-row justify-between gap-3 text-[0.72rem] text-white/15">
              <div class="flex flex-wrap gap-x-4 gap-y-1">
                <span>서울365치과의원</span>
                <span>대표 박준규</span>
                <span>{CLINIC.address}</span>
                <span>{CLINIC.phone}</span>
              </div>
              <div class="flex gap-4">
                <a href="/privacy" class="hover:text-white/50 transition-colors">개인정보처리방침</a>
                <a href="/terms" class="hover:text-white/50 transition-colors">이용약관</a>
                <span>&copy; 2026 Seoul 365 Dental</span>
              </div>
            </div>
          </div>
        </footer>

        {/* === MOBILE BOTTOM CTA === */}
        <div class="md:hidden fixed bottom-0 left-0 right-0 z-50 mobile-cta-bar safe-bottom">
          <div class="grid grid-cols-4">
            <a href={CLINIC.phoneTel} class="flex flex-col items-center justify-center py-3 text-gray-400 active:bg-gray-50 transition-colors">
              <i class="fa-solid fa-phone text-[1.1rem]"></i>
              <span class="text-[10px] mt-1 font-medium">전화</span>
            </a>
            <a href={CLINIC.kakao} target="_blank" rel="noopener" class="flex flex-col items-center justify-center py-3 text-gray-400 active:bg-gray-50 transition-colors">
              <i class="fa-solid fa-comment text-[1.1rem]"></i>
              <span class="text-[10px] mt-1 font-medium">카카오톡</span>
            </a>
            <a href="/reservation" class="flex flex-col items-center justify-center py-3 bg-gradient-to-r from-[#0066FF] to-[#2979FF] text-white relative overflow-hidden">
              <div class="absolute inset-0 bg-gradient-to-r from-[#00E5FF]/0 via-white/10 to-[#00E5FF]/0 animate-shimmer-slow"></div>
              <i class="fa-solid fa-calendar-check text-[1.1rem] relative z-10"></i>
              <span class="text-[10px] mt-1 font-bold relative z-10">예약</span>
            </a>
            <a href="/directions" class="flex flex-col items-center justify-center py-3 text-gray-400 active:bg-gray-50 transition-colors">
              <i class="fa-solid fa-location-dot text-[1.1rem]"></i>
              <span class="text-[10px] mt-1 font-medium">길찾기</span>
            </a>
          </div>
        </div>

        {/* === DESKTOP FLOATING CTA === */}
        <div class="hidden md:flex fixed bottom-8 right-8 z-40 flex-col gap-3">
          <a href={CLINIC.kakao} target="_blank" rel="noopener" class="floating-btn bg-[#FEE500] text-[#3C1E1E] rounded-2xl flex items-center justify-center" aria-label="카카오톡" style="width:52px;height:52px;" data-cursor-hover>
            <i class="fa-solid fa-comment text-lg"></i>
          </a>
          <a href={CLINIC.phoneTel} class="floating-btn bg-gradient-to-br from-[#0066FF] to-[#2979FF] text-white rounded-2xl flex items-center justify-center relative overflow-hidden" aria-label="전화" style="width:52px;height:52px;" data-cursor-hover>
            <i class="fa-solid fa-phone text-lg relative z-10"></i>
            <div class="absolute inset-0 rounded-2xl electric-border-glow"></div>
          </a>
          <button onclick="window.scrollTo({top:0,behavior:'smooth'})" class="floating-btn bg-gray-900/90 text-white rounded-2xl flex items-center justify-center backdrop-blur-sm" aria-label="맨 위로" style="width:52px;height:52px;" data-cursor-hover>
            <i class="fa-solid fa-arrow-up"></i>
          </button>
        </div>

        {/* === SCRIPTS === */}
        <script dangerouslySetInnerHTML={{__html: `
          // Preloader
          window.addEventListener('load', () => {
            setTimeout(() => {
              document.getElementById('preloader')?.classList.add('hidden');
              document.body.style.overflow = '';
            }, 1600);
          });

          // Custom Cursor (Desktop only)
          if (window.innerWidth > 1024) {
            const dot = document.getElementById('cursor-dot');
            const ring = document.getElementById('cursor-ring');
            let mx = 0, my = 0, rx = 0, ry = 0;

            document.addEventListener('mousemove', (e) => {
              mx = e.clientX; my = e.clientY;
              if (dot) { dot.style.left = mx + 'px'; dot.style.top = my + 'px'; }
            });

            function animateRing() {
              rx += (mx - rx) * 0.12;
              ry += (my - ry) * 0.12;
              if (ring) { ring.style.left = rx + 'px'; ring.style.top = ry + 'px'; }
              requestAnimationFrame(animateRing);
            }
            animateRing();

            document.querySelectorAll('a, button, [data-cursor-hover], input, textarea, select').forEach(el => {
              el.addEventListener('mouseenter', () => { dot?.classList.add('hovering'); ring?.classList.add('hovering'); });
              el.addEventListener('mouseleave', () => { dot?.classList.remove('hovering'); ring?.classList.remove('hovering'); });
            });
          }

          // Scroll Progress
          window.addEventListener('scroll', () => {
            const h = document.documentElement.scrollHeight - window.innerHeight;
            const p = h > 0 ? window.scrollY / h : 0;
            const bar = document.getElementById('scroll-progress');
            if (bar) bar.style.transform = 'scaleX(' + p + ')';
          }, { passive: true });

          // Mobile menu
          document.getElementById('mobile-menu-btn')?.addEventListener('click', function() {
            const menu = document.getElementById('mobile-menu');
            const icon = this.querySelector('i');
            menu.classList.toggle('hidden');
            if (menu.classList.contains('hidden')) {
              icon.className = 'fa-solid fa-bars text-xl';
            } else {
              icon.className = 'fa-solid fa-xmark text-xl';
            }
          });

          // Header scroll
          const header = document.getElementById('main-header');
          window.addEventListener('scroll', () => {
            if (window.scrollY > 50) header.classList.add('scrolled');
            else header.classList.remove('scrolled');
          }, { passive: true });

          // IntersectionObserver for scroll animations
          const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                entry.target.classList.add('visible');
              }
            });
          }, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' });

          document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-3d, .reveal-blur, .stagger-children, .img-reveal, .highlight-word').forEach(el => {
            revealObserver.observe(el);
          });

          // FAQ accordion
          document.querySelectorAll('.faq-toggle').forEach(btn => {
            btn.addEventListener('click', function() {
              const content = this.nextElementSibling;
              const icon = this.querySelector('.faq-icon');
              document.querySelectorAll('.faq-toggle').forEach(other => {
                if (other !== this) {
                  other.nextElementSibling.classList.add('hidden');
                  other.querySelector('.faq-icon')?.classList.remove('rotate-180');
                }
              });
              content.classList.toggle('hidden');
              icon?.classList.toggle('rotate-180');
            });
          });

          // Animated counter
          function animateCounters() {
            document.querySelectorAll('[data-count]').forEach(el => {
              if (el.dataset.animated) return;
              el.dataset.animated = 'true';
              const target = parseFloat(el.dataset.count);
              const suffix = el.dataset.suffix || '';
              const prefix = el.dataset.prefix || '';
              const decimals = (target % 1 !== 0) ? 1 : 0;
              let current = 0;
              const duration = 2200;
              const step = target / (duration / 16);
              const counter = setInterval(() => {
                current += step;
                if (current >= target) {
                  current = target;
                  clearInterval(counter);
                }
                el.textContent = prefix + current.toFixed(decimals) + suffix;
              }, 16);
            });
          }

          const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                animateCounters();
                counterObserver.disconnect();
              }
            });
          }, { threshold: 0.3 });
          const counterEl = document.querySelector('[data-counter-section]');
          if (counterEl) counterObserver.observe(counterEl);

          // Hero particles — ELECTRIC BLUE
          (function initParticles() {
            const canvas = document.getElementById('hero-particles');
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            let w, h, particles = [];
            function resize() {
              w = canvas.width = canvas.parentElement.offsetWidth;
              h = canvas.height = canvas.parentElement.offsetHeight;
            }
            resize();
            window.addEventListener('resize', resize);

            for (let i = 0; i < 70; i++) {
              particles.push({
                x: Math.random() * w,
                y: Math.random() * h,
                r: Math.random() * 2 + 0.5,
                dx: (Math.random() - 0.5) * 0.5,
                dy: (Math.random() - 0.5) * 0.5,
                o: Math.random() * 0.5 + 0.15,
                c: Math.random() > 0.3 ? '0,102,255' : '0,229,255'
              });
            }

            let mouseX = -999, mouseY = -999;
            canvas.parentElement.addEventListener('mousemove', (e) => {
              const rect = canvas.parentElement.getBoundingClientRect();
              mouseX = e.clientX - rect.left;
              mouseY = e.clientY - rect.top;
            });

            function draw() {
              ctx.clearRect(0, 0, w, h);
              particles.forEach(p => {
                p.x += p.dx; p.y += p.dy;
                if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
                if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;

                // Mouse repulsion
                const dmx = p.x - mouseX;
                const dmy = p.y - mouseY;
                const dm = Math.sqrt(dmx*dmx + dmy*dmy);
                if (dm < 120) {
                  p.x += (dmx / dm) * 2;
                  p.y += (dmy / dm) * 2;
                }

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(' + p.c + ',' + p.o + ')';
                ctx.fill();

                // Glow effect
                if (p.r > 1.2) {
                  ctx.beginPath();
                  ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
                  ctx.fillStyle = 'rgba(' + p.c + ',' + (p.o * 0.1) + ')';
                  ctx.fill();
                }
              });
              // Connect nearby
              for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                  const dx = particles[i].x - particles[j].x;
                  const dy = particles[i].y - particles[j].y;
                  const dist = Math.sqrt(dx*dx + dy*dy);
                  if (dist < 140) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = 'rgba(0,102,255,' + (0.08 * (1 - dist/140)) + ')';
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                  }
                }
              }
              requestAnimationFrame(draw);
            }
            draw();
          })();

          // Operating status
          function updateStatus() {
            const now = new Date();
            const day = now.getDay();
            const h = now.getHours(), m = now.getMinutes();
            const t = h * 60 + m;
            let text = '', open = false;
            if (day >= 1 && day <= 4) { open = t >= 600 && t < 1260; text = open ? '진료중 · 21시까지' : '진료 종료'; }
            else if (day === 5) { open = t >= 600 && t < 1140; text = open ? '진료중 · 19시까지' : '진료 종료'; }
            else if (day === 6) { open = t >= 600 && t < 840; text = open ? '진료중 · 14시까지' : '진료 종료'; }
            else { open = t >= 840 && t < 1080; text = open ? '진료중 · 18시까지' : '진료 종료'; }
            document.querySelectorAll('[data-status]').forEach(el => {
              el.innerHTML = open
                ? '<span class="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span><span class="font-semibold">' + text + '</span>'
                : '<span class="w-2 h-2 bg-gray-500 rounded-full"></span><span class="text-white/40">' + text + '</span>';
            });
          }
          updateStatus();
          setInterval(updateStatus, 60000);

          // 3D Tilt effect on cards (Desktop)
          if (window.innerWidth > 768) {
            document.querySelectorAll('.tilt-card').forEach(card => {
              card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                card.style.transform = 'perspective(1000px) rotateY(' + (x*10) + 'deg) rotateX(' + (-y*10) + 'deg) scale(1.02)';
              });
              card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateY(0) rotateX(0) scale(1)';
                card.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
              });
              card.addEventListener('mouseenter', () => {
                card.style.transition = 'none';
              });
            });
          }

          // Magnetic buttons (Desktop)
          if (window.innerWidth > 1024) {
            document.querySelectorAll('.btn-magnetic').forEach(btn => {
              btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = 'translate(' + (x * 0.3) + 'px, ' + (y * 0.3) + 'px)';
              });
              btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translate(0, 0)';
              });
            });
          }

          // Auth state — check /api/auth/me and toggle UI
          (async function checkAuth() {
            try {
              const res = await fetch('/api/auth/me');
              const data = await res.json();
              if (data.ok && data.user) {
                // Desktop
                const nav = document.getElementById('auth-nav');
                const userEl = document.getElementById('auth-user');
                const nameEl = document.getElementById('auth-user-name');
                if (nav) nav.classList.add('hidden');
                if (userEl) { userEl.classList.remove('hidden'); userEl.classList.add('flex'); }
                if (nameEl) nameEl.textContent = data.user.name + '님';

                // Mobile
                const mobileNav = document.getElementById('mobile-auth-nav');
                const mobileUser = document.getElementById('mobile-auth-user');
                const mobileName = document.getElementById('mobile-user-name');
                if (mobileNav) mobileNav.classList.add('hidden');
                if (mobileUser) { mobileUser.classList.remove('hidden'); }
                if (mobileName) mobileName.textContent = data.user.name + '님';
              }
            } catch {}
          })();

          // Logout handlers
          document.getElementById('auth-logout-btn')?.addEventListener('click', async function() {
            await fetch('/api/auth/logout', { method: 'POST' });
            window.location.reload();
          });
          document.getElementById('mobile-logout-btn')?.addEventListener('click', async function() {
            await fetch('/api/auth/logout', { method: 'POST' });
            window.location.reload();
          });

          // =============================================
          // YouTube Background Video — Autoplay Muted
          // =============================================
          (function initYTPlayer() {
            if (!document.getElementById('yt-player')) return;

            var ytReady = false, player = null, isMuted = true;

            // Load YouTube IFrame API
            var tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            document.head.appendChild(tag);

            window.onYouTubeIframeAPIReady = function() {
              player = new YT.Player('yt-player', {
                videoId: 'gB_yiatcwAc',
                playerVars: {
                  autoplay: 1,
                  mute: 1,
                  controls: 0,
                  showinfo: 0,
                  rel: 0,
                  loop: 1,
                  playlist: 'gB_yiatcwAc',
                  playsinline: 1,
                  modestbranding: 1,
                  iv_load_policy: 3,
                  disablekb: 1,
                  fs: 0,
                  cc_load_policy: 0,
                  origin: window.location.origin
                },
                events: {
                  onReady: function(e) {
                    ytReady = true;
                    e.target.setPlaybackQuality('hd1080');
                    e.target.playVideo();
                  },
                  onStateChange: function(e) {
                    // Loop: restart when ended
                    if (e.data === YT.PlayerState.ENDED) {
                      e.target.seekTo(0);
                      e.target.playVideo();
                    }
                  }
                }
              });
            };

            // Sound toggle
            var toggleBtn = document.getElementById('yt-sound-toggle');
            var soundIcon = document.getElementById('yt-sound-icon');
            var soundLabel = document.getElementById('yt-sound-label');

            if (toggleBtn) {
              toggleBtn.addEventListener('click', function() {
                if (!player || !ytReady) return;
                if (isMuted) {
                  player.unMute();
                  player.setVolume(80);
                  isMuted = false;
                  if (soundIcon) soundIcon.className = 'fa-solid fa-volume-high text-sm';
                  if (soundLabel) soundLabel.textContent = '소리 끄기';
                } else {
                  player.mute();
                  isMuted = true;
                  if (soundIcon) soundIcon.className = 'fa-solid fa-volume-xmark text-sm';
                  if (soundLabel) soundLabel.textContent = '소리 켜기';
                }
              });
            }

            // Pause video when out of viewport for performance
            var videoSection = document.getElementById('video-section');
            if (videoSection && 'IntersectionObserver' in window) {
              var vidObs = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                  if (!player || !ytReady) return;
                  if (entry.isIntersecting) {
                    player.playVideo();
                  } else {
                    player.pauseVideo();
                  }
                });
              }, { threshold: 0.1 });
              vidObs.observe(videoSection);
            }
          })();

          // Parallax on scroll
          let ticking = false;
          window.addEventListener('scroll', () => {
            if (!ticking) {
              requestAnimationFrame(() => {
                const scrolled = window.scrollY;
                document.querySelectorAll('.parallax-slow').forEach(el => {
                  el.style.transform = 'translateY(' + (scrolled * 0.08) + 'px)';
                });
                document.querySelectorAll('.parallax-fast').forEach(el => {
                  el.style.transform = 'translateY(' + (scrolled * -0.05) + 'px)';
                });
                ticking = false;
              });
              ticking = true;
            }
          }, { passive: true });
        `}} />
      </body>
    </html>
  )
})
