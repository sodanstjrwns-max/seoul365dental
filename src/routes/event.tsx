import { Hono } from 'hono'
import type { Bindings } from '../lib/types'
import { CLINIC } from '../data/clinic'
import { getSetting, initSettingsTable } from '../lib/db'
import { Icon, KakaoMark } from '../lib/icons'

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
  const price = await getSetting(c.env.DB, 'EVENT_IMPLANT_PRICE', '69')
  const originalPrice = await getSetting(c.env.DB, 'EVENT_IMPLANT_ORIGINAL_PRICE', '89')
  const origin = await getSetting(c.env.DB, 'EVENT_IMPLANT_ORIGIN', '한국')
  const subtitle = await getSetting(c.env.DB, 'EVENT_IMPLANT_SUBTITLE', 'SA 표면처리 · 국산 임플란트')
  const periodText = await getSetting(c.env.DB, 'EVENT_IMPLANT_PERIOD', '2026.05.01 ~ 소진 시 종료 · 월 한정 수량')
  const eventStart = await getSetting(c.env.DB, 'EVENT_IMPLANT_START_DATE', '2026-05-01')
  const eventEnd = await getSetting(c.env.DB, 'EVENT_IMPLANT_END_DATE', '2026-06-30')
  const isActive = await getSetting(c.env.DB, 'EVENT_IMPLANT_ACTIVE', '1')

  if (isActive !== '1') {
    return c.redirect('/')
  }

  const priceNum = parseInt(price) * 10000
  const pageTitle = `${brand} 임플란트 ${price}만원 이벤트 | 서울365치과 인천 구월동`
  const pageDesc = `${brand} ${model} 임플란트 ${price}만원 특별 이벤트. ${subtitle}. 서울대 전문의 네비게이션 가이드 수술. 자체기공실. 수면진료 가능. 인천 남동구 구월동 032-432-0365`

  return c.render(
    <>
      {/* ===== 히어로 — 핵심 오퍼 + 가격 사실 카드 ===== */}
      <section class="phead evt-hero" aria-labelledby="evt-h1">
        <div class="wrap phead-in">
          <div class="phead-text">
            <p class="eyebrow evt-live">SPECIAL EVENT</p>

            <h1 id="evt-h1" class="display-xl">
              <span class="block">{brand}</span>{' '}
              <span class="block evt-hl">임플란트 {price}만원</span>
            </h1>

            <p class="lead">
              {brandEn} {model} · {subtitle}<br/>
              서울대 전문의 직접 시술 · 네비게이션 가이드 수술
            </p>

            {/* CTA 버튼 */}
            <div class="phead-cta">
              <a href={CLINIC.phoneTel} class="btn btn-primary btn-lg evt-call">
                <Icon name="phone" />
                지금 전화상담
                <span class="mono">{CLINIC.phone}</span>
              </a>
              <a href="/reservation" class="btn btn-light btn-lg">
                <Icon name="calendar" />
                온라인 예약
              </a>
            </div>
          </div>

          {/* 가격 강조 */}
          <div class="phead-aside">
            <div class="fact-card evt-price">
              <p class="eyebrow">{brandEn} {model}</p>
              <div class="evt-price-row">
                <p class="was">
                  <span class="lb">정가</span>
                  <s>{originalPrice}만원</s>
                </p>
                <span class="evt-arrow" aria-hidden="true"><Icon name="arrow" /></span>
                <p class="now">
                  <span class="lb">이벤트가</span>
                  <b>{price}<small>만원</small></b>
                </p>
              </div>
              {/* 이벤트 기간 */}
              <p class="evt-period">
                <Icon name="clock" size={14} />
                <span>이벤트 기간: {periodText}</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 왜 오스템인가 — 브랜드 신뢰 ===== */}
      <section class="sec" aria-labelledby="evt-brand-h">
        <div class="wrap">
          <div class="sec-head" data-rv>
            <p class="eyebrow">WHY OSSTEM</p>
            <h2 id="evt-brand-h" class="display-2">
              국내 치과의사가<br/>가장 많이 선택한 임플란트
            </h2>
            <p class="lead">국산 임플란트 · 국내 임상 자료 다수</p>
          </div>

          <div class="type-grid evt-brand" data-rv-group>
            {/* 카드 1 */}
            <div class="card type-card">
              <span class="n mono" aria-hidden="true">01</span>
              <h3>SA 표면처리</h3>
              <p>
                모래 분사 + 산 에칭으로<br/>
                <strong>골유착 속도 40% 향상</strong><br/>
                초기 안정성이 뛰어남
              </p>
            </div>

            {/* 카드 2 */}
            <div class="card type-card">
              <span class="n mono" aria-hidden="true">02</span>
              <h3>CAS Kit 시스템</h3>
              <p>
                자가 뼈 채취 + 동시 식립<br/>
                <strong>뼈이식 필요성 감소</strong><br/>
                수술 시간 단축
              </p>
            </div>

            {/* 카드 3 */}
            <div class="card type-card">
              <span class="n mono" aria-hidden="true">03</span>
              <h3>국내 최다 임상</h3>
              <p>
                40년 국내 임상 데이터<br/>
                A/S 및 부품 수급 최상
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 가격 비교표 — 투명한 비용 ===== */}
      <section class="sec" style="background:var(--card)" aria-labelledby="evt-price-h">
        <div class="wrap-n">
          <div class="sec-head" data-rv>
            <p class="eyebrow">TRANSPARENT PRICING</p>
            <h2 id="evt-price-h" class="display-2">투명한 임플란트 가격</h2>
            <p class="lead">추가 비용 걱정 없이, 모든 비용을 사전에 안내드립니다</p>
          </div>

          <div class="table-wrap" data-rv>
            <table class="cmp-table wrap-th evt-table">
              <thead>
                <tr>
                  <th scope="col">브랜드</th>
                  <th scope="col">원산지</th>
                  <th scope="col" class="r">가격</th>
                  <th scope="col">특징</th>
                </tr>
              </thead>
              <tbody>
                {/* 이벤트 브랜드 — 동적 */}
                <tr class="evt-row">
                  <th scope="row">
                    <span>{brand} {model}</span>
                    <span class="tag">EVENT</span>
                  </th>
                  <td>
                    <span class="evt-origin">🇰🇷 {origin}</span>
                  </td>
                  <td class="num">
                    <span>{price}만원</span>
                  </td>
                  <td>
                    SA 표면처리<br/>국산 임플란트
                  </td>
                </tr>
                <tr>
                  <th scope="row">
                    <span>오스템 SOI</span>
                  </th>
                  <td><span class="evt-origin">🇰🇷 한국</span></td>
                  <td class="num">104만원</td>
                  <td>나노 칼슘이온 · 골유착 가속</td>
                </tr>
                <tr>
                  <th scope="row">
                    <span>스트라우만 BLX</span>
                  </th>
                  <td><span class="evt-origin">🇨🇭 스위스</span></td>
                  <td class="num">139만원</td>
                  <td>Roxolid® · SLActive®</td>
                </tr>
                <tr>
                  <th scope="row">
                    <span>메가젠 AnyRidge</span>
                  </th>
                  <td><span class="evt-origin">🇰🇷 한국</span></td>
                  <td class="num">79만원</td>
                  <td>Knife Thread · 가성비</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p class="notice" style="margin-top:1.2rem" data-rv>
            상기 비용은 임플란트 1개(픽스처+크라운) 기준입니다.
            네비게이션 가이드 10만원, 수면마취 20만원, 뼈이식은 별도입니다(CT 촬영 비용은 포함).
            65세 이상 어르신은 오스템 기준 2개까지 건강보험 적용 가능합니다.
          </p>
        </div>
      </section>

      {/* ===== 서울365치과의 차이 ===== */}
      <section class="sec" aria-labelledby="evt-why-h">
        <div class="wrap">
          <div class="sec-head" data-rv>
            <p class="eyebrow">WHY SEOUL 365</p>
            <h2 id="evt-why-h" class="display-2">
              같은 임플란트라도,<br/>어디서 하느냐가 다릅니다
            </h2>
          </div>

          <div class="why-grid" data-rv-group>
            <div class="why-item">
              <span class="n mono" aria-hidden="true">01</span>
              <h3>서울대 전문의 직접 시술</h3>
              <p>보건복지부 인증 전문의가 상담부터 수술·보철까지 전 과정을 직접 담당합니다. 하버드 임플란트 고급과정 수료.</p>
            </div>

            <div class="why-item">
              <span class="n mono" aria-hidden="true">02</span>
              <h3>네비게이션 가이드 수술</h3>
              <p>CT 데이터 기반 3D 모의수술 후, 0.1mm 단위로 정밀하게 식립합니다. 성공률 97% 이상.</p>
            </div>

            <div class="why-item">
              <span class="n mono" aria-hidden="true">03</span>
              <h3>자체 기공실 운영</h3>
              <p>병원 내 기공실에서 맞춤 보철물을 제작합니다. 외주 없이 빠르고 정밀한 보철 완성.</p>
            </div>

            <div class="why-item">
              <span class="n mono" aria-hidden="true">04</span>
              <h3>수면진료 가능</h3>
              <p>수술이 무서우신 분도 편안하게. 마취과 전문의 수면진료로 통증 없이 수술합니다.</p>
            </div>

            <div class="why-item">
              <span class="n mono" aria-hidden="true">05</span>
              <h3>365일 · 야간 21시</h3>
              <p>주말·공휴일에도 진료합니다. 바쁜 직장인도 시간 맞춰 내원 가능합니다.</p>
            </div>

            <div class="why-item">
              <span class="n mono" aria-hidden="true">06</span>
              <h3>정품 인증 · 보증</h3>
              <p>{brand} 공식 정품 인증서 발급. 제조사 보증 정책에 따라 안심하고 시술 받으실 수 있습니다.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 이런 분께 추천합니다 ===== */}
      <section class="sec" style="padding-top:0" aria-labelledby="evt-rec-h">
        <div class="wrap">
          <div class="sec-head" data-rv>
            <p class="eyebrow">RECOMMENDED FOR</p>
            <h2 id="evt-rec-h" class="display-2">이런 분께 추천합니다</h2>
          </div>

          <ul class="check-list" data-rv-group>
            {[
              '국산 임플란트를 합리적 가격에 원하시는 분',
              '65세 이상 건강보험 적용 임플란트를 고려하시는 분',
              '빠른 골유착으로 치료 기간을 단축하고 싶은 분',
              '부품 수급과 A/S가 확실한 브랜드를 원하시는 분',
              '가성비 좋은 임플란트를 찾으시는 분',
              '국내 치과의사가 가장 많이 사용하는 브랜드를 원하시는 분',
            ].map(item => (
              <li>
                <Icon name="check" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ===== 치료 과정 ===== */}
      <section class="sec" style="background:var(--card)" aria-labelledby="evt-proc-h">
        <div class="wrap-n">
          <div class="sec-head" data-rv>
            <p class="eyebrow">TREATMENT PROCESS</p>
            <h2 id="evt-proc-h" class="display-2">치료 과정</h2>
            <p class="lead">상담부터 최종 보철까지, 체계적인 6단계</p>
          </div>

          <ol class="steps" data-rv-group>
            {[
              { step: '01', title: 'CT 정밀진단', desc: 'Cone Beam CT 촬영으로 뼈의 양·밀도·신경 위치를 정밀 분석합니다.', time: '당일 30분' },
              { step: '02', title: '3D 모의수술 & 가이드 제작', desc: 'CT 데이터 기반 디지털 모의수술 후 맞춤 수술 가이드를 제작합니다.', time: '1~2주' },
              { step: '03', title: `${brand} ${model} 식립`, desc: '네비게이션 가이드로 0.1mm 단위 정밀 식립. 수면진료 선택 가능.', time: '30분~1시간' },
              { step: '04', title: '골유착 기간', desc: 'SA 표면처리로 빠른 골유착. 약 10~16주 후 2차 수술 진행.', time: '10~16주' },
              { step: '05', title: '맞춤 보철물 제작', desc: '자체 기공실에서 지르코니아 크라운을 정밀 제작합니다.', time: '1~2주' },
              { step: '06', title: '최종 장착 & 정기 관리', desc: '보철물 장착, 교합 미세 조정, 정기 검진 프로그램 안내.', time: '당일' },
            ].map(item => (
              <li class="step">
                <span class="step-n mono" aria-hidden="true">{item.step}</span>
                <div>
                  <div class="evt-step-head">
                    <h3>{item.title}</h3>
                    <span class="evt-time">{item.time}</span>
                  </div>
                  <p>{item.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section class="sec" aria-labelledby="evt-faq-h">
        <div class="wrap-n">
          <div class="sec-head center" data-rv>
            <p class="eyebrow">FAQ</p>
            <h2 id="evt-faq-h" class="display-2">자주 묻는 질문</h2>
          </div>

          <div data-rv-group>
            {[
              { q: `${brand} 임플란트가 왜 ${price}만원인가요?`, a: `서울365치과는 ${brand} 공식 파트너로 대량 직접 구매하여 유통 마진을 줄였습니다. 정품 인증서가 발급되며, 동일한 제품을 합리적인 가격에 제공합니다.` },
              { q: '오스템과 스트라우만의 차이는 뭔가요?', a: '오스템은 국산 브랜드로 국내 임상 자료가 많고 비용 부담이 상대적으로 적습니다. 스트라우만은 스위스 브랜드로 특수 합금과 표면처리가 특징입니다. 뼈 상태, 위치, 예산에 따라 추천이 달라지므로 상담 시 맞춤 안내 드립니다.' },
              { q: `${price}만원에 포함되는 것은?`, a: `${brand} ${model} 픽스처(정품) + 어버트먼트 + 지르코니아 크라운이 포함됩니다. 네비게이션 가이드 10만원, 수면마취 20만원, 뼈이식은 별도입니다(CT 촬영 비용은 포함).` },
              { q: '수술이 무섭습니다. 수면진료가 가능한가요?', a: '네, 가능합니다. 수면진료(20만원 별도) 시 잠을 자는 동안 수술이 진행되어 통증과 무서움을 느끼지 않습니다.' },
              { q: '건강보험 적용이 되나요?', a: '만 65세 이상이시면 오스템 임플란트 기준 본인부담 약 30% 수준으로 건강보험 적용(2개까지)이 가능합니다. 상담 시 보험 적용 여부를 확인해 드립니다.' },
              { q: '이벤트 기간은 언제까지인가요?', a: '월 한정 수량으로 소진 시 종료됩니다. 상담 예약 시점의 가격이 적용되므로, 관심 있으시면 빠른 상담을 권합니다.' },
            ].map((item, i) => (
              <details class="fq" id={`faq-${i}`} open={i === 0 ? true : undefined}>
                <summary>
                  <h3>{item.q}</h3>
                  <span class="pm" aria-hidden="true"><Icon name="plus" /></span>
                </summary>
                <div class="fq-a">
                  <p>{item.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 최종 CTA ===== */}
      <section class="cta-band" aria-label="상담 안내">
        <div class="wrap-n" style="text-align:center;position:relative">
          <h2 class="display-xl" data-rv>
            {brand} {model}<br/>
            <em>지금, {price}만원</em>
          </h2>
          <p class="lead" data-rv>
            서울대 전문의 직접 시술 · CT 정밀진단 · 정품 인증서 발급
          </p>

          <div class="cta-actions" data-rv-group>
            <a href={CLINIC.phoneTel} class="btn btn-white btn-lg mono">
              <Icon name="phone" />
              {CLINIC.phone}
            </a>
            <a href={CLINIC.kakao} target="_blank" rel="noopener noreferrer" class="btn btn-kakao btn-lg">
              <KakaoMark size={18} />
              카카오톡 상담
            </a>
            <a href="/reservation" class="btn btn-light btn-lg">
              <Icon name="calendar" />
              온라인 예약
            </a>
          </div>

          <p class="evt-loc" data-rv>
            <span><Icon name="pin" size={14} /> 인천 남동구 예술로 138</span>
            <span><Icon name="clock" size={14} /> 365일 진료</span>
          </p>
        </div>
      </section>

      {/* ===== 의료법 디스클레이머 ===== */}
      <div class="evt-legal">
        <div class="wrap-n">
          <p class="notice">
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
          "description": `${brand} ${model} 임플란트를 ${price}만원 특별 이벤트가로 제공합니다. ${subtitle}. 서울대 전문의 네비게이션 가이드 수술.`,
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
            "followup": "10~16주 골유착 후 지르코니아 크라운 최종 장착",
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
            { "@type": "Question", "name": "오스템과 스트라우만의 차이는 뭔가요?", "acceptedAnswer": { "@type": "Answer", "text": "오스템은 국산 브랜드로 국내 임상 자료가 많고 비용 부담이 상대적으로 적습니다. 스트라우만은 스위스 브랜드로 특수 합금과 표면처리가 특징입니다." } },
            { "@type": "Question", "name": `${price}만원에 포함되는 것은?`, "acceptedAnswer": { "@type": "Answer", "text": `${brand} ${model} 픽스처(정품) + 어버트먼트 + 지르코니아 크라운이 포함됩니다. 네비게이션 가이드 10만원, 수면마취 20만원, 뼈이식은 별도입니다(CT 촬영 비용은 포함).` } },
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
