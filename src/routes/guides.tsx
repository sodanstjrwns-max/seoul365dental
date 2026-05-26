// ============================================================
// 📰 v3 SUPER UPGRADE — Topic Cluster Pages (Hub-Spoke)
// 임플란트/인비절라인/교정 완벽 가이드 (Pillar + Spokes)
// 토픽 권위(Topical Authority) 신호 강화
// ============================================================
import { Hono } from 'hono'
import type { Bindings } from '../lib/types'
import { TOPIC_CLUSTERS, type TopicCluster } from '../data/answer-hub'
import { CLINIC } from '../data/clinic'

const guidesRoutes = new Hono<{ Bindings: Bindings }>()

// 토픽별 상세 콘텐츠 (Spoke 페이지 본문)
const SPOKE_CONTENT: Record<string, string[]> = {
  // implant-guide spokes
  'implant-guide/cost': [
    '2026년 임플란트 비용은 사용 재료와 추가 시술에 따라 다양합니다. 서울365치과 기준으로 정리하면 다음과 같습니다.',
    '국산 보급형(오스템 이벤트): 64만원 — 가장 합리적인 가격으로 일반 케이스에 적합합니다.',
    '국산 프리미엄(오스템 SOI): 104만원 + 임시치아 114만원 — 골유착 속도가 빠른 고급 임플란트입니다.',
    '국산 우수(메가젠 AnyRidge): 79만원 — Knife-thread 디자인으로 골 부족 케이스에 유리합니다.',
    '수입 프리미엄(스트라우만 이벤트): 129만원~ — 스위스 프리미엄, 골유착 속도 최고(SLActive 표면).',
    '추가 비용: 네비게이션 가이드 수술 +10만원, 수면마취 +20만원, 뼈이식 부위별 별도 산정.',
    '건강보험 적용: 만 65세 이상은 평생 2개까지 건보 적용(본인부담 30%), 약 60만원 본인부담 발생.',
  ],
  'implant-guide/duration': [
    '임플란트 치료 기간은 환자의 골 상태와 식립 방법에 따라 1.5개월~6개월까지 다양합니다.',
    '1단계 식립 수술: 1회 방문, 약 30~60분 소요. 마취 후 잇몸을 절개하고 임플란트(인공 치근)를 식립합니다.',
    '2단계 골유착 대기: 3~6개월 (위턱은 더 김). 골유착이 완료되어야 보철물 부착이 가능합니다.',
    '3단계 보철 부착: 인상 채득 후 2~3주 내 크라운 제작. 서울365치과는 자체 기공실 보유로 더 빠릅니다.',
    '즉시로딩(Immediate Loading): 조건이 맞을 경우 식립 후 24시간 내 임시치아 부착 가능. 환자의 사회생활 영향 최소화.',
    '전체임플란트(All-on-4/6): 식립~임시치아까지 평균 3~5일 내 완료, 최종 보철은 4~6개월 후.',
  ],
  'implant-guide/brands': [
    '국내 주요 임플란트 브랜드별 특징과 추천 케이스를 정리하면 다음과 같습니다.',
    '오스템(Osstem) — 국내 1위, 시장점유 50%+. 가격 합리적(64~104만원), 데이터 가장 풍부. 일반 케이스에 무난.',
    '스트라우만(Straumann) — 스위스 프리미엄. 가격 높음(129만원~), 골유착 속도 가장 빠름(SLActive 표면). 흡연자/당뇨/골량 부족자에 추천.',
    '메가젠(MegaGen) AnyRidge — 국산 우수 브랜드. 가격 중간(79만원), Knife-thread 디자인으로 골 압력 낮아 발치 즉시 식립 유리.',
    '노벨바이오케어(Nobel Biocare) — 미국 프리미엄. All-on-4 원조 브랜드, 전체임플란트에 강점.',
    '선택 가이드: 일반 환자는 오스템, 골 상태 좋지 않으면 스트라우만, 즉시식립 케이스는 메가젠.',
  ],
  'implant-guide/sideeffect': [
    '임플란트는 매우 성공률이 높은 수술이지만(95%+), 다음과 같은 부작용 가능성이 있습니다.',
    '1. 임플란트 주위염 — 식립 후 잇몸 염증, 정기 검진과 칫솔질로 예방 가능.',
    '2. 골유착 실패 — 흡연자, 당뇨 환자에서 5% 이상 발생 가능. 금연 필수.',
    '3. 신경 손상 — 아래턱 신경 가까운 부위 위험, CT 사전 진단으로 예방.',
    '4. 부비동 천공 — 위턱 어금니 부위 식립 시 상악동 손상 위험, 정밀 진단 필수.',
    '5. 보철물 파절 — 강한 교합력으로 크라운 깨짐, 야간 이갈이 환자는 마우스피스 필수.',
    '서울365치과는 모든 임플란트 수술 전 CT 정밀진단을 시행하며, 합병증 가능성을 사전에 차단합니다.',
  ],
  'implant-guide/aftercare': [
    '임플란트의 수명을 결정하는 가장 중요한 요소는 사후관리입니다. 평균 수명 15~25년을 위해 다음을 지키세요.',
    '수술 직후 1주일: 부드러운 음식만, 수술 부위 칫솔질 금지, 처방받은 항생제·진통제 복용.',
    '수술 후 1~3개월: 일반 식사 가능하나 딱딱한 음식 주의. 임시 보철 사용 중인 경우 더욱 주의.',
    '수술 후 6개월~평생: 일반 치아처럼 사용 가능. 단, 다음 습관 필요.',
    '· 매일 임플란트 전용 치실/치간칫솔 사용',
    '· 6개월마다 정기 검진과 스케일링',
    '· 1년마다 X-ray 검사로 임플란트 주변 골 상태 확인',
    '· 흡연 절대 금지(임플란트 주위염 위험 5배 증가)',
  ],
  'implant-guide/insurance': [
    '대한민국 건강보험은 만 65세 이상에 대해 임플란트 비용을 지원합니다.',
    '대상자: 만 65세 이상 건강보험 가입자(현재 의료급여 수급권자 포함).',
    '지원 개수: 평생 2개까지(상악 또는 하악 무관).',
    '본인부담률: 30% (의료급여 수급권자는 5~20%).',
    '평균 본인부담금: 약 60만원/개(전체 비용 약 130만원에서 보험 적용 후).',
    '신청 방법: 치과에서 사전 등록 후 시술. 별도 신청서 작성 필요 없음.',
    '제외 케이스: 완전 무치악(전체 치아 상실), 골이식 동반, 보철 위 임플란트 등.',
    '서울365치과에서는 사전 상담 시 보험 적용 가능 여부를 정확히 안내드립니다.',
  ],
  // invisalign-guide spokes
  'invisalign-guide/cost': [
    '인비절라인의 비용은 치료 난이도에 따라 4단계로 나뉩니다.',
    'Express(7장 이하): 350~450만원 — 가벼운 부정교합, 6개월 이내 치료.',
    'Lite(14장 이하): 450~550만원 — 경도 부정교합, 1년 이내 치료.',
    'Moderate(20장 이하): 550~650만원 — 중간 부정교합, 1.5년 이내 치료.',
    'Comprehensive(무제한): 700~800만원 — 복잡한 부정교합, 2년 이내 치료.',
    '추가 비용: CT/3D 스캔 진단비 약 20만원, 유지장치(리테이너) 약 30만원, 어택치먼트 부착 별도 없음.',
    '결제 방식: 무이자 할부 12~24개월 가능, 카드/현금/카카오페이.',
  ],
  'invisalign-guide/duration': [
    '인비절라인 평균 치료 기간은 6개월~24개월이며, 케이스에 따라 다릅니다.',
    'Express 케이스(가벼운 부정교합): 약 4~6개월.',
    'Lite 케이스(경도): 약 6~12개월.',
    'Moderate 케이스(중간): 약 12~18개월.',
    'Comprehensive 케이스(복잡): 약 18~24개월.',
    '치료 속도 결정 요인: 1) 환자 협조도(매일 20시간 이상 착용), 2) 치아 이동 난이도, 3) 어택치먼트 부착, 4) IPR(치아삭제) 필요 여부.',
    '서울365치과는 인비절라인 공인 인증의가 직접 진료하며, AI 기반 진행 예측으로 최단 기간을 목표로 합니다.',
  ],
  'invisalign-guide/effectiveness': [
    '인비절라인은 거의 모든 부정교합에 효과적이지만, 일부 케이스는 메탈 교정이 더 적합합니다.',
    '인비절라인 효과적 케이스: 치아 사이 공간, 경미~중간 덧니, 정면 비대칭, 약간의 돌출, 재교정 케이스.',
    '메탈 교정 우선 권장 케이스: 발치 동반 큰 이동, 회전이 심한 치아, 골격성 부정교합, 환자 협조 어려운 경우(청소년 등).',
    '협조도가 중요: 인비절라인은 환자가 매일 20시간 이상 착용하지 않으면 효과가 떨어집니다.',
    '예측 가능성: 인비절라인은 ClinCheck 3D 시뮬레이션으로 결과를 사전 예측 가능하다는 장점이 있습니다.',
    '서울365치과의 인비절라인 공인 인증의가 정밀 진단 후 최적의 치료 방법을 안내합니다.',
  ],
  'invisalign-guide/lifestyle': [
    '인비절라인은 탈착 가능해 일상생활 영향이 메탈 교정보다 적지만, 다음 규칙을 지켜야 효과적입니다.',
    '착용 시간: 매일 20~22시간 착용 필수. 식사·양치 시에만 탈착.',
    '음식 제한: 없음(탈착 후 식사). 단, 따뜻한 음료(커피·차)는 변형 위험으로 제거 후 섭취.',
    '양치질: 식사 후 반드시 양치 후 재착용. 치아에 음식물 남은 상태로 착용 시 충치 위험.',
    '관리법: 인비절라인 클리닝 크리스털 또는 미온수+중성세제로 매일 세척. 뜨거운 물(60도 이상) 금지(변형).',
    '교체 주기: 1~2주마다 새 트레이로 교체. 잃어버리면 즉시 치과에 연락.',
    '운동/사회생활: 모든 활동 가능. 격투기·수영 시에도 착용 권장.',
  ],
  'invisalign-guide/comparison': [
    '주요 교정 방식 4종을 한눈에 비교하면 다음과 같습니다.',
    '메탈 브라켓: 350~450만원, 18~36개월, 가격 최저·강력한 힘 조절, 심미성·편의성 떨어짐.',
    '세라믹 브라켓: 450~550만원, 18~36개월, 치아색으로 메탈보다 심미적, 음식 제한·구취 우려.',
    '설측(혀쪽) 브라켓: 800~1,500만원, 24~36개월, 외부에서 안 보임, 매우 비싸고 발음 영향.',
    '인비절라인: 350~800만원, 6~24개월, 투명·탈착 가능, 환자 협조도 중요.',
    '서울365치과의 권장: 성인 사회생활 → 인비절라인, 청소년 → 메탈, 가격 부담 + 심미 → 세라믹.',
  ],
  // orthodontics-guide spokes
  'orthodontics-guide/types': [
    '치아교정 방법은 5가지로 나뉘며, 각각 장단점이 명확합니다.',
    '1) 메탈 브라켓 — 가장 전통적, 가격 최저(350~450만원), 강력한 힘 조절 가능, 심미성 낮음.',
    '2) 세라믹 브라켓 — 치아색 브라켓(450~550만원), 메탈보다 심미적, 가격 중간.',
    '3) 자가결찰 브라켓(데이몬·SLB) — 마찰 적어 빠른 이동(500~700만원), 통증 적음.',
    '4) 설측 브라켓 — 혀쪽 부착(800~1,500만원), 외부에서 안 보임, 가장 고가.',
    '5) 인비절라인 — 투명·탈착식(350~800만원), 심미성·편의성 최고.',
    '서울365치과는 5가지 모두 진료 가능하며, 환자 상황에 맞는 방법을 추천합니다.',
  ],
  'orthodontics-guide/timing': [
    '교정 최적 시기는 환자 연령과 부정교합 종류에 따라 다릅니다.',
    '소아 1차 교정(7~10세): 부정교합 조기 발견, 골격성 문제 예방, 비용 100~300만원.',
    '소아 2차 교정(영구치 완성 12~14세): 본격 교정, 비용 350~600만원.',
    '청소년 교정(15~19세): 성장 종료 직전, 가장 효율적 시기.',
    '성인 교정(20~50세): 가능, 단 골격성 문제는 수술 동반 가능성.',
    '50대 이상 교정: 가능, 단 잇몸 건강·임플란트 위치 등 고려 필요.',
    '결론: 부정교합 발견 즉시 검진, 치료는 적절한 시기에 시작.',
  ],
  'orthodontics-guide/pediatric': [
    '소아 교정은 1차(성장기)와 2차(영구치 완성기)로 나뉘며, 각각 목적이 다릅니다.',
    '1차 교정(7~10세): 골격성 부정교합 예방, 턱 성장 유도, 나쁜 습관(손가락 빨기·구호흡) 교정.',
    '· 사용 장치: 확장장치, 페이스마스크, MFT 장치.',
    '· 기간: 6~12개월, 비용 100~300만원.',
    '2차 교정(12~14세): 본격적 치아 이동, 영구치 완성 직후 가장 효율적.',
    '· 사용 장치: 메탈 브라켓, 세라믹, 인비절라인 틴.',
    '· 기간: 18~30개월, 비용 350~600만원.',
    '조기 발견 신호: 위아래 치아 안 맞음, 입이 안 다물어짐, 발음 이상, 코골이.',
  ],
  'orthodontics-guide/adult': [
    '성인 교정은 35세, 40세, 50세도 충분히 가능하며, 다음 사항만 주의하면 됩니다.',
    '잇몸 건강: 교정 전 잇몸 치료 필수, 잇몸염 있으면 치아 이동이 어려움.',
    '치료 기간: 성인은 청소년보다 약 6~12개월 더 소요(평균 24~36개월).',
    '심미적 선택: 사회생활 활발한 성인은 인비절라인 또는 세라믹 추천.',
    '발치 가능성: 성인은 발치 동반 교정이 더 흔함(공간 부족 시).',
    '직장인 팁: 인비절라인은 회의·발표 영향 없음, 메탈은 사진 촬영 시 신경 쓰임.',
    '50대 이상: 가능하나 임플란트·보철 위치 사전 확인 필수.',
  ],
  'orthodontics-guide/retainer': [
    '교정 후 유지장치(리테이너)는 평생 착용해야 효과 유지됩니다.',
    '종류 1: 고정식 리테이너(Bonded) — 앞니 뒤쪽에 와이어 부착, 항상 유지.',
    '종류 2: 가철식 투명 리테이너(Essix/Vivera) — 인비절라인 유사 투명 장치, 야간 착용.',
    '종류 3: 헐리 리테이너(Hawley) — 클래식 와이어+플라스틱, 야간 착용.',
    '착용 기간: 첫 6개월 24시간, 6개월~2년 야간만, 2년 이후 평생 주 2~3회 야간 착용.',
    '재발 방지: 리테이너 미착용 시 빠른 재발 가능. 재교정 비용 부담.',
    '분실 시 대처: 즉시 치과 방문, 새 리테이너 제작(약 20~30만원).',
  ],
};

