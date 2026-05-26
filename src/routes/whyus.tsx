// ============================================================
// 🚀 v4 SUPER UPGRADE — Why Choose Us (Weapon 13)
// 365치과 vs 일반치과 차별화 — 브랜드 키워드 강화
// ============================================================
import { Hono } from 'hono';
import type { Bindings } from '../lib/types';

const app = new Hono<{ Bindings: Bindings }>();
const SITE_URL = 'https://seoul365dc.kr';

const DIFFERENTIATORS = [
  { feature: '진료 시간', us: '평일 21시 야간진료 + 일/공휴일 14~18시 진료', them: '평일 18~19시 마감, 주말 휴진', icon: 'clock' },
  { feature: '의료진', us: '서울대 치과대학 출신 5인 협진 (전문의 3인 포함)', them: '단독 또는 2~3인 진료', icon: 'user-md' },
  { feature: '시설 규모', us: '400평+ · 6개 독립 수술실 · 자체 기공실', them: '평균 30~100평 · 외주 기공', icon: 'hospital' },
  { feature: '진료 시스템', us: '디지털 CT + 네비게이션 가이드 + 아이테로 3D 스캔', them: '기본 파노라마 + 본뜨기', icon: 'magic' },
  { feature: '감염 관리', us: '에어샤워 · 진료실별 멸균 시스템 · CDC 기준', them: '기본 멸균', icon: 'shield-virus' },
  { feature: '수면진료', us: '마취과 전문의 직접 진정관리', them: '대부분 미운영 또는 외부 마취과 출장', icon: 'bed' },
  { feature: '진료 분야', us: '임플란트·교정·소아·심미·수면진료 전 분야 원스톱', them: '특정 분야 위주', icon: 'th' },
  { feature: '환자 후기', us: '누적 평점 4.9/5.0 · 2,150+ 리뷰', them: '검증 어려움', icon: 'star' },
  { feature: '접근성', us: '예술회관역 5번 출구 도보 3분 · 지하주차장', them: '주차 불편 · 역에서 도보 10분 이상', icon: 'subway' },
  { feature: '응급 대응', us: '365일 진료로 휴일 응급환자 대응 가능', them: '평일만 가능', icon: 'briefcase-medical' },
];

const COMPARISONS_VS_GENERAL = {
  slug: 'why-seoul365',
  title: '왜 서울365치과인가? — 인천 일반 치과와의 10가지 차이',
  description: '서울365치과가 인천 일반 치과와 다른 10가지 핵심 차별점. 진료 시간, 의료진, 시설, 시스템, 후기까지 한눈에 비교.',
};

