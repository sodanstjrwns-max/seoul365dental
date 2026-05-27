// ============================================================
// 🎯 Schema.org JSON-LD Helper — v1
// 페이지별 스키마 빌더 공통 모듈
// ============================================================
import { CLINIC, HOURS_DETAIL } from '../data/clinic';
import { AGGREGATE_RATING } from '../data/reviews';

export const SITE_URL = 'https://seoul365dc.kr';
export const DENTIST_ID = `${SITE_URL}/#dentist`;

// ────────────────────────────────────────────────
// BreadcrumbList — 모든 하위 페이지에 권장
// ────────────────────────────────────────────────
export type BreadcrumbItem = { name: string; url: string };
export function buildBreadcrumb(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
}

// ────────────────────────────────────────────────
// FAQPage — 자주 묻는 질문 리치 결과
// ────────────────────────────────────────────────
export type FAQItem = { q: string; a: string };
export function buildFAQ(faqs: FAQItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

// ────────────────────────────────────────────────
// Service + Offer — 가격 페이지에 최적
// 가격 리치 결과를 노출시키는 핵심 스키마
// ────────────────────────────────────────────────
export type PriceTier = {
  name: string;
  price: number; // KRW
  priceMax?: number;
  description?: string;
};

export function buildServiceWithOffers(args: {
  url: string;
  name: string;
  description: string;
  serviceType: string; // e.g. '임플란트 시술'
  tiers: PriceTier[];
  faqs?: FAQItem[];
}) {
  const prices = args.tiers.map(t => t.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...args.tiers.map(t => t.priceMax || t.price));

  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${args.url}#service`,
    serviceType: args.serviceType,
    name: args.name,
    description: args.description,
    provider: { '@id': DENTIST_ID },
    areaServed: {
      '@type': 'GeoCircle',
      geoMidpoint: {
        '@type': 'GeoCoordinates',
        latitude: String(CLINIC.geo.lat),
        longitude: String(CLINIC.geo.lng),
      },
      geoRadius: '15000',
    },
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'KRW',
      lowPrice: String(minPrice),
      highPrice: String(maxPrice),
      offerCount: String(args.tiers.length),
      availability: 'https://schema.org/InStock',
      seller: { '@id': DENTIST_ID },
      offers: args.tiers.map(tier => ({
        '@type': 'Offer',
        name: tier.name,
        description: tier.description || tier.name,
        price: String(tier.price),
        priceCurrency: 'KRW',
        availability: 'https://schema.org/InStock',
        ...(tier.priceMax
          ? {
              priceSpecification: {
                '@type': 'PriceSpecification',
                minPrice: String(tier.price),
                maxPrice: String(tier.priceMax),
                priceCurrency: 'KRW',
              },
            }
          : {}),
        seller: { '@id': DENTIST_ID },
      })),
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: String(AGGREGATE_RATING.ratingValue),
      bestRating: String(AGGREGATE_RATING.bestRating),
      worstRating: String(AGGREGATE_RATING.worstRating),
      ratingCount: String(AGGREGATE_RATING.reviewCount),
      reviewCount: String(AGGREGATE_RATING.reviewCount),
    },
  };
}

// ────────────────────────────────────────────────
// MedicalProcedure — 진료 항목 페이지에 사용
// ────────────────────────────────────────────────
export type MedicalProcedureArgs = {
  url: string;
  name: string;
  description: string;
  bodyLocation?: string;
  howPerformed?: string;
  preparation?: string;
  followup?: string;
  procedureType?: 'Surgical' | 'NonSurgical' | 'Therapeutic';
};

export function buildMedicalProcedure(args: MedicalProcedureArgs) {
  const typeMap = {
    Surgical: 'https://schema.org/SurgicalProcedure',
    NonSurgical: 'https://schema.org/TherapeuticProcedure',
    Therapeutic: 'https://schema.org/TherapeuticProcedure',
  };
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalProcedure',
    '@id': `${args.url}#procedure`,
    name: args.name,
    description: args.description,
    procedureType: typeMap[args.procedureType || 'Therapeutic'],
    ...(args.bodyLocation ? { bodyLocation: args.bodyLocation } : {}),
    ...(args.howPerformed ? { howPerformed: args.howPerformed } : {}),
    ...(args.preparation ? { preparation: args.preparation } : {}),
    ...(args.followup ? { followup: args.followup } : {}),
    relevantSpecialty: {
      '@type': 'MedicalSpecialty',
      name: 'Dentistry',
    },
    performedBy: { '@id': DENTIST_ID },
  };
}

