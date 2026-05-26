// ============================================================
// 🚀 v4 SUPER UPGRADE — HowTo Procedure Routes (Weapon 9)
// HowTo JSON-LD로 SGE/Featured Snippet 단계별 노출
// ============================================================
import { Hono } from 'hono';
import type { Bindings } from '../lib/types';
import { PROCEDURES, getProcedureBySlug, getAllProcedureSlugs } from '../data/procedures';

const app = new Hono<{ Bindings: Bindings }>();
const SITE_URL = 'https://seoul365dc.kr';

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

      <section class="hero-premium" style="min-height:40vh">
        <div class="hero-grid"></div>
        <div class="orb orb-1"></div>
        <div class="relative z-10 max-w-4xl mx-auto px-5 pt-20 pb-12 text-center">
          <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs mb-4">
            <i class="fas fa-list-ol"></i> 단계별 완벽 가이드
          </div>
          <h1 class="text-4xl md:text-5xl font-black gradient-text-white leading-tight mb-4">
            시술 절차 가이드
          </h1>
          <p class="text-white/60 text-lg">
            서울365치과 주요 시술의 단계별 진행 과정과 소요 기간·비용·주의사항
          </p>
        </div>
      </section>

      <section class="bg-gray-50 py-12">
        <div class="max-w-5xl mx-auto px-5">
          <div class="grid md:grid-cols-3 gap-5">
            {PROCEDURES.map((p) => (
              <a href={`/procedures/${p.slug}`} class="block bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition">
                <div class="text-xs text-blue-600 font-bold mb-2">{p.category}</div>
                <h2 class="text-xl font-bold text-gray-900 mb-3">{p.title}</h2>
                <p class="text-sm text-gray-600 leading-relaxed mb-4">{p.description}</p>
                <div class="flex items-center gap-3 text-xs text-gray-500">
                  <span><i class="fas fa-clock"></i> {p.steps.length}단계</span>
                  <span><i class="fas fa-coins"></i> {p.estimatedCost}</span>
                </div>
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
    author: {
      '@type': 'Person',
      name: '박준규',
      jobTitle: '대표원장',
      worksFor: { '@type': 'Dentist', name: '서울365치과의원' },
      alumniOf: { '@type': 'CollegeOrUniversity', name: '서울대학교 치과대학' },
    },
    publisher: {
      '@type': 'Organization',
      name: '서울365치과의원',
      url: SITE_URL,
    },
    datePublished: '2026-01-01',
    dateModified: '2026-05-26',
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
    name: proc.title,
    description: proc.description,
    procedureType: 'Diagnostic',
    audience: { '@type': 'MedicalAudience', audienceType: 'Patient' },
    performer: {
      '@type': 'Dentist',
      name: '서울365치과의원',
      url: SITE_URL,
    },
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <section class="hero-premium" style="min-height:40vh">
        <div class="hero-grid"></div>
        <div class="orb orb-1"></div>
        <div class="relative z-10 max-w-4xl mx-auto px-5 pt-20 pb-12">
          <nav class="text-sm text-white/40 mb-4">
            <a href="/" class="hover:text-white">홈</a> ›{' '}
            <a href="/procedures" class="hover:text-white">시술 절차</a> › {proc.category}
          </nav>
          <h1 class="text-3xl md:text-4xl font-black gradient-text-white leading-tight mb-4">
            {proc.title}
          </h1>
          <p class="text-white/60 text-lg mb-6">{proc.description}</p>
          <div class="flex flex-wrap gap-3 text-xs">
            <span class="px-3 py-1.5 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-200">
              <i class="fas fa-list-ol"></i> {proc.steps.length}단계
            </span>
            <span class="px-3 py-1.5 rounded-full bg-green-500/15 border border-green-500/30 text-green-200">
              <i class="fas fa-coins"></i> {proc.estimatedCost}
            </span>
            <span class="px-3 py-1.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-200">
              <i class="fas fa-tags"></i> {proc.category}
            </span>
          </div>
        </div>
      </section>

      <section class="bg-white py-12">
        <div class="max-w-3xl mx-auto px-5">
          {/* 준비물 */}
          <h2 class="text-2xl font-bold text-gray-900 mb-4">사전 준비</h2>
          <ul class="grid grid-cols-2 gap-2 mb-12">
            {proc.supplies.map((s) => (
              <li class="flex items-center gap-2 p-3 bg-gray-50 rounded-lg text-sm text-gray-700">
                <i class="fas fa-check-circle text-green-500"></i> {s}
              </li>
            ))}
          </ul>

          {/* 단계별 */}
          <h2 class="text-2xl font-bold text-gray-900 mb-4">시술 단계</h2>
          <ol class="space-y-6 mb-12">
            {proc.steps.map((s, i) => (
              <li class="flex gap-4 p-5 bg-blue-50 rounded-xl">
                <div class="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center">
                  {i + 1}
                </div>
                <div class="flex-1">
                  <h3 class="font-bold text-gray-900 mb-2">{s.name}</h3>
                  <p class="text-sm text-gray-700 leading-relaxed">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>

          {/* 시술 후 관리 */}
          <h2 class="text-2xl font-bold text-gray-900 mb-4">시술 후 주의사항</h2>
          <ul class="space-y-2 mb-12 p-5 bg-yellow-50 rounded-xl border border-yellow-200">
            {proc.aftercare.map((a) => (
              <li class="flex items-start gap-2 text-sm text-gray-700">
                <i class="fas fa-exclamation-circle text-yellow-600 mt-0.5"></i>
                <span>{a}</span>
              </li>
            ))}
          </ul>

          {/* FAQ */}
          <h2 class="text-2xl font-bold text-gray-900 mb-4">자주 묻는 질문</h2>
          <div class="space-y-3 mb-12">
            {proc.faqs.map((f) => (
              <details class="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <summary class="font-bold text-gray-900 cursor-pointer">{f.q}</summary>
                <p class="mt-3 text-sm text-gray-700 leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>

          {/* CTA */}
          <div class="p-6 bg-blue-50 rounded-2xl text-center">
            <h3 class="text-xl font-bold text-gray-900 mb-3">{proc.category} 상담받기</h3>
            <div class="flex flex-wrap justify-center gap-3">
              <a href="tel:032-432-0365" class="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-full font-bold">
                <i class="fas fa-phone"></i> 032-432-0365
              </a>
              <a href="/reservation" class="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-blue-600 text-blue-600 rounded-full font-bold">
                <i class="fas fa-calendar"></i> 온라인 예약
              </a>
            </div>
          </div>
        </div>
      </section>
    </>,
    {
      title: `${proc.title} | 서울365치과`,
      description: proc.description,
      keywords: `${proc.category} 절차, ${proc.category} 시술 단계, ${proc.category} 과정, ${proc.category} 가이드`,
      canonical: canonicalUrl,
    }
  );
});

export { getAllProcedureSlugs };
export default app;
