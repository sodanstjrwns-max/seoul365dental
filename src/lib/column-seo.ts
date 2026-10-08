// 칼럼(블로그)·치료사례 SEO/AEO 헬퍼 — PFWE-COLUMN-CASE-SEO.md 표준 (2026-10-03)
// 원칙: 본문·DB 에 있는 문장만 사용(새 내용 생성 없음), 화면과 JSON-LD 일치.
import { doctors } from '../data/doctors'

export const SITE = 'https://seoul365dc.kr'
export const ORG_ID = `${SITE}/#dentist`
export const WEBSITE_ID = `${SITE}/#website`
export const DEFAULT_OG = `${SITE}/static/og-image.png`

/** D1 datetime('now') = UTC 'YYYY-MM-DD HH:MM:SS' → 'YYYY-MM-DDTHH:MM:SS+09:00' */
export function isoKst(d: string | null | undefined): string | undefined {
  if (!d) return undefined
  const s = String(d)
  if (/[+-]\d{2}:\d{2}$|Z$/.test(s) && s.includes('T')) {
    const t = Date.parse(s); if (isNaN(t)) return undefined
    return new Date(t + 9 * 3600e3).toISOString().slice(0, 19) + '+09:00'
  }
  const t = Date.parse(s.replace(' ', 'T') + (s.length > 10 ? 'Z' : 'T00:00:00Z'))
  if (isNaN(t)) return undefined
  return new Date(t + 9 * 3600e3).toISOString().slice(0, 19) + '+09:00'
}
export function kstYmd(d: string | null | undefined): string {
  return (isoKst(d) || '').slice(0, 10)
}

/** '박준규 대표원장' 같은 표기 → doctors.ts 의사 */
export function doctorByName(name: string | null | undefined) {
  const n = String(name || '').replace(/\s*(대표원장|원장).*$/, '').trim()
  return n ? doctors.find(d => d.name === n) : undefined
}
export const LEAD_DOCTOR = doctors.find(d => d.slug === 'park-junkyu') || doctors[0]
export function physicianRef(d: { slug: string; name: string; title: string }) {
  return { "@type": "Physician", "@id": `${SITE}/doctors/${d.slug}#physician`, "name": d.name, "jobTitle": d.title, "url": `${SITE}/doctors/${d.slug}` }
}

// ===== 칼럼 작성 주체 (2026-10-08, 사용자 승인) =====
// 원장을 저자·감수자로 표시하는 건 원장이 쓰거나 검토했다는 근거가 있을 때만.
// - 대행사(GenSpark) 투입 글 id 7(orthodontics-complete-guide, '하누리 원장')·id 8(laminate, '최다빈 원장'):
//   블로그 시스템 구축 커밋 cd198dd(2026-03-10 01:13 UTC) 직전 개발 중 투입된 샘플 글. 두 글 created_at 시각이
//   00:47:36 으로 동일(날짜만 이틀 차이 → 일괄 투입), 같은 묶음의 id 1~6·9 는 삭제됨. 원장 작성 근거 없음.
// - author_name='서울365치과'(병원 명의) 글은 원장 감수 근거 없음 → 예전 코드가 대표원장을 reviewedBy 로 자동 부착하던 것 중단.
// → 근거 없는 글: 저자·발행 = 병원(Organization ORG_ID), reviewedBy 없음, 화면엔 일반 건강정보 안내.
//   관리자 에디터에서 병원이 의료진 이름을 작성자로 직접 입력한 글(대행사 투입 글 제외)만 그 원장을 저자로 표시.
export const AGENCY_SEED_POST_IDS = new Set([7, 8])
export const CLINIC_NAME = '서울365치과'
export const CLINIC_GENERAL_INFO_NOTE = '일반 건강정보입니다. 진료 판단은 내원 상담에서 원장이 직접 합니다.'
/** 병원이 관리자에서 의료진 이름으로 직접 입력한 글이면 그 의사, 아니면 undefined(병원 발행) */
export function attestedPostDoctor(p: { id?: number | string | null; author_name?: string | null }) {
  if (p.id != null && AGENCY_SEED_POST_IDS.has(Number(p.id))) return undefined
  return doctorByName(p.author_name)
}
/** RSS dc:creator·Atom author·JSON Feed author 표기 */
export function postCreatorName(p: { id?: number | string | null; author_name?: string | null }): string {
  const d = attestedPostDoctor(p)
  return d ? `${d.name} ${d.title}` : CLINIC_NAME
}

// /answers·/guides·/compare·/stations: 대행사 일괄 커밋 8703c18(2026-05-26 22:43:52 +0000, GenSpark "SEO v3")로 투입.
// 원장 검토 근거 없음 → reviewedBy·'의료진 검토' 표시 삭제, 작성 = 병원. 발행일은 지어낸 2025-01-01 대신 그 커밋 날짜.
export const AGENCY_HUB_PUBLISHED = '2026-05-26'

