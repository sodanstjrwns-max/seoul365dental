// ============================================================
// 🚀 v4 SUPER UPGRADE — HowTo Procedure Routes (Weapon 9)
// HowTo JSON-LD로 SGE/Featured Snippet 단계별 노출
// ============================================================
import { Hono } from 'hono';
import type { Bindings } from '../lib/types';
import { PROCEDURES, getProcedureBySlug, getAllProcedureSlugs } from '../data/procedures';
import { Icon } from '../lib/icons';

const app = new Hono<{ Bindings: Bindings }>();
const SITE_URL = 'https://seoul365dc.kr';
// 절차 가이드 최종 검토일 — 기존 HowTo.dateModified 고정값과 동일하게 화면·스키마에 사용 (2026-09-29)
const PROC_REVIEWED = '2026-05-26';
const LEAD_REVIEWER_ID = `${SITE_URL}/doctors/park-junkyu#physician`;
// 화면 표시용: 단계 이름 앞 번호("1. ")는 번호 표식(01)이 대신한다. HowTo 스키마의 name 은 원문 그대로 둔다.
const stepLabel = (name: string) => name.replace(/^\d+\.\s*/, '');

// 히어로 제목: " — " 앞(주제)과 뒤(부제)를 두 줄로 나눠 보여준다. 글자는 그대로이고 줄표만 화면에서 숨긴다.
const TitleLines = ({ text }: { text: string }) => {
  const i = text.indexOf(' — ');
  if (i < 0) return <>{text}</>;
  return <><span class="block">{text.slice(0, i)}</span><span class="sr-only"> — </span><span class="block h1-sub">{text.slice(i + 3)}</span></>;
};

