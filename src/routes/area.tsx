// ============================================================
// Seoul365 Dental — 동단위 지역 SEO 랜딩 페이지
// /area/:slug — 각 동별 고유 콘텐츠 SEO 최적화 페이지
// ============================================================
import { Hono } from 'hono'
import type { Bindings } from '../lib/types'
import { CLINIC, HOURS, DIFF_CARDS } from '../data/clinic'
import { AREAS, getAreaBySlug, getAreasSorted, getAreasByGu, type AreaInfo } from '../data/areas'
import { treatments, getTreatmentBySlug } from '../data/treatments'
import { doctors } from '../data/doctors'
import {
  MATRIX_TREATMENT_SLUGS,
  MATRIX_TREATMENT_INFO,
  MATRIX_VARIANTS,
  TREATMENT_PRICING,
  buildAreaTreatmentMeta,
  buildMatrixContent,
  buildVariantMeta,
  getAreaTreatments,
  type MatrixVariantSlug,
} from '../data/area-treatment'

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

      {/* 🎯 진료별 지역 매트릭스 (SEO 골든 그리드) */}
      <div class="bg-gradient-to-b from-gray-50 to-white py-16 md:py-20 border-t border-gray-100">
        <div class="max-w-6xl mx-auto px-5 md:px-8">
          <div class="text-center mb-10 reveal reveal-fade">
            <p class="text-[#0066FF] text-xs font-bold tracking-[0.25em] uppercase mb-2">BY TREATMENT</p>
            <h2 class="text-2xl md:text-3xl font-bold text-gray-900 text-words">
              진료별로 가까운 지역 찾기
            </h2>
            <p class="text-gray-400 text-sm mt-3">
              {MATRIX_TREATMENT_SLUGS.length}개 핵심 진료 × {AREAS.length}개 지역 = 우리 동네에서 가장 가까운 전문 진료
            </p>
          </div>
          <div class="space-y-8 stagger-children">
            {MATRIX_TREATMENT_SLUGS.map(tSlug => {
              const info = MATRIX_TREATMENT_INFO[tSlug];
              const nearAreas = getAreasSorted().slice(0, 12);
              return (
                <div class="premium-card p-5 md:p-6">
                  <div class="flex items-center gap-3 mb-4">
                    <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0066FF] to-[#2979FF] flex items-center justify-center">
                      <i class={`fa-solid ${info.icon} text-white text-sm`}></i>
                    </div>
                    <div class="flex-1">
                      <h3 class="font-bold text-gray-900">{info.name}</h3>
                      <p class="text-[11px] text-gray-400">{info.tagline}</p>
                    </div>
                    <a href={`/treatments/${tSlug}`} class="text-xs text-[#0066FF] font-medium hover:underline" data-cursor-hover>
                      진료 상세 <i class="fa-solid fa-arrow-right ml-0.5 text-[9px]"></i>
                    </a>
                  </div>
                  <div class="flex flex-wrap gap-2">
                    {nearAreas.map(a => (
                      <a href={`/area/${a.slug}/${tSlug}`}
                         class="inline-flex items-center gap-1.5 text-xs bg-gray-50 hover:bg-[#0066FF]/8 text-gray-600 hover:text-[#0066FF] px-3 py-1.5 rounded-full transition-colors"
                         data-cursor-hover
                         title={`${a.name} ${info.name}`}>
                        <i class="fa-solid fa-location-dot text-[9px] opacity-50"></i>
                        {a.name} {info.name}
                      </a>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
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

// ============================================================
// ── 🚀 SEO 매트릭스 페이지 (/area/:areaSlug/:treatmentSlug) ──
// 18개 지역 × 10개 핵심 진료 = 180개 자동 SEO 랜딩 페이지
// "구월동 임플란트", "송도 인비절라인" 등 롱테일 키워드 완전 장악
// ============================================================
areaRoutes.get('/area/:areaSlug/:treatmentSlug', (c) => {
  const areaSlug = c.req.param('areaSlug');
  const treatmentSlug = c.req.param('treatmentSlug');

  const area = getAreaBySlug(areaSlug);
  const treatment = getTreatmentBySlug(treatmentSlug);

  // 둘 다 존재하지 않거나 매트릭스 화이트리스트에 없으면 404
  if (!area || !treatment || !MATRIX_TREATMENT_SLUGS.includes(treatmentSlug as any)) {
    return c.notFound();
  }

  const meta = buildAreaTreatmentMeta(area, treatment);
  const tInfo = MATRIX_TREATMENT_INFO[treatmentSlug as keyof typeof MATRIX_TREATMENT_INFO];

  // 같은 지역의 다른 진료들 (내부 링크)
  const otherTreatmentsInArea = MATRIX_TREATMENT_SLUGS
    .filter(s => s !== treatmentSlug)
    .map(s => ({
      slug: s,
      info: MATRIX_TREATMENT_INFO[s],
      url: `/area/${area.slug}/${s}`,
    }));

  // 같은 진료의 다른 지역들 (내부 링크)
  const otherAreasForTreatment = AREAS
    .filter(a => a.slug !== areaSlug)
    .sort((a, b) => a.distKm - b.distKm)
    .slice(0, 12);

  // 지역×진료 맞춤 FAQ
  const matrixFaq = [
    {
      q: `${area.name}에서 ${treatment.name} 잘하는 치과 추천해주세요`,
      a: `${area.name}에서 가까운 ${treatment.name} 전문 치과로는 서울365치과를 추천드립니다. ${area.travelDesc}로 ${area.distKm === 0 ? '도보 3분' : `약 ${area.travelMin}분`}이면 도착하며, 서울대 출신 5인 원장이 협진하고 365일·야간21시까지 진료합니다. ${treatment.shortDesc}에 특화되어 있으며, ☎ 032-432-0365로 무료 상담 가능합니다.`,
    },
    {
      q: `${area.name} ${treatment.name} 비용은 얼마인가요?`,
      a: `${treatment.name} 비용은 환자분의 상태와 사용 재료에 따라 달라집니다. ${treatment.faq?.[0]?.a?.slice(0, 200) || `서울365치과는 합리적인 가격으로 ${treatment.name}를 제공하며, 정확한 비용은 진단 후 안내드립니다.`} ${area.name}에서 ${area.distKm === 0 ? '도보 3분' : `${area.travelMin}분`} 거리이므로 부담 없이 상담받으실 수 있습니다.`,
    },
    {
      q: `${area.name}에서 ${treatment.name} 받으러 가는 길은?`,
      a: `${area.travelDesc}. 인천 1호선 예술회관역 5번 출구에서 도보 3분, 이토타워 2층입니다. 자가용으로 오시면 이토타워 지하주차장을 이용하실 수 있습니다. ${area.name}에서 ${area.distKm === 0 ? '바로 인근' : `약 ${area.distKm}km`} 거리입니다.`,
    },
    {
      q: `${treatment.name} 받을 때 야간이나 주말도 가능한가요?`,
      a: `네, 서울365치과는 ${area.name} 주민들을 위해 365일 진료합니다. 월~목 21시까지 야간 진료, 토요일 10~14시, 일요일·공휴일 14~18시 진료하므로 직장인이나 학생도 편하게 ${treatment.name} 치료를 받으실 수 있습니다.`,
    },
    {
      q: `${area.name} 외 다른 지역에서도 많이 오시나요?`,
      a: `네, 서울365치과는 ${area.gu}을 포함해 인천 남동구·미추홀구·연수구·부평구·서구·계양구 등 다양한 지역에서 ${treatment.name}을(를) 위해 내원하고 계십니다. 예술회관역 도보 3분 입지로 인천 어디서든 접근이 편리합니다.`,
    },
    // 진료별 핵심 FAQ 1개 인용
    ...(treatment.faq?.slice(0, 3) || []).map(f => ({
      q: `${area.name} ${treatment.name} - ${f.q}`,
      a: f.a,
    })),
  ];

  const canonicalUrl = meta.canonical;

  // 🚀 v2: 1500자+ 풍부한 SEO 콘텐츠 자동 생성
  const matrixContent = buildMatrixContent(area, treatment);
  const pricingData = TREATMENT_PRICING[treatmentSlug as MatrixVariantSlug extends never ? any : any] || TREATMENT_PRICING[treatmentSlug as keyof typeof TREATMENT_PRICING];

  return c.render(
    <section class="min-h-screen" itemscope itemtype="https://schema.org/MedicalWebPage">
      {/* Hero — 지역×진료 강조 */}
      <div class="hero-premium" style="min-height:55vh">
        <div class="hero-grid"></div>
        <div class="orb orb-1"></div>
        <div class="orb orb-2"></div>
        <div class="relative z-10 max-w-4xl mx-auto px-5 text-center" style="padding-top:14vh">
          {/* Breadcrumb pill */}
          <div class="inline-flex items-center gap-2 flex-wrap justify-center bg-white/[0.06] backdrop-blur-sm border border-white/[0.08] rounded-full px-4 py-1.5 mb-6 reveal reveal-fade">
            <a href="/area" class="text-white/40 text-xs hover:text-white/80 transition-colors">지역안내</a>
            <i class="fa-solid fa-chevron-right text-white/20 text-[8px]"></i>
            <a href={`/area/${area.slug}`} class="text-white/50 text-xs font-medium hover:text-white/90 transition-colors">{area.gu} {area.name}</a>
            <i class="fa-solid fa-chevron-right text-white/20 text-[8px]"></i>
            <span class="text-[#00E5FF] text-xs font-bold">{treatment.name}</span>
          </div>
          <h1 class="text-3xl md:text-5xl font-black text-white mb-4 reveal reveal-fade text-split" style="transition-delay:0.15s" itemprop="name">
            {area.name} {treatment.name}<br class="md:hidden" />
            <span class="text-[#00E5FF]"> 서울365치과</span>
          </h1>
          <p class="text-white/40 text-sm md:text-base max-w-lg mx-auto mb-3 reveal reveal-fade" style="transition-delay:0.35s" itemprop="description">
            {meta.subtitle}
          </p>
          <p class="text-white/30 text-xs md:text-sm max-w-md mx-auto mb-8 reveal reveal-fade" style="transition-delay:0.4s">
            {meta.highlight}
          </p>
          <div class="flex flex-wrap justify-center gap-3 reveal reveal-fade" style="transition-delay:0.5s">
            <a href="/reservation" class="btn-premium btn-premium-fill ripple-effect" data-cursor-hover>
              <i class="fa-solid fa-calendar-check mr-1.5"></i> {treatment.name} 무료 상담
            </a>
            <a href={CLINIC.phoneTel} class="btn-premium btn-premium-white" data-cursor-hover>
              <i class="fa-solid fa-phone mr-1.5"></i> {CLINIC.phone}
            </a>
          </div>
        </div>
      </div>

      {/* 🎯 핵심 정보 3-card: 거리·소요시간·진료 */}
      <div class="bg-white py-12 md:py-16">
        <div class="max-w-5xl mx-auto px-5 md:px-8">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 stagger-children">
            <div class="premium-card p-6 text-center">
              <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0066FF]/10 to-[#2979FF]/10 flex items-center justify-center mx-auto mb-3">
                <i class="fa-solid fa-route text-[#0066FF]"></i>
              </div>
              <div class="text-2xl font-black text-[#0066FF] mb-1">
                {area.distKm === 0 ? '0' : area.distKm}<span class="text-base">km</span>
              </div>
              <p class="text-xs text-gray-500">{area.name}에서 직선거리</p>
            </div>
            <div class="premium-card p-6 text-center">
              <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00E5FF]/10 to-[#0066FF]/10 flex items-center justify-center mx-auto mb-3">
                <i class="fa-solid fa-clock text-[#00E5FF]"></i>
              </div>
              <div class="text-2xl font-black text-[#00E5FF] mb-1">
                {area.distKm === 0 ? '3' : area.travelMin}<span class="text-base">분</span>
              </div>
              <p class="text-xs text-gray-500">{area.distKm === 0 ? '도보 소요' : '대중교통'}</p>
            </div>
            <div class="premium-card p-6 text-center">
              <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/10 to-emerald-400/10 flex items-center justify-center mx-auto mb-3">
                <i class={`fa-solid ${treatment.icon} text-emerald-500`}></i>
              </div>
              <div class="text-base font-bold text-gray-900 mb-1">{treatment.name}</div>
              <p class="text-xs text-gray-500">{tInfo?.tagline || treatment.shortDesc}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 왜 서울365치과 ({지역} {진료}) */}
      <div class="section-lg bg-mesh">
        <div class="max-w-5xl mx-auto px-5 md:px-8">
          <div class="text-center mb-12 reveal reveal-fade">
            <p class="text-[#0066FF] text-xs font-bold tracking-[0.25em] uppercase mb-2">WHY HERE</p>
            <h2 class="text-2xl md:text-3xl font-bold text-gray-900 text-words">
              {area.name} 주민이 {treatment.name}을(를) 위해<br class="hidden md:block" /> 서울365치과를 선택하는 이유
            </h2>
            <p class="text-gray-400 text-sm mt-3">{area.travelDesc} · {treatment.shortDesc}</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children">
            {treatment.whyUs.slice(0, 6).map(w => (
              <div class="premium-card p-6 group hover:border-[#0066FF]/15 transition-all">
                <div class="w-11 h-11 rounded-xl bg-gradient-to-br from-[#0066FF]/8 to-[#2979FF]/8 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <i class={`fa-solid ${w.icon} text-[#0066FF] text-lg`}></i>
                </div>
                <h3 class="font-bold text-gray-900 mb-2">{w.title}</h3>
                <p class="text-sm text-gray-500 leading-relaxed">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 진료 과정 — 그대로 인용해 키워드 밀도 ↑ */}
      <div class="bg-white py-16 md:py-20">
        <div class="max-w-4xl mx-auto px-5 md:px-8">
          <div class="text-center mb-12 reveal reveal-fade">
            <p class="text-[#0066FF] text-xs font-bold tracking-[0.25em] uppercase mb-2">PROCESS</p>
            <h2 class="text-2xl md:text-3xl font-bold text-gray-900 text-words">
              {area.name} {treatment.name} 진료 과정
            </h2>
          </div>
          <div class="space-y-3 stagger-children">
            {treatment.process.map((p, idx) => (
              <div class="premium-card p-5 flex gap-4 items-start">
                <div class="w-10 h-10 rounded-xl bg-[#0066FF]/8 flex items-center justify-center flex-shrink-0">
                  <span class="text-[#0066FF] font-black text-sm">{idx + 1}</span>
                </div>
                <div class="flex-1">
                  <h3 class="font-bold text-gray-900 text-sm mb-1">{p.step}</h3>
                  <p class="text-sm text-gray-500 leading-relaxed">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div class="text-center mt-10">
            <a href={`/treatments/${treatment.slug}`} class="btn-premium btn-premium-outline" data-cursor-hover>
              <i class="fa-solid fa-circle-info mr-1.5"></i> {treatment.name} 자세한 안내 보기
            </a>
          </div>
        </div>
      </div>

      {/* 진료시간 — {지역} 강조 */}
      <div class="bg-gradient-to-br from-[#040B18] to-[#0A1628] py-16 md:py-20 relative overflow-hidden">
        <div class="absolute top-0 left-1/4 w-1/2 h-64 bg-[#0066FF]/[0.03] blur-[100px] pointer-events-none"></div>
        <div class="max-w-4xl mx-auto px-5 md:px-8 relative z-10">
          <div class="text-center mb-10 reveal reveal-fade">
            <p class="text-[#00E5FF] text-xs font-bold tracking-[0.25em] uppercase mb-2">HOURS</p>
            <h2 class="text-2xl md:text-3xl font-bold text-white text-words">
              {area.name}에서 퇴근 후에도 {treatment.name} 가능
            </h2>
            <p class="text-white/30 text-sm mt-3">365일 · 야간 21시 · 일요일·공휴일 진료</p>
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
          </div>
        </div>
      </div>

      {/* 🚀 v2: 풍부한 SEO 본문 콘텐츠 (1500자+) — 검색엔진이 정말 좋아하는 콘텐츠 */}
      <article class="bg-white py-16 md:py-20" itemscope itemtype="https://schema.org/Article">
        <meta itemprop="headline" content={`${area.name} ${treatment.name} 안내 - 서울365치과`} />
        <meta itemprop="datePublished" content="2025-01-01" />
        <meta itemprop="dateModified" content={new Date().toISOString().split('T')[0]} />
        <div itemprop="author" itemscope itemtype="https://schema.org/Dentist" style="display:none">
          <meta itemprop="name" content="서울365치과의원" />
          <meta itemprop="url" content="https://seoul365dc.kr" />
        </div>
        <div itemprop="publisher" itemscope itemtype="https://schema.org/Organization" style="display:none">
          <meta itemprop="name" content="서울365치과의원" />
        </div>

        <div class="max-w-4xl mx-auto px-5 md:px-8">
          <div class="text-center mb-10 reveal reveal-fade">
            <p class="text-[#0066FF] text-xs font-bold tracking-[0.25em] uppercase mb-2">GUIDE</p>
            <h2 class="text-2xl md:text-3xl font-bold text-gray-900 text-words" itemprop="name">
              {area.name} {treatment.name} — 알아두면 좋은 정보
            </h2>
          </div>

          {/* 도입부 3문단 (자연어 SEO 본문) */}
          <div class="prose prose-lg max-w-none space-y-5 text-gray-700 leading-relaxed reveal reveal-fade" itemprop="articleBody">
            {matrixContent.introParagraphs.map((p, i) => (
              <p class="text-[15px] md:text-base">{p}</p>
            ))}
          </div>
        </div>
      </article>

      {/* 🚀 v2: 가격표 섹션 (구조화된 데이터 — 검색결과 리치 스니펫) */}
      {pricingData && (
        <div class="bg-gradient-to-br from-gray-50 to-white py-16 md:py-20">
          <div class="max-w-4xl mx-auto px-5 md:px-8">
            <div class="text-center mb-10 reveal reveal-fade">
              <p class="text-[#0066FF] text-xs font-bold tracking-[0.25em] uppercase mb-2">PRICING</p>
              <h2 class="text-2xl md:text-3xl font-bold text-gray-900 text-words">
                {area.name} {treatment.name} 비용·가격 안내
              </h2>
              <p class="text-gray-400 text-sm mt-3">투명한 비용, 추가비용 없는 정찰가</p>
            </div>

            <div class="premium-card overflow-hidden">
              <table class="w-full" itemscope itemtype="https://schema.org/PriceSpecification">
                <thead class="bg-[#0066FF]/5">
                  <tr>
                    <th class="text-left px-5 py-3.5 text-xs font-bold text-gray-700 tracking-wider">진료 항목</th>
                    <th class="text-right px-5 py-3.5 text-xs font-bold text-[#0066FF] tracking-wider">가격</th>
                    <th class="text-left px-5 py-3.5 text-xs font-bold text-gray-500 tracking-wider hidden sm:table-cell">비고</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                  {pricingData.rows.map((row, idx) => (
                    <tr class="hover:bg-gray-50 transition-colors">
                      <td class="px-5 py-3.5 text-sm font-semibold text-gray-900" itemprop="name">{row.item}</td>
                      <td class="px-5 py-3.5 text-sm font-black text-[#0066FF] text-right tabular-nums" itemprop="price">{row.price}</td>
                      <td class="px-5 py-3.5 text-xs text-gray-500 hidden sm:table-cell">{row.note || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {pricingData.insurance && (
              <div class="mt-5 p-4 bg-emerald-50 border-l-4 border-emerald-500 rounded-r-lg">
                <p class="text-sm text-emerald-800">
                  <i class="fa-solid fa-shield-heart mr-1.5 text-emerald-600"></i>
                  <strong>건강보험 안내:</strong> {pricingData.insurance}
                </p>
              </div>
            )}

            <p class="mt-5 text-xs text-gray-500 leading-relaxed">
              {matrixContent.pricingNote}
            </p>

            <div class="mt-8 text-center">
              <a href="/reservation" class="btn-premium btn-premium-fill" data-cursor-hover>
                <i class="fa-solid fa-calculator mr-1.5"></i> {area.name} {treatment.name} 정확한 견적 무료 상담
              </a>
            </div>
          </div>
        </div>
      )}

      {/* 🚀 v2: 6가지 선택 이유 (Long-form 콘텐츠) */}
      <div class="section-lg bg-white">
        <div class="max-w-5xl mx-auto px-5 md:px-8">
          <div class="text-center mb-12 reveal reveal-fade">
            <p class="text-[#0066FF] text-xs font-bold tracking-[0.25em] uppercase mb-2">WHY CHOOSE US</p>
            <h2 class="text-2xl md:text-3xl font-bold text-gray-900 text-words">
              {area.name} 분들이 {treatment.name}을(를) 위해 서울365치과를 선택하는 6가지 이유
            </h2>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5 stagger-children">
            {matrixContent.whyChoosePoints.map((point, idx) => (
              <div class="premium-card p-6 group hover:border-[#0066FF]/15 transition-all">
                <div class="flex items-start gap-4">
                  <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0066FF] to-[#2979FF] flex items-center justify-center flex-shrink-0 text-white font-black text-sm">
                    {idx + 1}
                  </div>
                  <div class="flex-1">
                    <h3 class="font-bold text-gray-900 mb-2">{point.title}</h3>
                    <p class="text-sm text-gray-500 leading-relaxed">{point.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 🚀 v2: 사후 관리 안내 + 비교 가이드 */}
      <div class="bg-gradient-to-br from-blue-50/30 to-white py-16 md:py-20">
        <div class="max-w-4xl mx-auto px-5 md:px-8">
          <div class="grid md:grid-cols-2 gap-8">
            {/* 사후 관리 */}
            <div class="premium-card p-7 reveal reveal-fade">
              <div class="flex items-center gap-3 mb-5">
                <div class="w-11 h-11 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <i class="fa-solid fa-heart-pulse text-emerald-500 text-lg"></i>
                </div>
                <h3 class="font-bold text-gray-900 text-lg">{area.name} {treatment.name} 사후 관리</h3>
              </div>
              <ul class="space-y-3">
                {matrixContent.aftercareTips.map(tip => (
                  <li class="flex items-start gap-2.5 text-sm text-gray-600 leading-relaxed">
                    <i class="fa-solid fa-check text-emerald-500 mt-1 text-xs"></i>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
            {/* 비교 가이드 */}
            <div class="premium-card p-7 reveal reveal-fade">
              <div class="flex items-center gap-3 mb-5">
                <div class="w-11 h-11 rounded-xl bg-[#0066FF]/10 flex items-center justify-center">
                  <i class="fa-solid fa-scale-balanced text-[#0066FF] text-lg"></i>
                </div>
                <h3 class="font-bold text-gray-900 text-lg">{area.name} {treatment.name} 치과 비교 가이드</h3>
              </div>
              <p class="text-sm text-gray-600 leading-relaxed mb-5">
                {matrixContent.comparisonNote}
              </p>
              <a href={`/treatments/${treatment.slug}`} class="text-[#0066FF] text-sm font-bold hover:underline">
                {treatment.name} 자세히 보기 →
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 🚀 v2: 실제 후기 (Review JSON-LD 강화) */}
      <div class="section-lg bg-mesh">
        <div class="max-w-5xl mx-auto px-5 md:px-8">
          <div class="text-center mb-12 reveal reveal-fade">
            <p class="text-[#0066FF] text-xs font-bold tracking-[0.25em] uppercase mb-2">REVIEWS</p>
            <h2 class="text-2xl md:text-3xl font-bold text-gray-900 text-words">
              {area.name} 거주 환자 후기
            </h2>
            <p class="text-gray-400 text-sm mt-3">★★★★★ 4.9/5 ({CLINIC.reviewCount || '2,150'}개 리뷰 기준)</p>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-5 stagger-children">
            {matrixContent.reviewQuotes.map((review, idx) => (
              <div class="premium-card p-6" itemscope itemtype="https://schema.org/Review">
                <meta itemprop="itemReviewed" content={`${area.name} ${treatment.name} - 서울365치과의원`} />
                <div class="flex items-center gap-1 mb-3" itemprop="reviewRating" itemscope itemtype="https://schema.org/Rating">
                  <meta itemprop="ratingValue" content="5" />
                  <meta itemprop="bestRating" content="5" />
                  {[1, 2, 3, 4, 5].map(() => (
                    <i class="fa-solid fa-star text-yellow-400 text-xs"></i>
                  ))}
                </div>
                <p class="text-sm text-gray-700 leading-relaxed mb-4" itemprop="reviewBody">
                  "{review.text}"
                </p>
                <div class="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span class="text-xs font-bold text-gray-800" itemprop="author" itemscope itemtype="https://schema.org/Person">
                    <span itemprop="name">{review.name}</span>
                  </span>
                  <time class="text-xs text-gray-400" itemprop="datePublished" datetime={review.date}>{review.date}</time>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ — 지역×진료 맞춤 */}
      <div class="section-lg bg-mesh">
        <div class="max-w-3xl mx-auto px-5 md:px-8">
          <div class="text-center mb-12 reveal reveal-fade">
            <p class="text-[#0066FF] text-xs font-bold tracking-[0.25em] uppercase mb-2">FAQ</p>
            <h2 class="text-2xl md:text-3xl font-bold text-gray-900 text-words">
              {area.name} {treatment.name} 자주 묻는 질문
            </h2>
          </div>
          <div class="space-y-3 stagger-children" itemscope itemtype="https://schema.org/FAQPage">
            {matrixFaq.map(faq => (
              <div class="premium-card overflow-hidden" itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
                <button class="faq-toggle w-full text-left p-5 flex items-start gap-3 group" aria-expanded="false">
                  <span class="w-6 h-6 rounded-lg bg-[#0066FF]/8 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <i class="fa-solid fa-plus text-[#0066FF] text-xs faq-icon transition-transform duration-300"></i>
                  </span>
                  <span class="font-semibold text-gray-900 text-sm flex-1" itemprop="name">{faq.q}</span>
                </button>
                <div class="faq-content hidden px-5 pb-5 pl-14" itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
                  <p class="text-sm text-gray-500 leading-relaxed whitespace-pre-line" itemprop="text">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 같은 지역의 다른 진료 — 내부 링크 폭격 */}
      <div class="bg-white py-16 md:py-20">
        <div class="max-w-6xl mx-auto px-5 md:px-8">
          <div class="text-center mb-10 reveal reveal-fade">
            <p class="text-[#0066FF] text-xs font-bold tracking-[0.25em] uppercase mb-2">{area.name.toUpperCase()}</p>
            <h2 class="text-xl md:text-2xl font-bold text-gray-900">
              {area.name}에서 받을 수 있는 다른 진료
            </h2>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 stagger-children">
            {otherTreatmentsInArea.map(o => (
              <a href={o.url}
                 class="premium-card p-4 group hover:border-[#0066FF]/15 transition-all block"
                 data-cursor-hover
                 title={`${area.name} ${o.info.name}`}>
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-[#0066FF]/8 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <i class={`fa-solid ${o.info.icon} text-[#0066FF]`}></i>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="font-bold text-gray-900 text-sm group-hover:text-[#0066FF] transition-colors truncate">
                      {area.name} {o.info.name}
                    </p>
                    <p class="text-[10px] text-gray-400 truncate">{o.info.tagline}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* 같은 진료의 다른 지역 — 내부 링크 폭격 */}
      <div class="bg-gray-50 py-16 md:py-20">
        <div class="max-w-6xl mx-auto px-5 md:px-8">
          <div class="text-center mb-10 reveal reveal-fade">
            <p class="text-[#0066FF] text-xs font-bold tracking-[0.25em] uppercase mb-2">NEARBY</p>
            <h2 class="text-xl md:text-2xl font-bold text-gray-900">
              다른 지역의 {treatment.name} 안내
            </h2>
            <p class="text-gray-400 text-sm mt-2">인천 전 지역에서 가까운 {treatment.name} 전문 치과</p>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 stagger-children">
            {otherAreasForTreatment.map(a => (
              <a href={`/area/${a.slug}/${treatment.slug}`}
                 class="premium-card p-3 text-center group hover:border-[#0066FF]/15 transition-all block"
                 data-cursor-hover
                 title={`${a.name} ${treatment.name}`}>
                <p class="font-semibold text-gray-900 text-sm group-hover:text-[#0066FF] transition-colors">
                  {a.name} {treatment.name}
                </p>
                <p class="text-[10px] text-gray-400 mt-0.5">{a.distKm}km · {a.travelMin}분</p>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* 🚀 v2: 롱테일 페이지 링크 (비용/추천/후기/이벤트/잘하는곳/야간 6분기) */}
      <div class="bg-white py-16">
        <div class="max-w-5xl mx-auto px-5 md:px-8">
          <div class="text-center mb-10 reveal reveal-fade">
            <p class="text-[#0066FF] text-xs font-bold tracking-[0.25em] uppercase mb-2">DEEP DIVE</p>
            <h2 class="text-xl md:text-2xl font-bold text-gray-900">
              {area.name} {treatment.name} 더 자세히 알아보기
            </h2>
            <p class="text-gray-400 text-xs md:text-sm mt-2">궁금한 주제를 클릭하세요</p>
          </div>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-3 stagger-children">
            {MATRIX_VARIANTS.map(v => (
              <a href={`/area/${area.slug}/${treatment.slug}/${v.slug}`}
                 class="premium-card p-5 group hover:border-[#0066FF]/20 transition-all block text-center"
                 data-cursor-hover
                 title={`${area.name} ${treatment.name} ${v.name}`}>
                <div class="w-10 h-10 rounded-xl bg-[#0066FF]/8 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <i class="fa-solid fa-arrow-right text-[#0066FF] text-sm"></i>
                </div>
                <p class="font-bold text-gray-900 text-sm group-hover:text-[#0066FF] transition-colors">
                  {area.name} {treatment.name} {v.name}
                </p>
                <p class="text-[10px] text-gray-400 mt-1">{v.heading}</p>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div class="bg-gradient-to-r from-[#040B18] to-[#0A1628] py-16 text-center">
        <div class="max-w-2xl mx-auto px-5 reveal reveal-fade">
          <h2 class="text-2xl font-bold text-white mb-3">
            {area.name}에서 가장 가까운 {treatment.name} 전문 치과
          </h2>
          <p class="text-white/40 text-sm mb-8">
            {area.travelDesc} · 서울대 5인 원장 · 365일 야간21시 · 자체 기공실
          </p>
          <div class="flex flex-wrap justify-center gap-3">
            <a href="/reservation" class="btn-premium btn-premium-fill ripple-effect" data-cursor-hover>
              <i class="fa-solid fa-calendar-check mr-1.5"></i> {treatment.name} 상담 예약
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
      title: meta.seoTitle,
      description: meta.seoDesc,
      canonical: canonicalUrl,
      keywords: meta.keywords.join(', '),
      jsonLd: [
        // Breadcrumb
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "홈", "item": "https://seoul365dc.kr" },
            { "@type": "ListItem", "position": 2, "name": "지역 안내", "item": "https://seoul365dc.kr/area" },
            { "@type": "ListItem", "position": 3, "name": `${area.name}치과`, "item": `https://seoul365dc.kr/area/${area.slug}` },
            { "@type": "ListItem", "position": 4, "name": `${area.name} ${treatment.name}`, "item": canonicalUrl },
          ],
        },
        // LocalBusiness with area + medical procedure
        {
          "@context": "https://schema.org",
          "@type": "Dentist",
          "name": `서울365치과의원 - ${area.name} ${treatment.name}`,
          "alternateName": `Seoul 365 Dental - ${area.name} ${treatment.name}`,
          "url": canonicalUrl,
          "telephone": CLINIC.phone,
          "image": "https://seoul365dc.kr/static/og-image.png",
          "priceRange": "₩₩",
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
              "@type": "AdministrativeArea",
              "name": `인천광역시 ${area.gu} ${area.name}`,
            },
            {
              "@type": "GeoCircle",
              "geoMidpoint": {
                "@type": "GeoCoordinates",
                "latitude": area.lat,
                "longitude": area.lng,
              },
              "geoRadius": "3000",
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
          "medicalSpecialty": "Dentistry",
          "availableService": {
            "@type": "MedicalProcedure",
            "name": treatment.name,
            "alternateName": [`${area.name} ${treatment.name}`, `${area.gu} ${treatment.name}`, `인천 ${treatment.name}`],
            "url": `https://seoul365dc.kr/treatments/${treatment.slug}`,
            "description": treatment.metaDesc,
          },
        },
        // MedicalProcedure 자체
        {
          "@context": "https://schema.org",
          "@type": "MedicalProcedure",
          "name": `${area.name} ${treatment.name}`,
          "alternateName": treatment.name,
          "description": meta.seoDesc,
          "url": canonicalUrl,
          "procedureType": "https://schema.org/TherapeuticProcedure",
          "performer": {
            "@type": "Dentist",
            "name": "서울365치과의원",
            "url": "https://seoul365dc.kr",
          },
        },
        // FAQPage
        {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": matrixFaq.map(faq => ({
            "@type": "Question",
            "name": faq.q,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": faq.a,
            },
          })),
        },
        // MedicalWebPage
        {
          "@context": "https://schema.org",
          "@type": "MedicalWebPage",
          "name": meta.seoTitle,
          "description": meta.seoDesc,
          "url": canonicalUrl,
          "inLanguage": "ko-KR",
          "isPartOf": { "@id": "https://seoul365dc.kr/#website" },
          "about": {
            "@type": "MedicalCondition",
            "name": `${treatment.name} 진료`,
            "associatedAnatomy": { "@type": "AnatomicalStructure", "name": "치아" },
          },
          "specialty": {
            "@type": "MedicalSpecialty",
            "name": "Dentistry",
          },
          "lastReviewed": new Date().toISOString().split('T')[0],
          "mainContentOfPage": {
            "@type": "WebPageElement",
            "cssSelector": "h1",
          },
          "speakable": {
            "@type": "SpeakableSpecification",
            "cssSelector": ["h1", "h2", "[itemprop='articleBody']"],
          },
        },
        // 🚀 v2: Article (블로그형 본문 강화)
        {
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": `${area.name} ${treatment.name} 안내 - 서울365치과`,
          "description": meta.seoDesc,
          "image": "https://seoul365dc.kr/static/og-image.png",
          "datePublished": "2025-01-01",
          "dateModified": new Date().toISOString().split('T')[0],
          "author": {
            "@type": "Organization",
            "name": "서울365치과의원",
            "url": "https://seoul365dc.kr",
          },
          "publisher": {
            "@type": "Organization",
            "name": "서울365치과의원",
            "logo": {
              "@type": "ImageObject",
              "url": "https://seoul365dc.kr/static/logo-v2.png",
            },
          },
          "mainEntityOfPage": canonicalUrl,
          "articleBody": matrixContent.introParagraphs.join('\n\n'),
          "wordCount": matrixContent.introParagraphs.join(' ').length,
          "inLanguage": "ko-KR",
          "isAccessibleForFree": true,
          "keywords": matrixContent.longTailKeywords.join(', '),
        },
        // 🚀 v2: HowTo 스키마 (진료 과정 풍부한 리치 결과)
        {
          "@context": "https://schema.org",
          "@type": "HowTo",
          "name": `${area.name} ${treatment.name} 진행 과정`,
          "description": `${area.name} 거주 환자분의 ${treatment.name} 진료 진행 절차 안내`,
          "image": "https://seoul365dc.kr/static/og-image.png",
          "totalTime": treatment.slug === 'orthodontics' || treatment.slug === 'invisalign' ? "P18M" : treatment.slug === 'implant' || treatment.slug === 'full-implant' ? "P3M" : "PT1H",
          "tool": [
            { "@type": "HowToTool", "name": "디지털 X-ray·CT" },
            { "@type": "HowToTool", "name": "네비게이션 가이드" },
            { "@type": "HowToTool", "name": "자체 기공실 보철" },
          ],
          "step": matrixContent.processGuide.map((p, i) => ({
            "@type": "HowToStep",
            "position": p.step,
            "name": p.title,
            "text": p.desc,
            "url": `${canonicalUrl}#step-${p.step}`,
          })),
        },
        // 🚀 v2: OfferCatalog (가격표 구조화)
        ...(pricingData ? [{
          "@context": "https://schema.org",
          "@type": "OfferCatalog",
          "name": `${area.name} ${treatment.name} 비용 안내`,
          "url": canonicalUrl,
          "itemListElement": pricingData.rows.map((row, i) => ({
            "@type": "Offer",
            "position": i + 1,
            "name": row.item,
            "price": row.price.replace(/[^\d]/g, '') || "0",
            "priceCurrency": "KRW",
            "description": row.note || '',
            "availability": "https://schema.org/InStock",
            "url": canonicalUrl,
            "seller": {
              "@type": "Dentist",
              "name": "서울365치과의원",
            },
          })),
        }] : []),
        // 🚀 v2: Place (지역 강조)
        {
          "@context": "https://schema.org",
          "@type": "Place",
          "name": `${area.name} - ${treatment.name} 진료 지역`,
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": area.lat,
            "longitude": area.lng,
          },
          "containedInPlace": {
            "@type": "AdministrativeArea",
            "name": `인천광역시 ${area.gu}`,
          },
        },
      ],
    }
  )
})

// ============================================================
// 🚀 v2 SUPER UPGRADE — 롱테일 변형 페이지
// /area/:areaSlug/:treatmentSlug/:variantSlug
// 18지역 × 10진료 × 6변형 = 1,080개 추가 페이지
// "구월동 임플란트 비용", "송도 인비절라인 추천" 등 롱테일 키워드 완전 장악
// ============================================================
areaRoutes.get('/area/:areaSlug/:treatmentSlug/:variantSlug', (c) => {
  const areaSlug = c.req.param('areaSlug');
  const treatmentSlug = c.req.param('treatmentSlug');
  const variantSlug = c.req.param('variantSlug') as MatrixVariantSlug;

  const area = getAreaBySlug(areaSlug);
  const treatment = getTreatmentBySlug(treatmentSlug);
  const validVariant = MATRIX_VARIANTS.some(v => v.slug === variantSlug);

  if (!area || !treatment || !MATRIX_TREATMENT_SLUGS.includes(treatmentSlug as any) || !validVariant) {
    return c.notFound();
  }

  const variantMeta = buildVariantMeta(area, treatment, variantSlug);
  if (!variantMeta) return c.notFound();

  const matrixContent = buildMatrixContent(area, treatment);
  const pricingData = TREATMENT_PRICING[treatmentSlug as keyof typeof TREATMENT_PRICING];
  const v = variantMeta.variant;
  const parentMeta = buildAreaTreatmentMeta(area, treatment);

  // 변형별 콘텐츠 선택
  const renderVariantContent = () => {
    if (v.slug === 'cost') {
      return (
        <>
          {/* 가격표 강조 페이지 */}
          {pricingData && (
            <div class="bg-white py-12 md:py-16">
              <div class="max-w-4xl mx-auto px-5 md:px-8">
                <div class="text-center mb-8">
                  <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                    {area.name} {treatment.name} 가격표 (2026년 기준)
                  </h2>
                  <p class="text-gray-500 text-sm">투명한 정찰가, 추가비용 없음</p>
                </div>
                <div class="premium-card overflow-hidden">
                  <table class="w-full">
                    <thead class="bg-[#0066FF]/5">
                      <tr>
                        <th class="text-left px-5 py-4 text-sm font-bold text-gray-800">진료 항목</th>
                        <th class="text-right px-5 py-4 text-sm font-bold text-[#0066FF]">{area.name} 가격</th>
                        <th class="text-left px-5 py-4 text-sm font-bold text-gray-500 hidden sm:table-cell">비고</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100">
                      {pricingData.rows.map(row => (
                        <tr class="hover:bg-gray-50">
                          <td class="px-5 py-4 text-sm font-semibold text-gray-900">{row.item}</td>
                          <td class="px-5 py-4 text-base font-black text-[#0066FF] text-right tabular-nums">{row.price}</td>
                          <td class="px-5 py-4 text-xs text-gray-500 hidden sm:table-cell">{row.note || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {pricingData.insurance && (
                  <div class="mt-6 p-5 bg-emerald-50 border-l-4 border-emerald-500 rounded-r-lg">
                    <p class="text-sm text-emerald-800">
                      <strong>💚 건강보험 안내:</strong> {pricingData.insurance}
                    </p>
                  </div>
                )}
                <div class="mt-6 p-5 bg-amber-50 border-l-4 border-amber-500 rounded-r-lg">
                  <p class="text-sm text-amber-800">
                    <strong>⚠️ 주의:</strong> {area.name} {treatment.name} 비용은 환자 상태에 따라 달라질 수 있습니다.
                    정확한 견적은 무료 진단 후 안내드립니다. 추가비용은 미리 모두 설명드린 후 진행됩니다.
                  </p>
                </div>
              </div>
            </div>
          )}
        </>
      );
    }
    if (v.slug === 'review') {
      return (
        <div class="bg-white py-12 md:py-16">
          <div class="max-w-4xl mx-auto px-5 md:px-8">
            <div class="text-center mb-10">
              <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                {area.name} {treatment.name} 실제 환자 후기
              </h2>
              <p class="text-gray-500 text-sm">★★★★★ 4.9/5 · 누적 2,150+ 후기</p>
            </div>
            <div class="grid md:grid-cols-2 gap-5">
              {matrixContent.reviewQuotes.map(r => (
                <div class="premium-card p-6">
                  <div class="flex items-center gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map(() => <i class="fa-solid fa-star text-yellow-400 text-sm"></i>)}
                  </div>
                  <p class="text-gray-700 leading-relaxed mb-4 text-[15px]">"{r.text}"</p>
                  <div class="flex justify-between items-center pt-3 border-t border-gray-100 text-xs">
                    <span class="font-bold text-gray-800">{r.name}</span>
                    <time class="text-gray-400">{r.date}</time>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }
    if (v.slug === 'event') {
      return (
        <div class="bg-gradient-to-br from-rose-50/50 to-white py-12 md:py-16">
          <div class="max-w-4xl mx-auto px-5 md:px-8">
            <div class="text-center mb-10">
              <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                {area.name} {treatment.name} 진행 중 이벤트
              </h2>
              <p class="text-gray-500 text-sm">한정 수량 · 예약 선착순</p>
            </div>
            <div class="space-y-5">
              {(pricingData?.rows || []).slice(0, 3).map((row, i) => (
                <div class="premium-card p-6 flex items-center gap-5">
                  <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                    <i class="fa-solid fa-fire text-white text-xl"></i>
                  </div>
                  <div class="flex-1">
                    <p class="text-xs text-rose-500 font-bold mb-1">{area.name} 한정 이벤트</p>
                    <h3 class="font-bold text-gray-900 text-lg mb-1">{row.item}</h3>
                    <p class="text-xs text-gray-500">{row.note || ''}</p>
                  </div>
                  <div class="text-right">
                    <p class="text-2xl font-black text-rose-500">{row.price}</p>
                    <p class="text-[10px] text-gray-400">이벤트가</p>
                  </div>
                </div>
              ))}
            </div>
            <p class="text-center text-sm text-gray-500 mt-8">
              ※ 이벤트는 상황에 따라 변동될 수 있습니다. 정확한 진행 여부는 ☎ 032-432-0365 또는 카카오 상담으로 확인하세요.
            </p>
          </div>
        </div>
      );
    }
    if (v.slug === 'night') {
      return (
        <div class="bg-gradient-to-br from-indigo-50/30 to-white py-12 md:py-16">
          <div class="max-w-4xl mx-auto px-5 md:px-8">
            <div class="text-center mb-10">
              <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                {area.name} {treatment.name} 야간진료 안내
              </h2>
              <p class="text-gray-500 text-sm">평일 21시 · 일요일·공휴일 진료</p>
            </div>
            <div class="premium-card p-7">
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div><div class="text-3xl font-black text-[#0066FF]">21<span class="text-base">시</span></div><p class="text-xs text-gray-500 mt-1">월~목 야간</p></div>
                <div><div class="text-3xl font-black text-[#0066FF]">19<span class="text-base">시</span></div><p class="text-xs text-gray-500 mt-1">금요일</p></div>
                <div><div class="text-3xl font-black text-emerald-500">14<span class="text-base">시</span></div><p class="text-xs text-gray-500 mt-1">토요일</p></div>
                <div><div class="text-3xl font-black text-rose-500">18<span class="text-base">시</span></div><p class="text-xs text-gray-500 mt-1">일·공휴일</p></div>
              </div>
              <p class="text-center text-sm text-gray-600 mt-6 leading-relaxed">
                {area.name} 거주 직장인·학생을 위해 365일 진료합니다. 퇴근 후·주말에도 부담 없이 {treatment.name} 치료받으세요.
              </p>
            </div>
          </div>
        </div>
      );
    }
    // recommend, best — 동일한 풀 본문 사용
    return (
      <div class="bg-white py-12 md:py-16">
        <div class="max-w-4xl mx-auto px-5 md:px-8">
          <div class="text-center mb-10">
            <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              {area.name} {treatment.name} {v.heading}
            </h2>
          </div>
          <div class="prose prose-lg max-w-none space-y-5 text-gray-700">
            {matrixContent.introParagraphs.map(p => <p class="text-[15px]">{p}</p>)}
          </div>
          <div class="mt-10 grid md:grid-cols-2 gap-4">
            {matrixContent.whyChoosePoints.slice(0, 6).map((p, idx) => (
              <div class="premium-card p-5">
                <h3 class="font-bold text-gray-900 mb-2 text-sm">{idx + 1}. {p.title}</h3>
                <p class="text-xs text-gray-500 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return c.render(
    <section class="min-h-screen">
      {/* Hero */}
      <div class="hero-premium" style="min-height:45vh">
        <div class="hero-grid"></div>
        <div class="orb orb-1"></div>
        <div class="relative z-10 max-w-4xl mx-auto px-5 text-center" style="padding-top:14vh">
          <div class="inline-flex items-center gap-2 flex-wrap justify-center bg-white/[0.06] backdrop-blur-sm border border-white/[0.08] rounded-full px-4 py-1.5 mb-6">
            <a href="/area" class="text-white/40 text-xs">지역</a>
            <i class="fa-solid fa-chevron-right text-white/20 text-[8px]"></i>
            <a href={`/area/${area.slug}`} class="text-white/50 text-xs">{area.name}</a>
            <i class="fa-solid fa-chevron-right text-white/20 text-[8px]"></i>
            <a href={`/area/${area.slug}/${treatment.slug}`} class="text-white/60 text-xs">{treatment.name}</a>
            <i class="fa-solid fa-chevron-right text-white/20 text-[8px]"></i>
            <span class="text-[#00E5FF] text-xs font-bold">{v.name}</span>
          </div>
          <h1 class="text-3xl md:text-4xl font-black text-white mb-4">
            {area.name} {treatment.name} {v.heading}
          </h1>
          <p class="text-white/40 text-sm max-w-xl mx-auto mb-8">
            서울365치과 · {area.distKm === 0 ? '도보 3분' : `${area.travelMin}분`} · 서울대 전문의 5인 협진
          </p>
          <div class="flex flex-wrap justify-center gap-3">
            <a href="/reservation" class="btn-premium btn-premium-fill">
              <i class="fa-solid fa-calendar-check mr-1.5"></i> 무료 상담
            </a>
            <a href={CLINIC.phoneTel} class="btn-premium btn-premium-white">
              <i class="fa-solid fa-phone mr-1.5"></i> {CLINIC.phone}
            </a>
          </div>
        </div>
      </div>

      {/* 변형별 콘텐츠 */}
      {renderVariantContent()}

      {/* 다른 변형 / 부모 매트릭스로 돌아가기 */}
      <div class="bg-gray-50 py-12">
        <div class="max-w-4xl mx-auto px-5 md:px-8">
          <div class="text-center mb-8">
            <h3 class="text-lg font-bold text-gray-900">{area.name} {treatment.name} 다른 정보 보기</h3>
          </div>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
            <a href={`/area/${area.slug}/${treatment.slug}`} class="premium-card p-4 text-center hover:border-[#0066FF]/15">
              <i class="fa-solid fa-circle-info text-[#0066FF] mb-2"></i>
              <p class="text-sm font-bold text-gray-900">전체 안내</p>
            </a>
            {MATRIX_VARIANTS.filter(o => o.slug !== v.slug).slice(0, 5).map(o => (
              <a href={`/area/${area.slug}/${treatment.slug}/${o.slug}`} class="premium-card p-4 text-center hover:border-[#0066FF]/15">
                <i class="fa-solid fa-arrow-right text-[#0066FF] mb-2"></i>
                <p class="text-sm font-bold text-gray-900">{o.name}</p>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div class="bg-gradient-to-r from-[#040B18] to-[#0A1628] py-12 text-center">
        <div class="max-w-2xl mx-auto px-5">
          <h2 class="text-xl font-bold text-white mb-3">{area.name} {treatment.name} 상담 받기</h2>
          <div class="flex flex-wrap justify-center gap-3">
            <a href="/reservation" class="btn-premium btn-premium-fill">예약하기</a>
            <a href={CLINIC.phoneTel} class="btn-premium btn-premium-white">{CLINIC.phone}</a>
          </div>
        </div>
      </div>
    </section>,
    {
      title: variantMeta.seoTitle,
      description: variantMeta.seoDesc,
      canonical: variantMeta.canonical,
      keywords: [...variantMeta.keywords, ...parentMeta.keywords].slice(0, 30).join(', '),
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "홈", "item": "https://seoul365dc.kr" },
            { "@type": "ListItem", "position": 2, "name": "지역", "item": "https://seoul365dc.kr/area" },
            { "@type": "ListItem", "position": 3, "name": `${area.name}치과`, "item": `https://seoul365dc.kr/area/${area.slug}` },
            { "@type": "ListItem", "position": 4, "name": `${area.name} ${treatment.name}`, "item": `https://seoul365dc.kr/area/${area.slug}/${treatment.slug}` },
            { "@type": "ListItem", "position": 5, "name": v.name, "item": variantMeta.canonical },
          ],
        },
        {
          "@context": "https://schema.org",
          "@type": "MedicalWebPage",
          "name": variantMeta.seoTitle,
          "description": variantMeta.seoDesc,
          "url": variantMeta.canonical,
          "inLanguage": "ko-KR",
          "about": { "@type": "MedicalCondition", "name": `${treatment.name} ${v.name}` },
          "lastReviewed": new Date().toISOString().split('T')[0],
        },
      ],
    }
  );
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
      a: `임플란트 비용은 사용 재료(오스템, 스트라우만, 메가젠 등)와 환자분의 상태에 따라 달라집니다. 서울365치과는 자체 기공실 보유로 합리적인 가격을 제공하며, CT 촬영 후 정확한 상담을 받으실 수 있습니다. ☎ 032-432-0365`,
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
              <a href={`/area/${area.slug}/${t.slug}`}
                 class="premium-card p-6 group hover:border-[#0066FF]/15 transition-all flex items-start gap-4 block"
                 data-cursor-hover
                 title={`${area.name} ${t.name}`}>
                <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0066FF]/8 to-[#2979FF]/8 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <i class={`fa-solid ${t.icon} text-[#0066FF] text-lg`}></i>
                </div>
                <div>
                  <h3 class="font-bold text-gray-900 group-hover:text-[#0066FF] transition-colors">
                    {area.name} {t.name}
                  </h3>
                  <p class="text-sm text-gray-500 mt-1">{t.shortDesc}</p>
                  <span class="inline-flex items-center text-xs text-[#0066FF] font-medium mt-2">
                    {area.name} {t.name} 안내 <i class="fa-solid fa-arrow-right ml-1 text-[10px] group-hover:translate-x-1 transition-transform"></i>
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* 🎯 SEO 매트릭스 — {area.name}의 모든 진료 (인덱싱용 골든 그리드) */}
      <div class="bg-gradient-to-b from-gray-50 to-white py-16 md:py-20">
        <div class="max-w-6xl mx-auto px-5 md:px-8">
          <div class="text-center mb-10 reveal reveal-fade">
            <p class="text-[#0066FF] text-xs font-bold tracking-[0.25em] uppercase mb-2">{area.name.toUpperCase()} ALL TREATMENTS</p>
            <h2 class="text-2xl md:text-3xl font-bold text-gray-900 text-words">
              {area.name}에서 가능한 진료 한눈에
            </h2>
            <p class="text-gray-400 text-sm mt-3">
              {area.name}에서 {area.distKm === 0 ? '도보 3분' : `${area.travelMin}분`} 거리 · 모든 진료 가능
            </p>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 stagger-children">
            {MATRIX_TREATMENT_SLUGS.map(tSlug => {
              const info = MATRIX_TREATMENT_INFO[tSlug];
              return (
                <a href={`/area/${area.slug}/${tSlug}`}
                   class="premium-card p-4 text-center group hover:border-[#0066FF]/20 transition-all block"
                   data-cursor-hover
                   title={`${area.name} ${info.name}`}>
                  <div class="w-10 h-10 rounded-xl bg-[#0066FF]/8 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                    <i class={`fa-solid ${info.icon} text-[#0066FF] text-sm`}></i>
                  </div>
                  <p class="font-bold text-gray-900 text-xs group-hover:text-[#0066FF] transition-colors">
                    {area.name} {info.name}
                  </p>
                  <p class="text-[10px] text-gray-400 mt-0.5 truncate">{info.tagline}</p>
                </a>
              );
            })}
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
