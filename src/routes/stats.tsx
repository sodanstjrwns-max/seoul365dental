// ============================================================
// 관리자 통계 — 중앙 대시보드(PF Web Engine) 연동
// GET /admin/stats : 관리자 세션 쿠키 또는 ?key=<토큰> 접근 (그 외 404)
// 토큰은 서버사이드 API 호출에만 사용
// ============================================================
import { Hono } from 'hono'
import { raw } from 'hono/html'
import type { Bindings } from '../lib/types'
import { getAdminFromCookie } from '../lib/db'

const STATS_API_URL = 'https://pf-dashboard-2nt.pages.dev/api/stats/seoul365dc.kr'
const STATS_TOKEN = 'ab26265def5614d75630e01c843b73ed83f759d35e57938d'
const MASTER_KEY = 'pfwe-b4f42f06'

const statsRoutes = new Hono<{ Bindings: Bindings }>()

async function fetchSiteStats(): Promise<any | null> {
  try {
    const res = await fetch(STATS_API_URL, { headers: { Authorization: `Bearer ${STATS_TOKEN}` } })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

// ---------- 유틸 ----------
const fmt = (n: any) => (n == null || isNaN(Number(n)) ? '—' : Number(n).toLocaleString('ko-KR'))

function DeltaBadge({ v, invert }: { v?: number | null; invert?: boolean }) {
  if (v == null || !isFinite(Number(v))) return null
  const n = Number(v)
  if (n === 0) return <span class="text-white/30 bg-white/5 text-[0.68rem] font-bold px-2 py-0.5 rounded-full">— 0%</span>
  const up = n > 0
  const good = invert ? !up : up
  return (
    <span class={`text-[0.68rem] font-bold px-2 py-0.5 rounded-full ${good ? 'text-emerald-400 bg-emerald-400/10' : 'text-red-400 bg-red-400/10'}`}>
      {up ? '▲' : '▼'} {Math.abs(n).toFixed(1)}%
    </span>
  )
}

function sparklineSvg(values: number[], color: string): string {
  if (!values || values.length < 2) return ''
  const w = 600, h = 72
  const max = Math.max(...values, 1)
  const stepX = w / (values.length - 1)
  const pts = values.map((v, i) => [i * stepX, h - 8 - (v / max) * (h - 18)] as const)
  const line = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ')
  const area = `${line} L${w},${h} L0,${h} Z`
  const last = pts[pts.length - 1]
  return `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" style="width:100%;height:72px;display:block" role="img" aria-label="추이 그래프">
    <path d="${area}" fill="${color}" opacity="0.1"/>
    <path d="${line}" fill="none" stroke="${color}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>
    <circle cx="${last[0].toFixed(1)}" cy="${last[1].toFixed(1)}" r="3" fill="${color}"/>
  </svg>`
}

// ---------- 규칙 기반 인사이트 ----------
function buildInsights(d: any): string[] {
  const out: string[] = []
  const g = d?.gsc, a = d?.ga, ai = d?.ai
  if (!d || !d.configured) {
    return [
      '중앙 대시보드 데이터 연동이 완료되면 이 자리에 자동 인사이트가 표시됩니다.',
      '사이트맵·IndexNow·구조화데이터 등 검색 가속 세팅은 이미 적용되어 운영 중입니다.',
      '블로그·진료 콘텐츠가 쌓일수록 롱테일 키워드 노출이 먼저 늘어납니다.',
    ]
  }
  if (g) {
    if ((g.clicks ?? 0) < 100) {
      out.push(`최근 28일 검색 클릭 ${fmt(g.clicks)}회 — 아직 색인·순위 안착 단계입니다. 지금은 클릭보다 노출(${fmt(g.impressions)}회) 증가 추세가 더 중요한 신호입니다.`)
    } else if (g.delta?.clicks != null) {
      out.push(
        g.delta.clicks >= 0
          ? `최근 28일 검색 클릭 ${fmt(g.clicks)}회 — 직전 기간 대비 ${Number(g.delta.clicks).toFixed(1)}% 증가했습니다.`
          : `최근 28일 검색 클릭 ${fmt(g.clicks)}회 — 직전 기간 대비 ${Math.abs(Number(g.delta.clicks)).toFixed(1)}% 감소했습니다. 계절 요인 또는 순위 변동을 지켜볼 필요가 있습니다.`
      )
    }
    if ((g.impressions ?? 0) >= 200 && g.ctr != null && g.ctr < 0.02) {
      out.push(`노출 대비 클릭률(CTR ${(g.ctr * 100).toFixed(1)}%)이 아직 낮습니다. 노출이 쌓이는 초기에는 자연스러운 현상이며, 순위가 오르면 클릭률도 함께 개선됩니다.`)
    }
    if (g.position != null) {
      out.push(
        g.position <= 10
          ? `평균 노출 순위 ${Number(g.position).toFixed(1)}위 — 검색 1페이지에 노출되는 키워드가 형성되고 있습니다.`
          : `평균 노출 순위 ${Number(g.position).toFixed(1)}위 — 롱테일 키워드부터 순위가 형성되는 정상적인 초기 흐름입니다.`
      )
    }
    if (g.topQueries?.length) out.push(`가장 많이 유입된 검색어는 "${String(g.topQueries[0].query)}" 입니다.`)
  }
  if (a && (a.leads ?? 0) > 0) out.push(`예약·상담 등 전환(리드)이 최근 28일 ${fmt(a.leads)}건 발생했습니다.`)
  if (ai && (ai.sessions ?? 0) > 0) out.push(`ChatGPT 등 AI 검색을 통한 방문이 ${fmt(ai.sessions)}회(전체 세션의 ${ai.share}%) 발생했습니다. AEO 구조가 작동하고 있다는 신호입니다.`)
  while (out.length < 3) {
    const fillers = [
      '사이트맵·IndexNow·구조화데이터 등 검색 가속 세팅이 적용되어 운영 중입니다.',
      '콘텐츠가 쌓일수록 지역+진료 조합 키워드의 노출이 단계적으로 늘어납니다.',
      '검색 순위는 6개월 이후 본격적인 경쟁 구간에 진입합니다.',
    ]
    const f = fillers[out.length % fillers.length]
    if (out.includes(f)) break
    out.push(f)
  }
  return out.slice(0, 5)
}

// ---------- 컴포넌트 ----------
const TIMELINE = [
  { p: '0~1개월', t: '색인' },
  { p: '1~3개월', t: '롱테일 노출' },
  { p: '3~6개월', t: '지역+진료 키워드' },
  { p: '6개월~', t: '경쟁 키워드 본순위' },
]

function Timeline() {
  return (
    <div class="flex flex-wrap items-stretch justify-center">
      {TIMELINE.map((s, i) => (
        <>
          {i > 0 && <div class="hidden md:block w-6 h-px bg-[#0066FF]/25 self-center -mt-6"></div>}
          <div class="flex-1 min-w-[110px] text-center px-1 py-1">
            <div class="w-8 h-8 rounded-full bg-[#0066FF]/10 border border-[#0066FF]/40 text-[#0066FF] font-bold text-xs flex items-center justify-center mx-auto mb-2">{i + 1}</div>
            <div class="text-[#0066FF] text-[0.7rem] font-bold tracking-wide mb-0.5">{s.p}</div>
            <div class="text-white/70 text-xs">{s.t}</div>
          </div>
        </>
      ))}
    </div>
  )
}

function ExpectationCard({ large }: { large: boolean }) {
  if (large) {
    return (
      <section class="bg-gradient-to-br from-[#0066FF]/10 to-white/[0.02] border border-[#0066FF]/25 rounded-2xl p-8 md:p-10 text-center mb-7">
        <div class="w-14 h-14 rounded-2xl bg-[#0066FF]/10 flex items-center justify-center mx-auto mb-5">
          <i class="fa-solid fa-hourglass-half text-[#0066FF] text-xl"></i>
        </div>
        <h2 class="text-white text-2xl font-black mb-3">검색 순위는 시간이 필요합니다</h2>
        <p class="text-white/50 text-sm leading-7 mb-7 max-w-2xl mx-auto">
          신규 사이트는 색인과 순위 안착까지 시간이 걸립니다. 본격적인 순위 경쟁은 개설 6개월부터 시작됩니다.<br />
          사이트맵·IndexNow·구조화데이터 등 검색 가속 세팅은 모두 완료되어 있습니다.
        </p>
        <Timeline />
      </section>
    )
  }
  return (
    <section class="bg-white/5 border border-white/5 rounded-2xl p-5 mb-7">
      <div class="text-[#0066FF] text-sm font-bold mb-3"><i class="fa-solid fa-hourglass-half mr-2"></i>검색 순위는 시간이 필요합니다</div>
      <Timeline />
    </section>
  )
}

function MetricCard({ label, value, icon, delta, invert, sub }: { label: string; value: string; icon: string; delta?: number | null; invert?: boolean; sub?: string }) {
  return (
    <div class="bg-white/5 border border-white/5 rounded-2xl p-5">
      <div class="text-white/30 text-xs font-semibold uppercase tracking-wider mb-2"><i class={`fa-solid ${icon} mr-1 text-[#0066FF]/60`}></i>{label}</div>
      <div class="text-2xl md:text-3xl font-black text-white">{value}{sub && <span class="text-sm font-bold text-[#0066FF] ml-1">{sub}</span>}</div>
      <div class="mt-2 min-h-[18px]"><DeltaBadge v={delta} invert={invert} /></div>
    </div>
  )
}

function StatsTable({ title, heads, rows }: { title: string; heads: string[]; rows: (string | number)[][] }) {
  return (
    <div class="bg-white/5 border border-white/5 rounded-2xl p-5">
      <h3 class="text-white text-sm font-bold mb-3">{title}</h3>
      {rows.length === 0 ? (
        <div class="text-white/25 text-xs text-center py-6">데이터 수집 중입니다</div>
      ) : (
        <table class="w-full text-xs">
          <thead>
            <tr class="border-b border-white/5">
              {heads.map((h, i) => (
                <th class={`${i === 0 ? 'text-left' : 'text-right'} px-2 py-2 text-white/30 font-semibold uppercase tracking-wider text-[0.62rem]`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr class="border-b border-white/5">
                {r.map((cell, i) => (
                  <td class={`px-2 py-2 ${i === 0 ? 'text-left text-white/70 max-w-[220px] truncate' : 'text-right text-white/50 tabular-nums'}`}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

const AI_SOURCE_LABELS: Record<string, string> = {
  chatgpt: 'ChatGPT', perplexity: 'Perplexity', claude: 'Claude', gemini: 'Gemini', etc: '기타 AI',
}

// ---------- 행동 분석 (Microsoft Clarity) ----------
const CLARITY_URL = 'https://clarity.microsoft.com/projects/view/yc83itfgmi/dashboard'

function secFmt(n: any): string {
  if (n == null || isNaN(Number(n))) return '—'
  const s = Math.round(Number(n))
  return s >= 60 ? `${Math.floor(s / 60)}분 ${s % 60}초` : `${s}초`
}
const pct1 = (n: any) => (n == null || isNaN(Number(n)) ? '—' : `${Number(n).toFixed(1)}%`)

function clarityInsights(cl: any): string[] {
  const out: string[] = []
  if ((cl.rageClickPct ?? 0) >= 1 || (cl.deadClickPct ?? 0) >= 5) out.push('화면 반응이 없어 반복 클릭하는 사용자가 있습니다 (UI 답답 신호)')
  if (cl.avgScrollDepth != null && cl.avgScrollDepth < 40 && (cl.sessions ?? 0) >= 30) out.push('첫 화면에서 이탈이 많습니다')
  if ((cl.scriptErrors ?? 0) > 0) out.push(`스크립트 오류 ${fmt(cl.scriptErrors)}건 감지 — 점검 필요`)
  if ((cl.quickbackPct ?? 0) >= 8) out.push('들어왔다 바로 나가는 비율이 높습니다')
  if (!out.length && (cl.sessions ?? 0) > 0) out.push('특이 신호 없음')
  return out
}

function ClaritySection({ cl }: { cl: any }) {
  const ins = cl ? clarityInsights(cl) : []
  return (
    <>
      <div class="text-white font-bold text-sm mb-3 mt-8 flex items-center flex-wrap gap-2">
        행동 분석 <span class="text-white/25 text-xs font-medium">Clarity · 최근 3일</span>
        <a
          href={CLARITY_URL}
          target="_blank"
          rel="noopener"
          class="text-[#0066FF] text-[0.68rem] font-bold border border-[#0066FF]/30 rounded-full px-2.5 py-0.5 hover:bg-[#0066FF]/10 transition"
        >
          Clarity 대시보드 <i class="fa-solid fa-arrow-up-right-from-square text-[0.58rem] ml-0.5"></i>
        </a>
      </div>
      {!cl ? (
        <div class="text-white/25 text-xs text-center py-6">Clarity 수집 대기 중</div>
      ) : (
        <>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <MetricCard label="세션" value={fmt(cl.sessions)} icon="fa-users" sub={cl.botSessions != null ? `봇 ${fmt(cl.botSessions)}` : undefined} />
            <MetricCard label="사용자" value={fmt(cl.users)} icon="fa-user" />
            <MetricCard label="평균 스크롤" value={pct1(cl.avgScrollDepth)} icon="fa-angles-down" />
            <MetricCard label="참여시간" value={secFmt(cl.engagementSec)} icon="fa-stopwatch" sub={cl.activeSec != null ? `활성 ${secFmt(cl.activeSec)}` : undefined} />
            <MetricCard label="레이지 클릭" value={cl.rageClicks != null ? `${fmt(cl.rageClicks)}건` : '—'} icon="fa-bolt" sub={pct1(cl.rageClickPct)} />
            <MetricCard label="데드 클릭" value={cl.deadClicks != null ? `${fmt(cl.deadClicks)}건` : '—'} icon="fa-ban" sub={pct1(cl.deadClickPct)} />
            <MetricCard label="퀵백" value={cl.quickbacks != null ? `${fmt(cl.quickbacks)}건` : '—'} icon="fa-rotate-left" sub={pct1(cl.quickbackPct)} />
            <MetricCard label="스크립트 오류" value={cl.scriptErrors != null ? `${fmt(cl.scriptErrors)}건` : '—'} icon="fa-bug" sub={pct1(cl.scriptErrorPct)} />
          </div>
          {ins.length > 0 && (
            <section class="bg-gradient-to-br from-[#0066FF]/10 to-white/[0.02] border border-[#0066FF]/20 rounded-2xl p-6 mb-2">
              <h3 class="text-[#0066FF] text-sm font-bold mb-3"><i class="fa-solid fa-magnifying-glass-chart mr-2"></i>행동 신호</h3>
              <ul class="space-y-2">
                {ins.map((l) => (
                  <li class="text-white/60 text-sm leading-6 pl-4 relative"><span class="absolute left-0 text-[#0066FF] font-black">·</span>{l}</li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}
    </>
  )
}

// ---------- 라우트 ----------
// 로컬 예약(상담) 통계 — 중앙 대시보드 수집용 (개인정보 없음, 건수만)
statsRoutes.get('/api/local-stats', async (c) => {
  const key = c.req.query('key') || ''
  if (key !== STATS_TOKEN && key !== MASTER_KEY) return c.notFound()
  try {
    // consultations.created_at 은 UTC(CURRENT_TIMESTAMP) 기준 저장
    const row = await c.env.DB.prepare(
      `SELECT
         SUM(CASE WHEN created_at >= datetime('now','-28 days') THEN 1 ELSE 0 END) AS cur,
         SUM(CASE WHEN created_at >= datetime('now','-56 days') AND created_at < datetime('now','-28 days') THEN 1 ELSE 0 END) AS prev
       FROM consultations`
    ).first<{ cur: number | null; prev: number | null }>()
    const cur = Number(row?.cur ?? 0)
    const prev = Number(row?.prev ?? 0)
    return c.json({ supported: true, tables: [{ name: 'consultations', cur, prev }], total: { cur, prev } })
  } catch {
    return c.json({ supported: false })
  }
})

statsRoutes.get('/admin/stats', async (c) => {
  const admin = await getAdminFromCookie(c.env.DB, c.req.header('cookie'))
  const key = c.req.query('key') || ''
  if (!admin && key !== STATS_TOKEN && key !== MASTER_KEY) return c.notFound()

  const d = await fetchSiteStats()
  const configured = !!(d && d.configured)
  const g = d?.gsc, a = d?.ga, ai = d?.ai
  const lowTraffic = !configured || !g || (g.clicks ?? 0) < 100
  const insights = buildInsights(d)
  const range = d?.range ? `${d.range.start} ~ ${d.range.end}` : ''
  const aiRows = ai
    ? Object.entries(ai.bySource ?? {}).filter(([, v]) => Number(v) > 0).sort((x, y) => Number(y[1]) - Number(x[1])).map(([k, v]) => [AI_SOURCE_LABELS[k] ?? String(k), fmt(v)])
    : []

  return c.render(
    <>
      {/* Admin Header */}
      <div class="fixed top-0 left-0 right-0 z-[10000] bg-gray-900/95 backdrop-blur border-b border-white/5">
        <div class="max-w-[1400px] mx-auto px-5 py-3 flex items-center justify-between">
          <div class="flex items-center gap-3">
            {admin ? (
              <a href="/admin/dashboard" class="w-8 h-8 rounded-lg bg-[#0066FF]/20 flex items-center justify-center hover:bg-[#0066FF]/30 transition">
                <i class="fa-solid fa-arrow-left text-[#0066FF] text-sm"></i>
              </a>
            ) : (
              <div class="w-8 h-8 rounded-lg bg-[#0066FF]/20 flex items-center justify-center">
                <i class="fa-solid fa-chart-line text-[#0066FF] text-sm"></i>
              </div>
            )}
            <span class="text-white font-bold text-sm">통계</span>
            {range && (
              <>
                <span class="text-white/20 text-xs">|</span>
                <span class="text-white/40 text-xs">{range}</span>
              </>
            )}
          </div>
          {admin && <a href="/api/admin/logout" class="text-red-400/60 hover:text-red-400 text-xs transition"><i class="fa-solid fa-right-from-bracket mr-1"></i>로그아웃</a>}
        </div>
      </div>

      <section class="min-h-screen bg-gradient-to-br from-gray-900 via-[#0a0e1a] to-gray-900 pt-20 pb-12">
        <div class="max-w-[1100px] mx-auto px-5 md:px-8">
          <ExpectationCard large={lowTraffic} />

          {!configured ? (
            <>
              <section class="bg-white/5 border border-dashed border-white/15 rounded-2xl p-10 text-center mb-7">
                <i class="fa-solid fa-plug text-white/20 text-2xl mb-4"></i>
                <h3 class="text-white font-bold mb-2">데이터 연동 대기 중</h3>
                <p class="text-white/40 text-sm leading-6">검색콘솔·애널리틱스 데이터 연동이 준비되는 대로 이 페이지에 지표가 자동 표시됩니다.</p>
              </section>
              <section class="bg-gradient-to-br from-[#0066FF]/10 to-white/[0.02] border border-[#0066FF]/20 rounded-2xl p-6">
                <h3 class="text-[#0066FF] text-sm font-bold mb-3"><i class="fa-solid fa-lightbulb mr-2"></i>자동 인사이트</h3>
                <ul class="space-y-2">
                  {insights.map((l) => (
                    <li class="text-white/60 text-sm leading-6 pl-4 relative"><span class="absolute left-0 text-[#0066FF] font-black">·</span>{l}</li>
                  ))}
                </ul>
              </section>
            </>
          ) : (
            <>
              <div class="text-white font-bold text-sm mb-3 mt-8">검색 성과 <span class="text-white/25 text-xs font-medium ml-2">Google Search Console · 최근 28일</span></div>
              {g ? (
                <>
                  <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <MetricCard label="검색 클릭" value={fmt(g.clicks)} icon="fa-arrow-pointer" delta={g.delta?.clicks} />
                    <MetricCard label="검색 노출" value={fmt(g.impressions)} icon="fa-eye" delta={g.delta?.impressions} />
                    <MetricCard label="CTR" value={g.ctr != null ? (g.ctr * 100).toFixed(1) + '%' : '—'} icon="fa-percent" delta={g.delta?.ctr} />
                    <MetricCard label="평균 순위" value={g.position != null ? Number(g.position).toFixed(1) + '위' : '—'} icon="fa-ranking-star" delta={g.delta?.position} invert />
                  </div>
                  <div class="bg-white/5 border border-white/5 rounded-2xl p-5 mb-2">
                    <div class="text-white/30 text-xs font-semibold uppercase tracking-wider mb-3">일별 검색 클릭</div>
                    {(g.dailyClicks ?? []).length >= 2 ? raw(sparklineSvg((g.dailyClicks ?? []).map((x: any) => Number(x.clicks) || 0), '#0066FF')) : <div class="text-white/25 text-xs text-center py-5">데이터 수집 중</div>}
                  </div>
                </>
              ) : (
                <div class="text-white/25 text-xs text-center py-6">검색콘솔 데이터 수집 중입니다</div>
              )}

              <div class="text-white font-bold text-sm mb-3 mt-8">방문 성과 <span class="text-white/25 text-xs font-medium ml-2">Google Analytics · 최근 28일</span></div>
              {a ? (
                <>
                  <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <MetricCard label="사용자" value={fmt(a.users)} icon="fa-user" delta={a.delta?.users} />
                    <MetricCard label="세션" value={fmt(a.sessions)} icon="fa-chart-simple" delta={a.delta?.sessions} />
                    <MetricCard label="리드(전환)" value={fmt(a.leads)} icon="fa-phone" delta={a.delta?.leads} />
                    <MetricCard label="AI 유입" value={ai ? fmt(ai.sessions) : '—'} sub={ai ? `(${ai.share ?? 0}%)` : undefined} icon="fa-robot" delta={ai?.delta} />
                  </div>
                  <div class="bg-white/5 border border-white/5 rounded-2xl p-5 mb-2">
                    <div class="text-white/30 text-xs font-semibold uppercase tracking-wider mb-3">일별 사용자</div>
                    {(a.dailyUsers ?? []).length >= 2 ? raw(sparklineSvg((a.dailyUsers ?? []).map((x: any) => Number(x.users) || 0), '#00E5FF')) : <div class="text-white/25 text-xs text-center py-5">데이터 수집 중</div>}
                  </div>
                </>
              ) : (
                <div class="text-white/25 text-xs text-center py-6">{d.hasGa ? '애널리틱스 데이터 수집 중입니다' : '애널리틱스 연동 대기 중입니다'}</div>
              )}

              <ClaritySection cl={d?.clarity} />

              <section class="bg-gradient-to-br from-[#0066FF]/10 to-white/[0.02] border border-[#0066FF]/20 rounded-2xl p-6 my-8">
                <h3 class="text-[#0066FF] text-sm font-bold mb-3"><i class="fa-solid fa-lightbulb mr-2"></i>자동 인사이트</h3>
                <ul class="space-y-2">
                  {insights.map((l) => (
                    <li class="text-white/60 text-sm leading-6 pl-4 relative"><span class="absolute left-0 text-[#0066FF] font-black">·</span>{l}</li>
                  ))}
                </ul>
              </section>

              <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <StatsTable
                  title="상위 검색어 TOP 10"
                  heads={['검색어', '클릭', '노출']}
                  rows={(g?.topQueries ?? []).slice(0, 10).map((q: any) => [String(q.query ?? ''), fmt(q.clicks), fmt(q.impressions)])}
                />
                <StatsTable
                  title="상위 페이지 TOP 10"
                  heads={['페이지', '클릭', '노출']}
                  rows={(g?.topPages ?? []).slice(0, 10).map((q: any) => [String(q.page ?? '').replace(/^https?:\/\/[^/]+/, '') || '/', fmt(q.clicks), fmt(q.impressions)])}
                />
                <StatsTable title="AI 소스별 유입" heads={['AI 소스', '세션']} rows={aiRows} />
              </div>
            </>
          )}
        </div>
      </section>
    </>,
    { title: '통계 | 서울365치과 관리자', noindex: true }
  )
})

export default statsRoutes
