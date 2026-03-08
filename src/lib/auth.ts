// Auth utilities for Cloudflare Workers (Web Crypto API — no Node.js fs/crypto)

/**
 * Hash password using PBKDF2 (Web Crypto API compatible)
 */
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const keyMaterial = await crypto.subtle.importKey(
    'raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']
  );
  const hash = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
    keyMaterial,
    256
  );
  const saltHex = Array.from(salt).map(b => b.toString(16).padStart(2, '0')).join('');
  const hashHex = Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
  return `${saltHex}:${hashHex}`;
}

/**
 * Verify password against stored hash
 */
export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  const [saltHex, hashHex] = storedHash.split(':');
  if (!saltHex || !hashHex) return false;

  const salt = new Uint8Array(saltHex.match(/.{2}/g)!.map(b => parseInt(b, 16)));
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']
  );
  const hash = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
    keyMaterial,
    256
  );
  const computedHex = Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
  return computedHex === hashHex;
}

/**
 * Generate a random session ID (hex string)
 */
export function generateSessionId(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Build Set-Cookie header value for session
 */
export function getSessionCookie(sessionId: string): string {
  const maxAge = 7 * 24 * 60 * 60; // 7 days
  return `session=${sessionId}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}`;
}

/**
 * Build Set-Cookie header that clears the session
 */
export function clearSessionCookie(): string {
  return `session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}

/**
 * Extract session ID from Cookie header
 */
export function getSessionIdFromCookie(cookieHeader?: string | null): string | null {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(/(?:^|;\s*)session=([^;]+)/);
  return match ? match[1] : null;
}

/**
 * Get current user from DB using session cookie
 */
export async function getCurrentUser(
  db: D1Database,
  cookieHeader?: string | null
): Promise<{ id: number; name: string; phone: string } | null> {
  const sessionId = getSessionIdFromCookie(cookieHeader);
  if (!sessionId) return null;

  try {
    const row = await db.prepare(`
      SELECT u.id, u.name, u.phone
      FROM sessions s
      JOIN users u ON u.id = s.user_id
      WHERE s.id = ? AND s.expires_at > datetime('now')
    `).bind(sessionId).first<{ id: number; name: string; phone: string }>();
    return row || null;
  } catch {
    // Tables might not exist yet
    return null;
  }
}
