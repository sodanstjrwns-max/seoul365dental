// ============================================================
// Seoul365 Dental — Brand Messaging System v1.0
// 의료법 제56조 준수: 절대적 표현 금지, 경쟁 비교 금지
// ============================================================

// ─── MISSION & VISION ──────────────────────────────────────
export const MISSION = '치과가 무서워서 미뤄온 분들이, 다시는 미루지 않아도 되는 병원.' as const;

export const VISION = {
  headline: '서울365치과가 드리는 세 가지 약속',
  promises: [
    {
      title: '완전 마취',
      desc: '마취가 되지 않으면, 절대 시작하지 않습니다.',
      icon: 'fa-syringe',
    },
    {
      title: '5인 협진',
      desc: '서울대 출신 5인 원장이 하나의 케이스를 함께 봅니다.',
      icon: 'fa-user-doctor',
    },
    {
      title: '당일 기공',
      desc: '원내 자체 기공실에서 보철물을 당일 조정합니다.',
      icon: 'fa-gear',
    },
  ],
} as const;

// ─── CORE MESSAGING HIERARCHY ──────────────────────────────
export const MESSAGING = {
  // Tier 1: Brand Slogan (모든 페이지 하단, OG 태그)
  brandSlogan: '다른 곳에서 안 된다는 분들이 저희를 찾습니다.',

  // Tier 2: Hero Main Copy (메인 히어로 H1) — 2줄 분리 구조
  heroLine1: '치과가 무서워서',
  heroLine2: '미뤄온 당신에게.',
  heroAccent: '다시는, 미루지 않아도 됩니다.',

  // Tier 3: Hero Sub Copy (메인 히어로 서브) — 원장 철학 직접 인용
  heroSub1: '마취가 안 되면, 절대 시작하지 않습니다.',
  heroSub2: '서울대 출신 5인 원장이 한 분의 환자를 함께 봅니다.',

  // Tier 3.5: 환자 한줄 증언 (Social Proof)
  heroTestimonial: '"다른 곳에서 안 된다고 했는데, 여기서 됐습니다."',

  // Tier 4: Hero Philosophy One-liner
  heroPhilosophy: '필요한 진료를 못 받는 사람이 없도록.',

  // Tier 5: Differentiator Headline (차별화 섹션)
  diffHeadline: '왜 서울365치과를 찾게 되는지,\n환자분들이 직접 말씀하십니다.',

  // Tier 6: CTA Copy
  ctaMain: '더 미루면, 더 아프고, 더 오래 걸립니다.',
  ctaSub: '무통마취부터 시작하는, 두렵지 않은 첫 진료.',

  // Tier 7: Lab Emphasis
  labEmphasis: '보철물, 외부에 맡기지 않습니다.',
  labSub: '원내 자체 기공실에서 당일 제작·수정. 핏(fit)이 다릅니다.',

  // Tier 8: Sleep Emphasis
  sleepEmphasis: '잠깐 잠들었다 깨면, 치료가 끝나 있습니다.',
  sleepSub: '수면진료는 치과가 무서운 분들을 위한 가장 확실한 답입니다.',
} as const;

// ─── 3-LINE SUMMARY (메인 페이지용) ────────────────────────
export const MAIN_SUMMARY = [
  '마취가 안 되면, 절대 시작하지 않는 병원.',
  '서울대 출신 5인 원장이 모든 케이스를 함께 보는 병원.',
  '자체 기공실에서 보철물을 당일 조정하는 병원.',
] as const;

// ─── SLOGAN CANDIDATES & SELECTED ──────────────────────────
export const SLOGANS = {
  // Final selected slogans
  hero: '다른 곳에서 안 된다는 분들이 저희를 찾습니다.',
  subHero: '마취가 안 되면, 절대 시작하지 않습니다.',
  differentiator: '치과를 미뤄왔던 이유, 저희가 해결합니다.',
  lab: '보철물, 외부에 맡기지 않습니다.',
  sleep: '잠깐 잠들었다 깨면, 치료가 끝나 있습니다.',

  // Candidates (for reference / A-B testing)
  candidates: [
    '다른 곳에서 안 된다는 분들이 저희를 찾습니다.',
    '마취가 안 되면, 절대 시작하지 않습니다.',
    '치과가 무서웠던 분들이 다시 오십니다.',
    '보철물, 외부에 맡기지 않습니다.',
    '5인의 전문의가, 한 분의 환자를 봅니다.',
    '365일 문을 여는 이유가 있습니다.',
  ],
} as const;

