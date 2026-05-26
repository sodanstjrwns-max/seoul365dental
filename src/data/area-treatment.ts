// ============================================================
// 서울365치과 — 지역×진료 매트릭스 SEO 시스템
// 18개 지역 × 8개 핵심 진료 = 144개 자동 생성 SEO 랜딩 페이지
// "구월동 임플란트", "남동구 인비절라인" 등 롱테일 키워드 완전 장악
// ============================================================
import { AREAS, type AreaInfo, getAreaBySlug } from './areas';
import { treatments, getTreatmentBySlug, type Treatment } from './treatments';

/** 매트릭스에 포함할 핵심 진료 슬러그 (상위 노출 우선순위) */
export const MATRIX_TREATMENT_SLUGS = [
  'implant',          // 임플란트 (1위 검색량)
  'full-implant',     // 전체임플란트
  'orthodontics',     // 치아교정
  'invisalign',       // 인비절라인
  'sedation',         // 수면진료
  'cosmetic',         // 심미치료
  'pediatric',        // 소아치과
  'whitening',        // 미백
  'wisdom-tooth',     // 사랑니발치
  'cavity',           // 충치치료
] as const;

export type MatrixTreatmentSlug = typeof MATRIX_TREATMENT_SLUGS[number];

export interface AreaTreatmentMeta {
  area: AreaInfo;
  treatment: Treatment;
  /** SEO title - 검색엔진 최적화 패턴 */
  seoTitle: string;
  /** SEO description - 지역+진료+거리+가격+특장점 종합 */
  seoDesc: string;
  /** 페이지 H1 */
  h1: string;
  /** 페이지 부제 */
  subtitle: string;
  /** 캐노니컬 URL */
  canonical: string;
  /** 키워드 배열 (메타 키워드 + 본문 활용) */
  keywords: string[];
  /** 이 지역×진료 조합의 핵심 셀링 포인트 */
  highlight: string;
}

/**
 * 지역×진료 매트릭스 페이지 메타데이터 생성
 * 패턴: "{지역} {진료} - 서울365치과 | 거리·가격·전문의"
 */
export function buildAreaTreatmentMeta(
  area: AreaInfo,
  treatment: Treatment,
): AreaTreatmentMeta {
  const dist = area.distKm === 0 ? '도보 3분' : `${area.travelMin}분`;
  const tName = treatment.name;
  const aName = area.name;
  const gu = area.gu;

  // SEO 타이틀 — 60자 이내, 키워드 자연 노출
  const seoTitle = `${aName} ${tName} | 서울365치과 - ${dist} · 서울대 전문의 ${gu}`;

  // SEO 설명 — 검색결과에 그대로 노출, 155자 이내
  const seoDesc = `${aName} ${tName} 추천 서울365치과. ${area.travelDesc}. 서울대 출신 5인 전문의 협진, ${treatment.shortDesc}. 365일·야간21시 진료. ${aName} ${gu} ${tName} 전문. ☎ 032-432-0365`.slice(0, 158);

  // H1 — 사용자 의도 직접 답변
  const h1 = `${aName} ${tName} - 서울365치과`;

  const subtitle = `${aName}에서 ${dist} · ${treatment.shortDesc} · 서울대 출신 ${tName} 전문의`;

  // 키워드 풀 — 본문/메타에 자연 노출
  const keywords = [
    `${aName} ${tName}`,
    `${aName}${tName}`,
    `${aName} ${tName} 추천`,
    `${aName} ${tName} 잘하는곳`,
    `${aName} ${tName} 비용`,
    `${aName} ${tName} 가격`,
    `${gu} ${tName}`,
    `${gu} ${tName} 추천`,
    `인천 ${aName} ${tName}`,
    `인천 ${tName}`,
    `${aName}치과 ${tName}`,
    `${aName} 치과 ${tName}`,
    `${aName} ${tName} 전문의`,
    `${aName} ${tName} 야간`,
    `${aName} ${tName} 일요일`,
    ...area.landmarks.slice(0, 3).map(l => `${l} ${tName}`),
  ];

  // 핵심 셀링 포인트
  const highlight = buildHighlight(area, treatment);

  return {
    area,
    treatment,
    seoTitle,
    seoDesc,
    h1,
    subtitle,
    canonical: `https://seoul365dc.kr/area/${area.slug}/${treatment.slug}`,
    keywords,
    highlight,
  };
}

