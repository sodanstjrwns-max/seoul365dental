// ============================================================
// 🚀 v6 D-Tier — High-Intent Commercial Landing Pages
// 검색 의도 강한 상업 키워드 타겟팅 페이지
// - /prices/[treatment]  : 가격비교 랜딩 (인천 임플란트 가격, 교정 비용 등)
// - /emergency           : 당일 응급 진료 (응급치과, 당일 임플란트)
// - /night-clinic        : 야간 치과 (구월동 야간치과, 21시 진료)
// ============================================================
import { Hono } from 'hono';
import type { Bindings } from '../lib/types';
import { CLINIC } from '../data/clinic';

const app = new Hono<{ Bindings: Bindings }>();
const SITE_URL = 'https://seoul365dc.kr';

// ────────────────────────────────────────────────
// 가격 비교 데이터 (실제 서울365치과 진료비 기준)
// ────────────────────────────────────────────────
type PriceTier = { name: string; price: string; range: string; features: string[]; recommended?: boolean };
type PricePage = {
  slug: string;
  title: string;
  h1: string;
  description: string;
  intro: string;
  tiers: PriceTier[];
  factors: string[];
  faqs: Array<{ q: string; a: string }>;
};

const PRICE_PAGES: Record<string, PricePage> = {
  '임플란트': {
    slug: '임플란트',
    title: '인천 임플란트 가격 비교 2026 — 구월동 서울365치과',
    h1: '인천 임플란트 가격 — 정직한 비용 안내',
    description: '인천 구월동 임플란트 가격 비교. 오스템 90만원~, 스트라우만 180만원~, 메가젠 130만원~. 보험 적용·할부·진료비 투명 공개. 서울대 출신 5인 협진.',
    intro: '서울365치과는 임플란트 비용을 투명하게 공개합니다. 환자 잇몸·뼈 상태, 사용 제품, 보철물 종류에 따라 가격이 달라지며, 정확한 견적은 무료 1:1 상담 후 안내해드립니다.',
    tiers: [
      {
        name: '오스템 SOI (국산)',
        price: '90만원~',
        range: '90~120만원 / 1개',
        features: ['국내 점유율 1위 임플란트', '평균 10년+ 임상 데이터', '재료비 부담 최소', '식립 + 보철 포함'],
      },
      {
        name: '메가젠 (국산 프리미엄)',
        price: '130만원~',
        range: '130~160만원 / 1개',
        features: ['국산 프리미엄 라인', '얇은 잇몸·앞니 심미 영역 권장', '식립 + 보철 포함', '평생 보증 적용'],
        recommended: true,
      },
      {
        name: '스트라우만 (스위스 수입)',
        price: '180만원~',
        range: '180~250만원 / 1개',
        features: ['세계 1위 프리미엄 임플란트', '뼈이식 동시 식립 가능', '40년+ 임상 데이터', '평생 무상 A/S'],
      },
    ],
    factors: [
      '잇몸뼈 상태 — 뼈이식 동반 시 30~80만원 추가',
      '치아 위치 — 어금니 vs 앞니 (심미 보철물 차이)',
      '보철물 재료 — PFM 크라운 vs 지르코니아',
      '국민건강보험 적용 — 만 65세 이상 평생 2개까지 약 50% 할인',
      '브릿지 vs 단일 식립 — 인접치 상태에 따라 결정',
    ],
    faqs: [
      { q: '인천 임플란트 가격이 병원마다 왜 다른가요?', a: '제품(국산/수입), 의료진 경력, 시설·장비(CT·네비게이션 가이드), 보철물 재료(PFM/지르코니아), 식립 후 평생 A/S 보증 여부에 따라 큰 차이가 납니다. 서울365치과는 모든 견적을 명세서로 투명하게 안내합니다.' },
      { q: '임플란트 비용에 보험 적용이 되나요?', a: '만 65세 이상은 국민건강보험 임플란트 급여 대상으로 평생 2개까지 약 50% 할인됩니다. 또한 임플란트 무이자 할부 (최대 24개월), 카드 일시불 5% 할인 등 자체 혜택을 운영 중입니다.' },
      { q: '서울365치과의 임플란트 보장 기간은 어떻게 되나요?', a: '메가젠·스트라우만 라인은 평생 무상 보증을 제공하며, 식립 후 정기 점검(6개월 단위)을 무료로 진행합니다. 단, 흡연·구강위생 불량 등 환자 귀책 사유는 제외됩니다.' },
    ],
  },
  '교정': {
    slug: '교정',
    title: '인천 치아교정 비용 비교 2026 — 인비절라인 구월동 서울365치과',
    h1: '인천 치아교정 비용 — 메탈/세라믹/인비절라인 비교',
    description: '인천 구월동 치아교정 비용 비교. 메탈교정 350만원~, 세라믹 500만원~, 인비절라인 700만원~. 24개월 무이자 할부, 보철 전문의 상담.',
    intro: '치아교정은 환자의 부정교합 정도, 치료 기간, 장치 종류에 따라 비용이 크게 달라집니다. 서울365치과는 보철과 전문의가 직접 진단 후 가장 비용 효율적인 방법을 추천드립니다.',
    tiers: [
      {
        name: '메탈 교정 (기본)',
        price: '350만원~',
        range: '350~450만원 / 전체',
        features: ['브라켓·와이어 부착', '치료 기간 18~24개월', '가장 경제적인 옵션', '복잡한 케이스도 가능'],
      },
      {
        name: '세라믹 교정 (자연색)',
        price: '500만원~',
        range: '500~650만원 / 전체',
        features: ['치아색 브라켓 사용', '심미적 부담 감소', '치료 기간 18~24개월', '메탈 대비 1.5배'],
      },
      {
        name: '인비절라인 투명교정',
        price: '700만원~',
        range: '700~1,200만원 / 전체',
        features: ['투명 장치로 거의 보이지 않음', '식사·양치 시 탈착 가능', '7~10일마다 새 장치 교체', '인비절라인 다이아몬드 공식 인증 의원'],
        recommended: true,
      },
    ],
    factors: [
      '부정교합 정도 — 발치 필요 여부, 상하악 정도',
      '치료 기간 — 6개월(부분교정) ~ 36개월(복잡 케이스)',
      '연령대 — 성장기 청소년 vs 성인',
      '장치 종류 — 메탈/세라믹/투명/설측(혀쪽)',
      '유지장치 비용 — 별도 약 30~50만원',
    ],
    faqs: [
      { q: '인비절라인이 메탈 교정보다 효과가 떨어지나요?', a: '아닙니다. 최근 인비절라인 기술은 메탈 교정과 비슷한 케이스 80% 이상을 커버합니다. 단, 매우 심한 부정교합은 메탈 교정이 더 적합할 수 있어 정밀 진단이 필요합니다. 서울365치과는 인비절라인 다이아몬드 공식 인증 의원입니다.' },
      { q: '치아교정 24개월 무이자 할부가 가능한가요?', a: '네, 서울365치과는 신한·삼성·KB카드 24개월 무이자 할부를 운영합니다. 또한 형제·자매 동시 진행 시 가족 할인 10%를 적용합니다.' },
      { q: '교정 중간에 이사·전학 가면 어떻게 되나요?', a: '인비절라인은 디지털 데이터 기반이라 다른 인비절라인 인증의원으로 이관이 가능합니다. 메탈 교정의 경우 진료기록 사본을 발급해드리며, 이관 병원에서 추가 비용이 발생할 수 있습니다.' },
    ],
  },
  '라미네이트': {
    slug: '라미네이트',
    title: '인천 라미네이트 가격 — 구월동 서울365치과 심미보철',
    h1: '인천 라미네이트 가격 — 자연스러운 심미 보철',
    description: '인천 구월동 라미네이트 가격 비교. 일반 80만원~, 프리미엄 120만원~. 자체 기공실 운영으로 정밀 가공, 평생 무상 A/S.',
    intro: '라미네이트는 치아 앞면을 얇게 깎고 도자기를 부착하여 색·모양·치열을 동시 개선합니다. 서울365치과는 자체 기공실을 운영해 정밀 가공과 빠른 보철 제작이 가능합니다.',
    tiers: [
      { name: '일반 라미네이트 (e.max)', price: '80만원~', range: '80~100만원 / 1개', features: ['e.max 도자기 사용', '치아 1mm 미만 삭제', '평균 10년+ 유지', '평생 무상 A/S'] },
      { name: '프리미엄 라미네이트', price: '120만원~', range: '120~150만원 / 1개', features: ['독일 명장 기공 제작', '치아색 정밀 매칭', '심미 영역 (앞니 4~6개) 권장', '평생 무상 A/S'], recommended: true },
    ],
    factors: ['치아 갯수 — 보통 4~6개 (앞니 라인)', '도자기 재료 — e.max vs 자체 프리미엄', '치아 미백 동반 여부', '치아 정렬 상태 — 심한 경우 교정 선행 권장'],
    faqs: [
      { q: '라미네이트는 평생 가나요?', a: '평균 10~15년 유지되며, 충격이나 이갈이 등으로 파손될 경우 부분 교체가 가능합니다. 서울365치과는 평생 무상 A/S 정책을 운영합니다.' },
      { q: '라미네이트로 치아 색을 얼마나 밝게 할 수 있나요?', a: '도자기 색상은 1~16단계로 매우 세밀하게 선택 가능하며, 자연치보다 2~3단계 밝게 시술하는 것이 일반적입니다. 너무 하얗게 하면 부자연스러우므로 상담 후 결정합니다.' },
    ],
  },
  '레진': { slug: '레진', title: '인천 치아 레진 충전 가격 — 구월동 서울365치과', h1: '인천 레진 충전 가격', description: '인천 구월동 레진 충전 가격. 1면 8만원~, 2면 12만원~, 3면 18만원~. 보험 적용 가능 (만 12세 이하 어금니 광중합 레진).', intro: '레진 충전은 충치 부위를 제거하고 치아색 합성수지로 메우는 보존치료입니다.', tiers: [{ name: '레진 충전 1면', price: '8만원~', range: '8~12만원', features: ['소형 충치', '당일 시술', '치아색 자연스러움'] }, { name: '레진 충전 2면', price: '12만원~', range: '12~18만원', features: ['중간 크기 충치', '인접면 포함', '치아색 자연스러움'], recommended: true }, { name: '레진 충전 3면 이상', price: '18만원~', range: '18~25만원', features: ['큰 충치 / 인레이 비교 검토', '치아 보존 우선', '평생 무상 A/S'] }], factors: ['충치 깊이', '치아 위치', '보험 적용 여부 (만 12세 이하)'], faqs: [{ q: '레진 충전과 인레이 차이는?', a: '레진은 당일 직접 충전, 인레이는 본뜨고 별도 제작 후 부착하는 방식입니다. 충치가 클 경우 인레이가 더 견고합니다.' }] },
  '신경치료': { slug: '신경치료', title: '인천 신경치료 비용 — 구월동 서울365치과', h1: '인천 신경치료 비용', description: '인천 신경치료 비용. 보험 적용 시 본인부담 약 5~15만원, 비보험 30~50만원. 미세현미경 사용 정밀 치료.', intro: '신경치료는 충치가 신경까지 진행됐을 때 신경관을 청소·소독·충전하는 치료로, 대부분 국민건강보험 급여 적용 대상입니다.', tiers: [{ name: '앞니 신경치료', price: '5만원~', range: '본인부담 5~8만원', features: ['보험 적용', '1~2회 내원', '미세현미경 사용'] }, { name: '어금니 신경치료', price: '10만원~', range: '본인부담 10~15만원', features: ['보험 적용', '2~3회 내원', '신경관 3~4개'], recommended: true }, { name: '재신경치료', price: '30만원~', range: '비보험 30~50만원', features: ['기존 신경치료 실패 케이스', '미세현미경 필수', '재발률 낮음'] }], factors: ['치아 위치 (앞니/어금니)', '재치료 여부', '크라운 동반 여부'], faqs: [{ q: '신경치료 후 꼭 크라운을 씌워야 하나요?', a: '어금니는 거의 필수이며, 앞니는 충치 범위에 따라 다릅니다. 신경치료 후 치아가 약해지므로 크라운으로 보호해야 장기 유지됩니다.' }] },
  '크라운': { slug: '크라운', title: '인천 크라운 비용 — 구월동 서울365치과', h1: '인천 크라운(보철) 비용 비교', description: '인천 크라운 비용 비교. PFM 30만원~, 골드 60만원~, 지르코니아 50만원~. 자체 기공실 정밀 가공.', intro: '크라운은 신경치료 후 또는 큰 충치 후 치아를 씌우는 보철물입니다.', tiers: [{ name: 'PFM 크라운', price: '30만원~', range: '30~45만원', features: ['금속+도자기', '경제적', '평균 10년 유지'] }, { name: '지르코니아 크라운', price: '50만원~', range: '50~70만원', features: ['금속 무함유', '심미적', '평생 보증'], recommended: true }, { name: '골드 크라운', price: '60만원~', range: '60~80만원', features: ['최고 적합성', '어금니 권장', '20년+ 유지'] }], factors: ['치아 위치', '재료 (PFM/지르코니아/골드)', '심미성 vs 내구성 중점'], faqs: [{ q: '지르코니아가 PFM보다 좋은가요?', a: '심미성·금속 알레르기 없음·강도 모두 우수합니다. 단 비용이 약 1.5배 차이납니다.' }] },
  '치아미백': { slug: '치아미백', title: '인천 치아미백 가격 — 구월동 서울365치과', h1: '인천 치아미백 가격', description: '인천 치아미백 가격. 사무실 미백 30만원~, 자가 미백 키트 15만원~, 듀얼 미백 45만원~.', intro: '치아미백은 변색된 치아를 약제로 밝게 만드는 시술입니다.', tiers: [{ name: '자가 미백 (홈블리칭)', price: '15만원~', range: '15~20만원', features: ['맞춤 트레이 제작', '2~4주 매일 사용', '효과 점진적'] }, { name: '사무실 미백 (오피스)', price: '30만원~', range: '30~40만원', features: ['병원 1~2회 방문', '빠른 효과', '평균 6~10단계 밝아짐'], recommended: true }, { name: '듀얼 미백 (콤보)', price: '45만원~', range: '45~60만원', features: ['오피스 + 홈블리칭', '최대 효과', '유지 기간 길어짐'] }], factors: ['치아 변색 정도', '내인성 vs 외인성 변색', '미백 후 유지 관리'], faqs: [{ q: '치아미백 후 시린 증상이 생기나요?', a: '약 30% 환자에서 일시적 시림이 나타나며, 시술 후 3~7일 내 자연 호전됩니다. 지속 시 추가 처치가 가능합니다.' }] },
  '사랑니발치': { slug: '사랑니발치', title: '인천 사랑니 발치 비용 — 구월동 서울365치과', h1: '인천 사랑니 발치 비용', description: '인천 사랑니 발치 비용. 단순 발치 보험 적용 시 1~3만원, 매복 사랑니 5~15만원, 수면진정 동반 20~30만원 추가.', intro: '사랑니 발치는 사랑니의 위치·매복 정도에 따라 비용과 난이도가 크게 달라집니다.', tiers: [{ name: '단순 발치 (정상 맹출)', price: '1만원~', range: '본인부담 1~3만원', features: ['보험 적용', '국소마취', '당일 완료'] }, { name: '부분 매복 사랑니', price: '5만원~', range: '본인부담 5~10만원', features: ['보험 적용', '치아 분할 발치', '봉합 필요'], recommended: true }, { name: '완전 매복 + 수면진정', price: '20만원~', range: '20~30만원 추가', features: ['수면진정 동반', '구강악안면외과 전문의', 'CT 진단 필수'] }], factors: ['매복 정도 (완전/부분/없음)', '신경관과의 거리', '수면진정 동반 여부'], faqs: [{ q: '사랑니는 꼭 빼야 하나요?', a: '바르게 났고 양치가 잘 된다면 유지 가능하지만, 비스듬히 났거나 매복돼 있으면 충치·잇몸염증·인접치 손상 위험이 높아 발치를 권장합니다.' }] },
};

