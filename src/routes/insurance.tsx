// ============================================================
// 🚀 v4 SUPER UPGRADE — Insurance Guide Routes (Weapon 14)
// 보험·실비 가이드 페이지 (High-intent 키워드 타겟)
// ============================================================
import { Hono } from 'hono';
import type { Bindings } from '../lib/types';

const app = new Hono<{ Bindings: Bindings }>();
const SITE_URL = 'https://seoul365dc.kr';

interface InsuranceGuide {
  slug: string;
  title: string;
  shortAnswer: string;
  description: string;
  keywords: string;
  sections: { heading: string; body: string }[];
  faqs: { q: string; a: string }[];
}

const INSURANCE_GUIDES: InsuranceGuide[] = [
  {
    slug: 'implant-insurance',
    title: '임플란트 건강보험 적용 — 만 65세 이상 2개 한도 완벽 가이드',
    shortAnswer: '만 65세 이상 한국인은 평생 2개까지 건강보험 적용으로 임플란트 본인부담금 약 30~40%로 시술받을 수 있습니다.',
    description: '임플란트 건강보험 적용 조건, 본인부담률, 신청 절차, 서울365치과 적용 가능 모델까지 한 페이지에 정리.',
    keywords: '임플란트 건강보험, 임플란트 보험적용, 65세 임플란트 보험, 임플란트 본인부담금, 임플란트 의료보험',
    sections: [
      {
        heading: '건강보험 적용 대상',
        body: '만 65세 이상 한국인은 1인당 평생 2개까지 임플란트 건강보험 적용이 가능합니다. 부분 무치악 환자(잇몸이 일부 남아있어야 함)가 대상이며, 완전 무치악(이가 하나도 없는 경우)은 틀니 보험이 별도 적용됩니다.',
      },
      {
        heading: '본인부담률',
        body: '건강보험 임플란트 본인부담률은 30%입니다. (의료급여 1종 10%, 2종 20%). 차상위계층은 10~20%로 추가 경감됩니다. 2026년 기준 건강보험 임플란트 1개 본인부담금은 약 40~50만원 수준입니다.',
      },
      {
        heading: '신청 절차',
        body: '병원에서 환자 등록 → 사전승인 신청 → 국민건강보험공단 승인 → 시술 진행 순서입니다. 서울365치과에서 모든 절차를 대행해 드리므로 환자는 신분증과 보험증만 지참하시면 됩니다. 일반적으로 사전승인은 1~3일 소요됩니다.',
      },
      {
        heading: '적용 가능 모델',
        body: '건강보험 임플란트는 정해진 픽스처(인공치근)와 보철물 규격이 있으며, 서울365치과에서는 오스템 등 국산 임플란트 중 보험 적용 가능 모델을 사용합니다. 프리미엄 임플란트(스트라우만 등) 선택 시 일반가로 진행됩니다.',
      },
      {
        heading: '실손보험 추가 적용',
        body: '대부분의 실손의료보험은 임플란트 본체는 보장하지 않으나, 사전·사후 검사(CT·파노라마), 입원(수면진료), 약제비 등은 약관에 따라 보장 가능합니다. 가입하신 실손보험사에 문의하시면 정확한 보장 범위 확인 가능합니다.',
      },
    ],
    faqs: [
      { q: '만 64세인데 65세까지 기다려야 하나요?', a: '만 65세 생일이 된 다음 날부터 신청 가능합니다. 시급한 경우 일반가로 먼저 진행 후 65세 이후 추가 임플란트를 보험으로 진행하는 방법도 있습니다.' },
      { q: '평생 2개 한도는 어떻게 계산되나요?', a: '한국 내 어느 치과에서든 보험 적용으로 시술받은 임플란트가 누적 2개를 초과할 수 없습니다. 본인 건강보험 정보로 조회 가능합니다.' },
      { q: '뼈이식이 필요한 경우 보험 적용되나요?', a: '뼈이식은 별도로 건강보험 적용이 가능하며, 임플란트와 별개로 청구됩니다. 자세한 비용은 진단 후 안내드립니다.' },
      { q: '발치 후 즉시 임플란트도 보험 적용되나요?', a: '발치와 임플란트 식립을 같은 날 시행하는 경우에도 건강보험 적용 가능합니다. 단, 사전승인이 필요하므로 미리 상담 받으시기 바랍니다.' },
    ],
  },
  {
    slug: 'denture-insurance',
    title: '틀니 건강보험 — 부분틀니·완전틀니 본인부담금 완벽 정리',
    shortAnswer: '만 65세 이상은 부분틀니·완전틀니 모두 7년에 1회 건강보험 적용, 본인부담률 30%로 시술 가능합니다.',
    description: '틀니 건강보험 적용 조건, 부분틀니/완전틀니 차이, 본인부담금, 보험 갱신 기간, 사후관리까지.',
    keywords: '틀니 건강보험, 틀니 보험적용, 부분틀니 가격, 완전틀니 비용, 65세 틀니 보험',
    sections: [
      {
        heading: '건강보험 적용 대상',
        body: '만 65세 이상 한국인은 부분틀니(레진·금속), 완전틀니(레진) 모두 건강보험 적용이 가능합니다. 7년에 1회 적용이 원칙이며, 분실·파손·구강 상태 변화 시 예외 적용도 가능합니다.',
      },
      {
        heading: '본인부담률',
        body: '틀니 건강보험 본인부담률은 30%입니다. 의료급여 1종은 5%, 2종은 15%, 차상위계층은 5~15%로 경감됩니다. 2026년 기준 완전틀니 1악 본인부담금은 약 35만원, 부분틀니는 약 45만원 수준입니다.',
      },
      {
        heading: '제작 단계 및 보험 적용',
        body: '틀니 제작은 5~6단계로 나뉘며 각 단계마다 보험이 적용됩니다. (진단 → 본뜨기 → 교합채득 → 시적 → 장착). 중도 포기 시 진행된 단계까지만 비용 발생합니다.',
      },
      {
        heading: '사후 관리 보험',
        body: '틀니 장착 후 3개월간 사후 관리는 무료이며, 그 후 정기적인 조정·수리도 건강보험 적용 가능합니다. 임플란트와 결합한 임플란트 틀니(임플란트 오버덴쳐)는 일부 보험 적용됩니다.',
      },
    ],
    faqs: [
      { q: '틀니가 7년 전에 만들었는데 다시 만들 수 있나요?', a: '7년 경과 후 다시 보험 적용 가능합니다. 단, 분실·심한 파손·구강구조 변화로 사용 불가한 경우 7년 이내라도 예외 적용을 신청할 수 있습니다.' },
      { q: '부분틀니와 완전틀니 중 어느 것이 좋나요?', a: '잔존 치아 상태에 따라 결정됩니다. 자연치아 활용 가능 시 부분틀니가 안정적이고, 모든 치아 상실 시 완전틀니로 진행합니다. 더 안정적인 임플란트 틀니도 옵션입니다.' },
      { q: '의료급여 수급자도 적용 가능한가요?', a: '의료급여 1종(5%), 2종(15%)으로 본인부담률이 더 낮게 적용됩니다. 신청 시 의료급여증을 지참하시면 됩니다.' },
    ],
  },
  {
    slug: 'scaling-insurance',
    title: '스케일링 건강보험 — 연 1회 무료, 자세한 적용 방법',
    shortAnswer: '만 19세 이상 한국인은 매년 7월 1일~다음 해 6월 30일 기준 연 1회 스케일링 건강보험 적용으로 본인부담금 약 1.5만원~2만원에 받을 수 있습니다.',
    description: '스케일링 건강보험 연 1회 무료 적용 가이드. 적용 기간, 본인부담금, 추가 비용 발생 조건까지.',
    keywords: '스케일링 보험, 스케일링 건강보험, 스케일링 가격, 스케일링 무료, 스케일링 1회',
    sections: [
      {
        heading: '연 1회 보험 적용',
        body: '만 19세 이상 한국인은 매년 7월 1일부터 다음 해 6월 30일까지의 보험 적용 연도 동안 1회 스케일링 건강보험이 적용됩니다. 2026년 7월 1일~2027년 6월 30일이 한 단위입니다.',
      },
      {
        heading: '본인부담금',
        body: '건강보험 적용 스케일링 본인부담률은 30%입니다. 2026년 기준 본인부담금은 약 1.5만원~2만원 수준이며, 의료급여 1종은 약 5천원 수준으로 더 저렴합니다.',
      },
      {
        heading: '치주염 환자 추가 적용',
        body: '치주염(잇몸병)으로 진단받은 환자는 연 1회 스케일링 외에도 잇몸치료(치주소파술 SRP) 시 추가 스케일링이 건강보험 적용됩니다. 잇몸 출혈·붓기·통증이 있다면 전문 잇몸치료를 권장합니다.',
      },
    ],
    faqs: [
      { q: '1년에 2번 스케일링 받고 싶은데 가능한가요?', a: '1년에 1회는 보험 적용이지만, 추가 스케일링은 일반가(보통 5~10만원)로 받을 수 있습니다. 치주염 환자는 잇몸치료 시 추가 적용 가능합니다.' },
      { q: '언제 받는 게 가장 좋나요?', a: '매년 7월 1일 이후 받으시면 새 보험 연도가 시작되어 가장 효율적입니다. 다음 해 6월 30일까지 받지 않으면 그 해 보험은 소멸됩니다.' },
      { q: '치주염 치료가 필요한지 어떻게 알 수 있나요?', a: '잇몸 출혈, 붓기, 구취, 흔들리는 치아 등의 증상이 있다면 치주염 가능성이 있습니다. 진단 후 SRP(잇몸치료) 적용 여부가 결정됩니다.' },
    ],
  },
  {
    slug: 'orthodontics-insurance',
    title: '교정치료 보험 — 실비보험 활용 가이드',
    shortAnswer: '교정치료는 미용 목적으로 건강보험 미적용이지만, 일부 실손보험에서 진단·검사 비용은 보장 가능합니다.',
    description: '교정치료 보험 적용 여부, 실비보험 활용 방법, 의료비 세액공제 가이드.',
    keywords: '교정 보험, 인비절라인 보험, 교정 실비, 치아교정 의료비공제, 메탈교정 보험',
    sections: [
      {
        heading: '건강보험 적용 여부',
        body: '일반적인 미용 목적의 교정치료(메탈교정·인비절라인)는 건강보험 적용 대상이 아닙니다. 단, 구순구개열(언청이)·심한 부정교합·턱뼈 수술과 동반한 교정 등 의학적 필요시에는 보험 적용이 가능합니다.',
      },
      {
        heading: '실손보험 활용',
        body: '대부분의 실손의료보험은 교정 본 시술비를 보장하지 않으나, 진단을 위한 CT·파노라마·구강스캔, 발치, 신경치료 등 부수적 진료비는 약관에 따라 보장 가능합니다. 가입하신 보험사에 약관 확인 권장합니다.',
      },
      {
        heading: '의료비 세액공제',
        body: '교정치료비는 의료비 세액공제 대상입니다. 연 700만원까지(본인·기본공제자 기준) 15% 세액공제 가능합니다. 서울365치과에서 카드결제·현금영수증·간이영수증 모두 발급 가능하며, 국세청 홈택스에서 자동 집계됩니다.',
      },
      {
        heading: '분할 납부 옵션',
        body: '서울365치과는 카드사 무이자 할부(2~12개월) 및 자체 분할 납부 시스템을 제공합니다. 일시불 결제 시 추가 할인도 가능하니 상담 시 확인하시기 바랍니다.',
      },
    ],
    faqs: [
      { q: '인비절라인도 의료비 공제 받을 수 있나요?', a: '네, 인비절라인 비용 전액이 의료비 세액공제 대상입니다. 연간 의료비 합산하여 15% 세액공제 가능합니다.' },
      { q: '구순구개열 교정은 보험 적용되나요?', a: '구순구개열 환자의 교정치료는 건강보험 적용 대상입니다. 진단서 발급 후 보험 청구 가능합니다.' },
      { q: '실비보험에서 교정비를 보장받을 수 있나요?', a: '교정 본 시술비는 대부분 보장 안 되지만, 부수적 진료(발치·CT 등)는 보장 가능한 경우가 많습니다. 약관 확인 권장.' },
    ],
  },
];