// ─── DIFFERENTIATOR COPY (환자 관점) ───────────────────────
export const DIFF_COPY = [
  {
    icon: 'fa-user-doctor',
    title: '서울대 5인 원장 협진',
    headline: '5인의 전문의가, 한 분의 환자를 봅니다.',
    desc: '임플란트, 교정, 보존, 보철, 종합진료 — 각 분야 전문 원장이 하나의 케이스를 함께 논의합니다. 혼자 결정하지 않기에, 더 정확합니다.',
    patientVoice: '"담당 선생님이 직접 다른 원장님과 의논하시더라고요. 이런 치과는 처음이었어요."',
  },
  {
    icon: 'fa-gear',
    title: '자체 기공실 보유',
    headline: '보철물, 외부에 맡기지 않습니다.',
    desc: '원내 자체 기공실에서 보철물을 직접 제작합니다. 외주 대비 핏(fit)이 정밀하고, 당일 수정이 가능합니다. 여러 번 오실 필요가 줄어듭니다.',
    patientVoice: '"보철 맞추러 두 번 올 줄 알았는데, 바로 해주셔서 시간도 아끼고 좋았어요."',
  },
  {
    icon: 'fa-bed',
    title: '수면진료',
    headline: '잠깐 잠들었다 깨면, 치료가 끝나 있습니다.',
    desc: '의식하진정법(수면진료)으로, 치과 공포증이 심한 분도 편안하게 치료받으실 수 있습니다. 전신마취가 아닌 가벼운 진정이므로 회복도 빠릅니다.',
    patientVoice: '"치과를 10년 넘게 못 갔는데, 수면진료 덕분에 드디어 치료받았어요."',
  },
  {
    icon: 'fa-syringe',
    title: '무통 마취 시스템',
    headline: '마취가 안 되면, 절대 시작하지 않습니다.',
    desc: '디지털 무통마취기(컴퓨터 제어)로 마취 통증을 최소화합니다. 마취가 충분히 되었는지 반드시 확인한 후에만 치료를 시작합니다.',
    patientVoice: '"마취할 때부터 아프면 어쩌나 걱정했는데, 정말 거의 안 느껴졌어요."',
  },
  {
    icon: 'fa-calendar-check',
    title: '365일·야간 진료',
    headline: '365일 문을 여는 이유가 있습니다.',
    desc: '일요일과 공휴일에도 진료하며, 월~목은 야간 21시까지 운영합니다. 점심시간 없이 연속 진료. 바쁜 일상에서 치과 가기 어려우셨던 분들을 위해.',
    patientVoice: '"야근 끝나고 8시에 갔는데 진료해주셔서 정말 감사했어요."',
  },
  {
    icon: 'fa-bolt',
    title: '즉시로딩 (MUA)',
    headline: '발치 후, 바로 씹을 수 있습니다.',
    desc: 'MUA(Multi-Unit Abutment) 기술로, 임플란트 식립 당일부터 기능 회복이 가능합니다. 이가 없는 불편한 기간을 최소화합니다.',
    patientVoice: '"수술 당일에 임시치아를 바로 해주셔서 식사가 가능해서 놀랐습니다."',
  },
] as const;

