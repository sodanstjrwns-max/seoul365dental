// ============================================================
// 🎯 v3 SUPER UPGRADE — Station/Landmark Pages
// "예술회관역 임플란트", "인천시청 치과" 등 역세권 키워드 타겟
// ============================================================
import { Hono } from 'hono'
import type { Bindings } from '../lib/types'
import { AGENCY_HUB_PUBLISHED } from '../lib/column-seo'
import { STATIONS, getStationBySlug, type StationInfo } from '../data/stations'
import { MATRIX_TREATMENT_INFO, TREATMENT_PRICING } from '../data/area-treatment'
import { CLINIC } from '../data/clinic'
import { Icon } from '../lib/icons'

const stationsRoutes = new Hono<{ Bindings: Bindings }>()

// 인덱스: /stations
stationsRoutes.get('/stations', (c) => {
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "홈", "item": "https://seoul365dc.kr" },
      { "@type": "ListItem", "position": 2, "name": "역·랜드마크 안내", "item": "https://seoul365dc.kr/stations" },
    ]
  };

  return c.render(
    <>
      <section class="phead" aria-labelledby="stations-h1">
        <div class="wrap phead-in">
          <div class="phead-text">
            <nav class="crumb" aria-label="현재 위치"><ol><li><a href="/">홈</a></li><li aria-current="page">역·랜드마크 안내</li></ol></nav>
            <p class="eyebrow">STATIONS & LANDMARKS</p>
            <h1 id="stations-h1" class="display-xl hubx-h1">
              지하철역·랜드마크별 길안내
            </h1>
            <p class="lead hero-sub">
              예술회관역에서 도보 3분 — 인천 주요 역·랜드마크에서 서울365치과까지 안내
            </p>
            <div class="phead-cta">
              <a href="/reservation" class="btn btn-primary"><Icon name="calendar" />상담 예약</a>
              <a href={CLINIC.phoneTel} class="btn btn-light mono"><Icon name="phone" />{CLINIC.phone}</a>
            </div>
          </div>
          <div class="phead-aside">
            <div class="fact-card">
              <p class="eyebrow">{CLINIC.name}</p>
              <dl class="fact-rows stack">
                <div><dt>주소</dt><dd>{CLINIC.address}</dd></div>
                <div><dt>가까운 역</dt><dd>{CLINIC.nearStation}</dd></div>
                <div><dt>전화</dt><dd class="mono"><a href={CLINIC.phoneTel}>{CLINIC.phone}</a></dd></div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      <section class="sec">
        <div class="wrap">
          <div class="hubx-grid three" data-rv-group>
            {STATIONS.map(st => (
              <a href={`/stations/${st.slug}`} class="card hubx-card hover">
                <span class="stn-top">
                  <span class="tag">{st.line}</span>
                  <span class="stn-min">{st.travelMin}<small>분</small></span>
                </span>
                <h2>{st.name}</h2>
                <p>
                  서울365치과까지 {st.travelDesc} ({st.travelMin}분)
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>,
    {
      title: '지하철역·랜드마크별 길안내 | 서울365치과',
      description: '예술회관역 6번 출구 맞은편. 인천시청역, 간석오거리역, 인천종합터미널, 롯데백화점 등 주요 역·랜드마크에서 서울365치과까지의 길안내.',
      canonical: 'https://seoul365dc.kr/stations',
      keywords: STATIONS.flatMap(s => s.keywords).join(', '),
      jsonLd: [breadcrumb],
    }
  );
});

// 역별 페이지: /stations/:slug
stationsRoutes.get('/stations/:slug', (c) => {
  const slug = c.req.param('slug');
  const st = getStationBySlug(slug);
  if (!st) return c.notFound();

  const canonicalUrl = `https://seoul365dc.kr/stations/${slug}`;
  const otherStations = STATIONS.filter(s => s.slug !== slug).slice(0, 4);

  // Place + DentistAtLocation Schema
  const placeSchema = {
    "@context": "https://schema.org",
    "@type": "Place",
    "name": `${st.name} 인근 치과 - 서울365치과`,
    "url": canonicalUrl,
    "description": `${st.name}에서 서울365치과까지 ${st.travelDesc}.`,
    "containsPlace": {
      "@type": "Dentist",
      "@id": "https://seoul365dc.kr/#dentist",
      "name": "서울365치과의원",
    },
    "geo": { "@type": "GeoCoordinates", "latitude": "37.4482", "longitude": "126.7042" },
  };

  // E-E-A-T MedicalWebPage
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    "@id": `${canonicalUrl}#article`,
    "headline": `${st.name} 근처 치과 - 서울365치과 길안내`,
    "description": `${st.name}에서 서울365치과까지 ${st.travelDesc}.`,
    "url": canonicalUrl,
    "datePublished": AGENCY_HUB_PUBLISHED,
    "dateModified": "2026-05-26",
    "inLanguage": "ko-KR",
    "specialty": { "@type": "MedicalSpecialty", "name": "Dentistry" },
    "author": { "@type": "MedicalOrganization", "@id": "https://seoul365dc.kr/#dentist", "name": "서울365치과의원" },
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "홈", "item": "https://seoul365dc.kr" },
      { "@type": "ListItem", "position": 2, "name": "역·랜드마크 안내", "item": "https://seoul365dc.kr/stations" },
      { "@type": "ListItem", "position": 3, "name": st.name, "item": canonicalUrl },
    ]
  };

  // 진료 추천
  const recommendTreatments = ['implant', 'invisalign', 'sedation', 'full-implant'];

  return c.render(
    <>
      <section class="phead" aria-labelledby="station-h1">
        <div class="wrap phead-in">
          <div class="phead-text">
            <nav class="crumb" aria-label="현재 위치"><ol><li><a href="/">홈</a></li><li><a href="/stations">역·랜드마크</a></li><li aria-current="page">{st.name}</li></ol></nav>
            <p class="eyebrow">{st.line}</p>
            <h1 id="station-h1" class="display-xl hubx-h1">
              {st.name}에서 치과 가기
            </h1>
            <p class="lead hero-sub">
              서울365치과까지 <span style="color:var(--sky);font-weight:700">{st.travelDesc}</span> ({st.travelMin}분)
            </p>
            <div class="phead-cta">
              <a href="/reservation" class="btn btn-primary"><Icon name="calendar" />상담 예약</a>
              <a href={CLINIC.phoneTel} class="btn btn-light mono"><Icon name="phone" />{CLINIC.phone}</a>
            </div>
          </div>
          <div class="phead-aside">
            <div class="fact-card">
              <p class="eyebrow">{CLINIC.name}</p>
              <dl class="fact-rows stack">
                <div><dt>주소</dt><dd>{CLINIC.address}</dd></div>
                <div><dt>가까운 역</dt><dd>{CLINIC.nearStation}</dd></div>
                <div><dt>전화</dt><dd class="mono"><a href={CLINIC.phoneTel}>{CLINIC.phone}</a></dd></div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      <section class="sec">
        <article class="wrap-n">
          {/* 핵심 정보 박스 */}
          <div class="stat-row" style="margin-bottom:2.6rem" data-rv-group>
            <div class="card stat">
              <p class="k">소요 시간</p>
              <p class="v">{st.travelMin}<small>분</small></p>
            </div>
            <div class="card stat">
              <p class="k">이동 방법</p>
              <p class="v txt">{st.travelDesc}</p>
            </div>
            <div class="card stat">
              <p class="k">지역</p>
              <p class="v txt">{st.area}</p>
            </div>
          </div>

          {/* 본문 */}
          <div class="prose-sec" style="margin-bottom:1.2rem" data-rv>
            <h2>{st.name}에서 서울365치과 가는 길</h2>
            <p>
              {st.name}에서 인천 구월동에 위치한 서울365치과까지는 {st.travelDesc}이면 도착하실 수 있습니다.
              서울365치과는 인천 구월동 예술로 138 이토타워 2층 212호에 위치하고 있으며,
              예술회관역 6번 출구 맞은편의 최적의 입지를 자랑합니다.
            </p>
            <p>
              <strong>{st.name} 인근에서 치과를 찾으시는 분</strong>들에게 서울365치과는 다음과 같은 장점을 제공합니다:
            </p>
          </div>
          <ul class="check-list" style="margin-bottom:2.6rem" data-rv-group>
            <li><Icon name="check" /><span>365일 진료 — 평일 야간 21시, 토요일 14시, 일·공휴일 14~18시</span></li>
            <li><Icon name="check" /><span>서울대학교 치과대학 출신 5인 원장 협진</span></li>
            <li><Icon name="check" /><span>자체 기공실 보유 — 빠른 보철 제작</span></li>
            <li><Icon name="check" /><span>임플란트·인비절라인·수면진료·전체임플란트 전문</span></li>
            <li><Icon name="check" /><span>무료 주차장 완비</span></li>
          </ul>

          {/* 추천 진료 */}
          <section class="hubx-sec" data-rv>
            <h2>{st.name} 인근 주민이 많이 찾는 진료</h2>
            <div class="rec-grid">
              {recommendTreatments.map(tslug => {
                const info = MATRIX_TREATMENT_INFO[tslug as keyof typeof MATRIX_TREATMENT_INFO];
                const pricing = TREATMENT_PRICING[tslug];
                if (!info) return null;
                return (
                  <a href={`/treatments/${tslug}`} class="card rec-card hover">
                    <h3>{info.name}</h3>
                    <p style="margin-bottom:0">{info.tagline}</p>
                    {pricing && pricing.items?.[0] && (
                      <p style="margin:.6rem 0 0">
                        가격: <span class="mono" style="color:var(--blue);font-weight:700">{pricing.items[0].price.toLocaleString()}원~</span>
                      </p>
                    )}
                  </a>
                );
              })}
            </div>
          </section>

          {/* 키워드 */}
          <div class="hubx-tags" data-rv>
            {st.keywords.map(kw => (
              <span class="chip">#{kw}</span>
            ))}
          </div>

          {/* 다른 역·랜드마크 */}
          <section class="hubx-sec" style="margin-bottom:0" data-rv>
            <h2>다른 역·랜드마크</h2>
            <div class="hubx-grid">
              {otherStations.map(s => (
                <a href={`/stations/${s.slug}`} class="card hubx-card sm hover">
                  <span class="t">{s.name}에서 치과 가기</span>
                  <p>{s.travelDesc} ({s.travelMin}분)</p>
                </a>
              ))}
            </div>
          </section>
        </article>
      </section>

      {/* CTA */}
      <section class="cta-band" aria-label="상담 안내">
        <div class="wrap-n" style="text-align:center;position:relative">
          <p class="eyebrow eyebrow-light no-bar" style="justify-content:center" data-rv>Consultation</p>
          <h2 class="display-xl" data-rv>{st.name} 인근 치과 찾으세요?</h2>
          <p class="lead" data-rv>서울365치과 무료 상담 받아보세요.</p>
          <div class="cta-actions" data-rv-group>
            <a href="/reservation" class="btn btn-primary btn-lg"><Icon name="calendar" />무료 상담 예약</a>
            <a href={CLINIC.phoneTel} class="btn btn-white btn-lg mono"><Icon name="phone" />{CLINIC.phone}</a>
          </div>
        </div>
      </section>
    </>,
    {
      title: `${st.name} 근처 치과 - 서울365치과 (${st.travelDesc}) | 임플란트·교정`,
      description: `${st.name}에서 서울365치과까지 ${st.travelDesc} (${st.travelMin}분). 서울대 출신 5인 원장, 365일·야간21시 진료. 임플란트·인비절라인·수면진료 전문. ☎ ${CLINIC.phone}`,
      canonical: canonicalUrl,
      keywords: st.keywords.join(', '),
      ogType: 'article',
      datePublished: AGENCY_HUB_PUBLISHED,
      dateModified: '2026-05-26',
      jsonLd: [placeSchema, articleSchema, breadcrumb],
    }
  );
});

export default stationsRoutes
