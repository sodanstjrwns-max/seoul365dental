// ============================================================
// 🧠 v3 SUPER UPGRADE — AI Answer Hub
// AI 검색(SGE / Perplexity / ChatGPT / Claude)이 인용하기 좋은
// 구조화된 Q&A 페이지 + QAPage JSON-LD + E-E-A-T 시그널
// ============================================================
import { Hono } from 'hono'
import type { Bindings } from '../lib/types'
import { ANSWER_HUB, type AnswerEntry } from '../data/answer-hub'
import { CLINIC } from '../data/clinic'
import { ORG_ID, AGENCY_HUB_PUBLISHED, CLINIC_GENERAL_INFO_NOTE } from '../lib/column-seo'
import { Icon } from '../lib/icons'

const answersRoutes = new Hono<{ Bindings: Bindings }>()

// 슬러그 생성 함수 (질문 → URL slug)
function questionToSlug(q: AnswerEntry): string {
  // 한글 질문을 URL-friendly 영문 slug로 변환
  const key = q.keywords[0] || q.question;
  return key
    .toLowerCase()
    .replace(/[^a-z0-9가-힣]+/gi, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60);
}

// 인덱스 페이지: /answers
answersRoutes.get('/answers', (c) => {
  // 카테고리별 그룹핑
  const grouped: Record<string, AnswerEntry[]> = {};
  for (const entry of ANSWER_HUB) {
    if (!grouped[entry.category]) grouped[entry.category] = [];
    grouped[entry.category].push(entry);
  }

  // QAPage JSON-LD (인덱스용 - mainEntity 다중)
  const qaPageSchema = {
    "@context": "https://schema.org",
    "@type": "QAPage",
    "@id": "https://seoul365dc.kr/answers#qapage",
    "name": "서울365치과 AI Answer Hub — 자주 묻는 질문 베스트 답변",
    "description": "임플란트·인비절라인·교정·수면진료 등 인천 구월동 서울365치과에 자주 묻는 질문 답변. AI 검색 최적화.",
    "mainEntity": ANSWER_HUB.map(entry => ({
      "@type": "Question",
      "name": entry.question,
      "answerCount": 1,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": entry.detailedAnswer,
        "dateCreated": AGENCY_HUB_PUBLISHED,
        "url": `https://seoul365dc.kr/answers/${questionToSlug(entry)}`,
        "author": {
          "@type": "MedicalOrganization",
          "name": "서울365치과의원",
          "url": "https://seoul365dc.kr",
        }
      }
    }))
  };

  // BreadcrumbList
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "홈", "item": "https://seoul365dc.kr" },
      { "@type": "ListItem", "position": 2, "name": "Answer Hub", "item": "https://seoul365dc.kr/answers" },
    ]
  };

  const categoryOrder = ['임플란트', '교정', '인비절라인', '비용', '수면진료', '심미', '소아', '응급', '병원소개', '미백'];
  const allKeywords = ANSWER_HUB.flatMap(e => e.keywords).filter((v, i, a) => a.indexOf(v) === i).join(', ');
  const cats = categoryOrder.filter(cat => grouped[cat]);

  return c.render(
    <>
      {/* Hero */}
      <section class="phead" aria-labelledby="answers-h1">
        <div class="wrap phead-in">
          <div class="phead-text">
            <nav class="crumb" aria-label="현재 위치"><ol><li><a href="/">홈</a></li><li aria-current="page">Answer Hub</li></ol></nav>
            <p class="eyebrow">AI ANSWER HUB</p>
            <h1 id="answers-h1" class="display-xl">서울365치과 베스트 답변 모음</h1>
            <p class="lead hero-sub">
              임플란트·교정·인비절라인·수면진료 등 가장 많이 묻는 질문에<br class="hidden md:inline" />{' '}
              서울365치과가 정리한 일반 건강정보입니다. ({ANSWER_HUB.length}개 답변)
            </p>
            <div class="phead-cta">
              <a href="/reservation" class="btn btn-primary"><Icon name="calendar" />상담 예약</a>
              <a href={CLINIC.phoneTel} class="btn btn-light mono"><Icon name="phone" />{CLINIC.phone}</a>
            </div>
          </div>
          <div class="phead-aside">
            <div class="fact-card">
              <p class="eyebrow">Categories · {cats.length}</p>
              <div class="phead-jump">
                {cats.map((cat, i) => <a href={`#ans-cat-${i}`}>{cat}<small>{grouped[cat].length}</small></a>)}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 카테고리별 Q&A */}
      <section class="sec">
        <div class="wrap">
          {cats.map((cat, i) => {
            const entries = grouped[cat];
            return (
              <article id={`ans-cat-${i}`} class="hubx-row" data-rv>
                <div class="hubx-row-head">
                  <h2>{cat}</h2>
                  <span class="cnt">{entries.length}개 답변</span>
                </div>
                <div class="hubx-grid one">
                  {entries.map(entry => (
                    <a href={`/answers/${questionToSlug(entry)}`} class="card hubx-card hover">
                      <h3>{entry.question}</h3>
                      <p>{entry.shortAnswer}</p>
                      <span class="meta">
                        <span>서울365치과</span>
                        <span>{entry.updated}</span>
                      </span>
                    </a>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section class="cta-band" aria-label="상담 안내">
        <div class="wrap-n" style="text-align:center;position:relative">
          <p class="eyebrow eyebrow-light no-bar" style="justify-content:center" data-rv>Consultation</p>
          <h2 class="display-xl" data-rv>더 궁금한 점이 있으신가요?</h2>
          <p class="lead" data-rv>서울대 출신 5인 전문의가 1:1 무료 상담을 도와드립니다.</p>
          <div class="cta-actions" data-rv-group>
            <a href="/reservation" class="btn btn-primary btn-lg"><Icon name="calendar" />무료 상담 예약</a>
            <a href={CLINIC.phoneTel} class="btn btn-white btn-lg mono"><Icon name="phone" />{CLINIC.phone}</a>
          </div>
        </div>
      </section>
    </>,
    {
      title: `자주 묻는 질문 ${ANSWER_HUB.length}선 | 서울365치과 AI Answer Hub`,
      description: `인천 구월동 서울365치과 자주 묻는 질문 ${ANSWER_HUB.length}선. 임플란트 가격, 인비절라인 비용, 수면진료, 보험 적용까지 서울365치과가 정리한 답변.`,
      canonical: 'https://seoul365dc.kr/answers',
      keywords: allKeywords,
      jsonLd: [qaPageSchema, breadcrumb],
    }
  );
});

// 개별 답변 페이지: /answers/:slug
answersRoutes.get('/answers/:slug', (c) => {
  const slug = c.req.param('slug');
  const entry = ANSWER_HUB.find(e => questionToSlug(e) === slug);

  if (!entry) {
    return c.notFound();
  }

  // 관련 답변 (같은 카테고리)
  const related = ANSWER_HUB
    .filter(e => e.category === entry.category && questionToSlug(e) !== slug)
    .slice(0, 4);

  const canonicalUrl = `https://seoul365dc.kr/answers/${slug}`;

  // === QAPage Schema (개별 질문) ===
  const qaSchema = {
    "@context": "https://schema.org",
    "@type": "QAPage",
    "@id": `${canonicalUrl}#qapage`,
    "mainEntity": {
      "@type": "Question",
      "name": entry.question,
      "text": entry.question,
      "answerCount": 1,
      "dateCreated": AGENCY_HUB_PUBLISHED,
      "author": {
        "@type": "MedicalOrganization",
        "@id": ORG_ID,
        "name": "서울365치과의원",
      },
      "acceptedAnswer": {
        "@type": "Answer",
        "text": entry.detailedAnswer,
        "dateCreated": AGENCY_HUB_PUBLISHED,
        "url": canonicalUrl,
        "author": {
          "@type": "MedicalOrganization",
          "@id": "https://seoul365dc.kr/#dentist",
          "name": "서울365치과의원",
          "url": "https://seoul365dc.kr",
        }
      }
    }
  };

  // === MedicalWebPage — 작성·발행 = 병원 (원장 검토 근거 없음 → reviewedBy 없음, 2026-10-08) ===
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    "@id": `${canonicalUrl}#article`,
    "headline": entry.question,
    "description": entry.shortAnswer,
    "url": canonicalUrl,
    "datePublished": AGENCY_HUB_PUBLISHED,
    "dateModified": entry.updated,
    "inLanguage": "ko-KR",
    "isAccessibleForFree": true,
    "specialty": {
      "@type": "MedicalSpecialty",
      "name": "Dentistry",
    },
    "audience": {
      "@type": "MedicalAudience",
      "audienceType": "Patient",
      "geographicArea": {
        "@type": "AdministrativeArea",
        "name": "인천광역시"
      }
    },
    "author": {
      "@type": "MedicalOrganization",
      "@id": "https://seoul365dc.kr/#dentist",
      "name": "서울365치과의원",
      "url": "https://seoul365dc.kr",
    },
    "publisher": {
      "@type": "MedicalOrganization",
      "@id": "https://seoul365dc.kr/#dentist",
      "name": "서울365치과의원",
      "logo": {
        "@type": "ImageObject",
        "url": "https://seoul365dc.kr/static/logo-v2.png"
      }
    },
    "citation": [{
      "@type": "CreativeWork",
      "name": "보건복지부 건강보험 적용 가이드라인",
      "url": "https://www.mohw.go.kr"
    }]
  };

  // === BreadcrumbList ===
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "홈", "item": "https://seoul365dc.kr" },
      { "@type": "ListItem", "position": 2, "name": "Answer Hub", "item": "https://seoul365dc.kr/answers" },
      { "@type": "ListItem", "position": 3, "name": entry.category, "item": `https://seoul365dc.kr/answers?cat=${encodeURIComponent(entry.category)}` },
      { "@type": "ListItem", "position": 4, "name": entry.question, "item": canonicalUrl },
    ]
  };

  return c.render(
    <>
      {/* Hero */}
      <section class="phead" aria-labelledby="answer-h1">
        <div class="wrap phead-in">
          <div class="phead-text">
            {/* Breadcrumb */}
            <nav class="crumb" aria-label="현재 위치"><ol><li><a href="/">홈</a></li><li><a href="/answers">Answer Hub</a></li><li aria-current="page">{entry.category}</li></ol></nav>
            <p class="eyebrow">{entry.category}</p>
            <h1 id="answer-h1" class="display-xl hubx-h1">{entry.question}</h1>
            <p class="lead hero-sub">{entry.shortAnswer}</p>
            <div class="phead-cta">
              <a href="/reservation" class="btn btn-primary"><Icon name="calendar" />상담 예약</a>
              <a href={CLINIC.phoneTel} class="btn btn-light mono"><Icon name="phone" />{CLINIC.phone}</a>
            </div>
          </div>
          <div class="phead-aside">
            <div class="fact-card">
              <p class="eyebrow">Answer</p>
              <dl class="fact-rows">
                <div><dt>분류</dt><dd>{entry.category}</dd></div>
                <div><dt>작성·발행</dt><dd>서울365치과</dd></div>
                <div><dt>최종 업데이트</dt><dd class="mono">{entry.updated}</dd></div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* 본문 */}
      <section class="sec">
        <article class="wrap-n">
          {/* 짧은 답변 (피처드 스니펫 타겟) */}
          <div class="answer-card" style="margin-bottom:2.6rem" itemscope itemtype="https://schema.org/Answer" data-rv>
            <p class="eyebrow">한 줄 답변</p>
            <p class="answer-a" style="margin-bottom:0" itemprop="text">
              {entry.shortAnswer}
            </p>
          </div>

          {/* 상세 답변 */}
          <div class="prose-sec" data-rv>
            <h2>상세 답변</h2>
            <p style="white-space:pre-line">
              {entry.detailedAnswer}
            </p>
          </div>

          {/* 작성·발행 = 병원 (원장 검토 근거 없음, 2026-10-08) */}
          <aside class="card hubx-byline" data-rv>
            <p class="k">작성·발행</p>
            <p class="who">서울365치과</p>
            <p class="note">{CLINIC_GENERAL_INFO_NOTE}</p>
            <p class="meta-line">
              최종 업데이트: {entry.updated}
            </p>
          </aside>

          {/* 관련 페이지 링크 */}
          {entry.relatedUrl && (
            <aside class="card" style="padding:1.3rem 1.5rem;margin-bottom:2.6rem" data-rv>
              <p class="box-h">관련 진료 안내</p>
              <div class="link-row">
                <a href={entry.relatedUrl} class="btn btn-ghost btn-sm">자세한 진료 정보 보기<Icon name="arrow" /></a>
              </div>
            </aside>
          )}

          {/* 키워드 태그 */}
          <div class="hubx-tags" style={related.length > 0 ? undefined : 'margin-bottom:0'} data-rv>
            {entry.keywords.map(kw => (
              <span class="chip">#{kw}</span>
            ))}
          </div>

          {/* 관련 답변 */}
          {related.length > 0 && (
            <section class="hubx-sec" style="margin-bottom:0" data-rv>
              <h2>관련 질문</h2>
              <div class="hubx-grid one">
                {related.map(r => (
                  <a href={`/answers/${questionToSlug(r)}`} class="card hubx-card sm hover">
                    <span class="t">{r.question}</span>
                    <p>{r.shortAnswer.slice(0, 60)}...</p>
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
          <h2 class="display-xl" data-rv>정확한 진단이 필요하신가요?</h2>
          <p class="lead" data-rv>서울365치과에서 무료 상담을 받아보세요.</p>
          <div class="cta-actions" data-rv-group>
            <a href="/reservation" class="btn btn-primary btn-lg"><Icon name="calendar" />무료 상담 예약</a>
            <a href={CLINIC.phoneTel} class="btn btn-white btn-lg mono"><Icon name="phone" />{CLINIC.phone}</a>
          </div>
        </div>
      </section>
    </>,
    {
      title: `${entry.question} | 서울365치과 답변`,
      description: `${entry.shortAnswer} - 서울365치과가 정리한 답변입니다.`,
      canonical: canonicalUrl,
      keywords: entry.keywords.join(', '),
      ogType: 'article',
      datePublished: AGENCY_HUB_PUBLISHED,
      dateModified: entry.updated,
      articleSection: entry.category,
      articleTags: entry.keywords,
      jsonLd: [qaSchema, articleSchema, breadcrumb],
    }
  );
});

// 답변 슬러그 추출 헬퍼 (외부 사용)
export function getAllAnswerSlugs(): string[] {
  return ANSWER_HUB.map(e => questionToSlug(e));
}

export default answersRoutes
