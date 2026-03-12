import { Hono } from 'hono'
import type { Bindings } from '../lib/types'
import { CLINIC } from '../data/clinic'
import { treatments } from '../data/treatments'
import { doctors } from '../data/doctors'
import { initBlogTables } from '../lib/db'

const seoRoutes = new Hono<{ Bindings: Bindings }>()

seoRoutes.get('/privacy', (c) => {
  return c.render(
    <section class="section-lg">
      <div class="max-w-3xl mx-auto px-5 md:px-8 pt-24">
        <h1 class="section-headline text-gray-900 mb-8">개인정보처리방침</h1>
        <div class="text-gray-500 text-[0.9rem] leading-relaxed space-y-6">
          <p>서울365치과의원(이하 "병원")은 개인정보보호법에 따라 이용자의 개인정보를 보호합니다.</p>
          <h2 class="text-lg font-bold text-gray-900">1. 수집하는 개인정보 항목</h2>
          <p>상담 예약을 위해 이름, 연락처, 상담 내용을 수집합니다.</p>
          <h2 class="text-lg font-bold text-gray-900">2. 이용 목적</h2>
          <p>상담 예약 확인 및 진료 안내 목적으로만 사용됩니다.</p>
          <h2 class="text-lg font-bold text-gray-900">3. 보유 기간</h2>
          <p>수집 목적 달성 후 즉시 파기합니다. 의료법에 따른 진료기록은 법정 보관 기간 동안 보관합니다.</p>
          <h2 class="text-lg font-bold text-gray-900">4. 문의처</h2>
          <p>{CLINIC.phone}</p>
        </div>
      </div>
    </section>,
    { title: '개인정보처리방침 | 서울365치과', canonical: 'https://seoul365dental.com/privacy' }
  )
})

seoRoutes.get('/terms', (c) => {
  return c.render(
    <section class="section-lg">
      <div class="max-w-3xl mx-auto px-5 md:px-8 pt-24">
        <h1 class="section-headline text-gray-900 mb-8">이용약관</h1>
        <div class="text-gray-500 text-[0.9rem] leading-relaxed space-y-6">
          <p>본 웹사이트는 서울365치과의원이 운영합니다.</p>
          <h2 class="text-lg font-bold text-gray-900">1. 서비스 이용</h2>
          <p>병원 정보 제공 및 상담 예약을 위한 목적으로 운영됩니다.</p>
          <h2 class="text-lg font-bold text-gray-900">2. 면책사항</h2>
          <p>정확한 진단과 치료는 내원 상담을 통해 진행됩니다.</p>
          <h2 class="text-lg font-bold text-gray-900">3. 저작권</h2>
          <p>콘텐츠에 대한 저작권은 서울365치과의원에 있습니다.</p>
        </div>
      </div>
    </section>,
    { title: '이용약관 | 서울365치과', canonical: 'https://seoul365dental.com/terms' }
  )
})

