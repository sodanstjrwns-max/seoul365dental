// ============================================================
// Seoul365 Dental — Main Entry Point
// Modular architecture: routes split into separate files
// ============================================================
import { Hono } from 'hono'
import { renderer, setCurrentSeoSettings } from './renderer'
import type { Bindings } from './lib/types'
import { getAllSeoSettings, getSetting, initSettingsTable } from './lib/db'

// Route modules
import home from './routes/home'
import treatmentRoutes from './routes/treatments'
import doctorRoutes from './routes/doctors'
import pageRoutes from './routes/pages'
import apiRoutes from './routes/api'
import adminRoutes from './routes/admin'
import blogRoutes from './routes/blog'
import seoRoutes from './routes/seo'
import areaRoutes from './routes/area'

const app = new Hono<{ Bindings: Bindings }>()

// ── IndexNow Key File (.txt) — Must be FIRST before any other route ──
// Hono's /:param.txt pattern is unreliable; handle .txt requests at top level
app.get('/:filename{.+\\.txt$}', async (c, next) => {
  const filename = c.req.param('filename');
  // robots.txt는 seoRoutes에서 처리 → 여기서 스킵
  if (filename === 'robots.txt') return next();
  const key = filename.replace('.txt', '');
  try {
    await initSettingsTable(c.env.DB);
    const indexNowKey = await getSetting(c.env.DB, 'INDEXNOW_KEY', c.env.INDEXNOW_KEY || '');
    if (indexNowKey && key === indexNowKey) {
      return new Response(indexNowKey, {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      });
    }
  } catch {}
  // Not an IndexNow key — fall through to 404
  return c.notFound();
})

// ── Naver Search Advisor HTML Verification File ──
app.get('/naverc88e4f49632c4e687edac6645aeef061.html', (c) => {
  return c.html('naverc88e4f49632c4e687edac6645aeef061');
})

// ── Global Middleware ─────────────────────────────────────
app.use('*', async (c, next) => {
  await next();
  // Security headers
  c.header('X-Content-Type-Options', 'nosniff');
  c.header('X-Frame-Options', 'SAMEORIGIN');
  c.header('Referrer-Policy', 'strict-origin-when-cross-origin');
  c.header('Permissions-Policy', 'camera=(), microphone=(), geolocation=(self)');
})

// SEO settings middleware: load from DB + env, inject into renderer context
app.use('*', async (c, next) => {
  // Skip for API and static routes
  const path = c.req.path;
  if (path.startsWith('/api/') || path.startsWith('/static/') || path === '/robots.txt' || path.startsWith('/sitemap')) {
    return next();
  }
  try {
    const seoSettings = await getAllSeoSettings(c.env.DB, c.env as any);
    setCurrentSeoSettings(seoSettings);
  } catch {
    setCurrentSeoSettings({});
  }
  await next();
})

app.use(renderer)

// ── Route Registration ───────────────────────────────────
// Order matters: more specific routes first

// Public pages
app.route('/', home)
app.route('/', treatmentRoutes)
app.route('/', doctorRoutes)
app.route('/', pageRoutes)
app.route('/', areaRoutes)

// API endpoints
app.route('/', apiRoutes)

// Admin & Blog (includes admin pages + API)
app.route('/', adminRoutes)
app.route('/', blogRoutes)

// SEO (sitemap, robots, privacy, terms, 404)
app.route('/', seoRoutes)

// ── Custom 404 Page ────────────────────────────────────
app.notFound((c) => {
  return c.render(
    <section class="hero-premium" style="min-height:80vh">
      <div class="hero-grid"></div>
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>
      <div class="relative z-10 max-w-lg mx-auto px-5 text-center" style="padding-top:15vh">
        <div class="text-[8rem] font-black gradient-text-white leading-none mb-4" style="opacity:0.06">404</div>
        <h1 class="text-2xl font-bold text-white mb-3">페이지를 찾을 수 없습니다</h1>
        <p class="text-white/35 mb-8">요청하신 페이지가 존재하지 않거나 이동되었습니다.</p>
        <div class="flex flex-wrap justify-center gap-3">
          <a href="/" class="btn-premium btn-premium-fill" data-cursor-hover>홈으로 가기</a>
          <a href="/treatments" class="btn-premium btn-premium-white" data-cursor-hover>진료 안내</a>
        </div>
      </div>
    </section>,
    { title: '404 - 페이지를 찾을 수 없습니다 | 서울365치과' }
  )
})

export default app
