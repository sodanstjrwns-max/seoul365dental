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
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <link rel="canonical" href={canonicalUrl} />

        {/* OG Tags */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="서울365치과의원" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:locale" content="ko_KR" />
        <meta name="twitter:card" content="summary_large_image" />

        {/* Pretendard Font */}
        <link rel="stylesheet" as="style" crossorigin href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css" />
        {/* Tailwind CSS */}
        <script src="https://cdn.tailwindcss.com"></script>
        {/* Font Awesome */}
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet" />

        {/* Tailwind Config */}
        <script dangerouslySetInnerHTML={{__html: `
          tailwind.config = {
            theme: {
              extend: {
                colors: {
                  primary: { DEFAULT: '#1B6FC9', dark: '#155BA3', light: '#E8F0FE' },
                  navy: '#0A1628',
                  accent: '#10B981',
                },
                fontFamily: {
                  sans: ['Pretendard Variable', 'Pretendard', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'Roboto', 'sans-serif'],
                },
              }
            }
          }
        `}} />

        <link href="/static/style.css" rel="stylesheet" />

        {/* JSON-LD */}
        {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}} />}

        {/* Default Dentist Schema */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Dentist",
          "name": "서울365치과의원",
          "alternateName": "Seoul 365 Dental Clinic",
          "url": "https://seoul365dental.com",
          "telephone": "+82-32-432-0365",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "예술로 138 이토타워 2층",
            "addressLocality": "인천광역시 남동구",
            "addressRegion": "인천",
            "postalCode": "21556",
            "addressCountry": "KR"
          },
          "geo": { "@type": "GeoCoordinates", "latitude": "37.4482", "longitude": "126.7042" },
          "openingHoursSpecification": [
            {"dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday"], "opens": "10:00", "closes": "21:00"},
            {"dayOfWeek": "Friday", "opens": "10:00", "closes": "19:00"},
            {"dayOfWeek": "Saturday", "opens": "10:00", "closes": "14:00"},
            {"dayOfWeek": "Sunday", "opens": "14:00", "closes": "18:00"}
          ],
          "founder": {"@type": "Person", "name": "박준규"},
          "foundingDate": "2019",
          "medicalSpecialty": ["Implantology","Orthodontics","Prosthodontics","Endodontics","Pediatric Dentistry"]
        })}} />
      </head>
      <body class="font-sans text-gray-900 bg-white">
        {/* ===== HEADER ===== */}
        <header class="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
          {/* Top Bar */}
          <div class="hidden md:block bg-navy text-white text-xs">
            <div class="max-w-7xl mx-auto px-4 py-1.5 flex justify-between items-center">
              <div class="flex items-center gap-4">
                <span><i class="fa-solid fa-phone mr-1"></i> {CLINIC.phone}</span>
                <span><i class="fa-solid fa-location-dot mr-1"></i> {CLINIC.nearStation}</span>
              </div>
              <div class="flex items-center gap-3">
                <span id="operating-status-desktop" class="text-green-400 font-medium"></span>
                <span class="text-gray-400">|</span>
                <span>점심시간 없음</span>
              </div>
            </div>
          </div>
          {/* Main Nav */}
          <nav class="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <a href="/" class="flex items-center gap-2 text-primary font-bold text-xl tracking-tight">
              <i class="fa-solid fa-tooth text-2xl"></i>
              <span>서울365치과</span>
            </a>
            {/* Desktop Menu */}
            <div class="hidden lg:flex items-center gap-6 text-sm font-medium text-gray-700">
              <a href="/treatments" class="hover:text-primary transition-colors">진료안내</a>
              <a href="/doctors" class="hover:text-primary transition-colors">의료진</a>
              <a href="/pricing" class="hover:text-primary transition-colors">비용안내</a>
              <a href="/cases/gallery" class="hover:text-primary transition-colors">치료사례</a>
              <a href="/directions" class="hover:text-primary transition-colors">오시는길</a>
              <a href="/faq" class="hover:text-primary transition-colors">FAQ</a>
            </div>
            <div class="hidden lg:flex items-center gap-2">
              <a href={CLINIC.phoneTel} class="inline-flex items-center gap-1.5 px-4 py-2 border border-primary text-primary rounded-lg text-sm font-semibold hover:bg-primary-light transition-colors">
                <i class="fa-solid fa-phone"></i> 전화상담
              </a>
              <a href="/reservation" class="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-dark transition-colors">
                <i class="fa-solid fa-calendar-check"></i> 예약하기
              </a>
            </div>
            {/* Mobile Hamburger */}
            <button id="mobile-menu-btn" class="lg:hidden p-2 text-gray-700" aria-label="메뉴">
              <i class="fa-solid fa-bars text-xl"></i>
            </button>
          </nav>
          {/* Mobile Menu */}
          <div id="mobile-menu" class="hidden lg:hidden bg-white border-t border-gray-100 pb-4">
            <div class="px-4 py-2 space-y-1">
              <a href="/treatments" class="block py-2.5 px-3 text-gray-700 hover:bg-gray-50 rounded-lg">진료안내</a>
              <a href="/doctors" class="block py-2.5 px-3 text-gray-700 hover:bg-gray-50 rounded-lg">의료진</a>
              <a href="/pricing" class="block py-2.5 px-3 text-gray-700 hover:bg-gray-50 rounded-lg">비용안내</a>
              <a href="/cases/gallery" class="block py-2.5 px-3 text-gray-700 hover:bg-gray-50 rounded-lg">치료사례</a>
              <a href="/directions" class="block py-2.5 px-3 text-gray-700 hover:bg-gray-50 rounded-lg">오시는길</a>
              <a href="/faq" class="block py-2.5 px-3 text-gray-700 hover:bg-gray-50 rounded-lg">FAQ</a>
              <a href="/reservation" class="block py-2.5 px-3 text-white bg-primary rounded-lg text-center font-semibold mt-2">예약하기</a>
            </div>
          </div>
        </header>

        {/* ===== MAIN CONTENT ===== */}
        <main class="pt-16 md:pt-[calc(4rem+2rem)]">
          {children}
        </main>

        {/* ===== FOOTER ===== */}
        <footer class="bg-navy text-gray-300 pb-24 md:pb-8">
          <div class="max-w-7xl mx-auto px-4 py-12">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Brand */}
              <div class="md:col-span-1">
                <a href="/" class="flex items-center gap-2 text-white font-bold text-xl mb-4">
                  <i class="fa-solid fa-tooth text-primary"></i>
                  <span>서울365치과</span>
                </a>
                <p class="text-sm text-gray-400 leading-relaxed">과잉진료 없는 양심치과<br/>서울대 출신 5인 원장 협력 진료</p>
              </div>
              {/* Hours */}
              <div>
                <h3 class="text-white font-semibold mb-3 text-sm">진료시간</h3>
                <ul class="space-y-1.5 text-sm">
                  {HOURS.map(h => (
                    <li class="flex justify-between">
                      <span>{h.day}</span>
                      <span class="text-gray-400">{h.time}</span>
                    </li>
                  ))}
                  <li class="text-primary font-medium mt-2">점심시간 없이 연속 진료</li>
                </ul>
              </div>
              {/* Contact */}
              <div>
                <h3 class="text-white font-semibold mb-3 text-sm">연락처</h3>
                <ul class="space-y-2 text-sm">
                  <li><i class="fa-solid fa-phone mr-2 text-primary"></i><a href={CLINIC.phoneTel} class="hover:text-white">{CLINIC.phone}</a></li>
                  <li><i class="fa-solid fa-location-dot mr-2 text-primary"></i>{CLINIC.address}</li>
                  <li><i class="fa-solid fa-train-subway mr-2 text-primary"></i>{CLINIC.nearStation}</li>
                </ul>
              </div>
              {/* Quick Links */}
              <div>
                <h3 class="text-white font-semibold mb-3 text-sm">바로가기</h3>
                <ul class="space-y-1.5 text-sm">
                  <li><a href="/reservation" class="hover:text-white">상담 예약</a></li>
                  <li><a href="/pricing" class="hover:text-white">비용 안내</a></li>
                  <li><a href="/directions" class="hover:text-white">오시는 길</a></li>
                  <li><a href="/privacy" class="hover:text-white">개인정보처리방침</a></li>
                  <li><a href="/terms" class="hover:text-white">이용약관</a></li>
                </ul>
                <div class="flex gap-3 mt-4">
                  <a href={CLINIC.instagram} target="_blank" rel="noopener" class="text-gray-400 hover:text-white text-lg" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>
                  <a href={CLINIC.naverBlog} target="_blank" rel="noopener" class="text-gray-400 hover:text-white text-lg" aria-label="Naver Blog"><i class="fa-solid fa-n"></i></a>
                  <a href={CLINIC.kakao} target="_blank" rel="noopener" class="text-gray-400 hover:text-white text-lg" aria-label="KakaoTalk"><i class="fa-solid fa-comment"></i></a>
                </div>
              </div>
            </div>
            <div class="border-t border-gray-700 mt-8 pt-6 text-xs text-gray-500 flex flex-col md:flex-row justify-between gap-2">
              <span>서울365치과의원 | 대표 박준규 | {CLINIC.address}</span>
              <span>&copy; 2026 Seoul 365 Dental Clinic. All rights reserved.</span>
            </div>
          </div>
        </footer>

        {/* ===== MOBILE BOTTOM CTA ===== */}
        <div class="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
          <div class="grid grid-cols-4 divide-x divide-gray-100">
            <a href={CLINIC.phoneTel} class="flex flex-col items-center py-2.5 text-gray-600 hover:text-primary active:bg-gray-50">
              <i class="fa-solid fa-phone text-lg"></i>
              <span class="text-[10px] mt-0.5 font-medium">전화</span>
            </a>
            <a href={CLINIC.kakao} target="_blank" rel="noopener" class="flex flex-col items-center py-2.5 text-gray-600 hover:text-yellow-500 active:bg-gray-50">
              <i class="fa-solid fa-comment text-lg"></i>
              <span class="text-[10px] mt-0.5 font-medium">카카오톡</span>
            </a>
            <a href={CLINIC.naverBooking} target="_blank" rel="noopener" class="flex flex-col items-center py-2.5 text-white bg-primary">
              <i class="fa-solid fa-calendar-check text-lg"></i>
              <span class="text-[10px] mt-0.5 font-semibold">예약하기</span>
            </a>
            <a href="/directions" class="flex flex-col items-center py-2.5 text-gray-600 hover:text-primary active:bg-gray-50">
              <i class="fa-solid fa-location-dot text-lg"></i>
              <span class="text-[10px] mt-0.5 font-medium">오시는길</span>
            </a>
          </div>
        </div>

        {/* ===== DESKTOP FLOATING CTA ===== */}
        <div class="hidden md:flex fixed bottom-6 right-6 z-40 flex-col gap-2">
          <a href={CLINIC.kakao} target="_blank" rel="noopener" class="w-12 h-12 bg-yellow-400 text-gray-800 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform" aria-label="카카오톡 상담">
            <i class="fa-solid fa-comment text-lg"></i>
          </a>
          <a href={CLINIC.phoneTel} class="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform" aria-label="전화 상담">
            <i class="fa-solid fa-phone text-lg"></i>
          </a>
          <button onclick="window.scrollTo({top:0,behavior:'smooth'})" class="w-12 h-12 bg-gray-800 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform" aria-label="맨 위로">
            <i class="fa-solid fa-arrow-up text-lg"></i>
          </button>
        </div>

        {/* ===== SCRIPTS ===== */}
        <script dangerouslySetInnerHTML={{__html: `
          // Mobile menu toggle
          document.getElementById('mobile-menu-btn')?.addEventListener('click', function() {
            const menu = document.getElementById('mobile-menu');
            menu.classList.toggle('hidden');
          });

          // Operating status
          function updateOperatingStatus() {
            const now = new Date();
            const day = now.getDay();
            const h = now.getHours();
            const m = now.getMinutes();
            const time = h * 60 + m;
            let status = '';
            let isOpen = false;
            
            if (day >= 1 && day <= 4) {
              isOpen = time >= 600 && time < 1260;
              status = isOpen ? '오늘 21시까지 진료중' : '진료 종료';
            } else if (day === 5) {
              isOpen = time >= 600 && time < 1140;
              status = isOpen ? '오늘 19시까지 진료중' : '진료 종료';
            } else if (day === 6) {
              isOpen = time >= 600 && time < 840;
              status = isOpen ? '오늘 14시까지 진료중' : '진료 종료';
            } else {
              isOpen = time >= 840 && time < 1080;
              status = isOpen ? '오늘 18시까지 진료중' : '진료 종료';
            }

            const badge = isOpen 
              ? '<span class="inline-flex items-center gap-1"><span class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>' + status + '</span>'
              : '<span class="text-gray-400">' + status + '</span>';

            document.querySelectorAll('[id^="operating-status"]').forEach(el => {
              el.innerHTML = badge;
            });
          }
          updateOperatingStatus();
          setInterval(updateOperatingStatus, 60000);

          // FAQ accordion
          document.querySelectorAll('.faq-toggle').forEach(btn => {
            btn.addEventListener('click', function() {
              const content = this.nextElementSibling;
              const icon = this.querySelector('.faq-icon');
              content.classList.toggle('hidden');
              icon.classList.toggle('rotate-180');
            });
          });

          // Scroll animations
          const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
              }
            });
          }, { threshold: 0.1 });
          document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
        `}} />
      </body>
    </html>
  )
})
