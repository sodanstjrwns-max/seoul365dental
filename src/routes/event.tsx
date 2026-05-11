import { Hono } from 'hono'
import type { Bindings } from '../lib/types'
import { CLINIC } from '../data/clinic'
import { getSetting, initSettingsTable } from '../lib/db'

const eventRoutes = new Hono<{ Bindings: Bindings }>()

// ══════════════════════════════════════════════════════════
// 임플란트 이벤트 랜딩페이지 — DB에서 수가/브랜드 동적 로딩
// ══════════════════════════════════════════════════════════
eventRoutes.get('/event/implant', async (c) => {
  await initSettingsTable(c.env.DB)

  // DB에서 이벤트 수가 설정 로딩 (관리자 페이지에서 변경 가능)
  const brand = await getSetting(c.env.DB, 'EVENT_IMPLANT_BRAND', '오스템')
  const brandEn = await getSetting(c.env.DB, 'EVENT_IMPLANT_BRAND_EN', 'Osstem')
  const model = await getSetting(c.env.DB, 'EVENT_IMPLANT_MODEL', 'TS III SA')
  const price = await getSetting(c.env.DB, 'EVENT_IMPLANT_PRICE', '64')
  const originalPrice = await getSetting(c.env.DB, 'EVENT_IMPLANT_ORIGINAL_PRICE', '89')
  const origin = await getSetting(c.env.DB, 'EVENT_IMPLANT_ORIGIN', '한국')
  const subtitle = await getSetting(c.env.DB, 'EVENT_IMPLANT_SUBTITLE', 'SA 표면처리 · 국내 1위 · 40년 검증')
  const periodText = await getSetting(c.env.DB, 'EVENT_IMPLANT_PERIOD', '2026.05.01 ~ 소진 시 종료 · 월 한정 수량')
  const eventStart = await getSetting(c.env.DB, 'EVENT_IMPLANT_START_DATE', '2026-05-01')
  const eventEnd = await getSetting(c.env.DB, 'EVENT_IMPLANT_END_DATE', '2026-06-30')
  const isActive = await getSetting(c.env.DB, 'EVENT_IMPLANT_ACTIVE', '1')

  if (isActive !== '1') {
    return c.redirect('/')
  }

  const priceNum = parseInt(price) * 10000
  const pageTitle = `${brand} 임플란트 ${price}만원 이벤트 | 서울365치과 인천 구월동`
  const pageDesc = `국내 1위 ${brand} ${model} 임플란트 ${price}만원 특별 이벤트. ${subtitle}. 서울대 전문의 네비게이션 가이드 수술. 자체기공실. 수면진료 가능. 인천 남동구 구월동 032-432-0365`

  return c.render(
    <>
      {/* ===== HERO — 긴급성 + 핵심 오퍼 ===== */}
      <section class="hero-premium relative overflow-hidden" style="min-height:85vh">
        <div class="hero-grid"></div>
        <div class="orb orb-1"></div>
        <div class="orb orb-2"></div>
        
        {/* 이벤트 뱃지 */}
        <div class="relative z-10 max-w-[1100px] mx-auto px-5 md:px-8 pt-32 md:pt-40 pb-20 text-center">
          <div class="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500/20 to-emerald-400/10 border border-emerald-400/30 rounded-full px-5 py-2 mb-8 reveal" style="transition-delay:0.2s">
            <span class="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
            <span class="text-emerald-300 text-sm font-bold tracking-wide">SPECIAL EVENT</span>
          </div>

          <h1 class="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-[1.1] mb-6 reveal" style="transition-delay:0.4s">
            국내 1위 {brand}<br/>
            <span class="gradient-text-white">임플란트 {price}만원</span>
          </h1>

          <p class="text-lg md:text-xl text-white/40 max-w-2xl mx-auto mb-4 reveal" style="transition-delay:0.6s">
            {brandEn} {model} · {subtitle}<br class="hidden md:block"/>
            서울대 전문의 직접 시술 · 네비게이션 가이드 수술
          </p>

          {/* 가격 강조 */}
          <div class="flex items-center justify-center gap-4 mb-10 reveal" style="transition-delay:0.8s">
            <div class="text-center">
              <span class="text-white/25 text-sm">정가</span>
              <p class="text-white/30 text-2xl font-bold line-through">{originalPrice}만원</p>
            </div>
            <div class="text-4xl text-white/15">→</div>
            <div class="text-center">
              <span class="text-emerald-400 text-sm font-bold">이벤트가</span>
              <p class="text-5xl md:text-6xl font-black bg-gradient-to-r from-emerald-300 via-emerald-400 to-teal-400 bg-clip-text" style="color:transparent;-webkit-background-clip:text">{price}<span class="text-3xl">만원</span></p>
            </div>
          </div>

          {/* CTA 버튼 */}
          <div class="flex flex-col sm:flex-row items-center justify-center gap-4 reveal" style="transition-delay:1s">
            <a href={CLINIC.phoneTel} class="btn-premium btn-premium-fill text-lg px-10 py-4 group" data-cursor-hover>
              <i class="fa-solid fa-phone mr-2 group-hover:animate-shake"></i>
              지금 전화상담
              <span class="block text-xs text-white/60 font-normal mt-0.5">{CLINIC.phone}</span>
            </a>
            <a href="/reservation" class="btn-premium btn-premium-white text-lg px-10 py-4" data-cursor-hover>
              <i class="fa-solid fa-calendar-check mr-2"></i>
              온라인 예약
            </a>
          </div>

          {/* 이벤트 기간 */}
          <p class="text-white/20 text-sm mt-8 reveal" style="transition-delay:1.2s">
            <i class="fa-regular fa-clock mr-1"></i>
            이벤트 기간: {periodText}
          </p>
        </div>
      </section>

      {/* ===== 왜 오스템인가 — 브랜드 신뢰 ===== */}
      <section class="section-lg bg-mesh">
        <div class="max-w-[1100px] mx-auto px-5 md:px-8">
          <div class="text-center mb-14">
            <span class="badge-label reveal">WHY OSSTEM</span>
            <h2 class="section-headline reveal" style="transition-delay:0.2s">
              국내 치과의사가<br/>가장 많이 선택한 임플란트
            </h2>
            <p class="text-gray-400 mt-3 reveal" style="transition-delay:0.3s">40년 역사 · 70개국 수출 · 국내 점유율 1위 · 글로벌 Top 5</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 stagger-children">
            {/* 카드 1 */}
            <div class="glass-card p-8 text-center group">
              <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-emerald-400/5 flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform">
                <i class="fa-solid fa-flask text-emerald-400 text-2xl"></i>
              </div>
              <h3 class="font-bold text-gray-900 text-lg mb-3">SA 표면처리</h3>
              <p class="text-gray-500 text-sm leading-relaxed">
                모래 분사 + 산 에칭으로<br/>
                <strong class="text-gray-700">골유착 속도 40% 향상</strong><br/>
                초기 안정성이 뛰어남
              </p>
            </div>

            {/* 카드 2 */}
            <div class="glass-card p-8 text-center group">
              <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/10 to-blue-400/5 flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform">
                <i class="fa-solid fa-bolt text-blue-400 text-2xl"></i>
              </div>
              <h3 class="font-bold text-gray-900 text-lg mb-3">CAS Kit 시스템</h3>
              <p class="text-gray-500 text-sm leading-relaxed">
                자가 뼈 채취 + 동시 식립<br/>
                <strong class="text-gray-700">뼈이식 필요성 감소</strong><br/>
                수술 시간 단축
              </p>
            </div>

            {/* 카드 3 */}
            <div class="glass-card p-8 text-center group">
              <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/10 to-amber-400/5 flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform">
                <i class="fa-solid fa-shield-halved text-amber-400 text-2xl"></i>
              </div>
              <h3 class="font-bold text-gray-900 text-lg mb-3">국내 최다 임상</h3>
              <p class="text-gray-500 text-sm leading-relaxed">
                40년 국내 임상 데이터<br/>
                <strong class="text-gray-700">국내 치과의사 신뢰도 1위</strong><br/>
                A/S 및 부품 수급 최상
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 가격 비교표 — 투명한 비용 ===== */}
      <section class="section-lg bg-white">
        <div class="max-w-[1000px] mx-auto px-5 md:px-8">
          <div class="text-center mb-14">
            <span class="badge-label reveal">TRANSPARENT PRICING</span>
            <h2 class="section-headline reveal" style="transition-delay:0.2s">투명한 임플란트 가격</h2>
            <p class="text-gray-400 mt-3 reveal" style="transition-delay:0.3s">추가 비용 걱정 없이, 모든 비용을 사전에 안내드립니다</p>
          </div>

          <div class="glass-card overflow-hidden reveal">
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead>
                  <tr class="border-b border-gray-100">
                    <th class="text-left px-6 py-4 font-bold text-gray-700">브랜드</th>
                    <th class="text-center px-4 py-4 font-bold text-gray-700">원산지</th>
                    <th class="text-center px-4 py-4 font-bold text-gray-700">가격</th>
                    <th class="text-center px-4 py-4 font-bold text-gray-700">특징</th>
                  </tr>
                </thead>
                <tbody>
                  {/* 이벤트 브랜드 — 동적 */}
                  <tr class="bg-gradient-to-r from-emerald-50/80 to-teal-50/50 border-b border-emerald-100">
                    <td class="px-6 py-5">
                      <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                          <i class="fa-solid fa-crown text-white text-sm"></i>
                        </div>
                        <div>
                          <span class="font-bold text-gray-900">{brand} {model}</span>
                          <span class="block text-xs text-emerald-600 font-bold">EVENT</span>
                        </div>
                      </div>
                    </td>
                    <td class="text-center px-4 py-5">
                      <span class="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">🇰🇷 {origin}</span>
                    </td>
                    <td class="text-center px-4 py-5">
                      <span class="text-2xl font-black text-emerald-600">{price}만원</span>
                    </td>
                    <td class="text-center px-4 py-5 text-gray-600 text-xs leading-relaxed">
                      SA 표면 · 국내 1위<br/>40년 검증 · 빠른 골유착
                    </td>
                  </tr>
                  <tr class="border-b border-gray-50">
                    <td class="px-6 py-4">
                      <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                          <i class="fa-solid fa-star text-blue-400 text-sm"></i>
                        </div>
                        <span class="font-bold text-gray-800">오스템 SOI</span>
                      </div>
                    </td>
                    <td class="text-center px-4 py-4"><span class="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">🇰🇷 한국</span></td>
                    <td class="text-center px-4 py-4 font-bold text-gray-700">104만원</td>
                    <td class="text-center px-4 py-4 text-gray-500 text-xs">나노 칼슘이온 · 골유착 가속</td>
                  </tr>
                  <tr class="border-b border-gray-50">
                    <td class="px-6 py-4">
                      <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                          <i class="fa-solid fa-star text-amber-400 text-sm"></i>
                        </div>
                        <span class="font-bold text-gray-800">스트라우만 BLX</span>
                      </div>
                    </td>
                    <td class="text-center px-4 py-4"><span class="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">🇨🇭 스위스</span></td>
                    <td class="text-center px-4 py-4 font-bold text-gray-700">129만원</td>
                    <td class="text-center px-4 py-4 text-gray-500 text-xs">Roxolid® · SLActive® · 세계 1위</td>
                  </tr>
                  <tr>
                    <td class="px-6 py-4">
                      <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center">
                          <i class="fa-solid fa-tooth text-gray-400 text-sm"></i>
                        </div>
                        <span class="font-bold text-gray-800">메가젠 AnyRidge</span>
                      </div>
                    </td>
                    <td class="text-center px-4 py-4"><span class="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">🇰🇷 한국</span></td>
                    <td class="text-center px-4 py-4 font-bold text-gray-700">79만원</td>
                    <td class="text-center px-4 py-4 text-gray-500 text-xs">Knife Thread · 가성비</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="px-6 py-4 bg-gray-50/50 border-t border-gray-100">
              <p class="text-xs text-gray-400 leading-relaxed">
                <i class="fa-solid fa-circle-info mr-1 text-gray-300"></i>
                상기 비용은 임플란트 1개(픽스처+크라운) 기준입니다.
                네비게이션 가이드 10만원, 수면마취 20만원, CT 촬영 5만원, 뼈이식은 별도입니다.
                65세 이상 어르신은 오스템 기준 2개까지 건강보험 적용 가능합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 서울365치과의 차이 ===== */}
      <section class="section-lg bg-mesh">
        <div class="max-w-[1100px] mx-auto px-5 md:px-8">
          <div class="text-center mb-14">
            <span class="badge-label reveal">WHY SEOUL 365</span>
            <h2 class="section-headline reveal" style="transition-delay:0.2s">
              같은 임플란트라도,<br/>어디서 하느냐가 다릅니다
            </h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 stagger-children">
            <div class="glass-card p-7 flex gap-5 items-start">
              <div class="icon-circle flex-shrink-0">
                <i class="fa-solid fa-user-doctor"></i>
              </div>
              <div>
                <h3 class="font-bold text-gray-900 mb-1">서울대 전문의 직접 시술</h3>
                <p class="text-sm text-gray-500 leading-relaxed">보건복지부 인증 전문의가 상담부터 수술·보철까지 전 과정을 직접 담당합니다. 하버드 임플란트 고급과정 수료.</p>
              </div>
            </div>

            <div class="glass-card p-7 flex gap-5 items-start">
              <div class="icon-circle flex-shrink-0">
                <i class="fa-solid fa-crosshairs"></i>
              </div>
              <div>
                <h3 class="font-bold text-gray-900 mb-1">네비게이션 가이드 수술</h3>
                <p class="text-sm text-gray-500 leading-relaxed">CT 데이터 기반 3D 모의수술 후, 0.1mm 단위로 정밀하게 식립합니다. 성공률 97% 이상.</p>
              </div>
            </div>

            <div class="glass-card p-7 flex gap-5 items-start">
              <div class="icon-circle flex-shrink-0">
                <i class="fa-solid fa-gear"></i>
              </div>
              <div>
                <h3 class="font-bold text-gray-900 mb-1">자체 기공실 운영</h3>
                <p class="text-sm text-gray-500 leading-relaxed">병원 내 기공실에서 맞춤 보철물을 제작합니다. 외주 없이 빠르고 정밀한 보철 완성.</p>
              </div>
            </div>

            <div class="glass-card p-7 flex gap-5 items-start">
              <div class="icon-circle flex-shrink-0">
                <i class="fa-solid fa-bed"></i>
              </div>
              <div>
                <h3 class="font-bold text-gray-900 mb-1">수면진료 가능</h3>
                <p class="text-sm text-gray-500 leading-relaxed">수술이 무서우신 분도 편안하게. 마취과 전문의 수면진료로 통증 없이 수술합니다.</p>
              </div>
            </div>

            <div class="glass-card p-7 flex gap-5 items-start">
              <div class="icon-circle flex-shrink-0">
                <i class="fa-solid fa-calendar-check"></i>
              </div>
              <div>
                <h3 class="font-bold text-gray-900 mb-1">365일 · 야간 21시</h3>
                <p class="text-sm text-gray-500 leading-relaxed">주말·공휴일에도 진료합니다. 바쁜 직장인도 시간 맞춰 내원 가능합니다.</p>
              </div>
            </div>

            <div class="glass-card p-7 flex gap-5 items-start">
              <div class="icon-circle flex-shrink-0">
                <i class="fa-solid fa-shield-halved"></i>
              </div>
              <div>
                <h3 class="font-bold text-gray-900 mb-1">정품 인증 · 보증</h3>
                <p class="text-sm text-gray-500 leading-relaxed">{brand} 공식 정품 인증서 발급. 제조사 보증 정책에 따라 안심하고 시술 받으실 수 있습니다.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 이런 분께 추천합니다 ===== */}
      <section class="section-lg bg-white">
        <div class="max-w-[900px] mx-auto px-5 md:px-8">
          <div class="text-center mb-14">
            <span class="badge-label reveal">RECOMMENDED FOR</span>
            <h2 class="section-headline reveal" style="transition-delay:0.2s">이런 분께 추천합니다</h2>
          </div>

          <div class="glass-card p-8 md:p-10 reveal">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                '검증된 국내 1위 임플란트를 합리적 가격에 원하시는 분',
                '65세 이상 건강보험 적용 임플란트를 고려하시는 분',
                '빠른 골유착으로 치료 기간을 단축하고 싶은 분',
                '부품 수급과 A/S가 확실한 브랜드를 원하시는 분',
                '가성비 좋은 임플란트를 찾으시는 분',
                '국내 치과의사가 가장 많이 사용하는 브랜드를 원하시는 분',
              ].map(item => (
                <div class="flex items-start gap-3">
                  <div class="w-6 h-6 rounded-full bg-[#0066FF]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <i class="fa-solid fa-check text-[#0066FF] text-xs"></i>
                  </div>
                  <span class="text-gray-700 text-sm leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== 치료 과정 ===== */}
      <section class="section-lg bg-mesh">
        <div class="max-w-[1000px] mx-auto px-5 md:px-8">
          <div class="text-center mb-14">
            <span class="badge-label reveal">TREATMENT PROCESS</span>
            <h2 class="section-headline reveal" style="transition-delay:0.2s">치료 과정</h2>
            <p class="text-gray-400 mt-3 reveal" style="transition-delay:0.3s">상담부터 최종 보철까지, 체계적인 6단계</p>
          </div>

          <div class="space-y-4 stagger-children">
            {[
              { step: '01', title: '무료 CT 정밀진단', desc: 'Cone Beam CT 촬영으로 뼈의 양·밀도·신경 위치를 정밀 분석합니다.', icon: 'fa-x-ray', time: '당일 30분' },
              { step: '02', title: '3D 모의수술 & 가이드 제작', desc: 'CT 데이터 기반 디지털 모의수술 후 맞춤 수술 가이드를 제작합니다.', icon: 'fa-laptop-medical', time: '1~2주' },
              { step: '03', title: `${brand} ${model} 식립`, desc: '네비게이션 가이드로 0.1mm 단위 정밀 식립. 수면진료 선택 가능.', icon: 'fa-screwdriver-wrench', time: '30분~1시간' },
              { step: '04', title: '골유착 기간', desc: 'SA 표면처리로 빠른 골유착. 약 6~8주 후 2차 수술 진행.', icon: 'fa-bone', time: '6~8주' },
              { step: '05', title: '맞춤 보철물 제작', desc: '자체 기공실에서 지르코니아 크라운을 정밀 제작합니다.', icon: 'fa-gear', time: '1~2주' },
              { step: '06', title: '최종 장착 & 정기 관리', desc: '보철물 장착, 교합 미세 조정, 정기 검진 프로그램 안내.', icon: 'fa-face-smile', time: '당일' },
            ].map(item => (
              <div class="glass-card p-6 flex items-center gap-6 group hover:border-[#0066FF]/20 transition-all">
                <div class="flex-shrink-0 text-center">
                  <span class="text-3xl font-black text-[#0066FF]/10 group-hover:text-[#0066FF]/20 transition-colors">{item.step}</span>
                </div>
                <div class="icon-circle icon-circle-sm flex-shrink-0">
                  <i class={`fa-solid ${item.icon} text-sm`}></i>
                </div>
                <div class="flex-1 min-w-0">
                  <h3 class="font-bold text-gray-900 group-hover:text-[#0066FF] transition-colors">{item.title}</h3>
                  <p class="text-sm text-gray-500 mt-0.5">{item.desc}</p>
                </div>
                <span class="hidden sm:block text-xs text-[#0066FF] bg-[#0066FF]/5 px-3 py-1.5 rounded-full font-medium flex-shrink-0">{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section class="section-lg bg-white">
        <div class="max-w-[900px] mx-auto px-5 md:px-8">
          <div class="text-center mb-14">
            <span class="badge-label reveal">FAQ</span>
            <h2 class="section-headline reveal" style="transition-delay:0.2s">자주 묻는 질문</h2>
          </div>

          <div class="space-y-3 stagger-children">
            {[
              { q: `${brand} 임플란트가 왜 ${price}만원인가요?`, a: `서울365치과는 ${brand} 공식 파트너로 대량 직접 구매하여 유통 마진을 줄였습니다. 정품 인증서가 발급되며, 동일한 제품을 합리적인 가격에 제공합니다.` },
              { q: '오스템과 스트라우만의 차이는 뭔가요?', a: '오스템은 국내 1위 브랜드로 40년 임상 데이터와 합리적 가격이 강점입니다. 스트라우만은 세계 1위로 특수 합금과 표면처리가 차별점입니다. 뼈 상태, 위치, 예산에 따라 추천이 달라지므로 상담 시 맞춤 안내 드립니다.' },
              { q: `${price}만원에 포함되는 것은?`, a: `${brand} ${model} 픽스처(정품) + 어버트먼트 + 지르코니아 크라운이 포함됩니다. 네비게이션 가이드 10만원, 수면마취 20만원, CT 촬영 5만원, 뼈이식은 별도입니다.` },
              { q: '수술이 무섭습니다. 수면진료가 가능한가요?', a: '네, 가능합니다. 수면진료(20만원 별도) 시 잠을 자는 동안 수술이 진행되어 통증과 무서움을 느끼지 않습니다.' },
              { q: '건강보험 적용이 되나요?', a: '만 65세 이상이시면 오스템 임플란트 기준 본인부담 약 30% 수준으로 건강보험 적용(2개까지)이 가능합니다. 상담 시 보험 적용 여부를 확인해 드립니다.' },
              { q: '이벤트 기간은 언제까지인가요?', a: '월 한정 수량으로 소진 시 종료됩니다. 상담 예약 시점의 가격이 적용되므로, 관심 있으시면 빠른 상담을 권합니다.' },
            ].map((item, i) => (
              <details class="glass-card group" id={`faq-${i}`}>
                <summary class="flex items-center justify-between cursor-pointer p-5 select-none list-none" role="button" aria-expanded="false">
                  <div class="flex items-center gap-3 min-w-0">
                    <span class="text-[#0066FF] font-bold text-sm flex-shrink-0">Q.</span>
                    <span class="font-medium text-gray-800 text-sm">{item.q}</span>
                  </div>
                  <i class="fa-solid fa-chevron-down text-gray-300 text-xs flex-shrink-0 transition-transform group-open:rotate-180"></i>
                </summary>
                <div class="px-5 pb-5 border-t border-gray-100 pt-4">
                  <p class="text-sm text-gray-600 leading-relaxed">{item.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 최종 CTA ===== */}
      <section class="hero-premium relative overflow-hidden py-24 md:py-32">
        <div class="hero-grid"></div>
        <div class="orb orb-1"></div>
        <div class="orb orb-2"></div>
        <div class="relative z-10 max-w-[800px] mx-auto px-5 md:px-8 text-center">
          <h2 class="text-3xl md:text-5xl font-black text-white mb-4 reveal">
            국내 1위 {brand} {model}<br/>
            <span class="gradient-text-white">지금, {price}만원</span>
          </h2>
          <p class="text-white/35 mb-10 reveal" style="transition-delay:0.2s">
            서울대 전문의 직접 시술 · CT 무료 정밀진단 · 정품 인증서 발급
          </p>

          <div class="flex flex-col sm:flex-row items-center justify-center gap-4 reveal" style="transition-delay:0.4s">
            <a href={CLINIC.phoneTel} class="btn-premium btn-premium-fill text-lg px-10 py-4 group" data-cursor-hover>
              <i class="fa-solid fa-phone mr-2 group-hover:animate-shake"></i>
              {CLINIC.phone}
            </a>
            <a href={CLINIC.kakao} target="_blank" rel="noopener noreferrer" class="btn-premium btn-premium-white text-lg px-10 py-4" data-cursor-hover>
              <i class="fa-solid fa-comment mr-2 text-yellow-400"></i>
              카카오톡 상담
            </a>
            <a href="/reservation" class="btn-premium btn-premium-outline text-lg px-10 py-4 text-white/70 border-white/20 hover:border-white/40" data-cursor-hover>
              <i class="fa-solid fa-calendar-check mr-2"></i>
              온라인 예약
            </a>
          </div>

          <div class="mt-10 flex items-center justify-center gap-6 text-white/20 text-sm reveal" style="transition-delay:0.6s">
            <span><i class="fa-solid fa-map-marker-alt mr-1"></i> 인천 남동구 예술로 138</span>
            <span><i class="fa-solid fa-clock mr-1"></i> 365일 진료</span>
          </div>
        </div>
      </section>

      {/* ===== 의료법 디스클레이머 ===== */}
      <div class="bg-gray-50 border-t border-gray-100 py-6">
        <div class="max-w-[900px] mx-auto px-5 md:px-8">
          <p class="text-[0.7rem] text-gray-400 leading-relaxed text-center">
            <i class="fa-solid fa-triangle-exclamation mr-1 text-gray-300"></i>
            본 이벤트 가격은 상담 시점 기준이며, 재고 소진 시 조기 종료될 수 있습니다.
            임플란트는 개인의 구강 상태(뼈의 양·질, 잇몸 상태 등)에 따라 결과가 다를 수 있으며,
            출혈, 감염, 신경 손상, 부종, 통증 등의 부작용이 발생할 수 있습니다.
            반드시 전문의와 충분한 상담 후 결정하시기 바랍니다.
            서울365치과의원 | 대표: 박준규 | 사업자등록번호: 395-37-00559
          </p>
        </div>
      </div>
    </>,
    {
      title: pageTitle,
      description: pageDesc,
      canonical: 'https://seoul365dc.kr/event/implant',
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "홈", "item": "https://seoul365dc.kr" },
            { "@type": "ListItem", "position": 2, "name": "이벤트", "item": "https://seoul365dc.kr/event/implant" },
            { "@type": "ListItem", "position": 3, "name": `${brand} 임플란트 이벤트` }
          ]
        },
        {
          "@context": "https://schema.org",
          "@type": "Event",
          "name": `${brand} ${model} 임플란트 ${price}만원 이벤트`,
          "description": `국내 1위 ${brand} ${model} 임플란트를 ${price}만원 특별 이벤트가로 제공합니다. ${subtitle}. 서울대 전문의 네비게이션 가이드 수술.`,
          "startDate": eventStart,
          "endDate": eventEnd,
          "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
          "eventStatus": "https://schema.org/EventScheduled",
          "location": {
            "@type": "Place",
            "name": "서울365치과의원",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "예술로 138 이토타워 2층 212호",
              "addressLocality": "인천광역시 남동구",
              "addressCountry": "KR"
            }
          },
          "organizer": { "@id": "https://seoul365dc.kr/#dentist" },
          "performer": {
            "@type": "Physician",
            "name": "박준규",
            "jobTitle": "대표원장"
          },
          "offers": {
            "@type": "Offer",
            "name": `${brand} ${model} 임플란트`,
            "price": String(priceNum),
            "priceCurrency": "KRW",
            "availability": "https://schema.org/LimitedAvailability",
            "url": "https://seoul365dc.kr/event/implant",
            "validFrom": eventStart,
            "validThrough": eventEnd,
            "priceValidUntil": eventEnd,
          },
          "image": "https://seoul365dc.kr/static/og-image.png",
          "url": "https://seoul365dc.kr/event/implant"
        },
        {
          "@context": "https://schema.org",
          "@type": "MedicalWebPage",
          "name": `${brand} ${model} 임플란트 ${price}만원 이벤트 - 서울365치과`,
          "url": "https://seoul365dc.kr/event/implant",
          "about": {
            "@type": "MedicalProcedure",
            "name": `${brand} ${model} 임플란트`,
            "procedureType": "SurgicalProcedure",
            "howPerformed": "CT 기반 네비게이션 가이드 수술로 정밀 식립",
            "preparation": "Cone Beam CT 정밀진단, 3D 모의수술",
            "followup": "6~8주 골유착 후 지르코니아 크라운 최종 장착",
            "status": "EventScheduled",
            "bodyLocation": "구강 (잇몸뼈)",
          },
          "specialty": "Dentistry",
          "lastReviewed": "2026-05-11",
          "inLanguage": "ko-KR",
          "speakable": {
            "@type": "SpeakableSpecification",
            "cssSelector": ["h1", "h2", ".section-headline"]
          }
        },
        {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            { "@type": "Question", "name": `${brand} 임플란트가 왜 ${price}만원인가요?`, "acceptedAnswer": { "@type": "Answer", "text": `서울365치과는 ${brand} 공식 파트너로 대량 직접 구매하여 유통 마진을 줄였습니다. 정품 인증서가 발급되며, 동일한 제품을 합리적인 가격에 제공합니다.` } },
            { "@type": "Question", "name": "오스템과 스트라우만의 차이는 뭔가요?", "acceptedAnswer": { "@type": "Answer", "text": "오스템은 국내 1위 브랜드로 40년 임상 데이터와 합리적 가격이 강점입니다. 스트라우만은 세계 1위로 특수 합금과 표면처리가 차별점입니다." } },
            { "@type": "Question", "name": `${price}만원에 포함되는 것은?`, "acceptedAnswer": { "@type": "Answer", "text": `${brand} ${model} 픽스처(정품) + 어버트먼트 + 지르코니아 크라운이 포함됩니다. 네비게이션 가이드 10만원, 수면마취 20만원, CT 촬영 5만원, 뼈이식은 별도입니다.` } },
            { "@type": "Question", "name": "수면진료가 가능한가요?", "acceptedAnswer": { "@type": "Answer", "text": "네, 가능합니다. 수면진료(20만원 별도) 시 잠을 자는 동안 수술이 진행되어 통증과 무서움을 느끼지 않습니다." } },
            { "@type": "Question", "name": "건강보험 적용이 되나요?", "acceptedAnswer": { "@type": "Answer", "text": "만 65세 이상이시면 오스템 임플란트 기준 본인부담 약 30% 수준으로 건강보험 적용(2개까지)이 가능합니다." } },
            { "@type": "Question", "name": "이벤트 기간은 언제까지인가요?", "acceptedAnswer": { "@type": "Answer", "text": "월 한정 수량으로 소진 시 종료됩니다. 상담 예약 시점의 가격이 적용되므로, 관심 있으시면 빠른 상담을 권합니다." } },
          ]
        },
      ]
    }
  )
})

// 기존 /event/straumann URL → /event/implant 리다이렉트 (SEO 301)
eventRoutes.get('/event/straumann', (c) => {
  return c.redirect('/event/implant', 301)
})

export default eventRoutes
