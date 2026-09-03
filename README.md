# 서울365치과의원 웹사이트

## Project Overview
- **Name**: Seoul 365 Dental Website
- **Goal**: Patient Funnel 10단계 기반의 환자 유입·전환 최적화 웹사이트
- **Client**: 서울365치과의원 (인천 남동구 구월동)
- **Tech Stack**: Hono + TypeScript + Tailwind CSS (CDN) + Cloudflare Pages + D1

## URLs
- **Production**: 배포 대기 중
- **Development**: localhost:3000

## 프로젝트 구조 (v2 — 모듈화)

```
src/
├── index.tsx              # 진입점 — 미들웨어 + 라우트 등록 (52줄)
├── renderer.tsx           # JSX 렌더러 + 글로벌 SEO 스키마 (1,164줄)
├── routes/
│   ├── home.tsx           # 메인 홈 13섹션 (895줄)
│   ├── treatments.tsx     # 진료 목록 + 26개 상세 (643줄)
│   ├── doctors.tsx        # 의료진 목록 + 5명 프로필 (420줄)
│   ├── pages.tsx          # 예약·내원안내·FAQ·케이스·회원가입·로그인 (884줄)
│   ├── api.tsx            # Auth REST API (105줄)
│   ├── admin.tsx          # 관리자 대시보드·케이스 CRUD (560줄)
│   ├── blog.tsx           # 블로그 관리·목록·상세 (625줄)
│   └── seo.tsx            # sitemap·robots·개인정보·이용약관·404 (375줄)
├── lib/
│   ├── types.ts           # 공유 타입 (Bindings 등)
│   ├── db.ts              # DB 초기화 헬퍼 (initAdminTables 등)
│   └── auth.ts            # 인증 유틸리티 (해싱·세션·쿠키)
└── data/
    ├── brand.ts           # 브랜드 메시징 시스템
    ├── clinic.ts          # 병원 기본 정보·영업시간
    ├── doctors.ts         # 의료진 데이터
    ├── faq.ts             # FAQ 데이터
    └── treatments.ts      # 26개 진료 상세 데이터
```

**이전 대비 개선점:**
- `src/index.tsx`: 4,576줄 → 52줄 (99% 감소)
- 8개 라우트 모듈로 관심사 분리
- 공유 헬퍼 함수 `src/lib/db.ts`로 추출
- 공유 타입 `src/lib/types.ts`로 통합
- 번들 사이즈 유지: 432KB (기능 동일, 구조만 개선)

## 구현 완료된 기능

### 핵심 페이지
| 경로 | 설명 | 라우트 파일 |
|------|------|-------------|
| `/` | 메인 홈 (13섹션 풀 구현) | home.tsx |
| `/reservation` | 예약/상담 (전화, 카카오, 네이버, 온라인 폼) | pages.tsx |
| `/info` | 내원안내 (비용·오시는길·진료시간) | pages.tsx |
| `/doctors` | 의료진 목록 (5인 원장 소개) | doctors.tsx |
| `/treatments` | 전체 진료 안내 | treatments.tsx |
| `/blog` | 블로그 목록 | blog.tsx |
| `/faq` | 자주 묻는 질문 | pages.tsx |

### 치료 상세 페이지 (26개) — `/treatments/{slug}`
전체임플란트, 올온X, 임플란트, 치아교정, 인비절라인, 소아치과, 심미치료, 수면진료,
충치, 레진, 크라운, 인레이, 신경치료, 재신경치료, 치근단절제술, 미백,
스케일링, 잇몸치료, 사랑니, 턱관절, 이갈이, 임플란트재수술, 브릿지, 틀니, 응급, 예방

### 의사 프로필 (5명) — `/doctors/{slug}`
박준규(대표원장), 최다빈, 정문희(보존과전문의), 상세훈, 하누리(교정과전문의)

### 관리자 기능
- `/admin` — 관리자 로그인
- `/admin/dashboard` — Before/After 케이스 관리 (CRUD)
- `/admin/blog` — 블로그 글 관리 (CRUD)

