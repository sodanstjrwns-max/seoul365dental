import { jsxRenderer } from 'hono/jsx-renderer'
import { CLINIC, HOURS } from './data/clinic'

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
        <meta name="theme-color" content="#0A1628" />

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
                  primary: { DEFAULT: '#1B6FC9', dark: '#155BA3', light: '#E8F0FE', lighter: '#F0F6FF' },
                  navy: { DEFAULT: '#0A1628', light: '#111827', lighter: '#1e293b' },
                  accent: '#10B981',
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

        {/* === PREMIUM HEADER === */}
        <header id="main-header" class="header-premium">
          <nav class="max-w-[1400px] mx-auto px-5 md:px-8 h-[72px] flex items-center justify-between">
            {/* Logo */}
            <a href="/" class="flex items-center gap-2.5 group relative z-10">
              <div class="w-9 h-9 rounded-xl bg-primary flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                <i class="fa-solid fa-tooth text-white text-sm"></i>
              </div>
              <div class="flex flex-col leading-none">
                <span class="logo-text text-[1.05rem] font-extrabold tracking-tight text-gray-900">서울365치과</span>
                <span class="logo-text text-[0.6rem] font-medium text-gray-400 tracking-widest mt-0.5">SEOUL 365 DENTAL</span>
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
                <a href={item.href} class="nav-link link-underline text-[0.88rem] font-medium text-gray-600 hover:text-primary transition-colors">{item.label}</a>
              ))}
            </div>

            {/* Desktop CTA */}
            <div class="hidden lg:flex items-center gap-3">
              <a href={CLINIC.phoneTel} class="nav-link flex items-center gap-1.5 text-[0.82rem] font-medium text-gray-500 hover:text-primary transition-colors">
                <i class="fa-solid fa-phone text-[0.7rem]"></i> {CLINIC.phone}
              </a>
              <a href="/reservation" class="btn-premium btn-premium-fill text-[0.82rem] px-5 py-2.5">
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
                <a href={item.href} class="flex items-center gap-3 py-3.5 px-4 text-gray-700 font-medium text-[0.95rem] rounded-2xl hover:bg-gray-50 transition-colors">
                  <i class={`fa-solid ${item.icon} text-primary/60 w-5 text-center text-sm`}></i>
                  {item.label}
                </a>
              ))}
              <div class="pt-3 pb-1 grid grid-cols-2 gap-2">
                <a href={CLINIC.phoneTel} class="btn-premium btn-premium-outline text-[0.82rem] py-3 justify-center">
                  <i class="fa-solid fa-phone text-[0.7rem]"></i> 전화상담
                </a>
                <a href="/reservation" class="btn-premium btn-premium-fill text-[0.82rem] py-3 justify-center">
                  <i class="fa-solid fa-calendar-check text-[0.7rem]"></i> 예약하기
                </a>
              </div>
            </div>
          </div>
        </header>

        {/* === MAIN === */}
        <main>{children}</main>

        {/* === PREMIUM FOOTER === */}
        <footer class="bg-navy pb-28 md:pb-0">
          <div class="max-w-[1400px] mx-auto px-5 md:px-8">
            {/* Top */}
            <div class="py-16 md:py-20 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8">
              {/* Brand */}
              <div class="md:col-span-4">
                <a href="/" class="flex items-center gap-2.5 mb-6">
                  <div class="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
                    <i class="fa-solid fa-tooth text-white text-sm"></i>
                  </div>
                  <div class="flex flex-col leading-none">
                    <span class="text-[1.05rem] font-extrabold text-white tracking-tight">서울365치과</span>
                    <span class="text-[0.6rem] font-medium text-white/30 tracking-widest mt-0.5">SEOUL 365 DENTAL</span>
                  </div>
                </a>
                <p class="text-sm leading-relaxed text-white/40 max-w-xs">
                  과잉진료 없는 양심치과.<br/>
                  서울대 출신 5인 원장이 협력하여<br/>
                  365일 최적의 치료를 제공합니다.
                </p>
                <div class="flex gap-2.5 mt-6">
                  {[
                    { href: CLINIC.instagram, icon: 'fa-brands fa-instagram', label: 'Instagram' },
                    { href: CLINIC.naverBlog, icon: 'fa-solid fa-n', label: 'Blog' },
                    { href: CLINIC.kakao, icon: 'fa-solid fa-comment', label: 'KakaoTalk' },
                  ].map(s => (
                    <a href={s.href} target="_blank" rel="noopener" class="w-10 h-10 rounded-full bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-white/30 hover:text-white hover:bg-white/10 hover:border-white/15 transition-all text-sm" aria-label={s.label}>
                      <i class={s.icon}></i>
                    </a>
                  ))}
                </div>
              </div>

              {/* Navigation */}
              <div class="md:col-span-2">
                <h4 class="text-[0.7rem] font-bold text-white/20 tracking-[0.2em] uppercase mb-5">진료</h4>
                <ul class="space-y-3 text-[0.85rem]">
                  {[
                    { name: '전체임플란트', slug: 'full-implant' },
                    { name: '교정', slug: 'orthodontics' },
                    { name: '수면진료', slug: 'sedation' },
                    { name: '심미치료', slug: 'cosmetic' },
                  ].map(t => (
                    <li><a href={`/treatments/${t.slug}`} class="text-white/40 hover:text-white transition-colors">{t.name}</a></li>
                  ))}
                </ul>
              </div>

              <div class="md:col-span-2">
                <h4 class="text-[0.7rem] font-bold text-white/20 tracking-[0.2em] uppercase mb-5">안내</h4>
                <ul class="space-y-3 text-[0.85rem]">
                  <li><a href="/doctors" class="text-white/40 hover:text-white transition-colors">의료진</a></li>
                  <li><a href="/pricing" class="text-white/40 hover:text-white transition-colors">비용안내</a></li>
                  <li><a href="/directions" class="text-white/40 hover:text-white transition-colors">오시는길</a></li>
                  <li><a href="/faq" class="text-white/40 hover:text-white transition-colors">FAQ</a></li>
                </ul>
              </div>

              {/* Hours */}
              <div class="md:col-span-4">
                <h4 class="text-[0.7rem] font-bold text-white/20 tracking-[0.2em] uppercase mb-5">진료시간</h4>
                <div class="space-y-0 text-[0.85rem]">
                  {HOURS.map(h => (
                    <div class="flex justify-between items-center py-2.5 border-b border-white/[0.04]">
                      <span class="text-white/50">{h.day}</span>
                      <span class="text-white/75 font-semibold tabular-nums">{h.time}</span>
                    </div>
                  ))}
                  <div class="pt-3 flex items-center gap-2">
                    <span class="w-1.5 h-1.5 bg-primary rounded-full"></span>
                    <span class="text-primary text-[0.78rem] font-semibold">점심시간 없이 연속 진료</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom */}
            <div class="border-t border-white/[0.04] py-6 flex flex-col md:flex-row justify-between gap-3 text-[0.72rem] text-white/20">
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
            <a href="/reservation" class="flex flex-col items-center justify-center py-3 bg-primary text-white">
              <i class="fa-solid fa-calendar-check text-[1.1rem]"></i>
              <span class="text-[10px] mt-1 font-bold">예약</span>
            </a>
            <a href="/directions" class="flex flex-col items-center justify-center py-3 text-gray-400 active:bg-gray-50 transition-colors">
              <i class="fa-solid fa-location-dot text-[1.1rem]"></i>
              <span class="text-[10px] mt-1 font-medium">길찾기</span>
            </a>
          </div>
        </div>

        {/* === DESKTOP FLOATING CTA === */}
        <div class="hidden md:flex fixed bottom-8 right-8 z-40 flex-col gap-3">
          <a href={CLINIC.kakao} target="_blank" rel="noopener" class="floating-btn w-13 h-13 bg-[#FEE500] text-[#3C1E1E] rounded-2xl flex items-center justify-center shadow-lg" aria-label="카카오톡" style="width:52px;height:52px;">
            <i class="fa-solid fa-comment text-lg"></i>
          </a>
          <a href={CLINIC.phoneTel} class="floating-btn w-13 h-13 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg" aria-label="전화" style="width:52px;height:52px;">
            <i class="fa-solid fa-phone text-lg"></i>
          </a>
          <button onclick="window.scrollTo({top:0,behavior:'smooth'})" class="floating-btn w-13 h-13 bg-gray-900/90 text-white rounded-2xl flex items-center justify-center shadow-lg backdrop-blur-sm" aria-label="맨 위로" style="width:52px;height:52px;">
            <i class="fa-solid fa-arrow-up"></i>
          </button>
        </div>

        {/* === SCRIPTS === */}
        <script dangerouslySetInnerHTML={{__html: `
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
          }, { threshold: 0.06, rootMargin: '0px 0px -50px 0px' });

          document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger-children, .img-reveal').forEach(el => {
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
              const target = parseFloat(el.dataset.count);
              const suffix = el.dataset.suffix || '';
              const prefix = el.dataset.prefix || '';
              const decimals = (target % 1 !== 0) ? 1 : 0;
              let current = 0;
              const duration = 2000;
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
          document.querySelector('[data-counter-section]')?.let?.(el => counterObserver.observe(el));
          const counterEl = document.querySelector('[data-counter-section]');
          if (counterEl) counterObserver.observe(counterEl);

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
        `}} />
      </body>
    </html>
  )
})
