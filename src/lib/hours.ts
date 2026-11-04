// ============================================================
// 진료 시간 계산 (서버: KST 기준) — 히어로 시간 카드·상태 칩의 초기 표시용. 클라이언트 app.js 가 1분마다 갱신한다.
//  - 요일별 시간은 src/data/clinic.ts HOURS_DETAIL 과 같다. 공휴일은 서버에서 판별하지 않는다(일요일 시간과 동일하게 안내는 FAQ·본문에서).
// ============================================================
import { HOURS_DETAIL } from '../data/clinic'

export const WEEK = [
  { key: 'mon', label: '월', open: 10, close: 21 },
  { key: 'tue', label: '화', open: 10, close: 21 },
  { key: 'wed', label: '수', open: 10, close: 21 },
  { key: 'thu', label: '목', open: 10, close: 21 },
  { key: 'fri', label: '금', open: 10, close: 19 },
  { key: 'sat', label: '토', open: 10, close: 14 },
  { key: 'sun', label: '일·공휴', open: 14, close: 18 },
] as const

/** KST 현재 시각 */
export function kstNow(): { day: number; h: number; m: number } {
  const t = new Date(Date.now() + 9 * 3600 * 1000)
  return { day: t.getUTCDay(), h: t.getUTCHours(), m: t.getUTCMinutes() }
}

const pad = (n: number) => String(n).padStart(2, '0')

/** 오늘 진료 시간과 현재 열림 여부 (0=일 … 6=토) */
export function todayStatus() {
  const { day, h, m } = kstNow()
  const idx = day === 0 ? 6 : day - 1
  const d = WEEK[idx]
  const now = h + m / 60
  const open = now >= d.open && now < d.close
  return {
    idx,
    label: d.label,
    opens: `${pad(d.open)}:00`,
    closes: `${pad(d.close)}:00`,
    open,
    clock: `${pad(h)}:${pad(m)}`,
    text: open ? `진료중 · ${pad(d.close)}:00까지` : now < d.open ? `오늘 ${pad(d.open)}:00 진료 시작` : '오늘 진료 종료',
  }
}

export { HOURS_DETAIL }