// 인덱스: /guides
guidesRoutes.get('/guides', (c) => {
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "홈", "item": "https://seoul365dc.kr" },
      { "@type": "ListItem", "position": 2, "name": "완벽 가이드", "item": "https://seoul365dc.kr/guides" },
    ]
  };

  const allKeywords = TOPIC_CLUSTERS.flatMap(c => c.spokes.flatMap(s => s.keywords)).filter((v, i, a) => a.indexOf(v) === i).join(', ');

  return c.render(
    <section class="min-h-screen bg-white">
      <div class="hero-premium" style="min-height:50vh">
        <div class="hero-grid"></div>
        <div class="orb orb-1"></div>
        <div class="orb orb-2"></div>
        <div class="relative z-10 max-w-4xl mx-auto px-5 text-center" style="padding-top:16vh">
          <p class="text-[#00E5FF] text-xs font-bold tracking-[0.3em] uppercase mb-4 reveal reveal-fade">COMPLETE GUIDES 2026</p>
          <h1 class="text-3xl md:text-5xl font-black text-white mb-4 reveal reveal-fade text-split" style="transition-delay:0.2s">
            치과 진료 완벽 가이드 2026
          </h1>
          <p class="text-white/40 text-sm md:text-base max-w-2xl mx-auto reveal reveal-fade" style="transition-delay:0.4s">
            임플란트·인비절라인·치아교정에 대한 모든 정보<br/>
            서울대 출신 5인 전문의가 직접 작성한 깊이 있는 가이드.
          </p>
        </div>
      </div>

      <div class="max-w-5xl mx-auto px-5 md:px-8 py-16 md:py-24">
        {TOPIC_CLUSTERS.map(cluster => (
          <div class="mb-16 reveal reveal-fade">
            <a href={`/guides/${cluster.slug}`} class="block group">
              <div class="flex items-center gap-3 mb-6">
                <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0066FF] to-[#2979FF] flex items-center justify-center">
                  <i class="fa-solid fa-book-open text-white text-lg"></i>
                </div>
                <div>
                  <h2 class="text-2xl font-bold text-gray-900 group-hover:text-[#0066FF] transition-colors">{cluster.pillarName}</h2>
                  <p class="text-xs text-gray-400">{cluster.spokes.length}개 세부 가이드</p>
                </div>
              </div>
              <p class="text-gray-600 mb-4">{cluster.pillarDesc}</p>
            </a>
            <div class="grid md:grid-cols-2 gap-3">
              {cluster.spokes.map(spoke => (
                <a href={`/guides/${cluster.slug}/${spoke.slug}`} class="block p-4 rounded-xl border border-gray-100 hover:border-[#0066FF]/30 hover:bg-gray-50 transition-all">
                  <div class="text-sm font-bold text-gray-900 mb-1">{spoke.title}</div>
                  <div class="text-xs text-gray-500">{spoke.description}</div>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>,
    {
      title: '치과 진료 완벽 가이드 2026 | 서울365치과',
      description: '임플란트·인비절라인·치아교정 완벽 가이드. 비용, 기간, 종류, 부작용, 사후관리까지 서울대 출신 전문의가 정리한 16개 세부 가이드.',
      canonical: 'https://seoul365dc.kr/guides',
      keywords: allKeywords,
      jsonLd: [breadcrumb],
    }
  );
});

// 클러스터 허브: /guides/:cluster
guidesRoutes.get('/guides/:cluster', (c) => {
  const clusterSlug = c.req.param('cluster');
  const cluster = TOPIC_CLUSTERS.find(c => c.slug === clusterSlug);
  if (!cluster) return c.notFound();

  const canonicalUrl = `https://seoul365dc.kr/guides/${clusterSlug}`;
  const allKeywords = cluster.spokes.flatMap(s => s.keywords).join(', ');

  // E-E-A-T Pillar Article Schema
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    "@id": `${canonicalUrl}#article`,
    "headline": cluster.pillarName,
    "description": cluster.pillarDesc,
    "url": canonicalUrl,
    "datePublished": "2025-01-01",
    "dateModified": "2026-05-26",
    "inLanguage": "ko-KR",
    "isAccessibleForFree": true,
    "specialty": { "@type": "MedicalSpecialty", "name": "Dentistry" },
    "audience": { "@type": "MedicalAudience", "audienceType": "Patient" },
    "author": { "@type": "MedicalOrganization", "@id": "https://seoul365dc.kr/#dentist", "name": "서울365치과의원" },
    "reviewedBy": {
      "@type": "Person",
      "name": "박준규",
      "jobTitle": "대표원장",
      "worksFor": { "@type": "MedicalOrganization", "@id": "https://seoul365dc.kr/#dentist" },
      "alumniOf": { "@type": "EducationalOrganization", "name": "서울대학교 치과대학" },
    },
    "hasPart": cluster.spokes.map(s => ({
      "@type": "WebPage",
      "name": s.title,
      "url": `${canonicalUrl}/${s.slug}`,
      "description": s.description,
    })),
    "lastReviewed": "2026-05-26",
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "홈", "item": "https://seoul365dc.kr" },
      { "@type": "ListItem", "position": 2, "name": "완벽 가이드", "item": "https://seoul365dc.kr/guides" },
      { "@type": "ListItem", "position": 3, "name": cluster.pillarName, "item": canonicalUrl },
    ]
  };

  return c.render(
    <section class="min-h-screen bg-white">
      <div class="hero-premium" style="min-height:50vh">
        <div class="hero-grid"></div>
        <div class="orb orb-1"></div>
        <div class="relative z-10 max-w-4xl mx-auto px-5 text-center" style="padding-top:14vh">
          <p class="text-[#00E5FF] text-xs font-bold tracking-[0.3em] uppercase mb-4 reveal reveal-fade">{cluster.category} GUIDE</p>
          <h1 class="text-2xl md:text-4xl font-black text-white mb-4 reveal reveal-fade text-split" style="transition-delay:0.2s">
            {cluster.pillarName}
          </h1>
          <p class="text-white/50 text-sm md:text-base max-w-2xl mx-auto reveal reveal-fade" style="transition-delay:0.4s">
            {cluster.pillarDesc}
          </p>
        </div>
      </div>

      <article class="max-w-4xl mx-auto px-5 md:px-8 py-16">
        <nav class="text-xs text-gray-400 mb-6">
          <a href="/" class="hover:text-[#0066FF]">홈</a>
          <span class="mx-2">›</span>
          <a href="/guides" class="hover:text-[#0066FF]">완벽 가이드</a>
          <span class="mx-2">›</span>
          <span class="text-gray-700">{cluster.pillarName}</span>
        </nav>

        <div class="p-6 rounded-2xl bg-gradient-to-br from-[#E6F3FF] to-[#F0F8FF] border border-[#0066FF]/10 mb-10">
          <div class="flex items-center gap-2 text-[#0066FF] font-bold text-sm mb-3">
            <i class="fa-solid fa-list-check"></i>
            <span>이 가이드에서 다루는 내용</span>
          </div>
          <ul class="space-y-2 text-gray-700">
            {cluster.spokes.map(s => (
              <li class="flex items-start gap-2">
                <i class="fa-solid fa-check text-[#0066FF] mt-1.5 text-xs"></i>
                <a href={`${canonicalUrl}/${s.slug}`} class="hover:text-[#0066FF] transition-colors">{s.title}</a>
              </li>
            ))}
          </ul>
        </div>

        <h2 class="text-2xl font-bold text-gray-900 mb-6">세부 가이드 ({cluster.spokes.length}개)</h2>
        <div class="grid md:grid-cols-2 gap-4 mb-12">
          {cluster.spokes.map((spoke, idx) => (
            <a href={`${canonicalUrl}/${spoke.slug}`} class="block p-6 rounded-2xl border border-gray-100 hover:border-[#0066FF]/30 hover:shadow-lg transition-all">
              <div class="flex items-center gap-2 text-xs text-gray-400 mb-2">
                <span class="font-bold">{String(idx + 1).padStart(2, '0')}</span>
                <span>·</span>
                <span>{cluster.category}</span>
              </div>
              <h3 class="text-base font-bold text-gray-900 mb-2">{spoke.title}</h3>
              <p class="text-sm text-gray-600 leading-relaxed">{spoke.description}</p>
              <div class="mt-3 text-xs text-[#0066FF] font-bold">자세히 보기 →</div>
            </a>
          ))}
        </div>

        {/* E-E-A-T */}
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

        <div class="p-8 rounded-3xl bg-gradient-to-br from-[#0066FF] to-[#2979FF] text-white text-center">
          <h3 class="text-xl md:text-2xl font-black mb-2">개인 맞춤 상담이 필요하신가요?</h3>
          <p class="text-white/80 text-sm mb-5">서울365치과의 무료 상담을 받아보세요.</p>
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
      title: `${cluster.pillarName} | 서울365치과`,
      description: cluster.pillarDesc,
      canonical: canonicalUrl,
      keywords: allKeywords,
      ogType: 'article',
      datePublished: '2025-01-01',
      dateModified: '2026-05-26',
      articleSection: cluster.category,
      jsonLd: [articleSchema, breadcrumb],
    }
  );
});