// ============================================================
// SITEMAP.XML — Dynamic SEO Sitemap v3.0
// ============================================================
seoRoutes.get('/sitemap.xml', async (c) => {
  const base = 'https://seoul365dental.com';
  const today = new Date().toISOString().split('T')[0];

  // --- 핵심 치료 slug (priority 0.9) ---
  const highPriorityTreatments = new Set([
    'full-implant', 'all-on-x', 'implant', 'orthodontics', 'invisalign',
    'sedation', 'cosmetic', 'pediatric',
  ]);

  // --- Static Pages ---
  const staticPages = [
    {
      loc: '', priority: '1.0', changefreq: 'daily', lastmod: today,
      images: [
        { url: `${base}/static/og-image.jpg`, title: '서울365치과 메인 이미지', caption: '인천 구월동 서울대 출신 5인 전문의 치과' },
        { url: `${base}/static/dr-park.jpg`, title: '박준규 대표원장', caption: '서울대 통합치의학과 전문의' },
      ],
      video: {
        url: 'https://www.youtube.com/watch?v=gB_yiatcwAc',
        title: '서울365치과 소개 영상',
        thumbnail: 'https://img.youtube.com/vi/gB_yiatcwAc/maxresdefault.jpg',
        description: '서울365치과 진료 환경 및 첨단 장비, 감염관리 시스템 클리닉 투어 영상',
      },
    },
    { loc: '/treatments', priority: '0.9', changefreq: 'weekly', lastmod: '2026-03-01' },
    {
      loc: '/doctors', priority: '0.9', changefreq: 'monthly', lastmod: '2026-02-01',
      images: [
        { url: `${base}/static/team-photo.jpg`, title: '서울365치과 의료진 단체사진', caption: '서울대 출신 5인 원장 — 인천 구월동' },
        { url: `${base}/static/dr-park-profile.jpg`, title: '박준규 대표원장 프로필', caption: '서울대 통합치의학과 전문의' },
      ],
    },
    { loc: '/info', priority: '0.8', changefreq: 'monthly', lastmod: '2026-03-01' },
    { loc: '/reservation', priority: '0.8', changefreq: 'monthly', lastmod: '2026-02-01' },
    { loc: '/blog', priority: '0.8', changefreq: 'daily', lastmod: today },
    { loc: '/faq', priority: '0.7', changefreq: 'monthly', lastmod: '2026-03-01' },
    { loc: '/cases/gallery', priority: '0.6', changefreq: 'weekly', lastmod: today },
    { loc: '/privacy', priority: '0.2', changefreq: 'yearly', lastmod: '2026-01-01' },
    { loc: '/terms', priority: '0.2', changefreq: 'yearly', lastmod: '2026-01-01' },
  ];

  // --- Treatment Pages (priority split by importance) ---
  const treatmentPages = treatments.map(t => ({
    loc: `/treatments/${t.slug}`,
    priority: highPriorityTreatments.has(t.slug) ? '0.9' : '0.7',
    changefreq: 'monthly' as const,
    lastmod: '2026-03-01',
    images: [
      { url: `${base}/static/og-image.jpg`, title: `${t.name} | 서울365치과`, caption: t.metaDesc || `인천 구월동 서울365치과 ${t.name} 안내` },
    ],
  }));

  // --- Doctor Pages (all with images) ---
  const doctorPages = doctors.map(d => ({
    loc: `/doctors/${d.slug}`,
    priority: d.slug === 'park-junkyu' ? '0.8' : '0.7',
    changefreq: 'monthly' as const,
    lastmod: '2026-02-01',
    images: [
      {
        url: `${base}/static/dr-${d.slug.split('-').pop()}-profile.jpg`,
        title: `${d.name} ${d.title}`,
        caption: d.metaDesc,
      },
    ],
  }));

  // --- Dynamic Blog Posts ---
  let blogPages: { loc: string; priority: string; changefreq: string; lastmod: string }[] = [];
  try {
    await initBlogTables(c.env.DB);
    const blogResult = await c.env.DB.prepare(
      'SELECT slug, updated_at, created_at FROM blog_posts WHERE is_published = 1 ORDER BY created_at DESC LIMIT 200'
    ).all();
    blogPages = (blogResult.results || []).map((p: any) => ({
      loc: `/blog/${p.slug}`,
      priority: '0.6',
      changefreq: 'weekly',
      lastmod: (p.updated_at || p.created_at || today).substring(0, 10),
    }));
  } catch {}

  const allPages = [...staticPages, ...treatmentPages, ...doctorPages, ...blogPages];

  // XML escape helper
  const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${allPages.map((p: any) => `  <url>
    <loc>${base}${p.loc}</loc>
    <lastmod>${p.lastmod || today}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
    <xhtml:link rel="alternate" hreflang="ko-KR" href="${base}${p.loc}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${base}${p.loc}" />${p.images ? p.images.map((img: any) => `
    <image:image>
      <image:loc>${esc(img.url)}</image:loc>
      <image:title>${esc(img.title)}</image:title>
      <image:caption>${esc(img.caption)}</image:caption>
    </image:image>`).join('') : ''}${p.video ? `
    <video:video>
      <video:thumbnail_loc>${esc(p.video.thumbnail)}</video:thumbnail_loc>
      <video:title>${esc(p.video.title)}</video:title>
      <video:description>${esc(p.video.description)}</video:description>
      <video:content_loc>${esc(p.video.url)}</video:content_loc>
      <video:family_friendly>yes</video:family_friendly>
    </video:video>` : ''}
  </url>`).join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=7200',
      'X-Robots-Tag': 'noindex',
    },
  });
})