app.get('/why-us', (c) => {
  const canonicalUrl = `${SITE_URL}/why-us`;

  const dentistSchema = {
    '@context': 'https://schema.org',
    '@type': 'Dentist',
    name: '서울365치과의원',
    url: SITE_URL,
    description: '인천 남동구 구월동 예술회관역 5번 출구 도보 3분. 서울대 출신 5인 협진 · 400평+ 시설 · 365일 진료 · 평점 4.9/5.0',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '인천 남동구 인하로507번길 7 9층',
      addressLocality: '인천광역시',
      addressRegion: '남동구',
      postalCode: '21577',
      addressCountry: 'KR',
    },
    telephone: '+82-32-432-0365',
    priceRange: '₩₩',
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: '진료 분야',
      itemListElement: [
        { '@type': 'Offer', itemOffered: { '@type': 'MedicalProcedure', name: '임플란트' } },
        { '@type': 'Offer', itemOffered: { '@type': 'MedicalProcedure', name: '인비절라인' } },
        { '@type': 'Offer', itemOffered: { '@type': 'MedicalProcedure', name: '교정치료' } },
        { '@type': 'Offer', itemOffered: { '@type': 'MedicalProcedure', name: '수면진료' } },
        { '@type': 'Offer', itemOffered: { '@type': 'MedicalProcedure', name: '소아치과' } },
      ],
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: 4.9,
      bestRating: 5,
      worstRating: 1,
      reviewCount: 2156,
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '홈', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: '왜 서울365치과인가?', item: canonicalUrl },
    ],
  };

  return c.render(
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(dentistSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <section class="hero-premium" style="min-height:45vh">
        <div class="hero-grid"></div>
        <div class="orb orb-1"></div>
        <div class="orb orb-2"></div>
        <div class="relative z-10 max-w-4xl mx-auto px-5 pt-20 pb-16 text-center">
          <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs mb-4">
            <i class="fas fa-medal"></i> 인천 1위 치과 — 평점 4.9/5.0
          </div>
          <h1 class="text-4xl md:text-5xl font-black gradient-text-white leading-tight mb-4">
            왜 서울365치과인가?
          </h1>
          <p class="text-white/60 text-lg max-w-2xl mx-auto">
            인천 일반 치과와 서울365치과의 <strong class="text-yellow-300">10가지 명확한 차이</strong>
          </p>
        </div>
      </section>

      <section class="bg-white py-12">
        <div class="max-w-5xl mx-auto px-5">
          <div class="grid md:grid-cols-2 gap-4">
            {DIFFERENTIATORS.map((d, i) => (
              <div class="p-5 rounded-2xl bg-gradient-to-br from-blue-50 to-white border border-blue-100">
                <div class="flex items-center gap-3 mb-3">
                  <div class="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center">
                    <i class={`fas fa-${d.icon}`}></i>
                  </div>
                  <h3 class="font-bold text-gray-900">{d.feature}</h3>
                </div>
                <div class="space-y-2 text-sm">
                  <div class="flex gap-2 p-2 rounded-lg bg-green-50 border border-green-200">
                    <span class="text-green-600 font-bold flex-shrink-0">✓ 서울365</span>
                    <span class="text-gray-700">{d.us}</span>
                  </div>
                  <div class="flex gap-2 p-2 rounded-lg bg-gray-50">
                    <span class="text-gray-400 font-bold flex-shrink-0">✕ 일반치과</span>
                    <span class="text-gray-500">{d.them}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div class="mt-12 grid md:grid-cols-3 gap-4">
            <div class="text-center p-6 rounded-2xl bg-blue-600 text-white">
              <div class="text-4xl font-black mb-1">4.9<span class="text-2xl">/5</span></div>
              <div class="text-sm opacity-90">누적 평점 (2,156+ 리뷰)</div>
            </div>
            <div class="text-center p-6 rounded-2xl bg-gray-900 text-white">
              <div class="text-4xl font-black mb-1">400<span class="text-2xl">평+</span></div>
              <div class="text-sm opacity-90">대형 진료 공간 · 6개 수술실</div>
            </div>
            <div class="text-center p-6 rounded-2xl bg-green-600 text-white">
              <div class="text-4xl font-black mb-1">365<span class="text-2xl">일</span></div>
              <div class="text-sm opacity-90">평일 야간 · 주말·공휴일 진료</div>
            </div>
          </div>

          <div class="mt-12 p-8 bg-gray-50 rounded-2xl border border-gray-100">
            <h2 class="text-2xl font-bold text-gray-900 mb-4 text-center">서울대 치과대학 출신 5인 협진</h2>
            <p class="text-gray-700 leading-relaxed text-center mb-6">
              일반 치과는 보통 1~3인의 치과의사가 모든 분야를 진료합니다. 서울365치과는 임플란트, 보존과, 교정과 등 분야별 전문의 5명이 협진하므로,
              복잡한 케이스도 한 병원에서 원스톱으로 해결 가능합니다.
            </p>
            <div class="grid grid-cols-2 md:grid-cols-5 gap-3 text-center">
              <div class="p-3 bg-white rounded-xl">
                <div class="font-bold text-gray-900">박준규</div>
                <div class="text-xs text-gray-500">대표원장 · 임플란트</div>
              </div>
              <div class="p-3 bg-white rounded-xl">
                <div class="font-bold text-gray-900">최다빈</div>
                <div class="text-xs text-gray-500">심미·소아</div>
              </div>
              <div class="p-3 bg-white rounded-xl">
                <div class="font-bold text-gray-900">정문희</div>
                <div class="text-xs text-gray-500">보존과 전문의</div>
              </div>
              <div class="p-3 bg-white rounded-xl">
                <div class="font-bold text-gray-900">상세훈</div>
                <div class="text-xs text-gray-500">보철·임플란트</div>
              </div>
              <div class="p-3 bg-white rounded-xl">
                <div class="font-bold text-gray-900">하누리</div>
                <div class="text-xs text-gray-500">교정과 전문의</div>
              </div>
            </div>
          </div>

          <div class="mt-12 p-6 bg-blue-50 rounded-2xl text-center">
            <h3 class="text-2xl font-bold text-gray-900 mb-3">차이를 직접 확인해보세요</h3>
            <p class="text-gray-600 mb-5">초진 상담 무료 · 비용 안내 투명</p>
            <div class="flex flex-wrap justify-center gap-3">
              <a href="tel:032-432-0365" class="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700">
                <i class="fas fa-phone"></i> 032-432-0365
              </a>
              <a href="/reservation" class="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-blue-600 text-blue-600 rounded-full font-bold hover:bg-blue-50">
                <i class="fas fa-calendar"></i> 온라인 예약
              </a>
            </div>
          </div>
        </div>
      </section>
    </>,
    {
      title: '왜 서울365치과인가? — 인천 일반 치과와의 10가지 차이 | 평점 4.9/5.0',
      description: '서울365치과가 인천 일반 치과와 다른 10가지 차이: 365일 진료, 서울대 5인 협진, 400평+ 시설, 6개 수술실, 자체 기공실, 마취과 전문의 협진. 평점 4.9/5.0, 2,150+ 리뷰.',
      keywords: '서울365치과 차별점, 인천 1위 치과, 365치과 vs 일반치과, 구월동 치과 추천, 서울대 출신 치과의사, 인천 임플란트 잘하는곳',
      canonical: canonicalUrl,
      ogImage: `${SITE_URL}/static/og-image.jpg`,
    }
  );
});

export default app;
