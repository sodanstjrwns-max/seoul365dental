import { Hono } from 'hono'
import { renderer } from './renderer'
import { CLINIC, STATS, DIFF_CARDS, HOURS } from './data/clinic'
import { doctors, getDoctorBySlug } from './data/doctors'
import { treatments, getTreatmentBySlug, treatmentCategories } from './data/treatments'
import { mainFaq, pricingData, pricingSummary, pricingCategories } from './data/faq'
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
      jsonLd: [
        // BreadcrumbList
        {
          "@context": "https://schema.org", "@type": "BreadcrumbList",
          "itemListElement": [{ "@type": "ListItem", "position": 1, "name": "서울365치과", "item": "https://seoul365dental.com" }]
        },
        // WebPage — homepage
        {
          "@context": "https://schema.org",
          "@type": ["WebPage", "MedicalWebPage"],
          "@id": "https://seoul365dental.com/#webpage",
          "url": "https://seoul365dental.com",
          "name": "서울365치과 | 인천 구월동 서울대 5인 전문의 치과",
          "description": "치과가 무서워서 미뤄온 분들이 다시는 미루지 않아도 되는 병원.",
          "isPartOf": { "@id": "https://seoul365dental.com/#website" },
          "about": { "@id": "https://seoul365dental.com/#dentist" },
          "inLanguage": "ko-KR",
          "datePublished": "2024-01-01",
          "dateModified": new Date().toISOString().split('T')[0],
          "primaryImageOfPage": {
            "@type": "ImageObject",
            "url": "https://seoul365dental.com/static/og-image.jpg",
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
          "description": "서울365치과의 진료 환경을 영상으로 먼저 확인하세요. 400평 규모, 6개 독립 수술실, 에어샤워 시스템, 자체 기공실.",
          "thumbnailUrl": "https://img.youtube.com/vi/gB_yiatcwAc/maxresdefault.jpg",
          "uploadDate": "2024-01-01",
          "contentUrl": "https://www.youtube.com/watch?v=gB_yiatcwAc",
          "embedUrl": "https://www.youtube-nocookie.com/embed/gB_yiatcwAc",
          "publisher": { "@id": "https://seoul365dental.com/#dentist" },
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
            "url": `https://seoul365dental.com/treatments/${t.slug}`,
            "item": {
              "@type": "MedicalProcedure",
              "name": t.name,
              "description": t.shortDesc,
              "url": `https://seoul365dental.com/treatments/${t.slug}`
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
            { "@type": "Offer", "itemOffered": { "@type": "MedicalProcedure", "name": "전체임플란트" }, "priceCurrency": "KRW", "description": "자체 기공실 MUA 즉시로딩", "url": "https://seoul365dental.com/treatments/full-implant" },
            { "@type": "Offer", "itemOffered": { "@type": "MedicalProcedure", "name": "올온X 임플란트" }, "priceCurrency": "KRW", "description": "4~6개 임플란트로 전악 회복", "url": "https://seoul365dental.com/treatments/all-on-x" },
            { "@type": "Offer", "itemOffered": { "@type": "MedicalProcedure", "name": "수면진료" }, "priceCurrency": "KRW", "description": "잠깐 잠들었다 깨면 치료 완료", "url": "https://seoul365dental.com/treatments/sedation" },
            { "@type": "Offer", "itemOffered": { "@type": "MedicalProcedure", "name": "치아교정" }, "priceCurrency": "KRW", "description": "인비절라인 투명교정", "url": "https://seoul365dental.com/treatments/orthodontics" },
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
              "item": { "@type": "Article", "headline": "전체임플란트, 틀니보다 좋은 이유 5가지", "datePublished": "2026-02-15", "author": { "@type": "Physician", "name": "박준규" }, "publisher": { "@id": "https://seoul365dental.com/#dentist" }, "articleSection": "임플란트", "inLanguage": "ko-KR" }
            },
            {
              "@type": "ListItem", "position": 2,
              "item": { "@type": "Article", "headline": "치아교정 나이 제한? 성인교정 궁금증 해결", "datePublished": "2026-02-10", "author": { "@type": "Physician", "name": "하누리" }, "publisher": { "@id": "https://seoul365dental.com/#dentist" }, "articleSection": "교정", "inLanguage": "ko-KR" }
            },
            {
              "@type": "ListItem", "position": 3,
              "item": { "@type": "Article", "headline": "수면진료, 정말 안전한가요?", "datePublished": "2026-02-05", "author": { "@type": "Physician", "name": "박준규" }, "publisher": { "@id": "https://seoul365dental.com/#dentist" }, "articleSection": "수면진료", "inLanguage": "ko-KR" }
            },
          ]
        },
        // HealthTopicContent — dental conditions addressed (AEO critical)
        {
          "@context": "https://schema.org",
          "@type": "MedicalWebPage",
          "name": "서울365치과 치과 질환 및 치료 안내",
          "url": "https://seoul365dental.com",
          "about": [
            { "@type": "MedicalCondition", "name": "무치악(치아 상실)", "associatedAnatomy": { "@type": "AnatomicalStructure", "name": "구강" }, "possibleTreatment": [{ "@type": "MedicalProcedure", "name": "전체임플란트" }, { "@type": "MedicalProcedure", "name": "올온X" }] },
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
          "image": "https://seoul365dental.com/static/og-image.jpg",
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
            "target": { "@type": "EntryPoint", "urlTemplate": "https://seoul365dental.com/reservation", "actionPlatform": ["http://schema.org/DesktopWebPlatform", "http://schema.org/MobileWebPlatform"] },
            "deliveryMethod": "http://purl.org/goodrelations/v1#DeliveryModeOwnFleet",
          },
          "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.9", "bestRating": "5", "ratingCount": "2150", "reviewCount": "1840" },
        },
      ]
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
      jsonLd: [
        {
          "@context": "https://schema.org", "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "홈", "item": "https://seoul365dental.com" },
            { "@type": "ListItem", "position": 2, "name": "전체 진료", "item": "https://seoul365dental.com/treatments" }
          ]
        },
        // CollectionPage — treatment listing
        {
          "@context": "https://schema.org",
          "@type": ["CollectionPage", "MedicalWebPage"],
          "name": "서울365치과 전체 진료 안내",
          "description": "서울365치과에서 제공하는 모든 치과 진료 안내. 임플란트, 교정, 수면진료, 심미치료, 소아치과 등.",
          "url": "https://seoul365dental.com/treatments",
          "isPartOf": { "@id": "https://seoul365dental.com/#website" },
          "about": { "@id": "https://seoul365dental.com/#dentist" },
          "specialty": "Dentistry",
          "inLanguage": "ko-KR"
        },
        // ItemList — all treatments
        {
          "@context": "https://schema.org",
          "@type": "ItemList",
          "name": "서울365치과 전체 진료 목록",
          "numberOfItems": treatments.length,
          "itemListElement": treatments.map((t: any, i: number) => ({
            "@type": "ListItem",
            "position": i + 1,
            "name": t.name,
            "url": `https://seoul365dental.com/treatments/${t.slug}`,
            "item": {
              "@type": "MedicalProcedure",
              "name": t.name,
              "description": t.metaDesc,
              "procedureType": t.slug.includes('orthodontic') || t.slug.includes('invisalign') ? "NonSurgicalProcedure" : "SurgicalProcedure",
              "bodyLocation": "Oral cavity"
            }
          }))
        },
        // MedicalWebPage — treatment listing specifics
        {
          "@context": "https://schema.org",
          "@type": "MedicalWebPage",
          "name": "서울365치과 전체 진료 안내",
          "url": "https://seoul365dental.com/treatments",
          "lastReviewed": new Date().toISOString().split('T')[0],
          "reviewedBy": { "@type": "Physician", "name": "박준규", "worksFor": { "@id": "https://seoul365dental.com/#dentist" } },
          "specialty": "Dentistry",
          "speakable": {
            "@type": "SpeakableSpecification",
            "cssSelector": ["h1", "h2", ".section-headline"]
          },
        },
        // Service — dental service listing
        {
          "@context": "https://schema.org",
          "@type": "Service",
          "name": "서울365치과 종합 치과 진료",
          "description": "서울365치과에서 제공하는 전체 치과 진료 안내. 임플란트, 교정, 수면진료, 심미치료, 소아치과 등.",
          "provider": { "@id": "https://seoul365dental.com/#dentist" },
          "serviceType": "치과 진료",
          "areaServed": { "@type": "City", "name": "인천광역시" },
          "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "진료 카테고리",
            "itemListElement": treatmentCategories.map((cat: any) => ({
              "@type": "OfferCatalog",
              "name": cat.name,
              "itemListElement": cat.treatments.map((t: any) => ({
                "@type": "Offer",
                "itemOffered": { "@type": "MedicalProcedure", "name": t.name, "url": `https://seoul365dental.com/treatments/${t.slug}` }
              }))
            }))
          }
        },
      ]
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
            <a href="/info" class="btn-premium btn-premium-white" data-cursor-hover><i class="fa-solid fa-won-sign"></i> 비용 안내</a>
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

      {/* Detail Sections — 상세 정보 */}
      {t.detailSections && t.detailSections.length > 0 && (
        <section class="section-lg bg-mesh">
          <div class="max-w-4xl mx-auto px-5 md:px-8">
            <div class="text-center mb-14 reveal">
              <span class="section-eyebrow text-[#0066FF] mb-3 block">DETAILS</span>
              <h2 class="section-sub-headline text-gray-900">{t.name} 상세 정보</h2>
            </div>
            <div class="space-y-5 stagger-children">
              {t.detailSections.map(section => (
                <div class="glass-card p-7">
                  <div class="flex items-start gap-4">
                    {section.icon && (
                      <div class="icon-circle flex-shrink-0">
                        <i class={`fa-solid ${section.icon}`}></i>
                      </div>
                    )}
                    <div>
                      <h3 class="font-bold text-gray-900 text-lg mb-3">{section.title}</h3>
                      <p class="text-gray-600 text-[0.9rem] leading-[1.85]">{section.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

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

      {/* Comparison Table */}
      {t.comparisonTable && t.comparisonTable.length > 0 && t.comparisonHeaders && (
        <section class="section-lg bg-white">
          <div class="max-w-4xl mx-auto px-5 md:px-8">
            <div class="text-center mb-14 reveal">
              <span class="section-eyebrow text-[#0066FF] mb-3 block">COMPARE</span>
              <h2 class="section-sub-headline text-gray-900">{t.name} 비교</h2>
            </div>
            <div class="glass-card overflow-hidden reveal">
              <div class="overflow-x-auto">
                <table class="w-full text-sm">
                  <thead>
                    <tr class="bg-gradient-to-r from-[#0066FF]/5 to-[#0066FF]/10">
                      {t.comparisonHeaders.map((h: string) => (
                        <th class="px-4 py-4 text-left font-bold text-gray-800 whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {t.comparisonTable.map((row, i) => (
                      <tr class={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                        <td class="px-4 py-3.5 font-semibold text-gray-800 whitespace-nowrap">{row.item}</td>
                        {row.values.map((v: string) => (
                          <td class="px-4 py-3.5 text-gray-600">{v}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      )}

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

      {/* Warnings & Aftercare */}
      {(t.warnings && t.warnings.length > 0) || (t.aftercare && t.aftercare.length > 0) ? (
        <section class="section-lg bg-mesh">
          <div class="max-w-4xl mx-auto px-5 md:px-8">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 stagger-children">
              {/* Warnings */}
              {t.warnings && t.warnings.length > 0 && (
                <div class="glass-card p-7">
                  <div class="flex items-center gap-3 mb-5">
                    <div class="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                      <i class="fa-solid fa-triangle-exclamation text-amber-500"></i>
                    </div>
                    <h3 class="font-bold text-gray-900 text-lg">주의사항</h3>
                  </div>
                  <ul class="space-y-3">
                    {t.warnings.map(w => (
                      <li class="flex items-start gap-2.5 text-[0.9rem] text-gray-600 leading-relaxed">
                        <i class="fa-solid fa-circle-exclamation text-amber-400 text-xs mt-1.5 flex-shrink-0"></i>
                        {w}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {/* Aftercare */}
              {t.aftercare && t.aftercare.length > 0 && (
                <div class="glass-card p-7">
                  <div class="flex items-center gap-3 mb-5">
                    <div class="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                      <i class="fa-solid fa-heart-pulse text-emerald-500"></i>
                    </div>
                    <h3 class="font-bold text-gray-900 text-lg">치료 후 관리</h3>
                  </div>
                  <ul class="space-y-3">
                    {t.aftercare.map(a => (
                      <li class="flex items-start gap-2.5 text-[0.9rem] text-gray-600 leading-relaxed">
                        <i class="fa-solid fa-check-circle text-emerald-400 text-xs mt-1.5 flex-shrink-0"></i>
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </section>
      ) : null}

      {/* Patient Cases */}
      {t.patientCases && t.patientCases.length > 0 && (
        <section class="section-lg bg-white">
          <div class="max-w-4xl mx-auto px-5 md:px-8">
            <div class="text-center mb-14 reveal">
              <span class="section-eyebrow text-[#0066FF] mb-3 block">CASES</span>
              <h2 class="section-sub-headline text-gray-900">{t.name} 치료 사례</h2>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5 stagger-children">
              {t.patientCases.map(pc => (
                <div class="glass-card p-7 group hover:border-[#0066FF]/20 transition-all">
                  <div class="flex items-center gap-3 mb-3">
                    <span class="px-3 py-1 bg-[#0066FF]/8 text-[#0066FF] text-xs font-semibold rounded-full">{pc.tag}</span>
                  </div>
                  <h3 class="font-bold text-gray-900 mb-2 group-hover:text-[#0066FF] transition-colors">{pc.title}</h3>
                  <p class="text-gray-500 text-[0.9rem] leading-relaxed">{pc.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Materials */}
      {t.materials && t.materials.length > 0 && (
        <section class="section-lg bg-mesh">
          <div class="max-w-4xl mx-auto px-5 md:px-8">
            <div class="text-center mb-14 reveal">
              <span class="section-eyebrow text-[#0066FF] mb-3 block">MATERIALS</span>
              <h2 class="section-sub-headline text-gray-900">사용 재료 및 장비</h2>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
              {t.materials.map(m => (
                <div class="glass-card p-5 flex flex-col">
                  {m.grade && <span class="text-[0.7rem] font-semibold text-[#0066FF] uppercase tracking-wider mb-2">{m.grade}</span>}
                  <h3 class="font-bold text-gray-900 text-[0.95rem] mb-1.5">{m.name}</h3>
                  <p class="text-gray-500 text-[0.85rem] leading-relaxed">{m.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

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

      {/* Related Treatments */}
      {t.relatedSlugs && t.relatedSlugs.length > 0 && (
        <section class="section-md bg-mesh">
          <div class="max-w-4xl mx-auto px-5 md:px-8">
            <div class="text-center mb-10 reveal">
              <span class="section-eyebrow text-[#0066FF] mb-3 block">RELATED</span>
              <h2 class="text-xl font-bold text-gray-900">관련 진료 안내</h2>
            </div>
            <div class="flex flex-wrap justify-center gap-3 stagger-children">
              {t.relatedSlugs.map(rs => {
                const related = getTreatmentBySlug(rs);
                return related ? (
                  <a href={`/treatments/${related.slug}`} class="glass-card px-5 py-3 flex items-center gap-2.5 hover:border-[#0066FF]/30 transition-all group" data-cursor-hover>
                    <i class={`fa-solid ${related.icon} text-[#0066FF] text-sm`}></i>
                    <span class="font-medium text-gray-700 group-hover:text-[#0066FF] transition-colors text-[0.9rem]">{related.name}</span>
                    <i class="fa-solid fa-arrow-right text-xs text-gray-300 group-hover:text-[#0066FF] transition-colors"></i>
                  </a>
                ) : null;
              })}
            </div>
          </div>
        </section>
      )}
    </>,
    {
      title: t.metaTitle,
      description: t.metaDesc,
      canonical: `https://seoul365dental.com/treatments/${t.slug}`,
      jsonLd: [
        // MedicalWebPage
        {
          "@context": "https://schema.org",
          "@type": "MedicalWebPage",
          "name": t.metaTitle,
          "description": t.metaDesc,
          "url": `https://seoul365dental.com/treatments/${t.slug}`,
          "isPartOf": { "@id": "https://seoul365dental.com/#website" },
          "about": { "@type": "MedicalProcedure", "name": t.name },
          "specialty": "Dentistry",
          "lastReviewed": new Date().toISOString().split('T')[0],
          "reviewedBy": { "@type": "Physician", "name": "박준규", "worksFor": { "@id": "https://seoul365dental.com/#dentist" } },
          "inLanguage": "ko-KR"
        },
        // MedicalProcedure (detailed)
        {
          "@context": "https://schema.org", "@type": "MedicalProcedure",
          "@id": `https://seoul365dental.com/treatments/${t.slug}#procedure`,
          "name": t.name,
          "procedureType": t.slug.includes('orthodontic') || t.slug.includes('invisalign') ? "NonSurgicalProcedure" : "SurgicalProcedure",
          "bodyLocation": "Oral cavity",
          "description": t.metaDesc,
          "howPerformed": t.process?.map((s: any) => s.step).join(' → '),
          "preparation": "정밀 CT 촬영 및 디지털 스캔 진단",
          "followup": "정기 검진 및 유지 관리",
          "status": "EventScheduled",
          "recognizingAuthority": { "@type": "Organization", "name": "대한치과의사협회" },
          "relevantSpecialty": { "@type": "MedicalSpecialty", "name": "Dentistry" },
          "study": { "@type": "MedicalStudy", "studySubject": { "@type": "MedicalEntity", "name": t.name } },
        },
        // MedicalCondition (what this treatment addresses)
        {
          "@context": "https://schema.org",
          "@type": "MedicalCondition",
          "name": `${t.name} 적응증`,
          "description": t.concerns?.join('. '),
          "possibleTreatment": {
            "@type": "MedicalProcedure",
            "name": t.name,
            "url": `https://seoul365dental.com/treatments/${t.slug}`
          },
          "signOrSymptom": t.concerns?.map((c: string) => ({
            "@type": "MedicalSignOrSymptom",
            "name": c
          })),
        },
        // Service + Offer
        {
          "@context": "https://schema.org",
          "@type": "Service",
          "name": `${t.name} - 서울365치과`,
          "description": t.metaDesc,
          "provider": { "@id": "https://seoul365dental.com/#dentist" },
          "serviceType": "치과 진료",
          "areaServed": { "@type": "City", "name": "인천광역시" },
          "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": `${t.name} 종류`,
            "itemListElement": t.types?.map((type: any) => ({
              "@type": "Offer",
              "itemOffered": { "@type": "Service", "name": type.name, "description": type.desc }
            }))
          }
        },
        // HowTo (treatment process)
        {
          "@context": "https://schema.org", "@type": "HowTo",
          "name": `${t.name} 치료 과정`,
          "description": `서울365치과의 ${t.name} 치료는 다음 단계로 진행됩니다.`,
          "totalTime": "PT1H",
          "tool": [
            { "@type": "HowToTool", "name": "CT 촬영기" },
            { "@type": "HowToTool", "name": "디지털 스캐너" },
            { "@type": "HowToTool", "name": "네비게이션 가이드" }
          ],
          "step": t.process?.map((step: any, i: number) => ({
            "@type": "HowToStep",
            "position": i + 1,
            "name": step.step,
            "text": step.desc || step.step,
            "url": `https://seoul365dental.com/treatments/${t.slug}#step-${i + 1}`
          }))
        },
        // BreadcrumbList
        {
          "@context": "https://schema.org", "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "홈", "item": "https://seoul365dental.com" },
            { "@type": "ListItem", "position": 2, "name": "진료안내", "item": "https://seoul365dental.com/treatments" },
            { "@type": "ListItem", "position": 3, "name": t.name, "item": `https://seoul365dental.com/treatments/${t.slug}` }
          ]
        },
        // FAQPage (treatment-specific)
        ...(t.faq ? [{
          "@context": "https://schema.org", "@type": "FAQPage",
          "mainEntity": t.faq.map((f: any) => ({
            "@type": "Question", "name": f.q,
            "acceptedAnswer": { "@type": "Answer", "text": f.a }
          }))
        }] : []),
        // MedicalDevice — equipment used for this treatment
        {
          "@context": "https://schema.org",
          "@type": "MedicalDevice",
          "name": `${t.name} 진료 장비`,
          "description": `서울365치과 ${t.name} 진료에 사용되는 의료 장비`,
          "manufacturer": [
            { "@type": "Organization", "name": "오스템 임플란트" },
            { "@type": "Organization", "name": "3Shape" },
          ],
          "purpose": `${t.name} 치료를 위한 정밀 진단 및 수술`,
        },
        // MedicalIndication — who should get this treatment
        {
          "@context": "https://schema.org",
          "@type": "ApprovedIndication",
          "name": `${t.name} 적응증`,
          "description": t.concerns?.join('; '),
          "recognizingAuthority": { "@type": "Organization", "name": "대한치과의사협회" },
        },
        // TherapeuticProcedure — detailed treatment info for AEO
        {
          "@context": "https://schema.org",
          "@type": "TherapeuticProcedure",
          "name": t.name,
          "description": t.metaDesc,
          "procedureType": t.slug.includes('orthodontic') || t.slug.includes('invisalign') ? "NonSurgicalProcedure" : "SurgicalProcedure",
          "bodyLocation": "Oral cavity",
          "howPerformed": t.process?.map((s: any) => s.step).join(' → '),
          "preparation": "정밀 CT 촬영 및 디지털 스캔 진단 → 치료 계획 수립 → 마취 확인",
          "followup": "정기 검진 및 유지 관리 프로그램",
          "status": "https://schema.org/ActiveActionStatus",
          "doseSchedule": {
            "@type": "ReportedDoseSchedule",
            "doseUnit": "회",
            "frequency": t.process?.length ? `${t.process.length}단계 치료` : "개별 상담 후 결정",
          },
          "drug": [
            { "@type": "Drug", "name": "리도카인 (국소마취제)", "drugClass": { "@type": "DrugClass", "name": "Local anesthetic" } },
          ],
          "legalStatus": "의료기관에서만 시행 가능한 의료 행위",
          "recognizingAuthority": { "@type": "Organization", "name": "보건복지부" },
        },
        // Speakable for this treatment page (AEO)
        {
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": t.metaTitle,
          "speakable": {
            "@type": "SpeakableSpecification",
            "cssSelector": ["h1", ".hero-sub", "h2", "[itemprop='name']", "[itemprop='text']"]
          },
          "url": `https://seoul365dental.com/treatments/${t.slug}`,
        },
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
      jsonLd: [
        {
          "@context": "https://schema.org", "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "홈", "item": "https://seoul365dental.com" },
            { "@type": "ListItem", "position": 2, "name": "의료진", "item": "https://seoul365dental.com/doctors" }
          ]
        },
        // AboutPage — doctors listing
        {
          "@context": "https://schema.org",
          "@type": ["AboutPage", "MedicalWebPage"],
          "name": "서울365치과 의료진 소개",
          "description": "서울365치과 의료진. 서울대학교 치과대학 출신 5인 원장이 한 팀으로 협진합니다.",
          "url": "https://seoul365dental.com/doctors",
          "isPartOf": { "@id": "https://seoul365dental.com/#website" },
          "about": { "@id": "https://seoul365dental.com/#dentist" },
          "inLanguage": "ko-KR"
        },
        // ItemList — all doctors
        {
          "@context": "https://schema.org",
          "@type": "ItemList",
          "name": "서울365치과 의료진 목록",
          "description": "서울대 출신 5인 원장이 하나의 케이스를 함께 봅니다",
          "numberOfItems": doctors.length,
          "itemListElement": doctors.map((doc: any, i: number) => ({
            "@type": "ListItem",
            "position": i + 1,
            "url": `https://seoul365dental.com/doctors/${doc.slug}`,
            "item": {
              "@type": "Physician",
              "name": doc.name,
              "jobTitle": doc.title,
              "medicalSpecialty": doc.specialties,
              "description": doc.philosophy.split('.')[0] + '.',
              "worksFor": { "@id": "https://seoul365dental.com/#dentist" },
              "alumniOf": { "@type": "CollegeOrUniversity", "name": "서울대학교 치과대학" }
            }
          }))
        },
        // MedicalOrganization — team image
        {
          "@context": "https://schema.org",
          "@type": "ImageObject",
          "name": "서울365치과 의료진 단체사진",
          "url": "https://seoul365dental.com/static/team-photo.jpg",
          "description": "서울365치과 의료진 단체사진 - 서울대 출신 5인 원장",
          "representativeOfPage": true
        },
        // MedicalOrganization — team composition
        {
          "@context": "https://schema.org",
          "@type": "MedicalOrganization",
          "name": "서울365치과 의료진",
          "description": "서울대학교 치과대학 출신 5인 원장이 한 팀으로 협진하는 인천 구월동 치과",
          "url": "https://seoul365dental.com/doctors",
          "medicalSpecialty": ["Dentistry", "Implantology", "Orthodontics", "Endodontics", "Prosthodontics"],
          "employee": doctors.map((doc: any) => ({
            "@type": "Physician",
            "name": doc.name,
            "jobTitle": doc.title,
            "medicalSpecialty": doc.specialties,
            "alumniOf": { "@type": "CollegeOrUniversity", "name": "서울대학교 치과대학" },
            "url": `https://seoul365dental.com/doctors/${doc.slug}`,
          })),
          "numberOfEmployees": { "@type": "QuantitativeValue", "value": 5, "unitText": "원장" },
        },
        // EducationalOrganization — alma mater emphasis (AEO)
        {
          "@context": "https://schema.org",
          "@type": "CollegeOrUniversity",
          "name": "서울대학교 치과대학",
          "alternateName": "Seoul National University School of Dentistry",
          "alumni": doctors.map((doc: any) => ({
            "@type": "Person",
            "name": doc.name,
            "jobTitle": doc.title,
            "worksFor": { "@id": "https://seoul365dental.com/#dentist" }
          })),
        },
      ]
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
        // Physician (detailed)
        {
          "@context": "https://schema.org", "@type": "Physician",
          "@id": `https://seoul365dental.com/doctors/${doc.slug}#physician`,
          "name": doc.name, "jobTitle": doc.title,
          "description": doc.philosophy,
          "image": doc.slug === 'park-junkyu' ? 'https://seoul365dental.com/static/dr-park-profile.jpg' : undefined,
          "medicalSpecialty": doc.specialties,
          "alumniOf": doc.education.map((edu: string) => ({
            "@type": "EducationalOrganization",
            "name": edu
          })),
          "worksFor": { "@type": "Dentist", "@id": "https://seoul365dental.com/#dentist", "name": "서울365치과의원", "url": "https://seoul365dental.com" },
          "knowsAbout": doc.specialties,
          "hasCredential": doc.credentials.map((cred: string) => ({
            "@type": "EducationalOccupationalCredential",
            "credentialCategory": cred,
          })),
          "memberOf": doc.societies.map((soc: string) => ({
            "@type": "Organization",
            "name": soc
          })),
          "hasOccupation": {
            "@type": "Occupation",
            "name": "치과의사",
            "occupationalCategory": "29-1021",
            "qualifications": doc.credentials.join(', '),
            "skills": doc.specialties.join(', '),
          },
          "availableService": doc.specialties.map((s: string) => ({
            "@type": "MedicalProcedure", "name": s
          })),
          "url": `https://seoul365dental.com/doctors/${doc.slug}`,
        },
        // ProfilePage
        {
          "@context": "https://schema.org",
          "@type": "ProfilePage",
          "name": `${doc.name} ${doc.title} 프로필`,
          "url": `https://seoul365dental.com/doctors/${doc.slug}`,
          "mainEntity": { "@id": `https://seoul365dental.com/doctors/${doc.slug}#physician` },
          "isPartOf": { "@id": "https://seoul365dental.com/#website" },
          "inLanguage": "ko-KR",
          "dateModified": new Date().toISOString().split('T')[0]
        },
        // BreadcrumbList
        {
          "@context": "https://schema.org", "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "홈", "item": "https://seoul365dental.com" },
            { "@type": "ListItem", "position": 2, "name": "의료진", "item": "https://seoul365dental.com/doctors" },
            { "@type": "ListItem", "position": 3, "name": doc.name, "item": `https://seoul365dental.com/doctors/${doc.slug}` }
          ]
        },
        // Person schema (supplementary)
        {
          "@context": "https://schema.org",
          "@type": "Person",
          "name": doc.name,
          "jobTitle": doc.title,
          "worksFor": { "@id": "https://seoul365dental.com/#dentist" },
          "alumniOf": { "@type": "CollegeOrUniversity", "name": "서울대학교 치과대학" },
          "nationality": { "@type": "Country", "name": "KR" },
          "knowsLanguage": ["ko", "en"],
        },
        // EducationalOccupationalCredential — detailed credentials
        ...(doc.credentials.length > 0 ? [{
          "@context": "https://schema.org",
          "@type": "ItemList",
          "name": `${doc.name} 자격 및 인증`,
          "itemListElement": doc.credentials.map((cred: string, i: number) => ({
            "@type": "ListItem",
            "position": i + 1,
            "item": {
              "@type": "EducationalOccupationalCredential",
              "credentialCategory": cred,
              "recognizedBy": { "@type": "Organization", "name": "보건복지부" },
            }
          }))
        }] : []),
        // MedicalScholarlyArticle — doctor's expertise signal (AEO)
        {
          "@context": "https://schema.org",
          "@type": "MedicalScholarlyArticle",
          "name": `${doc.name} ${doc.title} — 진료 철학과 전문 분야`,
          "author": { "@type": "Physician", "name": doc.name, "@id": `https://seoul365dental.com/doctors/${doc.slug}#physician` },
          "about": doc.specialties.map((s: string) => ({ "@type": "MedicalEntity", "name": s })),
          "publisher": { "@id": "https://seoul365dental.com/#dentist" },
          "inLanguage": "ko-KR",
          "datePublished": "2024-01-01",
        },
        // Occupation schema — structured job data
        {
          "@context": "https://schema.org",
          "@type": "Occupation",
          "name": "치과의사",
          "occupationalCategory": "29-1021.00",
          "qualifications": doc.credentials.join(', ') || '서울대학교 치과대학 졸업',
          "skills": doc.specialties.join(', '),
          "estimatedSalary": { "@type": "MonetaryAmountDistribution", "currency": "KRW" },
          "occupationLocation": { "@type": "City", "name": "인천광역시" },
        },
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
      jsonLd: [
        {
          "@context": "https://schema.org", "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "홈", "item": "https://seoul365dental.com" },
            { "@type": "ListItem", "position": 2, "name": "상담 예약", "item": "https://seoul365dental.com/reservation" }
          ]
        },
        // ContactPage
        {
          "@context": "https://schema.org",
          "@type": "ContactPage",
          "name": "서울365치과 상담 예약",
          "description": "서울365치과 상담 예약. 전화, 카카오톡, 네이버 예약, 온라인 상담 신청.",
          "url": "https://seoul365dental.com/reservation",
          "isPartOf": { "@id": "https://seoul365dental.com/#website" },
          "about": { "@id": "https://seoul365dental.com/#dentist" },
          "inLanguage": "ko-KR"
        },
        // ReserveAction
        {
          "@context": "https://schema.org",
          "@type": "ReserveAction",
          "name": "서울365치과 상담 예약하기",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": "https://seoul365dental.com/reservation",
            "inLanguage": "ko",
            "actionPlatform": ["http://schema.org/DesktopWebPlatform", "http://schema.org/MobileWebPlatform"]
          },
          "result": {
            "@type": "Reservation",
            "name": "치과 상담 예약",
            "reservationFor": { "@id": "https://seoul365dental.com/#dentist" }
          },
          "agent": { "@id": "https://seoul365dental.com/#dentist" },
          "object": { "@type": "MedicalClinic", "name": "서울365치과의원" }
        },
        // CommunicateAction — multiple communication channels
        {
          "@context": "https://schema.org",
          "@type": "CommunicateAction",
          "name": "서울365치과 전화 상담",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": "tel:032-432-0365",
            "actionPlatform": ["http://schema.org/MobileWebPlatform"]
          },
          "about": { "@type": "Thing", "name": "치과 상담" }
        },
        // ScheduleAction — Naver booking
        {
          "@context": "https://schema.org",
          "@type": "ScheduleAction",
          "name": "네이버 예약으로 서울365치과 상담 신청",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": "https://booking.naver.com/booking/13/bizes/426166",
          },
          "agent": { "@type": "Person", "name": "환자" },
          "object": { "@type": "MedicalClinic", "name": "서울365치과의원" },
        },
        // Service — consultation service details
        {
          "@context": "https://schema.org",
          "@type": "Service",
          "name": "서울365치과 상담 서비스",
          "serviceType": "치과 상담",
          "provider": { "@id": "https://seoul365dental.com/#dentist" },
          "areaServed": { "@type": "City", "name": "인천광역시" },
          "serviceOutput": {
            "@type": "Thing",
            "name": "맞춤 치료 계획",
            "description": "정밀 CT 촬영 후 개인별 최적 치료 계획 수립"
          },
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "KRW",
            "description": "초진 상담 무료",
          },
          "termsOfService": "https://seoul365dental.com/terms",
          "availableChannel": [
            { "@type": "ServiceChannel", "serviceUrl": "https://seoul365dental.com/reservation", "serviceSmsNumber": "+82-32-432-0365", "name": "온라인 예약" },
            { "@type": "ServiceChannel", "servicePhone": { "@type": "ContactPoint", "telephone": "+82-32-432-0365" }, "name": "전화 예약" },
            { "@type": "ServiceChannel", "serviceUrl": "https://pf.kakao.com/_dMsCT", "name": "카카오톡 상담" },
          ]
        }
      ]
    }
  )
})

// ============================================================
// PRICING
// ============================================================
// ============================================================
// INFO: Pricing + Directions (Tab page)
// ============================================================
app.get('/pricing', (c) => c.redirect('/info', 301))
app.get('/directions', (c) => c.redirect('/info#directions', 301))

app.get('/info', (c) => {
  return c.render(
    <>
      <section class="treatment-hero">
        <div class="relative z-10 max-w-[1400px] mx-auto px-5 md:px-8 py-28 md:py-36">
          <nav class="text-sm text-white/25 mb-6 reveal" style="transition-delay:0.2s">
            <a href="/" class="hover:text-white transition-colors">홈</a>
            <i class="fa-solid fa-chevron-right text-[0.6rem] mx-2 text-white/10"></i>
            <span class="text-white/60">내원안내</span>
          </nav>
          <h1 class="section-headline text-white mb-4 reveal" style="transition-delay:0.4s">내원 안내</h1>
          <p class="hero-sub text-white/35 reveal" style="transition-delay:0.6s">진료 비용과 찾아오시는 방법을 안내드립니다.</p>
        </div>
      </section>

      {/* Tab Switcher */}
      <section class="sticky top-[72px] z-30 bg-white/90 backdrop-blur border-b border-gray-100">
        <div class="max-w-5xl mx-auto px-5 md:px-8">
          <div class="flex gap-0" id="infoTabs">
            <button onclick="switchInfoTab('pricing')" id="tab-pricing" class="info-tab active flex-1 py-4 text-center text-sm font-bold text-[#0066FF] border-b-2 border-[#0066FF] transition-all">
              <i class="fa-solid fa-won-sign mr-1.5"></i>비용 안내
            </button>
            <button onclick="switchInfoTab('directions')" id="tab-directions" class="info-tab flex-1 py-4 text-center text-sm font-bold text-gray-400 border-b-2 border-transparent hover:text-gray-600 transition-all">
              <i class="fa-solid fa-location-dot mr-1.5"></i>오시는 길
            </button>
          </div>
        </div>
      </section>

      {/* === PRICING TAB === */}
      <section id="panel-pricing" class="section-lg bg-mesh">
        <div class="max-w-5xl mx-auto px-5 md:px-8">
          {/* Category Quick Nav */}
          <div class="flex flex-wrap gap-2 justify-center mb-12 reveal">
            {pricingCategories.map(cat => (
              <a href={`#pricing-${cat.key}`} class="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-gray-200 bg-white text-gray-600 text-[0.78rem] font-medium hover:border-[#0066FF]/40 hover:text-[#0066FF] transition-all">
                <i class={`fa-solid ${cat.icon} text-[0.65rem]`}></i>
                {cat.label}
              </a>
            ))}
          </div>

          {/* Category Tables */}
          {pricingCategories.map(cat => {
            const items = pricingData.filter(p => p.category === cat.key);
            if (items.length === 0) return null;
            return (
              <div id={`pricing-${cat.key}`} class="mb-12 reveal-3d">
                <div class="flex items-center gap-2 mb-4">
                  <div class="w-8 h-8 rounded-lg bg-[#0066FF]/10 flex items-center justify-center">
                    <i class={`fa-solid ${cat.icon} text-[#0066FF] text-sm`}></i>
                  </div>
                  <h2 class="text-lg font-bold text-gray-800">{cat.label}</h2>
                  <span class="text-xs text-gray-400 ml-1">{items.length}항목</span>
                </div>
                <div class="premium-card overflow-hidden">
                  <div class="overflow-x-auto">
                    <table class="w-full text-sm">
                      <thead>
                        <tr class="bg-gradient-to-r from-navy to-navy-lighter text-white/90">
                          <th class="text-left px-5 py-3 font-semibold text-[0.78rem]">치료 항목</th>
                          <th class="text-right px-5 py-3 font-semibold text-[0.78rem]">비용</th>
                          <th class="text-right px-5 py-3 font-semibold text-[0.78rem] hidden sm:table-cell">보험</th>
                        </tr>
                      </thead>
                      <tbody class="divide-y divide-gray-50">
                        {items.map((p, i) => (
                          <tr class={`hover:bg-[#0066FF]/[0.02] transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                            <td class="px-5 py-3 text-gray-800 font-medium">
                              {p.treatment}
                              {p.note && <span class="text-[0.65rem] text-gray-400 ml-1.5">({p.note})</span>}
                            </td>
                            <td class="px-5 py-3 text-right text-[#0066FF] font-bold whitespace-nowrap">{p.price}</td>
                            <td class="px-5 py-3 text-right text-gray-400 hidden sm:table-cell text-xs">{p.insurance}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            );
          })}

          <div class="mt-8 glass-card p-5 reveal">
            <div class="flex items-start gap-3">
              <i class="fa-solid fa-circle-info text-amber-500 mt-0.5"></i>
              <div>
                <p class="text-sm text-gray-600 font-medium">위 가격은 참고용이며, 환자 상태에 따라 달라질 수 있습니다. 정확한 비용은 정밀 진단 후 안내드립니다.</p>
                <p class="text-xs text-gray-400 mt-1">카드 결제 및 분할 결제가 가능합니다.</p>
              </div>
            </div>
          </div>

          <div class="text-center mt-10 reveal">
            <a href="/reservation" class="btn-premium btn-premium-fill" data-cursor-hover>비용 상담 예약하기 <i class="fa-solid fa-arrow-right text-xs ml-1"></i></a>
          </div>
        </div>
      </section>

      {/* === DIRECTIONS TAB === */}
      <section id="panel-directions" class="section-lg bg-mesh" style="display:none">
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
              <i class="fa-brands fa-google text-xs"></i> Google Maps
            </a>
            <a href={`https://map.naver.com/p/search/${encodeURIComponent(CLINIC.address)}`}
               target="_blank" rel="noopener"
               class="btn-premium btn-premium-outline text-sm px-6 py-3" style="border-color:#03cf5d40;color:#03cf5d" data-cursor-hover>
              <i class="fa-solid fa-map text-xs"></i> 네이버 지도
            </a>
            <a href={`https://map.kakao.com/link/search/${encodeURIComponent(CLINIC.address)}`}
               target="_blank" rel="noopener"
               class="btn-premium btn-premium-outline text-sm px-6 py-3" style="border-color:#FEE50040;color:#3C1E1E" data-cursor-hover>
              <i class="fa-solid fa-location-dot text-xs"></i> 카카오맵
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

      {/* Tab Switching Script */}
      <script dangerouslySetInnerHTML={{__html: `
        function switchInfoTab(tab) {
          document.querySelectorAll('.info-tab').forEach(b => {
            b.classList.remove('active','text-[#0066FF]','border-[#0066FF]');
            b.classList.add('text-gray-400','border-transparent');
          });
          const active = document.getElementById('tab-' + tab);
          if (active) { active.classList.add('active','text-[#0066FF]','border-[#0066FF]'); active.classList.remove('text-gray-400','border-transparent'); }
          document.getElementById('panel-pricing').style.display = tab === 'pricing' ? '' : 'none';
          document.getElementById('panel-directions').style.display = tab === 'directions' ? '' : 'none';
          history.replaceState(null, '', tab === 'directions' ? '/info#directions' : '/info');
        }
        // Auto-switch on hash
        if (window.location.hash === '#directions') switchInfoTab('directions');
      `}} />
    </>,
    {
      title: '내원안내 | 서울365치과 - 진료비용·오시는길·진료시간',
      description: '서울365치과 내원 안내. 임플란트, 교정, 심미치료 비용. 인천 남동구 예술로 138 이토타워 2층. 예술회관역 5번 출구 도보 3분.',
      canonical: 'https://seoul365dental.com/info',
      jsonLd: [
        {
          "@context": "https://schema.org", "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "홈", "item": "https://seoul365dental.com" },
            { "@type": "ListItem", "position": 2, "name": "내원안내", "item": "https://seoul365dental.com/info" }
          ]
        },
        {
          "@context": "https://schema.org",
          "@type": "OfferCatalog",
          "name": "서울365치과 진료비용표",
          "description": "서울365치과 비급여 항목 진료비용",
          "itemListElement": pricingSummary.map((p: any) => ({
            "@type": "Offer",
            "itemOffered": { "@type": "MedicalProcedure", "name": p.treatment },
            "priceCurrency": "KRW", "price": p.price,
            "description": `보험: ${p.insurance}`,
            "seller": { "@id": "https://seoul365dental.com/#dentist" },
            "availability": "https://schema.org/InStock"
          }))
        },
        {
          "@context": "https://schema.org",
          "@type": "Place",
          "name": "서울365치과의원",
          "address": { "@type": "PostalAddress", "streetAddress": "예술로 138 이토타워 2층 212호", "addressLocality": "인천광역시 남동구", "addressRegion": "인천", "postalCode": "21556", "addressCountry": "KR" },
          "geo": { "@type": "GeoCoordinates", "latitude": "37.4482", "longitude": "126.7042" },
          "hasMap": "https://www.google.com/maps?q=37.4482,126.7042",
        },
        {
          "@context": "https://schema.org",
          "@type": "HowTo",
          "name": "서울365치과 찾아오는 방법",
          "step": [
            { "@type": "HowToStep", "position": 1, "name": "지하철", "text": "인천 2호선 예술회관역 5번 출구로 나오세요." },
            { "@type": "HowToStep", "position": 2, "name": "도보 이동", "text": "5번 출구에서 직진 약 250m (도보 3분)." },
            { "@type": "HowToStep", "position": 3, "name": "도착", "text": "이토타워 건물 2층 서울365치과의원입니다." },
          ]
        },
      ]
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
        },
        // QAPage — alternative for AEO engines
        {
          "@context": "https://schema.org",
          "@type": "QAPage",
          "name": "서울365치과 자주 묻는 질문",
          "mainEntity": allFaq.map(f => ({
            "@type": "Question",
            "name": f.q,
            "answerCount": 1,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": f.a,
              "author": { "@type": "Organization", "name": "서울365치과의원" },
              "dateCreated": "2026-01-01",
              "upvoteCount": 10,
            }
          }))
        },
        // Speakable for FAQ page
        {
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "자주 묻는 질문 FAQ | 서울365치과",
          "url": "https://seoul365dental.com/faq",
          "speakable": {
            "@type": "SpeakableSpecification",
            "cssSelector": ["h1", "h3[itemprop='name']", "p[itemprop='text']"]
          },
        },
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

  // Fetch published cases from DB
  let dbCases: any[] = [];
  try {
    await initAdminTables(c.env.DB);
    const result = await c.env.DB.prepare('SELECT * FROM before_after_cases WHERE is_published = 1 ORDER BY sort_order DESC, created_at DESC').all();
    dbCases = result.results || [];
  } catch {}

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

          {dbCases.length === 0 ? (
            <div class="text-center py-20">
              <div class="w-20 h-20 rounded-full bg-[#0066FF]/5 mx-auto mb-6 flex items-center justify-center">
                <i class="fa-solid fa-images text-3xl text-[#0066FF]/20"></i>
              </div>
              <h2 class="text-lg font-bold text-gray-900 mb-2">아직 등록된 사례가 없습니다</h2>
              <p class="text-gray-400 text-sm">곧 실제 치료 사례를 업로드할 예정입니다.</p>
            </div>
          ) : (
            <>
              {/* Filter Tabs */}
              <div class="flex flex-wrap gap-2 mb-8 reveal" id="caseFilters">
                <button onclick="filterCases('all')" class="case-filter-btn active px-4 py-2 rounded-full text-xs font-semibold bg-[#0066FF] text-white transition" data-filter="all">전체 ({dbCases.length})</button>
                {Array.from(new Set(dbCases.map((cs: any) => cs.tag))).map((tag: any) => (
                  <button onclick={`filterCases('${tag}')`} data-filter={tag} class="case-filter-btn px-4 py-2 rounded-full text-xs font-semibold bg-gray-100 text-gray-500 hover:bg-gray-200 transition">{tag} ({dbCases.filter((cs: any) => cs.tag === tag).length})</button>
                ))}
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children" id="casesGrid">
                {dbCases.map((cs: any) => (
                  <div class="premium-card overflow-hidden tilt-card electric-card-border case-card" data-tag={cs.tag}>
                    <div class="aspect-[4/3] bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center relative overflow-hidden">
                      {cs.before_image && cs.after_image ? (
                        <div class="absolute inset-0 flex ba-slider" data-id={cs.id}>
                          <div class="w-1/2 overflow-hidden border-r-2 border-white relative">
                            <img src={cs.before_image} alt="Before" class="absolute inset-0 w-full h-full object-cover" style="max-width:none;width:200%" />
                            <span class="absolute top-3 left-3 text-[0.6rem] font-bold tracking-widest uppercase text-white bg-black/40 px-2 py-0.5 rounded">Before</span>
                          </div>
                          <div class="w-1/2 overflow-hidden relative">
                            <img src={cs.after_image} alt="After" class="absolute inset-0 w-full h-full object-cover" style="max-width:none;width:200%;margin-left:-100%" />
                            <span class="absolute top-3 right-3 text-[0.6rem] font-bold tracking-widest uppercase text-white bg-[#0066FF]/70 px-2 py-0.5 rounded">After</span>
                          </div>
                        </div>
                      ) : (
                        <div class="absolute inset-0 flex">
                          <div class="w-1/2 flex items-center justify-center bg-gray-100/80 border-r border-gray-200/50">
                            {cs.before_image ? <img src={cs.before_image} alt="Before" class="w-full h-full object-cover" /> : <span class="text-gray-300 text-sm font-bold tracking-widest uppercase">Before</span>}
                          </div>
                          <div class="w-1/2 flex items-center justify-center bg-gradient-to-br from-[#0066FF]/5 to-[#00E5FF]/[0.02]">
                            {cs.after_image ? <img src={cs.after_image} alt="After" class="w-full h-full object-cover" /> : <span class="text-[#0066FF]/30 text-sm font-bold tracking-widest uppercase">After</span>}
                          </div>
                        </div>
                      )}
                    </div>
                    <div class="p-5">
                      <div class="flex items-center gap-2 mb-2">
                        <span class="text-[0.7rem] bg-[#0066FF]/8 text-[#0066FF] px-2.5 py-0.5 rounded-full font-semibold">{cs.tag}</span>
                        {cs.duration && <span class="text-[0.65rem] text-gray-400"><i class="fa-regular fa-clock mr-0.5"></i>{cs.duration}</span>}
                      </div>
                      <h3 class="font-bold text-gray-900 text-sm">{cs.title}</h3>
                      {cs.description && <p class="text-gray-500 text-xs mt-1.5 line-clamp-2">{cs.description}</p>}
                      <p class="text-xs text-gray-400 mt-2">담당: {cs.doctor_name}{cs.patient_age ? ` · ${cs.patient_age}` : ''}{cs.patient_gender ? ` ${cs.patient_gender}` : ''}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          <p class="text-[0.72rem] text-gray-300 text-center mt-10">※ 개인에 따라 치료 결과가 다를 수 있습니다. 모든 사례는 환자 동의 하에 게시되었습니다.</p>
        </div>
      </section>

      <script dangerouslySetInnerHTML={{__html: `
        function filterCases(tag) {
          document.querySelectorAll('.case-filter-btn').forEach(b => {
            b.classList.remove('bg-[#0066FF]', 'text-white', 'active');
            b.classList.add('bg-gray-100', 'text-gray-500');
          });
          const activeBtn = document.querySelector('[data-filter="'+tag+'"]');
          if (activeBtn) { activeBtn.classList.add('bg-[#0066FF]', 'text-white', 'active'); activeBtn.classList.remove('bg-gray-100', 'text-gray-500'); }
          document.querySelectorAll('.case-card').forEach(card => {
            if (tag === 'all' || card.dataset.tag === tag) { card.style.display = ''; } else { card.style.display = 'none'; }
          });
        }
      `}} />
    </>,
    {
      title: '치료 사례 Before & After | 서울365치과',
      description: '서울365치과 치료 사례. 임플란트, 교정, 심미치료 Before & After.',
      canonical: 'https://seoul365dental.com/cases/gallery',
      jsonLd: [
        {
          "@context": "https://schema.org", "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "홈", "item": "https://seoul365dental.com" },
            { "@type": "ListItem", "position": 2, "name": "치료사례", "item": "https://seoul365dental.com/cases/gallery" }
          ]
        },
        {
          "@context": "https://schema.org",
          "@type": "ImageGallery",
          "name": "서울365치과 치료 사례 갤러리",
          "description": "서울365치과 임플란트, 교정, 심미치료 Before & After 갤러리. 실제 치료 전후 사진.",
          "url": "https://seoul365dental.com/cases/gallery",
          "about": { "@id": "https://seoul365dental.com/#dentist" },
          "isPartOf": { "@id": "https://seoul365dental.com/#website" },
          "accessMode": "visual",
          "isAccessibleForFree": false,
          "conditionsOfAccess": "회원 로그인 필요",
        },
        {
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": "서울365치과 치료 사례",
          "url": "https://seoul365dental.com/cases/gallery",
          "inLanguage": "ko-KR",
        },
      ]
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
// ADMIN: Before/After Case Management
// ============================================================

// Helper: Verify admin session
async function getAdminUser(db: D1Database, cookieHeader?: string | null): Promise<{ id: number; username: string; name: string } | null> {
  const { getSessionIdFromCookie } = await import('./lib/auth');
  const sessionId = getSessionIdFromCookie(cookieHeader);
  if (!sessionId) return null;
  try {
    const row = await db.prepare(`
      SELECT a.id, a.username, a.name FROM admin_sessions s
      JOIN admin_users a ON a.id = s.admin_id
      WHERE s.id = ? AND s.expires_at > datetime('now')
    `).bind(sessionId).first<{ id: number; username: string; name: string }>();
    return row || null;
  } catch { return null; }
}

// Helper: Init admin tables
async function initAdminTables(db: D1Database) {
  await db.prepare(`CREATE TABLE IF NOT EXISTS admin_users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT NOT NULL UNIQUE, password_hash TEXT NOT NULL, name TEXT NOT NULL, role TEXT DEFAULT 'admin', created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`).run();
  await db.prepare(`CREATE TABLE IF NOT EXISTS admin_sessions (id TEXT PRIMARY KEY, admin_id INTEGER NOT NULL, expires_at DATETIME NOT NULL, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (admin_id) REFERENCES admin_users(id) ON DELETE CASCADE)`).run();
  await db.prepare(`CREATE TABLE IF NOT EXISTS before_after_cases (id INTEGER PRIMARY KEY AUTOINCREMENT, treatment_slug TEXT NOT NULL, title TEXT NOT NULL, patient_age TEXT, patient_gender TEXT, tag TEXT NOT NULL, doctor_name TEXT NOT NULL, description TEXT, duration TEXT, before_image TEXT, after_image TEXT, is_published INTEGER DEFAULT 1, sort_order INTEGER DEFAULT 0, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP)`).run();
}

// --- Admin Login Page ---
app.get('/admin', async (c) => {
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
app.post('/api/admin/login', async (c) => {
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

// Override getAdminUser to use admin_session cookie
async function getAdminFromCookie(db: D1Database, cookieHeader?: string | null): Promise<{ id: number; username: string; name: string } | null> {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(/(?:^|;\s*)admin_session=([^;]+)/);
  if (!match) return null;
  try {
    const row = await db.prepare(`
      SELECT a.id, a.username, a.name FROM admin_sessions s
      JOIN admin_users a ON a.id = s.admin_id
      WHERE s.id = ? AND s.expires_at > datetime('now')
    `).bind(match[1]).first<{ id: number; username: string; name: string }>();
    return row || null;
  } catch { return null; }
}

// --- Admin Dashboard ---
app.get('/admin/dashboard', async (c) => {
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
app.get('/api/admin/logout', async (c) => {
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
})

// --- CRUD API: Cases ---
app.post('/api/admin/cases', async (c) => {
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

app.put('/api/admin/cases/:id', async (c) => {
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

app.delete('/api/admin/cases/:id', async (c) => {
  await initAdminTables(c.env.DB);
  const admin = await getAdminFromCookie(c.env.DB, c.req.header('cookie'));
  if (!admin) return c.json({ ok: false, error: '인증 필요' }, 401);

  const id = c.req.param('id');
  await c.env.DB.prepare('DELETE FROM before_after_cases WHERE id = ?').bind(id).run();
  return c.json({ ok: true });
})

// --- Public API: Get published cases (for gallery) ---
app.get('/api/cases', async (c) => {
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

// ============================================================
// BLOG SYSTEM
// ============================================================

// Helper: Init blog tables
async function initBlogTables(db: D1Database) {
  await db.prepare(`CREATE TABLE IF NOT EXISTS blog_posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    category TEXT DEFAULT '치과상식',
    tags TEXT,
    cover_image TEXT,
    treatment_slug TEXT,
    author_name TEXT DEFAULT '서울365치과',
    is_published INTEGER DEFAULT 0,
    view_count INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`).run();
}

// Simple markdown-like renderer (lightweight, no deps)
function renderContent(md: string): string {
  let html = md
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    // Headers
    .replace(/^### (.+)$/gm, '<h3 class="text-lg font-bold text-gray-900 mt-8 mb-3">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold text-gray-900 mt-10 mb-4" id="$1">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold text-gray-900 mt-10 mb-4">$1</h1>')
    // Bold / Italic
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold text-gray-900">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Lists
    .replace(/^- (.+)$/gm, '<li class="ml-4 text-gray-600">$1</li>')
    .replace(/^(\d+)\. (.+)$/gm, '<li class="ml-4 text-gray-600" value="$1">$1. $2</li>')
    // Blockquote
    .replace(/^&gt; (.+)$/gm, '<blockquote class="border-l-4 border-[#0066FF]/30 pl-4 py-2 my-4 text-gray-500 italic bg-[#0066FF]/[0.02] rounded-r-lg">$1</blockquote>')
    // Horizontal rule
    .replace(/^---$/gm, '<hr class="my-8 border-gray-100"/>')
    // Paragraphs (lines that aren't already HTML)
    .replace(/^(?!<[hlubo]|<hr|<li)(.+)$/gm, '<p class="text-gray-600 leading-relaxed mb-4">$1</p>')
    // Wrap consecutive li in ul
    .replace(/(<li[^>]*>.*<\/li>\n?)+/g, (m) => `<ul class="space-y-1.5 my-4 list-disc">${m}</ul>`);
  return html;
}

// --- Admin Blog Editor ---
app.get('/admin/blog', async (c) => {
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
                      <p class="text-white/20 text-xs mt-0.5">{p.slug} · 조회 {p.view_count || 0} · {p.created_at?.split('T')[0] || p.created_at?.split(' ')[0]}</p>
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
                  </div>
                </div>
                <textarea id="postContent" rows={20} placeholder={"## 서론\n\n환자분들이 가장 많이 궁금해하시는...\n\n## 본론\n\n### 1. 첫 번째 포인트\n\n내용을 작성하세요.\n\n- 목록 항목 1\n- 목록 항목 2\n\n> 전문가 팁: 이런 부분을 주의하세요.\n\n## 결론\n\n정리하면..."} class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white outline-none text-sm font-mono resize-none placeholder-white/10 leading-relaxed" oninput="updatePreview()"></textarea>
              </div>
            </div>

            {/* Right — Preview */}
            <div class="hidden lg:block w-1/2 overflow-y-auto bg-white border-l border-white/5">
              <div class="max-w-2xl mx-auto px-8 py-10">
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

      {/* Blog Editor Scripts */}
      <script dangerouslySetInnerHTML={{__html: `
        function openEditor(data) {
          document.getElementById('editorModal').classList.remove('hidden');
          if (data) {
            document.getElementById('editorTitle').textContent = '글 수정';
            document.getElementById('postId').value = data.id;
            document.getElementById('postTitle').value = data.title;
            document.getElementById('postCategory').value = data.category || '치과상식';
            document.getElementById('postTreatment').value = data.treatment_slug || '';
            document.getElementById('postTags').value = data.tags || '';
            document.getElementById('postExcerpt').value = data.excerpt || '';
            document.getElementById('postContent').value = data.content || '';
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
            updatePreview();
          }
        }
        function closeEditor() { document.getElementById('editorModal').classList.add('hidden'); }

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

        function updatePreview() {
          const title = document.getElementById('postTitle').value;
          const category = document.getElementById('postCategory').value;
          const content = document.getElementById('postContent').value;
          document.getElementById('prevTitle').textContent = title || '제목을 입력하세요';
          document.getElementById('prevCategory').textContent = category;
          // Simple markdown-like preview
          let html = content
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/^### (.+)$/gm, '<h3 class="text-lg font-bold text-gray-900 mt-8 mb-3">$1</h3>')
            .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold text-gray-900 mt-10 mb-4">$1</h2>')
            .replace(/\\*\\*(.+?)\\*\\*/g, '<strong class="font-bold text-gray-900">$1</strong>')
            .replace(/^- (.+)$/gm, '<li class="ml-4 text-gray-600">• $1</li>')
            .replace(/^&gt; (.+)$/gm, '<blockquote class="border-l-4 border-blue-200 pl-4 py-2 my-4 text-gray-500 italic bg-blue-50/50 rounded-r-lg">$1</blockquote>')
            .replace(/^---$/gm, '<hr class="my-8 border-gray-100"/>')
            .replace(/^(?!<[hlubo]|<hr|<li)(.+)$/gm, '<p class="text-gray-600 leading-relaxed mb-4">$1</p>');
          document.getElementById('prevContent').innerHTML = html || '<p class="text-gray-400">본문 미리보기...</p>';
        }

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
function slugify(text: string): string {
  return text.toLowerCase().trim()
    .replace(/[^\w\s가-힣-]/g, '').replace(/[\s_]+/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, '')
    .substring(0, 80) || `post-${Date.now()}`;
}

app.post('/api/admin/blog', async (c) => {
  await initBlogTables(c.env.DB);
  const admin = await getAdminFromCookie(c.env.DB, c.req.header('cookie'));
  if (!admin) return c.json({ ok: false, error: '인증 필요' }, 401);

  const data = await c.req.json();
  const slug = slugify(data.title) + '-' + Date.now().toString(36);
  await c.env.DB.prepare(`
    INSERT INTO blog_posts (slug, title, excerpt, content, category, tags, treatment_slug, author_name, is_published)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(slug, data.title, data.excerpt || null, data.content, data.category || '치과상식', data.tags || null, data.treatment_slug || null, '서울365치과', data.is_published ? 1 : 0).run();
  return c.json({ ok: true, slug });
})

app.get('/api/admin/blog/:id', async (c) => {
  await initBlogTables(c.env.DB);
  const admin = await getAdminFromCookie(c.env.DB, c.req.header('cookie'));
  if (!admin) return c.json({ ok: false, error: '인증 필요' }, 401);
  const post = await c.env.DB.prepare('SELECT * FROM blog_posts WHERE id = ?').bind(c.req.param('id')).first();
  return post ? c.json({ ok: true, post }) : c.json({ ok: false, error: '없음' }, 404);
})

app.put('/api/admin/blog/:id', async (c) => {
  await initBlogTables(c.env.DB);
  const admin = await getAdminFromCookie(c.env.DB, c.req.header('cookie'));
  if (!admin) return c.json({ ok: false, error: '인증 필요' }, 401);
  const data = await c.req.json();
  await c.env.DB.prepare(`
    UPDATE blog_posts SET title=?, excerpt=?, content=?, category=?, tags=?, treatment_slug=?, is_published=?, updated_at=datetime('now') WHERE id=?
  `).bind(data.title, data.excerpt || null, data.content, data.category || '치과상식', data.tags || null, data.treatment_slug || null, data.is_published ? 1 : 0, c.req.param('id')).run();
  return c.json({ ok: true });
})

app.delete('/api/admin/blog/:id', async (c) => {
  await initBlogTables(c.env.DB);
  const admin = await getAdminFromCookie(c.env.DB, c.req.header('cookie'));
  if (!admin) return c.json({ ok: false, error: '인증 필요' }, 401);
  await c.env.DB.prepare('DELETE FROM blog_posts WHERE id = ?').bind(c.req.param('id')).run();
  return c.json({ ok: true });
})

// --- Public Blog Pages ---
app.get('/blog', async (c) => {
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
          <nav class="text-sm text-white/25 mb-6 reveal" style="transition-delay:0.2s">
            <a href="/" class="hover:text-white transition-colors">홈</a>
            <i class="fa-solid fa-chevron-right text-[0.6rem] mx-2 text-white/10"></i>
            <span class="text-white/60">블로그</span>
          </nav>
          <h1 class="section-headline text-white mb-4 reveal" style="transition-delay:0.4s">서울365치과 블로그</h1>
          <p class="hero-sub text-white/35 reveal" style="transition-delay:0.6s">치아 건강에 대한 전문 정보를 쉽게 알려드립니다.</p>
        </div>
      </section>

      <section class="section-lg bg-mesh">
        <div class="max-w-5xl mx-auto px-5 md:px-8">
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
                    <h2 class="font-bold text-gray-900 group-hover:text-[#0066FF] transition-colors line-clamp-2">{post.title}</h2>
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
      title: `서울365치과 블로그${category ? ' - ' + category : ''} | 치아 건강 전문 정보`,
      description: '서울365치과 치과 전문 블로그. 임플란트, 교정, 충치치료, 잇몸치료 등 치아 건강에 대한 전문 정보와 치료 가이드.',
      canonical: 'https://seoul365dental.com/blog',
      jsonLd: [
        { "@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "홈", "item": "https://seoul365dental.com" },
          { "@type": "ListItem", "position": 2, "name": "블로그", "item": "https://seoul365dental.com/blog" }
        ]},
        { "@context": "https://schema.org", "@type": "Blog", "name": "서울365치과 블로그", "description": "치아 건강 전문 정보 블로그", "url": "https://seoul365dental.com/blog", "publisher": { "@id": "https://seoul365dental.com/#dentist" }, "inLanguage": "ko-KR",
          "blogPost": posts.slice(0, 10).map((p: any) => ({
            "@type": "BlogPosting", "headline": p.title, "description": p.excerpt || '', "url": `https://seoul365dental.com/blog/${p.slug}`,
            "datePublished": p.created_at, "author": { "@type": "Organization", "name": "서울365치과" }
          }))
        },
        { "@context": "https://schema.org", "@type": "CollectionPage", "name": "서울365치과 블로그", "url": "https://seoul365dental.com/blog", "isPartOf": { "@id": "https://seoul365dental.com/#website" } }
      ]
    }
  )
})

// Blog Detail Page
app.get('/blog/:slug', async (c) => {
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
          {/* Breadcrumb */}
          <nav class="text-sm text-gray-300 mb-8">
            <a href="/" class="hover:text-[#0066FF] transition">홈</a>
            <i class="fa-solid fa-chevron-right text-[0.5rem] mx-2 text-gray-200"></i>
            <a href="/blog" class="hover:text-[#0066FF] transition">블로그</a>
            <i class="fa-solid fa-chevron-right text-[0.5rem] mx-2 text-gray-200"></i>
            <a href={`/blog?category=${encodeURIComponent(post.category)}`} class="hover:text-[#0066FF] transition">{post.category}</a>
          </nav>

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
      canonical: `https://seoul365dental.com/blog/${post.slug}`,
      jsonLd: [
        { "@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "홈", "item": "https://seoul365dental.com" },
          { "@type": "ListItem", "position": 2, "name": "블로그", "item": "https://seoul365dental.com/blog" },
          { "@type": "ListItem", "position": 3, "name": post.title, "item": `https://seoul365dental.com/blog/${post.slug}` }
        ]},
        {
          "@context": "https://schema.org", "@type": "BlogPosting",
          "headline": post.title,
          "description": post.excerpt || post.title,
          "datePublished": post.created_at,
          "dateModified": post.updated_at,
          "author": { "@type": "Organization", "name": "서울365치과", "url": "https://seoul365dental.com" },
          "publisher": { "@id": "https://seoul365dental.com/#dentist" },
          "mainEntityOfPage": `https://seoul365dental.com/blog/${post.slug}`,
          "url": `https://seoul365dental.com/blog/${post.slug}`,
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
    { loc: '', priority: '1.0', changefreq: 'daily', images: [
      { url: `${base}/static/og-image.jpg`, title: '서울365치과 메인 이미지', caption: '인천 구월동 서울대 출신 5인 전문의 치과' },
      { url: `${base}/static/dr-park.jpg`, title: '박준규 대표원장', caption: '서울대 통합치의학과 전문의' },
    ], video: { url: 'https://www.youtube.com/watch?v=gB_yiatcwAc', title: '서울365치과 소개 영상', thumbnail: 'https://img.youtube.com/vi/gB_yiatcwAc/maxresdefault.jpg', description: '서울365치과 진료 환경 클리닉 투어' } },
    { loc: '/treatments', priority: '0.9', changefreq: 'weekly' },
    { loc: '/doctors', priority: '0.9', changefreq: 'monthly', images: [
      { url: `${base}/static/team-photo.jpg`, title: '서울365치과 의료진 단체사진', caption: '서울대 출신 5인 원장' },
      { url: `${base}/static/dr-park-profile.jpg`, title: '박준규 대표원장 프로필', caption: '서울대 통합치의학과 전문의' },
    ] },
    { loc: '/info', priority: '0.8', changefreq: 'weekly' },
    { loc: '/reservation', priority: '0.8', changefreq: 'monthly' },
    { loc: '/blog', priority: '0.8', changefreq: 'daily' },
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
    images: d.slug === 'park-junkyu' ? [{ url: `${base}/static/dr-park-profile.jpg`, title: `${d.name} ${d.title}`, caption: d.metaDesc }] : undefined,
  }));

  const allPages = [...staticPages, ...treatmentPages, ...doctorPages];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${allPages.map((p: any) => `  <url>
    <loc>${base}${p.loc}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
    <xhtml:link rel="alternate" hreflang="ko-KR" href="${base}${p.loc}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${base}${p.loc}" />${p.images ? p.images.map((img: any) => `
    <image:image>
      <image:loc>${img.url}</image:loc>
      <image:title>${img.title}</image:title>
      <image:caption>${img.caption}</image:caption>
    </image:image>`).join('') : ''}${p.video ? `
    <video:video>
      <video:thumbnail_loc>${p.video.thumbnail}</video:thumbnail_loc>
      <video:title>${p.video.title}</video:title>
      <video:description>${p.video.description}</video:description>
      <video:content_loc>${p.video.url}</video:content_loc>
      <video:family_friendly>yes</video:family_friendly>
    </video:video>` : ''}
  </url>`).join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
      'X-Robots-Tag': 'noindex',
    },
  });
})

// ============================================================
// ROBOTS.TXT
// ============================================================
app.get('/robots.txt', (c) => {
  const robots = `# ====================================================
# 서울365치과의원 (Seoul 365 Dental Clinic)
# https://seoul365dental.com
# robots.txt — SEO/AEO Optimized v2.0
# Last updated: ${new Date().toISOString().split('T')[0]}
# ====================================================

# === GENERAL RULES (all crawlers) ===
User-agent: *
Allow: /
Allow: /treatments/
Allow: /doctors/
Allow: /info
Allow: /blog
Allow: /faq
Allow: /reservation
Allow: /cases/gallery
Allow: /sitemap.xml

# Disallow non-content pages
Disallow: /api/
Disallow: /admin
Disallow: /admin/
Disallow: /login
Disallow: /register
Disallow: /privacy
Disallow: /terms

# === GOOGLE ===
User-agent: Googlebot
Allow: /
Crawl-delay: 0

User-agent: Googlebot-Image
Allow: /static/
Allow: /*.jpg$
Allow: /*.png$
Allow: /*.webp$
Allow: /*.svg$

User-agent: Googlebot-Video
Allow: /

User-agent: Googlebot-News
Allow: /

User-agent: Storebot-Google
Allow: /

User-agent: Google-InspectionTool
Allow: /

# === NAVER ===
User-agent: Yeti
Allow: /
Crawl-delay: 1

User-agent: Naverbot
Allow: /
Crawl-delay: 1

# === BING ===
User-agent: Bingbot
Allow: /
Crawl-delay: 1

User-agent: BingPreview
Allow: /

# === DAUM/KAKAO ===
User-agent: Daumoa
Allow: /
Crawl-delay: 1

# === YAHOO ===
User-agent: Slurp
Allow: /
Crawl-delay: 1

# === YANDEX ===
User-agent: YandexBot
Allow: /
Crawl-delay: 2

# === APPLE ===
User-agent: Applebot
Allow: /

# === TWITTER/X ===
User-agent: Twitterbot
Allow: /

# === FACEBOOK ===
User-agent: facebookexternalhit
Allow: /

# === LINKEDIN ===
User-agent: LinkedInBot
Allow: /

# === TELEGRAM ===
User-agent: TelegramBot
Allow: /

# === KAKAOTALK CRAWLER ===
User-agent: kakaotalk-scrap
Allow: /

# === AI/AEO CRAWLERS (critical for AI answer optimization) ===
User-agent: GPTBot
Allow: /
Allow: /treatments/
Allow: /doctors/
Allow: /faq
Allow: /info
Allow: /blog
Disallow: /api/
Disallow: /login
Disallow: /register

User-agent: ChatGPT-User
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Anthropic-ai
Allow: /

User-agent: Claude-Web
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Bytespider
Allow: /

User-agent: CCBot
Allow: /

User-agent: YouBot
Allow: /

User-agent: cohere-ai
Allow: /

User-agent: Diffbot
Allow: /

User-agent: Meta-ExternalAgent
Allow: /

User-agent: Meta-ExternalFetcher
Allow: /

User-agent: AI2Bot
Allow: /

User-agent: Timpibot
Allow: /

User-agent: omgili
Allow: /

User-agent: PetalBot
Allow: /

# === STRUCTURED DATA VALIDATORS ===
User-agent: Google-Structured-Data-Testing-Tool
Allow: /

User-agent: W3C_Validator
Allow: /

# === BLOCK BAD/AGGRESSIVE BOTS ===
User-agent: AhrefsBot
Crawl-delay: 10

User-agent: MJ12bot
Crawl-delay: 10

User-agent: SemrushBot
Crawl-delay: 10

User-agent: DotBot
Disallow: /

User-agent: BLEXBot
Disallow: /

User-agent: DataForSeoBot
Crawl-delay: 30

# === SITEMAPS ===
Sitemap: https://seoul365dental.com/sitemap.xml

# === HOST ===
Host: https://seoul365dental.com
`;

  return new Response(robots, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
      'X-Robots-Tag': 'all',
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
