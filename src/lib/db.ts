// ============================================================
// Seoul365 Dental — Shared DB Helpers
// ============================================================

// Admin session verification via admin_session cookie
export async function getAdminFromCookie(
  db: D1Database,
  cookieHeader?: string | null
): Promise<{ id: number; username: string; name: string } | null> {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(/(?:^|;\s*)admin_session=([^;]+)/);
  if (!match) return null;
  try {
    const row = await db.prepare(`
      SELECT a.id, a.username, a.name FROM admin_sessions s
      JOIN admin_users a ON a.id = s.admin_id
      WHERE s.id = ? AND s.expires_at > datetime('now')
    `).bind(match[1]).first<{ id: number; username: string; name: string }>();
    return row || null;
  } catch { return null; }
}

// Alias for backward compatibility
export const getAdminUser = getAdminFromCookie;

// Init admin tables (idempotent, with flag to skip redundant calls)
let _adminTablesReady = false;
export async function initAdminTables(db: D1Database) {
  if (_adminTablesReady) return;
  await db.batch([
    db.prepare(`CREATE TABLE IF NOT EXISTS admin_users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT NOT NULL UNIQUE, password_hash TEXT NOT NULL, name TEXT NOT NULL, role TEXT DEFAULT 'admin', created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`),
    db.prepare(`CREATE TABLE IF NOT EXISTS admin_sessions (id TEXT PRIMARY KEY, admin_id INTEGER NOT NULL, expires_at DATETIME NOT NULL, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (admin_id) REFERENCES admin_users(id) ON DELETE CASCADE)`),
    db.prepare(`CREATE TABLE IF NOT EXISTS before_after_cases (id INTEGER PRIMARY KEY AUTOINCREMENT, treatment_slug TEXT NOT NULL, title TEXT NOT NULL, patient_age TEXT, patient_gender TEXT, tag TEXT NOT NULL, doctor_name TEXT NOT NULL, description TEXT, duration TEXT, before_image TEXT, after_image TEXT, is_published INTEGER DEFAULT 1, sort_order INTEGER DEFAULT 0, view_count INTEGER DEFAULT 0, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP)`),
    db.prepare(`CREATE TABLE IF NOT EXISTS consultations (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, phone TEXT NOT NULL, treatment TEXT, message TEXT, status TEXT DEFAULT 'new', admin_memo TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP)`),
    db.prepare(`CREATE TABLE IF NOT EXISTS notices (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, content TEXT NOT NULL, category TEXT DEFAULT '공지', is_pinned INTEGER DEFAULT 0, is_published INTEGER DEFAULT 1, is_popup INTEGER DEFAULT 0, view_count INTEGER DEFAULT 0, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP)`),
  ]);
  // Ensure view_count column exists for older tables
  try { await db.prepare('ALTER TABLE before_after_cases ADD COLUMN view_count INTEGER DEFAULT 0').run(); } catch {}
  // Ensure is_popup column exists for older notices tables
  try { await db.prepare('ALTER TABLE notices ADD COLUMN is_popup INTEGER DEFAULT 0').run(); } catch {}
  // Ensure image column exists for notices (R2 image upload)
  try { await db.prepare('ALTER TABLE notices ADD COLUMN image TEXT').run(); } catch {}
  _adminTablesReady = true;
}

// Init blog tables (idempotent, with flag)
let _blogTablesReady = false;
export async function initBlogTables(db: D1Database) {
  if (_blogTablesReady) return;
  await db.prepare(`CREATE TABLE IF NOT EXISTS blog_posts (id INTEGER PRIMARY KEY AUTOINCREMENT, slug TEXT NOT NULL UNIQUE, title TEXT NOT NULL, excerpt TEXT, content TEXT NOT NULL, category TEXT DEFAULT '일반', tags TEXT DEFAULT '', cover_image TEXT, treatment_slug TEXT, author_name TEXT DEFAULT '서울365치과', is_published INTEGER DEFAULT 0, view_count INTEGER DEFAULT 0, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP)`).run();
  // Ensure old_slug column for 301 redirect support (slug migration)
  try { await db.prepare('ALTER TABLE blog_posts ADD COLUMN old_slug TEXT').run(); } catch {}
  // Create index on old_slug for fast redirect lookups
  try { await db.prepare('CREATE INDEX IF NOT EXISTS idx_blog_old_slug ON blog_posts(old_slug)').run(); } catch {}
  _blogTablesReady = true;
}