// ─── PATIENT PERSONAS ──────────────────────────────────────
export const PERSONAS = {
  A: {
    name: '페르소나 A',
    label: '광범위 치아 상실 환자',
    age: '55~70대',
    situation: '여러 개의 치아를 잃었거나, 틀니가 맞지 않아 고생하고 계신 분',
    pain: '씹는 것이 힘들고, 사람들 앞에서 웃기가 꺼려집니다.',
    fear: '"나이가 많은데 임플란트를 해도 되나요?" "다른 병원에서 뼈가 부족하다고 했는데…"',
    empathy: '드시고 싶은 것을 마음껏 드시지 못하는 그 답답함, 저희가 압니다.',
    solution: '서울대 출신 임플란트 전문 원장이 CT 정밀 진단 후 맞춤 치료 계획을 세웁니다. 뼈가 부족한 경우에도 골이식과 병행하여 진행 가능합니다.',
    cta: '무료 CT 촬영으로 정밀 진단 받아보세요.',
    treatmentSlugs: ['full-implant', 'all-on-x', 'implant'],
  },
  B: {
    name: '페르소나 B',
    label: '치과 공포증 환자',
    age: '20~50대',
    situation: '치과 소리, 냄새, 통증에 대한 공포로 수년간 치과를 미뤄온 분',
    pain: '이가 아파도 참고, 상태가 나빠질수록 더 가기 무서워지는 악순환.',
    fear: '"무서워서 치과를 못 가겠어요." "마취해도 아프면 어떡하죠?"',
    empathy: '무서운 건 당연합니다. 그래서 저희가 수면진료를 합니다.',
    solution: '마취가 안 되면 절대 시작하지 않습니다. 수면진료로 잠깐 잠드는 사이 치료가 끝납니다. 그리고 "그게 끝이에요?"라고 물으실 겁니다.',
    cta: '수면진료 상담 예약하기',
    treatmentSlugs: ['sedation', 'painless'],
  },
  C: {
    name: '페르소나 C',
    label: '교정 고민 환자',
    age: '10대~40대',
    situation: '교정을 하고 싶지만, 비용·기간·외관 때문에 망설이는 분',
    pain: '울퉁불퉁한 치열이 콤플렉스이지만, 철사 교정은 부담스럽습니다.',
    fear: '"성인인데 교정해도 되나요?" "투명교정이 효과 있나요?" "너무 오래 걸리지는 않나요?"',
    empathy: '웃을 때 입을 가리셨던 경험, 저희도 알고 있습니다.',
    solution: '교정과 전문의가 3D 시뮬레이션으로 예상 결과를 미리 보여드립니다. 투명교정(인비절라인)으로 일상에 거의 지장 없이 교정이 가능합니다.',
    cta: '교정 무료 상담 예약하기',
    treatmentSlugs: ['orthodontics', 'invisalign'],
  },
} as const;

// ─── TREATMENT PAGE EMPATHY HERO COPY ──────────────────────
// slug를 key로 사용, 페르소나 기반
export const TREATMENT_EMPATHY: Record<string, {
  heroTagline: string;
  heroSub: string;
  personaRef: 'A' | 'B' | 'C' | null;
}> = {
  'full-implant': {
    heroTagline: '다른 곳에서 안 된다고 들으셨다면,\n저희에게 오세요.',
    heroSub: '뼈가 부족해도, 전신 질환이 있어도 — 서울대 출신 전문의가 방법을 찾습니다.',
    personaRef: 'A',
  },
  'all-on-x': {
    heroTagline: '틀니의 불편함,\n이제 끝내실 수 있습니다.',
    heroSub: '전체 치아를 4~6개의 임플란트로 고정. 수술 당일부터 씹는 기능이 회복됩니다.',
    personaRef: 'A',
  },
  'implant': {
    heroTagline: '빠진 자리를 그냥 두셨나요?\n더 늦기 전에 시작하세요.',
    heroSub: '빈 자리 하나가 옆 치아까지 무너뜨립니다. 지금이 가장 빠른 때입니다.',
    personaRef: 'A',
  },
  'orthodontics': {
    heroTagline: '웃을 때 입을 가리셨던 분들에게.',
    heroSub: '교정과 전문의가 3D 시뮬레이션으로 당신의 미소를 미리 보여드립니다.',
    personaRef: 'C',
  },
  'invisalign': {
    heroTagline: '교정 중인 줄, 아무도 모릅니다.',
    heroSub: '투명교정 인비절라인. 인증의가 직접 진료하는 서울365치과에서.',
    personaRef: 'C',
  },
  'sedation': {
    heroTagline: '잠깐 잠들었다 깨면,\n치료가 끝나 있습니다.',
    heroSub: '무서워서 10년을 미루신 분도 계셨습니다. 이제, 미루지 않으셔도 됩니다.',
    personaRef: 'B',
  },
  'cosmetic': {
    heroTagline: '자연스러운 아름다움,\n티 나지 않는 치료.',
    heroSub: '올세라믹, 라미네이트, 잇몸 성형까지. 웃을 때 자신감이 달라집니다.',
    personaRef: null,
  },
  'cavity': {
    heroTagline: '시린 치아,\n참지 마세요.',
    heroSub: '무통마취로 시작하는 충치 치료. 마취가 안 되면, 절대 시작하지 않습니다.',
    personaRef: 'B',
  },
  'root-canal': {
    heroTagline: '발치 권유를 받으셨다면,\n한 번만 더 확인해 보세요.',
    heroSub: '보존과 전문의가 자연치아를 살릴 수 있는지, 끝까지 확인합니다.',
    personaRef: null,
  },
  'pediatric': {
    heroTagline: '아이가 치과를 무서워하지 않도록.',
    heroSub: '소아 전문 의료진이 아이의 속도에 맞춰 천천히, 다정하게 진료합니다.',
    personaRef: null,
  },
} as const;