### API 엔드포인트
| 메서드 | 경로 | 설명 |
|--------|------|------|
| POST | `/api/auth/register` | 회원가입 |
| POST | `/api/auth/login` | 로그인 |
| GET | `/api/auth/me` | 현재 사용자 |
| POST | `/api/auth/logout` | 로그아웃 |
| POST | `/api/admin/login` | 관리자 로그인 |
| GET/POST/PUT/DELETE | `/api/admin/cases` | 케이스 CRUD |
| GET/POST/PUT/DELETE | `/api/admin/blog` | 블로그 CRUD |
| GET | `/api/cases` | 공개 케이스 목록 |

### 기타 페이지
- `/cases/gallery` — Before/After 갤러리
- `/privacy` — 개인정보처리방침
- `/terms` — 이용약관
- `/sitemap.xml` — 동적 사이트맵 (42 URL)
- `/robots.txt` — 크롤러 설정 (AI봇 허용)
- 404 — 커스텀 에러 페이지
- `/pricing` → `/info#pricing` (301)
- `/directions` → `/info` (301)

## SEO/AEO 최적화
- **JSON-LD**: 페이지당 12~20개 스키마 (WebSite, Dentist, MedicalProcedure, FAQPage, Physician, Blog 등)
- **메타태그**: 모든 페이지 title/description + canonical URL
- **OG/Twitter Card**: og:title, og:description, og:image 전 페이지
- **시맨틱 HTML**: H1-H3 계층 구조, section/nav/main/article
- **사이트맵**: 이미지/비디오 포함 동적 생성
- **AEO**: SpeakableSpecification, AI 크롤러 허용 (GPTBot, ClaudeBot 등)

## 데이터 아키텍처
- **D1 Database**: users, sessions, admin_users, admin_sessions, before_after_cases, blog_posts
- **Static Data**: treatments (26개), doctors (5명), FAQ, pricing, brand messaging
- **Storage**: Cloudflare D1 (SQLite) + 마이그레이션 관리

## 디자인 시스템
- Primary: #1B6FC9 (선명한 푸른색)
- Font: Pretendard Variable (CDN)
- Icons: Font Awesome 6.4
- 반응형: Mobile-first (모바일 하단 CTA, 데스크톱 플로팅 CTA)
- 고정 헤더: 운영 상태 실시간 표시

## 🚀🚀 SEO 슈퍼 업그레이드 v2 (2026-05-26) — 1,374 페이지 SEO 군단

### v2 추가 사항 (이번 업그레이드)
- **롱테일 변형 페이지 1,140개 신설** (19 지역 × 10 진료 × 6 변형 = 1,140)
  - 6변형: `cost`(비용)·`recommend`(추천)·`review`(후기)·`event`(이벤트)·`best`(잘하는곳)·`night`(야간)
  - 경로: `/area/:areaSlug/:treatmentSlug/:variantSlug`
  - 예: `/area/guwol-dong/implant/cost` → "구월동 임플란트 비용"
- **매트릭스 페이지 콘텐츠 3배 확장** (109KB → 1500자+ 본문, 가격표, 6가지 선택이유, 사후관리, 후기 등)
- **추가 JSON-LD 스키마 4종**: Article, HowTo, OfferCatalog, Place (총 12개 schema)
- **TREATMENT_PRICING 가격표**: 10개 진료별 정찰가 자동 노출 (PriceSpecification 구조화)
- **Core Web Vitals 강화**: preconnect/dns-prefetch 8개 추가, fetchpriority hint
- **새 sitemap**: `/sitemap-area-variants.xml` (1,140 URL)
- **공개 ping API**: `/api/seo/ping-public` (외부 cron service에서 자동 호출 가능)
- **SEO 통계 API**: `/api/seo/stats` (실시간 페이지 수·sitemap 모니터링)

### v1 매트릭스 시스템
- **190개 자동 생성 SEO 랜딩 페이지** (19개 지역 × 10개 핵심 진료)
- 경로: `/area/:areaSlug/:treatmentSlug`
- 예: `/area/guwol-dong/implant` → "구월동 임플란트"
- 각 페이지 고유 콘텐츠:
  - 지역명+진료명 H1 + 8개 H2 (키워드 밀도 ↑↑↑)
  - 지역 맞춤 FAQ 8개 (FAQPage 스키마)
  - 거리·소요시간·랜드마크 + 진료 셀링포인트
  - LocalBusiness/Dentist + MedicalProcedure + areaServed JSON-LD
  - 내부 링크: 같은 지역 다른 진료 9개 + 같은 진료 다른 지역 12개
