// ============================================================
// Seoul365 Dental — Shared Types
// ============================================================
import { Hono } from 'hono'

export type Bindings = {
  DB: D1Database;
  R2: R2Bucket;
  // SEO/Analytics 환경변수 (Cloudflare Secrets 또는 .dev.vars)
  GA4_MEASUREMENT_ID?: string;      // G-XXXXXXXXXX
  GTM_CONTAINER_ID?: string;        // GTM-XXXXXXX
  GOOGLE_SITE_VERIFICATION?: string;
  NAVER_SITE_VERIFICATION?: string;
  BING_SITE_VERIFICATION?: string;
  INDEXNOW_KEY?: string;            // IndexNow API key
}
export type App = Hono<{ Bindings: Bindings }>
