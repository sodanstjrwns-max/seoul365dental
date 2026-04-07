import { Hono } from 'hono'
import type { Bindings } from '../lib/types'
import { CLINIC } from '../data/clinic'
import { treatments } from '../data/treatments'
import { doctors } from '../data/doctors'
import { initBlogTables, getSetting } from '../lib/db'

const seoRoutes = new Hono<{ Bindings: Bindings }>()

seoRoutes.get('/privacy', (c) => {
  return c.render(
    <section class="section-lg">
      <div class="max-w-3xl mx-auto px-5 md:px-8 pt-24 pb-16">
        <h1 class="section-headline text-gray-900 mb-3">개인정보처리방침</h1>
        <p class="text-sm text-gray-400 mb-10">시행일: 2026년 3월 1일 | 최종 수정: 2026년 3월 14일</p>
        
        <div class="text-gray-500 text-[0.9rem] leading-relaxed space-y-8">
          <p>서울365치과의원(이하 "병원")은 「개인정보 보호법」 제30조에 따라 정보주체의 개인정보를 보호하고 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 다음과 같이 개인정보 처리방침을 수립·공개합니다.</p>

          <div>
            <h2 class="text-lg font-bold text-gray-900 mb-3">제1조 (개인정보의 수집 항목 및 수집 방법)</h2>
            <p class="mb-2">병원은 다음의 개인정보를 수집합니다.</p>
            <div class="overflow-x-auto">
              <table class="w-full text-sm border-collapse border border-gray-200 rounded-xl overflow-hidden">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="border border-gray-200 px-4 py-2.5 text-left font-semibold text-gray-700">구분</th>
                    <th class="border border-gray-200 px-4 py-2.5 text-left font-semibold text-gray-700">수집 항목</th>
                    <th class="border border-gray-200 px-4 py-2.5 text-left font-semibold text-gray-700">수집 방법</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="border border-gray-200 px-4 py-2 font-medium text-gray-700">회원가입 (필수)</td>
                    <td class="border border-gray-200 px-4 py-2">이름, 휴대폰 번호, 비밀번호(암호화 저장)</td>
                    <td class="border border-gray-200 px-4 py-2">홈페이지 회원가입</td>
                  </tr>
                  <tr>
                    <td class="border border-gray-200 px-4 py-2 font-medium text-gray-700">상담 문의 (필수)</td>
                    <td class="border border-gray-200 px-4 py-2">이름, 연락처, 상담 내용, 관심 진료</td>
                    <td class="border border-gray-200 px-4 py-2">홈페이지 상담 폼</td>
                  </tr>
                  <tr>
                    <td class="border border-gray-200 px-4 py-2 font-medium text-gray-700">마케팅 수신 (선택)</td>
                    <td class="border border-gray-200 px-4 py-2">이름, 연락처</td>
                    <td class="border border-gray-200 px-4 py-2">회원가입 시 동의</td>
                  </tr>
                  <tr>
                    <td class="border border-gray-200 px-4 py-2 font-medium text-gray-700">자동 수집</td>
                    <td class="border border-gray-200 px-4 py-2">접속 IP, 접속 일시, 브라우저 정보, 쿠키</td>
                    <td class="border border-gray-200 px-4 py-2">서비스 이용 과정에서 자동 생성·수집</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h2 class="text-lg font-bold text-gray-900 mb-3">제2조 (개인정보의 수집·이용 목적)</h2>
            <ul class="list-disc pl-5 space-y-1">
              <li><strong>회원 관리:</strong> 회원제 서비스 이용에 따른 본인확인, 개인식별, 부정이용 방지</li>
              <li><strong>진료 상담:</strong> 상담 예약 확인, 진료 안내, 사후 관리 안내</li>
              <li><strong>마케팅(선택 동의 시):</strong> 신규 진료 안내, 건강정보 제공, 이벤트·프로모션 알림 (문자/카카오)</li>
              <li><strong>서비스 개선:</strong> 접속 빈도 분석, 서비스 이용 통계</li>
            </ul>
          </div>

          <div>
            <h2 class="text-lg font-bold text-gray-900 mb-3">제3조 (개인정보의 보유 및 이용 기간)</h2>
            <div class="overflow-x-auto">
              <table class="w-full text-sm border-collapse border border-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="border border-gray-200 px-4 py-2.5 text-left font-semibold text-gray-700">보유 항목</th>
                    <th class="border border-gray-200 px-4 py-2.5 text-left font-semibold text-gray-700">보유 기간</th>
                    <th class="border border-gray-200 px-4 py-2.5 text-left font-semibold text-gray-700">근거 법령</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="border border-gray-200 px-4 py-2">회원 정보</td>
                    <td class="border border-gray-200 px-4 py-2">회원 탈퇴 시까지</td>
                    <td class="border border-gray-200 px-4 py-2">개인정보 보호법</td>
                  </tr>
                  <tr>
                    <td class="border border-gray-200 px-4 py-2">진료기록</td>
                    <td class="border border-gray-200 px-4 py-2">10년</td>
                    <td class="border border-gray-200 px-4 py-2">의료법 제22조</td>
                  </tr>
                  <tr>
                    <td class="border border-gray-200 px-4 py-2">상담 문의 기록</td>
                    <td class="border border-gray-200 px-4 py-2">3년</td>
                    <td class="border border-gray-200 px-4 py-2">전자상거래법</td>
                  </tr>
                  <tr>
                    <td class="border border-gray-200 px-4 py-2">접속 로그</td>
                    <td class="border border-gray-200 px-4 py-2">3개월</td>
                    <td class="border border-gray-200 px-4 py-2">통신비밀보호법</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h2 class="text-lg font-bold text-gray-900 mb-3">제4조 (개인정보의 제3자 제공)</h2>
            <p>병원은 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다. 다만 다음의 경우 예외로 합니다.</p>
            <ul class="list-disc pl-5 space-y-1 mt-2">
              <li>이용자가 사전에 동의한 경우</li>
              <li>법령에 의하여 수사 목적으로 관련 기관의 요구가 있는 경우</li>
            </ul>
          </div>

          <div>
            <h2 class="text-lg font-bold text-gray-900 mb-3">제5조 (개인정보의 파기 절차 및 방법)</h2>
            <ul class="list-disc pl-5 space-y-1">
              <li><strong>파기 절차:</strong> 보유 기간 경과, 처리 목적 달성 등 불필요 시 즉시 파기</li>
              <li><strong>파기 방법:</strong> 전자적 파일 형태는 복구 불가능한 방법으로 영구 삭제, 종이 문서는 분쇄 또는 소각</li>
            </ul>
          </div>

          <div>
            <h2 class="text-lg font-bold text-gray-900 mb-3">제6조 (정보주체의 권리·의무 및 행사 방법)</h2>
            <p class="mb-2">이용자는 언제든지 다음의 권리를 행사할 수 있습니다.</p>
            <ul class="list-disc pl-5 space-y-1">
              <li>개인정보 열람 요구</li>
              <li>오류 등이 있을 경우 정정 요구</li>
              <li>삭제(탈퇴) 요구</li>
              <li>처리 정지 요구</li>
              <li><strong>마케팅 수신 동의 철회:</strong> 언제든 전화({CLINIC.phone}) 또는 문자로 요청 가능</li>
            </ul>
          </div>

          <div>
            <h2 class="text-lg font-bold text-gray-900 mb-3">제7조 (개인정보의 안전성 확보 조치)</h2>
            <ul class="list-disc pl-5 space-y-1">
              <li>비밀번호 암호화 저장 (SHA-256 해시)</li>
              <li>SSL/TLS 보안 통신 적용</li>
              <li>접근 권한 최소화 및 관리</li>
              <li>정기적인 보안 점검</li>
            </ul>
          </div>

          <div>
            <h2 class="text-lg font-bold text-gray-900 mb-3">제8조 (쿠키의 사용)</h2>
            <p>병원은 로그인 세션 유지를 위해 쿠키를 사용합니다. 이용자는 브라우저 설정을 통해 쿠키 저장을 거부할 수 있으나, 이 경우 로그인이 필요한 서비스 이용이 제한될 수 있습니다.</p>
          </div>

          <div>
            <h2 class="text-lg font-bold text-gray-900 mb-3">제9조 (개인정보 보호책임자)</h2>
            <div class="bg-gray-50 rounded-2xl p-5 border border-gray-100">
              <p><strong>개인정보 보호책임자</strong></p>
              <p class="mt-1">성명: 박준규</p>
              <p>직위: 대표원장</p>
              <p>연락처: {CLINIC.phone}</p>
              <p>이메일: info@seoul365dc.kr</p>
            </div>
          </div>

          <div>
            <h2 class="text-lg font-bold text-gray-900 mb-3">제10조 (개인정보 처리방침의 변경)</h2>
            <p>이 개인정보 처리방침은 시행일로부터 적용되며, 관련 법령 및 방침의 변경이 있을 경우 홈페이지를 통해 공개합니다.</p>
          </div>
        </div>
      </div>
    </section>,
    {
      title: '개인정보처리방침 | 서울365치과',
      description: '서울365치과의원 개인정보처리방침. 수집 항목, 이용 목적, 보유 기간, 파기 절차 등을 안내합니다.',
      canonical: 'https://seoul365dc.kr/privacy',
      jsonLd: [
        {
          "@context": "https://schema.org", "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "홈", "item": "https://seoul365dc.kr" },
            { "@type": "ListItem", "position": 2, "name": "개인정보처리방침", "item": "https://seoul365dc.kr/privacy" }
          ]
        },
        {
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "개인정보처리방침",
          "url": "https://seoul365dc.kr/privacy",
          "isPartOf": { "@id": "https://seoul365dc.kr/#website" },
          "inLanguage": "ko-KR",
          "dateModified": "2026-03-14",
          "description": "서울365치과의원 개인정보처리방침"
        }
      ]
    }
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
    {
      title: '이용약관 | 서울365치과',
      description: '서울365치과의원 이용약관. 서비스 이용, 면책사항, 저작권에 대한 안내입니다.',
      canonical: 'https://seoul365dc.kr/terms',
      jsonLd: [
        {
          "@context": "https://schema.org", "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "홈", "item": "https://seoul365dc.kr" },
            { "@type": "ListItem", "position": 2, "name": "이용약관", "item": "https://seoul365dc.kr/terms" }
          ]
        },
        {
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "이용약관",
          "url": "https://seoul365dc.kr/terms",
          "isPartOf": { "@id": "https://seoul365dc.kr/#website" },
          "inLanguage": "ko-KR",
          "description": "서울365치과의원 이용약관"
        }
      ]
    }
  )
})

