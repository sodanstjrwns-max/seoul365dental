// ============================================================
// 🧠 v3 SUPER UPGRADE — AI Answer Hub
// AI 검색(SGE / Perplexity / ChatGPT / Claude)이 인용하기 좋은
// 구조화된 Q&A 페이지 + QAPage JSON-LD + E-E-A-T 시그널
// ============================================================
import { Hono } from 'hono'
import type { Bindings } from '../lib/types'
import { ANSWER_HUB, type AnswerEntry } from '../data/answer-hub'
import { CLINIC } from '../data/clinic'

const answersRoutes = new Hono<{ Bindings: Bindings }>()

// 카테고리별 아이콘
const CATEGORY_ICON: Record<string, string> = {
  '임플란트': 'fa-tooth',
  '교정': 'fa-teeth-open',
  '인비절라인': 'fa-grin',
  '수면진료': 'fa-bed',
  '미백': 'fa-smile',
  '심미': 'fa-star',
  '소아': 'fa-baby',
  '응급': 'fa-truck-medical',
  '비용': 'fa-coins',
  '병원소개': 'fa-hospital',
};

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
        "dateCreated": "2025-01-01",
        "upvoteCount": 50,
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

  return c.render(
    <section class="min-h-screen bg-white">
      {/* Hero */}
      <div class="hero-premium" style="min-height:50vh">
        <div class="hero-grid"></div>
        <div class="orb orb-1"></div>
        <div class="orb orb-2"></div>
        <div class="relative z-10 max-w-4xl mx-auto px-5 text-center" style="padding-top:16vh">
          <p class="text-[#00E5FF] text-xs font-bold tracking-[0.3em] uppercase mb-4 reveal reveal-fade">AI ANSWER HUB</p>
          <h1 class="text-3xl md:text-5xl font-black text-white mb-4 reveal reveal-fade text-split" style="transition-delay:0.2s">
            서울365치과 베스트 답변 모음
          </h1>
          <p class="text-white/40 text-sm md:text-base max-w-2xl mx-auto reveal reveal-fade" style="transition-delay:0.4s">
            임플란트·교정·인비절라인·수면진료 등 가장 많이 묻는 질문에<br/>
            서울대 출신 5인 전문의가 직접 답변합니다. ({ANSWER_HUB.length}개 답변)
          </p>
        </div>
      </div>

      {/* 카테고리별 Q&A */}
      <div class="max-w-5xl mx-auto px-5 md:px-8 py-16 md:py-24">
        {categoryOrder.filter(cat => grouped[cat]).map((cat) => {
          const entries = grouped[cat];
          const icon = CATEGORY_ICON[cat] || 'fa-circle-question';
          return (
            <div class="mb-16 reveal reveal-fade">
              <div class="flex items-center gap-3 mb-6">
                <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0066FF] to-[#2979FF] flex items-center justify-center">
                  <i class={`fa-solid ${icon} text-white text-lg`}></i>
                </div>
                <div>
                  <h2 class="text-2xl font-bold text-gray-900">{cat}</h2>
                  <p class="text-xs text-gray-400">{entries.length}개 답변</p>
                </div>
              </div>
              <div class="space-y-3">
                {entries.map(entry => (
                  <a
                    href={`/answers/${questionToSlug(entry)}`}
                    class="block p-6 rounded-2xl border border-gray-100 hover:border-[#0066FF]/30 hover:shadow-lg transition-all bg-white"
                  >
                    <h3 class="text-base md:text-lg font-bold text-gray-900 mb-2 flex items-start gap-2">
                      <i class="fa-solid fa-circle-question text-[#0066FF] text-sm mt-1.5 shrink-0"></i>
                      <span>{entry.question}</span>
                    </h3>
                    <p class="text-sm text-gray-600 leading-relaxed pl-6">{entry.shortAnswer}</p>
                    <div class="flex items-center gap-2 mt-3 pl-6 text-xs text-gray-400">
                      <i class="fa-solid fa-user-doctor"></i>
                      <span>검토: {entry.reviewedBy}</span>
                      <span class="mx-1">·</span>
                      <span>{entry.lastReviewed}</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          );
        })}

        {/* CTA */}
        <div class="mt-20 p-8 md:p-12 rounded-3xl bg-gradient-to-br from-[#0066FF] to-[#2979FF] text-white text-center reveal reveal-fade">
          <h3 class="text-2xl md:text-3xl font-black mb-3">더 궁금한 점이 있으신가요?</h3>
          <p class="text-white/80 mb-6">서울대 출신 5인 전문의가 1:1 무료 상담을 도와드립니다.</p>
          <div class="flex flex-wrap justify-center gap-3">
            <a href="/reservation" class="px-6 py-3 rounded-xl bg-white text-[#0066FF] font-bold hover:scale-105 transition-all">
              <i class="fa-solid fa-calendar-check mr-2"></i> 무료 상담 예약
            </a>
            <a href={CLINIC.phoneTel} class="px-6 py-3 rounded-xl bg-white/10 border border-white/30 text-white font-bold hover:bg-white/20 transition-all">
              <i class="fa-solid fa-phone mr-2"></i> {CLINIC.phone}
            </a>
          </div>
        </div>
      </div>
    </section>,
    {
      title: `자주 묻는 질문 ${ANSWER_HUB.length}선 | 서울365치과 AI Answer Hub`,
      description: `인천 구월동 서울365치과 자주 묻는 질문 ${ANSWER_HUB.length}선. 임플란트 가격, 인비절라인 비용, 수면진료, 보험 적용까지 서울대 출신 전문의가 직접 답변. AI 검색 최적화.`,
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

  const icon = CATEGORY_ICON[entry.category] || 'fa-circle-question';
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
      "dateCreated": "2025-01-01",
      "author": {
        "@type": "Organization",
        "name": "서울365치과의원 환자",
      },
      "acceptedAnswer": {
        "@type": "Answer",
        "text": entry.detailedAnswer,
        "dateCreated": entry.lastReviewed,
        "url": canonicalUrl,
        "upvoteCount": 100,
        "author": {
          "@type": "MedicalOrganization",
          "@id": "https://seoul365dc.kr/#dentist",
          "name": "서울365치과의원",
          "url": "https://seoul365dc.kr",
        }
      }
    }
  };

  // === 🏅 E-E-A-T Article Schema with Reviewer (무기 2) ===
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    "@id": `${canonicalUrl}#article`,
    "headline": entry.question,
    "description": entry.shortAnswer,
    "url": canonicalUrl,
    "datePublished": "2025-01-01",
    "dateModified": entry.lastReviewed,
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
    "reviewedBy": {
      "@type": "Person",
      "name": entry.reviewedBy.split('(')[0].trim(),
      "jobTitle": "대표원장",
      "worksFor": {
        "@type": "MedicalOrganization",
        "@id": "https://seoul365dc.kr/#dentist",
        "name": "서울365치과의원"
      },
      "memberOf": {
        "@type": "Organization",
        "name": "대한치과의사협회"
      },
      "alumniOf": {
        "@type": "EducationalOrganization",
        "name": "서울대학교 치과대학"
      },
    },
    "lastReviewed": entry.lastReviewed,
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
    <section class="min-h-screen bg-white">
      {/* Hero */}
      <div class="hero-premium" style="min-height:45vh">
        <div class="hero-grid"></div>
        <div class="orb orb-1"></div>
        <div class="relative z-10 max-w-3xl mx-auto px-5" style="padding-top:14vh">
          <div class="flex items-center gap-2 text-[#00E5FF] text-xs font-bold tracking-[0.3em] uppercase mb-4 reveal reveal-fade">
            <i class={`fa-solid ${icon}`}></i>
            <span>{entry.category}</span>
          </div>
          <h1 class="text-2xl md:text-4xl font-black text-white mb-4 reveal reveal-fade text-split" style="transition-delay:0.2s">
            {entry.question}
          </h1>
          <p class="text-white/60 text-sm md:text-base reveal reveal-fade" style="transition-delay:0.4s">
            {entry.shortAnswer}
          </p>
        </div>
      </div>

      {/* 본문 */}
      <article class="max-w-3xl mx-auto px-5 md:px-8 py-16">
        {/* Breadcrumb */}
        <nav class="text-xs text-gray-400 mb-6">
          <a href="/" class="hover:text-[#0066FF]">홈</a>
          <span class="mx-2">›</span>
          <a href="/answers" class="hover:text-[#0066FF]">Answer Hub</a>
          <span class="mx-2">›</span>
          <span class="text-gray-700">{entry.category}</span>
        </nav>

        {/* 짧은 답변 (피처드 스니펫 타겟) */}
        <div class="p-6 rounded-2xl bg-gradient-to-br from-[#E6F3FF] to-[#F0F8FF] border border-[#0066FF]/10 mb-8" itemscope itemtype="https://schema.org/Answer">
          <div class="flex items-center gap-2 text-[#0066FF] font-bold text-sm mb-2">
            <i class="fa-solid fa-bolt"></i>
            <span>한 줄 답변</span>
          </div>
          <p class="text-gray-900 font-semibold text-base md:text-lg leading-relaxed" itemprop="text">
            {entry.shortAnswer}
          </p>
        </div>

        {/* 상세 답변 */}
        <div class="prose prose-lg max-w-none mb-8">
          <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <i class="fa-solid fa-circle-info text-[#0066FF]"></i>
            상세 답변
          </h2>
          <p class="text-gray-700 leading-loose whitespace-pre-line">
            {entry.detailedAnswer}
          </p>
        </div>

        {/* E-E-A-T 시그널 (검토 정보) */}
        <div class="p-6 rounded-2xl bg-gray-50 border border-gray-100 mb-8">
          <div class="flex items-start gap-4">
            <div class="w-12 h-12 rounded-full bg-gradient-to-br from-[#0066FF] to-[#2979FF] flex items-center justify-center shrink-0">
              <i class="fa-solid fa-user-doctor text-white"></i>
            </div>
            <div class="flex-1">
              <div class="text-xs text-gray-500 mb-1">의료진 검토</div>
              <div class="font-bold text-gray-900">{entry.reviewedBy}</div>
              <div class="text-sm text-gray-600 mt-1">
                <i class="fa-solid fa-graduation-cap mr-1 text-[#0066FF]"></i>
                서울대학교 치과대학 출신 · 대한치과의사협회 정회원
              </div>
              <div class="text-xs text-gray-400 mt-2">
                <i class="fa-solid fa-calendar-check mr-1"></i>
                마지막 검토: {entry.lastReviewed}
              </div>
            </div>
          </div>
        </div>

        {/* 관련 페이지 링크 */}
        {entry.relatedUrl && (
          <a href={entry.relatedUrl} class="block p-5 rounded-2xl border border-[#0066FF]/20 hover:border-[#0066FF]/50 hover:bg-[#0066FF]/5 transition-all mb-8">
            <div class="flex items-center justify-between">
              <div>
                <div class="text-xs text-[#0066FF] font-bold mb-1">관련 진료 안내</div>
                <div class="text-gray-900 font-semibold">자세한 진료 정보 보기</div>
              </div>
              <i class="fa-solid fa-arrow-right text-[#0066FF]"></i>
            </div>
          </a>
        )}

        {/* 키워드 태그 */}
        <div class="flex flex-wrap gap-2 mb-12">
          {entry.keywords.map(kw => (
            <span class="px-3 py-1 rounded-full bg-gray-100 text-xs text-gray-600">#{kw}</span>
          ))}
        </div>

        {/* 관련 답변 */}
        {related.length > 0 && (
          <div class="mb-12">
            <h2 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <i class="fa-solid fa-link text-[#0066FF]"></i>
              관련 질문
            </h2>
            <div class="space-y-2">
              {related.map(r => (
                <a href={`/answers/${questionToSlug(r)}`} class="block p-4 rounded-xl border border-gray-100 hover:border-[#0066FF]/30 hover:bg-gray-50 transition-all">
                  <div class="text-sm font-semibold text-gray-900">{r.question}</div>
                  <div class="text-xs text-gray-500 mt-1">{r.shortAnswer.slice(0, 60)}...</div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div class="p-8 rounded-3xl bg-gradient-to-br from-[#0066FF] to-[#2979FF] text-white text-center">
          <h3 class="text-xl md:text-2xl font-black mb-2">정확한 진단이 필요하신가요?</h3>
          <p class="text-white/80 text-sm mb-5">서울365치과에서 무료 상담을 받아보세요.</p>
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
      title: `${entry.question} | 서울365치과 답변`,
      description: `${entry.shortAnswer} - 서울대 출신 5인 전문의가 직접 답변합니다.`,
      canonical: canonicalUrl,
      keywords: entry.keywords.join(', '),
      ogType: 'article',
      datePublished: '2025-01-01',
      dateModified: entry.lastReviewed,
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