// ── /procedures 인덱스 ──
app.get('/procedures', (c) => {
  const canonicalUrl = `${SITE_URL}/procedures`;

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: '서울365치과 시술 절차 가이드',
    numberOfItems: PROCEDURES.length,
    itemListElement: PROCEDURES.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: p.title,
      url: `${SITE_URL}/procedures/${p.slug}`,
    })),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '홈', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: '시술 절차', item: canonicalUrl },
    ],
  };

  return c.render(
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <section class="phead" aria-labelledby="proc-h1">
        <div class="wrap phead-in">
          <div class="phead-text">
            <nav class="crumb" aria-label="현재 위치"><ol><li><a href="/">홈</a></li><li aria-current="page">시술 절차</li></ol></nav>
            <p class="eyebrow">단계별 완벽 가이드</p>
            <h1 id="proc-h1" class="display-xl">
              시술 절차 가이드
            </h1>
            <p class="lead hero-sub">
              서울365치과 주요 시술의 단계별 진행 과정과 소요 기간·비용·주의사항
            </p>
            <div class="phead-cta">
              <a href="/reservation" class="btn btn-primary"><Icon name="calendar" />상담 예약</a>
              <a href="tel:032-432-0365" class="btn btn-light mono"><Icon name="phone" />032-432-0365</a>
            </div>
          </div>
          <div class="phead-aside">
            <div class="fact-card">
              <p class="eyebrow">Procedures · {PROCEDURES.length}</p>
              <div class="phead-jump">
                {PROCEDURES.map((p) => <a href={`/procedures/${p.slug}`}>{p.category}<small>{p.steps.length}</small></a>)}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="sec">
        <div class="wrap">
          <div class="hubx-grid three" data-rv-group>
            {PROCEDURES.map((p) => (
              <a href={`/procedures/${p.slug}`} class="card hubx-card hover">
                <span class="tag">{p.category}</span>
                <h2>{p.title}</h2>
                <p>{p.description}</p>
                <span class="meta">
                  <span>{p.steps.length}단계</span>
                  <span>{p.estimatedCost}</span>
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>,
    {
      title: '시술 절차 가이드 — 임플란트·인비절라인·수면진료 단계별 완벽 안내 | 서울365치과',
      description: '서울365치과 주요 시술 절차 가이드. 임플란트·인비절라인·수면진료 단계별 진행 과정, 소요 기간, 비용, 시술 후 관리법까지.',
      keywords: '임플란트 절차, 인비절라인 절차, 수면진료 절차, 치과 시술 단계',
      canonical: canonicalUrl,
    }
  );
});

// ── /procedures/:slug 상세 ──
app.get('/procedures/:slug', (c) => {
  const slug = c.req.param('slug');
  const proc = getProcedureBySlug(slug);
  if (!proc) return c.notFound();

  const canonicalUrl = `${SITE_URL}/procedures/${slug}`;

  // HowTo JSON-LD — Google Featured Snippet 핵심
  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: proc.title,
    description: proc.description,
    image: `${SITE_URL}/static/og-image.jpg`,
    totalTime: proc.totalTime,
    estimatedCost: {
      '@type': 'MonetaryAmount',
      currency: 'KRW',
      value: proc.estimatedCost,
    },
    supply: proc.supplies.map((s) => ({ '@type': 'HowToSupply', name: s })),
    step: proc.steps.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: s.name,
      text: s.text,
      ...(s.duration ? { performTime: s.duration } : {}),
    })),
    // 의료 E-E-A-T
    author: { '@type': 'Physician', '@id': LEAD_REVIEWER_ID, name: '박준규', jobTitle: '대표원장' },
    publisher: { '@id': `${SITE_URL}/#dentist` },
    datePublished: '2026-01-01',
    dateModified: PROC_REVIEWED,
    inLanguage: 'ko-KR',
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: proc.faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  const medicalSchema = {
    '@context': 'https://schema.org',
    '@type': 'MedicalProcedure',
    '@id': `${canonicalUrl}#procedure`,
    name: proc.title,
    description: proc.description,
    audience: { '@type': 'MedicalAudience', audienceType: 'Patient' },
    performer: { '@id': `${SITE_URL}/#dentist` },
  };

  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'MedicalWebPage',
    '@id': `${canonicalUrl}#webpage`,
    name: `${proc.title} | 서울365치과`,
    url: canonicalUrl,
    isPartOf: { '@id': `${SITE_URL}/#website` },
    about: { '@id': `${canonicalUrl}#procedure` },
    lastReviewed: PROC_REVIEWED,
    dateModified: PROC_REVIEWED,
    reviewedBy: { '@type': 'Physician', '@id': LEAD_REVIEWER_ID, name: '박준규', jobTitle: '대표원장' },
    speakable: { '@type': 'SpeakableSpecification', cssSelector: ['h1', '#tx-answer'] },
    inLanguage: 'ko-KR',
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '홈', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: '시술 절차', item: `${SITE_URL}/procedures` },
      { '@type': 'ListItem', position: 3, name: proc.category, item: canonicalUrl },
    ],
  };

  return c.render(
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(medicalSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <section class="phead" aria-labelledby="proc-h1">
        <div class="wrap phead-in">
          <div class="phead-text">
            <nav class="crumb" aria-label="현재 위치"><ol><li><a href="/">홈</a></li><li><a href="/procedures">시술 절차</a></li><li aria-current="page">{proc.category}</li></ol></nav>
            <p class="eyebrow">Procedure Guide</p>
            <h1 id="proc-h1" class="display-xl hubx-h1"><TitleLines text={proc.title} /></h1>
            <p id="tx-answer" class="lead hero-sub">{proc.description}</p>
            <p class="tx-reviewer phead-note">
              감수: <a href="/doctors/park-junkyu" class="cta-link">박준규 대표원장</a> · 최종 검토 <time datetime={PROC_REVIEWED}>{PROC_REVIEWED}</time>
            </p>
            <div class="chips">
              <span class="chip">{proc.steps.length}단계</span>
              <span class="chip">{proc.estimatedCost}</span>
              <span class="chip">{proc.category}</span>
            </div>
            <div class="phead-cta">
              <a href="/reservation" class="btn btn-primary"><Icon name="calendar" />상담 예약</a>
              <a href="tel:032-432-0365" class="btn btn-light mono"><Icon name="phone" />032-432-0365</a>
            </div>
          </div>
          <div class="phead-aside">
            <div class="fact-card">
              <p class="eyebrow">시술 단계</p>
              <ol class="hubx-toc">
                {proc.steps.map((s, i) => (
                  <li><a href={`#step-${i + 1}`}>{stepLabel(s.name)}</a></li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      <section class="sec">
        <article class="wrap-n">
          {/* 준비물 */}
          <section class="hubx-sec" data-rv>
            <h2>사전 준비</h2>
            <ul class="check-list">
              {proc.supplies.map((s) => (
                <li><Icon name="check" /><span>{s}</span></li>
              ))}
            </ul>
          </section>

          {/* 단계별 */}
          <section class="hubx-sec">
            <h2 data-rv>시술 단계</h2>
            <ol class="steps" data-rv-group>
              {proc.steps.map((s, i) => (
                <li class="step hubx-anchor" id={`step-${i + 1}`}>
                  <span class="step-n mono" aria-label={`${i + 1}단계`}>{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <h3>{stepLabel(s.name)}</h3>
                    <p>{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* 시술 후 관리 */}
          <section class="hubx-sec" data-rv>
            <h2>시술 후 주의사항</h2>
            <div class="card note-card">
              <ul>
                {proc.aftercare.map((a) => (
                  <li>{a}</li>
                ))}
              </ul>
            </div>
          </section>

          {/* FAQ */}
          <section class="hubx-sec" style="margin-bottom:0" data-rv>
            <h2>자주 묻는 질문</h2>
            {proc.faqs.map((f, i) => (
              <details class="fq" open={i === 0 ? true : undefined}>
                <summary><h3>{f.q}</h3><span class="pm" aria-hidden="true"><Icon name="plus" /></span></summary>
                <div class="fq-a"><p>{f.a}</p></div>
              </details>
            ))}
          </section>
        </article>
      </section>

      {/* CTA */}
      <section class="cta-band" aria-label="상담 안내">
        <div class="wrap-n" style="text-align:center;position:relative">
          <p class="eyebrow eyebrow-light no-bar" style="justify-content:center" data-rv>Consultation</p>
          <h2 class="display-xl" style="margin-bottom:2.4rem" data-rv>{proc.category} 상담받기</h2>
          <div class="cta-actions" data-rv-group>
            <a href="tel:032-432-0365" class="btn btn-white btn-lg mono"><Icon name="phone" />032-432-0365</a>
            <a href="/reservation" class="btn btn-primary btn-lg"><Icon name="calendar" />온라인 예약</a>
          </div>
        </div>
      </section>
    </>,
    {
      title: `${proc.title} | 서울365치과`,
      description: proc.description,
      dateModified: PROC_REVIEWED,
      keywords: `${proc.category} 절차, ${proc.category} 시술 단계, ${proc.category} 과정, ${proc.category} 가이드`,
      canonical: canonicalUrl,
    }
  );
});

export { getAllProcedureSlugs };
export default app;
