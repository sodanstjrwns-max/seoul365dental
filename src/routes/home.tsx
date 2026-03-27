import { Hono } from 'hono'
import type { Bindings } from '../lib/types'
import { CLINIC, STATS, DIFF_CARDS } from '../data/clinic'
import { doctors } from '../data/doctors'
import { treatments } from '../data/treatments'
import { mainFaq, pricingSummary } from '../data/faq'
import { MESSAGING, MISSION, VISION, MAIN_SUMMARY } from '../data/brand'
import { initAdminTables, initBlogTables } from '../lib/db'

const home = new Hono<{ Bindings: Bindings }>()

home.get('/', async (c) => {
  const topTreatments = treatments.filter(t =>
    ['full-implant','digital-full-arch','orthodontics','sedation','cosmetic','implant'].includes(t.slug)
  );

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

  return c.render(
    <>
      {/* ===== S1: CINEMATIC HERO — EMOTIONAL IMPACT v7 + DR PORTRAIT ===== */}
      <section class="hero-premium" aria-label="서울365치과 메인 히어로">
        {/* Background layers */}
        <div class="hero-grid"></div>
        <canvas id="hero-particles" aria-hidden="true"></canvas>
        <div class="orb orb-1"></div>
        <div class="orb orb-2"></div>
        <div class="orb orb-3"></div>

        <div class="relative z-10 max-w-[1400px] mx-auto px-5 md:px-8 w-full">
          {/* 2-Column Layout: Copy Left + Photo Right */}
          <div class="flex flex-col lg:flex-row items-center gap-8 lg:gap-12 pt-28 pb-16 md:pt-0 md:pb-0">

            {/* LEFT COLUMN — Copy */}
            <div class="flex-1 min-w-0 lg:max-w-[58%]">

              {/* H1 — 3-Line Emotional Headline */}
              <h1 class="reveal" style="transition-delay:0.5s">
                <span class="block text-white/40 mb-1" style="font-size:clamp(1.5rem,4vw,3rem);line-height:1.1;letter-spacing:-0.04em;font-weight:800;white-space:nowrap">
                  {MESSAGING.heroLine1}
                </span>
                <span class="block text-white/60 mb-2" style="font-size:clamp(1.5rem,4vw,3rem);line-height:1.1;letter-spacing:-0.04em;font-weight:800;white-space:nowrap">
                  {MESSAGING.heroLine2}
                </span>
                <span class="block gradient-text-electric" style="font-size:clamp(1.7rem,4.5vw,3.5rem);line-height:1.05;letter-spacing:-0.05em;font-weight:900;white-space:nowrap">
                  {MESSAGING.heroAccent}
                </span>
              </h1>

              {/* Divider */}
              <div class="reveal mt-8 mb-6" style="transition-delay:0.65s">
                <div class="w-14 h-[2px] bg-gradient-to-r from-[#0066FF] to-[#00E5FF] rounded-full"></div>
              </div>

              {/* Sub Copy — 원장 직접 인용 */}
              <div class="space-y-2 mb-5 reveal" style="transition-delay:0.75s">
                <p class="text-white/60 text-base md:text-lg font-medium leading-relaxed max-w-xl">
                  <span class="text-[#0066FF] mr-1 font-bold">"</span>{MESSAGING.heroSub1}<span class="text-[#0066FF] ml-0.5 font-bold">"</span>
                </p>
                <p class="text-white/35 text-sm md:text-base leading-relaxed max-w-xl pl-4" style="border-left:2px solid rgba(0,102,255,0.15)">
                  {MESSAGING.heroSub2}
                </p>
              </div>

              {/* Patient Testimonial */}
              <div class="reveal mb-8" style="transition-delay:0.85s">
                <p class="text-white/20 text-sm italic max-w-lg">
                  <i class="fa-solid fa-quote-left text-[#0066FF]/25 text-xs mr-2"></i>
                  {MESSAGING.heroTestimonial.replace(/"/g, '')}
                  <i class="fa-solid fa-quote-right text-[#0066FF]/25 text-xs ml-2"></i>
                </p>
              </div>

              {/* Metric Tags */}
              <div class="flex flex-wrap items-center gap-2 mb-8 reveal" style="transition-delay:0.95s">
                {[
                  { label: '서울대 5인 협진', icon: 'fa-user-doctor' },
                  { label: '365일 진료', icon: 'fa-calendar-check' },
                  { label: '야간 21시', icon: 'fa-moon' },
                  { label: '자체 기공실', icon: 'fa-gear' },
                  { label: '수면진료', icon: 'fa-bed' },
                  { label: '무통마취', icon: 'fa-syringe' },
                ].map(m => (
                  <div class="flex items-center gap-1.5 text-[0.72rem] px-3 py-1.5 rounded-full border border-[#0066FF]/10 bg-[#0066FF]/[0.03]">
                    <i class={`fa-solid ${m.icon} text-[#0066FF]/60 text-[0.6rem]`}></i>
                    <span class="text-white/45 font-medium">{m.label}</span>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div class="flex flex-wrap gap-3 mb-10 reveal" style="transition-delay:1.05s">
                <a href="/reservation" class="btn-premium btn-premium-fill btn-electric-glow btn-magnetic text-[0.9rem] px-8 py-4 group" data-cursor-hover>
                  <i class="fa-solid fa-calendar-check group-hover:scale-110 transition-transform"></i>
                  <span>지금 상담 예약하기</span>
                </a>
                <a href={CLINIC.naverBooking} target="_blank" rel="noopener noreferrer nofollow" class="btn-premium btn-magnetic text-[0.9rem] px-8 py-4 group" style="background:#03C75A;color:#fff;border-color:#03C75A" data-cursor-hover>
                  <i class="fa-solid fa-n group-hover:scale-110 transition-transform"></i>
                  <span>네이버 예약</span>
                </a>
                <a href="tel:032-432-0365" class="btn-premium btn-premium-white btn-magnetic text-[0.9rem] px-8 py-4 group" data-cursor-hover>
                  <i class="fa-solid fa-phone group-hover:animate-bounce"></i>
                  <span>032-432-0365</span>
                </a>
              </div>

              {/* Trust Scores */}
              <div class="flex flex-wrap gap-5 reveal" style="transition-delay:1.15s">
                {[
                  { label: '네이버', score: '4.85', icon: 'fa-star', color: 'text-amber-400' },
                  { label: '구글', score: '4.9', icon: 'fa-star', color: 'text-amber-400' },
                  { label: '만족도', score: '98%', icon: 'fa-heart', color: 'text-rose-400' },
                  { label: '재방문율', score: '87%', icon: 'fa-rotate', color: 'text-[#00E5FF]' },
                ].map(m => (
                  <div class="flex items-center gap-1.5 text-white/30 text-[0.75rem]">
                    <i class={`fa-solid ${m.icon} ${m.color} text-[0.6rem]`}></i>
                    <span class="font-bold text-white/80">{m.score}</span>
                    <span>{m.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT COLUMN — Doctor Portrait */}
            <div class="hidden lg:flex flex-shrink-0 items-end justify-center relative reveal" style="transition-delay:0.6s;width:clamp(320px,35vw,480px)">
              {/* Glow backdrop behind photo */}
              <div class="absolute -inset-8 rounded-full pointer-events-none" style="background:radial-gradient(ellipse at 50% 60%, rgba(0,102,255,0.2) 0%, rgba(0,229,255,0.08) 40%, transparent 70%);filter:blur(40px)"></div>

              {/* Photo container with cinematic mask */}
              <div class="relative hero-portrait-wrap">
                <img
                  src="/static/dr-park.jpg"
                  alt="박준규 대표원장 — 서울대 출신 통합치의학과 전문의"
                  title="서울365치과 박준규 대표원장"
                  class="hero-portrait"
                  loading="eager"
                  width="1024"
                  height="683"
                />
                {/* Bottom gradient fade into dark bg */}
                <div class="absolute inset-0 pointer-events-none" style="background:linear-gradient(to top, #020814 0%, #020814 2%, transparent 35%)"></div>
                {/* Side gradients for seamless blend */}
                <div class="absolute inset-0 pointer-events-none" style="background:linear-gradient(to right, #020814 0%, transparent 15%)"></div>
                <div class="absolute inset-0 pointer-events-none" style="background:linear-gradient(to left, rgba(2,8,20,0.6) 0%, transparent 20%)"></div>

                {/* Name Badge overlay */}
                <div class="absolute bottom-8 left-0 right-0 text-center z-10">
                  <div class="inline-flex flex-col items-center gap-1 reveal" style="transition-delay:1s">
                    <span class="text-white/80 text-sm md:text-base font-bold tracking-wide">박준규 <span class="text-white/40 font-normal">대표원장</span></span>
                    <span class="text-[#0066FF]/50 text-[0.65rem] font-medium tracking-wider">서울대 통합치의학과 전문의</span>
                  </div>
                </div>
              </div>
            </div>

            {/* MOBILE — Doctor portrait (smaller, inline) */}
            <div class="lg:hidden w-full flex justify-center mt-4 mb-2 reveal" style="transition-delay:0.6s">
              <div class="relative" style="width:min(280px, 70vw)">
                <div class="absolute -inset-6 rounded-full pointer-events-none" style="background:radial-gradient(ellipse at 50% 60%, rgba(0,102,255,0.15) 0%, transparent 70%);filter:blur(30px)"></div>
                <div class="relative overflow-hidden rounded-2xl border border-[#0066FF]/10">
                  <img
                    src="/static/dr-park.jpg"
                    alt="박준규 대표원장"
                    title="서울365치과 박준규 대표원장 진료 사진"
                    class="w-full h-auto object-cover"
                    style="aspect-ratio:3/2"
                    loading="eager"
                    width="1024"
                    height="683"
                  />
                  <div class="absolute inset-0 pointer-events-none" style="background:linear-gradient(to top, rgba(2,8,20,0.9) 0%, transparent 50%)"></div>
                  <div class="absolute bottom-3 left-0 right-0 text-center">
                    <span class="text-white/80 text-sm font-bold">박준규 <span class="text-white/40 font-normal">대표원장</span></span>
                    <br/>
                    <span class="text-[#0066FF]/50 text-[0.6rem] font-medium">서울대 통합치의학과 전문의</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Scroll Indicator */}
        <div class="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-white/15 text-center reveal" style="transition-delay:1.3s">
          <div class="w-7 h-11 border-2 border-[#0066FF]/20 rounded-full flex justify-center pt-2 mx-auto mb-2">
            <div class="w-1 h-3 bg-[#0066FF]/40 rounded-full animate-bounce"></div>
          </div>
          <span class="text-[0.6rem] tracking-[0.2em] uppercase font-medium text-[#0066FF]/30">Scroll</span>
        </div>
      </section>

      {/* ===== S2: MARQUEE TICKER — ELECTRIC ===== */}
      <section class="bg-navy-light border-y border-[#0066FF]/[0.06] overflow-hidden relative" aria-label="주요 키워드" role="marquee">
        <div class="absolute inset-0 bg-gradient-to-r from-[#0066FF]/[0.02] via-transparent to-[#00E5FF]/[0.02]"></div>
        <div class="marquee-wrapper py-5 relative" style="--marquee-bg: #0A1628;">
          <div class="marquee-track">
            {[...Array(2)].map(() => (
              <div class="flex items-center gap-12 px-6">
                {[
                  { text: '서울대 출신 5인 전문의', icon: 'fa-user-doctor' },
                  { text: '365일 연중무휴', icon: 'fa-calendar' },
                  { text: '야간진료 21시', icon: 'fa-moon' },
                  { text: '자체 기공실 완비', icon: 'fa-gear' },
                  { text: '수면임플란트', icon: 'fa-bed' },
                  { text: '점심시간 없이 연속진료', icon: 'fa-clock' },
                  { text: '네이버 4.85점', icon: 'fa-star' },
                  { text: '구글 4.9점', icon: 'fa-star' },
                ].map(item => (
                  <div class="flex items-center gap-2.5 text-white/30 text-sm whitespace-nowrap">
                    <i class={`fa-solid ${item.icon} text-[#0066FF]/60 text-xs`}></i>
                    <span class="font-medium">{item.text}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== S2.5: CINEMATIC VIDEO — FULL BLEED ===== */}
      <section class="relative w-full overflow-hidden bg-black video-section-responsive" id="video-section" aria-label="서울365치과 소개 영상">
        {/* YouTube iframe will be injected by JS when section enters viewport */}
        <div id="yt-player-wrap" class="absolute inset-0 z-0" style="pointer-events:none"></div>

        {/* Poster fallback — always visible until video plays */}
        <div id="yt-poster" class="absolute inset-0 z-0 bg-cover bg-center transition-opacity duration-1000" style={`background-image:url(https://img.youtube.com/vi/gB_yiatcwAc/maxresdefault.jpg)`}>
          <div class="absolute inset-0 bg-black/40"></div>
        </div>

        {/* Gradient overlays for readability */}
        <div class="absolute inset-0 z-[1] bg-gradient-to-b from-black/60 via-black/20 to-black/70 pointer-events-none"></div>
        <div class="absolute inset-0 z-[1] bg-gradient-to-r from-black/30 via-transparent to-black/30 pointer-events-none"></div>

        {/* Content overlay — absolute 좌하단 고정 */}
        <div class="absolute bottom-0 left-0 right-0 z-[2] pointer-events-none" style="background:linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)">
          <div class="max-w-[1400px] mx-auto px-5 md:px-8 pb-8 md:pb-12 pt-20 pointer-events-auto">
            {/* Brand copy on video */}
            <div class="reveal" style="transition-delay:0.3s">
              <span class="inline-flex items-center gap-2 text-[#00E5FF] text-[0.65rem] md:text-[0.72rem] font-bold tracking-[0.25em] uppercase mb-2 md:mb-3">
                <span class="w-6 md:w-8 h-px bg-[#00E5FF]"></span> CLINIC TOUR
              </span>
              <h2 class="text-white text-xl md:text-3xl lg:text-4xl font-bold leading-tight mb-1.5 md:mb-2" style="text-shadow:0 2px 20px rgba(0,0,0,0.5)">
                서울365치과의 <span class="gradient-text-electric">진료 환경</span>
              </h2>
              <p class="text-white/50 text-xs md:text-sm max-w-lg mb-4" style="text-shadow:0 1px 10px rgba(0,0,0,0.5)">
                대표원장님의 진료 철학을 영상으로 확인하세요.
              </p>
            </div>

            {/* Sound toggle + CTA */}
            <div class="flex items-center gap-3 md:gap-4 reveal" style="transition-delay:0.5s">
              <button id="yt-sound-toggle" class="group flex items-center gap-2.5 text-white/50 hover:text-white transition-all text-sm" data-cursor-hover>
                <div class="w-10 h-10 md:w-11 md:h-11 rounded-full border border-white/20 bg-white/[0.06] backdrop-blur-sm flex items-center justify-center group-hover:border-[#0066FF]/50 group-hover:bg-[#0066FF]/10 transition-all">
                  <i id="yt-sound-icon" class="fa-solid fa-volume-xmark text-sm"></i>
                </div>
                <span id="yt-sound-label" class="hidden md:inline font-medium">소리 켜기</span>
              </button>
              <a href="/reservation" class="btn-premium btn-premium-fill text-sm px-6 py-2.5 md:px-7 md:py-3" data-cursor-hover>
                <i class="fa-solid fa-calendar-check text-xs"></i> 상담 예약하기
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ===== S3: STATS — ELECTRIC COUNTER ===== */}
      <section class="section-lg bg-white relative overflow-hidden" data-counter-section aria-label="서울365치과 주요 지표">
        {/* Background accent — Electric */}
        <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#0066FF]/[0.04] rounded-full blur-3xl pointer-events-none morph-blob"></div>
        <div class="absolute bottom-0 right-0 w-[400px] h-[300px] bg-[#00E5FF]/[0.03] rounded-full blur-3xl pointer-events-none morph-blob" style="animation-delay:-4s"></div>

        <div class="relative max-w-[1400px] mx-auto px-5 md:px-8">
          <div class="text-center mb-16 reveal">
            <span class="section-eyebrow text-[#0066FF] mb-4 block">BY THE NUMBERS</span>
            <h2 class="section-headline text-gray-900">숫자가 <span class="gradient-text-blue">증명</span>합니다</h2>
          </div>

          <div class="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-10 stagger-children">
            {[
              { number: '5', suffix: '인', label: '서울대 출신 전문의', icon: 'fa-user-doctor', desc: '각 분야 최고 전문의' },
              { number: '365', suffix: '일', label: '연중무휴 진료', icon: 'fa-calendar-check', desc: '일요일·공휴일 모두 진료' },
              { number: '21', suffix: '시', label: '야간까지 진료', icon: 'fa-moon', desc: '월~목 야간 진료' },
              { number: '4.9', suffix: '', label: '구글 평점', icon: 'fa-star', desc: '네이버 4.85 / 만족도 98%' },
            ].map(s => (
              <div class="text-center group">
                <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0066FF]/10 to-[#00E5FF]/[0.04] flex items-center justify-center mx-auto mb-5 group-hover:from-[#0066FF]/20 group-hover:to-[#00E5FF]/10 transition-all duration-500 group-hover:shadow-lg group-hover:shadow-[#0066FF]/10">
                  <i class={`fa-solid ${s.icon} text-[#0066FF] text-xl`}></i>
                </div>
                <div class="stat-number gradient-text-blue mb-2" data-count={s.number} data-suffix={s.suffix}>
                  {s.number}{s.suffix}
                </div>
                <p class="font-bold text-gray-900 text-[0.95rem]">{s.label}</p>
                <p class="text-gray-400 text-xs mt-1">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div class="divider-gradient"></div>

      {/* ===== S4: DIFFERENTIATION — PATIENT-FOCUSED BENTO GRID ===== */}
      <section class="section-lg bg-mesh relative overflow-hidden" aria-label="서울365치과 차별점">
        <div class="absolute top-20 right-10 w-[300px] h-[300px] bg-[#0066FF]/[0.04] rounded-full blur-[100px] pointer-events-none morph-blob"></div>
        <div class="max-w-[1400px] mx-auto px-5 md:px-8 relative">
          <div class="text-center mb-16 reveal">
            <span class="section-eyebrow text-[#0066FF] mb-4 block">WHY SEOUL 365</span>
            <h2 class="section-headline text-gray-900">
              치과를 미뤄왔던 이유,<br class="md:hidden" /> <span class="highlight-word">저희가 해결합니다.</span>
            </h2>
            <p class="section-body text-gray-400 mt-5 max-w-xl mx-auto">{MISSION}</p>
          </div>

          <div class="bento-grid stagger-children">
            {DIFF_CARDS.map((card, i) => (
              <div class={`glass-card p-7 group cursor-default tilt-card electric-card-border ${i === 0 ? 'bento-wide' : ''}`}>
                <div class="icon-circle mb-5">
                  <i class={`fa-solid ${card.icon}`}></i>
                </div>
                <h3 class="font-bold text-[#0066FF] text-[0.82rem] tracking-wide mb-1">{card.title}</h3>
                <p class="font-bold text-gray-900 text-lg mb-2 leading-snug">{card.headline}</p>
                <p class="text-gray-500 text-[0.9rem] leading-relaxed mb-4">{card.desc}</p>
                <p class="text-[0.82rem] text-gray-400 italic border-l-2 border-[#0066FF]/20 pl-3">{card.voice}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== S5: TREATMENTS — HORIZONTAL SCROLL ELECTRIC ===== */}
      <section class="section-lg bg-white relative overflow-hidden">
        <div class="absolute bottom-0 left-0 w-[500px] h-[300px] bg-[#0066FF]/[0.03] rounded-full blur-[100px] pointer-events-none"></div>
        <div class="max-w-[1400px] mx-auto px-5 md:px-8 relative">
          <div class="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4 reveal">
            <div>
              <span class="section-eyebrow text-[#0066FF] mb-4 block">TREATMENTS</span>
              <h2 class="section-headline text-gray-900">주력 <span class="gradient-text-blue">진료 안내</span></h2>
            </div>
            <a href="/treatments" class="btn-premium btn-premium-outline text-sm" data-cursor-hover>
              전체 진료 보기 <i class="fa-solid fa-arrow-right text-xs ml-1"></i>
            </a>
          </div>

          <div class="horizontal-scroll-wrapper flex gap-5 pb-4 reveal-3d">
            {topTreatments.map(t => (
              <a href={`/treatments/${t.slug}`} class="premium-card p-7 group block min-w-[300px] md:min-w-[340px] flex-shrink-0 electric-card-border" data-cursor-hover>
                <div class="icon-circle mb-5">
                  <i class={`fa-solid ${t.icon}`}></i>
                </div>
                <h3 class="font-bold text-gray-900 text-lg mb-2 group-hover:text-[#0066FF] transition-colors">{t.name}</h3>
                <p class="text-gray-500 text-[0.9rem] leading-relaxed mb-5">{t.shortDesc}</p>
                <span class="inline-flex items-center gap-1.5 text-[#0066FF] text-sm font-semibold">
                  자세히 보기 <i class="fa-solid fa-arrow-right text-xs transition-transform group-hover:translate-x-1.5"></i>
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ===== S6: DOCTORS — ELECTRIC CINEMATIC ===== */}
      <section class="section-lg relative overflow-hidden" style="background:#020814;color:white">
        {/* Mesh dark gradient overlay */}
        <div class="absolute inset-0" style="background:radial-gradient(at 20% 30%, rgba(0,102,255,0.15) 0, transparent 50%),radial-gradient(at 80% 70%, rgba(0,229,255,0.08) 0, transparent 50%)"></div>
        {/* Extra electric accent */}
        <div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#0066FF]/20 to-transparent"></div>
        <div class="max-w-[1400px] mx-auto px-5 md:px-8 relative z-10">
          <div class="text-center mb-16 reveal">
            <span class="section-eyebrow text-[#0066FF] mb-4 block">OUR DOCTORS</span>
            <h2 class="section-headline text-white">
              서울대 출신<br class="md:hidden" /> <span class="gradient-text-electric">5인 전문의</span>
            </h2>
            <p class="section-body text-white/30 mt-5 max-w-xl mx-auto">각 분야별 전문의가 협력하여 최적의 치료를 제공합니다.</p>
          </div>

          {/* Lead Doctor — Electric Card */}
          <div class="p-0 overflow-hidden mb-8 reveal-3d" style="background:rgba(0,102,255,0.06);border-radius:1.75rem;border:1px solid rgba(0,102,255,0.12)">
            <div class="md:flex">
              <div class="md:w-2/5 p-10 flex items-center justify-center min-h-[340px] relative" style="background:linear-gradient(135deg,rgba(0,102,255,0.2),rgba(0,102,255,0.05),transparent)">
                <div class="absolute inset-0" style="background:linear-gradient(to top,rgba(4,11,24,0.8),transparent)"></div>
                <div class="text-center relative z-10">
                  <div class="w-36 h-36 rounded-full mx-auto mb-5 overflow-hidden border-2 border-[#0066FF]/20 pulse-ring" style="box-shadow:0 0 40px rgba(0,102,255,0.2)">
                    <img src="/static/dr-park-profile.jpg" alt={`${doctors[0].name} ${doctors[0].title} - 서울365치과`} title={`서울365치과 ${doctors[0].name} ${doctors[0].title}`} class="w-full h-full object-cover object-[center_20%]" loading="lazy" />
                  </div>
                  <h3 class="text-2xl font-bold text-white">{doctors[0].name}</h3>
                  <p class="text-[#00E5FF] text-sm font-semibold mt-1">{doctors[0].title}</p>
                  <div class="flex flex-wrap justify-center gap-2 mt-4">
                    {doctors[0].specialties.slice(0,3).map(s => (
                      <span class="text-[0.7rem] bg-white/[0.06] text-white/60 px-3 py-1 rounded-full border border-white/[0.06]">{s}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div class="md:w-3/5 p-8 md:p-10 flex flex-col justify-center" style="background:rgba(4,11,24,0.5)">
                <blockquote class="text-lg text-white/60 italic border-l-2 border-[#0066FF]/60 pl-5 mb-6 leading-relaxed">
                  "{doctors[0].philosophy.split('.')[0]}."
                </blockquote>
                <ul class="space-y-2.5 text-sm text-white/40">
                  {doctors[0].education.slice(0,2).map(e => (
                    <li class="flex items-start gap-2.5"><i class="fa-solid fa-graduation-cap text-[#0066FF]/70 text-xs mt-1"></i>{e}</li>
                  ))}
                  {doctors[0].credentials.slice(0,2).map(e => (
                    <li class="flex items-start gap-2.5"><i class="fa-solid fa-certificate text-[#00E5FF]/70 text-xs mt-1"></i>{e}</li>
                  ))}
                </ul>
                <a href="/doctors/park-junkyu" class="btn-premium btn-premium-white mt-8 self-start text-sm px-6 py-3" data-cursor-hover>
                  프로필 보기 <i class="fa-solid fa-arrow-right text-xs ml-1"></i>
                </a>
              </div>
            </div>
          </div>

          {/* Other Doctors */}
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
            {doctors.slice(1).map(doc => (
              <a href={`/doctors/${doc.slug}`} class="p-6 text-center block group tilt-card" style="background:rgba(0,102,255,0.04);border-radius:1.75rem;border:1px solid rgba(0,102,255,0.1);transition:all 0.5s" data-cursor-hover>
                <div class="w-20 h-20 rounded-full bg-white/[0.04] border border-white/[0.06] mx-auto mb-4 flex items-center justify-center group-hover:border-[#0066FF]/30 group-hover:bg-[#0066FF]/[0.08] transition-all duration-500">
                  <i class="fa-solid fa-user-doctor text-2xl text-white/20 group-hover:text-[#0066FF]/60 transition-colors"></i>
                </div>
                <h3 class="font-bold text-white text-[0.95rem]">{doc.name}</h3>
                <p class="text-white/35 text-xs mt-0.5">{doc.titleShort}</p>
                <p class="text-white/25 text-[0.7rem] mt-2">{doc.specialties.slice(0,2).join(' · ')}</p>
              </a>
            ))}
          </div>

          <div class="text-center mt-12 reveal">
            <a href="/doctors" class="btn-premium btn-premium-white text-sm px-6 py-3" data-cursor-hover>
              의료진 전체 보기 <i class="fa-solid fa-arrow-right text-xs ml-1"></i>
            </a>
          </div>
        </div>
      </section>

      {/* ===== S7: BEFORE/AFTER — DB 실시간 연동 ===== */}
      <section class="section-lg bg-white relative overflow-hidden" aria-label="치료 전후 사례">
        <div class="max-w-[1400px] mx-auto px-5 md:px-8">
          <div class="text-center mb-16 reveal">
            <span class="section-eyebrow text-[#0066FF] mb-4 block">BEFORE &amp; AFTER</span>
            <h2 class="section-headline text-gray-900">치료 <span class="gradient-text-blue">사례</span></h2>
            <p class="section-body text-gray-400 mt-5 max-w-xl mx-auto">실제 치료 사례로 결과를 확인하세요.</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-5 stagger-children">
            {baCases.length > 0 ? (
              baCases.map((cs: any) => (
                <a href="/cases/gallery" class="premium-card overflow-hidden group tilt-card electric-card-border block" data-cursor-hover>
                  <div class="aspect-[4/3] bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center relative overflow-hidden">
                    <div class="absolute inset-0 flex">
                      <div class="w-1/2 relative overflow-hidden border-r border-gray-200/50">
                        {cs.before_image ? (
                          <img src={cs.before_image} alt={`서울365치과 ${cs.title || cs.tag} 치료 전 사진`} title={`${cs.title || cs.tag} Before`} class="w-full h-full object-cover" loading="lazy" />
                        ) : (
                          <div class="w-full h-full flex items-center justify-center bg-gray-100/80">
                            <span class="text-gray-300 text-sm font-bold tracking-widest uppercase">Before</span>
                          </div>
                        )}
                        <div class="absolute bottom-2 left-2 bg-black/50 text-white text-[0.6rem] px-2 py-0.5 rounded-full font-bold tracking-wider">BEFORE</div>
                      </div>
                      <div class="w-1/2 relative overflow-hidden">
                        {cs.after_image ? (
                          <img src={cs.after_image} alt={`서울365치과 ${cs.title || cs.tag} 치료 후 사진`} title={`${cs.title || cs.tag} After`} class="w-full h-full object-cover" loading="lazy" />
                        ) : (
                          <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0066FF]/5 to-[#00E5FF]/[0.02]">
                            <span class="text-[#0066FF]/30 text-sm font-bold tracking-widest uppercase">After</span>
                          </div>
                        )}
                        <div class="absolute bottom-2 left-2 bg-[#0066FF]/80 text-white text-[0.6rem] px-2 py-0.5 rounded-full font-bold tracking-wider">AFTER</div>
                      </div>
                    </div>
                  </div>
                  <div class="p-5">
                    <div class="flex items-center gap-2 mb-2.5">
                      <span class="text-[0.7rem] bg-[#0066FF]/8 text-[#0066FF] px-2.5 py-0.5 rounded-full font-semibold">{cs.tag}</span>
                    </div>
                    <h3 class="font-bold text-gray-900 text-[0.95rem] group-hover:text-[#0066FF] transition-colors">{cs.title}</h3>
                    <p class="text-xs text-gray-400 mt-1">담당: {cs.doctor_name}</p>
                  </div>
                </a>
              ))
            ) : (
              /* 폴백: DB에 데이터가 없을 때 기본 표시 */
              [
                { title: '전체임플란트 – 상악 전체 수복', tag: '전체임플란트', doctor: '박준규 대표원장' },
                { title: '디지털풀아치 – 하악 즉시로딩', tag: '디지털풀아치', doctor: '박준규 대표원장' },
                { title: '인비절라인 – 성인 투명교정', tag: '교정', doctor: '하누리 원장' },
              ].map(cs => (
                <a href="/cases/gallery" class="premium-card overflow-hidden group tilt-card electric-card-border block" data-cursor-hover>
                  <div class="aspect-[4/3] bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center relative overflow-hidden">
                    <div class="absolute inset-0 flex">
                      <div class="w-1/2 flex items-center justify-center bg-gray-100/80 border-r border-gray-200/50 group-hover:bg-gray-50 transition-colors">
                        <span class="text-gray-300 text-sm font-bold tracking-widest uppercase">Before</span>
                      </div>
                      <div class="w-1/2 flex items-center justify-center bg-gradient-to-br from-[#0066FF]/5 to-[#00E5FF]/[0.02] group-hover:from-[#0066FF]/10 transition-all">
                        <span class="text-[#0066FF]/30 text-sm font-bold tracking-widest uppercase">After</span>
                      </div>
                    </div>
                  </div>
                  <div class="p-5">
                    <div class="flex items-center gap-2 mb-2.5">
                      <span class="text-[0.7rem] bg-[#0066FF]/8 text-[#0066FF] px-2.5 py-0.5 rounded-full font-semibold">{cs.tag}</span>
                    </div>
                    <h3 class="font-bold text-gray-900 text-[0.95rem] group-hover:text-[#0066FF] transition-colors">{cs.title}</h3>
                    <p class="text-xs text-gray-400 mt-1">담당: {cs.doctor}</p>
                  </div>
                </a>
              ))
            )}
          </div>

          <p class="text-[0.72rem] text-gray-300 text-center mt-10">※ 개인에 따라 치료 결과가 다를 수 있습니다. 모든 사례는 환자 동의 하에 게시되었습니다.</p>
          <div class="text-center mt-4 reveal">
            <a href="/cases/gallery" class="inline-flex items-center gap-1.5 text-[#0066FF] text-sm font-semibold link-underline" data-cursor-hover>전체 사례 보기 <i class="fa-solid fa-arrow-right text-xs"></i></a>
          </div>
        </div>
      </section>

      {/* ===== S8: REVIEWS — ELECTRIC INFINITE SCROLL ===== */}
      <section class="section-lg bg-mesh relative overflow-hidden" aria-label="환자 후기">
        <div class="absolute top-20 left-10 w-[400px] h-[400px] bg-[#0066FF]/[0.03] rounded-full blur-[120px] pointer-events-none morph-blob" style="animation-delay:-6s"></div>
        <div class="max-w-[1400px] mx-auto px-5 md:px-8 relative">
          <div class="text-center mb-16 reveal">
            <span class="section-eyebrow text-[#0066FF] mb-4 block">REVIEWS</span>
            <h2 class="section-headline text-gray-900">환자분들의 <span class="highlight-word">솔직한 후기</span></h2>
          </div>

          {/* Review Scores */}
          <div class="flex flex-wrap justify-center gap-5 mb-14 stagger-children">
            {[
              { platform: '네이버', score: '4.85', icon: 'fa-solid fa-n', color: 'from-green-500 to-green-600' },
              { platform: '구글', score: '4.9', icon: 'fa-brands fa-google', color: 'from-blue-500 to-blue-600' },
              { platform: '만족도', score: '98%', icon: 'fa-solid fa-heart', color: 'from-rose-500 to-rose-600' },
              { platform: '재방문율', score: '87%', icon: 'fa-solid fa-rotate', color: 'from-emerald-500 to-emerald-600' },
            ].map(r => (
              <div class="glass-card px-8 py-6 text-center min-w-[140px] tilt-card">
                <div class={`w-11 h-11 bg-gradient-to-br ${r.color} text-white rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg`}>
                  <i class={r.icon + ' text-sm'}></i>
                </div>
                <p class="text-2xl font-black text-gray-900 tracking-tight">{r.score}</p>
                <p class="text-xs text-gray-400 mt-1 font-medium">{r.platform}</p>
              </div>
            ))}
          </div>

          {/* Infinite scrolling reviews */}
          <div class="marquee-wrapper" style="--marquee-bg: #fafbfd;">
            <div class="reviews-track">
              {[...Array(2)].map(() => (
                <>
                  {[
                    { name: '김O영', text: '스케일링부터 임플란트까지, 자세한 설명과 친절한 진료에 늘 감사드립니다. 365일 진료라 바쁜 직장인에게 최고입니다.', tags: ['스케일링', '친절한 설명'], stars: 5 },
                    { name: '이O수', text: '전체임플란트 수술 받았습니다. 수면진료라 전혀 무섭지 않았고, 자체 기공실이 있어서 보철물 맞춤이 정말 빠르고 정확했습니다.', tags: ['전체임플란트', '수면진료'], stars: 5 },
                    { name: '박O현', text: '인비절라인 교정 중인데, 하누리 원장님이 꼼꼼하게 체크해주시고 예상 결과를 3D로 보여주셔서 믿음이 갑니다.', tags: ['인비절라인', '교정 전문의'], stars: 5 },
                    { name: '최O진', text: '야간에 갑자기 이가 아파서 방문했는데, 21시까지 진료해주셔서 정말 다행이었습니다. 응급 대응도 빠르고 친절하셨어요.', tags: ['야간진료', '응급처치'], stars: 5 },
                    { name: '정O미', text: '아이 충치 치료로 방문했는데, 소아 전문 의료진이 계셔서 아이가 전혀 무서워하지 않았어요. 정말 감사합니다.', tags: ['소아치과', '무통마취'], stars: 5 },
                  ].map(review => (
                    <div class="review-card-premium flex-shrink-0">
                      <div class="flex gap-0.5 mb-3">
                        {Array(review.stars).fill(0).map(() => <i class="fa-solid fa-star text-amber-400 text-xs"></i>)}
                      </div>
                      <p class="text-gray-600 text-[0.9rem] leading-relaxed mb-5">"{review.text}"</p>
                      <div class="flex items-center justify-between">
                        <span class="text-gray-300 text-xs font-medium">{review.name}</span>
                        <div class="flex gap-1.5">
                          {review.tags.map(tag => <span class="text-[0.65rem] bg-[#0066FF]/6 text-[#0066FF] px-2.5 py-0.5 rounded-full font-medium">{tag}</span>)}
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== S9: PRICING PREVIEW — ELECTRIC ===== */}
      <section class="section-lg bg-white relative overflow-hidden">
        <div class="max-w-[1400px] mx-auto px-5 md:px-8 relative">
          <div class="max-w-3xl mx-auto">
            <div class="text-center mb-16 reveal">
              <span class="section-eyebrow text-[#0066FF] mb-4 block">PRICING</span>
              <h2 class="section-headline text-gray-900">투명한 <span class="gradient-text-blue">비용 안내</span></h2>
              <p class="section-body text-gray-400 mt-4">부담 없이 확인하세요.</p>
            </div>

            <div class="premium-card overflow-hidden reveal-3d">
              <div class="overflow-x-auto">
                <table class="w-full text-sm">
                  <thead>
                    <tr class="bg-gradient-to-r from-navy to-navy-lighter text-white/90">
                      <th class="text-left px-6 py-4.5 font-semibold text-[0.82rem]">치료</th>
                      <th class="text-right px-6 py-4.5 font-semibold text-[0.82rem]">가격대</th>
                      <th class="text-right px-6 py-4.5 font-semibold text-[0.82rem] hidden sm:table-cell">보험</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-50">
                    {pricingSummary.slice(0, 8).map((p, i) => (
                      <tr class={`hover:bg-[#0066FF]/[0.02] transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                        <td class="px-6 py-4 text-gray-800 font-medium">{p.treatment}</td>
                        <td class="px-6 py-4 text-right font-bold gradient-text-dark" style="background-size:100% 100%">{p.price}</td>
                        <td class="px-6 py-4 text-right text-gray-400 hidden sm:table-cell text-xs">{p.insurance}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div class="text-center mt-8 reveal">
              <p class="text-[0.72rem] text-gray-300 mb-5">※ 정확한 비용은 정밀 진단 후 안내드립니다. 카드 결제 및 분할 옵션 가능.</p>
              <a href="/info" class="btn-premium btn-premium-outline text-sm px-7 py-3" data-cursor-hover>
                비용 전체 보기 <i class="fa-solid fa-arrow-right text-xs ml-1"></i>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ===== S10: FAQ PREVIEW ===== */}
      <section class="section-lg bg-mesh relative overflow-hidden" aria-label="자주 묻는 질문">
        <div class="max-w-3xl mx-auto px-5 md:px-8">
          <div class="text-center mb-16 reveal">
            <span class="section-eyebrow text-[#0066FF] mb-4 block">FAQ</span>
            <h2 class="section-headline text-gray-900">자주 묻는 질문</h2>
          </div>

          <div class="space-y-3 stagger-children">
            {mainFaq.map(faq => (
              <div class="faq-item">
                <button class="faq-toggle w-full text-left px-6 py-5 flex items-center justify-between hover:bg-gray-50/50 transition-colors" data-cursor-hover>
                  <h3 class="font-semibold text-gray-800 text-[0.95rem] pr-4">{faq.q}</h3>
                  <i class="fa-solid fa-chevron-down text-gray-300 text-sm faq-icon flex-shrink-0"></i>
                </button>
                <div class="hidden px-6 pb-5">
                  <p class="text-gray-500 text-[0.9rem] leading-relaxed">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>

          <div class="text-center mt-10 reveal">
            <a href="/faq" class="inline-flex items-center gap-1.5 text-[#0066FF] text-sm font-semibold link-underline" data-cursor-hover>FAQ 전체 보기 <i class="fa-solid fa-arrow-right text-xs"></i></a>
          </div>
        </div>
      </section>

      {/* ===== S11: CONTENT / COLUMNS — DB 실시간 연동 ===== */}
      <section class="section-lg bg-white">
        <div class="max-w-[1400px] mx-auto px-5 md:px-8">
          <div class="text-center mb-16 reveal">
            <span class="section-eyebrow text-[#0066FF] mb-4 block">COLUMNS</span>
            <h2 class="section-headline text-gray-900">전문 <span class="gradient-text-blue">칼럼</span></h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-5 stagger-children">
            {blogPosts.length > 0 ? (
              blogPosts.map((article: any) => {
                const dateStr = article.created_at ? new Date(article.created_at).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\. /g, '.').replace(/\.$/, '') : '';
                return (
                  <a href={`/blog/${article.slug}`} class="premium-card overflow-hidden group cursor-pointer tilt-card electric-card-border block" data-cursor-hover>
                    <div class="aspect-[16/9] bg-gradient-to-br from-[#0066FF]/[0.06] to-[#00E5FF]/[0.02] flex items-center justify-center overflow-hidden relative">
                      {article.cover_image ? (
                        <img src={article.cover_image} alt={article.title} title={`${article.title} | 서울365치과 블로그`} class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                      ) : (
                        <i class="fa-solid fa-newspaper text-4xl text-[#0066FF]/10 group-hover:text-[#0066FF]/20 group-hover:scale-110 transition-all duration-700"></i>
                      )}
                    </div>
                    <div class="p-5">
                      <div class="flex items-center gap-2 mb-2.5">
                        <span class="text-[0.7rem] bg-[#0066FF]/8 text-[#0066FF] px-2.5 py-0.5 rounded-full font-semibold">{article.category || '일반'}</span>
                        <span class="text-[0.7rem] text-gray-300">{dateStr}</span>
                      </div>
                      <h3 class="font-bold text-gray-900 text-[0.95rem] leading-snug group-hover:text-[#0066FF] transition-colors">{article.title}</h3>
                      {article.excerpt && <p class="text-xs text-gray-400 mt-2 line-clamp-2">{article.excerpt}</p>}
                    </div>
                  </a>
                );
              })
            ) : (
              /* 폴백: DB에 블로그가 없을 때 기본 표시 */
              [
                { title: '전체임플란트, 틀니보다 좋은 이유 5가지', tag: '임플란트', date: '2026.02.15' },
                { title: '치아교정 나이 제한? 성인교정 궁금증 해결', tag: '교정', date: '2026.02.10' },
                { title: '수면진료, 정말 안전한가요?', tag: '수면진료', date: '2026.02.05' },
              ].map(article => (
                <a href="/blog" class="premium-card overflow-hidden group cursor-pointer tilt-card electric-card-border block" data-cursor-hover>
                  <div class="aspect-[16/9] bg-gradient-to-br from-[#0066FF]/[0.06] to-[#00E5FF]/[0.02] flex items-center justify-center overflow-hidden">
                    <i class="fa-solid fa-newspaper text-4xl text-[#0066FF]/10 group-hover:text-[#0066FF]/20 group-hover:scale-110 transition-all duration-700"></i>
                  </div>
                  <div class="p-5">
                    <div class="flex items-center gap-2 mb-2.5">
                      <span class="text-[0.7rem] bg-[#0066FF]/8 text-[#0066FF] px-2.5 py-0.5 rounded-full font-semibold">{article.tag}</span>
                      <span class="text-[0.7rem] text-gray-300">{article.date}</span>
                    </div>
                    <h3 class="font-bold text-gray-900 text-[0.95rem] leading-snug group-hover:text-[#0066FF] transition-colors">{article.title}</h3>
                  </div>
                </a>
              ))
            )}
          </div>

          {blogPosts.length > 0 && (
            <div class="text-center mt-10 reveal">
              <a href="/blog" class="inline-flex items-center gap-1.5 text-[#0066FF] text-sm font-semibold link-underline" data-cursor-hover>블로그 전체 보기 <i class="fa-solid fa-arrow-right text-xs"></i></a>
            </div>
          )}
        </div>
      </section>

      {/* ===== VISION — 3 PROMISES ===== */}
      <section class="section-lg relative overflow-hidden" style="background:#020814;color:white">
        <div class="absolute inset-0" style="background:radial-gradient(at 20% 30%, rgba(0,102,255,0.15) 0, transparent 50%),radial-gradient(at 80% 70%, rgba(0,229,255,0.08) 0, transparent 50%)"></div>
        <div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#0066FF]/20 to-transparent"></div>
        <div class="max-w-[1400px] mx-auto px-5 md:px-8 relative z-10">
          <div class="text-center mb-16 reveal">
            <span class="section-eyebrow text-[#0066FF] mb-4 block">OUR PROMISE</span>
            <h2 class="section-headline text-white">{VISION.headline}</h2>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 stagger-children">
            {VISION.promises.map((p, i) => (
              <div class="p-8 text-center tilt-card" style="background:rgba(0,102,255,0.06);border-radius:1.75rem;border:1px solid rgba(0,102,255,0.1)">
                <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0066FF]/20 to-[#00E5FF]/10 flex items-center justify-center mx-auto mb-6">
                  <i class={`fa-solid ${p.icon} text-[#00E5FF] text-2xl`}></i>
                </div>
                <div class="text-[#0066FF] text-[0.72rem] font-bold tracking-widest mb-2">PROMISE 0{i + 1}</div>
                <h3 class="text-xl font-bold text-white mb-3">{p.title}</h3>
                <p class="text-white/40 text-[0.9rem] leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 3-LINE SUMMARY ===== */}
      <section class="bg-white py-16 md:py-20 relative overflow-hidden">
        <div class="max-w-3xl mx-auto px-5 md:px-8 text-center">
          <div class="space-y-4 reveal">
            {MAIN_SUMMARY.map((line, i) => (
              <p class={`text-lg md:text-xl font-semibold leading-relaxed ${i === 0 ? 'text-[#0066FF]' : 'text-gray-700'}`}>
                {line}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* ===== S12: FINAL CTA — BRAND CTA ===== */}
      <section class="cta-dark section-lg relative">
        {/* Extra electric accents */}
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full morph-blob pointer-events-none" style="background:radial-gradient(circle,rgba(0,102,255,0.15),transparent 60%);animation-delay:-3s"></div>

        <div class="relative z-10 max-w-4xl mx-auto px-5 md:px-8 text-center">
          <div class="reveal-blur">
            <span class="section-eyebrow text-[#0066FF] mb-5 block">CONSULTATION</span>
            <h2 class="section-headline text-white mb-6">
              {MESSAGING.ctaMain.split(',')[0]},<br class="md:hidden" /> <span class="gradient-text-electric">{MESSAGING.ctaMain.split(',').slice(1).join(',').trim()}</span>
            </h2>
            <p class="text-white/35 section-body mb-12">
              {MESSAGING.ctaSub}
            </p>

            <div class="flex flex-wrap justify-center gap-4">
              <a href={CLINIC.phoneTel} class="btn-premium btn-premium-white btn-magnetic px-9 py-4 text-[0.95rem]" data-cursor-hover>
                <i class="fa-solid fa-phone"></i> 전화 상담
              </a>
              <a href={CLINIC.kakao} target="_blank" rel="noopener noreferrer nofollow" class="btn-premium btn-magnetic px-9 py-4 text-[0.95rem]" style="background:#FEE500;color:#3C1E1E;border:none;" data-cursor-hover>
                <i class="fa-solid fa-comment"></i> 카카오톡
              </a>
              <a href={CLINIC.naverBooking} target="_blank" rel="noopener noreferrer nofollow" class="btn-premium btn-premium-fill btn-electric-glow btn-magnetic px-9 py-4 text-[0.95rem]" data-cursor-hover>
                <i class="fa-solid fa-calendar-check"></i> 네이버 예약
              </a>
            </div>

            <p class="text-white/15 text-xs mt-10">{CLINIC.phone} · {CLINIC.address}</p>
          </div>
        </div>
      </section>
    </>,
    {
      title: '서울365치과 | 인천 구월동 임플란트·교정·수면진료 365일 야간진료',
      description: '인천 구월동 서울365치과. 서울대 5인 전문의, 365일·야간21시 진료. 수면진료·자체 기공실. 032-432-0365',
      canonical: 'https://seoul365dc.kr',
      jsonLd: [
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
          "name": "서울365치과 | 인천 구월동 서울대 5인 전문의 치과",
          "description": "치과가 무서워서 미뤄온 분들이 다시는 미루지 않아도 되는 병원.",
          "isPartOf": { "@id": "https://seoul365dc.kr/#website" },
          "about": { "@id": "https://seoul365dc.kr/#dentist" },
          "inLanguage": "ko-KR",
          "datePublished": "2024-01-01",
          "dateModified": new Date().toISOString().split('T')[0],
          "primaryImageOfPage": {
            "@type": "ImageObject",
            "url": "https://seoul365dc.kr/static/og-image.png",
            "width": 1200,
            "height": 630,
            "caption": "서울365치과 인천 구월동 - 서울대 출신 5인 전문의 치과"
          },
          "speakable": {
            "@type": "SpeakableSpecification",
            "cssSelector": ["h1", ".hero-sub", ".section-headline"]
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
          "numberOfItems": 6,
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
        // ItemList — reviews for AEO
        {
          "@context": "https://schema.org",
          "@type": "ItemList",
          "name": "서울365치과 환자 후기",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "item": { "@type": "Review", "reviewBody": "스케일링부터 임플란트까지, 자세한 설명과 친절한 진료에 늘 감사드립니다.", "author": { "@type": "Person", "name": "김O영" }, "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" } } },
            { "@type": "ListItem", "position": 2, "item": { "@type": "Review", "reviewBody": "전체임플란트 수술 받았습니다. 수면진료라 전혀 무섭지 않았고, 자체 기공실이 있어서 보철물 맞춤이 정말 빠르고 정확했습니다.", "author": { "@type": "Person", "name": "이O수" }, "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" } } },
            { "@type": "ListItem", "position": 3, "item": { "@type": "Review", "reviewBody": "인비절라인 교정 중인데, 하누리 원장님이 꼼꼼하게 체크해주시고 예상 결과를 3D로 보여주셔서 믿음이 갑니다.", "author": { "@type": "Person", "name": "박O현" }, "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" } } },
            { "@type": "ListItem", "position": 4, "item": { "@type": "Review", "reviewBody": "야간에 갑자기 이가 아파서 방문했는데, 21시까지 진료해주셔서 정말 다행이었습니다.", "author": { "@type": "Person", "name": "최O진" }, "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" } } },
            { "@type": "ListItem", "position": 5, "item": { "@type": "Review", "reviewBody": "아이 충치 치료로 방문했는데, 소아 전문 의료진이 계셔서 아이가 전혀 무서워하지 않았어요.", "author": { "@type": "Person", "name": "정O미" }, "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" } } },
          ]
        },
        // FAQPage — homepage preview FAQ
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
            { "@type": "Offer", "name": "수면진료", "itemOffered": { "@type": "MedicalProcedure", "name": "수면진료" }, "priceCurrency": "KRW", "description": "잠깐 잠들었다 깨면 치료 완료", "url": "https://seoul365dc.kr/treatments/sedation" },
            { "@type": "Offer", "name": "치아교정", "itemOffered": { "@type": "MedicalProcedure", "name": "치아교정" }, "priceCurrency": "KRW", "description": "인비절라인 투명교정", "url": "https://seoul365dc.kr/treatments/orthodontics" },
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
              "item": { "@type": "Article", "headline": "전체임플란트, 틀니보다 좋은 이유 5가지", "datePublished": "2026-02-15", "author": { "@type": "Physician", "name": "박준규" }, "publisher": { "@id": "https://seoul365dc.kr/#dentist" }, "articleSection": "임플란트", "inLanguage": "ko-KR" }
            },
            {
              "@type": "ListItem", "position": 2,
              "item": { "@type": "Article", "headline": "치아교정 나이 제한? 성인교정 궁금증 해결", "datePublished": "2026-02-10", "author": { "@type": "Physician", "name": "하누리" }, "publisher": { "@id": "https://seoul365dc.kr/#dentist" }, "articleSection": "교정", "inLanguage": "ko-KR" }
            },
            {
              "@type": "ListItem", "position": 3,
              "item": { "@type": "Article", "headline": "수면진료, 정말 안전한가요?", "datePublished": "2026-02-05", "author": { "@type": "Physician", "name": "박준규" }, "publisher": { "@id": "https://seoul365dc.kr/#dentist" }, "articleSection": "수면진료", "inLanguage": "ko-KR" }
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
        // LocalBusiness with action — triggers rich results
        {
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "name": "서울365치과의원",
          "image": "https://seoul365dc.kr/static/og-image.png",
          "telephone": "+82-32-432-0365",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "예술로 138 이토타워 2층 212호",
            "addressLocality": "인천광역시 남동구",
            "postalCode": "21556",
            "addressCountry": "KR"
          },
          "geo": { "@type": "GeoCoordinates", "latitude": "37.4482", "longitude": "126.7042" },
          "openingHoursSpecification": [
            { "@type": "OpeningHoursSpecification", "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday"], "opens": "10:00", "closes": "21:00" },
            { "@type": "OpeningHoursSpecification", "dayOfWeek": "Friday", "opens": "10:00", "closes": "19:00" },
            { "@type": "OpeningHoursSpecification", "dayOfWeek": "Saturday", "opens": "10:00", "closes": "14:00" },
            { "@type": "OpeningHoursSpecification", "dayOfWeek": "Sunday", "opens": "14:00", "closes": "18:00" },
          ],
          "priceRange": "₩₩~₩₩₩",
          "potentialAction": {
            "@type": "OrderAction",
            "target": { "@type": "EntryPoint", "urlTemplate": "https://seoul365dc.kr/reservation", "actionPlatform": ["http://schema.org/DesktopWebPlatform", "http://schema.org/MobileWebPlatform"] },
            "deliveryMethod": "http://purl.org/goodrelations/v1#DeliveryModeOwnFleet",
          },
          "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.9", "bestRating": "5", "ratingCount": "2150", "reviewCount": "1840" },
        },
      ]
    }
  )
})

export default home
