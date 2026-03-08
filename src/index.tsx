import { Hono } from 'hono'
import { renderer } from './renderer'
import { CLINIC, STATS, DIFF_CARDS, HOURS } from './data/clinic'
import { doctors, getDoctorBySlug } from './data/doctors'
import { treatments, getTreatmentBySlug, treatmentCategories } from './data/treatments'
import { mainFaq, pricingData } from './data/faq'
import { MESSAGING, MISSION, VISION, MAIN_SUMMARY, DIFF_COPY, PERSONAS, TREATMENT_EMPATHY, DOCTOR_STORIES, SLOGANS } from './data/brand'
import { hashPassword, verifyPassword, generateSessionId, getSessionCookie, clearSessionCookie, getCurrentUser } from './lib/auth'

type Bindings = { DB: D1Database }

const app = new Hono<{ Bindings: Bindings }>()
app.use(renderer)

// ============================================================
// HOME PAGE — SHOCK EDITION v3
// ============================================================
app.get('/', (c) => {
  const topTreatments = treatments.filter(t =>
    ['full-implant','all-on-x','orthodontics','sedation','cosmetic','implant'].includes(t.slug)
  );

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

              {/* Top Bar — Status + Location */}
              <div class="flex items-center gap-3 mb-10 reveal" style="transition-delay:0.2s">
                <div class="glass trust-badge text-white/90" data-status>
                  <span class="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                  <span class="font-semibold">진료중</span>
                </div>
                <span class="text-[#0066FF]/25 text-xs">|</span>
                <span class="text-white/25 text-xs font-medium tracking-wider">인천 구월동 · 예술회관역 5번 출구 250m</span>
              </div>

              {/* Philosophy Badge */}
              <div class="reveal mb-7" style="transition-delay:0.35s">
                <span class="inline-flex items-center gap-2 text-[0.68rem] tracking-[0.25em] uppercase font-bold text-[#00E5FF]/70 px-4 py-2 rounded-full border border-[#00E5FF]/15 bg-[#00E5FF]/[0.04]">
                  <span class="w-1.5 h-1.5 bg-[#00E5FF] rounded-full"></span>
                  {MESSAGING.heroPhilosophy}
                </span>
              </div>

              {/* H1 — 3-Line Emotional Headline */}
              <h1 class="reveal" style="transition-delay:0.5s">
                <span class="block text-white/40 mb-1" style="font-size:clamp(2rem,5.5vw,4.2rem);line-height:1.08;letter-spacing:-0.04em;font-weight:800">
                  {MESSAGING.heroLine1}
                </span>
                <span class="block text-white/60 mb-2" style="font-size:clamp(2rem,5.5vw,4.2rem);line-height:1.08;letter-spacing:-0.04em;font-weight:800">
                  {MESSAGING.heroLine2}
                </span>
                <span class="block gradient-text-electric" style="font-size:clamp(2.3rem,6.5vw,5rem);line-height:1.02;letter-spacing:-0.05em;font-weight:900">
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
      <section class="relative w-full overflow-hidden bg-black" style="height:100vh;max-height:900px;min-height:500px" id="video-section" aria-label="서울365치과 소개 영상">
        {/* YouTube iframe will be injected by JS when section enters viewport */}
        <div id="yt-player-wrap" class="absolute inset-0 z-0" style="pointer-events:none"></div>

        {/* Poster fallback — always visible until video plays */}
        <div id="yt-poster" class="absolute inset-0 z-0 bg-cover bg-center transition-opacity duration-1000" style={`background-image:url(https://img.youtube.com/vi/gB_yiatcwAc/maxresdefault.jpg)`}>
          <div class="absolute inset-0 bg-black/40"></div>
        </div>

        {/* Gradient overlays for readability */}
        <div class="absolute inset-0 z-[1] bg-gradient-to-b from-black/60 via-black/20 to-black/70 pointer-events-none"></div>
        <div class="absolute inset-0 z-[1] bg-gradient-to-r from-black/30 via-transparent to-black/30 pointer-events-none"></div>

        {/* Content overlay */}
        <div class="relative z-[2] h-full flex flex-col justify-end items-start max-w-[1400px] mx-auto px-5 md:px-8 pb-16 md:pb-20">
          {/* Brand copy on video */}
          <div class="reveal" style="transition-delay:0.3s">
            <span class="inline-flex items-center gap-2 text-[#00E5FF] text-[0.72rem] font-bold tracking-[0.25em] uppercase mb-4">
              <span class="w-8 h-px bg-[#00E5FF]"></span> CLINIC TOUR
            </span>
            <h2 class="text-white text-2xl md:text-4xl lg:text-5xl font-bold leading-tight mb-3" style="text-shadow:0 2px 20px rgba(0,0,0,0.5)">
              직접 보시면<br class="md:hidden" /> <span class="gradient-text-electric">더 안심됩니다.</span>
            </h2>
            <p class="text-white/40 text-sm md:text-base max-w-lg mb-6" style="text-shadow:0 1px 10px rgba(0,0,0,0.5)">
              서울365치과의 진료 환경을 영상으로 먼저 확인하세요.
            </p>
          </div>

          {/* Sound toggle + CTA */}
          <div class="flex items-center gap-4 reveal" style="transition-delay:0.5s">
            <button id="yt-sound-toggle" class="group flex items-center gap-2.5 text-white/50 hover:text-white transition-all text-sm" style="pointer-events:all" data-cursor-hover>
              <div class="w-11 h-11 rounded-full border border-white/20 bg-white/[0.06] backdrop-blur-sm flex items-center justify-center group-hover:border-[#0066FF]/50 group-hover:bg-[#0066FF]/10 transition-all">
                <i id="yt-sound-icon" class="fa-solid fa-volume-xmark text-sm"></i>
              </div>
              <span id="yt-sound-label" class="hidden md:inline font-medium">소리 켜기</span>
            </button>
            <a href="/reservation" class="btn-premium btn-premium-fill text-sm px-7 py-3" style="pointer-events:all" data-cursor-hover>
              <i class="fa-solid fa-calendar-check text-xs"></i> 상담 예약하기
            </a>
          </div>
        </div>

        {/* Scroll hint at bottom */}
        <div class="absolute bottom-4 left-1/2 -translate-x-1/2 z-[2] text-white/10">
          <i class="fa-solid fa-chevron-down text-xs animate-bounce"></i>
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
                    <img src="/static/dr-park-profile.jpg" alt={doctors[0].name} class="w-full h-full object-cover object-[center_20%]" loading="lazy" />
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

      {/* ===== S7: BEFORE/AFTER — ELECTRIC ===== */}
      <section class="section-lg bg-white relative overflow-hidden" aria-label="치료 전후 사례">
        <div class="max-w-[1400px] mx-auto px-5 md:px-8">
          <div class="text-center mb-16 reveal">
            <span class="section-eyebrow text-[#0066FF] mb-4 block">BEFORE &amp; AFTER</span>
            <h2 class="section-headline text-gray-900">치료 <span class="gradient-text-blue">사례</span></h2>
            <p class="section-body text-gray-400 mt-5 max-w-xl mx-auto">실제 치료 사례로 결과를 확인하세요.</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-5 stagger-children">
            {[
              { title: '전체임플란트 – 상악 전체 수복', tag: '전체임플란트', doctor: '박준규 대표원장' },
              { title: '올온X – 하악 즉시로딩', tag: '올온X', doctor: '박준규 대표원장' },
              { title: '인비절라인 – 성인 투명교정', tag: '교정', doctor: '하누리 원장' },
            ].map(cs => (
              <div class="premium-card overflow-hidden group tilt-card electric-card-border" data-cursor-hover>
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
                  <h3 class="font-bold text-gray-900 text-[0.95rem]">{cs.title}</h3>
                  <p class="text-xs text-gray-400 mt-1">담당: {cs.doctor}</p>
                </div>
              </div>
            ))}
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
                    {pricingData.slice(0, 7).map((p, i) => (
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
              <a href="/pricing" class="btn-premium btn-premium-outline text-sm px-7 py-3" data-cursor-hover>
                비용 전체 보기 <i class="fa-solid fa-arrow-right text-xs ml-1"></i>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ===== S10: FAQ PREVIEW ===== */}
      <section class="section-lg bg-mesh relative overflow-hidden" itemscope itemtype="https://schema.org/FAQPage" aria-label="자주 묻는 질문">
        <div class="max-w-3xl mx-auto px-5 md:px-8">
          <div class="text-center mb-16 reveal">
            <span class="section-eyebrow text-[#0066FF] mb-4 block">FAQ</span>
            <h2 class="section-headline text-gray-900">자주 묻는 질문</h2>
          </div>

          <div class="space-y-3 stagger-children">
            {mainFaq.map(faq => (
              <div class="faq-item" itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
                <button class="faq-toggle w-full text-left px-6 py-5 flex items-center justify-between hover:bg-gray-50/50 transition-colors" data-cursor-hover>
                  <h3 class="font-semibold text-gray-800 text-[0.95rem] pr-4" itemprop="name">{faq.q}</h3>
                  <i class="fa-solid fa-chevron-down text-gray-300 text-sm faq-icon flex-shrink-0"></i>
                </button>
                <div class="hidden px-6 pb-5" itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
                  <p class="text-gray-500 text-[0.9rem] leading-relaxed" itemprop="text">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>

          <div class="text-center mt-10 reveal">
            <a href="/faq" class="inline-flex items-center gap-1.5 text-[#0066FF] text-sm font-semibold link-underline" data-cursor-hover>FAQ 전체 보기 <i class="fa-solid fa-arrow-right text-xs"></i></a>
          </div>
        </div>
      </section>

      {/* ===== S11: CONTENT / COLUMNS — ELECTRIC ===== */}
      <section class="section-lg bg-white">
        <div class="max-w-[1400px] mx-auto px-5 md:px-8">
          <div class="text-center mb-16 reveal">
            <span class="section-eyebrow text-[#0066FF] mb-4 block">COLUMNS</span>
            <h2 class="section-headline text-gray-900">전문 <span class="gradient-text-blue">칼럼</span></h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-5 stagger-children">
            {[
              { title: '전체임플란트, 틀니보다 좋은 이유 5가지', tag: '임플란트', date: '2026.02.15' },
              { title: '치아교정 나이 제한? 성인교정 궁금증 해결', tag: '교정', date: '2026.02.10' },
              { title: '수면진료, 정말 안전한가요?', tag: '수면진료', date: '2026.02.05' },
            ].map(article => (
              <div class="premium-card overflow-hidden group cursor-pointer tilt-card electric-card-border" data-cursor-hover>
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
              </div>
            ))}
          </div>
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
              <a href={CLINIC.kakao} target="_blank" rel="noopener" class="btn-premium btn-magnetic px-9 py-4 text-[0.95rem]" style="background:#FEE500;color:#3C1E1E;border:none;" data-cursor-hover>
                <i class="fa-solid fa-comment"></i> 카카오톡
              </a>
              <a href={CLINIC.naverBooking} target="_blank" rel="noopener" class="btn-premium btn-premium-fill btn-electric-glow btn-magnetic px-9 py-4 text-[0.95rem]" data-cursor-hover>
                <i class="fa-solid fa-calendar-check"></i> 네이버 예약
              </a>
            </div>

            <p class="text-white/15 text-xs mt-10">{CLINIC.phone} · {CLINIC.address}</p>
          </div>
        </div>
      </section>
    </>,
    {
      title: '서울365치과 | 치과가 무서워서 미뤄온 당신에게 - 인천 구월동 임플란트·교정·수면진료',
      description: '치과가 무서워서 미뤄온 분들이 다시는 미루지 않아도 되는 병원. 서울대 출신 5인 원장 협진, 마취가 안 되면 절대 시작하지 않습니다. 365일 진료, 야간 21시, 자체 기공실, 수면진료. 인천 구월동 예술회관역. 032-432-0365',
      canonical: 'https://seoul365dental.com',
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [{
          "@type": "ListItem",
          "position": 1,
          "name": "서울365치과",
          "item": "https://seoul365dental.com"
        }]
      }
    }
  )
})

// ============================================================
// TREATMENTS LIST
// ============================================================
app.get('/treatments', (c) => {
  return c.render(
    <>
      <section class="treatment-hero">
        <div class="relative z-10 max-w-[1400px] mx-auto px-5 md:px-8 py-28 md:py-36">
          <nav class="text-sm text-white/25 mb-6 reveal" style="transition-delay:0.2s">
            <a href="/" class="hover:text-white transition-colors">홈</a>
            <i class="fa-solid fa-chevron-right text-[0.6rem] mx-2 text-white/10"></i>
            <span class="text-white/60">전체 진료</span>
          </nav>
          <h1 class="section-headline text-white mb-4 reveal" style="transition-delay:0.4s">서울365치과 전체 진료 안내</h1>
          <p class="hero-sub text-white/35 max-w-xl reveal" style="transition-delay:0.6s">각 분야 전문의가 최적의 치료를 제안합니다.</p>
        </div>
      </section>

      <section class="section-lg bg-mesh">
        <div class="max-w-[1400px] mx-auto px-5 md:px-8">
          {treatmentCategories.map(cat => (
            <div class="mb-16 last:mb-0">
              <div class="flex items-center gap-3 mb-7 reveal">
                <div class="icon-circle icon-circle-sm">
                  <i class={`fa-solid ${cat.icon}`}></i>
                </div>
                <h2 class="text-xl font-bold text-gray-900">{cat.name}</h2>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 stagger-children">
                {cat.treatments.map(t => (
                  <a href={`/treatments/${t.slug}`} class="glass-card p-5 group block" data-cursor-hover>
                    <div class="flex items-center gap-3">
                      <div class="icon-circle icon-circle-sm flex-shrink-0">
                        <i class={`fa-solid ${t.icon} text-sm`}></i>
                      </div>
                      <div class="min-w-0">
                        <h3 class="font-bold text-gray-900 text-sm group-hover:text-[#0066FF] transition-colors truncate">{t.name}</h3>
                        <p class="text-xs text-gray-400 truncate">{t.shortDesc}</p>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>,
    {
      title: '전체 진료 안내 | 서울365치과 인천 구월동 - 임플란트·교정·수면진료·심미치료',
      description: '서울365치과 전체 진료 안내. 전체임플란트, 올온X, 치아교정, 인비절라인, 수면진료, 심미치료, 충치·신경치료, 소아치과 등. 서울대 출신 5인 전문의 협진. 032-432-0365',
      canonical: 'https://seoul365dental.com/treatments',
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "홈", "item": "https://seoul365dental.com" },
          { "@type": "ListItem", "position": 2, "name": "전체 진료", "item": "https://seoul365dental.com/treatments" }
        ]
      }
    }
  )
})

// ============================================================
// TREATMENT DETAIL
// ============================================================
app.get('/treatments/:slug', (c) => {
  const slug = c.req.param('slug');
  const t = getTreatmentBySlug(slug);
  if (!t) return c.notFound();
  const empathy = TREATMENT_EMPATHY[slug];

  return c.render(
    <>
      {/* Hero — Persona-based Empathy */}
      <section class="treatment-hero">
        <div class="relative z-10 max-w-[1400px] mx-auto px-5 md:px-8 py-28 md:py-36">
          <nav class="text-sm text-white/25 mb-6 reveal" style="transition-delay:0.2s">
            <a href="/" class="hover:text-white transition-colors">홈</a>
            <i class="fa-solid fa-chevron-right text-[0.6rem] mx-2 text-white/10"></i>
            <a href="/treatments" class="hover:text-white transition-colors">진료안내</a>
            <i class="fa-solid fa-chevron-right text-[0.6rem] mx-2 text-white/10"></i>
            <span class="text-white/60">{t.name}</span>
          </nav>
          {empathy ? (
            <>
              <h1 class="hero-display text-white mb-5 reveal" style="font-size:clamp(2rem,6vw,4.5rem);transition-delay:0.4s;white-space:pre-line">{empathy.heroTagline}</h1>
              <p class="hero-sub text-white/40 max-w-2xl mb-8 reveal" style="transition-delay:0.6s">{empathy.heroSub}</p>
            </>
          ) : (
            <>
              <h1 class="hero-display text-white mb-5 reveal" style="font-size:clamp(2rem,6vw,4.5rem);transition-delay:0.4s">{t.heroTitle}</h1>
              <p class="hero-sub text-white/35 max-w-2xl mb-8 reveal" style="transition-delay:0.6s">{t.heroSub}</p>
            </>
          )}
          <div class="flex flex-wrap gap-3 reveal" style="transition-delay:0.8s">
            <a href="/reservation" class="btn-premium btn-premium-fill" data-cursor-hover><i class="fa-solid fa-calendar-check"></i> 상담 예약</a>
            <a href="/pricing" class="btn-premium btn-premium-white" data-cursor-hover><i class="fa-solid fa-won-sign"></i> 비용 안내</a>
          </div>
        </div>
      </section>

      {/* Concerns */}
      <section class="section-lg bg-mesh">
        <div class="max-w-4xl mx-auto px-5 md:px-8">
          <div class="text-center mb-14 reveal">
            <span class="section-eyebrow text-[#0066FF] mb-3 block">FOR YOU</span>
            <h2 class="section-sub-headline text-gray-900">{t.name}, 이런 고민 있으신가요?</h2>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 stagger-children">
            {t.concerns.map(concern => (
              <div class="glass-card p-5 flex items-start gap-3">
                <div class="w-8 h-8 rounded-lg bg-[#0066FF]/8 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <i class="fa-solid fa-circle-check text-[#0066FF] text-sm"></i>
                </div>
                <p class="text-gray-700 text-[0.9rem] leading-relaxed">{concern}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Types */}
      <section class="section-lg bg-white">
        <div class="max-w-[1400px] mx-auto px-5 md:px-8">
          <div class="text-center mb-14 reveal">
            <span class="section-eyebrow text-[#0066FF] mb-3 block">TYPES</span>
            <h2 class="section-sub-headline text-gray-900">서울365치과 {t.name} 종류</h2>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-5 stagger-children">
            {t.types.map(type => (
              <div class="premium-card p-7 tilt-card">
                <h3 class="font-bold text-gray-900 text-lg mb-3">{type.name}</h3>
                <p class="text-gray-500 text-[0.9rem] leading-relaxed">{type.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section class="section-lg bg-mesh">
        <div class="max-w-[1400px] mx-auto px-5 md:px-8">
          <div class="text-center mb-14 reveal">
            <span class="section-eyebrow text-[#0066FF] mb-3 block">WHY US</span>
            <h2 class="section-sub-headline text-gray-900">왜 서울365치과의 {t.name}인가요?</h2>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children">
            {t.whyUs.map(w => (
              <div class="glass-card p-7 group tilt-card">
                <div class="icon-circle mb-5">
                  <i class={`fa-solid ${w.icon}`}></i>
                </div>
                <h3 class="font-bold text-gray-900 mb-2 group-hover:text-[#0066FF] transition-colors">{w.title}</h3>
                <p class="text-gray-500 text-[0.9rem] leading-relaxed">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section class="section-lg bg-white" itemscope itemtype="https://schema.org/HowTo">
        <meta itemprop="name" content={`${t.name} 치료 과정`} />
        <meta itemprop="description" content={`서울365치과의 ${t.name} 치료는 다음 단계로 진행됩니다.`} />
        <meta itemprop="totalTime" content="PT1H" />
        <div class="max-w-3xl mx-auto px-5 md:px-8">
          <div class="text-center mb-14 reveal">
            <span class="section-eyebrow text-[#0066FF] mb-3 block">PROCESS</span>
            <h2 class="section-sub-headline text-gray-900">{t.name} 치료 과정</h2>
          </div>
          <div class="space-y-0 stagger-children">
            {t.process.map((step, i) => (
              <div class="timeline-line flex gap-5 pb-8" itemprop="step" itemscope itemtype="https://schema.org/HowToStep">
                <meta itemprop="position" content={String(i + 1)} />
                <div class="timeline-dot" aria-label={`${i + 1}단계`}>{i + 1}</div>
                <div class="pt-3">
                  <h3 class="font-bold text-gray-900" itemprop="name">{step.step}</h3>
                  {step.desc && <p class="text-gray-500 text-sm mt-1" itemprop="text">{step.desc}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section class="section-lg bg-white" itemscope itemtype="https://schema.org/FAQPage">
        <div class="max-w-3xl mx-auto px-5 md:px-8">
          <div class="text-center mb-14 reveal">
            <span class="section-eyebrow text-[#0066FF] mb-3 block">FAQ</span>
            <h2 class="section-sub-headline text-gray-900">{t.name} 자주 묻는 질문</h2>
          </div>
          <div class="space-y-3 stagger-children">
            {t.faq.map(faq => (
              <div class="faq-item" itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
                <button class="faq-toggle w-full text-left px-6 py-5 flex items-center justify-between hover:bg-gray-50/50 transition-colors" data-cursor-hover>
                  <h3 class="font-semibold text-gray-800 text-[0.9rem] pr-4" itemprop="name">{faq.q}</h3>
                  <i class="fa-solid fa-chevron-down text-gray-300 text-sm faq-icon flex-shrink-0"></i>
                </button>
                <div class="hidden px-6 pb-5" itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
                  <p class="text-gray-500 text-[0.9rem] leading-relaxed" itemprop="text">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section class="cta-dark section-md">
        <div class="relative z-10 max-w-4xl mx-auto px-5 md:px-8 text-center reveal-blur">
          <h2 class="text-2xl md:text-3xl font-bold text-white mb-4">지금 바로 상담 예약하세요</h2>
          <p class="text-white/35 mb-8">{t.name}에 대해 자세히 상담받아 보세요.</p>
          <div class="flex flex-wrap justify-center gap-3">
            <a href={CLINIC.phoneTel} class="btn-premium btn-premium-white" data-cursor-hover><i class="fa-solid fa-phone"></i> 전화 상담</a>
            <a href={CLINIC.kakao} target="_blank" rel="noopener" class="btn-premium" style="background:#FEE500;color:#3C1E1E;border:none;" data-cursor-hover><i class="fa-solid fa-comment"></i> 카카오톡</a>
            <a href="/reservation" class="btn-premium btn-premium-fill" data-cursor-hover><i class="fa-solid fa-calendar-check"></i> 예약하기</a>
          </div>
        </div>
      </section>
    </>,
    {
      title: t.metaTitle,
      description: t.metaDesc,
      canonical: `https://seoul365dental.com/treatments/${t.slug}`,
      jsonLd: [
        {
          "@context": "https://schema.org", "@type": "MedicalProcedure",
          "name": t.name,
          "procedureType": t.slug.includes('orthodontic') || t.slug.includes('invisalign') ? "NonSurgicalProcedure" : "SurgicalProcedure",
          "bodyLocation": "Oral cavity",
          "description": t.metaDesc,
          "howPerformed": t.process?.map((s: any) => s.step).join(' → '),
          "preparation": "정밀 CT 촬영 및 디지털 스캔 진단",
          "followup": "정기 검진 및 유지 관리",
          "status": "EventScheduled",
        },
        {
          "@context": "https://schema.org", "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "홈", "item": "https://seoul365dental.com" },
            { "@type": "ListItem", "position": 2, "name": "진료안내", "item": "https://seoul365dental.com/treatments" },
            { "@type": "ListItem", "position": 3, "name": t.name, "item": `https://seoul365dental.com/treatments/${t.slug}` }
          ]
        },
        ...(t.faq ? [{
          "@context": "https://schema.org", "@type": "FAQPage",
          "mainEntity": t.faq.map((f: any) => ({
            "@type": "Question", "name": f.q,
            "acceptedAnswer": { "@type": "Answer", "text": f.a }
          }))
        }] : [])
      ]
    }
  )
})

// ============================================================
// DOCTORS LIST
// ============================================================
app.get('/doctors', (c) => {
  return c.render(
    <>
      <section class="relative overflow-hidden" style="min-height:clamp(480px,60vw,700px)">
        {/* Team Photo Background — full visible */}
        <div class="absolute inset-0 z-0">
          <img src="/static/team-photo.jpg" alt="서울365치과 의료진 단체사진" class="w-full h-full object-cover object-center" loading="eager" />
          <div class="absolute inset-0" style="background:linear-gradient(to top, #040B18 0%, rgba(4,11,24,0.7) 30%, rgba(4,11,24,0.35) 60%, rgba(4,11,24,0.5) 100%)"></div>
        </div>
        <div class="relative z-10 max-w-[1400px] mx-auto px-5 md:px-8 pt-28 md:pt-36 pb-12">
          <nav class="text-sm text-white/25 mb-6 reveal" style="transition-delay:0.2s">
            <a href="/" class="hover:text-white transition-colors">홈</a>
            <i class="fa-solid fa-chevron-right text-[0.6rem] mx-2 text-white/10"></i>
            <span class="text-white/60">의료진</span>
          </nav>
          <h1 class="section-headline text-white mb-4 reveal" style="transition-delay:0.4s;text-shadow:0 2px 20px rgba(0,0,0,0.5)">서울365치과 의료진 소개</h1>
          <p class="hero-sub text-white/60 max-w-xl reveal" style="transition-delay:0.6s;text-shadow:0 1px 10px rgba(0,0,0,0.5)">서울대 출신 5인 원장이 하나의 케이스를 함께 봅니다.</p>
          <p class="text-white/30 text-sm mt-4 reveal" style="transition-delay:0.75s">
            <i class="fa-solid fa-users text-[#0066FF]/50 mr-2"></i>원장 5인 · 전문 스태프 20여 명이 함께합니다.
          </p>
        </div>
      </section>

      <section class="section-lg bg-mesh">
        <div class="max-w-[1400px] mx-auto px-5 md:px-8">
          {/* Lead doctor */}
          <div class="premium-card overflow-hidden mb-10 reveal-3d">
            <div class="md:flex">
              <div class="md:w-2/5 bg-gradient-to-br from-[#0066FF]/10 to-[#00E5FF]/[0.02] p-10 flex items-center justify-center min-h-[360px]">
                <div class="text-center">
                  <div class="w-40 h-40 rounded-full mx-auto mb-5 overflow-hidden border-2 border-[#0066FF]/15" style="box-shadow:0 0 30px rgba(0,102,255,0.1)">
                    <img src="/static/dr-park-profile.jpg" alt="박준규 대표원장" class="w-full h-full object-cover object-[center_20%]" loading="lazy" />
                  </div>
                  <h2 class="text-2xl font-bold text-gray-900">박준규 대표원장</h2>
                  <p class="text-[#0066FF] font-semibold text-sm mt-1">통합치의학과 전문의</p>
                  <div class="flex flex-wrap justify-center gap-2 mt-4">
                    {doctors[0].specialties.map(s => <span class="text-[0.7rem] bg-[#0066FF]/8 text-[#0066FF] px-3 py-1 rounded-full font-medium">{s}</span>)}
                  </div>
                </div>
              </div>
              <div class="md:w-3/5 p-8 md:p-10">
                <blockquote class="text-lg text-gray-600 italic border-l-3 border-[#0066FF] pl-5 mb-8 leading-relaxed" style="border-left-width:3px">
                  "{doctors[0].philosophy}"
                </blockquote>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                  <div>
                    <h3 class="font-bold text-gray-900 mb-3 flex items-center gap-2"><i class="fa-solid fa-graduation-cap text-[#0066FF] text-sm"></i> 학력</h3>
                    <ul class="space-y-2">{doctors[0].education.map(e => <li class="text-gray-500 flex items-start gap-2"><span class="w-1 h-1 bg-[#0066FF] rounded-full mt-2 flex-shrink-0"></span>{e}</li>)}</ul>
                  </div>
                  <div>
                    <h3 class="font-bold text-gray-900 mb-3 flex items-center gap-2"><i class="fa-solid fa-certificate text-[#0066FF] text-sm"></i> 자격</h3>
                    <ul class="space-y-2">{doctors[0].credentials.slice(0,3).map(e => <li class="text-gray-500 flex items-start gap-2"><span class="w-1 h-1 bg-[#0066FF] rounded-full mt-2 flex-shrink-0"></span>{e}</li>)}</ul>
                  </div>
                </div>
                <a href="/doctors/park-junkyu" class="btn-premium btn-premium-fill mt-8 text-sm px-6 py-3" data-cursor-hover>프로필 상세 보기</a>
              </div>
            </div>
          </div>

          {/* Other doctors */}
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5 stagger-children">
            {doctors.slice(1).map(doc => (
              <a href={`/doctors/${doc.slug}`} class="glass-card p-6 block md:flex gap-5 items-start group" data-cursor-hover>
                <div class="w-20 h-20 rounded-full bg-[#0066FF]/8 flex items-center justify-center flex-shrink-0 mx-auto md:mx-0 mb-4 md:mb-0 group-hover:bg-[#0066FF]/15 transition-colors">
                  <i class="fa-solid fa-user-doctor text-2xl text-[#0066FF]/40 group-hover:text-[#0066FF]/60 transition-colors"></i>
                </div>
                <div class="text-center md:text-left">
                  <h2 class="font-bold text-gray-900 text-lg">{doc.name} <span class="text-gray-400 font-normal text-sm">{doc.title}</span></h2>
                  <p class="text-sm text-gray-400 mt-1">{doc.specialties.join(' · ')}</p>
                  <p class="text-sm text-gray-500 mt-3 italic leading-relaxed">"{doc.philosophy.split('.')[0]}."</p>
                  <span class="inline-flex items-center gap-1.5 text-[#0066FF] text-sm font-semibold mt-3 link-underline">프로필 보기 <i class="fa-solid fa-arrow-right text-xs"></i></span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>,
    {
      title: '의료진 소개 | 서울365치과 - 서울대 출신 5인 전문의 인천 구월동',
      description: '서울365치과 의료진 소개. 서울대학교 치과대학 출신 5인 원장이 한 팀으로 협진합니다. 통합치의학, 보존과, 교정과 전문의. 박준규·최다빈·정문희·상세훈·하누리 원장. 032-432-0365',
      canonical: 'https://seoul365dental.com/doctors',
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "홈", "item": "https://seoul365dental.com" },
          { "@type": "ListItem", "position": 2, "name": "의료진", "item": "https://seoul365dental.com/doctors" }
        ]
      }
    }
  )
})

// ============================================================
// DOCTOR PROFILE
// ============================================================
app.get('/doctors/:slug', (c) => {
  const slug = c.req.param('slug');
  const doc = getDoctorBySlug(slug);
  if (!doc) return c.notFound();
  const story = DOCTOR_STORIES[slug];

  return c.render(
    <>
      <section class="treatment-hero">
        <div class="relative z-10 max-w-[1400px] mx-auto px-5 md:px-8 py-28 md:py-36">
          <nav class="text-sm text-white/25 mb-6 reveal" style="transition-delay:0.2s">
            <a href="/" class="hover:text-white transition-colors">홈</a>
            <i class="fa-solid fa-chevron-right text-[0.6rem] mx-2 text-white/10"></i>
            <a href="/doctors" class="hover:text-white transition-colors">의료진</a>
            <i class="fa-solid fa-chevron-right text-[0.6rem] mx-2 text-white/10"></i>
            <span class="text-white/60">{doc.name}</span>
          </nav>
          <div class="md:flex items-center gap-8 reveal" style="transition-delay:0.4s">
            {slug === 'park-junkyu' ? (
              <div class="w-32 h-32 rounded-full overflow-hidden border-2 border-[#0066FF]/20 flex-shrink-0 mx-auto md:mx-0 mb-6 md:mb-0" style="box-shadow:0 0 30px rgba(0,102,255,0.15)">
                <img src="/static/dr-park-profile.jpg" alt={doc.name} class="w-full h-full object-cover object-[center_20%]" loading="lazy" />
              </div>
            ) : (
              <div class="w-32 h-32 rounded-full bg-white/[0.06] border border-white/[0.08] flex items-center justify-center flex-shrink-0 mx-auto md:mx-0 mb-6 md:mb-0">
                <i class="fa-solid fa-user-doctor text-5xl text-white/20"></i>
              </div>
            )}
            <div class="text-center md:text-left">
              <h1 class="text-3xl md:text-4xl font-bold text-white">{doc.h1}</h1>
              {story && (
                <p class="text-[#00E5FF] text-sm font-semibold mt-2 italic">"{story.principle}"</p>
              )}
              <div class="flex flex-wrap justify-center md:justify-start gap-2 mt-4">
                {doc.specialties.map(s => <span class="text-[0.75rem] bg-white/[0.06] text-white/60 px-3 py-1.5 rounded-full border border-white/[0.06]">{s}</span>)}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="section-lg bg-mesh">
        <div class="max-w-4xl mx-auto px-5 md:px-8">
          {/* Story-type Introduction */}
          {story ? (
            <div class="mb-14 reveal">
              <div class="premium-card p-8 md:p-10">
                <h2 class="font-bold text-gray-900 text-lg mb-6 flex items-center gap-2">
                  <i class="fa-solid fa-book-open text-[#0066FF]"></i> 소개
                </h2>
                <div class="text-gray-600 text-[0.95rem] leading-[1.9] space-y-4">
                  {story.storyIntro.split('\n\n').map(paragraph => (
                    <p>{paragraph}</p>
                  ))}
                </div>
                {/* 3-line profile summary */}
                <div class="mt-8 pt-6 border-t border-gray-100">
                  <div class="flex flex-wrap gap-3">
                    {story.profileSummary.map(line => (
                      <div class="flex items-start gap-2 text-sm text-gray-500">
                        <i class="fa-solid fa-check text-[#0066FF] text-xs mt-1 flex-shrink-0"></i>
                        <span>{line}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <blockquote class="text-xl text-gray-600 italic border-l-3 border-[#0066FF] pl-6 mb-14 leading-relaxed reveal" style="border-left-width:3px">
              "{doc.philosophy}"
            </blockquote>
          )}

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 stagger-children">
            <div class="glass-card p-7">
              <h2 class="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2"><i class="fa-solid fa-graduation-cap text-[#0066FF]"></i> 학력</h2>
              <ul class="space-y-2.5">{doc.education.map(e => <li class="text-gray-600 flex items-start gap-2.5 text-[0.9rem]"><span class="w-1 h-1 bg-[#0066FF] rounded-full mt-2.5 flex-shrink-0"></span>{e}</li>)}</ul>
            </div>

            {doc.credentials.length > 0 && (
              <div class="glass-card p-7">
                <h2 class="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2"><i class="fa-solid fa-certificate text-[#0066FF]"></i> 자격/전문의</h2>
                <ul class="space-y-2.5">{doc.credentials.map(e => <li class="text-gray-600 flex items-start gap-2.5 text-[0.9rem]"><span class="w-1 h-1 bg-[#0066FF] rounded-full mt-2.5 flex-shrink-0"></span>{e}</li>)}</ul>
              </div>
            )}

            <div class="glass-card p-7">
              <h2 class="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2"><i class="fa-solid fa-briefcase text-[#0066FF]"></i> 경력</h2>
              <ul class="space-y-2.5">{doc.career.map(e => <li class="text-gray-600 flex items-start gap-2.5 text-[0.9rem]"><span class="w-1 h-1 bg-[#0066FF] rounded-full mt-2.5 flex-shrink-0"></span>{e}</li>)}</ul>
            </div>

            {doc.societies.length > 0 && (
              <div class="glass-card p-7">
                <h2 class="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2"><i class="fa-solid fa-users text-[#0066FF]"></i> 학회</h2>
                <ul class="space-y-2.5">{doc.societies.map(e => <li class="text-gray-600 flex items-start gap-2.5 text-[0.9rem]"><span class="w-1 h-1 bg-[#0066FF] rounded-full mt-2.5 flex-shrink-0"></span>{e}</li>)}</ul>
              </div>
            )}
          </div>

          {/* Treatment Links */}
          <div class="mt-12 reveal">
            <h2 class="font-bold text-gray-900 text-lg mb-5 flex items-center gap-2"><i class="fa-solid fa-stethoscope text-[#0066FF]"></i> 담당 치료</h2>
            <div class="flex flex-wrap gap-3">
              {doc.treatmentLinks.map(link => {
                const treat = getTreatmentBySlug(link.split('/').pop()!);
                return treat ? (
                  <a href={link} class="btn-premium btn-premium-outline text-sm px-5 py-2.5" data-cursor-hover>
                    <i class={`fa-solid ${treat.icon} text-xs`}></i> {treat.name}
                  </a>
                ) : null;
              })}
            </div>
          </div>
        </div>
      </section>

      <section class="cta-dark section-md">
        <div class="relative z-10 max-w-4xl mx-auto px-5 md:px-8 text-center reveal-blur">
          <h2 class="text-2xl md:text-3xl font-bold text-white mb-4">{doc.name} {doc.titleShort}에게 상담받기</h2>
          <div class="flex flex-wrap justify-center gap-3 mt-6">
            <a href={CLINIC.phoneTel} class="btn-premium btn-premium-white" data-cursor-hover><i class="fa-solid fa-phone"></i> 전화 상담</a>
            <a href="/reservation" class="btn-premium btn-premium-fill" data-cursor-hover><i class="fa-solid fa-calendar-check"></i> 예약하기</a>
          </div>
        </div>
      </section>
    </>,
    {
      title: doc.metaTitle,
      description: doc.metaDesc,
      canonical: `https://seoul365dental.com/doctors/${doc.slug}`,
      jsonLd: [
        {
          "@context": "https://schema.org", "@type": "Physician",
          "@id": `https://seoul365dental.com/doctors/${doc.slug}#physician`,
          "name": doc.name, "jobTitle": doc.title,
          "description": doc.philosophy,
          "image": doc.slug === 'park-junkyu' ? 'https://seoul365dental.com/static/dr-park-profile.jpg' : undefined,
          "medicalSpecialty": doc.specialties,
          "alumniOf": { "@type": "CollegeOrUniversity", "name": "서울대학교 치과대학" },
          "worksFor": { "@type": "Dentist", "name": "서울365치과의원", "url": "https://seoul365dental.com" },
          "knowsAbout": doc.specialties,
        },
        {
          "@context": "https://schema.org", "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "홈", "item": "https://seoul365dental.com" },
            { "@type": "ListItem", "position": 2, "name": "의료진", "item": "https://seoul365dental.com/doctors" },
            { "@type": "ListItem", "position": 3, "name": doc.name, "item": `https://seoul365dental.com/doctors/${doc.slug}` }
          ]
        }
      ]
    }
  )
})

// ============================================================
// RESERVATION
// ============================================================
app.get('/reservation', (c) => {
  return c.render(
    <>
      <section class="treatment-hero">
        <div class="relative z-10 max-w-[1400px] mx-auto px-5 md:px-8 py-28 md:py-36">
          <h1 class="section-headline text-white mb-4 reveal" style="transition-delay:0.3s">상담 예약하기</h1>
          <p class="hero-sub text-white/35 reveal" style="transition-delay:0.5s">편하신 방법으로 상담 예약해 주세요.</p>
        </div>
      </section>

      <section class="section-lg bg-mesh">
        <div class="max-w-4xl mx-auto px-5 md:px-8">
          {/* Quick CTAs */}
          <div class="grid grid-cols-1 md:grid-cols-3 gap-5 mb-16 stagger-children">
            <a href={CLINIC.phoneTel} class="glass-card p-8 text-center group block" data-cursor-hover>
              <div class="icon-circle mx-auto mb-4">
                <i class="fa-solid fa-phone"></i>
              </div>
              <h2 class="font-bold text-gray-900 text-lg mb-1 group-hover:text-[#0066FF] transition-colors">전화 상담</h2>
              <p class="text-[#0066FF] font-extrabold text-xl">{CLINIC.phone}</p>
              <p class="text-sm text-gray-400 mt-2">가장 빠른 상담 방법</p>
            </a>
            <a href={CLINIC.kakao} target="_blank" rel="noopener" class="glass-card p-8 text-center group block" data-cursor-hover>
              <div class="w-14 h-14 rounded-2xl bg-yellow-50 flex items-center justify-center mx-auto mb-4 group-hover:bg-yellow-100 transition-colors">
                <i class="fa-solid fa-comment text-yellow-500 text-xl"></i>
              </div>
              <h2 class="font-bold text-gray-900 text-lg mb-1 group-hover:text-[#0066FF] transition-colors">카카오톡 상담</h2>
              <p class="text-yellow-600 font-bold">채팅으로 편하게</p>
              <p class="text-sm text-gray-400 mt-2">사진/영상 전송 가능</p>
            </a>
            <a href={CLINIC.naverBooking} target="_blank" rel="noopener" class="glass-card p-8 text-center group block" data-cursor-hover>
              <div class="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center mx-auto mb-4 group-hover:bg-green-100 transition-colors">
                <i class="fa-solid fa-calendar-check text-green-500 text-xl"></i>
              </div>
              <h2 class="font-bold text-gray-900 text-lg mb-1 group-hover:text-[#0066FF] transition-colors">네이버 예약</h2>
              <p class="text-green-600 font-bold">온라인 간편 예약</p>
              <p class="text-sm text-gray-400 mt-2">원하는 시간 선택</p>
            </a>
          </div>

          {/* Form */}
          <div class="premium-card p-8 md:p-10 reveal-3d">
            <h2 class="text-xl font-bold text-gray-900 mb-8">온라인 상담 신청</h2>
            <form class="space-y-5" onsubmit="event.preventDefault(); alert('상담 신청이 완료되었습니다.');">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">이름 *</label>
                  <input type="text" required class="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF]/30 transition-all text-sm" placeholder="이름을 입력해주세요" />
                </div>
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">연락처 *</label>
                  <input type="tel" required class="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF]/30 transition-all text-sm" placeholder="010-0000-0000" />
                </div>
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">관심 치료</label>
                <select class="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF]/30 transition-all text-sm text-gray-600">
                  <option value="">선택해주세요</option>
                  <option>전체임플란트</option><option>올온X 임플란트</option><option>일반 임플란트</option>
                  <option>치아교정</option><option>인비절라인</option><option>수면진료</option>
                  <option>심미치료</option><option>충치/신경치료</option><option>기타</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">상담 내용</label>
                <textarea rows={4} class="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF]/30 transition-all text-sm resize-none" placeholder="궁금하신 내용을 자유롭게 적어주세요"></textarea>
              </div>
              <div class="flex items-start gap-2.5">
                <input type="checkbox" required class="mt-1 accent-[#0066FF]" id="privacy-agree" />
                <label for="privacy-agree" class="text-sm text-gray-500">
                  <a href="/privacy" class="text-[#0066FF] font-semibold underline underline-offset-2">개인정보처리방침</a>에 동의합니다 *
                </label>
              </div>
              <button type="submit" class="btn-premium btn-premium-fill w-full py-4 text-[0.95rem]" data-cursor-hover>상담 신청하기</button>
            </form>
          </div>
        </div>
      </section>
    </>,
    {
      title: '상담 예약 | 서울365치과 - 전화·카카오톡·온라인 예약',
      description: '서울365치과 상담 예약. 전화(032-432-0365), 카카오톡, 네이버 예약, 온라인 상담 신청. 365일 진료, 야간 21시까지. 인천 구월동 예술회관역.',
      canonical: 'https://seoul365dental.com/reservation',
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "홈", "item": "https://seoul365dental.com" },
          { "@type": "ListItem", "position": 2, "name": "상담 예약", "item": "https://seoul365dental.com/reservation" }
        ]
      }
    }
  )
})

// ============================================================
// PRICING
// ============================================================
app.get('/pricing', (c) => {
  return c.render(
    <>
      <section class="treatment-hero">
        <div class="relative z-10 max-w-[1400px] mx-auto px-5 md:px-8 py-28 md:py-36">
          <nav class="text-sm text-white/25 mb-6 reveal" style="transition-delay:0.2s">
            <a href="/" class="hover:text-white transition-colors">홈</a>
            <i class="fa-solid fa-chevron-right text-[0.6rem] mx-2 text-white/10"></i>
            <span class="text-white/60">비용안내</span>
          </nav>
          <h1 class="section-headline text-white mb-4 reveal" style="transition-delay:0.4s">진료비용 안내</h1>
          <p class="hero-sub text-white/35 reveal" style="transition-delay:0.6s">투명하게 안내드립니다.</p>
        </div>
      </section>

      <section class="section-lg bg-mesh">
        <div class="max-w-4xl mx-auto px-5 md:px-8">
          <div class="premium-card overflow-hidden reveal-3d">
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead>
                  <tr class="bg-gradient-to-r from-navy to-navy-lighter text-white/90">
                    <th class="text-left px-6 py-4 font-semibold text-[0.82rem]">치료 항목</th>
                    <th class="text-right px-6 py-4 font-semibold text-[0.82rem]">가격대</th>
                    <th class="text-right px-6 py-4 font-semibold text-[0.82rem] hidden sm:table-cell">보험 적용</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-50">
                  {pricingData.map((p, i) => (
                    <tr class={`hover:bg-[#0066FF]/[0.02] transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                      <td class="px-6 py-4 text-gray-800 font-medium">{p.treatment}</td>
                      <td class="px-6 py-4 text-right text-[#0066FF] font-bold">{p.price}</td>
                      <td class="px-6 py-4 text-right text-gray-400 hidden sm:table-cell text-xs">{p.insurance}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div class="mt-8 glass-card p-5 reveal">
            <div class="flex items-start gap-3">
              <i class="fa-solid fa-circle-info text-amber-500 mt-0.5"></i>
              <div>
                <p class="text-sm text-gray-600 font-medium">위 가격은 참고용이며, 정확한 비용은 정밀 진단 후 안내드립니다.</p>
                <p class="text-xs text-gray-400 mt-1">카드 결제 및 분할 결제가 가능합니다.</p>
              </div>
            </div>
          </div>

          <div class="text-center mt-10 reveal">
            <a href="/reservation" class="btn-premium btn-premium-fill" data-cursor-hover>비용 상담 예약하기 <i class="fa-solid fa-arrow-right text-xs ml-1"></i></a>
          </div>
        </div>
      </section>
    </>,
    {
      title: '진료비용 안내 | 서울365치과 - 임플란트·교정·심미치료 가격',
      description: '서울365치과 비급여 진료비용 안내. 임플란트, 전체임플란트, 올온X, 인비절라인, 교정, 심미치료, 수면진료 비용. 카드 결제·분할 결제 가능. 정확한 비용은 정밀 진단 후 안내.',
      canonical: 'https://seoul365dental.com/pricing',
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "홈", "item": "https://seoul365dental.com" },
          { "@type": "ListItem", "position": 2, "name": "비용안내", "item": "https://seoul365dental.com/pricing" }
        ]
      }
    }
  )
})

// ============================================================
// DIRECTIONS
// ============================================================
app.get('/directions', (c) => {
  return c.render(
    <>
      <section class="treatment-hero">
        <div class="relative z-10 max-w-[1400px] mx-auto px-5 md:px-8 py-28 md:py-36">
          <nav class="text-sm text-white/25 mb-6 reveal" style="transition-delay:0.2s">
            <a href="/" class="hover:text-white transition-colors">홈</a>
            <i class="fa-solid fa-chevron-right text-[0.6rem] mx-2 text-white/10"></i>
            <span class="text-white/60">오시는길</span>
          </nav>
          <h1 class="section-headline text-white mb-4 reveal" style="transition-delay:0.4s">오시는 길</h1>
          <p class="hero-sub text-white/35 reveal" style="transition-delay:0.6s">예술회관역 5번 출구에서 250m, 이토타워 2층</p>
        </div>
      </section>

      <section class="section-lg bg-mesh">
        <div class="max-w-4xl mx-auto px-5 md:px-8">
          {/* Google Maps Embed */}
          <div class="premium-card overflow-hidden mb-10 reveal-3d" style="aspect-ratio:16/9">
            <iframe
              src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent('서울365치과의원 인천 남동구 예술로 138 이토타워')}&center=${CLINIC.geo.lat},${CLINIC.geo.lng}&zoom=16&language=ko`}
              width="100%" height="100%" style="border:0;min-height:350px" allowfullscreen loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
              title="서울365치과 위치 - 인천 남동구 예술로 138 이토타워 2층">
            </iframe>
          </div>

          {/* Google Maps Link Buttons */}
          <div class="flex flex-wrap justify-center gap-3 mb-10 reveal">
            <a href={`https://www.google.com/maps/search/?api=1&query=${CLINIC.geo.lat},${CLINIC.geo.lng}`}
               target="_blank" rel="noopener"
               class="btn-premium btn-premium-outline text-sm px-6 py-3" data-cursor-hover>
              <i class="fa-brands fa-google text-xs"></i> Google Maps에서 열기
            </a>
            <a href={`https://map.naver.com/p/search/${encodeURIComponent(CLINIC.address)}`}
               target="_blank" rel="noopener"
               class="btn-premium btn-premium-outline text-sm px-6 py-3" style="border-color:#03cf5d40;color:#03cf5d" data-cursor-hover>
              <i class="fa-solid fa-map text-xs"></i> 네이버 지도에서 열기
            </a>
            <a href={`https://map.kakao.com/link/search/${encodeURIComponent(CLINIC.address)}`}
               target="_blank" rel="noopener"
               class="btn-premium btn-premium-outline text-sm px-6 py-3" style="border-color:#FEE50040;color:#3C1E1E" data-cursor-hover>
              <i class="fa-solid fa-location-dot text-xs"></i> 카카오맵에서 열기
            </a>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-5 stagger-children">
            {[
              { icon: 'fa-location-dot', title: '주소', main: CLINIC.address, sub: '(우) 21556' },
              { icon: 'fa-train-subway', title: '지하철', main: '인천 2호선 예술회관역 5번 출구', sub: '도보 약 3분 (250m)' },
              { icon: 'fa-car', title: '주차', main: '이토타워 건물 내 주차장 이용', sub: '진료 시 주차 지원 가능' },
              { icon: 'fa-bus', title: '버스', main: '예술회관역 정류장 하차', sub: '다수 시내버스 이용 가능' },
            ].map(info => (
              <div class="glass-card p-6 tilt-card">
                <div class="flex items-center gap-3 mb-3">
                  <div class="icon-circle icon-circle-sm">
                    <i class={`fa-solid ${info.icon}`}></i>
                  </div>
                  <h2 class="font-bold text-gray-900">{info.title}</h2>
                </div>
                <p class="text-gray-700 text-[0.9rem]">{info.main}</p>
                <p class="text-gray-400 text-xs mt-1">{info.sub}</p>
              </div>
            ))}
          </div>

          <div class="text-center mt-10 reveal">
            <a href={CLINIC.phoneTel} class="btn-premium btn-premium-fill" data-cursor-hover><i class="fa-solid fa-phone"></i> 전화 문의 {CLINIC.phone}</a>
          </div>
        </div>
      </section>
    </>,
    {
      title: '오시는 길 | 서울365치과 - 인천 남동구 예술회관역 5번 출구 250m',
      description: '서울365치과 오시는 길. 인천 남동구 예술로 138 이토타워 2층. 인천2호선 예술회관역 5번 출구 도보 3분(250m). 건물 내 주차장. 032-432-0365',
      canonical: 'https://seoul365dental.com/directions',
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "홈", "item": "https://seoul365dental.com" },
          { "@type": "ListItem", "position": 2, "name": "오시는길", "item": "https://seoul365dental.com/directions" }
        ]
      }
    }
  )
})

// ============================================================
// FAQ
// ============================================================
app.get('/faq', (c) => {
  const allFaq = [
    ...mainFaq,
    { q: '예약은 어떻게 하나요?', a: '전화(032-432-0365), 카카오톡, 네이버 예약 모두 가능합니다.' },
    { q: '응급 상황에 방문해도 되나요?', a: '네, 365일 진료하므로 갑작스러운 치통이나 외상 시 바로 내원하세요.' },
    { q: '분할 결제가 가능한가요?', a: '네, 카드 분할 결제가 가능합니다.' },
    { q: '첫 방문 시 무엇을 준비해야 하나요?', a: '신분증과 건강보험증을 지참해 주세요.' },
  ];

  return c.render(
    <>
      <section class="treatment-hero">
        <div class="relative z-10 max-w-[1400px] mx-auto px-5 md:px-8 py-28 md:py-36">
          <h1 class="section-headline text-white mb-4 reveal" style="transition-delay:0.3s">자주 묻는 질문</h1>
          <p class="hero-sub text-white/35 reveal" style="transition-delay:0.5s">궁금하신 점을 먼저 확인해 보세요.</p>
        </div>
      </section>

      <section class="section-lg bg-mesh" itemscope itemtype="https://schema.org/FAQPage">
        <div class="max-w-3xl mx-auto px-5 md:px-8">
          <div class="space-y-3 stagger-children">
            {allFaq.map(faq => (
              <div class="faq-item" itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
                <button class="faq-toggle w-full text-left px-6 py-5 flex items-center justify-between hover:bg-gray-50/50 transition-colors" data-cursor-hover>
                  <h3 class="font-semibold text-gray-800 text-[0.95rem] pr-4" itemprop="name">{faq.q}</h3>
                  <i class="fa-solid fa-chevron-down text-gray-300 text-sm faq-icon flex-shrink-0"></i>
                </button>
                <div class="hidden px-6 pb-5" itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
                  <p class="text-gray-500 text-[0.9rem] leading-relaxed" itemprop="text">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
          <div class="text-center mt-10 reveal">
            <p class="text-gray-400 mb-4">더 궁금하신 점이 있으신가요?</p>
            <a href="/reservation" class="btn-premium btn-premium-fill" data-cursor-hover>상담 예약하기</a>
          </div>
        </div>
      </section>
    </>,
    {
      title: '자주 묻는 질문 FAQ | 서울365치과 - 임플란트·교정·수면진료 궁금증 해결',
      description: '서울365치과 자주 묻는 질문. 임플란트 비용과 기간, 수면진료 안전성, 치아교정 나이제한, 예약 방법, 365일 진료 안내 등 궁금한 점을 확인하세요.',
      canonical: 'https://seoul365dental.com/faq',
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "홈", "item": "https://seoul365dental.com" },
            { "@type": "ListItem", "position": 2, "name": "FAQ", "item": "https://seoul365dental.com/faq" }
          ]
        },
        {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": allFaq.map(f => ({
            "@type": "Question",
            "name": f.q,
            "acceptedAnswer": { "@type": "Answer", "text": f.a }
          }))
        }
      ]
    }
  )
})

// ============================================================
// CASES GALLERY — LOGIN REQUIRED
// ============================================================
app.get('/cases/gallery', async (c) => {
  const user = await getCurrentUser(c.env.DB, c.req.header('cookie'));

  // Not logged in → show login prompt
  if (!user) {
    return c.render(
      <>
        <section class="treatment-hero">
          <div class="relative z-10 max-w-[1400px] mx-auto px-5 md:px-8 py-28 md:py-36">
            <h1 class="section-headline text-white mb-4 reveal" style="transition-delay:0.3s">치료 사례 Before &amp; After</h1>
            <p class="hero-sub text-white/35 reveal" style="transition-delay:0.5s">실제 치료 사례를 확인하시려면 로그인이 필요합니다.</p>
          </div>
        </section>

        <section class="section-lg bg-mesh">
          <div class="max-w-lg mx-auto px-5 md:px-8 text-center">
            <div class="premium-card p-10 reveal-3d">
              <div class="w-20 h-20 rounded-full bg-[#0066FF]/10 mx-auto mb-6 flex items-center justify-center">
                <i class="fa-solid fa-lock text-3xl text-[#0066FF]/50"></i>
              </div>
              <h2 class="text-xl font-bold text-gray-900 mb-3">회원 전용 콘텐츠</h2>
              <p class="text-gray-500 text-[0.9rem] leading-relaxed mb-8">
                실제 치료 Before &amp; After 사례는<br/>
                회원 로그인 후 열람하실 수 있습니다.
              </p>
              <div class="flex flex-col sm:flex-row gap-3 justify-center">
                <a href="/login" class="btn-premium btn-premium-fill px-8 py-3.5" data-cursor-hover>
                  <i class="fa-solid fa-right-to-bracket"></i> 로그인
                </a>
                <a href="/register" class="btn-premium btn-premium-outline px-8 py-3.5" data-cursor-hover>
                  <i class="fa-solid fa-user-plus"></i> 회원가입
                </a>
              </div>
              <p class="text-xs text-gray-300 mt-6">가입은 30초면 충분합니다.</p>
            </div>
          </div>
        </section>
      </>,
      {
        title: '치료 사례 | 서울365치과 - 로그인 필요',
        description: '서울365치과 치료 사례. 회원 로그인 후 열람 가능.',
        canonical: 'https://seoul365dental.com/cases/gallery',
      }
    )
  }

  // Logged in → show gallery
  return c.render(
    <>
      <section class="treatment-hero">
        <div class="relative z-10 max-w-[1400px] mx-auto px-5 md:px-8 py-28 md:py-36">
          <h1 class="section-headline text-white mb-4 reveal" style="transition-delay:0.3s">치료 사례 Before &amp; After</h1>
          <p class="hero-sub text-white/35 reveal" style="transition-delay:0.5s">실제 치료 사례로 결과를 확인하세요.</p>
        </div>
      </section>

      <section class="section-lg bg-mesh">
        <div class="max-w-[1400px] mx-auto px-5 md:px-8">
          <div class="flex items-center justify-between mb-8 reveal">
            <p class="text-sm text-gray-400"><i class="fa-solid fa-user-check text-[#0066FF] mr-1.5"></i> <span class="font-medium text-gray-600">{user.name}</span>님, 환영합니다.</p>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-5 stagger-children">
            {[
              { title: '전체임플란트 – 상악 전체 수복', tag: '전체임플란트', doctor: '박준규 대표원장' },
              { title: '올온X – 하악 즉시로딩', tag: '올온X', doctor: '박준규 대표원장' },
              { title: '인비절라인 – 성인 투명교정', tag: '교정', doctor: '하누리 원장' },
              { title: '크라운 – 올세라믹 수복', tag: '심미', doctor: '최다빈 원장' },
              { title: '심미보철 – 라미네이트', tag: '심미', doctor: '최다빈 원장' },
              { title: '임플란트 – 단일 식립', tag: '임플란트', doctor: '상세훈 원장' },
            ].map(cs => (
              <div class="premium-card overflow-hidden tilt-card electric-card-border">
                <div class="aspect-[4/3] bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center relative overflow-hidden">
                  <div class="absolute inset-0 flex">
                    <div class="w-1/2 flex items-center justify-center bg-gray-100/80 border-r border-gray-200/50">
                      <span class="text-gray-300 text-sm font-bold tracking-widest uppercase">Before</span>
                    </div>
                    <div class="w-1/2 flex items-center justify-center bg-gradient-to-br from-[#0066FF]/5 to-[#00E5FF]/[0.02]">
                      <span class="text-[#0066FF]/30 text-sm font-bold tracking-widest uppercase">After</span>
                    </div>
                  </div>
                </div>
                <div class="p-5">
                  <div class="flex items-center gap-2 mb-2">
                    <span class="text-[0.7rem] bg-[#0066FF]/8 text-[#0066FF] px-2.5 py-0.5 rounded-full font-semibold">{cs.tag}</span>
                  </div>
                  <h3 class="font-bold text-gray-900 text-sm">{cs.title}</h3>
                  <p class="text-xs text-gray-400 mt-1">담당: {cs.doctor}</p>
                </div>
              </div>
            ))}
          </div>
          <p class="text-[0.72rem] text-gray-300 text-center mt-10">※ 개인에 따라 치료 결과가 다를 수 있습니다. 모든 사례는 환자 동의 하에 게시되었습니다.</p>
        </div>
      </section>
    </>,
    {
      title: '치료 사례 Before & After | 서울365치과',
      description: '서울365치과 치료 사례. 임플란트, 교정, 심미치료 Before & After.',
      canonical: 'https://seoul365dental.com/cases/gallery',
    }
  )
})

// ============================================================
// AUTH: REGISTER
// ============================================================
app.get('/register', (c) => {
  return c.render(
    <>
      <section class="treatment-hero">
        <div class="relative z-10 max-w-[1400px] mx-auto px-5 md:px-8 py-28 md:py-36">
          <h1 class="section-headline text-white mb-4 reveal" style="transition-delay:0.3s">회원가입</h1>
          <p class="hero-sub text-white/35 reveal" style="transition-delay:0.5s">30초면 가입이 완료됩니다.</p>
        </div>
      </section>

      <section class="section-lg bg-mesh">
        <div class="max-w-md mx-auto px-5 md:px-8">
          <div class="premium-card p-8 md:p-10 reveal-3d">
            <div id="register-error" class="hidden mb-6 p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium"></div>
            <form id="register-form" class="space-y-5">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">이름 *</label>
                <input type="text" name="name" required class="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF]/30 transition-all text-sm" placeholder="홍길동" />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">휴대폰 번호 *</label>
                <input type="tel" name="phone" required class="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF]/30 transition-all text-sm" placeholder="010-1234-5678" />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">비밀번호 *</label>
                <input type="password" name="password" required minlength="4" class="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF]/30 transition-all text-sm" placeholder="4자리 이상" />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">비밀번호 확인 *</label>
                <input type="password" name="password2" required minlength="4" class="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF]/30 transition-all text-sm" placeholder="비밀번호 재입력" />
              </div>
              <div class="flex items-start gap-2.5">
                <input type="checkbox" required class="mt-1 accent-[#0066FF]" id="agree" />
                <label for="agree" class="text-sm text-gray-500">
                  <a href="/privacy" class="text-[#0066FF] font-semibold underline underline-offset-2">개인정보처리방침</a>에 동의합니다 *
                </label>
              </div>
              <button type="submit" id="register-btn" class="btn-premium btn-premium-fill w-full py-4 text-[0.95rem]" data-cursor-hover>
                회원가입
              </button>
            </form>
            <p class="text-center text-sm text-gray-400 mt-6">
              이미 계정이 있으신가요? <a href="/login" class="text-[#0066FF] font-semibold link-underline">로그인</a>
            </p>
          </div>
        </div>
      </section>

      <script dangerouslySetInnerHTML={{__html: `
        document.getElementById('register-form').addEventListener('submit', async function(e) {
          e.preventDefault();
          const btn = document.getElementById('register-btn');
          const err = document.getElementById('register-error');
          btn.disabled = true; btn.textContent = '처리중...';
          err.classList.add('hidden');

          const fd = new FormData(this);
          const data = Object.fromEntries(fd);

          if (data.password !== data.password2) {
            err.textContent = '비밀번호가 일치하지 않습니다.';
            err.classList.remove('hidden');
            btn.disabled = false; btn.textContent = '회원가입';
            return;
          }

          try {
            const res = await fetch('/api/auth/register', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ name: data.name, phone: data.phone, password: data.password })
            });
            const json = await res.json();
            if (json.ok) {
              window.location.href = '/cases/gallery';
            } else {
              err.textContent = json.error || '가입에 실패했습니다.';
              err.classList.remove('hidden');
            }
          } catch(e) {
            err.textContent = '서버 오류가 발생했습니다.';
            err.classList.remove('hidden');
          }
          btn.disabled = false; btn.textContent = '회원가입';
        });
      `}} />
    </>,
    {
      title: '회원가입 | 서울365치과',
      description: '서울365치과 회원가입.',
      canonical: 'https://seoul365dental.com/register',
    }
  )
})

// ============================================================
// AUTH: LOGIN
// ============================================================
app.get('/login', (c) => {
  return c.render(
    <>
      <section class="treatment-hero">
        <div class="relative z-10 max-w-[1400px] mx-auto px-5 md:px-8 py-28 md:py-36">
          <h1 class="section-headline text-white mb-4 reveal" style="transition-delay:0.3s">로그인</h1>
          <p class="hero-sub text-white/35 reveal" style="transition-delay:0.5s">회원 전용 콘텐츠를 열람하세요.</p>
        </div>
      </section>

      <section class="section-lg bg-mesh">
        <div class="max-w-md mx-auto px-5 md:px-8">
          <div class="premium-card p-8 md:p-10 reveal-3d">
            <div id="login-error" class="hidden mb-6 p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium"></div>
            <form id="login-form" class="space-y-5">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">휴대폰 번호</label>
                <input type="tel" name="phone" required class="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF]/30 transition-all text-sm" placeholder="010-1234-5678" />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">비밀번호</label>
                <input type="password" name="password" required class="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF]/30 transition-all text-sm" placeholder="비밀번호 입력" />
              </div>
              <button type="submit" id="login-btn" class="btn-premium btn-premium-fill w-full py-4 text-[0.95rem]" data-cursor-hover>
                로그인
              </button>
            </form>
            <p class="text-center text-sm text-gray-400 mt-6">
              계정이 없으신가요? <a href="/register" class="text-[#0066FF] font-semibold link-underline">회원가입</a>
            </p>
          </div>
        </div>
      </section>

      <script dangerouslySetInnerHTML={{__html: `
        document.getElementById('login-form').addEventListener('submit', async function(e) {
          e.preventDefault();
          const btn = document.getElementById('login-btn');
          const err = document.getElementById('login-error');
          btn.disabled = true; btn.textContent = '로그인 중...';
          err.classList.add('hidden');

          const fd = new FormData(this);
          const data = Object.fromEntries(fd);

          try {
            const res = await fetch('/api/auth/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ phone: data.phone, password: data.password })
            });
            const json = await res.json();
            if (json.ok) {
              window.location.href = '/cases/gallery';
            } else {
              err.textContent = json.error || '로그인에 실패했습니다.';
              err.classList.remove('hidden');
            }
          } catch(e) {
            err.textContent = '서버 오류가 발생했습니다.';
            err.classList.remove('hidden');
          }
          btn.disabled = false; btn.textContent = '로그인';
        });
      `}} />
    </>,
    {
      title: '로그인 | 서울365치과',
      description: '서울365치과 회원 로그인.',
      canonical: 'https://seoul365dental.com/login',
    }
  )
})

// ============================================================
// AUTH API ENDPOINTS
// ============================================================
app.post('/api/auth/register', async (c) => {
  try {
    const { name, phone, password } = await c.req.json();
    if (!name || !phone || !password) {
      return c.json({ ok: false, error: '모든 항목을 입력해주세요.' }, 400);
    }
    if (password.length < 4) {
      return c.json({ ok: false, error: '비밀번호는 4자리 이상이어야 합니다.' }, 400);
    }

    // Init tables if needed
    await c.env.DB.prepare(`CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, phone TEXT NOT NULL UNIQUE, password_hash TEXT NOT NULL, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`).run();
    await c.env.DB.prepare(`CREATE TABLE IF NOT EXISTS sessions (id TEXT PRIMARY KEY, user_id INTEGER NOT NULL, expires_at DATETIME NOT NULL, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE)`).run();

    // Check existing
    const existing = await c.env.DB.prepare('SELECT id FROM users WHERE phone = ?').bind(phone).first();
    if (existing) {
      return c.json({ ok: false, error: '이미 가입된 번호입니다. 로그인해 주세요.' }, 409);
    }

    const passwordHash = await hashPassword(password);
    const result = await c.env.DB.prepare('INSERT INTO users (name, phone, password_hash) VALUES (?, ?, ?)').bind(name, phone, passwordHash).run();

    const userId = (result.meta as any).last_row_id;
    const sessionId = generateSessionId();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    await c.env.DB.prepare('INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)').bind(sessionId, userId, expiresAt).run();

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': getSessionCookie(sessionId),
      },
    });
  } catch (e: any) {
    return c.json({ ok: false, error: e.message || '서버 오류' }, 500);
  }
})

app.post('/api/auth/login', async (c) => {
  try {
    const { phone, password } = await c.req.json();
    if (!phone || !password) {
      return c.json({ ok: false, error: '휴대폰 번호와 비밀번호를 입력해주세요.' }, 400);
    }

    // Init tables if needed
    await c.env.DB.prepare(`CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, phone TEXT NOT NULL UNIQUE, password_hash TEXT NOT NULL, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`).run();
    await c.env.DB.prepare(`CREATE TABLE IF NOT EXISTS sessions (id TEXT PRIMARY KEY, user_id INTEGER NOT NULL, expires_at DATETIME NOT NULL, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE)`).run();

    const user = await c.env.DB.prepare('SELECT id, name, phone, password_hash FROM users WHERE phone = ?').bind(phone).first<{ id: number; name: string; phone: string; password_hash: string }>();
    if (!user) {
      return c.json({ ok: false, error: '가입되지 않은 번호입니다.' }, 401);
    }

    const valid = await verifyPassword(password, user.password_hash);
    if (!valid) {
      return c.json({ ok: false, error: '비밀번호가 올바르지 않습니다.' }, 401);
    }

    const sessionId = generateSessionId();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    await c.env.DB.prepare('INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)').bind(sessionId, user.id, expiresAt).run();

    return new Response(JSON.stringify({ ok: true, user: { name: user.name } }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': getSessionCookie(sessionId),
      },
    });
  } catch (e: any) {
    return c.json({ ok: false, error: e.message || '서버 오류' }, 500);
  }
})

app.get('/api/auth/me', async (c) => {
  const user = await getCurrentUser(c.env.DB, c.req.header('cookie'));
  if (!user) return c.json({ ok: false, user: null });
  return c.json({ ok: true, user });
})

app.post('/api/auth/logout', async (c) => {
  const { getSessionIdFromCookie } = await import('./lib/auth');
  const sessionId = getSessionIdFromCookie(c.req.header('cookie'));
  if (sessionId) {
    await c.env.DB.prepare('DELETE FROM sessions WHERE id = ?').bind(sessionId).run();
  }
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': clearSessionCookie(),
    },
  });
})

// ============================================================
// PRIVACY / TERMS
// ============================================================
app.get('/privacy', (c) => {
  return c.render(
    <section class="section-lg">
      <div class="max-w-3xl mx-auto px-5 md:px-8 pt-24">
        <h1 class="section-headline text-gray-900 mb-8">개인정보처리방침</h1>
        <div class="text-gray-500 text-[0.9rem] leading-relaxed space-y-6">
          <p>서울365치과의원(이하 "병원")은 개인정보보호법에 따라 이용자의 개인정보를 보호합니다.</p>
          <h2 class="text-lg font-bold text-gray-900">1. 수집하는 개인정보 항목</h2>
          <p>상담 예약을 위해 이름, 연락처, 상담 내용을 수집합니다.</p>
          <h2 class="text-lg font-bold text-gray-900">2. 이용 목적</h2>
          <p>상담 예약 확인 및 진료 안내 목적으로만 사용됩니다.</p>
          <h2 class="text-lg font-bold text-gray-900">3. 보유 기간</h2>
          <p>수집 목적 달성 후 즉시 파기합니다. 의료법에 따른 진료기록은 법정 보관 기간 동안 보관합니다.</p>
          <h2 class="text-lg font-bold text-gray-900">4. 문의처</h2>
          <p>{CLINIC.phone}</p>
        </div>
      </div>
    </section>,
    { title: '개인정보처리방침 | 서울365치과', canonical: 'https://seoul365dental.com/privacy' }
  )
})

app.get('/terms', (c) => {
  return c.render(
    <section class="section-lg">
      <div class="max-w-3xl mx-auto px-5 md:px-8 pt-24">
        <h1 class="section-headline text-gray-900 mb-8">이용약관</h1>
        <div class="text-gray-500 text-[0.9rem] leading-relaxed space-y-6">
          <p>본 웹사이트는 서울365치과의원이 운영합니다.</p>
          <h2 class="text-lg font-bold text-gray-900">1. 서비스 이용</h2>
          <p>병원 정보 제공 및 상담 예약을 위한 목적으로 운영됩니다.</p>
          <h2 class="text-lg font-bold text-gray-900">2. 면책사항</h2>
          <p>정확한 진단과 치료는 내원 상담을 통해 진행됩니다.</p>
          <h2 class="text-lg font-bold text-gray-900">3. 저작권</h2>
          <p>콘텐츠에 대한 저작권은 서울365치과의원에 있습니다.</p>
        </div>
      </div>
    </section>,
    { title: '이용약관 | 서울365치과', canonical: 'https://seoul365dental.com/terms' }
  )
})

// ============================================================
// SITEMAP.XML — Dynamic SEO Sitemap
// ============================================================
app.get('/sitemap.xml', (c) => {
  const base = 'https://seoul365dental.com';
  const now = new Date().toISOString().split('T')[0];

  const staticPages = [
    { loc: '', priority: '1.0', changefreq: 'daily' },
    { loc: '/treatments', priority: '0.9', changefreq: 'weekly' },
    { loc: '/doctors', priority: '0.9', changefreq: 'monthly' },
    { loc: '/pricing', priority: '0.8', changefreq: 'weekly' },
    { loc: '/reservation', priority: '0.8', changefreq: 'monthly' },
    { loc: '/directions', priority: '0.7', changefreq: 'monthly' },
    { loc: '/faq', priority: '0.7', changefreq: 'weekly' },
    { loc: '/cases/gallery', priority: '0.6', changefreq: 'weekly' },
    { loc: '/privacy', priority: '0.3', changefreq: 'yearly' },
    { loc: '/terms', priority: '0.3', changefreq: 'yearly' },
  ];

  const treatmentPages = treatments.map(t => ({
    loc: `/treatments/${t.slug}`, priority: '0.8', changefreq: 'weekly' as const,
  }));

  const doctorPages = doctors.map(d => ({
    loc: `/doctors/${d.slug}`, priority: '0.7', changefreq: 'monthly' as const,
  }));

  const allPages = [...staticPages, ...treatmentPages, ...doctorPages];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${allPages.map(p => `  <url>
    <loc>${base}${p.loc}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
    <xhtml:link rel="alternate" hreflang="ko-KR" href="${base}${p.loc}" />
  </url>`).join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
})

// ============================================================
// ROBOTS.TXT
// ============================================================
app.get('/robots.txt', (c) => {
  const robots = `User-agent: *
Allow: /

# Sitemap
Sitemap: https://seoul365dental.com/sitemap.xml

# Crawl-delay (polite crawling)
Crawl-delay: 1

# Disallow admin/auth API endpoints
Disallow: /api/auth/
Disallow: /login
Disallow: /register

# Allow all content pages
Allow: /treatments/
Allow: /doctors/
Allow: /pricing
Allow: /directions
Allow: /faq
Allow: /reservation
Allow: /cases/gallery
`;

  return new Response(robots, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
})

// ============================================================
// 404
// ============================================================
app.notFound((c) => {
  return c.render(
    <section class="hero-premium" style="min-height:80vh">
      <div class="hero-grid"></div>
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>
      <div class="relative z-10 max-w-lg mx-auto px-5 text-center">
        <div class="text-[8rem] font-black gradient-text-white leading-none mb-4" style="opacity:0.06">404</div>
        <h1 class="text-2xl font-bold text-white mb-3">페이지를 찾을 수 없습니다</h1>
        <p class="text-white/35 mb-8">요청하신 페이지가 존재하지 않거나 이동되었습니다.</p>
        <div class="flex flex-wrap justify-center gap-3">
          <a href="/" class="btn-premium btn-premium-fill" data-cursor-hover>홈으로 가기</a>
          <a href="/treatments" class="btn-premium btn-premium-white" data-cursor-hover>진료 안내</a>
        </div>
      </div>
    </section>,
    { title: '404 - 페이지를 찾을 수 없습니다 | 서울365치과' }
  )
})

export default app