- **키워드 자동 노출 패턴**:
  - `{지역명} {진료명}` (구월동 임플란트)
  - `{지역명}{진료명}` (구월동임플란트)  
  - `{지역명} {진료명} 추천/잘하는곳/비용/가격`
  - `{구이름} {진료명}` (남동구 임플란트)
  - `인천 {지역} {진료}` 
  - `{랜드마크} {진료}` (예술회관역 임플란트)

### SEO 인프라 강화
- ✅ `sitemap-area-treatments.xml` 추가 (190 URL, priority 0.65~0.9)
- ✅ `robots.txt`에 매트릭스 sitemap 등록
- ✅ IndexNow API 자동 제출 대상에 매트릭스 페이지 포함
- ✅ 페이지별 `keywords` 메타 태그 지원 (renderer.tsx)
- ✅ 진료 페이지(`/treatments/:slug`)에 19개 지역 그리드 추가
- ✅ 지역 페이지(`/area/:slug`)에 10개 진료 그리드 추가
- ✅ 홈페이지에 SEO 허브 섹션 추가 (3개 핵심 진료 × 10개 지역)

## 미구현 (Phase 2+)
- [ ] 실제 이미지 교체 (의사 사진, 시설 사진, 치료 사례)
- [ ] Naver/Kakao Map API 연동
- [ ] Google Places API 실시간 리뷰
- [ ] GA4 + GTM 연동
- [ ] 블로그 콘텐츠 20개+ 확충
- [ ] Tailwind CSS 빌드 모드 전환 (CDN → PostCSS)
- [ ] Cloudflare Pages 프로덕션 배포

## 🚀🚀🚀 SEO 슈퍼 업그레이드 v3 (2026-05-26) — AI 검색 시대 7대 무기

### v3 추가 사항
- **Weapon 1 — AI Answer Hub** (`/answers`, `/answers/:slug`)
  - 13개 핵심 질문에 대한 QAPage JSON-LD (SGE/Perplexity/ChatGPT/Claude 인용 최적화)
  - mainEntity Question 배열로 AI가 직접 답변 추출 가능
- **Weapon 2 — E-E-A-T 시그널 강화**
  - Author/reviewedBy/worksFor/alumniOf/memberOf(대한치과의사협회) 명시
  - MedicalAudience + citation 스키마 (Google 의료 콘텐츠 가이드라인 대응)
- **Weapon 3 — 역세권/랜드마크 페이지** (`/stations`, `/stations/:slug`)
  - 11개 역/랜드마크 (예술회관역, 인천시청역, 가천대 길병원, 송도국제도시역 등)
  - Place + containsPlace Dentist 스키마
- **Weapon 4 — 비교 페이지** (`/compare`, `/compare/:slug`)
  - 7개 A-vs-B 키워드 페이지 (오스템 vs 스트라우만, 인비절라인 vs 메탈 등)
  - ItemList + MedicalWebPage + FAQPage 스키마
- **Weapon 5 — Topic Cluster (Hub-Spoke)** (`/guides`, `/guides/:cluster`, `/guides/:cluster/:spoke`)
  - 3개 Pillar (임플란트/인비절라인/교정) + 16개 Spoke
  - hasPart/isPartOf 관계로 토픽 권위 구축
- **Weapon 6 — 자동 IndexNow** (`/api/cron/full-sync`)
  - X-Cron-Token 인증, 외부 cron-job.org에서 호출 가능
  - POST/GET 양방향 지원 (Cloudflare Pages는 Cron Trigger 미지원이라 우회)
- **Weapon 7 — 다국어** (`/en`, `/zh`)
  - 송도 외국인 거주자 타겟 (영어 + 간체)
  - hreflang ko-KR/en/zh-CN/x-default 전체 페이지 적용

### v3 신규 SEO 페이지 카운트
| 카테고리 | URL 수 |
|---------|--------|
| AI Answer Hub | 14 (인덱스 1 + 상세 13) |
| 비교 페이지 | 8 (인덱스 1 + 상세 7) |
| Topic Cluster | 20 (허브 1 + Pillar 3 + Spoke 16) |
| 역세권/랜드마크 | 12 (인덱스 1 + 상세 11) |
| 다국어 | 2 (en + zh) |
| **v3 소계** | **56** |

