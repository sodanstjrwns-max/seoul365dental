import { Hono } from 'hono'
import type { Bindings } from '../lib/types'
import { hashPassword, verifyPassword, generateSessionId, getSessionCookie, clearSessionCookie, getCurrentUser } from '../lib/auth'

const apiRoutes = new Hono<{ Bindings: Bindings }>()

apiRoutes.post('/api/auth/register', async (c) => {
  try {
    const { name, phone, password } = await c.req.json();
    if (!name || !phone || !password) {
      return c.json({ ok: false, error: '모든 항목을 입력해주세요.' }, 400);
    }
    if (password.length < 4) {
      return c.json({ ok: false, error: '비밀번호는 4자리 이상이어야 합니다.' }, 400);
    }

    // Init tables if needed
    await c.env.DB.prepare(`CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, phone TEXT NOT NULL UNIQUE, password_hash TEXT NOT NULL, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`).run();
    await c.env.DB.prepare(`CREATE TABLE IF NOT EXISTS sessions (id TEXT PRIMARY KEY, user_id INTEGER NOT NULL, expires_at DATETIME NOT NULL, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE)`).run();

    // Check existing
    const existing = await c.env.DB.prepare('SELECT id FROM users WHERE phone = ?').bind(phone).first();
    if (existing) {
      return c.json({ ok: false, error: '이미 가입된 번호입니다. 로그인해 주세요.' }, 409);
    }

    const passwordHash = await hashPassword(password);
    const result = await c.env.DB.prepare('INSERT INTO users (name, phone, password_hash) VALUES (?, ?, ?)').bind(name, phone, passwordHash).run();

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

    // Init tables if needed
    await c.env.DB.prepare(`CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, phone TEXT NOT NULL UNIQUE, password_hash TEXT NOT NULL, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`).run();
    await c.env.DB.prepare(`CREATE TABLE IF NOT EXISTS sessions (id TEXT PRIMARY KEY, user_id INTEGER NOT NULL, expires_at DATETIME NOT NULL, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE)`).run();

    const user = await c.env.DB.prepare('SELECT id, name, phone, password_hash FROM users WHERE phone = ?').bind(phone).first<{ id: number; name: string; phone: string; password_hash: string }>();
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
  const { getSessionIdFromCookie } = await import('../lib/auth');
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

export default apiRoutes
