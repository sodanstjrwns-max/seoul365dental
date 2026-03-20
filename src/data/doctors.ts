export interface Doctor {
  slug: string;
  name: string;
  title: string;
  titleShort: string;
  photo: string;
  philosophy: string;
  education: string[];
  credentials: string[];
  career: string[];
  societies: string[];
  specialties: string[];
  treatmentLinks: string[];
  h1: string;
  metaTitle: string;
  metaDesc: string;
}

export const doctors: Doctor[] = [
  {
    slug: 'park-junkyu',
    name: '박준규',
    title: '대표원장',
    titleShort: '대표원장',
    photo: '/static/dr-park-profile.jpg',
    philosophy: '환자가 알아들을 수 있는 쉬운 단어로 설명합니다. 마취가 되지 않은 상태에서 치료를 절대 강행하지 않습니다. 다른 곳에서는 치료를 못 받는다는 환자분들도, 저희에게는 치료를 받으실 수 있습니다.',
    education: [
      '서울대학교 치과대학 졸업',
      '서울대학교 치의학대학원 우등졸업',
      '서울대학교 치의학 석사',
    ],
    credentials: [
      '보건복지부 인증 통합치의학과 전문의',
      '미국 하버드대학교 치과대학 임플란트 고급과정 수료',
      '미국 펜실베니아 대학교 미세근관치료과정 수료',
      '미국 인비절라인 교정 인증의',
    ],
    career: [
      '서울대학교 치과병원 수련의',
      '오스템 임플란트 연구센터 자문위원',
      '메가젠임플란트 연구센터 자문위원',
      '오스템 A.I.C Implant Master course 수료',
      'CAD-CAM master class 수료',
    ],
    societies: [
      '대한치과보철학회 정회원',
      '대한치과보존학회 정회원',
      '대한심미치과학회 정회원',
      '대한구강악안면임플란트 정회원',
      '대한턱관절교합학회 정회원',
      '대한통합치과학회 정회원',
    ],
    specialties: ['전체임플란트', '디지털풀아치(올온X)', '심미보철', '수면임플란트'],
    treatmentLinks: ['/treatments/full-implant', '/treatments/all-on-x', '/treatments/implant'],
    h1: '박준규 대표원장 – 서울대 통합치의학과 전문의',
    metaTitle: '박준규 대표원장 | 서울365치과 - 서울대 통합치의학과 전문의',
    metaDesc: '서울365치과 박준규 대표원장. 서울대 치의학과 졸업, 통합치의학과 전문의, 하버드 임플란트 고급과정. 전체임플란트·디지털풀아치·심미보철 전문.',
  },
  {
    slug: 'choi-dabin',
    name: '최다빈',
    title: '원장',
    titleShort: '원장',
    photo: '/static/doctor-choi.svg',
    philosophy: '환자분의 불안한 마음을 먼저 헤아리고, 꼼꼼한 설명으로 신뢰를 드리겠습니다.',
    education: [
      '서울대학교 치과대학 졸업',
      '서울대학교 치의학대학원 석사',
    ],
    credentials: [],
    career: [
      '서울대학교 치과병원 수련의',
    ],
    societies: [
      '대한치과보존학회 정회원',
      '대한치과보철학회 정회원',
    ],
    specialties: ['일반진료', '심미치료', '보존치료'],
    treatmentLinks: ['/treatments/cavity', '/treatments/cosmetic'],
    h1: '최다빈 원장 – 서울대 치의학석사',
    metaTitle: '최다빈 원장 | 서울365치과 - 서울대 치의학석사',
    metaDesc: '서울365치과 최다빈 원장. 서울대 치의학석사. 꼼꼼한 설명과 정밀한 진료.',
  },
  {
    slug: 'jung-munhee',
    name: '정문희',
    title: '원장 (보존과 전문의)',
    titleShort: '원장',
    photo: '/static/doctor-jung.svg',
    philosophy: '자연치아를 살리는 것이 최선의 치료입니다. 포기하지 않고 끝까지 치료합니다.',
    education: [
      '서울대학교 치과대학 졸업',
      '서울대학교 치의학대학원 박사',
    ],
    credentials: [
      '보건복지부 인증 보존과 전문의',
    ],
    career: [
      '서울대학교 치과병원 보존과 전공의',
    ],
    societies: [
      '대한치과보존학회 정회원',
      '대한근관치료학회 정회원',
    ],
    specialties: ['신경치료', '재신경치료', '치근단절제술', '보존치료'],
    treatmentLinks: ['/treatments/root-canal', '/treatments/retreatment', '/treatments/apicoectomy'],
    h1: '정문희 원장 – 보존과 전문의 (서울대 박사)',
    metaTitle: '정문희 원장 | 서울365치과 - 보존과 전문의',
    metaDesc: '서울365치과 정문희 원장. 서울대 박사, 보존과 전문의. 신경치료·재신경치료·치근단절제술 전문.',
  },
  {
    slug: 'sang-sehoon',
    name: '상세훈',
    title: '원장',
    titleShort: '원장',
    photo: '/static/doctor-sang.svg',
    philosophy: '정확한 진단이 좋은 치료의 시작입니다. 환자분과 함께 최적의 치료를 찾겠습니다.',
    education: [
      '서울대학교 치과대학 졸업',
      '서울대학교 치의학대학원 석사',
    ],
    credentials: [],
    career: [
      '서울대학교 치과병원 수련의',
    ],
    societies: [
      '대한치과보철학회 정회원',
      '대한구강악안면임플란트 정회원',
    ],
    specialties: ['임플란트', '보철치료', '종합진료'],
    treatmentLinks: ['/treatments/implant', '/treatments/crown', '/treatments/bridge'],
    h1: '상세훈 원장 – 서울대 치의학석사',
    metaTitle: '상세훈 원장 | 서울365치과 - 서울대 치의학석사',
    metaDesc: '서울365치과 상세훈 원장. 서울대 치의학석사. 임플란트·보철치료 전문.',
  },
  {
    slug: 'ha-nuri',
    name: '하누리',
    title: '원장 (교정과 전문의)',
    titleShort: '원장',
    photo: '/static/doctor-ha.svg',
    philosophy: '아름다운 미소는 건강한 교합에서 시작됩니다. 기능과 심미 모두를 고려한 교정 치료를 약속드립니다.',
    education: [
      '서울대학교 치과대학 졸업',
      '서울대학교 치의학대학원 교정과 수련',
    ],
    credentials: [
      '보건복지부 인증 교정과 전문의',
      '인비절라인 인증의 (Invisalign Certified)',
    ],
    career: [
      '서울대학교 치과병원 교정과 전공의',
    ],
    societies: [
      '대한치과교정학회 정회원',
      '대한설측교정학회 정회원',
    ],
    specialties: ['인비절라인', '교정', '소아교정', '성인교정'],
    treatmentLinks: ['/treatments/orthodontics', '/treatments/invisalign'],
    h1: '하누리 원장 – 교정과 전문의 (인비절라인 인증의)',
    metaTitle: '하누리 원장 | 서울365치과 - 교정과 전문의',
    metaDesc: '서울365치과 하누리 원장. 교정과 전문의, 인비절라인 인증의. 투명교정·성인교정·소아교정 전문.',
  },
];

export function getDoctorBySlug(slug: string): Doctor | undefined {
  return doctors.find(d => d.slug === slug);
}
