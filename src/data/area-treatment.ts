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