// ============================================================
// SITEMAP SYSTEM v4.0 — Sitemap Index + Sub-Sitemaps
// Google/Bing/Naver 최적화: 카테고리별 분리, 실시간 lastmod
// ============================================================

// XML escape helper
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Common XML header for sub-sitemaps
const urlsetOpen = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">`;

// Render a single <url> entry
const renderUrl = (base: string, p: any) => `  <url>
    <loc>${base}${p.loc}</loc>
    <lastmod>${p.lastmod}</lastmod>
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
  </url>`;

const sitemapHeaders = {
  'Content-Type': 'application/xml; charset=utf-8',
  'Cache-Control': 'public, max-age=3600, s-maxage=7200',
  // X-Robots-Tag: noindex 제거 — Google이 사이트맵을 정상 처리하도록
};

// ── 1) SITEMAP INDEX (master) ──
seoRoutes.get('/sitemap.xml', async (c) => {
  const base = 'https://seoul365dc.kr';
  const today = new Date().toISOString().split('T')[0];

  // Check blog last update for dynamic lastmod
  let blogLastmod = today;
  try {
    await initBlogTables(c.env.DB);
    const r = await c.env.DB.prepare(
      'SELECT MAX(COALESCE(updated_at, created_at)) as last_date FROM blog_posts WHERE is_published = 1'
    ).first<{ last_date: string }>();
    if (r?.last_date) blogLastmod = r.last_date.substring(0, 10);
  } catch {}

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${base}/sitemap-pages.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${base}/sitemap-treatments.xml</loc>
    <lastmod>2026-03-27</lastmod>
  </sitemap>
  <sitemap>
    <loc>${base}/sitemap-doctors.xml</loc>
    <lastmod>2026-03-01</lastmod>
  </sitemap>
  <sitemap>
    <loc>${base}/sitemap-blog.xml</loc>
    <lastmod>${blogLastmod}</lastmod>
  </sitemap>
</sitemapindex>`;

  return new Response(xml, { headers: sitemapHeaders });
})

// ── 2) SITEMAP — Core Pages ──
seoRoutes.get('/sitemap-pages.xml', (c) => {
  const base = 'https://seoul365dc.kr';
  const today = new Date().toISOString().split('T')[0];

  const pages = [
    {
      loc: '', priority: '1.0', changefreq: 'daily', lastmod: today,
      images: [
        { url: `${base}/static/og-image.png`, title: '서울365치과 메인 이미지', caption: '인천 구월동 서울대 출신 5인 전문의 치과' },
        { url: `${base}/static/dr-park.jpg`, title: '박준규 대표원장', caption: '서울대 통합치의학과 전문의' },
      ],
      video: {
        url: 'https://www.youtube.com/watch?v=gB_yiatcwAc',
        title: '서울365치과 소개 영상',
        thumbnail: 'https://img.youtube.com/vi/gB_yiatcwAc/maxresdefault.jpg',
        description: '서울365치과 진료 환경 및 첨단 장비, 감염관리 시스템 클리닉 투어 영상',
      },
    },
    { loc: '/treatments', priority: '0.9', changefreq: 'weekly', lastmod: '2026-03-27' },
    {
      loc: '/doctors', priority: '0.9', changefreq: 'monthly', lastmod: '2026-03-01',
      images: [
        { url: `${base}/static/team-photo.jpg`, title: '서울365치과 의료진 단체사진', caption: '서울대 출신 5인 원장 — 인천 구월동' },
        { url: `${base}/static/dr-park-profile.jpg`, title: '박준규 대표원장 프로필', caption: '서울대 통합치의학과 전문의' },
      ],
    },
    { loc: '/info', priority: '0.8', changefreq: 'monthly', lastmod: '2026-03-01' },
    { loc: '/reservation', priority: '0.8', changefreq: 'monthly', lastmod: '2026-03-01' },
    { loc: '/blog', priority: '0.8', changefreq: 'daily', lastmod: today },
    { loc: '/faq', priority: '0.7', changefreq: 'monthly', lastmod: '2026-03-01' },
    { loc: '/cases/gallery', priority: '0.6', changefreq: 'weekly', lastmod: today },
    { loc: '/notices', priority: '0.5', changefreq: 'weekly', lastmod: today },
    { loc: '/privacy', priority: '0.2', changefreq: 'yearly', lastmod: '2026-03-14' },
    { loc: '/terms', priority: '0.2', changefreq: 'yearly', lastmod: '2026-03-14' },
  ];

  const xml = `${urlsetOpen}\n${pages.map(p => renderUrl(base, p)).join('\n')}\n</urlset>`;
  return new Response(xml, { headers: sitemapHeaders });
})

// ── 3) SITEMAP — Treatment Pages ──
seoRoutes.get('/sitemap-treatments.xml', (c) => {
  const base = 'https://seoul365dc.kr';

  const highPriority = new Set([
    'full-implant', 'digital-full-arch', 'implant', 'orthodontics', 'invisalign',
    'sedation', 'cosmetic', 'pediatric',
  ]);

  const pages = treatments.map(t => ({
    loc: `/treatments/${t.slug}`,
    priority: highPriority.has(t.slug) ? '0.9' : '0.7',
    changefreq: 'monthly' as const,
    lastmod: '2026-03-27',
    images: [
      { url: `${base}/static/og-image.png`, title: `${t.name} | 서울365치과`, caption: t.metaDesc || `인천 구월동 서울365치과 ${t.name} 안내` },
    ],
  }));

  const xml = `${urlsetOpen}\n${pages.map(p => renderUrl(base, p)).join('\n')}\n</urlset>`;
  return new Response(xml, { headers: sitemapHeaders });
})

// ── 4) SITEMAP — Doctor Pages ──
seoRoutes.get('/sitemap-doctors.xml', (c) => {
  const base = 'https://seoul365dc.kr';

  const pages = doctors.map(d => ({
    loc: `/doctors/${d.slug}`,
    priority: d.slug === 'park-junkyu' ? '0.8' : '0.7',
    changefreq: 'monthly' as const,
    lastmod: '2026-03-01',
    images: [
      {
        url: `${base}/static/dr-${d.slug.split('-').pop()}-profile.jpg`,
        title: `${d.name} ${d.title}`,
        caption: d.metaDesc,
      },
    ],
  }));

  const xml = `${urlsetOpen}\n${pages.map(p => renderUrl(base, p)).join('\n')}\n</urlset>`;
  return new Response(xml, { headers: sitemapHeaders });
})

// ── 5) SITEMAP — Blog Posts (Dynamic from DB) ──
seoRoutes.get('/sitemap-blog.xml', async (c) => {
  const base = 'https://seoul365dc.kr';
  const today = new Date().toISOString().split('T')[0];

  let blogPages: any[] = [];
  try {
    await initBlogTables(c.env.DB);
    const blogResult = await c.env.DB.prepare(
      'SELECT slug, title, excerpt, updated_at, created_at FROM blog_posts WHERE is_published = 1 ORDER BY created_at DESC LIMIT 1000'
    ).all();
    blogPages = (blogResult.results || []).map((p: any) => ({
      loc: `/blog/${p.slug}`,
      priority: '0.6',
      changefreq: 'weekly',
      lastmod: (p.updated_at || p.created_at || today).substring(0, 10),
    }));
  } catch {}

  const xml = `${urlsetOpen}\n${blogPages.map(p => renderUrl(base, p)).join('\n')}\n</urlset>`;
  return new Response(xml, { headers: sitemapHeaders });
})

// ============================================================
// ROBOTS.TXT — v3.0
// ============================================================
seoRoutes.get('/robots.txt', (c) => {
  const robots = `# ====================================================
# 서울365치과의원 (Seoul 365 Dental Clinic)
# https://seoul365dc.kr
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
Sitemap: https://seoul365dc.kr/sitemap.xml
Sitemap: https://seoul365dc.kr/sitemap-pages.xml
Sitemap: https://seoul365dc.kr/sitemap-treatments.xml
Sitemap: https://seoul365dc.kr/sitemap-doctors.xml
Sitemap: https://seoul365dc.kr/sitemap-blog.xml

# ─── HOST (Yandex directive) ───
Host: https://seoul365dc.kr
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
// IndexNow — Instant Indexing for Bing/Yandex/Naver
// ============================================================

// IndexNow key file endpoint (required by protocol)
// Matches /<hex-key>.txt pattern — must use wildcard because Hono's /:param.txt is unreliable
seoRoutes.get('/indexnow-key-file', async (c) => {
  const indexNowKey = await getSetting(c.env.DB, 'INDEXNOW_KEY', c.env.INDEXNOW_KEY || '');
  if (!indexNowKey) return c.notFound();
  return new Response(indexNowKey, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
})

// IndexNow submit API (admin-triggered)
seoRoutes.post('/api/indexnow/submit', async (c) => {
  // Verify admin session
  const cookie = c.req.header('Cookie');
  const match = cookie?.match(/(?:^|;\s*)admin_session=([^;]+)/);
  if (!match) return c.json({ error: '관리자 인증 필요' }, 401);

  const indexNowKey = await getSetting(c.env.DB, 'INDEXNOW_KEY', c.env.INDEXNOW_KEY || '');
  if (!indexNowKey) return c.json({ error: 'IndexNow 키가 설정되지 않았습니다' }, 400);

  const body = await c.req.json<{ urls?: string[] }>().catch(() => ({}));
  const base = 'https://seoul365dc.kr';

  // Default: submit all important pages
  const urls = body.urls?.length ? body.urls : [
    '/', '/treatments', '/doctors', '/info', '/reservation',
    '/blog', '/faq', '/cases/gallery',
    ...treatments.map(t => `/treatments/${t.slug}`),
    ...doctors.map(d => `/doctors/${d.slug}`),
  ].map(p => `${base}${p}`);

  // Submit to IndexNow API (covers Bing, Yandex, Naver, Seznam, etc.)
  const endpoints = [
    'https://api.indexnow.org/indexnow',
    'https://www.bing.com/indexnow',
    'https://yandex.com/indexnow',
  ];

  const results: Record<string, number> = {};
  for (const endpoint of endpoints) {
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify({
          host: 'seoul365dc.kr',
          key: indexNowKey,
          keyLocation: `${base}/${indexNowKey}.txt`,
          urlList: urls,
        }),
      });
      results[endpoint] = res.status;
    } catch {
      results[endpoint] = 0;
    }
  }

  return c.json({ ok: true, submitted: urls.length, results });
})

// Search Engine Ping — Notify sitemap updates
seoRoutes.post('/api/seo/ping', async (c) => {
  const cookie = c.req.header('Cookie');
  const match = cookie?.match(/(?:^|;\s*)admin_session=([^;]+)/);
  if (!match) return c.json({ error: '관리자 인증 필요' }, 401);

  const sitemapUrl = 'https://seoul365dc.kr/sitemap.xml';
  const pingTargets = [
    `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`,
    `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`,
  ];

  const results: Record<string, number> = {};
  for (const url of pingTargets) {
    try {
      const res = await fetch(url);
      results[url.split('//')[1]?.split('/')[0] || url] = res.status;
    } catch {
      results[url] = 0;
    }
  }

  return c.json({ ok: true, results });
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
