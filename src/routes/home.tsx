// ============================================================
// 서울365치과 메인 홈 — v6 "낮과 밤, 365" (2026-11-04 전면 리디자인)
//  - 글(brand.ts·clinic.ts·faq.ts 의 승인 문구)은 그대로, 구조·비주얼·연출만 새로.
//  - 모든 글자는 HTML 에 그대로. 스크롤 연출은 public/static/immersive.js(GSAP), 등장은 app.js(IO).
//  - SEO 불변: 히어로 "구월동 치과" 허브 앵커, 구월동 카드 6장(ItemList 1:1), FAQPage(본문과 동일), 지역×진료 링크, JSON-LD.
// ============================================================
import { Hono } from 'hono'
import type { Bindings } from '../lib/types'
import { CLINIC, DIFF_CARDS } from '../data/clinic'
import { doctors } from '../data/doctors'
import { treatments } from '../data/treatments'
import { mainFaq, pricingSummary } from '../data/faq'
import { MESSAGING, MISSION, VISION, MAIN_SUMMARY } from '../data/brand'
import { initAdminTables, initBlogTables } from '../lib/db'
import { AREAS, getAreasSorted } from '../data/areas'
import { MATRIX_TREATMENT_SLUGS, MATRIX_TREATMENT_INFO } from '../data/area-treatment'
import { CONTENT_DATES } from '../lib/content-dates'
import { GuwolCardGrid, GUWOL_CARD_CSS, guwolCardItemList } from '../lib/guwol-cards'
import { Icon, NaverMark, KakaoMark } from '../lib/icons'
import { todayStatus, WEEK } from '../lib/hours'

const home = new Hono<{ Bindings: Bindings }>()

// 주력 진료 7 (기존 ItemList 와 동일 집합)
const TOP_SLUGS = ['full-implant', 'digital-full-arch', 'orthodontics', 'invisalign', 'sedation', 'cosmetic', 'implant']

// 세 가지 약속 카드 사진 — 결과 암시 없는 원내 장면(기존 에셋 그대로)
const PROMISE_MEDIA = [
  { src: '/static/cards/guwol-sedation.jpg', alt: '서울365치과 수면진료 안내 사진', href: '/treatments/sedation', label: '수면진료 안내', portrait: false },
  { src: '/static/team-photo.jpg', alt: '서울365치과 의료진 단체 사진', href: '/doctors', label: '의료진 소개', portrait: true },
  { src: '/static/cards/guwol-full-implant.jpg', alt: '서울365치과 전체임플란트 안내 사진', href: '/treatments/full-implant', label: '전체임플란트 안내', portrait: false },
]

// 시간 레일 표식(10:00 → 21:00 을 0 → 1 로)
const RAIL_MARKS = [
  { h: 10, t: '10:00', l: '진료 시작' },
  { h: 13, t: '13:00', l: '점심시간 없이 연속 진료' },
  { h: 19, t: '19:00', l: '금 마감' },
  { h: 21, t: '21:00', l: '월–목 마감' },
]
const pct = (h: number) => ((h - 10) / 11) * 100
const pad2 = (n: number) => String(n).padStart(2, '0')

const NUMBERS = [
  { n: '5', s: '인', k: '서울대 출신 전문의', d: '분야별 원장 협진' },
  { n: '365', s: '일', k: '연중무휴 진료', d: '일요일·공휴일 모두 진료' },
  { n: '21', s: '시', k: '야간까지 진료', d: '월~목 야간 진료' },
  { n: '6', s: '개', k: '독립 수술실', d: '원내 자체 기공실 운영' },
]

