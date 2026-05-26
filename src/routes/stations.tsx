// ============================================================
// 🎯 v3 SUPER UPGRADE — Station/Landmark Pages
// "예술회관역 임플란트", "인천시청 치과" 등 역세권 키워드 타겟
// ============================================================
import { Hono } from 'hono'
import type { Bindings } from '../lib/types'
import { STATIONS, getStationBySlug, type StationInfo } from '../data/stations'
import { MATRIX_TREATMENT_INFO, TREATMENT_PRICING } from '../data/area-treatment'
import { CLINIC } from '../data/clinic'

const stationsRoutes = new Hono<{ Bindings: Bindings }>()

// 인덱스: /stations
stationsRoutes.get('/stations', (c) => {
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "홈", "item": "https://seoul365dc.kr" },
      { "@type": "ListItem", "position": 2, "name": "역·랜드마크 안내", "item": "https://seoul365dc.kr/stations" },
    ]
  };

  return c.render(
    <section class="min-h-screen bg-white">
      <div class="hero-premium" style="min-height:50vh">
        <div class="hero-grid"></div>
        <div class="orb orb-1"></div>
        <div class="orb orb-2"></div>
        <div class="relative z-10 max-w-4xl mx-auto px-5 text-center" style="padding-top:16vh">
          <p class="text-[#00E5FF] text-xs font-bold tracking-[0.3em] uppercase mb-4 reveal reveal-fade">STATIONS & LANDMARKS</p>
          <h1 class="text-3xl md:text-5xl font-black text-white mb-4 reveal reveal-fade text-split" style="transition-delay:0.2s">
            지하철역·랜드마크별 길안내
          </h1>
          <p class="text-white/40 text-sm md:text-base max-w-2xl mx-auto reveal reveal-fade" style="transition-delay:0.4s">
            예술회관역에서 도보 3분 — 인천 주요 역·랜드마크에서 서울365치과까지 안내
          </p>
        </div>
      </div>

      <div class="max-w-5xl mx-auto px-5 md:px-8 py-16">
        <div class="grid md:grid-cols-2 gap-4">
          {STATIONS.map(st => (
            <a href={`/stations/${st.slug}`} class="block p-6 rounded-2xl border border-gray-100 hover:border-[#0066FF]/30 hover:shadow-lg transition-all bg-white">
              <div class="flex items-center gap-3 mb-3">
                <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0066FF] to-[#2979FF] flex items-center justify-center">
                  <i class={`fa-solid ${st.line.includes('호선') ? 'fa-train-subway' : 'fa-location-dot'} text-white text-sm`}></i>
                </div>
                <div>
                  <h2 class="font-bold text-gray-900">{st.name}</h2>
                  <p class="text-xs text-gray-400">{st.line}</p>
                </div>
              </div>
              <div class="text-sm text-gray-600 leading-relaxed">
                <i class="fa-solid fa-route text-[#0066FF] mr-1"></i>
                서울365치과까지 {st.travelDesc} ({st.travelMin}분)
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>,
    {
      title: '지하철역·랜드마크별 길안내 | 서울365치과',
      description: '예술회관역 5번 출구 도보 3분. 인천시청역, 간석오거리역, 인천종합터미널, 롯데백화점 등 주요 역·랜드마크에서 서울365치과까지의 길안내.',
      canonical: 'https://seoul365dc.kr/stations',
      keywords: STATIONS.flatMap(s => s.keywords).join(', '),
      jsonLd: [breadcrumb],
    }
  );
});

// 역별 페이지: /stations/:slug
stationsRoutes.get('/stations/:slug', (c) => {
  const slug = c.req.param('slug');
  const st = getStationBySlug(slug);
  if (!st) return c.notFound();

  const canonicalUrl = `https://seoul365dc.kr/stations/${slug}`;
  const otherStations = STATIONS.filter(s => s.slug !== slug).slice(0, 4);

  // Place + DentistAtLocation Schema
  const placeSchema = {
    "@context": "https://schema.org",
    "@type": "Place",
    "name": `${st.name} 인근 치과 - 서울365치과`,
    "url": canonicalUrl,
    "description": `${st.name}에서 서울365치과까지 ${st.travelDesc}.`,
    "containsPlace": {
      "@type": "Dentist",
      "@id": "https://seoul365dc.kr/#dentist",
      "name": "서울365치과의원",
    },
    "geo": { "@type": "GeoCoordinates", "latitude": "37.4482", "longitude": "126.7042" },
  };

  // E-E-A-T MedicalWebPage
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    "@id": `${canonicalUrl}#article`,
    "headline": `${st.name} 근처 치과 - 서울365치과 길안내`,
    "description": `${st.name}에서 서울365치과까지 ${st.travelDesc}.`,
    "url": canonicalUrl,
    "datePublished": "2025-01-01",
    "dateModified": "2026-05-26",
    "inLanguage": "ko-KR",
    "specialty": { "@type": "MedicalSpecialty", "name": "Dentistry" },
    "author": { "@type": "MedicalOrganization", "@id": "https://seoul365dc.kr/#dentist", "name": "서울365치과의원" },
    "reviewedBy": {
      "@type": "Person",
      "name": "박준규",
      "jobTitle": "대표원장",
      "worksFor": { "@type": "MedicalOrganization", "@id": "https://seoul365dc.kr/#dentist" },
      "alumniOf": { "@type": "EducationalOrganization", "name": "서울대학교 치과대학" },
    },
    "lastReviewed": "2026-05-26",
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "홈", "item": "https://seoul365dc.kr" },
      { "@type": "ListItem", "position": 2, "name": "역·랜드마크 안내", "item": "https://seoul365dc.kr/stations" },
      { "@type": "ListItem", "position": 3, "name": st.name, "item": canonicalUrl },
    ]
  };

  // 진료 추천
  const recommendTreatments = ['implant', 'invisalign', 'sedation', 'full-implant'];

  return c.render(
    <section class="min-h-screen bg-white">
      <div class="hero-premium" style="min-height:50vh">
        <div class="hero-grid"></div>
        <div class="orb orb-1"></div>
        <div class="relative z-10 max-w-4xl mx-auto px-5 text-center" style="padding-top:14vh">
          <p class="text-[#00E5FF] text-xs font-bold tracking-[0.3em] uppercase mb-4 reveal reveal-fade">{st.line}</p>
          <h1 class="text-2xl md:text-4xl font-black text-white mb-4 reveal reveal-fade text-split" style="transition-delay:0.2s">
            {st.name}에서 치과 가기
          </h1>
          <p class="text-white/60 text-sm md:text-base reveal reveal-fade" style="transition-delay:0.4s">
            서울365치과까지 <span class="text-[#00E5FF] font-bold">{st.travelDesc}</span> ({st.travelMin}분)
          </p>
        </div>
      </div>

      <article class="max-w-3xl mx-auto px-5 md:px-8 py-16">
        <nav class="text-xs text-gray-400 mb-6">
          <a href="/" class="hover:text-[#0066FF]">홈</a> <span class="mx-2">›</span>
          <a href="/stations" class="hover:text-[#0066FF]">역·랜드마크</a> <span class="mx-2">›</span>
          <span class="text-gray-700">{st.name}</span>
        </nav>

        {/* 핵심 정보 박스 */}
        <div class="p-6 rounded-2xl bg-gradient-to-br from-[#E6F3FF] to-[#F0F8FF] border border-[#0066FF]/10 mb-10">
          <div class="grid md:grid-cols-3 gap-4">
            <div>
              <div class="text-xs text-gray-500 mb-1">소요 시간</div>
              <div class="text-2xl font-black text-[#0066FF]">{st.travelMin}분</div>
            </div>
            <div>
              <div class="text-xs text-gray-500 mb-1">이동 방법</div>
              <div class="font-bold text-gray-900">{st.travelDesc}</div>
            </div>
            <div>
              <div class="text-xs text-gray-500 mb-1">지역</div>
              <div class="font-bold text-gray-900">{st.area}</div>
            </div>
          </div>
        </div>

        {/* 본문 */}
        <div class="prose prose-lg max-w-none mb-10">
          <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <i class="fa-solid fa-route text-[#0066FF]"></i>
            {st.name}에서 서울365치과 가는 길
          </h2>
          <p class="text-gray-700 leading-loose mb-4">
            {st.name}에서 인천 구월동에 위치한 서울365치과까지는 {st.travelDesc}이면 도착하실 수 있습니다.
            서울365치과는 인천 구월동 예술로 138 이토타워 2층 212호에 위치하고 있으며,
            예술회관역 5번 출구에서 도보 3분 거리의 최적의 입지를 자랑합니다.
          </p>
          <p class="text-gray-700 leading-loose mb-4">
            <strong>{st.name} 인근에서 치과를 찾으시는 분</strong>들에게 서울365치과는 다음과 같은 장점을 제공합니다:
          </p>
          <ul class="space-y-2 text-gray-700 mb-6">
            <li class="flex items-start gap-2"><i class="fa-solid fa-check text-[#0066FF] mt-1.5 text-xs"></i> 365일 진료 — 평일 야간 21시, 토요일 14시, 일·공휴일 14~18시</li>
            <li class="flex items-start gap-2"><i class="fa-solid fa-check text-[#0066FF] mt-1.5 text-xs"></i> 서울대학교 치과대학 출신 5인 원장 협진</li>
            <li class="flex items-start gap-2"><i class="fa-solid fa-check text-[#0066FF] mt-1.5 text-xs"></i> 자체 기공실 보유 — 빠른 보철 제작</li>
            <li class="flex items-start gap-2"><i class="fa-solid fa-check text-[#0066FF] mt-1.5 text-xs"></i> 임플란트·인비절라인·수면진료·전체임플란트 전문</li>
            <li class="flex items-start gap-2"><i class="fa-solid fa-check text-[#0066FF] mt-1.5 text-xs"></i> 무료 주차장 완비</li>
          </ul>
        </div>

        {/* 추천 진료 */}
        <h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <i class="fa-solid fa-tooth text-[#0066FF]"></i>
          {st.name} 인근 주민이 많이 찾는 진료
        </h2>
        <div class="grid md:grid-cols-2 gap-4 mb-12">
          {recommendTreatments.map(tslug => {
            const info = MATRIX_TREATMENT_INFO[tslug as keyof typeof MATRIX_TREATMENT_INFO];
            const pricing = TREATMENT_PRICING[tslug];
            if (!info) return null;
            return (
              <a href={`/treatments/${tslug}`} class="block p-6 rounded-2xl border border-gray-100 hover:border-[#0066FF]/30 hover:shadow-lg transition-all">
                <div class="flex items-center gap-3 mb-3">
                  <i class={`fa-solid ${info.icon} text-[#0066FF] text-2xl`}></i>
                  <div>
                    <h3 class="font-bold text-gray-900">{info.name}</h3>
                    <p class="text-xs text-gray-400">{info.tagline}</p>
                  </div>
                </div>
                {pricing && pricing.items?.[0] && (
                  <div class="text-sm text-gray-600">
                    가격: <span class="font-bold text-[#0066FF]">{pricing.items[0].price.toLocaleString()}원~</span>
                  </div>
                )}
              </a>
            );
          })}
        </div>

        {/* 키워드 */}
        <div class="flex flex-wrap gap-2 mb-10">
          {st.keywords.map(kw => (
            <span class="px-3 py-1 rounded-full bg-gray-100 text-xs text-gray-600">#{kw}</span>
          ))}
        </div>

        {/* 다른 역·랜드마크 */}
        <div class="mb-10">
          <h2 class="text-lg font-bold text-gray-900 mb-4">다른 역·랜드마크</h2>
          <div class="grid md:grid-cols-2 gap-3">
            {otherStations.map(s => (
              <a href={`/stations/${s.slug}`} class="block p-4 rounded-xl border border-gray-100 hover:border-[#0066FF]/30 hover:bg-gray-50 transition-all">
                <div class="text-sm font-bold text-gray-900">{s.name}에서 치과 가기</div>
                <div class="text-xs text-gray-500 mt-1">{s.travelDesc} ({s.travelMin}분)</div>
              </a>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div class="p-8 rounded-3xl bg-gradient-to-br from-[#0066FF] to-[#2979FF] text-white text-center">
          <h3 class="text-xl md:text-2xl font-black mb-2">{st.name} 인근 치과 찾으세요?</h3>
          <p class="text-white/80 text-sm mb-5">서울365치과 무료 상담 받아보세요.</p>
          <div class="flex flex-wrap justify-center gap-2">
            <a href="/reservation" class="px-5 py-3 rounded-xl bg-white text-[#0066FF] font-bold text-sm hover:scale-105 transition-all">
              <i class="fa-solid fa-calendar-check mr-1.5"></i> 무료 상담 예약
            </a>
            <a href={CLINIC.phoneTel} class="px-5 py-3 rounded-xl bg-white/10 border border-white/30 text-white font-bold text-sm hover:bg-white/20 transition-all">
              <i class="fa-solid fa-phone mr-1.5"></i> {CLINIC.phone}
            </a>
          </div>
        </div>
      </article>
    </section>,
    {
      title: `${st.name} 근처 치과 - 서울365치과 (${st.travelDesc}) | 임플란트·교정`,
      description: `${st.name}에서 서울365치과까지 ${st.travelDesc} (${st.travelMin}분). 서울대 출신 5인 원장, 365일·야간21시 진료. 임플란트·인비절라인·수면진료 전문. ☎ ${CLINIC.phone}`,
      canonical: canonicalUrl,
      keywords: st.keywords.join(', '),
      ogType: 'article',
      datePublished: '2025-01-01',
      dateModified: '2026-05-26',
      jsonLd: [placeSchema, articleSchema, breadcrumb],
    }
  );
});

export default stationsRoutes
