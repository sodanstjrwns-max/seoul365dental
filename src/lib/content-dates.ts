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
}

// 진료 페이지 감수자 — 대표원장 (src/data/doctors.ts park-junkyu)
export const LEAD_REVIEWER = {
  id: 'https://seoul365dc.kr/doctors/park-junkyu#physician',
  name: '박준규',
  jobTitle: '대표원장',
}
