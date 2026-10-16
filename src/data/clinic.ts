// 서울365치과 병원 기본 정보
export const CLINIC = {
  name: '서울365치과의원',
  nameEn: 'Seoul 365 Dental Clinic',
  representative: '박준규',
  phone: '032-432-0365',
  phoneTel: 'tel:032-432-0365',
  address: '인천 남동구 예술로 138 이토타워 2층',
  addressShort: '인천 남동구 예술로 138',
  addressDetail: '이토타워 2층',
  postalCode: '21556',
  nearStation: '예술회관역 5번 출구 250m',
  geo: { lat: 37.4482, lng: 126.7042 },
  foundingYear: 2019,
  url: 'https://seoul365dc.kr',
  kakao: 'https://pf.kakao.com/_dMsCT',
  naverBooking: 'https://booking.naver.com/booking/13/bizes/426166',
  naverTalk: 'https://talk.naver.com/ct/w4iv2k',
  instagram: 'https://www.instagram.com/seoul365dental',
  naverBlog: 'https://blog.naver.com/seoul365dental',
} as const;

export const HOURS = [
  { day: '월~목', time: '10:00 - 21:00', note: '야간진료' },
  { day: '금', time: '10:00 - 19:00', note: '' },
  { day: '토', time: '10:00 - 14:00', note: '' },
  { day: '일·공휴일', time: '14:00 - 18:00', note: '공휴일 진료' },
] as const;

export const HOURS_DETAIL = {
  mon: { open: '10:00', close: '21:00' },
  tue: { open: '10:00', close: '21:00' },
  wed: { open: '10:00', close: '21:00' },
  thu: { open: '10:00', close: '21:00' },
  fri: { open: '10:00', close: '19:00' },
  sat: { open: '10:00', close: '14:00' },
  sun: { open: '14:00', close: '18:00' },
} as const;

export const COLORS = {
  primary: '#0066FF',
  primaryBright: '#2979FF',
  primaryDark: '#0050CC',
  primaryLight: '#E3F0FF',
  accent: '#00E5FF',
  navy: '#040B18',
  navyLight: '#0A1628',
  text: '#0f172a',
  textSub: '#64748b',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  bg: '#FFFFFF',
  bgLight: '#F8FAFC',
} as const;

export const STATS = [
  { label: '서울대 출신', value: '5인', icon: 'fa-user-doctor' },
  { label: '연중무휴', value: '365일', icon: 'fa-calendar-check' },
  { label: '야간진료', value: '21시', icon: 'fa-moon' },
  { label: '자체 기공실', value: '보유', icon: 'fa-gear' },
] as const;

export const DIFF_CARDS = [
  {
    icon: 'fa-user-doctor',
    title: '서울대 5인 원장 협진',
    headline: '5인의 전문의가, 한 분의 환자를 봅니다.',
    desc: '임플란트, 교정, 보존, 보철, 종합진료 — 각 분야 전문 원장이 하나의 케이스를 함께 논의합니다.',
  },
  {
    icon: 'fa-gear',
    title: '자체 기공실 보유',
    headline: '보철물, 외부에 맡기지 않습니다.',
    desc: '원내 기공실에서 보철물을 제작하고, 필요하면 당일 조정합니다. 케이스에 따라 내원 횟수를 줄일 수 있습니다.',
  },
  {
    icon: 'fa-bed',
    title: '수면진료',
    headline: '수면진료(의식하 진정)로 긴장을 줄인 상태에서 치료합니다(개인차 있음).',
    desc: '치과 치료가 많이 두려운 분께는 사전 평가 후 의식하 진정을 안내해 드립니다. 적용 여부와 반응에는 개인차가 있습니다.',
  },
  {
    icon: 'fa-syringe',
    title: '무통 마취 시스템',
    headline: '마취 효과를 확인한 뒤 시작합니다.',
    desc: '디지털 무통마취기로 마취 통증을 최소화하고, 충분히 마취된 것을 확인한 후에만 치료를 시작합니다.',
  },
  {
    icon: 'fa-calendar-check',
    title: '365일·야간 진료',
    headline: '365일 문을 여는 이유가 있습니다.',
    desc: '일요일·공휴일 진료. 월~목 야간 21시. 점심시간 없이 연속 진료. 바쁜 분들을 위해.',
  },
  {
    icon: 'fa-bolt',
    title: '즉시로딩 (MUA)',
    headline: '조건이 맞으면, 식립 당일 임시치아를 연결합니다.',
    desc: '뼈 상태와 초기 고정력이 충분한 경우 MUA를 이용해 식립 당일 임시치아를 연결할 수 있습니다. 적용 여부는 검사 후 결정합니다.',
  },
] as const;
