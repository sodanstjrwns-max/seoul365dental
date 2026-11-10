// ============================================================
// 응답 HTML 덧입히기 (2026-11-10)
//  이 레포는 일부 라우트 파일(home·treatments·guides·answers·compare·insurance·procedures …)의
//  "마지막 커밋 날짜"를 dateModified·사이트맵 lastmod 로 쓴다(vite.config.ts → CONTENT_DATES·PAGE_DATES).
//  본문이 그대로인 손질(사진 주소·측정용 속성) 때문에 그 파일을 고치면 수정일이 거짓으로 새로워진다.
//  → 그런 손질은 템플릿을 건드리지 않고 여기서 응답 HTML 에 입힌다(src/index.tsx 의 HTML 미들웨어).
//  날짜 추적이 없는 템플릿(blog.tsx·pages.tsx)은 같은 내용을 템플릿에 직접 적었다.
//  ①② 는 JSON-LD·meta·본문 글자를 건드리지 않는다. ③④(2026-11-10 추가)는 각 설명에 적은 제목·스키마 값만 바꾼다. ⑤ 는 병원 좌표 숫자만 바꾼다.
// ============================================================
import { imgV } from './img'
import { doctors } from '../data/doctors'
import { CLINIC } from '../data/clinic'

// ① 카드 사진 — 홈(치료 사례·칼럼 카드)·진료 상세(치료 사례 카드)의 <img src="/r2/…"> 를 가로 640 사본으로
//    (확대 모달은 스크립트가 원본 주소를 넣으므로 그대로 원본)
const CARD_IMG_PATHS = /^\/(?:$|treatments\/[^/]+$)/
const R2_IMG = /(<img\b[^>]*?\ssrc=")(\/r2\/[^"?]+)(")/g

// ② 글 끝 상담 블록 — 정보 글 상세(가이드·답변·비교·보험·시술 절차)는 본문 뒤에 이미 .cta-band(예약·전화 버튼)가 있다.
//    새 블록을 만들지 않고 그 버튼에 측정용 data-cta="article-end" 만 붙인다.
//    (칼럼 /blog/:slug · 백과사전 /encyclopedia/:slug 은 템플릿에 직접 붙어 있음)
const INFO_DETAIL_PATHS = /^\/(?:guides|answers|compare|insurance|procedures)\/[^/]+/
const END_BAND = '<section class="cta-band"'
const END_BTN = /<a href="(\/reservation|tel:[^"]+)"(?![^>]*\sdata-cta=)/g

// ③ 진료 상세 제목의 지역 키워드 (2026-11-10, SEO·AEO 1차 정비)
//    /treatments/:slug 의 <title> 에 "구월동"이 없으면 이 사이트 관례("… | 서울365치과 구월동 …")대로 병원명 뒤에 붙인다.
//    같은 문자열을 쓰는 og:title · twitter:title · MedicalWebPage name 도 함께 맞춘다. h1·본문·canonical 은 그대로.
//    (원본 metaTitle 은 src/data/treatments.ts — 날짜 추적 파일이라 고치지 않는다. 404 는 canonical 이 없어 제외된다.)
const TX_DETAIL_PATH = /^\/treatments\/[^/]+$/
const REGION = '구월동'
const BRAND = '서울365치과'
function regionTitle(html: string): string {
  if (!html.includes('<link rel="canonical" href="https://seoul365dc.kr/treatments/')) return html
  const m = html.match(/<title>([^<]*)<\/title>/)
  if (!m || m[1].includes(REGION) || !m[1].includes(BRAND)) return html
  const from = m[1]
  const to = from.replace(BRAND, `${BRAND} ${REGION}`)
  return html
    .split(`<title>${from}</title>`).join(`<title>${to}</title>`)
    .split(`content="${from}"`).join(`content="${to}"`)
    .split(`"name":"${from}"`).join(`"name":"${to}"`)
}

