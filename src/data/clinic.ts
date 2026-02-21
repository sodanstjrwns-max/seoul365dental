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
  url: 'https://seoul365dental.com',
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
  { icon: 'fa-user-doctor', title: '서울대 5인 전문의', desc: '각 분야별 전문의가 협력 진료합니다' },
  { icon: 'fa-calendar-check', title: '365일 진료', desc: '월~일 야간 21시까지, 점심시간 없음' },
  { icon: 'fa-gear', title: '자체 기공실', desc: '원내 기공실에서 당일 보철 수정 가능' },
  { icon: 'fa-bed', title: '수면진료', desc: '치과 공포증도 편안하게 치료 가능' },
  { icon: 'fa-syringe', title: '무통 마취', desc: '디지털 무통마취기로 통증 최소화' },
  { icon: 'fa-bolt', title: '즉시로딩', desc: 'MUA 이용, 당일 기능 회복 가능' },
] as const;
