// ============================================================
// 인라인 SVG 아이콘 (2026-11-04 리디자인) — 홈·헤더·푸터·하단바에서 Font Awesome 대신 사용
//  - 1.6px 선, 24 뷰박스, currentColor. 크기는 CSS(.btn svg 등)가 정하고 size 로 고정할 수도 있다.
// ============================================================
import { raw } from 'hono/html'

const P: Record<string, string> = {
  phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18"/>',
  chat: '<path d="M12 4c-4.97 0-9 3.13-9 7 0 2.2 1.3 4.16 3.33 5.44L5.5 20l4.1-2.2c.77.13 1.57.2 2.4.2 4.97 0 9-3.13 9-7s-4.03-7-9-7z"/>',
  pin: '<path d="M12 22s7-6.1 7-12a7 7 0 1 0-14 0c0 5.9 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  arrowUp: '<path d="M12 19V5M6 11l6-6 6 6"/>',
  arrowUpRight: '<path d="M7 17 17 7M8 7h9v9"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  chevron: '<path d="m9 6 6 6-6 6"/>',
  lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  volumeOff: '<path d="M11 5 6 9H3v6h3l5 4V5z"/><path d="m22 9-6 6M16 9l6 6"/>',
  volumeOn: '<path d="M11 5 6 9H3v6h3l5 4V5z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/>',
  instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  check: '<path d="m5 12 5 5L20 7"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  logout: '<path d="M10 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4M15 8l5 4-5 4M20 12H9"/>',
  play: '<path d="M8 5v14l11-7z"/>',
  moon: '<path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  book: '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 19a2 2 0 0 0 2 2h13"/>',
  map: '<path d="m3 6 6-2 6 2 6-2v14l-6 2-6-2-6 2z"/><path d="M9 4v14M15 6v14"/>',
  news: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 8h6M7 12h10M7 16h10"/>',
  bell: '<path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4zM10 21h4"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
}

/** 선 아이콘 — Hono JSX 는 <svg> 자식을 네임스페이스 노드로 감싸 dangerouslySetInnerHTML 과 충돌하므로 raw 문자열로 낸다 */
export function Icon({ name, class: cls, size }: { name: string; class?: string; size?: number }) {
  const d = P[name] || P.arrow
  const extra = (cls ? ` class="${cls.replace(/"/g, '')}"` : '') + (size ? ` width="${Number(size)}" height="${Number(size)}"` : '')
  return raw(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"${extra}>${d}</svg>`)
}

/** 네이버 'N' 마크 (면) */
export const NaverMark = ({ size = 16 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width={size} height={size} aria-hidden="true" focusable="false"><path d="M13.54 10.68 6.17 2H2v16h4.46V9.32L13.83 18H18V2h-4.46v8.68z" fill="currentColor" /></svg>
)

/** 카카오 말풍선 (면) */
export const KakaoMark = ({ size = 18 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" focusable="false"><path d="M12 3C6.48 3 2 6.58 2 10.98c0 2.83 1.86 5.3 4.66 6.7l-.98 3.63c-.08.3.26.54.52.37l4.3-2.86c.49.05.99.08 1.5.08 5.52 0 10-3.58 10-7.92S17.52 3 12 3z" fill="currentColor" /></svg>
)