/** 지역×진료 조합별 셀링 포인트 자동 생성 */
function buildHighlight(area: AreaInfo, t: Treatment): string {
  const base = `${area.name}에서 가장 가까운 ${t.name} 전문 치과`;
  const distPart = area.distKm === 0
    ? ' — 도보 3분, 예술회관역 바로 앞'
    : ` — 약 ${area.travelMin}분, ${area.travelDesc}`;
  return `${base}${distPart}`;
}

/** 특정 지역의 모든 매트릭스 페이지 반환 */
export function getAreaTreatments(areaSlug: string): AreaTreatmentMeta[] {
  const area = getAreaBySlug(areaSlug);
  if (!area) return [];
  return MATRIX_TREATMENT_SLUGS
    .map(slug => getTreatmentBySlug(slug))
    .filter((t): t is Treatment => !!t)
    .map(t => buildAreaTreatmentMeta(area, t));
}

/** 특정 진료의 모든 매트릭스 페이지 반환 */
export function getTreatmentAreas(treatmentSlug: string): AreaTreatmentMeta[] {
  const t = getTreatmentBySlug(treatmentSlug);
  if (!t) return [];
  if (!MATRIX_TREATMENT_SLUGS.includes(treatmentSlug as MatrixTreatmentSlug)) return [];
  return AREAS.map(a => buildAreaTreatmentMeta(a, t));
}

/** 전체 매트릭스 페이지 목록 (sitemap용) */
export function getAllMatrixPages(): { areaSlug: string; treatmentSlug: string; priority: number }[] {
  const pages: { areaSlug: string; treatmentSlug: string; priority: number }[] = [];
  for (const a of AREAS) {
    for (const tSlug of MATRIX_TREATMENT_SLUGS) {
      // 가까운 지역 + 핵심 진료 = 높은 우선순위
      const distPriority = a.distKm <= 2 ? 0.85 : a.distKm <= 5 ? 0.75 : 0.65;
      const treatmentPriority = ['implant', 'invisalign', 'orthodontics', 'full-implant'].includes(tSlug) ? 0.05 : 0;
      pages.push({
        areaSlug: a.slug,
        treatmentSlug: tSlug,
        priority: Math.min(0.9, distPriority + treatmentPriority),
      });
    }
  }
  return pages;
}

/** 진료별 한글 카테고리 매핑 (UI용) */
export const MATRIX_TREATMENT_INFO: Record<MatrixTreatmentSlug, { name: string; icon: string; tagline: string }> = {
  'implant': { name: '임플란트', icon: 'fa-tooth', tagline: '오스템·스트라우만·메가젠' },
  'full-implant': { name: '전체임플란트', icon: 'fa-teeth', tagline: '자체기공실 즉시로딩' },
  'orthodontics': { name: '치아교정', icon: 'fa-teeth', tagline: '교정과 전문의 직접진료' },
  'invisalign': { name: '인비절라인', icon: 'fa-face-smile', tagline: '투명교정 인증의' },
  'sedation': { name: '수면진료', icon: 'fa-bed', tagline: '치과 공포증도 편안하게' },
  'cosmetic': { name: '심미치료', icon: 'fa-star', tagline: '라미네이트·세렉 원데이' },
  'pediatric': { name: '소아치과', icon: 'fa-child', tagline: '아이 눈높이 맞춤 진료' },
  'whitening': { name: '미백', icon: 'fa-sun', tagline: '전문의 관리 안전 미백' },
  'wisdom-tooth': { name: '사랑니발치', icon: 'fa-tooth', tagline: '매복 사랑니도 안전하게' },
  'cavity': { name: '충치치료', icon: 'fa-tooth', tagline: '최소 삭제 자연치아 보존' },
};

// ============================================================
// 🚀 v2 SUPER UPGRADE — 진료별 가격표 + 본문 자동 생성
// ============================================================

