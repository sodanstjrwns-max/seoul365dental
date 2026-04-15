// ============================================================
// Seoul365 Dental — 동단위 지역 SEO 랜딩 페이지
// /area/:slug — 각 동별 고유 콘텐츠 SEO 최적화 페이지
// ============================================================
import { Hono } from 'hono'
import type { Bindings } from '../lib/types'
import { CLINIC, HOURS, DIFF_CARDS } from '../data/clinic'
import { AREAS, getAreaBySlug, getAreasSorted, getAreasByGu, type AreaInfo } from '../data/areas'
import { treatments } from '../data/treatments'
import { doctors } from '../data/doctors'

const areaRoutes = new Hono<{ Bindings: Bindings }>()

// ── 지역 목록 페이지 (/area) ──
areaRoutes.get('/area', (c) => {
  const grouped = getAreasByGu();
  const guOrder = ['남동구', '미추홀구', '연수구', '부평구', '서구', '계양구'];

  return c.render(
    <section class="min-h-screen">
      {/* Hero */}
      <div class="hero-premium" style="min-height:50vh">
        <div class="hero-grid"></div>
        <div class="orb orb-1"></div>
        <div class="orb orb-2"></div>
        <div class="relative z-10 max-w-4xl mx-auto px-5 text-center" style="padding-top:16vh">
          <p class="text-[#00E5FF] text-xs font-bold tracking-[0.3em] uppercase mb-4 reveal reveal-fade">AREA GUIDE</p>
          <h1 class="text-3xl md:text-5xl font-black text-white mb-4 reveal reveal-fade text-split" style="transition-delay:0.2s">
            우리 동네에서 서울365치과까지
          </h1>
          <p class="text-white/40 text-sm md:text-base max-w-xl mx-auto reveal reveal-fade" style="transition-delay:0.4s">
            인천 {AREAS.length}개 지역에서 서울365치과까지의 거리와 소요시간을 안내합니다.<br/>
            예술회관역 5번 출구 도보 3분 — 어디서든 가까운 치과.
          </p>
        </div>
      </div>

      {/* 지역 목록 */}
      <div class="max-w-6xl mx-auto px-5 md:px-8 py-16 md:py-24">
        {guOrder.filter(gu => grouped[gu]).map(gu => (
          <div class="mb-16 reveal reveal-fade">
            <div class="flex items-center gap-3 mb-8">
              <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0066FF] to-[#2979FF] flex items-center justify-center">
                <i class="fa-solid fa-location-dot text-white text-sm"></i>
              </div>
              <div>
                <h2 class="text-xl font-bold text-gray-900">{gu}</h2>
                <p class="text-xs text-gray-400">{grouped[gu].length}개 지역</p>
              </div>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
              {grouped[gu].sort((a, b) => a.distKm - b.distKm).map(area => (
                <a href={`/area/${area.slug}`}
                   class="group premium-card p-5 hover:border-[#0066FF]/20 transition-all duration-300 block"
                   data-cursor-hover>
                  <div class="flex items-start justify-between mb-3">
                    <div>
                      <h3 class="font-bold text-gray-900 group-hover:text-[#0066FF] transition-colors">{area.name}</h3>
                      <p class="text-xs text-gray-400 mt-0.5">{area.gu}</p>
                    </div>
                    <div class="text-right">
                      <span class="text-sm font-bold text-[#0066FF]">{area.distKm === 0 ? '원내' : `${area.distKm}km`}</span>
                      <p class="text-[10px] text-gray-400">{area.distKm === 0 ? '도보 3분' : `약 ${area.travelMin}분`}</p>
                    </div>
                  </div>
                  <p class="text-xs text-gray-500 line-clamp-1 mb-3">{area.travelDesc}</p>
                  <div class="flex flex-wrap gap-1">
                    {area.landmarks.slice(0, 3).map(l => (
                      <span class="text-[10px] bg-gray-50 text-gray-400 px-2 py-0.5 rounded-full">{l}</span>
                    ))}
                  </div>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div class="bg-gradient-to-r from-[#040B18] to-[#0A1628] py-16 text-center">
        <div class="max-w-2xl mx-auto px-5 reveal reveal-fade">
          <h2 class="text-2xl font-bold text-white mb-3">어디서든 가까운 서울365치과</h2>
          <p class="text-white/40 text-sm mb-8">예술회관역 5번 출구 도보 3분 · 365일 야간21시 진료</p>
          <div class="flex flex-wrap justify-center gap-3">
            <a href="/reservation" class="btn-premium btn-premium-fill" data-cursor-hover>
              <i class="fa-solid fa-calendar-check mr-1.5"></i> 예약하기
            </a>
            <a href={CLINIC.phoneTel} class="btn-premium btn-premium-white" data-cursor-hover>
              <i class="fa-solid fa-phone mr-1.5"></i> {CLINIC.phone}
            </a>
          </div>
        </div>
      </div>
    </section>,
    {
      title: '인천 지역별 치과 안내 | 서울365치과 - 구월동·간석동·만수동·논현동·부평',
      description: `인천 ${AREAS.length}개 지역에서 서울365치과까지 거리·소요시간 안내. 예술회관역 5번 출구 도보 3분. 서울대 5인 원장, 365일·야간21시 진료. 임플란트, 교정, 수면진료. ☎ 032-432-0365`,
      canonical: 'https://seoul365dc.kr/area',
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "홈", "item": "https://seoul365dc.kr" },
            { "@type": "ListItem", "position": 2, "name": "지역 안내", "item": "https://seoul365dc.kr/area" },
          ],
        },
        {
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": "인천 지역별 치과 안내",
          "description": `서울365치과 인천 ${AREAS.length}개 지역 안내`,
          "url": "https://seoul365dc.kr/area",
          "isPartOf": { "@id": "https://seoul365dc.kr/#website" },
          "inLanguage": "ko-KR",
          "mainEntity": {
            "@type": "ItemList",
            "itemListElement": AREAS.map((a, i) => ({
              "@type": "ListItem",
              "position": i + 1,
              "name": `${a.name}치과 추천 서울365치과`,
              "url": `https://seoul365dc.kr/area/${a.slug}`,
            })),
          },
        },
      ],
    }
  )
})

// ── 개별 동 페이지 (/area/:slug) ──
areaRoutes.get('/area/:slug', (c) => {
  const slug = c.req.param('slug');
  const area = getAreaBySlug(slug);

  if (!area) {
    return c.render(
      <section class="hero-premium" style="min-height:80vh">
        <div class="hero-grid"></div>
        <div class="relative z-10 max-w-lg mx-auto px-5 text-center" style="padding-top:15vh">
          <h1 class="text-2xl font-bold text-white mb-3">지역 정보를 찾을 수 없습니다</h1>
          <p class="text-white/35 mb-8">요청하신 지역 페이지가 존재하지 않습니다.</p>
          <a href="/area" class="btn-premium btn-premium-fill" data-cursor-hover>지역 목록 보기</a>
        </div>
      </section>,
      { title: '404 - 지역을 찾을 수 없습니다 | 서울365치과' }
    );
  }

  // 인근 동 추천 (같은 구 우선, 거리순)
  const nearby = getAreasSorted()
    .filter(a => a.slug !== slug)
    .slice(0, 6);

  // 추천 진료 매핑
  const treatmentMap: Record<string, string> = {
    '임플란트': 'implant',
    '전체임플란트': 'full-implant',
    '인비절라인': 'invisalign',
    '교정': 'orthodontics',
    '수면진료': 'sedation',
    '심미치료': 'cosmetic',
    '소아치과': 'pediatric',
    '충치치료': 'general',
    '신경치료': 'general',
    '라미네이트': 'cosmetic',
    '치아미백': 'whitening',
  };

  const recTreatments = area.recommendTreatments
    .map(name => {
      const slug = treatmentMap[name];
      const t = treatments.find(t => t.slug === slug);
      return t ? { name, slug: t.slug, shortDesc: t.shortDesc, icon: t.icon } : null;
    })
    .filter(Boolean);

  // FAQ 데이터 (동별 맞춤)
  const areaFaq = [
    {
      q: `${area.name}에서 서울365치과까지 얼마나 걸리나요?`,
      a: `${area.name}에서 서울365치과까지 ${area.distKm === 0 ? '도보 3분 거리' : `약 ${area.travelMin}분`}이면 도착합니다. ${area.travelDesc}. 예술회관역 5번 출구에서 도보 3분 거리에 위치해 있습니다.`,
    },
    {
      q: `서울365치과는 ${area.name} 주민도 많이 오나요?`,
      a: `네, ${area.gu} ${area.name}을 포함해 인천 남동구, 미추홀구, 연수구, 부평구 등 다양한 지역에서 내원하고 계십니다. 365일 야간21시까지 진료하므로 퇴근 후나 주말에도 편하게 방문하실 수 있습니다.`,
    },
    {
      q: `야간이나 주말에도 진료하나요?`,
      a: `네. 서울365치과는 365일 진료합니다. 월~목 21시까지 야간 진료, 토요일 10~14시, 일요일·공휴일 14~18시 진료합니다. ${area.name}에서 퇴근 후 방문하셔도 충분합니다.`,
    },
    {
      q: `주차가 가능한가요?`,
      a: `네, 이토타워 건물 내 지하주차장을 이용하실 수 있습니다. ${area.name}에서 자가용으로 오시는 분들도 편하게 주차 가능합니다.`,
    },
    {
      q: `${area.name}에서 임플란트 비용이 궁금합니다.`,
      a: `임플란트 비용은 사용 재료(오스템, 스트라우만, 메가젠 등)와 환자분의 상태에 따라 달라집니다. 서울365치과는 자체 기공실 보유로 합리적인 가격을 제공하며, 무료 CT 촬영 후 정확한 상담을 받으실 수 있습니다. ☎ 032-432-0365`,
    },
  ];

  const canonicalUrl = `https://seoul365dc.kr/area/${area.slug}`;

  return c.render(
    <section class="min-h-screen" itemscope itemtype="https://schema.org/WebPage">
      {/* Hero Section */}
      <div class="hero-premium" style="min-height:55vh">
        <div class="hero-grid"></div>
        <div class="orb orb-1"></div>
        <div class="orb orb-2"></div>
        <div class="relative z-10 max-w-4xl mx-auto px-5 text-center" style="padding-top:14vh">
          <div class="inline-flex items-center gap-2 bg-white/[0.06] backdrop-blur-sm border border-white/[0.08] rounded-full px-4 py-1.5 mb-6 reveal reveal-fade">
            <i class="fa-solid fa-location-dot text-[#00E5FF] text-xs"></i>
            <span class="text-white/50 text-xs font-medium">{area.gu} {area.name}</span>
            {area.distKm > 0 && <span class="text-[#00E5FF] text-xs font-bold">· {area.distKm}km</span>}
          </div>
          <h1 class="text-3xl md:text-5xl font-black text-white mb-4 reveal reveal-fade text-split" style="transition-delay:0.15s" itemprop="name">
            {area.name}치과 추천<br class="md:hidden" /> 서울365치과
          </h1>
          <p class="text-white/40 text-sm md:text-base max-w-lg mx-auto mb-8 reveal reveal-fade" style="transition-delay:0.35s" itemprop="description">
            {area.travelDesc}
            {area.distKm > 0 && ` · 약 ${area.travelMin}분`}<br/>
            서울대 출신 5인 원장 · 365일 야간21시 · 자체 기공실
          </p>
          <div class="flex flex-wrap justify-center gap-3 reveal reveal-fade" style="transition-delay:0.5s">
            <a href="/reservation" class="btn-premium btn-premium-fill ripple-effect" data-cursor-hover>
              <i class="fa-solid fa-calendar-check mr-1.5"></i> 무료 상담 예약
            </a>
            <a href={CLINIC.phoneTel} class="btn-premium btn-premium-white" data-cursor-hover>
              <i class="fa-solid fa-phone mr-1.5"></i> {CLINIC.phone}
            </a>
          </div>
        </div>
      </div>

      {/* 거리 & 교통 안내 */}
      <div class="bg-white py-16 md:py-20">
        <div class="max-w-5xl mx-auto px-5 md:px-8">
          <div class="text-center mb-12 reveal reveal-fade">
            <p class="text-[#0066FF] text-xs font-bold tracking-[0.25em] uppercase mb-2">ACCESS</p>
            <h2 class="text-2xl md:text-3xl font-bold text-gray-900 text-words">
              {area.name}에서 서울365치과까지
            </h2>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 stagger-children">
            {/* 거리 카드 */}
            <div class="premium-card p-6 text-center">
              <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0066FF]/10 to-[#2979FF]/10 flex items-center justify-center mx-auto mb-4">
                <i class="fa-solid fa-route text-[#0066FF] text-xl"></i>
              </div>
              <div class="text-3xl font-black text-[#0066FF] mb-1">{area.distKm === 0 ? '0' : area.distKm}<span class="text-lg">km</span></div>
              <p class="text-sm text-gray-500">직선 거리</p>
            </div>

            {/* 소요시간 카드 */}
            <div class="premium-card p-6 text-center">
              <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#00E5FF]/10 to-[#0066FF]/10 flex items-center justify-center mx-auto mb-4">
                <i class="fa-solid fa-clock text-[#00E5FF] text-xl"></i>
              </div>
              <div class="text-3xl font-black text-[#00E5FF] mb-1">{area.distKm === 0 ? '3' : area.travelMin}<span class="text-lg">분</span></div>
              <p class="text-sm text-gray-500">{area.distKm === 0 ? '도보 소요시간' : '대중교통 기준'}</p>
            </div>

            {/* 교통 카드 */}
            <div class="premium-card p-6 text-center">
              <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-emerald-400/10 flex items-center justify-center mx-auto mb-4">
                <i class="fa-solid fa-train-subway text-emerald-500 text-xl"></i>
              </div>
              <div class="text-lg font-bold text-gray-900 mb-1">예술회관역</div>
              <p class="text-sm text-gray-500">5번 출구 도보 3분</p>
            </div>
          </div>

          {/* 상세 교통 */}
          <div class="mt-10 premium-card p-6 md:p-8 reveal reveal-fade">
            <h3 class="font-bold text-gray-900 mb-4">
              <i class="fa-solid fa-map-location-dot text-[#0066FF] mr-2"></i>
              {area.name}에서 오시는 길
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600">
              <div>
                <p class="font-semibold text-gray-800 mb-2">🚇 대중교통</p>
                <p>{area.travelDesc}</p>
                <p class="mt-1 text-gray-400">인천 1호선 예술회관역 5번 출구 → 도보 3분 → 이토타워 2층</p>
              </div>
              <div>
                <p class="font-semibold text-gray-800 mb-2">🚗 자가용</p>
                <p>이토타워 지하주차장 이용 가능</p>
                <p class="mt-1 text-gray-400">{CLINIC.address} (우편번호 {CLINIC.postalCode})</p>
              </div>
            </div>
          </div>

          {/* 주변 랜드마크 */}
          <div class="mt-6 flex flex-wrap gap-2 justify-center reveal reveal-fade">
            {area.landmarks.map(l => (
              <span class="text-xs bg-gray-50 text-gray-500 px-3 py-1.5 rounded-full border border-gray-100">
                <i class="fa-solid fa-location-dot text-[#0066FF]/40 mr-1"></i>{l}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 왜 서울365치과인가 */}
      <div class="section-lg bg-mesh relative overflow-hidden">
        <div class="max-w-5xl mx-auto px-5 md:px-8">
          <div class="text-center mb-12 reveal reveal-fade">
            <p class="text-[#0066FF] text-xs font-bold tracking-[0.25em] uppercase mb-2">WHY SEOUL 365</p>
            <h2 class="text-2xl md:text-3xl font-bold text-gray-900 text-words">
              {area.name} 주민이 서울365치과를 선택하는 이유
            </h2>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children">
            {DIFF_CARDS.slice(0, 6).map(card => (
              <div class="premium-card p-6 group hover:border-[#0066FF]/15 transition-all">
                <div class="w-11 h-11 rounded-xl bg-gradient-to-br from-[#0066FF]/8 to-[#2979FF]/8 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <i class={`fa-solid ${card.icon} text-[#0066FF] text-lg`}></i>
                </div>
                <h3 class="font-bold text-gray-900 mb-2">{card.title}</h3>
                <p class="text-sm text-gray-500 leading-relaxed mb-3">{card.desc}</p>
                <p class="text-xs text-[#0066FF]/60 italic">{card.voice}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 추천 진료 */}
      <div class="bg-white py-16 md:py-20">
        <div class="max-w-5xl mx-auto px-5 md:px-8">
          <div class="text-center mb-12 reveal reveal-fade">
            <p class="text-[#0066FF] text-xs font-bold tracking-[0.25em] uppercase mb-2">RECOMMENDED</p>
            <h2 class="text-2xl md:text-3xl font-bold text-gray-900 text-words">
              {area.name} 주민 추천 진료
            </h2>
            <p class="text-gray-400 text-sm mt-3">{area.population}</p>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-5 stagger-children">
            {recTreatments.map((t: any) => (
              <a href={`/treatments/${t.slug}`}
                 class="premium-card p-6 group hover:border-[#0066FF]/15 transition-all flex items-start gap-4 block"
                 data-cursor-hover>
                <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0066FF]/8 to-[#2979FF]/8 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <i class={`fa-solid ${t.icon} text-[#0066FF] text-lg`}></i>
                </div>
                <div>
                  <h3 class="font-bold text-gray-900 group-hover:text-[#0066FF] transition-colors">{t.name}</h3>
                  <p class="text-sm text-gray-500 mt-1">{t.shortDesc}</p>
                  <span class="inline-flex items-center text-xs text-[#0066FF] font-medium mt-2">
                    자세히 보기 <i class="fa-solid fa-arrow-right ml-1 text-[10px] group-hover:translate-x-1 transition-transform"></i>
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* 진료시간 */}
      <div class="bg-gradient-to-br from-[#040B18] to-[#0A1628] py-16 md:py-20 relative overflow-hidden">
        <div class="absolute top-0 left-1/4 w-1/2 h-64 bg-[#0066FF]/[0.03] blur-[100px] pointer-events-none"></div>
        <div class="max-w-4xl mx-auto px-5 md:px-8 relative z-10">
          <div class="text-center mb-10 reveal reveal-fade">
            <p class="text-[#00E5FF] text-xs font-bold tracking-[0.25em] uppercase mb-2">HOURS</p>
            <h2 class="text-2xl md:text-3xl font-bold text-white text-words">365일 · 야간 21시</h2>
            <p class="text-white/30 text-sm mt-3">{area.name}에서 퇴근 후에도 충분히 방문 가능합니다</p>
          </div>
          <div class="max-w-md mx-auto">
            {HOURS.map(h => (
              <div class="flex justify-between items-center py-3.5 border-b border-white/[0.06]">
                <span class="text-white/40 text-sm">{h.day}</span>
                <div class="flex items-center gap-2">
                  <span class="text-white font-semibold tabular-nums">{h.time}</span>
                  {h.note && <span class="text-[10px] bg-[#0066FF]/15 text-[#00E5FF] px-2 py-0.5 rounded-full">{h.note}</span>}
                </div>
              </div>
            ))}
            <div class="pt-4 flex items-center justify-center gap-2">
              <span class="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
              <span class="text-emerald-400 text-sm font-semibold">점심시간 없이 연속 진료</span>
            </div>
          </div>
        </div>
      </div>

      {/* 의료진 소개 */}
      <div class="bg-white py-16 md:py-20">
        <div class="max-w-5xl mx-auto px-5 md:px-8">
          <div class="text-center mb-12 reveal reveal-fade">
            <p class="text-[#0066FF] text-xs font-bold tracking-[0.25em] uppercase mb-2">DOCTORS</p>
            <h2 class="text-2xl md:text-3xl font-bold text-gray-900 text-words">서울대 출신 5인 전문의</h2>
          </div>
          <div class="grid grid-cols-2 md:grid-cols-5 gap-4 stagger-children">
            {doctors.slice(0, 5).map(doc => (
              <a href={`/doctors/${doc.slug}`} class="group text-center block" data-cursor-hover>
                <div class="aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100 mb-3 img-hover-zoom">
                  <img src={doc.photo} alt={`${doc.name} ${doc.title}`}
                       class="w-full h-full object-cover" loading="lazy"
                       onerror={`this.src='${doc.photoFallback}'`} />
                </div>
                <h3 class="font-bold text-gray-900 text-sm group-hover:text-[#0066FF] transition-colors">{doc.name}</h3>
                <p class="text-xs text-gray-400">{doc.titleShort}</p>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div class="section-lg bg-mesh">
        <div class="max-w-3xl mx-auto px-5 md:px-8">
          <div class="text-center mb-12 reveal reveal-fade">
            <p class="text-[#0066FF] text-xs font-bold tracking-[0.25em] uppercase mb-2">FAQ</p>
            <h2 class="text-2xl md:text-3xl font-bold text-gray-900 text-words">
              {area.name} 주민 자주 묻는 질문
            </h2>
          </div>
          <div class="space-y-3 stagger-children" itemscope itemtype="https://schema.org/FAQPage">
            {areaFaq.map(faq => (
              <div class="premium-card overflow-hidden" itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
                <button class="faq-toggle w-full text-left p-5 flex items-start gap-3 group" aria-expanded="false">
                  <span class="w-6 h-6 rounded-lg bg-[#0066FF]/8 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <i class="fa-solid fa-plus text-[#0066FF] text-xs faq-icon transition-transform duration-300"></i>
                  </span>
                  <span class="font-semibold text-gray-900 text-sm flex-1" itemprop="name">{faq.q}</span>
                </button>
                <div class="faq-content hidden px-5 pb-5 pl-14" itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
                  <p class="text-sm text-gray-500 leading-relaxed" itemprop="text">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 인근 지역 */}
      <div class="bg-white py-16 md:py-20">
        <div class="max-w-5xl mx-auto px-5 md:px-8">
          <div class="text-center mb-10 reveal reveal-fade">
            <p class="text-[#0066FF] text-xs font-bold tracking-[0.25em] uppercase mb-2">NEARBY</p>
            <h2 class="text-xl md:text-2xl font-bold text-gray-900">인근 지역 안내</h2>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 stagger-children">
            {nearby.map(n => (
              <a href={`/area/${n.slug}`}
                 class="premium-card p-3 text-center group hover:border-[#0066FF]/15 transition-all block"
                 data-cursor-hover>
                <p class="font-semibold text-gray-900 text-sm group-hover:text-[#0066FF] transition-colors">{n.name}</p>
                <p class="text-[10px] text-gray-400 mt-0.5">{n.distKm}km · {n.travelMin}분</p>
              </a>
            ))}
          </div>
          <div class="text-center mt-6">
            <a href="/area" class="text-sm text-[#0066FF] font-medium hover:underline" data-cursor-hover>
              전체 지역 보기 <i class="fa-solid fa-arrow-right ml-1 text-xs"></i>
            </a>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div class="bg-gradient-to-r from-[#040B18] to-[#0A1628] py-16 text-center">
        <div class="max-w-2xl mx-auto px-5 reveal reveal-fade">
          <h2 class="text-2xl font-bold text-white mb-3">
            {area.name}에서 가까운 서울365치과
          </h2>
          <p class="text-white/40 text-sm mb-8">
            서울대 5인 원장 · 365일 야간21시 · 자체 기공실<br/>
            {area.travelDesc}
          </p>
          <div class="flex flex-wrap justify-center gap-3">
            <a href="/reservation" class="btn-premium btn-premium-fill ripple-effect" data-cursor-hover>
              <i class="fa-solid fa-calendar-check mr-1.5"></i> 무료 상담 예약
            </a>
            <a href={CLINIC.phoneTel} class="btn-premium btn-premium-white" data-cursor-hover>
              <i class="fa-solid fa-phone mr-1.5"></i> {CLINIC.phone}
            </a>
            <a href={CLINIC.kakao} target="_blank" rel="noopener noreferrer" class="btn-premium btn-premium-outline text-[#00E5FF] border-[#00E5FF]/20 hover:bg-[#00E5FF]/5" data-cursor-hover>
              <i class="fa-solid fa-comment mr-1.5"></i> 카카오 상담
            </a>
          </div>
        </div>
      </div>
    </section>,
    {
      title: area.seoTitle,
      description: area.seoDesc,
      canonical: canonicalUrl,
      jsonLd: [
        // Breadcrumb
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "홈", "item": "https://seoul365dc.kr" },
            { "@type": "ListItem", "position": 2, "name": "지역 안내", "item": "https://seoul365dc.kr/area" },
            { "@type": "ListItem", "position": 3, "name": `${area.name}치과`, "item": canonicalUrl },
          ],
        },
        // LocalBusiness with geo
        {
          "@context": "https://schema.org",
          "@type": "Dentist",
          "name": "서울365치과의원",
          "alternateName": "Seoul 365 Dental Clinic",
          "url": "https://seoul365dc.kr",
          "telephone": CLINIC.phone,
          "image": "https://seoul365dc.kr/static/og-image.png",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "예술로 138 이토타워 2층 212호",
            "addressLocality": "인천광역시 남동구",
            "addressRegion": "인천",
            "postalCode": CLINIC.postalCode,
            "addressCountry": "KR",
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": CLINIC.geo.lat,
            "longitude": CLINIC.geo.lng,
          },
          "areaServed": [
            {
              "@type": "GeoCircle",
              "geoMidpoint": {
                "@type": "GeoCoordinates",
                "latitude": CLINIC.geo.lat,
                "longitude": CLINIC.geo.lng,
              },
              "geoRadius": "10000",
            },
            {
              "@type": "AdministrativeArea",
              "name": `인천광역시 ${area.gu} ${area.name}`,
            },
          ],
          "openingHoursSpecification": [
            { "@type": "OpeningHoursSpecification", "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday"], "opens": "10:00", "closes": "21:00" },
            { "@type": "OpeningHoursSpecification", "dayOfWeek": "Friday", "opens": "10:00", "closes": "19:00" },
            { "@type": "OpeningHoursSpecification", "dayOfWeek": "Saturday", "opens": "10:00", "closes": "14:00" },
            { "@type": "OpeningHoursSpecification", "dayOfWeek": "Sunday", "opens": "14:00", "closes": "18:00" },
          ],
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "ratingCount": "2150",
            "reviewCount": "1840",
            "bestRating": "5",
          },
          "medicalSpecialty": [
            "Implantology", "Orthodontics", "Cosmetic Dentistry",
            "Pediatric Dentistry", "Sedation Dentistry",
          ],
          "availableService": area.recommendTreatments.map(name => ({
            "@type": "MedicalProcedure",
            "name": name,
            "url": `https://seoul365dc.kr/treatments/${treatmentMap[name] || 'implant'}`,
          })),
        },
        // FAQPage
        {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": areaFaq.map(faq => ({
            "@type": "Question",
            "name": faq.q,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": faq.a,
            },
          })),
        },
        // WebPage
        {
          "@context": "https://schema.org",
          "@type": "MedicalWebPage",
          "name": area.seoTitle,
          "description": area.seoDesc,
          "url": canonicalUrl,
          "inLanguage": "ko-KR",
          "isPartOf": { "@id": "https://seoul365dc.kr/#website" },
          "about": {
            "@type": "MedicalCondition",
            "name": "치과 진료",
            "associatedAnatomy": { "@type": "AnatomicalStructure", "name": "치아" },
          },
          "specialty": {
            "@type": "MedicalSpecialty",
            "name": "Dentistry",
          },
          "lastReviewed": new Date().toISOString().split('T')[0],
        },
      ],
    }
  )
})

export default areaRoutes
