#!/usr/bin/env node
// ============================================================
// 화면용 이미지 사본 채우기 (2026-11-10)
//  D1 에 적힌 R2 이미지(공지 image, 치료 사례 before/after, 칼럼 표지)마다
//  가로 640·1600 WebP 사본을 만들어 R2 v/<폭>/<원본키> 에 올린다. 원본은 읽기만 한다.
//  관리자 화면 업로드는 app.js(p365Variants)가 자동으로 사본을 만들므로, 이 스크립트는
//  ① 그 전에 올라간 이미지 ② 관리자 화면 밖(API·wrangler)에서 올린 이미지에 쓴다.
//
//  사용: node scripts/backfill-image-variants.mjs            (사본이 없는 것만)
//        node scripts/backfill-image-variants.mjs --force    (전부 다시)
//        node scripts/backfill-image-variants.mjs --dry      (목록·예상 크기만)
//        node scripts/backfill-image-variants.mjs --only=notices/abc.png,cases/def.jpg
//  필요: wrangler 로그인(D1 읽기·R2 쓰기), sharp(wrangler 가 함께 설치함)
// ============================================================
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import sharp from 'sharp'

const run = promisify(execFile)
const SITE = 'https://seoul365dc.kr'
const BUCKET = 'seoul365-uploads'
const DB = 'seoul365-production'
const WIDTHS = [640, 1600]
const args = process.argv.slice(2)
const FORCE = args.includes('--force'), DRY = args.includes('--dry')
const ONLY = (args.find((a) => a.startsWith('--only=')) || '').slice(7).split(',').filter(Boolean)
const CONC = 5

const wrangler = (a) => run('npx', ['wrangler', ...a], { maxBuffer: 64 * 1024 * 1024 })

async function keysFromDb() {
  const sql = "SELECT image u FROM notices WHERE image LIKE '/r2/%' UNION SELECT before_image FROM before_after_cases WHERE before_image LIKE '/r2/%' UNION SELECT after_image FROM before_after_cases WHERE after_image LIKE '/r2/%' UNION SELECT cover_image FROM blog_posts WHERE cover_image LIKE '/r2/%'"
  const { stdout } = await wrangler(['d1', 'execute', DB, '--remote', '--json', '--command', sql])
  return JSON.parse(stdout)[0].results.map((r) => String(r.u).replace(/^\/r2\//, '').split('?')[0]).filter((k) => k && !k.startsWith('v/') && !/\.(gif|svg)$/i.test(k))
}

// 사본이 이미 있는지: 공개 주소(/r2/v/<폭>/<키>)로 확인. 캐시된 404 를 피하려고 매번 다른 쿼리를 붙인다.
async function exists(w, key) {
  try { const r = await fetch(`${SITE}/r2/v/${w}/${key}?probe=${Date.now()}`, { method: 'HEAD' }); return r.status === 200 && /^image\//.test(r.headers.get('content-type') || '') } catch { return false }
}

const tmp = mkdtempSync(join(tmpdir(), 'p365-variants-'))
let made = 0, skipped = 0, failed = 0, inBytes = 0, outBytes = { 640: 0, 1600: 0 }

async function one(key, i, n) {
  try {
    const need = []
    for (const w of WIDTHS) if (FORCE || !(await exists(w, key))) need.push(w)
    if (!need.length) { skipped++; return }
    const res = await fetch(`${SITE}/r2/${key}`)
    if (!res.ok) throw new Error('원본 ' + res.status)
    const src = Buffer.from(await res.arrayBuffer()); inBytes += src.length
    for (const w of need) {
      // rotate(): EXIF 방향을 실제 픽셀에 반영(브라우저가 원본을 보여 주던 방향과 같게)
      const out = await sharp(src, { failOn: 'none' }).rotate().resize({ width: w, withoutEnlargement: true }).webp({ quality: 80 }).toBuffer()
      outBytes[w] += out.length
      if (DRY) continue
      const f = join(tmp, `${i}-${w}.webp`); writeFileSync(f, out)
      await wrangler(['r2', 'object', 'put', `${BUCKET}/v/${w}/${key}`, '--remote', '--file', f, '--content-type', 'image/webp', '--cache-control', 'public, max-age=31536000, immutable'])
      rmSync(f, { force: true })
    }
    made++
    console.log(`[${i + 1}/${n}] ${key}  ${(src.length / 1024).toFixed(0)}KB → ${need.join('·')}`)
  } catch (e) {
    failed++
    console.error(`[${i + 1}/${n}] 실패 ${key}: ${String(e.message || e).slice(0, 200)}`)
  }
}

const keys = ONLY.length ? ONLY : [...new Set(await keysFromDb())]
console.log(`대상 ${keys.length}개${DRY ? ' (dry-run)' : ''}`)
let next = 0
await Promise.all(Array.from({ length: CONC }, async () => { while (next < keys.length) { const i = next++; await one(keys[i], i, keys.length) } }))
rmSync(tmp, { recursive: true, force: true })
console.log(JSON.stringify({ total: keys.length, made, skipped, failed, originalMB: +(inBytes / 1048576).toFixed(1), v640MB: +(outBytes[640] / 1048576).toFixed(2), v1600MB: +(outBytes[1600] / 1048576).toFixed(2) }))
process.exit(failed ? 1 : 0)