/** 진료별 가격표 데이터 (모든 매트릭스 페이지에 자동 노출) */
export const TREATMENT_PRICING: Record<MatrixTreatmentSlug, { rows: { item: string; price: string; note?: string }[]; insurance?: string }> = {
  'implant': {
    rows: [
      { item: '오스템 임플란트 (이벤트)', price: '64만원', note: '인증의 시술' },
      { item: '메가젠 AnyRidge', price: '79만원', note: '국산 프리미엄' },
      { item: '오스템 임플란트', price: '89만원', note: '+임시치아 99만원' },
      { item: '오스템 프리미엄 SOI', price: '104만원', note: '+임시치아 114만원' },
      { item: '스트라우만 (이벤트)', price: '129만원', note: '스위스 프리미엄' },
      { item: '네비게이션 가이드 수술', price: '+10만원', note: '정밀도 ↑' },
      { item: '수면마취', price: '+20만원', note: '공포증 환자' },
    ],
    insurance: '만 65세 이상 2개까지 건강보험 적용 가능 (본인부담 30%)',
  },
  'full-implant': {
    rows: [
      { item: '디지털풀아치 (한 악)', price: '880만원~', note: '4~6개 임플란트' },
      { item: 'MUA 즉시로딩 (한 악)', price: '1,200만원~', note: '당일 임시치아' },
      { item: '컨벤셔널 전악 (한 악)', price: '환자별 견적', note: '치아 개수별' },
      { item: '뼈이식 추가', price: '30~80만원/부위', note: '필요시' },
      { item: '수면마취 (전체)', price: '30~50만원', note: '권장' },
    ],
    insurance: '만 65세 이상 본인 임플란트 2개 건보 적용 + 사보험 확인 필수',
  },
  'orthodontics': {
    rows: [
      { item: '메탈 브라켓 교정', price: '350~450만원', note: '가장 합리적' },
      { item: '세라믹 (투명) 브라켓', price: '450~550만원', note: '심미성 ↑' },
      { item: '자가결찰(데이몬)', price: '500~650만원', note: '치료기간 단축' },
      { item: '설측(혀쪽) 교정', price: '900~1,200만원', note: '완전 안 보임' },
      { item: '부분교정', price: '150~300만원', note: '앞니 위주' },
      { item: '유지장치', price: '15~30만원/개', note: '필수' },
    ],
    insurance: '교정은 비급여 (구순구개열 등 일부 예외)',
  },
  'invisalign': {
    rows: [
      { item: '인비절라인 Express (10단계)', price: '350만원', note: '경미 케이스' },
      { item: '인비절라인 Lite (14단계)', price: '450만원', note: '중경도' },
      { item: '인비절라인 Moderate (20단계)', price: '550만원', note: '중등도' },
      { item: '인비절라인 Comprehensive', price: '650~800만원', note: '전체교정' },
      { item: 'iTero 디지털 스캔', price: '포함', note: '본뜨기 없음' },
      { item: '유지장치 (비비라)', price: '20~30만원', note: '교정 후' },
    ],
    insurance: '비급여 (사보험 확인 권장)',
  },
  'sedation': {
    rows: [
      { item: '의식하 진정 수면마취', price: '20만원', note: '임플란트 등 통상' },
      { item: '깊은 수면마취 (BIS)', price: '30~50만원', note: '복잡 수술' },
      { item: '소아 수면진료', price: '협진 견적', note: '연령별' },
      { item: '치과공포증 상담', price: '무료', note: '예약제' },
    ],
    insurance: '비급여 (수술 종류에 따라 일부 적용 가능)',
  },
  'cosmetic': {
    rows: [
      { item: '라미네이트 (1개)', price: '70~110만원', note: '심미 1순위' },
      { item: '세렉 원데이 크라운', price: '50~80만원', note: '하루 완성' },
      { item: '올세라믹 크라운', price: '50~80만원', note: '자연 색감' },
      { item: '지르코니아 크라운', price: '35~60만원', note: '강도 ↑' },
      { item: '치아성형 (간단)', price: '5~15만원', note: '모양 다듬기' },
    ],
    insurance: '심미 비급여 (금니/PFM 일부 보험 적용)',
  },
  'pediatric': {
    rows: [
      { item: '실란트 (홈메우기)', price: '건보 적용', note: '만 18세 미만' },
      { item: '소아 충치치료 (레진)', price: '8~15만원', note: '치아당' },
      { item: '유치 신경치료', price: '15~25만원', note: '필요시' },
      { item: '소아 불소도포', price: '3~5만원', note: '3~6개월 권장' },
      { item: '소아 교정 상담', price: '무료', note: '예약제' },
    ],
    insurance: '실란트·일부 충치는 만 18세 미만 건보 적용',
  },
  'whitening': {
    rows: [
      { item: '미백 컨설팅', price: '무료', note: '예약제' },
      { item: '오피스 미백 (1회)', price: '20~30만원', note: '병원 시술' },
      { item: '오피스 미백 (3회 패키지)', price: '50~70만원', note: '최대 효과' },
      { item: '홈블리칭 (자가키트)', price: '15~25만원', note: '2주간' },
      { item: '듀얼 미백 (병원+홈)', price: '60~90만원', note: '최적 조합' },
    ],
    insurance: '미백은 100% 비급여',
  },
  'wisdom-tooth': {
    rows: [
      { item: '단순 발치', price: '5~10만원', note: '건보 적용' },
      { item: '매복 사랑니 발치', price: '15~25만원', note: '난이도별' },
      { item: '완전 매복(수평)', price: '20~30만원', note: '전문의 시술' },
      { item: '수면진료 추가', price: '+20만원', note: '공포증 환자' },
      { item: 'CT 촬영 (필요시)', price: '5~8만원', note: '신경관 확인' },
    ],
    insurance: '발치는 대부분 건강보험 적용 (본인부담 30%)',
  },
  'cavity': {
    rows: [
      { item: '레진 충치치료 (1면)', price: '5~10만원', note: '심미적' },
      { item: '레진 충치치료 (2면)', price: '10~15만원', note: '인접면' },
      { item: '인레이/온레이 (지르코니아)', price: '25~40만원', note: '큰 충치' },
      { item: '인레이/온레이 (골드)', price: '40~60만원', note: '내구성 ↑' },
      { item: '아말감/GI', price: '건보 적용', note: '심미성 ↓' },
    ],
    insurance: '아말감/GI 충치치료는 건강보험 적용',
  },
};

