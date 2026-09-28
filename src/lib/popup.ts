// ============================================================
// 홈 팝업 여러 개 동시 표시 (public/static/app.js POPUP NOTICE SYSTEM v4 가 사용)
// 이미지가 있는 활성 팝업 공지만 — 고정 우선 → 최신순, 최대 POPUP_MAX건
// ============================================================
export const POPUP_MAX = 5;
export async function fetchActivePopups(db: D1Database) {
  try {
    const r = await db.prepare(
      `SELECT id, title, category, image FROM notices
       WHERE is_popup = 1 AND is_published = 1 AND image IS NOT NULL AND length(image) > 5
       ORDER BY is_pinned DESC, created_at DESC LIMIT ${POPUP_MAX}`
    ).all();
    return r.results || [];
  } catch {
    return [];
  }
}

// 공지 행이 홈 팝업 후보인지 (공개 + 팝업 ON + 이미지 있음)
export function isPopupCandidate(n: any): boolean {
  return !!(n && n.is_popup && n.is_published && n.image && String(n.image).length > 5);
}
