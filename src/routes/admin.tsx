import { Hono } from 'hono'
import type { Bindings } from '../lib/types'
import { hashPassword, verifyPassword, generateSessionId } from '../lib/auth'
import { getAdminUser, getAdminFromCookie, initAdminTables, initUserTables, initSettingsTable, getSetting, setSetting, getAllSeoSettings } from '../lib/db'
import { treatments } from '../data/treatments'
import { doctors } from '../data/doctors'

const adminRoutes = new Hono<{ Bindings: Bindings }>()

// --- Admin Login Page ---
adminRoutes.get('/admin', async (c) => {
  await initAdminTables(c.env.DB);
  const admin = await getAdminUser(c.env.DB, c.req.header('cookie'));
  if (admin) return c.redirect('/admin/dashboard');

  const error = c.req.query('error') || '';

  return c.render(
    <section class="min-h-screen bg-gradient-to-br from-gray-900 via-[#0a0e1a] to-gray-900 flex items-center justify-center p-5">
      <div class="w-full max-w-md">
        <div class="text-center mb-8">
          <div class="w-16 h-16 rounded-2xl bg-[#0066FF]/10 border border-[#0066FF]/20 flex items-center justify-center mx-auto mb-4">
            <i class="fa-solid fa-shield-halved text-2xl text-[#0066FF]"></i>
          </div>
          <h1 class="text-2xl font-bold text-white">관리자 로그인</h1>
          <p class="text-white/30 text-sm mt-2">서울365치과 관리 시스템</p>
        </div>
        {error && <div class="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl mb-4 text-center">{decodeURIComponent(error)}</div>}
        <form method="POST" action="/api/admin/login" class="space-y-4">
          <div>
            <label class="block text-white/50 text-xs font-semibold mb-2 tracking-wider uppercase">아이디</label>
            <input name="username" type="text" required class="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#0066FF]/50 focus:ring-2 focus:ring-[#0066FF]/20 outline-none transition placeholder-white/20" placeholder="admin" autocomplete="username" />
          </div>
          <div>
            <label class="block text-white/50 text-xs font-semibold mb-2 tracking-wider uppercase">비밀번호</label>
            <input name="password" type="password" required class="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#0066FF]/50 focus:ring-2 focus:ring-[#0066FF]/20 outline-none transition placeholder-white/20" placeholder="••••••••" autocomplete="current-password" />
          </div>
          <button type="submit" class="w-full py-3.5 rounded-xl bg-[#0066FF] hover:bg-[#0052cc] text-white font-bold transition">
            <i class="fa-solid fa-right-to-bracket mr-2"></i>로그인
          </button>
        </form>
        <p class="text-center text-white/15 text-xs mt-8">Seoul 365 Dental Admin System</p>
      </div>
    </section>,
    { title: '관리자 로그인 | 서울365치과' }
  )
})

// --- Admin Login API ---
adminRoutes.post('/api/admin/login', async (c) => {
  await initAdminTables(c.env.DB);
  let username: string, password: string;
  const ct = c.req.header('content-type') || '';
  if (ct.includes('application/json')) {
    const body = await c.req.json();
    username = body.username; password = body.password;
  } else {
    const body = await c.req.parseBody();
    username = body.username as string; password = body.password as string;
  }

  const isJson = ct.includes('application/json');
  if (!username || !password) {
    if (isJson) return c.json({ ok: false, error: '아이디와 비밀번호를 입력하세요' }, 400);
    return c.redirect('/admin?error=' + encodeURIComponent('아이디와 비밀번호를 입력하세요'), 303);
  }

  // Auto-create default admin if none exists
  const adminCount = await c.env.DB.prepare('SELECT COUNT(*) as cnt FROM admin_users').first<{ cnt: number }>();
  if (!adminCount || adminCount.cnt === 0) {
    const defaultHash = await hashPassword('Seoul365@dm!n');
    await c.env.DB.prepare('INSERT INTO admin_users (username, password_hash, name) VALUES (?, ?, ?)').bind('admin', defaultHash, '박준규 원장').run();
  }

  const admin = await c.env.DB.prepare('SELECT id, username, name, password_hash FROM admin_users WHERE username = ?').bind(username).first<{ id: number; username: string; name: string; password_hash: string }>();
  if (!admin) {
    if (isJson) return c.json({ ok: false, error: '존재하지 않는 계정입니다' }, 401);
    return c.redirect('/admin?error=' + encodeURIComponent('존재하지 않는 계정입니다'), 303);
  }

  const valid = await verifyPassword(password, admin.password_hash);
  if (!valid) {
    if (isJson) return c.json({ ok: false, error: '비밀번호가 올바르지 않습니다' }, 401);
    return c.redirect('/admin?error=' + encodeURIComponent('비밀번호가 올바르지 않습니다'), 303);
  }

  const sessionId = generateSessionId();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24h
  await c.env.DB.prepare('INSERT INTO admin_sessions (id, admin_id, expires_at) VALUES (?, ?, ?)').bind(sessionId, admin.id, expiresAt).run();

  const sessionCookie = `admin_session=${sessionId}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400`;
  if (isJson) {
    return new Response(JSON.stringify({ ok: true, admin: { name: admin.name } }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Set-Cookie': sessionCookie },
    });
  }
  return new Response(null, {
    status: 303,
    headers: { 'Location': '/admin/dashboard', 'Set-Cookie': sessionCookie },
  });
})

