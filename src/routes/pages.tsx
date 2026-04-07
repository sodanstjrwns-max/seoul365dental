import { Hono } from 'hono'
import type { Bindings } from '../lib/types'
import { CLINIC, HOURS } from '../data/clinic'
import { treatments } from '../data/treatments'
import { mainFaq, pricingData, pricingSummary, pricingCategories } from '../data/faq'
import { MESSAGING } from '../data/brand'
import { hashPassword, verifyPassword, generateSessionId, getSessionCookie, clearSessionCookie, getCurrentUser } from '../lib/auth'
import { initAdminTables } from '../lib/db'

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
      title: '상담 예약 | 서울365치과',
      description: '서울365치과 상담 예약. 전화(032-432-0365), 카카오톡, 네이버 예약. 365일·야간21시. 인천 구월동.',
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
        // Service — consultation service details
        {
          "@context": "https://schema.org",
          "@type": "Service",
          "name": "서울365치과 상담 서비스",
          "serviceType": "치과 상담",
          "provider": { "@id": "https://seoul365dc.kr/#dentist" },
          "areaServed": { "@type": "City", "name": "인천광역시" },
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
// FAQ
// ============================================================
pageRoutes.get('/faq', (c) => {
  const allFaq = [
    ...mainFaq,
    { q: '예약은 어떻게 하나요?', a: '전화(032-432-0365), 카카오톡, 네이버 예약 모두 가능합니다.' },
    { q: '응급 상황에 방문해도 되나요?', a: '네, 365일 진료하므로 갑작스러운 치통이나 외상 시 바로 내원하세요.' },
    { q: '분할 결제가 가능한가요?', a: '네, 카드 분할 결제가 가능합니다.' },
    { q: '첫 방문 시 무엇을 준비해야 하나요?', a: '신분증과 건강보험증을 지참해 주세요.' },
  ];

  return c.render(
    <>
      <section class="treatment-hero">
        <div class="relative z-10 max-w-[1400px] mx-auto px-5 md:px-8 py-28 md:py-36">
          <h1 class="section-headline text-white mb-4 reveal" style="transition-delay:0.3s">자주 묻는 질문</h1>
          <p class="hero-sub text-white/35 reveal" style="transition-delay:0.5s">궁금하신 점을 먼저 확인해 보세요.</p>
        </div>
      </section>

      <section class="section-lg bg-mesh">
        <div class="max-w-3xl mx-auto px-5 md:px-8">
          <h2 class="text-xl font-bold text-gray-900 mb-8 reveal">임플란트·교정·수면진료 궁금증 해결</h2>
          <div class="space-y-3 stagger-children">
            {allFaq.map(faq => (
              <div class="faq-item">
                <button class="faq-toggle w-full text-left px-6 py-5 flex items-center justify-between hover:bg-gray-50/50 transition-colors" data-cursor-hover>
                  <h3 class="font-semibold text-gray-800 text-[0.95rem] pr-4">{faq.q}</h3>
                  <i class="fa-solid fa-chevron-down text-gray-300 text-sm faq-icon flex-shrink-0"></i>
                </button>
                <div class="hidden px-6 pb-5">
                  <p class="text-gray-500 text-[0.9rem] leading-relaxed">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
          <div class="text-center mt-10 reveal">
            <p class="text-gray-400 mb-4">더 궁금하신 점이 있으신가요?</p>
            <a href="/reservation" class="btn-premium btn-premium-fill" data-cursor-hover>상담 예약하기</a>
          </div>
        </div>
      </section>
    </>,
    {
      title: 'FAQ | 서울365치과 자주 묻는 질문',
      description: '서울365치과 FAQ. 임플란트 비용, 수면진료, 교정 나이제한, 예약 방법, 365일 진료 안내. 032-432-0365',
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
          "mainEntity": allFaq.map(f => ({
            "@type": "Question",
            "name": f.q,
            "acceptedAnswer": { "@type": "Answer", "text": f.a }
          }))
        },
        // QAPage — alternative for AEO engines
        {
          "@context": "https://schema.org",
          "@type": "QAPage",
          "name": "서울365치과 자주 묻는 질문",
          "mainEntity": allFaq.map(f => ({
            "@type": "Question",
            "name": f.q,
            "answerCount": 1,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": f.a,
              "author": { "@type": "Organization", "name": "서울365치과의원" },
              "dateCreated": "2026-01-01",
              "upvoteCount": 10,
            }
          }))
        },
        // Speakable for FAQ page
        {
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "자주 묻는 질문 FAQ | 서울365치과",
          "url": "https://seoul365dc.kr/faq",
          "speakable": {
            "@type": "SpeakableSpecification",
            "cssSelector": ["h1", "h3[itemprop='name']", "p[itemprop='text']"]
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

  // Not logged in → show login prompt
  if (!user) {
    return c.render(
      <>
        <section class="treatment-hero">
          <div class="relative z-10 max-w-[1400px] mx-auto px-5 md:px-8 py-28 md:py-36">
            <h1 class="section-headline text-white mb-4 reveal" style="transition-delay:0.3s">치료 사례 Before &amp; After</h1>
            <p class="hero-sub text-white/35 reveal" style="transition-delay:0.5s">실제 치료 사례를 확인하시려면 로그인이 필요합니다.</p>
          </div>
        </section>

        <section class="section-lg bg-mesh">
          <div class="max-w-lg mx-auto px-5 md:px-8 text-center">
            <div class="premium-card p-10 reveal-3d">
              <div class="w-20 h-20 rounded-full bg-[#0066FF]/10 mx-auto mb-6 flex items-center justify-center">
                <i class="fa-solid fa-lock text-3xl text-[#0066FF]/50"></i>
              </div>
              <h2 class="text-xl font-bold text-gray-900 mb-3">회원 전용 콘텐츠</h2>
              <p class="text-gray-500 text-[0.9rem] leading-relaxed mb-8">
                실제 치료 Before &amp; After 사례는<br/>
                회원 로그인 후 열람하실 수 있습니다.
              </p>
              <div class="flex flex-col sm:flex-row gap-3 justify-center">
                <a href="/login" class="btn-premium btn-premium-fill px-8 py-3.5" data-cursor-hover>
                  <i class="fa-solid fa-right-to-bracket"></i> 로그인
                </a>
                <a href="/register" class="btn-premium btn-premium-outline px-8 py-3.5" data-cursor-hover>
                  <i class="fa-solid fa-user-plus"></i> 회원가입
                </a>
              </div>
              <p class="text-xs text-gray-300 mt-6">가입은 30초면 충분합니다.</p>
            </div>
          </div>
        </section>
      </>,
      {
        title: '치료 사례 | 서울365치과 Before & After',
        description: '서울365치과 치료 사례. 회원 로그인 후 열람 가능합니다.',
        canonical: 'https://seoul365dc.kr/cases/gallery',
      }
    )
  }

  // Fetch published cases from DB
  let dbCases: any[] = [];
  try {
    await initAdminTables(c.env.DB);
    const result = await c.env.DB.prepare('SELECT * FROM before_after_cases WHERE is_published = 1 ORDER BY sort_order DESC, created_at DESC').all();
    dbCases = result.results || [];
  } catch {}

  // Logged in → show gallery
  return c.render(
    <>
      <section class="treatment-hero">
        <div class="relative z-10 max-w-[1400px] mx-auto px-5 md:px-8 py-28 md:py-36">
          <h1 class="section-headline text-white mb-4 reveal" style="transition-delay:0.3s">치료 사례 Before &amp; After</h1>
          <p class="hero-sub text-white/35 reveal" style="transition-delay:0.5s">실제 치료 사례로 결과를 확인하세요.</p>
        </div>
      </section>

      <section class="section-lg bg-mesh">
        <div class="max-w-[1400px] mx-auto px-5 md:px-8">
          <div class="flex items-center justify-between mb-8 reveal">
            <p class="text-sm text-gray-400"><i class="fa-solid fa-user-check text-[#0066FF] mr-1.5"></i> <span class="font-medium text-gray-600">{user.name}</span>님, 환영합니다.</p>
          </div>

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
                  <div class="premium-card overflow-hidden tilt-card electric-card-border case-card cursor-pointer group" data-tag={cs.tag} onclick={`openCaseModal(${idx})`}>
                    <div class="aspect-[4/3] bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center relative overflow-hidden">
                      {cs.before_image && cs.after_image ? (
                        <div class="absolute inset-0 flex ba-slider" data-id={cs.id}>
                          <div class="w-1/2 overflow-hidden border-r-2 border-white relative">
                            <img src={cs.before_image} alt="Before" class="absolute inset-0 w-full h-full object-cover" style="max-width:none;width:200%" />
                            <span class="absolute top-3 left-3 text-[0.6rem] font-bold tracking-widest uppercase text-white bg-black/40 px-2 py-0.5 rounded">Before</span>
                          </div>
                          <div class="w-1/2 overflow-hidden relative">
                            <img src={cs.after_image} alt="After" class="absolute inset-0 w-full h-full object-cover" style="max-width:none;width:200%;margin-left:-100%" />
                            <span class="absolute top-3 right-3 text-[0.6rem] font-bold tracking-widest uppercase text-white bg-[#0066FF]/70 px-2 py-0.5 rounded">After</span>
                          </div>
                        </div>
                      ) : (
                        <div class="absolute inset-0 flex">
                          <div class="w-1/2 flex items-center justify-center bg-gray-100/80 border-r border-gray-200/50">
                            {cs.before_image ? <img src={cs.before_image} alt="Before" class="w-full h-full object-cover" /> : <span class="text-gray-300 text-sm font-bold tracking-widest uppercase">Before</span>}
                          </div>
                          <div class="w-1/2 flex items-center justify-center bg-gradient-to-br from-[#0066FF]/5 to-[#00E5FF]/[0.02]">
                            {cs.after_image ? <img src={cs.after_image} alt="After" class="w-full h-full object-cover" /> : <span class="text-[#0066FF]/30 text-sm font-bold tracking-widest uppercase">After</span>}
                          </div>
                        </div>
                      )}
                      {/* Hover overlay */}
                      <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                        <div class="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 backdrop-blur-sm rounded-full w-12 h-12 flex items-center justify-center shadow-lg">
                          <i class="fa-solid fa-expand text-[#0066FF] text-lg"></i>
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
      'SELECT id, title, content, category, is_pinned, view_count, created_at FROM notices WHERE id = ? AND is_published = 1'
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
  const terms = [
    { cat: '임플란트', items: [
      { term: '임플란트', en: 'Dental Implant', def: '상실된 치아를 대체하는 인공 치아. 티타늄 픽스쳐(인공 치근)를 잇몸뼈에 식립하고, 지대주와 크라운을 연결하는 3단계 구조입니다.', link: '/treatments/implant' },
      { term: '픽스쳐', en: 'Fixture', def: '잇몸뼈에 심는 나사 모양의 티타늄 인공 치근. 뼈와 결합(골유착)하여 보철물을 지지하는 기둥 역할을 합니다.' },
      { term: '골유착', en: 'Osseointegration', def: '티타늄 픽스쳐와 잇몸뼈가 결합하는 과정. 통상 2~6개월 소요되며, 임플란트 성공의 핵심 단계입니다.' },
      { term: '어버트먼트', en: 'Abutment', def: '픽스쳐와 크라운을 연결하는 중간 구조물(지대주). 각도와 높이를 조절하여 보철물이 자연스럽게 안착하도록 합니다.' },
      { term: '전체임플란트', en: 'Full-Arch Implant', def: '위턱 또는 아래턱 전체를 한 번에 회복하는 시술. All-on-4, All-on-6 공법으로 최소 4~6개 픽스쳐로 전악을 지지합니다.', link: '/treatments/full-implant' },
      { term: 'All-on-4', en: 'All-on-4', def: '4개의 임플란트로 전악 보철을 지지하는 공법. 후방 픽스쳐를 경사 식립하여 골이식 없이 진행할 수 있습니다.' },
      { term: '즉시로딩', en: 'Immediate Loading', def: '임플란트 수술 당일 임시 보철을 장착하여 저작 기능을 즉시 회복하는 기술. MUA(Multi-Unit Abutment)를 사용합니다.' },
      { term: 'MUA', en: 'Multi-Unit Abutment', def: '즉시로딩 시 사용하는 특수 지대주. 여러 임플란트를 하나의 보철물로 연결할 때 각도를 보정합니다.' },
      { term: '네비게이션 임플란트', en: 'Guided Surgery', def: 'CBCT 데이터로 3D 가이드를 제작해 최소 절개·최소 출혈로 식립하는 디지털 수술법입니다.' },
      { term: 'GBR', en: 'Guided Bone Regeneration', def: '골이식술. 잇몸뼈가 부족한 부위에 골이식재와 차폐막을 사용하여 뼈를 재생시키는 시술입니다.' },
      { term: '상악동거상술', en: 'Sinus Lift', def: '윗턱 어금니 부위의 뼈가 부족할 때 상악동(코 옆 빈 공간) 바닥을 들어 올려 골이식하는 수술입니다.' },
      { term: 'CBCT', en: 'Cone Beam CT', def: '치과 전용 3차원 콘빔 컴퓨터 단층촬영. 일반 X-ray보다 정밀하게 뼈의 양과 신경 위치를 파악합니다.' },
    ]},
    { cat: '교정', items: [
      { term: '부정교합', en: 'Malocclusion', def: '윗니와 아랫니가 올바르게 맞물리지 않는 상태. 1급·2급·3급으로 분류하며, 심미성과 저작 기능 모두에 영향을 줍니다.', link: '/treatments/orthodontics' },
      { term: '인비절라인', en: 'Invisalign', def: 'SmartTrack 소재의 투명 얼라이너를 2주마다 교체하며 치아를 이동시키는 교정법. 탈착 가능하여 식사·칫솔질이 자유롭습니다.', link: '/treatments/invisalign' },
      { term: '클리피씨', en: 'Clippy-C', def: '자가결찰 세라믹 브래킷. 치아색과 유사하여 심미적이며, 마찰력이 낮아 치아 이동이 효율적입니다.' },
      { term: 'ClinCheck', en: 'ClinCheck', def: '인비절라인 전용 3D 시뮬레이션 소프트웨어. 교정 시작 전 치아 이동 과정과 최종 결과를 미리 확인할 수 있습니다.' },
      { term: 'iTero', en: 'iTero Scanner', def: '디지털 구강 스캐너. 인상재(본뜨기) 없이 구강 내부를 3D 스캔하여 정밀한 교정 계획을 수립합니다.' },
      { term: '혼합치열기', en: 'Mixed Dentition', def: '유치와 영구치가 함께 존재하는 만 7~12세 시기. 소아교정의 최적 개입 시기입니다.', link: '/treatments/pediatric' },
      { term: '유지장치', en: 'Retainer', def: '교정 완료 후 치아가 원래 위치로 돌아가지 않도록 고정하는 장치. 고정식과 가철식이 있습니다.' },
    ]},
    { cat: '보존·근관', items: [
      { term: '충치', en: 'Dental Caries', def: '구강 세균이 당분을 분해하면서 생성한 산(酸)에 의해 치아 경조직이 파괴되는 질환. 법랑질→상아질→치수 순으로 진행됩니다.', link: '/treatments/cavity' },
      { term: '레진', en: 'Composite Resin', def: '치아색 복합 레진으로 충치 부위를 수복하는 재료. 심미적이고, 소범위 충치에 가장 많이 사용됩니다.', link: '/treatments/resin' },
      { term: '인레이', en: 'Inlay', def: '충치 범위가 넓을 때 본을 떠서 맞춤 제작하는 수복물. 치아 교두(꼭대기) 안쪽만 채우면 인레이, 교두까지 덮으면 온레이입니다.', link: '/treatments/inlay' },
      { term: '크라운', en: 'Crown', def: '치아 전체를 감싸는 보철물. 신경치료 후나 치질이 많이 손상된 치아를 보호하며, 지르코니아·세라믹·PFM 소재가 있습니다.', link: '/treatments/crown' },
      { term: '신경치료', en: 'Root Canal Treatment', def: '치수(신경·혈관)가 감염·괴사된 경우 감염 조직을 제거하고 근관을 세척·충전하는 시술입니다.', link: '/treatments/root-canal' },
      { term: '재신경치료', en: 'Retreatment', def: '기존 신경치료가 불완전하거나 재감염된 경우 기존 충전물을 제거하고 다시 소독·충전하는 시술입니다.', link: '/treatments/retreatment' },
      { term: '치근단절제술', en: 'Apicoectomy', def: '신경치료로 해결되지 않는 치근 끝 염증을 외과적으로 절제하는 수술. 자연치아를 최대한 보존하기 위한 마지막 수단입니다.', link: '/treatments/apicoectomy' },
      { term: 'MTA', en: 'Mineral Trioxide Aggregate', def: '신경치료에 사용되는 생체 적합성 높은 충전 재료. 우수한 밀봉력과 항균성으로 치근단 수복에 활용됩니다.' },
      { term: '세렉', en: 'CEREC', def: 'CAD/CAM 기술로 구강스캔→설계→밀링을 당일 완료하는 시스템. 인레이·크라운을 하루 만에 장착할 수 있습니다.' },
    ]},
    { cat: '심미·미백', items: [
      { term: '라미네이트', en: 'Veneer', def: '치아 전면에 0.3~0.5mm 두께의 세라믹을 부착하여 색상·형태·간격을 개선하는 시술입니다.', link: '/treatments/cosmetic' },
      { term: '지르코니아', en: 'Zirconia', def: '고강도 세라믹 소재. 금속 없이도 높은 강도를 자랑하며, 자연치아와 유사한 색감을 구현합니다. 금속 알레르기 환자에게 적합합니다.' },
      { term: 'IPS e.max', en: 'IPS e.max', def: '리튬디실리케이트 소재의 고강도 세라믹. 투명도가 높아 앞니 보철과 라미네이트에 널리 사용됩니다.' },
      { term: '치아미백', en: 'Teeth Whitening', def: '과산화수소 또는 과산화요소로 법랑질 내 착색 물질을 분해하는 시술. 전문가 미백(In-office)과 자가 미백(Home)이 있습니다.', link: '/treatments/whitening' },
      { term: 'DSD', en: 'Digital Smile Design', def: '디지털 스마일 디자인. 시술 전 최종 결과를 3D로 시뮬레이션하여 환자와 함께 계획을 세우는 기술입니다.' },
    ]},
    { cat: '수면·마취', items: [
      { term: '수면진료', en: 'Conscious Sedation', def: '정맥 내 진정제를 투여하여 반의식 상태에서 치료하는 방법. 불안·공포를 느끼지 않고 치료 과정을 거의 기억하지 못합니다.', link: '/treatments/sedation' },
      { term: '치과 공포증', en: 'Dental Phobia', def: '치과 치료에 대한 극심한 두려움. 성인의 약 15~20%가 경험하며, 수면진료를 통해 편안한 치료가 가능합니다.' },
      { term: '무통마취', en: 'Painless Anesthesia', def: '컴퓨터 제어 마취기로 약액 주입 속도·압력을 정밀 조절하여 마취 시 통증을 최소화하는 기술입니다.' },
      { term: '프로포폴', en: 'Propofol', def: '수면진료에 사용되는 초단시간 작용 정맥마취제. 빠른 유도와 회복이 장점이며, 전문의 감시 하에 투여됩니다.' },
      { term: '산소포화도', en: 'SpO₂', def: '혈중 산소 농도 수치. 수면진료 중 펄스옥시미터로 실시간 모니터링하여 환자 안전을 확보합니다.' },
    ]},
    { cat: '잇몸·외과', items: [
      { term: '치주질환', en: 'Periodontal Disease', def: '치태·치석에 의해 잇몸 조직과 잇몸뼈가 파괴되는 질환. 치은염(초기)과 치주염(진행)으로 구분됩니다.', link: '/treatments/gum-treatment' },
      { term: '스케일링', en: 'Scaling', def: '치석과 치태를 제거하는 잇몸 건강 기본 치료. 연 1회 건강보험 적용이 됩니다.', link: '/treatments/scaling' },
      { term: 'SRP', en: 'Scaling & Root Planing', def: '치근활택술. 잇몸 아래 치석까지 제거하고 치근 표면을 매끈하게 다듬어 세균 부착을 방지합니다.' },
      { term: '사랑니', en: 'Wisdom Tooth', def: '제3대구치. 매복(뼈 속에 묻힘)되어 주변 치아에 충치·염증을 유발할 수 있어 예방적 발치가 권장됩니다.', link: '/treatments/wisdom-tooth' },
      { term: '매복치', en: 'Impacted Tooth', def: '잇몸이나 뼈 속에 완전히 또는 부분적으로 묻혀 정상 맹출하지 못한 치아. 수평 매복이 가장 흔합니다.' },
      { term: '하치조신경', en: 'Inferior Alveolar Nerve', def: '아래턱을 지나는 감각 신경. 사랑니 발치·임플란트 시 손상을 피하기 위해 CBCT로 사전 확인합니다.' },
      { term: '턱관절 장애', en: 'TMD', def: '악관절 디스크 변위, 근막통증 등으로 인한 개구 장애·관절음·안면 통증. 스플린트, 물리치료 등으로 관리합니다.', link: '/treatments/tmj' },
      { term: '이갈이', en: 'Bruxism', def: '수면 중 또는 주간에 무의식적으로 이를 가는 습관. 치아 마모, 턱관절 통증을 유발하며, 나이트가드로 보호합니다.', link: '/treatments/bruxism' },
      { term: '나이트가드', en: 'Night Guard', def: '이갈이·이 악물기 방지용 맞춤형 구강 보호 장치. 취침 시 착용하여 치아와 턱관절을 보호합니다.' },
    ]},
    { cat: '보철', items: [
      { term: '브릿지', en: 'Bridge', def: '빠진 치아 양옆의 건강한 치아를 기둥으로 삼아 인공 치아를 연결하는 고정식 보철물입니다.', link: '/treatments/bridge' },
      { term: 'PFM', en: 'Porcelain Fused to Metal', def: '금속 위에 도자기(포세린)를 소성한 크라운. 강도와 심미성을 겸비하지만 금속 비침이 있을 수 있습니다.' },
      { term: '틀니', en: 'Denture', def: '다수의 치아를 상실한 경우 사용하는 가철식(탈착식) 보철물. 전체 틀니와 부분 틀니로 나뉩니다.' },
    ]},
    { cat: '예방·기타', items: [
      { term: '불소도포', en: 'Fluoride Application', def: '치아 표면에 고농도 불소를 도포하여 법랑질을 강화하고 충치를 예방하는 시술. 소아에게 특히 효과적입니다.', link: '/treatments/prevention' },
      { term: '실란트', en: 'Sealant', def: '어금니 씹는 면의 홈(소와·열구)을 레진으로 메워 충치를 예방하는 시술. 영구 어금니 맹출 후 즉시 적용이 권장됩니다.' },
      { term: '파노라마', en: 'Panoramic X-ray', def: '턱 전체를 한 장에 촬영하는 치과 기본 방사선 사진. 전반적인 치아·뼈 상태를 한눈에 파악합니다.' },
      { term: '치태', en: 'Plaque', def: '치아 표면에 형성되는 세균막. 양치질로 제거하지 않으면 48시간 내 치석으로 석회화됩니다.' },
      { term: '치석', en: 'Calculus', def: '치태가 석회화(굳어진 것)된 것. 칫솔로는 제거 불가하며, 스케일링으로만 제거할 수 있습니다.' },
    ]},
  ]

  const totalTerms = terms.reduce((sum, cat) => sum + cat.items.length, 0)

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
            <div id={`cat-${ci}`} class="scroll-mt-24 mb-16 reveal">
              <div class="flex items-center gap-3 mb-6 pb-4 border-b-2 border-[#0066FF]/10">
                <span class="text-xs font-bold text-[#0066FF] bg-[#0066FF]/5 px-3 py-1 rounded-full">{cat.cat}</span>
                <span class="text-xs text-gray-400">{cat.items.length}개 용어</span>
              </div>
              <dl class="space-y-5">
                {cat.items.map((item) => (
                  <div class="group">
                    <dt class="flex items-baseline gap-2 mb-1.5">
                      <span class="font-bold text-gray-900 text-[0.95rem]">{item.term}</span>
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
            </div>
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
          "speakable": { "@type": "SpeakableSpecification", "cssSelector": ["h1", "h2", "dt"] }
        }
      ]
    }
  )
})

export default pageRoutes
