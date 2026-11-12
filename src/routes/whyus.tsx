// ============================================================
// 🚀 v4 SUPER UPGRADE — Why Choose Us (Weapon 13)
// 2026-10-15: 타 의료기관 비교(✕ 일반치과 열)·순위·평점 표기 삭제 — 의료법 제56조(비교 광고) 남동구보건소 민원 정정
// ============================================================
import { Hono } from 'hono';
import type { Bindings } from '../lib/types';
import { Icon } from '../lib/icons';

const app = new Hono<{ Bindings: Bindings }>();
const SITE_URL = 'https://seoul365dc.kr';

const DIFFERENTIATORS = [
  { feature: '진료 시간', us: '평일 21시 야간진료 + 일/공휴일 14~18시 진료', icon: 'clock' },
  { feature: '의료진', us: '서울대 치과대학 출신 5인 협진 (전문의 3인 포함)', icon: 'user-md' },
  { feature: '시설 규모', us: '400평+ · 6개 독립 수술실 · 자체 기공실', icon: 'hospital' },
  { feature: '진료 시스템', us: '디지털 CT + 네비게이션 가이드 + 아이테로 3D 스캔', icon: 'magic' },
  { feature: '감염 관리', us: '에어샤워 · 진료실별 멸균 시스템 · CDC 기준', icon: 'shield-virus' },
  { feature: '수면진료', us: '마취과 전문의 직접 진정관리', icon: 'bed' },
  { feature: '진료 분야', us: '임플란트·교정·소아·심미·수면진료 전 분야 원스톱', icon: 'th' },
  { feature: '접근성', us: '예술회관역 6번 출구 맞은편 · 지하주차장', icon: 'subway' },
  { feature: '응급 대응', us: '365일 진료로 휴일 응급환자 대응 가능', icon: 'briefcase-medical' },
];

const COMPARISONS_VS_GENERAL = {
  slug: 'why-seoul365',
  title: '서울365치과를 선택하는 이유 — 진료 환경 9가지',
  description: '서울365치과의 진료 시간, 의료진, 시설, 진료 시스템, 접근성 등 진료 환경 9가지를 안내합니다.',
};

app.get('/why-us', (c) => {
  const canonicalUrl = `${SITE_URL}/why-us`;

  // 중복 Dentist(@id 없음·잘못된 주소·별점) 스키마 제거 — 병원 엔티티는 전역 #dentist (2026-09-29)

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '홈', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: '왜 서울365치과인가?', item: canonicalUrl },
    ],
  };

  return c.render(
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* 페이지 히어로 */}
      <section class="phead" aria-labelledby="why-h1">
        <div class="wrap phead-in">
          <div class="phead-text">
            <nav class="crumb" aria-label="현재 위치"><ol><li><a href="/">홈</a></li><li aria-current="page">왜 서울365치과인가?</li></ol></nav>
            <p class="eyebrow">구월동 예술회관역 · 365일 진료</p>
            <h1 id="why-h1" class="display-xl">
              왜 서울365치과인가?
            </h1>
            <p class="lead">
              서울365치과의 <strong class="wu-em">진료 환경 9가지</strong>를 안내합니다
            </p>
          </div>
          <div class="phead-aside">
            <nav class="fact-card" aria-label="진료 환경 바로가기">
              <div class="phead-jump">
                {DIFFERENTIATORS.map((d, i) => (
                  <a href={`#why-${i + 1}`}><small>{String(i + 1).padStart(2, '0')}</small>{d.feature}</a>
                ))}
              </div>
            </nav>
          </div>
        </div>
      </section>

      {/* 진료 환경 9가지 */}
      <section class="sec">
        <div class="wrap">
          <div class="why-grid" data-rv-group>
            {DIFFERENTIATORS.map((d, i) => (
              <div class="why-item wu-item" id={`why-${i + 1}`}>
                <span class="n mono">{String(i + 1).padStart(2, '0')}</span>
                <h3>{d.feature}</h3>
                <p>
                  <span class="wu-us">✓ 서울365</span>
                  <span>{d.us}</span>
                </p>
              </div>
            ))}
          </div>

          <div class="stat-row wu-stats" data-rv-group>
            <div class="card stat">
              <p class="v">5<small>인</small></p>
              <p class="d">서울대 치과대학 출신 원장 협진</p>
            </div>
            <div class="card stat">
              <p class="v">400<small>평+</small></p>
              <p class="d">대형 진료 공간 · 6개 수술실</p>
            </div>
            <div class="card stat">
              <p class="v">365<small>일</small></p>
              <p class="d">평일 야간 · 주말·공휴일 진료</p>
            </div>
          </div>
        </div>
      </section>

      {/* 의료진 협진 */}
      <section class="sec" style="padding-top:0">
        <div class="wrap">
          <div class="sec-head center" data-rv>
            <h2 class="display-2">서울대 치과대학 출신 의료진 협진</h2>
            <p class="lead">
              서울365치과는 임플란트, 보존과, 교정과 등 분야별 원장이 협진하여,
              여러 분야가 함께 필요한 경우에도 한 병원에서 진단과 치료 계획을 함께 세웁니다.
            </p>
          </div>
          <div class="wu-team" data-rv-group>
            <div class="card wu-doc">
              <div class="wu-doc-name">박준규</div>
              <div class="wu-doc-role">대표원장 · 임플란트</div>
            </div>
            <div class="card wu-doc">
              <div class="wu-doc-name">최다빈</div>
              <div class="wu-doc-role">임플란트·심미</div>
            </div>
            <div class="card wu-doc">
              <div class="wu-doc-name">정문희</div>
              <div class="wu-doc-role">보존과 전문의</div>
            </div>
            <div class="card wu-doc">
              <div class="wu-doc-name">하누리</div>
              <div class="wu-doc-role">교정과 전문의</div>
            </div>
            <div class="card wu-doc">
              <div class="wu-doc-name">차해나</div>
              <div class="wu-doc-role">보철·심미</div>
            </div>
          </div>
        </div>
      </section>

      {/* 상담 안내 */}
      <section class="cta-band" aria-label="상담 예약 안내">
        <div class="wrap-n" style="text-align:center;position:relative">
          <h3 class="display-xl" data-rv>상담 예약 안내</h3>
          <p class="lead" data-rv>초진 상담 무료 · 비용 안내 투명</p>
          <div class="cta-actions" data-rv-group>
            <a href="tel:032-432-0365" class="btn btn-white btn-lg mono">
              <Icon name="phone" /> 032-432-0365
            </a>
            <a href="/reservation" class="btn btn-primary btn-lg">
              <Icon name="calendar" /> 온라인 예약
            </a>
          </div>
        </div>
      </section>
    </>,
    {
      title: '서울365치과를 선택하는 이유 — 진료 환경 9가지 | 인천 구월동',
      description: '서울365치과 진료 환경 안내: 365일 진료, 서울대 출신 5인 협진, 400평+ 시설, 6개 수술실, 자체 기공실, 마취과 전문의 협진 수면진료.',
      keywords: '서울365치과, 구월동 치과, 서울대 출신 치과의사, 인천 365일 치과, 자체 기공실',
      canonical: canonicalUrl,
      ogImage: `${SITE_URL}/static/og-image.jpg`,
    }
  );
});

export default app;
