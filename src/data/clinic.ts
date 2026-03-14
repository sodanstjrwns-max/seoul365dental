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
    voice: '"담당 선생님이 다른 원장님과 직접 의논하시더라고요."',
  },
  {
    icon: 'fa-gear',
    title: '자체 기공실 보유',
    headline: '보철물, 외부에 맡기지 않습니다.',
    desc: '원내 기공실에서 직접 제작·당일 수정. 외주 대비 핏(fit)이 정밀하고, 방문 횟수가 줄어듭니다.',
    voice: '"보철 맞추러 두 번 올 줄 알았는데 바로 해주셨어요."',
  },
  {
    icon: 'fa-bed',
    title: '수면진료',
    headline: '잠깐 잠들었다 깨면, 치료가 끝나 있습니다.',
    desc: '의식하진정법으로, 치과 공포증이 심한 분도 편안하게 치료받으실 수 있습니다.',
    voice: '"10년 넘게 못 갔는데, 수면진료 덕분에 드디어 치료받았어요."',
  },
  {
    icon: 'fa-syringe',
    title: '무통 마취 시스템',
    headline: '마취가 안 되면, 절대 시작하지 않습니다.',
    desc: '디지털 무통마취기로 마취 통증을 최소화하고, 충분히 마취된 것을 확인한 후에만 치료를 시작합니다.',
    voice: '"마취할 때부터 걱정했는데, 정말 거의 안 느껴졌어요."',
  },
  {
    icon: 'fa-calendar-check',
    title: '365일·야간 진료',
    headline: '365일 문을 여는 이유가 있습니다.',
    desc: '일요일·공휴일 진료. 월~목 야간 21시. 점심시간 없이 연속 진료. 바쁜 분들을 위해.',
    voice: '"야근 끝나고 8시에 갔는데 진료해주셔서 감사했어요."',
  },
  {
    icon: 'fa-bolt',
    title: '즉시로딩 (MUA)',
    headline: '발치 후, 바로 씹을 수 있습니다.',
    desc: 'MUA 기술로 임플란트 식립 당일부터 기능 회복이 가능합니다. 이 없는 불편한 기간을 최소화합니다.',
    voice: '"수술 당일에 임시치아를 바로 해주셔서 놀랐습니다."',
  },
] as const;