// ────────────────────────────────────────────────
// JSON-LD 빌더
// ────────────────────────────────────────────────
function buildPriceSchema(p: PricePage, url: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': url,
    name: p.title,
    description: p.description,
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: '홈', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: '가격 안내', item: `${SITE_URL}/prices` },
        { '@type': 'ListItem', position: 3, name: p.slug, item: url },
      ],
    },
    mainEntity: {
      '@type': 'FAQPage',
      mainEntity: p.faqs.map(f => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
  };
}

// ────────────────────────────────────────────────
// /prices — 가격 안내 인덱스
// ────────────────────────────────────────────────
app.get('/prices', (c) => {
  const canonicalUrl = `${SITE_URL}/prices`;
  return c.render(
    <>
      <section class="treatment-hero">
        <div class="relative z-10 max-w-[1400px] mx-auto px-5 md:px-8 py-28 md:py-36">
          <div class="text-emerald-400/80 text-sm font-bold mb-3 reveal" style="transition-delay:0.2s">PRICE GUIDE 2026</div>
          <h1 class="section-headline text-white mb-4 reveal" style="transition-delay:0.4s">인천 치과 진료 가격 안내</h1>
          <p class="hero-sub text-white/35 reveal" style="transition-delay:0.6s">서울365치과는 모든 진료비를 투명하게 공개합니다. 정확한 견적은 무료 1:1 상담 후 안내해드립니다.</p>
        </div>
      </section>

      <section class="section-lg bg-white">
        <div class="max-w-6xl mx-auto px-5 md:px-8">
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.values(PRICE_PAGES).map(p => (
              <a href={`/prices/${p.slug}`} class="block p-7 rounded-2xl bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 hover:shadow-xl hover:-translate-y-1 transition-all">
                <div class="text-emerald-500 text-xs font-bold mb-2">PRICE</div>
                <h2 class="text-xl font-black text-gray-900 mb-2">{p.slug}</h2>
                <p class="text-sm text-gray-500 mb-4">{p.tiers[0]?.price} 부터</p>
                <div class="text-emerald-600 text-sm font-bold">자세히 보기 →</div>
              </a>
            ))}
          </div>

          <div class="mt-16 p-8 rounded-2xl bg-gradient-to-r from-gray-900 to-gray-800 text-white">
            <h2 class="text-2xl font-black mb-3">정확한 비용은 무료 1:1 상담으로</h2>
            <p class="text-white/70 mb-5 text-sm">치아 상태에 따라 비용이 달라집니다. 서울대 출신 5인 전문의가 정밀 진단 후 정직한 견적을 안내드립니다.</p>
            <div class="flex gap-3">
              <a href={`tel:${CLINIC.phone}`} class="btn-premium btn-premium-fill"><i class="fa-solid fa-phone mr-2"></i>{CLINIC.phone}</a>
              <a href="/reservation" class="btn-premium btn-premium-white">예약 상담</a>
            </div>
          </div>
        </div>
      </section>
    </>,
    {
      title: '인천 치과 진료 가격 안내 2026 — 구월동 서울365치과',
      description: '인천 구월동 서울365치과의 진료 가격을 투명하게 안내합니다. 임플란트·교정·라미네이트·신경치료·크라운 등 항목별 비용과 차이점을 자세히 비교하세요.',
      canonicalUrl,
    }
  );
});

