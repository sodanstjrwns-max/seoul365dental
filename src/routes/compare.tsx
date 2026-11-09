// ============================================================
// 🔥 v3 SUPER UPGRADE — Comparison Pages
// "오스템 vs 스트라우만" 같은 A-vs-B 키워드 타겟
// Featured Snippet 및 AI 검색 인용 최적화
// ============================================================
import { Hono } from 'hono'
import type { Bindings } from '../lib/types'
import { COMPARISONS, type ComparisonEntry } from '../data/answer-hub'
import { AGENCY_HUB_PUBLISHED, CLINIC_GENERAL_INFO_NOTE } from '../lib/column-seo'
import { CLINIC } from '../data/clinic'
import { Icon } from '../lib/icons'

const compareRoutes = new Hono<{ Bindings: Bindings }>()

// 인덱스 페이지: /compare
compareRoutes.get('/compare', (c) => {
  const grouped: Record<string, ComparisonEntry[]> = {};
  for (const entry of COMPARISONS) {
    if (!grouped[entry.category]) grouped[entry.category] = [];
    grouped[entry.category].push(entry);
  }

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "홈", "item": "https://seoul365dc.kr" },
      { "@type": "ListItem", "position": 2, "name": "비교 가이드", "item": "https://seoul365dc.kr/compare" },
    ]
  };

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "서울365치과 진료 비교 가이드",
    "numberOfItems": COMPARISONS.length,
    "itemListElement": COMPARISONS.map((cmp, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "name": `${cmp.itemA} vs ${cmp.itemB}`,
      "url": `https://seoul365dc.kr/compare/${cmp.slug}`,
    }))
  };

  const allKeywords = COMPARISONS.flatMap(c => c.keywords).filter((v, i, a) => a.indexOf(v) === i).join(', ');

  return c.render(
    <>
      {/* Hero */}
      <section class="phead" aria-labelledby="compare-h1">
        <div class="wrap phead-in">
          <div class="phead-text">
            <nav class="crumb" aria-label="현재 위치"><ol><li><a href="/">홈</a></li><li aria-current="page">비교 가이드</li></ol></nav>
            <p class="eyebrow">COMPARE GUIDES</p>
            <h1 id="compare-h1" class="display-xl">진료·재료·브랜드 비교 가이드</h1>
            <p class="lead hero-sub">
              임플란트 브랜드, 교정 종류, 보철 재료 — 어떤 게 좋을까?<br class="hidden md:inline" />{' '}
              서울365치과가 환자 분들이 자주 궁금해하는 비교를 정리했습니다.
            </p>
            <div class="phead-cta">
              <a href="/reservation" class="btn btn-primary"><Icon name="calendar" />상담 예약</a>
              <a href={CLINIC.phoneTel} class="btn btn-light mono"><Icon name="phone" />{CLINIC.phone}</a>
            </div>
          </div>
          <div class="phead-aside">
            <div class="fact-card">
              <p class="eyebrow">Categories · {Object.keys(grouped).length}</p>
              <div class="phead-jump">
                {Object.entries(grouped).map(([cat, items]) => <a href={`#${cat}`}>{cat}<small>{items.length}</small></a>)}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="sec">
        <div class="wrap">
          {Object.entries(grouped).map(([cat, items]) => (
            <article id={cat} class="hubx-row" data-rv>
              <div class="hubx-row-head">
                <h2>{cat} 비교</h2>
              </div>
              <div class="hubx-grid one">
                {items.map(cmp => (
                  <a href={`/compare/${cmp.slug}`} class="card hubx-card hover">
                    <span class="t">{cmp.itemA}<span class="cmpg-vs">VS</span>{cmp.itemB}</span>
                    <p>{cmp.description}</p>
                    <span class="arrow-link">자세히 비교<Icon name="arrow" /></span>
                  </a>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </>,
    {
      title: '치과 진료·브랜드 비교 가이드 | 서울365치과',
      description: `오스템 vs 스트라우만, 인비절라인 vs 메탈교정, 지르코니아 vs E-max — ${COMPARISONS.length}개 비교 가이드. 서울대 출신 전문의가 알기 쉽게 정리했습니다.`,
      canonical: 'https://seoul365dc.kr/compare',
      keywords: allKeywords,
      jsonLd: [breadcrumb, itemList],
    }
  );
});

// 개별 비교 페이지: /compare/:slug
compareRoutes.get('/compare/:slug', (c) => {
  const slug = c.req.param('slug');
  const cmp = COMPARISONS.find(x => x.slug === slug);
  if (!cmp) return c.notFound();

  const canonicalUrl = `https://seoul365dc.kr/compare/${slug}`;
  const related = COMPARISONS.filter(x => x.category === cmp.category && x.slug !== slug).slice(0, 3);

  // === E-E-A-T MedicalWebPage Schema ===
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    "@id": `${canonicalUrl}#article`,
    "headline": `${cmp.itemA} vs ${cmp.itemB} 비교`,
    "description": cmp.description,
    "url": canonicalUrl,
    "datePublished": AGENCY_HUB_PUBLISHED,
    "dateModified": "2026-05-26",
    "inLanguage": "ko-KR",
    "isAccessibleForFree": true,
    "specialty": { "@type": "MedicalSpecialty", "name": "Dentistry" },
    "audience": {
      "@type": "MedicalAudience",
      "audienceType": "Patient",
      "geographicArea": { "@type": "AdministrativeArea", "name": "인천광역시" }
    },
    "author": {
      "@type": "MedicalOrganization",
      "@id": "https://seoul365dc.kr/#dentist",
      "name": "서울365치과의원",
    },
    "publisher": {
      "@type": "MedicalOrganization",
      "@id": "https://seoul365dc.kr/#dentist",
      "logo": { "@type": "ImageObject", "url": "https://seoul365dc.kr/static/logo-v2.png" }
    },
    "about": [
      { "@type": "MedicalProcedure", "name": cmp.itemA },
      { "@type": "MedicalProcedure", "name": cmp.itemB },
    ],
  };

  // === FAQ Schema for comparison ===
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `${cmp.itemA}와 ${cmp.itemB}의 차이는?`,
        "acceptedAnswer": { "@type": "Answer", "text": cmp.summary }
      },
      {
        "@type": "Question",
        "name": `${cmp.itemA}는 어떤 사람에게 추천하나요?`,
        "acceptedAnswer": { "@type": "Answer", "text": cmp.recommendA }
      },
      {
        "@type": "Question",
        "name": `${cmp.itemB}는 어떤 사람에게 추천하나요?`,
        "acceptedAnswer": { "@type": "Answer", "text": cmp.recommendB }
      },
    ]
  };

  // === BreadcrumbList ===
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "홈", "item": "https://seoul365dc.kr" },
      { "@type": "ListItem", "position": 2, "name": "비교 가이드", "item": "https://seoul365dc.kr/compare" },
      { "@type": "ListItem", "position": 3, "name": cmp.category, "item": `https://seoul365dc.kr/compare#${cmp.category}` },
      { "@type": "ListItem", "position": 4, "name": `${cmp.itemA} vs ${cmp.itemB}`, "item": canonicalUrl },
    ]
  };

  return c.render(
    <>
      {/* Hero */}
      <section class="phead" aria-labelledby="compare-h1">
        <div class="wrap phead-in">
          <div class="phead-text">
            {/* Breadcrumb */}
            <nav class="crumb" aria-label="현재 위치"><ol><li><a href="/">홈</a></li><li><a href="/compare">비교 가이드</a></li><li aria-current="page">{cmp.itemA} vs {cmp.itemB}</li></ol></nav>
            <p class="eyebrow">{cmp.category} 비교</p>
            <h1 id="compare-h1" class="display-xl hubx-h1">
              {cmp.itemA} <span class="cmpg-vs">VS</span> {cmp.itemB}
            </h1>
            <p class="lead hero-sub">
              {cmp.description}
            </p>
            <div class="phead-cta">
              <a href="/reservation" class="btn btn-primary"><Icon name="calendar" />상담 예약</a>
              <a href={CLINIC.phoneTel} class="btn btn-light mono"><Icon name="phone" />{CLINIC.phone}</a>
            </div>
          </div>
          <div class="phead-aside">
            <div class="fact-card">
              <p class="eyebrow">Contents</p>
              <ol class="hubx-toc">
                <li><a href="#cmp-summary">한 줄 요약</a></li>
                <li><a href="#cmp-table">상세 비교표</a></li>
                <li><a href="#cmp-rec-a">{cmp.itemA} 추천</a></li>
                <li><a href="#cmp-rec-b">{cmp.itemB} 추천</a></li>
                <li><a href="#cmp-faq">자주 묻는 질문</a></li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      <section class="sec">
        <article class="wrap-n">
          {/* Summary (Featured Snippet 타겟) */}
          <div id="cmp-summary" class="answer-card hubx-anchor" style="margin-bottom:2.6rem" data-rv>
            <p class="eyebrow">한 줄 요약</p>
            <p class="answer-a" style="margin-bottom:0">
              {cmp.summary}
            </p>
          </div>

          {/* 비교 표 */}
          <section id="cmp-table" class="hubx-sec" data-rv>
            <h2>상세 비교표</h2>
            <div class="table-wrap">
              <table class="cmp-table wrap-th cmpg-table">
                <thead>
                  <tr>
                    <th scope="col">항목</th>
                    <th scope="col" class="item">{cmp.itemA}</th>
                    <th scope="col" class="item">{cmp.itemB}</th>
                  </tr>
                </thead>
                <tbody>
                  {cmp.rows.map(row => (
                    <tr>
                      <th scope="row">{row.criterion}</th>
                      <td>{row.valueA}</td>
                      <td>{row.valueB}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* 추천 케이스 */}
          <div class="rec-grid" style="margin-bottom:2.6rem" data-rv-group>
            <div id="cmp-rec-a" class="card type-card hubx-anchor">
              <h3>{cmp.itemA} 추천</h3>
              <p>{cmp.recommendA}</p>
            </div>
            <div id="cmp-rec-b" class="card type-card hubx-anchor">
              <h3>{cmp.itemB} 추천</h3>
              <p>{cmp.recommendB}</p>
            </div>
          </div>

          {/* FAQ */}
          <section id="cmp-faq" class="hubx-sec" data-rv>
            <h2>자주 묻는 질문</h2>
            <details class="fq" open>
              <summary><h3>{cmp.itemA}와 {cmp.itemB}의 차이는 무엇인가요?</h3><span class="pm" aria-hidden="true"><Icon name="plus" /></span></summary>
              <div class="fq-a"><p>{cmp.summary}</p></div>
            </details>
            <details class="fq">
              <summary><h3>{cmp.itemA}는 어떤 사람에게 추천되나요?</h3><span class="pm" aria-hidden="true"><Icon name="plus" /></span></summary>
              <div class="fq-a"><p>{cmp.recommendA}</p></div>
            </details>
            <details class="fq">
              <summary><h3>{cmp.itemB}는 어떤 사람에게 추천되나요?</h3><span class="pm" aria-hidden="true"><Icon name="plus" /></span></summary>
              <div class="fq-a"><p>{cmp.recommendB}</p></div>
            </details>
          </section>

          {/* 작성·발행 = 병원 (원장 검토 근거 없음, 2026-10-08) */}
          <aside class="card hubx-byline" style={related.length > 0 ? undefined : 'margin-bottom:0'} data-rv>
            <p class="k">작성·발행</p>
            <p class="who">서울365치과</p>
            <p class="note">{CLINIC_GENERAL_INFO_NOTE}</p>
            <p class="meta-line">최종 업데이트: 2026-05-26</p>
          </aside>

          {/* 관련 비교 */}
          {related.length > 0 && (
            <section class="hubx-sec" style="margin-bottom:0" data-rv>
              <h2>관련 비교</h2>
              <div class="hubx-grid three">
                {related.map(r => (
                  <a href={`/compare/${r.slug}`} class="card hubx-card sm hover">
                    <span class="t">{r.itemA} vs {r.itemB}</span>
                    <span class="arrow-link">자세히 보기<Icon name="arrow" /></span>
                  </a>
                ))}
              </div>
            </section>
          )}
        </article>
      </section>

      {/* CTA */}
      <section class="cta-band" aria-label="상담 안내">
        <div class="wrap-n" style="text-align:center;position:relative">
          <p class="eyebrow eyebrow-light no-bar" style="justify-content:center" data-rv>Consultation</p>
          <h2 class="display-xl" data-rv>어떤 게 맞을지 모르시겠다면?</h2>
          <p class="lead" data-rv>서울대 출신 5인 전문의의 무료 상담을 받아보세요.</p>
          <div class="cta-actions" data-rv-group>
            <a href="/reservation" class="btn btn-primary btn-lg"><Icon name="calendar" />무료 상담 예약</a>
            <a href={CLINIC.phoneTel} class="btn btn-white btn-lg mono"><Icon name="phone" />{CLINIC.phone}</a>
          </div>
        </div>
      </section>
    </>,
    {
      title: cmp.title,
      description: cmp.description,
      canonical: canonicalUrl,
      keywords: cmp.keywords.join(', '),
      ogType: 'article',
      datePublished: AGENCY_HUB_PUBLISHED,
      dateModified: '2026-05-26',
      articleSection: cmp.category,
      articleTags: cmp.keywords,
      jsonLd: [articleSchema, faqSchema, breadcrumb],
    }
  );
});

export default compareRoutes