// ─── DOCTOR STORY COPY (프로필 페이지용) ──────────────────
export const DOCTOR_STORIES: Record<string, {
  storyIntro: string;
  profileSummary: string[];
  principle: string;
}> = {
  'park-junkyu': {
    storyIntro: `박준규 대표원장은 서울대학교 치과대학을 졸업하고, 같은 대학원에서 우등으로 석사 학위를 취득했습니다. 이후 서울대학교 치과병원에서 수련하며 통합치의학과 전문의 자격을 획득했습니다.

하버드 대학교 임플란트 고급과정, 펜실베니아 대학교 미세근관치료과정을 수료하며 세계적 수준의 임상 역량을 쌓았습니다.

그가 서울365치과를 열며 세운 원칙은 단 하나였습니다.

"마취가 안 되면, 절대 시작하지 않는다."

이 원칙은 단순한 진료 매뉴얼이 아닙니다. 치과가 무서워서 10년을 미뤄온 환자, 다른 병원에서 치료를 거부당한 환자, 마취가 잘 안 되는 체질이라 고통받았던 환자 — 이 모든 분들이 서울365치과를 찾아오시는 이유가 바로 이 원칙에 있습니다.

5인의 서울대 출신 원장이 한 팀으로 움직이며, 임플란트부터 교정, 신경치료, 보철까지 환자 한 분의 구강 전체를 종합적으로 봅니다. 이것이 통합치의학의 본질이며, 박준규 원장이 추구하는 진료의 방향입니다.`,
    profileSummary: [
      '서울대학교 치과대학 졸업, 동 대학원 석사 (우등졸업)',
      '보건복지부 인증 통합치의학과 전문의',
      '마취가 안 되면 절대 시작하지 않는 원칙 실천',
    ],
    principle: '마취가 안 되면, 절대 시작하지 않는다.',
  },
  'choi-dabin': {
    storyIntro: `최다빈 원장은 서울대학교 치과대학을 졸업하고, 같은 대학원에서 석사 학위를 취득했습니다. 서울대학교 치과병원에서 수련 과정을 거치며 환자 중심의 진료 철학을 다졌습니다.

그가 가장 중요하게 생각하는 것은 '환자의 불안을 먼저 해소하는 것'입니다. 치료 전 충분한 설명, 치료 중 세심한 배려, 치료 후 꼼꼼한 경과 관리 — 이 과정을 빠뜨리지 않습니다.

"환자분이 이해하셨다고 말씀하시기 전에는, 치료를 시작하지 않습니다."`,
    profileSummary: [
      '서울대학교 치과대학 졸업, 치의학대학원 석사',
      '환자 눈높이에 맞춘 설명과 세심한 진료',
      '일반진료·심미치료·보존치료 담당',
    ],
    principle: '환자분이 이해하셨다고 말씀하시기 전에는, 치료를 시작하지 않습니다.',
  },
  'jung-munhee': {
    storyIntro: `정문희 원장은 서울대학교 치과대학을 졸업한 뒤, 같은 대학원에서 박사 학위까지 취득한 보존과 전문의입니다. 서울대학교 치과병원 보존과에서 전공의 과정을 마쳤습니다.

보존과 전문의의 사명은 명확합니다 — 자연치아를 살리는 것.

다른 곳에서 "빼야 한다"는 이야기를 들었더라도, 정문희 원장은 포기하지 않습니다. 미세현미경을 사용한 정밀 신경치료, 재신경치료, 치근단절제술까지 — 자연치아를 살릴 수 있는 모든 방법을 동원합니다.

"뽑기 전에, 한 번만 더 확인해 보세요. 살릴 수 있을지도 모릅니다."`,
    profileSummary: [
      '서울대학교 치과대학 졸업, 치의학대학원 박사',
      '보건복지부 인증 보존과 전문의',
      '자연치아 보존을 위한 끝까지 포기 않는 치료',
    ],
    principle: '뽑기 전에, 한 번만 더 확인해 보세요.',
  },
  'sang-sehoon': {
    storyIntro: `상세훈 원장은 서울대학교 치과대학을 졸업하고, 같은 대학원에서 석사 학위를 취득했습니다. 서울대학교 치과병원에서의 수련을 통해 정밀한 진단 역량을 쌓았습니다.

그의 진료 철학은 '정확한 진단이 좋은 치료의 시작'이라는 것입니다.

임플란트와 보철을 전문으로 하는 상세훈 원장은, 모든 치료 전 CT 촬영과 구강 스캔을 통한 정밀 분석을 거칩니다. 환자와 함께 진단 결과를 공유하고, 최적의 치료 방향을 함께 결정합니다.`,
    profileSummary: [
      '서울대학교 치과대학 졸업, 치의학대학원 석사',
      '정밀 진단 기반의 임플란트·보철 전문',
      '환자와 함께 결정하는 맞춤형 치료 계획',
    ],
    principle: '정확한 진단이, 좋은 치료의 시작입니다.',
  },
  'ha-nuri': {
    storyIntro: `하누리 원장은 서울대학교 치과대학을 졸업한 뒤, 같은 대학원 교정과에서 전공의 수련을 마친 교정과 전문의입니다. 인비절라인 인증의 자격도 보유하고 있습니다.

교정은 단순히 치아를 가지런하게 만드는 것이 아닙니다. 교합 — 즉 위아래 치아가 만나는 방식 — 을 과학적으로 설계하는 것입니다.

하누리 원장은 3D 시뮬레이션을 통해 치료 결과를 미리 보여드리며, 환자가 납득한 상태에서 교정을 시작합니다. 소아부터 성인까지, 기능과 심미 모두를 고려한 교정 치료를 제공합니다.

"아름다운 미소는, 건강한 교합에서 시작됩니다."`,
    profileSummary: [
      '서울대학교 치과대학 졸업, 교정과 전공의 수련',
      '보건복지부 인증 교정과 전문의, 인비절라인 인증의',
      '3D 시뮬레이션 기반, 기능과 심미를 모두 고려하는 교정',
    ],
    principle: '아름다운 미소는, 건강한 교합에서 시작됩니다.',
  },
} as const;

