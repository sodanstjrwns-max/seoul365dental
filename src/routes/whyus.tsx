// ============================================================
// 🚀 v4 SUPER UPGRADE — Why Choose Us (Weapon 13)
// 2026-10-15: 타 의료기관 비교(✕ 일반치과 열)·순위·평점 표기 삭제 — 의료법 제56조(비교 광고) 남동구보건소 민원 정정
// ============================================================
import { Hono } from 'hono';
import type { Bindings } from '../lib/types';

const app = new Hono<{ Bindings: Bindings }>();
const SITE_URL = 'https://seoul365dc.kr';

const DIFFERENTIATORS = [
  { feature: '진료 시간', us: '평일 21시 야간진료 + 일/공휴일 14~18시 진료', icon: 'clock' },
  { feature: '의료진', us: '서울대 치과대학 출신 5인 협진 (전문의 3인 포함)', icon: 'user-md' },
  { feature: '시설 규모', us: '400평+ · 6개 독립 수술실 · 자체 기공실', icon: 'hospital' },
  { feature: '진료 시스템', us: '디지털 CT + 네비게이션 가이드 + 아이테로 3D 스캔', icon: 'magic' },
  { feature: '감염 관리', us: '에어샤워 · 진료실별 멸균 시스템 · CDC 기준', icon: 'shield-virus' },
  { feature: '수면진료', us: '마취과 전문의 직접 진정관리', icon: 'bed' },
  { feature: '진료 분야', us: '임플란트·교정·소아·심미·수면진료 전 분야 원스톱', icon: 'th' },
  { feature: '접근성', us: '예술회관역 5번 출구 도보 3분 · 지하주차장', icon: 'subway' },
  { feature: '응급 대응', us: '365일 진료로 휴일 응급환자 대응 가능', icon: 'briefcase-medical' },
];

const COMPARISONS_VS_GENERAL = {
  slug: 'why-seoul365',
  title: '서울365치과를 선택하는 이유 — 진료 환경 9가지',
  description: '서울365치과의 진료 시간, 의료진, 시설, 진료 시스템, 접근성 등 진료 환경 9가지를 안내합니다.',
};

app.get('/why-us', (c) => {
  const canonicalUrl = `${SITE_URL}/why-us`;

  // 중복 Dentist(@id 없음·잘못된 주소·별점) 스키마 제거 — 병원 엔티티는 전역 #dentist (2026-09-29)

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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <section class="hero-premium" style="min-height:45vh">
        <div class="hero-grid"></div>
        <div class="orb orb-1"></div>
        <div class="orb orb-2"></div>
        <div class="relative z-10 max-w-4xl mx-auto px-5 pt-20 pb-16 text-center">
          <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs mb-4">
            <i class="fas fa-circle-info"></i> 구월동 예술회관역 · 365일 진료
          </div>
          <h1 class="text-4xl md:text-5xl font-black gradient-text-white leading-tight mb-4">
            왜 서울365치과인가?
          </h1>
          <p class="text-white/60 text-lg max-w-2xl mx-auto">
            서울365치과의 <strong class="text-yellow-300">진료 환경 9가지</strong>를 안내합니다
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
                </div>
              </div>
            ))}
          </div>

          <div class="mt-12 grid md:grid-cols-3 gap-4">
            <div class="text-center p-6 rounded-2xl bg-blue-600 text-white">
              <div class="text-4xl font-black mb-1">5<span class="text-2xl">인</span></div>
              <div class="text-sm opacity-90">서울대 치과대학 출신 원장 협진</div>
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
            <h2 class="text-2xl font-bold text-gray-900 mb-4 text-center">서울대 치과대학 출신 의료진 협진</h2>
            <p class="text-gray-700 leading-relaxed text-center mb-6">
              서울365치과는 임플란트, 보존과, 교정과 등 분야별 원장이 협진하여,
              여러 분야가 함께 필요한 경우에도 한 병원에서 진단과 치료 계획을 함께 세웁니다.
            </p>
            <div class="grid grid-cols-2 md:grid-cols-6 gap-3 text-center">
              <div class="p-3 bg-white rounded-xl">
                <div class="font-bold text-gray-900">박준규</div>
                <div class="text-xs text-gray-500">대표원장 · 임플란트</div>
              </div>
              <div class="p-3 bg-white rounded-xl">
                <div class="font-bold text-gray-900">최다빈</div>
                <div class="text-xs text-gray-500">임플란트·심미</div>
              </div>
              <div class="p-3 bg-white rounded-xl">
                <div class="font-bold text-gray-900">정문희</div>
                <div class="text-xs text-gray-500">보존과 전문의</div>
              </div>
              <div class="p-3 bg-white rounded-xl">
                <div class="font-bold text-gray-900">상세훈</div>
                <div class="text-xs text-gray-500">보철</div>
              </div>
              <div class="p-3 bg-white rounded-xl">
                <div class="font-bold text-gray-900">하누리</div>
                <div class="text-xs text-gray-500">교정과 전문의</div>
              </div>
              <div class="p-3 bg-white rounded-xl">
                <div class="font-bold text-gray-900">차해나</div>
                <div class="text-xs text-gray-500">보철·심미</div>
              </div>
            </div>
          </div>

          <div class="mt-12 p-6 bg-blue-50 rounded-2xl text-center">
            <h3 class="text-2xl font-bold text-gray-900 mb-3">상담 예약 안내</h3>
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
      title: '서울365치과를 선택하는 이유 — 진료 환경 9가지 | 인천 구월동',
      description: '서울365치과 진료 환경 안내: 365일 진료, 서울대 출신 5인 협진, 400평+ 시설, 6개 수술실, 자체 기공실, 마취과 전문의 협진 수면진료.',
      keywords: '서울365치과, 구월동 치과, 서울대 출신 치과의사, 인천 365일 치과, 자체 기공실',
      canonical: canonicalUrl,
      ogImage: `${SITE_URL}/static/og-image.jpg`,
    }
  );
});

export default app;
