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
  PING_TOKEN?: string;              // v2: 공개 ping 엔드포인트 토큰
  CRON_TOKEN?: string;              // v3: 외부 cron-job.org 호출 토큰
}
export type App = Hono<{ Bindings: Bindings }>
