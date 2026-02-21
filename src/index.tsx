import { Hono } from 'hono'
import { renderer } from './renderer'
import { CLINIC, STATS, DIFF_CARDS, HOURS } from './data/clinic'
import { doctors, getDoctorBySlug } from './data/doctors'
import { treatments, getTreatmentBySlug, treatmentCategories } from './data/treatments'
import { mainFaq, pricingData } from './data/faq'

const app = new Hono()
app.use(renderer)

// ============================================================
// HOME PAGE - 13 Sections
// ============================================================
app.get('/', (c) => {
  const topTreatments = treatments.filter(t => 
    ['full-implant','all-on-x','orthodontics','sedation','cosmetic','implant'].includes(t.slug)
  );
  const featuredDoctors = [doctors[0], doctors[2], doctors[4]]; // 박준규, 정문희, 하누리

  return c.render(
    <>
      {/* ===== S1: HERO ===== */}
      <section class="hero-gradient relative overflow-hidden">
        <div class="absolute inset-0 opacity-10">
          <div class="absolute top-20 right-20 w-96 h-96 bg-white/20 rounded-full blur-3xl"></div>
          <div class="absolute bottom-20 left-20 w-72 h-72 bg-blue-300/20 rounded-full blur-3xl"></div>
        </div>
        <div class="relative max-w-7xl mx-auto px-4 py-16 md:py-24 lg:py-32">
          <div class="max-w-3xl">
            {/* Operating Badge */}
            <div class="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white text-sm px-4 py-1.5 rounded-full mb-6 border border-white/20">
              <span class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span id="operating-status-hero"></span>
              <span class="text-white/50">|</span>
              <span class="text-white/80">점심시간 없음</span>
            </div>
            
            {/* Location */}
            <p class="text-blue-200 text-sm md:text-base mb-3">
              <i class="fa-solid fa-location-dot mr-1"></i>
              인천 구월동 · 예술회관역 5번 출구
            </p>

            {/* H1 */}
            <h1 class="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
              과잉진료 없는<br/>
              <span class="text-blue-200">양심치과</span>
            </h1>

            {/* Sub */}
            <p class="text-lg md:text-xl text-blue-100 mb-8 leading-relaxed">
              서울대 출신 5인 원장 · 365일 진료 · 자체 기공실
            </p>

            {/* Stats */}
            <div class="flex flex-wrap gap-3 mb-8">
              {STATS.map(s => (
                <div class="flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-xl border border-white/10 text-sm">
                  <i class={`fa-solid ${s.icon} text-blue-300`}></i>
                  <span class="font-semibold">{s.value}</span>
                  <span class="text-blue-200">{s.label}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div class="flex flex-wrap gap-3">
              <a href="/reservation" class="btn-primary text-base px-8 py-3.5 shadow-lg shadow-blue-900/30">
                <i class="fa-solid fa-calendar-check"></i> 상담 예약하기
              </a>
              <a href="/pricing" class="btn-white text-base px-8 py-3.5">
                <i class="fa-solid fa-won-sign"></i> 비용 안내
              </a>
            </div>

            {/* Review Scores */}
            <div class="flex flex-wrap gap-4 mt-8 text-sm text-blue-100">
              <span class="flex items-center gap-1"><i class="fa-solid fa-star text-yellow-400"></i> 네이버 4.85</span>
              <span class="flex items-center gap-1"><i class="fa-solid fa-star text-yellow-400"></i> 구글 4.9</span>
              <span class="flex items-center gap-1"><i class="fa-solid fa-heart text-red-400"></i> 만족도 98%</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== S2: OPERATING STATUS ===== */}
      <section class="bg-white border-b border-gray-100">
        <div class="max-w-7xl mx-auto px-4 py-6">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            {HOURS.map(h => (
              <div class="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
                <span class="font-semibold text-gray-800">{h.day}</span>
                <span class="text-primary font-medium">{h.time}</span>
              </div>
            ))}
          </div>
          <div class="flex items-center justify-center gap-2 mt-4 text-sm">
            <span class="inline-flex items-center gap-1.5 bg-primary-light text-primary px-3 py-1 rounded-full font-medium">
              <i class="fa-solid fa-clock"></i> 점심시간 없이 연속 진료
            </span>
            <span class="inline-flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1 rounded-full font-medium">
              <i class="fa-solid fa-calendar-check"></i> 일요일·공휴일도 진료
            </span>
          </div>
        </div>
      </section>

      {/* ===== S3: DIFF CARDS ===== */}
      <section class="section-padding bg-slate-50">
        <div class="max-w-7xl mx-auto px-4">
          <div class="text-center mb-12 animate-on-scroll">
            <h2 class="section-title">서울대 출신 5인 전문의, 365일 진료</h2>
            <p class="text-gray-500 mt-3 text-lg">다른 치과와는 다른, 서울365치과만의 차별점</p>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {DIFF_CARDS.map(card => (
              <div class="bg-white rounded-2xl p-6 border border-gray-100 card-hover animate-on-scroll">
                <div class="w-14 h-14 bg-primary-light rounded-2xl flex items-center justify-center mb-4">
                  <i class={`fa-solid ${card.icon} text-primary text-2xl`}></i>
                </div>
                <h3 class="text-lg font-bold text-gray-900 mb-2">{card.title}</h3>
                <p class="text-gray-500 text-sm leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== S4: TREATMENTS ===== */}
      <section class="section-padding bg-white">
        <div class="max-w-7xl mx-auto px-4">
          <div class="text-center mb-12 animate-on-scroll">
            <h2 class="section-title">서울365치과 주력 진료 안내</h2>
            <p class="text-gray-500 mt-3 text-lg">각 분야 전문의가 최적의 치료를 제안합니다</p>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {topTreatments.map(t => (
              <a href={`/treatments/${t.slug}`} class="treatment-card group animate-on-scroll block">
                <div class="w-12 h-12 bg-primary-light rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                  <i class={`fa-solid ${t.icon} text-primary text-xl group-hover:text-white`}></i>
                </div>
                <h3 class="font-bold text-gray-900 mb-1">{t.name}</h3>
                <p class="text-sm text-gray-500 mb-3">{t.shortDesc}</p>
                <span class="text-primary text-sm font-medium group-hover:underline">자세히 보기 <i class="fa-solid fa-arrow-right text-xs ml-1"></i></span>
              </a>
            ))}
          </div>
          <div class="text-center mt-8">
            <a href="/treatments" class="btn-secondary">전체 진료 보기 <i class="fa-solid fa-arrow-right ml-1"></i></a>
          </div>
        </div>
      </section>

      {/* ===== S5: DOCTORS ===== */}
      <section class="section-padding bg-slate-50">
        <div class="max-w-7xl mx-auto px-4">
          <div class="text-center mb-12 animate-on-scroll">
            <h2 class="section-title">서울365치과 의료진 소개</h2>
            <p class="text-gray-500 mt-3 text-lg">서울대 출신 5인 원장이 협력 진료합니다</p>
          </div>

          {/* 대표원장 Feature */}
          <div class="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm mb-8 animate-on-scroll">
            <div class="md:flex">
              <div class="md:w-1/3 bg-gradient-to-br from-primary to-primary-dark p-8 flex items-center justify-center min-h-[280px]">
                <div class="text-center text-white">
                  <div class="w-32 h-32 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <i class="fa-solid fa-user-doctor text-5xl text-white/80"></i>
                  </div>
                  <h3 class="text-xl font-bold">박준규 대표원장</h3>
                  <p class="text-blue-200 text-sm mt-1">통합치의학과 전문의</p>
                </div>
              </div>
              <div class="md:w-2/3 p-6 md:p-8">
                <blockquote class="text-lg text-gray-700 italic border-l-4 border-primary pl-4 mb-6 leading-relaxed">
                  "환자가 알아들을 수 있는 쉬운 단어로 설명하겠습니다"
                </blockquote>
                <ul class="space-y-2 text-sm text-gray-600">
                  <li class="flex items-start gap-2"><i class="fa-solid fa-graduation-cap text-primary mt-0.5"></i> 서울대학교 치과대학 졸업 / 치의학 석사</li>
                  <li class="flex items-start gap-2"><i class="fa-solid fa-certificate text-primary mt-0.5"></i> 보건복지부 인증 통합치의학과 전문의</li>
                  <li class="flex items-start gap-2"><i class="fa-solid fa-globe text-primary mt-0.5"></i> 미국 하버드대학교 임플란트 고급과정 수료</li>
                </ul>
                <a href="/doctors/park-junkyu" class="inline-flex items-center gap-1 text-primary font-semibold text-sm mt-4 hover:underline">
                  프로필 보기 <i class="fa-solid fa-arrow-right text-xs"></i>
                </a>
              </div>
            </div>
          </div>

          {/* Other Doctors */}
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {doctors.slice(1).map(doc => (
              <a href={`/doctors/${doc.slug}`} class="bg-white rounded-2xl p-5 border border-gray-100 text-center card-hover animate-on-scroll block">
                <div class="w-20 h-20 bg-primary-light rounded-full mx-auto mb-3 flex items-center justify-center">
                  <i class="fa-solid fa-user-doctor text-2xl text-primary"></i>
                </div>
                <h3 class="font-bold text-gray-900">{doc.name} {doc.titleShort}</h3>
                <p class="text-sm text-gray-500 mt-1">{doc.specialties.slice(0,2).join(' · ')}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ===== S6: BEFORE/AFTER ===== */}
      <section class="section-padding bg-white">
        <div class="max-w-7xl mx-auto px-4">
          <div class="text-center mb-12 animate-on-scroll">
            <h2 class="section-title">치료 사례 Before &amp; After</h2>
            <p class="text-gray-500 mt-3 text-lg">실제 치료 사례로 결과를 확인하세요</p>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['전체임플란트 – 상악 전체 수복', '올온X – 하악 즉시로딩', '인비절라인 – 성인 투명교정'].map((title, i) => (
              <div class="bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 animate-on-scroll">
                <div class="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative">
                  <div class="absolute inset-0 flex">
                    <div class="w-1/2 bg-gray-200 flex items-center justify-center border-r-2 border-white">
                      <span class="text-gray-400 font-bold text-sm">Before</span>
                    </div>
                    <div class="w-1/2 bg-primary-light flex items-center justify-center">
                      <span class="text-primary font-bold text-sm">After</span>
                    </div>
                  </div>
                </div>
                <div class="p-4">
                  <h3 class="font-semibold text-gray-900 text-sm">{title}</h3>
                  <p class="text-xs text-gray-400 mt-1">담당: 박준규 대표원장</p>
                </div>
              </div>
            ))}
          </div>
          <p class="text-xs text-gray-400 text-center mt-6">※ 개인에 따라 치료 결과가 다를 수 있습니다. 모든 사례는 환자 동의 하에 게시되었습니다.</p>
          <div class="text-center mt-4">
            <a href="/cases/gallery" class="text-primary font-semibold text-sm hover:underline">전체 사례 보기 <i class="fa-solid fa-arrow-right text-xs ml-1"></i></a>
          </div>
        </div>
      </section>

      {/* ===== S7-8: REVIEWS ===== */}
      <section class="section-padding bg-slate-50">
        <div class="max-w-7xl mx-auto px-4">
          <div class="text-center mb-12 animate-on-scroll">
            <h2 class="section-title">환자 리뷰 &amp; 평점</h2>
            <p class="text-gray-500 mt-3 text-lg">실제 환자분들의 솔직한 후기</p>
          </div>

          {/* Scores */}
          <div class="flex flex-wrap justify-center gap-6 mb-10 animate-on-scroll">
            {[
              { platform: '네이버', score: '4.85', icon: 'fa-solid fa-n', color: 'bg-green-500' },
              { platform: '구글', score: '4.9', icon: 'fa-brands fa-google', color: 'bg-red-500' },
              { platform: '만족도', score: '98%', icon: 'fa-solid fa-heart', color: 'bg-pink-500' },
            ].map(r => (
              <div class="bg-white rounded-2xl px-8 py-6 text-center border border-gray-100 shadow-sm">
                <div class={`w-10 h-10 ${r.color} text-white rounded-xl flex items-center justify-center mx-auto mb-2`}>
                  <i class={`${r.icon}`}></i>
                </div>
                <p class="text-2xl font-bold text-gray-900">{r.score}</p>
                <p class="text-sm text-gray-500">{r.platform}</p>
              </div>
            ))}
          </div>

          {/* Review Cards */}
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: '김O영', text: '스케일링부터 임플란트까지, 자세한 설명과 친절한 진료에 늘 감사드립니다. 365일 진료라 바쁜 직장인에게 최고입니다.', tags: ['스케일링', '친절한 설명'], stars: 5 },
              { name: '이O수', text: '전체임플란트 수술 받았습니다. 수면진료라 전혀 무섭지 않았고, 자체 기공실이 있어서 보철물 맞춤이 정말 빠르고 정확했습니다.', tags: ['전체임플란트', '수면진료'], stars: 5 },
              { name: '박O현', text: '인비절라인 교정 중인데, 하누리 원장님이 꼼꼼하게 체크해주시고 예상 결과를 3D로 보여주셔서 믿음이 갑니다.', tags: ['인비절라인', '교정과 전문의'], stars: 5 },
            ].map(review => (
              <div class="review-card animate-on-scroll">
                <div class="flex items-center gap-1 mb-2">
                  {Array(review.stars).fill(0).map(() => <i class="fa-solid fa-star text-yellow-400 text-sm"></i>)}
                </div>
                <p class="text-gray-700 text-sm leading-relaxed mb-3">{review.text}</p>
                <div class="flex items-center justify-between">
                  <span class="text-gray-400 text-xs">{review.name}</span>
                  <div class="flex gap-1">
                    {review.tags.map(tag => <span class="text-xs bg-primary-light text-primary px-2 py-0.5 rounded-full">{tag}</span>)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== S9: PRICING ===== */}
      <section class="section-padding bg-white">
        <div class="max-w-7xl mx-auto px-4">
          <div class="text-center mb-12 animate-on-scroll">
            <h2 class="section-title">비용 미리보기</h2>
            <p class="text-gray-500 mt-3 text-lg">투명한 비용 안내, 부담 없이 확인하세요</p>
          </div>
          <div class="max-w-3xl mx-auto animate-on-scroll">
            <div class="bg-gray-50 rounded-2xl overflow-hidden border border-gray-100">
              <table class="w-full text-sm">
                <thead>
                  <tr class="bg-primary text-white">
                    <th class="text-left px-5 py-3 font-semibold">치료</th>
                    <th class="text-right px-5 py-3 font-semibold">가격대</th>
                    <th class="text-right px-5 py-3 font-semibold hidden sm:table-cell">보험</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                  {pricingData.slice(0, 7).map(p => (
                    <tr class="hover:bg-white transition-colors">
                      <td class="px-5 py-3 text-gray-800 font-medium">{p.treatment}</td>
                      <td class="px-5 py-3 text-right text-primary font-semibold">{p.price}</td>
                      <td class="px-5 py-3 text-right text-gray-500 hidden sm:table-cell">{p.insurance}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div class="mt-4 text-center">
              <p class="text-xs text-gray-400 mb-3">※ 정확한 비용은 진단 후 안내드립니다. 카드 결제 및 분할 옵션 가능.</p>
              <a href="/pricing" class="text-primary font-semibold text-sm hover:underline">비용 자세히 보기 <i class="fa-solid fa-arrow-right text-xs ml-1"></i></a>
            </div>
          </div>
        </div>
      </section>

      {/* ===== S10: FAQ ===== */}
      <section class="section-padding bg-slate-50" itemscope itemtype="https://schema.org/FAQPage">
        <div class="max-w-3xl mx-auto px-4">
          <div class="text-center mb-12 animate-on-scroll">
            <h2 class="section-title">자주 묻는 질문</h2>
            <p class="text-gray-500 mt-3 text-lg">궁금하신 점을 먼저 확인해 보세요</p>
          </div>
          <div class="space-y-3 animate-on-scroll">
            {mainFaq.map(faq => (
              <div class="bg-white rounded-xl border border-gray-100 overflow-hidden" itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
                <button class="faq-toggle w-full text-left px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <h3 class="font-semibold text-gray-800 text-sm md:text-base pr-4" itemprop="name">{faq.q}</h3>
                  <i class="fa-solid fa-chevron-down text-gray-400 text-sm faq-icon flex-shrink-0"></i>
                </button>
                <div class="hidden px-5 pb-4" itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
                  <p class="text-gray-600 text-sm leading-relaxed" itemprop="text">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
          <div class="text-center mt-6">
            <a href="/faq" class="text-primary font-semibold text-sm hover:underline">FAQ 전체 보기 <i class="fa-solid fa-arrow-right text-xs ml-1"></i></a>
          </div>
        </div>
      </section>

      {/* ===== S11: CONTENT ===== */}
      <section class="section-padding bg-white">
        <div class="max-w-7xl mx-auto px-4">
          <div class="text-center mb-12 animate-on-scroll">
            <h2 class="section-title">칼럼 &amp; 콘텐츠</h2>
            <p class="text-gray-500 mt-3 text-lg">서울365치과의 전문 콘텐츠</p>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: '전체임플란트, 틀니보다 좋은 이유 5가지', tag: '임플란트', date: '2026.02.15' },
              { title: '치아교정 나이 제한? 성인교정 궁금증 해결', tag: '교정', date: '2026.02.10' },
              { title: '수면진료, 정말 안전한가요?', tag: '수면진료', date: '2026.02.05' },
            ].map(article => (
              <div class="bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 card-hover animate-on-scroll">
                <div class="aspect-video bg-gradient-to-br from-primary-light to-blue-50 flex items-center justify-center">
                  <i class="fa-solid fa-newspaper text-4xl text-primary/30"></i>
                </div>
                <div class="p-4">
                  <span class="text-xs bg-primary-light text-primary px-2 py-0.5 rounded-full font-medium">{article.tag}</span>
                  <h3 class="font-bold text-gray-900 text-sm mt-2 leading-snug">{article.title}</h3>
                  <p class="text-xs text-gray-400 mt-2">{article.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== S12: FINAL CTA ===== */}
      <section class="hero-gradient section-padding">
        <div class="max-w-4xl mx-auto px-4 text-center">
          <div class="animate-on-scroll">
            <h2 class="text-2xl md:text-4xl font-bold text-white mb-4">
              지금 바로 상담 받아보세요
            </h2>
            <p class="text-blue-200 text-lg mb-8">
              전화, 카카오톡, 온라인 예약 모두 가능합니다
            </p>
            <div class="flex flex-wrap justify-center gap-4">
              <a href={CLINIC.phoneTel} class="btn-white px-8 py-3.5 text-base">
                <i class="fa-solid fa-phone"></i> 전화 상담
              </a>
              <a href={CLINIC.kakao} target="_blank" rel="noopener" class="inline-flex items-center gap-2 px-8 py-3.5 bg-yellow-400 text-gray-900 rounded-xl font-semibold hover:bg-yellow-300 transition-colors">
                <i class="fa-solid fa-comment"></i> 카카오톡 상담
              </a>
              <a href={CLINIC.naverBooking} target="_blank" rel="noopener" class="inline-flex items-center gap-2 px-8 py-3.5 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-colors">
                <i class="fa-solid fa-calendar-check"></i> 네이버 예약
              </a>
            </div>
            <p class="text-blue-200/60 text-sm mt-6">{CLINIC.phone} · {CLINIC.address}</p>
          </div>
        </div>
      </section>
    </>,
    {
      title: '서울365치과 | 인천 구월동 치과 - 서울대 5인 전문의, 365일 진료',
      description: '인천 구월동 서울365치과. 서울대 출신 5인 원장, 365일 진료, 자체 기공실 보유. 임플란트·교정·수면진료. 032-432-0365',
      canonical: 'https://seoul365dental.com',
    }
  )
})

// ============================================================
// TREATMENTS LIST
// ============================================================
app.get('/treatments', (c) => {
  return c.render(
    <section class="section-padding">
      <div class="max-w-7xl mx-auto px-4">
        <nav class="text-sm text-gray-400 mb-6">
          <a href="/" class="hover:text-primary">홈</a> <i class="fa-solid fa-chevron-right text-xs mx-1"></i> 전체 진료
        </nav>
        <h1 class="section-title mb-8">서울365치과 전체 진료 안내</h1>
        {treatmentCategories.map(cat => (
          <div class="mb-10">
            <h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <i class={`fa-solid ${cat.icon} text-primary`}></i> {cat.name}
            </h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {cat.treatments.map(t => (
                <a href={`/treatments/${t.slug}`} class="treatment-card group block">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-primary-light rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary transition-colors">
                      <i class={`fa-solid ${t.icon} text-primary text-sm group-hover:text-white`}></i>
                    </div>
                    <div>
                      <h3 class="font-bold text-gray-900 text-sm">{t.name}</h3>
                      <p class="text-xs text-gray-500">{t.shortDesc}</p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>,
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

  return c.render(
    <>
      {/* Hero */}
      <section class="hero-gradient">
        <div class="max-w-7xl mx-auto px-4 py-16 md:py-24">
          <nav class="text-sm text-blue-200/60 mb-6">
            <a href="/" class="hover:text-white">홈</a> <i class="fa-solid fa-chevron-right text-xs mx-1"></i>
            <a href="/treatments" class="hover:text-white">진료안내</a> <i class="fa-solid fa-chevron-right text-xs mx-1"></i>
            <span class="text-white">{t.name}</span>
          </nav>
          <h1 class="text-3xl md:text-5xl font-bold text-white leading-tight mb-4">{t.heroTitle}</h1>
          <p class="text-lg text-blue-200 max-w-2xl">{t.heroSub}</p>
          <div class="flex flex-wrap gap-3 mt-8">
            <a href="/reservation" class="btn-primary"><i class="fa-solid fa-calendar-check"></i> 상담 예약</a>
            <a href="/pricing" class="btn-white"><i class="fa-solid fa-won-sign"></i> 비용 안내</a>
          </div>
        </div>
      </section>

      {/* Concerns */}
      <section class="section-padding bg-slate-50">
        <div class="max-w-4xl mx-auto px-4">
          <h2 class="section-title text-center mb-8">{t.name}, 이런 고민 있으신가요?</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {t.concerns.map(concern => (
              <div class="bg-white rounded-xl p-5 border border-gray-100 flex items-start gap-3">
                <i class="fa-solid fa-circle-check text-primary mt-0.5"></i>
                <p class="text-gray-700 text-sm">{concern}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Types */}
      <section class="section-padding bg-white">
        <div class="max-w-7xl mx-auto px-4">
          <h2 class="section-title text-center mb-8">서울365치과 {t.name} 종류</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            {t.types.map(type => (
              <div class="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <h3 class="font-bold text-gray-900 mb-2">{type.name}</h3>
                <p class="text-sm text-gray-600 leading-relaxed">{type.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section class="section-padding bg-slate-50">
        <div class="max-w-7xl mx-auto px-4">
          <h2 class="section-title text-center mb-8">왜 서울365치과의 {t.name}인가요?</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {t.whyUs.map(w => (
              <div class="bg-white rounded-2xl p-6 border border-gray-100 card-hover">
                <div class="w-12 h-12 bg-primary-light rounded-xl flex items-center justify-center mb-3">
                  <i class={`fa-solid ${w.icon} text-primary text-xl`}></i>
                </div>
                <h3 class="font-bold text-gray-900 mb-1">{w.title}</h3>
                <p class="text-sm text-gray-500">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section class="section-padding bg-white">
        <div class="max-w-3xl mx-auto px-4">
          <h2 class="section-title text-center mb-8">{t.name} 치료 과정</h2>
          <div class="space-y-0">
            {t.process.map((step, i) => (
              <div class="process-line flex gap-4 pb-6">
                <div class="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm z-10">
                  {i + 1}
                </div>
                <div class="pt-1.5">
                  <h3 class="font-bold text-gray-900 text-sm">{step.step}</h3>
                  {step.desc && <p class="text-sm text-gray-500 mt-0.5">{step.desc}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Doctor */}
      {doc && (
        <section class="section-padding bg-slate-50">
          <div class="max-w-4xl mx-auto px-4">
            <h2 class="section-title text-center mb-8">담당 의료진 – {doc.name} {doc.titleShort}</h2>
            <div class="bg-white rounded-2xl p-6 border border-gray-100 md:flex gap-6 items-center">
              <div class="w-24 h-24 bg-primary-light rounded-full flex items-center justify-center flex-shrink-0 mx-auto md:mx-0 mb-4 md:mb-0">
                <i class="fa-solid fa-user-doctor text-3xl text-primary"></i>
              </div>
              <div>
                <h3 class="font-bold text-gray-900 text-lg text-center md:text-left">{doc.name} {doc.title}</h3>
                <p class="text-sm text-gray-500 mt-1 text-center md:text-left">{doc.specialties.join(' · ')}</p>
                <blockquote class="text-sm text-gray-600 italic mt-3 border-l-2 border-primary pl-3">"{doc.philosophy.split('.')[0]}."</blockquote>
                <a href={`/doctors/${doc.slug}`} class="inline-flex items-center gap-1 text-primary font-semibold text-sm mt-3 hover:underline">
                  프로필 보기 <i class="fa-solid fa-arrow-right text-xs"></i>
                </a>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section class="section-padding bg-white" itemscope itemtype="https://schema.org/FAQPage">
        <div class="max-w-3xl mx-auto px-4">
          <h2 class="section-title text-center mb-8">{t.name} 자주 묻는 질문</h2>
          <div class="space-y-3">
            {t.faq.map(faq => (
              <div class="bg-gray-50 rounded-xl border border-gray-100 overflow-hidden" itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
                <button class="faq-toggle w-full text-left px-5 py-4 flex items-center justify-between hover:bg-gray-100 transition-colors">
                  <h3 class="font-semibold text-gray-800 text-sm pr-4" itemprop="name">{faq.q}</h3>
                  <i class="fa-solid fa-chevron-down text-gray-400 text-sm faq-icon flex-shrink-0"></i>
                </button>
                <div class="hidden px-5 pb-4" itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
                  <p class="text-gray-600 text-sm leading-relaxed" itemprop="text">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section class="hero-gradient section-padding">
        <div class="max-w-4xl mx-auto px-4 text-center">
          <h2 class="text-2xl md:text-3xl font-bold text-white mb-4">지금 바로 상담 예약하세요</h2>
          <p class="text-blue-200 mb-8">{t.name}에 대해 자세히 상담받아 보세요</p>
          <div class="flex flex-wrap justify-center gap-4">
            <a href={CLINIC.phoneTel} class="btn-white"><i class="fa-solid fa-phone"></i> 전화 상담</a>
            <a href={CLINIC.kakao} target="_blank" rel="noopener" class="inline-flex items-center gap-2 px-6 py-3 bg-yellow-400 text-gray-900 rounded-xl font-semibold hover:bg-yellow-300 transition-colors"><i class="fa-solid fa-comment"></i> 카카오톡</a>
            <a href={CLINIC.naverBooking} target="_blank" rel="noopener" class="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-colors"><i class="fa-solid fa-calendar-check"></i> 네이버 예약</a>
          </div>
        </div>
      </section>
    </>,
    {
      title: t.metaTitle,
      description: t.metaDesc,
      canonical: `https://seoul365dental.com/treatments/${t.slug}`,
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "MedicalProcedure",
        "name": t.name,
        "procedureType": "http://schema.org/SurgicalProcedure",
        "bodyLocation": "Jaw",
        "description": t.metaDesc,
      }
    }
  )
})

// ============================================================
// DOCTORS LIST
// ============================================================
app.get('/doctors', (c) => {
  return c.render(
    <section class="section-padding">
      <div class="max-w-7xl mx-auto px-4">
        <nav class="text-sm text-gray-400 mb-6">
          <a href="/" class="hover:text-primary">홈</a> <i class="fa-solid fa-chevron-right text-xs mx-1"></i> 의료진
        </nav>
        <h1 class="section-title mb-4">서울365치과 의료진 소개 – 서울대 출신 5인 전문의</h1>
        <p class="text-gray-500 text-lg mb-10">각 분야 전문의가 협력하여 최적의 치료를 제공합니다</p>
        
        {/* 대표원장 */}
        <div class="bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-sm mb-8">
          <div class="md:flex">
            <div class="md:w-2/5 bg-gradient-to-br from-primary to-primary-dark p-10 flex items-center justify-center min-h-[320px]">
              <div class="text-center text-white">
                <div class="w-40 h-40 bg-white/20 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <i class="fa-solid fa-user-doctor text-6xl text-white/80"></i>
                </div>
                <h2 class="text-2xl font-bold">박준규 대표원장</h2>
                <p class="text-blue-200 mt-1">통합치의학과 전문의</p>
                <div class="flex flex-wrap justify-center gap-2 mt-4">
                  {doctors[0].specialties.map(s => <span class="text-xs bg-white/20 px-3 py-1 rounded-full">{s}</span>)}
                </div>
              </div>
            </div>
            <div class="md:w-3/5 p-8">
              <blockquote class="text-lg text-gray-700 italic border-l-4 border-primary pl-4 mb-6">{doctors[0].philosophy}</blockquote>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <h3 class="font-bold text-gray-800 mb-2">학력</h3>
                  <ul class="space-y-1">{doctors[0].education.map(e => <li class="flex items-start gap-1.5"><i class="fa-solid fa-graduation-cap text-primary text-xs mt-1"></i>{e}</li>)}</ul>
                </div>
                <div>
                  <h3 class="font-bold text-gray-800 mb-2">자격</h3>
                  <ul class="space-y-1">{doctors[0].credentials.map(e => <li class="flex items-start gap-1.5"><i class="fa-solid fa-certificate text-primary text-xs mt-1"></i>{e}</li>)}</ul>
                </div>
              </div>
              <a href="/doctors/park-junkyu" class="btn-primary mt-6 text-sm">프로필 상세 보기</a>
            </div>
          </div>
        </div>

        {/* 다른 원장들 */}
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          {doctors.slice(1).map(doc => (
            <a href={`/doctors/${doc.slug}`} class="bg-white rounded-2xl p-6 border border-gray-100 card-hover block md:flex gap-5 items-start">
              <div class="w-20 h-20 bg-primary-light rounded-full flex items-center justify-center flex-shrink-0 mx-auto md:mx-0 mb-4 md:mb-0">
                <i class="fa-solid fa-user-doctor text-2xl text-primary"></i>
              </div>
              <div>
                <h2 class="font-bold text-gray-900 text-lg text-center md:text-left">{doc.name} {doc.title}</h2>
                <p class="text-sm text-gray-500 mt-1 text-center md:text-left">{doc.specialties.join(' · ')}</p>
                <p class="text-sm text-gray-600 mt-2 italic">"{doc.philosophy.split('.')[0]}."</p>
                <span class="text-primary font-semibold text-sm mt-2 inline-flex items-center gap-1 hover:underline">프로필 보기 <i class="fa-solid fa-arrow-right text-xs"></i></span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>,
    {
      title: '의료진 소개 | 서울365치과 - 서울대 출신 5인 전문의',
      description: '서울365치과 의료진. 서울대 출신 5인 원장 협력 진료. 각 분야별 전문의.',
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

  return c.render(
    <>
      <section class="hero-gradient">
        <div class="max-w-7xl mx-auto px-4 py-16 md:py-24">
          <nav class="text-sm text-blue-200/60 mb-6">
            <a href="/" class="hover:text-white">홈</a> <i class="fa-solid fa-chevron-right text-xs mx-1"></i>
            <a href="/doctors" class="hover:text-white">의료진</a> <i class="fa-solid fa-chevron-right text-xs mx-1"></i>
            <span class="text-white">{doc.name} {doc.titleShort}</span>
          </nav>
          <div class="md:flex items-center gap-8">
            <div class="w-36 h-36 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mx-auto md:mx-0 mb-6 md:mb-0">
              <i class="fa-solid fa-user-doctor text-5xl text-white/80"></i>
            </div>
            <div>
              <h1 class="text-3xl md:text-4xl font-bold text-white text-center md:text-left">{doc.h1}</h1>
              <div class="flex flex-wrap justify-center md:justify-start gap-2 mt-3">
                {doc.specialties.map(s => <span class="text-sm bg-white/20 text-white px-3 py-1 rounded-full">{s}</span>)}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="section-padding">
        <div class="max-w-4xl mx-auto px-4">
          {/* Philosophy */}
          <blockquote class="text-xl text-gray-700 italic border-l-4 border-primary pl-6 mb-10 leading-relaxed">
            "{doc.philosophy}"
          </blockquote>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Education */}
            <div>
              <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <i class="fa-solid fa-graduation-cap text-primary"></i> 학력
              </h2>
              <ul class="space-y-2">{doc.education.map(e => <li class="text-gray-600 flex items-start gap-2"><i class="fa-solid fa-check text-primary text-xs mt-1.5"></i>{e}</li>)}</ul>
            </div>

            {/* Credentials */}
            {doc.credentials.length > 0 && (
              <div>
                <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <i class="fa-solid fa-certificate text-primary"></i> 자격/전문의
                </h2>
                <ul class="space-y-2">{doc.credentials.map(e => <li class="text-gray-600 flex items-start gap-2"><i class="fa-solid fa-check text-primary text-xs mt-1.5"></i>{e}</li>)}</ul>
              </div>
            )}

            {/* Career */}
            <div>
              <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <i class="fa-solid fa-briefcase text-primary"></i> 경력
              </h2>
              <ul class="space-y-2">{doc.career.map(e => <li class="text-gray-600 flex items-start gap-2"><i class="fa-solid fa-check text-primary text-xs mt-1.5"></i>{e}</li>)}</ul>
            </div>

            {/* Societies */}
            {doc.societies.length > 0 && (
              <div>
                <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <i class="fa-solid fa-users text-primary"></i> 학회
                </h2>
                <ul class="space-y-2">{doc.societies.map(e => <li class="text-gray-600 flex items-start gap-2"><i class="fa-solid fa-check text-primary text-xs mt-1.5"></i>{e}</li>)}</ul>
              </div>
            )}
          </div>

          {/* Treatment Links */}
          <div class="mt-10">
            <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <i class="fa-solid fa-stethoscope text-primary"></i> 담당 치료
            </h2>
            <div class="flex flex-wrap gap-3">
              {doc.treatmentLinks.map(link => {
                const treat = getTreatmentBySlug(link.split('/').pop()!);
                return treat ? (
                  <a href={link} class="inline-flex items-center gap-2 px-4 py-2 bg-primary-light text-primary rounded-xl font-medium text-sm hover:bg-primary hover:text-white transition-colors">
                    <i class={`fa-solid ${treat.icon}`}></i> {treat.name}
                  </a>
                ) : null;
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section class="hero-gradient section-padding">
        <div class="max-w-4xl mx-auto px-4 text-center">
          <h2 class="text-2xl md:text-3xl font-bold text-white mb-4">{doc.name} {doc.titleShort}에게 상담받기</h2>
          <div class="flex flex-wrap justify-center gap-4 mt-6">
            <a href={CLINIC.phoneTel} class="btn-white"><i class="fa-solid fa-phone"></i> 전화 상담</a>
            <a href="/reservation" class="btn-primary"><i class="fa-solid fa-calendar-check"></i> 예약하기</a>
          </div>
        </div>
      </section>
    </>,
    {
      title: doc.metaTitle,
      description: doc.metaDesc,
      canonical: `https://seoul365dental.com/doctors/${doc.slug}`,
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "Physician",
        "name": doc.name,
        "jobTitle": doc.title,
        "alumniOf": { "@type": "CollegeOrUniversity", "name": "서울대학교 치과대학" },
        "worksFor": { "@type": "Dentist", "name": "서울365치과의원" },
      }
    }
  )
})

// ============================================================
// RESERVATION PAGE
// ============================================================
app.get('/reservation', (c) => {
  return c.render(
    <>
      <section class="hero-gradient">
        <div class="max-w-7xl mx-auto px-4 py-16 md:py-20">
          <h1 class="text-3xl md:text-4xl font-bold text-white mb-3">서울365치과 상담 예약하기</h1>
          <p class="text-blue-200 text-lg">편하신 방법으로 상담 예약해 주세요</p>
        </div>
      </section>

      <section class="section-padding">
        <div class="max-w-4xl mx-auto px-4">
          {/* Quick CTAs */}
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <a href={CLINIC.phoneTel} class="bg-white rounded-2xl p-8 border border-gray-100 text-center card-hover block">
              <div class="w-16 h-16 bg-primary-light rounded-2xl flex items-center justify-center mx-auto mb-4">
                <i class="fa-solid fa-phone text-primary text-2xl"></i>
              </div>
              <h2 class="font-bold text-gray-900 text-lg mb-1">전화 상담</h2>
              <p class="text-primary font-bold text-xl">{CLINIC.phone}</p>
              <p class="text-sm text-gray-500 mt-2">가장 빠른 상담 방법</p>
            </a>
            <a href={CLINIC.kakao} target="_blank" rel="noopener" class="bg-white rounded-2xl p-8 border border-gray-100 text-center card-hover block">
              <div class="w-16 h-16 bg-yellow-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <i class="fa-solid fa-comment text-yellow-500 text-2xl"></i>
              </div>
              <h2 class="font-bold text-gray-900 text-lg mb-1">카카오톡 상담</h2>
              <p class="text-yellow-600 font-bold">채팅으로 편하게</p>
              <p class="text-sm text-gray-500 mt-2">사진/영상 전송 가능</p>
            </a>
            <a href={CLINIC.naverBooking} target="_blank" rel="noopener" class="bg-white rounded-2xl p-8 border border-gray-100 text-center card-hover block">
              <div class="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <i class="fa-solid fa-calendar-check text-green-500 text-2xl"></i>
              </div>
              <h2 class="font-bold text-gray-900 text-lg mb-1">네이버 예약</h2>
              <p class="text-green-600 font-bold">온라인 간편 예약</p>
              <p class="text-sm text-gray-500 mt-2">원하는 시간 선택</p>
            </a>
          </div>

          {/* Online Form */}
          <div class="bg-white rounded-2xl border border-gray-200 p-6 md:p-8">
            <h2 class="text-xl font-bold text-gray-900 mb-6">온라인 상담 신청</h2>
            <form class="space-y-4" onsubmit="event.preventDefault(); alert('상담 신청이 완료되었습니다. 빠른 시간 내에 연락드리겠습니다.');">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">이름 *</label>
                  <input type="text" required class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" placeholder="이름을 입력해주세요" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">연락처 *</label>
                  <input type="tel" required class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" placeholder="010-0000-0000" />
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">관심 치료</label>
                <select class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-gray-600">
                  <option value="">선택해주세요</option>
                  <option>전체임플란트</option>
                  <option>올온X 임플란트</option>
                  <option>일반 임플란트</option>
                  <option>치아교정</option>
                  <option>인비절라인</option>
                  <option>수면진료</option>
                  <option>심미치료</option>
                  <option>충치/신경치료</option>
                  <option>기타</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">상담 내용</label>
                <textarea rows={4} class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none" placeholder="궁금하신 내용을 자유롭게 적어주세요"></textarea>
              </div>
              <div class="flex items-start gap-2">
                <input type="checkbox" required class="mt-1" id="privacy-agree" />
                <label for="privacy-agree" class="text-sm text-gray-600">
                  <a href="/privacy" class="text-primary underline">개인정보처리방침</a>에 동의합니다 *
                </label>
              </div>
              <button type="submit" class="btn-primary w-full py-3.5 text-base">상담 신청하기</button>
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
// PRICING PAGE
// ============================================================
app.get('/pricing', (c) => {
  return c.render(
    <>
      <section class="hero-gradient">
        <div class="max-w-7xl mx-auto px-4 py-16 md:py-20">
          <h1 class="text-3xl md:text-4xl font-bold text-white mb-3">서울365치과 진료비용 안내</h1>
          <p class="text-blue-200 text-lg">투명하게 안내드립니다</p>
        </div>
      </section>
      <section class="section-padding">
        <div class="max-w-4xl mx-auto px-4">
          <nav class="text-sm text-gray-400 mb-6">
            <a href="/" class="hover:text-primary">홈</a> <i class="fa-solid fa-chevron-right text-xs mx-1"></i> 비용안내
          </nav>
          <div class="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
            <table class="w-full text-sm">
              <thead>
                <tr class="bg-primary text-white">
                  <th class="text-left px-5 py-3 font-semibold">치료 항목</th>
                  <th class="text-right px-5 py-3 font-semibold">가격대</th>
                  <th class="text-right px-5 py-3 font-semibold hidden sm:table-cell">보험 적용</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                {pricingData.map(p => (
                  <tr class="hover:bg-gray-50 transition-colors">
                    <td class="px-5 py-3.5 text-gray-800 font-medium">{p.treatment}</td>
                    <td class="px-5 py-3.5 text-right text-primary font-semibold">{p.price}</td>
                    <td class="px-5 py-3.5 text-right text-gray-500 hidden sm:table-cell">{p.insurance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div class="mt-6 bg-yellow-50 rounded-xl p-4 border border-yellow-100">
            <p class="text-sm text-yellow-800"><i class="fa-solid fa-triangle-exclamation mr-1"></i> <strong>안내:</strong> 위 가격은 참고용이며, 정확한 비용은 정밀 진단 후 안내드립니다. 카드 결제 및 분할 결제가 가능합니다.</p>
          </div>
          <div class="text-center mt-8">
            <a href="/reservation" class="btn-primary">비용 상담 예약하기 <i class="fa-solid fa-arrow-right ml-1"></i></a>
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
// DIRECTIONS PAGE
// ============================================================
app.get('/directions', (c) => {
  return c.render(
    <>
      <section class="hero-gradient">
        <div class="max-w-7xl mx-auto px-4 py-16 md:py-20">
          <h1 class="text-3xl md:text-4xl font-bold text-white mb-3">서울365치과 오시는 길 – 예술회관역 5번 출구</h1>
          <p class="text-blue-200 text-lg">예술회관역 5번 출구에서 250m, 이토타워 2층</p>
        </div>
      </section>
      <section class="section-padding">
        <div class="max-w-4xl mx-auto px-4">
          <nav class="text-sm text-gray-400 mb-6">
            <a href="/" class="hover:text-primary">홈</a> <i class="fa-solid fa-chevron-right text-xs mx-1"></i> 오시는길
          </nav>

          {/* Map Placeholder */}
          <div class="bg-gray-100 rounded-2xl overflow-hidden aspect-video flex items-center justify-center border border-gray-200 mb-8">
            <div class="text-center text-gray-400">
              <i class="fa-solid fa-map-location-dot text-5xl mb-3"></i>
              <p class="font-semibold">지도 영역</p>
              <p class="text-sm">Naver/Kakao Map API 연동 예정</p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-white rounded-2xl p-6 border border-gray-100">
              <h2 class="font-bold text-gray-900 text-lg mb-4"><i class="fa-solid fa-location-dot text-primary mr-2"></i>주소</h2>
              <p class="text-gray-700">{CLINIC.address}</p>
              <p class="text-sm text-gray-500 mt-1">(우) 21556</p>
            </div>
            <div class="bg-white rounded-2xl p-6 border border-gray-100">
              <h2 class="font-bold text-gray-900 text-lg mb-4"><i class="fa-solid fa-train-subway text-primary mr-2"></i>지하철</h2>
              <p class="text-gray-700">인천 2호선 예술회관역 5번 출구</p>
              <p class="text-sm text-gray-500 mt-1">도보 약 3분 (250m)</p>
            </div>
            <div class="bg-white rounded-2xl p-6 border border-gray-100">
              <h2 class="font-bold text-gray-900 text-lg mb-4"><i class="fa-solid fa-car text-primary mr-2"></i>주차</h2>
              <p class="text-gray-700">이토타워 건물 내 주차장 이용</p>
              <p class="text-sm text-gray-500 mt-1">진료 시 주차 지원 가능</p>
            </div>
            <div class="bg-white rounded-2xl p-6 border border-gray-100">
              <h2 class="font-bold text-gray-900 text-lg mb-4"><i class="fa-solid fa-bus text-primary mr-2"></i>버스</h2>
              <p class="text-gray-700">예술회관역 정류장 하차</p>
              <p class="text-sm text-gray-500 mt-1">다수 시내버스 이용 가능</p>
            </div>
          </div>

          <div class="text-center mt-8">
            <a href={CLINIC.phoneTel} class="btn-primary"><i class="fa-solid fa-phone"></i> 전화 문의 {CLINIC.phone}</a>
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
// FAQ PAGE
// ============================================================
app.get('/faq', (c) => {
  const allFaq = [
    ...mainFaq,
    { q: '예약은 어떻게 하나요?', a: '전화(032-432-0365), 카카오톡, 네이버 예약 모두 가능합니다. 온라인 예약 시 원하시는 시간을 선택하실 수 있습니다.' },
    { q: '응급 상황에 방문해도 되나요?', a: '네, 365일 진료하므로 갑작스러운 치통이나 외상 시 바로 내원하세요. 내원 전 전화 한 통 주시면 더 빠르게 안내드리겠습니다.' },
    { q: '분할 결제가 가능한가요?', a: '네, 카드 분할 결제가 가능합니다. 상담 시 다양한 결제 옵션을 안내드립니다.' },
    { q: '첫 방문 시 무엇을 준비해야 하나요?', a: '신분증과 건강보험증을 지참해 주세요. 다른 병원의 치료 기록이나 X-ray가 있으시면 함께 가져오시면 도움이 됩니다.' },
  ];

  return c.render(
    <>
      <section class="hero-gradient">
        <div class="max-w-7xl mx-auto px-4 py-16 md:py-20">
          <h1 class="text-3xl md:text-4xl font-bold text-white mb-3">자주 묻는 질문 – 서울365치과</h1>
          <p class="text-blue-200 text-lg">궁금하신 점을 먼저 확인해 보세요</p>
        </div>
      </section>
      <section class="section-padding" itemscope itemtype="https://schema.org/FAQPage">
        <div class="max-w-3xl mx-auto px-4">
          <div class="space-y-3">
            {allFaq.map(faq => (
              <div class="bg-white rounded-xl border border-gray-100 overflow-hidden" itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
                <button class="faq-toggle w-full text-left px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <h3 class="font-semibold text-gray-800 pr-4" itemprop="name">{faq.q}</h3>
                  <i class="fa-solid fa-chevron-down text-gray-400 text-sm faq-icon flex-shrink-0"></i>
                </button>
                <div class="hidden px-5 pb-4" itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
                  <p class="text-gray-600 text-sm leading-relaxed" itemprop="text">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
          <div class="text-center mt-8">
            <p class="text-gray-500 mb-4">더 궁금하신 점이 있으신가요?</p>
            <a href="/reservation" class="btn-primary">상담 예약하기</a>
          </div>
        </div>
      </section>
    </>,
    {
      title: '자주 묻는 질문 | 서울365치과',
      description: '서울365치과 자주 묻는 질문. 임플란트 비용, 치료 기간, 수면진료 안전성 등.',
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
      <section class="hero-gradient">
        <div class="max-w-7xl mx-auto px-4 py-16 md:py-20">
          <h1 class="text-3xl md:text-4xl font-bold text-white mb-3">서울365치과 치료 사례 – Before &amp; After</h1>
          <p class="text-blue-200 text-lg">실제 치료 사례로 결과를 확인하세요</p>
        </div>
      </section>
      <section class="section-padding">
        <div class="max-w-7xl mx-auto px-4">
          <p class="text-center text-gray-500 mb-8">치료 사례 사진은 추후 업데이트됩니다.</p>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              '전체임플란트 – 상악 전체 수복',
              '올온X – 하악 즉시로딩',
              '인비절라인 – 성인 투명교정',
              '크라운 – 올세라믹 수복',
              '심미보철 – 라미네이트',
              '임플란트 – 단일 식립',
            ].map(title => (
              <div class="bg-gray-50 rounded-2xl overflow-hidden border border-gray-100">
                <div class="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <div class="text-center text-gray-400">
                    <i class="fa-solid fa-image text-3xl mb-2"></i>
                    <p class="text-sm">사진 준비 중</p>
                  </div>
                </div>
                <div class="p-4">
                  <h3 class="font-semibold text-gray-900 text-sm">{title}</h3>
                </div>
              </div>
            ))}
          </div>
          <p class="text-xs text-gray-400 text-center mt-6">※ 개인에 따라 치료 결과가 다를 수 있습니다. 모든 사례는 환자 동의 하에 게시되었습니다.</p>
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
    <section class="section-padding">
      <div class="max-w-3xl mx-auto px-4">
        <h1 class="section-title mb-6">개인정보처리방침</h1>
        <div class="prose prose-sm text-gray-600 leading-relaxed space-y-4">
          <p>서울365치과의원(이하 "병원")은 개인정보보호법에 따라 이용자의 개인정보를 보호하고 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 다음과 같이 개인정보 처리방침을 수립·공개합니다.</p>
          <h2 class="text-lg font-bold text-gray-900 mt-6">1. 수집하는 개인정보 항목</h2>
          <p>병원은 상담 예약을 위해 다음의 개인정보를 수집합니다: 이름, 연락처, 상담 내용.</p>
          <h2 class="text-lg font-bold text-gray-900 mt-6">2. 개인정보의 이용 목적</h2>
          <p>수집한 개인정보는 상담 예약 확인 및 진료 안내 목적으로만 사용됩니다.</p>
          <h2 class="text-lg font-bold text-gray-900 mt-6">3. 개인정보의 보유 및 이용 기간</h2>
          <p>개인정보는 수집 목적 달성 후 즉시 파기합니다. 단, 의료법에 따른 진료기록은 법정 보관 기간 동안 보관합니다.</p>
          <h2 class="text-lg font-bold text-gray-900 mt-6">4. 문의처</h2>
          <p>개인정보 관련 문의: {CLINIC.phone}</p>
        </div>
      </div>
    </section>,
    { title: '개인정보처리방침 | 서울365치과', canonical: 'https://seoul365dental.com/privacy' }
  )
})

app.get('/terms', (c) => {
  return c.render(
    <section class="section-padding">
      <div class="max-w-3xl mx-auto px-4">
        <h1 class="section-title mb-6">이용약관</h1>
        <div class="prose prose-sm text-gray-600 leading-relaxed space-y-4">
          <p>본 웹사이트는 서울365치과의원(이하 "병원")이 운영합니다.</p>
          <h2 class="text-lg font-bold text-gray-900 mt-6">1. 서비스 이용</h2>
          <p>본 웹사이트는 병원 정보 제공 및 상담 예약을 위한 목적으로 운영됩니다.</p>
          <h2 class="text-lg font-bold text-gray-900 mt-6">2. 면책사항</h2>
          <p>본 웹사이트의 정보는 참고용이며, 정확한 진단과 치료는 내원 상담을 통해 진행됩니다.</p>
          <h2 class="text-lg font-bold text-gray-900 mt-6">3. 저작권</h2>
          <p>본 웹사이트의 콘텐츠에 대한 저작권은 서울365치과의원에 있습니다.</p>
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
    <section class="section-padding text-center">
      <div class="max-w-lg mx-auto px-4">
        <div class="text-8xl font-bold text-primary/20 mb-4">404</div>
        <h1 class="text-2xl font-bold text-gray-900 mb-3">페이지를 찾을 수 없습니다</h1>
        <p class="text-gray-500 mb-6">요청하신 페이지가 존재하지 않거나 이동되었습니다.</p>
        <div class="flex flex-wrap justify-center gap-3">
          <a href="/" class="btn-primary">홈으로 가기</a>
          <a href="/treatments" class="btn-secondary">진료 안내</a>
          <a href="/reservation" class="btn-secondary">예약하기</a>
        </div>
      </div>
    </section>,
    { title: '404 - 페이지를 찾을 수 없습니다 | 서울365치과' }
  )
})

export default app
