import { Hono } from 'hono'
import type { Bindings } from '../lib/types'
import { treatments, getTreatmentBySlug } from '../data/treatments'
import { getAdminFromCookie, initAdminTables, initBlogTables, renderContent, extractFAQs, extractHeadings, slugify } from '../lib/db'

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
      <div class="fixed top-0 left-0 right-0 z-[10000] bg-gray-900/95 backdrop-blur border-b border-white/5">
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

      {/* Editor Modal — Full screen SEO-optimized */}
      <div id="editorModal" class="hidden fixed inset-0 z-[10001] bg-gray-900">
        <div class="h-full flex flex-col">
          {/* Editor Header */}
          <div class="flex items-center justify-between px-5 py-3 bg-gray-900 border-b border-white/5">
            <div class="flex items-center gap-3">
              <button onclick="closeEditor()" class="text-white/30 hover:text-white transition"><i class="fa-solid fa-arrow-left"></i></button>
              <span id="editorTitle" class="text-white font-bold text-sm">새 글 작성</span>
              <span class="text-white/10">|</span>
              <span id="seoScoreBadge" class="text-[0.65rem] px-2.5 py-0.5 rounded-full font-bold bg-red-500/20 text-red-400">SEO 0점</span>
            </div>
            <div class="flex items-center gap-2">
              <button onclick="toggleSeoPanel()" class="px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 text-xs font-bold transition" title="SEO 분석"><i class="fa-solid fa-chart-line mr-1"></i>SEO</button>
              <button onclick="savePost(0)" class="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 text-xs font-bold transition">초안 저장</button>
              <button onclick="savePost(1)" class="px-4 py-2 rounded-lg bg-[#0066FF] hover:bg-[#0052cc] text-white text-xs font-bold transition">
                <i class="fa-solid fa-paper-plane mr-1"></i>공개 발행
              </button>
            </div>
          </div>

          {/* Editor Body */}
          <div class="flex-1 overflow-hidden flex">
            {/* Left — Form */}
            <div class="w-full lg:w-1/2 overflow-y-auto p-5 space-y-4" id="editorFormArea">
              <input type="hidden" id="postId" value="" />

              {/* Title */}
              <div>
                <label class="block text-white/40 text-xs font-semibold mb-1.5 uppercase">제목 (H1) *</label>
                <input id="postTitle" type="text" placeholder="핵심 키워드를 포함한 제목을 입력하세요 (30~60자 권장)" class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-lg font-bold outline-none focus:border-[#0066FF]/50 placeholder-white/15" oninput="updatePreview(); updateSeoScore()" />
                <div class="flex justify-between mt-1">
                  <span class="text-white/15 text-[0.6rem]">이 제목이 H1 태그로 출력됩니다</span>
                  <span id="titleCharCount" class="text-white/20 text-[0.6rem]">0자</span>
                </div>
              </div>

              {/* Focus Keyword + Category */}
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-white/40 text-xs font-semibold mb-1.5 uppercase">
                    <i class="fa-solid fa-bullseye text-amber-400/60 mr-1"></i>포커스 키워드
                  </label>
                  <input id="postFocusKeyword" type="text" placeholder="예: 임플란트 비용" class="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none text-sm placeholder-white/15" oninput="updateSeoScore()" />
                  <span class="text-white/15 text-[0.55rem]">SEO 점수 기준이 되는 키워드</span>
                </div>
                <div>
                  <label class="block text-white/40 text-xs font-semibold mb-1.5 uppercase">카테고리</label>
                  <select id="postCategory" class="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none text-sm" onchange="updatePreview()">
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
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-white/40 text-xs font-semibold mb-1.5 uppercase">관련 진료</label>
                  <select id="postTreatment" class="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none text-sm">
                    <option value="" class="bg-gray-900">선택안함</option>
                    {treatments.map(t => (
                      <option value={t.slug} class="bg-gray-900">{t.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label class="block text-white/40 text-xs font-semibold mb-1.5 uppercase">태그 (쉼표 구분)</label>
                  <input id="postTags" type="text" placeholder="임플란트, 비용, 수명" class="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none text-sm placeholder-white/15" />
                </div>
              </div>

              {/* Excerpt */}
              <div>
                <label class="block text-white/40 text-xs font-semibold mb-1.5 uppercase">
                  <i class="fa-solid fa-magnifying-glass text-emerald-400/60 mr-1"></i>메타 설명 (검색결과 미리보기)
                </label>
                <textarea id="postExcerpt" rows={2} placeholder="검색결과에 표시될 설명을 입력하세요 (120~160자 권장). 포커스 키워드를 반드시 포함하세요." class="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none text-sm resize-none placeholder-white/15" oninput="updateSeoScore()"></textarea>
                <div class="flex justify-between mt-1">
                  <span id="excerptKeywordHint" class="text-white/15 text-[0.55rem]">포커스 키워드가 포함되어야 합니다</span>
                  <span id="excerptCharCount" class="text-white/20 text-[0.6rem]">0/160자</span>
                </div>
              </div>

              {/* Cover Image Upload */}
              <div>
                <label class="block text-white/40 text-xs font-semibold mb-1.5 uppercase">커버 이미지 (OG이미지)</label>
                <input type="hidden" id="postCoverImage" value="" />
                <div id="coverDropZone" class="relative border-2 border-dashed border-white/10 rounded-xl hover:border-[#0066FF]/30 transition cursor-pointer overflow-hidden"
                     onclick="document.getElementById('coverFileInput').click()">
                  <input type="file" id="coverFileInput" accept="image/*" class="hidden" onchange="uploadCoverImage(this)" />
                  <div id="coverPreviewArea" class="hidden">
                    <img id="coverPreviewImg" src="" alt="" class="w-full h-40 object-cover" />
                    <button type="button" onclick="event.stopPropagation(); removeCoverImage()" class="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-500/80 hover:bg-red-500 text-white flex items-center justify-center transition text-xs"><i class="fa-solid fa-xmark"></i></button>
                  </div>
                  <div id="coverPlaceholder" class="flex items-center justify-center gap-3 py-6 text-white/20">
                    <i class="fa-solid fa-image text-lg"></i>
                    <span class="text-sm">커버 이미지 업로드 (1200x630 권장)</span>
                  </div>
                  <div id="coverUploading" class="hidden flex items-center justify-center gap-2 py-6">
                    <i class="fa-solid fa-spinner fa-spin text-[#0066FF]"></i>
                    <span class="text-[#0066FF] text-sm">업로드 중...</span>
                  </div>
                </div>
              </div>

              {/* Content Editor with Toolbar */}
              <div>
                <div class="flex items-center justify-between mb-1.5">
                  <label class="block text-white/40 text-xs font-semibold uppercase">본문 *</label>
                </div>
                {/* Rich Toolbar */}
                <div class="flex flex-wrap items-center gap-0.5 mb-2 px-2 py-1.5 rounded-xl bg-white/[0.03] border border-white/5">
                  {/* Headings */}
                  <div class="flex items-center gap-0.5 pr-2 border-r border-white/5 mr-1">
                    <button type="button" onclick="insertHeading(2)" class="px-2 py-1 rounded-lg bg-white/5 hover:bg-[#0066FF]/20 text-white/40 hover:text-[#0066FF] transition text-xs font-bold" title="H2 제목 (섹션 구분)">H2</button>
                    <button type="button" onclick="insertHeading(3)" class="px-2 py-1 rounded-lg bg-white/5 hover:bg-[#0066FF]/20 text-white/40 hover:text-[#0066FF] transition text-xs font-bold" title="H3 소제목 (세부 항목)">H3</button>
                    <button type="button" onclick="insertHeading(4)" class="px-2 py-1 rounded-lg bg-white/5 hover:bg-[#0066FF]/20 text-white/40 hover:text-[#0066FF] transition text-xs font-bold" title="H4 소소제목">H4</button>
                  </div>
                  {/* Text format */}
                  <div class="flex items-center gap-0.5 pr-2 border-r border-white/5 mr-1">
                    <button type="button" onclick="wrapMd('**','**')" class="px-2 py-1 rounded-lg hover:bg-white/5 text-white/30 hover:text-white/60 transition text-xs font-bold" title="굵게"><i class="fa-solid fa-bold"></i></button>
                    <button type="button" onclick="wrapMd('*','*')" class="px-2 py-1 rounded-lg hover:bg-white/5 text-white/30 hover:text-white/60 transition text-xs" title="기울임"><i class="fa-solid fa-italic"></i></button>
                    <button type="button" onclick="insertMd('- ')" class="px-2 py-1 rounded-lg hover:bg-white/5 text-white/30 hover:text-white/60 transition text-xs" title="목록"><i class="fa-solid fa-list-ul"></i></button>
                    <button type="button" onclick="insertMd('1. ')" class="px-2 py-1 rounded-lg hover:bg-white/5 text-white/30 hover:text-white/60 transition text-xs" title="번호 목록"><i class="fa-solid fa-list-ol"></i></button>
                    <button type="button" onclick="insertMd('> ')" class="px-2 py-1 rounded-lg hover:bg-white/5 text-white/30 hover:text-white/60 transition text-xs" title="인용/전문가 팁"><i class="fa-solid fa-quote-left"></i></button>
                  </div>
                  {/* Media */}
                  <div class="flex items-center gap-0.5 pr-2 border-r border-white/5 mr-1">
                    <button type="button" onclick="openImageInsert()" class="px-2 py-1 rounded-lg hover:bg-emerald-500/10 text-white/30 hover:text-emerald-400 transition text-xs" title="본문에 이미지 삽입"><i class="fa-solid fa-image mr-1"></i><span class="text-[0.6rem]">이미지</span></button>
                    <button type="button" onclick="openImageGallery()" class="px-2 py-1 rounded-lg hover:bg-purple-500/10 text-white/30 hover:text-purple-400 transition text-xs" title="기존 이미지 선택"><i class="fa-solid fa-photo-film"></i></button>
                    <button type="button" onclick="insertMd('[링크텍스트](URL)')" class="px-2 py-1 rounded-lg hover:bg-white/5 text-white/30 hover:text-white/60 transition text-xs" title="링크"><i class="fa-solid fa-link"></i></button>
                  </div>
                  {/* SEO blocks */}
                  <div class="flex items-center gap-0.5">
                    <button type="button" onclick="insertFAQBlock()" class="px-2 py-1 rounded-lg hover:bg-amber-500/10 text-white/30 hover:text-amber-400 transition text-xs" title="FAQ 블록 (AEO 최적화)"><i class="fa-solid fa-circle-question mr-1"></i><span class="text-[0.6rem]">FAQ</span></button>
                    <button type="button" onclick="insertMd('---\n')" class="px-2 py-1 rounded-lg hover:bg-white/5 text-white/30 hover:text-white/60 transition text-xs" title="구분선"><i class="fa-solid fa-minus"></i></button>
                    <button type="button" onclick="insertCTABlock()" class="px-2 py-1 rounded-lg hover:bg-blue-500/10 text-white/30 hover:text-blue-400 transition text-xs" title="CTA 블록"><i class="fa-solid fa-bullhorn mr-1"></i><span class="text-[0.6rem]">CTA</span></button>
                  </div>
                </div>

                <input type="file" id="bodyImageInput" accept="image/*" multiple class="hidden" onchange="uploadBodyImages(this)" />
                <div class="relative">
                  <textarea id="postContent" rows={20} placeholder={"## 서론\n\n환자분들이 가장 많이 궁금해하시는 내용을 정리했습니다.\n\n![진료실 사진 설명](이미지URL)\n\n## 본론: 핵심 내용\n\n### 1. 첫 번째 포인트\n\n구체적인 내용을 작성하세요.\n\n![관련 이미지 설명](이미지URL)\n\n- 목록 항목 1\n- 목록 항목 2\n\n> 전문가 팁: 꼭 알아야 할 포인트를 강조하세요.\n\n### 2. 두 번째 포인트\n\n내용 사이사이에 이미지를 삽입하세요.\n\n## 자주 묻는 질문\n\n**Q. 비용은 얼마인가요?**\n\nA. 구체적인 답변을 작성하세요.\n\n## 결론\n\n핵심 내용을 요약하세요."} class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white outline-none text-sm font-mono resize-none placeholder-white/10 leading-relaxed" oninput="updatePreview(); updateSeoScore()"></textarea>
                  {/* Drag overlay */}
                  <div id="dragOverlay" class="hidden absolute inset-0 bg-[#0066FF]/10 border-2 border-dashed border-[#0066FF] rounded-xl flex items-center justify-center z-10 pointer-events-none">
                    <div class="text-center">
                      <i class="fa-solid fa-cloud-arrow-up text-3xl text-[#0066FF] mb-2"></i>
                      <p class="text-[#0066FF] font-bold text-sm">이미지를 여기에 드롭하세요</p>
                      <p class="text-[#0066FF]/60 text-xs mt-1">커서 위치에 삽입됩니다</p>
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

                {/* Content Structure Outline */}
                <div id="structureOutline" class="mt-3 px-3 py-2 rounded-xl bg-white/[0.02] border border-white/5">
                  <div class="flex items-center gap-2 mb-2">
                    <i class="fa-solid fa-sitemap text-[#0066FF]/40 text-xs"></i>
                    <span class="text-white/30 text-[0.6rem] font-bold uppercase">글 구조 (H태그 아웃라인)</span>
                  </div>
                  <div id="outlineTree" class="text-[0.7rem] space-y-0.5">
                    <span class="text-white/15">본문을 작성하면 구조가 표시됩니다</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right — Preview + SEO Panel */}
            <div class="hidden lg:block w-1/2 overflow-y-auto border-l border-white/5 relative">
              {/* SEO Score Panel (togglable overlay) */}
              <div id="seoPanel" class="hidden absolute inset-0 z-10 bg-gray-900/98 backdrop-blur overflow-y-auto p-6">
                <div class="flex items-center justify-between mb-6">
                  <h3 class="text-white font-bold text-sm"><i class="fa-solid fa-chart-line mr-2 text-[#0066FF]"></i>SEO/AEO 분석</h3>
                  <button onclick="toggleSeoPanel()" class="text-white/30 hover:text-white"><i class="fa-solid fa-xmark"></i></button>
                </div>
                {/* Score Circle */}
                <div class="text-center mb-6">
                  <div class="inline-flex items-center justify-center w-24 h-24 rounded-full border-4" id="seoScoreCircle" style="border-color:rgba(239,68,68,0.3)">
                    <span id="seoScoreNum" class="text-3xl font-black text-red-400">0</span>
                  </div>
                  <p id="seoScoreLabel" class="text-white/30 text-xs mt-2">작성을 시작하세요</p>
                </div>
                {/* Checklist */}
                <div id="seoChecklist" class="space-y-2 text-sm">
                  {/* Populated by JS */}
                </div>
              </div>

              {/* Preview Area */}
              <div class="bg-white h-full overflow-y-auto" id="previewArea">
                <div class="max-w-2xl mx-auto px-8 py-10">
                  {/* Google Search Preview */}
                  <div class="mb-8 p-4 rounded-xl bg-gray-50 border border-gray-100">
                    <p class="text-[0.6rem] text-gray-400 uppercase font-bold mb-2"><i class="fa-brands fa-google mr-1"></i>구글 검색 미리보기</p>
                    <p class="text-[#1a0dab] text-base font-medium leading-snug truncate" id="googleTitle">제목을 입력하세요 | 서울365치과 블로그</p>
                    <p class="text-[0.7rem] text-[#006621] mt-0.5">https://seoul365dc.kr/blog/...</p>
                    <p class="text-[0.78rem] text-[#545454] mt-1 line-clamp-2" id="googleDesc">메타 설명을 입력하세요. 검색결과에 이 내용이 표시됩니다.</p>
                  </div>

                  <div id="prevCoverWrap" class="hidden -mx-8 -mt-2 mb-6">
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
      </div>

      {/* Image Insert Modal — with ALT tag input */}
      <div id="imageInsertModal" class="hidden fixed inset-0 z-[10002] flex items-center justify-center p-4">
        <div class="fixed inset-0 bg-black/80 backdrop-blur-sm" onclick="closeImageInsert()"></div>
        <div class="relative bg-gray-900 border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden">
          <div class="px-5 py-4 border-b border-white/5">
            <h3 class="text-white font-bold text-sm"><i class="fa-solid fa-image mr-2 text-emerald-400"></i>본문 이미지 삽입</h3>
            <p class="text-white/30 text-xs mt-1">SEO를 위해 alt 텍스트(이미지 설명)를 반드시 입력하세요</p>
          </div>
          <div class="p-5 space-y-4">
            {/* Upload area */}
            <div id="imgInsertDropZone" class="border-2 border-dashed border-white/10 rounded-xl hover:border-emerald-400/30 transition cursor-pointer p-8 text-center"
                 onclick="document.getElementById('imgInsertFileInput').click()">
              <input type="file" id="imgInsertFileInput" accept="image/*" class="hidden" onchange="handleImageInsertFile(this)" />
              <div id="imgInsertPlaceholder">
                <i class="fa-solid fa-cloud-arrow-up text-3xl text-white/15 mb-3"></i>
                <p class="text-white/30 text-sm">클릭하거나 드래그하여 이미지를 업로드</p>
                <p class="text-white/15 text-xs mt-1">JPG, PNG, WebP (최대 5MB)</p>
              </div>
              <div id="imgInsertPreviewArea" class="hidden">
                <img id="imgInsertPreview" src="" alt="" class="max-h-40 mx-auto rounded-lg" />
              </div>
              <div id="imgInsertUploading" class="hidden">
                <i class="fa-solid fa-spinner fa-spin text-emerald-400 text-2xl mb-2"></i>
                <p class="text-emerald-400 text-sm">업로드 중...</p>
              </div>
            </div>
            <input type="hidden" id="imgInsertUrl" value="" />

            {/* Alt text - REQUIRED */}
            <div>
              <label class="block text-white/50 text-xs font-semibold mb-1.5">
                <i class="fa-solid fa-tag text-amber-400 mr-1"></i>이미지 설명 (alt 텍스트) <span class="text-red-400">*필수</span>
              </label>
              <input id="imgInsertAlt" type="text" placeholder="예: 임플란트 시술 전후 비교 사진" class="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none text-sm placeholder-white/20" />
              <p class="text-white/20 text-[0.6rem] mt-1"><i class="fa-solid fa-lightbulb text-amber-400/40 mr-1"></i>검색엔진이 이미지를 이해하는 데 사용됩니다. 구체적으로 작성하세요.</p>
            </div>

            {/* Caption (optional) */}
            <div>
              <label class="block text-white/50 text-xs font-semibold mb-1.5">캡션 (선택)</label>
              <input id="imgInsertCaption" type="text" placeholder="이미지 아래에 표시될 설명" class="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none text-sm placeholder-white/20" />
            </div>

            <div class="flex gap-2">
              <button onclick="closeImageInsert()" class="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/40 text-sm font-bold transition">취소</button>
              <button id="imgInsertConfirmBtn" onclick="confirmImageInsert()" disabled class="flex-1 py-2.5 rounded-xl bg-emerald-500/20 text-emerald-400/40 text-sm font-bold cursor-not-allowed transition">
                <i class="fa-solid fa-check mr-1"></i>삽입
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Image Gallery Modal */}
      <div id="galleryModal" class="hidden fixed inset-0 z-[10002] flex items-center justify-center p-4">
        <div class="fixed inset-0 bg-black/80 backdrop-blur-sm" onclick="closeImageGallery()"></div>
        <div class="relative bg-gray-900 border border-white/10 rounded-2xl w-full max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
          <div class="flex items-center justify-between px-5 py-3 border-b border-white/5">
            <h3 class="text-white font-bold text-sm"><i class="fa-solid fa-photo-film mr-2 text-purple-400"></i>업로드된 이미지</h3>
            <button onclick="closeImageGallery()" class="text-white/30 hover:text-white"><i class="fa-solid fa-xmark"></i></button>
          </div>
          <div class="p-3 border-b border-white/5">
            <p class="text-white/30 text-xs"><i class="fa-solid fa-info-circle mr-1"></i>클릭하면 alt 텍스트 입력 후 본문에 삽입됩니다</p>
          </div>
          <div id="galleryContent" class="flex-1 overflow-y-auto p-5">
            <div class="text-center py-10 text-white/30"><i class="fa-solid fa-spinner fa-spin mr-2"></i>로딩 중...</div>
          </div>
        </div>
      </div>

      {/* Blog Editor Scripts — SEO-optimized */}
      <script dangerouslySetInnerHTML={{__html: `
        // ── Hide interfering layout elements ─────
        (function hideLayoutForAdmin() {
          var pl = document.getElementById('preloader');
          if (pl) { pl.classList.add('hidden'); pl.style.display = 'none'; }
          var mh = document.getElementById('main-header');
          if (mh) mh.style.display = 'none';
          document.querySelectorAll('footer, .mobile-cta-bar').forEach(function(el) { el.style.display = 'none'; });
          document.querySelectorAll('.floating-btn').forEach(function(el) { el.parentElement.style.display = 'none'; });
          var cd = document.getElementById('cursor-dot'); if (cd) cd.style.display = 'none';
          var cr = document.getElementById('cursor-ring'); if (cr) cr.style.display = 'none';
          document.body.style.cursor = 'auto';
          var sp = document.getElementById('scroll-progress'); if (sp) sp.style.display = 'none';
          document.body.style.overflow = 'auto';
        })();

        // ── Editor open/close ─────────────────────────
        function openEditor(data) {
          document.getElementById('editorModal').classList.remove('hidden');
          document.body.style.overflow = 'hidden';
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
            document.getElementById('postFocusKeyword').value = data.focus_keyword || '';
            if (data.cover_image) {
              document.getElementById('postCoverImage').value = data.cover_image;
              document.getElementById('coverPreviewImg').src = data.cover_image;
              document.getElementById('coverPreviewArea').classList.remove('hidden');
              document.getElementById('coverPlaceholder').classList.add('hidden');
              document.getElementById('prevCoverWrap').classList.remove('hidden');
              document.getElementById('prevCoverImg').src = data.cover_image;
            }
            updatePreview(); updateSeoScore();
          } else {
            document.getElementById('editorTitle').textContent = '새 글 작성';
            document.getElementById('postId').value = '';
            document.getElementById('postTitle').value = '';
            document.getElementById('postCategory').value = '치과상식';
            document.getElementById('postTreatment').value = '';
            document.getElementById('postTags').value = '';
            document.getElementById('postExcerpt').value = '';
            document.getElementById('postContent').value = '';
            document.getElementById('postFocusKeyword').value = '';
            document.getElementById('postCoverImage').value = '';
            updatePreview(); updateSeoScore();
          }
        }
        function closeEditor() {
          document.getElementById('editorModal').classList.add('hidden');
          document.getElementById('seoPanel').classList.add('hidden');
          document.body.style.overflow = 'auto';
        }

        // ── SEO Panel Toggle ──────────────────────────
        function toggleSeoPanel() {
          var p = document.getElementById('seoPanel');
          p.classList.toggle('hidden');
          if (!p.classList.contains('hidden')) updateSeoScore();
        }

        // ── SEO Score Engine ──────────────────────────
        function updateSeoScore() {
          var title = (document.getElementById('postTitle').value || '').trim();
          var content = (document.getElementById('postContent').value || '').trim();
          var excerpt = (document.getElementById('postExcerpt').value || '').trim();
          var keyword = (document.getElementById('postFocusKeyword').value || '').trim();
          var coverImg = document.getElementById('postCoverImage').value;

          // Character counts
          document.getElementById('titleCharCount').textContent = title.length + '자';
          document.getElementById('excerptCharCount').textContent = excerpt.length + '/160자';

          var checks = [];
          var score = 0;
          var total = 0;

          // 1. Title (10pts)
          total += 10;
          var titleOk = title.length >= 20 && title.length <= 70;
          if (titleOk) score += 10;
          checks.push({pass: titleOk, label: '제목 길이 (20~70자)', detail: title.length + '자 — ' + (titleOk ? '적절함' : title.length < 20 ? '너무 짧음' : '너무 김')});

          // 2. Title contains keyword (10pts)
          total += 10;
          var titleHasKw = keyword && title.toLowerCase().includes(keyword.toLowerCase());
          if (titleHasKw) score += 10;
          checks.push({pass: titleHasKw, label: '제목에 포커스 키워드 포함', detail: keyword ? (titleHasKw ? '포함됨' : '미포함') : '키워드를 입력하세요'});

          // 3. Meta description (10pts)
          total += 10;
          var excerptOk = excerpt.length >= 80 && excerpt.length <= 160;
          if (excerptOk) score += 10;
          checks.push({pass: excerptOk, label: '메타 설명 (80~160자)', detail: excerpt.length + '자 — ' + (excerptOk ? '적절함' : excerpt.length < 80 ? '너무 짧음' : '너무 김')});

          // 4. Meta has keyword (5pts)
          total += 5;
          var excerptHasKw = keyword && excerpt.toLowerCase().includes(keyword.toLowerCase());
          if (excerptHasKw) score += 5;
          checks.push({pass: excerptHasKw, label: '메타 설명에 키워드 포함', detail: excerptHasKw ? '포함됨' : '미포함'});

          // 5. H2 headings (15pts)
          total += 15;
          var h2s = (content.match(/^## .+$/gm) || []);
          var h2ok = h2s.length >= 2;
          if (h2ok) score += 15;
          checks.push({pass: h2ok, label: 'H2 제목 2개 이상', detail: h2s.length + '개 — ' + (h2ok ? '구조 좋음' : '섹션을 더 나누세요')});

          // 6. H3 headings (5pts)
          total += 5;
          var h3s = (content.match(/^### .+$/gm) || []);
          var h3ok = h3s.length >= 1;
          if (h3ok) score += 5;
          checks.push({pass: h3ok, label: 'H3 소제목 사용', detail: h3s.length + '개'});

          // 7. Content length (15pts)
          total += 15;
          var plainText = content.replace(/^#+\\s.+$/gm,'').replace(/!\\[[^\\]]*\\]\\([^)]+\\)/g,'').replace(/[\\[\\]()#*>-]/g,'').trim();
          var charCount = plainText.replace(/\\s/g,'').length;
          var contentOk = charCount >= 800;
          if (contentOk) score += 15;
          checks.push({pass: contentOk, label: '본문 길이 (800자 이상)', detail: charCount + '자 — ' + (contentOk ? '충분함' : '더 작성하세요')});

          // 8. Images in body (10pts)
          total += 10;
          var imgs = (content.match(/!\\[[^\\]]*\\]\\([^)]+\\)/g) || []);
          var imgOk = imgs.length >= 1;
          if (imgOk) score += 10;
          checks.push({pass: imgOk, label: '본문에 이미지 포함', detail: imgs.length + '개 — ' + (imgOk ? '좋음' : '이미지를 추가하세요')});

          // 9. Image alt tags (10pts)
          total += 10;
          var imgAlts = imgs.map(function(m){ var match = m.match(/!\\[([^\\]]*)\\]/); return match ? match[1] : ''; });
          var emptyAlts = imgAlts.filter(function(a){ return !a || a === '이미지'; });
          var altOk = imgs.length > 0 && emptyAlts.length === 0;
          if (altOk) score += 10; else if (imgs.length > 0 && emptyAlts.length < imgs.length) score += 5;
          checks.push({pass: altOk, label: '이미지 alt 텍스트 작성', detail: imgs.length === 0 ? '이미지 없음' : (imgs.length - emptyAlts.length) + '/' + imgs.length + ' 작성됨'});

          // 10. Cover image (5pts)
          total += 5;
          var coverOk = !!coverImg;
          if (coverOk) score += 5;
          checks.push({pass: coverOk, label: '커버 이미지(OG) 설정', detail: coverOk ? '설정됨' : '미설정'});

          // 11. Keyword in content (5pts)
          total += 5;
          var kwInContent = keyword && content.toLowerCase().includes(keyword.toLowerCase());
          if (kwInContent) score += 5;
          checks.push({pass: kwInContent, label: '본문에 키워드 포함', detail: kwInContent ? '포함됨' : '미포함'});

          var pct = Math.round(score / total * 100);

          // Update badge
          var badge = document.getElementById('seoScoreBadge');
          badge.textContent = 'SEO ' + pct + '점';
          if (pct >= 80) { badge.className = 'text-[0.65rem] px-2.5 py-0.5 rounded-full font-bold bg-emerald-500/20 text-emerald-400'; }
          else if (pct >= 50) { badge.className = 'text-[0.65rem] px-2.5 py-0.5 rounded-full font-bold bg-amber-500/20 text-amber-400'; }
          else { badge.className = 'text-[0.65rem] px-2.5 py-0.5 rounded-full font-bold bg-red-500/20 text-red-400'; }

          // Update panel
          var circle = document.getElementById('seoScoreCircle');
          var num = document.getElementById('seoScoreNum');
          var label = document.getElementById('seoScoreLabel');
          if (num) {
            num.textContent = pct;
            if (pct >= 80) { num.className = 'text-3xl font-black text-emerald-400'; circle.style.borderColor = 'rgba(52,211,153,0.3)'; label.textContent = '우수! 발행해도 좋습니다'; }
            else if (pct >= 50) { num.className = 'text-3xl font-black text-amber-400'; circle.style.borderColor = 'rgba(251,191,36,0.3)'; label.textContent = '보통 — 개선하면 더 좋아요'; }
            else { num.className = 'text-3xl font-black text-red-400'; circle.style.borderColor = 'rgba(239,68,68,0.3)'; label.textContent = '개선 필요'; }
          }

          // Update checklist
          var cl = document.getElementById('seoChecklist');
          if (cl) {
            cl.innerHTML = checks.map(function(c) {
              var icon = c.pass ? '<i class="fa-solid fa-circle-check text-emerald-400"></i>' : '<i class="fa-regular fa-circle text-white/15"></i>';
              var textColor = c.pass ? 'text-white/60' : 'text-white/30';
              return '<div class="flex items-start gap-3 py-2 px-3 rounded-lg ' + (c.pass ? 'bg-emerald-500/5' : 'bg-white/[0.02]') + '">' + icon + '<div class="flex-1"><p class="text-xs font-medium ' + textColor + '">' + c.label + '</p><p class="text-[0.65rem] text-white/20 mt-0.5">' + c.detail + '</p></div></div>';
            }).join('');
          }

          // Update structure outline
          updateOutline(content);
          // Update Google preview
          var gt = document.getElementById('googleTitle');
          var gd = document.getElementById('googleDesc');
          if (gt) gt.textContent = (title || '제목을 입력하세요') + ' | 서울365치과 블로그';
          if (gd) gd.textContent = excerpt || '메타 설명을 입력하세요. 검색결과에 이 내용이 표시됩니다.';
          // Excerpt keyword hint
          var ekh = document.getElementById('excerptKeywordHint');
          if (ekh && keyword) {
            if (excerpt.toLowerCase().includes(keyword.toLowerCase())) {
              ekh.innerHTML = '<i class="fa-solid fa-check text-emerald-400 mr-1"></i><span class="text-emerald-400/60">키워드 포함됨</span>';
            } else {
              ekh.innerHTML = '<i class="fa-solid fa-exclamation-triangle text-amber-400 mr-1"></i><span class="text-amber-400/60">포커스 키워드를 포함하세요</span>';
            }
          }
        }

        // ── Structure Outline (H-tag tree) ──────────────
        function updateOutline(content) {
          var tree = document.getElementById('outlineTree');
          if (!tree) return;
          var lines = content.split('\\n');
          var items = [];
          lines.forEach(function(line) {
            var m4 = line.match(/^#### (.+)$/);
            var m3 = line.match(/^### (.+)$/);
            var m2 = line.match(/^## (.+)$/);
            if (m2) items.push({level:2, text:m2[1]});
            else if (m3) items.push({level:3, text:m3[1]});
            else if (m4) items.push({level:4, text:m4[1]});
          });
          if (!items.length) { tree.innerHTML = '<span class="text-white/15">H2, H3 태그를 추가하면 구조가 표시됩니다</span>'; return; }
          tree.innerHTML = items.map(function(it) {
            var indent = (it.level - 2) * 12;
            var color = it.level === 2 ? 'text-[#0066FF]' : it.level === 3 ? 'text-cyan-400/60' : 'text-white/25';
            var tag = '<span class="text-white/15 text-[0.55rem] mr-1">H' + it.level + '</span>';
            return '<div style="padding-left:' + indent + 'px" class="' + color + ' truncate">' + tag + it.text + '</div>';
          }).join('');
        }

        // ── Cover Image ────────────────────────────────
        function resetCoverImage() {
          document.getElementById('postCoverImage').value = '';
          document.getElementById('coverPreviewArea').classList.add('hidden');
          document.getElementById('coverPlaceholder').classList.remove('hidden');
          document.getElementById('coverUploading').classList.add('hidden');
          document.getElementById('prevCoverWrap').classList.add('hidden');
        }
        function removeCoverImage() { resetCoverImage(); updatePreview(); updateSeoScore(); }
        async function uploadCoverImage(input) {
          var file = input.files[0]; if (!file) return;
          document.getElementById('coverPlaceholder').classList.add('hidden');
          document.getElementById('coverUploading').classList.remove('hidden');
          try {
            var fd = new FormData(); fd.append('file', file);
            var res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
            var json = await res.json();
            if (json.ok) {
              document.getElementById('postCoverImage').value = json.url;
              document.getElementById('coverPreviewImg').src = json.url;
              document.getElementById('coverPreviewArea').classList.remove('hidden');
              document.getElementById('coverUploading').classList.add('hidden');
              document.getElementById('prevCoverWrap').classList.remove('hidden');
              document.getElementById('prevCoverImg').src = json.url;
              updateSeoScore();
            } else { alert(json.error||'업로드 실패'); document.getElementById('coverPlaceholder').classList.remove('hidden'); document.getElementById('coverUploading').classList.add('hidden'); }
          } catch(e) { alert('오류:'+e.message); document.getElementById('coverPlaceholder').classList.remove('hidden'); document.getElementById('coverUploading').classList.add('hidden'); }
          input.value = '';
        }

        // ── Heading insert with smart newlines ──────────
        function insertHeading(level) {
          var ta = document.getElementById('postContent');
          var start = ta.selectionStart;
          var before = ta.value.substring(0, start);
          var after = ta.value.substring(start);
          var prefix = '#'.repeat(level) + ' ';
          var needNewline = before.length > 0 && !before.endsWith('\\n\\n');
          var prepend = needNewline ? (before.endsWith('\\n') ? '\\n' : '\\n\\n') : '';
          ta.value = before + prepend + prefix + after;
          ta.focus();
          var pos = before.length + prepend.length + prefix.length;
          ta.selectionStart = ta.selectionEnd = pos;
          updatePreview(); updateSeoScore();
        }

        // ── Markdown helpers ──────────────────────────
        function insertMd(text) {
          var ta = document.getElementById('postContent');
          var start = ta.selectionStart;
          ta.value = ta.value.substring(0, start) + text + ta.value.substring(start);
          ta.focus();
          ta.selectionStart = ta.selectionEnd = start + text.length;
          updatePreview(); updateSeoScore();
        }
        function wrapMd(before, after) {
          var ta = document.getElementById('postContent');
          var start = ta.selectionStart, end = ta.selectionEnd;
          var selected = ta.value.substring(start, end);
          ta.value = ta.value.substring(0, start) + before + selected + after + ta.value.substring(end);
          ta.focus();
          ta.selectionStart = start + before.length;
          ta.selectionEnd = end + before.length;
          updatePreview(); updateSeoScore();
        }

        // ── FAQ Block Insert ──────────────────────────
        function insertFAQBlock() {
          var block = '\\n\\n## 자주 묻는 질문\\n\\n**Q. 질문을 입력하세요?**\\n\\nA. 답변을 작성하세요.\\n\\n**Q. 두 번째 질문?**\\n\\nA. 답변을 작성하세요.\\n\\n';
          insertMd(block);
        }
        function insertCTABlock() {
          var block = '\\n\\n> 더 궁금한 점이 있으신가요? [서울365치과에서 무료 상담받기](/reservation)\\n\\n';
          insertMd(block);
        }

        // ── Image Insert Modal (with ALT enforcement) ──────
        function openImageInsert() {
          document.getElementById('imageInsertModal').classList.remove('hidden');
          document.getElementById('imgInsertUrl').value = '';
          document.getElementById('imgInsertAlt').value = '';
          document.getElementById('imgInsertCaption').value = '';
          document.getElementById('imgInsertPlaceholder').classList.remove('hidden');
          document.getElementById('imgInsertPreviewArea').classList.add('hidden');
          document.getElementById('imgInsertUploading').classList.add('hidden');
          updateInsertBtn();
        }
        function closeImageInsert() { document.getElementById('imageInsertModal').classList.add('hidden'); }

        function updateInsertBtn() {
          var url = document.getElementById('imgInsertUrl').value;
          var alt = document.getElementById('imgInsertAlt').value.trim();
          var btn = document.getElementById('imgInsertConfirmBtn');
          if (url && alt) {
            btn.disabled = false;
            btn.className = 'flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold transition cursor-pointer';
          } else {
            btn.disabled = true;
            btn.className = 'flex-1 py-2.5 rounded-xl bg-emerald-500/20 text-emerald-400/40 text-sm font-bold cursor-not-allowed transition';
          }
        }
        document.getElementById('imgInsertAlt')?.addEventListener('input', updateInsertBtn);

        async function handleImageInsertFile(input) {
          var file = input.files[0]; if (!file) return;
          document.getElementById('imgInsertPlaceholder').classList.add('hidden');
          document.getElementById('imgInsertUploading').classList.remove('hidden');
          try {
            var fd = new FormData(); fd.append('file', file);
            var res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
            var json = await res.json();
            if (json.ok) {
              document.getElementById('imgInsertUrl').value = json.url;
              document.getElementById('imgInsertPreview').src = json.url;
              document.getElementById('imgInsertPreviewArea').classList.remove('hidden');
              document.getElementById('imgInsertUploading').classList.add('hidden');
              // Auto-suggest alt from filename
              if (!document.getElementById('imgInsertAlt').value) {
                document.getElementById('imgInsertAlt').value = file.name.split('.')[0].replace(/[-_]/g,' ');
              }
              document.getElementById('imgInsertAlt').focus();
              updateInsertBtn();
            } else { alert(json.error||'실패'); document.getElementById('imgInsertPlaceholder').classList.remove('hidden'); document.getElementById('imgInsertUploading').classList.add('hidden'); }
          } catch(e) { alert('오류:'+e.message); document.getElementById('imgInsertPlaceholder').classList.remove('hidden'); document.getElementById('imgInsertUploading').classList.add('hidden'); }
          input.value = '';
        }

        function confirmImageInsert() {
          var url = document.getElementById('imgInsertUrl').value;
          var alt = document.getElementById('imgInsertAlt').value.trim();
          var caption = document.getElementById('imgInsertCaption').value.trim();
          if (!url || !alt) { alert('이미지와 alt 텍스트를 입력하세요.'); return; }
          var ta = document.getElementById('postContent');
          var start = ta.selectionStart;
          var before = ta.value.substring(0, start);
          var after = ta.value.substring(start);
          var imgText = alt;
          if (caption) imgText = caption;
          var md = '\\n\\n![' + imgText + '](' + url + ')\\n\\n';
          ta.value = before + md + after;
          ta.focus();
          ta.selectionStart = ta.selectionEnd = before.length + md.length;
          closeImageInsert();
          updatePreview(); updateSeoScore();
        }

        // ── Body Image Upload (drag/drop/paste → opens modal) ──
        async function uploadBodyImages(input) {
          var files = Array.from(input.files);
          if (!files.length) return;
          await uploadFilesToBody(files);
          input.value = '';
        }

        async function uploadFilesToBody(files) {
          var statusEl = document.getElementById('uploadStatus');
          var statusText = document.getElementById('uploadStatusText');
          var progressBar = document.getElementById('uploadProgressBar');
          statusEl.classList.remove('hidden');
          var done = 0, total = files.length;
          statusText.textContent = '이미지 업로드 중... (0/' + total + ')';
          progressBar.style.width = '0%';
          for (var i = 0; i < files.length; i++) {
            var file = files[i];
            if (!file.type.startsWith('image/')) continue;
            try {
              var fd = new FormData(); fd.append('file', file);
              var res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
              var json = await res.json();
              if (json.ok) {
                // Open the image insert modal for each uploaded image so user can add alt
                document.getElementById('imgInsertUrl').value = json.url;
                document.getElementById('imgInsertPreview').src = json.url;
                document.getElementById('imgInsertPlaceholder').classList.add('hidden');
                document.getElementById('imgInsertPreviewArea').classList.remove('hidden');
                document.getElementById('imgInsertUploading').classList.add('hidden');
                document.getElementById('imgInsertAlt').value = file.name.split('.')[0].replace(/[-_]/g,' ');
                document.getElementById('imgInsertCaption').value = '';
                document.getElementById('imageInsertModal').classList.remove('hidden');
                updateInsertBtn();
              }
            } catch(e) { alert(file.name + ' 오류'); }
            done++;
            statusText.textContent = done + '/' + total + ' 완료';
            progressBar.style.width = Math.round(done/total*100) + '%';
          }
          setTimeout(function(){ statusEl.classList.add('hidden'); }, 1500);
        }

        // ── Drag & Drop on textarea ────────────────────
        (function() {
          var ta = document.getElementById('postContent');
          var overlay = document.getElementById('dragOverlay');
          if (!ta || !overlay) return;
          var dragCounter = 0;
          ta.addEventListener('dragenter', function(e) { e.preventDefault(); dragCounter++; overlay.classList.remove('hidden'); });
          ta.addEventListener('dragleave', function(e) { dragCounter--; if (dragCounter<=0){overlay.classList.add('hidden');dragCounter=0;} });
          ta.addEventListener('dragover', function(e) { e.preventDefault(); });
          ta.addEventListener('drop', function(e) {
            e.preventDefault(); overlay.classList.add('hidden'); dragCounter=0;
            var files = Array.from(e.dataTransfer.files).filter(function(f){return f.type.startsWith('image/');});
            if (files.length) uploadFilesToBody(files);
          });
          ta.addEventListener('paste', function(e) {
            var items = e.clipboardData?.items; if(!items) return;
            var imgs = [];
            for (var i=0;i<items.length;i++) { if(items[i].type.startsWith('image/')){var f=items[i].getAsFile();if(f)imgs.push(f);} }
            if(imgs.length){e.preventDefault();uploadFilesToBody(imgs);}
          });
        })();

        // ── Preview ────────────────────────────────────
        function updatePreview() {
          var title = document.getElementById('postTitle').value;
          var category = document.getElementById('postCategory').value;
          var content = document.getElementById('postContent').value;
          document.getElementById('prevTitle').textContent = title || '제목을 입력하세요';
          document.getElementById('prevCategory').textContent = category;
          var html = content
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/!\\[([^\\]]*)\\]\\(([^)]+)\\)/g, function(_,alt,url){
              var cap = alt && alt !== '이미지' ? '<figcaption class="text-center text-xs text-gray-400 mt-2">'+alt+'</figcaption>' : '';
              return '<figure class="my-6"><img src="'+url+'" alt="'+alt+'" class="w-full rounded-xl shadow-sm" />'+cap+'</figure>';
            })
            .replace(/\\[([^\\]]+)\\]\\(([^)]+)\\)/g, '<a href="$2" class="text-[#0066FF] underline">$1</a>')
            .replace(/^#### (.+)$/gm, '<h4 class="text-base font-bold text-gray-800 mt-6 mb-2">$1</h4>')
            .replace(/^### (.+)$/gm, '<h3 class="text-lg font-bold text-gray-900 mt-8 mb-3">$1</h3>')
            .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold text-gray-900 mt-10 mb-4 pb-2 border-b border-gray-100">$1</h2>')
            .replace(/\\*\\*(.+?)\\*\\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')
            .replace(/\\*(.+?)\\*/g, '<em>$1</em>')
            .replace(/^\\d+\\. (.+)$/gm, '<li class="ml-4 text-gray-600 list-decimal">$1</li>')
            .replace(/^- (.+)$/gm, '<li class="ml-4 text-gray-600">$1</li>')
            .replace(/^&gt; (.+)$/gm, '<blockquote class="border-l-4 border-[#0066FF]/20 pl-4 py-2 my-4 text-gray-500 italic bg-[#0066FF]/[0.03] rounded-r-lg">$1</blockquote>')
            .replace(/^---$/gm, '<hr class="my-8 border-gray-100"/>')
            .replace(/^(?!<[hulfba]|<hr|<li|<strong|<em|<img|<figure)(.+)$/gm, '<p class="text-gray-600 leading-relaxed mb-4">$1</p>')
            .replace(/<p class="text-gray-600 leading-relaxed mb-4"><\\/p>/g, '');
          document.getElementById('prevContent').innerHTML = html || '<p class="text-gray-400">본문 미리보기...</p>';
        }

        // ── Image Gallery ─────────────────────────────
        async function openImageGallery() {
          document.getElementById('galleryModal').classList.remove('hidden');
          var el = document.getElementById('galleryContent');
          el.innerHTML = '<div class="text-center py-10 text-white/30"><i class="fa-solid fa-spinner fa-spin mr-2"></i>로딩 중...</div>';
          try {
            var res = await fetch('/api/admin/uploads');
            var json = await res.json();
            if (!json.ok || !json.files.length) { el.innerHTML = '<div class="text-center py-10"><p class="text-white/30 text-sm">업로드된 이미지가 없습니다.</p></div>'; return; }
            var html = '<div class="grid grid-cols-3 md:grid-cols-4 gap-3">';
            json.files.forEach(function(f) {
              html += '<div class="group relative cursor-pointer rounded-xl overflow-hidden border border-white/5 hover:border-emerald-400/30 transition" onclick="selectGalleryImage(\\''+f.url+'\\')">';
              html += '<img src="'+f.url+'" alt="" class="w-full aspect-square object-cover" loading="lazy" />';
              html += '<div class="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition flex items-center justify-center"><i class="fa-solid fa-plus text-white text-xl opacity-0 group-hover:opacity-100 transition"></i></div>';
              html += '</div>';
            });
            html += '</div>';
            el.innerHTML = html;
          } catch(e) { el.innerHTML = '<div class="text-center py-10 text-red-400 text-sm">오류: '+e.message+'</div>'; }
        }
        function closeImageGallery() { document.getElementById('galleryModal').classList.add('hidden'); }
        function selectGalleryImage(url) {
          closeImageGallery();
          // Open image insert modal with pre-filled URL
          document.getElementById('imgInsertUrl').value = url;
          document.getElementById('imgInsertPreview').src = url;
          document.getElementById('imgInsertPlaceholder').classList.add('hidden');
          document.getElementById('imgInsertPreviewArea').classList.remove('hidden');
          document.getElementById('imgInsertUploading').classList.add('hidden');
          document.getElementById('imgInsertAlt').value = '';
          document.getElementById('imgInsertCaption').value = '';
          document.getElementById('imageInsertModal').classList.remove('hidden');
          document.getElementById('imgInsertAlt').focus();
          updateInsertBtn();
        }

        // ── Load / Save / Delete ────────────────────
        async function loadPost(id) {
          try {
            var res = await fetch('/api/admin/blog/' + id);
            if (!res.ok) { alert('서버 오류 ('+res.status+')'); return; }
            var json = await res.json();
            if (json.ok) openEditor(json.post);
            else alert(json.error || '글을 불러올 수 없습니다.');
          } catch(e) { alert('불러오기 실패: '+e.message); }
        }

        async function savePost(publish) {
          var id = document.getElementById('postId').value;
          var title = document.getElementById('postTitle').value;
          var content = document.getElementById('postContent').value;
          if (!title || !content) { alert('제목과 본문을 입력하세요.'); return; }
          var btns = document.querySelectorAll('#editorModal button');
          btns.forEach(function(b){b.disabled=true;});
          var data = {
            title: title, content: content,
            category: document.getElementById('postCategory').value,
            treatment_slug: document.getElementById('postTreatment').value,
            tags: document.getElementById('postTags').value,
            excerpt: document.getElementById('postExcerpt').value,
            cover_image: document.getElementById('postCoverImage').value,
            focus_keyword: document.getElementById('postFocusKeyword').value,
            is_published: publish
          };
          try {
            var url = id ? '/api/admin/blog/'+id : '/api/admin/blog';
            var method = id ? 'PUT' : 'POST';
            var res = await fetch(url, { method: method, headers:{'Content-Type':'application/json'}, body: JSON.stringify(data) });
            if (!res.ok) { var t = await res.text(); alert('서버 오류 ('+res.status+'): '+(t.substring(0,200)||'응답 없음')); btns.forEach(function(b){b.disabled=false;}); return; }
            var json = await res.json();
            if (json.ok) window.location.reload();
            else alert(json.error || '오류가 발생했습니다.');
          } catch(e) { alert('저장 실패: '+e.message); }
          btns.forEach(function(b){b.disabled=false;});
        }

        async function deletePost(id) {
          if (!confirm('이 글을 삭제하시겠습니까?')) return;
          try {
            var res = await fetch('/api/admin/blog/'+id, { method: 'DELETE' });
            var json = await res.json();
            if (json.ok) window.location.reload(); else alert(json.error||'삭제 실패');
          } catch(e) { alert('오류: '+e.message); }
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
  // Ensure focus_keyword column exists
  try { await c.env.DB.prepare('ALTER TABLE blog_posts ADD COLUMN focus_keyword TEXT').run(); } catch {}
  await c.env.DB.prepare(`
    INSERT INTO blog_posts (slug, title, excerpt, content, category, tags, cover_image, treatment_slug, author_name, is_published, focus_keyword)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(slug, data.title, data.excerpt || null, data.content, data.category || '치과상식', data.tags || null, data.cover_image || null, data.treatment_slug || null, '서울365치과', data.is_published ? 1 : 0, data.focus_keyword || null).run();
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
  // Ensure focus_keyword column exists
  try { await c.env.DB.prepare('ALTER TABLE blog_posts ADD COLUMN focus_keyword TEXT').run(); } catch {}
  await c.env.DB.prepare(`
    UPDATE blog_posts SET title=?, excerpt=?, content=?, category=?, tags=?, cover_image=?, treatment_slug=?, is_published=?, focus_keyword=?, updated_at=datetime('now') WHERE id=?
  `).bind(data.title, data.excerpt || null, data.content, data.category || '치과상식', data.tags || null, data.cover_image || null, data.treatment_slug || null, data.is_published ? 1 : 0, data.focus_keyword || null, c.req.param('id')).run();
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

  // Build TOC from H2 + H3 headings (SEO-enhanced)
  const headings = extractHeadings(post.content);

  // Auto-extract FAQs for JSON-LD FAQPage schema (AEO)
  const faqs = extractFAQs(post.content);

  return c.render(
    <>
      <article class="pt-24 pb-16" itemscope itemtype="https://schema.org/BlogPosting">
        <meta itemprop="datePublished" content={post.created_at} />
        <meta itemprop="dateModified" content={post.updated_at} />
        <meta itemprop="author" content="서울365치과" />

        {/* Cover Image — Full width hero */}
        {post.cover_image && (
          <div class="max-w-5xl mx-auto px-5 md:px-8 mb-8">
            <div class="relative rounded-2xl overflow-hidden shadow-lg">
              <img
                src={post.cover_image}
                alt={post.title}
                class="w-full h-[280px] md:h-[400px] object-cover"
                itemprop="image"
                loading="eager"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          </div>
        )}

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

            {/* Sidebar TOC (Desktop) — H2 + H3 */}
            {headings.length > 1 && (
              <aside class="hidden lg:block w-56 shrink-0">
                <div class="sticky top-24">
                  <h4 class="text-[0.68rem] font-bold text-gray-400 uppercase tracking-wider mb-3">목차</h4>
                  <nav class="space-y-1.5" aria-label="목차">
                    {headings.map((h: any) => (
                      <a href={`#${h.id}`} class={`block text-xs transition truncate ${h.level === 2 ? 'text-gray-500 hover:text-[#0066FF] font-medium' : 'text-gray-400 hover:text-[#0066FF] pl-3 text-[0.7rem]'}`}>{h.text}</a>
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

      {/* Image Lightbox overlay */}
      <div id="imgLightbox" class="hidden fixed inset-0 z-[9999] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out" onclick="this.classList.add('hidden')">
        <img id="lbImg" src="" alt="" class="max-w-full max-h-[90vh] rounded-xl shadow-2xl object-contain" />
        <button class="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white text-xl flex items-center justify-center transition" onclick="event.stopPropagation(); document.getElementById('imgLightbox').classList.add('hidden')">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      {/* Blog image lightbox script */}
      <script dangerouslySetInnerHTML={{__html: `
        (function(){
          var lb = document.getElementById('imgLightbox');
          var lbImg = document.getElementById('lbImg');
          if(!lb || !lbImg) return;
          // Intercept clicks on article figure images
          document.querySelectorAll('[itemprop="articleBody"] figure a').forEach(function(a){
            a.addEventListener('click', function(e){
              e.preventDefault();
              lbImg.src = this.href || this.querySelector('img').src;
              lb.classList.remove('hidden');
            });
          });
          // Also handle cover image click
          var coverImg = document.querySelector('[itemprop="image"]');
          if(coverImg){
            coverImg.style.cursor = 'zoom-in';
            coverImg.addEventListener('click', function(){
              lbImg.src = this.src;
              lb.classList.remove('hidden');
            });
          }
          // ESC to close
          document.addEventListener('keydown', function(e){
            if(e.key === 'Escape') lb.classList.add('hidden');
          });
        })();
      `}} />
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
          ...(post.cover_image ? { "image": post.cover_image } : {}),
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
        // Auto-generated FAQPage schema from Q&A pairs in content (AEO)
        ...(faqs.length > 0 ? [{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": faqs.map((faq: any) => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": faq.answer
            }
          }))
        }] : []),
      ]
    }
  )
})


export default blogRoutes