// ── /insurance 인덱스 ──
app.get('/insurance', (c) => {
  const canonicalUrl = `${SITE_URL}/insurance`;

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: '치과 건강보험 적용 가이드',
    numberOfItems: INSURANCE_GUIDES.length,
    itemListElement: INSURANCE_GUIDES.map((g, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: g.title,
      url: `${SITE_URL}/insurance/${g.slug}`,
    })),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '홈', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: '보험 가이드', item: canonicalUrl },
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
          <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/30 text-green-300 text-xs mb-4">
            <i class="fas fa-shield-alt"></i> 보험 적용으로 부담 줄이기
          </div>
          <h1 class="text-4xl md:text-5xl font-black gradient-text-white leading-tight mb-4">
            치과 건강보험 가이드
          </h1>
          <p class="text-white/60 text-lg">
            임플란트·틀니·스케일링·교정 — 건강보험과 실손보험 활용법
          </p>
        </div>
      </section>

      <section class="bg-gray-50 py-12">
        <div class="max-w-4xl mx-auto px-5 space-y-4">
          {INSURANCE_GUIDES.map((g) => (
            <a href={`/insurance/${g.slug}`} class="block bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition">
              <h2 class="text-xl font-bold text-gray-900 mb-2">{g.title}</h2>
              <p class="text-sm text-gray-600 mb-3">{g.shortAnswer}</p>
              <span class="text-blue-600 text-sm font-bold">자세히 보기 →</span>
            </a>
          ))}
        </div>
      </section>
    </>,
    {
      title: '치과 건강보험 가이드 — 임플란트·틀니·스케일링·교정 보험 적용 완벽 정리 | 서울365치과',
      description: '치과 건강보험과 실손보험 활용 가이드. 임플란트(만65세+) 2개, 틀니 7년에 1회, 스케일링 연 1회 보험 적용 방법.',
      keywords: '치과 건강보험, 임플란트 보험, 틀니 보험, 스케일링 보험, 교정 실비',
      canonical: canonicalUrl,
    }
  );
});

