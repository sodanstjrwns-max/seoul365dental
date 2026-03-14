import { Hono } from 'hono'
import type { Bindings } from '../lib/types'
import { hashPassword, verifyPassword, generateSessionId, getSessionCookie, clearSessionCookie, getSessionIdFromCookie, getCurrentUser } from '../lib/auth'
import { initAdminTables, initUserTables } from '../lib/db'

const apiRoutes = new Hono<{ Bindings: Bindings }>()

apiRoutes.post('/api/auth/register', async (c) => {
  try {
    const { name, phone, password, privacy_agreed, marketing_agreed } = await c.req.json();
    if (!name || !phone || !password) {
      return c.json({ ok: false, error: '모든 항목을 입력해주세요.' }, 400);
    }
    if (password.length < 4) {
      return c.json({ ok: false, error: '비밀번호는 4자리 이상이어야 합니다.' }, 400);
    }
    if (!privacy_agreed) {
      return c.json({ ok: false, error: '개인정보 수집·이용에 동의해주세요.' }, 400);
    }

    await initUserTables(c.env.DB);

    // Check existing
    const existing = await c.env.DB.prepare('SELECT id FROM users WHERE phone = ?').bind(phone).first();
    if (existing) {
      return c.json({ ok: false, error: '이미 가입된 번호입니다. 로그인해 주세요.' }, 409);
    }

    const now = new Date().toISOString();
    const passwordHash = await hashPassword(password);
    const result = await c.env.DB.prepare(
      'INSERT INTO users (name, phone, password_hash, privacy_agreed, privacy_agreed_at, marketing_agreed, marketing_agreed_at, is_active) VALUES (?, ?, ?, 1, ?, ?, ?, 1)'
    ).bind(name, phone, passwordHash, now, marketing_agreed ? 1 : 0, marketing_agreed ? now : null).run();

    const userId = (result.meta as any).last_row_id;
    const sessionId = generateSessionId();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    await c.env.DB.prepare('INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)').bind(sessionId, userId, expiresAt).run();

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': getSessionCookie(sessionId),
      },
    });
  } catch (e: any) {
    return c.json({ ok: false, error: e.message || '서버 오류' }, 500);
  }
})

apiRoutes.post('/api/auth/login', async (c) => {
  try {
    const { phone, password } = await c.req.json();
    if (!phone || !password) {
      return c.json({ ok: false, error: '휴대폰 번호와 비밀번호를 입력해주세요.' }, 400);
    }

    await initUserTables(c.env.DB);

    const user = await c.env.DB.prepare('SELECT id, name, phone, password_hash FROM users WHERE phone = ? AND is_active = 1').bind(phone).first<{ id: number; name: string; phone: string; password_hash: string }>();
    if (!user) {
      return c.json({ ok: false, error: '가입되지 않은 번호입니다.' }, 401);
    }

    const valid = await verifyPassword(password, user.password_hash);
    if (!valid) {
      return c.json({ ok: false, error: '비밀번호가 올바르지 않습니다.' }, 401);
    }

    const sessionId = generateSessionId();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    await c.env.DB.prepare('INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)').bind(sessionId, user.id, expiresAt).run();

    return new Response(JSON.stringify({ ok: true, user: { name: user.name } }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': getSessionCookie(sessionId),
      },
    });
  } catch (e: any) {
    return c.json({ ok: false, error: e.message || '서버 오류' }, 500);
  }
})

apiRoutes.get('/api/auth/me', async (c) => {
  const user = await getCurrentUser(c.env.DB, c.req.header('cookie'));
  if (!user) return c.json({ ok: false, user: null });
  return c.json({ ok: true, user });
})

// Support both GET and POST for logout
const handleLogout = async (c: any) => {
  const sessionId = getSessionIdFromCookie(c.req.header('cookie'));
  if (sessionId) {
    try { await c.env.DB.prepare('DELETE FROM sessions WHERE id = ?').bind(sessionId).run(); } catch {}
  }
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': clearSessionCookie(),
    },
  });
};
apiRoutes.post('/api/auth/logout', handleLogout)
apiRoutes.get('/api/auth/logout', handleLogout)

// ============================================================
// CONSULTATIONS API (상담문의)
// ============================================================
apiRoutes.post('/api/consultations', async (c) => {
  await initAdminTables(c.env.DB);
  try {
    const { name, phone, treatment, message } = await c.req.json();
    if (!name || !phone) {
      return c.json({ ok: false, error: '이름과 연락처를 입력해주세요.' }, 400);
    }
    await c.env.DB.prepare(
      'INSERT INTO consultations (name, phone, treatment, message) VALUES (?, ?, ?, ?)'
    ).bind(name, phone, treatment || null, message || null).run();
    return c.json({ ok: true });
  } catch (e: any) {
    return c.json({ ok: false, error: '오류가 발생했습니다.' }, 500);
  }
})

// ============================================================
// NOTICES API (공지사항 — 공개)
// ============================================================
apiRoutes.get('/api/notices', async (c) => {
  await initAdminTables(c.env.DB);
  try {
    const result = await c.env.DB.prepare(
      'SELECT id, title, content, category, is_pinned, view_count, created_at FROM notices WHERE is_published = 1 ORDER BY is_pinned DESC, created_at DESC'
    ).all();
    return c.json({ ok: true, notices: result.results || [] });
  } catch {
    return c.json({ ok: true, notices: [] });
  }
})

