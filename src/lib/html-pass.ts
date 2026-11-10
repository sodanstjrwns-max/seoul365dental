// ============================================================
// 응답 HTML 덧입히기 (2026-11-10)
//  이 레포는 일부 라우트 파일(home·treatments·guides·answers·compare·insurance·procedures …)의
//  "마지막 커밋 날짜"를 dateModified·사이트맵 lastmod 로 쓴다(vite.config.ts → CONTENT_DATES·PAGE_DATES).
//  본문이 그대로인 손질(사진 주소·측정용 속성) 때문에 그 파일을 고치면 수정일이 거짓으로 새로워진다.
//  → 그런 손질은 템플릿을 건드리지 않고 여기서 응답 HTML 에 입힌다(src/index.tsx 의 HTML 미들웨어).
//  날짜 추적이 없는 템플릿(blog.tsx·pages.tsx)은 같은 내용을 템플릿에 직접 적었다.
//  JSON-LD·meta·본문 글자는 건드리지 않는다.
// ============================================================
import { imgV } from './img'

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
  return html
}