// ─── DESIGN SYSTEM TOKENS ──────────────────────────────────
// Note: 디자이너 지정 원래 팔레트 (#1B6FC9) → 현재 Electric Blue (#0066FF)로 업그레이드됨
// 아래는 참조용 디자인 시스템 사양
export const DESIGN_TOKENS = {
  primary: '#0066FF',        // 실제 적용된 Electric Blue
  primaryDark: '#0050CC',
  primaryBright: '#2979FF',
  secondaryLight: '#E3F0FF',
  accent: '#00E5FF',
  darkBg: '#040B18',         // navy
  darkBgLight: '#0A1628',    // navyLight
  textPrimary: '#0f172a',
  textSecondary: '#64748b',
  bgWhite: '#FFFFFF',
  bgLight: '#F8FAFC',

  // Design direction note (원래 지정값 참조)
  _originalPrimary: '#1B6FC9',
  _originalDark: '#155BA3',
  _originalSecondaryLight: '#E8F0FE',
  _originalDarkBg: '#0A1628',
  _originalText: '#1a1a1a',
  _originalTextSub: '#666666',
} as const;

// ─── PLACEMENT GUIDE ───────────────────────────────────────
// 각 카피의 배치 위치를 정의
export const PLACEMENT_GUIDE = {
  brandSlogan: {
    where: ['Footer 브랜드 영역', 'OG:description', 'Meta description 접두어'],
    copy: MESSAGING.brandSlogan,
  },
  heroMain: {
    where: ['메인 페이지 히어로 H1'],
    copy: MESSAGING.heroMain,
  },
  heroSub: {
    where: ['메인 페이지 히어로 H1 아래 설명문'],
    copy: MESSAGING.heroSub,
  },
  heroPhilosophy: {
    where: ['메인 페이지 히어로 뱃지 또는 태그라인'],
    copy: MESSAGING.heroPhilosophy,
  },
  diffHeadline: {
    where: ['차별화 섹션(WHY SEOUL 365) 헤드라인'],
    copy: MESSAGING.diffHeadline,
  },
  ctaMain: {
    where: ['Final CTA 섹션 H2'],
    copy: MESSAGING.ctaMain,
  },
  ctaSub: {
    where: ['Final CTA 서브카피'],
    copy: MESSAGING.ctaSub,
  },
  labEmphasis: {
    where: ['자체 기공실 카드 타이틀 또는 별도 섹션 헤드라인'],
    copy: MESSAGING.labEmphasis,
  },
  sleepEmphasis: {
    where: ['수면진료 카드 타이틀 또는 별도 섹션 헤드라인'],
    copy: MESSAGING.sleepEmphasis,
  },
} as const;
