export interface Treatment {
  slug: string;
  name: string;
  category: string;
  h1: string;
  metaTitle: string;
  metaDesc: string;
  heroTitle: string;
  heroSub: string;
  icon: string;
  shortDesc: string;
  concerns: string[];
  types: { name: string; desc: string }[];
  whyUs: { title: string; desc: string; icon: string }[];
  process: { step: string; desc: string }[];
  doctorSlug: string;
  faq: { q: string; a: string }[];
}

export const treatments: Treatment[] = [
  {
    slug: 'full-implant',
    name: '전체임플란트',
    category: '전문센터',
    h1: '전체임플란트 – 서울365치과 | 자체기공실 즉시로딩',
    metaTitle: '전체임플란트 | 서울365치과 - 자체기공실 즉시로딩',
    metaDesc: '서울365치과 전체임플란트. 자체 기공실에서 MUA 즉시로딩. 네비게이션 가이드 수술. 수면진료 가능.',
    heroTitle: '치아가 거의 없어도, 당일 씹을 수 있습니다',
    heroSub: '자체 기공실과 MUA 즉시로딩 시스템으로 빠르고 정확한 전체임플란트를 제공합니다.',
    icon: 'fa-teeth',
    shortDesc: '자체기공실 즉시로딩',
    concerns: [
      '치아가 거의 남아있지 않아 식사가 어려우신 분',
      '틀니가 불편해서 고정식 치아를 원하시는 분',
      '다른 병원에서 뼈가 부족해 안 된다고 하신 분',
      '빠른 시간 내에 치아를 회복하고 싶으신 분',
    ],
    types: [
      { name: '컨벤셔널 3피스 전체임플란트', desc: '개별 임플란트를 식립하여 가장 자연치아에 가까운 결과를 제공합니다. 가장 오래 검증된 방법입니다.' },
      { name: '올온X 스타일 전체임플란트', desc: '최소 4~6개의 임플란트로 전악을 회복합니다. 뼈이식 없이도 가능한 경우가 많습니다.' },
      { name: 'MUA 즉시로딩 전체임플란트', desc: '수술 당일 임시 치아를 장착하여 바로 기능 회복이 가능합니다.' },
    ],
    whyUs: [
      { title: '자체 기공실 보유', desc: '원내 기공실에서 당일 보철 수정이 가능합니다. 외부 기공소 대비 빠르고 정밀합니다.', icon: 'fa-gear' },
      { title: '네비게이션 가이드 수술', desc: 'CT 데이터 기반 디지털 가이드로 정확한 위치에 식립합니다.', icon: 'fa-crosshairs' },
      { title: '수면진료 가능', desc: '치과 공포증이 있어도 수면 상태에서 편안하게 수술받으실 수 있습니다.', icon: 'fa-bed' },
      { title: 'MUA 즉시로딩', desc: '수술 당일 임시 보철물을 장착하여 바로 식사가 가능합니다.', icon: 'fa-bolt' },
      { title: '모니터링 장비 완비', desc: '수면 진료 시 생체징후를 실시간 모니터링합니다.', icon: 'fa-heart-pulse' },
    ],
    process: [
      { step: '1단계: 정밀 진단', desc: 'CT 촬영, 구강 스캔, 전신 건강 상태 확인' },
      { step: '2단계: 디지털 모의수술', desc: '3D 시뮬레이션으로 최적의 식립 위치 결정' },
      { step: '3단계: 수술용 가이드 제작', desc: '자체 기공실에서 맞춤형 수술 가이드 제작' },
      { step: '4단계: 임플란트 식립', desc: '가이드를 이용한 정밀 식립 (수면진료 가능)' },
      { step: '5단계: 즉시로딩', desc: 'MUA 시스템으로 당일 임시 보철물 장착' },
      { step: '6단계: 최종 보철', desc: '자체 기공실에서 최종 보철물 제작 및 장착' },
    ],
    doctorSlug: 'park-junkyu',
    faq: [
      { q: '전체임플란트 비용은 얼마인가요?', a: '서울365치과의 전체임플란트 비용은 약 800만원~1,500만원 범위이며, 환자분의 구강 상태와 식립 수에 따라 달라집니다. 정확한 비용은 CT 촬영 후 상담을 통해 안내드립니다. 65세 이상 어르신은 건강보험 적용이 가능합니다.' },
      { q: '치료 기간은 얼마나 걸리나요?', a: '일반적으로 3~6개월 소요됩니다. 즉시로딩의 경우 수술 당일 임시 치아를 장착하므로 바로 식사가 가능합니다. 최종 보철까지는 뼈와 임플란트가 충분히 결합된 후 진행합니다.' },
      { q: '고령이나 전신질환이 있어도 가능한가요?', a: '대부분의 경우 가능합니다. 고혈압, 당뇨 등 전신질환이 있으셔도 사전 검사와 내과 협진을 통해 안전하게 수술을 진행합니다. 80대 어르신도 많이 시술받으십니다.' },
      { q: '아스피린을 복용 중인데 수술 가능한가요?', a: '혈액응고 억제제를 복용 중이시라면 담당 내과 의사와 상의 후 조절이 필요할 수 있습니다. 사전 상담 시 복용 약물을 알려주시면 안전한 수술 계획을 세워드립니다.' },
      { q: '올온X와 컨벤셔널의 차이는 무엇인가요?', a: '컨벤셔널은 개별 임플란트를 식립하여 가장 자연치아에 가까운 결과를 제공하고, 올온X는 최소 4~6개 임플란트로 전악을 회복합니다. 뼈 상태, 비용, 치료 기간 등을 종합적으로 고려하여 최적의 방법을 추천드립니다.' },
    ],
  },
  {
    slug: 'all-on-x',
    name: '올온X 임플란트',
    category: '전문센터',
    h1: '올온X 임플란트 – 최소 식립으로 전악 회복',
    metaTitle: '올온X 임플란트 | 서울365치과 - 최소 식립 전악 회복',
    metaDesc: '최소 4~6개 식립으로 전악 회복. 올온X 스타일 전체임플란트 전문.',
    heroTitle: '최소 4개 식립으로, 전체 치아를 되찾습니다',
    heroSub: '뼈이식 없이도 가능한 올온X, 서울대 전문의가 직접 시술합니다.',
    icon: 'fa-teeth-open',
    shortDesc: '최소 식립으로 전악 회복',
    concerns: [
      '많은 수의 임플란트 식립이 부담스러우신 분',
      '뼈가 부족하다고 진단받으신 분',
      '빠른 회복을 원하시는 분',
      '비용 부담을 줄이고 싶으신 분',
    ],
    types: [
      { name: '올온4 (All-on-4)', desc: '4개의 임플란트로 전악을 지지합니다. 하악에 주로 적용됩니다.' },
      { name: '올온6 (All-on-6)', desc: '6개의 임플란트로 더 안정적인 지지력을 확보합니다.' },
    ],
    whyUs: [
      { title: '서울대 전문의 직접 시술', desc: '풍부한 경험의 전문의가 수술부터 보철까지 책임집니다.', icon: 'fa-user-doctor' },
      { title: '자체 기공실', desc: '정밀한 보철물을 빠르게 제작합니다.', icon: 'fa-gear' },
      { title: '수면진료', desc: '긴 수술도 편안하게 받으실 수 있습니다.', icon: 'fa-bed' },
      { title: '즉시로딩', desc: '수술 당일 임시 치아 장착이 가능합니다.', icon: 'fa-bolt' },
    ],
    process: [
      { step: '1단계: 정밀 진단', desc: 'CT, 구강스캔, 전신상태 확인' },
      { step: '2단계: 디지털 설계', desc: '3D 모의수술로 최적 식립 각도 결정' },
      { step: '3단계: 가이드 제작', desc: '자체 기공실에서 수술 가이드 제작' },
      { step: '4단계: 식립 수술', desc: '경사 식립으로 뼈이식 최소화' },
      { step: '5단계: 즉시 보철', desc: '당일 임시 보철물 장착' },
      { step: '6단계: 최종 보철', desc: '3~6개월 후 최종 보철물 제작' },
    ],
    doctorSlug: 'park-junkyu',
    faq: [
      { q: '올온4와 올온6의 차이는?', a: '올온4는 4개, 올온6은 6개의 임플란트로 전악을 지지합니다. 뼈 상태에 따라 적합한 방법이 달라지며, 정밀 진단 후 추천드립니다.' },
      { q: '뼈이식 없이 가능한가요?', a: '올온X의 장점은 경사 식립을 통해 기존 뼈를 최대한 활용하는 것입니다. 많은 경우 뼈이식 없이 가능합니다.' },
      { q: '비용은 얼마나 드나요?', a: '환자분의 구강 상태에 따라 달라지며, 정밀 진단 후 정확한 비용을 안내드립니다. 상담 시 분할 결제 옵션도 안내해드립니다.' },
    ],
  },
  {
    slug: 'implant',
    name: '임플란트',
    category: '전문센터',
    h1: '인천 임플란트 – 네비게이션 가이드 수술',
    metaTitle: '인천 임플란트 | 서울365치과 - 네비게이션 가이드 수술',
    metaDesc: '인천 임플란트. 서울대 전문의, 네비게이션 가이드 수술, 수면진료 가능. 65세 건보 적용.',
    heroTitle: '다른 곳에서 안 된다고요? 저희가 해드립니다',
    heroSub: '네비게이션 가이드 수술로 정확하고 안전한 임플란트를 제공합니다.',
    icon: 'fa-tooth',
    shortDesc: '네비게이션 가이드 수술',
    concerns: [
      '임플란트 수술이 무서우신 분',
      '다른 병원에서 안 된다고 하신 분',
      '빠른 회복을 원하시는 분',
      '65세 이상으로 건보 적용을 원하시는 분',
    ],
    types: [
      { name: '일반 임플란트', desc: '가장 보편적인 방법으로, 검증된 안전성과 뛰어난 결과를 제공합니다.' },
      { name: '네비게이션 임플란트', desc: 'CT 데이터 기반 가이드로 최소 절개, 정밀 식립합니다.' },
      { name: '즉시 식립', desc: '발치와 동시에 임플란트를 식립하여 치료 기간을 단축합니다.' },
    ],
    whyUs: [
      { title: '네비게이션 가이드', desc: '디지털 가이드로 0.1mm 단위 정밀 식립', icon: 'fa-crosshairs' },
      { title: '서울대 전문의', desc: '풍부한 임상 경험의 전문의 직접 시술', icon: 'fa-user-doctor' },
      { title: '수면진료', desc: '무서움 없이 편안하게', icon: 'fa-bed' },
      { title: '자체 기공실', desc: '정밀 맞춤 보철물 제작', icon: 'fa-gear' },
    ],
    process: [
      { step: '1단계: 상담 및 진단', desc: 'CT 촬영, 구강 검사, 치료 계획 수립' },
      { step: '2단계: 가이드 제작', desc: '디지털 모의수술 후 수술 가이드 제작' },
      { step: '3단계: 식립 수술', desc: '가이드 이용 정밀 식립 (30분~1시간)' },
      { step: '4단계: 치유 기간', desc: '2~4개월 뼈 결합 기간' },
      { step: '5단계: 보철 제작', desc: '자체 기공실에서 맞춤 보철물 제작' },
      { step: '6단계: 최종 장착', desc: '보철물 장착 및 교합 조정' },
    ],
    doctorSlug: 'park-junkyu',
    faq: [
      { q: '임플란트 수명은 얼마나 되나요?', a: '적절한 관리 시 10년 이상 사용 가능하며, 많은 경우 20~30년 이상 유지됩니다. 정기 검진과 구강 위생 관리가 중요합니다.' },
      { q: '임플란트 비용은 얼마인가요?', a: '1개당 80~150만원 범위이며, 65세 이상은 건강보험 적용이 가능합니다. 정확한 비용은 진단 후 안내드립니다.' },
      { q: '수술 후 통증이 심한가요?', a: '대부분의 환자분들이 예상보다 통증이 적었다고 말씀하십니다. 처방된 진통제로 충분히 관리되며, 수면진료 시에는 수술 과정의 통증을 느끼지 않습니다.' },
    ],
  },
  {
    slug: 'orthodontics',
    name: '치아교정',
    category: '전문센터',
    h1: '인천 치아교정 – 교정과 전문의 직접 진료',
    metaTitle: '치아교정 | 서울365치과 - 교정과 전문의 직접 진료',
    metaDesc: '인천 치아교정. 교정과 전문의 하누리 원장 직접 진료. 인비절라인·클리피씨·성인·소아교정.',
    heroTitle: '나이에 상관없이, 교정과 전문의가 직접 치료합니다',
    heroSub: '교정과 전문의가 처음부터 끝까지 직접 진료하는 체계적인 교정 치료.',
    icon: 'fa-teeth',
    shortDesc: '교정과 전문의 직접 진료',
    concerns: [
      '나이 들어서 교정이 늦은 건 아닌지 걱정되시는 분',
      '보이지 않는 교정을 원하시는 분',
      '교정과 전문의에게 치료받고 싶으신 분',
      '자녀의 교정 시기가 궁금하신 분',
    ],
    types: [
      { name: '인비절라인 (투명교정)', desc: '투명한 교정 장치로 심미적이며, 탈착이 가능합니다.' },
      { name: '클리피씨 (세라믹)', desc: '치아색과 유사한 세라믹 브래킷으로 자연스럽습니다.' },
      { name: '메탈 교정', desc: '가장 효율적이고 경제적인 교정 방법입니다.' },
      { name: '소아·청소년 교정', desc: '성장기에 맞춘 최적의 교정 시기와 방법을 제안합니다.' },
    ],
    whyUs: [
      { title: '교정과 전문의', desc: '하누리 원장이 처음부터 끝까지 직접 진료', icon: 'fa-user-doctor' },
      { title: '인비절라인 인증의', desc: '공인 인비절라인 인증의 자격 보유', icon: 'fa-certificate' },
      { title: '디지털 교정', desc: '3D 스캔 기반 정밀한 치료 계획 수립', icon: 'fa-desktop' },
      { title: '365일 진료', desc: '교정 중 응급 상황에도 언제든 내원 가능', icon: 'fa-calendar-check' },
    ],
    process: [
      { step: '1단계: 정밀 검사', desc: 'X-ray, CT, 구강스캔, 안모분석' },
      { step: '2단계: 치료 계획', desc: '3D 시뮬레이션으로 예상 결과 확인' },
      { step: '3단계: 장치 장착', desc: '선택한 교정 장치 부착' },
      { step: '4단계: 정기 조정', desc: '월 1회 내원하여 교정력 조정' },
      { step: '5단계: 장치 제거', desc: '교정 완료 후 장치 제거' },
      { step: '6단계: 유지', desc: '유지장치 착용으로 결과 유지' },
    ],
    doctorSlug: 'ha-nuri',
    faq: [
      { q: '교정 비용은 얼마인가요?', a: '교정 종류와 난이도에 따라 300~600만원 범위입니다. 정밀 검사 후 정확한 비용을 안내드리며, 분할 결제가 가능합니다.' },
      { q: '교정 기간은 얼마나 걸리나요?', a: '일반적으로 1년~2년 6개월 정도 소요됩니다. 부분 교정은 6개월~1년 내외로 가능합니다.' },
      { q: '성인도 교정이 가능한가요?', a: '물론입니다. 성인 교정은 나이에 관계없이 가능하며, 최근 성인 환자분의 비율이 매우 높습니다.' },
    ],
  },
  {
    slug: 'invisalign',
    name: '인비절라인',
    category: '전문센터',
    h1: '인비절라인 교정 – 투명교정 인증의',
    metaTitle: '인비절라인 | 서울365치과 - 투명교정 인증의',
    metaDesc: '인비절라인 교정. 교정과 전문의 + 인비절라인 인증의 직접 진료. 투명한 교정 장치로 심미적.',
    heroTitle: '보이지 않는 교정, 전문의가 직접 합니다',
    heroSub: '인비절라인 공식 인증의가 처음부터 끝까지 책임지는 투명교정.',
    icon: 'fa-face-smile',
    shortDesc: '투명교정 인증의 직접 진료',
    concerns: ['교정 장치가 보이는 게 싫으신 분', '직장생활 중 교정받고 싶으신 분', '식사 시 불편함을 최소화하고 싶으신 분'],
    types: [
      { name: '인비절라인 풀', desc: '복잡한 교정도 가능한 풀패키지 교정' },
      { name: '인비절라인 라이트', desc: '가벼운 교정에 적합한 경제적 옵션' },
      { name: '인비절라인 퍼스트', desc: '성장기 아이를 위한 투명교정' },
    ],
    whyUs: [
      { title: '인비절라인 인증의', desc: '공식 인증의 자격으로 풍부한 치료 경험', icon: 'fa-certificate' },
      { title: '교정과 전문의', desc: '전문의가 직접 치료 계획 수립 및 진료', icon: 'fa-user-doctor' },
      { title: '디지털 시뮬레이션', desc: '치료 전 최종 결과를 미리 확인', icon: 'fa-desktop' },
    ],
    process: [
      { step: '1단계: 상담 및 스캔', desc: '구강 스캔으로 디지털 치아 모형 제작' },
      { step: '2단계: 치료 계획', desc: 'ClinCheck으로 단계별 이동 시뮬레이션' },
      { step: '3단계: 얼라이너 제작', desc: '맞춤형 투명 교정 장치 제작' },
      { step: '4단계: 착용 시작', desc: '2주마다 새 얼라이너로 교체' },
      { step: '5단계: 정기 확인', desc: '4~6주마다 내원하여 진행 상황 확인' },
      { step: '6단계: 유지', desc: '교정 완료 후 유지장치 착용' },
    ],
    doctorSlug: 'ha-nuri',
    faq: [
      { q: '인비절라인 비용은?', a: '교정 범위에 따라 300~600만원입니다. 분할 결제가 가능합니다.' },
      { q: '하루에 몇 시간 착용해야 하나요?', a: '하루 20~22시간 착용을 권장합니다. 식사와 칫솔질 시에만 빼주세요.' },
    ],
  },
  {
    slug: 'pediatric',
    name: '소아치과',
    category: '전문센터',
    h1: '인천 소아치과 – 아이 눈높이 맞춤 진료',
    metaTitle: '소아치과 | 서울365치과 - 아이 눈높이 맞춤 진료',
    metaDesc: '인천 소아치과. 아이 눈높이에 맞춘 친절한 진료. 불소도포, 실란트, 소아교정.',
    heroTitle: '아이가 치과를 무서워하지 않게, 눈높이에서 진료합니다',
    heroSub: '첫 치과 경험이 좋아야 평생 구강 건강이 좋습니다.',
    icon: 'fa-child',
    shortDesc: '아이 눈높이 맞춤 진료',
    concerns: ['아이가 치과를 무서워하는 경우', '충치가 자주 생기는 아이', '교정 시기가 궁금하신 부모님'],
    types: [
      { name: '소아 충치치료', desc: '아이 눈높이에서 편안한 치료' },
      { name: '실란트', desc: '충치 예방을 위한 치아 홈 메우기' },
      { name: '불소도포', desc: '치아 강화를 위한 예방 처치' },
      { name: '소아교정', desc: '성장기에 맞춘 적절한 교정 시작' },
    ],
    whyUs: [
      { title: '아이 친화적 환경', desc: '편안하고 즐거운 진료 환경', icon: 'fa-child' },
      { title: '365일 진료', desc: '아이 응급 상황에도 언제든 내원', icon: 'fa-calendar-check' },
      { title: '교정 전문의 협진', desc: '교정 시기 상담 가능', icon: 'fa-user-doctor' },
    ],
    process: [
      { step: '1단계: 친숙해지기', desc: '치과 환경에 적응하는 시간' },
      { step: '2단계: 검사', desc: '구강 검사 및 X-ray' },
      { step: '3단계: 치료', desc: '충치치료, 예방치료 등' },
      { step: '4단계: 교육', desc: '올바른 칫솔질 교육' },
    ],
    doctorSlug: 'choi-dabin',
    faq: [
      { q: '아이 첫 치과 방문은 언제?', a: '첫 치아가 나오는 생후 6개월~1년 사이에 첫 검진을 권장합니다.' },
      { q: '실란트는 꼭 해야 하나요?', a: '영구치 어금니가 나온 후 실란트를 하면 충치 예방에 매우 효과적입니다. 건강보험 적용이 됩니다.' },
    ],
  },
  {
    slug: 'cosmetic',
    name: '심미치료',
    category: '전문센터',
    h1: '심미치료 – 라미네이트/세렉 원데이',
    metaTitle: '심미치료 | 서울365치과 - 라미네이트/세렉 원데이',
    metaDesc: '서울365치과 심미치료. 라미네이트, 세렉 원데이, 심미보철. 자체 기공실에서 자연스러운 결과.',
    heroTitle: '자연스러운 아름다움, 자체 기공실에서 완성합니다',
    heroSub: '미소 디자인부터 최종 보철까지, 원내에서 한 번에.',
    icon: 'fa-star',
    shortDesc: '라미네이트/세렉 원데이',
    concerns: ['치아 색이 누런 경우', '치아 모양이 고르지 않은 경우', '깨지거나 변색된 보철물 교체'],
    types: [
      { name: '라미네이트', desc: '치아 표면에 얇은 세라믹을 부착하여 형태와 색을 개선' },
      { name: '세렉 원데이', desc: '당일 제작·장착이 가능한 디지털 보철 시스템' },
      { name: '올세라믹 크라운', desc: '금속 없는 세라믹으로 자연치아에 가까운 결과' },
    ],
    whyUs: [
      { title: '자체 기공실', desc: '원내에서 정밀하게 색상 매칭', icon: 'fa-gear' },
      { title: '세렉 시스템', desc: '당일 보철 제작·장착 가능', icon: 'fa-bolt' },
      { title: '심미 전문', desc: '미소 디자인 전문 경험', icon: 'fa-star' },
    ],
    process: [
      { step: '1단계: 미소 분석', desc: '얼굴과 치아의 조화 분석' },
      { step: '2단계: 디자인', desc: '디지털 미소 디자인 시뮬레이션' },
      { step: '3단계: 치아 준비', desc: '최소 삭제 원칙으로 치아 준비' },
      { step: '4단계: 제작·장착', desc: '자체 기공실에서 맞춤 제작 후 장착' },
    ],
    doctorSlug: 'park-junkyu',
    faq: [
      { q: '라미네이트 수명은?', a: '적절한 관리 시 10~15년 이상 유지됩니다.' },
      { q: '통증이 있나요?', a: '최소 삭제로 진행하여 통증이 거의 없습니다.' },
    ],
  },
  {
    slug: 'sedation',
    name: '수면진료',
    category: '전문센터',
    h1: '수면진료 – 치과 공포증도 편안하게',
    metaTitle: '수면진료 | 서울365치과 - 치과 공포증도 편안하게',
    metaDesc: '치과가 무서우신가요? 수면진료로 편안하게. 모니터링 장비 완비, 안전한 수면 치료.',
    heroTitle: '치과 공포증이 있어도, 편안하게 받으실 수 있습니다',
    heroSub: '수면 상태에서 치료를 진행하므로 공포와 통증 없이 치료 가능합니다.',
    icon: 'fa-bed',
    shortDesc: '치과 공포증도 편안하게',
    concerns: ['치과만 생각하면 긴장되시는 분', '구역반사가 심하신 분', '한 번에 많은 치료를 받고 싶으신 분', '주사 공포증이 있으신 분'],
    types: [
      { name: '의식하 진정(수면)', desc: '약물로 의식은 유지하되 불안과 통증을 제거' },
      { name: '웃음가스(N2O)', desc: '가벼운 진정 효과로 긴장 완화' },
    ],
    whyUs: [
      { title: '모니터링 장비', desc: '생체징후 실시간 모니터링', icon: 'fa-heart-pulse' },
      { title: '전문 교육', desc: '수면진료 전문 교육 이수 의료진', icon: 'fa-user-doctor' },
      { title: '안전 프로토콜', desc: '응급 상황 대비 장비 및 약물 구비', icon: 'fa-shield-halved' },
    ],
    process: [
      { step: '1단계: 사전 상담', desc: '건강 상태 확인, 금식 안내' },
      { step: '2단계: 모니터링', desc: '혈압, 산소포화도 등 측정' },
      { step: '3단계: 진정 시작', desc: '수면 상태 진입' },
      { step: '4단계: 치료', desc: '수면 상태에서 치료 진행' },
      { step: '5단계: 회복', desc: '회복실에서 안전하게 깨어남' },
    ],
    doctorSlug: 'park-junkyu',
    faq: [
      { q: '수면진료는 안전한가요?', a: '네, 매우 안전합니다. 생체징후를 실시간 모니터링하며, 응급 장비를 구비하고 있습니다. 전문 교육을 이수한 의료진이 진행합니다.' },
      { q: '수면진료 비용은?', a: '수면진료 비용은 치료 내용에 따라 추가됩니다. 상담 시 정확한 비용을 안내드립니다.' },
    ],
  },
  // 일반/보존 치료
  { slug: 'cavity', name: '충치치료', category: '일반/보존', h1: '충치치료 – 정확한 진단, 최소 삭제', metaTitle: '충치치료 | 서울365치과', metaDesc: '서울365치과 충치치료. 정확한 진단으로 최소 삭제, 자연치아 보존.', heroTitle: '자연치아를 최대한 살리는 충치 치료', heroSub: '정밀 진단으로 꼭 필요한 부분만 치료합니다.', icon: 'fa-tooth', shortDesc: '정확한 진단, 최소 삭제', concerns: ['충치가 의심되시는 분', '통증이 있는 분'], types: [{ name: '레진 수복', desc: '자연치아색으로 수복' }, { name: '인레이/온레이', desc: '넓은 충치에 적합한 정밀 수복' }], whyUs: [{ title: '최소 삭제', desc: '필요한 만큼만 치료', icon: 'fa-shield-halved' }, { title: '보존과 전문의', desc: '정문희 원장 직접 진료', icon: 'fa-user-doctor' }], process: [{ step: '1단계: 진단', desc: 'X-ray, 구강 검사' }, { step: '2단계: 치료', desc: '충치 제거 및 수복' }, { step: '3단계: 확인', desc: '교합 확인 및 마무리' }], doctorSlug: 'jung-munhee', faq: [{ q: '충치치료 비용은?', a: '레진 수복 기준 10~25만원이며, 범위에 따라 달라집니다.' }] },
  { slug: 'resin', name: '레진치료', category: '일반/보존', h1: '레진치료 – 자연치아색 수복', metaTitle: '레진치료 | 서울365치과', metaDesc: '자연치아색 레진으로 깨끗하게 수복.', heroTitle: '티 나지 않는 자연스러운 수복', heroSub: '최신 레진 재료로 색상까지 완벽 매칭.', icon: 'fa-tooth', shortDesc: '자연치아색 수복', concerns: ['앞니 충치', '치아 사이 틈', '깨진 치아'], types: [{ name: '직접 레진', desc: '당일 완료 가능' }, { name: '간접 레진', desc: '기공실 제작으로 더 정밀' }], whyUs: [{ title: '자체 기공실', desc: '간접 레진도 빠르게 제작', icon: 'fa-gear' }], process: [{ step: '1단계: 색상 매칭', desc: '자연치아와 동일한 색상 선택' }, { step: '2단계: 수복', desc: '레진 충전 및 경화' }], doctorSlug: 'jung-munhee', faq: [{ q: '레진 수명은?', a: '관리에 따라 5~10년 이상 유지됩니다.' }] },
  { slug: 'crown', name: '크라운', category: '일반/보존', h1: '크라운 치료 – 자체 기공실 맞춤 제작', metaTitle: '크라운 | 서울365치과 - 자체 기공실 맞춤 제작', metaDesc: '자체 기공실에서 맞춤 제작하는 정밀 크라운.', heroTitle: '자체 기공실에서 맞춤 제작하는 정밀 크라운', heroSub: '원내 기공실의 장점으로 빠르고 정확한 크라운 치료.', icon: 'fa-crown', shortDesc: '자체 기공실 맞춤 제작', concerns: ['신경치료 후 크라운이 필요한 분', '기존 크라운 교체'], types: [{ name: '올세라믹', desc: '금속 없는 자연스러운 크라운' }, { name: 'PFM 크라운', desc: '금속 프레임 + 세라믹 코팅' }, { name: '지르코니아', desc: '강도와 심미 모두 우수' }], whyUs: [{ title: '자체 기공실', desc: '당일 수정 및 색상 조정 가능', icon: 'fa-gear' }], process: [{ step: '1단계: 치아 삭제', desc: '크라운 형태로 치아 준비' }, { step: '2단계: 인상 채득', desc: '디지털 스캔 또는 인상재' }, { step: '3단계: 제작', desc: '자체 기공실 맞춤 제작' }, { step: '4단계: 장착', desc: '크라운 접착 및 교합 조정' }], doctorSlug: 'jung-munhee', faq: [{ q: '크라운 수명은?', a: '재료에 따라 10~20년 이상 유지됩니다.' }] },
  { slug: 'inlay', name: '인레이/온레이', category: '일반/보존', h1: '인레이/온레이 – 세렉 원데이 가능', metaTitle: '인레이/온레이 | 서울365치과', metaDesc: '세렉 시스템으로 당일 제작 가능한 인레이/온레이.', heroTitle: '당일 완성, 세렉 원데이 인레이', heroSub: '디지털 시스템으로 정밀하게, 당일 완성.', icon: 'fa-tooth', shortDesc: '세렉 원데이 가능', concerns: ['넓은 충치', '기존 아말감 교체'], types: [{ name: '세라믹 인레이', desc: '자연치아색, 세렉 원데이 가능' }, { name: '금 인레이', desc: '뛰어난 적합도와 내구성' }], whyUs: [{ title: '세렉 시스템', desc: '당일 제작·장착', icon: 'fa-bolt' }], process: [{ step: '1단계: 충치 제거', desc: '' }, { step: '2단계: 스캔', desc: '디지털 스캔' }, { step: '3단계: 제작', desc: '세렉으로 당일 제작' }, { step: '4단계: 접착', desc: '정밀 접착' }], doctorSlug: 'jung-munhee', faq: [{ q: '인레이 비용은?', a: '재료에 따라 15~35만원 범위입니다.' }] },
  { slug: 'root-canal', name: '신경치료', category: '일반/보존', h1: '신경치료 – 보존과 전문의 정밀 치료', metaTitle: '신경치료 | 서울365치과 - 보존과 전문의', metaDesc: '보존과 전문의 정문희 원장의 정밀 신경치료.', heroTitle: '자연치아를 살리는 보존과 전문의의 신경치료', heroSub: '정밀한 기구와 전문의의 경험으로 성공률을 높입니다.', icon: 'fa-syringe', shortDesc: '보존과 전문의 정밀 치료', concerns: ['극심한 치통', '차가운 것에 예민한 치아', '잇몸에 고름이 잡히는 경우'], types: [{ name: '일반 신경치료', desc: '감염된 신경 제거 및 충전' }, { name: '미세 신경치료', desc: '현미경 이용 정밀 치료' }], whyUs: [{ title: '보존과 전문의', desc: '정문희 원장 직접 진료', icon: 'fa-user-doctor' }, { title: '정밀 장비', desc: '근관장 측정기, 현미경', icon: 'fa-microscope' }], process: [{ step: '1단계: 진단', desc: '원인 치아 정밀 진단' }, { step: '2단계: 신경 제거', desc: '감염된 신경조직 제거' }, { step: '3단계: 충전', desc: '근관 세척 및 충전' }, { step: '4단계: 크라운', desc: '치아 보호를 위한 크라운' }], doctorSlug: 'jung-munhee', faq: [{ q: '신경치료 횟수는?', a: '보통 2~3회에 걸쳐 진행됩니다.' }] },
  { slug: 'retreatment', name: '재신경치료', category: '일반/보존', h1: '재신경치료 – 실패한 신경치료 재치료', metaTitle: '재신경치료 | 서울365치과', metaDesc: '실패한 신경치료 재치료. 보존과 전문의가 자연치아를 살립니다.', heroTitle: '실패한 신경치료, 다시 살릴 수 있습니다', heroSub: '보존과 전문의가 자연치아를 끝까지 지킵니다.', icon: 'fa-rotate', shortDesc: '실패한 신경치료 재치료', concerns: ['이전 신경치료 후 재발', '치아 뿌리 끝 염증'], types: [{ name: '비외과적 재치료', desc: '기존 충전물 제거 후 재치료' }, { name: '외과적 재치료', desc: '치근단절제술 등' }], whyUs: [{ title: '보존과 전문의', desc: '난이도 높은 재치료 전문', icon: 'fa-user-doctor' }], process: [{ step: '1단계: 정밀 진단', desc: 'CT로 원인 파악' }, { step: '2단계: 기존 충전물 제거', desc: '' }, { step: '3단계: 재치료', desc: '재감염 부위 처치' }, { step: '4단계: 재충전', desc: '근관 재충전' }], doctorSlug: 'jung-munhee', faq: [{ q: '재신경치료 성공률은?', a: '전문의 치료 시 80~90% 이상의 성공률을 보입니다.' }] },
  { slug: 'apicoectomy', name: '치근단절제술', category: '일반/보존', h1: '치근단절제술 – 신경치료 후 마지막 방법', metaTitle: '치근단절제술 | 서울365치과', metaDesc: '신경치료 후에도 해결되지 않는 염증. 치근단절제술로 자연치아를 살립니다.', heroTitle: '마지막까지 자연치아를 포기하지 않습니다', heroSub: '보존과 전문의의 미세 수술로 치아를 보존합니다.', icon: 'fa-cut', shortDesc: '신경치료 후 마지막 방법', concerns: ['재신경치료로도 해결이 안 되는 경우'], types: [{ name: '치근단절제술', desc: '감염된 치아 뿌리 끝을 외과적으로 제거' }], whyUs: [{ title: '보존과 전문의', desc: '미세 외과 수술 전문', icon: 'fa-user-doctor' }], process: [{ step: '1단계: CT 진단', desc: '병변 범위 파악' }, { step: '2단계: 수술', desc: '치근단 절제 및 역충전' }, { step: '3단계: 경과 관찰', desc: '정기 검진으로 치유 확인' }], doctorSlug: 'jung-munhee', faq: [{ q: '수술 후 통증은?', a: '수술 후 2~3일 정도 부종이 있을 수 있으나, 처방 약물로 관리됩니다.' }] },
  { slug: 'whitening', name: '미백', category: '일반/보존', h1: '치아미백 – 전문의 관리하 안전한 미백', metaTitle: '치아미백 | 서울365치과', metaDesc: '전문의 관리 하에 안전한 치아미백. 밝고 환한 미소.', heroTitle: '전문의 관리하에 안전하고 확실한 미백', heroSub: '검증된 미백 시스템으로 자연스럽게 밝은 치아.', icon: 'fa-sun', shortDesc: '전문의 관리하 안전한 미백', concerns: ['치아 변색', '누런 치아'], types: [{ name: '전문가 미백', desc: '병원에서 진행하는 고농도 미백' }, { name: '홈 미백', desc: '맞춤 트레이로 집에서 진행' }], whyUs: [{ title: '전문의 관리', desc: '안전하고 효과적인 미백', icon: 'fa-user-doctor' }], process: [{ step: '1단계: 상담', desc: '현재 치아색 확인' }, { step: '2단계: 미백', desc: '미백제 도포 및 광조사' }, { step: '3단계: 유지', desc: '홈 미백으로 유지' }], doctorSlug: 'choi-dabin', faq: [{ q: '미백 효과는 얼마나 가나요?', a: '관리에 따라 6개월~2년 유지됩니다.' }] },
  // 잇몸/외과
  { slug: 'scaling', name: '스케일링', category: '잇몸/외과', h1: '스케일링 – 잇몸 건강의 첫걸음', metaTitle: '스케일링 | 서울365치과', metaDesc: '연 1회 건강보험 스케일링. 잇몸 건강의 첫걸음.', heroTitle: '건강한 잇몸은 스케일링에서 시작됩니다', heroSub: '연 1회 건강보험 적용, 정기적인 관리가 중요합니다.', icon: 'fa-broom', shortDesc: '잇몸 건강의 첫걸음', concerns: ['잇몸 출혈', '입냄새'], types: [{ name: '건보 스케일링', desc: '연 1회 건강보험 적용' }, { name: '심화 스케일링', desc: '잇몸 깊숙한 치석까지 제거' }], whyUs: [{ title: '365일 진료', desc: '편한 시간에 내원', icon: 'fa-calendar-check' }], process: [{ step: '1단계: 검사', desc: '치석 상태 확인' }, { step: '2단계: 스케일링', desc: '초음파 스케일러로 치석 제거' }, { step: '3단계: 마무리', desc: '연마 및 불소도포' }], doctorSlug: 'choi-dabin', faq: [{ q: '스케일링 비용은?', a: '연 1회 건강보험 적용 시 본인부담금만 납부합니다.' }] },
  { slug: 'gum-treatment', name: '잇몸치료', category: '잇몸/외과', h1: '잇몸치료 – 치주과 전문 관리', metaTitle: '잇몸치료 | 서울365치과', metaDesc: '치주질환 전문 관리. 잇몸 출혈, 치아 흔들림 치료.', heroTitle: '흔들리는 치아, 잇몸부터 치료해야 합니다', heroSub: '치주질환은 조기 발견과 꾸준한 관리가 핵심입니다.', icon: 'fa-droplet', shortDesc: '치주과 전문 관리', concerns: ['잇몸 출혈', '치아 흔들림', '잇몸 퇴축'], types: [{ name: '비외과적 치주치료', desc: '스케일링 + 치근활택술' }, { name: '치주수술', desc: '심한 경우 외과적 치료' }], whyUs: [{ title: '체계적 관리', desc: '정기 관리 프로그램', icon: 'fa-clipboard-check' }], process: [{ step: '1단계: 검사', desc: '치주낭 깊이 측정' }, { step: '2단계: 기본 치료', desc: '스케일링 + 치근활택' }, { step: '3단계: 재평가', desc: '치료 효과 확인' }, { step: '4단계: 유지', desc: '정기 관리' }], doctorSlug: 'sang-sehoon', faq: [{ q: '잇몸치료 기간은?', a: '경증은 1~2회, 중증은 수개월 치료가 필요합니다.' }] },
  { slug: 'wisdom-tooth', name: '사랑니발치', category: '잇몸/외과', h1: '사랑니 발치 – 매복 사랑니도 안전하게', metaTitle: '사랑니 발치 | 서울365치과', metaDesc: '매복 사랑니도 안전하게. 수면진료 가능, 365일 진료.', heroTitle: '매복 사랑니도 안전하고 편안하게', heroSub: '수면진료 옵션으로 공포 없는 발치.', icon: 'fa-tooth', shortDesc: '매복 사랑니도 안전하게', concerns: ['사랑니 통증', '매복 사랑니 진단', '사랑니 주변 염증'], types: [{ name: '단순 발치', desc: '정상 맹출 사랑니' }, { name: '매복 발치', desc: '잇몸 속에 묻힌 사랑니' }], whyUs: [{ title: '수면진료', desc: '무서움 없이 편안하게', icon: 'fa-bed' }, { title: '365일 진료', desc: '통증 시 즉시 내원', icon: 'fa-calendar-check' }], process: [{ step: '1단계: 진단', desc: 'CT로 사랑니 위치 확인' }, { step: '2단계: 마취', desc: '무통 마취 또는 수면진료' }, { step: '3단계: 발치', desc: '최소 침습 발치' }, { step: '4단계: 케어', desc: '발치 후 주의사항 안내' }], doctorSlug: 'sang-sehoon', faq: [{ q: '사랑니 꼭 빼야 하나요?', a: '충치, 염증, 주변 치아 손상 위험이 있으면 발치를 권합니다. 정상 맹출된 경우 유지할 수도 있습니다.' }] },
  { slug: 'tmj', name: '턱관절', category: '잇몸/외과', h1: '턱관절 치료 – 정밀 진단 후 맞춤 치료', metaTitle: '턱관절 치료 | 서울365치과', metaDesc: '턱관절 통증, 소리, 개구장애 정밀 진단 후 맞춤 치료.', heroTitle: '턱에서 소리가 나고, 아프셨나요?', heroSub: '정밀 진단 후 원인에 맞는 맞춤 치료.', icon: 'fa-head-side-medical', shortDesc: '정밀 진단 후 맞춤 치료', concerns: ['턱에서 소리가 남', '입 벌리기 어려움', '턱 통증'], types: [{ name: '보존적 치료', desc: '약물, 물리치료, 스플린트' }, { name: '교합 치료', desc: '교합 조정으로 원인 해결' }], whyUs: [{ title: '정밀 진단', desc: 'CT + 교합 분석', icon: 'fa-crosshairs' }], process: [{ step: '1단계: 정밀 검사', desc: 'CT, 교합 분석' }, { step: '2단계: 진단', desc: '원인 파악' }, { step: '3단계: 치료', desc: '스플린트 + 약물 + 물리치료' }], doctorSlug: 'park-junkyu', faq: [{ q: '턱관절 치료 기간은?', a: '경증은 1~3개월, 중증은 6개월 이상 소요될 수 있습니다.' }] },
  { slug: 'bruxism', name: '이갈이', category: '잇몸/외과', h1: '이갈이 치료 – 야간 장치 맞춤 제작', metaTitle: '이갈이 치료 | 서울365치과', metaDesc: '이갈이·이 악물기 치료. 야간 장치 맞춤 제작.', heroTitle: '이갈이, 방치하면 치아가 닳아갑니다', heroSub: '맞춤형 야간 장치로 치아를 보호합니다.', icon: 'fa-moon', shortDesc: '야간 장치 맞춤 제작', concerns: ['수면 중 이갈이', '이 악물기', '치아 마모'], types: [{ name: '교합 안정 장치', desc: '야간 착용 맞춤 장치' }], whyUs: [{ title: '자체 기공실', desc: '정밀한 맞춤 장치 제작', icon: 'fa-gear' }], process: [{ step: '1단계: 진단', desc: '교합 분석, 마모 상태 확인' }, { step: '2단계: 인상', desc: '디지털 스캔' }, { step: '3단계: 제작', desc: '맞춤 장치 제작' }, { step: '4단계: 착용', desc: '장착 후 교합 조정' }], doctorSlug: 'park-junkyu', faq: [{ q: '야간 장치 비용은?', a: '맞춤 제작 장치 기준 20~40만원 범위입니다.' }] },
  // 특수
  { slug: 'implant-revision', name: '임플란트 재수술', category: '특수', h1: '임플란트 재수술 – 실패 케이스 복원', metaTitle: '임플란트 재수술 | 서울365치과', metaDesc: '실패한 임플란트 재수술. 서울대 전문의가 원인 분석 후 재시술.', heroTitle: '임플란트가 실패했다면, 다시 시작할 수 있습니다', heroSub: '원인을 정확히 분석하고, 최적의 재시술 방법을 찾습니다.', icon: 'fa-rotate', shortDesc: '실패 케이스 복원', concerns: ['임플란트 탈락', '임플란트 주위염', '보철물 파손'], types: [{ name: '재식립', desc: '기존 임플란트 제거 후 재식립' }, { name: '뼈이식 후 재식립', desc: '뼈 재생 후 재시술' }], whyUs: [{ title: '풍부한 경험', desc: '난이도 높은 재수술 전문', icon: 'fa-user-doctor' }], process: [{ step: '1단계: 원인 분석', desc: '실패 원인 정밀 진단' }, { step: '2단계: 치료 계획', desc: '최적의 재시술 방법 수립' }, { step: '3단계: 재수술', desc: '원인 해결 후 재식립' }], doctorSlug: 'park-junkyu', faq: [{ q: '재수술 성공률은?', a: '원인 분석이 정확하면 성공률이 높습니다. 상담 시 자세히 안내드립니다.' }] },
  { slug: 'bridge', name: '보철(브릿지)', category: '특수', h1: '브릿지 치료 – 자연스러운 보철 복원', metaTitle: '브릿지 | 서울365치과', metaDesc: '빠진 치아를 자연스럽게 복원하는 브릿지 치료.', heroTitle: '빠진 치아, 브릿지로 자연스럽게 복원', heroSub: '자체 기공실에서 정밀하게 제작하는 맞춤 브릿지.', icon: 'fa-bridge', shortDesc: '자연스러운 보철 복원', concerns: ['치아 상실', '임플란트가 어려운 경우'], types: [{ name: '세라믹 브릿지', desc: '자연스러운 색감' }, { name: '지르코니아 브릿지', desc: '뛰어난 강도' }], whyUs: [{ title: '자체 기공실', desc: '정밀한 맞춤 제작', icon: 'fa-gear' }], process: [{ step: '1단계: 진단', desc: '주변 치아 상태 확인' }, { step: '2단계: 치아 삭제', desc: '지대치 준비' }, { step: '3단계: 제작', desc: '기공실에서 맞춤 제작' }, { step: '4단계: 장착', desc: '브릿지 접착' }], doctorSlug: 'sang-sehoon', faq: [{ q: '브릿지 수명은?', a: '적절한 관리 시 10~15년 이상 유지됩니다.' }] },
  { slug: 'denture', name: '틀니', category: '특수', h1: '틀니 – 맞춤형 의치 제작', metaTitle: '틀니 | 서울365치과', metaDesc: '맞춤형 틀니 제작. 자체 기공실에서 정밀 제작.', heroTitle: '편안하게 씹을 수 있는 맞춤 틀니', heroSub: '자체 기공실에서 꼭 맞는 틀니를 제작합니다.', icon: 'fa-teeth-open', shortDesc: '맞춤형 의치 제작', concerns: ['기존 틀니 불편', '치아 다수 상실'], types: [{ name: '부분 틀니', desc: '남은 치아에 고정' }, { name: '완전 틀니', desc: '전체 치아 대체' }, { name: '임플란트 틀니', desc: '임플란트로 고정하는 틀니' }], whyUs: [{ title: '자체 기공실', desc: '빠르고 정밀한 제작', icon: 'fa-gear' }], process: [{ step: '1단계: 진단', desc: '구강 상태 확인' }, { step: '2단계: 인상', desc: '정밀 인상 채득' }, { step: '3단계: 제작', desc: '맞춤 틀니 제작' }, { step: '4단계: 장착', desc: '장착 및 조정' }], doctorSlug: 'sang-sehoon', faq: [{ q: '틀니 적응 기간은?', a: '보통 2~4주 정도 적응 기간이 필요합니다.' }] },
  { slug: 'emergency', name: '응급치료', category: '특수', h1: '치과 응급진료 – 365일 야간 진료', metaTitle: '응급치료 | 서울365치과 - 365일 야간 진료', metaDesc: '365일, 야간까지 응급 치과 진료. 갑작스러운 치통, 외상에 즉시 대응.', heroTitle: '갑작스러운 치통? 365일, 야간까지 진료합니다', heroSub: '치과 응급 상황에 언제든 내원하실 수 있습니다.', icon: 'fa-truck-medical', shortDesc: '365일 야간 진료', concerns: ['갑작스러운 치통', '치아 외상', '보철물 탈락'], types: [{ name: '응급 통증 치료', desc: '급성 치통 즉시 처치' }, { name: '외상 치료', desc: '치아 파절, 탈구 등' }], whyUs: [{ title: '365일 진료', desc: '일요일·공휴일도 진료', icon: 'fa-calendar-check' }, { title: '야간 진료', desc: '평일 21시까지', icon: 'fa-moon' }], process: [{ step: '1단계: 내원', desc: '전화 후 즉시 내원' }, { step: '2단계: 응급 처치', desc: '통증 제어, 응급 치료' }, { step: '3단계: 후속 치료', desc: '원인 치료 계획 수립' }], doctorSlug: 'park-junkyu', faq: [{ q: '야간에도 진료 가능한가요?', a: '평일 월~목 21시까지, 일요일·공휴일도 18시까지 진료합니다. 내원 전 전화 확인을 권합니다.' }] },
  { slug: 'prevention', name: '예방치료', category: '특수', h1: '예방치료 – 정기검진과 불소도포', metaTitle: '예방치료 | 서울365치과', metaDesc: '정기검진, 불소도포, 실란트. 예방이 최고의 치료입니다.', heroTitle: '예방이 최고의 치료입니다', heroSub: '정기적인 검진과 관리로 건강한 치아를 유지하세요.', icon: 'fa-shield-halved', shortDesc: '정기검진과 불소도포', concerns: ['충치 예방', '잇몸 건강 관리'], types: [{ name: '정기검진', desc: '6개월마다 구강 검사' }, { name: '불소도포', desc: '치아 강화 예방 처치' }, { name: '실란트', desc: '어금니 홈 메우기' }], whyUs: [{ title: '365일 진료', desc: '편한 시간에 정기 관리', icon: 'fa-calendar-check' }], process: [{ step: '1단계: 검사', desc: '구강 전체 검사' }, { step: '2단계: 예방', desc: '스케일링, 불소, 실란트' }, { step: '3단계: 교육', desc: '구강위생 교육' }], doctorSlug: 'choi-dabin', faq: [{ q: '검진 주기는?', a: '6개월에 한 번 정기 검진을 권합니다.' }] },
];

export function getTreatmentBySlug(slug: string): Treatment | undefined {
  return treatments.find(t => t.slug === slug);
}

export const treatmentCategories = [
  { name: '전문센터', icon: 'fa-star', treatments: treatments.filter(t => t.category === '전문센터') },
  { name: '일반/보존', icon: 'fa-tooth', treatments: treatments.filter(t => t.category === '일반/보존') },
  { name: '잇몸/외과', icon: 'fa-droplet', treatments: treatments.filter(t => t.category === '잇몸/외과') },
  { name: '특수', icon: 'fa-bolt', treatments: treatments.filter(t => t.category === '특수') },
];