// ============================================================
// ROBOTS.TXT — v3.0
// ============================================================
seoRoutes.get('/robots.txt', (c) => {
  const robots = `# ====================================================
# 서울365치과의원 (Seoul 365 Dental Clinic)
# https://seoul365dental.com
# robots.txt v3.0 — SEO/AEO Optimized
# Last updated: ${new Date().toISOString().split('T')[0]}
# ====================================================

# ─── GENERAL RULES (all crawlers) ───
User-agent: *
Allow: /
Allow: /treatments/
Allow: /doctors/
Allow: /info
Allow: /blog
Allow: /faq
Allow: /reservation
Allow: /cases/gallery
Allow: /privacy
Allow: /terms
Allow: /sitemap.xml

# Disallow non-content / private pages
Disallow: /api/
Disallow: /admin
Disallow: /admin/
Disallow: /login
Disallow: /register

# Block UTM/tracking parameter duplicates
Clean-param: utm_source&utm_medium&utm_campaign&utm_content&utm_term&fbclid&gclid&ref

# ─── GOOGLE ───
User-agent: Googlebot
Allow: /
# Note: Googlebot ignores Crawl-delay (use Search Console)

User-agent: Googlebot-Image
Allow: /static/
Allow: /*.jpg$
Allow: /*.png$
Allow: /*.webp$
Allow: /*.svg$
Allow: /*.avif$

User-agent: Googlebot-Video
Allow: /

User-agent: Googlebot-News
Allow: /blog
Allow: /

User-agent: Storebot-Google
Allow: /

User-agent: Google-InspectionTool
Allow: /

# ─── NAVER (한국 1위 검색엔진) ───
User-agent: Yeti
Allow: /
Crawl-delay: 1

User-agent: Naverbot
Allow: /
Crawl-delay: 1

# ─── BING ───
User-agent: Bingbot
Allow: /
Crawl-delay: 1

User-agent: BingPreview
Allow: /

# ─── DAUM/KAKAO ───
User-agent: Daumoa
Allow: /
Crawl-delay: 1

# ─── YAHOO ───
User-agent: Slurp
Allow: /
Crawl-delay: 1

# ─── YANDEX ───
User-agent: YandexBot
Allow: /
Crawl-delay: 2

# ─── APPLE ───
User-agent: Applebot
Allow: /

# ─── SOCIAL MEDIA CRAWLERS ───
User-agent: Twitterbot
Allow: /

User-agent: facebookexternalhit
Allow: /

User-agent: LinkedInBot
Allow: /

User-agent: TelegramBot
Allow: /

User-agent: kakaotalk-scrap
Allow: /

User-agent: Slackbot
Allow: /

# ─── AI/AEO CRAWLERS (핵심: AI 답변 최적화) ───
User-agent: GPTBot
Allow: /
Allow: /treatments/
Allow: /doctors/
Allow: /faq
Allow: /info
Allow: /blog
Allow: /cases/gallery
Disallow: /api/
Disallow: /admin
Disallow: /login
Disallow: /register

User-agent: ChatGPT-User
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Gemini
Allow: /

User-agent: Anthropic-ai
Allow: /

User-agent: Claude-Web
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Bytespider
Allow: /
Crawl-delay: 2

User-agent: CCBot
Allow: /

User-agent: YouBot
Allow: /

User-agent: cohere-ai
Allow: /

User-agent: Diffbot
Allow: /

User-agent: Meta-ExternalAgent
Allow: /

User-agent: Meta-ExternalFetcher
Allow: /

User-agent: AI2Bot
Allow: /

User-agent: Timpibot
Allow: /

User-agent: omgili
Allow: /

User-agent: PetalBot
Allow: /
Crawl-delay: 2

User-agent: DeepSeekBot
Allow: /

User-agent: Qwen
Allow: /

# ─── STRUCTURED DATA VALIDATORS ───
User-agent: Google-Structured-Data-Testing-Tool
Allow: /

User-agent: W3C_Validator
Allow: /

# ─── SEO TOOL BOTS (제한적 허용) ───
User-agent: AhrefsBot
Disallow: /api/
Disallow: /admin
Crawl-delay: 10

User-agent: MJ12bot
Disallow: /api/
Disallow: /admin
Crawl-delay: 10

User-agent: SemrushBot
Disallow: /api/
Disallow: /admin
Crawl-delay: 10

# ─── BLOCK AGGRESSIVE/HARMFUL BOTS ───
User-agent: DotBot
Disallow: /

User-agent: BLEXBot
Disallow: /

User-agent: DataForSeoBot
Disallow: /

User-agent: Seekport
Disallow: /

User-agent: ZoominfoBot
Disallow: /

User-agent: GPTBot-experimental
Disallow: /

# ─── SITEMAP ───
Sitemap: https://seoul365dental.com/sitemap.xml

# ─── HOST (Yandex directive) ───
Host: https://seoul365dental.com
`;

  return new Response(robots, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=604800',
      'X-Robots-Tag': 'all',
    },
  });
})

// ============================================================
// 404
// ============================================================
seoRoutes.notFound((c) => {
  return c.render(
    <section class="hero-premium" style="min-height:80vh">
      <div class="hero-grid"></div>
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>
      <div class="relative z-10 max-w-lg mx-auto px-5 text-center">
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

export default seoRoutes
