// ============================================================
// /reviews — 환자 후기 페이지 폐지 (2026-10-15)
// 남동구보건소 의료광고 민원(10/15): 치료 후기 멘트 삽입 광고는 의료법 제56조 위반 소지.
// 후기 목록·분야별 후기·평점 표기를 공개 화면에서 모두 내리고 410 Gone 으로 응답한다.
// (src/data/reviews.ts 데이터 파일은 보존하지만 어디에서도 렌더하지 않는다.)
// ============================================================
import { Hono } from 'hono';
import type { Bindings } from '../lib/types';

const app = new Hono<{ Bindings: Bindings }>();

const goneHtml = `<!doctype html>
<html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex, nofollow"><title>페이지가 삭제되었습니다 | 서울365치과</title>
<style>body{font-family:system-ui,-apple-system,sans-serif;background:#f8fafc;color:#0f172a;margin:0;display:flex;min-height:100vh;align-items:center;justify-content:center;padding:16px}main{max-width:480px;text-align:center}a{color:#0066FF}</style>
</head><body><main><h1>페이지가 삭제되었습니다</h1><p>요청하신 페이지는 더 이상 제공되지 않습니다.</p><p><a href="/">서울365치과 홈으로 이동</a></p></main></body></html>`;

const gone = () =>
  new Response(goneHtml, {
    status: 410,
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'X-Robots-Tag': 'noindex, nofollow', 'Cache-Control': 'public, max-age=300' },
  });

app.get('/reviews', () => gone());
app.get('/reviews/', () => gone());
app.get('/reviews/:slug', () => gone());

export default app;
