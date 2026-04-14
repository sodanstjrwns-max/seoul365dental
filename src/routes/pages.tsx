import { Hono } from 'hono'
import type { Bindings } from '../lib/types'
import { CLINIC, HOURS } from '../data/clinic'
import { treatments } from '../data/treatments'
import { mainFaq, pricingData, pricingSummary, pricingCategories } from '../data/faq'
import { MESSAGING } from '../data/brand'
import { hashPassword, verifyPassword, generateSessionId, getSessionCookie, clearSessionCookie, getCurrentUser } from '../lib/auth'
import { initAdminTables } from '../lib/db'
import { terms, totalTerms } from '../data/encyclopedia-terms'

const pageRoutes = new Hono<{ Bindings: Bindings }>()

pageRoutes.get('/reservation', (c) => {
  return c.render(
    <>
      <section class="treatment-hero">
        <div class="relative z-10 max-w-[1400px] mx-auto px-5 md:px-8 py-28 md:py-36">
          <h1 class="section-headline text-white mb-4 reveal" style="transition-delay:0.3s">상담 예약하기</h1>
          <p class="hero-sub text-white/35 reveal" style="transition-delay:0.5s">편하신 방법으로 상담 예약해 주세요.</p>
        </div>
      </section>

      <section class="section-lg bg-mesh">
        <div class="max-w-4xl mx-auto px-5 md:px-8">
          {/* Quick CTAs */}
          <div class="grid grid-cols-1 md:grid-cols-3 gap-5 mb-16 stagger-children">
            <a href={CLINIC.phoneTel} class="glass-card p-8 text-center group block" data-cursor-hover>
              <div class="icon-circle mx-auto mb-4">
                <i class="fa-solid fa-phone"></i>
              </div>
              <h2 class="font-bold text-gray-900 text-lg mb-1 group-hover:text-[#0066FF] transition-colors">전화 상담</h2>
              <p class="text-[#0066FF] font-extrabold text-xl">{CLINIC.phone}</p>
              <p class="text-sm text-gray-400 mt-2">가장 빠른 상담 방법</p>
            </a>
            <a href={CLINIC.kakao} target="_blank" rel="noopener" class="glass-card p-8 text-center group block" data-cursor-hover>
              <div class="w-14 h-14 rounded-2xl bg-yellow-50 flex items-center justify-center mx-auto mb-4 group-hover:bg-yellow-100 transition-colors">
                <i class="fa-solid fa-comment text-yellow-500 text-xl"></i>
              </div>
              <h2 class="font-bold text-gray-900 text-lg mb-1 group-hover:text-[#0066FF] transition-colors">카카오톡 상담</h2>
              <p class="text-yellow-600 font-bold">채팅으로 편하게</p>
              <p class="text-sm text-gray-400 mt-2">사진/영상 전송 가능</p>
            </a>
            <a href={CLINIC.naverBooking} target="_blank" rel="noopener" class="glass-card p-8 text-center group block" data-cursor-hover>
              <div class="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center mx-auto mb-4 group-hover:bg-green-100 transition-colors">
                <i class="fa-solid fa-calendar-check text-green-500 text-xl"></i>
              </div>
              <h2 class="font-bold text-gray-900 text-lg mb-1 group-hover:text-[#0066FF] transition-colors">네이버 예약</h2>
              <p class="text-green-600 font-bold">온라인 간편 예약</p>
              <p class="text-sm text-gray-400 mt-2">원하는 시간 선택</p>
            </a>
          </div>

          {/* Form */}
          <div class="premium-card p-8 md:p-10 reveal-3d">
            <h2 class="text-xl font-bold text-gray-900 mb-8">온라인 상담 신청</h2>
            <form id="consultForm" class="space-y-5">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">이름 *</label>
                  <input type="text" name="name" required class="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF]/30 transition-all text-sm" placeholder="이름을 입력해주세요" />
                </div>
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">연락처 *</label>
                  <input type="tel" name="phone" required class="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF]/30 transition-all text-sm" placeholder="010-0000-0000" />
                </div>
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">관심 치료</label>
                <select name="treatment" class="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF]/30 transition-all text-sm text-gray-600">
                  <option value="">선택해주세요</option>
                  <option>전체임플란트</option><option>디지털풀아치 임플란트</option><option>일반 임플란트</option>
                  <option>치아교정</option><option>인비절라인</option><option>수면진료</option>
                  <option>심미치료</option><option>충치/신경치료</option><option>기타</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">상담 내용</label>
                <textarea name="message" rows={4} class="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF]/30 transition-all text-sm resize-none" placeholder="궁금하신 내용을 자유롭게 적어주세요"></textarea>
              </div>
              <div class="flex items-start gap-2.5">
                <input type="checkbox" required class="mt-1 accent-[#0066FF]" id="privacy-agree" />
                <label for="privacy-agree" class="text-sm text-gray-500">
                  <a href="/privacy" class="text-[#0066FF] font-semibold underline underline-offset-2">개인정보처리방침</a>에 동의합니다 *
                </label>
              </div>
              <button type="submit" id="consultSubmitBtn" class="btn-premium btn-premium-fill w-full py-4 text-[0.95rem]" data-cursor-hover>상담 신청하기</button>
              <div id="consultResult" class="hidden text-center text-sm py-3 rounded-xl"></div>
            </form>
          </div>
          <script dangerouslySetInnerHTML={{__html: `
            document.getElementById('consultForm').addEventListener('submit', async function(e) {
              e.preventDefault();
              const btn = document.getElementById('consultSubmitBtn');
              const result = document.getElementById('consultResult');
              btn.disabled = true;
              btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i>전송 중...';
              result.classList.add('hidden');
              try {
                const fd = new FormData(this);
                const res = await fetch('/api/consultations', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    name: fd.get('name'),
                    phone: fd.get('phone'),
                    treatment: fd.get('treatment'),
                    message: fd.get('message')
                  })
                });
                const data = await res.json();
                if (data.ok) {
                  result.className = 'text-center text-sm py-3 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200';
                  result.innerHTML = '<i class="fa-solid fa-circle-check mr-1.5"></i>상담 신청이 완료되었습니다. 빠른 시일 내에 연락드리겠습니다!';
                  result.classList.remove('hidden');
                  this.reset();
                } else {
                  throw new Error(data.error || '오류 발생');
                }
              } catch(err) {
                result.className = 'text-center text-sm py-3 rounded-xl bg-red-50 text-red-600 border border-red-200';
                result.innerHTML = '<i class="fa-solid fa-circle-exclamation mr-1.5"></i>' + err.message;
                result.classList.remove('hidden');
              } finally {
                btn.disabled = false;
                btn.innerHTML = '상담 신청하기';
              }
            });
          `}} />
        </div>
      </section>
    </>,
    {
      title: '상담 예약 | 서울365치과 인천 구월동 - 전화·카카오톡·네이버 예약',
      description: '서울365치과 상담 예약. 전화(032-432-0365), 카카오톡, 네이버 예약, 온라인 상담 신청. 365일·야간21시 운영. 인천 구월동 예술회관역 5번 출구. 내원 전 무료 상담 가능.',
      canonical: 'https://seoul365dc.kr/reservation',
      jsonLd: [
        {
          "@context": "https://schema.org", "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "홈", "item": "https://seoul365dc.kr" },
            { "@type": "ListItem", "position": 2, "name": "상담 예약", "item": "https://seoul365dc.kr/reservation" }
          ]
        },
        // ContactPage
        {
          "@context": "https://schema.org",
          "@type": "ContactPage",
          "name": "서울365치과 상담 예약",
          "description": "서울365치과 상담 예약. 전화, 카카오톡, 네이버 예약, 온라인 상담 신청.",
          "url": "https://seoul365dc.kr/reservation",
          "isPartOf": { "@id": "https://seoul365dc.kr/#website" },
          "about": { "@id": "https://seoul365dc.kr/#dentist" },
          "inLanguage": "ko-KR"
        },
        // ReserveAction
        {
          "@context": "https://schema.org",
          "@type": "ReserveAction",
          "name": "서울365치과 상담 예약하기",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": "https://seoul365dc.kr/reservation",
            "inLanguage": "ko",
            "actionPlatform": ["http://schema.org/DesktopWebPlatform", "http://schema.org/MobileWebPlatform"]
          },
          "result": {
            "@type": "Reservation",
            "name": "치과 상담 예약",
            "reservationFor": { "@id": "https://seoul365dc.kr/#dentist" }
          },
          "agent": { "@id": "https://seoul365dc.kr/#dentist" },
          "object": { "@type": "MedicalClinic", "name": "서울365치과의원" }
        },
        // CommunicateAction — multiple communication channels
        {
          "@context": "https://schema.org",
          "@type": "CommunicateAction",
          "name": "서울365치과 전화 상담",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": "tel:032-432-0365",
            "actionPlatform": ["http://schema.org/MobileWebPlatform"]
          },
          "about": { "@type": "Thing", "name": "치과 상담" }
        },
        // ScheduleAction — Naver booking
        {
          "@context": "https://schema.org",
          "@type": "ScheduleAction",
          "name": "네이버 예약으로 서울365치과 상담 신청",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": "https://booking.naver.com/booking/13/bizes/426166",
          },
          "agent": { "@type": "Person", "name": "환자" },
          "object": { "@type": "MedicalClinic", "name": "서울365치과의원" },
        },
        // Speakable for AEO (reservation page)
        {
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "상담 예약 | 서울365치과",
          "url": "https://seoul365dc.kr/reservation",
          "speakable": {
            "@type": "SpeakableSpecification",
            "cssSelector": ["h1", "h2", ".hero-sub"]
          }
        },
        // Service — consultation service details
        {
          "@context": "https://schema.org",
          "@type": "Service",
          "name": "서울365치과 상담 서비스",
          "serviceType": "치과 상담",
          "provider": { "@id": "https://seoul365dc.kr/#dentist" },
          "areaServed": [
            { "@type": "City", "name": "인천광역시" },
            { "@type": "AdministrativeArea", "name": "인천 남동구" },
            { "@type": "AdministrativeArea", "name": "인천 구월동" },
          ],
          "serviceOutput": {
            "@type": "Thing",
            "name": "맞춤 치료 계획",
            "description": "정밀 CT 촬영 후 개인별 최적 치료 계획 수립"
          },
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "KRW",
            "description": "초진 상담 무료",
          },
          "termsOfService": "https://seoul365dc.kr/terms",
          "availableChannel": [
            { "@type": "ServiceChannel", "serviceUrl": "https://seoul365dc.kr/reservation", "serviceSmsNumber": "+82-32-432-0365", "name": "온라인 예약" },
            { "@type": "ServiceChannel", "servicePhone": { "@type": "ContactPoint", "telephone": "+82-32-432-0365" }, "name": "전화 예약" },
            { "@type": "ServiceChannel", "serviceUrl": "https://pf.kakao.com/_dMsCT", "name": "카카오톡 상담" },
          ]
        }
      ]
    }
  )
})

