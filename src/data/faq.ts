export const mainFaq = [
  {
    q: '임플란트 비용은 얼마인가요?',
    a: '서울365치과 기준 오스템 84만원(+임시치아 94만원), 오스템 프리미엄 SOI 99만원(+임시치아 109만원), 스트라우만 이벤트 109만원입니다. 이벤트 가격(최다빈/상세훈 원장) 59만원부터 가능합니다. 65세 이상은 2개까지 건강보험 적용 가능합니다.',
  },
  {
    q: '임플란트 수명은 얼마나 되나요?',
    a: '적절한 관리 시 10년 이상 사용 가능하며, 많은 경우 20~30년 이상 유지됩니다. 정기적인 검진과 올바른 구강 위생 관리가 수명 연장의 핵심입니다.',
  },
  {
    q: '수면진료는 안전한가요?',
    a: '네, 매우 안전합니다. 수면마취(의식하진정요법) 비용은 20만원이며, 서울365치과는 생체징후 실시간 모니터링 장비를 완비하고 있습니다. 수면진료 전문 교육을 이수한 의료진이 진행하며, 응급 장비와 약물도 구비되어 있습니다.',
  },
  {
    q: '365일 진료가 정말 가능한가요?',
    a: '네, 서울365치과는 이름 그대로 365일 진료합니다. 평일 월~목은 야간 21시까지, 금요일은 18시까지, 토요일은 14:00~18:00, 일요일과 공휴일에도 14:00~18:00 진료합니다. 점심시간 없이 연속 진료합니다.',
  },
  {
    q: '주차는 어디에 하나요?',
    a: '이토타워 건물 내 주차장을 이용하실 수 있습니다. 진료 시간에 따라 주차 지원이 가능하며, 자세한 사항은 내원 시 안내데스크에 문의해 주세요.',
  },
];

// ============================================================
// 수가표 — 2026-03 기준 (TalkFile_치료비용수가표.xlsx 반영)
// ============================================================

export interface PricingItem {
  treatment: string;
  price: string;
  insurance: string;
  category: string;
  note?: string;
}

export const pricingCategories = [
  { key: '임플란트', label: '임플란트 치료', icon: 'fa-tooth' },
  { key: '보철', label: '보철 치료', icon: 'fa-crown' },
  { key: '틀니', label: '틀니 치료', icon: 'fa-teeth-open' },
  { key: '보존', label: '보존 치료 (충치·레진·인레이)', icon: 'fa-shield-halved' },
  { key: '소아', label: '소아 치료', icon: 'fa-child' },
  { key: '교정', label: '교정 치료', icon: 'fa-teeth' },
  { key: '미용', label: '미용 치료 (과세)', icon: 'fa-star' },
  { key: '기타', label: '기타 치료', icon: 'fa-kit-medical' },
];

