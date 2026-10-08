// ============================================================
// 대표 키워드 허브 내부 링크 (2026-10-08)
//  - /area/guwol-dong "구월동 치과" (주 허브) · /area/namdong-gu "인천 남동구 치과" (구 단위 허브)
//  - 한 페이지 허브 링크 최대 2개: 전역 푸터(구월동 치과) 1 + 본문 1. nofollow 금지, 허브 자신에는 자기 링크 없음.
// ============================================================

export const HUB_GUWOL = { href: '/area/guwol-dong', anchor: '구월동 치과' } as const
export const HUB_NAMDONG = { href: '/area/namdong-gu', anchor: '인천 남동구 치과' } as const

const LINK_CLS = 'text-[#0066FF] font-semibold hover:underline'

export function HubA({ hub = HUB_GUWOL, cls = LINK_CLS }: { hub?: { href: string; anchor: string }; cls?: string }) {
  return <a href={hub.href} class={cls}>{hub.anchor}</a>
}

function slugHash(s: string, n: number): number {
  let h = 0
  for (const ch of String(s)) h = (h * 31 + ch.charCodeAt(0)) >>> 0
  return h % n
}

/** 블로그 상세 본문 끝(작성자 박스 위) 지역 안내 1문장 — 문형 4개를 slug 해시로 고정 선택 */
export function BlogHubNote({ slug, topic }: { slug: string; topic?: string }) {
  const form = slugHash(slug, 4)
  const t = topic ? `${topic} ` : ''
  let body
  if (form === 0) {
    body = <>서울365치과는 <HubA />를 찾는 구월동·간석동·만수동 주민분들께 {t ? `${t}진료와 ` : ''}내원 방법을 안내하고 있습니다.</>
  } else if (form === 1) {
    body = <>예술회관역 5번 출구 쪽에서 {t ? `${t}` : '치과 '}상담할 곳을 찾으신다면 <HubA /> 안내에서 위치·진료시간·의료진을 한 번에 확인하실 수 있습니다.</>
  } else if (form === 2) {
    body = <>이 글의 내용을 직접 상담받고 싶은 구월동 주민분은 <HubA /> 페이지에서 진료 일정과 오시는 길을 먼저 확인해 보세요.</>
  } else {
    body = <>남동구 어느 동에서 오시는지에 따라 걸리는 시간과 노선이 다릅니다 — 동별 거리와 교통편은 <HubA hub={HUB_NAMDONG} /> 안내에 정리해 두었습니다.</>
  }
  return (
    <p class="mt-10 text-[0.9rem] text-gray-600 leading-relaxed rounded-2xl border border-gray-100 bg-gray-50/70 px-5 py-4">
      <i class="fa-solid fa-location-dot text-[#0066FF]/60 mr-2" aria-hidden="true"></i>{body}
    </p>
  )
}