// ============================================================
// PRICING
// ============================================================
// ============================================================
// INFO: Pricing + Directions (Tab page)
// ============================================================
pageRoutes.get('/pricing', (c) => c.redirect('/info#pricing', 301))
pageRoutes.get('/directions', (c) => c.redirect('/info', 301))

// SEO: 인비절라인 단축 URL — 검색엔진 & 광고용 직접 진입점
pageRoutes.get('/invisalign', (c) => c.redirect('/treatments/invisalign', 301))
pageRoutes.get('/투명교정', (c) => c.redirect('/treatments/invisalign', 301))

pageRoutes.get('/info', (c) => {
  return c.render(
    <>
      <section class="treatment-hero">
        <div class="relative z-10 max-w-[1400px] mx-auto px-5 md:px-8 py-28 md:py-36">
          <h1 class="section-headline text-white mb-4 reveal" style="transition-delay:0.4s">내원 안내</h1>
          <p class="hero-sub text-white/35 reveal" style="transition-delay:0.6s">진료 비용과 찾아오시는 방법을 안내드립니다.</p>
        </div>
      </section>

      {/* Tab Switcher */}
      <section class="sticky top-[72px] z-30 bg-white/90 backdrop-blur border-b border-gray-100">
        <div class="max-w-5xl mx-auto px-5 md:px-8">
          <div class="flex gap-0" id="infoTabs">
            <button onclick="switchInfoTab('directions')" id="tab-directions" class="info-tab active flex-1 py-4 text-center text-sm font-bold text-[#0066FF] border-b-2 border-[#0066FF] transition-all">
              <i class="fa-solid fa-location-dot mr-1.5"></i>오시는 길
            </button>
            <button onclick="switchInfoTab('pricing')" id="tab-pricing" class="info-tab flex-1 py-4 text-center text-sm font-bold text-gray-400 border-b-2 border-transparent hover:text-gray-600 transition-all">
              <i class="fa-solid fa-won-sign mr-1.5"></i>비용 안내
            </button>
          </div>
        </div>
      </section>

      {/* === PRICING TAB === */}
      <section id="panel-pricing" class="section-lg bg-mesh" style="display:none">
        <div class="max-w-5xl mx-auto px-5 md:px-8">
          <h2 class="sr-only">서울365치과 진료비용 안내</h2>
          {/* Category Quick Nav */}
          <div class="flex flex-wrap gap-2 justify-center mb-12 reveal">
            {pricingCategories.map(cat => (
              <a href={`#pricing-${cat.key}`} class="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-gray-200 bg-white text-gray-600 text-[0.78rem] font-medium hover:border-[#0066FF]/40 hover:text-[#0066FF] transition-all">
                <i class={`fa-solid ${cat.icon} text-[0.65rem]`}></i>
                {cat.label}
              </a>
            ))}
          </div>

          {/* Category Tables */}
          {pricingCategories.map(cat => {
            const items = pricingData.filter(p => p.category === cat.key);
            if (items.length === 0) return null;
            return (
              <div id={`pricing-${cat.key}`} class="mb-12 reveal-3d">
                <div class="flex items-center gap-2 mb-4">
                  <div class="w-8 h-8 rounded-lg bg-[#0066FF]/10 flex items-center justify-center">
                    <i class={`fa-solid ${cat.icon} text-[#0066FF] text-sm`}></i>
                  </div>
                  <h3 class="text-lg font-bold text-gray-800">{cat.label}</h3>
                  <span class="text-xs text-gray-400 ml-1">{items.length}항목</span>
                </div>
                <div class="premium-card overflow-hidden">
                  <div class="overflow-x-auto">
                    <table class="w-full text-sm">
                      <thead>
                        <tr class="bg-gradient-to-r from-navy to-navy-lighter text-white/90">
                          <th class="text-left px-5 py-3 font-semibold text-[0.78rem]">치료 항목</th>
                          <th class="text-right px-5 py-3 font-semibold text-[0.78rem]">비용</th>
                          <th class="text-right px-5 py-3 font-semibold text-[0.78rem] hidden sm:table-cell">보험</th>
                        </tr>
                      </thead>
                      <tbody class="divide-y divide-gray-50">
                        {items.map((p, i) => (
                          <tr class={`hover:bg-[#0066FF]/[0.02] transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                            <td class="px-5 py-3 text-gray-800 font-medium">
                              {p.treatment}
                              {p.note && <span class="text-[0.65rem] text-gray-400 ml-1.5">({p.note})</span>}
                            </td>
                            <td class="px-5 py-3 text-right text-[#0066FF] font-bold whitespace-nowrap">{p.price}</td>
                            <td class="px-5 py-3 text-right text-gray-400 hidden sm:table-cell text-xs">{p.insurance}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            );
          })}

          <div class="mt-8 glass-card p-5 reveal">
            <div class="flex items-start gap-3">
              <i class="fa-solid fa-circle-info text-amber-500 mt-0.5"></i>
              <div>
                <p class="text-sm text-gray-600 font-medium">위 가격은 참고용이며, 환자 상태에 따라 달라질 수 있습니다. 정확한 비용은 정밀 진단 후 안내드립니다.</p>
                <p class="text-xs text-gray-400 mt-1">카드 결제 및 분할 결제가 가능합니다.</p>
              </div>
            </div>
          </div>

          <div class="text-center mt-10 reveal">
            <a href="/reservation" class="btn-premium btn-premium-fill" data-cursor-hover>비용 상담 예약하기 <i class="fa-solid fa-arrow-right text-xs ml-1"></i></a>
          </div>
        </div>
      </section>

      {/* === DIRECTIONS TAB (default visible) === */}
      <section id="panel-directions" class="section-lg bg-mesh">
        <div class="max-w-4xl mx-auto px-5 md:px-8">
          <h2 class="sr-only">서울365치과 오시는 길</h2>
          {/* Google Maps Embed */}
          <div class="premium-card overflow-hidden mb-10 reveal-3d" style="aspect-ratio:16/9">
            <iframe
              src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent('서울365치과의원 인천 남동구 예술로 138 이토타워')}&center=${CLINIC.geo.lat},${CLINIC.geo.lng}&zoom=16&language=ko`}
              width="100%" height="100%" style="border:0;min-height:350px" allowfullscreen loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
              title="서울365치과 위치 - 인천 남동구 예술로 138 이토타워 2층">
            </iframe>
          </div>

          {/* Google Maps Link Buttons */}
          <div class="flex flex-wrap justify-center gap-3 mb-10 reveal">
            <a href={`https://www.google.com/maps/search/?api=1&query=${CLINIC.geo.lat},${CLINIC.geo.lng}`}
               target="_blank" rel="noopener"
               class="btn-premium btn-premium-outline text-sm px-6 py-3" data-cursor-hover>
              <i class="fa-brands fa-google text-xs"></i> Google Maps
            </a>
            <a href={`https://map.naver.com/p/search/${encodeURIComponent(CLINIC.address)}`}
               target="_blank" rel="noopener"
               class="btn-premium btn-premium-outline text-sm px-6 py-3" style="border-color:#03cf5d40;color:#03cf5d" data-cursor-hover>
              <i class="fa-solid fa-map text-xs"></i> 네이버 지도
            </a>
            <a href={`https://map.kakao.com/link/search/${encodeURIComponent(CLINIC.address)}`}
               target="_blank" rel="noopener"
               class="btn-premium btn-premium-outline text-sm px-6 py-3" style="border-color:#FEE50040;color:#3C1E1E" data-cursor-hover>
              <i class="fa-solid fa-location-dot text-xs"></i> 카카오맵
            </a>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-5 stagger-children">
            {[
              { icon: 'fa-location-dot', title: '주소', main: CLINIC.address, sub: '(우) 21556' },
              { icon: 'fa-train-subway', title: '지하철', main: '인천 2호선 예술회관역 5번 출구', sub: '도보 약 3분 (250m)' },
              { icon: 'fa-car', title: '주차', main: '이토타워 건물 내 주차장 이용', sub: '진료 시 주차 지원 가능' },
              { icon: 'fa-bus', title: '버스', main: '예술회관역 정류장 하차', sub: '다수 시내버스 이용 가능' },
            ].map(info => (
              <div class="glass-card p-6 tilt-card">
                <div class="flex items-center gap-3 mb-3">
                  <div class="icon-circle icon-circle-sm">
                    <i class={`fa-solid ${info.icon}`}></i>
                  </div>
                  <h3 class="font-bold text-gray-900">{info.title}</h3>
                </div>
                <p class="text-gray-700 text-[0.9rem]">{info.main}</p>
                <p class="text-gray-400 text-xs mt-1">{info.sub}</p>
              </div>
            ))}
          </div>

          <div class="text-center mt-10 reveal">
            <a href={CLINIC.phoneTel} class="btn-premium btn-premium-fill" data-cursor-hover><i class="fa-solid fa-phone"></i> 전화 문의 {CLINIC.phone}</a>
          </div>
        </div>
      </section>

      {/* Tab Switching Script */}
      <script dangerouslySetInnerHTML={{__html: `
        function switchInfoTab(tab) {
          document.querySelectorAll('.info-tab').forEach(b => {
            b.classList.remove('active','text-[#0066FF]','border-[#0066FF]');
            b.classList.add('text-gray-400','border-transparent');
          });
          const active = document.getElementById('tab-' + tab);
          if (active) { active.classList.add('active','text-[#0066FF]','border-[#0066FF]'); active.classList.remove('text-gray-400','border-transparent'); }
          document.getElementById('panel-directions').style.display = tab === 'directions' ? '' : 'none';
          document.getElementById('panel-pricing').style.display = tab === 'pricing' ? '' : 'none';
          history.replaceState(null, '', tab === 'pricing' ? '/info#pricing' : '/info');
        }
        // Auto-switch on hash
        if (window.location.hash === '#pricing') switchInfoTab('pricing');
      `}} />
    </>,
    {
      title: '내원안내 | 서울365치과 비용·오시는길',
      description: '서울365치과 내원안내. 임플란트·교정 비용, 오시는길, 진료시간. 예술회관역 5번 출구 도보 3분. 032-432-0365',
      canonical: 'https://seoul365dc.kr/info',
      jsonLd: [
        {
          "@context": "https://schema.org", "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "홈", "item": "https://seoul365dc.kr" },
            { "@type": "ListItem", "position": 2, "name": "내원안내", "item": "https://seoul365dc.kr/info" }
          ]
        },
        {
          "@context": "https://schema.org",
          "@type": "OfferCatalog",
          "name": "서울365치과 진료비용표",
          "description": "서울365치과 비급여 항목 진료비용",
          "itemListElement": pricingSummary.map((p: any) => ({
            "@type": "Offer",
            "itemOffered": { "@type": "MedicalProcedure", "name": p.treatment },
            "priceCurrency": "KRW", "price": p.price,
            "description": `보험: ${p.insurance}`,
            "seller": { "@id": "https://seoul365dc.kr/#dentist" },
            "availability": "https://schema.org/InStock"
          }))
        },
        {
          "@context": "https://schema.org",
          "@type": "Place",
          "name": "서울365치과의원",
          "address": { "@type": "PostalAddress", "streetAddress": "예술로 138 이토타워 2층 212호", "addressLocality": "인천광역시 남동구", "addressRegion": "인천", "postalCode": "21556", "addressCountry": "KR" },
          "geo": { "@type": "GeoCoordinates", "latitude": "37.4482", "longitude": "126.7042" },
          "hasMap": "https://www.google.com/maps?q=37.4482,126.7042",
        },
        // Speakable for AEO (info page)
        {
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "내원안내 | 서울365치과",
          "url": "https://seoul365dc.kr/info",
          "speakable": {
            "@type": "SpeakableSpecification",
            "cssSelector": ["h1", "h2", "h3", ".hero-sub"]
          }
        },
        {
          "@context": "https://schema.org",
          "@type": "HowTo",
          "name": "서울365치과 찾아오는 방법",
          "step": [
            { "@type": "HowToStep", "position": 1, "name": "지하철", "text": "인천 2호선 예술회관역 5번 출구로 나오세요." },
            { "@type": "HowToStep", "position": 2, "name": "도보 이동", "text": "5번 출구에서 직진 약 250m (도보 3분)." },
            { "@type": "HowToStep", "position": 3, "name": "도착", "text": "이토타워 건물 2층 서울365치과의원입니다." },
          ]
        },
      ]
    }
  )
})

// ============================================================
// FAQ — 전체 치료 FAQ 통합 페이지 (474개+)
// ============================================================
pageRoutes.get('/faq', (c) => {
  // 카테고리 정의 (순서 및 아이콘)
  const categories = [
    { key: 'all', label: '전체', icon: 'fa-list' },
    { key: 'general', label: '일반 안내', icon: 'fa-circle-info' },
    { key: '전문센터', label: '전문센터', icon: 'fa-hospital', sub: '임플란트 · 교정 · 수면진료 · 소아 · 심미' },
    { key: '일반/보존', label: '보존치료', icon: 'fa-shield-halved', sub: '충치 · 레진 · 인레이 · 크라운 · 신경치료 · 미백' },
    { key: '잇몸/외과', label: '잇몸/외과', icon: 'fa-scissors', sub: '스케일링 · 잇몸 · 사랑니 · 턱관절 · 이갈이' },
    { key: '특수', label: '특수치료', icon: 'fa-star-of-life', sub: '임플란트재수술 · 브릿지 · 응급 · 예방' },
  ];

  // 일반 안내 FAQ
  const generalFaq = [
    ...mainFaq,
    { q: '예약은 어떻게 하나요?', a: '전화(032-432-0365), 카카오톡, 네이버 예약 모두 가능합니다.' },
    { q: '응급 상황에 방문해도 되나요?', a: '네, 365일 진료하므로 갑작스러운 치통이나 외상 시 바로 내원하세요.' },
    { q: '분할 결제가 가능한가요?', a: '네, 카드 분할 결제가 가능합니다.' },
    { q: '첫 방문 시 무엇을 준비해야 하나요?', a: '신분증과 건강보험증을 지참해 주세요.' },
    { q: '위치가 어디인가요?', a: '인천 남동구 구월동 이토타워 내 위치합니다. 인천 1호선 예술회관역 도보 5분 거리입니다.' },
    { q: '진료 시간은 어떻게 되나요?', a: '평일(월~목) 09:30~21:00, 금요일 09:30~18:00, 토·일·공휴일 14:00~18:00 (점심시간 없이 연속 진료).' },
  ];

  // 치료별 FAQ를 카테고리로 그룹핑
  const treatmentsByCategory: Record<string, typeof treatments> = {};
  for (const t of treatments) {
    if (!treatmentsByCategory[t.category]) treatmentsByCategory[t.category] = [];
    treatmentsByCategory[t.category].push(t);
  }

  // 전체 FAQ 수 계산
  const totalFaqCount = generalFaq.length + treatments.reduce((sum, t) => sum + t.faq.length, 0);

  // JSON-LD용: 일반 FAQ + 각 치료별 첫 2개씩 (SEO에 충분하되 페이지 크기 합리적으로)
  const allFaqFlat = [
    ...generalFaq,
    ...treatments.flatMap(t => t.faq.slice(0, 2)),
  ];

  return c.render(
    <>
      <section class="treatment-hero">
        <div class="relative z-10 max-w-[1400px] mx-auto px-5 md:px-8 py-28 md:py-36">
          <h1 class="section-headline text-white mb-4 reveal" style="transition-delay:0.3s">자주 묻는 질문</h1>
          <p class="hero-sub text-white/35 reveal" style="transition-delay:0.5s">
            25개 진료과목, {totalFaqCount}개의 FAQ를 한눈에 확인하세요.
          </p>
        </div>
      </section>

      {/* 검색 바 */}
      <section class="bg-white border-b border-gray-100 sticky top-[64px] z-30" style="backdrop-filter:blur(12px);background:rgba(255,255,255,0.92)">
        <div class="max-w-4xl mx-auto px-5 md:px-8 py-4">
          <div class="relative">
            <i class="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 text-sm"></i>
            <input
              type="text"
              id="faq-search"
              placeholder="궁금한 내용을 검색하세요 (예: 임플란트 비용, 미백 통증, 사랑니...)"
              class="w-full pl-11 pr-10 py-3.5 border border-gray-200 rounded-xl text-[0.9rem] focus:outline-none focus:border-[#0066FF] focus:ring-2 focus:ring-[#0066FF]/10 transition-all"
            />
            <button id="faq-search-clear" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 hidden" data-cursor-hover>
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
          <div id="faq-search-count" class="text-xs text-gray-400 mt-2 hidden"></div>
        </div>
      </section>

      {/* 카테고리 탭 */}
      <section class="bg-white border-b border-gray-100">
        <div class="max-w-4xl mx-auto px-5 md:px-8">
          <div class="flex gap-1 overflow-x-auto scrollbar-hide py-3" id="faq-tabs">
            {categories.map((cat, i) => (
              <button
                class={`faq-tab flex-shrink-0 px-4 py-2.5 rounded-lg text-[0.82rem] font-medium transition-all whitespace-nowrap ${i === 0 ? 'bg-[#0066FF] text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'}`}
                data-tab={cat.key}
                data-cursor-hover
              >
                <i class={`fa-solid ${cat.icon} mr-1.5 text-[0.75rem]`}></i>
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ 본문 */}
      <section class="section-lg bg-mesh">
        <div class="max-w-4xl mx-auto px-5 md:px-8">

          {/* 일반 안내 섹션 */}
          <div class="faq-category-section" data-category="general">
            <div class="flex items-center gap-3 mb-5">
              <div class="w-9 h-9 rounded-lg bg-gradient-to-br from-[#0066FF]/10 to-[#00E5FF]/10 flex items-center justify-center">
                <i class="fa-solid fa-circle-info text-[#0066FF] text-sm"></i>
              </div>
              <div>
                <h2 class="text-lg font-bold text-gray-900">일반 안내</h2>
                <p class="text-xs text-gray-400">예약 · 진료시간 · 결제 · 주차</p>
              </div>
              <span class="ml-auto text-xs text-gray-300 font-medium">{generalFaq.length}개</span>
            </div>
            <div class="space-y-2 mb-10">
              {generalFaq.map(faq => (
                <div class="faq-item faq-searchable" data-category="general">
                  <button class="faq-toggle w-full text-left px-5 py-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors" data-cursor-hover>
                    <h3 class="font-semibold text-gray-800 text-[0.9rem] pr-4">{faq.q}</h3>
                    <i class="fa-solid fa-chevron-down text-gray-300 text-xs faq-icon flex-shrink-0"></i>
                  </button>
                  <div class="hidden px-5 pb-4">
                    <p class="text-gray-500 text-[0.85rem] leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 카테고리별 치료 FAQ */}
          {['전문센터', '일반/보존', '잇몸/외과', '특수'].map(catKey => {
            const catInfo = categories.find(c => c.key === catKey)!;
            const catTreatments = treatmentsByCategory[catKey] || [];
            const catFaqCount = catTreatments.reduce((sum, t) => sum + t.faq.length, 0);

            return (
              <div class="faq-category-section" data-category={catKey}>
                <div class="flex items-center gap-3 mb-6">
                  <div class="w-9 h-9 rounded-lg bg-gradient-to-br from-[#0066FF]/10 to-[#00E5FF]/10 flex items-center justify-center">
                    <i class={`fa-solid ${catInfo.icon} text-[#0066FF] text-sm`}></i>
                  </div>
                  <div>
                    <h2 class="text-lg font-bold text-gray-900">{catInfo.label}</h2>
                    <p class="text-xs text-gray-400">{catInfo.sub}</p>
                  </div>
                  <span class="ml-auto text-xs text-gray-300 font-medium">{catFaqCount}개</span>
                </div>

                {catTreatments.map(t => (
                  <div class="mb-8 faq-treatment-group" data-treatment={t.slug} data-category={catKey}>
                    {/* 치료 제목 */}
                    <div class="flex items-center gap-2.5 mb-3 px-1">
                      <i class={`fa-solid ${t.icon} text-[#0066FF]/60 text-sm`}></i>
                      <h3 class="text-[0.95rem] font-bold text-gray-800">{t.name}</h3>
                      <span class="text-xs text-gray-300 font-medium">({t.faq.length})</span>
                      <a href={`/treatments/${t.slug}`} class="ml-auto text-xs text-[#0066FF]/50 hover:text-[#0066FF] transition-colors" data-cursor-hover>
                        상세보기 <i class="fa-solid fa-arrow-right text-[0.6rem]"></i>
                      </a>
                    </div>
                    {/* FAQ 리스트 */}
                    <div class="space-y-2 mb-2">
                      {t.faq.map(faq => (
                        <div class="faq-item faq-searchable" data-category={catKey} data-treatment={t.slug}>
                          <button class="faq-toggle w-full text-left px-5 py-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors" data-cursor-hover>
                            <h3 class="font-semibold text-gray-800 text-[0.88rem] pr-4">{faq.q}</h3>
                            <i class="fa-solid fa-chevron-down text-gray-300 text-xs faq-icon flex-shrink-0"></i>
                          </button>
                          <div class="hidden px-5 pb-4">
                            <p class="text-gray-500 text-[0.85rem] leading-relaxed">{faq.a}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            );
          })}

          {/* 검색 결과 없음 */}
          <div id="faq-no-results" class="hidden text-center py-16">
            <i class="fa-solid fa-magnifying-glass text-gray-200 text-4xl mb-4"></i>
            <p class="text-gray-400 font-medium">검색 결과가 없습니다</p>
            <p class="text-gray-300 text-sm mt-1">다른 키워드로 검색해 보세요</p>
          </div>

          {/* 하단 CTA */}
          <div class="text-center mt-12 reveal">
            <p class="text-gray-400 mb-4">원하시는 답변을 찾지 못하셨나요?</p>
            <div class="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="/reservation" class="btn-premium btn-premium-fill" data-cursor-hover>
                <i class="fa-solid fa-calendar-check mr-2"></i>상담 예약하기
              </a>
              <a href="tel:032-432-0365" class="btn-premium" data-cursor-hover>
                <i class="fa-solid fa-phone mr-2"></i>032-432-0365
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ 검색/탭 스크립트 */}
      <script dangerouslySetInnerHTML={{ __html: `
        (function(){
          const searchInput = document.getElementById('faq-search');
          const searchClear = document.getElementById('faq-search-clear');
          const searchCount = document.getElementById('faq-search-count');
          const noResults = document.getElementById('faq-no-results');
          const tabs = document.querySelectorAll('.faq-tab');
          const sections = document.querySelectorAll('.faq-category-section');
          const items = document.querySelectorAll('.faq-searchable');
          const groups = document.querySelectorAll('.faq-treatment-group');
          let activeTab = 'all';

          // Tab click
          tabs.forEach(tab => {
            tab.addEventListener('click', function(){
              activeTab = this.dataset.tab;
              tabs.forEach(t => { t.classList.remove('bg-[#0066FF]','text-white','shadow-sm'); t.classList.add('text-gray-500'); });
              this.classList.add('bg-[#0066FF]','text-white','shadow-sm');
              this.classList.remove('text-gray-500');
              applyFilter();
            });
          });

          // Search
          let debounce;
          searchInput.addEventListener('input', function(){
            clearTimeout(debounce);
            debounce = setTimeout(applyFilter, 150);
            searchClear.classList.toggle('hidden', !this.value);
          });
          searchClear.addEventListener('click', function(){
            searchInput.value = '';
            searchClear.classList.add('hidden');
            searchCount.classList.add('hidden');
            applyFilter();
          });

          function applyFilter(){
            const query = searchInput.value.trim().toLowerCase();
            const isSearch = query.length > 0;
            let visibleCount = 0;

            items.forEach(item => {
              const cat = item.dataset.category;
              const text = item.textContent.toLowerCase();
              const matchTab = activeTab === 'all' || cat === activeTab;
              const matchSearch = !isSearch || text.includes(query);
              const show = matchTab && matchSearch;
              item.style.display = show ? '' : 'none';
              if (show) visibleCount++;
            });

            // Show/hide category sections
            sections.forEach(sec => {
              const cat = sec.dataset.category;
              const matchTab = activeTab === 'all' || cat === activeTab;
              if (!matchTab) { sec.style.display = 'none'; return; }
              const hasVisible = sec.querySelectorAll('.faq-searchable:not([style*="display: none"])').length > 0;
              sec.style.display = hasVisible ? '' : 'none';
            });

            // Show/hide treatment groups
            groups.forEach(g => {
              const hasVisible = g.querySelectorAll('.faq-searchable:not([style*="display: none"])').length > 0;
              g.style.display = hasVisible ? '' : 'none';
            });

            // Search count
            if (isSearch) {
              searchCount.textContent = visibleCount + '개의 FAQ가 검색되었습니다';
              searchCount.classList.remove('hidden');
            } else {
              searchCount.classList.add('hidden');
            }

            // No results
            noResults.classList.toggle('hidden', visibleCount > 0 || !isSearch);
          }
        })();
      `}} />
    </>,
    {
      title: 'FAQ | 서울365치과 자주 묻는 질문 (' + totalFaqCount + '개)',
      description: '서울365치과 FAQ ' + totalFaqCount + '개. 임플란트 비용, 교정, 수면진료, 충치, 신경치료, 사랑니, 미백, 잇몸치료 등 25개 진료과목 FAQ를 한눈에. 인천 구월동. 032-432-0365',
      canonical: 'https://seoul365dc.kr/faq',
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "홈", "item": "https://seoul365dc.kr" },
            { "@type": "ListItem", "position": 2, "name": "FAQ", "item": "https://seoul365dc.kr/faq" }
          ]
        },
        {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "name": "서울365치과 자주 묻는 질문",
          "mainEntity": allFaqFlat.map(f => ({
            "@type": "Question",
            "name": f.q,
            "acceptedAnswer": { "@type": "Answer", "text": f.a }
          }))
        },
        {
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "자주 묻는 질문 FAQ | 서울365치과",
          "url": "https://seoul365dc.kr/faq",
          "speakable": {
            "@type": "SpeakableSpecification",
            "cssSelector": ["h1", "h3", ".faq-searchable p"]
          },
        },
      ]
    }
  )
})

// ============================================================
// CASES GALLERY — LOGIN REQUIRED
// ============================================================
pageRoutes.get('/cases/gallery', async (c) => {
  const user = await getCurrentUser(c.env.DB, c.req.header('cookie'));
  const isLoggedIn = !!user;

  // Fetch published cases from DB (always — cards are shown even without login)
  let dbCases: any[] = [];
  try {
    await initAdminTables(c.env.DB);
    const result = await c.env.DB.prepare('SELECT * FROM before_after_cases WHERE is_published = 1 ORDER BY sort_order DESC, created_at DESC').all();
    dbCases = result.results || [];
  } catch {}

  // Show gallery (cards visible to all, detail modal requires login)
  return c.render(
    <>
      <section class="treatment-hero">
        <div class="relative z-10 max-w-[1400px] mx-auto px-5 md:px-8 py-28 md:py-36">
          <h1 class="section-headline text-white mb-4 reveal" style="transition-delay:0.3s">치료 사례 Before &amp; After</h1>
          <p class="hero-sub text-white/35 reveal" style="transition-delay:0.5s">
            {isLoggedIn ? '실제 치료 전후 사례를 확인하세요.' : 'Before 사진을 확인하고, After는 로그인 후 열람 가능합니다.'}
          </p>
        </div>
      </section>

      <section class="section-lg bg-mesh">
        <div class="max-w-[1400px] mx-auto px-5 md:px-8">
          {isLoggedIn ? (
            <div class="flex items-center justify-between mb-8 reveal">
              <p class="text-sm text-gray-400"><i class="fa-solid fa-user-check text-[#0066FF] mr-1.5"></i> <span class="font-medium text-gray-600">{user!.name}</span>님, 환영합니다.</p>
            </div>
          ) : (
            <div class="flex items-center justify-between mb-8 reveal">
              <p class="text-sm text-gray-400"><i class="fa-solid fa-lock text-[#0066FF]/50 mr-1.5"></i> After 사진 열람은 <a href="/login" class="text-[#0066FF] font-semibold underline">로그인</a> 후 가능합니다.</p>
              <div class="flex gap-2">
                <a href="/login" class="text-xs px-3 py-1.5 rounded-lg bg-[#0066FF] text-white font-bold hover:bg-[#0052cc] transition">로그인</a>
                <a href="/register" class="text-xs px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 font-bold hover:bg-gray-200 transition">회원가입</a>
              </div>
            </div>
          )}

          {dbCases.length === 0 ? (
            <div class="text-center py-20">
              <div class="w-20 h-20 rounded-full bg-[#0066FF]/5 mx-auto mb-6 flex items-center justify-center">
                <i class="fa-solid fa-images text-3xl text-[#0066FF]/20"></i>
              </div>
              <h2 class="text-lg font-bold text-gray-900 mb-2">아직 등록된 사례가 없습니다</h2>
              <p class="text-gray-400 text-sm">곧 실제 치료 사례를 업로드할 예정입니다.</p>
            </div>
          ) : (
            <>
              {/* Filter Tabs */}
              <div class="flex flex-wrap gap-2 mb-8 reveal" id="caseFilters">
                <button onclick="filterCases('all')" class="case-filter-btn active px-4 py-2 rounded-full text-xs font-semibold bg-[#0066FF] text-white transition" data-filter="all">전체 ({dbCases.length})</button>
                {Array.from(new Set(dbCases.map((cs: any) => cs.tag))).map((tag: any) => (
                  <button onclick={`filterCases('${tag}')`} data-filter={tag} class="case-filter-btn px-4 py-2 rounded-full text-xs font-semibold bg-gray-100 text-gray-500 hover:bg-gray-200 transition">{tag} ({dbCases.filter((cs: any) => cs.tag === tag).length})</button>
                ))}
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children" id="casesGrid">
                {dbCases.map((cs: any, idx: number) => (
                  <div class="premium-card overflow-hidden tilt-card electric-card-border case-card cursor-pointer group" data-tag={cs.tag} onclick={isLoggedIn ? `openCaseModal(${idx})` : `showLoginRequired()`}>
                    <div class="aspect-[4/3] bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center relative overflow-hidden">
                      {/* Before 사진만 전체 표시 */}
                      {cs.before_image ? (
                        <img src={cs.before_image} alt={`${cs.title} 치료 전`} class="absolute inset-0 w-full h-full object-cover" />
                      ) : (
                        <div class="absolute inset-0 flex items-center justify-center bg-gray-100">
                          <span class="text-gray-300 text-sm font-bold tracking-widest uppercase">Before</span>
                        </div>
                      )}
                      {/* Before 라벨 */}
                      <span class="absolute top-3 left-3 text-[0.6rem] font-bold tracking-widest uppercase text-white bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-lg z-10">Before</span>
                      {/* After 잠금 오버레이 (우하단) */}
                      <div class="absolute bottom-3 right-3 z-10 flex items-center gap-1.5 bg-black/50 backdrop-blur-sm text-white text-[0.65rem] font-bold px-3 py-1.5 rounded-lg">
                        <i class={`fa-solid ${isLoggedIn ? 'fa-eye' : 'fa-lock'} text-[0.55rem]`}></i>
                        <span>{isLoggedIn ? 'After 보기' : 'After 잠금'}</span>
                      </div>
                      {/* Hover overlay */}
                      <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                        <div class="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 backdrop-blur-sm rounded-full w-12 h-12 flex items-center justify-center shadow-lg">
                          <i class={`fa-solid ${isLoggedIn ? 'fa-expand' : 'fa-lock'} text-[#0066FF] text-lg`}></i>
                        </div>
                      </div>
                    </div>
                    <div class="p-5">
                      <div class="flex items-center gap-2 mb-2">
                        <span class="text-[0.7rem] bg-[#0066FF]/8 text-[#0066FF] px-2.5 py-0.5 rounded-full font-semibold">{cs.tag}</span>
                        {cs.duration && <span class="text-[0.65rem] text-gray-400"><i class="fa-regular fa-clock mr-0.5"></i>{cs.duration}</span>}
                      </div>
                      <h3 class="font-bold text-gray-900 text-sm group-hover:text-[#0066FF] transition-colors">{cs.title}</h3>
                      {cs.description && <p class="text-gray-500 text-xs mt-1.5 line-clamp-2">{cs.description}</p>}
                      <p class="text-xs text-gray-400 mt-2">담당: {cs.doctor_name}{cs.patient_age ? ` · ${cs.patient_age}` : ''}{cs.patient_gender ? ` ${cs.patient_gender}` : ''}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          <p class="text-[0.72rem] text-gray-300 text-center mt-10">※ 개인에 따라 치료 결과가 다를 수 있습니다. 모든 사례는 환자 동의 하에 게시되었습니다.</p>
        </div>
      </section>

      {/* Case Detail Modal */}
      <div id="caseModal" class="fixed inset-0 z-[100] hidden" onclick="closeCaseModal(event)">
        <div class="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
        <div class="relative z-10 flex items-center justify-center min-h-screen p-4 md:p-8">
          <div class="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onclick="event.stopPropagation()">
            {/* Modal Header */}
            <div class="sticky top-0 bg-white/95 backdrop-blur-sm z-10 flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div class="flex items-center gap-2">
                <span id="modalTag" class="text-[0.7rem] bg-[#0066FF]/8 text-[#0066FF] px-2.5 py-0.5 rounded-full font-semibold"></span>
                <span id="modalDuration" class="text-[0.65rem] text-gray-400"></span>
              </div>
              <div class="flex items-center gap-2">
                <button onclick="navCase(-1)" class="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition" title="이전 사례">
                  <i class="fa-solid fa-chevron-left text-gray-500 text-sm"></i>
                </button>
                <button onclick="navCase(1)" class="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition" title="다음 사례">
                  <i class="fa-solid fa-chevron-right text-gray-500 text-sm"></i>
                </button>
                <button onclick="closeCaseModal()" class="w-9 h-9 rounded-full bg-gray-100 hover:bg-red-100 hover:text-red-500 flex items-center justify-center transition ml-1" title="닫기">
                  <i class="fa-solid fa-xmark text-gray-500 text-sm"></i>
                </button>
              </div>
            </div>
            {/* Before/After Comparison */}
            <div class="p-6">
              <div class="grid grid-cols-2 gap-3 mb-6">
                <div class="relative rounded-2xl overflow-hidden bg-gray-50 aspect-[4/3]">
                  <img id="modalBefore" src="" alt="Before" class="w-full h-full object-cover" />
                  <span class="absolute top-3 left-3 text-[0.65rem] font-bold tracking-widest uppercase text-white bg-black/50 backdrop-blur-sm px-3 py-1 rounded-lg">Before</span>
                </div>
                <div class="relative rounded-2xl overflow-hidden bg-gray-50 aspect-[4/3]">
                  <img id="modalAfter" src="" alt="After" class="w-full h-full object-cover" />
                  <span class="absolute top-3 right-3 text-[0.65rem] font-bold tracking-widest uppercase text-white bg-[#0066FF]/80 backdrop-blur-sm px-3 py-1 rounded-lg">After</span>
                </div>
              </div>
              {/* Info */}
              <h2 id="modalTitle" class="text-xl font-bold text-gray-900 mb-3"></h2>
              <p id="modalDesc" class="text-gray-600 text-sm leading-relaxed mb-4"></p>
              <div class="flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-500 bg-gray-50 rounded-xl px-5 py-4">
                <span id="modalDoctor"><i class="fa-solid fa-user-doctor text-[#0066FF]/60 mr-1.5"></i></span>
                <span id="modalPatient"><i class="fa-solid fa-user text-[#0066FF]/60 mr-1.5"></i></span>
                <span id="modalDur"><i class="fa-regular fa-clock text-[#0066FF]/60 mr-1.5"></i></span>
              </div>
              {/* CTA */}
              <div class="mt-6 text-center">
                <p class="text-gray-400 text-xs mb-3">비슷한 고민을 가지고 계신가요?</p>
                <a href="/reservation" class="inline-flex items-center gap-2 bg-[#0066FF] hover:bg-[#0052cc] text-white font-bold text-sm px-6 py-3 rounded-xl transition">
                  <i class="fa-solid fa-calendar-check text-xs"></i> 무료 상담 예약
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <script dangerouslySetInnerHTML={{__html: `
        var cases = ${JSON.stringify(dbCases.map((cs: any) => ({
          id: cs.id, title: cs.title, tag: cs.tag, duration: cs.duration || '',
          description: cs.description || '', doctor_name: cs.doctor_name || '',
          patient_age: cs.patient_age || '', patient_gender: cs.patient_gender || '',
          before_image: cs.before_image || '', after_image: cs.after_image || '',
        })))};
        var currentIdx = 0;

        function openCaseModal(idx) {
          currentIdx = idx;
          renderModal();
          document.getElementById('caseModal').classList.remove('hidden');
          document.body.style.overflow = 'hidden';
          // Track view count
          var c = cases[idx];
          if (c && c.id) {
            fetch('/api/cases/' + c.id + '/view', { method: 'POST' }).catch(function(){});
          }
        }

        function closeCaseModal(e) {
          if (e && e.target && e.target.closest && e.target.closest('[onclick="event.stopPropagation()"]')) return;
          document.getElementById('caseModal').classList.add('hidden');
          document.body.style.overflow = '';
        }

        function navCase(dir) {
          // Filter visible cases
          var visibleIdxs = [];
          document.querySelectorAll('.case-card').forEach(function(card, i) {
            if (card.style.display !== 'none') visibleIdxs.push(i);
          });
          var pos = visibleIdxs.indexOf(currentIdx);
          if (pos === -1) pos = 0;
          pos = (pos + dir + visibleIdxs.length) % visibleIdxs.length;
          currentIdx = visibleIdxs[pos];
          renderModal();
        }

        function renderModal() {
          var c = cases[currentIdx];
          if (!c) return;
          document.getElementById('modalTag').textContent = c.tag;
          document.getElementById('modalDuration').textContent = c.duration ? c.duration : '';
          document.getElementById('modalBefore').src = c.before_image || '';
          document.getElementById('modalAfter').src = c.after_image || '';
          document.getElementById('modalTitle').textContent = c.title;
          document.getElementById('modalDesc').textContent = c.description || '상세 설명이 없습니다.';
          document.getElementById('modalDoctor').innerHTML = '<i class="fa-solid fa-user-doctor text-[#0066FF]/60 mr-1.5"></i>담당: ' + c.doctor_name;
          document.getElementById('modalPatient').innerHTML = '<i class="fa-solid fa-user text-[#0066FF]/60 mr-1.5"></i>' + (c.patient_age || '') + ' ' + (c.patient_gender || '');
          document.getElementById('modalDur').innerHTML = '<i class="fa-regular fa-clock text-[#0066FF]/60 mr-1.5"></i>' + (c.duration || '-');
          document.getElementById('modalDur').style.display = c.duration ? '' : 'none';
          document.getElementById('modalPatient').style.display = (c.patient_age || c.patient_gender) ? '' : 'none';
        }

        // Keyboard nav
        document.addEventListener('keydown', function(e) {
          if (document.getElementById('caseModal').classList.contains('hidden')) return;
          if (e.key === 'Escape') closeCaseModal();
          if (e.key === 'ArrowLeft') navCase(-1);
          if (e.key === 'ArrowRight') navCase(1);
        });

        function filterCases(tag) {
          document.querySelectorAll('.case-filter-btn').forEach(b => {
            b.classList.remove('bg-[#0066FF]', 'text-white', 'active');
            b.classList.add('bg-gray-100', 'text-gray-500');
          });
          const activeBtn = document.querySelector('[data-filter="'+tag+'"]');
          if (activeBtn) { activeBtn.classList.add('bg-[#0066FF]', 'text-white', 'active'); activeBtn.classList.remove('bg-gray-100', 'text-gray-500'); }
          document.querySelectorAll('.case-card').forEach(card => {
            if (tag === 'all' || card.dataset.tag === tag) { card.style.display = ''; } else { card.style.display = 'none'; }
          });
        }

        function showLoginRequired() {
          var m = document.getElementById('loginRequiredModal');
          if (m) m.classList.remove('hidden');
        }
      `}} />

      {/* 로그인 필요 모달 (비로그인 시 카드 클릭) */}
      <div id="loginRequiredModal" class="fixed inset-0 z-[100] hidden" onclick="if(event.target===this)this.classList.add('hidden')" style="background:rgba(0,0,0,0.55);backdrop-filter:blur(4px)">
        <div class="flex items-center justify-center min-h-screen p-4">
          <div class="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 text-center relative" onclick="event.stopPropagation()">
            <button onclick="document.getElementById('loginRequiredModal').classList.add('hidden')" class="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition">
              <i class="fa-solid fa-xmark text-gray-400"></i>
            </button>
            <div class="w-16 h-16 rounded-full bg-[#0066FF]/10 mx-auto mb-5 flex items-center justify-center">
              <i class="fa-solid fa-lock text-2xl text-[#0066FF]/50"></i>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">After 사진 열람</h3>
            <p class="text-gray-500 text-sm mb-6 leading-relaxed">
              치료 후(After) 사진 확인은<br/>로그인 후 이용하실 수 있습니다.
            </p>
            <div class="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="/login" class="btn-premium btn-premium-fill px-7 py-3" data-cursor-hover>
                <i class="fa-solid fa-right-to-bracket mr-1"></i> 로그인
              </a>
              <a href="/register" class="btn-premium btn-premium-outline px-7 py-3" data-cursor-hover>
                <i class="fa-solid fa-user-plus mr-1"></i> 회원가입
              </a>
            </div>
            <p class="text-xs text-gray-300 mt-5">가입은 30초면 충분합니다.</p>
          </div>
        </div>
      </div>

      <script dangerouslySetInnerHTML={{__html: `
        document.addEventListener('keydown', function(e) {
          if (e.key === 'Escape') {
            var m = document.getElementById('loginRequiredModal');
            if (m && !m.classList.contains('hidden')) m.classList.add('hidden');
          }
        });
      `}} />
    </>,
    {
      title: '치료 사례 Before & After | 서울365치과',
      description: '서울365치과 치료 사례 갤러리. 임플란트·교정·심미치료 Before & After 실제 치료 결과. 서울대 5인 전문의 협진. 032-432-0365',
      canonical: 'https://seoul365dc.kr/cases/gallery',
      jsonLd: [
        {
          "@context": "https://schema.org", "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "홈", "item": "https://seoul365dc.kr" },
            { "@type": "ListItem", "position": 2, "name": "치료사례", "item": "https://seoul365dc.kr/cases/gallery" }
          ]
        },
        {
          "@context": "https://schema.org",
          "@type": "ImageGallery",
          "name": "서울365치과 치료 사례 갤러리",
          "description": "서울365치과 임플란트, 교정, 심미치료 Before & After 갤러리. 실제 치료 전후 사진.",
          "url": "https://seoul365dc.kr/cases/gallery",
          "about": { "@id": "https://seoul365dc.kr/#dentist" },
          "isPartOf": { "@id": "https://seoul365dc.kr/#website" },
          "accessMode": "visual",
          "isAccessibleForFree": false,
          "conditionsOfAccess": "회원 로그인 필요",
        },
        {
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": "서울365치과 치료 사례",
          "url": "https://seoul365dc.kr/cases/gallery",
          "inLanguage": "ko-KR",
        },
      ]
    }
  )
})

// ============================================================
// AUTH: REGISTER
// ============================================================
pageRoutes.get('/register', (c) => {
  return c.render(
    <>
      <section class="treatment-hero">
        <div class="relative z-10 max-w-[1400px] mx-auto px-5 md:px-8 py-28 md:py-36">
          <h1 class="section-headline text-white mb-4 reveal" style="transition-delay:0.3s">회원가입</h1>
          <p class="hero-sub text-white/35 reveal" style="transition-delay:0.5s">30초면 가입이 완료됩니다.</p>
        </div>
      </section>

      <section class="section-lg bg-mesh">
        <div class="max-w-md mx-auto px-5 md:px-8">
          <div class="premium-card p-8 md:p-10 reveal-3d">
            <h2 class="text-lg font-bold text-gray-900 mb-6">회원 정보 입력</h2>
            <div id="register-error" class="hidden mb-6 p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium"></div>
            <form id="register-form" class="space-y-5">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">이름 *</label>
                <input type="text" name="name" required class="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF]/30 transition-all text-sm" placeholder="홍길동" />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">휴대폰 번호 *</label>
                <input type="tel" name="phone" required class="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF]/30 transition-all text-sm" placeholder="010-1234-5678" />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">비밀번호 *</label>
                <input type="password" name="password" required minlength="4" class="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF]/30 transition-all text-sm" placeholder="4자리 이상" />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">비밀번호 확인 *</label>
                <input type="password" name="password2" required minlength="4" class="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF]/30 transition-all text-sm" placeholder="비밀번호 재입력" />
              </div>
              <div class="space-y-3 pt-1">
                <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider">약관 동의</p>
                
                {/* 전체 동의 */}
                <div class="flex items-center gap-2.5 p-3.5 bg-gray-50 rounded-2xl border border-gray-100">
                  <input type="checkbox" class="accent-[#0066FF] w-4 h-4" id="agree-all" />
                  <label for="agree-all" class="text-sm font-bold text-gray-800 cursor-pointer select-none">전체 동의</label>
                </div>

                {/* 개인정보 수집·이용 동의 (필수) */}
                <div class="flex items-start gap-2.5 pl-1">
                  <input type="checkbox" required class="mt-0.5 accent-[#0066FF] w-4 h-4" id="agree-privacy" name="privacy_agreed" />
                  <label for="agree-privacy" class="text-sm text-gray-600 cursor-pointer select-none">
                    <span class="text-[#0066FF] font-semibold">[필수]</span>{' '}
                    <a href="/privacy" target="_blank" class="text-[#0066FF] font-semibold underline underline-offset-2 hover:text-[#0044CC]">개인정보 수집·이용</a>에 동의합니다
                  </label>
                </div>
                <div class="ml-7 -mt-2 p-3 bg-gray-50/80 rounded-xl text-xs text-gray-400 leading-relaxed border border-gray-100/60">
                  수집항목: 이름, 연락처 | 이용목적: 회원관리, 진료상담 | 보유기간: 탈퇴 시까지 (의료법 보존의무 별도)
                </div>

                {/* 광고·마케팅 활용 동의 (선택) */}
                <div class="flex items-start gap-2.5 pl-1">
                  <input type="checkbox" class="mt-0.5 accent-[#0066FF] w-4 h-4" id="agree-marketing" name="marketing_agreed" />
                  <label for="agree-marketing" class="text-sm text-gray-600 cursor-pointer select-none">
                    <span class="text-gray-400 font-semibold">[선택]</span>{' '}
                    광고·마케팅 정보 수신에 동의합니다
                  </label>
                </div>
                <div class="ml-7 -mt-2 p-3 bg-gray-50/80 rounded-xl text-xs text-gray-400 leading-relaxed border border-gray-100/60">
                  치료 이벤트, 건강정보, 프로모션 등 문자(SMS/카카오) 안내 | 동의 후 언제든 철회 가능
                </div>
              </div>
              <button type="submit" id="register-btn" class="btn-premium btn-premium-fill w-full py-4 text-[0.95rem]" data-cursor-hover>
                회원가입
              </button>
            </form>
            <p class="text-center text-sm text-gray-400 mt-6">
              이미 계정이 있으신가요? <a href="/login" class="text-[#0066FF] font-semibold link-underline">로그인</a>
            </p>
          </div>
        </div>
      </section>

      <script dangerouslySetInnerHTML={{__html: `
        // 전체 동의 체크박스 로직
        const agreeAll = document.getElementById('agree-all');
        const agreePrivacy = document.getElementById('agree-privacy');
        const agreeMarketing = document.getElementById('agree-marketing');
        
        agreeAll.addEventListener('change', function() {
          agreePrivacy.checked = this.checked;
          agreeMarketing.checked = this.checked;
        });
        [agreePrivacy, agreeMarketing].forEach(cb => {
          cb.addEventListener('change', function() {
            agreeAll.checked = agreePrivacy.checked && agreeMarketing.checked;
          });
        });

        document.getElementById('register-form').addEventListener('submit', async function(e) {
          e.preventDefault();
          const btn = document.getElementById('register-btn');
          const err = document.getElementById('register-error');
          btn.disabled = true; btn.textContent = '처리중...';
          err.classList.add('hidden');

          const fd = new FormData(this);
          const data = Object.fromEntries(fd);

          if (data.password !== data.password2) {
            err.textContent = '비밀번호가 일치하지 않습니다.';
            err.classList.remove('hidden');
            btn.disabled = false; btn.textContent = '회원가입';
            return;
          }

          if (!agreePrivacy.checked) {
            err.textContent = '개인정보 수집·이용에 동의해주세요.';
            err.classList.remove('hidden');
            btn.disabled = false; btn.textContent = '회원가입';
            return;
          }

          try {
            const res = await fetch('/api/auth/register', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                name: data.name, 
                phone: data.phone, 
                password: data.password,
                privacy_agreed: true,
                marketing_agreed: agreeMarketing.checked
              })
            });
            const json = await res.json();
            if (json.ok) {
              window.location.href = '/cases/gallery';
            } else {
              err.textContent = json.error || '가입에 실패했습니다.';
              err.classList.remove('hidden');
            }
          } catch(e) {
            err.textContent = '서버 오류가 발생했습니다.';
            err.classList.remove('hidden');
          }
          btn.disabled = false; btn.textContent = '회원가입';
        });
      `}} />
    </>,
    {
      title: '회원가입 | 서울365치과 치료사례 열람',
      description: '서울365치과 회원가입. 30초면 간편 가입. 회원 전용 Before & After 치료사례 확인.',
      canonical: 'https://seoul365dc.kr/register',
    }
  )
})

// ============================================================
// AUTH: LOGIN
// ============================================================
pageRoutes.get('/login', (c) => {
  return c.render(
    <>
      <section class="treatment-hero">
        <div class="relative z-10 max-w-[1400px] mx-auto px-5 md:px-8 py-28 md:py-36">
          <h1 class="section-headline text-white mb-4 reveal" style="transition-delay:0.3s">로그인</h1>
          <p class="hero-sub text-white/35 reveal" style="transition-delay:0.5s">회원 전용 콘텐츠를 열람하세요.</p>
        </div>
      </section>

      <section class="section-lg bg-mesh">
        <div class="max-w-md mx-auto px-5 md:px-8">
          <div class="premium-card p-8 md:p-10 reveal-3d">
            <h2 class="text-lg font-bold text-gray-900 mb-6">휴대폰 번호로 로그인</h2>
            <div id="login-error" class="hidden mb-6 p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium"></div>
            <form id="login-form" class="space-y-5">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">휴대폰 번호</label>
                <input type="tel" name="phone" required class="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF]/30 transition-all text-sm" placeholder="010-1234-5678" />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">비밀번호</label>
                <input type="password" name="password" required class="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF]/30 transition-all text-sm" placeholder="비밀번호 입력" />
              </div>
              <button type="submit" id="login-btn" class="btn-premium btn-premium-fill w-full py-4 text-[0.95rem]" data-cursor-hover>
                로그인
              </button>
            </form>
            <p class="text-center text-sm text-gray-400 mt-6">
              계정이 없으신가요? <a href="/register" class="text-[#0066FF] font-semibold link-underline">회원가입</a>
            </p>
          </div>
        </div>
      </section>

      <script dangerouslySetInnerHTML={{__html: `
        document.getElementById('login-form').addEventListener('submit', async function(e) {
          e.preventDefault();
          const btn = document.getElementById('login-btn');
          const err = document.getElementById('login-error');
          btn.disabled = true; btn.textContent = '로그인 중...';
          err.classList.add('hidden');

          const fd = new FormData(this);
          const data = Object.fromEntries(fd);

          try {
            const res = await fetch('/api/auth/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ phone: data.phone, password: data.password })
            });
            const json = await res.json();
            if (json.ok) {
              window.location.href = '/cases/gallery';
            } else {
              err.textContent = json.error || '로그인에 실패했습니다.';
              err.classList.remove('hidden');
            }
          } catch(e) {
            err.textContent = '서버 오류가 발생했습니다.';
            err.classList.remove('hidden');
          }
          btn.disabled = false; btn.textContent = '로그인';
        });
      `}} />
    </>,
    {
      title: '로그인 | 서울365치과 회원 전용',
      description: '서울365치과 로그인. Before & After 치료사례 등 회원 전용 콘텐츠 열람.',
      canonical: 'https://seoul365dc.kr/login',
    }
  )
})


// ============================================================
// NOTICES (공지사항)
// ============================================================
pageRoutes.get('/notices', async (c) => {
  await initAdminTables(c.env.DB);
  let notices: any[] = [];
  try {
    const result = await c.env.DB.prepare(
      'SELECT id, title, content, category, is_pinned, view_count, created_at FROM notices WHERE is_published = 1 ORDER BY is_pinned DESC, created_at DESC'
    ).all();
    notices = result.results || [];
  } catch {}

  const categoryColors: Record<string, string> = {
    '공지': 'bg-[#0066FF]/8 text-[#0066FF]',
    '이벤트': 'bg-pink-50 text-pink-600',
    '안내': 'bg-emerald-50 text-emerald-600',
    '휴무': 'bg-amber-50 text-amber-700',
  };

  return c.render(
    <>
      <section class="treatment-hero">
        <div class="relative z-10 max-w-[1400px] mx-auto px-5 md:px-8 py-28 md:py-36">
          <h1 class="section-headline text-white mb-4 reveal" style="transition-delay:0.3s">공지사항</h1>
          <p class="hero-sub text-white/35 reveal" style="transition-delay:0.5s">서울365치과의 소식과 안내사항을 확인하세요.</p>
        </div>
      </section>

      <section class="section-lg bg-mesh">
        <div class="max-w-4xl mx-auto px-5 md:px-8">
          {notices.length === 0 ? (
            <div class="text-center py-20 reveal">
              <div class="w-16 h-16 rounded-full bg-gray-100 mx-auto mb-4 flex items-center justify-center">
                <i class="fa-solid fa-bullhorn text-2xl text-gray-300"></i>
              </div>
              <p class="text-gray-400">아직 공지사항이 없습니다.</p>
            </div>
          ) : (
            <div class="space-y-3 stagger-children">
              {notices.map((n: any) => (
                <a href={`/notices/${n.id}`} class="glass-card p-5 md:p-6 block group hover:border-[#0066FF]/20 transition-all" data-cursor-hover>
                  <div class="flex items-start gap-4">
                    {n.is_pinned ? (
                      <div class="flex-shrink-0 w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center mt-0.5">
                        <i class="fa-solid fa-thumbtack text-amber-500 text-xs"></i>
                      </div>
                    ) : (
                      <div class="flex-shrink-0 w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center mt-0.5">
                        <i class="fa-solid fa-file-lines text-gray-300 text-xs"></i>
                      </div>
                    )}
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center gap-2 mb-1.5">
                        <span class={`text-[0.65rem] font-bold px-2 py-0.5 rounded-full ${categoryColors[n.category] || categoryColors['공지']}`}>{n.category}</span>
                        {n.is_pinned ? <span class="text-[0.6rem] text-amber-500 font-bold">고정</span> : null}
                      </div>
                      <h3 class="text-base font-bold text-gray-900 group-hover:text-[#0066FF] transition-colors truncate">{n.title}</h3>
                      <div class="flex items-center gap-3 mt-2 text-xs text-gray-400">
                        <span><i class="fa-regular fa-calendar mr-1"></i>{n.created_at?.slice(0, 10)}</span>
                        <span><i class="fa-regular fa-eye mr-1"></i>{n.view_count}</span>
                      </div>
                    </div>
                    <i class="fa-solid fa-chevron-right text-gray-200 group-hover:text-[#0066FF]/50 transition-colors mt-3 text-sm"></i>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </section>
    </>,
    {
      title: '공지사항 | 서울365치과',
      description: '서울365치과 공지사항. 진료 안내, 이벤트, 휴무일 공지 등 병원 소식을 확인하세요.',
      canonical: 'https://seoul365dc.kr/notices',
    }
  )
})

pageRoutes.get('/notices/:id', async (c) => {
  await initAdminTables(c.env.DB);
  const id = c.req.param('id');
  let notice: any = null;
  try {
    await c.env.DB.prepare('UPDATE notices SET view_count = view_count + 1 WHERE id = ? AND is_published = 1').bind(id).run();
    notice = await c.env.DB.prepare(
      'SELECT id, title, content, category, is_pinned, view_count, image, created_at FROM notices WHERE id = ? AND is_published = 1'
    ).bind(id).first();
  } catch {}

  if (!notice) {
    return c.render(
      <section class="section-lg bg-mesh text-center">
        <div class="max-w-2xl mx-auto px-5 py-20">
          <i class="fa-solid fa-circle-exclamation text-4xl text-gray-300 mb-4"></i>
          <h1 class="text-xl font-bold text-gray-900 mb-2">공지사항을 찾을 수 없습니다</h1>
          <p class="text-gray-400 mb-6">삭제되었거나 비공개 처리된 공지입니다.</p>
          <a href="/notices" class="btn-premium btn-premium-fill">목록으로 돌아가기</a>
        </div>
      </section>,
      { title: '공지사항 | 서울365치과' }
    )
  }

  // Simple content rendering: preserve line breaks
  const contentHtml = notice.content
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/\n/g, '<br/>');

  return c.render(
    <>
      <section class="treatment-hero">
        <div class="relative z-10 max-w-[1400px] mx-auto px-5 md:px-8 py-28 md:py-36">
          <h1 class="text-2xl md:text-3xl font-bold text-white mb-4 reveal" style="transition-delay:0.3s">{notice.title}</h1>
          <div class="flex items-center gap-3 text-white/35 text-sm reveal" style="transition-delay:0.5s">
            <span class="bg-white/10 px-2.5 py-0.5 rounded-full text-xs font-bold">{notice.category}</span>
            <span><i class="fa-regular fa-calendar mr-1"></i>{notice.created_at?.slice(0, 10)}</span>
            <span><i class="fa-regular fa-eye mr-1"></i>{notice.view_count}</span>
          </div>
        </div>
      </section>

      <section class="section-lg bg-mesh">
        <div class="max-w-3xl mx-auto px-5 md:px-8">
          <div class="premium-card p-8 md:p-10">
            {notice.image && (
              <div class="mb-6 rounded-2xl overflow-hidden">
                <img src={notice.image} alt={notice.title} class="w-full rounded-2xl" loading="lazy" />
              </div>
            )}
            <div class="text-gray-600 leading-relaxed text-[0.95rem]" dangerouslySetInnerHTML={{__html: contentHtml}}></div>
          </div>
          <div class="text-center mt-10">
            <a href="/notices" class="btn-premium btn-premium-outline" data-cursor-hover>
              <i class="fa-solid fa-list mr-1.5"></i>목록으로 돌아가기
            </a>
          </div>
        </div>
      </section>
    </>,
    {
      title: `${notice.title} | 서울365치과 공지사항`,
      description: `서울365치과 공지: ${notice.title}`,
      canonical: `https://seoul365dc.kr/notices/${notice.id}`,
    }
  )
})

// ─── 치과 백과사전 ────────────────────────────────────
pageRoutes.get('/encyclopedia', (c) => {
  return c.render(
    <>
      {/* Hero */}
      <section class="treatment-hero">
        <div class="relative z-10 max-w-[1400px] mx-auto px-5 md:px-8 py-28 md:py-36">
          <h1 class="section-headline text-white mb-4 reveal" style="transition-delay:0.4s">치과 백과사전</h1>
          <p class="text-white/50 text-lg reveal" style="transition-delay:0.6s">치과에서 자주 쓰이는 {totalTerms}개 핵심 용어를 쉽게 풀어드립니다.</p>
        </div>
      </section>

      {/* Category Index */}
      <section class="section-md bg-mesh">
        <div class="max-w-4xl mx-auto px-5 md:px-8">
          <div class="text-center mb-10 reveal">
            <span class="section-eyebrow text-[#0066FF] mb-3 block">CATEGORIES</span>
            <h2 class="section-sub-headline text-gray-900">총 {totalTerms}개 용어 · {terms.length}개 분야</h2>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 stagger-children">
            {terms.map((cat, i) => (
              <a href={`#cat-${i}`} class="glass-card px-4 py-3 flex items-center justify-between hover:border-[#0066FF]/30 transition-all group" data-cursor-hover>
                <span class="font-medium text-gray-700 group-hover:text-[#0066FF] transition-colors text-[0.85rem]">{cat.cat}</span>
                <span class="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{cat.items.length}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Dictionary Body */}
      <section class="section-lg bg-white">
        <div class="max-w-4xl mx-auto px-5 md:px-8">
          {terms.map((cat, ci) => (
            <article id={`cat-${ci}`} class="scroll-mt-24 mb-16 reveal">
              <h3 class="flex items-center gap-3 mb-6 pb-4 border-b-2 border-[#0066FF]/10">
                <span class="text-xs font-bold text-[#0066FF] bg-[#0066FF]/5 px-3 py-1 rounded-full">{cat.cat}</span>
                <span class="text-xs text-gray-400 font-normal">{cat.items.length}개 용어</span>
              </h3>
              <dl class="space-y-5">
                {cat.items.map((item) => (
                  <div class="group">
                    <dt class="flex items-baseline gap-2 mb-1.5">
                      <h4 class="font-bold text-gray-900 text-[0.95rem] m-0">{item.term}</h4>
                      <span class="text-xs text-[#0066FF]/60 font-medium">{item.en}</span>
                    </dt>
                    <dd class="text-gray-600 text-[0.85rem] leading-[1.9] pl-0">
                      {item.def}
                      {item.link && (
                        <a href={item.link} class="inline-flex items-center gap-1 ml-2 text-xs text-[#0066FF] hover:underline">
                          자세히 보기 <i class="fa-solid fa-arrow-right text-[0.6rem]"></i>
                        </a>
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </article>
          ))}
        </div>
      </section>

      {/* Disclaimer + CTA */}
      <section class="section-md bg-mesh">
        <div class="max-w-3xl mx-auto px-5 md:px-8 text-center reveal">
          <p class="text-gray-300 text-xs mb-10">※ 본 백과사전은 일반적인 치과 정보 제공 목적이며, 정확한 진단과 치료 계획은 반드시 전문의와의 상담을 통해 결정하셔야 합니다.</p>
          <a href="/treatments" class="btn-premium btn-premium-outline" data-cursor-hover>
            <i class="fa-solid fa-arrow-left text-xs"></i> 전체 진료 안내로 돌아가기
          </a>
        </div>
      </section>

      {/* CTA */}
      <section class="cta-dark section-md">
        <div class="relative z-10 max-w-4xl mx-auto px-5 md:px-8 text-center reveal-blur">
          <h2 class="text-2xl md:text-3xl font-bold text-white mb-4">궁금한 점이 있으신가요?</h2>
          <p class="text-white/35 mb-8">서울대 출신 5인 전문의가 직접 상담해 드립니다.</p>
          <div class="flex flex-wrap justify-center gap-3">
            <a href={CLINIC.phoneTel} class="btn-premium btn-premium-white" data-cursor-hover><i class="fa-solid fa-phone"></i> 전화 상담</a>
            <a href="/reservation" class="btn-premium btn-premium-fill" data-cursor-hover><i class="fa-solid fa-calendar-check"></i> 예약하기</a>
          </div>
        </div>
      </section>
    </>,
    {
      title: '치과 백과사전 | 서울365치과 — 치과 용어 사전',
      description: `치과에서 자주 쓰이는 ${totalTerms}개 핵심 용어를 쉽게 풀어드립니다. 임플란트, 교정, 충치, 신경치료, 심미, 수면진료, 잇몸치료 등 치과 용어 사전. 서울365치과.`,
      canonical: 'https://seoul365dc.kr/encyclopedia',
      jsonLd: [
        {
          "@context": "https://schema.org", "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "홈", "item": "https://seoul365dc.kr" },
            { "@type": "ListItem", "position": 2, "name": "진료 안내", "item": "https://seoul365dc.kr/treatments" },
            { "@type": "ListItem", "position": 3, "name": "치과 백과사전", "item": "https://seoul365dc.kr/encyclopedia" }
          ]
        },
        {
          "@context": "https://schema.org",
          "@type": "MedicalWebPage",
          "name": "치과 백과사전",
          "description": `치과에서 자주 쓰이는 ${totalTerms}개 핵심 용어를 쉽게 풀어드립니다.`,
          "url": "https://seoul365dc.kr/encyclopedia",
          "isPartOf": { "@id": "https://seoul365dc.kr/#website" },
          "about": { "@id": "https://seoul365dc.kr/#dentist" },
          "specialty": "Dentistry",
          "inLanguage": "ko-KR",
          "lastReviewed": new Date().toISOString().split('T')[0],
          "reviewedBy": { "@type": "Physician", "name": "박준규", "worksFor": { "@id": "https://seoul365dc.kr/#dentist" } },
          "speakable": { "@type": "SpeakableSpecification", "cssSelector": ["h1", "h2", "h3", "dt"] },
          "mainEntity": {
            "@type": "DefinedTermSet",
            "name": "치과 용어 사전",
            "description": `치과 진료에서 자주 사용되는 ${totalTerms}개 핵심 용어를 12개 분야로 분류한 용어 사전입니다.`,
            "inLanguage": "ko-KR",
            "hasDefinedTerm": terms.flatMap(cat =>
              cat.items.slice(0, 5).map(item => ({
                "@type": "DefinedTerm",
                "name": item.term,
                "alternateName": item.en,
                "description": item.def,
                "inDefinedTermSet": "https://seoul365dc.kr/encyclopedia",
                ...(item.link ? { "url": `https://seoul365dc.kr${item.link}` } : {})
              }))
            )
          }
        }
      ]
    }
  )
})

export default pageRoutes