### v3 sitemap-index 확장
- `/sitemap-answers.xml` (14 URL)
- `/sitemap-compare.xml` (8 URL)
- `/sitemap-guides.xml` (20 URL)
- `/sitemap-stations.xml` (12 URL)
- `/sitemap-intl.xml` (2 URL)

## 🚀🚀🚀🚀 SEO 슈퍼 업그레이드 v4 (2026-05-26) — 리치 스니펫 + 신뢰 시그널

### v4 추가 사항 (한번더 슈퍼업글)
- **Weapon 8 — Reviews + AggregateRating** (`/reviews`, `/reviews/:category`)
  - 평점 4.9/5.0 (2,156+ 리뷰) Dentist + AggregateRating + Review 스키마
  - Google 검색결과 ⭐ 별점 리치 스니펫 노출 타겟
  - 9개 카테고리별 평점 페이지 (implant/orthodontics/invisalign/sedation/whitening/cosmetic/pediatric/emergency/scaling)
- **Weapon 9 — HowTo 시술 절차** (`/procedures`, `/procedures/:slug`)
  - HowTo + HowToStep + HowToSupply 스키마 (SGE/Featured Snippet 타겟)
  - 3개 절차 가이드 (임플란트·인비절라인·수면진료) 단계별 텍스트 + duration
  - MedicalProcedure + 의료진 E-E-A-T 결합
- **Weapon 10 — Event 캘린더** (`/events`, `/events/:slug`)
  - Event JSON-LD (Google 이벤트 카드 노출)
  - 4개 시즌 이벤트 (여름 임플란트·봄 교정·결혼 미백·소아 패키지)
  - Offer + Place + Organization 결합
- **Weapon 11/12 — 글로벌 강화**
  - 기존 Speakable + ImageObject + AggregateRating 스키마 검증 완료 (renderer.tsx)
- **Weapon 13 — 차별화 페이지** (`/why-us`)
  - 365치과 vs 일반치과 10가지 비교
  - Dentist + OfferCatalog + AggregateRating(평점 4.9) 스키마
- **Weapon 14 — 보험 가이드** (`/insurance`, `/insurance/:slug`)
  - 4개 보험 가이드 (임플란트 65세+, 틀니, 스케일링, 교정 실비)
  - High-intent 키워드 타겟 (만 65세 임플란트 보험, 틀니 보험, 스케일링 무료 등)

### v4 신규 SEO 페이지 카운트
| 카테고리 | URL 수 |
|---------|--------|
| Reviews (AggregateRating) | 10 (인덱스 1 + 카테고리 9) |
| HowTo Procedures | 4 (인덱스 1 + 상세 3) |
| Events Calendar | 5 (인덱스 1 + 상세 4) |
| Why Us | 1 |
| Insurance Guides | 5 (인덱스 1 + 상세 4) |
| **v4 소계** | **25** |

### v4 sitemap-index 확장 (5개 추가)
- `/sitemap-reviews.xml` (10 URL)
- `/sitemap-procedures.xml` (4 URL)
- `/sitemap-insurance.xml` (5 URL)
- `/sitemap-events.xml` (5 URL)
- `/sitemap-whyus.xml` (1 URL)

## Deployment
- **Platform**: Cloudflare Pages
- **Status**: ✅ Active (v4 배포 완료)
- **Bundle Size**: 1,172KB (v4 — AggregateRating + HowTo + Event + Insurance 포함)
- **Total Routes**: 46 코어 + 190 매트릭스 + 1,140 변형 + 56 v3 + 25 v4 + 리다이렉트 = **1,459개 라우트**
- **Total SEO Landing Pages**: **1,455개** (190 + 1,140 + 56 v3 + 25 v4 + 19 지역 + 25 진료)
- **Sitemaps**: 메인 1개 + 서브 14개 (v1 4 + v2 1 + v3 5 + v4 5) = **15개 sitemap**
- **Last Updated**: 2026-05-26 v4 (SEO 슈퍼 업그레이드 4차 — 리치 스니펫 + 신뢰 시그널)

## 🚀🚀🚀🚀🚀 SEO/AEO 머신 업그레이드 v7 (2026-06-11) — 진짜 머신화