// ────────────────────────────────────────────────
// LocalBusiness extension — 야간진료 / 응급진료 강조용
// ────────────────────────────────────────────────
export function buildClinicWithEmphasis(args: {
  url: string;
  name: string;
  description: string;
  emphasis: 'emergency' | 'night' | 'standard';
  hoursOverride?: Array<{ dayOfWeek: string | string[]; opens: string; closes: string }>;
}) {
  const defaultHours = [
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'], opens: HOURS_DETAIL.mon.open, closes: HOURS_DETAIL.mon.close },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Friday', opens: HOURS_DETAIL.fri.open, closes: HOURS_DETAIL.fri.close },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Saturday', opens: HOURS_DETAIL.sat.open, closes: HOURS_DETAIL.sat.close },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Sunday', 'PublicHolidays'], opens: HOURS_DETAIL.sun.open, closes: HOURS_DETAIL.sun.close },
  ];

  const baseSchema: any = {
    '@context': 'https://schema.org',
    '@type': ['Dentist', 'MedicalClinic', 'LocalBusiness'],
    '@id': `${args.url}#localbusiness`,
    name: args.name,
    url: args.url,
    description: args.description,
    telephone: '+82-32-432-0365',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '예술로 138 이토타워 2층 212호',
      addressLocality: '인천광역시 남동구',
      addressRegion: '인천',
      postalCode: '21556',
      addressCountry: 'KR',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: String(CLINIC.geo.lat),
      longitude: String(CLINIC.geo.lng),
    },
    openingHoursSpecification: args.hoursOverride
      ? args.hoursOverride.map(h => ({ '@type': 'OpeningHoursSpecification', ...h }))
      : defaultHours,
    parentOrganization: { '@id': DENTIST_ID },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: String(AGGREGATE_RATING.ratingValue),
      bestRating: String(AGGREGATE_RATING.bestRating),
      worstRating: String(AGGREGATE_RATING.worstRating),
      ratingCount: String(AGGREGATE_RATING.reviewCount),
      reviewCount: String(AGGREGATE_RATING.reviewCount),
    },
  };

  if (args.emphasis === 'emergency') {
    baseSchema.knowsAbout = [
      '응급치과', '당일치과', '응급 임플란트', '치아 외상 처치', '치통 응급처치', '발치 후 출혈', '치근단 농양', '구월동 응급치과', '인천 응급치과',
    ];
    baseSchema.specialOpeningHoursSpecification = {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Sunday', 'PublicHolidays'],
      opens: '14:00',
      closes: '18:00',
      validFrom: '2026-01-01',
      validThrough: '2026-12-31',
    };
    baseSchema.publicAccess = true;
    baseSchema.isAcceptingNewPatients = true;
  } else if (args.emphasis === 'night') {
    baseSchema.knowsAbout = [
      '야간치과', '21시 야간진료', '퇴근후 치과', '직장인 치과', '맞벌이 치과', '구월동 야간치과', '인천 야간치과', '평일 야간진료',
    ];
  }

  return baseSchema;
}

// ────────────────────────────────────────────────
// Article / BlogPosting — 블로그 포스트
// ────────────────────────────────────────────────
export function buildArticle(args: {
  url: string;
  title: string;
  description: string;
  image?: string;
  datePublished: string;
  dateModified?: string;
  authorName?: string;
  section?: string;
  keywords?: string[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${args.url}#article`,
    mainEntityOfPage: { '@type': 'WebPage', '@id': args.url },
    headline: args.title,
    description: args.description,
    image: args.image || `${SITE_URL}/static/og-image.png`,
    datePublished: args.datePublished,
    dateModified: args.dateModified || args.datePublished,
    author: {
      '@type': 'Organization',
      name: args.authorName || '서울365치과',
      url: SITE_URL,
    },
    publisher: { '@id': DENTIST_ID },
    ...(args.section ? { articleSection: args.section } : {}),
    ...(args.keywords ? { keywords: args.keywords.join(', ') } : {}),
  };
}

// ────────────────────────────────────────────────
// Speakable — AI Answer Engine용 (Bard, ChatGPT, Perplexity)
// ────────────────────────────────────────────────
export function buildSpeakable(selectors: string[] = ['h1', '.section-headline', '.hero-sub']) {
  return {
    '@type': 'SpeakableSpecification',
    cssSelector: selectors,
  };
}