// Init user tables (idempotent, with flag)
let _userTablesReady = false;
export async function initUserTables(db: D1Database) {
  if (_userTablesReady) return;
  await db.batch([
    db.prepare(`CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, phone TEXT NOT NULL UNIQUE, password_hash TEXT NOT NULL, privacy_agreed INTEGER DEFAULT 0, privacy_agreed_at DATETIME, marketing_agreed INTEGER DEFAULT 0, marketing_agreed_at DATETIME, is_active INTEGER DEFAULT 1, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP)`),
    db.prepare(`CREATE TABLE IF NOT EXISTS sessions (id TEXT PRIMARY KEY, user_id INTEGER NOT NULL, expires_at DATETIME NOT NULL, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE)`),
  ]);
  // Ensure columns exist for older schemas
  const cols = [
    'ALTER TABLE users ADD COLUMN privacy_agreed INTEGER DEFAULT 0',
    'ALTER TABLE users ADD COLUMN privacy_agreed_at DATETIME',
    'ALTER TABLE users ADD COLUMN marketing_agreed INTEGER DEFAULT 0',
    'ALTER TABLE users ADD COLUMN marketing_agreed_at DATETIME',
    'ALTER TABLE users ADD COLUMN is_active INTEGER DEFAULT 1',
    'ALTER TABLE users ADD COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP',
  ];
  for (const sql of cols) { try { await db.prepare(sql).run(); } catch {} }
  _userTablesReady = true;
}

// SEO-optimized markdown renderer (H-tag IDs, figure/figcaption, numbered lists, H4 support)
function slugifyHeading(text: string): string {
  return text.replace(/[^\w\uAC00-\uD7AF\u3131-\u3163\u3041-\u30FF\s-]/g, '').replace(/\s+/g, '-').toLowerCase().substring(0, 60);
}