// ④ 의료진 목록(/doctors) JSON-LD 의 출신 학교 바로잡기 (2026-11-10)
//    목록 스키마가 모든 원장의 alumniOf 를 "서울대학교 치과대학"으로 적고 있었다. 학력(doctors.ts education)에
//    서울대가 없는 원장은 그 원장의 첫 학력 학교로 바꾸고, 서울대 동문 목록(alumni)에서는 뺀다.
//    화면 문구·@id·다른 속성은 그대로. (원본은 src/routes/doctors.tsx — 날짜 추적 파일이라 고치지 않는다.)
const SNU = '서울대학교 치과대학'
const schoolOf = (edu: string) => edu.replace(/\s*(졸업|우등졸업|수련|석사|박사).*$/, '')
const NON_SNU = new Map(
  doctors
    .filter((d) => d.education.length > 0 && !d.education.some((e) => e.includes('서울대학교')))
    .map((d) => [d.name, schoolOf(d.education[0])] as [string, string]),
)
const LD_BLOCK = /(<script type="application\/ld\+json"[^>]*>)([\s\S]*?)(<\/script>)/g
function fixAlumni(node: any): boolean {
  let changed = false
  if (Array.isArray(node)) {
    for (const n of node) if (fixAlumni(n)) changed = true
    return changed
  }
  if (!node || typeof node !== 'object') return false
  const school = typeof node.name === 'string' ? NON_SNU.get(node.name) : undefined
  if (school && node.alumniOf && node.alumniOf.name === SNU) {
    node.alumniOf = { ...node.alumniOf, name: school }
    changed = true
  }
  if (node.name === SNU && Array.isArray(node.alumni)) {
    const kept = node.alumni.filter((p: any) => !NON_SNU.has(p?.name))
    if (kept.length !== node.alumni.length) {
      node.alumni = kept
      changed = true
    }
  }
  for (const k of Object.keys(node)) if (fixAlumni(node[k])) changed = true
  return changed
}
function doctorsAlumni(html: string): string {
  if (NON_SNU.size === 0) return html
  return html.replace(LD_BLOCK, (all, open, body, close) => {
    if (!body.includes('"alumni')) return all
    try {
      const ld = JSON.parse(body)
      return fixAlumni(ld) ? open + JSON.stringify(ld).replace(/</g, '\\u003c') + close : all
    } catch {
      return all
    }
  })
}

// ⑤ 병원 좌표 (2026-11-10, 네이버 플레이스 값으로 정정)
//    역 페이지(/stations/:slug)·외국어 페이지(/en·/zh·/ru)는 템플릿에 옛 병원 좌표(37.4482, 126.7042)가 직접 적혀 있다
//    (스키마 geo·geo.position 메타·/ru 구글 지도 임베드). 세 파일 모두 날짜 추적 파일이라 고치지 않고,
//    응답에서 CLINIC.geo(src/data/clinic.ts) 값으로 바꾼다. 이 경로들에서 두 숫자는 병원 좌표로만 쓰인다.
//    (지역 페이지 /area/guwol-dong… 의 같은 숫자는 구월동 지역 좌표 — src/data/areas.ts — 라 대상이 아니다.)
const GEO_PATHS = /^\/(?:stations\/[^/]+|en|zh|ru)\/?$/
const OLD_LAT = /(?<![\d.])37\.4482(?!\d)/g
const OLD_LNG = /(?<![\d.])126\.7042(?!\d)/g
// /ru 지도 임베드(pb=…)의 표시 이름: 옛 좌표의 도분초 표기(37°26'53.5"N 126°42'15.1"E) → 새 좌표(37°26'46.0"N 126°42'03.8"E)
const OLD_MAP_LABEL = 'MzfCsDI2JzUzLjUiTiAxMjbCsDQyJzE1LjEiRQ'
const NEW_MAP_LABEL = 'MzfCsDI2JzQ2LjAiTiAxMjbCsDQyJzAzLjgiRQ'
function clinicGeo(html: string): string {
  return html
    .replace(OLD_LAT, String(CLINIC.geo.lat))
    .replace(OLD_LNG, String(CLINIC.geo.lng))
    .split(OLD_MAP_LABEL).join(NEW_MAP_LABEL)
}

export function htmlPass(path: string, html: string): string {
  if (CARD_IMG_PATHS.test(path)) {
    html = html.replace(R2_IMG, (_m, a, url, z) => a + imgV(url, 640) + z)
  }
  if (INFO_DETAIL_PATHS.test(path)) {
    const i = html.lastIndexOf(END_BAND)
    const j = i < 0 ? -1 : html.indexOf('</section>', i)
    if (j > i) {
      html = html.slice(0, i) + html.slice(i, j).replace(END_BTN, '<a href="$1" data-cta="article-end"') + html.slice(j)
    }
  }
  if (TX_DETAIL_PATH.test(path)) html = regionTitle(html)
  if (path === '/doctors') html = doctorsAlumni(html)
  if (GEO_PATHS.test(path)) html = clinicGeo(html)
  return html
}
