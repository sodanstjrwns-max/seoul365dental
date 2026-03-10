// ============================================================
// Seoul365 Dental — Main Entry Point
// Modular architecture: routes split into separate files
// ============================================================
import { Hono } from 'hono'
import { renderer } from './renderer'
import type { Bindings } from './lib/types'

// Route modules
import home from './routes/home'
import treatmentRoutes from './routes/treatments'
import doctorRoutes from './routes/doctors'
import pageRoutes from './routes/pages'
import apiRoutes from './routes/api'
import adminRoutes from './routes/admin'
import blogRoutes from './routes/blog'
import seoRoutes from './routes/seo'

const app = new Hono<{ Bindings: Bindings }>()

// ── Global Middleware ─────────────────────────────────────
app.use('*', async (c, next) => {
  await next();
  // Security headers
  c.header('X-Content-Type-Options', 'nosniff');
  c.header('X-Frame-Options', 'SAMEORIGIN');
  c.header('Referrer-Policy', 'strict-origin-when-cross-origin');
  c.header('Permissions-Policy', 'camera=(), microphone=(), geolocation=(self)');
})

app.use(renderer)

// ── Route Registration ───────────────────────────────────
// Order matters: more specific routes first

// Public pages
app.route('/', home)
app.route('/', treatmentRoutes)
app.route('/', doctorRoutes)
app.route('/', pageRoutes)

// API endpoints
app.route('/', apiRoutes)

// Admin & Blog (includes admin pages + API)
app.route('/', adminRoutes)
app.route('/', blogRoutes)

// SEO (sitemap, robots, privacy, terms, 404)
app.route('/', seoRoutes)

export default app