export function renderContent(md: string): string {
  // Pre-process: Auto-promote standalone bold lines to H2 headings (SEO enhancement)
  // Lines that are ONLY **text** with no other content → treat as H2 subheadings
  // This catches blog posts that used **bold** instead of ## for section titles
  let processed = md.replace(/^(\*\*([^*\n]+)\*\*)$/gm, (match, full, text) => {
    const trimmed = text.trim();
    // Skip very short text (likely inline emphasis) or Q&A patterns
    if (trimmed.length < 4 || trimmed.startsWith('Q.') || trimmed.startsWith('A.')) return match;
    return `## ${trimmed}`;
  });

  let html = processed
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    // Images: ![alt](url) — semantic figure with figcaption for SEO
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_, alt, url) => {
      const caption = alt && alt !== '이미지' ? `<figcaption class="text-center text-xs text-gray-400 mt-2">${alt}</figcaption>` : '';
      return `<figure class="my-8"><a href="${url}" target="_blank" rel="noopener" class="block rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-zoom-in"><img src="${url}" alt="${alt || ''}" class="w-full rounded-xl" loading="lazy" /></a>${caption}</figure>`;
    })
    // Links: [text](url) — internal links without target blank
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, text, url) => {
      const isInternal = url.startsWith('/');
      return isInternal
        ? `<a href="${url}" class="text-[#0066FF] underline hover:text-[#0052cc]">${text}</a>`
        : `<a href="${url}" class="text-[#0066FF] underline hover:text-[#0052cc]" target="_blank" rel="noopener">${text}</a>`;
    })
    // Headings with auto-generated IDs for TOC linking
    .replace(/^#### (.+)$/gm, (_, t) => `<h4 id="${slugifyHeading(t)}" class="text-base font-bold text-gray-800 mt-6 mb-2">${t}</h4>`)
    .replace(/^### (.+)$/gm, (_, t) => `<h3 id="${slugifyHeading(t)}" class="text-lg font-bold text-gray-900 mt-8 mb-3">${t}</h3>`)
    .replace(/^## (.+)$/gm, (_, t) => `<h2 id="${slugifyHeading(t)}" class="text-xl font-bold text-gray-900 mt-10 mb-4">${t}</h2>`)
    .replace(/^# (.+)$/gm, (_, t) => `<h1 id="${slugifyHeading(t)}" class="text-2xl font-bold text-gray-900 mt-12 mb-5">${t}</h1>`)
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^&gt; (.+)$/gm, '<blockquote class="border-l-4 border-[#0066FF]/20 pl-4 py-2 my-4 text-gray-500 italic bg-[#0066FF]/[0.03] rounded-r-lg">$1</blockquote>')
    .replace(/^---$/gm, '<hr class="my-8 border-gray-100"/>')
    // Numbered lists
    .replace(/^\d+\. (.+)$/gm, '<li class="ml-4 text-gray-600 list-item-numbered">$1</li>')
    // Unordered lists
    .replace(/^- (.+)$/gm, '<li class="ml-4 text-gray-600">$1</li>')
    // Wrap consecutive <li> in <ul>/<ol>
    .replace(/((?:<li class="ml-4 text-gray-600 list-item-numbered">.*<\/li>\n?)+)/g, (m) => `<ol class="list-decimal space-y-1 my-4 pl-4">${m.replace(/ list-item-numbered/g, '')}</ol>`)
    .replace(/((?:<li class="ml-4 text-gray-600">.*<\/li>\n?)+)/g, (m) => `<ul class="list-disc space-y-1 my-4">${m}</ul>`)
    // Paragraphs (avoid wrapping existing HTML)
    .replace(/^(?!<[hulfba]|<hr|<li|<strong|<em|<img|<figure|<ol)(.+)$/gm, '<p class="text-gray-600 leading-relaxed mb-4">$1</p>')
    .replace(/<p class="text-gray-600 leading-relaxed mb-4"><\/p>/g, '');
  // XSS defense
  html = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  html = html.replace(/\bon\w+\s*=\s*["'][^"']*["']/gi, '');
  return html;
}

// Extract FAQ pairs from markdown content for JSON-LD FAQPage schema
export function extractFAQs(md: string): Array<{question: string, answer: string}> {
  const faqs: Array<{question: string, answer: string}> = [];
  const lines = md.split('\n');
  let currentQ = '';
  let currentA = '';
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const qMatch = line.match(/^\*\*Q\.\s*(.+?)\*\*$/);
    if (qMatch) {
      if (currentQ && currentA) faqs.push({ question: currentQ, answer: currentA.trim() });
      currentQ = qMatch[1];
      currentA = '';
    } else if (currentQ) {
      const aMatch = line.match(/^A\.\s*(.+)$/);
      if (aMatch) {
        currentA += aMatch[1] + ' ';
      } else if (line && !line.startsWith('#') && !line.startsWith('**Q.')) {
        currentA += line + ' ';
      } else if (line.startsWith('#') || line.startsWith('**Q.')) {
        if (currentQ && currentA) faqs.push({ question: currentQ, answer: currentA.trim() });
        currentQ = '';
        currentA = '';
        // Re-check if this line is a new Q
        const newQ = line.match(/^\*\*Q\.\s*(.+?)\*\*$/);
        if (newQ) { currentQ = newQ[1]; }
      }
    }
  }
  if (currentQ && currentA) faqs.push({ question: currentQ, answer: currentA.trim() });
  return faqs;
}

// Extract heading structure for TOC (H2 + H3)
// Also detects standalone **bold** lines as implicit H2 (matches renderContent logic)
export function extractHeadings(md: string): Array<{level: number, text: string, id: string}> {
  const headings: Array<{level: number, text: string, id: string}> = [];
  const lines = md.split('\n');
  for (const line of lines) {
    const m2 = line.match(/^## (.+)$/);
    const m3 = line.match(/^### (.+)$/);
    // Detect standalone bold lines → implicit H2
    const mBold = line.match(/^\*\*([^*\n]+)\*\*$/);
    if (m2) {
      headings.push({ level: 2, text: m2[1], id: slugifyHeading(m2[1]) });
    } else if (m3) {
      headings.push({ level: 3, text: m3[1], id: slugifyHeading(m3[1]) });
    } else if (mBold) {
      const text = mBold[1].trim();
      if (text.length >= 4 && !text.startsWith('Q.') && !text.startsWith('A.')) {
        headings.push({ level: 2, text, id: slugifyHeading(text) });
      }
    }
  }
  return headings;
}

// Init site_settings table (for admin-configurable SEO/analytics settings)
let _settingsTableReady = false;
export async function initSettingsTable(db: D1Database) {
  if (_settingsTableReady) return;
  await db.prepare(`CREATE TABLE IF NOT EXISTS site_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`).run();
  _settingsTableReady = true;
}

// Get a setting value (DB first, then env fallback)
export async function getSetting(db: D1Database, key: string, envFallback?: string): Promise<string> {
  try {
    await initSettingsTable(db);
    const row = await db.prepare('SELECT value FROM site_settings WHERE key = ?').bind(key).first<{ value: string }>();
    if (row?.value) return row.value;
  } catch {}
  return envFallback || '';
}

// Set a setting value
export async function setSetting(db: D1Database, key: string, value: string) {
  await initSettingsTable(db);
  await db.prepare(`INSERT INTO site_settings (key, value, updated_at) VALUES (?, ?, datetime('now'))
    ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = datetime('now')`)
    .bind(key, value).run();
}

// Get all SEO/analytics settings at once
export async function getAllSeoSettings(db: D1Database, env: Record<string, string | undefined>): Promise<Record<string, string>> {
  const keys = [
    'GA4_MEASUREMENT_ID', 'GTM_CONTAINER_ID',
    'GOOGLE_SITE_VERIFICATION', 'NAVER_SITE_VERIFICATION', 'BING_SITE_VERIFICATION',
    'INDEXNOW_KEY'
  ];
  const result: Record<string, string> = {};
  for (const k of keys) {
    result[k] = await getSetting(db, k, (env as any)[k] || '');
  }
  return result;
}

// Slugify helper (legacy — used for basic slug generation)
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[가-힣]/g, (ch) => {
      const code = ch.charCodeAt(0) - 0xAC00;
      const cho = Math.floor(code / 588);
      return ['g','kk','n','d','tt','r','m','b','pp','s','ss','','j','jj','ch','k','t','p','h'][cho] || '';
    })
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// ============================================================
// SEO/AEO MEGA UPGRADE — Utility Functions
// ============================================================

// Korean dental term → English SEO slug mapping
const DENTAL_TERM_MAP: Record<string, string> = {
  // 진료 과목
  '임플란트': 'implant', '임플': 'implant', '인플란트': 'implant',
  '교정': 'orthodontics', '치아교정': 'orthodontics', '치열교정': 'orthodontics',
  '인비절라인': 'invisalign', '투명교정': 'clear-aligner',
  '라미네이트': 'laminate', '비니어': 'veneer', '비니어라미네이트': 'veneer-laminate',
  '충치': 'cavity', '충치치료': 'cavity-treatment',
  '신경치료': 'root-canal', '근관치료': 'root-canal',
  '발치': 'extraction', '사랑니': 'wisdom-tooth', '사랑니발치': 'wisdom-tooth-extraction',
  '스케일링': 'scaling', '치석': 'tartar', '치석제거': 'scaling',
  '잇몸': 'gum', '잇몸치료': 'gum-treatment', '치주': 'periodontal', '치주치료': 'periodontal-treatment',
  '보철': 'prosthetics', '크라운': 'crown', '브릿지': 'bridge',
  '틀니': 'denture', '의치': 'denture',
  '수면진료': 'sedation', '수면치료': 'sedation',
  '소아': 'pediatric', '소아치과': 'pediatric-dentistry', '어린이치과': 'pediatric-dentistry',
  '심미': 'cosmetic', '심미치료': 'cosmetic-dentistry', '미백': 'whitening', '치아미백': 'teeth-whitening',
  '전체임플란트': 'full-mouth-implant', '풀아치': 'full-arch', '올온포': 'all-on-4',
  '즉시로딩': 'immediate-loading', '뼈이식': 'bone-graft', '골이식': 'bone-graft',
  '상악동거상술': 'sinus-lift', '상악동': 'sinus',
  '디지털': 'digital', 'CT': 'ct', '파노라마': 'panoramic',
  // 일반 의료/건강
  '치과': 'dental', '치아': 'tooth', '치아건강': 'dental-health',
  '구강': 'oral', '구강건강': 'oral-health',
  '통증': 'pain', '치통': 'toothache',
  '비용': 'cost', '가격': 'price', '가격비교': 'price-comparison',
  '후기': 'review', '치료후기': 'treatment-review',
  '과정': 'process', '치료과정': 'treatment-process',
  '기간': 'duration', '치료기간': 'treatment-duration',
  '수명': 'lifespan', '수명관리': 'maintenance',
  '주의사항': 'precautions', '부작용': 'side-effects',
  '장단점': 'pros-cons', '장점': 'benefits', '단점': 'drawbacks',
  '차이': 'difference', '비교': 'comparison', '종류': 'types',
  '선택': 'guide', '가이드': 'guide', '안내': 'guide', '총정리': 'complete-guide',
  '알아보기': 'guide', '정리': 'summary',
  // 지역
  '인천': 'incheon', '구월동': 'guwol', '남동구': 'namdong',
  '서울': 'seoul', '강남': 'gangnam',
  // 액션
  '상담': 'consultation', '예약': 'reservation', '검진': 'checkup', '진단': 'diagnosis',
  '전후': 'before-after', '비포애프터': 'before-after',
  // 환자 관련
  '환자': 'patient', '노인': 'elderly', '고령자': 'senior',
  '어린이': 'children', '청소년': 'teenager',
};

// Smart SEO slug generator — converts Korean title to readable English slug
export function generateSeoSlug(title: string, focusKeyword?: string): string {
  // 1. If focus keyword provided and contains English, use it as base
  if (focusKeyword) {
    const englishPart = focusKeyword.replace(/[^a-zA-Z0-9\s-]/g, '').trim();
    if (englishPart.length > 3) {
      return englishPart.toLowerCase().replace(/\s+/g, '-').replace(/^-|-$/g, '').substring(0, 60);
    }
  }

  let slug = title;

  // 2. Replace known Korean dental terms → English (longest match first)
  const sortedTerms = Object.entries(DENTAL_TERM_MAP)
    .sort((a, b) => b[0].length - a[0].length);
  
  for (const [ko, en] of sortedTerms) {
    slug = slug.replace(new RegExp(ko, 'gi'), ` ${en} `);
  }

  // 3. Extract English words and numbers
  slug = slug
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 70);

  // 4. If too short (< 5 chars), fallback to timestamp-based
  if (slug.length < 5) {
    slug = 'post-' + Date.now().toString(36);
  }

  return slug;
}

// Auto-generate meta description from content (Korean, 120-160 chars)
export function autoGenerateExcerpt(content: string, maxLen = 155): string {
  // Strip markdown syntax
  let plain = content
    .replace(/^#+\s.+$/gm, '') // headings
    .replace(/!\[[^\]]*\]\([^)]+\)/g, '') // images
    .replace(/\[[^\]]+\]\([^)]+\)/g, '') // links
    .replace(/[*_~`#>-]/g, '') // markdown chars
    .replace(/\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  
  if (plain.length <= maxLen) return plain;
  
  // Cut at sentence boundary if possible
  const truncated = plain.substring(0, maxLen);
  const lastPeriod = truncated.lastIndexOf('.');
  const lastQuestion = truncated.lastIndexOf('?');
  const lastBreak = Math.max(lastPeriod, lastQuestion);
  
  if (lastBreak > maxLen * 0.6) {
    return truncated.substring(0, lastBreak + 1);
  }
  return truncated.replace(/\s+\S*$/, '') + '...';
}

// Extract reading time estimate (Korean text)
export function estimateReadingTime(content: string): number {
  const plain = content.replace(/[#*_~`>\[\]()!-]/g, '').replace(/\s+/g, ' ').trim();
  // Korean reading speed: ~500 chars/min
  return Math.max(1, Math.ceil(plain.length / 500));
}