export const pricingData: PricingItem[] = [
  // ── 임플란트 치료 ──
  { treatment: '네비게이션 가이드', price: '10만원', insurance: '비급여', category: '임플란트' },
  { treatment: '네비게이션 hole', price: '5만원', insurance: '비급여', category: '임플란트' },
  { treatment: 'MUA', price: '10~30만원', insurance: '비급여', category: '임플란트' },
  { treatment: '오스템 임플란트 (+임시치아)', price: '94만원', insurance: '비급여', category: '임플란트' },
  { treatment: '오스템 임플란트', price: '84만원', insurance: '65세 건보 적용 가능', category: '임플란트' },
  { treatment: '오스템 프리미엄 SOI (+임시치아)', price: '109만원', insurance: '비급여', category: '임플란트' },
  { treatment: '오스템 프리미엄 SOI', price: '99만원', insurance: '비급여', category: '임플란트' },
  { treatment: '스트라우만 (이벤트)', price: '109만원', insurance: '비급여', category: '임플란트' },
  { treatment: '메가젠 (박준규 원장)', price: '74만원', insurance: '비급여', category: '임플란트' },
  { treatment: '오스템 이벤트 (최다빈 원장)', price: '59만원', insurance: '비급여', category: '임플란트' },
  { treatment: '오스템 이벤트 (상세훈 원장)', price: '59만원', insurance: '비급여', category: '임플란트' },
  { treatment: 'GBR-A (소범위 골이식)', price: '30만원', insurance: '비급여', category: '임플란트' },
  { treatment: 'GBR-B (중범위 골이식)', price: '50만원', insurance: '비급여', category: '임플란트' },
  { treatment: 'GBR-C (대범위 골이식)', price: '100만원', insurance: '비급여', category: '임플란트' },
  { treatment: 'SINUS-A (상악동거상 소)', price: '50만원', insurance: '비급여', category: '임플란트' },
  { treatment: 'SINUS-B (상악동거상 중)', price: '100만원', insurance: '비급여', category: '임플란트' },
  { treatment: 'SINUS-C (상악동거상 대)', price: '150만원', insurance: '비급여', category: '임플란트' },
  { treatment: '전치 Pontic', price: '60만원', insurance: '비급여', category: '임플란트' },
  { treatment: '구치 Pontic', price: '50만원', insurance: '비급여', category: '임플란트' },
  { treatment: '교합조정', price: '1만원', insurance: '비급여', category: '임플란트' },
  { treatment: '치아 삭제', price: '1만원', insurance: '비급여', category: '임플란트' },
  { treatment: '임시치아 (별도)', price: '20만원', insurance: '비급여', category: '임플란트' },
  { treatment: '커스텀 어버트먼트 (보험)', price: '5만원', insurance: '급여', category: '임플란트' },
  { treatment: '커스텀 어버트먼트 (비보험)', price: '10만원', insurance: '비급여', category: '임플란트' },
  { treatment: '리타이트닝', price: '10만원', insurance: '비급여', category: '임플란트' },
  { treatment: 'IPT 레진 필링', price: '4만원', insurance: '비급여', category: '임플란트' },
  { treatment: 'Adding (1면당)', price: '10만원', insurance: '비급여', category: '임플란트' },
  { treatment: 'Adding (1면당-타원)', price: '20만원', insurance: '비급여', category: '임플란트' },

  // ── 보철 치료 ──
  { treatment: 'MTA', price: '5만원', insurance: '비급여', category: '보철' },
  { treatment: 'MTA (Apico)', price: '10만원', insurance: '비급여', category: '보철' },
  { treatment: '포스트', price: '15만원', insurance: '비급여', category: '보철' },
  { treatment: '레진 코어', price: '8만원', insurance: '비급여', category: '보철' },
  { treatment: '지르코니아 크라운 (구치부)', price: '50만원', insurance: '비급여', category: '보철' },
  { treatment: '지르코니아 크라운 (전치부)', price: '60만원', insurance: '비급여', category: '보철' },
  { treatment: 'A type 골드 크라운', price: '90만원', insurance: '비급여', category: '보철' },
  { treatment: 'PFM 크라운 (구치부)', price: '50만원', insurance: '비급여', category: '보철' },
  { treatment: 'PFM 크라운 (전치부)', price: '60만원', insurance: '비급여', category: '보철' },
  { treatment: 'Adding (보철)', price: '10만원', insurance: '비급여', category: '보철' },
  { treatment: 'Adding (보철-타원)', price: '20만원', insurance: '비급여', category: '보철' },

  // ── 틀니 치료 ──
  { treatment: '부분 틀니', price: '150만원', insurance: '65세 건보 적용 가능', category: '틀니' },
  { treatment: '전체 틀니', price: '180만원', insurance: '65세 건보 적용 가능', category: '틀니' },
  { treatment: '오버덴쳐 (임플란트 틀니)', price: '200만원', insurance: '비급여', category: '틀니' },
  { treatment: '하이브리드 덴처', price: '300만원', insurance: '비급여', category: '틀니' },
  { treatment: '틀니 수리 (relining)', price: '10만원', insurance: '비급여', category: '틀니' },
  { treatment: '틀니 개상 (rebasing)', price: '30만원', insurance: '비급여', category: '틀니' },
  { treatment: '임시 틀니', price: '30만원', insurance: '비급여', category: '틀니' },
  { treatment: 'Flipper', price: '10만원', insurance: '비급여', category: '틀니' },
  { treatment: 'All-on-4 (오스템)', price: '550만원', insurance: '비급여', category: '틀니' },
  { treatment: 'All-on-6 (오스템)', price: '700만원', insurance: '비급여', category: '틀니' },

  // ── 보존 치료 ──
  { treatment: 'CA (글래스아이오노머)', price: '6만원', insurance: '비급여', category: '보존' },
  { treatment: '레진A (소면적)', price: '8만원', insurance: '비급여', category: '보존' },
  { treatment: '레진B', price: '10만원', insurance: '비급여', category: '보존' },
  { treatment: '레진C', price: '12만원', insurance: '비급여', category: '보존' },
  { treatment: '레진D (대면적)', price: '15만원', insurance: '비급여', category: '보존' },
  { treatment: '레진E (광범위)', price: '20만원', insurance: '비급여', category: '보존' },
  { treatment: 'Diastema 레진 (면당)', price: '20만원', insurance: '비급여', category: '보존', note: '치아 사이 틈 수복' },
  { treatment: 'Enamic 인레이', price: '35만원', insurance: '비급여', category: '보존' },
  { treatment: 'Enamic 온레이', price: '40만원', insurance: '비급여', category: '보존' },
  { treatment: '골드 인레이', price: '75만원', insurance: '비급여', category: '보존' },
  { treatment: '골드 인레이 (구치부 MOD)', price: '90만원', insurance: '비급여', category: '보존' },
  { treatment: 'CA (대표원장님)', price: '10만원', insurance: '비급여', category: '보존', note: '대표원장 시술' },
  { treatment: '레진A (대표원장님)', price: '10만원', insurance: '비급여', category: '보존', note: '대표원장 시술' },
  { treatment: '레진B (대표원장님)', price: '12만원', insurance: '비급여', category: '보존', note: '대표원장 시술' },
  { treatment: '레진C (대표원장님)', price: '14만원', insurance: '비급여', category: '보존', note: '대표원장 시술' },
  { treatment: '레진D (대표원장님)', price: '17만원', insurance: '비급여', category: '보존', note: '대표원장 시술' },
  { treatment: '레진E (대표원장님)', price: '22만원', insurance: '비급여', category: '보존', note: '대표원장 시술' },

  // ── 소아 치료 ──
  { treatment: '소아 레진', price: '8만원', insurance: '비급여', category: '소아' },
  { treatment: 'Band(Crown) & Loop', price: '20만원', insurance: '비급여', category: '소아' },
  { treatment: '불소 도포 (varnish)', price: '4만원', insurance: '18세 이하 건보', category: '소아' },
  { treatment: 'Halterman', price: '40만원', insurance: '비급여', category: '소아' },

  // ── 교정 치료 ──
  { treatment: '교정 진단', price: '5만원', insurance: '비급여', category: '교정' },
  { treatment: '교정용 Screw', price: '5만원', insurance: '비급여', category: '교정' },
  { treatment: 'CLIPPY-C (세라믹 교정)', price: '365만원', insurance: '비급여', category: '교정' },
  { treatment: 'INTRUSION', price: '100만원', insurance: '비급여', category: '교정' },
  { treatment: 'Extrusion', price: '100만원', insurance: '비급여', category: '교정' },
  { treatment: '부분 교정', price: '150만원', insurance: '비급여', category: '교정' },
  { treatment: '부분 교정 CLIPPY-C (3-3)', price: '140만원', insurance: '비급여', category: '교정' },
  { treatment: '부분 교정 CLIPPY-C (4-4)', price: '150만원', insurance: '비급여', category: '교정' },
  { treatment: '1차 예방교정', price: '200만원~', insurance: '비급여', category: '교정' },
  { treatment: 'Retainer (악당)', price: '20만원', insurance: '비급여', category: '교정' },
  { treatment: 'RPE', price: '80만원', insurance: '비급여', category: '교정' },
  { treatment: 'ABP', price: '50만원', insurance: '비급여', category: '교정' },
  { treatment: 'MARPE', price: '80만원', insurance: '비급여', category: '교정' },
  { treatment: 'Active Plate', price: '100만원', insurance: '비급여', category: '교정' },
  { treatment: 'Twin Block', price: '80만원', insurance: '비급여', category: '교정' },
  { treatment: 'Twin Block (스크류 포함)', price: '100만원', insurance: '비급여', category: '교정' },
  { treatment: 'Invisalign (인비절라인)', price: '700만원', insurance: '비급여', category: '교정' },
  { treatment: 'Face Mask', price: '50만원', insurance: '비급여', category: '교정' },
  { treatment: 'Activator', price: '80만원', insurance: '비급여', category: '교정' },
  { treatment: 'FIXED 재부착 (본원)', price: '2만원', insurance: '비급여', category: '교정' },
  { treatment: 'FIXED 재제작 (본원)', price: '20만원', insurance: '비급여', category: '교정' },
  { treatment: 'CIRCUM (본원)', price: '20만원', insurance: '비급여', category: '교정' },
  { treatment: 'DEB (타원)', price: '25만원', insurance: '비급여', category: '교정' },
  { treatment: 'Bracket 재부착 (타치과)', price: '5만원', insurance: '비급여', category: '교정' },
  { treatment: 'FIXED 재부착 (타치과)', price: '5만원', insurance: '비급여', category: '교정' },
  { treatment: 'FIXED 제거 (타치과)', price: '2만원', insurance: '비급여', category: '교정' },
  { treatment: 'FIXED 제작 (타치과)', price: '30만원', insurance: '비급여', category: '교정' },
  { treatment: 'CIRCUM (타치과)', price: '30만원', insurance: '비급여', category: '교정' },
  { treatment: '타치과 교정환자 불편해결', price: '2만원', insurance: '비급여', category: '교정' },
  { treatment: '교정용 왁스 (타원)', price: '0.5만원', insurance: '비급여', category: '교정' },

  // ── 미용 치료 (과세) ──
  { treatment: '잇몸성형술 (간단)', price: '3만원', insurance: '비급여 (과세)', category: '미용' },
  { treatment: '잇몸성형술 (치조골삭제)', price: '10만원', insurance: '비급여 (과세)', category: '미용' },
  { treatment: '라미네이트', price: '60만원', insurance: '비급여 (과세)', category: '미용' },
  { treatment: '무삭제 라미네이트 (이벤트)', price: '40만원', insurance: '비급여 (과세)', category: '미용' },
  { treatment: '실활치 미백', price: '10만원', insurance: '비급여 (과세)', category: '미용' },
  { treatment: '치아 미백 (1회)', price: '9만원', insurance: '비급여 (과세)', category: '미용' },
  { treatment: '치아 미백 (3회)', price: '19만원', insurance: '비급여 (과세)', category: '미용' },
  { treatment: '해피타임 치아 미백 (3회)', price: '15만원', insurance: '비급여 (과세)', category: '미용' },

  // ── 기타 치료 ──
  { treatment: '이갈이 장치', price: '60만원', insurance: '비급여', category: '기타' },
  { treatment: '지혈제', price: '5만원', insurance: '비급여', category: '기타' },
  { treatment: '잠간고정술 레진 (비보)', price: '4만원', insurance: '비급여', category: '기타' },
  { treatment: '비보험 스케일링', price: '6만원', insurance: '비급여', category: '기타', note: '연 1회 건보 외 추가 시' },
  { treatment: 'TBI (칫솔질 교육)', price: '무료', insurance: '-', category: '기타' },
  { treatment: '미노클린', price: '2만원', insurance: '비급여', category: '기타' },
  { treatment: '임시치아 재부착', price: '2만원', insurance: '비급여', category: '기타' },
  { treatment: 'Fermit (임시충전)', price: '2만원', insurance: '비급여', category: '기타' },
];

// 대표 수가 요약 (홈/pricing 간략 표시용) — 가격순 정렬, 이벤트 표시
export const pricingSummary: PricingItem[] = [
  { treatment: '임플란트 이벤트', price: '59만원~', insurance: '비급여', category: '임플란트', note: '특가 이벤트' },
  { treatment: '메가젠 임플란트', price: '74만원', insurance: '비급여', category: '임플란트' },
  { treatment: '오스템 임플란트', price: '84만원~', insurance: '65세 건보 적용 가능', category: '임플란트' },
  { treatment: '오스템 프리미엄 SOI', price: '99만원~', insurance: '비급여', category: '임플란트' },
  { treatment: '스트라우만 임플란트', price: '109만원', insurance: '비급여', category: '임플란트', note: '이벤트' },
  { treatment: '레진 충치치료', price: '8~20만원', insurance: '비급여', category: '보존', note: '부위·범위에 따라 변동' },
  { treatment: 'MUA', price: '10~30만원', insurance: '비급여', category: '임플란트' },
  { treatment: '지르코니아 크라운', price: '50~60만원', insurance: '비급여', category: '보철' },
];
