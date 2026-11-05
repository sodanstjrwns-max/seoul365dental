// ============================================================
// Seoul365 Dental — 동단위 지역 SEO 랜딩 페이지
// /area/:slug — 각 동별 고유 콘텐츠 SEO 최적화 페이지
// ============================================================
import { Hono } from 'hono'
import { CONTENT_DATES } from '../lib/content-dates'
import type { Bindings } from '../lib/types'
import { CLINIC, HOURS, DIFF_CARDS } from '../data/clinic'
import { AREAS, getAreaBySlug, getAreasSorted, getAreasByGu, type AreaInfo } from '../data/areas'
import { treatments, getTreatmentBySlug } from '../data/treatments'
import { doctors } from '../data/doctors'
import {
  MATRIX_TREATMENT_SLUGS,
  MATRIX_TREATMENT_INFO,
  MATRIX_VARIANTS,
  TREATMENT_PRICING,
  buildAreaTreatmentMeta,
  buildMatrixContent,
  buildVariantMeta,
  getAreaTreatments,
  type MatrixVariantSlug,
} from '../data/area-treatment'
import { AREA_HUBS, type AreaHub, type HubSection } from '../data/area-hubs'
import { HubA, HUB_NAMDONG } from '../lib/hub-links'
import { GuwolCardGrid, GUWOL_CARD_CSS, guwolCardItemList, matrixCardImage } from '../lib/guwol-cards'
import { Icon, KakaoMark, NaverMark } from '../lib/icons'

const areaRoutes = new Hono<{ Bindings: Bindings }>()

