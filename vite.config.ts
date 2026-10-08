import build from '@hono/vite-build/cloudflare-pages'
import devServer from '@hono/vite-dev-server'
import adapter from '@hono/vite-dev-server/cloudflare'
import { defineConfig } from 'vite'
import { execSync } from 'node:child_process'
import { readFileSync } from 'node:fs'

// 콘텐츠 최종 수정일 = 해당 콘텐츠 파일의 마지막 커밋 날짜(빌드 시 상수).
// new Date()로 매일 '오늘'이 찍히던 lastReviewed/dateModified 대체 (2026-09-29).
// git 이력이 없으면 src/lib/content-dates.ts 의 고정 폴백 사용.
function isShallow(): boolean {
  try {
    return execSync('git rev-parse --is-shallow-repository', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim() === 'true'
  } catch {
    return true
  }
}
const SHALLOW = isShallow() // 얕은 클론(CI)에서는 이력이 잘려 날짜가 틀리므로 폴백 사용
function lastCommitDate(paths: string[]): string {
  if (SHALLOW) return ''
  try {
    return execSync(`git log -1 --format=%cs -- ${paths.join(' ')}`, { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim()
  } catch {
    return ''
  }
}
// seo.tsx 의 llms 라우트 본문(고정 문구)만의 마지막 커밋 날짜.
// 라우트 안 `const content = \`` 줄부터 '최종 업데이트' 꼬리(${lastUpdated ...) 직전까지만 본다
// — 같은 파일의 사이트맵·robots 수정이나 날짜 계산 코드 수정이 '문구 수정일'로 섞이지 않게.
function lastCommitDateOfLlmsText(file: string, routeMarker: string): string {
  if (SHALLOW) return ''
  try {
    const lines = readFileSync(file, 'utf8').split('\n')
    const route = lines.findIndex((l) => l.startsWith(routeMarker))
    if (route < 0) return ''
    const start = lines.findIndex((l, i) => i > route && l.startsWith('  const content = `'))
    const end = lines.findIndex((l, i) => i > start && l.startsWith('${lastUpdated ?'))
    if (start < 0 || end < 0) return ''
    return execSync(`git log -1 --format=%cs -s -L ${start + 1},${end}:${file}`, { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim().split('\n')[0] || ''
  } catch {
    return ''
  }
}
const CONTENT_DATES = {
  treatments: lastCommitDate(['src/data/treatments.ts']),
  doctors: lastCommitDate(['src/data/doctors.ts']),
  area: lastCommitDate(['src/data/areas.ts', 'src/data/area-treatment.ts']),
  home: lastCommitDate(['src/routes/home.tsx', 'src/data/faq.ts']),
  encyclopedia: lastCommitDate(['src/data/encyclopedia-terms.ts']),
  // llms.txt·llms-full.txt 본문(고정 문구) 마지막 수정일 — '최종 업데이트' 계산용
  llmsTxt: lastCommitDateOfLlmsText('src/routes/seo.tsx', "seoRoutes.get('/llms.txt'"),
  llmsFull: lastCommitDateOfLlmsText('src/routes/seo.tsx', "seoRoutes.get('/llms-full.txt'"),
  // 사이트맵 lastmod 용 페이지군별 실제 수정일(라우트·데이터 파일 마지막 커밋) — 2026-10-08
  // 고정 STATIC_LASTMOD('2026-06-11') 일괄 표기 대체. seo.tsx 자체(사이트맵 코드) 수정은 넣지 않는다.
  treatmentsPage: lastCommitDate(['src/data/treatments.ts', 'src/routes/treatments.tsx']),
  doctorsPage: lastCommitDate(['src/data/doctors.ts', 'src/routes/doctors.tsx']),
  answers: lastCommitDate(['src/routes/answers.tsx', 'src/data/answer-hub.ts']),
  compare: lastCommitDate(['src/routes/compare.tsx', 'src/data/answer-hub.ts']),
  guides: lastCommitDate(['src/routes/guides.tsx', 'src/data/answer-hub.ts']),
  stations: lastCommitDate(['src/routes/stations.tsx', 'src/data/stations.ts']),
  intl: lastCommitDate(['src/routes/intl.tsx']),
  ru: lastCommitDate(['src/routes/ru.tsx']),
  reviews: lastCommitDate(['src/routes/reviews.tsx', 'src/data/reviews.ts']),
  procedures: lastCommitDate(['src/routes/procedures.tsx', 'src/data/procedures.ts']),
  insurance: lastCommitDate(['src/routes/insurance.tsx']),
  events: lastCommitDate(['src/routes/events.tsx', 'src/routes/event.tsx']),
  whyus: lastCommitDate(['src/routes/whyus.tsx']),
  commercial: lastCommitDate(['src/routes/commercial.tsx']),
}

export default defineConfig({
  define: {
    __CONTENT_DATES__: JSON.stringify(CONTENT_DATES),
  },
  plugins: [
    build(),
    devServer({
      adapter,
      entry: 'src/index.tsx'
    })
  ]
})
