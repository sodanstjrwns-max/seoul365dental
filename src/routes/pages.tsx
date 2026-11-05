import { Hono } from 'hono'
import { HubA } from '../lib/hub-links'
import { CONTENT_DATES } from '../lib/content-dates'
import type { Bindings } from '../lib/types'
import { CLINIC, HOURS } from '../data/clinic'
import { treatments } from '../data/treatments'
import { mainFaq, pricingData, pricingSummary, pricingCategories } from '../data/faq'
import { MESSAGING } from '../data/brand'
import { hashPassword, verifyPassword, generateSessionId, getSessionCookie, clearSessionCookie, getCurrentUser } from '../lib/auth'
import { initAdminTables, initBlogTables } from '../lib/db'
import { getTreatmentBySlug } from '../data/treatments'
import { terms, totalTerms, flatTerms, getTermBySlug, getRelatedTerms, TERM_REDIRECTS } from '../data/encyclopedia-terms'
import { isThinTerm, isThinCase, NOINDEX_FOLLOW } from '../lib/thin-content'
import { isoKst, kstYmd, doctorByName, LEAD_DOCTOR, physicianRef } from '../lib/column-seo'
import { Icon, NaverMark, KakaoMark } from '../lib/icons'

const pageRoutes = new Hono<{ Bindings: Bindings }>()

