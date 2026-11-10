// ============================================================
// 화면용 가벼운 이미지 사본 (2026-11-10)
//  - 관리자가 올린 원본(R2 <폴더>/<파일>)은 그대로 두고, R2 v/<폭>/<원본키> 에 WebP 사본(가로 640·1600)을 둔다.
//  - 화면에 쓰는 <img> 주소에만 ?w=640|1600 을 붙인다. /r2/* 가 사본을 주고, 사본이 없으면 원본을 준다.
//  - JSON-LD·OG·사이트맵·피드에 쓰는 주소는 원본 그대로 둔다(검색용 주소 불변).
//  - 사본 생성: 관리자 업로드 때 app.js 의 p365Variants 가 자동 생성, 기존 이미지는 scripts/backfill-image-variants.mjs
// ============================================================
export const IMG_WIDTHS = [640, 1600] as const;
export type ImgWidth = (typeof IMG_WIDTHS)[number];

/** 목록·카드 = 640, 상세·팝업·확대 보기 = 1600. /r2/ 로 시작하는 주소만 바꾼다(외부 주소·이미 쿼리가 붙은 주소는 그대로). */
export function imgV(url: string | null | undefined, w: ImgWidth): string {
  if (!url) return '';
  if (!url.startsWith('/r2/') || url.startsWith('/r2/v/') || url.includes('?')) return url;
  return `${url}?w=${w}`;
}
