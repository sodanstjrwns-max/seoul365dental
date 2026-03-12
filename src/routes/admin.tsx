import { Hono } from 'hono'
import type { Bindings } from '../lib/types'
import { hashPassword, verifyPassword, generateSessionId } from '../lib/auth'
import { getAdminUser, getAdminFromCookie, initAdminTables } from '../lib/db'
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

  if (!username || !password) return c.redirect('/admin?error=' + encodeURIComponent('아이디와 비밀번호를 입력하세요'));

  // Auto-create default admin if none exists
  const adminCount = await c.env.DB.prepare('SELECT COUNT(*) as cnt FROM admin_users').first<{ cnt: number }>();
  if (!adminCount || adminCount.cnt === 0) {
    const defaultHash = await hashPassword('seoul365!');
    await c.env.DB.prepare('INSERT INTO admin_users (username, password_hash, name) VALUES (?, ?, ?)').bind('admin', defaultHash, '관리자').run();
  }

  const admin = await c.env.DB.prepare('SELECT id, username, name, password_hash FROM admin_users WHERE username = ?').bind(username).first<{ id: number; username: string; name: string; password_hash: string }>();
  if (!admin) return c.redirect('/admin?error=' + encodeURIComponent('존재하지 않는 계정입니다'));

  const valid = await verifyPassword(password, admin.password_hash);
  if (!valid) return c.redirect('/admin?error=' + encodeURIComponent('비밀번호가 올바르지 않습니다'));

  const sessionId = generateSessionId();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24h
  await c.env.DB.prepare('INSERT INTO admin_sessions (id, admin_id, expires_at) VALUES (?, ?, ?)').bind(sessionId, admin.id, expiresAt).run();

  return new Response(null, {
    status: 302,
    headers: {
      'Location': '/admin/dashboard',
      'Set-Cookie': `admin_session=${sessionId}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400`,
    },
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

  const treatmentOptions = treatments.map(t => ({ slug: t.slug, name: t.name, category: t.category }));
  const doctorOptions = doctors.map(d => ({ slug: d.slug, name: d.name }));

  return c.render(
    <>
      {/* Admin Header */}
      <div class="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur border-b border-white/5">
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
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
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

          {/* Quick Links */}
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <a href="/admin/blog" class="bg-white/5 border border-white/5 rounded-2xl p-5 hover:bg-white/[0.08] hover:border-[#0066FF]/20 transition-all group">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-[#0066FF]/10 flex items-center justify-center">
                  <i class="fa-solid fa-pen-nib text-[#0066FF]"></i>
                </div>
                <div>
                  <div class="text-white font-bold text-sm group-hover:text-[#0066FF] transition">블로그 관리</div>
                  <div class="text-white/25 text-xs">글 작성·수정·삭제</div>
                </div>
              </div>
            </a>
            <a href="/cases/gallery" target="_blank" class="bg-white/5 border border-white/5 rounded-2xl p-5 hover:bg-white/[0.08] hover:border-emerald-400/20 transition-all group">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-emerald-400/10 flex items-center justify-center">
                  <i class="fa-solid fa-images text-emerald-400"></i>
                </div>
                <div>
                  <div class="text-white font-bold text-sm group-hover:text-emerald-400 transition">사례 미리보기</div>
                  <div class="text-white/25 text-xs">공개 갤러리 보기</div>
                </div>
              </div>
            </a>
            <a href="/blog" target="_blank" class="bg-white/5 border border-white/5 rounded-2xl p-5 hover:bg-white/[0.08] hover:border-cyan-400/20 transition-all group">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-cyan-400/10 flex items-center justify-center">
                  <i class="fa-solid fa-newspaper text-cyan-400"></i>
                </div>
                <div>
                  <div class="text-white font-bold text-sm group-hover:text-cyan-400 transition">블로그 보기</div>
                  <div class="text-white/25 text-xs">공개 블로그 확인</div>
                </div>
              </div>
            </a>
            <a href="/" target="_blank" class="bg-white/5 border border-white/5 rounded-2xl p-5 hover:bg-white/[0.08] hover:border-amber-400/20 transition-all group">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-amber-400/10 flex items-center justify-center">
                  <i class="fa-solid fa-globe text-amber-400"></i>
                </div>
                <div>
                  <div class="text-white font-bold text-sm group-hover:text-amber-400 transition">사이트 보기</div>
                  <div class="text-white/25 text-xs">메인 페이지 확인</div>
                </div>
              </div>
            </a>
          </div>

          {/* New Case Button */}
          <div class="flex items-center justify-between mb-6">
            <h1 class="text-xl font-bold text-white">Before &amp; After 케이스 관리</h1>
            <button onclick="document.getElementById('caseModal').classList.remove('hidden'); document.getElementById('caseForm').reset(); document.getElementById('caseId').value=''; document.getElementById('modalTitle').textContent='새 케이스 등록'; document.getElementById('beforePreview').src=''; document.getElementById('afterPreview').src=''; document.getElementById('beforePreview').classList.add('hidden'); document.getElementById('afterPreview').classList.add('hidden');" class="px-5 py-2.5 rounded-xl bg-[#0066FF] hover:bg-[#0052cc] text-white text-sm font-bold transition">
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
                        <td class="px-5 py-3">
                          {cs.is_published ? (
                            <span class="inline-flex items-center gap-1 text-xs text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-full"><span class="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>공개</span>
                          ) : (
                            <span class="inline-flex items-center gap-1 text-xs text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full"><span class="w-1.5 h-1.5 bg-amber-400 rounded-full"></span>비공개</span>
                          )}
                        </td>
                        <td class="px-5 py-3 text-right">
                          <button onclick={`editCase(${JSON.stringify(cs).replace(/"/g, '&quot;')})`} class="text-white/30 hover:text-[#0066FF] transition p-1.5" title="수정">
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
      <div id="caseModal" class="hidden fixed inset-0 z-[60] flex items-center justify-center p-4">
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

            {/* Image Uploads */}
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-white/50 text-xs font-semibold mb-2 uppercase tracking-wider">Before 이미지</label>
                <div class="relative">
                  <input type="file" id="beforeFile" accept="image/*" onchange="previewImage(this, 'beforePreview', 'beforeData')" class="hidden" />
                  <input type="hidden" id="beforeData" name="before_image" />
                  <button type="button" onclick="document.getElementById('beforeFile').click()" class="w-full py-8 border-2 border-dashed border-white/10 rounded-xl hover:border-white/20 transition text-center">
                    <img id="beforePreview" src="" class="hidden w-full h-32 object-cover rounded-lg mb-2" />
                    <span id="beforeLabel" class="text-white/20 text-sm"><i class="fa-solid fa-cloud-arrow-up mr-1.5"></i>Before 사진 업로드</span>
                  </button>
                </div>
              </div>
              <div>
                <label class="block text-white/50 text-xs font-semibold mb-2 uppercase tracking-wider">After 이미지</label>
                <div class="relative">
                  <input type="file" id="afterFile" accept="image/*" onchange="previewImage(this, 'afterPreview', 'afterData')" class="hidden" />
                  <input type="hidden" id="afterData" name="after_image" />
                  <button type="button" onclick="document.getElementById('afterFile').click()" class="w-full py-8 border-2 border-dashed border-white/10 rounded-xl hover:border-white/20 transition text-center">
                    <img id="afterPreview" src="" class="hidden w-full h-32 object-cover rounded-lg mb-2" />
                    <span id="afterLabel" class="text-white/20 text-sm"><i class="fa-solid fa-cloud-arrow-up mr-1.5"></i>After 사진 업로드</span>
                  </button>
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
        function previewImage(input, previewId, dataId) {
          const file = input.files[0];
          if (!file) return;
          if (file.size > 2 * 1024 * 1024) { alert('이미지는 2MB 이하로 업로드해주세요.'); return; }
          const reader = new FileReader();
          reader.onload = function(e) {
            // Resize image to max 800px width for storage efficiency
            const img = new Image();
            img.onload = function() {
              const canvas = document.createElement('canvas');
              const maxW = 800;
              let w = img.width, h = img.height;
              if (w > maxW) { h = Math.round(h * maxW / w); w = maxW; }
              canvas.width = w; canvas.height = h;
              const ctx = canvas.getContext('2d');
              ctx.drawImage(img, 0, 0, w, h);
              const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
              document.getElementById(dataId).value = dataUrl;
              const preview = document.getElementById(previewId);
              preview.src = dataUrl;
              preview.classList.remove('hidden');
            };
            img.src = e.target.result;
          };
          reader.readAsDataURL(file);
        }

        function editCase(cs) {
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

          if (cs.before_image) {
            document.getElementById('beforePreview').src = cs.before_image;
            document.getElementById('beforePreview').classList.remove('hidden');
            document.getElementById('beforeData').value = cs.before_image;
          } else {
            document.getElementById('beforePreview').classList.add('hidden');
            document.getElementById('beforeData').value = '';
          }
          if (cs.after_image) {
            document.getElementById('afterPreview').src = cs.after_image;
            document.getElementById('afterPreview').classList.remove('hidden');
            document.getElementById('afterData').value = cs.after_image;
          } else {
            document.getElementById('afterPreview').classList.add('hidden');
            document.getElementById('afterData').value = '';
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
    status: 302,
    headers: {
      'Location': '/admin',
      'Set-Cookie': 'admin_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0',
    },
  });
}
adminRoutes.get('/api/admin/logout', async (c) => handleAdminLogout(c))
adminRoutes.post('/api/admin/logout', async (c) => handleAdminLogout(c))

// --- CRUD API: Cases ---
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

// --- Public API: Get published cases (for gallery) ---
adminRoutes.get('/api/cases', async (c) => {
  await initAdminTables(c.env.DB);
  const slug = c.req.query('slug');
  let query = 'SELECT id, treatment_slug, title, patient_age, patient_gender, tag, doctor_name, description, duration, before_image, after_image, sort_order, created_at FROM before_after_cases WHERE is_published = 1';
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

export default adminRoutes