pageRoutes.get('/reservation', (c) => {
  return c.render(
    <>
      <section class="phead" aria-labelledby="rs-h1">
        <div class="wrap phead-in">
          <div class="phead-text">
            <nav class="crumb" aria-label="현재 위치"><ol><li><a href="/">홈</a></li><li aria-current="page">상담 예약</li></ol></nav>
            <p class="eyebrow">Reservation</p>
            <h1 id="rs-h1" class="display-xl">상담 예약하기</h1>
            <p class="lead hero-sub">편하신 방법으로 상담 예약해 주세요.</p>
            <div class="phead-cta">
              <a href={CLINIC.phoneTel} class="btn btn-primary mono"><Icon name="phone" />{CLINIC.phone}</a>
              <a href={CLINIC.naverBooking} target="_blank" rel="noopener noreferrer nofollow" class="btn btn-naver"><NaverMark size={15} />네이버 예약</a>
            </div>
          </div>
          <div class="phead-aside">
            <div class="fact-card">
              <p class="eyebrow">진료시간</p>
              <dl class="fact-rows">
                {HOURS.map(h => <div><dt>{h.day}</dt><dd class="mono">{h.time}</dd></div>)}
              </dl>
              <p class="fine" style="margin:.8rem 0 0;color:var(--sky)">점심시간 없이 연속 진료 · 365일 진료</p>
            </div>
          </div>
        </div>
      </section>

      <section class="sec">
        <div class="wrap resv-grid">
          {/* Quick CTAs */}
          <div class="resv-side" data-rv-group>
            <a href={CLINIC.phoneTel} class="card contact-card hover">
              <span class="ci phone"><Icon name="phone" /></span>
              <div><h2>전화 상담</h2><p class="big mono">{CLINIC.phone}</p><p class="fine">가장 빠른 상담 방법</p></div>
              <Icon name="arrow" />
            </a>
            <a href={CLINIC.kakao} target="_blank" rel="noopener noreferrer nofollow" class="card contact-card hover">
              <span class="ci kakao"><KakaoMark size={22} /></span>
              <div><h2>카카오톡 상담</h2><p class="big">채팅으로 편하게</p><p class="fine">사진/영상 전송 가능</p></div>
              <Icon name="arrowUpRight" />
            </a>
            <a href={CLINIC.naverBooking} target="_blank" rel="noopener noreferrer nofollow" class="card contact-card hover">
              <span class="ci naver"><NaverMark size={18} /></span>
              <div><h2>네이버 예약</h2><p class="big">온라인 간편 예약</p><p class="fine">원하는 시간 선택</p></div>
              <Icon name="arrowUpRight" />
            </a>
            <div class="card" style="padding:1.2rem 1.3rem">
              <p class="box-h" style="margin-bottom:.5rem">오시는 길</p>
              <p style="margin:0;font-size:.95rem;color:var(--ink)">{CLINIC.address}</p>
              <p class="fine" style="margin:.2rem 0 .8rem">{CLINIC.nearStation}</p>
              <a href="/info" class="arrow-link" style="font-size:.9rem">지도·주차 안내<Icon name="arrow" /></a>
            </div>
          </div>

          {/* Form */}
          <div class="card form-card" data-rv>
            <h2>온라인 상담 신청</h2>
            <form id="consultForm" class="form">
              <div class="row2">
                <div class="field">
                  <label for="rs-name">이름 *</label>
                  <input id="rs-name" type="text" name="name" required placeholder="이름을 입력해주세요" autocomplete="name" />
                </div>
                <div class="field">
                  <label for="rs-phone">연락처 *</label>
                  <input id="rs-phone" type="tel" name="phone" required placeholder="010-0000-0000" autocomplete="tel" />
                </div>
              </div>
              <div class="field">
                <label for="rs-treatment">관심 치료</label>
                <select id="rs-treatment" name="treatment">
                  <option value="">선택해주세요</option>
                  <option>전체임플란트</option><option>디지털풀아치 임플란트</option><option>일반 임플란트</option>
                  <option>치아교정</option><option>인비절라인</option><option>수면진료</option>
                  <option>심미치료</option><option>충치/신경치료</option><option>기타</option>
                </select>
              </div>
              <div class="field">
                <label for="rs-message">상담 내용</label>
                <textarea id="rs-message" name="message" rows={4} placeholder="궁금하신 내용을 자유롭게 적어주세요"></textarea>
              </div>
              <label class="agree" for="privacy-agree">
                <input type="checkbox" required id="privacy-agree" />
                <span><a href="/privacy">개인정보처리방침</a>에 동의합니다 *</span>
              </label>
              <button type="submit" id="consultSubmitBtn" class="btn btn-primary btn-lg btn-block">상담 신청하기</button>
              <div id="consultResult" class="hidden text-center text-sm py-3 rounded-xl"></div>
            </form>
            <p class="fine" style="margin-top:1.2rem;text-align:center">
              이미 문의하셨나요? <a href="/consultations/check" style="color:var(--blue);font-weight:600;text-decoration:underline;text-underline-offset:3px">문의 답변 확인</a> — 접수번호 또는 이름+전화번호로 병원 답변을 확인하실 수 있습니다.
            </p>
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
                  var code = data.code ? String(data.code).replace(/[^A-Z0-9]/g, '') : '';
                  result.innerHTML = '<i class="fa-solid fa-circle-check mr-1.5"></i>상담 신청이 완료되었습니다. 빠른 시일 내에 연락드리겠습니다!'
                    + (code ? '<div class="mt-3 pt-3 border-t border-emerald-200 text-emerald-800"><span class="font-extrabold tracking-widest text-base">접수번호 ' + code + '</span> — 답변은 <a href="/consultations/check?code=' + code + '" class="font-bold underline underline-offset-2">\u2018문의 답변 확인\u2019 페이지</a>에서 접수번호 또는 전화번호로 확인하실 수 있습니다.</div>' : '');
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
          "object": { "@id": "https://seoul365dc.kr/#dentist" }
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
          "object": { "@id": "https://seoul365dc.kr/#dentist" },
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
  const DIRECTIONS = [
    { title: '주소', main: CLINIC.address, sub: '(우) 21556' },
    { title: '지하철', main: '인천 1호선 예술회관역 5번 출구', sub: '도보 약 3분 (250m)' },
    { title: '주차', main: '이토타워 건물 내 주차장 이용', sub: '진료 시 주차 지원 가능' },
    { title: '버스', main: '예술회관역 정류장 하차', sub: '다수 시내버스 이용 가능' },
  ];
  return c.render(
    <>
      <section class="phead" aria-labelledby="info-h1">
        <div class="wrap phead-in">
          <div class="phead-text">
            <nav class="crumb" aria-label="현재 위치"><ol><li><a href="/">홈</a></li><li aria-current="page">내원안내</li></ol></nav>
            <p class="eyebrow">Visit · Pricing</p>
            <h1 id="info-h1" class="display-xl">내원 안내</h1>
            <p class="lead hero-sub">진료 비용과 찾아오시는 방법을 안내드립니다.</p>
            <p class="t-mute" style="font-size:.95rem;margin:0 0 1.6rem">{CLINIC.address} · {CLINIC.nearStation}</p>
            <div class="phead-cta">
              <a href={CLINIC.phoneTel} class="btn btn-primary mono"><Icon name="phone" />{CLINIC.phone}</a>
              <a href="/reservation" class="btn btn-light"><Icon name="calendar" />상담 예약</a>
            </div>
          </div>
          <div class="phead-aside">
            <div class="fact-card">
              <p class="eyebrow">진료시간</p>
              <dl class="fact-rows">
                {HOURS.map(h => <div><dt>{h.day}</dt><dd class="mono">{h.time}</dd></div>)}
              </dl>
              <p class="fine" style="margin:.8rem 0 0;color:var(--sky)">점심시간 없이 연속 진료 · 공휴일은 일요일과 같습니다</p>
            </div>
          </div>
        </div>
      </section>

      {/* Tab Switcher */}
      <div class="info-tabs" id="infoTabs">
        <div class="wrap-n">
          <button onclick="switchInfoTab('directions')" id="tab-directions" class="info-tab active" type="button"><Icon name="pin" />오시는 길</button>
          <button onclick="switchInfoTab('pricing')" id="tab-pricing" class="info-tab" type="button"><Icon name="news" />비용 안내</button>
        </div>
      </div>

      {/* === PRICING TAB === */}
      <section id="panel-pricing" class="sec" style="display:none">
        <div class="wrap-n">
          <h2 class="sr-only">서울365치과 진료비용 안내</h2>
          <div class="area-chips" style="justify-content:center;margin-bottom:2.2rem">
            {pricingCategories.map(cat => <a href={`#pricing-${cat.key}`}>{cat.label}</a>)}
          </div>
          {pricingCategories.map(cat => {
            const items = pricingData.filter(p => p.category === cat.key);
            if (items.length === 0) return null;
            return (
              <div id={`pricing-${cat.key}`} class="price-block">
                <div class="sec-head-row" style="margin-bottom:.9rem">
                  <h3 class="display-2" style="font-size:1.35rem">{cat.label}</h3>
                  <span class="mono t-mute" style="font-size:.78rem">{items.length}항목</span>
                </div>
                <table class="price-table">
                  <thead><tr><th scope="col">치료 항목</th><th scope="col" style="text-align:right">비용</th><th scope="col" style="text-align:right">보험</th></tr></thead>
                  <tbody>
                    {items.map(p => (
                      <tr>
                        <td>{p.treatment}{p.note && <span class="fine" style="margin-left:.4rem">({p.note})</span>}</td>
                        <td class="price">{p.price}</td>
                        <td class="ins">{p.insurance}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })}
          <div class="card" style="padding:1.2rem 1.4rem">
            <p style="margin:0 0 .25rem;font-size:.95rem;color:var(--ink)">위 가격은 참고용이며, 환자 상태에 따라 달라질 수 있습니다. 정확한 비용은 정밀 진단 후 안내드립니다.</p>
            <p class="fine" style="margin:0">카드 결제 및 분할 결제가 가능합니다.</p>
          </div>
          <p style="text-align:center;margin-top:2rem"><a href="/reservation" class="btn btn-primary">비용 상담 예약하기<Icon name="arrow" /></a></p>
        </div>
      </section>

      {/* === DIRECTIONS TAB (default visible) === */}
      <section id="panel-directions" class="sec">
        <div class="wrap-n">
          <h2 class="sr-only">서울365치과 오시는 길</h2>
          <div class="map-frame" data-rv>
            <iframe
              src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent('서울365치과의원 인천 남동구 예술로 138 이토타워')}&center=${CLINIC.geo.lat},${CLINIC.geo.lng}&zoom=16&language=ko`}
              width="100%" height="100%" allowfullscreen loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
              title="서울365치과 위치 - 인천 남동구 예술로 138 이토타워 2층">
            </iframe>
          </div>
          <div class="map-links" data-rv>
            <a href={`https://www.google.com/maps/search/?api=1&query=${CLINIC.geo.lat},${CLINIC.geo.lng}`} target="_blank" rel="noopener" class="btn btn-ghost btn-sm">Google Maps</a>
            <a href={`https://map.naver.com/p/search/${encodeURIComponent(CLINIC.address)}`} target="_blank" rel="noopener" class="btn btn-ghost btn-sm"><NaverMark size={13} />네이버 지도</a>
            <a href={`https://map.kakao.com/link/search/${encodeURIComponent(CLINIC.address)}`} target="_blank" rel="noopener" class="btn btn-ghost btn-sm"><Icon name="pin" />카카오맵</a>
          </div>
          <div class="dir-grid" data-rv-group>
            {DIRECTIONS.map(info => (
              <div class="card dir-card">
                <h3>{info.title}</h3>
                <p>{info.main}</p>
                <p class="fine">{info.sub}</p>
              </div>
            ))}
          </div>
          <p style="text-align:center;margin-top:2rem"><a href={CLINIC.phoneTel} class="btn btn-primary"><Icon name="phone" />전화 문의 {CLINIC.phone}</a></p>
        </div>
      </section>

      {/* Tab Switching Script */}
      <script dangerouslySetInnerHTML={{__html: `
        function switchInfoTab(tab) {
          document.querySelectorAll('.info-tab').forEach(function (b) { b.classList.remove('active'); });
          var active = document.getElementById('tab-' + tab);
          if (active) active.classList.add('active');
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
            { "@type": "HowToStep", "position": 1, "name": "지하철", "text": "인천 1호선 예술회관역 5번 출구로 나오세요." },
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
  // 카테고리 정의 (순서)
  const categories = [
    { key: 'all', label: '전체' },
    { key: 'general', label: '일반 안내', sub: '예약 · 진료시간 · 결제 · 주차' },
    { key: '전문센터', label: '전문센터', sub: '임플란트 · 교정 · 수면진료 · 소아 · 심미' },
    { key: '일반/보존', label: '보존치료', sub: '충치 · 레진 · 인레이 · 크라운 · 신경치료 · 미백' },
    { key: '잇몸/외과', label: '잇몸/외과', sub: '스케일링 · 잇몸 · 사랑니 · 턱관절 · 이갈이' },
    { key: '특수', label: '특수치료', sub: '임플란트재수술 · 브릿지 · 응급 · 예방' },
  ];
  const treatmentCatKeys = ['전문센터', '일반/보존', '잇몸/외과', '특수'];

  // 일반 안내 FAQ
  const generalFaq = [
    ...mainFaq,
    { q: '예약은 어떻게 하나요?', a: '전화(032-432-0365), 카카오톡, 네이버 예약 모두 가능합니다.' },
    { q: '응급 상황에 방문해도 되나요?', a: '네, 365일 진료하므로 갑작스러운 치통이나 외상 시 바로 내원하세요.' },
    { q: '분할 결제가 가능한가요?', a: '네, 카드 분할 결제가 가능합니다.' },
    { q: '첫 방문 시 무엇을 준비해야 하나요?', a: '신분증과 건강보험증을 지참해 주세요.' },
    { q: '위치가 어디인가요?', a: '인천 남동구 구월동 예술로 138 이토타워 2층입니다. 인천 1호선 예술회관역 5번 출구에서 약 250m, 도보 3분 거리입니다.' },
    { q: '진료 시간은 어떻게 되나요?', a: '월~목 10:00~21:00, 금요일 10:00~19:00, 토요일 10:00~14:00, 일요일·공휴일 14:00~18:00 (점심시간 없이 연속 진료).' },
  ];

  // 치료별 FAQ를 카테고리로 그룹핑
  const treatmentsByCategory: Record<string, typeof treatments> = {};
  for (const t of treatments) {
    if (!treatmentsByCategory[t.category]) treatmentsByCategory[t.category] = [];
    treatmentsByCategory[t.category].push(t);
  }
  const catCount = (key: string) => (treatmentsByCategory[key] || []).reduce((sum, t) => sum + t.faq.length, 0);

  // 전체 FAQ 수 계산
  const totalFaqCount = generalFaq.length + treatments.reduce((sum, t) => sum + t.faq.length, 0);

  // JSON-LD용: 일반 FAQ + 각 치료별 첫 2개씩 (SEO에 충분하되 페이지 크기 합리적으로)
  const allFaqFlat = [
    ...generalFaq,
    ...treatments.flatMap(t => t.faq.slice(0, 2)),
  ];

  const FaqItem = ({ q, a, cat, slug }: { q: string; a: string; cat: string; slug?: string }) => (
    <details class="fq faq-searchable" data-category={cat} data-treatment={slug}>
      <summary><h3>{q}</h3><span class="pm" aria-hidden="true"><Icon name="plus" /></span></summary>
      <div class="fq-a"><p>{a}</p></div>
    </details>
  );

  return c.render(
    <>
      <section class="phead" aria-labelledby="faq-h1">
        <div class="wrap phead-in">
          <div class="phead-text">
            <nav class="crumb" aria-label="현재 위치"><ol><li><a href="/">홈</a></li><li aria-current="page">FAQ</li></ol></nav>
            <p class="eyebrow">FAQ · {totalFaqCount}</p>
            <h1 id="faq-h1" class="display-xl">자주 묻는 질문</h1>
            <p class="lead hero-sub">25개 진료과목, {totalFaqCount}개의 FAQ를 한눈에 확인하세요.</p>
            <div class="phead-cta">
              <a href="/reservation" class="btn btn-primary"><Icon name="calendar" />상담 예약하기</a>
              <a href="tel:032-432-0365" class="btn btn-light mono"><Icon name="phone" />032-432-0365</a>
            </div>
          </div>
          <div class="phead-aside">
            <div class="fact-card">
              <p class="eyebrow">분류별 질문 수</p>
              <dl class="fact-rows">
                <div><dt>일반 안내</dt><dd class="mono">{generalFaq.length}</dd></div>
                {treatmentCatKeys.map(k => (
                  <div><dt>{categories.find(x => x.key === k)!.label}</dt><dd class="mono">{catCount(k)}</dd></div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* 검색 + 카테고리 탭 (고정) */}
      <div class="faq-bar">
        <div class="wrap-n">
          <div class="faq-search">
            <Icon name="search" />
            <input type="text" id="faq-search" placeholder="궁금한 내용을 검색하세요 (예: 임플란트 비용, 미백 통증, 사랑니...)" aria-label="FAQ 검색" autocomplete="off" />
            <button id="faq-search-clear" class="clear hidden" type="button" aria-label="검색어 지우기"><Icon name="close" /></button>
          </div>
          <div id="faq-search-count" class="faq-count hidden"></div>
          <div class="faq-tabs" id="faq-tabs">
            {categories.map((cat, i) => (
              <button class={`faq-tab${i === 0 ? ' active' : ''}`} data-tab={cat.key} type="button">{cat.label}</button>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ 본문 */}
      <section class="sec">
        <div class="wrap-n">
          {/* 일반 안내 섹션 */}
          <div class="faq-sec faq-category-section" data-category="general">
            <div class="faq-sec-head">
              <div><h2>일반 안내</h2><p>예약 · 진료시간 · 결제 · 주차</p></div>
              <span class="cnt">{generalFaq.length}개</span>
            </div>
            {generalFaq.map(faq => <FaqItem q={faq.q} a={faq.a} cat="general" />)}
          </div>

          {/* 카테고리별 치료 FAQ */}
          {treatmentCatKeys.map(catKey => {
            const catInfo = categories.find(c => c.key === catKey)!;
            const catTreatments = treatmentsByCategory[catKey] || [];
            return (
              <div class="faq-sec faq-category-section" data-category={catKey}>
                <div class="faq-sec-head">
                  <div><h2>{catInfo.label}</h2><p>{catInfo.sub}</p></div>
                  <span class="cnt">{catCount(catKey)}개</span>
                </div>
                {catTreatments.map(t => (
                  <div class="faq-group faq-treatment-group" data-treatment={t.slug} data-category={catKey}>
                    <div class="faq-group-head">
                      <h3>{t.name}</h3>
                      <span class="cnt">({t.faq.length})</span>
                      <a href={`/treatments/${t.slug}`} class="arrow-link">상세보기<Icon name="arrow" /></a>
                    </div>
                    {t.faq.map(faq => <FaqItem q={faq.q} a={faq.a} cat={catKey} slug={t.slug} />)}
                  </div>
                ))}
              </div>
            );
          })}

          {/* 검색 결과 없음 */}
          <div id="faq-no-results" class="no-results hidden">
            <Icon name="search" />
            <p>검색 결과가 없습니다</p>
            <p class="fine">다른 키워드로 검색해 보세요</p>
          </div>

          {/* 하단 CTA */}
          <div class="faq-foot" data-rv>
            <p>원하시는 답변을 찾지 못하셨나요?</p>
            <div class="cta-actions">
              <a href="/reservation" class="btn btn-primary"><Icon name="calendar" />상담 예약하기</a>
              <a href="tel:032-432-0365" class="btn btn-ghost mono"><Icon name="phone" />032-432-0365</a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ 검색/탭 스크립트 */}
      <script dangerouslySetInnerHTML={{ __html: `
        (function(){
          var searchInput = document.getElementById('faq-search');
          var searchClear = document.getElementById('faq-search-clear');
          var searchCount = document.getElementById('faq-search-count');
          var noResults = document.getElementById('faq-no-results');
          var tabs = document.querySelectorAll('.faq-tab');
          var sections = document.querySelectorAll('.faq-category-section');
          var items = document.querySelectorAll('.faq-searchable');
          var groups = document.querySelectorAll('.faq-treatment-group');
          var activeTab = 'all';

          tabs.forEach(function(tab){
            tab.addEventListener('click', function(){
              activeTab = this.dataset.tab;
              tabs.forEach(function(t){ t.classList.remove('active'); });
              this.classList.add('active');
              applyFilter();
            });
          });

          var debounce;
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
            searchInput.focus();
          });

          function applyFilter(){
            var query = searchInput.value.trim().toLowerCase();
            var isSearch = query.length > 0;
            var visibleCount = 0;

            items.forEach(function(item){
              var cat = item.dataset.category;
              var text = item.textContent.toLowerCase();
              var matchTab = activeTab === 'all' || cat === activeTab;
              var matchSearch = !isSearch || text.indexOf(query) !== -1;
              var show = matchTab && matchSearch;
              item.style.display = show ? '' : 'none';
              if (show) { visibleCount++; if (isSearch) item.open = true; }
            });

            sections.forEach(function(sec){
              var cat = sec.dataset.category;
              var matchTab = activeTab === 'all' || cat === activeTab;
              if (!matchTab) { sec.style.display = 'none'; return; }
              var hasVisible = sec.querySelectorAll('.faq-searchable:not([style*="display: none"])').length > 0;
              sec.style.display = hasVisible ? '' : 'none';
            });

            groups.forEach(function(g){
              var hasVisible = g.querySelectorAll('.faq-searchable:not([style*="display: none"])').length > 0;
              g.style.display = hasVisible ? '' : 'none';
            });

            if (isSearch) {
              searchCount.textContent = visibleCount + '개의 FAQ가 검색되었습니다';
              searchCount.classList.remove('hidden');
            } else {
              searchCount.classList.add('hidden');
            }

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
              <p class="text-sm text-gray-400"><i class="fa-solid fa-user-check text-[#1E4BD8] mr-1.5"></i> <span class="font-medium text-gray-600">{user!.name}</span>님, 환영합니다.</p>
            </div>
          ) : (
            <div class="flex items-center justify-between mb-8 reveal">
              <p class="text-sm text-gray-400"><i class="fa-solid fa-lock text-[#1E4BD8]/50 mr-1.5"></i> After 사진 열람은 <a href="/login" class="text-[#1E4BD8] font-semibold underline">로그인</a> 후 가능합니다.</p>
              <div class="flex gap-2">
                <a href="/login" class="text-xs px-3 py-1.5 rounded-lg bg-[#1E4BD8] text-white font-bold hover:bg-[#0052cc] transition">로그인</a>
                <a href="/register" class="text-xs px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 font-bold hover:bg-gray-200 transition">회원가입</a>
              </div>
            </div>
          )}

          {dbCases.length === 0 ? (
            <div class="text-center py-20">
              <div class="w-20 h-20 rounded-full bg-[#1E4BD8]/5 mx-auto mb-6 flex items-center justify-center">
                <i class="fa-solid fa-images text-3xl text-[#1E4BD8]/20"></i>
              </div>
              <h2 class="text-lg font-bold text-gray-900 mb-2">아직 등록된 사례가 없습니다</h2>
              <p class="text-gray-400 text-sm">곧 실제 치료 사례를 업로드할 예정입니다.</p>
            </div>
          ) : (
            <>
              {/* Filter Tabs */}
              <div class="flex flex-wrap gap-2 mb-8 reveal" id="caseFilters">
                <button onclick="filterCases('all')" class="case-filter-btn active px-4 py-2 rounded-full text-xs font-semibold bg-[#1E4BD8] text-white transition" data-filter="all">전체 ({dbCases.length})</button>
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
                          <i class={`fa-solid ${isLoggedIn ? 'fa-expand' : 'fa-lock'} text-[#1E4BD8] text-lg`}></i>
                        </div>
                      </div>
                    </div>
                    <div class="p-5">
                      <div class="flex items-center gap-2 mb-2">
                        <span class="text-[0.7rem] bg-[#1E4BD8]/8 text-[#1E4BD8] px-2.5 py-0.5 rounded-full font-semibold">{cs.tag}</span>
                        {cs.duration && <span class="text-[0.65rem] text-gray-400"><i class="fa-regular fa-clock mr-0.5"></i>{cs.duration}</span>}
                      </div>
                      <h3 class="font-bold text-gray-900 text-sm group-hover:text-[#1E4BD8] transition-colors">{cs.title}</h3>
                      {cs.description && <p class="text-gray-500 text-xs mt-1.5 line-clamp-2">{cs.description}</p>}
                      <p class="text-xs text-gray-400 mt-2">담당: {cs.doctor_name}{cs.patient_age ? ` · ${cs.patient_age}` : ''}{cs.patient_gender ? ` ${cs.patient_gender}` : ''}</p>
                      {/* SEO: Crawlable link to individual case page (hidden visually, discoverable by bots) */}
                      <a href={`/cases/${cs.id}`} class="text-[0.6rem] text-[#1E4BD8]/50 hover:text-[#1E4BD8] mt-2 inline-block" onclick="event.stopPropagation()">상세보기 →</a>
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
                <span id="modalTag" class="text-[0.7rem] bg-[#1E4BD8]/8 text-[#1E4BD8] px-2.5 py-0.5 rounded-full font-semibold"></span>
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
                  <span class="absolute top-3 right-3 text-[0.65rem] font-bold tracking-widest uppercase text-white bg-[#1E4BD8]/80 backdrop-blur-sm px-3 py-1 rounded-lg">After</span>
                </div>
              </div>
              {/* Info */}
              <h2 id="modalTitle" class="text-xl font-bold text-gray-900 mb-3"></h2>
              <p id="modalDesc" class="text-gray-600 text-sm leading-relaxed mb-4"></p>
              <div class="flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-500 bg-gray-50 rounded-xl px-5 py-4">
                <span id="modalDoctor"><i class="fa-solid fa-user-doctor text-[#1E4BD8]/60 mr-1.5"></i></span>
                <span id="modalPatient"><i class="fa-solid fa-user text-[#1E4BD8]/60 mr-1.5"></i></span>
                <span id="modalDur"><i class="fa-regular fa-clock text-[#1E4BD8]/60 mr-1.5"></i></span>
              </div>
              {/* CTA */}
              <div class="mt-6 text-center">
                <p class="text-gray-400 text-xs mb-3">비슷한 고민을 가지고 계신가요?</p>
                <a href="/reservation" class="inline-flex items-center gap-2 bg-[#1E4BD8] hover:bg-[#0052cc] text-white font-bold text-sm px-6 py-3 rounded-xl transition">
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
          document.getElementById('modalDoctor').innerHTML = '<i class="fa-solid fa-user-doctor text-[#1E4BD8]/60 mr-1.5"></i>담당: ' + c.doctor_name;
          document.getElementById('modalPatient').innerHTML = '<i class="fa-solid fa-user text-[#1E4BD8]/60 mr-1.5"></i>' + (c.patient_age || '') + ' ' + (c.patient_gender || '');
          document.getElementById('modalDur').innerHTML = '<i class="fa-regular fa-clock text-[#1E4BD8]/60 mr-1.5"></i>' + (c.duration || '-');
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
            b.classList.remove('bg-[#1E4BD8]', 'text-white', 'active');
            b.classList.add('bg-gray-100', 'text-gray-500');
          });
          const activeBtn = document.querySelector('[data-filter="'+tag+'"]');
          if (activeBtn) { activeBtn.classList.add('bg-[#1E4BD8]', 'text-white', 'active'); activeBtn.classList.remove('bg-gray-100', 'text-gray-500'); }
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
            <div class="w-16 h-16 rounded-full bg-[#1E4BD8]/10 mx-auto mb-5 flex items-center justify-center">
              <i class="fa-solid fa-lock text-2xl text-[#1E4BD8]/50"></i>
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
// CASES DETAIL PAGE — Individual case SEO pages (Google indexable)
// ============================================================
pageRoutes.get('/cases/:id', async (c) => {
  const id = c.req.param('id');
  try {
    await initAdminTables(c.env.DB);
    const cs = await c.env.DB.prepare('SELECT * FROM before_after_cases WHERE id = ? AND is_published = 1').bind(id).first<any>();
    if (!cs) return c.notFound();

    // Increment view count
    await c.env.DB.prepare('UPDATE before_after_cases SET view_count = view_count + 1 WHERE id = ?').bind(id).run();

    // Get related cases (same tag)
    let relatedCases: any[] = [];
    try {
      const r = await c.env.DB.prepare('SELECT id, title, tag, before_image, doctor_name, duration FROM before_after_cases WHERE is_published = 1 AND id != ? AND tag = ? ORDER BY sort_order DESC LIMIT 3').bind(id, cs.tag).all();
      relatedCases = r.results || [];
    } catch {}

    const linkedTreatment = cs.treatment_slug ? getTreatmentBySlug(cs.treatment_slug) : null;
    // 같은 진료 칼럼 (사례 ↔ 칼럼 내부 링크)
    let relatedPosts: any[] = [];
    if (cs.treatment_slug) {
      try {
        const rp = await c.env.DB.prepare('SELECT slug, title FROM blog_posts WHERE is_published = 1 AND treatment_slug = ? ORDER BY created_at DESC LIMIT 3').bind(cs.treatment_slug).all();
        relatedPosts = rp.results || [];
      } catch {}
    }
    const caseDate = cs.created_at?.split('T')[0] || cs.created_at?.split(' ')[0] || '';
    // 사례 사진은 AFTER 가 회원 전용(게이트)이라 og:image 는 사이트 기본 이미지 (의료법 — 2026-10-03 표준)
    const ogImg = 'https://seoul365dc.kr/static/og-image.png';
    const txName = linkedTreatment?.name || cs.tag || '치료';
    const caseTitle = `${cs.title}${cs.title.includes(txName) ? '' : ` — ${txName} 사례`}${cs.duration && !cs.title.includes(cs.duration) ? `, ${cs.duration}` : ''}`;
    // 자동 요약: 저장된 구조 필드(진료·분류·기간·담당)만 사용
    const caseDoc = doctorByName(cs.doctor_name);
    const caseSummary = [
      `${txName} 치료 사례입니다.`,
      cs.tag && cs.tag !== txName ? `분류: ${cs.tag}.` : '',
      cs.duration ? `치료 기간은 ${cs.duration}입니다.` : '',
      cs.doctor_name ? `담당 의료진: ${caseDoc ? `${caseDoc.name} ${caseDoc.title}` : cs.doctor_name}.` : '',
    ].filter(Boolean).join(' ');
    const caseDesc = `${cs.description ? cs.description.replace(/\s+/g, ' ').trim() + ' ' : ''}${caseSummary} 개인에 따라 결과가 다를 수 있습니다.`;
    const casePublished = isoKst(cs.created_at);
    const caseModified = isoKst(cs.updated_at || cs.created_at) || casePublished;
    const caseUrl = `https://seoul365dc.kr/cases/${id}`;

    // 얇은 치료사례(설명 300자 미만, AFTER는 회원 전용): noindex, follow + 사이트맵 제외 — 설명 보강 시 자동 복귀
    const thinCase = isThinCase(cs)
    if (thinCase) c.header('X-Robots-Tag', NOINDEX_FOLLOW)

    // Check if user is logged in (for after image display)
    const user = await getCurrentUser(c.env.DB, c.req.header('cookie'));
    const isLoggedIn = !!user;

    return c.render(
      <>
        <article class="pt-24 pb-16">

          <div class="max-w-4xl mx-auto px-5 md:px-8">
            {/* Breadcrumb navigation */}
            <nav class="flex items-center gap-2 text-xs text-gray-400 mb-8" aria-label="Breadcrumb">
              <a href="/" class="hover:text-[#1E4BD8] transition">홈</a>
              <i class="fa-solid fa-chevron-right text-[0.5rem]"></i>
              <a href="/cases/gallery" class="hover:text-[#1E4BD8] transition">치료사례</a>
              {linkedTreatment && <><i class="fa-solid fa-chevron-right text-[0.5rem]"></i><a href={`/treatments/${linkedTreatment.slug}`} class="hover:text-[#1E4BD8] transition">{linkedTreatment.name}</a></>}
              <i class="fa-solid fa-chevron-right text-[0.5rem]"></i>
              <span class="text-gray-600 font-medium">{cs.title}</span>
            </nav>

            {/* Header */}
            <header class="mb-8">
              <div class="flex items-center gap-2 mb-3">
                <span class="text-[0.7rem] bg-[#1E4BD8]/8 text-[#1E4BD8] px-3 py-1 rounded-full font-semibold">{cs.tag}</span>
                {cs.duration && <span class="text-[0.65rem] text-gray-400"><i class="fa-regular fa-clock mr-0.5"></i>{cs.duration}</span>}
              </div>
              <h1 class="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">{cs.title}</h1>
              {cs.description && <p class="case-description text-gray-500 text-base leading-relaxed mt-3">{cs.description}</p>}
              <p class="case-summary text-gray-600 text-sm leading-relaxed mt-3">{caseSummary}</p>
              <div class="flex items-center gap-4 mt-5 text-sm text-gray-400">
                <span><i class="fa-solid fa-user-doctor text-[#1E4BD8]/60 mr-1.5"></i>담당: <span class="text-gray-600 font-medium">{cs.doctor_name}</span></span>
                {cs.patient_age && <span>·</span>}
                {cs.patient_age && <span>{cs.patient_age}{cs.patient_gender ? ` ${cs.patient_gender}` : ''}</span>}
                <span>·</span>
                <time datetime={casePublished}>{kstYmd(cs.created_at) || caseDate}</time>
              </div>
            </header>

            {/* Before & After Images */}
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
              {/* Before */}
              <div class="relative rounded-2xl overflow-hidden bg-gray-50 aspect-[4/3] shadow-lg">
                {cs.before_image ? (
                  <img src={cs.before_image} alt={`${txName} 치료 전`} class="w-full h-full object-cover" loading="eager" decoding="async" />
                ) : (
                  <div class="w-full h-full flex items-center justify-center bg-gray-100">
                    <span class="text-gray-300 text-lg font-bold tracking-widest uppercase">Before</span>
                  </div>
                )}
                <span class="absolute top-3 left-3 text-[0.65rem] font-bold tracking-widest uppercase text-white bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-lg">Before</span>
              </div>
              {/* After */}
              <div class="relative rounded-2xl overflow-hidden bg-gray-50 aspect-[4/3] shadow-lg">
                {isLoggedIn && cs.after_image ? (
                  <img src={cs.after_image} alt={`${txName} 치료 후`} class="w-full h-full object-cover" loading="eager" decoding="async" />
                ) : (
                  <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 relative">
                    <div class="text-center">
                      <i class="fa-solid fa-lock text-3xl text-[#1E4BD8]/30 mb-3"></i>
                      <p class="text-gray-400 text-sm font-medium">After 사진은 로그인 후 열람</p>
                      <a href="/login" class="inline-block mt-3 px-5 py-2 rounded-xl bg-[#1E4BD8] text-white text-xs font-bold hover:bg-[#0052cc] transition">로그인하기</a>
                    </div>
                  </div>
                )}
                <span class="absolute top-3 right-3 text-[0.65rem] font-bold tracking-widest uppercase text-white bg-[#1E4BD8]/80 backdrop-blur-sm px-3 py-1.5 rounded-lg">After</span>
              </div>
            </div>

            {/* Case Info */}
            <div class="bg-gray-50 rounded-2xl p-6 mb-10">
              <h2 class="text-lg font-bold text-gray-900 mb-4">치료 상세 정보</h2>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span class="text-gray-400 text-xs font-semibold uppercase">치료 분류</span>
                  <p class="text-gray-900 font-medium mt-1">{cs.tag}</p>
                </div>
                <div>
                  <span class="text-gray-400 text-xs font-semibold uppercase">담당 의료진</span>
                  <p class="text-gray-900 font-medium mt-1">{cs.doctor_name}</p>
                </div>
                {cs.duration && (
                  <div>
                    <span class="text-gray-400 text-xs font-semibold uppercase">치료 기간</span>
                    <p class="text-gray-900 font-medium mt-1">{cs.duration}</p>
                  </div>
                )}
                {cs.patient_age && (
                  <div>
                    <span class="text-gray-400 text-xs font-semibold uppercase">환자 정보</span>
                    <p class="text-gray-900 font-medium mt-1">{cs.patient_age}{cs.patient_gender ? ` ${cs.patient_gender}` : ''}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Related Treatment Link */}
            {linkedTreatment && (
              <div class="p-5 rounded-2xl bg-[#1E4BD8]/[0.03] border border-[#1E4BD8]/10 mb-10">
                <div class="flex items-center gap-2 mb-2">
                  <i class="fa-solid fa-stethoscope text-[#1E4BD8] text-xs"></i>
                  <span class="text-xs font-semibold text-[#1E4BD8]">관련 진료 안내</span>
                </div>
                <a href={`/treatments/${linkedTreatment.slug}`} class="text-gray-900 font-bold hover:text-[#1E4BD8] transition">
                  {linkedTreatment.name} — 진료 상세보기 <i class="fa-solid fa-arrow-right text-xs ml-1"></i>
                </a>
              </div>
            )}

            {/* CTA */}
            <div class="p-6 rounded-2xl bg-gradient-to-br from-navy to-navy-lighter text-center mb-10">
              <h3 class="text-white font-bold text-lg mb-2">비슷한 고민을 가지고 계신가요?</h3>
              <p class="text-white/40 text-sm mb-5">서울365치과에서 직접 상담받아 보세요.</p>
              <a href="/reservation" class="btn-premium btn-premium-fill" data-cursor-hover>무료 상담 예약 <i class="fa-solid fa-arrow-right text-xs ml-1"></i></a>
            </div>

            {/* Related Cases */}
            {relatedCases.length > 0 && (
              <div class="pt-10 border-t border-gray-100">
                <h3 class="text-lg font-bold text-gray-900 mb-6">같은 분류 치료 사례</h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {relatedCases.map((rc: any) => (
                    <a href={`/cases/${rc.id}`} class="premium-card overflow-hidden group hover:shadow-lg transition">
                      <div class="aspect-[4/3] bg-gray-50 relative overflow-hidden">
                        {rc.before_image ? (
                          <img src={rc.before_image} alt={`${rc.tag || txName} 치료 전`} class="w-full h-full object-cover" loading="lazy" decoding="async" />
                        ) : (
                          <div class="w-full h-full flex items-center justify-center"><span class="text-gray-300 text-xs">Before</span></div>
                        )}
                        <span class="absolute top-2 left-2 text-[0.55rem] font-bold text-white bg-black/50 px-2 py-0.5 rounded-lg">{rc.tag}</span>
                      </div>
                      <div class="p-4">
                        <h4 class="font-bold text-gray-900 text-sm group-hover:text-[#1E4BD8] transition line-clamp-2">{rc.title}</h4>
                        <p class="text-xs text-gray-400 mt-1">담당: {rc.doctor_name}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {relatedPosts.length > 0 && (
              <div class="pt-10 mt-10 border-t border-gray-100">
                <h2 class="text-lg font-bold text-gray-900 mb-4">{txName} 관련 칼럼</h2>
                <ul class="space-y-2">
                  {relatedPosts.map((bp: any) => (
                    <li><a href={`/blog/${bp.slug}`} class="text-sm text-gray-600 hover:text-[#1E4BD8] transition">{bp.title}</a></li>
                  ))}
                </ul>
              </div>
            )}

            <p class="text-[0.72rem] text-gray-300 text-center mt-10">※ 개인에 따라 치료 결과가 다를 수 있습니다. 모든 사례는 환자 동의 하에 게시되었습니다.</p>
          </div>
        </article>
      </>,
      {
        title: `${caseTitle} | 서울365치과`,
        description: caseDesc.length > 160 ? caseDesc.slice(0, 157).replace(/\s+\S*$/, '') + '…' : caseDesc,
        canonical: caseUrl,
        noindexFollow: thinCase,
        ogImage: ogImg,
        ogType: 'article',
        datePublished: casePublished,
        dateModified: caseModified,
        articleSection: cs.tag,
        // 표준: MedicalWebPage(about·reviewedBy·lastReviewed) + BreadcrumbList (+ 공개 사진 ImageObject). Review/Rating·MedicalStudy 없음
        jsonLd: [{ "@context": "https://schema.org", "@graph": [
          { "@type": "BreadcrumbList", "@id": `${caseUrl}#breadcrumb`, "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "홈", "item": "https://seoul365dc.kr" },
            { "@type": "ListItem", "position": 2, "name": "치료사례", "item": "https://seoul365dc.kr/cases/gallery" },
            ...(linkedTreatment ? [{ "@type": "ListItem", "position": 3, "name": linkedTreatment.name, "item": `https://seoul365dc.kr/treatments/${linkedTreatment.slug}` }] : []),
            { "@type": "ListItem", "position": linkedTreatment ? 4 : 3, "name": cs.title, "item": caseUrl },
          ]},
          {
            "@type": "MedicalWebPage",
            "@id": `${caseUrl}#webpage`,
            "url": caseUrl,
            "name": caseTitle,
            "description": caseDesc,
            "inLanguage": "ko-KR",
            "isPartOf": { "@id": "https://seoul365dc.kr/#website" },
            "breadcrumb": { "@id": `${caseUrl}#breadcrumb` },
            "publisher": { "@id": "https://seoul365dc.kr/#dentist" },
            "datePublished": casePublished,
            "dateModified": caseModified,
            "lastReviewed": kstYmd(cs.updated_at || cs.created_at),
            "reviewedBy": physicianRef(caseDoc || LEAD_DOCTOR),
            "specialty": { "@type": "MedicalSpecialty", "name": "Dentistry" },
            ...(linkedTreatment ? { "about": { "@type": "MedicalProcedure", "@id": `https://seoul365dc.kr/treatments/${linkedTreatment.slug}#procedure`, "name": linkedTreatment.name, "url": `https://seoul365dc.kr/treatments/${linkedTreatment.slug}` } } : {}),
            "speakable": { "@type": "SpeakableSpecification", "cssSelector": ["h1", ".case-summary"] },
            ...(cs.before_image ? { "image": { "@type": "ImageObject", "contentUrl": cs.before_image.startsWith('http') ? cs.before_image : `https://seoul365dc.kr${cs.before_image}`, "name": `${txName} 치료 전`, "creditText": "서울365치과의원" } } : {}),
          },
        ] }],
      }
    );
  } catch {
    return c.notFound();
  }
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
                <input type="text" name="name" required class="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#1E4BD8]/20 focus:border-[#1E4BD8]/30 transition-all text-sm" placeholder="홍길동" />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">휴대폰 번호 *</label>
                <input type="tel" name="phone" required class="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#1E4BD8]/20 focus:border-[#1E4BD8]/30 transition-all text-sm" placeholder="010-1234-5678" />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">비밀번호 *</label>
                <input type="password" name="password" required minlength="4" class="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#1E4BD8]/20 focus:border-[#1E4BD8]/30 transition-all text-sm" placeholder="4자리 이상" />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">비밀번호 확인 *</label>
                <input type="password" name="password2" required minlength="4" class="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#1E4BD8]/20 focus:border-[#1E4BD8]/30 transition-all text-sm" placeholder="비밀번호 재입력" />
              </div>
              <div class="space-y-3 pt-1">
                <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider">약관 동의</p>
                
                {/* 전체 동의 */}
                <div class="flex items-center gap-2.5 p-3.5 bg-gray-50 rounded-2xl border border-gray-100">
                  <input type="checkbox" class="accent-[#1E4BD8] w-4 h-4" id="agree-all" />
                  <label for="agree-all" class="text-sm font-bold text-gray-800 cursor-pointer select-none">전체 동의</label>
                </div>

                {/* 개인정보 수집·이용 동의 (필수) */}
                <div class="flex items-start gap-2.5 pl-1">
                  <input type="checkbox" required class="mt-0.5 accent-[#1E4BD8] w-4 h-4" id="agree-privacy" name="privacy_agreed" />
                  <label for="agree-privacy" class="text-sm text-gray-600 cursor-pointer select-none">
                    <span class="text-[#1E4BD8] font-semibold">[필수]</span>{' '}
                    <a href="/privacy" target="_blank" class="text-[#1E4BD8] font-semibold underline underline-offset-2 hover:text-[#0044CC]">개인정보 수집·이용</a>에 동의합니다
                  </label>
                </div>
                <div class="ml-7 -mt-2 p-3 bg-gray-50/80 rounded-xl text-xs text-gray-400 leading-relaxed border border-gray-100/60">
                  수집항목: 이름, 연락처 | 이용목적: 회원관리, 진료상담 | 보유기간: 탈퇴 시까지 (의료법 보존의무 별도)
                </div>

                {/* 광고·마케팅 활용 동의 (선택) */}
                <div class="flex items-start gap-2.5 pl-1">
                  <input type="checkbox" class="mt-0.5 accent-[#1E4BD8] w-4 h-4" id="agree-marketing" name="marketing_agreed" />
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
              이미 계정이 있으신가요? <a href="/login" class="text-[#1E4BD8] font-semibold link-underline">로그인</a>
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
      noindex: true,
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
                <input type="tel" name="phone" required class="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#1E4BD8]/20 focus:border-[#1E4BD8]/30 transition-all text-sm" placeholder="010-1234-5678" />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">비밀번호</label>
                <input type="password" name="password" required class="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#1E4BD8]/20 focus:border-[#1E4BD8]/30 transition-all text-sm" placeholder="비밀번호 입력" />
              </div>
              <button type="submit" id="login-btn" class="btn-premium btn-premium-fill w-full py-4 text-[0.95rem]" data-cursor-hover>
                로그인
              </button>
            </form>
            <p class="text-center text-sm text-gray-400 mt-6">
              계정이 없으신가요? <a href="/register" class="text-[#1E4BD8] font-semibold link-underline">회원가입</a>
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
      noindex: true,
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
    '공지': 'bg-[#1E4BD8]/8 text-[#1E4BD8]',
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
                <a href={`/notices/${n.id}`} class="glass-card p-5 md:p-6 block group hover:border-[#1E4BD8]/20 transition-all" data-cursor-hover>
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
                      <h3 class="text-base font-bold text-gray-900 group-hover:text-[#1E4BD8] transition-colors truncate">{n.title}</h3>
                      <div class="flex items-center gap-3 mt-2 text-xs text-gray-400">
                        <span><i class="fa-regular fa-calendar mr-1"></i>{n.created_at?.slice(0, 10)}</span>
                        <span><i class="fa-regular fa-eye mr-1"></i>{n.view_count}</span>
                      </div>
                    </div>
                    <i class="fa-solid fa-chevron-right text-gray-200 group-hover:text-[#1E4BD8]/50 transition-colors mt-3 text-sm"></i>
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
      <section class="phead" aria-labelledby="enc-h1">
        <div class="wrap phead-in">
          <div class="phead-text">
            <nav class="crumb" aria-label="현재 위치"><ol><li><a href="/">홈</a></li><li><a href="/treatments">진료 안내</a></li><li aria-current="page">치과 백과사전</li></ol></nav>
            <p class="eyebrow">Dental Encyclopedia · {totalTerms}</p>
            <h1 id="enc-h1" class="display-xl">치과 백과사전</h1>
            <p class="lead hero-sub">치과에서 자주 쓰이는 {totalTerms}개 핵심 용어를 쉽게 풀어드립니다.</p>
            <div class="phead-cta">
              <a href="/treatments" class="btn btn-light"><Icon name="book" />전체 진료 안내</a>
              <a href="/reservation" class="btn btn-primary"><Icon name="calendar" />상담 예약</a>
            </div>
          </div>
          <div class="phead-aside">
            <div class="fact-card">
              <p class="eyebrow">분야 바로가기</p>
              <div class="phead-jump">
                {terms.map((cat, i) => <a href={`#cat-${i}`}>{cat.cat}<small>{cat.items.length}</small></a>)}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dictionary Body */}
      <section class="sec">
        <div class="wrap-n">
          <div class="sec-head" data-rv>
            <p class="eyebrow">Categories</p>
            <h2 class="display-2">총 {totalTerms}개 용어 · {terms.length}개 분야</h2>
          </div>
          {terms.map((cat, ci) => (
            <article id={`cat-${ci}`} class="enc-cat" data-rv>
              <div class="enc-cat-head">
                <h3>{cat.cat}</h3>
                <span class="cnt">{cat.items.length}개 용어</span>
              </div>
              <dl class="term-list">
                {cat.items.map((item) => {
                  const flat = flatTerms.find(f => f.catIndex === ci && f.term === item.term);
                  return (
                    <div>
                      <dt>
                        <h4>{flat ? <a href={`/encyclopedia/${flat.slug}`}>{item.term}</a> : item.term}</h4>
                        <span class="en">{item.en}</span>
                      </dt>
                      <dd>
                        {item.def}
                        {(item.link || flat) && (
                          <span class="links">
                            {item.link && <a href={item.link}>자세히 보기<Icon name="arrow" /></a>}
                            {flat && <a href={`/encyclopedia/${flat.slug}`} class="sub">용어 페이지<Icon name="arrowUpRight" /></a>}
                          </span>
                        )}
                      </dd>
                    </div>
                  );
                })}
              </dl>
            </article>
          ))}

          <p class="notice" data-rv>※ 본 백과사전은 일반적인 치과 정보 제공 목적이며, 정확한 진단과 치료 계획은 반드시 전문의와의 상담을 통해 결정하셔야 합니다.</p>
          <p style="margin-top:1.4rem" data-rv><a href="/treatments" class="btn btn-ghost">전체 진료 안내로 돌아가기</a></p>
        </div>
      </section>

      {/* CTA */}
      <section class="cta-band" aria-label="상담 안내">
        <div class="wrap-n" style="text-align:center;position:relative">
          <p class="eyebrow eyebrow-light no-bar" style="justify-content:center" data-rv>Consultation</p>
          <h2 class="display-xl" data-rv>궁금한 점이 있으신가요?</h2>
          <p class="lead" data-rv>서울대 출신 5인 전문의가 직접 상담해 드립니다.</p>
          <div class="cta-actions" data-rv-group>
            <a href={CLINIC.phoneTel} class="btn btn-white btn-lg"><Icon name="phone" />전화 상담</a>
            <a href="/reservation" class="btn btn-primary btn-lg"><Icon name="calendar" />예약하기</a>
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
          "publisher": { "@id": "https://seoul365dc.kr/#dentist" },
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

// ============================================================
// 🚀 v7: 백과사전 용어 개별 페이지 — /encyclopedia/:slug
// 192개 DefinedTerm 페이지 — 2026-10-08 용어별 상세 본문·FAQ 보강(동의어 8개는 TERM_REDIRECTS 로 301)
// ============================================================
pageRoutes.get('/encyclopedia/:slug', (c) => {
  const slug = c.req.param('slug');
  const term = getTermBySlug(slug);
  if (!term) {
    // 동의어·중복 용어는 합친 용어로 301 (2026-10-08)
    const target = TERM_REDIRECTS[slug];
    if (target) return c.redirect(`/encyclopedia/${target}`, 301);
    return c.notFound();
  }

  const detail = term.detail;
  const related = getRelatedTerms(term, 8);
  const pageUrl = `https://seoul365dc.kr/encyclopedia/${term.slug}`;
  const title = `${term.term}(${term.en})이란? 뜻·정의 | 치과 백과사전 — 서울365치과`;
  const desc = term.def.length > 150 ? term.def.slice(0, 147) + '…' : term.def;
  // 얇은 용어(고유 본문 300자 미만): noindex, follow + 사이트맵 제외. 2026-10-08 192개 전부 보강 → 색인 복귀
  const thinTerm = isThinTerm(term);
  if (thinTerm) c.header('X-Robots-Tag', NOINDEX_FOLLOW);
  const modified = term.updated || CONTENT_DATES.encyclopedia;
  // 관련 진료 링크: 상세 본문 links 우선, 없으면 기존 link 하나
  const links = detail?.links?.length ? detail.links : term.link ? [{ href: term.link, label: '관련 진료 안내' }] : [];

  return c.render(
    <>
      <section class="phead" aria-labelledby="term-h1">
        <div class="wrap phead-in">
          <div class="phead-text">
            <nav aria-label="브레드크럼" class="crumb">
              <ol>
                <li><a href="/">홈</a></li>
                <li><a href="/encyclopedia">치과 백과사전</a></li>
                <li aria-current="page">{term.term}</li>
              </ol>
            </nav>
            <p class="eyebrow">{term.cat}{detail ? ` · ${detail.kind}` : ''}</p>
            <h1 id="term-h1" class="display-xl">{term.term}</h1>
            <p class="en">{term.en}</p>
            <div class="phead-cta">
              <a href="/reservation" class="btn btn-primary"><Icon name="calendar" />상담 예약</a>
              <a href="/encyclopedia" class="btn btn-light"><Icon name="book" />전체 용어 사전</a>
            </div>
          </div>
          <div class="phead-aside">
            <div class="fact-card">
              <p class="eyebrow">용어 정보</p>
              <dl class="fact-rows">
                <div><dt>분야</dt><dd>{term.cat}</dd></div>
                {detail && <div><dt>구분</dt><dd>{detail.kind}</dd></div>}
                <div><dt>영문</dt><dd class="mono">{term.en}</dd></div>
                <div><dt>최종 수정</dt><dd class="mono">{modified}</dd></div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      <section class="sec">
        <article class="wrap-n">
          {/* AI 인용 최적화: 정의를 첫 문단에 직답 형태로 배치 */}
          <div class="answer-card" style="margin-bottom:2.6rem" data-rv>
            <h2 class="display-2" style="font-size:clamp(1.2rem,1.05rem+.6vw,1.5rem);margin:0 0 .8rem">{term.term}이란?</h2>
            <p class="answer-a" id="term-definition">{term.def}</p>
            <p class="answer-rev"><Icon name="clock" size={14} />최종 수정 <time datetime={modified}>{modified}</time> · 서울365치과 치과 백과사전</p>
          </div>

          {detail?.sections.map((s) => (
            <section class="prose-sec" data-rv>
              <h2>{s.h}</h2>
              {(s.p || []).map((p) => <p>{p}</p>)}
              {s.ol && <ol>{s.ol.map((li) => <li>{li}</li>)}</ol>}
              {s.ul && <ul>{s.ul.map((li) => <li>{li}</li>)}</ul>}
            </section>
          ))}

          {detail && detail.faq.length > 0 && (
            <section aria-labelledby="term-faq-heading" class="prose-sec" data-rv>
              <h2 id="term-faq-heading">{term.term} 자주 묻는 질문</h2>
              {detail.faq.map((f) => (
                <details class="fq" open>
                  <summary><h3>{f.q}</h3><span class="pm" aria-hidden="true"><Icon name="plus" /></span></summary>
                  <div class="fq-a"><p>{f.a}</p></div>
                </details>
              ))}
            </section>
          )}

          {links.length > 0 && (
            <aside class="card" style="padding:1.3rem 1.5rem;margin-bottom:2.6rem" aria-label="관련 진료 안내" data-rv>
              <p class="box-h">{term.term}과(와) 관련된 진료 안내</p>
              <div class="link-row">
                {links.map((l) => <a href={l.href} class="btn btn-ghost btn-sm">{l.label}</a>)}
              </div>
            </aside>
          )}

          {related.length > 0 && (
            <section aria-labelledby="related-terms-heading" class="prose-sec" data-rv>
              <h2 id="related-terms-heading">함께 보면 좋은 용어</h2>
              <div class="term-grid">
                {related.map((r) => (
                  <a href={`/encyclopedia/${r.slug}`} class="card term-tile hover">
                    <b>{r.term}</b>
                    <small>{r.en} · {r.cat}</small>
                  </a>
                ))}
              </div>
            </section>
          )}

          <p class="hub-note" data-rv><Icon name="pin" /><span>서울365치과 위치·진료시간 안내: <HubA /></span></p>
          <p class="notice" style="margin:1rem 0 1.6rem" data-rv>※ 본 내용은 일반적인 치과 정보 제공 목적이며, 개인에 따라 상태와 결과가 다를 수 있습니다. 정확한 진단과 치료 계획은 반드시 치과의사와 상담해 결정하시기 바랍니다.</p>
          <div class="link-row" data-rv>
            <a href="/encyclopedia" class="btn btn-ghost"><Icon name="book" />전체 용어 사전</a>
            <a href="/reservation" class="btn btn-primary"><Icon name="calendar" />상담 예약</a>
          </div>
        </article>
      </section>
    </>,
    {
      title,
      description: desc,
      canonical: pageUrl,
      noindexFollow: thinTerm,
      dateModified: modified,
      keywords: `${term.term}, ${term.term} 뜻, ${term.term}이란, ${term.en}, 치과 용어, ${term.cat}`,
      jsonLd: [
        {
          "@context": "https://schema.org", "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "홈", "item": "https://seoul365dc.kr" },
            { "@type": "ListItem", "position": 2, "name": "치과 백과사전", "item": "https://seoul365dc.kr/encyclopedia" },
            { "@type": "ListItem", "position": 3, "name": term.term, "item": pageUrl }
          ]
        },
        {
          "@context": "https://schema.org",
          "@type": "DefinedTerm",
          "@id": `${pageUrl}#term`,
          "name": term.term,
          "alternateName": term.en,
          "description": term.def,
          "inDefinedTermSet": { "@type": "DefinedTermSet", "name": "서울365치과 치과 용어 사전", "url": "https://seoul365dc.kr/encyclopedia" },
          "url": pageUrl,
        },
        {
          "@context": "https://schema.org",
          "@type": "MedicalWebPage",
          "@id": `${pageUrl}#webpage`,
          "name": title,
          "url": pageUrl,
          "description": desc,
          "inLanguage": "ko-KR",
          "isPartOf": { "@id": "https://seoul365dc.kr/#website" },
          "about": { "@id": `${pageUrl}#term` },
          "publisher": { "@id": "https://seoul365dc.kr/#dentist" },
          "specialty": "Dentistry",
          "dateModified": modified,
          "speakable": { "@type": "SpeakableSpecification", "cssSelector": ["h1", "#term-definition"] },
        },
        ...(detail && detail.faq.length > 0 ? [{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "@id": `${pageUrl}#faq`,
          "mainEntity": detail.faq.map((f) => ({
            "@type": "Question",
            "name": f.q,
            "acceptedAnswer": { "@type": "Answer", "text": f.a },
          })),
        }] : []),
      ]
    }
  )
})

// ============================================================
// 문의 답변 확인 (공개) — 접수번호 또는 이름+전화번호로 본인 문의·답변 조회
// GET ?code=XXXXXX (병원이 보낸 링크) / POST (폼: 접수번호 또는 이름+전화번호)
// ============================================================
function phoneDigits(v: string | null | undefined): string {
  return String(v || '').replace(/\D/g, '');
}
function phoneKey(v: string | null | undefined): string {
  const d = phoneDigits(v);
  return d.slice(-8);
}
function fmtDate(v: string | null | undefined): string {
  if (!v) return '';
  return String(v).replace('T', ' ').slice(0, 16);
}

async function renderConsultCheck(c: any, input: { code?: string; name?: string; phone?: string }, submitted: boolean) {
  await initAdminTables(c.env.DB);
  const code = (input.code || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 12);
  const name = (input.name || '').trim().slice(0, 50);
  const phone = (input.phone || '').trim().slice(0, 40);

  let matches: any[] = [];
  let error = '';
  if (submitted) {
    try {
      if (code) {
        const row = await c.env.DB.prepare(
          'SELECT id, name, treatment, message, status, reply, replied_at, created_at, lookup_code FROM consultations WHERE lookup_code = ?'
        ).bind(code).first();
        if (row) matches = [row];
        else error = '접수번호에 해당하는 문의를 찾을 수 없습니다. 접수번호를 다시 확인해 주세요.';
      } else if (name && phone) {
        const key = phoneKey(phone);
        if (key.length < 7) {
          error = '전화번호를 정확히 입력해 주세요.';
        } else {
          const rows = await c.env.DB.prepare(
            'SELECT id, name, phone, treatment, message, status, reply, replied_at, created_at, lookup_code FROM consultations WHERE name = ? ORDER BY created_at DESC LIMIT 50'
          ).bind(name).all();
          matches = (rows.results || []).filter((r: any) => phoneKey(r.phone) === key).slice(0, 10);
          if (matches.length === 0) error = '입력하신 이름·전화번호로 접수된 문의를 찾을 수 없습니다. 문의 시 입력한 이름과 전화번호를 그대로 입력해 주세요.';
        }
      } else {
        error = '접수번호 또는 이름과 전화번호를 입력해 주세요.';
      }
    } catch {
      error = '조회 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.';
    }
  }

  const inputCls = 'w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#1E4BD8]/20 focus:border-[#1E4BD8]/30 transition-all text-sm';

  return c.render(
    <>
      <section class="treatment-hero">
        <div class="relative z-10 max-w-[1400px] mx-auto px-5 md:px-8 py-28 md:py-36">
          <h1 class="section-headline text-white mb-4 reveal" style="transition-delay:0.3s">문의 답변 확인</h1>
          <p class="hero-sub text-white/35 reveal" style="transition-delay:0.5s">온라인 상담 문의에 대한 병원 답변을 확인하실 수 있습니다.</p>
        </div>
      </section>

      <section class="section-lg bg-mesh">
        <div class="max-w-3xl mx-auto px-5 md:px-8">
          <div class="premium-card p-8 md:p-10">
            <form method="post" action="/consultations/check" class="space-y-6">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">접수번호로 확인</label>
                <input type="text" name="code" value={code} maxlength={12} autocomplete="off" class={inputCls + ' tracking-widest uppercase'} placeholder="예: AB3K9Q (문의 접수 시 안내된 6자리)" />
              </div>
              <div class="flex items-center gap-3 text-xs text-gray-300">
                <span class="flex-1 h-px bg-gray-100"></span>또는<span class="flex-1 h-px bg-gray-100"></span>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">이름</label>
                  <input type="text" name="name" value={name} maxlength={50} class={inputCls} placeholder="문의 시 입력한 이름" />
                </div>
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">전화번호</label>
                  <input type="tel" name="phone" value={phone} maxlength={40} class={inputCls} placeholder="문의 시 입력한 번호 (해외번호 가능)" />
                </div>
              </div>
              <button type="submit" class="btn-premium btn-premium-fill w-full py-4 text-[0.95rem]" data-cursor-hover>답변 확인하기</button>
            </form>

            {error ? (
              <div class="mt-6 text-center text-sm py-3 px-4 rounded-xl bg-amber-50 text-amber-700 border border-amber-200">
                <i class="fa-solid fa-circle-info mr-1.5"></i>{error}
              </div>
            ) : null}

            {matches.map((m: any) => (
              <div class="mt-8 border border-gray-100 rounded-2xl overflow-hidden">
                <div class="bg-gray-50 px-5 py-3 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500">
                  <span>접수번호 <b class="text-gray-800 tracking-widest">{m.lookup_code || '-'}</b></span>
                  <span>접수일 {fmtDate(m.created_at)}</span>
                </div>
                <div class="px-5 py-5 space-y-4 text-sm">
                  <div>
                    <div class="text-xs font-semibold text-gray-400 mb-1">관심 치료</div>
                    <div class="text-gray-800">{m.treatment || '-'}</div>
                  </div>
                  <div>
                    <div class="text-xs font-semibold text-gray-400 mb-1">문의 내용</div>
                    <div class="text-gray-800 whitespace-pre-wrap leading-relaxed" style="word-break:keep-all">{m.message || '내용 없음'}</div>
                  </div>
                  <div class="pt-4 border-t border-gray-100">
                    <div class="text-xs font-semibold text-[#1E4BD8] mb-2"><i class="fa-solid fa-comment-medical mr-1"></i>서울365치과 답변{m.replied_at ? <span class="text-gray-400 font-normal ml-2">{fmtDate(m.replied_at)}</span> : null}</div>
                    {m.reply ? (
                      <div class="bg-blue-50/60 border border-blue-100 rounded-xl px-5 py-4 text-gray-800 whitespace-pre-wrap leading-relaxed" style="word-break:keep-all">{m.reply}</div>
                    ) : (
                      <div class="bg-gray-50 border border-gray-100 rounded-xl px-5 py-4 text-gray-500">아직 답변 준비 중입니다. 답변이 등록되면 이 페이지에서 확인하실 수 있습니다.</div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            <div class="mt-8 text-center text-xs text-gray-400 space-y-1">
              <p>접수번호를 모르시면 문의 시 입력한 이름과 전화번호로 확인할 수 있습니다.</p>
              <p>추가 문의: <a href={CLINIC.phoneTel} class="text-[#1E4BD8] font-semibold">{CLINIC.phone}</a> · <a href="/reservation" class="text-[#1E4BD8] font-semibold">온라인 상담 신청</a></p>
            </div>
          </div>
        </div>
      </section>
    </>,
    {
      title: '문의 답변 확인 | 서울365치과',
      description: '서울365치과 온라인 상담 문의 답변 확인. 접수번호 또는 이름·전화번호로 병원 답변을 확인하세요.',
      canonical: 'https://seoul365dc.kr/consultations/check',
      noindex: true,
    }
  )
}

pageRoutes.get('/consultations/check', async (c) => {
  const code = c.req.query('code') || '';
  return renderConsultCheck(c, { code }, !!code);
})

pageRoutes.post('/consultations/check', async (c) => {
  let body: any = {};
  try { body = await c.req.parseBody(); } catch {}
  return renderConsultCheck(c, {
    code: typeof body.code === 'string' ? body.code : '',
    name: typeof body.name === 'string' ? body.name : '',
    phone: typeof body.phone === 'string' ? body.phone : '',
  }, true);
})

export default pageRoutes