apiRoutes.get('/api/notices/:id', async (c) => {
  await initAdminTables(c.env.DB);
  const id = c.req.param('id');
  try {
    await c.env.DB.prepare('UPDATE notices SET view_count = view_count + 1 WHERE id = ? AND is_published = 1').bind(id).run();
    const notice = await c.env.DB.prepare(
      'SELECT id, title, content, category, is_pinned, view_count, created_at FROM notices WHERE id = ? AND is_published = 1'
    ).bind(id).first();
    if (!notice) return c.json({ ok: false, error: '공지사항을 찾을 수 없습니다.' }, 404);
    return c.json({ ok: true, notice });
  } catch {
    return c.json({ ok: false, error: '오류가 발생했습니다.' }, 500);
  }
})

// ============================================================
// R2 IMAGE UPLOAD / SERVE (블로그 이미지 무제한 업로드)
// ============================================================
import { getAdminFromCookie } from '../lib/db'

// Upload — multipart/form-data
apiRoutes.post('/api/admin/upload', async (c) => {
  const admin = await getAdminFromCookie(c.env.DB, c.req.header('cookie'));
  if (!admin) return c.json({ ok: false, error: '인증 필요' }, 401);

  try {
    const formData = await c.req.formData();
    const file = formData.get('file') as File | null;
    if (!file) return c.json({ ok: false, error: '파일이 없습니다' }, 400);

    // Validate: image only
    if (!file.type.startsWith('image/')) {
      return c.json({ ok: false, error: '이미지 파일만 업로드 가능합니다' }, 400);
    }

    // Generate unique key — support folder param (blog, cases, etc.)
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const timestamp = Date.now().toString(36);
    const rand = Math.random().toString(36).substring(2, 8);
    const folder = (formData.get('folder') as string) || 'blog';
    const safeFolder = folder.replace(/[^a-z0-9-]/gi, '');
    const key = `${safeFolder}/${timestamp}-${rand}.${ext}`;

    // Upload to R2
    await c.env.R2.put(key, file.stream(), {
      httpMetadata: {
        contentType: file.type,
        cacheControl: 'public, max-age=31536000, immutable',
      },
      customMetadata: {
        originalName: file.name,
        uploadedBy: admin.name || 'admin',
        uploadedAt: new Date().toISOString(),
      },
    });

    const url = `/r2/${key}`;
    return c.json({ ok: true, url, key, name: file.name, size: file.size });
  } catch (e: any) {
    return c.json({ ok: false, error: e.message || '업로드 실패' }, 500);
  }
})

// Multi-upload — multiple files at once
apiRoutes.post('/api/admin/upload-multi', async (c) => {
  const admin = await getAdminFromCookie(c.env.DB, c.req.header('cookie'));
  if (!admin) return c.json({ ok: false, error: '인증 필요' }, 401);

  try {
    const formData = await c.req.formData();
    const files = formData.getAll('files') as File[];
    if (!files.length) return c.json({ ok: false, error: '파일이 없습니다' }, 400);

    const results: any[] = [];
    for (const file of files) {
      if (!file.type.startsWith('image/')) continue;

      const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const timestamp = Date.now().toString(36);
      const rand = Math.random().toString(36).substring(2, 8);
      const key = `blog/${timestamp}-${rand}.${ext}`;

      await c.env.R2.put(key, file.stream(), {
        httpMetadata: {
          contentType: file.type,
          cacheControl: 'public, max-age=31536000, immutable',
        },
        customMetadata: {
          originalName: file.name,
          uploadedBy: admin.name || 'admin',
          uploadedAt: new Date().toISOString(),
        },
      });

      results.push({ url: `/r2/${key}`, key, name: file.name, size: file.size });
    }

    return c.json({ ok: true, files: results });
  } catch (e: any) {
    return c.json({ ok: false, error: e.message || '업로드 실패' }, 500);
  }
})

// Serve R2 images — public, cached
apiRoutes.get('/r2/*', async (c) => {
  const key = c.req.path.replace('/r2/', '');
  if (!key) return c.notFound();

  try {
    const object = await c.env.R2.get(key);
    if (!object) return c.notFound();

    const headers = new Headers();
    headers.set('Content-Type', object.httpMetadata?.contentType || 'image/jpeg');
    headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    headers.set('ETag', object.httpEtag || '');

    // Conditional request support
    const ifNoneMatch = c.req.header('if-none-match');
    if (ifNoneMatch && ifNoneMatch === object.httpEtag) {
      return new Response(null, { status: 304, headers });
    }

    return new Response(object.body, { headers });
  } catch {
    return c.notFound();
  }
})

// Delete R2 image
apiRoutes.delete('/api/admin/upload/:key{.+}', async (c) => {
  const admin = await getAdminFromCookie(c.env.DB, c.req.header('cookie'));
  if (!admin) return c.json({ ok: false, error: '인증 필요' }, 401);

  const key = c.req.param('key');
  try {
    await c.env.R2.delete(key);
    return c.json({ ok: true });
  } catch (e: any) {
    return c.json({ ok: false, error: e.message || '삭제 실패' }, 500);
  }
})

// List uploaded images
apiRoutes.get('/api/admin/uploads', async (c) => {
  const admin = await getAdminFromCookie(c.env.DB, c.req.header('cookie'));
  if (!admin) return c.json({ ok: false, error: '인증 필요' }, 401);

  try {
    const folder = c.req.query('folder') || 'blog';
    const safeFolder = folder.replace(/[^a-z0-9-]/gi, '');
    const list = await c.env.R2.list({ prefix: `${safeFolder}/`, limit: 200 });
    const files = list.objects.map(obj => ({
      key: obj.key,
      url: `/r2/${obj.key}`,
      size: obj.size,
      uploaded: obj.uploaded?.toISOString(),
    }));
    return c.json({ ok: true, files });
  } catch (e: any) {
    return c.json({ ok: false, error: e.message || '조회 실패' }, 500);
  }
})

export default apiRoutes
