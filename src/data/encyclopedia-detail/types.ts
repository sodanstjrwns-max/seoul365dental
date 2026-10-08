// 백과 용어 상세 본문 타입 (2026-10-08 얇은 용어 보강)
// 용어 유형마다 섹션 순서·소제목을 달리 써서 템플릿 유사도를 낮춘다.
export type TermKind = '질환' | '시술' | '재료' | '장비' | '해부' | '보험' | '관리'

export interface TermSection {
  /** 소제목(h2) — 환자 질문형 권장 */
  h: string
  /** 문단 */
  p?: string[]
  /** 순서 목록(절차) */
  ol?: string[]
  /** 항목 목록 */
  ul?: string[]
}

export interface TermDetail {
  kind: TermKind
  /** 쉬운 말 정의 1~2문장 — 화면 첫 문단·DefinedTerm description·메타 설명 */
  def: string
  sections: TermSection[]
  /** 자주 묻는 질문 2~3개 — 화면과 FAQPage 스키마가 같은 배열을 쓴다 */
  faq: { q: string; a: string }[]
  /** 관련 진료·안내 페이지 (사이트 내부 경로만) */
  links?: { href: string; label: string }[]
  /** 관련 용어 slug */
  related?: string[]
}
