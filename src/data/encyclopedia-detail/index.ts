// 백과 용어 상세 본문 모음 — 2026-10-08 얇은 용어 192개 보강
// 용어마다 유형(질환·시술·재료·장비·해부·보험·관리)별로 섹션 순서·소제목을 달리 작성.
import type { TermDetail } from './types'
import { DETAILS_1 } from './batch-1'
import { DETAILS_2 } from './batch-2'
import { DETAILS_3 } from './batch-3'
import { DETAILS_4 } from './batch-4'
import { DETAILS_5 } from './batch-5'
import { DETAILS_6 } from './batch-6'
import { DETAILS_7 } from './batch-7'
import { DETAILS_8 } from './batch-8'

/** 보강 본문을 쓴 실제 날짜(고정값) — 사이트맵 lastmod·dateModified */
export const TERM_DETAILS_UPDATED = '2026-10-08'

export const TERM_DETAILS: Record<string, TermDetail> = {
  ...DETAILS_1,
  ...DETAILS_2,
  ...DETAILS_3,
  ...DETAILS_4,
  ...DETAILS_5,
  ...DETAILS_6,
  ...DETAILS_7,
  ...DETAILS_8,
}
