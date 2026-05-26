// ============================================================
// 🚀 v4 SUPER UPGRADE — Reviews Routes (Weapon 8)
// AggregateRating + Review JSON-LD로 ⭐ 별점 리치 스니펫 노출
// ============================================================
import { Hono } from 'hono';
import type { Bindings } from '../lib/types';
import { REVIEWS, AGGREGATE_RATING, RATING_BY_CATEGORY, getReviewsByCategory } from '../data/reviews';

const app = new Hono<{ Bindings: Bindings }>();

const SITE_URL = 'https://seoul365dc.kr';

// ============================================================
// /reviews — 리뷰 인덱스 페이지
// ============================================================
app.get('/reviews', (c) => {
  const canonicalUrl = `${SITE_URL}/reviews`;

  // AggregateRating JSON-LD + Dentist 결합
  const aggregateSchema = {
    '@context': 'https://schema.org',
    '@type': 'Dentist',
    name: '서울365치과의원',
    url: SITE_URL,
    image: `${SITE_URL}/static/og-image.jpg`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: '인천 남동구 인하로507번길 7 9층',
      addressLocality: '인천광역시',
      addressRegion: '남동구',
      postalCode: '21577',
      addressCountry: 'KR',
    },
    telephone: '+82-32-432-0365',
    priceRange: '₩₩',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: AGGREGATE_RATING.ratingValue,
      bestRating: AGGREGATE_RATING.bestRating,
      worstRating: AGGREGATE_RATING.worstRating,
      reviewCount: AGGREGATE_RATING.reviewCount,
    },
    review: REVIEWS.slice(0, 12).map((r) => ({
      '@type': 'Review',
      author: { '@type': 'Person', name: r.author },
      datePublished: r.date,
      reviewBody: r.body,
      name: r.title,
      reviewRating: {
        '@type': 'Rating',
        ratingValue: r.rating,
        bestRating: 5,
        worstRating: 1,
      },
      itemReviewed: {
        '@type': 'Dentist',
        name: '서울365치과의원',
      },
    })),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '홈', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: '환자 후기', item: canonicalUrl },
    ],
  };

  return c.render(
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(aggregateSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <section class="hero-premium" style="min-height:40vh">
        <div class="hero-grid"></div>
        <div class="orb orb-1"></div>
        <div class="relative z-10 max-w-5xl mx-auto px-5 pt-20 pb-12 text-center">
          <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 text-xs mb-4">
            <i class="fas fa-star"></i> 누적 평점 {AGGREGATE_RATING.ratingValue.toFixed(1)}/5.0
          </div>
          <h1 class="text-4xl md:text-5xl font-black gradient-text-white leading-tight mb-4">
            서울365치과 환자 후기
          </h1>
          <p class="text-white/60 text-lg">
            {AGGREGATE_RATING.reviewCount.toLocaleString()}+ 환자의 진솔한 리뷰 · 네이버·구글·카카오·인스타 종합
          </p>
          <div class="flex justify-center items-center gap-1 mt-6 text-3xl text-yellow-400">
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
            <i class="fas fa-star-half-alt"></i>
            <span class="text-white text-2xl ml-3 font-bold">{AGGREGATE_RATING.ratingValue.toFixed(1)}</span>
          </div>
        </div>
      </section>

      <section class="bg-gray-50 py-12">
        <div class="max-w-6xl mx-auto px-5">
          {/* 카테고리별 평점 카드 */}
          <h2 class="text-2xl font-bold text-gray-900 mb-6">진료 분야별 평점</h2>
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-12">
            {Object.entries(RATING_BY_CATEGORY).map(([cat, stat]) => (
              <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
                <div class="text-xs text-gray-500 mb-1">{cat}</div>
                <div class="text-2xl font-bold text-blue-600">{stat.avg.toFixed(2)}</div>
                <div class="text-xs text-yellow-500 mt-1">
                  <i class="fas fa-star"></i> {stat.count}건
                </div>
              </div>
            ))}
          </div>

          {/* 리뷰 리스트 */}
          <h2 class="text-2xl font-bold text-gray-900 mb-6">최신 리뷰</h2>
          <div class="grid md:grid-cols-2 gap-5">
            {REVIEWS.map((r) => (
              <article class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <header class="flex justify-between items-start mb-3">
                  <div>
                    <div class="font-bold text-gray-900">{r.author}</div>
                    <div class="text-xs text-gray-500 mt-0.5">
                      {r.date} · {r.source} · {r.category}
                      {r.doctor && <> · {r.doctor} 원장</>}
                    </div>
                  </div>
                  <div class="text-yellow-500">
                    {Array.from({ length: r.rating }).map(() => (
                      <i class="fas fa-star text-sm"></i>
                    ))}
                  </div>
                </header>
                <h3 class="font-bold text-gray-900 mb-2">{r.title}</h3>
                <p class="text-sm text-gray-700 leading-relaxed">{r.body}</p>
                {r.area && (
                  <div class="mt-3 text-xs text-blue-600">
                    <i class="fas fa-map-marker-alt"></i> {r.area}
                  </div>
                )}
              </article>
            ))}
          </div>

          <div class="mt-12 p-6 bg-blue-50 rounded-2xl text-center border border-blue-100">
            <h3 class="text-xl font-bold text-gray-900 mb-2">실제 환자 리뷰 더 보기</h3>
            <p class="text-gray-600 mb-4">네이버 플레이스 · 구글 비즈니스 · 카카오맵에서 검증된 후기 확인</p>
            <div class="flex flex-wrap justify-center gap-3">
              <a href="tel:032-432-0365" class="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700">
                <i class="fas fa-phone"></i> 032-432-0365
              </a>
              <a href="/reservation" class="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-blue-600 text-blue-600 rounded-full font-bold hover:bg-blue-50">
                <i class="fas fa-calendar"></i> 온라인 예약
              </a>
            </div>
          </div>
        </div>
      </section>
    </>,
    {
      title: '서울365치과 환자 후기 — 평점 4.9/5.0 (2,156+ 리뷰) | 인천 구월동',
      description: `서울365치과 누적 평점 ${AGGREGATE_RATING.ratingValue}/5.0, ${AGGREGATE_RATING.reviewCount.toLocaleString()}+ 환자 후기. 임플란트·교정·인비절라인·수면진료·미백 분야별 실제 환자 리뷰. 네이버·구글·카카오 검증.`,
      keywords: '서울365치과 후기, 구월동 임플란트 후기, 인천 치과 추천, 임플란트 잘하는곳, 수면진료 후기, 인비절라인 후기',
      canonical: canonicalUrl,
      ogImage: `${SITE_URL}/static/og-image.jpg`,
    }
  );
});

