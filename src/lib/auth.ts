// Auth utilities for Cloudflare Workers (Web Crypto API — no Node.js fs/crypto)

const PBKDF2_ITERATIONS = 100000;
const encoder = new TextEncoder();

/** Convert Uint8Array to hex string */
function toHex(bytes: Uint8Array): string {
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

/** Convert hex string to Uint8Array */
function fromHex(hex: string): Uint8Array {
  return new Uint8Array(hex.match(/.{2}/g)!.map(b => parseInt(b, 16)));
}

/** Derive PBKDF2 key bits from password and salt */
async function deriveBits(password: string, salt: Uint8Array): Promise<ArrayBuffer> {
  const keyMaterial = await crypto.subtle.importKey(
    'raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']
  );
  return crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' },
    keyMaterial, 256
  );
}

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const hash = await deriveBits(password, salt);
  return `${toHex(salt)}:${toHex(new Uint8Array(hash))}`;
}

export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  const [saltHex, hashHex] = storedHash.split(':');
  if (!saltHex || !hashHex) return false;
  const hash = await deriveBits(password, fromHex(saltHex));
  return toHex(new Uint8Array(hash)) === hashHex;
}

export function generateSessionId(): string {
  return toHex(crypto.getRandomValues(new Uint8Array(32)));
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
