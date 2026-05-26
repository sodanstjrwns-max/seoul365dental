// ============================================================
// 🚇 v3 SUPER UPGRADE — 역세권/랜드마크 키워드 데이터
// "예술회관역 임플란트", "인천시청 인비절라인" 등
// 거리 기반 long-tail SEO 키워드 타겟팅
// ============================================================

export interface StationInfo {
  /** URL slug */
  slug: string;
  /** 역/랜드마크 한글명 */
  name: string;
  /** 노선 또는 카테고리 */
  line: string;
  /** 서울365치과까지 도보/대중교통 시간 (분) */
  travelMin: number;
  /** 이동 방법 설명 */
  travelDesc: string;
  /** 주변 특성 */
  area: string;
  /** SEO 키워드 */
  keywords: string[];
}

export const STATIONS: StationInfo[] = [
  // ── 인천 1호선 (구월동 ~ 주변) ──
  {
    slug: 'yesulhoegwan-station',
    name: '예술회관역',
    line: '인천 1호선',
    travelMin: 3,
    travelDesc: '5번 출구 도보 3분',
    area: '인천 남동구 구월동',
    keywords: ['예술회관역 치과', '예술회관역 임플란트', '예술회관역 인비절라인', '예술회관역치과', '예술회관역5번출구치과'],
  },
  {
    slug: 'incheon-city-hall',
    name: '인천시청역',
    line: '인천 1·2호선 환승',
    travelMin: 8,
    travelDesc: '도보 8분 / 버스 5분',
    area: '인천 남동구 구월동',
    keywords: ['인천시청역 치과', '인천시청 임플란트', '인천시청 인비절라인', '인천시청역치과', '인천시청역임플란트'],
  },
  {
    slug: 'ganseok-ogeori-station',
    name: '간석오거리역',
    line: '인천 1호선',
    travelMin: 7,
    travelDesc: '버스 5분',
    area: '인천 남동구 간석동',
    keywords: ['간석오거리역 치과', '간석오거리 임플란트', '간석오거리역치과', '간석오거리치과'],
  },
  {
    slug: 'arts-center-station',
    name: '인천종합문화예술회관',
    line: '랜드마크',
    travelMin: 3,
    travelDesc: '도보 3분',
    area: '인천 남동구 구월동',
    keywords: ['예술회관 근처 치과', '인천종합문화예술회관 치과', '예술회관 임플란트'],
  },
  {
    slug: 'incheon-terminal',
    name: '인천종합터미널',
    line: '랜드마크',
    travelMin: 7,
    travelDesc: '도보 7분',
    area: '인천 남동구 관교동',
    keywords: ['인천종합터미널 치과', '인천터미널 치과', '터미널역 치과', '터미널역 임플란트'],
  },
  {
    slug: 'lotte-incheon',
    name: '롯데백화점 인천점',
    line: '랜드마크',
    travelMin: 5,
    travelDesc: '도보 5분',
    area: '인천 남동구 구월동',
    keywords: ['롯데백화점 인천 치과', '롯데 인천점 치과', '구월동 롯데 치과'],
  },
  {
    slug: 'newcore-outlet',
    name: '뉴코아아울렛 구월점',
    line: '랜드마크',
    travelMin: 5,
    travelDesc: '도보 5분',
    area: '인천 남동구 구월동',
    keywords: ['뉴코아 구월 치과', '뉴코아아울렛 치과'],
  },
  {
    slug: 'gachi-hospital',
    name: '가천대 길병원',
    line: '랜드마크',
    travelMin: 8,
    travelDesc: '버스 7분',
    area: '인천 남동구 구월동',
    keywords: ['길병원 근처 치과', '가천대 치과', '길병원 치과'],
  },
  {
    slug: 'moraenae-market',
    name: '모래내시장역',
    line: '인천 2호선',
    travelMin: 5,
    travelDesc: '버스 5분',
    area: '인천 남동구 구월동',
    keywords: ['모래내시장역 치과', '모래내시장 치과', '모래내 임플란트'],
  },
  // ── 송도/연수 라인 ──
  {
    slug: 'central-park-station',
    name: '센트럴파크역',
    line: '인천 1호선',
    travelMin: 25,
    travelDesc: '지하철 1호선 25분',
    area: '인천 연수구 송도동',
    keywords: ['센트럴파크역 치과', '송도 센트럴파크 치과', '센트럴파크 임플란트'],
  },
  {
    slug: 'songdo-international',
    name: '송도국제도시역',
    line: '인천 1호선',
    travelMin: 28,
    travelDesc: '지하철 1호선 28분',
    area: '인천 연수구 송도동',
    keywords: ['송도국제도시 치과', '송도국제도시역 치과', '국제도시 임플란트'],
  },
];

export function getStationBySlug(slug: string): StationInfo | undefined {
  return STATIONS.find(s => s.slug === slug);
}