// Auto-extract first image from markdown content for OG image
export function extractFirstImage(content: string): string | null {
  const match = content.match(/!\[[^\]]*\]\(([^)]+)\)/);
  return match ? match[1] : null;
}

// Submit URL to IndexNow for instant indexing (Bing/Yandex/Naver)
export async function submitToIndexNow(
  db: D1Database,
  env: { INDEXNOW_KEY?: string },
  urls: string[]
): Promise<boolean> {
  try {
    const indexNowKey = await getSetting(db, 'INDEXNOW_KEY', env.INDEXNOW_KEY || '');
    if (!indexNowKey || urls.length === 0) return false;

    const payload = {
      host: 'seoul365dc.kr',
      key: indexNowKey,
      keyLocation: `https://seoul365dc.kr/${indexNowKey}.txt`,
      urlList: urls,
    };

    // Submit to all IndexNow endpoints in parallel
    await Promise.allSettled([
      fetch('https://api.indexnow.org/indexnow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify(payload),
      }),
      fetch('https://www.bing.com/indexnow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify(payload),
      }),
    ]);

    return true;
  } catch {
    return false;
  }
}

// Ping Google/Bing sitemap update
export async function pingSitemapUpdate(): Promise<void> {
  const sitemapUrl = encodeURIComponent('https://seoul365dc.kr/sitemap.xml');
  await Promise.allSettled([
    fetch(`https://www.google.com/ping?sitemap=${sitemapUrl}`),
    fetch(`https://www.bing.com/ping?sitemap=${sitemapUrl}`),
  ]);
}