// 스포크 페이지: /guides/:cluster/:spoke
guidesRoutes.get('/guides/:cluster/:spoke', (c) => {
  const clusterSlug = c.req.param('cluster');
  const spokeSlug = c.req.param('spoke');
  const cluster = TOPIC_CLUSTERS.find(c => c.slug === clusterSlug);
  if (!cluster) return c.notFound();
  const spoke = cluster.spokes.find(s => s.slug === spokeSlug);
  if (!spoke) return c.notFound();

  const canonicalUrl = `https://seoul365dc.kr/guides/${clusterSlug}/${spokeSlug}`;
  const contentKey = `${clusterSlug}/${spokeSlug}`;
  const content = SPOKE_CONTENT[contentKey] || [spoke.description];

  // 같은 클러스터 다른 spokes
  const others = cluster.spokes.filter(s => s.slug !== spokeSlug);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    "@id": `${canonicalUrl}#article`,
    "headline": spoke.title,
    "description": spoke.description,
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
    "author": { "@type": "MedicalOrganization", "@id": "https://seoul365dc.kr/#dentist", "name": "서울365치과의원" },
    "reviewedBy": {
      "@type": "Person",
      "name": "박준규",
      "jobTitle": "대표원장",
      "worksFor": { "@type": "MedicalOrganization", "@id": "https://seoul365dc.kr/#dentist" },
      "alumniOf": { "@type": "EducationalOrganization", "name": "서울대학교 치과대학" },
    },
    "isPartOf": {
      "@type": "WebPage",
      "name": cluster.pillarName,
      "url": `https://seoul365dc.kr/guides/${clusterSlug}`,
    },
    "lastReviewed": "2026-05-26",
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "홈", "item": "https://seoul365dc.kr" },
      { "@type": "ListItem", "position": 2, "name": "완벽 가이드", "item": "https://seoul365dc.kr/guides" },
      { "@type": "ListItem", "position": 3, "name": cluster.pillarName, "item": `https://seoul365dc.kr/guides/${clusterSlug}` },
      { "@type": "ListItem", "position": 4, "name": spoke.title, "item": canonicalUrl },
    ]
  };

  return c.render(
    <section class="min-h-screen bg-white">
      <div class="hero-premium" style="min-height:45vh">
        <div class="hero-grid"></div>
        <div class="orb orb-1"></div>
        <div class="relative z-10 max-w-3xl mx-auto px-5" style="padding-top:14vh">
          <p class="text-[#00E5FF] text-xs font-bold tracking-[0.3em] uppercase mb-4 reveal reveal-fade">{cluster.category}</p>
          <h1 class="text-2xl md:text-4xl font-black text-white mb-4 reveal reveal-fade text-split" style="transition-delay:0.2s">
            {spoke.title}
          </h1>
          <p class="text-white/60 text-sm md:text-base reveal reveal-fade" style="transition-delay:0.4s">
            {spoke.description}
          </p>
        </div>
      </div>

      <article class="max-w-3xl mx-auto px-5 md:px-8 py-16">
        <nav class="text-xs text-gray-400 mb-6">
          <a href="/" class="hover:text-[#0066FF]">홈</a>
          <span class="mx-2">›</span>
          <a href="/guides" class="hover:text-[#0066FF]">가이드</a>
          <span class="mx-2">›</span>
          <a href={`/guides/${clusterSlug}`} class="hover:text-[#0066FF]">{cluster.pillarName}</a>
          <span class="mx-2">›</span>
          <span class="text-gray-700">{spoke.title}</span>
        </nav>

        {/* 본문 */}
        <div class="prose prose-lg max-w-none mb-12">
          {content.map(paragraph => (
            <p class="text-gray-700 leading-loose mb-4">{paragraph}</p>
          ))}
        </div>

        {/* E-E-A-T */}
        <div class="p-6 rounded-2xl bg-gray-50 border border-gray-100 mb-10">
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

        {/* 같은 클러스터 다른 가이드 */}
        <div class="mb-12">
          <h2 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <i class="fa-solid fa-layer-group text-[#0066FF]"></i>
            {cluster.pillarName} 다른 가이드
          </h2>
          <div class="grid md:grid-cols-2 gap-3">
            {others.map(s => (
              <a href={`/guides/${clusterSlug}/${s.slug}`} class="block p-4 rounded-xl border border-gray-100 hover:border-[#0066FF]/30 hover:bg-gray-50 transition-all">
                <div class="text-sm font-bold text-gray-900">{s.title}</div>
                <div class="text-xs text-gray-500 mt-1">{s.description}</div>
              </a>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div class="p-8 rounded-3xl bg-gradient-to-br from-[#0066FF] to-[#2979FF] text-white text-center">
          <h3 class="text-xl md:text-2xl font-black mb-2">상담이 필요하신가요?</h3>
          <p class="text-white/80 text-sm mb-5">서울365치과의 1:1 무료 상담을 받아보세요.</p>
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
      title: `${spoke.title} | 서울365치과 ${cluster.pillarName}`,
      description: spoke.description,
      canonical: canonicalUrl,
      keywords: spoke.keywords.join(', '),
      ogType: 'article',
      datePublished: '2025-01-01',
      dateModified: '2026-05-26',
      articleSection: cluster.category,
      articleTags: spoke.keywords,
      jsonLd: [articleSchema, breadcrumb],
    }
  );
});

export default guidesRoutes
