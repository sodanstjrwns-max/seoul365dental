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

## 미구현 (Phase 2+)
- [ ] 지역 SEO 랜딩 페이지 (15개+)
- [ ] 실제 이미지 교체 (의사 사진, 시설 사진, 치료 사례)
- [ ] Naver/Kakao Map API 연동
- [ ] Google Places API 실시간 리뷰
- [ ] GA4 + GTM 연동
- [ ] 블로그 콘텐츠 20개+ 확충
- [ ] Tailwind CSS 빌드 모드 전환 (CDN → PostCSS)
- [ ] Cloudflare Pages 프로덕션 배포

## Deployment
- **Platform**: Cloudflare Pages
- **Status**: 개발 완료, 배포 대기
- **Bundle Size**: 432KB
- **Total Routes**: 46개 + 리다이렉트 2개
- **Last Updated**: 2026-03-10
