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

// Admin session verification via getSessionIdFromCookie
export async function getAdminUser(
  db: D1Database,
  cookieHeader?: string | null
): Promise<{ id: number; username: string; name: string } | null> {
  if (!cookieHeader) return null;
  // Try admin_session cookie first (used after admin login)
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

// Init admin tables (idempotent, with flag to skip redundant calls)
let _adminTablesReady = false;
export async function initAdminTables(db: D1Database) {
  if (_adminTablesReady) return;
  await db.prepare(`CREATE TABLE IF NOT EXISTS admin_users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT NOT NULL UNIQUE, password_hash TEXT NOT NULL, name TEXT NOT NULL, role TEXT DEFAULT 'admin', created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`).run();
  await db.prepare(`CREATE TABLE IF NOT EXISTS admin_sessions (id TEXT PRIMARY KEY, admin_id INTEGER NOT NULL, expires_at DATETIME NOT NULL, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (admin_id) REFERENCES admin_users(id) ON DELETE CASCADE)`).run();
  await db.prepare(`CREATE TABLE IF NOT EXISTS before_after_cases (id INTEGER PRIMARY KEY AUTOINCREMENT, treatment_slug TEXT NOT NULL, title TEXT NOT NULL, patient_age TEXT, patient_gender TEXT, tag TEXT NOT NULL, doctor_name TEXT NOT NULL, description TEXT, duration TEXT, before_image TEXT, after_image TEXT, is_published INTEGER DEFAULT 1, sort_order INTEGER DEFAULT 0, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP)`).run();
  // Consultations table (상담문의)
  await db.prepare(`CREATE TABLE IF NOT EXISTS consultations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    treatment TEXT,
    message TEXT,
    status TEXT DEFAULT 'new',
    admin_memo TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`).run();

  // Notices table (공지사항)
  await db.prepare(`CREATE TABLE IF NOT EXISTS notices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT DEFAULT '공지',
    is_pinned INTEGER DEFAULT 0,
    is_published INTEGER DEFAULT 1,
    view_count INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`).run();

  _adminTablesReady = true;
}

// Init blog tables (idempotent, with flag)
let _blogTablesReady = false;
export async function initBlogTables(db: D1Database) {
  if (_blogTablesReady) return;
  await db.prepare(`CREATE TABLE IF NOT EXISTS blog_posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    category TEXT DEFAULT '일반',
    tags TEXT DEFAULT '',
    cover_image TEXT,
    treatment_slug TEXT,
    author_name TEXT DEFAULT '서울365치과',
    is_published INTEGER DEFAULT 0,
    view_count INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`).run();
  _blogTablesReady = true;
}

// Lightweight markdown renderer
export function renderContent(md: string): string {
  let html = md
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/^### (.+)$/gm, '<h3 class="text-lg font-bold text-gray-900 mt-8 mb-3">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold text-gray-900 mt-10 mb-4">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold text-gray-900 mt-12 mb-5">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^- (.+)$/gm, '<li class="ml-4 text-gray-600">$1</li>')
    .replace(/(<li.*<\/li>\n?)+/g, (m) => `<ul class="list-disc space-y-1 my-4">${m}</ul>`)
    .replace(/^(?!<[hul]|<li|<strong|<em)(.+)$/gm, '<p class="text-gray-600 leading-relaxed mb-4">$1</p>')
    .replace(/<p class="text-gray-600 leading-relaxed mb-4"><\/p>/g, '');
  // XSS defense
  html = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  html = html.replace(/\bon\w+\s*=\s*["'][^"']*["']/gi, '');
  return html;
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
