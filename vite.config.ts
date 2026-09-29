import build from '@hono/vite-build/cloudflare-pages'
import devServer from '@hono/vite-dev-server'
import adapter from '@hono/vite-dev-server/cloudflare'
import { defineConfig } from 'vite'
import { execSync } from 'node:child_process'

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
const CONTENT_DATES = {
  treatments: lastCommitDate(['src/data/treatments.ts']),
  doctors: lastCommitDate(['src/data/doctors.ts']),
  area: lastCommitDate(['src/data/areas.ts', 'src/data/area-treatment.ts']),
  home: lastCommitDate(['src/routes/home.tsx', 'src/data/faq.ts']),
  encyclopedia: lastCommitDate(['src/data/encyclopedia-terms.ts']),
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
