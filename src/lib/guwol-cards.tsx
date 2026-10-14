// ============================================================
// 구월동 진료 안내 사진 카드 (2026-10-14)
//  - 홈·"구월동 치과" 허브(/area/guwol-dong)에서 /area/guwol-dong/{진료} 핵심 6개로 링크
//  - 카드 사진 = 각 지역×진료 페이지의 og:image·본문 첫 사진·스키마 image·사이트맵 image:image 와 같은 사진
//    (1200×630 jpg: /static/cards/guwol-{slug}.jpg, 정사각 600×600 webp: /static/cards/guwol-{slug}-600.webp)
//  - 사진은 원내 톤(흰색·블루)에 맞춘 AI 생성 장면 — 사람 얼굴·치료 결과 암시 없음. 원본 2k: tools/subpage-cards/gen/seoul365dental/
//  - 한 줄 설명은 레포의 진료 데이터(treatments·area-treatment)에 있는 사실만 사용
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
          <a class="gw-card" href={`/area/guwol-dong/${c.slug}`} aria-labelledby={`${idPrefix}-${c.slug}`} data-cursor-hover>
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
.gw-card{display:flex;flex-direction:column;height:100%;background:#fff;border:1px solid #e8eef8;border-radius:18px;overflow:hidden;text-decoration:none;box-shadow:0 2px 12px rgba(0,40,120,.05);transition:transform .25s,box-shadow .25s,border-color .25s}
.gw-card:hover{transform:translateY(-3px);border-color:rgba(0,102,255,.35);box-shadow:0 10px 28px rgba(0,102,255,.12)}
.gw-card:focus-visible{outline:3px solid #0066FF;outline-offset:3px}
.gw-card-img{display:block;aspect-ratio:1/1;overflow:hidden;background:#f2f6fc}
.gw-card-img img{display:block;width:100%;height:100%;object-fit:cover;transition:transform .4s}
.gw-card:hover .gw-card-img img{transform:scale(1.04)}
.gw-card-body{display:flex;flex-direction:column;gap:5px;padding:14px 16px 18px}
.gw-card-tag{font-size:10.5px;letter-spacing:.14em;font-weight:700;color:#0066FF}
.gw-card-title{font-size:16px;font-weight:800;color:#0b1220;line-height:1.35}
.gw-card-line{font-size:13px;color:#5b6475;line-height:1.6;word-break:keep-all}
@media(max-width:900px){.gw-cards{grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}}
@media(max-width:520px){.gw-card-body{padding:11px 12px 13px}.gw-card-title{font-size:14.5px}.gw-card-line{display:none}}
@media(prefers-reduced-motion:reduce){.gw-card,.gw-card-img img{transition:none}}`

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
