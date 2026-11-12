// ============================================================
// 🚀 v4 SUPER UPGRADE — Events Calendar (Weapon 10)
// Event JSON-LD로 시즌 이벤트/할인 행사 키워드 타겟
// ============================================================
import { Hono } from 'hono';
import type { Bindings } from '../lib/types';
import { Icon } from '../lib/icons';

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
    description: '오스템 임플란트 69만원 특별가 + 수면진료 30% 할인. 만 65세 이상 건강보험 동시 적용 가능.',
    startDate: '2026-06-01',
    endDate: '2026-08-31',
    benefit: '오스템 69만원 · 수면진료 30% 할인',
    category: '임플란트',
    keywords: '여름 임플란트 이벤트, 인천 임플란트 할인, 구월동 임플란트 이벤트, 오스템 임플란트 가격',
    details: [
      '오스템 이벤트 임플란트 1개 69만원 (정가 89만원 → 22% 할인)',
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

      {/* 히어로 — 오른쪽에 분야별 기간 사실 카드 */}
      <section class="phead" aria-labelledby="evl-h1">
        <div class="wrap phead-in">
          <div class="phead-text">
            <nav class="crumb" aria-label="현재 위치">
              <ol>
                <li><a href="/">홈</a></li>
                <li aria-current="page">이벤트</li>
              </ol>
            </nav>
            <p class="eyebrow">
              진행중 이벤트
            </p>
            <h1 id="evl-h1" class="display-xl evl-h1">
              서울365치과 진행중 이벤트
            </h1>
            <p class="lead">
              시즌별 할인 · 카드 무이자 할부 · 가족 패키지 혜택
            </p>
          </div>
          <div class="phead-aside">
            <div class="fact-card">
              <p class="eyebrow">Schedule</p>
              <dl class="fact-rows">
                {EVENTS.map((e) => (
                  <div><dt>{e.category}</dt><dd class="mono">{e.startDate} ~ {e.endDate}</dd></div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

      <section class="sec">
        <div class="wrap">
          <div class="evl-grid" data-rv-group>
            {EVENTS.map((e) => (
              <a href={`/events/${e.slug}`} class="card hover evl-card">
                <p class="evl-meta">
                  <span class="evl-cat">{e.category}</span>
                  <span class="mono">{e.startDate} ~ {e.endDate}</span>
                </p>
                <h2>{e.name}</h2>
                <p class="evl-desc">{e.description}</p>
                <div class="evl-benefit">
                  <span class="evl-benefit-k">혜택</span>
                  <b>{e.benefit}</b>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>,
    {
      title: '서울365치과 진행중 이벤트 — 임플란트·교정·미백·소아 시즌 할인 | 인천 구월동',
      description: '서울365치과 시즌별 진행 이벤트. 여름 임플란트 69만원, 봄 교정 50만원 할인, 결혼 시즌 미백 30%, 소아 패키지 50% 할인.',
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
        streetAddress: '예술로 138 이토타워 2층 212호',
        addressLocality: '인천광역시 남동구',
        addressRegion: '인천',
        postalCode: '21556',
        addressCountry: 'KR',
      },
    },
    image: `${SITE_URL}/static/og-image.jpg`,
    organizer: { '@id': 'https://seoul365dc.kr/#dentist' },
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

      {/* 히어로 — 오른쪽에 핵심 혜택 사실 카드 */}
      <section class="phead" aria-labelledby="evl-h1">
        <div class="wrap phead-in">
          <div class="phead-text">
            <nav class="crumb" aria-label="현재 위치">
              <ol>
                <li><a href="/">홈</a></li>
                <li><a href="/events">이벤트</a></li>
                <li aria-current="page">{ev.category}</li>
              </ol>
            </nav>
            <p class="eyebrow no-bar mono">
              <Icon name="clock" size={14} /> {ev.startDate} ~ {ev.endDate}
            </p>
            <h1 id="evl-h1" class="display-xl evl-h1">
              {ev.name}
            </h1>
            <p class="lead">{ev.description}</p>
            <div class="phead-cta">
              <a href="/reservation" class="btn btn-primary"><Icon name="calendar" />온라인 예약</a>
              <a href="tel:032-432-0365" class="btn btn-light mono"><Icon name="phone" />032-432-0365</a>
            </div>
          </div>
          <div class="phead-aside">
            <div class="fact-card evl-key">
              <p class="evl-key-k">핵심 혜택</p>
              <p class="evl-key-v">{ev.benefit}</p>
            </div>
          </div>
        </div>
      </section>

      <section class="sec">
        <div class="wrap-n">
          <div class="sec-head" data-rv>
            <p class="eyebrow">Details</p>
            <h2 class="display-2">상세 내용</h2>
          </div>
          <ul class="check-list evl-details" data-rv-group>
            {ev.details.map((d) => (
              <li>
                <Icon name="check" />
                <span>{d}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section class="cta-band" aria-label="상담 안내">
        <div class="wrap-n" style="text-align:center;position:relative">
          <h2 class="display-xl" data-rv>이벤트 적용 상담받기</h2>
          <p class="lead" data-rv>이벤트 종료 전 예약 시 혜택 적용 가능</p>
          <div class="cta-actions" data-rv-group>
            <a href="tel:032-432-0365" class="btn btn-white btn-lg mono">
              <Icon name="phone" /> 032-432-0365
            </a>
            <a href="/reservation" class="btn btn-primary btn-lg">
              <Icon name="calendar" /> 온라인 예약
            </a>
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