// ============================================================
// /reviews/:category — 카테고리별 리뷰 (임플란트/교정 등)
// ============================================================
const CATEGORY_SLUG_MAP: Record<string, string> = {
  'implant': '임플란트',
  'orthodontics': '교정',
  'invisalign': '인비절라인',
  'sedation': '수면진료',
  'whitening': '미백',
  'cosmetic': '심미',
  'pediatric': '소아',
  'emergency': '응급',
  'scaling': '스케일링',
};

app.get('/reviews/:slug', (c) => {
  const slug = c.req.param('slug');
  const koCategory = CATEGORY_SLUG_MAP[slug];
  if (!koCategory) return c.notFound();

  const categoryReviews = getReviewsByCategory(koCategory);
  if (categoryReviews.length === 0) return c.notFound();

  const stat = RATING_BY_CATEGORY[koCategory] || { count: categoryReviews.length, avg: 4.9 };
  const canonicalUrl = `${SITE_URL}/reviews/${slug}`;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'MedicalWebPage',
    name: `서울365치과 ${koCategory} 환자 후기`,
    url: canonicalUrl,
    description: `서울365치과 ${koCategory} 진료 환자 ${stat.count}+ 건의 실제 후기. 평균 평점 ${stat.avg}/5.0`,
    inLanguage: 'ko-KR',
    isPartOf: { '@type': 'WebSite', name: '서울365치과의원', url: SITE_URL },
    mainEntity: {
      '@type': 'Dentist',
      name: '서울365치과의원',
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: stat.avg,
        bestRating: 5,
        worstRating: 1,
        reviewCount: stat.count,
      },
      review: categoryReviews.map((r) => ({
        '@type': 'Review',
        author: { '@type': 'Person', name: r.author },
        datePublished: r.date,
        reviewBody: r.body,
        name: r.title,
        reviewRating: {
          '@type': 'Rating',
          ratingValue: r.rating,
          bestRating: 5,
        },
      })),
    },
    audience: { '@type': 'MedicalAudience', audienceType: 'Patient' },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '홈', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: '환자 후기', item: `${SITE_URL}/reviews` },
      { '@type': 'ListItem', position: 3, name: koCategory, item: canonicalUrl },
    ],
  };

  return c.render(
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <section class="hero-premium" style="min-height:40vh">
        <div class="hero-grid"></div>
        <div class="orb orb-1"></div>
        <div class="relative z-10 max-w-4xl mx-auto px-5 pt-20 pb-12">
          <nav class="text-sm text-white/40 mb-4">
            <a href="/" class="hover:text-white">홈</a> ›{' '}
            <a href="/reviews" class="hover:text-white">후기</a> › {koCategory}
          </nav>
          <h1 class="text-4xl md:text-5xl font-black gradient-text-white leading-tight mb-4">
            서울365치과 {koCategory} 후기
          </h1>
          <p class="text-white/60 text-lg mb-2">
            평균 평점 <strong class="text-yellow-300">{stat.avg.toFixed(2)}/5.0</strong> · 누적 <strong class="text-yellow-300">{stat.count}+</strong> 건
          </p>
          <div class="flex items-center gap-1 text-2xl text-yellow-400">
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
            <i class="fas fa-star-half-alt"></i>
          </div>
        </div>
      </section>

      <section class="bg-gray-50 py-12">
        <div class="max-w-5xl mx-auto px-5">
          <div class="grid md:grid-cols-2 gap-5">
            {categoryReviews.map((r) => (
              <article class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <header class="flex justify-between items-start mb-3">
                  <div>
                    <div class="font-bold text-gray-900">{r.author}</div>
                    <div class="text-xs text-gray-500 mt-0.5">
                      {r.date} · {r.source}
                      {r.doctor && <> · {r.doctor} 원장</>}
                    </div>
                  </div>
                  <div class="text-yellow-500">
                    {Array.from({ length: r.rating }).map(() => (
                      <i class="fas fa-star text-sm"></i>
                    ))}
                  </div>
                </header>
                <h3 class="font-bold text-gray-900 mb-2">{r.title}</h3>
                <p class="text-sm text-gray-700 leading-relaxed">{r.body}</p>
              </article>
            ))}
          </div>

          <div class="mt-12 p-6 bg-blue-50 rounded-2xl text-center">
            <h3 class="text-xl font-bold text-gray-900 mb-3">{koCategory} 상담받기</h3>
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
      title: `서울365치과 ${koCategory} 환자 후기 ${stat.count}+건 · 평점 ${stat.avg}/5.0 | 인천 구월동`,
      description: `서울365치과 ${koCategory} 진료 실제 환자 후기 ${stat.count}+건, 평균 평점 ${stat.avg}/5.0. 진솔한 리뷰로 검증된 인천 구월동 치과.`,
      keywords: `서울365치과 ${koCategory} 후기, 인천 ${koCategory} 후기, 구월동 ${koCategory}, ${koCategory} 잘하는곳`,
      canonical: canonicalUrl,
    }
  );
});

export function getAllReviewCategorySlugs(): string[] {
  return Object.keys(CATEGORY_SLUG_MAP);
}

export default app;