// ────────────────────────────────────────────────
// /prices/[treatment] — 항목별 가격 페이지
// ────────────────────────────────────────────────
app.get('/prices/:treatment', (c) => {
  const treatment = decodeURIComponent(c.req.param('treatment'));
  const page = PRICE_PAGES[treatment];
  if (!page) return c.notFound();

  const canonicalUrl = `${SITE_URL}/prices/${encodeURIComponent(treatment)}`;
  const schema = buildPriceSchema(page, canonicalUrl);

  return c.render(
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <section class="treatment-hero">
        <div class="relative z-10 max-w-[1400px] mx-auto px-5 md:px-8 py-28 md:py-36">
          <nav class="text-white/40 text-xs mb-6 reveal" style="transition-delay:0.2s">
            <a href="/" class="hover:text-white">홈</a> / <a href="/prices" class="hover:text-white">가격 안내</a> / <span class="text-white/60">{page.slug}</span>
          </nav>
          <div class="text-emerald-400/80 text-sm font-bold mb-3 reveal" style="transition-delay:0.3s">PRICE GUIDE · {page.slug.toUpperCase()}</div>
          <h1 class="section-headline text-white mb-4 reveal" style="transition-delay:0.4s">{page.h1}</h1>
          <p class="hero-sub text-white/35 reveal" style="transition-delay:0.6s">{page.intro}</p>
        </div>
      </section>

      {/* 가격 카드 */}
      <section class="section-lg bg-white">
        <div class="max-w-6xl mx-auto px-5 md:px-8">
          <h2 class="text-3xl font-black text-gray-900 mb-2">{page.slug} 종류별 비용</h2>
          <p class="text-gray-500 mb-10 text-sm">아래 가격은 표준 시술 기준이며, 환자 상태에 따라 변동될 수 있습니다.</p>

          <div class="grid md:grid-cols-3 gap-6">
            {page.tiers.map(tier => (
              <div class={`relative p-7 rounded-2xl border ${tier.recommended ? 'bg-gradient-to-br from-emerald-50 to-white border-emerald-300 shadow-xl' : 'bg-white border-gray-200'}`}>
                {tier.recommended && (
                  <div class="absolute -top-3 left-7 px-3 py-1 rounded-full bg-emerald-500 text-white text-xs font-bold">추천</div>
                )}
                <h3 class="text-xl font-black text-gray-900 mb-2">{tier.name}</h3>
                <div class="text-3xl font-black text-emerald-600 mb-1">{tier.price}</div>
                <div class="text-gray-400 text-xs mb-5">{tier.range}</div>
                <ul class="space-y-2">
                  {tier.features.map(f => (
                    <li class="text-sm text-gray-600 flex items-start gap-2">
                      <i class="fa-solid fa-check text-emerald-500 mt-1 text-xs"></i>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 가격 결정 요인 */}
      <section class="section-lg bg-gray-50">
        <div class="max-w-4xl mx-auto px-5 md:px-8">
          <h2 class="text-3xl font-black text-gray-900 mb-2">가격 결정 요인</h2>
          <p class="text-gray-500 mb-8 text-sm">왜 사람마다 견적이 다른지 핵심 요인을 알려드립니다.</p>
          <ul class="space-y-3">
            {page.factors.map((f, i) => (
              <li class="flex items-start gap-4 p-5 rounded-xl bg-white border border-gray-100">
                <div class="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 font-bold text-sm flex items-center justify-center flex-shrink-0">{i + 1}</div>
                <div class="text-gray-700 text-sm leading-relaxed">{f}</div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section class="section-lg bg-white">
        <div class="max-w-4xl mx-auto px-5 md:px-8">
          <h2 class="text-3xl font-black text-gray-900 mb-8">자주 묻는 질문</h2>
          <div class="space-y-4">
            {page.faqs.map(faq => (
              <details class="p-5 rounded-xl bg-gray-50 border border-gray-100 group">
                <summary class="font-bold text-gray-900 cursor-pointer flex items-center justify-between">
                  <span>{faq.q}</span>
                  <i class="fa-solid fa-chevron-down text-gray-400 group-open:rotate-180 transition"></i>
                </summary>
                <p class="text-gray-600 text-sm leading-relaxed mt-4">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section class="section-lg bg-gradient-to-r from-gray-900 to-gray-800">
        <div class="max-w-4xl mx-auto px-5 md:px-8 text-center">
          <h2 class="text-3xl md:text-4xl font-black text-white mb-4">정확한 {page.slug} 비용이 궁금하세요?</h2>
          <p class="text-white/60 mb-8">무료 1:1 상담으로 정직한 견적을 받아보세요. 서울대 출신 5인 협진.</p>
          <div class="flex justify-center gap-3 flex-wrap">
            <a href={`tel:${CLINIC.phone}`} class="btn-premium btn-premium-fill"><i class="fa-solid fa-phone mr-2"></i>{CLINIC.phone}</a>
            <a href="/reservation" class="btn-premium btn-premium-white">예약 상담</a>
            <a href="/kakao" class="btn-premium btn-premium-white">카카오 상담</a>
          </div>
        </div>
      </section>
    </>,
    {
      title: page.title,
      description: page.description,
      canonicalUrl,
    }
  );
});

// ────────────────────────────────────────────────
// /emergency — 응급/당일 진료
// ────────────────────────────────────────────────
app.get('/emergency', (c) => {
  const canonicalUrl = `${SITE_URL}/emergency`;
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'EmergencyService',
    name: '서울365치과 응급치과 — 당일 진료',
    url: canonicalUrl,
    telephone: CLINIC.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: CLINIC.address,
      addressLocality: '인천광역시 남동구',
      addressCountry: 'KR',
    },
    openingHoursSpecification: [
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '10:00', closes: '21:00' },
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Saturday'], opens: '10:00', closes: '18:00' },
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Sunday', 'PublicHolidays'], opens: '14:00', closes: '18:00' },
    ],
    description: '인천 구월동 응급치과. 365일 진료, 평일 21시까지 야간진료. 치통·외상·임플란트 응급 대응 가능.',
  };

  return c.render(
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <section class="treatment-hero">
        <div class="relative z-10 max-w-[1400px] mx-auto px-5 md:px-8 py-28 md:py-36">
          <div class="text-red-400 text-sm font-bold mb-3 reveal" style="transition-delay:0.2s"><i class="fa-solid fa-circle-exclamation mr-2"></i>EMERGENCY · 응급 진료</div>
          <h1 class="section-headline text-white mb-4 reveal" style="transition-delay:0.4s">인천 응급 치과 — 당일 진료 가능</h1>
          <p class="hero-sub text-white/35 reveal" style="transition-delay:0.6s">갑작스러운 치통·외상·임플란트 흔들림 — 서울365치과는 365일 진료로 응급 환자를 신속하게 대응합니다.</p>
          <div class="mt-8 flex gap-3 reveal" style="transition-delay:0.8s">
            <a href={`tel:${CLINIC.phone}`} class="btn-premium btn-premium-fill text-lg"><i class="fa-solid fa-phone mr-2"></i>지금 전화 {CLINIC.phone}</a>
          </div>
        </div>
      </section>

      <section class="section-lg bg-white">
        <div class="max-w-5xl mx-auto px-5 md:px-8">
          <h2 class="text-3xl font-black text-gray-900 mb-2">이런 응급 상황 대응합니다</h2>
          <p class="text-gray-500 mb-8 text-sm">전화 주시면 도착 즉시 진료받으실 수 있도록 준비해놓겠습니다.</p>

          <div class="grid md:grid-cols-2 gap-5">
            {[
              { icon: 'tooth', title: '극심한 치통', desc: '신경통·치아 갈라짐·심부 충치로 인한 즉시 통증 완화 및 신경 응급처치' },
              { icon: 'user-injured', title: '치아 외상', desc: '넘어짐·운동 중 부딪힘으로 치아가 깨지거나 빠진 경우 — 빠른 재식립 가능' },
              { icon: 'wrench', title: '보철물 탈락', desc: '크라운·인레이·라미네이트가 떨어진 경우 즉시 재부착 또는 임시 보철' },
              { icon: 'screw', title: '임플란트 흔들림', desc: '임플란트 보철 흔들림·골절·잇몸 부음 — 응급 진단 및 처치' },
              { icon: 'wind', title: '발치 후 출혈·통증', desc: '타 병원에서 발치 후 지혈 안 되거나 통증 심한 경우 응급 처치' },
              { icon: 'face-frown', title: '잇몸 부음·고름', desc: '치근단 농양·치주 농양 — 절개 배농 및 항생제 처방' },
            ].map(item => (
              <div class="p-6 rounded-2xl bg-red-50 border border-red-100">
                <div class="w-12 h-12 rounded-xl bg-red-500 text-white flex items-center justify-center mb-3">
                  <i class={`fa-solid fa-${item.icon}`}></i>
                </div>
                <h3 class="font-black text-gray-900 mb-2">{item.title}</h3>
                <p class="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section class="section-lg bg-gray-50">
        <div class="max-w-4xl mx-auto px-5 md:px-8">
          <h2 class="text-3xl font-black text-gray-900 mb-8">응급 진료 시간</h2>
          <div class="bg-white rounded-2xl p-8 border border-gray-100">
            <table class="w-full text-sm">
              <tbody>
                <tr class="border-b border-gray-100"><td class="py-3 font-bold text-gray-700">평일 (월~금)</td><td class="py-3 text-emerald-600 font-bold">10:00 ~ 21:00 (야간진료)</td></tr>
                <tr class="border-b border-gray-100"><td class="py-3 font-bold text-gray-700">토요일</td><td class="py-3 text-emerald-600 font-bold">10:00 ~ 18:00</td></tr>
                <tr class="border-b border-gray-100"><td class="py-3 font-bold text-gray-700">일요일 · 공휴일</td><td class="py-3 text-emerald-600 font-bold">14:00 ~ 18:00</td></tr>
                <tr><td class="py-3 font-bold text-red-500">365일 진료</td><td class="py-3 text-gray-600">설·추석 당일 외 연중 무휴</td></tr>
              </tbody>
            </table>
            <div class="mt-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-sm text-amber-800">
              <i class="fa-solid fa-circle-info mr-2"></i>
              응급 환자는 <strong>전화 후 방문</strong>하시면 우선 진료 안내해드립니다. 진료 가능 여부 확인을 위해 반드시 전화 주세요.
            </div>
          </div>
        </div>
      </section>

      <section class="section-lg bg-gradient-to-r from-red-600 to-red-700">
        <div class="max-w-4xl mx-auto px-5 md:px-8 text-center text-white">
          <h2 class="text-3xl md:text-4xl font-black mb-4"><i class="fa-solid fa-circle-exclamation mr-2"></i>지금 통증이 있다면 바로 전화하세요</h2>
          <p class="text-white/80 mb-8">응급 환자 우선 진료. 도착 즉시 진단 가능합니다.</p>
          <a href={`tel:${CLINIC.phone}`} class="inline-flex items-center px-8 py-4 bg-white text-red-600 rounded-2xl font-black text-lg hover:scale-105 transition-transform"><i class="fa-solid fa-phone mr-2"></i>{CLINIC.phone}</a>
        </div>
      </section>
    </>,
    {
      title: '인천 응급 치과 — 당일 진료 · 365일 운영 | 구월동 서울365치과',
      description: '인천 구월동 응급 치과. 365일 진료, 평일 21시까지 야간진료. 치통·외상·임플란트 응급 즉시 대응. 서울대 출신 5인 협진. 032-432-0365',
      canonicalUrl,
    }
  );
});

// ────────────────────────────────────────────────
// /night-clinic — 야간 진료
// ────────────────────────────────────────────────
app.get('/night-clinic', (c) => {
  const canonicalUrl = `${SITE_URL}/night-clinic`;

  return c.render(
    <>
      <section class="treatment-hero">
        <div class="relative z-10 max-w-[1400px] mx-auto px-5 md:px-8 py-28 md:py-36">
          <div class="text-purple-400 text-sm font-bold mb-3 reveal" style="transition-delay:0.2s"><i class="fa-solid fa-moon mr-2"></i>NIGHT CLINIC · 야간 진료</div>
          <h1 class="section-headline text-white mb-4 reveal" style="transition-delay:0.4s">구월동 야간 치과 — 평일 21시까지</h1>
          <p class="hero-sub text-white/35 reveal" style="transition-delay:0.6s">퇴근 후에도 진료받으실 수 있도록 평일 21시까지 운영합니다. 직장인·학생·맞벌이 가정을 위한 야간 진료 시스템.</p>
          <div class="mt-8 flex gap-3 reveal" style="transition-delay:0.8s">
            <a href={`tel:${CLINIC.phone}`} class="btn-premium btn-premium-fill"><i class="fa-solid fa-phone mr-2"></i>{CLINIC.phone}</a>
            <a href="/reservation" class="btn-premium btn-premium-white">예약하기</a>
          </div>
        </div>
      </section>

      <section class="section-lg bg-white">
        <div class="max-w-5xl mx-auto px-5 md:px-8">
          <h2 class="text-3xl font-black text-gray-900 mb-2">왜 서울365치과 야간 진료를 선택할까요?</h2>
          <p class="text-gray-500 mb-10 text-sm">인천 구월동에서 평일 21시까지 일관되게 진료하는 치과입니다.</p>

          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: 'moon', title: '평일 21시 마감', desc: '월~금 10:00~21:00 일관 운영. 퇴근 후 18~21시 슬롯 가장 인기' },
              { icon: 'user-md', title: '야간에도 5인 협진', desc: '주간과 동일한 의료진. 단독 진료가 아닌 협진 시스템 유지' },
              { icon: 'syringe', title: '야간 수면진료 가능', desc: '마취과 전문의 직접 상주. 통증 공포 환자도 편안하게' },
              { icon: 'briefcase', title: '직장인 친화', desc: '퇴근 후 1~2시간 충분히 진료 가능. 예약 우선 확보' },
              { icon: 'graduation-cap', title: '학생 친화', desc: '학원·과외 시간 끝나고 야간 교정 체크업' },
              { icon: 'baby', title: '맞벌이 가정', desc: '어린이 야간 진료 가능. 부모님 퇴근 후 함께 방문' },
            ].map(item => (
              <div class="p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-white border border-purple-100">
                <div class="w-12 h-12 rounded-xl bg-purple-500 text-white flex items-center justify-center mb-3">
                  <i class={`fa-solid fa-${item.icon}`}></i>
                </div>
                <h3 class="font-black text-gray-900 mb-2">{item.title}</h3>
                <p class="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section class="section-lg bg-gray-50">
        <div class="max-w-4xl mx-auto px-5 md:px-8">
          <h2 class="text-3xl font-black text-gray-900 mb-8">야간 진료 추천 시간대</h2>
          <div class="space-y-4">
            <div class="p-5 rounded-2xl bg-white border border-gray-100 flex items-center gap-5">
              <div class="text-3xl font-black text-purple-500 w-24">18~19시</div>
              <div>
                <div class="font-bold text-gray-900 mb-1">퇴근 직후</div>
                <div class="text-sm text-gray-500">가장 인기 슬롯. 예약 권장. 정기 검진·스케일링·간단한 충치 치료 최적</div>
              </div>
            </div>
            <div class="p-5 rounded-2xl bg-white border border-gray-100 flex items-center gap-5">
              <div class="text-3xl font-black text-purple-500 w-24">19~20시</div>
              <div>
                <div class="font-bold text-gray-900 mb-1">저녁 식사 후</div>
                <div class="text-sm text-gray-500">대기 없이 편안하게 진료. 임플란트 상담·교정 체크업·보철 진료 권장</div>
              </div>
            </div>
            <div class="p-5 rounded-2xl bg-white border border-gray-100 flex items-center gap-5">
              <div class="text-3xl font-black text-purple-500 w-24">20~21시</div>
              <div>
                <div class="font-bold text-gray-900 mb-1">마지막 슬롯</div>
                <div class="text-sm text-gray-500">가장 조용함. 1:1 상담·정밀 진단 권장. 당일 진료비 5% 할인</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="section-lg bg-gradient-to-r from-purple-600 to-indigo-700">
        <div class="max-w-4xl mx-auto px-5 md:px-8 text-center text-white">
          <h2 class="text-3xl md:text-4xl font-black mb-4">오늘 저녁, 진료 예약하세요</h2>
          <p class="text-white/80 mb-8">평일 21시까지 일관된 의료 품질 — 구월동 서울365치과</p>
          <div class="flex justify-center gap-3 flex-wrap">
            <a href={`tel:${CLINIC.phone}`} class="btn-premium btn-premium-fill"><i class="fa-solid fa-phone mr-2"></i>{CLINIC.phone}</a>
            <a href="/reservation" class="btn-premium btn-premium-white">예약 상담</a>
          </div>
        </div>
      </section>
    </>,
    {
      title: '구월동 야간 치과 — 평일 21시까지 · 인천 야간 진료 | 서울365치과',
      description: '인천 구월동 야간 치과. 평일 21시까지 진료, 토 18시·일요일 18시 운영. 퇴근 후 야간 진료, 야간 수면진료 가능. 서울대 출신 5인 협진. 032-432-0365',
      canonicalUrl,
    }
  );
});

// ────────────────────────────────────────────────
// 사이트맵 통합용 — 모든 D-Tier URL 목록 export
// ────────────────────────────────────────────────
export const COMMERCIAL_URLS = [
  { path: '/prices', priority: 0.9 },
  { path: '/emergency', priority: 0.95 },
  { path: '/night-clinic', priority: 0.9 },
  ...Object.keys(PRICE_PAGES).map(k => ({ path: `/prices/${encodeURIComponent(k)}`, priority: 0.85 })),
];

export default app;