home.get('/', async (c) => {
  const topTreatments = TOP_SLUGS.map(s => treatments.find(t => t.slug === s)).filter(Boolean) as typeof treatments
  const restTreatments = treatments.filter(t => !TOP_SLUGS.includes(t.slug))
  const st = todayStatus()
  // 히어로 강조 줄 "마취를 확인한 뒤 시작합니다." → 좁은 화면에서 '뒤' 뒤에서만 줄이 바뀌게 의미 단위 두 덩어리
  const accentChunks = MESSAGING.heroAccent.includes(' 뒤 ') ? MESSAGING.heroAccent.split(/ 뒤 /).map((x, i) => i === 0 ? x + ' 뒤' : x) : [MESSAGING.heroAccent]
  const [ctaFirst, ...ctaRestParts] = MESSAGING.ctaMain.split(',')
  const ctaRest = ctaRestParts.join(',').trim()

  // ===== DB에서 최신 비포애프터 케이스 가져오기 =====
  let baCases: any[] = [];
  try {
    await initAdminTables(c.env.DB);
    const baResult = await c.env.DB.prepare(
      'SELECT id, treatment_slug, title, tag, doctor_name, before_image, after_image, created_at FROM before_after_cases WHERE is_published = 1 ORDER BY sort_order DESC, created_at DESC LIMIT 3'
    ).all();
    baCases = baResult.results || [];
  } catch {}

  // ===== DB에서 최신 블로그 포스트 가져오기 =====
  let blogPosts: any[] = [];
  try {
    await initBlogTables(c.env.DB);
    const blogResult = await c.env.DB.prepare(
      'SELECT id, slug, title, excerpt, category, tags, cover_image, author_name, created_at FROM blog_posts WHERE is_published = 1 ORDER BY created_at DESC LIMIT 3'
    ).all();
    blogPosts = blogResult.results || [];
  } catch {}

  const fallbackCases = [
    { title: '전체임플란트 – 상악 전체 수복', tag: '전체임플란트', doctor_name: '박준규 대표원장', before_image: '' },
    { title: '디지털풀아치 – 하악 즉시로딩', tag: '디지털풀아치', doctor_name: '박준규 대표원장', before_image: '' },
    { title: '인비절라인 – 성인 투명교정', tag: '교정', doctor_name: '하누리 원장', before_image: '' },
  ]
  const cases = baCases.length > 0 ? baCases : fallbackCases
  const fallbackPosts = [
    { title: '전체임플란트, 틀니보다 좋은 이유 5가지', category: '임플란트', created_at: '2026-02-15', slug: '' },
    { title: '치아교정 나이 제한? 성인교정 궁금증 해결', category: '교정', created_at: '2026-02-10', slug: '' },
    { title: '수면진료, 정말 안전한가요?', category: '수면진료', created_at: '2026-02-05', slug: '' },
  ]
  const posts = blogPosts.length > 0 ? blogPosts : fallbackPosts
  const fmtDate = (v: string) => v ? new Date(v).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\. /g, '.').replace(/\.$/, '') : ''

  return c.render(
    <>
      {/* ===== 1. HERO — 낮의 치과 ===== */}
      <section class="hero" aria-label="서울365치과 메인 히어로">
        <div class="hero-bg" aria-hidden="true"></div>
        <div class="hero-wm" aria-hidden="true" data-hero="wm">365</div>
        <div class="wrap hero-in">
          <div class="hero-copy">
            {/* 지역 키워드 첫 문단 — "구월동 치과" 허브 앵커 (2026-10-08) */}
            <p class="hero-eyebrow" data-hero>
              <Icon name="pin" size={14} />
              <span>인천 남동구 <a href="/area/guwol-dong">구월동 치과</a></span><i class="sep" aria-hidden="true"></i>
              <span>예술회관역 6번 출구 맞은편</span><i class="sep" aria-hidden="true"></i>
              <span>365일 진료</span>
            </p>
            <h1 class="hero-h1">
              <span class="hl l1"><span class="hl-in">{MESSAGING.heroLine1}</span></span>
              <span class="hl l2"><span class="hl-in">{MESSAGING.heroLine2}</span></span>
              <span class="hl l3"><span class="hl-in">{accentChunks.map((ch, i) => <><span class="ph-c">{ch}</span>{i < accentChunks.length - 1 ? ' ' : ''}</>)}</span></span>
            </h1>
            <p class="hero-sub" data-hero><strong>“{MESSAGING.heroSub1}”</strong></p>
            <p class="hero-sub2" data-hero>{MESSAGING.heroSub2}</p>
            <div class="hero-cta" data-hero>
              <a href="/reservation" class="btn btn-primary btn-lg"><Icon name="calendar" />상담 예약하기</a>
              <a href={CLINIC.naverBooking} target="_blank" rel="noopener noreferrer nofollow" class="btn btn-naver btn-lg"><NaverMark size={15} />네이버 예약</a>
              <a href={CLINIC.phoneTel} class="btn btn-ghost btn-lg mono"><Icon name="phone" />{CLINIC.phone}</a>
            </div>
            <dl class="hero-facts" data-hero>
              <div><dt class="k">Doctors</dt><dd class="v">5<small>서울대 출신 원장</small></dd></div>
              <div><dt class="k">Open</dt><dd class="v">365<small>일 진료</small></dd></div>
              <div><dt class="k">Night</dt><dd class="v">21:00<small>월–목 야간</small></dd></div>
              <div><dt class="k">Lab</dt><dd class="v">원내<small>자체 기공실</small></dd></div>
            </dl>
          </div>

          <div class="hero-media" data-hero="media">
            <div class="hero-frame">
              <img src="/static/dr-park.jpg" alt="박준규 대표원장 — 서울대 출신 통합치의학과 전문의" title="서울365치과 박준규 대표원장" width="1024" height="683" loading="eager" fetchpriority="high" decoding="async" />
              <div class="hero-caption"><b>박준규 대표원장</b><span>서울대 통합치의학과 전문의</span></div>
            </div>
            <div class={`time-card${st.open ? ' is-open' : ''}`} data-timecard>
              <span class="tc-label"><span class="dot" aria-hidden="true"></span><span data-tc-text>{st.open ? '지금 진료중' : '지금은 진료 시간이 아닙니다'}</span></span>
              <span class="tc-time"><span data-clock>{st.clock}</span><small data-tc-close>{st.open ? `~ ${st.closes}` : `오늘 ${st.opens}–${st.closes}`}</small></span>
              <span class="tc-sub">오늘({st.label}) {st.opens} – {st.closes} · 점심시간 없이</span>
            </div>
          </div>
        </div>
        <div class="hero-scroll" aria-hidden="true"><i></i>SCROLL</div>
      </section>

      {/* ===== 2. 시간 레일 — 낮에서 밤으로 ===== */}
      <section class="tb" id="hours" aria-labelledby="tb-h" data-tb>
        <div class="tb-pin">
          <div class="wrap">
            <div class="tb-in">
              <div class="sec-head" style="margin-bottom:0">
                <p class="eyebrow">Open 365 days · 10:00 – 21:00</p>
                <h2 id="tb-h" class="display">하루는 길게, 일 년은 빠짐없이.</h2>
                <p class="lead">월요일부터 목요일은 밤 9시까지, 금요일은 저녁 7시, 토요일은 오후 2시까지 진료합니다. 일요일과 공휴일에도 오후 2시부터 6시까지 문을 열고, 점심시간 없이 연속으로 진료합니다.</p>
              </div>
              <div>
                <div class="tb-clock"><span class="tb-digits" data-tb-digits aria-hidden="true">10:00</span><span class="tb-day">월 – 목 기준</span></div>
                <div class="tb-rail" role="img" aria-label="월요일부터 목요일 진료 시간: 10시부터 21시까지">
                  <div class="tb-fill"></div>
                  <div class="tb-sun-track"><div class="tb-sun"></div></div>
                  <div class="tb-ticks" aria-hidden="true">{Array.from({ length: 12 }, (_, i) => 10 + i).map(h => <span class="tb-tick">{h}</span>)}</div>
                  <div class="tb-marks" aria-hidden="true">
                    {RAIL_MARKS.map(m => <div class="tb-mark" style={`left:${pct(m.h)}%`} data-mark={String((m.h - 10) / 11)}><b>{m.t}</b><span>{m.l}</span></div>)}
                  </div>
                </div>
              </div>
            </div>
            <div class="wk" data-on aria-label="요일별 진료 시간">
              <div class="wk-h" aria-hidden="true"><span>10</span><span>15</span><span>21</span></div>
              {WEEK.map((d, i) => (
                <div class={`wk-col${i === 6 ? ' alt' : ''}`} data-day={String(i)}>
                  <div class="wk-track" aria-hidden="true"><div class="wk-bar" style={`top:${pct(d.open)}%;height:${((d.close - d.open) / 11) * 100}%`}></div></div>
                  <span class="wk-day">{d.label}</span>
                  <span class="wk-time">{pad2(d.open)}–{d.close}</span>
                </div>
              ))}
            </div>
            <p class="tb-note"><span><i aria-hidden="true"></i>월–토</span><span><i class="sun" aria-hidden="true"></i>일·공휴일 14:00–18:00</span><span>점심시간 없이 연속 진료</span></p>
          </div>
        </div>
      </section>

      {/* ===== 3. 세 가지 약속 — 스택 카드 ===== */}
      <section class="sec" aria-labelledby="pr-h">
        <div class="wrap">
          <div class="sec-head" data-rv>
            <p class="eyebrow">Our promise</p>
            <h2 id="pr-h" class="display">{VISION.headline}</h2>
          </div>
          <ol class="pr-stack">
            {VISION.promises.map((p, i) => (
              <li class="pr-card" data-pr>
                <div class="pr-body">
                  <span class="pr-num">PROMISE 0{i + 1}</span>
                  <h3>{p.title}</h3>
                  <p>{p.desc}</p>
                  <div class="pr-foot"><a href={PROMISE_MEDIA[i].href} class="btn btn-ghost btn-sm">{PROMISE_MEDIA[i].label}<Icon name="arrow" /></a></div>
                </div>
                <div class={`pr-media${PROMISE_MEDIA[i].portrait ? ' portrait' : ''}`}><img src={PROMISE_MEDIA[i].src} alt={PROMISE_MEDIA[i].alt} loading="lazy" decoding="async" /></div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ===== 4. 진료 원칙 — 번호 목록 ===== */}
      <section class="sec" style="background:var(--card)" aria-labelledby="pp-h">
        <div class="wrap">
          <div class="sec-head-row">
            <div class="sec-head" data-rv>
              <p class="eyebrow">Why Seoul 365</p>
              <h2 id="pp-h" class="display">치과가 두려운 분들을 위한 진료 원칙</h2>
              <p class="lead">{MISSION}</p>
            </div>
            <a href="/why-us" class="arrow-link" data-rv>서울365를 선택하는 이유<Icon name="arrow" /></a>
          </div>
          <ol class="pp-list">
            {DIFF_CARDS.map((card, i) => (
              <li class="pp-row" data-rv>
                <span class="pp-num">0{i + 1}</span>
                <div><span class="pp-t">{card.title}</span><h3>{card.headline}</h3></div>
                <p>{card.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ===== 5. 소개 영상 — 전원 ON ===== */}
      <section class="video-sec" aria-label="서울365치과 소개 영상">
        <div class="video-wrap video-section-responsive" id="video-section" data-video>
          {/* YouTube iframe 은 app.js 가 화면 가까이 오면 주입 */}
          <div id="yt-player-wrap" class="absolute inset-0 z-0" style="pointer-events:none"></div>
          <div id="yt-poster" class="absolute inset-0 z-0 bg-cover bg-center transition-opacity duration-1000" style="background-image:url(https://img.youtube.com/vi/gB_yiatcwAc/maxresdefault.jpg)">
            <div class="absolute inset-0" style="background:rgb(11 21 48 / .32)"></div>
          </div>
          <div class="video-copy">
            <div>
              <p class="eyebrow eyebrow-light">Clinic tour</p>
              <h2>서울365치과의 진료 환경</h2>
              <p>대표원장님의 진료 철학을 영상으로 확인하세요.</p>
            </div>
            <div class="video-actions">
              <button id="yt-sound-toggle" class="sound-btn" type="button" aria-pressed="false"><Icon name="volumeOff" class="ic-off" /><Icon name="volumeOn" class="ic-on" /><span id="yt-sound-label">소리 켜기</span></button>
              <a href="/reservation" class="btn btn-white btn-sm">상담 예약하기</a>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 6. 진료 인덱스 + 구월동 진료 안내 사진 카드(ItemList 1:1, 2026-10-14) ===== */}
      <section class="sec" aria-labelledby="tx-h">
        <div class="wrap tx-grid">
          <div class="tx-sticky">
            <div class="sec-head" data-rv>
              <p class="eyebrow">Treatments</p>
              <h2 id="tx-h" class="display">주력 진료 안내</h2>
              <p class="lead">임플란트, 교정, 보존, 보철, 종합진료 — 각 분야 전문 원장이 하나의 케이스를 함께 논의합니다.</p>
            </div>
            <ol class="tx-list" data-rv-group>
              {topTreatments.map((t, i) => (
                <li><a href={`/treatments/${t.slug}`}><span class="n">0{i + 1}</span><span class="name">{t.name}<small>{t.shortDesc}</small></span><Icon name="arrow" /></a></li>
              ))}
            </ol>
            <div class="tx-all" data-rv>
              {restTreatments.map(t => <a href={`/treatments/${t.slug}`}>{t.name}</a>)}
            </div>
            <p style="margin-top:1.4rem" data-rv><a href="/treatments" class="btn btn-ghost">전체 진료 보기<Icon name="arrow" /></a></p>
          </div>
          <div class="gw-half">
            <style dangerouslySetInnerHTML={{ __html: GUWOL_CARD_CSS }} />
            <div class="sec-head" data-rv style="margin-bottom:1.4rem">
              <p class="eyebrow">Guwol-dong guide</p>
              <h2 id="gw-home-h" class="display-2">구월동 진료 안내</h2>
              <p class="t-mute" style="font-size:.92rem;margin-top:.5rem">예술회관역 6번 출구 맞은편. 구월동에서 많이 찾으시는 진료 여섯 가지를 사진과 함께 정리했습니다.</p>
            </div>
            <GuwolCardGrid idPrefix="home" />
          </div>
        </div>
      </section>

      {/* ===== 7. 의료진 — 밤의 레일 ===== */}
      <section class="sec dr is-dark" aria-labelledby="dr-h" data-dr>
        <div class="wrap sec-head-row">
          <div class="sec-head" data-rv>
            <p class="eyebrow">Our doctors</p>
            <h2 id="dr-h" class="display">서울대 출신 5인 전문의</h2>
            <p class="lead">각 분야별 전문의가 협력하여 최적의 치료를 제공합니다.</p>
          </div>
          <a href="/doctors" class="arrow-link" data-rv>의료진 전체 보기<Icon name="arrow" /></a>
        </div>
        <div class="dr-track" data-dr-track>
          {doctors.map((doc, i) => (
            <a href={`/doctors/${doc.slug}`} class="dr-card">
              <div class="dr-photo">
                {i === 0 && <span class="lead-badge">LEAD</span>}
                <img src={doc.photo} alt={`${doc.name} ${doc.title} - 서울365치과`} title={`서울365치과 ${doc.name} ${doc.title}`} loading="lazy" decoding="async" width="797" height="1024" onerror={`this.onerror=null;this.src='${doc.photoFallback}'`} />
              </div>
              <div class="dr-meta"><b>{doc.name}</b><span class="title">{doc.title}</span><span class="sp">{doc.specialties.slice(0, 3).join(' · ')}</span></div>
            </a>
          ))}
        </div>
      </section>

      {/* ===== 8. 숫자 ===== */}
      <section class="sec-tight" aria-label="서울365치과 주요 지표">
        <div class="wrap">
          <div class="num-grid" data-rv-group>
            {NUMBERS.map(s => (
              <div class="num-cell">
                <div class="num-val"><span data-count={s.n}>{s.n}</span><small>{s.s}</small></div>
                <p class="num-k">{s.k}</p>
                <p class="num-d">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 9. 치료 사례 — DB 연동, After 는 로그인 후 ===== */}
      <section class="sec" aria-labelledby="cs-h">
        <div class="wrap">
          <div class="sec-head-row">
            <div class="sec-head" data-rv>
              <p class="eyebrow">Before &amp; After</p>
              <h2 id="cs-h" class="display">치료 사례</h2>
              <p class="lead">실제 치료 사례로 결과를 확인하세요.</p>
            </div>
            <a href="javascript:void(0)" onclick="checkLoginAndGo()" class="arrow-link" data-rv>전체 사례 보기<Icon name="arrow" /></a>
          </div>
          <div class="case-grid" data-rv-group>
            {cases.map((cs: any) => (
              <div onclick="checkLoginAndGo()" class="card case-card hover" role="button" tabindex={0}>
                <div class="case-ph">
                  {cs.before_image
                    ? <img src={cs.before_image} alt={`서울365치과 ${cs.title || cs.tag} 치료 전 사진`} title={`${cs.title || cs.tag} Before`} loading="lazy" decoding="async" />
                    : <span class="ph-empty">BEFORE</span>}
                  <span class="lab">Before</span>
                  <span class="lock"><Icon name="lock" />After 잠금</span>
                </div>
                <div class="card-body">
                  <span class="tag">{cs.tag}</span>
                  <h3>{cs.title}</h3>
                  <p class="meta">담당: {cs.doctor_name}</p>
                </div>
              </div>
            ))}
          </div>
          <p class="fine" style="text-align:center;margin-top:1.6rem">※ 개인에 따라 치료 결과가 다를 수 있습니다. 모든 사례는 환자 동의 하에 게시되었습니다.</p>
        </div>
      </section>

      {/* 로그인 필요 모달 (Before/After 클릭 시) */}
      <div id="login-required-modal" class="modal hidden" role="dialog" aria-modal="true" aria-labelledby="lrm-h">
        <div class="modal-box" id="login-required-box">
          <button type="button" class="modal-x" onclick="document.getElementById('login-required-modal').classList.add('hidden')" aria-label="닫기"><Icon name="close" /></button>
          <div class="modal-ic"><Icon name="lock" /></div>
          <h3 id="lrm-h">After 사진 열람</h3>
          <p>치료 후(After) 사진 확인은 로그인 후 이용하실 수 있습니다.</p>
          <div class="modal-actions">
            <a href="/login" class="btn btn-primary">로그인</a>
            <a href="/register" class="btn btn-ghost">회원가입</a>
          </div>
          <p class="fine" style="margin-top:1rem">가입은 30초면 충분합니다.</p>
        </div>
      </div>
      <script dangerouslySetInnerHTML={{__html: `
        function checkLoginAndGo() {
          fetch('/api/auth/me')
            .then(function(r) { return r.json(); })
            .then(function(data) {
              if (data.ok && data.user) {
                window.location.href = '/cases/gallery';
              } else {
                document.getElementById('login-required-modal').classList.remove('hidden');
              }
            })
            .catch(function() {
              document.getElementById('login-required-modal').classList.remove('hidden');
            });
        }
        document.getElementById('login-required-modal').addEventListener('click', function(e) {
          if (e.target === this) this.classList.add('hidden');
        });
        document.addEventListener('keydown', function(e) {
          if (e.key === 'Escape') {
            var m = document.getElementById('login-required-modal');
            if (m && !m.classList.contains('hidden')) m.classList.add('hidden');
          }
        });
      `}} />

      {/* ===== 10. 비용 안내 ===== */}
      <section class="sec" style="background:var(--card)" aria-labelledby="pc-h">
        <div class="wrap-n">
          <div class="sec-head center" data-rv>
            <p class="eyebrow">Pricing</p>
            <h2 id="pc-h" class="display">투명한 비용 안내</h2>
            <p class="lead">부담 없이 확인하세요.</p>
          </div>
          <div data-rv>
            <table class="price-table">
              <thead><tr><th scope="col">치료</th><th scope="col" style="text-align:right">가격대</th><th scope="col" style="text-align:right">보험</th></tr></thead>
              <tbody>
                {pricingSummary.slice(0, 8).map(p => (
                  <tr>
                    <td>{p.treatment}{p.note === '이벤트' && <span class="note">이벤트</span>}</td>
                    <td class="price">{p.price}</td>
                    <td class="ins">{p.insurance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p class="fine" style="text-align:center;margin-top:1.2rem">※ 정확한 비용은 정밀 진단 후 안내드립니다. 카드 결제 및 분할 옵션 가능.</p>
          <p style="text-align:center;margin-top:1rem" data-rv><a href="/info" class="btn btn-ghost">비용 전체 보기<Icon name="arrow" /></a></p>
        </div>
      </section>

      {/* ===== 11. FAQ — details(크롤러에 열림) ===== */}
      <section class="sec" aria-labelledby="faq-h" id="faq-section">
        <div class="wrap-n">
          <div class="sec-head center" data-rv>
            <p class="eyebrow">FAQ</p>
            <h2 id="faq-h" class="display">자주 묻는 질문</h2>
          </div>
          <div data-rv-group>
            {mainFaq.map((f, i) => (
              <details class="fq" open={i === 0 ? true : undefined}>
                <summary><h3>{f.q}</h3><span class="pm" aria-hidden="true"><Icon name="plus" /></span></summary>
                <div class="fq-a"><p>{f.a}</p></div>
              </details>
            ))}
          </div>
          <p style="text-align:center;margin-top:1.6rem" data-rv><a href="/faq" class="arrow-link">FAQ 전체 보기<Icon name="arrow" /></a></p>
        </div>
      </section>

      {/* ===== 12. 전문 칼럼 — DB 연동 ===== */}
      <section class="sec" style="background:var(--card)" aria-labelledby="col-h">
        <div class="wrap">
          <div class="sec-head-row">
            <div class="sec-head" data-rv>
              <p class="eyebrow">Columns</p>
              <h2 id="col-h" class="display">전문 칼럼</h2>
            </div>
            <a href="/blog" class="arrow-link" data-rv>블로그 전체 보기<Icon name="arrow" /></a>
          </div>
          <div class="post-grid" data-rv-group>
            {posts.map((article: any) => (
              <a href={article.slug ? `/blog/${article.slug}` : '/blog'} class="card">
                <div class="post-ph">
                  {article.cover_image
                    ? <img src={article.cover_image} alt={article.title} title={`${article.title} | 서울365치과 블로그`} loading="lazy" decoding="async" />
                    : <Icon name="news" />}
                </div>
                <div class="card-body">
                  <span class="tag">{article.category || '일반'}</span>
                  <h3>{article.title}</h3>
                  {article.excerpt && <p class="ex">{article.excerpt}</p>}
                  <p class="meta">{fmtDate(article.created_at)}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 13. 세 줄 요약 — 낱말 밝힘 ===== */}
      <section class="sec-tight" aria-label="서울365치과 한 줄 요약">
        <div class="wrap-n sum" data-summary>
          {MAIN_SUMMARY.map(line => <p>{line}</p>)}
        </div>
      </section>

      {/* ===== 14. 지역 허브 — 지역×진료 매트릭스 진입 ===== */}
      <section class="sec" style="background:var(--paper-2)" aria-labelledby="area-h">
        <div class="wrap">
          <div class="sec-head center" data-rv>
            <p class="eyebrow">Find your area</p>
            <h2 id="area-h" class="display">우리 동네에서 가까운 서울365치과 찾기</h2>
            <p class="lead">인천 {AREAS.length}개 지역 × {MATRIX_TREATMENT_SLUGS.length}개 핵심 진료 — 클릭 한 번으로 우리 지역 전문 진료 페이지로 이동</p>
            {/* 허브 링크는 페이지당 최대 2개(2026-10-08): 구월동 치과 = 히어로·푸터, 여기서는 구 단위 허브만 */}
            <p style="margin-top:.8rem;font-size:.92rem">남동구 동별 거리·교통편: <a href="/area/namdong-gu" class="arrow-link" style="font-size:.92rem">인천 남동구 치과<Icon name="arrow" /></a></p>
          </div>

          <div class="area-block" data-rv style="margin-bottom:1.8rem">
            <h3><Icon name="pin" size={14} />지역별 안내</h3>
            <div class="area-chips">
              {getAreasSorted().filter(a => a.slug !== 'guwol-dong').map(a => (
                <a href={`/area/${a.slug}`} title={`${a.name}치과 - 서울365치과 ${a.distKm === 0 ? '도보 3분' : a.travelMin + '분'}`}>{a.name}치과<small>{a.distKm === 0 ? '도보 3분' : `${a.travelMin}분`}</small></a>
              ))}
            </div>
          </div>

          {['implant', 'invisalign', 'orthodontics'].map(tSlug => {
            const info = MATRIX_TREATMENT_INFO[tSlug as keyof typeof MATRIX_TREATMENT_INFO];
            const topAreas = getAreasSorted().slice(0, 10);
            return (
              <div class="area-block" data-rv style="margin-bottom:1.2rem">
                <h3>지역별 {info.name}<a href={`/treatments/${tSlug}`}>{info.name} 자세히 보기 →</a></h3>
                <div class="area-chips">
                  {topAreas.map(a => <a href={`/area/${a.slug}/${tSlug}`} title={`${a.name} ${info.name}`}>{a.name} {info.name}</a>)}
                </div>
              </div>
            );
          })}

          <p style="text-align:center;margin-top:2rem" data-rv><a href="/area" class="btn btn-ghost"><Icon name="map" />전체 지역 안내 보기</a></p>
        </div>
      </section>

      {/* ===== 15. 상담 밴드 ===== */}
      <section class="cta-band" aria-label="상담 안내">
        <div class="wrap-n" style="text-align:center;position:relative">
          <p class="eyebrow eyebrow-light no-bar" style="justify-content:center" data-rv>Consultation</p>
          <h2 class="display-xl" data-rv>{ctaFirst}, <em>{ctaRest}</em></h2>
          <p class="lead" data-rv>{MESSAGING.ctaSub}</p>
          <div class="cta-actions" data-rv-group>
            <a href={CLINIC.phoneTel} class="btn btn-white btn-lg"><Icon name="phone" />전화 상담</a>
            <a href={CLINIC.kakao} target="_blank" rel="noopener noreferrer nofollow" class="btn btn-kakao btn-lg"><KakaoMark size={18} />카카오톡</a>
            <a href={CLINIC.naverBooking} target="_blank" rel="noopener noreferrer nofollow" class="btn btn-naver btn-lg"><NaverMark size={15} />네이버 예약</a>
          </div>
          <p class="cta-meta" data-rv>{CLINIC.phone} · {CLINIC.address}</p>
        </div>
      </section>
    </>,
    {
      // 대표 키워드 "구월동 치과"를 title 맨 앞에 (브랜드 유지) — 2026-10-08 지역 SEO
      title: '구월동 치과 서울365치과 | 인천 남동구 예술회관역 임플란트·인비절라인·수면진료, 365일 야간진료',
      description: '인천 남동구 구월동 치과 서울365치과. 예술회관역 6번 출구 맞은편, 월~목 21시·일요일·공휴일 진료. 서울대 출신 원장 협진, 인비절라인 인증의 진료, 수면진료·자체 기공실. 032-432-0365',
      canonical: 'https://seoul365dc.kr',
      dateModified: CONTENT_DATES.home,
      jsonLd: [
        guwolCardItemList('https://seoul365dc.kr/'),
        // BreadcrumbList
        {
          "@context": "https://schema.org", "@type": "BreadcrumbList",
          "itemListElement": [{ "@type": "ListItem", "position": 1, "name": "서울365치과", "item": "https://seoul365dc.kr" }]
        },
        // WebPage — homepage
        {
          "@context": "https://schema.org",
          "@type": ["WebPage", "MedicalWebPage"],
          "@id": "https://seoul365dc.kr/#webpage",
          "url": "https://seoul365dc.kr",
          "name": "구월동 치과 서울365치과 | 인천 남동구 예술회관역 365일 야간진료",
          "description": MISSION,
          "isPartOf": { "@id": "https://seoul365dc.kr/#website" },
          "about": { "@id": "https://seoul365dc.kr/#dentist" },
          "inLanguage": "ko-KR",
          "datePublished": "2024-01-01",
          "dateModified": CONTENT_DATES.home,
          "primaryImageOfPage": {
            "@type": "ImageObject",
            "url": "https://seoul365dc.kr/static/og-image.png",
            "width": 1200,
            "height": 630,
            "caption": "서울365치과 인천 구월동 - 서울대 출신 5인 전문의 치과"
          },
          "speakable": {
            "@type": "SpeakableSpecification",
            "cssSelector": ["h1", ".display"]
          },
          "specialty": "Dentistry"
        },
        // VideoObject — clinic tour
        {
          "@context": "https://schema.org",
          "@type": "VideoObject",
          "name": "서울365치과 소개 영상 - 진료 환경 클리닉 투어",
          "description": "서울365치과의 진료 환경. 대표원장님의 진료 철학을 영상으로 확인하세요. 400평 규모, 6개 독립 수술실, 에어샤워 시스템, 자체 기공실.",
          "thumbnailUrl": "https://img.youtube.com/vi/gB_yiatcwAc/maxresdefault.jpg",
          "uploadDate": "2024-01-01",
          "contentUrl": "https://www.youtube.com/watch?v=gB_yiatcwAc",
          "embedUrl": "https://www.youtube-nocookie.com/embed/gB_yiatcwAc",
          "publisher": { "@id": "https://seoul365dc.kr/#dentist" },
          "inLanguage": "ko",
          "isFamilyFriendly": true
        },
        // ItemList — featured treatments
        {
          "@context": "https://schema.org",
          "@type": "ItemList",
          "name": "서울365치과 주요 진료",
          "description": "서울365치과에서 제공하는 주요 치과 진료 안내",
          "numberOfItems": topTreatments.length,
          "itemListElement": topTreatments.map((t: any, i: number) => ({
            "@type": "ListItem",
            "position": i + 1,
            "name": t.name,
            "url": `https://seoul365dc.kr/treatments/${t.slug}`,
            "item": {
              "@type": "MedicalProcedure",
              "name": t.name,
              "description": t.shortDesc,
              "url": `https://seoul365dc.kr/treatments/${t.slug}`
            }
          }))
        },
        // FAQPage — homepage preview FAQ (본문 <details> 와 동일 문구)
        {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "name": "서울365치과 자주 묻는 질문",
          "mainEntity": mainFaq.map((f: any) => ({
            "@type": "Question", "name": f.q,
            "acceptedAnswer": { "@type": "Answer", "text": f.a }
          }))
        },
        // OfferCatalog — key services with pricing hints
        {
          "@context": "https://schema.org",
          "@type": "OfferCatalog",
          "name": "서울365치과 진료 서비스",
          "itemListElement": [
            { "@type": "Offer", "name": "전체임플란트", "itemOffered": { "@type": "MedicalProcedure", "name": "전체임플란트" }, "priceCurrency": "KRW", "description": "자체 기공실 MUA 즉시로딩", "url": "https://seoul365dc.kr/treatments/full-implant" },
            { "@type": "Offer", "name": "디지털풀아치 임플란트", "itemOffered": { "@type": "MedicalProcedure", "name": "디지털풀아치 임플란트" }, "priceCurrency": "KRW", "description": "4~6개 임플란트로 전악 회복", "url": "https://seoul365dc.kr/treatments/digital-full-arch" },
            { "@type": "Offer", "name": "수면진료", "itemOffered": { "@type": "MedicalProcedure", "name": "수면진료" }, "priceCurrency": "KRW", "description": "사전 평가 후 의식하 진정 상태에서 치료(적용 여부·반응 개인차 있음)", "url": "https://seoul365dc.kr/treatments/sedation" },
            { "@type": "Offer", "name": "치아교정", "itemOffered": { "@type": "MedicalProcedure", "name": "치아교정" }, "priceCurrency": "KRW", "description": "교정과 전문의 직접 진료", "url": "https://seoul365dc.kr/treatments/orthodontics" },
            { "@type": "Offer", "name": "인비절라인 투명교정", "itemOffered": { "@type": "MedicalProcedure", "name": "인비절라인" }, "priceCurrency": "KRW", "price": "7000000", "description": "인비절라인 인증의 직접 진료, 3D ClinCheck 시뮬레이션", "url": "https://seoul365dc.kr/treatments/invisalign" },
          ]
        },
        // Article — clinic columns (AEO: rich snippet for blog-like content)
        {
          "@context": "https://schema.org",
          "@type": "ItemList",
          "name": "서울365치과 전문 칼럼",
          "itemListElement": [
            {
              "@type": "ListItem", "position": 1,
              "item": { "@type": "Article", "headline": "전체임플란트, 틀니보다 좋은 이유 5가지", "datePublished": "2026-02-15", "author": { "@id": "https://seoul365dc.kr/#dentist" }, "publisher": { "@id": "https://seoul365dc.kr/#dentist" }, "articleSection": "임플란트", "inLanguage": "ko-KR" }
            },
            {
              "@type": "ListItem", "position": 2,
              "item": { "@type": "Article", "headline": "치아교정 나이 제한? 성인교정 궁금증 해결", "datePublished": "2026-02-10", "author": { "@id": "https://seoul365dc.kr/#dentist" }, "publisher": { "@id": "https://seoul365dc.kr/#dentist" }, "articleSection": "교정", "inLanguage": "ko-KR" }
            },
            {
              "@type": "ListItem", "position": 3,
              "item": { "@type": "Article", "headline": "수면진료, 정말 안전한가요?", "datePublished": "2026-02-05", "author": { "@id": "https://seoul365dc.kr/#dentist" }, "publisher": { "@id": "https://seoul365dc.kr/#dentist" }, "articleSection": "수면진료", "inLanguage": "ko-KR" }
            },
          ]
        },
        // HealthTopicContent — dental conditions addressed (AEO critical)
        {
          "@context": "https://schema.org",
          "@type": "MedicalWebPage",
          "name": "서울365치과 치과 질환 및 치료 안내",
          "url": "https://seoul365dc.kr",
          "about": [
            { "@type": "MedicalCondition", "name": "무치악(치아 상실)", "associatedAnatomy": { "@type": "AnatomicalStructure", "name": "구강" }, "possibleTreatment": [{ "@type": "MedicalProcedure", "name": "전체임플란트" }, { "@type": "MedicalProcedure", "name": "디지털풀아치" }] },
            { "@type": "MedicalCondition", "name": "부정교합", "possibleTreatment": [{ "@type": "MedicalProcedure", "name": "인비절라인" }, { "@type": "MedicalProcedure", "name": "교정치료" }] },
            { "@type": "MedicalCondition", "name": "치과 공포증(치과 불안)", "possibleTreatment": [{ "@type": "MedicalProcedure", "name": "수면진료" }, { "@type": "MedicalProcedure", "name": "무통마취" }] },
            { "@type": "MedicalCondition", "name": "치수염(충치)", "possibleTreatment": [{ "@type": "MedicalProcedure", "name": "신경치료" }, { "@type": "MedicalProcedure", "name": "보존치료" }] },
          ],
          "specialty": "Dentistry",
          "inLanguage": "ko-KR",
        },
      ]
    }
  )
})

export default home
