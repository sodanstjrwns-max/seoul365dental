// ============================================================
// llms.txt · llms-full.txt 맨 위 "병원 정보" 사실 블록 (2026-11-10, SEO·AEO 1차 정비)
//  AI 검색이 인용하는 사실(이름·주소·전화·진료 시간·의료진·주요 주소)을 두 문서 맨 위에 같은 순서로 둔다.
//  값은 전부 기존 데이터(src/data/clinic.ts · doctors.ts · treatments.ts)에서 가져온다. 여기서 새 사실을 만들지 않는다.
//  - 가격은 넣지 않았다: /prices 공개 값과 진료 상세·FAQ 답변의 금액이 서로 달라(예: 임플란트·크라운·라미네이트)
//    어느 쪽이 현재 값인지 원장 확인이 필요하다. 확인되면 이 블록에 "주요 비급여 진료비" 줄을 더한다.
//  - 최종 확인일 줄도 넣지 않았다: 병원 기본 정보의 기준일이 레포에 따로 없다.
// ============================================================
import { CLINIC, HOURS } from '../data/clinic'
import { doctors } from '../data/doctors'
import { treatments } from '../data/treatments'

const BASE = CLINIC.url

/** 의료진 한 줄 표기 — 이름(직함·전문의 자격). 전문의 자격은 credentials 의 "… 전문의" 항목이 있을 때만 */
const doctorLabel = (d: (typeof doctors)[number]) => {
  const specialist = d.credentials.find((c) => /전문의$/.test(c))?.replace(/^보건복지부 인증\s*/, '')
  return `${d.name}(${[d.titleShort, specialist].filter(Boolean).join('·')})`
}

export function clinicFactBlock(): string {
  const centers = treatments.filter((t) => t.category === '전문센터').map((t) => t.name)
  const rest = treatments.length - centers.length
  const hours = HOURS.map((h) => `${h.day} ${h.time.replace(/\s/g, '')}${h.note ? `(${h.note})` : ''}`).join(', ')
  const night = HOURS.filter((h) => h.note === '야간진료').map((h) => `${h.day} ${h.time.split('-')[1].trim()}까지`).join(', ')

  return [
    '## 병원 정보',
    `- 이름: ${CLINIC.name} (${CLINIC.nameEn})`,
    `- 진료 분야: ${centers.join(', ')}${rest > 0 ? ` 외 ${rest}개 진료` : ''}`,
    `- 주소: ${CLINIC.address} (우편번호 ${CLINIC.postalCode}) / 가까운 역·출구: ${CLINIC.nearStation}`,
    `- 전화: ${CLINIC.phone}`,
    `- 진료 시간: ${hours} / 점심: 점심시간 없이 진료${night ? ` / 야간: ${night}` : ''} / 휴진: 정기 휴진일 없음(일·공휴일 진료), 임시 휴진은 공지사항(${BASE}/notices) 확인`,
    `- 의료진: ${doctors.map(doctorLabel).join(', ')}`,
    `- 예약: ${BASE}/reservation (네이버 예약 ${CLINIC.naverBooking})`,
    `- 진료 안내: ${BASE}/treatments / 비용 안내: ${BASE}/prices / 의료진: ${BASE}/doctors / 지역 안내(허브): ${BASE}/area/guwol-dong / 자주 묻는 질문: ${BASE}/faq`,
  ].join('\n')
}