// --- Admin Dashboard ---
adminRoutes.get('/admin/dashboard', async (c) => {
  await initAdminTables(c.env.DB);
  const admin = await getAdminFromCookie(c.env.DB, c.req.header('cookie'));
  if (!admin) return c.redirect('/admin');

  // Fetch cases
  let cases: any[] = [];
  try {
    const result = await c.env.DB.prepare('SELECT * FROM before_after_cases ORDER BY sort_order DESC, created_at DESC').all();
    cases = result.results || [];
  } catch {}

  // Fetch notices view stats
  let noticesStats = { total: 0, totalViews: 0 };
  try {
    const result = await c.env.DB.prepare('SELECT COUNT(*) as total, COALESCE(SUM(view_count), 0) as totalViews FROM notices').first<{ total: number; totalViews: number }>();
    if (result) noticesStats = result;
  } catch {}

  // Fetch blog view stats
  let blogStats = { total: 0, totalViews: 0 };
  try {
    const result = await c.env.DB.prepare('SELECT COUNT(*) as total, COALESCE(SUM(view_count), 0) as totalViews FROM blog_posts').first<{ total: number; totalViews: number }>();
    if (result) blogStats = result;
  } catch {}

  // Calculate case view totals
  const caseTotalViews = cases.reduce((sum: number, cs: any) => sum + (cs.view_count || 0), 0);

  const treatmentOptions = treatments.map(t => ({ slug: t.slug, name: t.name, category: t.category }));
  const doctorOptions = doctors.map(d => ({ slug: d.slug, name: d.name }));

  return c.render(
    <>
      {/* Admin Header */}
      <div class="fixed top-0 left-0 right-0 z-[10000] bg-gray-900/95 backdrop-blur border-b border-white/5">
        <div class="max-w-[1400px] mx-auto px-5 py-3 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-[#0066FF]/20 flex items-center justify-center">
              <i class="fa-solid fa-shield-halved text-[#0066FF] text-sm"></i>
            </div>
            <span class="text-white font-bold text-sm">서울365 관리자</span>
            <span class="text-white/20 text-xs">|</span>
            <span class="text-white/40 text-xs">{admin.name}님</span>
          </div>
          <div class="flex items-center gap-3">
            <a href="/" class="text-white/30 hover:text-white/60 text-xs transition"><i class="fa-solid fa-external-link mr-1"></i>사이트 보기</a>
            <a href="/api/admin/logout" class="text-red-400/60 hover:text-red-400 text-xs transition"><i class="fa-solid fa-right-from-bracket mr-1"></i>로그아웃</a>
          </div>
        </div>
      </div>

      <section class="min-h-screen bg-gradient-to-br from-gray-900 via-[#0a0e1a] to-gray-900 pt-20 pb-12">
        <div class="max-w-[1400px] mx-auto px-5 md:px-8">

          {/* Stats */}
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div class="bg-white/5 border border-white/5 rounded-2xl p-5">
              <div class="text-white/30 text-xs font-semibold uppercase tracking-wider mb-2">전체 케이스</div>
              <div class="text-3xl font-black text-white">{cases.length}</div>
            </div>
            <div class="bg-white/5 border border-white/5 rounded-2xl p-5">
              <div class="text-white/30 text-xs font-semibold uppercase tracking-wider mb-2">공개</div>
              <div class="text-3xl font-black text-emerald-400">{cases.filter((cs: any) => cs.is_published).length}</div>
            </div>
            <div class="bg-white/5 border border-white/5 rounded-2xl p-5">
              <div class="text-white/30 text-xs font-semibold uppercase tracking-wider mb-2">비공개</div>
              <div class="text-3xl font-black text-amber-400">{cases.filter((cs: any) => !cs.is_published).length}</div>
            </div>
            <div class="bg-white/5 border border-white/5 rounded-2xl p-5">
              <div class="text-white/30 text-xs font-semibold uppercase tracking-wider mb-2">진료 카테고리</div>
              <div class="text-3xl font-black text-[#0066FF]">{new Set(cases.map((cs: any) => cs.treatment_slug)).size}</div>
            </div>
          </div>

          {/* View Count Stats */}
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div class="bg-gradient-to-br from-[#0066FF]/10 to-[#0066FF]/5 border border-[#0066FF]/10 rounded-2xl p-5">
              <div class="text-[#0066FF]/60 text-xs font-semibold uppercase tracking-wider mb-2"><i class="fa-solid fa-eye mr-1"></i>총 조회수</div>
              <div class="text-3xl font-black text-[#0066FF]">{(caseTotalViews + noticesStats.totalViews + blogStats.totalViews).toLocaleString()}</div>
            </div>
            <div class="bg-white/5 border border-white/5 rounded-2xl p-5">
              <div class="text-white/30 text-xs font-semibold uppercase tracking-wider mb-2"><i class="fa-solid fa-images mr-1 text-emerald-400/50"></i>사례 조회</div>
              <div class="text-2xl font-black text-emerald-400">{caseTotalViews.toLocaleString()}</div>
              <div class="text-white/15 text-[0.65rem] mt-1">{cases.length}건</div>
            </div>
            <div class="bg-white/5 border border-white/5 rounded-2xl p-5">
              <div class="text-white/30 text-xs font-semibold uppercase tracking-wider mb-2"><i class="fa-solid fa-bullhorn mr-1 text-purple-400/50"></i>공지 조회</div>
              <div class="text-2xl font-black text-purple-400">{noticesStats.totalViews.toLocaleString()}</div>
              <div class="text-white/15 text-[0.65rem] mt-1">{noticesStats.total}건</div>
            </div>
            <div class="bg-white/5 border border-white/5 rounded-2xl p-5">
              <div class="text-white/30 text-xs font-semibold uppercase tracking-wider mb-2"><i class="fa-solid fa-pen-nib mr-1 text-cyan-400/50"></i>블로그 조회</div>
              <div class="text-2xl font-black text-cyan-400">{blogStats.totalViews.toLocaleString()}</div>
              <div class="text-white/15 text-[0.65rem] mt-1">{blogStats.total}건</div>
            </div>
          </div>

          {/* Quick Links */}
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <a href="/admin/consultations" class="bg-white/5 border border-white/5 rounded-2xl p-5 hover:bg-white/[0.08] hover:border-red-400/20 transition-all group">
              <div class="flex flex-col items-center gap-2 text-center">
                <div class="w-10 h-10 rounded-xl bg-red-400/10 flex items-center justify-center">
                  <i class="fa-solid fa-headset text-red-400"></i>
                </div>
                <div>
                  <div class="text-white font-bold text-sm group-hover:text-red-400 transition">상담문의</div>
                  <div class="text-white/25 text-xs">고객 상담 조회</div>
                </div>
              </div>
            </a>
            <a href="/admin/members" class="bg-white/5 border border-white/5 rounded-2xl p-5 hover:bg-white/[0.08] hover:border-teal-400/20 transition-all group">
              <div class="flex flex-col items-center gap-2 text-center">
                <div class="w-10 h-10 rounded-xl bg-teal-400/10 flex items-center justify-center">
                  <i class="fa-solid fa-users text-teal-400"></i>
                </div>
                <div>
                  <div class="text-white font-bold text-sm group-hover:text-teal-400 transition">회원 관리</div>
                  <div class="text-white/25 text-xs">회원·광고동의 조회</div>
                </div>
              </div>
            </a>
            <a href="/admin/notices" class="bg-white/5 border border-white/5 rounded-2xl p-5 hover:bg-white/[0.08] hover:border-purple-400/20 transition-all group">
              <div class="flex flex-col items-center gap-2 text-center">
                <div class="w-10 h-10 rounded-xl bg-purple-400/10 flex items-center justify-center">
                  <i class="fa-solid fa-bullhorn text-purple-400"></i>
                </div>
                <div>
                  <div class="text-white font-bold text-sm group-hover:text-purple-400 transition">공지사항</div>
                  <div class="text-white/25 text-xs">공지 작성·관리</div>
                </div>
              </div>
            </a>
            <a href="/admin/blog" class="bg-white/5 border border-white/5 rounded-2xl p-5 hover:bg-white/[0.08] hover:border-[#0066FF]/20 transition-all group">
              <div class="flex flex-col items-center gap-2 text-center">
                <div class="w-10 h-10 rounded-xl bg-[#0066FF]/10 flex items-center justify-center">
                  <i class="fa-solid fa-pen-nib text-[#0066FF]"></i>
                </div>
                <div>
                  <div class="text-white font-bold text-sm group-hover:text-[#0066FF] transition">블로그</div>
                  <div class="text-white/25 text-xs">글 작성·수정</div>
                </div>
              </div>
            </a>
            <a href="/cases/gallery" target="_blank" class="bg-white/5 border border-white/5 rounded-2xl p-5 hover:bg-white/[0.08] hover:border-emerald-400/20 transition-all group">
              <div class="flex flex-col items-center gap-2 text-center">
                <div class="w-10 h-10 rounded-xl bg-emerald-400/10 flex items-center justify-center">
                  <i class="fa-solid fa-images text-emerald-400"></i>
                </div>
                <div>
                  <div class="text-white font-bold text-sm group-hover:text-emerald-400 transition">사례 보기</div>
                  <div class="text-white/25 text-xs">공개 갤러리</div>
                </div>
              </div>
            </a>
            <a href="/blog" target="_blank" class="bg-white/5 border border-white/5 rounded-2xl p-5 hover:bg-white/[0.08] hover:border-cyan-400/20 transition-all group">
              <div class="flex flex-col items-center gap-2 text-center">
                <div class="w-10 h-10 rounded-xl bg-cyan-400/10 flex items-center justify-center">
                  <i class="fa-solid fa-newspaper text-cyan-400"></i>
                </div>
                <div>
                  <div class="text-white font-bold text-sm group-hover:text-cyan-400 transition">블로그 보기</div>
                  <div class="text-white/25 text-xs">공개 페이지</div>
                </div>
              </div>
            </a>
            <a href="/" target="_blank" class="bg-white/5 border border-white/5 rounded-2xl p-5 hover:bg-white/[0.08] hover:border-amber-400/20 transition-all group">
              <div class="flex flex-col items-center gap-2 text-center">
                <div class="w-10 h-10 rounded-xl bg-amber-400/10 flex items-center justify-center">
                  <i class="fa-solid fa-globe text-amber-400"></i>
                </div>
                <div>
                  <div class="text-white font-bold text-sm group-hover:text-amber-400 transition">사이트 보기</div>
                  <div class="text-white/25 text-xs">메인 페이지</div>
                </div>
              </div>
            </a>
            <a href="/admin/seo" class="bg-white/5 border border-white/5 rounded-2xl p-5 hover:bg-white/[0.08] hover:border-green-400/20 transition-all group">
              <div class="flex flex-col items-center gap-2 text-center">
                <div class="w-10 h-10 rounded-xl bg-green-400/10 flex items-center justify-center">
                  <i class="fa-solid fa-magnifying-glass-chart text-green-400"></i>
                </div>
                <div>
                  <div class="text-white font-bold text-sm group-hover:text-green-400 transition">SEO/색인</div>
                  <div class="text-white/25 text-xs">검색엔진·애널리틱스</div>
                </div>
              </div>
            </a>
          </div>

          {/* New Case Button */}
          <div class="flex items-center justify-between mb-6">
            <h1 class="text-xl font-bold text-white">Before &amp; After 케이스 관리</h1>
            <button onclick="document.getElementById('caseModal').classList.remove('hidden'); document.getElementById('caseForm').reset(); document.getElementById('caseId').value=''; document.getElementById('modalTitle').textContent='새 케이스 등록'; document.getElementById('beforePreview').src=''; document.getElementById('afterPreview').src=''; document.getElementById('beforePreview').classList.add('hidden'); document.getElementById('afterPreview').classList.add('hidden'); document.getElementById('beforePlaceholder').classList.remove('hidden'); document.getElementById('afterPlaceholder').classList.remove('hidden'); document.getElementById('beforeRemoveBtn').classList.add('hidden'); document.getElementById('afterRemoveBtn').classList.add('hidden'); document.getElementById('beforeData').value=''; document.getElementById('afterData').value='';" class="px-5 py-2.5 rounded-xl bg-[#0066FF] hover:bg-[#0052cc] text-white text-sm font-bold transition">
              <i class="fa-solid fa-plus mr-1.5"></i>새 케이스 등록
            </button>
          </div>

          {/* Cases Table */}
          <div class="bg-white/5 border border-white/5 rounded-2xl overflow-hidden">
            {cases.length === 0 ? (
              <div class="p-16 text-center">
                <div class="w-16 h-16 rounded-full bg-white/5 mx-auto mb-4 flex items-center justify-center">
                  <i class="fa-solid fa-images text-2xl text-white/20"></i>
                </div>
                <p class="text-white/30 text-sm">등록된 케이스가 없습니다.</p>
                <p class="text-white/15 text-xs mt-1">위 버튼으로 첫 번째 케이스를 등록하세요.</p>
              </div>
            ) : (
              <div class="overflow-x-auto">
                <table class="w-full text-sm">
                  <thead>
                    <tr class="border-b border-white/5">
                      <th class="text-left px-5 py-3 text-white/30 font-semibold text-xs uppercase tracking-wider">이미지</th>
                      <th class="text-left px-5 py-3 text-white/30 font-semibold text-xs uppercase tracking-wider">제목</th>
                      <th class="text-left px-5 py-3 text-white/30 font-semibold text-xs uppercase tracking-wider hidden md:table-cell">진료</th>
                      <th class="text-left px-5 py-3 text-white/30 font-semibold text-xs uppercase tracking-wider hidden md:table-cell">담당의</th>
                      <th class="text-left px-5 py-3 text-white/30 font-semibold text-xs uppercase tracking-wider hidden md:table-cell"><i class="fa-solid fa-eye mr-1"></i>조회</th>
                      <th class="text-left px-5 py-3 text-white/30 font-semibold text-xs uppercase tracking-wider">상태</th>
                      <th class="text-right px-5 py-3 text-white/30 font-semibold text-xs uppercase tracking-wider">관리</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cases.map((cs: any) => (
                      <tr class="border-b border-white/5 hover:bg-white/[0.02] transition">
                        <td class="px-5 py-3">
                          <div class="flex gap-1.5">
                            {cs.before_image ? (
                              <img src={cs.before_image} alt="before" class="w-12 h-12 rounded-lg object-cover border border-white/10" />
                            ) : (
                              <div class="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center text-[0.6rem] text-white/20">B</div>
                            )}
                            {cs.after_image ? (
                              <img src={cs.after_image} alt="after" class="w-12 h-12 rounded-lg object-cover border border-[#0066FF]/20" />
                            ) : (
                              <div class="w-12 h-12 rounded-lg bg-[#0066FF]/5 flex items-center justify-center text-[0.6rem] text-[#0066FF]/30">A</div>
                            )}
                          </div>
                        </td>
                        <td class="px-5 py-3">
                          <div class="text-white font-medium text-sm">{cs.title}</div>
                          <div class="text-white/20 text-xs mt-0.5">{cs.tag} · {cs.patient_age || '-'} · {cs.patient_gender || '-'}</div>
                        </td>
                        <td class="px-5 py-3 hidden md:table-cell">
                          <span class="text-white/40 text-xs">{treatments.find(t => t.slug === cs.treatment_slug)?.name || cs.treatment_slug}</span>
                        </td>
                        <td class="px-5 py-3 hidden md:table-cell">
                          <span class="text-white/40 text-xs">{cs.doctor_name}</span>
                        </td>
                        <td class="px-5 py-3 hidden md:table-cell">
                          <span class="text-white/50 text-xs font-mono"><i class="fa-solid fa-eye text-white/15 mr-1"></i>{cs.view_count || 0}</span>
                        </td>
                        <td class="px-5 py-3">
                          {cs.is_published ? (
                            <span class="inline-flex items-center gap-1 text-xs text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-full"><span class="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>공개</span>
                          ) : (
                            <span class="inline-flex items-center gap-1 text-xs text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full"><span class="w-1.5 h-1.5 bg-amber-400 rounded-full"></span>비공개</span>
                          )}
                        </td>
                        <td class="px-5 py-3 text-right">
                          <button onclick={`loadCase(${cs.id})`} class="text-white/30 hover:text-[#0066FF] transition p-1.5" title="수정">
                            <i class="fa-solid fa-pen-to-square"></i>
                          </button>
                          <button onclick={`deleteCase(${cs.id})`} class="text-white/30 hover:text-red-400 transition p-1.5 ml-1" title="삭제">
                            <i class="fa-solid fa-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Case Modal */}
      <div id="caseModal" class="hidden fixed inset-0 z-[10001] flex items-center justify-center p-4">
        <div class="fixed inset-0 bg-black/70 backdrop-blur-sm" onclick="document.getElementById('caseModal').classList.add('hidden')"></div>
        <div class="relative bg-gray-900 border border-white/10 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 md:p-8">
          <div class="flex items-center justify-between mb-6">
            <h2 id="modalTitle" class="text-lg font-bold text-white">새 케이스 등록</h2>
            <button onclick="document.getElementById('caseModal').classList.add('hidden')" class="text-white/30 hover:text-white transition">
              <i class="fa-solid fa-xmark text-xl"></i>
            </button>
          </div>

          <form id="caseForm" onsubmit="submitCase(event)" class="space-y-5">
            <input type="hidden" id="caseId" name="id" value="" />

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-white/50 text-xs font-semibold mb-2 uppercase tracking-wider">진료 카테고리 *</label>
                <select id="treatmentSlug" name="treatment_slug" required class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-[#0066FF]/50">
                  {treatmentOptions.map(t => (
                    <option value={t.slug} class="bg-gray-900">{t.category} — {t.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label class="block text-white/50 text-xs font-semibold mb-2 uppercase tracking-wider">태그 *</label>
                <input id="caseTag" name="tag" type="text" required placeholder="예: 전체임플란트, 교정" class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-[#0066FF]/50 placeholder-white/20" />
              </div>
            </div>

            <div>
              <label class="block text-white/50 text-xs font-semibold mb-2 uppercase tracking-wider">제목 *</label>
              <input id="caseTitle" name="title" type="text" required placeholder="예: 상악 전체 임플란트 — 60대 남성" class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-[#0066FF]/50 placeholder-white/20" />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-white/50 text-xs font-semibold mb-2 uppercase tracking-wider">담당의 *</label>
                <select id="caseDoctorName" name="doctor_name" required class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-[#0066FF]/50">
                  {doctorOptions.map(d => (
                    <option value={d.name} class="bg-gray-900">{d.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label class="block text-white/50 text-xs font-semibold mb-2 uppercase tracking-wider">환자 나이</label>
                <input id="caseAge" name="patient_age" type="text" placeholder="예: 60대" class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-[#0066FF]/50 placeholder-white/20" />
              </div>
              <div>
                <label class="block text-white/50 text-xs font-semibold mb-2 uppercase tracking-wider">성별</label>
                <select id="caseGender" name="patient_gender" class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-[#0066FF]/50">
                  <option value="" class="bg-gray-900">선택안함</option>
                  <option value="남성" class="bg-gray-900">남성</option>
                  <option value="여성" class="bg-gray-900">여성</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block text-white/50 text-xs font-semibold mb-2 uppercase tracking-wider">설명</label>
              <textarea id="caseDesc" name="description" rows={3} placeholder="케이스에 대한 간단한 설명..." class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-[#0066FF]/50 placeholder-white/20 resize-none"></textarea>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-white/50 text-xs font-semibold mb-2 uppercase tracking-wider">치료 기간</label>
                <input id="caseDuration" name="duration" type="text" placeholder="예: 3개월" class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-[#0066FF]/50 placeholder-white/20" />
              </div>
              <div>
                <label class="block text-white/50 text-xs font-semibold mb-2 uppercase tracking-wider">정렬 순서</label>
                <input id="caseSortOrder" name="sort_order" type="number" value="0" class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-[#0066FF]/50" />
              </div>
            </div>

            {/* Image Uploads — R2 Storage (무제한 용량, 원본 화질) */}
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-white/50 text-xs font-semibold mb-2 uppercase tracking-wider">Before 이미지</label>
                <div class="relative">
                  <input type="file" id="beforeFile" accept="image/*" onchange="uploadCaseImage(this, 'before')" class="hidden" />
                  <input type="hidden" id="beforeData" name="before_image" />
                  <div id="beforeDropZone" class="w-full border-2 border-dashed border-white/10 rounded-xl hover:border-[#0066FF]/30 transition cursor-pointer overflow-hidden" onclick="document.getElementById('beforeFile').click()">
                    <img id="beforePreview" src="" class="hidden w-full h-40 object-cover" />
                    <div id="beforePlaceholder" class="flex flex-col items-center justify-center gap-2 py-8">
                      <i class="fa-solid fa-cloud-arrow-up text-xl text-white/15"></i>
                      <span class="text-white/20 text-sm">Before 사진 업로드</span>
                      <span class="text-white/10 text-xs">용량 제한 없음 · 원본 화질 유지</span>
                    </div>
                    <div id="beforeUploading" class="hidden flex items-center justify-center gap-2 py-8">
                      <i class="fa-solid fa-spinner fa-spin text-[#0066FF]"></i>
                      <span class="text-[#0066FF] text-sm">R2 업로드 중...</span>
                    </div>
                  </div>
                  <button type="button" id="beforeRemoveBtn" onclick="event.stopPropagation(); removeCaseImage('before')" class="hidden absolute top-2 right-2 w-7 h-7 rounded-full bg-red-500/80 hover:bg-red-500 text-white flex items-center justify-center transition text-xs z-10"><i class="fa-solid fa-xmark"></i></button>
                </div>
              </div>
              <div>
                <label class="block text-white/50 text-xs font-semibold mb-2 uppercase tracking-wider">After 이미지</label>
                <div class="relative">
                  <input type="file" id="afterFile" accept="image/*" onchange="uploadCaseImage(this, 'after')" class="hidden" />
                  <input type="hidden" id="afterData" name="after_image" />
                  <div id="afterDropZone" class="w-full border-2 border-dashed border-white/10 rounded-xl hover:border-[#0066FF]/30 transition cursor-pointer overflow-hidden" onclick="document.getElementById('afterFile').click()">
                    <img id="afterPreview" src="" class="hidden w-full h-40 object-cover" />
                    <div id="afterPlaceholder" class="flex flex-col items-center justify-center gap-2 py-8">
                      <i class="fa-solid fa-cloud-arrow-up text-xl text-white/15"></i>
                      <span class="text-white/20 text-sm">After 사진 업로드</span>
                      <span class="text-white/10 text-xs">용량 제한 없음 · 원본 화질 유지</span>
                    </div>
                    <div id="afterUploading" class="hidden flex items-center justify-center gap-2 py-8">
                      <i class="fa-solid fa-spinner fa-spin text-[#0066FF]"></i>
                      <span class="text-[#0066FF] text-sm">R2 업로드 중...</span>
                    </div>
                  </div>
                  <button type="button" id="afterRemoveBtn" onclick="event.stopPropagation(); removeCaseImage('after')" class="hidden absolute top-2 right-2 w-7 h-7 rounded-full bg-red-500/80 hover:bg-red-500 text-white flex items-center justify-center transition text-xs z-10"><i class="fa-solid fa-xmark"></i></button>
                </div>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" id="casePublished" name="is_published" value="1" checked class="w-4 h-4 rounded bg-white/5 border-white/10 text-[#0066FF] focus:ring-[#0066FF]/20" />
                <span class="text-white/50 text-sm">공개로 게시</span>
              </label>
            </div>

            <div class="flex gap-3 pt-2">
              <button type="submit" id="submitBtn" class="flex-1 py-3.5 rounded-xl bg-[#0066FF] hover:bg-[#0052cc] text-white font-bold transition">
                <i class="fa-solid fa-check mr-1.5"></i>저장
              </button>
              <button type="button" onclick="document.getElementById('caseModal').classList.add('hidden')" class="px-6 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/50 font-bold transition">취소</button>
            </div>
          </form>
        </div>
      </div>

      {/* Admin Scripts */}
      <script dangerouslySetInnerHTML={{__html: `
        // ── R2 Upload for B&A images (무제한 용량, 원본 화질) ──
        async function uploadCaseImage(input, side) {
          const file = input.files[0];
          if (!file) return;
          if (!file.type.startsWith('image/')) { alert('이미지 파일만 업로드 가능합니다.'); return; }

          const preview = document.getElementById(side + 'Preview');
          const placeholder = document.getElementById(side + 'Placeholder');
          const uploading = document.getElementById(side + 'Uploading');
          const dataInput = document.getElementById(side === 'before' ? 'beforeData' : 'afterData');
          const removeBtn = document.getElementById(side + 'RemoveBtn');

          placeholder.classList.add('hidden');
          preview.classList.add('hidden');
          removeBtn.classList.add('hidden');
          uploading.classList.remove('hidden');

          try {
            const fd = new FormData();
            fd.append('file', file);
            fd.append('folder', 'cases');
            const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
            const json = await res.json();
            if (json.ok) {
              dataInput.value = json.url;
              preview.src = json.url;
              preview.classList.remove('hidden');
              removeBtn.classList.remove('hidden');
              uploading.classList.add('hidden');
            } else {
              alert(json.error || '업로드 실패');
              placeholder.classList.remove('hidden');
              uploading.classList.add('hidden');
            }
          } catch(e) {
            alert('업로드 오류: ' + e.message);
            placeholder.classList.remove('hidden');
            uploading.classList.add('hidden');
          }
          input.value = '';
        }

        function removeCaseImage(side) {
          const preview = document.getElementById(side + 'Preview');
          const placeholder = document.getElementById(side + 'Placeholder');
          const dataInput = document.getElementById(side === 'before' ? 'beforeData' : 'afterData');
          const removeBtn = document.getElementById(side + 'RemoveBtn');
          dataInput.value = '';
          preview.src = '';
          preview.classList.add('hidden');
          removeBtn.classList.add('hidden');
          placeholder.classList.remove('hidden');
        }

        async function loadCase(id) {
          console.log('[Cases] loadCase called, id:', id);
          try {
            const res = await fetch('/api/admin/cases/' + id);
            if (!res.ok) {
              alert('서버 오류 (' + res.status + ')');
              return;
            }
            const json = await res.json();
            if (!json.ok) {
              alert(json.error || '케이스를 불러올 수 없습니다.');
              return;
            }
            var cs = json.caseData;
            document.getElementById('caseModal').classList.remove('hidden');
            document.getElementById('modalTitle').textContent = '케이스 수정';
            document.getElementById('caseId').value = cs.id;
            document.getElementById('treatmentSlug').value = cs.treatment_slug;
            document.getElementById('caseTag').value = cs.tag;
            document.getElementById('caseTitle').value = cs.title;
            document.getElementById('caseDoctorName').value = cs.doctor_name;
            document.getElementById('caseAge').value = cs.patient_age || '';
            document.getElementById('caseGender').value = cs.patient_gender || '';
            document.getElementById('caseDesc').value = cs.description || '';
            document.getElementById('caseDuration').value = cs.duration || '';
            document.getElementById('caseSortOrder').value = cs.sort_order || 0;
            document.getElementById('casePublished').checked = !!cs.is_published;

            // Before image (R2 URL)
            if (cs.before_image) {
              document.getElementById('beforePreview').src = cs.before_image;
              document.getElementById('beforePreview').classList.remove('hidden');
              document.getElementById('beforeData').value = cs.before_image;
              document.getElementById('beforePlaceholder').classList.add('hidden');
              document.getElementById('beforeRemoveBtn').classList.remove('hidden');
            } else {
              document.getElementById('beforePreview').classList.add('hidden');
              document.getElementById('beforeData').value = '';
              document.getElementById('beforePlaceholder').classList.remove('hidden');
              document.getElementById('beforeRemoveBtn').classList.add('hidden');
            }
            // After image (R2 URL)
            if (cs.after_image) {
              document.getElementById('afterPreview').src = cs.after_image;
              document.getElementById('afterPreview').classList.remove('hidden');
              document.getElementById('afterData').value = cs.after_image;
              document.getElementById('afterPlaceholder').classList.add('hidden');
              document.getElementById('afterRemoveBtn').classList.remove('hidden');
            } else {
              document.getElementById('afterPreview').classList.add('hidden');
              document.getElementById('afterData').value = '';
              document.getElementById('afterPlaceholder').classList.remove('hidden');
              document.getElementById('afterRemoveBtn').classList.add('hidden');
            }
          } catch(e) {
            console.error('[Cases] loadCase error:', e);
            alert('불러오기 실패: ' + e.message);
          }
        }

        async function submitCase(e) {
          e.preventDefault();
          const btn = document.getElementById('submitBtn');
          btn.disabled = true;
          btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-1.5"></i>저장 중...';

          const id = document.getElementById('caseId').value;
          const data = {
            treatment_slug: document.getElementById('treatmentSlug').value,
            tag: document.getElementById('caseTag').value,
            title: document.getElementById('caseTitle').value,
            doctor_name: document.getElementById('caseDoctorName').value,
            patient_age: document.getElementById('caseAge').value,
            patient_gender: document.getElementById('caseGender').value,
            description: document.getElementById('caseDesc').value,
            duration: document.getElementById('caseDuration').value,
            sort_order: parseInt(document.getElementById('caseSortOrder').value) || 0,
            is_published: document.getElementById('casePublished').checked ? 1 : 0,
            before_image: document.getElementById('beforeData').value,
            after_image: document.getElementById('afterData').value,
          };

          try {
            const url = id ? '/api/admin/cases/' + id : '/api/admin/cases';
            const method = id ? 'PUT' : 'POST';
            const res = await fetch(url, {
              method,
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(data)
            });
            const json = await res.json();
            if (json.ok) {
              window.location.reload();
            } else {
              alert(json.error || '오류가 발생했습니다.');
            }
          } catch(err) {
            alert('네트워크 오류: ' + err.message);
          } finally {
            btn.disabled = false;
            btn.innerHTML = '<i class="fa-solid fa-check mr-1.5"></i>저장';
          }
        }

        async function deleteCase(id) {
          if (!confirm('이 케이스를 삭제하시겠습니까?')) return;
          try {
            const res = await fetch('/api/admin/cases/' + id, { method: 'DELETE' });
            const json = await res.json();
            if (json.ok) window.location.reload();
            else alert(json.error || '삭제 실패');
          } catch(err) { alert('오류: ' + err.message); }
        }
      `}} />
    </>,
    { title: '관리자 대시보드 | 서울365치과' }
  )
})

// --- Admin Logout ---
// Logout: support both GET (link) and POST (form)
async function handleAdminLogout(c: any) {
  const cookie = c.req.header('cookie');
  const match = cookie?.match(/(?:^|;\s*)admin_session=([^;]+)/);
  if (match) {
    try { await c.env.DB.prepare('DELETE FROM admin_sessions WHERE id = ?').bind(match[1]).run(); } catch {}
  }
  return new Response(null, {
    status: 303,
    headers: {
      'Location': '/admin',
      'Set-Cookie': 'admin_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0',
    },
  });
}
adminRoutes.get('/api/admin/logout', async (c) => handleAdminLogout(c))
adminRoutes.post('/api/admin/logout', async (c) => handleAdminLogout(c))

// ============================================================
// ADMIN: 상담문의 조회 페이지
// ============================================================
adminRoutes.get('/admin/consultations', async (c) => {
  await initAdminTables(c.env.DB);
  const admin = await getAdminFromCookie(c.env.DB, c.req.header('cookie'));
  if (!admin) return c.redirect('/admin');

  let items: any[] = [];
  try {
    const result = await c.env.DB.prepare('SELECT * FROM consultations ORDER BY created_at DESC').all();
    items = result.results || [];
  } catch {}

  const statusMap: Record<string, { label: string; color: string }> = {
    new: { label: '새 문의', color: 'red' },
    contacted: { label: '연락 완료', color: 'blue' },
    done: { label: '처리 완료', color: 'emerald' },
  };

  return c.render(
    <>
      {/* Admin Header */}
      <div class="fixed top-0 left-0 right-0 z-[10000] bg-gray-900/95 backdrop-blur border-b border-white/5">
        <div class="max-w-[1400px] mx-auto px-5 py-3 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <a href="/admin/dashboard" class="w-8 h-8 rounded-lg bg-[#0066FF]/20 flex items-center justify-center hover:bg-[#0066FF]/30 transition">
              <i class="fa-solid fa-arrow-left text-[#0066FF] text-sm"></i>
            </a>
            <span class="text-white font-bold text-sm">상담문의 관리</span>
            <span class="text-white/20 text-xs">|</span>
            <span class="text-red-400 text-xs font-bold">{items.filter((i: any) => i.status === 'new').length}건 새 문의</span>
          </div>
          <a href="/api/admin/logout" class="text-red-400/60 hover:text-red-400 text-xs transition"><i class="fa-solid fa-right-from-bracket mr-1"></i>로그아웃</a>
        </div>
      </div>

      <section class="min-h-screen bg-gradient-to-br from-gray-900 via-[#0a0e1a] to-gray-900 pt-20 pb-12">
        <div class="max-w-[1400px] mx-auto px-5 md:px-8">
          <div class="bg-white/5 border border-white/5 rounded-2xl overflow-hidden">
            {items.length === 0 ? (
              <div class="p-16 text-center">
                <i class="fa-solid fa-headset text-3xl text-white/15 mb-4"></i>
                <p class="text-white/30 text-sm">접수된 상담 문의가 없습니다.</p>
              </div>
            ) : (
              <div class="overflow-x-auto">
                <table class="w-full text-sm">
                  <thead>
                    <tr class="border-b border-white/5">
                      <th class="text-left px-5 py-3 text-white/30 font-semibold text-xs uppercase tracking-wider">상태</th>
                      <th class="text-left px-5 py-3 text-white/30 font-semibold text-xs uppercase tracking-wider">이름</th>
                      <th class="text-left px-5 py-3 text-white/30 font-semibold text-xs uppercase tracking-wider">연락처</th>
                      <th class="text-left px-5 py-3 text-white/30 font-semibold text-xs uppercase tracking-wider hidden md:table-cell">관심치료</th>
                      <th class="text-left px-5 py-3 text-white/30 font-semibold text-xs uppercase tracking-wider hidden lg:table-cell">상담내용</th>
                      <th class="text-left px-5 py-3 text-white/30 font-semibold text-xs uppercase tracking-wider hidden md:table-cell">일시</th>
                      <th class="text-right px-5 py-3 text-white/30 font-semibold text-xs uppercase tracking-wider">관리</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item: any) => {
                      const s = statusMap[item.status] || statusMap.new;
                      return (
                        <tr class="border-b border-white/5 hover:bg-white/[0.02] transition">
                          <td class="px-5 py-3">
                            <span class={`inline-flex items-center gap-1 text-xs text-${s.color}-400 bg-${s.color}-400/10 px-2.5 py-1 rounded-full`}>
                              <span class={`w-1.5 h-1.5 bg-${s.color}-400 rounded-full`}></span>{s.label}
                            </span>
                          </td>
                          <td class="px-5 py-3 text-white font-medium">{item.name}</td>
                          <td class="px-5 py-3"><a href={`tel:${item.phone}`} class="text-[#0066FF] hover:underline">{item.phone}</a></td>
                          <td class="px-5 py-3 text-white/40 hidden md:table-cell">{item.treatment || '-'}</td>
                          <td class="px-5 py-3 text-white/30 hidden lg:table-cell max-w-[200px] truncate">{item.message || '-'}</td>
                          <td class="px-5 py-3 text-white/25 text-xs hidden md:table-cell">{item.created_at?.slice(0, 16)}</td>
                          <td class="px-5 py-3 text-right">
                            <select onchange={`updateConsultStatus(${item.id}, this.value)`} class="bg-white/5 border border-white/10 text-white text-xs rounded-lg px-2 py-1 outline-none">
                              <option value="new" selected={item.status === 'new'} class="bg-gray-900">새 문의</option>
                              <option value="contacted" selected={item.status === 'contacted'} class="bg-gray-900">연락 완료</option>
                              <option value="done" selected={item.status === 'done'} class="bg-gray-900">처리 완료</option>
                            </select>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </section>

      <script dangerouslySetInnerHTML={{__html: `
        async function updateConsultStatus(id, status) {
          try {
            const res = await fetch('/api/admin/consultations/' + id, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ status })
            });
            const data = await res.json();
            if (data.ok) window.location.reload();
            else alert(data.error || '오류 발생');
          } catch(err) { alert('오류: ' + err.message); }
        }
      `}} />
    </>,
    { title: '상담문의 관리 | 서울365치과' }
  )
})

// ADMIN API: Update consultation status
adminRoutes.put('/api/admin/consultations/:id', async (c) => {
  await initAdminTables(c.env.DB);
  const admin = await getAdminFromCookie(c.env.DB, c.req.header('cookie'));
  if (!admin) return c.json({ ok: false, error: '인증 필요' }, 401);
  const id = c.req.param('id');
  const { status, admin_memo } = await c.req.json();
  await c.env.DB.prepare('UPDATE consultations SET status = ?, admin_memo = ?, updated_at = datetime(\'now\') WHERE id = ?')
    .bind(status || 'new', admin_memo || null, id).run();
  return c.json({ ok: true });
})

// ============================================================
// ADMIN: 공지사항 관리 페이지
// ============================================================
adminRoutes.get('/admin/notices', async (c) => {
  await initAdminTables(c.env.DB);
  const admin = await getAdminFromCookie(c.env.DB, c.req.header('cookie'));
  if (!admin) return c.redirect('/admin');

  let notices: any[] = [];
  try {
    const result = await c.env.DB.prepare('SELECT * FROM notices ORDER BY is_pinned DESC, created_at DESC').all();
    notices = result.results || [];
  } catch {}

  const noticeTotalViews = notices.reduce((s: number, n: any) => s + (n.view_count || 0), 0);

  return c.render(
    <>
      {/* Admin Header */}
      <div class="fixed top-0 left-0 right-0 z-[10000] bg-gray-900/95 backdrop-blur border-b border-white/5">
        <div class="max-w-[1400px] mx-auto px-5 py-3 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <a href="/admin/dashboard" class="w-8 h-8 rounded-lg bg-[#0066FF]/20 flex items-center justify-center hover:bg-[#0066FF]/30 transition">
              <i class="fa-solid fa-arrow-left text-[#0066FF] text-sm"></i>
            </a>
            <span class="text-white font-bold text-sm">공지사항 관리</span>
            <span class="text-white/20 text-xs">|</span>
            <span class="text-purple-400 text-xs font-bold">{notices.length}건</span>
            <span class="text-white/10 text-xs">·</span>
            <span class="text-white/30 text-xs"><i class="fa-solid fa-eye text-white/15 mr-1"></i>{noticeTotalViews.toLocaleString()}</span>
          </div>
          <div class="flex items-center gap-3">
            <a href="/notices" target="_blank" class="text-white/30 hover:text-white/60 text-xs transition"><i class="fa-solid fa-external-link mr-1"></i>공개 페이지</a>
            <a href="/api/admin/logout" class="text-red-400/60 hover:text-red-400 text-xs transition"><i class="fa-solid fa-right-from-bracket mr-1"></i>로그아웃</a>
          </div>
        </div>
      </div>

      <section class="min-h-screen bg-gradient-to-br from-gray-900 via-[#0a0e1a] to-gray-900 pt-20 pb-12">
        <div class="max-w-[1400px] mx-auto px-5 md:px-8">
          <div class="flex items-center justify-between mb-6">
            <h1 class="text-xl font-bold text-white">공지사항 관리</h1>
            <button onclick="openNoticeModal()" class="px-5 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-600 text-white text-sm font-bold transition">
              <i class="fa-solid fa-plus mr-1.5"></i>새 공지 작성
            </button>
          </div>

          <div class="bg-white/5 border border-white/5 rounded-2xl overflow-hidden">
            {notices.length === 0 ? (
              <div class="p-16 text-center">
                <i class="fa-solid fa-bullhorn text-3xl text-white/15 mb-4"></i>
                <p class="text-white/30 text-sm">작성된 공지사항이 없습니다.</p>
              </div>
            ) : (
              <div class="overflow-x-auto">
                <table class="w-full text-sm">
                  <thead>
                    <tr class="border-b border-white/5">
                      <th class="text-left px-5 py-3 text-white/30 font-semibold text-xs uppercase tracking-wider">상태</th>
                      <th class="text-left px-5 py-3 text-white/30 font-semibold text-xs uppercase tracking-wider">카테고리</th>
                      <th class="text-left px-5 py-3 text-white/30 font-semibold text-xs uppercase tracking-wider">제목</th>
                      <th class="text-left px-5 py-3 text-white/30 font-semibold text-xs uppercase tracking-wider hidden md:table-cell"><i class="fa-solid fa-eye mr-1"></i>조회</th>
                      <th class="text-left px-5 py-3 text-white/30 font-semibold text-xs uppercase tracking-wider hidden md:table-cell">작성일</th>
                      <th class="text-right px-5 py-3 text-white/30 font-semibold text-xs uppercase tracking-wider">관리</th>
                    </tr>
                  </thead>
                  <tbody>
                    {notices.map((n: any) => (
                      <tr class="border-b border-white/5 hover:bg-white/[0.02] transition">
                        <td class="px-5 py-3">
                          <div class="flex items-center gap-1.5">
                            {n.is_pinned ? <span class="text-amber-400 text-xs"><i class="fa-solid fa-thumbtack"></i></span> : null}
                            {n.is_published ? (
                              <span class="inline-flex items-center gap-1 text-xs text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">공개</span>
                            ) : (
                              <span class="inline-flex items-center gap-1 text-xs text-gray-400 bg-gray-400/10 px-2 py-0.5 rounded-full">비공개</span>
                            )}
                          </div>
                        </td>
                        <td class="px-5 py-3 text-purple-300 text-xs">{n.category}</td>
                        <td class="px-5 py-3 text-white font-medium">{n.title}</td>
                        <td class="px-5 py-3 hidden md:table-cell">
                          <span class="text-white/50 text-xs font-mono"><i class="fa-solid fa-eye text-white/15 mr-1"></i>{n.view_count || 0}</span>
                        </td>
                        <td class="px-5 py-3 text-white/25 text-xs hidden md:table-cell">{n.created_at?.slice(0, 10)}</td>
                        <td class="px-5 py-3 text-right">
                          <button onclick={`editNotice(${JSON.stringify(n).replace(/"/g, '&quot;')})`} class="text-white/30 hover:text-purple-400 transition p-1.5" title="수정">
                            <i class="fa-solid fa-pen-to-square"></i>
                          </button>
                          <button onclick={`deleteNotice(${n.id})`} class="text-white/30 hover:text-red-400 transition p-1.5 ml-1" title="삭제">
                            <i class="fa-solid fa-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Notice Modal */}
      <div id="noticeModal" class="hidden fixed inset-0 z-[10001] flex items-center justify-center p-4">
        <div class="fixed inset-0 bg-black/70 backdrop-blur-sm" onclick="document.getElementById('noticeModal').classList.add('hidden')"></div>
        <div class="relative bg-gray-900 border border-white/10 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 md:p-8">
          <div class="flex items-center justify-between mb-6">
            <h2 id="noticeModalTitle" class="text-lg font-bold text-white">새 공지 작성</h2>
            <button onclick="document.getElementById('noticeModal').classList.add('hidden')" class="text-white/30 hover:text-white transition">
              <i class="fa-solid fa-xmark text-xl"></i>
            </button>
          </div>

          <form id="noticeForm" class="space-y-5">
            <input type="hidden" id="noticeId" value="" />
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-white/50 text-xs font-semibold mb-2 uppercase tracking-wider">카테고리</label>
                <select id="noticeCategory" class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-purple-400/50">
                  <option value="공지" class="bg-gray-900">공지</option>
                  <option value="이벤트" class="bg-gray-900">이벤트</option>
                  <option value="안내" class="bg-gray-900">안내</option>
                  <option value="휴무" class="bg-gray-900">휴무</option>
                </select>
              </div>
              <div class="flex items-end gap-4">
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" id="noticePinned" class="w-4 h-4 rounded bg-white/5 border-white/10 text-amber-400 focus:ring-amber-400/20" />
                  <span class="text-white/50 text-sm"><i class="fa-solid fa-thumbtack text-amber-400/50 mr-1"></i>상단 고정</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" id="noticePublished" checked class="w-4 h-4 rounded bg-white/5 border-white/10 text-emerald-400 focus:ring-emerald-400/20" />
                  <span class="text-white/50 text-sm">공개</span>
                </label>
              </div>
            </div>
            <div>
              <label class="block text-white/50 text-xs font-semibold mb-2 uppercase tracking-wider">제목 *</label>
              <input id="noticeTitle" type="text" required class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-purple-400/50 placeholder-white/20" placeholder="공지사항 제목" />
            </div>
            <div>
              <label class="block text-white/50 text-xs font-semibold mb-2 uppercase tracking-wider">내용 *</label>
              <textarea id="noticeContent" rows={10} required class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-purple-400/50 placeholder-white/20 resize-none font-mono text-sm" placeholder="공지사항 내용을 입력하세요..."></textarea>
              <p class="text-white/15 text-xs mt-1">줄바꿈은 그대로 반영됩니다.</p>
            </div>
            <div class="flex gap-3 pt-2">
              <button type="submit" id="noticeSubmitBtn" class="flex-1 py-3.5 rounded-xl bg-purple-500 hover:bg-purple-600 text-white font-bold transition">
                <i class="fa-solid fa-check mr-1.5"></i>저장
              </button>
              <button type="button" onclick="document.getElementById('noticeModal').classList.add('hidden')" class="px-6 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/50 font-bold transition">취소</button>
            </div>
          </form>
        </div>
      </div>

      <script dangerouslySetInnerHTML={{__html: `
        function openNoticeModal() {
          document.getElementById('noticeModal').classList.remove('hidden');
          document.getElementById('noticeId').value = '';
          document.getElementById('noticeModalTitle').textContent = '새 공지 작성';
          document.getElementById('noticeTitle').value = '';
          document.getElementById('noticeContent').value = '';
          document.getElementById('noticeCategory').value = '공지';
          document.getElementById('noticePinned').checked = false;
          document.getElementById('noticePublished').checked = true;
        }

        function editNotice(n) {
          document.getElementById('noticeModal').classList.remove('hidden');
          document.getElementById('noticeModalTitle').textContent = '공지 수정';
          document.getElementById('noticeId').value = n.id;
          document.getElementById('noticeTitle').value = n.title;
          document.getElementById('noticeContent').value = n.content;
          document.getElementById('noticeCategory').value = n.category || '공지';
          document.getElementById('noticePinned').checked = !!n.is_pinned;
          document.getElementById('noticePublished').checked = !!n.is_published;
        }

        document.getElementById('noticeForm').addEventListener('submit', async function(e) {
          e.preventDefault();
          const btn = document.getElementById('noticeSubmitBtn');
          btn.disabled = true;
          btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-1.5"></i>저장 중...';

          const id = document.getElementById('noticeId').value;
          const data = {
            title: document.getElementById('noticeTitle').value,
            content: document.getElementById('noticeContent').value,
            category: document.getElementById('noticeCategory').value,
            is_pinned: document.getElementById('noticePinned').checked ? 1 : 0,
            is_published: document.getElementById('noticePublished').checked ? 1 : 0,
          };

          try {
            const url = id ? '/api/admin/notices/' + id : '/api/admin/notices';
            const method = id ? 'PUT' : 'POST';
            const res = await fetch(url, {
              method,
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(data)
            });
            const json = await res.json();
            if (json.ok) window.location.reload();
            else alert(json.error || '오류 발생');
          } catch(err) {
            alert('오류: ' + err.message);
          } finally {
            btn.disabled = false;
            btn.innerHTML = '<i class="fa-solid fa-check mr-1.5"></i>저장';
          }
        });

        async function deleteNotice(id) {
          if (!confirm('이 공지를 삭제하시겠습니까?')) return;
          try {
            const res = await fetch('/api/admin/notices/' + id, { method: 'DELETE' });
            const json = await res.json();
            if (json.ok) window.location.reload();
            else alert(json.error || '삭제 실패');
          } catch(err) { alert('오류: ' + err.message); }
        }
      `}} />
    </>,
    { title: '공지사항 관리 | 서울365치과' }
  )
})

// ADMIN API: Notices CRUD
adminRoutes.post('/api/admin/notices', async (c) => {
  await initAdminTables(c.env.DB);
  const admin = await getAdminFromCookie(c.env.DB, c.req.header('cookie'));
  if (!admin) return c.json({ ok: false, error: '인증 필요' }, 401);
  const { title, content, category, is_pinned, is_published } = await c.req.json();
  if (!title || !content) return c.json({ ok: false, error: '제목과 내용을 입력하세요' }, 400);
  await c.env.DB.prepare('INSERT INTO notices (title, content, category, is_pinned, is_published) VALUES (?, ?, ?, ?, ?)')
    .bind(title, content, category || '공지', is_pinned ? 1 : 0, is_published ? 1 : 0).run();
  return c.json({ ok: true });
})

adminRoutes.put('/api/admin/notices/:id', async (c) => {
  await initAdminTables(c.env.DB);
  const admin = await getAdminFromCookie(c.env.DB, c.req.header('cookie'));
  if (!admin) return c.json({ ok: false, error: '인증 필요' }, 401);
  const id = c.req.param('id');
  const { title, content, category, is_pinned, is_published } = await c.req.json();
  await c.env.DB.prepare('UPDATE notices SET title=?, content=?, category=?, is_pinned=?, is_published=?, updated_at=datetime(\'now\') WHERE id=?')
    .bind(title, content, category || '공지', is_pinned ? 1 : 0, is_published ? 1 : 0, id).run();
  return c.json({ ok: true });
})

adminRoutes.delete('/api/admin/notices/:id', async (c) => {
  await initAdminTables(c.env.DB);
  const admin = await getAdminFromCookie(c.env.DB, c.req.header('cookie'));
  if (!admin) return c.json({ ok: false, error: '인증 필요' }, 401);
  const id = c.req.param('id');
  await c.env.DB.prepare('DELETE FROM notices WHERE id = ?').bind(id).run();
  return c.json({ ok: true });
})

// --- CRUD API: Cases ---
// GET single case for editing
adminRoutes.get('/api/admin/cases/:id', async (c) => {
  await initAdminTables(c.env.DB);
  const admin = await getAdminFromCookie(c.env.DB, c.req.header('cookie'));
  if (!admin) return c.json({ ok: false, error: '인증 필요' }, 401);
  const caseData = await c.env.DB.prepare('SELECT * FROM before_after_cases WHERE id = ?').bind(c.req.param('id')).first();
  return caseData ? c.json({ ok: true, caseData }) : c.json({ ok: false, error: '없음' }, 404);
})

adminRoutes.post('/api/admin/cases', async (c) => {
  await initAdminTables(c.env.DB);
  const admin = await getAdminFromCookie(c.env.DB, c.req.header('cookie'));
  if (!admin) return c.json({ ok: false, error: '인증 필요' }, 401);

  const data = await c.req.json();
  await c.env.DB.prepare(`
    INSERT INTO before_after_cases (treatment_slug, title, patient_age, patient_gender, tag, doctor_name, description, duration, before_image, after_image, is_published, sort_order)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    data.treatment_slug, data.title, data.patient_age || null, data.patient_gender || null,
    data.tag, data.doctor_name, data.description || null, data.duration || null,
    data.before_image || null, data.after_image || null,
    data.is_published ? 1 : 0, data.sort_order || 0
  ).run();

  return c.json({ ok: true });
})

adminRoutes.put('/api/admin/cases/:id', async (c) => {
  await initAdminTables(c.env.DB);
  const admin = await getAdminFromCookie(c.env.DB, c.req.header('cookie'));
  if (!admin) return c.json({ ok: false, error: '인증 필요' }, 401);

  const id = c.req.param('id');
  const data = await c.req.json();
  await c.env.DB.prepare(`
    UPDATE before_after_cases SET
      treatment_slug=?, title=?, patient_age=?, patient_gender=?, tag=?, doctor_name=?,
      description=?, duration=?, before_image=?, after_image=?, is_published=?, sort_order=?,
      updated_at=datetime('now')
    WHERE id=?
  `).bind(
    data.treatment_slug, data.title, data.patient_age || null, data.patient_gender || null,
    data.tag, data.doctor_name, data.description || null, data.duration || null,
    data.before_image || null, data.after_image || null,
    data.is_published ? 1 : 0, data.sort_order || 0, id
  ).run();

  return c.json({ ok: true });
})

adminRoutes.delete('/api/admin/cases/:id', async (c) => {
  await initAdminTables(c.env.DB);
  const admin = await getAdminFromCookie(c.env.DB, c.req.header('cookie'));
  if (!admin) return c.json({ ok: false, error: '인증 필요' }, 401);

  const id = c.req.param('id');
  await c.env.DB.prepare('DELETE FROM before_after_cases WHERE id = ?').bind(id).run();
  return c.json({ ok: true });
})

// --- Public API: Increment case view count ---
adminRoutes.post('/api/cases/:id/view', async (c) => {
  const id = c.req.param('id');
  try {
    await c.env.DB.prepare('UPDATE before_after_cases SET view_count = view_count + 1 WHERE id = ?').bind(id).run();
    return c.json({ ok: true });
  } catch {
    return c.json({ ok: true });
  }
})

// --- Public API: Get published cases (for gallery) ---
adminRoutes.get('/api/cases', async (c) => {
  await initAdminTables(c.env.DB);
  const slug = c.req.query('slug');
  let query = 'SELECT id, treatment_slug, title, patient_age, patient_gender, tag, doctor_name, description, duration, before_image, after_image, sort_order, view_count, created_at FROM before_after_cases WHERE is_published = 1';
  const params: any[] = [];
  if (slug) { query += ' AND treatment_slug = ?'; params.push(slug); }
  query += ' ORDER BY sort_order DESC, created_at DESC';

  try {
    const result = params.length
      ? await c.env.DB.prepare(query).bind(...params).all()
      : await c.env.DB.prepare(query).all();
    return c.json({ ok: true, cases: result.results || [] });
  } catch {
    return c.json({ ok: true, cases: [] });
  }
})

// ============================================================
// ADMIN: 회원 관리 페이지
// ============================================================
adminRoutes.get('/admin/members', async (c) => {
  const admin = await getAdminFromCookie(c.env.DB, c.req.header('cookie'));
  if (!admin) return c.redirect('/admin');

  await initUserTables(c.env.DB);

  let members: any[] = [];
  let totalCount = 0;
  let marketingCount = 0;
  try {
    const result = await c.env.DB.prepare(
      'SELECT id, name, phone, privacy_agreed, privacy_agreed_at, marketing_agreed, marketing_agreed_at, is_active, created_at FROM users ORDER BY created_at DESC'
    ).all();
    members = result.results || [];
    totalCount = members.length;
    marketingCount = members.filter((m: any) => m.marketing_agreed === 1).length;
  } catch {}

  return c.render(
    <>
      {/* Admin Header */}
      <div class="fixed top-0 left-0 right-0 z-[10000] bg-gray-900/95 backdrop-blur border-b border-white/5">
        <div class="max-w-[1400px] mx-auto px-5 py-3 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-[#0066FF]/20 flex items-center justify-center">
              <i class="fa-solid fa-shield-halved text-[#0066FF] text-sm"></i>
            </div>
            <a href="/admin/dashboard" class="text-white font-bold text-sm hover:text-white/80 transition">서울365 관리자</a>
            <span class="text-white/20 text-xs">|</span>
            <span class="text-teal-400 text-xs font-semibold">회원 관리</span>
          </div>
          <div class="flex items-center gap-3">
            <a href="/admin/dashboard" class="text-white/30 hover:text-white/60 text-xs transition"><i class="fa-solid fa-arrow-left mr-1"></i>대시보드</a>
            <a href="/api/admin/logout" class="text-red-400/60 hover:text-red-400 text-xs transition"><i class="fa-solid fa-right-from-bracket mr-1"></i>로그아웃</a>
          </div>
        </div>
      </div>

      <section class="min-h-screen bg-gradient-to-br from-gray-900 via-[#0a0e1a] to-gray-900 pt-20 pb-12">
        <div class="max-w-[1400px] mx-auto px-5 md:px-8">

          {/* Stats */}
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div class="bg-white/5 border border-white/5 rounded-2xl p-5">
              <div class="text-white/30 text-xs font-semibold uppercase tracking-wider mb-2">전체 회원</div>
              <div class="text-3xl font-black text-white">{totalCount}</div>
            </div>
            <div class="bg-white/5 border border-white/5 rounded-2xl p-5">
              <div class="text-white/30 text-xs font-semibold uppercase tracking-wider mb-2">활성 회원</div>
              <div class="text-3xl font-black text-emerald-400">{members.filter((m: any) => m.is_active === 1).length}</div>
            </div>
            <div class="bg-white/5 border border-white/5 rounded-2xl p-5">
              <div class="text-white/30 text-xs font-semibold uppercase tracking-wider mb-2">광고 동의</div>
              <div class="text-3xl font-black text-teal-400">{marketingCount}</div>
            </div>
            <div class="bg-white/5 border border-white/5 rounded-2xl p-5">
              <div class="text-white/30 text-xs font-semibold uppercase tracking-wider mb-2">광고 미동의</div>
              <div class="text-3xl font-black text-amber-400">{totalCount - marketingCount}</div>
            </div>
          </div>

          {/* Filter */}
          <div class="flex flex-wrap items-center gap-3 mb-6">
            <button onclick="filterMembers('all')" id="filter-all" class="px-4 py-2 rounded-xl text-xs font-bold bg-white/10 text-white border border-white/10 hover:bg-white/15 transition active-filter">전체 ({totalCount})</button>
            <button onclick="filterMembers('marketing')" id="filter-marketing" class="px-4 py-2 rounded-xl text-xs font-bold bg-teal-500/10 text-teal-400 border border-teal-400/20 hover:bg-teal-500/20 transition">광고동의 ({marketingCount})</button>
            <button onclick="filterMembers('no-marketing')" id="filter-no-marketing" class="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-400/20 hover:bg-amber-500/20 transition">광고미동의 ({totalCount - marketingCount})</button>
            <div class="ml-auto">
              <button onclick="exportCSV()" class="px-4 py-2 rounded-xl text-xs font-bold bg-[#0066FF]/10 text-[#0066FF] border border-[#0066FF]/20 hover:bg-[#0066FF]/20 transition">
                <i class="fa-solid fa-file-csv mr-1"></i>CSV 내보내기
              </button>
            </div>
          </div>

          {/* Members Table */}
          <div class="bg-white/5 border border-white/5 rounded-2xl overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full text-sm" id="members-table">
                <thead>
                  <tr class="border-b border-white/5">
                    <th class="px-5 py-3.5 text-left text-xs font-bold text-white/40 uppercase tracking-wider">ID</th>
                    <th class="px-5 py-3.5 text-left text-xs font-bold text-white/40 uppercase tracking-wider">이름</th>
                    <th class="px-5 py-3.5 text-left text-xs font-bold text-white/40 uppercase tracking-wider">연락처</th>
                    <th class="px-5 py-3.5 text-left text-xs font-bold text-white/40 uppercase tracking-wider">개인정보동의</th>
                    <th class="px-5 py-3.5 text-left text-xs font-bold text-white/40 uppercase tracking-wider">광고동의</th>
                    <th class="px-5 py-3.5 text-left text-xs font-bold text-white/40 uppercase tracking-wider">상태</th>
                    <th class="px-5 py-3.5 text-left text-xs font-bold text-white/40 uppercase tracking-wider">가입일</th>
                  </tr>
                </thead>
                <tbody>
                  {members.length === 0 ? (
                    <tr><td colspan="7" class="px-5 py-16 text-center text-white/20">
                      <i class="fa-solid fa-users text-3xl mb-3 block opacity-30"></i>
                      등록된 회원이 없습니다
                    </td></tr>
                  ) : (
                    members.map((m: any) => (
                      <tr class={`border-b border-white/5 hover:bg-white/[0.03] transition member-row ${m.marketing_agreed ? 'marketing-yes' : 'marketing-no'}`}>
                        <td class="px-5 py-3.5 text-white/50 font-mono text-xs">{m.id}</td>
                        <td class="px-5 py-3.5 text-white font-semibold">{m.name}</td>
                        <td class="px-5 py-3.5 text-white/70 font-mono">{m.phone}</td>
                        <td class="px-5 py-3.5">
                          {m.privacy_agreed ? (
                            <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-400/10 text-emerald-400 text-xs font-bold">
                              <i class="fa-solid fa-check text-[0.6rem]"></i> 동의
                            </span>
                          ) : (
                            <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-400/10 text-gray-400 text-xs font-bold">
                              <i class="fa-solid fa-minus text-[0.6rem]"></i> 미동의
                            </span>
                          )}
                        </td>
                        <td class="px-5 py-3.5">
                          {m.marketing_agreed ? (
                            <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-teal-400/10 text-teal-400 text-xs font-bold">
                              <i class="fa-solid fa-bullhorn text-[0.6rem]"></i> 동의
                            </span>
                          ) : (
                            <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-400/10 text-amber-400 text-xs font-bold">
                              <i class="fa-solid fa-ban text-[0.6rem]"></i> 미동의
                            </span>
                          )}
                        </td>
                        <td class="px-5 py-3.5">
                          {m.is_active !== 0 ? (
                            <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-400/10 text-emerald-400 text-xs font-bold">활성</span>
                          ) : (
                            <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-400/10 text-red-400 text-xs font-bold">비활성</span>
                          )}
                        </td>
                        <td class="px-5 py-3.5 text-white/40 text-xs">{m.created_at ? new Date(m.created_at).toLocaleDateString('ko-KR') : '-'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Marketing Consent Info */}
          <div class="mt-6 bg-teal-400/5 border border-teal-400/10 rounded-2xl p-5">
            <h3 class="text-teal-400 font-bold text-sm mb-2"><i class="fa-solid fa-circle-info mr-1.5"></i>광고 활용 안내</h3>
            <ul class="text-white/40 text-xs space-y-1 leading-relaxed">
              <li>• 광고 동의 회원에게만 SMS/카카오톡 마케팅 메시지를 발송할 수 있습니다.</li>
              <li>• 광고 미동의 회원의 연락처는 마케팅 목적으로 사용할 수 없습니다.</li>
              <li>• CSV 내보내기 시 광고동의 필터를 적용하여 동의 회원만 추출 가능합니다.</li>
              <li>• 개인정보보호법 제22조에 따라 동의 내역과 시점이 기록됩니다.</li>
            </ul>
          </div>

        </div>
      </section>

      <script dangerouslySetInnerHTML={{__html: `
        function filterMembers(type) {
          const rows = document.querySelectorAll('.member-row');
          rows.forEach(row => {
            if (type === 'all') row.style.display = '';
            else if (type === 'marketing') row.style.display = row.classList.contains('marketing-yes') ? '' : 'none';
            else if (type === 'no-marketing') row.style.display = row.classList.contains('marketing-no') ? '' : 'none';
          });
          document.querySelectorAll('[id^="filter-"]').forEach(b => b.classList.remove('active-filter'));
          document.getElementById('filter-' + type).classList.add('active-filter');
        }

        function exportCSV() {
          const rows = document.querySelectorAll('.member-row');
          let csv = '\\uFEFF번호,이름,연락처,개인정보동의,광고동의,상태,가입일\\n';
          rows.forEach(row => {
            if (row.style.display === 'none') return;
            const cells = row.querySelectorAll('td');
            const values = Array.from(cells).map(c => c.textContent.trim().replace(/,/g, ' '));
            csv += values.join(',') + '\\n';
          });
          const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = '서울365_회원목록_' + new Date().toISOString().split('T')[0] + '.csv';
          link.click();
        }
      `}} />
      <style dangerouslySetInnerHTML={{__html: `
        .active-filter { ring: 2px; box-shadow: 0 0 0 2px rgba(255,255,255,0.15); }
      `}} />
    </>,
    {
      title: '회원 관리 | 서울365 관리자',
      description: '서울365치과 관리자 회원 관리 페이지',
    }
  )
})

// 회원 관리 API — 회원 목록 조회
adminRoutes.get('/api/admin/members', async (c) => {
  const admin = await getAdminFromCookie(c.env.DB, c.req.header('cookie'));
  if (!admin) return c.json({ ok: false, error: '인증 필요' }, 401);

  try {
    const result = await c.env.DB.prepare(
      'SELECT id, name, phone, privacy_agreed, privacy_agreed_at, marketing_agreed, marketing_agreed_at, is_active, created_at FROM users ORDER BY created_at DESC'
    ).all();
    return c.json({ ok: true, members: result.results || [] });
  } catch (e: any) {
    return c.json({ ok: false, error: e.message || '조회 실패' }, 500);
  }
})

// 회원 관리 API — 광고동의 회원만 조회
adminRoutes.get('/api/admin/members/marketing', async (c) => {
  const admin = await getAdminFromCookie(c.env.DB, c.req.header('cookie'));
  if (!admin) return c.json({ ok: false, error: '인증 필요' }, 401);

  try {
    const result = await c.env.DB.prepare(
      'SELECT id, name, phone, marketing_agreed_at, created_at FROM users WHERE marketing_agreed = 1 AND is_active = 1 ORDER BY created_at DESC'
    ).all();
    return c.json({ ok: true, members: result.results || [] });
  } catch (e: any) {
    return c.json({ ok: false, error: e.message || '조회 실패' }, 500);
  }
})

// ============================================================
// SEO / 색인 설정 관리 페이지
// ============================================================
adminRoutes.get('/admin/seo', async (c) => {
  await initAdminTables(c.env.DB);
  const admin = await getAdminFromCookie(c.env.DB, c.req.header('cookie'));
  if (!admin) return c.redirect('/admin');

  const settings = await getAllSeoSettings(c.env.DB, c.env as any);

  return c.render(
    <>
      {/* Admin Header */}
      <div class="fixed top-0 left-0 right-0 z-[10000] bg-gray-900/95 backdrop-blur border-b border-white/5">
        <div class="max-w-[1400px] mx-auto px-5 py-3 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <a href="/admin/dashboard" class="text-white/40 hover:text-white/70 transition"><i class="fa-solid fa-arrow-left mr-1"></i></a>
            <div class="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
              <i class="fa-solid fa-magnifying-glass-chart text-green-400 text-sm"></i>
            </div>
            <span class="text-white font-bold text-sm">SEO / 색인 설정</span>
          </div>
          <div class="flex items-center gap-3">
            <a href="/" target="_blank" class="text-white/30 hover:text-white/60 text-xs transition"><i class="fa-solid fa-external-link mr-1"></i>사이트 보기</a>
            <a href="/api/admin/logout" class="text-red-400/60 hover:text-red-400 text-xs transition"><i class="fa-solid fa-right-from-bracket mr-1"></i>로그아웃</a>
          </div>
        </div>
      </div>

      <section class="min-h-screen bg-gradient-to-br from-gray-900 via-[#0a0e1a] to-gray-900 pt-20 pb-12">
        <div class="max-w-4xl mx-auto px-5">

          {/* Status Banner */}
          <div class="bg-gradient-to-r from-green-500/10 to-[#0066FF]/10 border border-green-500/20 rounded-2xl p-6 mb-8">
            <h2 class="text-white font-bold text-lg mb-2"><i class="fa-solid fa-circle-check text-green-400 mr-2"></i>검색엔진 색인 설정</h2>
            <p class="text-white/40 text-sm">각 서비스에 가입 후 발급받은 인증 코드를 입력하면 자동으로 적용됩니다.</p>
          </div>

          <form id="seo-form" class="space-y-6">

            {/* Google Section */}
            <div class="bg-white/5 border border-white/5 rounded-2xl p-6">
              <div class="flex items-center gap-3 mb-5">
                <div class="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <i class="fa-brands fa-google text-blue-400 text-lg"></i>
                </div>
                <div>
                  <h3 class="text-white font-bold">Google</h3>
                  <p class="text-white/30 text-xs">Search Console + Analytics</p>
                </div>
              </div>

              <div class="space-y-4">
                <div>
                  <label class="block text-white/50 text-xs font-semibold mb-1.5">Google Search Console 인증 코드</label>
                  <input type="text" name="GOOGLE_SITE_VERIFICATION" value={settings.GOOGLE_SITE_VERIFICATION || ''} placeholder="예: ABC123xyz..." class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 focus:border-blue-500/50 focus:outline-none transition" />
                  <p class="text-white/20 text-xs mt-1"><a href="https://search.google.com/search-console" target="_blank" class="text-blue-400/70 hover:text-blue-400 underline">Search Console</a> → 설정 → 소유권 확인 → HTML 태그 → content="" 안의 값</p>
                </div>

                <div>
                  <label class="block text-white/50 text-xs font-semibold mb-1.5">Google Analytics 4 측정 ID</label>
                  <input type="text" name="GA4_MEASUREMENT_ID" value={settings.GA4_MEASUREMENT_ID || ''} placeholder="예: G-XXXXXXXXXX" class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 focus:border-blue-500/50 focus:outline-none transition" />
                  <p class="text-white/20 text-xs mt-1"><a href="https://analytics.google.com" target="_blank" class="text-blue-400/70 hover:text-blue-400 underline">GA4</a> → 관리 → 데이터 스트림 → 웹 → 측정 ID (G-로 시작)</p>
                </div>

                <div>
                  <label class="block text-white/50 text-xs font-semibold mb-1.5">Google Tag Manager 컨테이너 ID</label>
                  <input type="text" name="GTM_CONTAINER_ID" value={settings.GTM_CONTAINER_ID || ''} placeholder="예: GTM-XXXXXXX" class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 focus:border-blue-500/50 focus:outline-none transition" />
                  <p class="text-white/20 text-xs mt-1"><a href="https://tagmanager.google.com" target="_blank" class="text-blue-400/70 hover:text-blue-400 underline">GTM</a> → 컨테이너 ID (GTM-으로 시작). GA4만 사용 시 비워두세요.</p>
                </div>
              </div>
            </div>

            {/* Naver Section */}
            <div class="bg-white/5 border border-white/5 rounded-2xl p-6">
              <div class="flex items-center gap-3 mb-5">
                <div class="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                  <span class="text-green-400 font-black text-lg">N</span>
                </div>
                <div>
                  <h3 class="text-white font-bold">Naver</h3>
                  <p class="text-white/30 text-xs">Search Advisor (네이버 웹마스터 도구)</p>
                </div>
              </div>

              <div>
                <label class="block text-white/50 text-xs font-semibold mb-1.5">Naver Search Advisor 인증 코드</label>
                <input type="text" name="NAVER_SITE_VERIFICATION" value={settings.NAVER_SITE_VERIFICATION || ''} placeholder="예: abc123def456..." class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 focus:border-green-500/50 focus:outline-none transition" />
                <p class="text-white/20 text-xs mt-1"><a href="https://searchadvisor.naver.com" target="_blank" class="text-green-400/70 hover:text-green-400 underline">Search Advisor</a> → 사이트 등록 → 소유확인 → HTML 태그 → content="" 안의 값</p>
              </div>
            </div>

            {/* Bing Section */}
            <div class="bg-white/5 border border-white/5 rounded-2xl p-6">
              <div class="flex items-center gap-3 mb-5">
                <div class="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                  <i class="fa-brands fa-microsoft text-cyan-400 text-lg"></i>
                </div>
                <div>
                  <h3 class="text-white font-bold">Bing</h3>
                  <p class="text-white/30 text-xs">Webmaster Tools</p>
                </div>
              </div>

              <div>
                <label class="block text-white/50 text-xs font-semibold mb-1.5">Bing 인증 코드</label>
                <input type="text" name="BING_SITE_VERIFICATION" value={settings.BING_SITE_VERIFICATION || ''} placeholder="예: ABC123..." class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 focus:border-cyan-500/50 focus:outline-none transition" />
                <p class="text-white/20 text-xs mt-1"><a href="https://www.bing.com/webmasters" target="_blank" class="text-cyan-400/70 hover:text-cyan-400 underline">Bing Webmaster</a> → 사이트 추가 → HTML 메타 태그 → content="" 안의 값</p>
              </div>
            </div>

            {/* IndexNow Section */}
            <div class="bg-white/5 border border-white/5 rounded-2xl p-6">
              <div class="flex items-center gap-3 mb-5">
                <div class="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                  <i class="fa-solid fa-bolt text-orange-400 text-lg"></i>
                </div>
                <div>
                  <h3 class="text-white font-bold">IndexNow</h3>
                  <p class="text-white/30 text-xs">Bing/Yandex 즉시 색인 프로토콜</p>
                </div>
              </div>

              <div>
                <label class="block text-white/50 text-xs font-semibold mb-1.5">IndexNow API 키</label>
                <input type="text" name="INDEXNOW_KEY" value={settings.INDEXNOW_KEY || ''} placeholder="예: a1b2c3d4e5f6..." class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 focus:border-orange-500/50 focus:outline-none transition" />
                <p class="text-white/20 text-xs mt-1"><a href="https://www.indexnow.org/documentation" target="_blank" class="text-orange-400/70 hover:text-orange-400 underline">IndexNow</a> → 아무 영숫자 32자 문자열 입력 (예: 랜덤 UUID). 입력 후 '즉시 색인 요청' 버튼 사용 가능.</p>
              </div>
            </div>

            {/* Save Button */}
            <div class="flex flex-col sm:flex-row gap-3">
              <button type="submit" id="save-btn" class="flex-1 bg-gradient-to-r from-[#0066FF] to-[#2979FF] text-white font-bold py-4 rounded-xl hover:shadow-lg hover:shadow-[#0066FF]/20 transition-all text-sm">
                <i class="fa-solid fa-floppy-disk mr-2"></i>설정 저장
              </button>
            </div>
          </form>

          {/* Action Buttons */}
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
            <button id="btn-indexnow" class="bg-white/5 border border-orange-500/20 text-orange-400 font-semibold py-3 rounded-xl hover:bg-orange-500/10 transition-all text-sm disabled:opacity-30">
              <i class="fa-solid fa-bolt mr-1"></i>즉시 색인 요청
            </button>
            <button id="btn-ping" class="bg-white/5 border border-purple-500/20 text-purple-400 font-semibold py-3 rounded-xl hover:bg-purple-500/10 transition-all text-sm">
              <i class="fa-solid fa-satellite-dish mr-1"></i>사이트맵 알림
            </button>
            <a href="/sitemap.xml" target="_blank" class="bg-white/5 border border-white/10 text-white/60 font-semibold py-3 rounded-xl hover:bg-white/10 transition-all text-sm text-center">
              <i class="fa-solid fa-sitemap mr-1"></i>사이트맵 확인
            </a>
          </div>

          {/* Result Log */}
          <div id="result-log" class="mt-6 hidden">
            <div class="bg-black/30 border border-white/5 rounded-xl p-4 font-mono text-xs text-white/50 max-h-48 overflow-y-auto whitespace-pre-wrap" id="log-content"></div>
          </div>

          {/* Quick Guide */}
          <div class="mt-10 bg-white/[0.02] border border-white/5 rounded-2xl p-6">
            <h3 class="text-white font-bold mb-4"><i class="fa-solid fa-book-open text-[#0066FF] mr-2"></i>빠른 등록 가이드</h3>
            <div class="space-y-4 text-sm text-white/40">
              <div class="flex gap-3">
                <span class="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold">1</span>
                <div><strong class="text-white/70">Google Search Console</strong> — <a href="https://search.google.com/search-console" target="_blank" class="text-blue-400/70 underline">접속</a> → 속성 추가 → URL 접두어 → https://seoul365dc.kr 입력 → HTML 태그 → 메타 태그의 content 값 복사</div>
              </div>
              <div class="flex gap-3">
                <span class="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold">2</span>
                <div><strong class="text-white/70">Google Analytics 4</strong> — <a href="https://analytics.google.com" target="_blank" class="text-blue-400/70 underline">접속</a> → 계정 만들기 → 속성 만들기 → 데이터 스트림 → 웹 → G-XXXXXXXXXX 복사</div>
              </div>
              <div class="flex gap-3">
                <span class="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-xs font-bold">3</span>
                <div><strong class="text-white/70">Naver Search Advisor</strong> — <a href="https://searchadvisor.naver.com" target="_blank" class="text-green-400/70 underline">접속</a> → 사이트 등록 → https://seoul365dc.kr → 소유확인 → HTML 태그 → content 값 복사</div>
              </div>
              <div class="flex gap-3">
                <span class="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs font-bold">4</span>
                <div><strong class="text-white/70">Bing Webmaster</strong> — <a href="https://www.bing.com/webmasters" target="_blank" class="text-cyan-400/70 underline">접속</a> → Google 계정으로 가져오기 (가장 빠름) 또는 수동 등록</div>
              </div>
              <div class="flex gap-3">
                <span class="flex-shrink-0 w-6 h-6 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center text-xs font-bold">5</span>
                <div><strong class="text-white/70">IndexNow</strong> — 별도 가입 불필요. 위 칸에 아무 영숫자 32자 입력 후 저장 → '즉시 색인 요청' 클릭</div>
              </div>
            </div>
          </div>

        </div>
      </section>

      <script dangerouslySetInnerHTML={{__html: `
        // Save settings
        document.getElementById('seo-form').addEventListener('submit', async function(e) {
          e.preventDefault();
          const btn = document.getElementById('save-btn');
          btn.disabled = true;
          btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i>저장 중...';

          const formData = new FormData(this);
          const data = {};
          formData.forEach((v, k) => { data[k] = v.toString().trim(); });

          try {
            const res = await fetch('/api/admin/seo/settings', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(data),
            });
            const result = await res.json();
            if (result.ok) {
              btn.innerHTML = '<i class="fa-solid fa-check mr-2"></i>저장 완료!';
              btn.className = btn.className.replace('from-[#0066FF] to-[#2979FF]', 'from-emerald-500 to-emerald-600');
              setTimeout(() => {
                btn.innerHTML = '<i class="fa-solid fa-floppy-disk mr-2"></i>설정 저장';
                btn.className = btn.className.replace('from-emerald-500 to-emerald-600', 'from-[#0066FF] to-[#2979FF]');
                btn.disabled = false;
              }, 2000);
            } else {
              throw new Error(result.error);
            }
          } catch (err) {
            btn.innerHTML = '<i class="fa-solid fa-xmark mr-2"></i>저장 실패';
            btn.disabled = false;
            setTimeout(() => { btn.innerHTML = '<i class="fa-solid fa-floppy-disk mr-2"></i>설정 저장'; }, 2000);
          }
        });

        function showLog(msg) {
          const logDiv = document.getElementById('result-log');
          const content = document.getElementById('log-content');
          logDiv.classList.remove('hidden');
          content.textContent += new Date().toLocaleTimeString() + ' | ' + msg + '\\n';
          content.scrollTop = content.scrollHeight;
        }

        // IndexNow submit
        document.getElementById('btn-indexnow').addEventListener('click', async function() {
          this.disabled = true;
          this.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-1"></i>요청 중...';
          showLog('IndexNow 즉시 색인 요청 시작...');
          try {
            const res = await fetch('/api/indexnow/submit', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' });
            const data = await res.json();
            if (data.ok) {
              showLog('✅ ' + data.submitted + '개 URL 전송 완료');
              Object.entries(data.results || {}).forEach(([k, v]) => {
                showLog('  → ' + k.split('/').pop() + ': HTTP ' + v + (v === 200 || v === 202 ? ' ✓' : ' ✗'));
              });
            } else {
              showLog('❌ 실패: ' + (data.error || '알 수 없는 오류'));
            }
          } catch (err) {
            showLog('❌ 네트워크 오류: ' + err.message);
          }
          this.disabled = false;
          this.innerHTML = '<i class="fa-solid fa-bolt mr-1"></i>즉시 색인 요청';
        });

        // Sitemap ping
        document.getElementById('btn-ping').addEventListener('click', async function() {
          this.disabled = true;
          this.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-1"></i>알림 중...';
          showLog('사이트맵 알림 전송 시작...');
          try {
            const res = await fetch('/api/seo/ping', { method: 'POST' });
            const data = await res.json();
            if (data.ok) {
              showLog('✅ 사이트맵 알림 완료');
              Object.entries(data.results || {}).forEach(([k, v]) => {
                showLog('  → ' + k + ': HTTP ' + v);
              });
            } else {
              showLog('❌ 실패: ' + (data.error || '알 수 없는 오류'));
            }
          } catch (err) {
            showLog('❌ 네트워크 오류: ' + err.message);
          }
          this.disabled = false;
          this.innerHTML = '<i class="fa-solid fa-satellite-dish mr-1"></i>사이트맵 알림';
        });
      `}} />
    </>,
    { title: 'SEO / 색인 설정 | 서울365 관리자' }
  )
})

// --- SEO Settings API ---
adminRoutes.put('/api/admin/seo/settings', async (c) => {
  const admin = await getAdminFromCookie(c.env.DB, c.req.header('cookie'));
  if (!admin) return c.json({ ok: false, error: '인증 필요' }, 401);

  const body = await c.req.json<Record<string, string>>();
  const allowedKeys = ['GA4_MEASUREMENT_ID', 'GTM_CONTAINER_ID', 'GOOGLE_SITE_VERIFICATION', 'NAVER_SITE_VERIFICATION', 'BING_SITE_VERIFICATION', 'INDEXNOW_KEY'];

  try {
    for (const key of allowedKeys) {
      if (key in body) {
        await setSetting(c.env.DB, key, body[key] || '');
      }
    }
    return c.json({ ok: true });
  } catch (e: any) {
    return c.json({ ok: false, error: e.message || '저장 실패' }, 500);
  }
})

// --- SEO Settings GET API ---
adminRoutes.get('/api/admin/seo/settings', async (c) => {
  const admin = await getAdminFromCookie(c.env.DB, c.req.header('cookie'));
  if (!admin) return c.json({ ok: false, error: '인증 필요' }, 401);

  const settings = await getAllSeoSettings(c.env.DB, c.env as any);
  return c.json({ ok: true, settings });
})

export default adminRoutes
