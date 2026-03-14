import { Hono } from 'hono'
import type { Bindings } from '../lib/types'
import { treatments, getTreatmentBySlug } from '../data/treatments'
import { getAdminFromCookie, initAdminTables, initBlogTables, renderContent, slugify } from '../lib/db'

const blogRoutes = new Hono<{ Bindings: Bindings }>()

// --- Admin Blog Editor ---
blogRoutes.get('/admin/blog', async (c) => {
  await initAdminTables(c.env.DB);
  await initBlogTables(c.env.DB);
  const admin = await getAdminFromCookie(c.env.DB, c.req.header('cookie'));
  if (!admin) return c.redirect('/admin');

  let posts: any[] = [];
  try {
    const result = await c.env.DB.prepare('SELECT id, slug, title, category, is_published, view_count, created_at, updated_at FROM blog_posts ORDER BY created_at DESC').all();
    posts = result.results || [];
  } catch {}

  return c.render(
    <>
      {/* Admin Header */}
      <div class="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur border-b border-white/5">
        <div class="max-w-[1400px] mx-auto px-5 py-3 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-[#0066FF]/20 flex items-center justify-center">
              <i class="fa-solid fa-pen-nib text-[#0066FF] text-sm"></i>
            </div>
            <span class="text-white font-bold text-sm">블로그 관리</span>
            <span class="text-white/20 text-xs">|</span>
            <a href="/admin/dashboard" class="text-white/30 hover:text-white/60 text-xs transition">← 대시보드</a>
          </div>
          <div class="flex items-center gap-3">
            <a href="/blog" class="text-white/30 hover:text-white/60 text-xs transition" target="_blank"><i class="fa-solid fa-external-link mr-1"></i>블로그 보기</a>
            <a href="/api/admin/logout" class="text-red-400/60 hover:text-red-400 text-xs transition"><i class="fa-solid fa-right-from-bracket mr-1"></i>로그아웃</a>
          </div>
        </div>
      </div>

      <section class="min-h-screen bg-gradient-to-br from-gray-900 via-[#0a0e1a] to-gray-900 pt-20 pb-12">
        <div class="max-w-[1400px] mx-auto px-5 md:px-8">

          {/* Stats */}
          <div class="grid grid-cols-3 gap-4 mb-8">
            <div class="bg-white/5 border border-white/5 rounded-2xl p-5">
              <div class="text-white/30 text-xs font-semibold uppercase tracking-wider mb-2">전체 글</div>
              <div class="text-3xl font-black text-white">{posts.length}</div>
            </div>
            <div class="bg-white/5 border border-white/5 rounded-2xl p-5">
              <div class="text-white/30 text-xs font-semibold uppercase tracking-wider mb-2">공개</div>
              <div class="text-3xl font-black text-emerald-400">{posts.filter((p: any) => p.is_published).length}</div>
            </div>
            <div class="bg-white/5 border border-white/5 rounded-2xl p-5">
              <div class="text-white/30 text-xs font-semibold uppercase tracking-wider mb-2">총 조회</div>
              <div class="text-3xl font-black text-[#0066FF]">{posts.reduce((s: number, p: any) => s + (p.view_count || 0), 0)}</div>
            </div>
          </div>

          <div class="flex items-center justify-between mb-6">
            <h1 class="text-xl font-bold text-white">블로그 글 관리</h1>
            <button onclick="openEditor()" class="px-5 py-2.5 rounded-xl bg-[#0066FF] hover:bg-[#0052cc] text-white text-sm font-bold transition">
              <i class="fa-solid fa-plus mr-1.5"></i>새 글 작성
            </button>
          </div>

          {/* Posts List */}
          <div class="bg-white/5 border border-white/5 rounded-2xl overflow-hidden">
            {posts.length === 0 ? (
              <div class="p-16 text-center">
                <div class="w-16 h-16 rounded-full bg-white/5 mx-auto mb-4 flex items-center justify-center">
                  <i class="fa-solid fa-pen-nib text-2xl text-white/20"></i>
                </div>
                <p class="text-white/30 text-sm">아직 작성된 글이 없습니다.</p>
              </div>
            ) : (
              <div class="divide-y divide-white/5">
                {posts.map((p: any) => (
                  <div class="px-5 py-4 flex items-center justify-between hover:bg-white/[0.02] transition">
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center gap-2 mb-1">
                        {p.is_published ? (
                          <span class="inline-flex items-center gap-1 text-[0.65rem] text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full"><span class="w-1 h-1 bg-emerald-400 rounded-full"></span>공개</span>
                        ) : (
                          <span class="inline-flex items-center gap-1 text-[0.65rem] text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full"><span class="w-1 h-1 bg-amber-400 rounded-full"></span>초안</span>
                        )}
                        <span class="text-[0.65rem] text-white/20 bg-white/5 px-2 py-0.5 rounded-full">{p.category}</span>
                      </div>
                      <h3 class="text-white font-medium text-sm truncate">{p.title}</h3>
                      <p class="text-white/20 text-xs mt-0.5">{p.slug} · <i class="fa-solid fa-eye text-white/15 mr-0.5"></i><span class="text-white/40 font-mono">{(p.view_count || 0).toLocaleString()}</span> · {p.created_at?.split('T')[0] || p.created_at?.split(' ')[0]}</p>
                    </div>
                    <div class="flex items-center gap-2 ml-4">
                      <a href={`/blog/${p.slug}`} target="_blank" class="text-white/20 hover:text-white/50 transition p-1.5" title="미리보기"><i class="fa-solid fa-eye text-xs"></i></a>
                      <button onclick={`loadPost(${p.id})`} class="text-white/20 hover:text-[#0066FF] transition p-1.5" title="수정"><i class="fa-solid fa-pen-to-square text-xs"></i></button>
                      <button onclick={`deletePost(${p.id})`} class="text-white/20 hover:text-red-400 transition p-1.5" title="삭제"><i class="fa-solid fa-trash text-xs"></i></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Editor Modal — Full screen */}
      <div id="editorModal" class="hidden fixed inset-0 z-[60] bg-gray-900">
        <div class="h-full flex flex-col">
          {/* Editor Header */}
          <div class="flex items-center justify-between px-5 py-3 bg-gray-900 border-b border-white/5">
            <div class="flex items-center gap-3">
              <button onclick="closeEditor()" class="text-white/30 hover:text-white transition"><i class="fa-solid fa-arrow-left"></i></button>
              <span id="editorTitle" class="text-white font-bold text-sm">새 글 작성</span>
            </div>
            <div class="flex items-center gap-2">
              <button onclick="savePost(0)" class="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 text-xs font-bold transition">초안 저장</button>
              <button onclick="savePost(1)" class="px-4 py-2 rounded-lg bg-[#0066FF] hover:bg-[#0052cc] text-white text-xs font-bold transition">
                <i class="fa-solid fa-paper-plane mr-1"></i>공개 발행
              </button>
            </div>
          </div>

          {/* Editor Body */}
          <div class="flex-1 overflow-hidden flex">
            {/* Left — Form */}
            <div class="w-full lg:w-1/2 overflow-y-auto p-5 space-y-4">
              <input type="hidden" id="postId" value="" />
              <div>
                <label class="block text-white/40 text-xs font-semibold mb-1.5 uppercase">제목 *</label>
                <input id="postTitle" type="text" placeholder="SEO에 적합한 제목을 입력하세요" class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-lg font-bold outline-none focus:border-[#0066FF]/50 placeholder-white/15" />
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-white/40 text-xs font-semibold mb-1.5 uppercase">카테고리</label>
                  <select id="postCategory" class="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none text-sm">
                    <option value="치과상식" class="bg-gray-900">치과상식</option>
                    <option value="임플란트" class="bg-gray-900">임플란트</option>
                    <option value="교정" class="bg-gray-900">교정</option>
                    <option value="심미치료" class="bg-gray-900">심미치료</option>
                    <option value="소아치과" class="bg-gray-900">소아치과</option>
                    <option value="잇몸/외과" class="bg-gray-900">잇몸/외과</option>
                    <option value="수면진료" class="bg-gray-900">수면진료</option>
                    <option value="병원소식" class="bg-gray-900">병원소식</option>
                    <option value="환자후기" class="bg-gray-900">환자후기</option>
                  </select>
                </div>
                <div>
                  <label class="block text-white/40 text-xs font-semibold mb-1.5 uppercase">관련 진료</label>
                  <select id="postTreatment" class="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none text-sm">
                    <option value="" class="bg-gray-900">선택안함</option>
                    {treatments.map(t => (
                      <option value={t.slug} class="bg-gray-900">{t.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label class="block text-white/40 text-xs font-semibold mb-1.5 uppercase">태그 (쉼표 구분)</label>
                <input id="postTags" type="text" placeholder="임플란트, 비용, 수명" class="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none text-sm placeholder-white/15" />
              </div>
              <div>
                <label class="block text-white/40 text-xs font-semibold mb-1.5 uppercase">발췌문 (검색결과 미리보기)</label>
                <textarea id="postExcerpt" rows={2} placeholder="이 글의 핵심을 2-3문장으로 요약하세요" class="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none text-sm resize-none placeholder-white/15"></textarea>
              </div>

              {/* Cover Image Upload */}
              <div>
                <label class="block text-white/40 text-xs font-semibold mb-1.5 uppercase">커버 이미지</label>
                <input type="hidden" id="postCoverImage" value="" />
                <div id="coverDropZone" class="relative border-2 border-dashed border-white/10 rounded-xl hover:border-[#0066FF]/30 transition cursor-pointer overflow-hidden"
                     onclick="document.getElementById('coverFileInput').click()">
                  <input type="file" id="coverFileInput" accept="image/*" class="hidden" onchange="uploadCoverImage(this)" />
                  <div id="coverPreviewArea" class="hidden">
                    <img id="coverPreviewImg" src="" alt="" class="w-full h-40 object-cover" />
                    <button type="button" onclick="event.stopPropagation(); removeCoverImage()" class="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-500/80 hover:bg-red-500 text-white flex items-center justify-center transition text-xs"><i class="fa-solid fa-xmark"></i></button>
                  </div>
                  <div id="coverPlaceholder" class="flex items-center justify-center gap-3 py-8 text-white/20">
                    <i class="fa-solid fa-image text-lg"></i>
                    <span class="text-sm">커버 이미지를 클릭하여 업로드 (선택사항)</span>
                  </div>
                  <div id="coverUploading" class="hidden flex items-center justify-center gap-2 py-8">
                    <i class="fa-solid fa-spinner fa-spin text-[#0066FF]"></i>
                    <span class="text-[#0066FF] text-sm">업로드 중...</span>
                  </div>
                </div>
              </div>

              <div>
                <div class="flex items-center justify-between mb-1.5">
                  <label class="block text-white/40 text-xs font-semibold uppercase">본문 (마크다운) *</label>
                  <div class="flex items-center gap-1">
                    <button type="button" onclick="insertMd('## ')" class="text-white/20 hover:text-white/50 transition px-1.5 py-0.5 rounded text-xs" title="제목">H2</button>
                    <button type="button" onclick="insertMd('### ')" class="text-white/20 hover:text-white/50 transition px-1.5 py-0.5 rounded text-xs" title="소제목">H3</button>
                    <button type="button" onclick="wrapMd('**','**')" class="text-white/20 hover:text-white/50 transition px-1.5 py-0.5 rounded text-xs font-bold" title="굵게">B</button>
                    <button type="button" onclick="insertMd('- ')" class="text-white/20 hover:text-white/50 transition px-1.5 py-0.5 rounded text-xs" title="목록">•</button>
                    <button type="button" onclick="insertMd('> ')" class="text-white/20 hover:text-white/50 transition px-1.5 py-0.5 rounded text-xs" title="인용">"</button>
                    <button type="button" onclick="insertMd('---\n')" class="text-white/20 hover:text-white/50 transition px-1.5 py-0.5 rounded text-xs" title="구분선">—</button>
                    <span class="text-white/10 mx-1">|</span>
                    <button type="button" onclick="document.getElementById('bodyImageInput').click()" class="text-white/20 hover:text-emerald-400 transition px-1.5 py-0.5 rounded text-xs" title="이미지 삽입"><i class="fa-solid fa-image"></i></button>
                    <button type="button" onclick="openImageGallery()" class="text-white/20 hover:text-purple-400 transition px-1.5 py-0.5 rounded text-xs" title="이미지 갤러리"><i class="fa-solid fa-photo-film"></i></button>
                  </div>
                </div>
                <input type="file" id="bodyImageInput" accept="image/*" multiple class="hidden" onchange="uploadBodyImages(this)" />
                <div class="relative">
                  <textarea id="postContent" rows={18} placeholder={"## 서론\n\n환자분들이 가장 많이 궁금해하시는...\n\n## 본론\n\n### 1. 첫 번째 포인트\n\n내용을 작성하세요.\n\n- 목록 항목 1\n- 목록 항목 2\n\n> 전문가 팁: 이런 부분을 주의하세요.\n\n## 결론\n\n정리하면..."} class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white outline-none text-sm font-mono resize-none placeholder-white/10 leading-relaxed" oninput="updatePreview()"></textarea>
                  {/* Drag overlay */}
                  <div id="dragOverlay" class="hidden absolute inset-0 bg-[#0066FF]/10 border-2 border-dashed border-[#0066FF] rounded-xl flex items-center justify-center z-10 pointer-events-none">
                    <div class="text-center">
                      <i class="fa-solid fa-cloud-arrow-up text-3xl text-[#0066FF] mb-2"></i>
                      <p class="text-[#0066FF] font-bold text-sm">이미지를 여기에 드롭하세요</p>
                    </div>
                  </div>
                </div>
                {/* Upload status bar */}
                <div id="uploadStatus" class="hidden mt-2 px-3 py-2 rounded-lg bg-[#0066FF]/10 border border-[#0066FF]/20">
                  <div class="flex items-center gap-2">
                    <i class="fa-solid fa-spinner fa-spin text-[#0066FF] text-xs"></i>
                    <span id="uploadStatusText" class="text-[#0066FF] text-xs">이미지 업로드 중...</span>
                  </div>
                  <div class="mt-1 h-1 bg-white/5 rounded-full overflow-hidden">
                    <div id="uploadProgressBar" class="h-full bg-[#0066FF] rounded-full transition-all duration-300" style="width:0%"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right — Preview */}
            <div class="hidden lg:block w-1/2 overflow-y-auto bg-white border-l border-white/5">
              <div class="max-w-2xl mx-auto px-8 py-10">
                <div id="prevCoverWrap" class="hidden -mx-8 -mt-10 mb-6">
                  <img id="prevCoverImg" src="" alt="" class="w-full h-48 object-cover" />
                </div>
                <div class="text-xs text-[#0066FF] font-semibold uppercase tracking-wider mb-3" id="prevCategory">치과상식</div>
                <h1 class="text-2xl font-bold text-gray-900 mb-4" id="prevTitle">제목을 입력하세요</h1>
                <div class="flex items-center gap-3 text-xs text-gray-400 mb-8 pb-6 border-b border-gray-100">
                  <span>서울365치과</span>
                  <span>·</span>
                  <span>{new Date().toISOString().split('T')[0]}</span>
                </div>
                <div id="prevContent" class="prose-dental text-[0.92rem] leading-relaxed">
                  <p class="text-gray-400">본문 미리보기가 여기에 표시됩니다...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Gallery Modal */}
      <div id="galleryModal" class="hidden fixed inset-0 z-[70] flex items-center justify-center p-4">
        <div class="fixed inset-0 bg-black/80 backdrop-blur-sm" onclick="closeImageGallery()"></div>
        <div class="relative bg-gray-900 border border-white/10 rounded-2xl w-full max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
          <div class="flex items-center justify-between px-5 py-3 border-b border-white/5">
            <h3 class="text-white font-bold text-sm"><i class="fa-solid fa-photo-film mr-2 text-purple-400"></i>업로드된 이미지</h3>
            <button onclick="closeImageGallery()" class="text-white/30 hover:text-white"><i class="fa-solid fa-xmark"></i></button>
          </div>
          <div id="galleryContent" class="flex-1 overflow-y-auto p-5">
            <div class="text-center py-10 text-white/30"><i class="fa-solid fa-spinner fa-spin mr-2"></i>로딩 중...</div>
          </div>
        </div>
      </div>

      {/* Blog Editor Scripts */}
      <script dangerouslySetInnerHTML={{__html: `
        // ── Editor open/close ─────────────────────────
        function openEditor(data) {
          document.getElementById('editorModal').classList.remove('hidden');
          resetCoverImage();
          if (data) {
            document.getElementById('editorTitle').textContent = '글 수정';
            document.getElementById('postId').value = data.id;
            document.getElementById('postTitle').value = data.title;
            document.getElementById('postCategory').value = data.category || '치과상식';
            document.getElementById('postTreatment').value = data.treatment_slug || '';
            document.getElementById('postTags').value = data.tags || '';
            document.getElementById('postExcerpt').value = data.excerpt || '';
            document.getElementById('postContent').value = data.content || '';
            if (data.cover_image) {
              document.getElementById('postCoverImage').value = data.cover_image;
              document.getElementById('coverPreviewImg').src = data.cover_image;
              document.getElementById('coverPreviewArea').classList.remove('hidden');
              document.getElementById('coverPlaceholder').classList.add('hidden');
              document.getElementById('prevCoverWrap').classList.remove('hidden');
              document.getElementById('prevCoverImg').src = data.cover_image;
            }
            updatePreview();
          } else {
            document.getElementById('editorTitle').textContent = '새 글 작성';
            document.getElementById('postId').value = '';
            document.getElementById('postTitle').value = '';
            document.getElementById('postCategory').value = '치과상식';
            document.getElementById('postTreatment').value = '';
            document.getElementById('postTags').value = '';
            document.getElementById('postExcerpt').value = '';
            document.getElementById('postContent').value = '';
            document.getElementById('postCoverImage').value = '';
            updatePreview();
          }
        }
        function closeEditor() { document.getElementById('editorModal').classList.add('hidden'); }

        // ── Cover Image ────────────────────────────────
        function resetCoverImage() {
          document.getElementById('postCoverImage').value = '';
          document.getElementById('coverPreviewArea').classList.add('hidden');
          document.getElementById('coverPlaceholder').classList.remove('hidden');
          document.getElementById('coverUploading').classList.add('hidden');
          document.getElementById('prevCoverWrap').classList.add('hidden');
        }
        function removeCoverImage() {
          resetCoverImage();
          updatePreview();
        }
        async function uploadCoverImage(input) {
          const file = input.files[0];
          if (!file) return;
          document.getElementById('coverPlaceholder').classList.add('hidden');
          document.getElementById('coverUploading').classList.remove('hidden');
          try {
            const fd = new FormData();
            fd.append('file', file);
            const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
            const json = await res.json();
            if (json.ok) {
              document.getElementById('postCoverImage').value = json.url;
              document.getElementById('coverPreviewImg').src = json.url;
              document.getElementById('coverPreviewArea').classList.remove('hidden');
              document.getElementById('coverUploading').classList.add('hidden');
              document.getElementById('prevCoverWrap').classList.remove('hidden');
              document.getElementById('prevCoverImg').src = json.url;
            } else {
              alert(json.error || '업로드 실패');
              document.getElementById('coverPlaceholder').classList.remove('hidden');
              document.getElementById('coverUploading').classList.add('hidden');
            }
          } catch(e) {
            alert('업로드 오류: ' + e.message);
            document.getElementById('coverPlaceholder').classList.remove('hidden');
            document.getElementById('coverUploading').classList.add('hidden');
          }
          input.value = '';
        }

        // ── Markdown helpers ──────────────────────────
        function insertMd(text) {
          const ta = document.getElementById('postContent');
          const start = ta.selectionStart;
          ta.value = ta.value.substring(0, start) + text + ta.value.substring(start);
          ta.focus();
          ta.selectionStart = ta.selectionEnd = start + text.length;
          updatePreview();
        }
        function wrapMd(before, after) {
          const ta = document.getElementById('postContent');
          const start = ta.selectionStart, end = ta.selectionEnd;
          const selected = ta.value.substring(start, end);
          ta.value = ta.value.substring(0, start) + before + selected + after + ta.value.substring(end);
          ta.focus();
          ta.selectionStart = start + before.length;
          ta.selectionEnd = end + before.length;
          updatePreview();
        }
        function insertImageMd(url, alt) {
          const ta = document.getElementById('postContent');
          const start = ta.selectionStart;
          const imgMd = '\\n\\n![' + (alt||'이미지') + '](' + url + ')\\n\\n';
          ta.value = ta.value.substring(0, start) + imgMd + ta.value.substring(start);
          ta.focus();
          ta.selectionStart = ta.selectionEnd = start + imgMd.length;
          updatePreview();
        }

        // ── Body Image Upload (button) ─────────────────
        async function uploadBodyImages(input) {
          const files = Array.from(input.files);
          if (!files.length) return;
          await uploadFilesToBody(files);
          input.value = '';
        }

        async function uploadFilesToBody(files) {
          const statusEl = document.getElementById('uploadStatus');
          const statusText = document.getElementById('uploadStatusText');
          const progressBar = document.getElementById('uploadProgressBar');
          statusEl.classList.remove('hidden');
          let done = 0;
          const total = files.length;
          statusText.textContent = '이미지 업로드 중... (0/' + total + ')';
          progressBar.style.width = '0%';

          for (const file of files) {
            if (!file.type.startsWith('image/')) continue;
            try {
              const fd = new FormData();
              fd.append('file', file);
              const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
              const json = await res.json();
              if (json.ok) {
                insertImageMd(json.url, file.name.split('.')[0]);
              } else {
                alert(json.error || file.name + ' 업로드 실패');
              }
            } catch(e) {
              alert(file.name + ' 업로드 오류');
            }
            done++;
            statusText.textContent = '이미지 업로드 중... (' + done + '/' + total + ')';
            progressBar.style.width = Math.round(done/total*100) + '%';
          }
          statusText.textContent = done + '개 이미지 업로드 완료!';
          progressBar.style.width = '100%';
          setTimeout(() => { statusEl.classList.add('hidden'); }, 2000);
        }

        // ── Drag & Drop on textarea ────────────────────
        (function() {
          const ta = document.getElementById('postContent');
          const overlay = document.getElementById('dragOverlay');
          if (!ta || !overlay) return;
          let dragCounter = 0;

          ta.addEventListener('dragenter', function(e) {
            e.preventDefault();
            dragCounter++;
            overlay.classList.remove('hidden');
          });
          ta.addEventListener('dragleave', function(e) {
            dragCounter--;
            if (dragCounter <= 0) { overlay.classList.add('hidden'); dragCounter = 0; }
          });
          ta.addEventListener('dragover', function(e) { e.preventDefault(); });
          ta.addEventListener('drop', function(e) {
            e.preventDefault();
            overlay.classList.add('hidden');
            dragCounter = 0;
            const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
            if (files.length) uploadFilesToBody(files);
          });

          // ── Paste image from clipboard ─────────────
          ta.addEventListener('paste', function(e) {
            const items = e.clipboardData?.items;
            if (!items) return;
            const imageFiles = [];
            for (const item of items) {
              if (item.type.startsWith('image/')) {
                const file = item.getAsFile();
                if (file) imageFiles.push(file);
              }
            }
            if (imageFiles.length) {
              e.preventDefault();
              uploadFilesToBody(imageFiles);
            }
          });
        })();

        // ── Preview ────────────────────────────────────
        function updatePreview() {
          const title = document.getElementById('postTitle').value;
          const category = document.getElementById('postCategory').value;
          const content = document.getElementById('postContent').value;
          document.getElementById('prevTitle').textContent = title || '제목을 입력하세요';
          document.getElementById('prevCategory').textContent = category;
          let html = content
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/^### (.+)$/gm, '<h3 class="text-lg font-bold text-gray-900 mt-8 mb-3">$1</h3>')
            .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold text-gray-900 mt-10 mb-4">$1</h2>')
            .replace(/\\*\\*(.+?)\\*\\*/g, '<strong class="font-bold text-gray-900">$1</strong>')
            .replace(/^- (.+)$/gm, '<li class="ml-4 text-gray-600">• $1</li>')
            .replace(/^&gt; (.+)$/gm, '<blockquote class="border-l-4 border-blue-200 pl-4 py-2 my-4 text-gray-500 italic bg-blue-50/50 rounded-r-lg">$1</blockquote>')
            .replace(/^---$/gm, '<hr class="my-8 border-gray-100"/>')
            .replace(/!\\[([^\\]]*)\\]\\(([^)]+)\\)/g, '<img src="$2" alt="$1" class="w-full rounded-xl my-6 shadow-sm" />')
            .replace(/^(?!<[hlubo]|<hr|<li|<img)(.+)$/gm, '<p class="text-gray-600 leading-relaxed mb-4">$1</p>');
          document.getElementById('prevContent').innerHTML = html || '<p class="text-gray-400">본문 미리보기...</p>';
        }

        // ── Image Gallery ─────────────────────────────
        async function openImageGallery() {
          document.getElementById('galleryModal').classList.remove('hidden');
          const el = document.getElementById('galleryContent');
          el.innerHTML = '<div class="text-center py-10 text-white/30"><i class="fa-solid fa-spinner fa-spin mr-2"></i>로딩 중...</div>';
          try {
            const res = await fetch('/api/admin/uploads');
            const json = await res.json();
            if (!json.ok || !json.files.length) {
              el.innerHTML = '<div class="text-center py-10"><p class="text-white/30 text-sm">업로드된 이미지가 없습니다.</p></div>';
              return;
            }
            let html = '<div class="grid grid-cols-3 md:grid-cols-4 gap-3">';
            json.files.forEach(f => {
              const sizeKB = Math.round(f.size/1024);
              html += '<div class="group relative cursor-pointer rounded-xl overflow-hidden border border-white/5 hover:border-[#0066FF]/30 transition" onclick="selectGalleryImage(\\'' + f.url + '\\')">';
              html += '<img src="' + f.url + '" alt="" class="w-full aspect-square object-cover" loading="lazy" />';
              html += '<div class="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition flex items-center justify-center">';
              html += '<i class="fa-solid fa-plus text-white text-xl opacity-0 group-hover:opacity-100 transition"></i>';
              html += '</div>';
              html += '<div class="absolute bottom-0 left-0 right-0 bg-black/60 px-2 py-1 text-[0.6rem] text-white/60">' + sizeKB + 'KB</div>';
              html += '</div>';
            });
            html += '</div>';
            el.innerHTML = html;
          } catch(e) {
            el.innerHTML = '<div class="text-center py-10 text-red-400 text-sm">오류: ' + e.message + '</div>';
          }
        }
        function closeImageGallery() { document.getElementById('galleryModal').classList.add('hidden'); }
        function selectGalleryImage(url) {
          insertImageMd(url, '이미지');
          closeImageGallery();
        }

        // ── Load / Save / Delete ────────────────────
        async function loadPost(id) {
          try {
            const res = await fetch('/api/admin/blog/' + id);
            const json = await res.json();
            if (json.ok) openEditor(json.post);
          } catch(e) { alert('불러오기 실패: ' + e.message); }
        }

        async function savePost(publish) {
          const id = document.getElementById('postId').value;
          const title = document.getElementById('postTitle').value;
          const content = document.getElementById('postContent').value;
          if (!title || !content) { alert('제목과 본문을 입력하세요.'); return; }

          const data = {
            title, content,
            category: document.getElementById('postCategory').value,
            treatment_slug: document.getElementById('postTreatment').value,
            tags: document.getElementById('postTags').value,
            excerpt: document.getElementById('postExcerpt').value,
            cover_image: document.getElementById('postCoverImage').value,
            is_published: publish
          };
          try {
            const url = id ? '/api/admin/blog/' + id : '/api/admin/blog';
            const method = id ? 'PUT' : 'POST';
            const res = await fetch(url, { method, headers:{'Content-Type':'application/json'}, body: JSON.stringify(data) });
            const json = await res.json();
            if (json.ok) { window.location.reload(); }
            else { alert(json.error || '오류'); }
          } catch(e) { alert('저장 실패: ' + e.message); }
        }

        async function deletePost(id) {
          if (!confirm('이 글을 삭제하시겠습니까?')) return;
          try {
            const res = await fetch('/api/admin/blog/' + id, { method: 'DELETE' });
            const json = await res.json();
            if (json.ok) window.location.reload();
            else alert(json.error || '삭제 실패');
          } catch(e) { alert('오류: ' + e.message); }
        }
      `}} />
    </>,
    { title: '블로그 관리 | 서울365치과' }
  )
})

// --- Blog CRUD API ---
blogRoutes.post('/api/admin/blog', async (c) => {
  await initBlogTables(c.env.DB);
  const admin = await getAdminFromCookie(c.env.DB, c.req.header('cookie'));
  if (!admin) return c.json({ ok: false, error: '인증 필요' }, 401);

  const data = await c.req.json();
  const slug = slugify(data.title) + '-' + Date.now().toString(36);
  await c.env.DB.prepare(`
    INSERT INTO blog_posts (slug, title, excerpt, content, category, tags, cover_image, treatment_slug, author_name, is_published)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(slug, data.title, data.excerpt || null, data.content, data.category || '치과상식', data.tags || null, data.cover_image || null, data.treatment_slug || null, '서울365치과', data.is_published ? 1 : 0).run();
  return c.json({ ok: true, slug });
})

blogRoutes.get('/api/admin/blog/:id', async (c) => {
  await initBlogTables(c.env.DB);
  const admin = await getAdminFromCookie(c.env.DB, c.req.header('cookie'));
  if (!admin) return c.json({ ok: false, error: '인증 필요' }, 401);
  const post = await c.env.DB.prepare('SELECT * FROM blog_posts WHERE id = ?').bind(c.req.param('id')).first();
  return post ? c.json({ ok: true, post }) : c.json({ ok: false, error: '없음' }, 404);
})

blogRoutes.put('/api/admin/blog/:id', async (c) => {
  await initBlogTables(c.env.DB);
  const admin = await getAdminFromCookie(c.env.DB, c.req.header('cookie'));
  if (!admin) return c.json({ ok: false, error: '인증 필요' }, 401);
  const data = await c.req.json();
  await c.env.DB.prepare(`
    UPDATE blog_posts SET title=?, excerpt=?, content=?, category=?, tags=?, cover_image=?, treatment_slug=?, is_published=?, updated_at=datetime('now') WHERE id=?
  `).bind(data.title, data.excerpt || null, data.content, data.category || '치과상식', data.tags || null, data.cover_image || null, data.treatment_slug || null, data.is_published ? 1 : 0, c.req.param('id')).run();
  return c.json({ ok: true });
})

blogRoutes.delete('/api/admin/blog/:id', async (c) => {
  await initBlogTables(c.env.DB);
  const admin = await getAdminFromCookie(c.env.DB, c.req.header('cookie'));
  if (!admin) return c.json({ ok: false, error: '인증 필요' }, 401);
  await c.env.DB.prepare('DELETE FROM blog_posts WHERE id = ?').bind(c.req.param('id')).run();
  return c.json({ ok: true });
})

// --- Public Blog Pages ---
blogRoutes.get('/blog', async (c) => {
  await initBlogTables(c.env.DB);
  const category = c.req.query('category');
  let query = 'SELECT id, slug, title, excerpt, category, tags, cover_image, author_name, view_count, created_at FROM blog_posts WHERE is_published = 1';
  const params: any[] = [];
  if (category) { query += ' AND category = ?'; params.push(category); }
  query += ' ORDER BY created_at DESC LIMIT 50';

  let posts: any[] = [];
  try {
    const result = params.length ? await c.env.DB.prepare(query).bind(...params).all() : await c.env.DB.prepare(query).all();
    posts = result.results || [];
  } catch {}

  const categories = ['전체', '치과상식', '임플란트', '교정', '심미치료', '소아치과', '잇몸/외과', '수면진료', '병원소식'];

  return c.render(
    <>
      <section class="treatment-hero">
        <div class="relative z-10 max-w-[1400px] mx-auto px-5 md:px-8 py-28 md:py-36">
          <h1 class="section-headline text-white mb-4 reveal" style="transition-delay:0.4s">서울365치과 블로그</h1>
          <p class="hero-sub text-white/35 reveal" style="transition-delay:0.6s">치아 건강에 대한 전문 정보를 쉽게 알려드립니다.</p>
        </div>
      </section>

      <section class="section-lg bg-mesh">
        <div class="max-w-5xl mx-auto px-5 md:px-8">
          <h2 class="text-xl font-bold text-gray-900 mb-6 reveal">치아 건강 전문 정보</h2>
          {/* Category Filter */}
          <div class="flex flex-wrap gap-2 mb-10 reveal">
            {categories.map(cat => (
              <a href={cat === '전체' ? '/blog' : `/blog?category=${encodeURIComponent(cat)}`}
                 class={`px-4 py-2 rounded-full text-xs font-semibold transition ${(cat === '전체' && !category) || category === cat ? 'bg-[#0066FF] text-white' : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-200'}`}>
                {cat}
              </a>
            ))}
          </div>

          {posts.length === 0 ? (
            <div class="text-center py-20">
              <div class="w-20 h-20 rounded-full bg-[#0066FF]/5 mx-auto mb-6 flex items-center justify-center">
                <i class="fa-solid fa-pen-nib text-3xl text-[#0066FF]/20"></i>
              </div>
              <h2 class="text-lg font-bold text-gray-900 mb-2">아직 작성된 글이 없습니다</h2>
              <p class="text-gray-400 text-sm">곧 유익한 치과 정보를 올려드리겠습니다!</p>
            </div>
          ) : (
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
              {posts.map((post: any) => (
                <a href={`/blog/${post.slug}`} class="premium-card overflow-hidden group hover:shadow-xl transition-all duration-300 tilt-card">
                  <div class="aspect-[16/9] bg-gradient-to-br from-[#0066FF]/5 to-[#00E5FF]/[0.03] flex items-center justify-center">
                    {post.cover_image ? (
                      <img src={post.cover_image} alt={post.title} class="w-full h-full object-cover" />
                    ) : (
                      <i class="fa-solid fa-tooth text-4xl text-[#0066FF]/10"></i>
                    )}
                  </div>
                  <div class="p-5">
                    <div class="flex items-center gap-2 mb-2">
                      <span class="text-[0.65rem] bg-[#0066FF]/8 text-[#0066FF] px-2.5 py-0.5 rounded-full font-semibold">{post.category}</span>
                      <span class="text-[0.6rem] text-gray-300">{post.created_at?.split('T')[0] || post.created_at?.split(' ')[0]}</span>
                    </div>
                    <h3 class="font-bold text-gray-900 group-hover:text-[#0066FF] transition-colors line-clamp-2">{post.title}</h3>
                    {post.excerpt && <p class="text-gray-500 text-[0.82rem] mt-2 line-clamp-2">{post.excerpt}</p>}
                    {post.tags && (
                      <div class="flex flex-wrap gap-1 mt-3">
                        {post.tags.split(',').slice(0, 3).map((tag: string) => (
                          <span class="text-[0.6rem] text-gray-400 bg-gray-50 px-2 py-0.5 rounded">#{tag.trim()}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </section>
    </>,
    {
      title: `서울365치과 블로그${category ? ' - ' + category : ''} | 치아 건강 정보`,
      description: '서울365치과 치과 전문 블로그. 임플란트, 교정, 충치치료, 잇몸치료 등 치아 건강에 대한 전문 정보와 치료 가이드.',
      canonical: 'https://seoul365dc.kr/blog',
      jsonLd: [
        { "@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "홈", "item": "https://seoul365dc.kr" },
          { "@type": "ListItem", "position": 2, "name": "블로그", "item": "https://seoul365dc.kr/blog" }
        ]},
        { "@context": "https://schema.org", "@type": "Blog", "name": "서울365치과 블로그", "description": "치아 건강 전문 정보 블로그", "url": "https://seoul365dc.kr/blog", "publisher": { "@id": "https://seoul365dc.kr/#dentist" }, "inLanguage": "ko-KR",
          "blogPost": posts.slice(0, 10).map((p: any) => ({
            "@type": "BlogPosting", "headline": p.title, "description": p.excerpt || '', "url": `https://seoul365dc.kr/blog/${p.slug}`,
            "datePublished": p.created_at, "author": { "@type": "Organization", "name": "서울365치과" }
          }))
        },
        { "@context": "https://schema.org", "@type": "CollectionPage", "name": "서울365치과 블로그", "url": "https://seoul365dc.kr/blog", "isPartOf": { "@id": "https://seoul365dc.kr/#website" } }
      ]
    }
  )
})

// Blog Detail Page
blogRoutes.get('/blog/:slug', async (c) => {
  await initBlogTables(c.env.DB);
  const slug = c.req.param('slug');
  const post = await c.env.DB.prepare('SELECT * FROM blog_posts WHERE slug = ? AND is_published = 1').bind(slug).first<any>();
  if (!post) return c.notFound();

  // Increment view count
  await c.env.DB.prepare('UPDATE blog_posts SET view_count = view_count + 1 WHERE id = ?').bind(post.id).run();

  // Get related posts
  let related: any[] = [];
  try {
    const r = await c.env.DB.prepare('SELECT slug, title, category, created_at FROM blog_posts WHERE is_published = 1 AND id != ? AND category = ? ORDER BY created_at DESC LIMIT 3').bind(post.id, post.category).all();
    related = r.results || [];
  } catch {}

  const contentHtml = renderContent(post.content);
  const linkedTreatment = post.treatment_slug ? getTreatmentBySlug(post.treatment_slug) : null;
  const tagsArray = post.tags ? post.tags.split(',').map((t: string) => t.trim()) : [];

  // Build TOC from h2 headings
  const h2Matches = post.content.match(/^## (.+)$/gm) || [];
  const toc = h2Matches.map((h: string) => h.replace('## ', ''));

  return c.render(
    <>
      <article class="pt-24 pb-16" itemscope itemtype="https://schema.org/BlogPosting">
        <meta itemprop="datePublished" content={post.created_at} />
        <meta itemprop="dateModified" content={post.updated_at} />
        <meta itemprop="author" content="서울365치과" />

        <div class="max-w-4xl mx-auto px-5 md:px-8">


          {/* Header */}
          <header class="mb-10">
            <span class="text-[0.7rem] bg-[#0066FF]/8 text-[#0066FF] px-3 py-1 rounded-full font-semibold">{post.category}</span>
            <h1 class="text-2xl md:text-3xl font-bold text-gray-900 mt-4 mb-4 leading-tight" itemprop="headline">{post.title}</h1>
            {post.excerpt && <p class="text-gray-500 text-base leading-relaxed" itemprop="description">{post.excerpt}</p>}
            <div class="flex items-center gap-4 mt-6 pt-6 border-t border-gray-100 text-sm text-gray-400">
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-full bg-[#0066FF]/10 flex items-center justify-center">
                  <i class="fa-solid fa-tooth text-[#0066FF] text-xs"></i>
                </div>
                <span class="font-medium text-gray-600" itemprop="author">{post.author_name}</span>
              </div>
              <span>·</span>
              <time>{post.created_at?.split('T')[0] || post.created_at?.split(' ')[0]}</time>
              <span>·</span>
              <span><i class="fa-regular fa-eye mr-1"></i>{post.view_count || 0}</span>
            </div>
          </header>

          <div class="flex gap-10">
            {/* Main Content */}
            <div class="flex-1 min-w-0">
              <div class="text-[0.92rem] leading-relaxed" itemprop="articleBody" dangerouslySetInnerHTML={{__html: contentHtml}} />

              {/* Tags */}
              {tagsArray.length > 0 && (
                <div class="flex flex-wrap gap-2 mt-10 pt-6 border-t border-gray-100">
                  {tagsArray.map((tag: string) => (
                    <span class="text-xs text-gray-400 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">#{tag}</span>
                  ))}
                </div>
              )}

              {/* Linked Treatment */}
              {linkedTreatment && (
                <div class="mt-8 p-5 rounded-2xl bg-[#0066FF]/[0.03] border border-[#0066FF]/10">
                  <div class="flex items-center gap-2 mb-2">
                    <i class="fa-solid fa-link text-[#0066FF] text-xs"></i>
                    <span class="text-xs font-semibold text-[#0066FF]">관련 진료</span>
                  </div>
                  <a href={`/treatments/${linkedTreatment.slug}`} class="text-gray-900 font-bold hover:text-[#0066FF] transition">
                    {linkedTreatment.name} — 자세히 보기 <i class="fa-solid fa-arrow-right text-xs ml-1"></i>
                  </a>
                </div>
              )}

              {/* CTA */}
              <div class="mt-10 p-6 rounded-2xl bg-gradient-to-br from-navy to-navy-lighter text-center">
                <h3 class="text-white font-bold text-lg mb-2">더 궁금한 점이 있으신가요?</h3>
                <p class="text-white/40 text-sm mb-5">서울365치과에서 직접 상담받아 보세요.</p>
                <a href="/reservation" class="btn-premium btn-premium-fill" data-cursor-hover>무료 상담 예약 <i class="fa-solid fa-arrow-right text-xs ml-1"></i></a>
              </div>
            </div>

            {/* Sidebar TOC (Desktop) */}
            {toc.length > 1 && (
              <aside class="hidden lg:block w-56 shrink-0">
                <div class="sticky top-24">
                  <h4 class="text-[0.68rem] font-bold text-gray-400 uppercase tracking-wider mb-3">목차</h4>
                  <nav class="space-y-2">
                    {toc.map((item: string) => (
                      <a href={`#${item}`} class="block text-xs text-gray-400 hover:text-[#0066FF] transition truncate">{item}</a>
                    ))}
                  </nav>
                </div>
              </aside>
            )}
          </div>

          {/* Related Posts */}
          {related.length > 0 && (
            <div class="mt-16 pt-10 border-t border-gray-100">
              <h3 class="text-lg font-bold text-gray-900 mb-6">관련 글</h3>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                {related.map((r: any) => (
                  <a href={`/blog/${r.slug}`} class="glass-card p-5 hover:border-[#0066FF]/20 transition group">
                    <span class="text-[0.6rem] text-[#0066FF] font-semibold">{r.category}</span>
                    <h4 class="font-bold text-gray-900 text-sm mt-1 group-hover:text-[#0066FF] transition line-clamp-2">{r.title}</h4>
                    <p class="text-xs text-gray-400 mt-2">{r.created_at?.split('T')[0] || r.created_at?.split(' ')[0]}</p>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>
    </>,
    {
      title: `${post.title} | 서울365치과 블로그`,
      description: post.excerpt || post.title + ' - 서울365치과 치과 전문 블로그',
      canonical: `https://seoul365dc.kr/blog/${post.slug}`,
      jsonLd: [
        { "@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "홈", "item": "https://seoul365dc.kr" },
          { "@type": "ListItem", "position": 2, "name": "블로그", "item": "https://seoul365dc.kr/blog" },
          { "@type": "ListItem", "position": 3, "name": post.title, "item": `https://seoul365dc.kr/blog/${post.slug}` }
        ]},
        {
          "@context": "https://schema.org", "@type": "BlogPosting",
          "headline": post.title,
          "description": post.excerpt || post.title,
          "datePublished": post.created_at,
          "dateModified": post.updated_at,
          "author": { "@type": "Organization", "name": "서울365치과", "url": "https://seoul365dc.kr" },
          "publisher": { "@id": "https://seoul365dc.kr/#dentist" },
          "mainEntityOfPage": `https://seoul365dc.kr/blog/${post.slug}`,
          "url": `https://seoul365dc.kr/blog/${post.slug}`,
          "inLanguage": "ko-KR",
          "keywords": tagsArray.join(', '),
          "articleSection": post.category,
          ...(linkedTreatment ? { "about": { "@type": "MedicalProcedure", "name": linkedTreatment.name } } : {}),
          "speakable": { "@type": "SpeakableSpecification", "cssSelector": ["h1", "h2", "[itemprop='description']"] },
        },
        ...(linkedTreatment ? [{
          "@context": "https://schema.org", "@type": "MedicalWebPage",
          "about": { "@type": "MedicalCondition", "name": linkedTreatment.name },
          "specialty": "Dentistry", "lastReviewed": post.updated_at,
        }] : []),
      ]
    }
  )
})


export default blogRoutes
