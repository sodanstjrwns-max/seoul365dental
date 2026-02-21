# 서울365치과의원 웹사이트

## Project Overview
- **Name**: Seoul 365 Dental Website
- **Goal**: Patient Funnel 10단계 기반의 환자 유입·전환 최적화 웹사이트
- **Client**: 서울365치과의원 (인천 남동구 구월동)
- **Tech Stack**: Hono + TypeScript + Tailwind CSS (CDN) + Cloudflare Pages

## URLs
- **Production**: 배포 대기 중
- **Development**: localhost:3000

## 구현 완료된 기능

### 핵심 페이지 (5개)
- `/` — 메인 홈 (13섹션 풀 구현)
- `/reservation` — 예약/상담 (전화, 카카오, 네이버, 온라인 폼)
- `/directions` — 오시는 길 (교통 안내, 지도 플레이스홀더)
- `/pricing` — 비용 안내 (13개 항목 가격표)
- `/doctors` — 의료진 목록 (5인 원장 소개)

### 치료 상세 페이지 (24개) — `/treatments/{slug}`
전체임플란트, 올온X, 임플란트, 치아교정, 인비절라인, 소아치과, 심미치료, 수면진료,
충치, 레진, 크라운, 인레이, 신경치료, 재신경치료, 치근단절제술, 미백,
스케일링, 잇몸치료, 사랑니, 턱관절, 이갈이, 임플란트재수술, 브릿지, 틀니, 응급, 예방

### 의사 프로필 (5명) — `/doctors/{slug}`
박준규(대표원장), 최다빈, 정문희(보존과전문의), 상세훈, 하누리(교정과전문의)

### 콘텐츠/신뢰 페이지
- `/cases/gallery` — Before/After 갤러리
- `/faq` — 자주 묻는 질문 (FAQPage Schema)
- `/privacy` — 개인정보처리방침
- `/terms` — 이용약관
- 404 — 커스텀 에러 페이지

## SEO/AEO 최적화
- JSON-LD Schema.org: Dentist, Physician, MedicalProcedure, FAQPage
- 모든 페이지 meta title/description + canonical URL
- OG/Twitter Card 태그
- 시맨틱 HTML (section, nav, main, article, h1~h3)
- FAQ 아코디언 with Schema.org markup

## 디자인 시스템
- Primary: #1B6FC9 (선명한 푸른색)
- Font: Pretendard Variable (CDN)
- Icons: Font Awesome 6.4
- 반응형: Mobile-first (모바일 하단 CTA, 데스크톱 플로팅 CTA)
- 고정 헤더: 운영 상태 실시간 표시

## CTA 배치
- 헤더: 전화 + 예약 버튼
- 히어로: 상담 예약 + 비용 안내
- 각 페이지 하단: 전화/카카오/네이버 예약
- 모바일 하단 고정: 전화/카카오/예약/오시는길
- 데스크톱 플로팅: 카카오/전화/맨위로

## 미구현 (Phase 2+)
- [ ] 지역 SEO 랜딩 페이지 (15개+)
- [ ] 실제 이미지 교체 (의사 사진, 시설 사진, 치료 사례)
- [ ] Naver/Kakao Map API 연동
- [ ] Google Places API 실시간 리뷰
- [ ] GA4 + GTM 연동
- [ ] 칼럼/블로그 콘텐츠
- [ ] 영상 콘텐츠 (YouTube 임베드)
- [ ] sitemap.xml / robots.txt
- [ ] Cloudflare Pages 배포

## Deployment
- **Platform**: Cloudflare Pages
- **Status**: 개발 완료, 배포 대기
- **Last Updated**: 2026-02-21
