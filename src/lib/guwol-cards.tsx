// ============================================================
// 구월동 진료 안내 사진 카드 (2026-10-14)
//  - 홈·"구월동 치과" 허브(/area/guwol-dong)에서 /area/guwol-dong/{진료} 핵심 6개로 링크
//  - 카드 사진 = 각 지역×진료 페이지의 og:image·본문 첫 사진·스키마 image·사이트맵 image:image 와 같은 사진
//    (1200×630 jpg: /static/cards/guwol-{slug}.jpg, 정사각 600×600 webp: /static/cards/guwol-{slug}-600.webp)
//  - 사진은 원내 톤(흰색·블루)에 맞춘 AI 생성 장면 — 사람 얼굴·치료 결과 암시 없음. 원본 2k: tools/subpage-cards/gen/seoul365dental/
//  - 한 줄 설명은 레포의 진료 데이터(treatments·area-treatment)에 있는 사실만 사용
//  - 2026-11-04 리디자인: 마크업·링크·ItemList 는 그대로, CSS 만 새 비주얼 시스템(코발트·Paperlogy·Geist Mono)으로
// ============================================================

const SITE = 'https://seoul365dc.kr'

export type GuwolCard = { slug: string; name: string; tag: string; line: string }

export const GUWOL_CARDS: GuwolCard[] = [
  { slug: 'implant', name: '구월동 임플란트', tag: 'IMPLANT', line: 'CT·구강 스캔으로 계획하고 가이드를 이용해 식립합니다' },
  { slug: 'full-implant', name: '구월동 전체임플란트', tag: 'FULL ARCH', line: '자체 기공실에서 보철을 만들어 전악 임플란트를 진행합니다' },
  { slug: 'orthodontics', name: '구월동 치아교정', tag: 'ORTHODONTICS', line: '교정과 전문의가 직접 진단하고 장치를 조정합니다' },
  { slug: 'invisalign', name: '구월동 인비절라인', tag: 'INVISALIGN', line: '구강 스캔으로 디지털 모형을 만들어 시작하는 투명교정' },
  { slug: 'sedation', name: '구월동 수면진료', tag: 'SEDATION', line: '치과 치료가 두려운 분도 생체징후를 지켜보며 편안하게' },
  { slug: 'cosmetic', name: '구월동 심미치료', tag: 'COSMETIC', line: '라미네이트·세렉 원데이로 앞니 모양과 색을 다듬습니다' },
]

/** 진료 slug → 1200×630 대표 사진 (구월동 핵심 6, 다른 지역의 같은 진료 페이지도 같은 사진) */
export function matrixCardImage(treatmentSlug: string): string | null {
  return GUWOL_CARDS.some(c => c.slug === treatmentSlug) ? `/static/cards/guwol-${treatmentSlug}.jpg` : null
}
const thumb = (slug: string) => `/static/cards/guwol-${slug}-600.webp`

/** 사진 카드 그리드 (밝은 배경용). exclude: 현재 페이지 진료 slug */
export function GuwolCardGrid({ idPrefix, exclude = '' }: { idPrefix: string; exclude?: string }) {
  const cards = GUWOL_CARDS.filter(c => c.slug !== exclude)
  return (
    <ul class="gw-cards" role="list">
      {cards.map((c, i) => (
        <li>
          <a class="gw-card" href={`/area/guwol-dong/${c.slug}`} aria-labelledby={`${idPrefix}-${c.slug}`}>
            <span class="gw-card-img"><img src={thumb(c.slug)} width="600" height="600" loading="lazy" decoding="async" alt={c.name} /></span>
            <span class="gw-card-body">
              <span class="gw-card-tag" aria-hidden="true">{String(i + 1).padStart(2, '0')} / {c.tag}</span>
              <strong class="gw-card-title" id={`${idPrefix}-${c.slug}`}>{c.name}</strong>
              <span class="gw-card-line">{c.line}</span>
            </span>
          </a>
        </li>
      ))}
    </ul>
  )
}

export const GUWOL_CARD_CSS = `.gw-cards{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}
.gw-half .gw-cards{grid-template-columns:repeat(2,minmax(0,1fr))}
.gw-card{display:flex;flex-direction:column;height:100%;background:#fff;border:1px solid #DDE3EE;border-radius:22px;overflow:hidden;text-decoration:none;box-shadow:0 1px 2px rgb(11 21 48 / .04),0 16px 40px -24px rgb(11 21 48 / .22);transition:transform .32s cubic-bezier(.2,.8,.2,1),box-shadow .32s,border-color .32s}
.gw-card:hover{transform:translateY(-4px);border-color:rgb(30 75 216 / .3);box-shadow:0 24px 60px -24px rgb(11 21 48 / .35)}
.gw-card:focus-visible{outline:3px solid #1E4BD8;outline-offset:3px}
.gw-card-img{display:block;aspect-ratio:1/1;overflow:hidden;background:#EEF1F7}
.gw-card-img img{display:block;width:100%;height:100%;object-fit:cover}
.gw-card-body{display:flex;flex-direction:column;gap:5px;padding:14px 16px 18px}
.gw-card-tag{font-family:'Geist Mono',ui-monospace,SFMono-Regular,Menlo,monospace;font-size:10.5px;letter-spacing:.14em;font-weight:500;color:#1E4BD8}
.gw-card-title{font-family:'Paperlogy','Pretendard Variable',Pretendard,-apple-system,sans-serif;font-size:17px;font-weight:700;color:#0B1530;line-height:1.3;letter-spacing:-.02em}
.gw-card-line{font-size:13px;color:#6C7892;line-height:1.6;word-break:keep-all}
@media(max-width:900px){.gw-cards,.gw-half .gw-cards{grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}}
@media(max-width:520px){.gw-card-body{padding:11px 12px 13px}.gw-card-title{font-size:14.5px}.gw-card-line{display:none}}
@media(prefers-reduced-motion:reduce){.gw-card{transition:none}}`

/** 화면 카드와 1:1인 ItemList (같은 순서·이름·URL·사진) */
export function guwolCardItemList(listUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${listUrl}#guwol-cards`,
    name: '구월동 진료 안내',
    numberOfItems: GUWOL_CARDS.length,
    itemListElement: GUWOL_CARDS.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      url: `${SITE}/area/guwol-dong/${c.slug}`,
      image: `${SITE}${thumb(c.slug)}`,
    })),
  }
}
