import { Hono } from 'hono'
import { renderer } from './renderer'
import { CLINIC, STATS, DIFF_CARDS, HOURS } from './data/clinic'
import { doctors, getDoctorBySlug } from './data/doctors'
import { treatments, getTreatmentBySlug, treatmentCategories } from './data/treatments'
import { mainFaq, pricingData } from './data/faq'
import { MESSAGING, MISSION, VISION, MAIN_SUMMARY, DIFF_COPY, PERSONAS, TREATMENT_EMPATHY, DOCTOR_STORIES, SLOGANS } from './data/brand'

const app = new Hono()
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
      {/* ===== S1: CINEMATIC HERO — ELECTRIC SHOCK v5 ===== */}
      <section class="hero-premium">
        {/* Background layers */}
        <div class="hero-grid"></div>
        <canvas id="hero-particles"></canvas>
        <div class="orb orb-1"></div>
        <div class="orb orb-2"></div>
        <div class="orb orb-3"></div>

        <div class="relative z-10 max-w-[1400px] mx-auto px-5 md:px-8 w-full">
          <div class="max-w-4xl pt-28 pb-16 md:pt-0 md:pb-0">
            {/* Status Badge — Electric */}
            <div class="flex items-center gap-3 mb-10 reveal" style="transition-delay:0.3s">
              <div class="glass trust-badge text-white/90" data-status>
                <span class="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                <span class="font-semibold">진료중</span>
              </div>
              <span class="text-[#0066FF]/30 text-xs">|</span>
              <span class="text-white/30 text-xs font-medium tracking-wider">인천 구월동 · 예술회관역 5번 출구</span>
            </div>

            {/* H1 — Brand Tagline */}
            <h1 class="hero-display gradient-text-white mb-8 reveal" style="transition-delay:0.5s">
              다른 곳에서 안 된다는 분들이<br/><span class="gradient-text-electric">저희를 찾습니다.</span>
            </h1>

            {/* Sub Copy — Philosophy + Summary */}
            <p class="text-white/50 text-lg md:text-xl leading-relaxed max-w-2xl mb-3 reveal" style="transition-delay:0.65s">
              {MESSAGING.heroSub.split('\n')[0]}
            </p>
            <p class="text-white/35 text-base md:text-lg leading-relaxed max-w-2xl mb-6 reveal" style="transition-delay:0.75s">
              {MESSAGING.heroSub.split('\n')[1]}
            </p>

            {/* Metric Bar — Electric Tags */}
            <div class="flex flex-wrap items-center gap-3 mb-12 reveal" style="transition-delay:0.85s">
              {[
                { label: '365일 진료', icon: 'fa-calendar-check' },
                { label: '야간 21시', icon: 'fa-moon' },
                { label: '자체 기공실', icon: 'fa-gear' },
                { label: '수면진료', icon: 'fa-bed' },
              ].map(m => (
                <div class="flex items-center gap-2 text-sm px-3 py-1.5 rounded-full border border-[#0066FF]/15 bg-[#0066FF]/[0.04]">
                  <i class={`fa-solid ${m.icon} text-[#0066FF]/70 text-xs`}></i>
                  <span class="text-white/55 font-medium">{m.label}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons — Electric Glow */}
            <div class="flex flex-wrap gap-4 mb-14 reveal" style="transition-delay:1s">
              <a href="/reservation" class="btn-premium btn-premium-fill btn-electric-glow btn-magnetic text-[0.95rem] px-10 py-4.5" data-cursor-hover>
                <i class="fa-solid fa-calendar-check"></i> 상담 예약하기
              </a>
              <a href="/pricing" class="btn-premium btn-premium-white btn-magnetic text-[0.95rem] px-10 py-4.5" data-cursor-hover>
                <i class="fa-solid fa-won-sign"></i> 비용 안내
              </a>
            </div>

            {/* Trust Scores — Electric Style */}
            <div class="flex flex-wrap gap-5 reveal" style="transition-delay:1.15s">
              {[
                { label: '네이버', score: '4.85', icon: 'fa-star', color: 'text-amber-400' },
                { label: '구글', score: '4.9', icon: 'fa-star', color: 'text-amber-400' },
                { label: '만족도', score: '98%', icon: 'fa-heart', color: 'text-rose-400' },
                { label: '재방문율', score: '87%', icon: 'fa-rotate', color: 'text-[#00E5FF]' },
              ].map(m => (
                <div class="flex items-center gap-2 text-white/35 text-[0.82rem]">
                  <i class={`fa-solid ${m.icon} ${m.color} text-[0.7rem]`}></i>
                  <span class="font-bold text-white/85">{m.score}</span>
                  <span>{m.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll Indicator — Electric */}
        <div class="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 text-white/15 text-center reveal" style="transition-delay:1.3s">
          <div class="w-7 h-11 border-2 border-[#0066FF]/20 rounded-full flex justify-center pt-2 mx-auto mb-2">
            <div class="w-1 h-3 bg-[#0066FF]/40 rounded-full animate-bounce"></div>
          </div>
          <span class="text-[0.6rem] tracking-[0.2em] uppercase font-medium text-[#0066FF]/30">Scroll</span>
        </div>
      </section>

      {/* ===== S2: MARQUEE TICKER — ELECTRIC ===== */}
      <section class="bg-navy-light border-y border-[#0066FF]/[0.06] overflow-hidden relative">
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

      {/* ===== S3: STATS — ELECTRIC COUNTER ===== */}
      <section class="section-lg bg-white relative overflow-hidden" data-counter-section>
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
      <section class="section-lg bg-mesh relative overflow-hidden">
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
      <section class="section-lg bg-premium-dark bg-mesh-dark relative overflow-hidden">
        {/* Extra electric accent */}
        <div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#0066FF]/20 to-transparent"></div>
        <div class="max-w-[1400px] mx-auto px-5 md:px-8">
          <div class="text-center mb-16 reveal">
            <span class="section-eyebrow text-[#0066FF] mb-4 block">OUR DOCTORS</span>
            <h2 class="section-headline text-white">
              서울대 출신<br class="md:hidden" /> <span class="gradient-text-electric">5인 전문의</span>
            </h2>
            <p class="section-body text-white/30 mt-5 max-w-xl mx-auto">각 분야별 전문의가 협력하여 최적의 치료를 제공합니다.</p>
          </div>

          {/* Lead Doctor — Electric Card */}
          <div class="premium-card-dark p-0 overflow-hidden mb-8 reveal-3d">
            <div class="md:flex">
              <div class="md:w-2/5 bg-gradient-to-br from-[#0066FF]/20 via-[#0066FF]/10 to-transparent p-10 flex items-center justify-center min-h-[340px] relative">
                <div class="absolute inset-0 bg-gradient-to-t from-navy/80 to-transparent"></div>
                <div class="text-center relative z-10">
                  <div class="w-36 h-36 rounded-full bg-white/[0.05] border-2 border-white/[0.08] mx-auto mb-5 flex items-center justify-center pulse-ring">
                    <i class="fa-solid fa-user-doctor text-5xl text-white/25"></i>
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
              <div class="md:w-3/5 p-8 md:p-10 flex flex-col justify-center">
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
              <a href={`/doctors/${doc.slug}`} class="premium-card-dark p-6 text-center block group tilt-card" data-cursor-hover>
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
      <section class="section-lg bg-white relative overflow-hidden">
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
      <section class="section-lg bg-mesh relative overflow-hidden">
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
      <section class="section-lg bg-mesh relative overflow-hidden" itemscope itemtype="https://schema.org/FAQPage">
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
      <section class="section-lg bg-premium-dark bg-mesh-dark relative overflow-hidden">
        <div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#0066FF]/20 to-transparent"></div>
        <div class="max-w-[1400px] mx-auto px-5 md:px-8">
          <div class="text-center mb-16 reveal">
            <span class="section-eyebrow text-[#0066FF] mb-4 block">OUR PROMISE</span>
            <h2 class="section-headline text-white">{VISION.headline}</h2>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 stagger-children">
            {VISION.promises.map((p, i) => (
              <div class="premium-card-dark p-8 text-center tilt-card">
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
              {MESSAGING.ctaMain.split('.')[0]}.<br class="md:hidden" /> <span class="gradient-text-electric">{MESSAGING.ctaMain.split('.')[1]?.trim() || '지금 상담 받으세요.'}</span>
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
      title: '서울365치과 | 다른 곳에서 안 된다는 분들이 저희를 찾습니다 - 인천 구월동',
      description: '다른 곳에서 안 된다는 분들이 찾는 인천 구월동 서울365치과. 서울대 출신 5인 원장, 마취가 안 되면 절대 시작하지 않습니다. 365일 진료. 032-432-0365',
      canonical: 'https://seoul365dental.com',
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
      title: '전체 진료 안내 | 서울365치과',
      description: '서울365치과 전체 진료 안내. 임플란트, 교정, 심미치료, 수면진료 등 24개 진료 항목.',
      canonical: 'https://seoul365dental.com/treatments',
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
  const doc = getDoctorBySlug(t.doctorSlug);
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
      <section class="section-lg bg-white">
        <div class="max-w-3xl mx-auto px-5 md:px-8">
          <div class="text-center mb-14 reveal">
            <span class="section-eyebrow text-[#0066FF] mb-3 block">PROCESS</span>
            <h2 class="section-sub-headline text-gray-900">{t.name} 치료 과정</h2>
          </div>
          <div class="space-y-0 stagger-children">
            {t.process.map((step, i) => (
              <div class="timeline-line flex gap-5 pb-8">
                <div class="timeline-dot">{i + 1}</div>
                <div class="pt-3">
                  <h3 class="font-bold text-gray-900">{step.step}</h3>
                  {step.desc && <p class="text-gray-500 text-sm mt-1">{step.desc}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Doctor */}
      {doc && (
        <section class="section-lg bg-mesh">
          <div class="max-w-4xl mx-auto px-5 md:px-8">
            <div class="text-center mb-14 reveal">
              <span class="section-eyebrow text-[#0066FF] mb-3 block">DOCTOR</span>
              <h2 class="section-sub-headline text-gray-900">담당 의료진</h2>
            </div>
            <div class="glass-card p-0 overflow-hidden reveal-3d">
              <div class="md:flex items-center">
                <div class="md:w-1/3 bg-gradient-to-br from-[#0066FF]/8 to-[#00E5FF]/[0.02] p-8 flex items-center justify-center min-h-[200px]">
                  <div class="text-center">
                    <div class="w-24 h-24 rounded-full bg-[#0066FF]/10 mx-auto mb-3 flex items-center justify-center">
                      <i class="fa-solid fa-user-doctor text-3xl text-[#0066FF]/40"></i>
                    </div>
                    <h3 class="font-bold text-gray-900 text-lg">{doc.name}</h3>
                    <p class="text-[#0066FF] text-sm font-semibold">{doc.titleShort}</p>
                  </div>
                </div>
                <div class="md:w-2/3 p-6 md:p-8">
                  <blockquote class="text-gray-600 italic border-l-2 border-[#0066FF] pl-4 mb-4 text-[0.9rem] leading-relaxed">
                    "{doc.philosophy.split('.')[0]}."
                  </blockquote>
                  <p class="text-gray-400 text-sm mb-4">{doc.specialties.join(' · ')}</p>
                  <a href={`/doctors/${doc.slug}`} class="inline-flex items-center gap-1.5 text-[#0066FF] text-sm font-semibold link-underline" data-cursor-hover>
                    프로필 보기 <i class="fa-solid fa-arrow-right text-xs"></i>
                  </a>
                </div>
              </div>
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
    </>,
    {
      title: t.metaTitle,
      description: t.metaDesc,
      canonical: `https://seoul365dental.com/treatments/${t.slug}`,
      jsonLd: {
        "@context": "https://schema.org", "@type": "MedicalProcedure",
        "name": t.name, "procedureType": "http://schema.org/SurgicalProcedure",
        "bodyLocation": "Jaw", "description": t.metaDesc,
      }
    }
  )
})

// ============================================================
// DOCTORS LIST
// ============================================================
app.get('/doctors', (c) => {
  return c.render(
    <>
      <section class="treatment-hero">
        <div class="relative z-10 max-w-[1400px] mx-auto px-5 md:px-8 py-28 md:py-36">
          <nav class="text-sm text-white/25 mb-6 reveal" style="transition-delay:0.2s">
            <a href="/" class="hover:text-white transition-colors">홈</a>
            <i class="fa-solid fa-chevron-right text-[0.6rem] mx-2 text-white/10"></i>
            <span class="text-white/60">의료진</span>
          </nav>
          <h1 class="section-headline text-white mb-4 reveal" style="transition-delay:0.4s">서울365치과 의료진 소개</h1>
          <p class="hero-sub text-white/35 max-w-xl reveal" style="transition-delay:0.6s">서울대 출신 5인 원장이 하나의 케이스를 함께 봅니다.</p>
        </div>
      </section>

      <section class="section-lg bg-mesh">
        <div class="max-w-[1400px] mx-auto px-5 md:px-8">
          {/* Lead doctor */}
          <div class="premium-card overflow-hidden mb-10 reveal-3d">
            <div class="md:flex">
              <div class="md:w-2/5 bg-gradient-to-br from-[#0066FF]/10 to-[#00E5FF]/[0.02] p-10 flex items-center justify-center min-h-[360px]">
                <div class="text-center">
                  <div class="w-40 h-40 rounded-full bg-[#0066FF]/10 mx-auto mb-5 flex items-center justify-center border-2 border-[#0066FF]/15">
                    <i class="fa-solid fa-user-doctor text-6xl text-[#0066FF]/30"></i>
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
      title: '의료진 소개 | 서울365치과 - 서울대 출신 5인 전문의',
      description: '서울365치과 의료진. 서울대 출신 5인 원장 협력 진료.',
      canonical: 'https://seoul365dental.com/doctors',
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
            <div class="w-32 h-32 rounded-full bg-white/[0.06] border border-white/[0.08] flex items-center justify-center flex-shrink-0 mx-auto md:mx-0 mb-6 md:mb-0">
              <i class="fa-solid fa-user-doctor text-5xl text-white/20"></i>
            </div>
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
      jsonLd: {
        "@context": "https://schema.org", "@type": "Physician",
        "name": doc.name, "jobTitle": doc.title,
        "alumniOf": { "@type": "CollegeOrUniversity", "name": "서울대학교 치과대학" },
        "worksFor": { "@type": "Dentist", "name": "서울365치과의원" },
      }
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
      title: '상담 예약 | 서울365치과',
      description: '서울365치과 상담 예약. 전화, 카카오톡, 온라인 예약 가능. 032-432-0365',
      canonical: 'https://seoul365dental.com/reservation',
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
      title: '진료비용 안내 | 서울365치과',
      description: '서울365치과 비급여 진료비 안내. 임플란트, 교정, 심미치료 비용 확인.',
      canonical: 'https://seoul365dental.com/pricing',
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
          {/* Map placeholder */}
          <div class="premium-card overflow-hidden aspect-video flex items-center justify-center mb-10 reveal-3d">
            <div class="text-center text-gray-300">
              <i class="fa-solid fa-map-location-dot text-5xl mb-3"></i>
              <p class="font-semibold text-gray-400">지도 영역</p>
              <p class="text-sm text-gray-300">Naver/Kakao Map API 연동 예정</p>
            </div>
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
      title: '오시는 길 | 서울365치과 - 예술회관역 5번 출구',
      description: '예술회관역 5번 출구에서 250m. 이토타워 2층. 주차 안내 및 교통편 정보.',
      canonical: 'https://seoul365dental.com/directions',
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
      title: '자주 묻는 질문 | 서울365치과',
      description: '서울365치과 FAQ. 임플란트 비용, 치료 기간, 수면진료 안전성 등.',
      canonical: 'https://seoul365dental.com/faq',
    }
  )
})

// ============================================================
// CASES GALLERY
// ============================================================
app.get('/cases/gallery', (c) => {
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
          <div class="grid grid-cols-1 md:grid-cols-3 gap-5 stagger-children">
            {[
              '전체임플란트 – 상악 전체 수복', '올온X – 하악 즉시로딩', '인비절라인 – 성인 투명교정',
              '크라운 – 올세라믹 수복', '심미보철 – 라미네이트', '임플란트 – 단일 식립',
            ].map(title => (
              <div class="premium-card overflow-hidden tilt-card">
                <div class="aspect-[4/3] bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                  <div class="text-center text-gray-300">
                    <i class="fa-solid fa-image text-3xl mb-2"></i>
                    <p class="text-xs">사진 준비 중</p>
                  </div>
                </div>
                <div class="p-5">
                  <h3 class="font-bold text-gray-900 text-sm">{title}</h3>
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