// ── /insurance/:slug 상세 ──
app.get('/insurance/:slug', (c) => {
  const slug = c.req.param('slug');
  const guide = INSURANCE_GUIDES.find((g) => g.slug === slug);
  if (!guide) return c.notFound();

  const canonicalUrl = `${SITE_URL}/insurance/${slug}`;

  const medicalSchema = {
    '@context': 'https://schema.org',
    '@type': 'MedicalWebPage',
    name: guide.title,
    description: guide.description,
    url: canonicalUrl,
    inLanguage: 'ko-KR',
    audience: { '@type': 'MedicalAudience', audienceType: 'Patient' },
    author: {
      '@type': 'Person',
      name: '박준규',
      jobTitle: '대표원장',
      worksFor: { '@type': 'Dentist', name: '서울365치과의원' },
      memberOf: { '@type': 'Organization', name: '대한치과의사협회' },
    },
    publisher: { '@type': 'Organization', name: '서울365치과의원' },
    dateModified: '2026-05-26',
    mainEntity: {
      '@type': 'Question',
      name: guide.title,
      acceptedAnswer: { '@type': 'Answer', text: guide.shortAnswer },
    },
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: guide.faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '홈', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: '보험 가이드', item: `${SITE_URL}/insurance` },
      { '@type': 'ListItem', position: 3, name: guide.title, item: canonicalUrl },
    ],
  };

  return c.render(
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(medicalSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <section class="hero-premium" style="min-height:35vh">
        <div class="hero-grid"></div>
        <div class="orb orb-1"></div>
        <div class="relative z-10 max-w-4xl mx-auto px-5 pt-20 pb-10">
          <nav class="text-sm text-white/40 mb-4">
            <a href="/" class="hover:text-white">홈</a> ›{' '}
            <a href="/insurance" class="hover:text-white">보험 가이드</a>
          </nav>
          <h1 class="text-3xl md:text-4xl font-black gradient-text-white leading-tight mb-4">
            {guide.title}
          </h1>
          <p class="text-white/70 text-base bg-white/5 border border-white/10 rounded-xl p-4">
            <i class="fas fa-info-circle text-blue-300 mr-2"></i>
            {guide.shortAnswer}
          </p>
        </div>
      </section>

      <section class="bg-white py-12">
        <div class="max-w-3xl mx-auto px-5">
          {guide.sections.map((s) => (
            <div class="mb-8">
              <h2 class="text-xl font-bold text-gray-900 mb-3">{s.heading}</h2>
              <p class="text-gray-700 leading-relaxed">{s.body}</p>
            </div>
          ))}

          <h2 class="text-xl font-bold text-gray-900 mb-4 mt-12">자주 묻는 질문</h2>
          <div class="space-y-3 mb-12">
            {guide.faqs.map((f) => (
              <details class="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <summary class="font-bold text-gray-900 cursor-pointer">Q. {f.q}</summary>
                <p class="mt-3 text-sm text-gray-700 leading-relaxed">A. {f.a}</p>
              </details>
            ))}
          </div>

          <div class="p-6 bg-blue-50 rounded-2xl text-center">
            <h3 class="text-xl font-bold text-gray-900 mb-2">보험 적용 가능한지 확인하세요</h3>
            <p class="text-gray-600 mb-4 text-sm">전화 또는 온라인 예약으로 상담받아보세요</p>
            <div class="flex flex-wrap justify-center gap-3">
              <a href="tel:032-432-0365" class="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-full font-bold">
                <i class="fas fa-phone"></i> 032-432-0365
              </a>
              <a href="/reservation" class="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-blue-600 text-blue-600 rounded-full font-bold">
                <i class="fas fa-calendar"></i> 예약·상담
              </a>
            </div>
          </div>
        </div>
      </section>
    </>,
    {
      title: guide.title + ' | 서울365치과',
      description: guide.description,
      keywords: guide.keywords,
      canonical: canonicalUrl,
    }
  );
});

export function getAllInsuranceSlugs(): string[] {
  return INSURANCE_GUIDES.map((g) => g.slug);
}

export default app;