### v7 핵심 개선 (Critical Fixes + 신규 무기)
- **Fix 1 — Soft-404 제거**: 404 페이지가 HTTP 200으로 응답하던 문제 수정 → `c.status(404)` + `X-Robots-Tag: noindex` (Google이 가짜 페이지로 색인하는 것 방지)
- **Fix 2 — Fake Freshness 제거**: 정적 sitemap lastmod가 매 요청마다 `today`로 갱신되던 문제 수정 → `STATIC_LASTMOD` 상수 도입 (Google의 lastmod 신호 신뢰도 회복; 콘텐츠 실수정 시에만 날짜 갱신)
- **Fix 3 — hreflang 정밀화**: 전 페이지에 en/zh hreflang을 무차별 선언하던 신호 오염 수정 → 홈·다국어 페이지에서만 ko/en/zh-CN/ru 클러스터 상호 선언, 일반 페이지는 ko-KR+x-default만. Hono JSX의 동일 href `<link>` dedup 이슈를 `raw()`로 우회
- **Weapon 15 — 콘텐츠 피드 3종** (AI 크롤러·검색엔진 신규 콘텐츠 발견 경로)
  - RSS 2.0: `/blog/rss.xml` (dc:creator, enclosure, ttl)
  - Atom 1.0: `/blog/atom.xml`
  - JSON Feed 1.1: `/feed.json` (content_text 포함 — LLM 파싱 최적)
  - 별칭 301: `/rss.xml`, `/atom.xml`, `/feed`, `/blog/feed`
  - 전 페이지 `<head>`에 3종 자동발견 링크 추가
- **Weapon 16 — 백과사전 용어 개별 페이지 200개** (`/encyclopedia/:slug`)
  - DefinedTerm + MedicalWebPage + Question/Answer(직답) + Speakable + Breadcrumb 스키마
  - "{용어} 뜻", "{용어}이란" 롱테일 검색 타겟
  - 같은 카테고리 관련 용어 8개 내부링크 + 관련 진료 CTA
  - `/sitemap-encyclopedia.xml` (200 URL) — sitemap index + robots.txt 등록
- **Weapon 17 — llms.txt 슈퍼 확장**
  - 가격 정보 섹션 (정찰가 직접 노출 — AI 답변 인용 최적)
  - AI 답변용 Q&A 허브 8개 링크 (answers/compare/guides/procedures/insurance/reviews/stations/why-us)
  - 다국어 페이지 + 피드 3종 안내
  - "인용 가이드 (For AI Assistants)" — 출처 표기 방법 명시
- **기타**: `/ru` 러시아어 페이지 sitemap-intl 등록 (기존 누락)

### v7 후 전체 현황
- **Total SEO Landing Pages**: 1,455 + 200 (백과사전) = **1,655개**
- **Sitemaps**: 16개 (encyclopedia 추가)
- **Feeds**: RSS + Atom + JSON Feed 3종
- **Last Updated**: 2026-06-11 v7

## 🔧 v9 (2026-06-19) — 의료진 정보 수정 + 배포
- **하누리 원장 약력 정정**: 서울대학교 → **원광대학교**로 교체 (본문 약력 3곳 + brand 스토리 + JSON-LD alumniOf 스키마)
- **임플란트 진료과목 담당의 변경**: 상세훈 원장 → **최다빈 원장**으로 이관
  - 최다빈: specialties/treatmentLinks에 임플란트 추가, brand 프로필 반영
  - 상세훈: 임플란트 제거 → 보철 전문으로 정리
  - whyus 의료진 카드: 최다빈 "임플란트·심미" / 상세훈 "보철"
- **JSON-LD 스키마 개선**: 의사별 alumniOf가 하드코딩(서울대)이던 것을 `doc.education` 기반 동적 생성으로 수정
- **신규 관리자 계정**: drmoon (문석준 원장) 프로덕션 D1에 추가 (기존 admin 계정 유지)
- **배포 완료**: https://seoul365dc.kr (Cloudflare Pages, 2026-06-19)

## 🚀 v8 (2026-06-11) — 크롤 버짓 + 엣지 캐싱 최적화
- **noindex 시스템**: admin·login·register 등 비공개 페이지 9곳 `noindex, nofollow` (크롤 버짓 절약)
- **HTML 엣지 캐싱**: 콘텐츠 페이지 `s-maxage=1800 + stale-while-revalidate` / admin·api `no-store` (크롤러 TTFB 단축)
- **full-sync 확장**: IndexNow 대상에 백과사전 200 URL + 피드 + /ru 포함, sitemap ping 21개로 확장
- **푸터 내부링크 강화**: 가격표·직답·백과사전·후기 4개 링크 전 페이지 노출 (링크 에쿼티 분배)

