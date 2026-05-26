// ============================================================
// 🚀 v4 SUPER UPGRADE — Events Calendar (Weapon 10)
// Event JSON-LD로 시즌 이벤트/할인 행사 키워드 타겟
// ============================================================
import { Hono } from 'hono';
import type { Bindings } from '../lib/types';

const app = new Hono<{ Bindings: Bindings }>();
const SITE_URL = 'https://seoul365dc.kr';

interface DentalEvent {
  slug: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  /** 할인율 또는 핵심 혜택 */
  benefit: string;
  /** 적용 진료 */
  category: '임플란트' | '교정' | '인비절라인' | '미백' | '스케일링' | '심미' | '소아' | '전체';
  /** 검색 키워드 */
  keywords: string;
  /** 이벤트 상세 */
  details: string[];
}

// 분기별 시즌 이벤트 — 매번 갱신
const EVENTS: DentalEvent[] = [
  {
    slug: 'summer-implant-2026',
    name: '여름 임플란트 할인 이벤트 (2026 여름)',
    description: '오스템 임플란트 64만원 특별가 + 수면진료 30% 할인. 만 65세 이상 건강보험 동시 적용 가능.',
    startDate: '2026-06-01',
    endDate: '2026-08-31',
    benefit: '오스템 64만원 · 수면진료 30% 할인',
    category: '임플란트',
    keywords: '여름 임플란트 이벤트, 인천 임플란트 할인, 구월동 임플란트 이벤트, 오스템 임플란트 가격',
    details: [
      '오스템 이벤트 임플란트 1개 64만원 (정가 89만원 → 28% 할인)',
      '수면진료 동시 진행 시 진정관리비 30% 할인 (20만원 → 14만원)',
      '만 65세 이상 건강보험 동시 적용 가능 (1인 평생 2개 한도)',
      '네비게이션 가이드 수술 +10만원 별도',
      '카드 무이자 6개월 할부 가능',
    ],
  },
  {
    slug: 'spring-orthodontics-2026',
    name: '봄 신학기 교정 이벤트 (2026 봄)',
    description: '새 학기 새 시작 — 인비절라인 50만원 할인 + 메탈교정 무이자 12개월.',
    startDate: '2026-03-01',
    endDate: '2026-05-31',
    benefit: '인비절라인 50만원 할인 · 메탈교정 무이자 12개월',
    category: '교정',
    keywords: '봄 교정 이벤트, 신학기 교정 할인, 인비절라인 할인, 학생 교정 비용',
    details: [
      '인비절라인 풀패키지 50만원 할인 (정가 700만원 → 650만원)',
      '메탈교정 카드 무이자 12개월 할부 (월 25만원~)',
      '중·고·대학생 신분증 확인 시 추가 검진비 면제',
      '아이테로 3D 스캔 무료',
      '교정 종료 후 유지장치 1세트 무료 제공',
    ],
  },
  {
    slug: 'winter-whitening-2026',
    name: '결혼 시즌 미백 이벤트 (2026 가을·겨울)',
    description: '결혼·취업 시즌 맞이 치아미백 30% 할인 + 자가미백 키트 무료 증정.',
    startDate: '2026-09-01',
    endDate: '2026-12-31',
    benefit: '치과미백 30% 할인 · 자가미백 키트 무료',
    category: '미백',
    keywords: '치아미백 이벤트, 결혼 미백 할인, 인천 미백 잘하는곳, 자가미백 키트',
    details: [
      '오피스 미백(병원 시술) 30% 할인 (30만원 → 21만원)',
      '자가미백 키트 무료 제공 (8주 풀세트)',
      '결혼식 1개월 전 진행 시 셀카 자신감 UP',
      '취업 면접 사진 촬영 전 추천',
      '미백 후 셰이드 측정 무료',
    ],
  },
  {
    slug: 'kids-checkup-2026',
    name: '어린이 정기검진 이벤트 (상시)',
    description: '어린이 구강검진 + 불소도포 + 실란트 패키지 50% 할인.',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    benefit: '소아 구강검진 패키지 50% 할인',
    category: '소아',
    keywords: '소아치과 이벤트, 어린이 불소도포, 인천 소아치과, 실란트 비용',
    details: [
      '구강검진 + 불소도포 + 실란트 패키지 50% 할인',
      '만 18세 이하 대상 (학생증 또는 가족관계증명서)',
      '어린이 영상 시청 가능한 진료실 운영',
      '구강건강 가이드북 무료 제공',
      '주말·공휴일 가능',
    ],
  },
];