// ── 지역 목록 페이지 (/area) ──
areaRoutes.get('/area', (c) => {
  const grouped = getAreasByGu();
  const guOrder = ['남동구', '미추홀구', '연수구', '부평구', '서구', '계양구'];
  const gus = guOrder.filter(gu => grouped[gu]);

  return c.render(
    <>
      <section class="phead" aria-labelledby="area-h1">
        <div class="wrap phead-in">
          <div class="phead-text">
            <nav class="crumb" aria-label="현재 위치"><ol><li><a href="/">홈</a></li><li aria-current="page">지역 안내</li></ol></nav>
            <p class="eyebrow">Area Guide · {AREAS.length}</p>
            <h1 id="area-h1" class="display-xl">우리 동네에서 서울365치과까지</h1>
            <p class="lead hero-sub">인천 {AREAS.length}개 지역에서 서울365치과까지의 거리와 소요시간을 안내합니다.<br/>예술회관역 5번 출구 도보 3분 — 어디서든 가까운 치과.</p>
            <div class="phead-cta">
              <a href="/reservation" class="btn btn-primary"><Icon name="calendar" />예약하기</a>
              <a href={CLINIC.phoneTel} class="btn btn-light mono"><Icon name="phone" />{CLINIC.phone}</a>
            </div>
          </div>
          <div class="phead-aside">
            <div class="fact-card">
              <p class="eyebrow">구별 바로가기</p>
              <div class="phead-jump">
                {gus.map(gu => <a href={`#gu-${guOrder.indexOf(gu)}`}>{gu}<small>{grouped[gu].length}</small></a>)}
              </div>
              <p class="fine" style="margin:1rem 0 0;color:var(--sky)">{CLINIC.address} · 예술회관역 5번 출구 도보 3분</p>
            </div>
          </div>
        </div>
      </section>

      {/* 지역 목록 */}
      <section class="sec">
        <div class="wrap">
          {gus.map(gu => (
            <div class="gu-block" id={`gu-${guOrder.indexOf(gu)}`} data-rv>
              <div class="gu-head">
                <h2>{gu}</h2>
                <span class="cnt">{grouped[gu].length}개 지역</span>
                {gu === '남동구' && (
                  <p class="hubs">
                    <a href="/area/namdong-gu">인천 남동구 치과</a>
                    <a href="/area/guwol-dong">구월동 치과</a>
                  </p>
                )}
              </div>
              <div class="area-grid" data-rv-group>
                {/* 구월동은 위 "구월동 치과" 허브 링크로 대신 (페이지당 허브 링크 최대 2개, 2026-10-08) */}
                {grouped[gu].filter(area => area.slug !== 'guwol-dong').sort((a, b) => a.distKm - b.distKm).map(area => (
                  <a href={`/area/${area.slug}`} class="card area-tile hover">
                    <div class="top">
                      <div><h3>{area.name}</h3><span class="gu">{area.gu}</span></div>
                      <div class="dist">{area.distKm === 0 ? '원내' : `${area.distKm}km`}<small>{area.distKm === 0 ? '도보 3분' : `약 ${area.travelMin}분`}</small></div>
                    </div>
                    <p class="how">{area.travelDesc}</p>
                    <div class="lm">{area.landmarks.slice(0, 3).map(l => <span>{l}</span>)}</div>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 🎯 진료별 지역 매트릭스 (SEO 골든 그리드) */}
      <section class="sec" style="padding-top:0">
        <div class="wrap">
          <div class="sec-head" data-rv>
            <p class="eyebrow">By treatment</p>
            <h2 class="display-2">진료별로 가까운 지역 찾기</h2>
            <p class="lead">{MATRIX_TREATMENT_SLUGS.length}개 핵심 진료 × {AREAS.length}개 지역 = 우리 동네에서 가장 가까운 전문 진료</p>
          </div>
          {MATRIX_TREATMENT_SLUGS.map(tSlug => {
            const info = MATRIX_TREATMENT_INFO[tSlug];
            const nearAreas = getAreasSorted().slice(0, 12);
            return (
              <div class="card mx-block" data-rv>
                <div class="mx-head">
                  <h3>{info.name}</h3>
                  <p>{info.tagline}</p>
                  <a href={`/treatments/${tSlug}`} class="arrow-link">진료 상세<Icon name="arrow" /></a>
                </div>
                <div class="area-chips">
                  {nearAreas.map(a => (
                    <a href={`/area/${a.slug}/${tSlug}`} title={`${a.name} ${info.name}`}>{a.name} {info.name}</a>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section class="cta-band" aria-label="상담 안내">
        <div class="wrap-n" style="text-align:center;position:relative">
          <p class="eyebrow eyebrow-light no-bar" style="justify-content:center" data-rv>Visit</p>
          <h2 class="display-xl" data-rv>어디서든 가까운 서울365치과</h2>
          <p class="lead" data-rv>예술회관역 5번 출구 도보 3분 · 365일 야간21시 진료</p>
          <div class="cta-actions" data-rv-group>
            <a href="/reservation" class="btn btn-primary btn-lg"><Icon name="calendar" />예약하기</a>
            <a href={CLINIC.phoneTel} class="btn btn-white btn-lg mono"><Icon name="phone" />{CLINIC.phone}</a>
          </div>
        </div>
      </section>
    </>,
    {
      title: '인천 지역별 치과 안내 | 서울365치과 - 구월동·간석동·만수동·논현동·부평',
      description: `인천 ${AREAS.length}개 지역에서 서울365치과까지 거리·소요시간 안내. 예술회관역 5번 출구 도보 3분. 서울대 5인 원장, 365일·야간21시 진료. 임플란트, 교정, 수면진료. ☎ 032-432-0365`,
      canonical: 'https://seoul365dc.kr/area',
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "홈", "item": "https://seoul365dc.kr" },
            { "@type": "ListItem", "position": 2, "name": "지역 안내", "item": "https://seoul365dc.kr/area" },
          ],
        },
        {
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": "인천 지역별 치과 안내",
          "description": `서울365치과 인천 ${AREAS.length}개 지역 안내`,
          "url": "https://seoul365dc.kr/area",
          "isPartOf": { "@id": "https://seoul365dc.kr/#website" },
          "inLanguage": "ko-KR",
          "mainEntity": {
            "@type": "ItemList",
            "itemListElement": AREAS.map((a, i) => ({
              "@type": "ListItem",
              "position": i + 1,
              "name": `${a.name}치과 추천 서울365치과`,
              "url": `https://seoul365dc.kr/area/${a.slug}`,
            })),
          },
        },
      ],
    }
  )
})

// ============================================================
// ── 🚀 SEO 매트릭스 페이지 (/area/:areaSlug/:treatmentSlug) ──
// 18개 지역 × 10개 핵심 진료 = 180개 자동 SEO 랜딩 페이지
// "구월동 임플란트", "송도 인비절라인" 등 롱테일 키워드 완전 장악
// ============================================================
areaRoutes.get('/area/:areaSlug/:treatmentSlug', (c) => {
  const areaSlug = c.req.param('areaSlug');
  const treatmentSlug = c.req.param('treatmentSlug');

  const area = getAreaBySlug(areaSlug);
  const treatment = getTreatmentBySlug(treatmentSlug);

  // 둘 다 존재하지 않거나 매트릭스 화이트리스트에 없으면 404
  if (!area || !treatment || !MATRIX_TREATMENT_SLUGS.includes(treatmentSlug as any)) {
    return c.notFound();
  }

  const meta = buildAreaTreatmentMeta(area, treatment);
  const tInfo = MATRIX_TREATMENT_INFO[treatmentSlug as keyof typeof MATRIX_TREATMENT_INFO];
  // 대표 사진(2026-10-14): og·본문 첫 사진·스키마 image·사이트맵 image:image 공통 1200×630
  const cardImg = matrixCardImage(treatmentSlug);
  const cardImgAbs = cardImg ? `https://seoul365dc.kr${cardImg}` : 'https://seoul365dc.kr/static/og-image.png';

  // 같은 지역의 다른 진료들 (내부 링크)
  const otherTreatmentsInArea = MATRIX_TREATMENT_SLUGS
    .filter(s => s !== treatmentSlug)
    .map(s => ({
      slug: s,
      info: MATRIX_TREATMENT_INFO[s],
      url: `/area/${area.slug}/${s}`,
    }));

  // 같은 진료의 다른 지역들 (내부 링크)
  const otherAreasForTreatment = AREAS
    .filter(a => a.slug !== areaSlug)
    .sort((a, b) => a.distKm - b.distKm)
    .slice(0, 12);

  // 지역×진료 맞춤 FAQ
  const matrixFaq = [
    {
      q: `${area.name}에서 ${treatment.name} 잘하는 치과 추천해주세요`,
      a: `${area.name}에서 가까운 ${treatment.name} 전문 치과로는 서울365치과를 추천드립니다. ${area.travelDesc}로 ${area.distKm === 0 ? '도보 3분' : `약 ${area.travelMin}분`}이면 도착하며, 서울대 출신 5인 원장이 협진하고 365일·야간21시까지 진료합니다. ${treatment.shortDesc}에 특화되어 있으며, ☎ 032-432-0365로 무료 상담 가능합니다.`,
    },
    {
      q: `${area.name} ${treatment.name} 비용은 얼마인가요?`,
      a: `${treatment.name} 비용은 환자분의 상태와 사용 재료에 따라 달라집니다. ${treatment.faq?.[0]?.a?.slice(0, 200) || `서울365치과는 합리적인 가격으로 ${treatment.name}를 제공하며, 정확한 비용은 진단 후 안내드립니다.`} ${area.name}에서 ${area.distKm === 0 ? '도보 3분' : `${area.travelMin}분`} 거리이므로 부담 없이 상담받으실 수 있습니다.`,
    },
    {
      q: `${area.name}에서 ${treatment.name} 받으러 가는 길은?`,
      a: `${area.travelDesc}. 인천 1호선 예술회관역 5번 출구에서 도보 3분, 이토타워 2층입니다. 자가용으로 오시면 이토타워 지하주차장을 이용하실 수 있습니다. ${area.name}에서 ${area.distKm === 0 ? '바로 인근' : `약 ${area.distKm}km`} 거리입니다.`,
    },
    {
      q: `${treatment.name} 받을 때 야간이나 주말도 가능한가요?`,
      a: `네, 서울365치과는 ${area.name} 주민들을 위해 365일 진료합니다. 월~목 21시까지 야간 진료, 토요일 10~14시, 일요일·공휴일 14~18시 진료하므로 직장인이나 학생도 편하게 ${treatment.name} 치료를 받으실 수 있습니다.`,
    },
    {
      q: `${area.name} 외 다른 지역에서도 많이 오시나요?`,
      a: `네, 서울365치과는 ${area.gu}을 포함해 인천 남동구·미추홀구·연수구·부평구·서구·계양구 등 다양한 지역에서 ${treatment.name}을(를) 위해 내원하고 계십니다. 예술회관역 도보 3분 입지로 인천 어디서든 접근이 편리합니다.`,
    },
    // 진료별 핵심 FAQ 1개 인용
    ...(treatment.faq?.slice(0, 3) || []).map(f => ({
      q: `${area.name} ${treatment.name} - ${f.q}`,
      a: f.a,
    })),
  ];

  const canonicalUrl = meta.canonical;

  // 🚀 v2: 1500자+ 풍부한 SEO 콘텐츠 자동 생성
  const matrixContent = buildMatrixContent(area, treatment);
  const pricingData = TREATMENT_PRICING[treatmentSlug as MatrixVariantSlug extends never ? any : any] || TREATMENT_PRICING[treatmentSlug as keyof typeof TREATMENT_PRICING];
  const stepTitle = (s: string) => s.replace(/^\d+\s*단계\s*[:：]\s*/, '');

  return c.render(
    <div itemscope itemtype="https://schema.org/MedicalWebPage">
      {/* Hero — 지역×진료 강조 */}
      <section class="phead" aria-labelledby="mx-h1">
        <div class="wrap phead-in">
          <div class="phead-text">
            <nav class="crumb" aria-label="현재 위치">
              <ol>
                <li><a href="/">홈</a></li>
                <li><a href="/area">지역안내</a></li>
                <li><a href={`/area/${area.slug}`}>{area.slug === 'guwol-dong' ? '구월동 치과' : `${area.gu} ${area.name}`}</a></li>
                <li aria-current="page">{treatment.name}</li>
              </ol>
            </nav>
            <p class="eyebrow">{area.name} · {treatment.name}</p>
            <h1 id="mx-h1" class="display-xl" itemprop="name"><span class="block">{area.name} {treatment.name}</span>{' '}<span class="block h1-sub">서울365치과</span></h1>
            <p class="lead hero-sub" itemprop="description">{meta.subtitle}</p>
            <p class="phead-note" style="margin-top:-1rem">{meta.highlight}</p>
            {/* 허브 링크 (2026-10-08) — 구월동은 위 breadcrumb 가 허브 링크 */}
            {area.slug !== 'guwol-dong' && (
              <p class="phead-note">병원 위치·주차·진료시간은 <HubA cls="cta-link" /> 안내에서 확인하실 수 있습니다.</p>
            )}
            <div class="phead-cta">
              <a href="/reservation" class="btn btn-primary"><Icon name="calendar" />{treatment.name} 무료 상담</a>
              <a href={CLINIC.phoneTel} class="btn btn-light mono"><Icon name="phone" />{CLINIC.phone}</a>
            </div>
          </div>
          <div class="phead-aside">
            {/* 대표 사진 (2026-10-14) — og:image 와 같은 사진 */}
            {cardImg && (
              <figure class="phead-img og" style="margin:0">
                <img src={cardImg} width="1200" height="630" fetchpriority="high" decoding="async" alt={`${area.name} ${treatment.name}`} />
              </figure>
            )}
            <div class="fact-card">
              <p class="eyebrow">{area.name}에서</p>
              <dl class="fact-rows">
                <div><dt>직선 거리</dt><dd class="mono">{area.distKm === 0 ? '원내' : `${area.distKm}km`}</dd></div>
                <div><dt>소요 시간</dt><dd class="mono">{area.distKm === 0 ? '도보 3분' : `약 ${area.travelMin}분`}</dd></div>
                <div><dt>진료</dt><dd>{treatment.name}</dd></div>
                <div><dt>특징</dt><dd>{tInfo?.tagline || treatment.shortDesc}</dd></div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* 왜 서울365치과 ({지역} {진료}) */}
      <section class="sec">
        <div class="wrap">
          <div class="sec-head" data-rv>
            <p class="eyebrow">Why here</p>
            <h2 class="display-2">{area.name} 주민이 {treatment.name}을(를) 위해 서울365치과를 선택하는 이유</h2>
            <p class="lead">{area.travelDesc} · {treatment.shortDesc}</p>
          </div>
          <div class="why-grid" data-rv-group>
            {treatment.whyUs.slice(0, 6).map((w, i) => (
              <div class="why-item">
                <span class="n mono">{String(i + 1).padStart(2, '0')}</span>
                <h3>{w.title}</h3>
                <p>{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 진료 과정 — 그대로 인용해 키워드 밀도 ↑ */}
      <section class="sec" style="padding-top:0">
        <div class="wrap-n">
          <div class="sec-head" data-rv>
            <p class="eyebrow">Process</p>
            <h2 class="display-2">{area.name} {treatment.name} 진료 과정</h2>
          </div>
          <ol class="steps" data-rv-group>
            {treatment.process.map((p, idx) => (
              <li class="step" id={`step-${idx + 1}`}>
                <span class="step-n mono" aria-label={`${idx + 1}단계`}>{String(idx + 1).padStart(2, '0')}</span>
                <div>
                  <h3>{stepTitle(p.step)}</h3>
                  <p>{p.desc}</p>
                </div>
              </li>
            ))}
          </ol>
          <p style="margin-top:2.2rem" data-rv>
            <a href={`/treatments/${treatment.slug}`} class="btn btn-ghost">{treatment.name} 자세한 안내 보기<Icon name="arrow" /></a>
          </p>
        </div>
      </section>

      {/* 진료시간 — {지역} 강조 */}
      <section class="hours-band">
        <div class="wrap-n">
          <div class="sec-head center" data-rv>
            <p class="eyebrow eyebrow-light">Hours</p>
            <h2 class="display-2">{area.name}에서 퇴근 후에도 {treatment.name} 가능</h2>
            <p class="lead">365일 · 야간 21시 · 일요일·공휴일 진료</p>
          </div>
          <table class="hours-table" data-rv>
            <caption class="sr-only">서울365치과 진료시간</caption>
            <tbody>
              {HOURS.map(h => (
                <tr><th scope="row">{h.day}</th><td>{h.time}{h.note && <span class="note">{h.note}</span>}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 🚀 v2: 풍부한 SEO 본문 콘텐츠 (1500자+) */}
      <article class="sec" itemscope itemtype="https://schema.org/Article">
        <meta itemprop="headline" content={`${area.name} ${treatment.name} 안내 - 서울365치과`} />
        <meta itemprop="datePublished" content="2025-01-01" />
        <meta itemprop="dateModified" content={CONTENT_DATES.area} />
        <div itemprop="author" itemscope itemtype="https://schema.org/Dentist" style="display:none">
          <meta itemprop="name" content="서울365치과의원" />
          <meta itemprop="url" content="https://seoul365dc.kr" />
        </div>
        <div itemprop="publisher" itemscope itemtype="https://schema.org/Organization" style="display:none">
          <meta itemprop="name" content="서울365치과의원" />
        </div>

        <div class="wrap-n">
          <div class="sec-head" data-rv>
            <p class="eyebrow">Guide</p>
            <h2 class="display-2" itemprop="name">{area.name} {treatment.name} — 알아두면 좋은 정보</h2>
          </div>
          {/* 도입부 3문단 (자연어 SEO 본문) */}
          <div class="prose-sec" itemprop="articleBody" data-rv>
            {matrixContent.introParagraphs.map((p) => <p>{p}</p>)}
          </div>
        </div>
      </article>

      {/* 🚀 v2: 가격표 섹션 (구조화된 데이터 — 검색결과 리치 스니펫) */}
      {pricingData && (
        <section class="sec" style="padding-top:0">
          <div class="wrap-n">
            <div class="sec-head" data-rv>
              <p class="eyebrow">Pricing</p>
              <h2 class="display-2">{area.name} {treatment.name} 비용·가격 안내</h2>
              <p class="lead">투명한 비용, 추가비용 없는 정찰가</p>
            </div>
            <div class="table-wrap" data-rv>
              <table class="cmp-table wrap-th" itemscope itemtype="https://schema.org/PriceSpecification">
                <thead>
                  <tr><th scope="col">진료 항목</th><th scope="col" style="text-align:right">가격</th><th scope="col">비고</th></tr>
                </thead>
                <tbody>
                  {pricingData.rows.map((row) => (
                    <tr>
                      <th scope="row" itemprop="name">{row.item}</th>
                      <td class="num" style="text-align:right;font-weight:700;color:var(--blue);white-space:nowrap" itemprop="price">{row.price}</td>
                      <td>{row.note || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {pricingData.insurance && (
              <div class="notice-box care" data-rv><strong>건강보험 안내:</strong> {pricingData.insurance}</div>
            )}
            <p class="notice" style="margin-top:1.2rem" data-rv>{matrixContent.pricingNote}</p>
            <p style="margin-top:1.8rem" data-rv>
              <a href="/reservation" class="btn btn-primary"><Icon name="calendar" />{area.name} {treatment.name} 정확한 견적 무료 상담</a>
            </p>
          </div>
        </section>
      )}

      {/* 🚀 v2: 6가지 선택 이유 (Long-form 콘텐츠) */}
      <section class="sec" style="padding-top:0">
        <div class="wrap">
          <div class="sec-head" data-rv>
            <p class="eyebrow">Why choose us</p>
            <h2 class="display-2">{area.name} 분들이 {treatment.name}을(를) 위해 서울365치과를 선택하는 6가지 이유</h2>
          </div>
          <div class="why-grid" data-rv-group>
            {matrixContent.whyChoosePoints.map((point, idx) => (
              <div class="why-item">
                <span class="n mono">{String(idx + 1).padStart(2, '0')}</span>
                <h3>{point.title}</h3>
                <p>{point.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 🚀 v2: 사후 관리 안내 + 비교 가이드 */}
      <section class="sec" style="padding-top:0">
        <div class="wrap">
          <div class="note-grid" data-rv-group>
            <div class="card note-card care">
              <h3><span class="dot"></span>{area.name} {treatment.name} 사후 관리</h3>
              <ul>{matrixContent.aftercareTips.map(tip => <li>{tip}</li>)}</ul>
            </div>
            <div class="card note-card">
              <h3><span class="dot" style="background:var(--blue)"></span>{area.name} {treatment.name} 치과 비교 가이드</h3>
              <p style="font-size:.95rem;line-height:1.8;color:var(--ink-2);margin:0 0 1rem">{matrixContent.comparisonNote}</p>
              <a href={`/treatments/${treatment.slug}`} class="arrow-link">{treatment.name} 자세히 보기<Icon name="arrow" /></a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ — 지역×진료 맞춤 */}
      <section class="sec" style="padding-top:0">
        <div class="wrap-n">
          <div class="sec-head" data-rv>
            <p class="eyebrow">FAQ</p>
            <h2 class="display-2">{area.name} {treatment.name} 자주 묻는 질문</h2>
          </div>
          <div itemscope itemtype="https://schema.org/FAQPage" data-rv-group>
            {matrixFaq.map((faq, i) => (
              <details class="fq" open={i === 0 ? true : undefined} itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
                <summary><h3 itemprop="name">{faq.q}</h3><span class="pm" aria-hidden="true"><Icon name="plus" /></span></summary>
                <div class="fq-a" itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
                  <p itemprop="text" style="white-space:pre-line">{faq.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 같은 지역의 다른 진료 */}
      <section class="sec" style="padding-top:0">
        <div class="wrap">
          <div class="sec-head" data-rv>
            <p class="eyebrow">{area.name}</p>
            <h2 class="display-2">{area.name}에서 받을 수 있는 다른 진료</h2>
          </div>
          {area.slug === 'guwol-dong' && (
            <div style="margin-bottom:2rem">
              <style dangerouslySetInnerHTML={{ __html: GUWOL_CARD_CSS }} />
              <GuwolCardGrid idPrefix="sib" exclude={treatmentSlug} />
            </div>
          )}
          <ul class="tx-tiles" data-rv-group>
            {otherTreatmentsInArea.map(o => (
              <li>
                <a href={o.url} class="tx-tile" title={`${area.name} ${o.info.name}`}>
                  <span class="tx-tile-name">{area.name} {o.info.name}</span>
                  <span class="tx-tile-desc">{o.info.tagline}</span>
                  <Icon name="arrowUpRight" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 같은 진료의 다른 지역 */}
      <section class="sec" style="padding-top:0">
        <div class="wrap-n">
          <div class="sec-head" data-rv>
            <p class="eyebrow">Nearby</p>
            <h2 class="display-2">다른 지역의 {treatment.name} 안내</h2>
            <p class="lead">인천 전 지역에서 가까운 {treatment.name} 전문 치과</p>
          </div>
          <div class="area-chips" data-rv>
            {otherAreasForTreatment.map(a => (
              <a href={`/area/${a.slug}/${treatment.slug}`} title={`${a.name} ${treatment.name}`}>{a.name} {treatment.name}<small>{a.distKm}km · {a.travelMin}분</small></a>
            ))}
          </div>
        </div>
      </section>

      {/* 🚀 v2: 롱테일 페이지 링크 (비용/추천/이벤트/잘하는곳/야간) */}
      <section class="sec" style="padding-top:0">
        <div class="wrap">
          <div class="sec-head" data-rv>
            <p class="eyebrow">Deep dive</p>
            <h2 class="display-2">{area.name} {treatment.name} 더 자세히 알아보기</h2>
            <p class="lead">궁금한 주제를 클릭하세요</p>
          </div>
          <ul class="tx-tiles" data-rv-group>
            {MATRIX_VARIANTS.map(v => (
              <li>
                <a href={`/area/${area.slug}/${treatment.slug}/${v.slug}`} class="tx-tile" title={`${area.name} ${treatment.name} ${v.name}`}>
                  <span class="tx-tile-name">{area.name} {treatment.name} {v.name}</span>
                  <span class="tx-tile-desc">{v.heading}</span>
                  <Icon name="arrowUpRight" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Final CTA */}
      <section class="cta-band" aria-label="상담 안내">
        <div class="wrap-n" style="text-align:center;position:relative">
          <p class="eyebrow eyebrow-light no-bar" style="justify-content:center" data-rv>Consultation</p>
          <h2 class="display-xl" data-rv>{area.name}에서 가장 가까운 {treatment.name} 전문 치과</h2>
          <p class="lead" data-rv>{area.travelDesc} · 서울대 5인 원장 · 365일 야간21시 · 자체 기공실</p>
          <div class="cta-actions" data-rv-group>
            <a href="/reservation" class="btn btn-primary btn-lg"><Icon name="calendar" />{treatment.name} 상담 예약</a>
            <a href={CLINIC.phoneTel} class="btn btn-white btn-lg mono"><Icon name="phone" />{CLINIC.phone}</a>
            <a href={CLINIC.kakao} target="_blank" rel="noopener noreferrer" class="btn btn-kakao btn-lg"><KakaoMark size={18} />카카오 상담</a>
          </div>
        </div>
      </section>
    </div>,
    {
      title: meta.seoTitle,
      description: meta.seoDesc,
      canonical: canonicalUrl,
      keywords: meta.keywords.join(', '),
      ...(cardImg ? { ogImage: cardImgAbs, ogImageWidth: 1200, ogImageHeight: 630, ogImageAlt: `${area.name} ${treatment.name}` } : {}),
      jsonLd: [
        // Breadcrumb
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "홈", "item": "https://seoul365dc.kr" },
            { "@type": "ListItem", "position": 2, "name": "지역 안내", "item": "https://seoul365dc.kr/area" },
            { "@type": "ListItem", "position": 3, "name": `${area.name}치과`, "item": `https://seoul365dc.kr/area/${area.slug}` },
            { "@type": "ListItem", "position": 4, "name": `${area.name} ${treatment.name}`, "item": canonicalUrl },
          ],
        },
        // @id 없는 중복 Dentist 노드 제거 — 병원 엔티티는 전역 #dentist 하나 (2026-09-29)
        // MedicalProcedure 자체
        {
          "@context": "https://schema.org",
          "@type": "MedicalProcedure",
          "name": `${area.name} ${treatment.name}`,
          "alternateName": treatment.name,
          "description": meta.seoDesc,
          "url": canonicalUrl,
          "procedureType": "https://schema.org/TherapeuticProcedure",
          "performer": { "@id": "https://seoul365dc.kr/#dentist" },
        },
        // FAQPage
        {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": matrixFaq.map(faq => ({
            "@type": "Question",
            "name": faq.q,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": faq.a,
            },
          })),
        },
        // MedicalWebPage
        {
          "@context": "https://schema.org",
          "@type": "MedicalWebPage",
          "name": meta.seoTitle,
          "description": meta.seoDesc,
          "url": canonicalUrl,
          "inLanguage": "ko-KR",
          "isPartOf": { "@id": "https://seoul365dc.kr/#website" },
          ...(cardImg ? {
            "image": { "@type": "ImageObject", "url": cardImgAbs, "width": 1200, "height": 630, "caption": `${area.name} ${treatment.name}` },
            "primaryImageOfPage": { "@type": "ImageObject", "url": cardImgAbs },
          } : {}),
          "about": {
            "@type": "MedicalCondition",
            "name": `${treatment.name} 진료`,
            "associatedAnatomy": { "@type": "AnatomicalStructure", "name": "치아" },
          },
          "specialty": {
            "@type": "MedicalSpecialty",
            "name": "Dentistry",
          },
          "lastReviewed": CONTENT_DATES.area,
          "mainContentOfPage": {
            "@type": "WebPageElement",
            "cssSelector": "h1",
          },
          "speakable": {
            "@type": "SpeakableSpecification",
            "cssSelector": ["h1", "h2", "[itemprop='articleBody']"],
          },
        },
        // 🚀 v2: Article (블로그형 본문 강화)
        {
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": `${area.name} ${treatment.name} 안내 - 서울365치과`,
          "description": meta.seoDesc,
          "image": cardImgAbs,
          "datePublished": "2025-01-01",
          "dateModified": CONTENT_DATES.area,
          "author": {
            "@type": "Organization",
            "name": "서울365치과의원",
            "url": "https://seoul365dc.kr",
          },
          "publisher": {
            "@type": "Organization",
            "name": "서울365치과의원",
            "logo": {
              "@type": "ImageObject",
              "url": "https://seoul365dc.kr/static/logo-v2.png",
            },
          },
          "mainEntityOfPage": canonicalUrl,
          "articleBody": matrixContent.introParagraphs.join('\n\n'),
          "wordCount": matrixContent.introParagraphs.join(' ').length,
          "inLanguage": "ko-KR",
          "isAccessibleForFree": true,
          "keywords": matrixContent.longTailKeywords.join(', '),
        },
        // 🚀 v2: HowTo 스키마 (진료 과정 풍부한 리치 결과)
        {
          "@context": "https://schema.org",
          "@type": "HowTo",
          "name": `${area.name} ${treatment.name} 진행 과정`,
          "description": `${area.name} 거주 환자분의 ${treatment.name} 진료 진행 절차 안내`,
          "image": cardImgAbs,
          "totalTime": treatment.slug === 'orthodontics' || treatment.slug === 'invisalign' ? "P18M" : treatment.slug === 'implant' || treatment.slug === 'full-implant' ? "P3M" : "PT1H",
          "tool": [
            { "@type": "HowToTool", "name": "디지털 X-ray·CT" },
            { "@type": "HowToTool", "name": "네비게이션 가이드" },
            { "@type": "HowToTool", "name": "자체 기공실 보철" },
          ],
          "step": matrixContent.processGuide.map((p, i) => ({
            "@type": "HowToStep",
            "position": p.step,
            "name": p.title,
            "text": p.desc,
            "url": `${canonicalUrl}#step-${p.step}`,
          })),
        },
        // 🚀 v2: OfferCatalog (가격표 구조화)
        ...(pricingData ? [{
          "@context": "https://schema.org",
          "@type": "OfferCatalog",
          "name": `${area.name} ${treatment.name} 비용 안내`,
          "url": canonicalUrl,
          "itemListElement": pricingData.rows.map((row, i) => ({
            "@type": "Offer",
            "position": i + 1,
            "name": row.item,
            "price": row.price.replace(/[^\d]/g, '') || "0",
            "priceCurrency": "KRW",
            "description": row.note || '',
            "availability": "https://schema.org/InStock",
            "url": canonicalUrl,
            "seller": { "@id": "https://seoul365dc.kr/#dentist" },
          })),
        }] : []),
        // 🚀 v2: Place (지역 강조)
        {
          "@context": "https://schema.org",
          "@type": "Place",
          "name": `${area.name} - ${treatment.name} 진료 지역`,
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": area.lat,
            "longitude": area.lng,
          },
          "containedInPlace": {
            "@type": "AdministrativeArea",
            "name": `인천광역시 ${area.gu}`,
          },
        },
      ],
    }
  )
})

// ============================================================
// 🚀 v2 SUPER UPGRADE — 롱테일 변형 페이지
// /area/:areaSlug/:treatmentSlug/:variantSlug
// 18지역 × 10진료 × 6변형 = 1,080개 추가 페이지
// "구월동 임플란트 비용", "송도 인비절라인 추천" 등 롱테일 키워드 완전 장악
// ============================================================
areaRoutes.get('/area/:areaSlug/:treatmentSlug/:variantSlug', (c) => {
  const areaSlug = c.req.param('areaSlug');
  const treatmentSlug = c.req.param('treatmentSlug');
  const variantSlug = c.req.param('variantSlug') as MatrixVariantSlug;
  // 2026-10-15: '후기' 변형 페이지 폐지(의료법상 치료 후기 광고 — 남동구보건소 민원) → 기본 지역×진료 페이지로 영구 이동
  if ((variantSlug as string) === 'review') {
    return c.redirect(`/area/${c.req.param('areaSlug')}/${c.req.param('treatmentSlug')}`, 301);
  }

  const area = getAreaBySlug(areaSlug);
  const treatment = getTreatmentBySlug(treatmentSlug);
  const validVariant = MATRIX_VARIANTS.some(v => v.slug === variantSlug);

  if (!area || !treatment || !MATRIX_TREATMENT_SLUGS.includes(treatmentSlug as any) || !validVariant) {
    return c.notFound();
  }

  const variantMeta = buildVariantMeta(area, treatment, variantSlug);
  if (!variantMeta) return c.notFound();

  const matrixContent = buildMatrixContent(area, treatment);
  const pricingData = TREATMENT_PRICING[treatmentSlug as keyof typeof TREATMENT_PRICING];
  const v = variantMeta.variant;
  const parentMeta = buildAreaTreatmentMeta(area, treatment);

  // 변형별 콘텐츠 선택
  const renderVariantContent = () => {
    if (v.slug === 'cost') {
      return (
        <>
          {/* 가격표 강조 페이지 */}
          {pricingData && (
            <section class="sec">
              <div class="wrap-n">
                <div class="sec-head" data-rv>
                  <p class="eyebrow">Pricing</p>
                  <h2 class="display-2">{area.name} {treatment.name} 가격표 (2026년 기준)</h2>
                  <p class="lead">투명한 정찰가, 추가비용 없음</p>
                </div>
                <div class="table-wrap" data-rv>
                  <table class="cmp-table wrap-th">
                    <thead>
                      <tr><th scope="col">진료 항목</th><th scope="col" style="text-align:right">{area.name} 가격</th><th scope="col">비고</th></tr>
                    </thead>
                    <tbody>
                      {pricingData.rows.map(row => (
                        <tr>
                          <th scope="row">{row.item}</th>
                          <td class="num" style="text-align:right;font-weight:700;color:var(--blue);white-space:nowrap">{row.price}</td>
                          <td>{row.note || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {pricingData.insurance && (
                  <div class="notice-box care" data-rv><strong>건강보험 안내:</strong> {pricingData.insurance}</div>
                )}
                <div class="notice-box warn" data-rv>
                  <strong>주의:</strong> {area.name} {treatment.name} 비용은 환자 상태에 따라 달라질 수 있습니다.
                  정확한 견적은 무료 진단 후 안내드립니다. 추가비용은 미리 모두 설명드린 후 진행됩니다.
                </div>
              </div>
            </section>
          )}
        </>
      );
    }
    if (v.slug === 'event') {
      return (
        <section class="sec">
          <div class="wrap-n">
            <div class="sec-head" data-rv>
              <p class="eyebrow">Event</p>
              <h2 class="display-2">{area.name} {treatment.name} 진행 중 이벤트</h2>
              <p class="lead">한정 수량 · 예약 선착순</p>
            </div>
            <div class="ev-list" data-rv-group>
              {(pricingData?.rows || []).slice(0, 3).map((row) => (
                <div class="card ev-card">
                  <span class="mark" aria-hidden="true"><Icon name="sun" /></span>
                  <div class="body">
                    <span class="tag">{area.name} 한정 이벤트</span>
                    <h3>{row.item}</h3>
                    <p>{row.note || ''}</p>
                  </div>
                  <p class="price">{row.price}<small>이벤트가</small></p>
                </div>
              ))}
            </div>
            <p class="notice" style="text-align:center;margin-top:1.6rem" data-rv>
              ※ 이벤트는 상황에 따라 변동될 수 있습니다. 정확한 진행 여부는 ☎ 032-432-0365 또는 카카오 상담으로 확인하세요.
            </p>
          </div>
        </section>
      );
    }
    if (v.slug === 'night') {
      return (
        <section class="sec">
          <div class="wrap-n">
            <div class="sec-head" data-rv>
              <p class="eyebrow">Night</p>
              <h2 class="display-2">{area.name} {treatment.name} 야간진료 안내</h2>
              <p class="lead">평일 21시 · 일요일·공휴일 진료</p>
            </div>
            <div class="night-grid" data-rv-group>
              <div class="card stat"><p class="v">21<small>시</small></p><p class="d">월~목 야간</p></div>
              <div class="card stat"><p class="v">19<small>시</small></p><p class="d">금요일</p></div>
              <div class="card stat"><p class="v">14<small>시</small></p><p class="d">토요일</p></div>
              <div class="card stat"><p class="v">18<small>시</small></p><p class="d">일·공휴일</p></div>
            </div>
            <p class="lead" style="margin:1.8rem auto 0;text-align:center" data-rv>
              {area.name} 거주 직장인·학생을 위해 365일 진료합니다. 퇴근 후·주말에도 부담 없이 {treatment.name} 치료받으세요.
            </p>
          </div>
        </section>
      );
    }
    // recommend, best — 동일한 풀 본문 사용
    return (
      <section class="sec">
        <div class="wrap-n">
          <div class="sec-head" data-rv>
            <p class="eyebrow">{v.name}</p>
            <h2 class="display-2">{area.name} {treatment.name} {v.heading}</h2>
          </div>
          <div class="prose-sec" data-rv>
            {matrixContent.introParagraphs.map(p => <p>{p}</p>)}
          </div>
          <div class="why-grid" data-rv-group>
            {matrixContent.whyChoosePoints.slice(0, 6).map((p, idx) => (
              <div class="why-item">
                <span class="n mono">{String(idx + 1).padStart(2, '0')}</span>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  return c.render(
    <>
      {/* Hero */}
      <section class="phead" aria-labelledby="var-h1">
        <div class="wrap phead-in">
          <div class="phead-text">
            <nav class="crumb" aria-label="현재 위치">
              <ol>
                <li><a href="/">홈</a></li>
                <li><a href="/area">지역</a></li>
                <li><a href={`/area/${area.slug}`}>{area.slug === 'guwol-dong' ? '구월동 치과' : area.name}</a></li>
                <li><a href={`/area/${area.slug}/${treatment.slug}`}>{treatment.name}</a></li>
                <li aria-current="page">{v.name}</li>
              </ol>
            </nav>
            <p class="eyebrow">{area.name} · {treatment.name} · {v.name}</p>
            <h1 id="var-h1" class="display-xl">{area.name} {treatment.name} {v.heading}</h1>
            <p class="lead hero-sub">서울365치과 · {area.distKm === 0 ? '도보 3분' : `${area.travelMin}분`} · 서울대 전문의 5인 협진</p>
            {area.slug !== 'guwol-dong' && (
              <p class="phead-note">병원 위치·주차·진료시간: <HubA cls="cta-link" /></p>
            )}
            <div class="phead-cta">
              <a href="/reservation" class="btn btn-primary"><Icon name="calendar" />무료 상담</a>
              <a href={CLINIC.phoneTel} class="btn btn-light mono"><Icon name="phone" />{CLINIC.phone}</a>
            </div>
          </div>
          <div class="phead-aside">
            <div class="fact-card">
              <p class="eyebrow">{area.name}에서</p>
              <dl class="fact-rows">
                <div><dt>직선 거리</dt><dd class="mono">{area.distKm === 0 ? '원내' : `${area.distKm}km`}</dd></div>
                <div><dt>소요 시간</dt><dd class="mono">{area.distKm === 0 ? '도보 3분' : `약 ${area.travelMin}분`}</dd></div>
                <div><dt>진료</dt><dd>{treatment.name}</dd></div>
                <div><dt>주제</dt><dd>{v.heading}</dd></div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* 변형별 콘텐츠 */}
      {renderVariantContent()}

      {/* 다른 변형 / 부모 매트릭스로 돌아가기 */}
      <section class="sec" style="padding-top:0">
        <div class="wrap">
          <div class="sec-head" data-rv>
            <p class="eyebrow">More</p>
            <h3 class="display-2">{area.name} {treatment.name} 다른 정보 보기</h3>
          </div>
          <ul class="tx-tiles" data-rv-group>
            <li>
              <a href={`/area/${area.slug}/${treatment.slug}`} class="tx-tile">
                <span class="tx-tile-name">전체 안내</span>
                <span class="tx-tile-desc">{area.name} {treatment.name}</span>
                <Icon name="arrowUpRight" />
              </a>
            </li>
            {MATRIX_VARIANTS.filter(o => o.slug !== v.slug).slice(0, 5).map(o => (
              <li>
                <a href={`/area/${area.slug}/${treatment.slug}/${o.slug}`} class="tx-tile">
                  <span class="tx-tile-name">{o.name}</span>
                  <span class="tx-tile-desc">{o.heading}</span>
                  <Icon name="arrowUpRight" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Final CTA */}
      <section class="cta-band" aria-label="상담 안내">
        <div class="wrap-n" style="text-align:center;position:relative">
          <p class="eyebrow eyebrow-light no-bar" style="justify-content:center" data-rv>Consultation</p>
          <h2 class="display-xl" data-rv>{area.name} {treatment.name} 상담 받기</h2>
          <div class="cta-actions" style="margin-top:2rem" data-rv-group>
            <a href="/reservation" class="btn btn-primary btn-lg"><Icon name="calendar" />예약하기</a>
            <a href={CLINIC.phoneTel} class="btn btn-white btn-lg mono"><Icon name="phone" />{CLINIC.phone}</a>
          </div>
        </div>
      </section>
    </>,
    {
      title: variantMeta.seoTitle,
      description: variantMeta.seoDesc,
      canonical: variantMeta.canonical,
      keywords: [...variantMeta.keywords, ...parentMeta.keywords].slice(0, 30).join(', '),
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "홈", "item": "https://seoul365dc.kr" },
            { "@type": "ListItem", "position": 2, "name": "지역", "item": "https://seoul365dc.kr/area" },
            { "@type": "ListItem", "position": 3, "name": `${area.name}치과`, "item": `https://seoul365dc.kr/area/${area.slug}` },
            { "@type": "ListItem", "position": 4, "name": `${area.name} ${treatment.name}`, "item": `https://seoul365dc.kr/area/${area.slug}/${treatment.slug}` },
            { "@type": "ListItem", "position": 5, "name": v.name, "item": variantMeta.url },
          ],
        },
        {
          "@context": "https://schema.org",
          "@type": "MedicalWebPage",
          "name": variantMeta.seoTitle,
          "description": variantMeta.seoDesc,
          "url": variantMeta.url,
          "inLanguage": "ko-KR",
          "about": { "@type": "MedicalCondition", "name": `${treatment.name} ${v.name}` },
          "lastReviewed": CONTENT_DATES.area,
        },
      ],
    }
  );
})

// ── 개별 동 페이지 (/area/:slug) ──
// ── 대표 지역 키워드 허브 렌더 (2026-10-08) — /area/guwol-dong("구월동 치과"), /area/namdong-gu("인천 남동구 치과") ──
function renderAreaHub(c: any, hub: AreaHub) {
  const pageUrl = `https://seoul365dc.kr/area/${hub.slug}`;
  const guAreas = getAreasSorted().filter(a => a.gu === '남동구');
  const hubArea = getAreaBySlug(hub.slug);
  const nearby = getAreasSorted().filter(a => a.slug !== hub.slug).slice(0, 8);
  const mapQuery = encodeURIComponent(CLINIC.address);

  const renderBlock = (block?: HubSection['block']) => {
    if (block === 'hours') return (
      <div class="table-wrap" style="max-width:520px;margin:1rem 0 1.4rem">
        <table class="cmp-table wrap-th" style="min-width:0">
          <caption class="sr-only">서울365치과 진료시간</caption>
          <tbody>
            {HOURS.map(h => (
              <tr>
                <th scope="row" style="width:7rem">{h.day}</th>
                <td class="num">{h.time}{h.note ? <span class="tbl-note">{h.note}</span> : null}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
    if (block === 'doctors') return (
      <ul class="dr-list">
        {doctors.map(d => (
          <li>
            <a href={`/doctors/${d.slug}`} class="card dr-row hover">
              <b>{d.name} {d.titleShort}</b>
              <span>{d.metaDesc.replace(/^서울365치과\s*\S+\s*\S*원장\.\s*/, '')}</span>
              <Icon name="arrow" />
            </a>
          </li>
        ))}
      </ul>
    );
    if (block === 'gu-areas') return (
      <div class="table-wrap" style="margin:1rem 0 1.4rem">
        <table class="cmp-table wrap-th">
          <caption class="sr-only">인천 남동구 동별 서울365치과까지 거리·소요시간</caption>
          <thead>
            <tr><th scope="col">동</th><th scope="col" style="text-align:right">직선거리</th><th scope="col" style="text-align:right">소요시간</th><th scope="col">이동 방법</th></tr>
          </thead>
          <tbody>
            {guAreas.map(a => (
              <tr>
                <th scope="row">{a.slug === 'guwol-dong' ? a.name : <a href={`/area/${a.slug}`}>{a.name}</a>}</th>
                <td class="num" style="text-align:right;white-space:nowrap">{a.distKm === 0 ? '—' : `${a.distKm}km`}</td>
                <td class="num" style="text-align:right;white-space:nowrap">{a.distKm === 0 ? '도보 3분' : `약 ${a.travelMin}분`}</td>
                <td>{a.travelDesc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
    if (block === 'map') return (
      <div class="map-links" style="justify-content:flex-start;margin:1rem 0 1.4rem">
        <a href={`https://map.naver.com/p/search/${mapQuery}`} target="_blank" rel="noopener" class="btn btn-ghost btn-sm"><NaverMark size={13} />네이버 지도</a>
        <a href={`https://map.kakao.com/link/search/${mapQuery}`} target="_blank" rel="noopener" class="btn btn-ghost btn-sm"><Icon name="pin" />카카오맵</a>
        <a href={`https://www.google.com/maps/search/?api=1&query=${CLINIC.geo.lat},${CLINIC.geo.lng}`} target="_blank" rel="noopener" class="btn btn-ghost btn-sm"><Icon name="map" />구글 지도</a>
      </div>
    );
    return null;
  };

  return c.render(
    <>
      {/* Hero */}
      <section class="phead" aria-labelledby="hub-h1">
        <div class="wrap phead-in">
          <div class="phead-text">
            <nav aria-label="브레드크럼" class="crumb">
              <ol>
                <li><a href="/">홈</a></li>
                <li><a href="/area">지역 안내</a></li>
                <li aria-current="page">{hub.breadcrumbName}</li>
              </ol>
            </nav>
            <p class="eyebrow">{hub.level === 'gu' ? '인천 남동구' : '인천 남동구 구월동'}</p>
            <h1 id="hub-h1" class="display-xl">{hub.h1}</h1>
            <p id="hub-answer" class="lead hero-sub">{hub.answer}</p>
            <div class="phead-cta">
              <a href="/reservation" class="btn btn-primary"><Icon name="calendar" />상담 예약</a>
              <a href={CLINIC.phoneTel} class="btn btn-light mono"><Icon name="phone" />{CLINIC.phone}</a>
              <a href={CLINIC.naverBooking} target="_blank" rel="noopener" class="btn btn-naver"><NaverMark size={15} />네이버 예약</a>
            </div>
          </div>
          <div class="phead-aside">
            {/* 핵심 정보 요약 */}
            <div class="fact-card">
              <p class="eyebrow">핵심 정보</p>
              <dl class="fact-rows stack">
                <div><dt>주소</dt><dd>{CLINIC.address} (우 {CLINIC.postalCode})</dd></div>
                <div><dt>가까운 역</dt><dd>인천 1호선 예술회관역 5번 출구 약 250m</dd></div>
                <div><dt>평일 야간</dt><dd class="mono">월~목 10:00~21:00</dd></div>
                <div><dt>주말·공휴일</dt><dd class="mono">토 10:00~14:00 · 일·공휴일 14:00~18:00</dd></div>
                <div><dt>전화</dt><dd class="mono"><a href={CLINIC.phoneTel}>{CLINIC.phone}</a></dd></div>
                <div><dt>주차</dt><dd>이토타워 건물 내 주차장</dd></div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* 구월동 진료 안내 사진 카드 (2026-10-14) — 구월동 허브만, ItemList 와 1:1 */}
      {hub.slug === 'guwol-dong' && (
        <section class="sec" style="padding-bottom:0">
          <div class="wrap">
            <style dangerouslySetInnerHTML={{ __html: GUWOL_CARD_CSS }} />
            <div class="sec-head" data-rv>
              <p class="eyebrow">Guwol-dong</p>
              <h2 class="display-2">구월동 진료 안내</h2>
              <p class="lead">구월동에서 많이 찾으시는 진료 여섯 가지를 사진과 함께 정리했습니다.</p>
            </div>
            <GuwolCardGrid idPrefix="hub" />
          </div>
        </section>
      )}

      {/* 본문 */}
      <article class="sec">
        <div class="wrap-n">
          {hub.sections.map(s => (
            <section class="prose-sec" data-rv>
              <h2>{s.h}</h2>
              {(s.p || []).map(p => <p>{p}</p>)}
              {s.ul && <ul>{s.ul.map(li => <li>{li}</li>)}</ul>}
              {renderBlock(s.block)}
              {s.links && (
                <div class="tx-all" style="margin-top:.6rem">
                  {s.links.map(l => <a href={l.href}>{l.label}</a>)}
                </div>
              )}
            </section>
          ))}

          {/* FAQ — 화면과 FAQPage 스키마가 같은 배열 */}
          <section aria-labelledby="hub-faq-heading" class="prose-sec" data-rv>
            <h2 id="hub-faq-heading">{hub.keyword} 자주 묻는 질문</h2>
            {hub.faq.map(f => (
              <details class="fq" open>
                <summary><h3>{f.q}</h3><span class="pm" aria-hidden="true"><Icon name="plus" /></span></summary>
                <div class="fq-a"><p>{f.a}</p></div>
              </details>
            ))}
          </section>

          <p class="meta-line">최종 수정 <time datetime={hub.updated}>{hub.updated}</time> · 진료시간·주차 지원은 병원 사정으로 바뀔 수 있으니 방문 전 전화로 확인해 주세요.</p>
        </div>
      </article>

      {/* 구월동 × 진료 (구월동 허브만) */}
      {hubArea && (
        <section class="sec" style="padding-top:0">
          <div class="wrap">
            <div class="sec-head" data-rv>
              <p class="eyebrow">By treatment</p>
              <h2 class="display-2">{hubArea.name} 진료별 안내</h2>
            </div>
            <ul class="tx-tiles" data-rv-group>
              {MATRIX_TREATMENT_SLUGS.map(tSlug => {
                const info = MATRIX_TREATMENT_INFO[tSlug];
                return (
                  <li>
                    <a href={`/area/${hubArea.slug}/${tSlug}`} class="tx-tile" title={`${hubArea.name} ${info.name}`}>
                      <span class="tx-tile-name">{hubArea.name} {info.name}</span>
                      <span class="tx-tile-desc">{info.tagline}</span>
                      <Icon name="arrowUpRight" />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      )}

      {/* 인근 지역 */}
      <section class="sec" style="padding-top:0">
        <div class="wrap-n">
          <div class="sec-head" data-rv>
            <p class="eyebrow">Nearby</p>
            <h2 class="display-2">{hub.level === 'gu' ? '다른 인천 지역에서 오시는 길' : '구월동 주변 지역에서 오시는 길'}</h2>
          </div>
          <div class="area-chips" data-rv>
            {(hub.level === 'gu' ? getAreasSorted().filter(a => a.gu !== '남동구') : nearby).map(n => (
              <a href={`/area/${n.slug}`}>{n.gu} {n.name}<small>{n.distKm}km</small></a>
            ))}
            {hub.slug !== 'namdong-gu' && (
              <a href="/area/namdong-gu" class="hub">인천 남동구 치과</a>
            )}
          </div>
        </div>
      </section>
    </>,
    {
      title: hub.title,
      description: hub.description,
      canonical: pageUrl,
      dateModified: hub.updated,
      keywords: `${hub.keyword}, ${hub.keyword.replace(/ /g, '')}, ${hub.level === 'dong' ? '구월동 임플란트, 예술회관역 치과, 인천 구월동 치과' : '남동구 치과, 남동구 임플란트, 남동구 야간치과'}`,
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "홈", "item": "https://seoul365dc.kr" },
            { "@type": "ListItem", "position": 2, "name": "지역 안내", "item": "https://seoul365dc.kr/area" },
            { "@type": "ListItem", "position": 3, "name": hub.breadcrumbName, "item": pageUrl },
          ],
        },
        {
          "@context": "https://schema.org",
          "@type": ["WebPage", "MedicalWebPage"],
          "@id": `${pageUrl}#webpage`,
          "name": hub.title,
          "description": hub.description,
          "url": pageUrl,
          "inLanguage": "ko-KR",
          "isPartOf": { "@id": "https://seoul365dc.kr/#website" },
          "about": {
            "@id": "https://seoul365dc.kr/#dentist",
            "areaServed": hub.areaServed.map(name => ({ "@type": "AdministrativeArea", "name": name })),
          },
          "specialty": "Dentistry",
          "dateModified": hub.updated,
          "speakable": { "@type": "SpeakableSpecification", "cssSelector": ["h1", "#hub-answer"] },
        },
        {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "@id": `${pageUrl}#faq`,
          "mainEntity": hub.faq.map(f => ({
            "@type": "Question",
            "name": f.q,
            "acceptedAnswer": { "@type": "Answer", "text": f.a },
          })),
        },
        ...(hub.slug === 'guwol-dong' ? [guwolCardItemList(pageUrl)] : []),
      ],
    }
  );
}

areaRoutes.get('/area/:slug', (c) => {
  const slug = c.req.param('slug');
  // 대표 키워드 허브(구월동 치과·인천 남동구 치과) — 2026-10-08
  const hub = AREA_HUBS[slug];
  if (hub) return renderAreaHub(c, hub);
  const area = getAreaBySlug(slug);

  if (!area) {
    // soft 404 방지 (2026-10-08): 없는 지역은 HTTP 404 + noindex (기존: 200 + index + canonical 홈)
    c.status(404);
    c.header('X-Robots-Tag', 'noindex');
    return c.render(
      <section class="phead" style="min-height:70vh;display:flex;align-items:center">
        <div class="wrap phead-in" style="grid-template-columns:1fr;text-align:center">
          <div class="phead-text">
            <h1 class="display-xl">지역 정보를 찾을 수 없습니다</h1>
            <p class="lead" style="margin-inline:auto">요청하신 지역 페이지가 존재하지 않습니다.</p>
            <div class="phead-cta" style="justify-content:center"><a href="/area" class="btn btn-primary">지역 목록 보기</a></div>
          </div>
        </div>
      </section>,
      { title: '404 - 지역을 찾을 수 없습니다 | 서울365치과', noindex: true }
    );
  }

  // 인근 동 추천 (같은 구 우선, 거리순)
  const nearby = getAreasSorted()
    .filter(a => a.slug !== slug && a.slug !== 'guwol-dong') // 구월동 = 허브(푸터·상단 링크로 연결, 페이지당 최대 2개)
    .slice(0, 6);

  // 추천 진료 매핑
  const treatmentMap: Record<string, string> = {
    '임플란트': 'implant',
    '전체임플란트': 'full-implant',
    '인비절라인': 'invisalign',
    '교정': 'orthodontics',
    '수면진료': 'sedation',
    '심미치료': 'cosmetic',
    '소아치과': 'pediatric',
    '충치치료': 'general',
    '신경치료': 'general',
    '라미네이트': 'cosmetic',
    '치아미백': 'whitening',
  };

  const recTreatments = area.recommendTreatments
    .map(name => {
      const slug = treatmentMap[name];
      const t = treatments.find(t => t.slug === slug);
      return t ? { name, slug: t.slug, shortDesc: t.shortDesc, icon: t.icon } : null;
    })
    .filter(Boolean);

  // FAQ 데이터 (동별 맞춤)
  const areaFaq = [
    {
      q: `${area.name}에서 서울365치과까지 얼마나 걸리나요?`,
      a: `${area.name}에서 서울365치과까지 ${area.distKm === 0 ? '도보 3분 거리' : `약 ${area.travelMin}분`}이면 도착합니다. ${area.travelDesc}. 예술회관역 5번 출구에서 도보 3분 거리에 위치해 있습니다.`,
    },
    {
      q: `서울365치과는 ${area.name} 주민도 많이 오나요?`,
      a: `네, ${area.gu} ${area.name}을 포함해 인천 남동구, 미추홀구, 연수구, 부평구 등 다양한 지역에서 내원하고 계십니다. 365일 야간21시까지 진료하므로 퇴근 후나 주말에도 편하게 방문하실 수 있습니다.`,
    },
    {
      q: `야간이나 주말에도 진료하나요?`,
      a: `네. 서울365치과는 365일 진료합니다. 월~목 21시까지 야간 진료, 토요일 10~14시, 일요일·공휴일 14~18시 진료합니다. ${area.name}에서 퇴근 후 방문하셔도 충분합니다.`,
    },
    {
      q: `주차가 가능한가요?`,
      a: `네, 이토타워 건물 내 지하주차장을 이용하실 수 있습니다. ${area.name}에서 자가용으로 오시는 분들도 편하게 주차 가능합니다.`,
    },
    {
      q: `${area.name}에서 임플란트 비용이 궁금합니다.`,
      a: `임플란트 비용은 사용 재료(오스템, 스트라우만, 메가젠 등)와 환자분의 상태에 따라 달라집니다. 서울365치과는 자체 기공실 보유로 합리적인 가격을 제공하며, CT 촬영 후 정확한 상담을 받으실 수 있습니다. ☎ 032-432-0365`,
    },
  ];

  const canonicalUrl = `https://seoul365dc.kr/area/${area.slug}`;
  const dist = area.distKm === 0 ? '도보 3분' : `약 ${area.travelMin}분`;

  return c.render(
    <div itemscope itemtype="https://schema.org/WebPage">
      {/* Hero Section */}
      <section class="phead" aria-labelledby="area-h1">
        <div class="wrap phead-in">
          <div class="phead-text">
            <nav class="crumb" aria-label="현재 위치"><ol><li><a href="/">홈</a></li><li><a href="/area">지역 안내</a></li><li aria-current="page">{area.gu} {area.name}</li></ol></nav>
            <p class="eyebrow">{area.gu} · {area.name}{area.distKm > 0 ? ` · ${area.distKm}km` : ''}</p>
            <h1 id="area-h1" class="display-xl" itemprop="name"><span class="block">{area.name}치과 추천</span>{' '}<span class="block h1-sub">서울365치과</span></h1>
            <p class="lead hero-sub" itemprop="description">
              {area.travelDesc}{area.distKm > 0 && ` · 약 ${area.travelMin}분`}<br/>
              서울대 출신 5인 원장 · 365일 야간21시 · 자체 기공실
            </p>
            {/* 허브 링크 (2026-10-08): 남동구 동 → "인천 남동구 치과", 그 외 → "구월동 치과" */}
            <p class="phead-note">
              {area.gu === '남동구'
                ? <>남동구 동별 거리·교통편과 진료시간은 <HubA hub={HUB_NAMDONG} cls="cta-link" /> 안내에 정리돼 있습니다.</>
                : <>서울365치과 위치·진료시간·의료진 전체 안내: <HubA cls="cta-link" /></>}
            </p>
            <div class="phead-cta">
              <a href="/reservation" class="btn btn-primary"><Icon name="calendar" />무료 상담 예약</a>
              <a href={CLINIC.phoneTel} class="btn btn-light mono"><Icon name="phone" />{CLINIC.phone}</a>
            </div>
          </div>
          <div class="phead-aside">
            <div class="fact-card">
              <p class="eyebrow">{area.name}에서</p>
              <dl class="fact-rows">
                <div><dt>직선 거리</dt><dd class="mono">{area.distKm === 0 ? '원내' : `${area.distKm}km`}</dd></div>
                <div><dt>소요 시간</dt><dd class="mono">{dist}</dd></div>
                <div><dt>가까운 역</dt><dd>예술회관역 5번 출구</dd></div>
                <div><dt>주차</dt><dd>이토타워 지하주차장</dd></div>
                <div><dt>야간 진료</dt><dd class="mono">월–목 21:00</dd></div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* 거리 & 교통 안내 */}
      <section class="sec">
        <div class="wrap-n">
          <div class="sec-head" data-rv>
            <p class="eyebrow">Access</p>
            <h2 class="display-2">{area.name}에서 서울365치과까지</h2>
          </div>
          <div class="stat-row" data-rv-group>
            <div class="card stat"><p class="k">거리</p><p class="v">{area.distKm === 0 ? '0' : area.distKm}<small>km</small></p><p class="d">직선 거리</p></div>
            <div class="card stat"><p class="k">소요 시간</p><p class="v">{area.distKm === 0 ? '3' : area.travelMin}<small>분</small></p><p class="d">{area.distKm === 0 ? '도보 소요시간' : '대중교통 기준'}</p></div>
            <div class="card stat"><p class="k">지하철</p><p class="v txt">예술회관역</p><p class="d">5번 출구 도보 3분</p></div>
          </div>

          {/* 상세 교통 */}
          <h3 class="box-h" style="margin:2.2rem 0 .8rem" data-rv>{area.name}에서 오시는 길</h3>
          <div class="dir-grid" data-rv-group>
            <div class="card dir-card">
              <span class="tag">대중교통</span>
              <p>{area.travelDesc}</p>
              <p class="fine">인천 1호선 예술회관역 5번 출구 → 도보 3분 → 이토타워 2층</p>
            </div>
            <div class="card dir-card">
              <span class="tag">자가용</span>
              <p>이토타워 지하주차장 이용 가능</p>
              <p class="fine">{CLINIC.address} (우편번호 {CLINIC.postalCode})</p>
            </div>
          </div>

          {/* 주변 랜드마크 */}
          <div class="lm-row" data-rv>
            {area.landmarks.map(l => <span>{l}</span>)}
          </div>
        </div>
      </section>

      {/* 왜 서울365치과인가 */}
      <section class="sec" style="padding-top:0">
        <div class="wrap">
          <div class="sec-head" data-rv>
            <p class="eyebrow">Why Seoul 365</p>
            <h2 class="display-2">{area.name} 주민이 서울365치과를 선택하는 이유</h2>
          </div>
          <div class="why-grid" data-rv-group>
            {DIFF_CARDS.slice(0, 6).map((card, i) => (
              <div class="why-item">
                <span class="n mono">{String(i + 1).padStart(2, '0')}</span>
                <h3>{card.title}</h3>
                <p>{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 추천 진료 */}
      <section class="sec" style="padding-top:0">
        <div class="wrap">
          <div class="sec-head" data-rv>
            <p class="eyebrow">Recommended</p>
            <h2 class="display-2">{area.name} 주민 추천 진료</h2>
            <p class="lead">{area.population}</p>
          </div>
          <div class="rec-grid" data-rv-group>
            {recTreatments.map((t: any) => (
              <a href={`/area/${area.slug}/${t.slug}`} class="card rec-card hover" title={`${area.name} ${t.name}`}>
                <h3>{area.name} {t.name}</h3>
                <p>{t.shortDesc}</p>
                <span class="arrow-link">{area.name} {t.name} 안내<Icon name="arrow" /></span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 🎯 SEO 매트릭스 — {area.name}의 모든 진료 */}
      <section class="sec" style="padding-top:0">
        <div class="wrap">
          <div class="sec-head" data-rv>
            <p class="eyebrow">All treatments</p>
            <h2 class="display-2">{area.name}에서 가능한 진료 한눈에</h2>
            <p class="lead">{area.name}에서 {area.distKm === 0 ? '도보 3분' : `${area.travelMin}분`} 거리 · 모든 진료 가능</p>
          </div>
          <ul class="tx-tiles" data-rv-group>
            {MATRIX_TREATMENT_SLUGS.map(tSlug => {
              const info = MATRIX_TREATMENT_INFO[tSlug];
              return (
                <li>
                  <a href={`/area/${area.slug}/${tSlug}`} class="tx-tile" title={`${area.name} ${info.name}`}>
                    <span class="tx-tile-name">{area.name} {info.name}</span>
                    <span class="tx-tile-desc">{info.tagline}</span>
                    <Icon name="arrowUpRight" />
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* 진료시간 */}
      <section class="hours-band">
        <div class="wrap-n">
          <div class="sec-head center" data-rv>
            <p class="eyebrow eyebrow-light">Hours</p>
            <h2 class="display-2">365일 · 야간 21시</h2>
            <p class="lead">{area.name}에서 퇴근 후에도 충분히 방문 가능합니다</p>
          </div>
          <table class="hours-table" data-rv>
            <caption class="sr-only">서울365치과 진료시간</caption>
            <tbody>
              {HOURS.map(h => (
                <tr><th scope="row">{h.day}</th><td>{h.time}{h.note && <span class="note">{h.note}</span>}</td></tr>
              ))}
            </tbody>
          </table>
          <p class="open-note" data-rv>점심시간 없이 연속 진료</p>
        </div>
      </section>

      {/* 의료진 소개 */}
      <section class="sec">
        <div class="wrap">
          <div class="sec-head" data-rv>
            <p class="eyebrow">Doctors</p>
            <h2 class="display-2">서울대 출신 5인 전문의</h2>
          </div>
          <div class="dr-mini" data-rv-group>
            {doctors.slice(0, 5).map(doc => (
              <a href={`/doctors/${doc.slug}`}>
                <div class="ph">
                  <img src={doc.photo} alt={`${doc.name} ${doc.title}`} width="797" height="1024" loading="lazy" decoding="async" onerror={`this.src='${doc.photoFallback}'`} />
                </div>
                <h3>{doc.name}</h3>
                <small>{doc.titleShort}</small>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section class="sec" style="padding-top:0">
        <div class="wrap-n">
          <div class="sec-head" data-rv>
            <p class="eyebrow">FAQ</p>
            <h2 class="display-2">{area.name} 주민 자주 묻는 질문</h2>
          </div>
          <div itemscope itemtype="https://schema.org/FAQPage" data-rv-group>
            {areaFaq.map((faq, i) => (
              <details class="fq" open={i === 0 ? true : undefined} itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
                <summary><h3 itemprop="name">{faq.q}</h3><span class="pm" aria-hidden="true"><Icon name="plus" /></span></summary>
                <div class="fq-a" itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
                  <p itemprop="text">{faq.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 인근 지역 */}
      <section class="sec" style="padding-top:0">
        <div class="wrap-n">
          <div class="sec-head" data-rv>
            <p class="eyebrow">Nearby</p>
            <h2 class="display-2">인근 지역 안내</h2>
          </div>
          <div class="area-chips" data-rv>
            {nearby.map(n => (
              <a href={`/area/${n.slug}`}>{n.name}<small>{n.distKm}km · {n.travelMin}분</small></a>
            ))}
          </div>
          <p style="margin-top:1.4rem" data-rv><a href="/area" class="arrow-link">전체 지역 보기<Icon name="arrow" /></a></p>
        </div>
      </section>

      {/* Final CTA */}
      <section class="cta-band" aria-label="상담 안내">
        <div class="wrap-n" style="text-align:center;position:relative">
          <p class="eyebrow eyebrow-light no-bar" style="justify-content:center" data-rv>Consultation</p>
          <h2 class="display-xl" data-rv>{area.name}에서 가까운 서울365치과</h2>
          <p class="lead" data-rv>서울대 5인 원장 · 365일 야간21시 · 자체 기공실<br/>{area.travelDesc}</p>
          <div class="cta-actions" data-rv-group>
            <a href="/reservation" class="btn btn-primary btn-lg"><Icon name="calendar" />무료 상담 예약</a>
            <a href={CLINIC.phoneTel} class="btn btn-white btn-lg mono"><Icon name="phone" />{CLINIC.phone}</a>
            <a href={CLINIC.kakao} target="_blank" rel="noopener noreferrer" class="btn btn-kakao btn-lg"><KakaoMark size={18} />카카오 상담</a>
          </div>
        </div>
      </section>
    </div>,
    {
      title: area.seoTitle,
      description: area.seoDesc,
      canonical: canonicalUrl,
      jsonLd: [
        // Breadcrumb
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "홈", "item": "https://seoul365dc.kr" },
            { "@type": "ListItem", "position": 2, "name": "지역 안내", "item": "https://seoul365dc.kr/area" },
            { "@type": "ListItem", "position": 3, "name": `${area.name}치과`, "item": canonicalUrl },
          ],
        },
        // @id 없는 중복 Dentist 노드 제거 — 병원 엔티티는 전역 #dentist 하나 (2026-09-29)
        // FAQPage
        {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": areaFaq.map(faq => ({
            "@type": "Question",
            "name": faq.q,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": faq.a,
            },
          })),
        },
        // WebPage
        {
          "@context": "https://schema.org",
          "@type": "MedicalWebPage",
          "name": area.seoTitle,
          "description": area.seoDesc,
          "url": canonicalUrl,
          "inLanguage": "ko-KR",
          "isPartOf": { "@id": "https://seoul365dc.kr/#website" },
          "about": {
            "@type": "MedicalCondition",
            "name": "치과 진료",
            "associatedAnatomy": { "@type": "AnatomicalStructure", "name": "치아" },
          },
          "specialty": {
            "@type": "MedicalSpecialty",
            "name": "Dentistry",
          },
          "lastReviewed": CONTENT_DATES.area,
        },
      ],
    }
  )
})

export default areaRoutes