## v10 (2026-07-28) — 차해나 원장 신규 합류
- **신규 의료진 추가**: 차해나 원장 (slug: `cha-haena`)
  - 학력: 연세대 생명공학과 졸업 / 서울대 치과대학 졸업 / 서울대 치의학대학원 석사
  - 경력: 서울대학교 치과병원 종합진료실
  - 국제 연수: 美 Tufts·NYU, 濠 Univ. of Melbourne, 中 Sichuan Univ.
  - 담당: 보철·심미·보존치료·종합진료
- 박준규 원장이 전달한 카카오톡 스크린샷에서 프로필 사진만 크롭하여 `/static/dr-cha-haena-profile.jpg`로 저장
- 반영 파일: `src/data/doctors.ts`, `src/data/brand.ts`, `src/routes/whyus.tsx`
- **정책(옵션2)**: 브랜드 슬로건 "서울대 출신 5인" 표기는 그대로 유지(전문의 3인 포함 표현 보존, 의료광고법 리스크 회피). 의료진 목록/카드에만 차해나 원장 추가.
- 배포: https://b5387f90.seoul365dental.pages.dev → https://seoul365dc.kr/ (HTTP 200 검증 완료)

## v11 (2026-08-02) — 진료비 수가표 관리자 편집 기능
- **관리자 페이지에서 8개 진료 수가표를 코드 배포 없이 편집 가능** (`/admin/pricing`)
  - 대상 진료: 임플란트 · 교정 · 라미네이트 · 레진 · 신경치료 · 크라운 · 치아미백 · 사랑니발치
  - 편집 항목: 각 tier의 이름(name) · 가격(price) · 범위(range) · 특징(features) + 진료별 intro/description
  - 8개 진료를 접이식(`<details>`) 아코디언 UI로 제공, 저장/초기화 버튼 + `/prices` 미리보기 링크
- **아키텍처 (비침습적 병합 전략)**
  - 코드의 `PRICE_PAGES`(기본값)는 그대로 두고, DB `site_settings`의 `PRICING_OVERRIDE` 키에 편집 JSON을 저장
  - 요청 시 `getPricePages(db)`가 기본값 위에 override를 병합 → **즉시 반영, 스키마 마이그레이션 불필요**
  - 초기화 = override 빈 문자열 저장 → 코드 기본값으로 롤백
  - range 문자열에서 숫자 자동 파싱(`parseRangeToKRW`) → JSON-LD의 `priceMin`/`priceMax` 자동 갱신 (Schema.org AggregateOffer 반영)
- **보안**: `PUT /api/admin/pricing/tables`는 `getAdminFromCookie` 인증 필수(미인증 시 401), `PRICE_PAGES` slug/tier 인덱스 화이트리스트 검증 + 길이 캡
- 반영 파일: `src/routes/commercial.tsx` (PRICE_PAGES export, getPricePages 병합 헬퍼, async 라우트), `src/routes/admin.tsx` (에디터 UI + 저장/초기화 API)
- 기존 임플란트 이벤트 설정(`EVENT_IMPLANT_*`) UI/API는 그대로 유지 (독립 동작)
- 배포: https://60eeccd1.seoul365dental.pages.dev → https://seoul365dc.kr/ (프로덕션 로그인 후 수가표 섹션 렌더 + 8개 진료 주입 검증 완료)

## v13 (2026-09-03) — Git 분기 사고 복구 (양쪽 작업 모두 보존 병합)
> 이 프로젝트 최신 작업이 GitHub에 push되기 전, 로컬 Claude Code가 구버전 기준으로 추가 작업+배포하여 히스토리가 분기됨. 어느 쪽도 버리지 않고 **양쪽 모두 살리는 merge**로 복구 (rebase·force push 금지).
- **분기 진단** (merge-base `8ee304a`)
  - 로컬 전용 6커밋: `4d5a629`(SEO Patient Grader) · `0d7aa40`(진료비 관리자 편집) · `ed098af`(차해나 원장) · `89eed92`(하누리) · `fb403c3`(SEO v8) · `2f840fe`(SEO v7)
  - 원격 전용 4커밋(Claude Code): `d9cb91d`(MS Clarity) · `f91cd5d`(IndexNow 라우트) · `8929a81`(IndexNow 키 파일) · `9343710`(GA4)
  - 공통 수정(충돌 후보) 파일: `src/renderer.tsx`, `src/routes/seo.tsx`