// ── /events 인덱스 ──
app.get('/events', (c) => {
  const canonicalUrl = `${SITE_URL}/events`;

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: '서울365치과 진행중 이벤트',
    numberOfItems: EVENTS.length,
    itemListElement: EVENTS.map((e, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: e.name,
      url: `${SITE_URL}/events/${e.slug}`,
    })),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '홈', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: '이벤트', item: canonicalUrl },
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
          <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/30 text-red-300 text-xs mb-4">
            <i class="fas fa-fire"></i> 진행중 이벤트
          </div>
          <h1 class="text-4xl md:text-5xl font-black gradient-text-white leading-tight mb-4">
            서울365치과 진행중 이벤트
          </h1>
          <p class="text-white/60 text-lg">
            시즌별 할인 · 카드 무이자 할부 · 가족 패키지 혜택
          </p>
        </div>
      </section>

      <section class="bg-gray-50 py-12">
        <div class="max-w-5xl mx-auto px-5">
          <div class="grid md:grid-cols-2 gap-5">
            {EVENTS.map((e) => (
              <a href={`/events/${e.slug}`} class="block bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition">
                <div class="p-6">
                  <div class="flex items-center gap-2 mb-3">
                    <span class="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">{e.category}</span>
                    <span class="text-xs text-gray-500">{e.startDate} ~ {e.endDate}</span>
                  </div>
                  <h2 class="text-xl font-bold text-gray-900 mb-2">{e.name}</h2>
                  <p class="text-sm text-gray-600 mb-4 leading-relaxed">{e.description}</p>
                  <div class="p-3 bg-red-50 rounded-lg border border-red-100">
                    <div class="text-xs text-red-600 font-bold mb-1">혜택</div>
                    <div class="text-sm font-bold text-red-700">{e.benefit}</div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>,
    {
      title: '서울365치과 진행중 이벤트 — 임플란트·교정·미백·소아 시즌 할인 | 인천 구월동',
      description: '서울365치과 시즌별 진행 이벤트. 여름 임플란트 64만원, 봄 교정 50만원 할인, 결혼 시즌 미백 30%, 소아 패키지 50% 할인.',
      keywords: '서울365치과 이벤트, 인천 임플란트 할인, 구월동 임플란트 이벤트, 인비절라인 할인',
      canonical: canonicalUrl,
    }
  );
});

// ── /events/:slug 상세 (Event JSON-LD) ──
app.get('/events/:slug', (c) => {
  const slug = c.req.param('slug');
  const ev = EVENTS.find((e) => e.slug === slug);
  if (!ev) return c.notFound();

  const canonicalUrl = `${SITE_URL}/events/${slug}`;

  // Event Schema — Google 검색결과 이벤트 카드 노출
  const eventSchema = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: ev.name,
    description: ev.description,
    startDate: ev.startDate,
    endDate: ev.endDate,
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    location: {
      '@type': 'Place',
      name: '서울365치과의원',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '인천 남동구 인하로507번길 7 9층',
        addressLocality: '인천광역시',
        addressRegion: '남동구',
        postalCode: '21577',
        addressCountry: 'KR',
      },
    },
    image: `${SITE_URL}/static/og-image.jpg`,
    organizer: {
      '@type': 'Organization',
      name: '서울365치과의원',
      url: SITE_URL,
    },
    offers: {
      '@type': 'Offer',
      url: canonicalUrl,
      availability: 'https://schema.org/InStock',
      priceCurrency: 'KRW',
      validFrom: ev.startDate,
      description: ev.benefit,
    },
  };

  const medicalSchema = {
    '@context': 'https://schema.org',
    '@type': 'MedicalWebPage',
    name: ev.name,
    description: ev.description,
    url: canonicalUrl,
    inLanguage: 'ko-KR',
    audience: { '@type': 'MedicalAudience', audienceType: 'Patient' },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '홈', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: '이벤트', item: `${SITE_URL}/events` },
      { '@type': 'ListItem', position: 3, name: ev.name, item: canonicalUrl },
    ],
  };

  return c.render(
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(medicalSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <section class="hero-premium" style="min-height:40vh">
        <div class="hero-grid"></div>
        <div class="orb orb-1"></div>
        <div class="relative z-10 max-w-4xl mx-auto px-5 pt-20 pb-12">
          <nav class="text-sm text-white/40 mb-4">
            <a href="/" class="hover:text-white">홈</a> ›{' '}
            <a href="/events" class="hover:text-white">이벤트</a> › {ev.category}
          </nav>
          <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/30 text-red-300 text-xs mb-4">
            <i class="fas fa-fire"></i> {ev.startDate} ~ {ev.endDate}
          </div>
          <h1 class="text-3xl md:text-4xl font-black gradient-text-white leading-tight mb-4">
            {ev.name}
          </h1>
          <p class="text-white/70 text-lg">{ev.description}</p>
        </div>
      </section>

      <section class="bg-white py-12">
        <div class="max-w-3xl mx-auto px-5">
          <div class="p-6 bg-red-50 rounded-2xl border-2 border-red-200 mb-8">
            <div class="text-xs text-red-600 font-bold mb-2">🎁 핵심 혜택</div>
            <div class="text-xl font-bold text-red-700">{ev.benefit}</div>
          </div>

          <h2 class="text-2xl font-bold text-gray-900 mb-4">상세 내용</h2>
          <ul class="space-y-3 mb-12">
            {ev.details.map((d) => (
              <li class="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                <i class="fas fa-check-circle text-green-500 mt-1"></i>
                <span class="text-gray-700">{d}</span>
              </li>
            ))}
          </ul>

          <div class="p-6 bg-blue-50 rounded-2xl text-center">
            <h3 class="text-xl font-bold text-gray-900 mb-2">이벤트 적용 상담받기</h3>
            <p class="text-gray-600 mb-4 text-sm">이벤트 종료 전 예약 시 혜택 적용 가능</p>
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
      title: ev.name + ' | 서울365치과',
      description: ev.description,
      keywords: ev.keywords,
      canonical: canonicalUrl,
    }
  );
});

export function getAllEventSlugs(): string[] {
  return EVENTS.map((e) => e.slug);
}

export default app;
