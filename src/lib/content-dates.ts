// 콘텐츠별 최종 수정일(고정값). vite.config.ts 가 빌드 시 각 콘텐츠 파일의
// 마지막 커밋 날짜를 __CONTENT_DATES__ 로 주입한다. 없으면 아래 폴백(2026-09-29 기준 커밋 날짜).
// 스키마 lastReviewed/dateModified 와 화면 '최종 검토' 표기가 같은 값을 쓴다.
declare const __CONTENT_DATES__: Partial<Record<keyof typeof FALLBACK, string>> | undefined

const FALLBACK = {
  treatments: '2026-09-12',
  doctors: '2026-07-28',
  area: '2026-09-29',
  home: '2026-08-18',
  encyclopedia: '2026-06-11',
  llmsTxt: '2026-09-12',
  llmsFull: '2026-09-29',
  // 사이트맵 lastmod 용(2026-10-08 기준 각 파일 마지막 커밋 날짜) — vite 주입값이 없을 때(얕은 클론) 폴백
  treatmentsPage: '2026-10-04',
  doctorsPage: '2026-09-29',
  answers: '2026-09-12',
  compare: '2026-09-12',
  guides: '2026-09-12',
  stations: '2026-05-26',
  intl: '2026-09-29',
  ru: '2026-08-18',
  reviews: '2026-09-29',
  procedures: '2026-09-29',
  insurance: '2026-09-29',
  events: '2026-09-29',
  whyus: '2026-09-29',
  commercial: '2026-09-29',
}

const injected = typeof __CONTENT_DATES__ !== 'undefined' ? __CONTENT_DATES__ : {}
const pick = (k: keyof typeof FALLBACK) => {
  const v = injected[k]
  return v && /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : FALLBACK[k]
}

export const CONTENT_DATES = {
  treatments: pick('treatments'),
  doctors: pick('doctors'),
  area: pick('area'),
  home: pick('home'),
  encyclopedia: pick('encyclopedia'),
  llmsTxt: pick('llmsTxt'),
  llmsFull: pick('llmsFull'),
}

/** 사이트맵 lastmod — 페이지군별 실제 수정일(라우트·데이터 파일 마지막 커밋). 2026-10-08 */
export const PAGE_DATES = {
  home: pick('home'),
  treatments: pick('treatmentsPage'),
  doctors: pick('doctorsPage'),
  answers: pick('answers'),
  compare: pick('compare'),
  guides: pick('guides'),
  stations: pick('stations'),
  intl: pick('intl'),
  ru: pick('ru'),
  reviews: pick('reviews'),
  procedures: pick('procedures'),
  insurance: pick('insurance'),
  events: pick('events'),
  whyus: pick('whyus'),
  commercial: pick('commercial'),
}

/** 날짜 문자열들(YYYY-MM-DD… / DB datetime) 중 가장 최근 날짜(YYYY-MM-DD). 유효한 값이 없으면 '' */
export const latestYmd = (...dates: Array<string | null | undefined>): string =>
  dates.map((d) => String(d || '').slice(0, 10)).filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d)).sort().pop() || ''

// 진료 페이지 감수자 — 대표원장 (src/data/doctors.ts park-junkyu)
export const LEAD_REVIEWER = {
  id: 'https://seoul365dc.kr/doctors/park-junkyu#physician',
  name: '박준규',
  jobTitle: '대표원장',
}
