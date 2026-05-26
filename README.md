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

## Deployment
- **Platform**: Cloudflare Pages
- **Status**: ✅ Active (v3 배포 완료)
- **Bundle Size**: 1,099KB (v3 — AI Answer Hub + E-E-A-T + 다국어 포함)
- **Total Routes**: 46개 코어 + 190 매트릭스 + 1,140 변형 + 56 v3 + 리다이렉트 = **1,434개 라우트**
- **Total SEO Landing Pages**: **1,430개** (190 매트릭스 + 1,140 변형 + 56 v3 + 19 지역 + 25 진료)
- **Last Updated**: 2026-05-26 v3 (SEO 슈퍼 업그레이드 3차 — AI 검색 시대 대응)