/**
 * 제목줄·목차가 일반 텍스트로 들어간 글(최근 자동 작성분)을 마크다운 구조로 정리.
 * - '목차' 다음 줄들 중 본문에 같은 문장이 단독 줄로 다시 나오는 항목 → 그 단독 줄을 '## 항목'(H2)으로
 *   목차 블록은 '- 항목' 목록으로
 * - 'Q. 질문? A. 답' 한 줄 → '### 질문?' + 답 문단 (질문형 H3 → FAQPage)
 * 글자는 바꾸지 않고 줄 구조만 바꾼다. 이미 '## ' 제목이 있는 글은 목차 처리 생략.
 */
export function normalizePostMarkdown(md: string): string {
  let lines = String(md || '').replace(/\r\n/g, '\n').split('\n')
  const hasMdHeadings = lines.some(l => /^#{2,3} /.test(l))
  const tocIdx = lines.findIndex(l => l.trim() === '목차')
  if (!hasMdHeadings && tocIdx >= 0) {
    const entries: { idx: number; text: string }[] = []
    let j = tocIdx + 1
    while (j < lines.length && lines[j].trim() === '') j++
    for (; j < lines.length; j++) {
      const t = lines[j].trim()
      if (!t) break
      if (t.length > 60) break
      if (entries.length && t === entries[0].text) break // 목차 끝 → 첫 섹션 시작
      entries.push({ idx: j, text: t })
    }
    const tocEnd = entries.length ? entries[entries.length - 1].idx : tocIdx
    const valid = new Set<string>()
    for (const e of entries) {
      const later = lines.findIndex((l, k) => k > tocEnd && l.trim() === e.text)
      if (later > 0) valid.add(e.text)
    }
    if (valid.size >= 2) {
      const done = new Set<string>()
      lines = lines.map((l, k) => {
        const t = l.trim()
        if (k > tocIdx && k <= tocEnd && entries.some(e => e.idx === k)) return valid.has(t) ? `- ${t}` : l
        if (k > tocEnd && valid.has(t) && !done.has(t)) { done.add(t); return `## ${t}` }
        return l
      })
      // 목차 블록 앞뒤 빈 줄 확보(목록 감싸기용)
      lines[tocIdx] = '**목차**'
    }
  }
  // 'Q. 질문? A. 답' 한 줄형 FAQ
  lines = lines.flatMap(l => {
    const m = l.trim().match(/^Q\.\s*(.+?[?？])\s+A\.\s*(.+)$/)
    return m ? [`### ${m[1].trim()}`, '', m[2].trim(), ''] : [l]
  })
  return lines.join('\n')
}

function stripMd(s: string) {
  return String(s || '').replace(/!\[[^\]]*\]\([^)]*\)/g, '').replace(/\[([^\]]*)\]\([^)]*\)/g, '$1').replace(/[*_`>#]/g, '').replace(/\s+/g, ' ').trim()
}

/** 질문형 H3('### …?') + 다음 문단 → FAQ (마크다운 기준, 화면 렌더와 동일 문장) */
export function faqsFromMarkdown(md: string): { question: string; answer: string }[] {
  const out: { question: string; answer: string }[] = []
  const lines = md.split('\n')
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/^###\s+(.+?)\s*$/)
    if (!m) continue
    const q = stripMd(m[1]).replace(/^Q\.\s*/, '')
    if (!/[?？]$/.test(q)) continue
    let a = ''
    for (let k = i + 1; k < lines.length; k++) {
      const t = lines[k].trim()
      if (!t) { if (a) break; continue }
      if (/^#{1,4} /.test(t) || /^\*\*Q\./.test(t)) break
      a += (a ? ' ' : '') + stripMd(t.replace(/^A\.\s*/, ''))
      if (a.length > 400) break
    }
    if (a) out.push({ question: q, answer: a })
  }
  return out
}

/** 핵심 답변: excerpt(작성자가 입력한 요약) 우선, 없으면 본문 첫 일반 문단(40자 이상) */
export function answerSummaryText(excerpt: string | null | undefined, md: string): string {
  const ex = String(excerpt || '').trim()
  if (ex.length >= 20) return ex
  for (const l of md.split('\n')) {
    const t = l.trim()
    if (!t || /^(#|-|\d+\.|!\[|\||>|\*\*)/.test(t)) continue
    const s = stripMd(t)
    if (s.length >= 40) return s.length > 220 ? s.slice(0, 218).replace(/\s+\S*$/, '') + '…' : s
  }
  return ''
}

/** 렌더된 본문 이미지: 빈 alt → 제목 기반 */
export function fillEmptyAlts(html: string, title: string): string {
  let n = 0
  return html.replace(/<img\b([^>]*?)\salt=""([^>]*)>/g, (_m, a, b) => {
    n++
    return `<img${a} alt="${title.replace(/"/g, '&quot;')} 관련 이미지 ${n}"${b}>`
  })
}
