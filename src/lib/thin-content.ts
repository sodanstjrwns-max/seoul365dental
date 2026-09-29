/**
 * 얇은(thin) 상세 페이지 판정 — 크롤 감사 후속 색인 정리 (2026-09-29)
 *
 * 원칙 (PF Web Engine 2026-09-21 공통 규칙, eumdc 79fab5b 와 같은 방식):
 *  - 항목 고유 본문(태그 제거·공백 제외 글자 수)이 기준 미만이면
 *    <meta name="robots" content="noindex, follow"> + X-Robots-Tag + 사이트맵 제외.
 *  - 페이지와 내부 링크는 그대로 유지 → 본문을 보강해 기준을 넘으면 자동으로 색인 복귀.
 *
 * 2026-09-29 실측:
 *  - 백과 용어 200개(src/data/encyclopedia-terms.ts): 고유 본문은 정의 한 문장뿐, 공백 제외 30~63자(중앙 41자).
 *    나머지는 공통 템플릿·같은 분류 용어 목록이라 라이브 크롤 고유 텍스트 중앙 260자, 155개가 300자 미만.
 *    → 기준 300자: 현재 200개 전부 thin. 용어 전체가 모인 허브 /encyclopedia(약 1.6만 자)는 색인 유지.
 *  - 치료사례 31건(D1 before_after_cases, 읽기 전용 조회): 설명 17~260자, AFTER 사진은 회원 전용
 *    → 기준 300자: 현재 31건 전부 thin. 갤러리 /cases/gallery 는 색인 유지.
 */

export const THIN_TERM_MIN_CHARS = 300
export const THIN_CASE_MIN_CHARS = 300
export const NOINDEX_FOLLOW = 'noindex, follow'

/** HTML/마크다운 → 화면에 보이는 글자 수 (태그·엔티티·공백 제외) */
export function visibleTextLength(s?: string | null): number {
  if (!s) return 0
  return String(s)
    .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z#0-9]+;/gi, ' ')
    .replace(/[#*_>`\-|]+/g, ' ')
    .replace(/\s+/g, '')
    .length
}

/** 백과 용어: 정의(def) + 선택적 상세 본문(body) */
export function isThinTerm(t: { def?: string | null; body?: string | null }): boolean {
  return visibleTextLength(t.def) + visibleTextLength(t.body) < THIN_TERM_MIN_CHARS
}

/** 치료사례: 치료 설명(description) */
export function isThinCase(cs: { description?: string | null }): boolean {
  return visibleTextLength(cs.description) < THIN_CASE_MIN_CHARS
}
