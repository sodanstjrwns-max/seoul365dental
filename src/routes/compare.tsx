// ============================================================
// 🔥 v3 SUPER UPGRADE — Comparison Pages
// "오스템 vs 스트라우만" 같은 A-vs-B 키워드 타겟
// Featured Snippet 및 AI 검색 인용 최적화
// ============================================================
import { Hono } from 'hono'
import type { Bindings } from '../lib/types'
import { COMPARISONS, type ComparisonEntry } from '../data/answer-hub'
import { CLINIC } from '../data/clinic'

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
    <section class="min-h-screen bg-white">
      {/* Hero */}
      <div class="hero-premium" style="min-height:50vh">
        <div class="hero-grid"></div>
        <div class="orb orb-1"></div>
        <div class="orb orb-2"></div>
        <div class="relative z-10 max-w-4xl mx-auto px-5 text-center" style="padding-top:16vh">
          <p class="text-[#00E5FF] text-xs font-bold tracking-[0.3em] uppercase mb-4 reveal reveal-fade">COMPARE GUIDES</p>
          <h1 class="text-3xl md:text-5xl font-black text-white mb-4 reveal reveal-fade text-split" style="transition-delay:0.2s">
            진료·재료·브랜드 비교 가이드
          </h1>
          <p class="text-white/40 text-sm md:text-base max-w-2xl mx-auto reveal reveal-fade" style="transition-delay:0.4s">
            임플란트 브랜드, 교정 종류, 보철 재료 — 어떤 게 좋을까?<br/>
            서울365치과가 환자 분들이 자주 궁금해하는 비교를 정리했습니다.
          </p>
        </div>
      </div>

      <div class="max-w-5xl mx-auto px-5 md:px-8 py-16 md:py-24">
        {Object.entries(grouped).map(([cat, items]) => (
          <div class="mb-16 reveal reveal-fade">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">{cat} 비교</h2>
            <div class="grid md:grid-cols-2 gap-4">
              {items.map(cmp => (
                <a href={`/compare/${cmp.slug}`} class="block p-6 rounded-2xl border border-gray-100 hover:border-[#0066FF]/30 hover:shadow-lg transition-all bg-white">
                  <div class="flex items-center gap-3 mb-3">
                    <span class="text-sm font-bold text-gray-900">{cmp.itemA}</span>
                    <span class="text-xs text-gray-400 px-2">VS</span>
                    <span class="text-sm font-bold text-gray-900">{cmp.itemB}</span>
                  </div>
                  <p class="text-sm text-gray-600 leading-relaxed">{cmp.description}</p>
                  <div class="mt-3 text-xs text-[#0066FF] font-bold">자세히 비교 →</div>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>,
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
    "datePublished": "2025-01-01",
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
    "reviewedBy": {
      "@type": "Person",
      "name": "박준규",
      "jobTitle": "대표원장",
      "worksFor": { "@type": "MedicalOrganization", "@id": "https://seoul365dc.kr/#dentist" },
      "alumniOf": { "@type": "EducationalOrganization", "name": "서울대학교 치과대학" },
    },
    "lastReviewed": "2026-05-26",
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
    <section class="min-h-screen bg-white">
      {/* Hero */}
      <div class="hero-premium" style="min-height:50vh">
        <div class="hero-grid"></div>
        <div class="orb orb-1"></div>
        <div class="relative z-10 max-w-4xl mx-auto px-5 text-center" style="padding-top:14vh">
          <p class="text-[#00E5FF] text-xs font-bold tracking-[0.3em] uppercase mb-4 reveal reveal-fade">{cmp.category} 비교</p>
          <h1 class="text-2xl md:text-4xl font-black text-white mb-4 reveal reveal-fade text-split" style="transition-delay:0.2s">
            {cmp.itemA} <span class="text-[#00E5FF] mx-2">VS</span> {cmp.itemB}
          </h1>
          <p class="text-white/50 text-sm md:text-base reveal reveal-fade max-w-2xl mx-auto" style="transition-delay:0.4s">
            {cmp.description}
          </p>
        </div>
      </div>

      <article class="max-w-4xl mx-auto px-5 md:px-8 py-16">
        {/* Breadcrumb */}
        <nav class="text-xs text-gray-400 mb-6">
          <a href="/" class="hover:text-[#0066FF]">홈</a>
          <span class="mx-2">›</span>
          <a href="/compare" class="hover:text-[#0066FF]">비교 가이드</a>
          <span class="mx-2">›</span>
          <span class="text-gray-700">{cmp.itemA} vs {cmp.itemB}</span>
        </nav>

        {/* Summary (Featured Snippet 타겟) */}
        <div class="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-[#E6F3FF] to-[#F0F8FF] border border-[#0066FF]/10 mb-10">
          <div class="flex items-center gap-2 text-[#0066FF] font-bold text-sm mb-3">
            <i class="fa-solid fa-bolt"></i>
            <span>한 줄 요약</span>
          </div>
          <p class="text-gray-900 leading-relaxed text-base md:text-lg">
            {cmp.summary}
          </p>
        </div>

        {/* 비교 표 */}
        <h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <i class="fa-solid fa-table-list text-[#0066FF]"></i>
          상세 비교표
        </h2>
        <div class="overflow-x-auto rounded-2xl border border-gray-100 mb-12">
          <table class="w-full text-sm">
            <thead>
              <tr class="bg-gray-50 border-b border-gray-100">
                <th class="px-4 py-3 text-left font-bold text-gray-500 text-xs uppercase tracking-wide">항목</th>
                <th class="px-4 py-3 text-left font-bold text-[#0066FF]">{cmp.itemA}</th>
                <th class="px-4 py-3 text-left font-bold text-[#2979FF]">{cmp.itemB}</th>
              </tr>
            </thead>
            <tbody>
              {cmp.rows.map((row, idx) => (
                <tr class={idx % 2 === 0 ? 'bg-white border-b border-gray-50' : 'bg-gray-50/30 border-b border-gray-50'}>
                  <td class="px-4 py-3 font-semibold text-gray-700">{row.criterion}</td>
                  <td class="px-4 py-3 text-gray-900">{row.valueA}</td>
                  <td class="px-4 py-3 text-gray-900">{row.valueB}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 추천 케이스 */}
        <div class="grid md:grid-cols-2 gap-5 mb-12">
          <div class="p-6 rounded-2xl border-2 border-[#0066FF]/20 bg-[#0066FF]/[0.02]">
            <div class="flex items-center gap-2 mb-3">
              <i class="fa-solid fa-circle-check text-[#0066FF]"></i>
              <h3 class="font-bold text-gray-900">{cmp.itemA} 추천</h3>
            </div>
            <p class="text-sm text-gray-700 leading-relaxed">{cmp.recommendA}</p>
          </div>
          <div class="p-6 rounded-2xl border-2 border-[#2979FF]/20 bg-[#2979FF]/[0.02]">
            <div class="flex items-center gap-2 mb-3">
              <i class="fa-solid fa-circle-check text-[#2979FF]"></i>
              <h3 class="font-bold text-gray-900">{cmp.itemB} 추천</h3>
            </div>
            <p class="text-sm text-gray-700 leading-relaxed">{cmp.recommendB}</p>
          </div>
        </div>

        {/* FAQ */}
        <div class="mb-12">
          <h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <i class="fa-solid fa-circle-question text-[#0066FF]"></i>
            자주 묻는 질문
          </h2>
          <div class="space-y-3">
            <details class="p-5 rounded-xl border border-gray-100 group">
              <summary class="font-semibold text-gray-900 cursor-pointer flex justify-between items-center">
                <span>{cmp.itemA}와 {cmp.itemB}의 차이는 무엇인가요?</span>
                <i class="fa-solid fa-chevron-down text-xs text-gray-400 group-open:rotate-180 transition-transform"></i>
              </summary>
              <p class="mt-3 text-sm text-gray-600 leading-relaxed">{cmp.summary}</p>
            </details>
            <details class="p-5 rounded-xl border border-gray-100 group">
              <summary class="font-semibold text-gray-900 cursor-pointer flex justify-between items-center">
                <span>{cmp.itemA}는 어떤 사람에게 추천되나요?</span>
                <i class="fa-solid fa-chevron-down text-xs text-gray-400 group-open:rotate-180 transition-transform"></i>
              </summary>
              <p class="mt-3 text-sm text-gray-600 leading-relaxed">{cmp.recommendA}</p>
            </details>
            <details class="p-5 rounded-xl border border-gray-100 group">
              <summary class="font-semibold text-gray-900 cursor-pointer flex justify-between items-center">
                <span>{cmp.itemB}는 어떤 사람에게 추천되나요?</span>
                <i class="fa-solid fa-chevron-down text-xs text-gray-400 group-open:rotate-180 transition-transform"></i>
              </summary>
              <p class="mt-3 text-sm text-gray-600 leading-relaxed">{cmp.recommendB}</p>
            </details>
          </div>
        </div>

        {/* E-E-A-T 검토자 */}
        <div class="p-6 rounded-2xl bg-gray-50 border border-gray-100 mb-12">
          <div class="flex items-start gap-4">
            <div class="w-12 h-12 rounded-full bg-gradient-to-br from-[#0066FF] to-[#2979FF] flex items-center justify-center shrink-0">
              <i class="fa-solid fa-user-doctor text-white"></i>
            </div>
            <div>
              <div class="text-xs text-gray-500 mb-1">의료진 검토</div>
              <div class="font-bold text-gray-900">박준규 대표원장</div>
              <div class="text-sm text-gray-600 mt-1">
                <i class="fa-solid fa-graduation-cap mr-1 text-[#0066FF]"></i>
                서울대학교 치과대학 출신 · 대한치과의사협회 정회원
              </div>
              <div class="text-xs text-gray-400 mt-2">마지막 검토: 2026-05-26</div>
            </div>
          </div>
        </div>

        {/* 관련 비교 */}
        {related.length > 0 && (
          <div class="mb-12">
            <h2 class="text-lg font-bold text-gray-900 mb-4">관련 비교</h2>
            <div class="grid md:grid-cols-3 gap-3">
              {related.map(r => (
                <a href={`/compare/${r.slug}`} class="block p-4 rounded-xl border border-gray-100 hover:border-[#0066FF]/30 hover:bg-gray-50 transition-all">
                  <div class="text-sm font-semibold text-gray-900">{r.itemA} vs {r.itemB}</div>
                  <div class="text-xs text-gray-500 mt-1">자세히 보기 →</div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div class="p-8 rounded-3xl bg-gradient-to-br from-[#0066FF] to-[#2979FF] text-white text-center">
          <h3 class="text-xl md:text-2xl font-black mb-2">어떤 게 맞을지 모르시겠다면?</h3>
          <p class="text-white/80 text-sm mb-5">서울대 출신 5인 전문의의 무료 상담을 받아보세요.</p>
          <div class="flex flex-wrap justify-center gap-2">
            <a href="/reservation" class="px-5 py-3 rounded-xl bg-white text-[#0066FF] font-bold text-sm hover:scale-105 transition-all">
              <i class="fa-solid fa-calendar-check mr-1.5"></i> 무료 상담 예약
            </a>
            <a href={CLINIC.phoneTel} class="px-5 py-3 rounded-xl bg-white/10 border border-white/30 text-white font-bold text-sm hover:bg-white/20 transition-all">
              <i class="fa-solid fa-phone mr-1.5"></i> {CLINIC.phone}
            </a>
          </div>
        </div>
      </article>
    </section>,
    {
      title: cmp.title,
      description: cmp.description,
      canonical: canonicalUrl,
      keywords: cmp.keywords.join(', '),
      ogType: 'article',
      datePublished: '2025-01-01',
      dateModified: '2026-05-26',
      articleSection: cmp.category,
      articleTags: cmp.keywords,
      jsonLd: [articleSchema, faqSchema, breadcrumb],
    }
  );
});

export default compareRoutes
