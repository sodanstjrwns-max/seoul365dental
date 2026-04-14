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

// Slugify helper
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