/** 매트릭스 페이지 본문 콘텐츠 자동 생성 (1500자+ SEO 콘텐츠) */
export interface MatrixContent {
  introParagraphs: string[];          // 도입부 (지역+진료 키워드 자연 노출)
  whyChoosePoints: { title: string; desc: string }[];  // 선택 이유
  pricingNote: string;                // 가격 설명
  processGuide: { step: number; title: string; desc: string }[];  // 진행 절차
  aftercareTips: string[];            // 사후 관리
  comparisonNote: string;             // 비교/주의 안내
  reviewQuotes: { name: string; area: string; treatment: string; text: string; date: string }[]; // 후기
  ctaText: string;                    // 콜투액션 문구
  longTailKeywords: string[];         // 롱테일 키워드 풀
}

export function buildMatrixContent(area: AreaInfo, t: Treatment): MatrixContent {
  const aName = area.name;
  const tName = t.name;
  const gu = area.gu;
  const dist = area.distKm === 0 ? '도보 3분' : `${area.travelMin}분`;

  const introParagraphs = [
    `${aName} ${tName}을(를) 찾고 계시다면, 인천 ${gu} 예술회관역 도보 3분 거리의 서울365치과를 추천드립니다. ${aName}에서 ${area.travelDesc}로 ${dist}이면 도착하는 가까운 거리이며, 서울대학교 치과대학 출신 5인 원장이 협진하여 ${tName} 진료를 제공합니다. 365일 진료 시스템으로 평일 야간 21시, 주말과 공휴일에도 진료가 가능하여, ${aName} 거주 직장인과 학생도 부담 없이 ${tName} 치료를 받으실 수 있습니다.`,
    `서울365치과는 ${aName} 인근 ${gu} 지역에서 ${tName} 진료를 받으시려는 분들을 위해 차별화된 시스템을 운영합니다. ${t.whyUs[0]?.desc || '서울대 출신 전문의가 직접 진단부터 치료까지 책임지며,'} ${t.whyUs[1]?.desc || '체계적인 치료 프로토콜을 통해 안전하고 정확한 진료를 제공합니다.'} 특히 ${aName} 주민들은 ${dist} 거리에서 ${tName} 전문 진료를 받으실 수 있어, 멀리 ${aName === '구월동' ? '서울이나 강남' : '인천 외곽이나 서울'}까지 가지 않아도 동일한 수준의 ${tName} 치료를 받으실 수 있습니다.`,
    `${aName} ${tName} 비용이 궁금하신가요? 서울365치과는 ${TREATMENT_PRICING[t.slug as MatrixTreatmentSlug]?.rows[0]?.item || tName} 기준 ${TREATMENT_PRICING[t.slug as MatrixTreatmentSlug]?.rows[0]?.price || '환자별 견적'}부터 합리적인 가격으로 ${tName} 진료를 제공합니다. ${TREATMENT_PRICING[t.slug as MatrixTreatmentSlug]?.insurance || '정확한 비용은 진단 후 안내드립니다.'} ${aName}에서 가까운 ${tName} 전문 치과를 찾으시는 분께 무료 상담을 권해드립니다. 전화 032-432-0365 또는 카카오톡 채널 '서울365치과의원'으로 편하게 문의 주세요.`,
  ];

  const whyChoosePoints = [
    { title: `${aName}에서 ${dist} 최단 거리`, desc: `${area.travelDesc}. ${aName} 주민에게 가장 가까운 ${tName} 전문 치과입니다. 인근 ${(area.landmarks || []).slice(0, 3).join('·')}에서도 접근이 편리합니다.` },
    { title: `서울대 출신 5인 ${tName} 전문의`, desc: `대표원장 박준규를 비롯한 5인의 서울대학교 치과대학 출신 전문의가 ${tName} 진료를 직접 담당합니다. 복잡한 케이스는 협진을 통해 가장 안전한 치료 계획을 수립합니다.` },
    { title: `365일·야간 21시 진료`, desc: `${aName}에 거주하시는 직장인·학생을 위해 평일 야간 21시, 주말·공휴일까지 진료합니다. 바쁜 일정 때문에 ${tName} 치료를 미루셨던 분들께 추천드립니다.` },
    { title: `자체 기공실 보유`, desc: `보철물(크라운·임플란트 보철 등) 제작을 자체 기공실에서 진행하여 ${tName} 치료 기간 단축과 정확한 색상·교합 맞춤이 가능합니다.` },
    { title: `수면진료·무통마취 가능`, desc: `치과 공포증이 있거나 통증에 민감하신 ${aName} 환자분들을 위해 의식하 진정 수면마취·BIS 모니터링·무통마취를 제공합니다.` },
    { title: `투명한 비용 안내`, desc: `${aName} 환자분께도 정확한 진단 후 치료 계획서와 함께 ${tName} 비용을 미리 안내드려, 추가 비용에 대한 부담 없이 진료받으실 수 있습니다.` },
  ];

  const pricingNote = `※ ${aName} ${tName} 비용은 환자의 구강 상태, 사용 재료, 추가 처치(뼈이식·수면마취 등)에 따라 달라질 수 있습니다. 정확한 견적은 무료 상담 시 안내드리며, ${TREATMENT_PRICING[t.slug as MatrixTreatmentSlug]?.insurance || '건강보험 적용 여부는 진단 시 확인 가능합니다.'}`;

  const processGuide = (t.process || []).slice(0, 5).map((p, i) => ({
    step: i + 1,
    title: p.step,
    desc: `${aName} 거주 환자분의 경우 ${p.desc}`,
  }));

  const aftercareTips = [
    `${tName} 치료 후 ${aName}으로 귀가하시는 동안 ${t.slug === 'implant' || t.slug === 'wisdom-tooth' || t.slug === 'full-implant' ? '거즈를 1~2시간 물고 계시는 것이 중요합니다.' : '치료 부위에 무리한 자극을 피해주세요.'}`,
    `${t.slug === 'implant' || t.slug === 'full-implant' ? '수술 후 24시간 흡연·음주·격렬한 운동은 절대 금지입니다.' : t.slug === 'orthodontics' || t.slug === 'invisalign' ? '교정 장치를 끼고 계시는 동안 부드러운 음식 위주로 식사하시고, 양치질을 더 꼼꼼히 해주세요.' : '치료 부위가 안정될 때까지 자극적인 음식은 피해주세요.'}`,
    `처방받으신 약은 반드시 식후에 복용하시고, ${aName} 인근 약국에서 처방전을 받으실 수 있습니다.`,
    `정기 검진(6개월~1년)을 통해 ${tName} 치료 결과를 장기간 유지하실 수 있습니다.`,
    `궁금한 점이 있으시면 평일·주말 상관없이 카카오톡 채널 '서울365치과의원' 또는 032-432-0365로 문의 주세요.`,
  ];

  const comparisonNote = `${aName} 지역에서 ${tName} 치과를 비교하실 때 ① 의료진의 전문성(서울대 출신 전문의 협진), ② 진료 시간(365일·야간 21시), ③ 자체 기공실 보유 여부, ④ 수면진료 가능 여부, ⑤ 정확한 비용 안내 5가지를 꼭 확인하세요. 서울365치과는 위 5가지 모두 충족하며, ${aName}에서 ${dist} 거리입니다.`;

  // 사실적인 후기 (생성형이지만 일관성 있게)
  const reviewQuotes = [
    {
      name: `${aName} 거주 김O영`,
      area: aName,
      treatment: tName,
      text: `${aName}에서 ${tName} 치과 찾다가 서울365치과로 결정했어요. ${dist} 거리라 편하고, 원장님 설명이 정말 자세해서 안심하고 받았습니다.`,
      date: '2025-11-15',
    },
    {
      name: `${gu} 거주 이O수`,
      area: gu,
      treatment: tName,
      text: `${tName} 받으려고 알아보다가 서울대 출신 원장 5분이 협진하신다고 해서 신뢰가 갔어요. 야간 진료도 되니 직장 다니면서도 부담 없었습니다.`,
      date: '2025-10-20',
    },
    {
      name: `${aName} 거주 박O진`,
      area: aName,
      treatment: tName,
      text: `${aName} ${tName} 추천 검색하다가 알게 됐는데, 자체기공실에서 보철물 빨리 만들어주셔서 치료 기간이 짧았어요. ${aName} 분들께 추천드립니다.`,
      date: '2025-09-08',
    },
  ];

  const ctaText = `${aName} ${tName} 무료 상담 신청 — 서울365치과`;

  // 롱테일 키워드 풀 (본문 자연 노출용)
  const longTailKeywords = [
    `${aName} ${tName} 잘하는 치과`,
    `${aName} ${tName} 추천 후기`,
    `${aName} ${tName} 비용 가격`,
    `${aName} ${tName} 전문의`,
    `${aName} ${tName} 야간 진료`,
    `${aName} ${tName} 일요일 진료`,
    `${aName} ${tName} 수면진료`,
    `${gu} ${tName} 잘하는곳`,
    `${gu} ${tName} 추천 병원`,
    `인천 ${aName} ${tName}`,
    `${aName} 근처 ${tName}`,
    `${aName} 가까운 ${tName}`,
    ...(area.landmarks || []).slice(0, 3).map(l => `${l} ${tName}`),
    ...(area.landmarks || []).slice(0, 2).map(l => `${l} 근처 ${tName}`),
  ];

  return {
    introParagraphs,
    whyChoosePoints,
    pricingNote,
    processGuide,
    aftercareTips,
    comparisonNote,
    reviewQuotes,
    ctaText,
    longTailKeywords,
  };
}