- **병합 결과** — 병합 커밋 `cad2bae` (부모 `4d5a629` + `d9cb91d`)
  - `git merge --no-commit --no-ff origin/main` → **자동 병합 성공, 충돌 0건** (양쪽이 서로 다른 라인을 건드려 겹치지 않음)
  - 안전장치: 백업 브랜치 `backup-genspark-4d5a629`, `backup-remote-d9cb91d` 생성
- **보존 확인** (빌드 후 로컬+프로덕션 curl 검증)
  - [원격] GA4 `G-5G4T54KTZW` · MS Clarity `yc83itfgmi` · IndexNow 키 라우트+파일 ✅
  - [로컬] 동적 저작권연도 · JSON-LD copyrightYear · hreflang(raw 6링크) · sitemap-encyclopedia · www→non-www 301 · 블로그 카드 `·` 구분자 ✅
- **참고**: 로컬 dev에서 IndexNow `.txt`가 한때 404 → 병합 전 `.wrangler` 자산 매니페스트 캐시 잔여물. `rm -rf .wrangler dist && npm run build`로 해결 (코드/라우트는 처음부터 정상)
- 배포: https://dd32e346.seoul365dental.pages.dev → https://seoul365dc.kr/ (양쪽 기능 전부 검증 완료)

## v12 (2026-08-18) — Patient Grader 감점 개선 1차 (F2·A4·데이터 정합성)
> PF 병원 14곳 홈페이지 평가(Patient Grader) 리포트 기반. 서울365치과 80.5점 → 감점 항목 중 "코드로 확실히 고칠 수 있는 것" 우선 처리.
- **[F2 기술 현대성 +2.5] 저작권 연도 방치 신호 제거**
  - 푸터 `© 2019-2026` 하드코딩 → **동적 연도**(`2019-{new Date().getFullYear()}`)로 변경 → 매년 자동 갱신, 재방치 원천 차단
  - JSON-LD `copyrightYear: "2019"` → `String(currentYear)` (검색엔진·AI가 읽는 구조화 데이터 갱신)
  - 러시아어 페이지(`/ru`) 푸터 `© 2019–2026`도 동일 동적화
  - 반영: `src/renderer.tsx`, `src/routes/ru.tsx`
- **[A4 canonical 정합성 +0.5] www ↔ non-www URL 통일**
  - 문제: `www.seoul365dc.kr`가 301 없이 HTTP 200으로 중복 서빙 → 같은 페이지가 2개 주소로 존재(점수 분산)
  - 조치: `index.tsx` 전역 미들웨어에 **www → non-www 301 리다이렉트** 추가 (대표 URL = `https://seoul365dc.kr`)
  - 검증: `https://www.seoul365dc.kr/`, `/prices` 모두 `301 → https://seoul365dc.kr/...` 확인
- **[데이터 정합성] "026년" 오인 텍스트 수정**
  - 원인: 홈·블로그 최신글 카드에서 카테고리 span과 날짜 span이 공백 없이 인접(`치과상식2026.08.18`) → 크롤러/AI가 "…상식2026", "026년"으로 오인 (리포트 D4 증거)
  - 조치: 카테고리·날짜 사이에 `·` 구분자(`aria-hidden`) 삽입 → 텍스트 경계 확보(`치과상식·2026.08.18`), 시각 디자인 유지
  - 반영: `src/routes/home.tsx`(본문+폴백 2곳), `src/routes/blog.tsx`(리스트 카드)
- **보류**: D5 전문용어 병기(치조골→잇몸뼈 등)는 백과사전·용어집의 정확 용어 표제어까지 깨질 위험이 커서 원장님 지시로 단어 치환 미실시
- **다음 단계(별도)**: D3 클리셰 지수(-2.5) — "환자 중심·아름다운 미소" 등 → 실적 수치·고유명사로 교체안 표 작성 후 원장님 확인 예정
- 배포: https://30a0931e.seoul365dental.pages.dev → https://seoul365dc.kr/ (301·copyright·구분자 모두 검증 완료. 커스텀 도메인 루트는 엣지 캐시 s-maxage=1800으로 최대 30분 내 자동 반영)