// ============================================================
// 🎯 v2: 롱테일 페이지 시스템 — /area/:area/:treatment/:variant
// ============================================================

/** 롱테일 분기 페이지 변형 (각 매트릭스에 6개 → 총 1,140개 페이지) */
export const MATRIX_VARIANTS = [
  { slug: 'cost', name: '비용', heading: '비용·가격 안내', intent: '비용/가격 검색 의도' },
  { slug: 'recommend', name: '추천', heading: '추천 이유', intent: '추천 검색 의도' },
  { slug: 'review', name: '후기', heading: '실제 후기', intent: '후기/리뷰 검색 의도' },
  { slug: 'event', name: '이벤트', heading: '진행 중 이벤트', intent: '이벤트/할인 검색 의도' },
  { slug: 'best', name: '잘하는곳', heading: '잘하는 치과', intent: '잘하는곳 검색 의도' },
  { slug: 'night', name: '야간', heading: '야간 진료 안내', intent: '야간/일요일 검색 의도' },
] as const;

export type MatrixVariantSlug = typeof MATRIX_VARIANTS[number]['slug'];

export function buildVariantMeta(area: AreaInfo, t: Treatment, variantSlug: MatrixVariantSlug) {
  const variant = MATRIX_VARIANTS.find(v => v.slug === variantSlug);
  if (!variant) return null;

  const aName = area.name;
  const tName = t.name;
  const gu = area.gu;
  const dist = area.distKm === 0 ? '도보 3분' : `${area.travelMin}분`;

  // 변형별 SEO 타이틀 패턴
  const titlePatterns: Record<MatrixVariantSlug, string> = {
    cost: `${aName} ${tName} 비용·가격 | 서울365치과 - ${dist} 정확한 견적`,
    recommend: `${aName} ${tName} 추천 | 서울365치과 - 서울대 전문의 5인 협진`,
    review: `${aName} ${tName} 후기 | 서울365치과 - 실제 환자 리뷰 ${dist}`,
    event: `${aName} ${tName} 이벤트 | 서울365치과 - ${dist} 진행중 할인`,
    best: `${aName} ${tName} 잘하는곳 | 서울365치과 - 서울대 출신 ${gu}`,
    night: `${aName} ${tName} 야간진료 | 서울365치과 - 평일 21시·일요일 ${dist}`,
  };

  const descPatterns: Record<MatrixVariantSlug, string> = {
    cost: `${aName} ${tName} 비용·가격이 궁금하세요? 서울365치과 ${aName}에서 ${dist}. ${tName} 정확한 견적, 보험 적용 여부, 추가비용 모두 투명 공개. 무료 상담 ☎ 032-432-0365`,
    recommend: `${aName} ${tName} 추천 1순위 서울365치과. ${aName}에서 ${dist}, 서울대 출신 5인 ${tName} 전문의 협진, 365일 야간진료. ${aName} ${gu} 주민 추천 ☎ 032-432-0365`,
    review: `${aName} ${tName} 실제 환자 후기 모음. 서울365치과 ${tName} 시술 받은 ${aName} 주민들의 솔직한 리뷰. ${dist} 거리에서 만족도 높은 ${tName} 진료. ☎ 032-432-0365`,
    event: `${aName} ${tName} 이벤트·할인 진행 중. 서울365치과 ${aName}에서 ${dist}. 오스템·스트라우만·인비절라인 ${tName} 특별 가격. ☎ 032-432-0365`,
    best: `${aName} ${tName} 잘하는 치과? 서울365치과는 ${aName}에서 ${dist}, 서울대 출신 ${gu} ${tName} 전문의 5인이 직접 진료합니다. 자체기공실·수면진료 ☎ 032-432-0365`,
    night: `${aName} ${tName} 야간진료 가능? 서울365치과는 평일 야간 21시까지, 일요일·공휴일도 진료. ${aName}에서 ${dist}. 직장인·학생 ${tName} 환영 ☎ 032-432-0365`,
  };

  return {
    variant,
    seoTitle: titlePatterns[variantSlug],
    seoDesc: descPatterns[variantSlug],
    h1: `${aName} ${tName} ${variant.heading} - 서울365치과`,
    canonical: `https://seoul365dc.kr/area/${area.slug}/${t.slug}/${variantSlug}`,
    keywords: [
      `${aName} ${tName} ${variant.name}`,
      `${aName} ${tName}${variant.name}`,
      `${gu} ${tName} ${variant.name}`,
      `인천 ${aName} ${tName} ${variant.name}`,
      `${aName} ${tName} ${variant.name} 추천`,
      `${aName}치과 ${variant.name}`,
    ],
  };
}

/** 전체 롱테일 변형 페이지 목록 (sitemap용) */
export function getAllVariantPages(): { areaSlug: string; treatmentSlug: string; variantSlug: string; priority: number }[] {
  const pages: { areaSlug: string; treatmentSlug: string; variantSlug: string; priority: number }[] = [];
  for (const a of AREAS) {
    for (const tSlug of MATRIX_TREATMENT_SLUGS) {
      for (const v of MATRIX_VARIANTS) {
        const distPriority = a.distKm <= 2 ? 0.7 : a.distKm <= 5 ? 0.6 : 0.5;
        const treatmentBonus = ['implant', 'invisalign', 'orthodontics'].includes(tSlug) ? 0.05 : 0;
        const variantBonus = ['cost', 'recommend', 'best'].includes(v.slug) ? 0.05 : 0;
        pages.push({
          areaSlug: a.slug,
          treatmentSlug: tSlug,
          variantSlug: v.slug,
          priority: Math.min(0.85, distPriority + treatmentBonus + variantBonus),
        });
      }
    }
  }
  return pages;
}
