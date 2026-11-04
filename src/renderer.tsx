import { jsxRenderer, useRequestContext } from 'hono/jsx-renderer'
import { raw } from 'hono/html'

// vite.config.ts define — 메인 몰입 연출 파일 내용 해시(캐시 버스팅)
declare const __IMMERSIVE_JS_V__: string
declare const __IMMERSIVE_CSS_V__: string
declare const __APP_JS_V__: string
declare const __STYLE_CSS_V__: string
import { CLINIC, HOURS } from './data/clinic'
import { MESSAGING, MISSION } from './data/brand'
import { AREAS } from './data/areas'
import { doctors as DOCTORS } from './data/doctors'
import { Icon, NaverMark, KakaoMark } from './lib/icons'
import { todayStatus } from './lib/hours'

// 메인 네비게이션(헤더·드로어 공용)
const NAV = [
  { href: '/treatments', label: '진료안내', en: 'TREATMENTS' },
  { href: '/doctors', label: '의료진', en: 'DOCTORS' },
  { href: '/cases/gallery', label: '치료사례', en: 'CASES' },
  { href: '/blog', label: '블로그', en: 'BLOG' },
  { href: '/faq', label: 'FAQ', en: 'FAQ' },
  { href: '/notices', label: '공지사항', en: 'NOTICE' },
  { href: '/info', label: '내원안내', en: 'VISIT' },
] as const

// SEO/AEO Optimized Renderer — v3.0
// - Rich Schema.org (Dentist + MedicalOrganization + WebSite + Speakable)
// - Complete OG + Twitter meta
// - Dynamic GA4/GTM/Search Console/Naver/Bing integration
// - Semantic HTML, Accessibility, AEO

// Global SEO settings cache (set by middleware in index.tsx)
let _currentSeoSettings: Record<string, string> = {};
export function setCurrentSeoSettings(s: Record<string, string>) { _currentSeoSettings = s; }

export const renderer = jsxRenderer(({ children, title, description, canonical, jsonLd, dateModified, ogImage: customOgImage, ogImageWidth, ogImageHeight, ogImageAlt, ogType, datePublished, articleSection, articleTags, keywords: pageKeywords, noindex, noindexFollow }) => {
  const pageTitle = title || `서울365치과 | 인천 구월동 임플란트·인비절라인·교정·수면진료 365일 야간진료`;
  const pageDesc = description || `인천 구월동 서울365치과. 서울대 출신 5인 원장 협진, 365일·야간21시 진료. 임플란트·인비절라인 투명교정·수면진료 전문. 032-432-0365`;
  const canonicalUrl = canonical || 'https://seoul365dc.kr';
  // 메인 홈에서만 스크롤 몰입 연출을 싣는다
  const reqPath = useRequestContext().req.path;
  const isHome = reqPath === '/';
  const todayHours = todayStatus();
  // noindex 페이지(404·관리자 등)가 canonical 을 따로 넘기지 않으면 canonical·hreflang 을 내보내지 않는다
  // (기존: 홈으로 canonical → soft 404 신호). 2026-10-08
  const emitCanonical = !!canonical || !noindex;
  const defaultKeywords = '인천치과, 구월동치과, 남동구치과, 인천임플란트, 구월동임플란트, 오스템임플란트, 스트라우만임플란트, 메가젠임플란트, 오스템SOI, 임플란트가격, 임플란트비용, 인천치아교정, 인비절라인, 인천인비절라인, 구월동인비절라인, 투명교정, 인천투명교정, 인비절라인비용, 인비절라인가격, 수면진료, 전체임플란트, 디지털풀아치, 인천전체임플란트, 서울365치과, 인천교정, 야간진료치과, 365일치과, 자체기공실, 무통마취, 인천소아치과, 심미치료, 신경치료, 서울대치과, 인천수면치과, 간석동치과, 간석동임플란트, 만수동치과, 만수동임플란트, 논현동치과, 논현동임플란트, 서창동치과, 고잔동치과, 남촌동치과, 장수동치과, 도림동치과, 운연동치과, 주안동치과, 관교동치과, 청학동치과, 연수동치과, 송도치과, 송도임플란트, 부평치과, 부평임플란트, 십정동치과, 검암동치과, 계양구치과, 미추홀구치과, 연수구치과, 인천남동구임플란트';
  // 페이지별 키워드가 있으면 기본 키워드와 합쳐서 노출 (페이지 키워드 먼저)
  const metaKeywords = pageKeywords ? `${pageKeywords}, ${defaultKeywords}` : defaultKeywords;
  const ogImage = customOgImage || 'https://seoul365dc.kr/static/og-image.png';
  // og:image 크기(2026-10-14): 기본 og-image(1200×630)·명시한 크기만 내보낸다 — 칼럼 표지 등 크기 모르는 이미지에 1200×630 을 붙이지 않는다
  const ogSize: [number, number] | null = ogImageWidth && ogImageHeight ? [ogImageWidth, ogImageHeight]
    : (!customOgImage || /\/static\/og-image\.(png|jpg)$/.test(customOgImage)) ? [1200, 630] : null;
  const resolvedOgType = ogType || 'website';
  // 페이지가 넘긴 고정 날짜만 사용 — 없으면 date/modified 메타 생략 (매일 '오늘' 자동 갱신 금지, 2026-09-29)
  const lastModified = dateModified || '';
  const currentYear = new Date().getFullYear(); // 푸터·저작권 연도 자동 갱신 (F2 방치 신호 제거)

  // Dynamic SEO/Analytics settings (from DB or env via global cache)
  const seo = _currentSeoSettings || {};
  const ga4Id = seo.GA4_MEASUREMENT_ID || 'G-5G4T54KTZW';
  const gtmId = seo.GTM_CONTAINER_ID || '';
  const googleVerify = seo.GOOGLE_SITE_VERIFICATION || '';
  const naverVerify = seo.NAVER_SITE_VERIFICATION || '';
  const bingVerify = seo.BING_SITE_VERIFICATION || '';

  // WebSite schema for sitelinks searchbox (AEO/SEO)
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://seoul365dc.kr/#website",
    "name": "서울365치과의원",
    "alternateName": ["Seoul 365 Dental", "서울365치과", "서울삼육오치과"],
    "url": "https://seoul365dc.kr",
    "inLanguage": "ko-KR",
    "publisher": { "@id": "https://seoul365dc.kr/#dentist" },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://seoul365dc.kr/treatments?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    },
    "copyrightHolder": { "@id": "https://seoul365dc.kr/#dentist" },
    "copyrightYear": String(currentYear),
  };

  // Dentist + MedicalOrganization combined schema
  const dentistSchema = {
    "@context": "https://schema.org",
    "@type": ["Dentist", "MedicalOrganization", "LocalBusiness"],
    "@id": "https://seoul365dc.kr/#dentist",
    "name": "서울365치과의원",
    "alternateName": "Seoul 365 Dental Clinic",
    "description": "인천 구월동 서울대 출신 5인 전문의 협진 치과. 365일 진료, 자체 기공실, 수면진료, 무통마취. 임플란트·인비절라인·교정·심미치료 전문.",
    "url": "https://seoul365dc.kr",
    "telephone": "+82-32-432-0365",
    "email": "seoul365dental@gmail.com",
    "image": ogImage,
    "logo": { "@type": "ImageObject", "url": "https://seoul365dc.kr/static/logo-v2.png", "width": 174, "height": 180 },
    "priceRange": "₩₩",
    "currenciesAccepted": "KRW",
    "paymentAccepted": "현금, 신용카드, 카카오페이",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "예술로 138 이토타워 2층 212호",
      "addressLocality": "인천광역시 남동구",
      "addressRegion": "인천",
      "postalCode": "21556",
      "addressCountry": "KR",
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": String(CLINIC.geo.lat),
      "longitude": String(CLINIC.geo.lng),
    },
    "hasMap": `https://www.google.com/maps?q=${CLINIC.geo.lat},${CLINIC.geo.lng}`,
    "openingHoursSpecification": [
      { "@type": "OpeningHoursSpecification", "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday"], "opens": "10:00", "closes": "21:00" },
      { "@type": "OpeningHoursSpecification", "dayOfWeek": "Friday", "opens": "10:00", "closes": "19:00" },
      { "@type": "OpeningHoursSpecification", "dayOfWeek": "Saturday", "opens": "10:00", "closes": "14:00" },
      { "@type": "OpeningHoursSpecification", "dayOfWeek": "Sunday", "opens": "14:00", "closes": "18:00" },
    ],
    "founder": { "@type": "Person", "name": "박준규", "jobTitle": "대표원장" },
    "foundingDate": "2019",
    "numberOfEmployees": { "@type": "QuantitativeValue", "minValue": 20, "maxValue": 30 },
    "medicalSpecialty": [
      "Implantology", "Orthodontics", "Prosthodontics",
      "Endodontics", "Pediatric Dentistry", "Sedation Dentistry",
    ],
    "availableService": [
      {
        "@type": "MedicalProcedure",
        "name": "임플란트",
        "procedureType": "https://schema.org/SurgicalProcedure",
        "bodyLocation": "치조골 (Alveolar bone)",
        "howPerformed": "국소마취 또는 수면마취 하에 치조골에 티타늄 임플란트 식립 후 보철물 부착",
        "preparation": "CT 정밀진단, 디지털 구강스캔, 사전 잇몸·뼈 상태 평가",
        "followup": "식립 후 1주, 1개월, 3개월, 6개월 정기 점검",
      },
      {
        "@type": "MedicalProcedure",
        "name": "치아교정",
        "procedureType": "https://schema.org/TherapeuticProcedure",
        "bodyLocation": "치아 및 치조골",
        "howPerformed": "메탈/세라믹 브라켓 또는 인비절라인 투명교정 장치를 통한 점진적 치아 이동",
        "preparation": "파노라마/세팔로 X-ray, 3D 구강스캔, 부정교합 진단",
        "followup": "매 4-6주 정기 체크업, 교정 종료 후 평생 유지장치 관리",
      },
      {
        "@type": "MedicalProcedure",
        "name": "수면진료 (정맥진정)",
        "procedureType": "https://schema.org/SurgicalProcedure",
        "howPerformed": "마취과 전문의가 정맥진정제를 투여하여 의식하 진정 상태에서 안전하게 진료",
        "preparation": "사전 건강 상태 평가, 8시간 금식, 보호자 동반 권장",
      },
      {
        "@type": "MedicalProcedure",
        "name": "전체임플란트 (All-on-X)",
        "procedureType": "https://schema.org/SurgicalProcedure",
        "bodyLocation": "상악 또는 하악 전체",
        "howPerformed": "4-6개의 임플란트로 전체 무치악 보철 — 디지털 풀아치 시스템",
      },
      {
        "@type": "MedicalProcedure",
        "name": "인비절라인 투명교정",
        "procedureType": "https://schema.org/TherapeuticProcedure",
        "howPerformed": "디지털 3D 시뮬레이션 후 맞춤 제작된 투명 얼라이너를 7-10일마다 교체",
        "preparation": "3D 구강스캔(iTero), ClinCheck 시뮬레이션",
      },
      {
        "@type": "MedicalProcedure",
        "name": "심미치료 (라미네이트·올세라믹)",
        "procedureType": "https://schema.org/TherapeuticProcedure",
        "bodyLocation": "치아 외층",
        "howPerformed": "치아 표면을 미세하게 삭제 후 자체 기공실에서 정밀 제작한 세라믹 보철 부착",
      },
    ],
    // aggregateRating/review 제거 (2026-09-29, PFWE-SPEC §6 — 근거 없는 별점 스키마 금지)
    "sameAs": [
      CLINIC.instagram,
      CLINIC.naverBlog,
      CLINIC.kakao,
      CLINIC.naverBooking,
    ],
    "areaServed": [
      {
        "@type": "GeoCircle",
        "geoMidpoint": { "@type": "GeoCoordinates", "latitude": "37.4482", "longitude": "126.7042" },
        "geoRadius": "15000",
      },
      { "@type": "AdministrativeArea", "name": "인천광역시 남동구" },
      { "@type": "AdministrativeArea", "name": "인천광역시 남동구 구월동" },
      { "@type": "AdministrativeArea", "name": "인천광역시 남동구 간석동" },
      { "@type": "AdministrativeArea", "name": "인천광역시 남동구 만수동" },
      { "@type": "AdministrativeArea", "name": "인천광역시 남동구 논현동" },
      { "@type": "AdministrativeArea", "name": "인천광역시 남동구 서창동" },
      { "@type": "AdministrativeArea", "name": "인천광역시 남동구 고잔동" },
      { "@type": "AdministrativeArea", "name": "인천광역시 남동구 남촌동" },
      { "@type": "AdministrativeArea", "name": "인천광역시 남동구 장수동" },
      { "@type": "AdministrativeArea", "name": "인천광역시 남동구 도림동" },
      { "@type": "AdministrativeArea", "name": "인천광역시 남동구 운연동" },
      { "@type": "AdministrativeArea", "name": "인천광역시 미추홀구 주안동" },
      { "@type": "AdministrativeArea", "name": "인천광역시 미추홀구 관교동" },
      { "@type": "AdministrativeArea", "name": "인천광역시 연수구 청학동" },
      { "@type": "AdministrativeArea", "name": "인천광역시 연수구 연수동" },
      { "@type": "AdministrativeArea", "name": "인천광역시 연수구 송도동" },
      { "@type": "AdministrativeArea", "name": "인천광역시 부평구 부평동" },
      { "@type": "AdministrativeArea", "name": "인천광역시 부평구 십정동" },
      { "@type": "AdministrativeArea", "name": "인천광역시 서구 검암동" },
      { "@type": "AdministrativeArea", "name": "인천광역시 계양구 계양동" },
    ],
    "slogan": MESSAGING.brandSlogan,
    "knowsAbout": [
      "임플란트", "전체임플란트", "디지털풀아치", "전체 치아 복원 임플란트", "치아교정", "인비절라인",
      "인비절라인 투명교정", "인비절라인 인증의", "인천 인비절라인", "투명교정",
      "오스템 임플란트", "오스템 SOI", "스트라우만 임플란트", "스트라우만 BLX", "메가젠 임플란트", "메가젠 AnyRidge",
      "수면진료", "무통마취", "심미치료", "충치치료", "신경치료",
      "소아치과", "자체기공실", "즉시로딩", "MUA", "네비게이션 가이드 수술",
      "인천치과", "구월동치과", "남동구치과", "인천임플란트", "인천치아교정",
      "인천수면치과", "인천야간치과", "인천소아치과", "인천전체임플란트", "인천투명교정",
      "간석동치과", "간석동임플란트", "만수동치과", "만수동임플란트", "논현동치과", "논현동임플란트",
      "서창동치과", "고잔동치과", "남촌동치과", "장수동치과", "도림동치과", "운연동치과",
      "주안동치과", "주안역치과", "관교동치과", "청학동치과", "연수동치과", "송도치과",
      "부평치과", "부평역치과", "십정동치과", "검암동치과", "계양구치과", "미추홀구치과", "연수구치과",
    ],
    // speakable 은 페이지(WebPage)별 스키마에서 실제 DOM 셀렉터로 지정 (전역 Dentist 에서 제거, 2026-09-29)
    // ContactPoint — multiple channels
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "telephone": "+82-32-432-0365",
        "contactType": "reservations",
        "availableLanguage": ["Korean", "English"],
        "areaServed": "KR",
        "hoursAvailable": {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
          "opens": "10:00",
          "closes": "21:00"
        }
      },
      {
        "@type": "ContactPoint",
        "url": "https://pf.kakao.com/_dMsCT",
        "contactType": "customer service",
        "availableLanguage": "Korean",
        "contactOption": "TollFree"
      },
      {
        "@type": "ContactPoint",
        "url": "https://booking.naver.com/booking/13/bizes/426166",
        "contactType": "reservations",
        "availableLanguage": "Korean"
      }
    ],
    // Member doctors
    "employee": DOCTORS.map(d => ({
      "@type": "Physician",
      "@id": `https://seoul365dc.kr/doctors/${d.slug}#physician`,
      "name": d.name,
      "jobTitle": d.title,
    })),
    // Potential reservation action
    "potentialAction": [
      {
        "@type": "ReserveAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://seoul365dc.kr/reservation",
          "inLanguage": "ko",
          "actionPlatform": ["http://schema.org/DesktopWebPlatform", "http://schema.org/MobileWebPlatform"]
        },
        "result": { "@type": "Reservation", "name": "치과 상담 예약" }
      },
      {
        "@type": "CommunicateAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "tel:032-432-0365"
        }
      }
    ],
    // Accessibility & amenity
    "amenityFeature": [
      { "@type": "LocationFeatureSpecification", "name": "주차장", "value": true },
      { "@type": "LocationFeatureSpecification", "name": "엘리베이터", "value": true },
      { "@type": "LocationFeatureSpecification", "name": "무료 Wi-Fi", "value": true },
      { "@type": "LocationFeatureSpecification", "name": "카드결제", "value": true },
      { "@type": "LocationFeatureSpecification", "name": "분할결제", "value": true },
    ],
    "isAcceptingNewPatients": true,
    "hasCredential": [
      { "@type": "EducationalOccupationalCredential", "credentialCategory": "의료기관 개설 허가", "recognizedBy": { "@type": "Organization", "name": "보건복지부" } }
    ],
  };

  // 별도 Organization(#organization) 노드 제거 — 병원 엔티티는 #dentist 하나로 통일 (2026-09-29)

  // SiteNavigationElement — helps search engines understand site structure
  const navigationSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": "https://seoul365dc.kr/#navigation",
    "name": "서울365치과 사이트 메뉴",
    "itemListElement": [
      { "@type": "SiteNavigationElement", "position": 1, "name": "홈", "url": "https://seoul365dc.kr" },
      { "@type": "SiteNavigationElement", "position": 2, "name": "진료안내", "url": "https://seoul365dc.kr/treatments" },
      { "@type": "SiteNavigationElement", "position": 3, "name": "의료진", "url": "https://seoul365dc.kr/doctors" },
      { "@type": "SiteNavigationElement", "position": 4, "name": "치료사례", "url": "https://seoul365dc.kr/cases/gallery" },
      { "@type": "SiteNavigationElement", "position": 5, "name": "블로그", "url": "https://seoul365dc.kr/blog" },
      { "@type": "SiteNavigationElement", "position": 6, "name": "FAQ", "url": "https://seoul365dc.kr/faq" },
      { "@type": "SiteNavigationElement", "position": 7, "name": "인비절라인", "url": "https://seoul365dc.kr/treatments/invisalign" },
      { "@type": "SiteNavigationElement", "position": 8, "name": "내원안내", "url": "https://seoul365dc.kr/info" },
      { "@type": "SiteNavigationElement", "position": 9, "name": "상담예약", "url": "https://seoul365dc.kr/reservation" },
    ]
  };

  // MedicalBusiness schema — supplementary medical-specific markup
  const medicalBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    "@id": "https://seoul365dc.kr/#medical-business",
    "name": "서울365치과의원",
    "url": "https://seoul365dc.kr",
    "telephone": "+82-32-432-0365",
    "isAcceptingNewPatients": true,
    "medicalSpecialty": [
      { "@type": "MedicalSpecialty", "name": "Dentistry" },
      { "@type": "MedicalSpecialty", "name": "Implantology" },
      { "@type": "MedicalSpecialty", "name": "Orthodontics" },
      { "@type": "MedicalSpecialty", "name": "Prosthodontics" },
      { "@type": "MedicalSpecialty", "name": "Endodontics" },
      { "@type": "MedicalSpecialty", "name": "Pediatric Dentistry" },
      { "@type": "MedicalSpecialty", "name": "Cosmetic Dentistry" },
    ],
    "availableService": [
      { "@type": "MedicalTherapy", "name": "임플란트", "medicineSystem": "WesternConventional" },
      { "@type": "MedicalTherapy", "name": "치아교정", "medicineSystem": "WesternConventional" },
      { "@type": "MedicalTherapy", "name": "인비절라인 투명교정", "medicineSystem": "WesternConventional" },
      { "@type": "MedicalTherapy", "name": "수면진료", "medicineSystem": "WesternConventional" },
      { "@type": "MedicalTherapy", "name": "신경치료", "medicineSystem": "WesternConventional" },
      { "@type": "MedicalTherapy", "name": "심미치료", "medicineSystem": "WesternConventional" },
      { "@type": "MedicalTherapy", "name": "소아치과", "medicineSystem": "WesternConventional" },
      { "@type": "MedicalTherapy", "name": "무통마취", "medicineSystem": "WesternConventional" },
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "서울365치과 진료 서비스",
      "itemListElement": [
        { "@type": "OfferCatalog", "name": "임플란트 센터", "itemListElement": [
          { "@type": "Offer", "itemOffered": { "@type": "MedicalProcedure", "name": "전체임플란트" } },
          { "@type": "Offer", "itemOffered": { "@type": "MedicalProcedure", "name": "디지털풀아치 임플란트" } },
          { "@type": "Offer", "itemOffered": { "@type": "MedicalProcedure", "name": "일반 임플란트" } },
        ] },
        { "@type": "OfferCatalog", "name": "교정 센터", "itemListElement": [
          { "@type": "Offer", "itemOffered": { "@type": "MedicalProcedure", "name": "인비절라인" } },
          { "@type": "Offer", "itemOffered": { "@type": "MedicalProcedure", "name": "성인교정" } },
          { "@type": "Offer", "itemOffered": { "@type": "MedicalProcedure", "name": "소아교정" } },
        ] },
      ]
    },
  };

  // Brand schema — brand identity
  const brandSchema = {
    "@context": "https://schema.org",
    "@type": "Brand",
    "@id": "https://seoul365dc.kr/#brand",
    "name": "서울365치과",
    "alternateName": ["Seoul 365 Dental", "서울삼육오치과"],
    "logo": "https://seoul365dc.kr/static/logo-v2.png",
    "slogan": MESSAGING.brandSlogan,
    "description": MISSION,
    "url": "https://seoul365dc.kr",
  };

  // Event schema — special promotions/ongoing service
  const eventSchema = {
    "@context": "https://schema.org",
    "@type": "Event",
    "@id": "https://seoul365dc.kr/#ct-event",
    "name": "서울365치과 CT 정밀진단 이벤트",
    "description": "첫 내원 시 CT 촬영으로 정밀 진단을 받아보세요. 서울대 출신 5인 전문의가 직접 진단합니다.",
    "startDate": "2026-01-01",
    "endDate": "2026-12-31",
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "eventStatus": "https://schema.org/EventScheduled",
    "location": {
      "@type": "Place",
      "name": "서울365치과의원",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "예술로 138 이토타워 2층 212호",
        "addressLocality": "인천광역시 남동구",
        "addressCountry": "KR",
      }
    },
    "organizer": { "@id": "https://seoul365dc.kr/#dentist" },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "KRW",
      "availability": "https://schema.org/InStock",
      "url": "https://seoul365dc.kr/reservation",
      "validFrom": "2026-01-01",
    },
    "isAccessibleForFree": true,
  };

  // MedicalClinic schema — emphasizes clinical facility info
  const medicalClinicSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    "@id": "https://seoul365dc.kr/#clinic",
    "name": "서울365치과의원",
    "url": "https://seoul365dc.kr",
    "telephone": "+82-32-432-0365",
    "medicalSpecialty": ["Dentistry", "Implantology", "Orthodontics"],
    "availableService": [
      { "@type": "MedicalTest", "name": "CT 정밀진단", "usesDevice": { "@type": "MedicalDevice", "name": "Cone Beam CT" } },
      { "@type": "MedicalTest", "name": "디지털 구강스캔", "usesDevice": { "@type": "MedicalDevice", "name": "3Shape TRIOS 구강스캐너" } },
      { "@type": "MedicalTest", "name": "파노라마 촬영", "usesDevice": { "@type": "MedicalDevice", "name": "디지털 파노라마" } },
    ],
    "department": [
      { "@type": "MedicalClinic", "name": "임플란트 센터", "medicalSpecialty": "Implantology" },
      { "@type": "MedicalClinic", "name": "교정 센터", "medicalSpecialty": "Orthodontics" },
      { "@type": "MedicalClinic", "name": "심미치료 센터", "medicalSpecialty": "Cosmetic Dentistry" },
      { "@type": "MedicalClinic", "name": "소아치과", "medicalSpecialty": "Pediatric Dentistry" },
      { "@type": "MedicalClinic", "name": "수면진료센터" },
      { "@type": "MedicalClinic", "name": "자체 기공실" },
    ],
    "smokingAllowed": false,
    "isAcceptingNewPatients": true,
  };

  // HealthTopicContent — AEO important
  const healthTopicSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    "@id": "https://seoul365dc.kr/#health-topics",
    "about": [
      { "@type": "MedicalCondition", "name": "치아 상실", "possibleTreatment": { "@type": "MedicalProcedure", "name": "임플란트" } },
      { "@type": "MedicalCondition", "name": "부정교합", "possibleTreatment": [{ "@type": "MedicalProcedure", "name": "인비절라인 투명교정" }, { "@type": "MedicalProcedure", "name": "치아교정" }] },
      { "@type": "MedicalCondition", "name": "치과 공포증", "possibleTreatment": { "@type": "MedicalProcedure", "name": "수면진료" } },
      { "@type": "MedicalCondition", "name": "충치", "possibleTreatment": { "@type": "MedicalProcedure", "name": "보존치료" } },
      { "@type": "MedicalCondition", "name": "치수염", "possibleTreatment": { "@type": "MedicalProcedure", "name": "신경치료" } },
      { "@type": "MedicalCondition", "name": "치아 변색", "possibleTreatment": { "@type": "MedicalProcedure", "name": "심미치료" } },
    ],
    "specialty": "Dentistry",
    "inLanguage": "ko-KR",
  };

  return (
    <html lang="ko" dir="ltr">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />

        {/* === PRIMARY SEO META === */}
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <meta name="keywords" content={metaKeywords} />
        {/* 등장 연출 게이트: 동작 줄이기가 아니고 IntersectionObserver 가 있으면 html.mx — CSS 는 이때만 숨김 시작(크롤러·JS 꺼짐은 전부 보임) */}
        <script dangerouslySetInnerHTML={{ __html: "(function(){try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches&&'IntersectionObserver' in window)document.documentElement.classList.add('mx')}catch(e){}})();" }} />
        {emitCanonical && <link rel="canonical" href={canonicalUrl} />}
        {/* v8: noindex prop — admin/login/register 등 비공개 페이지는 색인 차단 (크롤 버짓 절약) */}
        {/* noindexFollow — 얇은 상세(백과 용어·치료사례 등): 색인 제외하되 링크는 따라가게 (2026-09-29) */}
        <meta name="robots" content={noindex ? 'noindex, nofollow' : noindexFollow ? 'noindex, follow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'} />
        <meta name="googlebot" content={noindex ? 'noindex, nofollow' : noindexFollow ? 'noindex, follow' : 'index, follow'} />
        {lastModified && <meta name="date" content={lastModified} />}
        {lastModified && <meta property="article:modified_time" content={lastModified} />}

        {/* === LANGUAGE & GEO (v7: hreflang 정밀화) ===
            hreflang은 "같은 콘텐츠의 언어 버전" 간에만 상호 선언해야 함.
            전 페이지에 /en·/zh를 선언하면 비대응 페이지 신호 오염 → 홈·다국어 페이지에서만 클러스터 선언 */}
        <meta http-equiv="content-language" content="ko-KR" />
        {/* raw() 사용 이유: Hono JSX는 동일 href <link>를 dedup하므로 canonical과 같은 href인
            ko-KR/x-default hreflang이 제거됨 → raw HTML로 우회 */}
        {emitCanonical && raw(`<link rel="alternate" hreflang="ko-KR" href="${canonicalUrl}" />`)}
        {(canonicalUrl === 'https://seoul365dc.kr' || canonicalUrl === 'https://seoul365dc.kr/' || canonicalUrl === 'https://seoul365dc.kr/en' || canonicalUrl === 'https://seoul365dc.kr/zh' || canonicalUrl === 'https://seoul365dc.kr/ru') && raw(`<link rel="alternate" hreflang="ko" href="https://seoul365dc.kr" /><link rel="alternate" hreflang="en" href="https://seoul365dc.kr/en" /><link rel="alternate" hreflang="zh-CN" href="https://seoul365dc.kr/zh" /><link rel="alternate" hreflang="ru" href="https://seoul365dc.kr/ru" />`)}
        {emitCanonical && raw(`<link rel="alternate" hreflang="x-default" href="${canonicalUrl}" />`)}
        <meta name="geo.region" content="KR-28" />
        <meta name="geo.placename" content="인천 남동구 구월동" />
        <meta name="geo.position" content="37.4482;126.7042" />
        <meta name="ICBM" content="37.4482, 126.7042" />

        {/* === THEME & ICONS === */}
        <meta name="theme-color" content="#0B1530" />
        <meta name="msapplication-TileColor" content="#0B1530" />
        <meta name="apple-mobile-web-app-title" content="서울365치과" />
        <link rel="icon" href="/favicon.ico?v=fav20261014" sizes="any" />
        <link rel="icon" type="image/png" sizes="48x48" href="/favicon-48.png?v=fav20261014" />
        <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96.png?v=fav20261014" />
        <link rel="icon" type="image/png" sizes="192x192" href="/favicon-192.png?v=fav20261014" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png?v=fav20261014" />

        {/* === OPEN GRAPH === */}
        <meta property="og:type" content={resolvedOgType} />
        <meta property="og:site_name" content="서울365치과의원" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={ogImage} />
        {ogSize && <meta property="og:image:width" content={String(ogSize[0])} />}
        {ogSize && <meta property="og:image:height" content={String(ogSize[1])} />}
        <meta property="og:image:alt" content={ogImageAlt || pageTitle} />
        <meta property="og:locale" content="ko_KR" />
        {/* Article-specific OG tags (blog posts, cases) */}
        {resolvedOgType === 'article' && datePublished && <meta property="article:published_time" content={datePublished} />}
        {resolvedOgType === 'article' && lastModified && <meta property="article:modified_time" content={lastModified} />}
        {resolvedOgType === 'article' && articleSection && <meta property="article:section" content={articleSection} />}
        {resolvedOgType === 'article' && <meta property="article:author" content="서울365치과의원" />}
        {resolvedOgType === 'article' && articleTags && (articleTags as string[]).map((tag: string) => <meta property="article:tag" content={tag} />)}

        {/* === TWITTER/X === */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDesc} />
        <meta name="twitter:image" content={ogImage} />
        <meta name="twitter:image:alt" content={pageTitle} />

        {/* === NAVER VERIFICATION === */}
        {naverVerify && <meta name="naver-site-verification" content={naverVerify} />}

        {/* === GOOGLE SEARCH CONSOLE VERIFICATION === */}
        {googleVerify && <meta name="google-site-verification" content={googleVerify} />}

        {/* === BING WEBMASTER TOOLS VERIFICATION === */}
        {bingVerify && <meta name="msvalidate.01" content={bingVerify} />}

        {/* === GOOGLE TAG MANAGER (HEAD) === */}
        {gtmId && <script dangerouslySetInnerHTML={{__html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`}} />}

        {/* === GOOGLE ANALYTICS 4 === */}
        {ga4Id && <>
          <script async src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`}></script>
          <script dangerouslySetInnerHTML={{__html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${ga4Id}',{page_title:document.title,page_location:window.location.href,cookie_flags:'SameSite=None;Secure',anonymize_ip:true,send_page_view:true});`}} />
        </>}

        {/* PF Web Engine 1st-party 비콘 */}
        <script defer src="https://pf-dashboard-2nt.pages.dev/beacon.js"></script>

        {/* === PRECONNECT (Core Web Vitals LCP 최적화) === */}
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin />
        <link rel="preconnect" href="https://cdnjs.cloudflare.com" crossorigin />
        <link rel="dns-prefetch" href="https://cdn.jsdelivr.net" />
        <link rel="dns-prefetch" href="https://www.youtube-nocookie.com" />
        <link rel="dns-prefetch" href="https://www.google.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://booking.naver.com" />
        <link rel="dns-prefetch" href="https://pf.kakao.com" />

        {/* === 🚀 v2: SEO Resource Hints — 검색엔진 크롤러용 === */}
        <link rel="alternate" type="application/rss+xml" title="서울365치과 블로그 RSS" href="/blog/rss.xml" />
        <link rel="alternate" type="application/atom+xml" title="서울365치과 블로그 Atom" href="/blog/atom.xml" />
        <link rel="alternate" type="application/feed+json" title="서울365치과 블로그 JSON Feed" href="/feed.json" />

        {/* === FONTS (2026-11-04: 제목 Paperlogy · 숫자 Geist Mono 는 style.css 의 @font-face, 여기서는 첫 화면용 두 파일만 preload) === */}
        <link rel="preload" href="https://cdn.jsdelivr.net/gh/projectnoonnu/2408-3@1.0/Paperlogy-7Bold.woff2" as="font" type="font/woff2" crossorigin />
        <link rel="preload" href="https://cdn.jsdelivr.net/npm/geist@1.3.1/dist/fonts/geist-mono/GeistMono-Variable.woff2" as="font" type="font/woff2" crossorigin />
        <link rel="preload" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css" as="style" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css" media="print" onload="this.media='all'" />

        {/* === CSS LIBS (FontAwesome — 하위페이지 아이콘용, non-blocking) === */}
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet" media="print" onload="this.media='all'" />
        <noscript><link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet" /></noscript>

        {/* === MAIN STYLESHEET (Tailwind + custom, built at compile time) === */}
        <link href={`/static/style.css?v=${__STYLE_CSS_V__}`} rel="stylesheet" />
        {isHome && <link href={`/static/immersive.css?v=${__IMMERSIVE_CSS_V__}`} rel="stylesheet" />}

        {/* Microsoft Clarity — 반드시 스타일시트 뒤(2026-10-31). 앞에 두면 clarity.js 가 CSS 적용 전 화면을 읽어
            CSS 없는 배치를 한 번 계산하게 되고, 그 뒤 CSS 가 적용되며 전체가 움직인 것으로 잡혀 PC CLS 가 1.0 까지 올랐다.
            스타일시트 뒤의 인라인 스크립트는 CSS 로드가 끝날 때까지 실행되지 않는다. */}
        <script dangerouslySetInnerHTML={{ __html: '(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","yc83itfgmi");' }} />

        {/* === STRUCTURED DATA (JSON-LD) === */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(websiteSchema)}} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(dentistSchema)}} />
        {jsonLd && (Array.isArray(jsonLd)
          ? jsonLd.map((ld: any) => <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(ld).replace(/</g, '\\u003c')}} />)
          : <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd).replace(/</g, '\\u003c')}} />
        )}
      </head>
      <body class="antialiased">

        {/* === GTM NOSCRIPT FALLBACK === */}
        {gtmId && <noscript><iframe src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`} height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>}

        {/* === SKIP NAVIGATION (접근성) === */}
        <a href="#main-content" class="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:bg-white focus:px-4 focus:py-2 focus:rounded-lg focus:shadow-lg focus:text-primary focus:font-semibold">
          메인 콘텐츠로 바로가기
        </a>

        {/* === SCROLL PROGRESS === */}
        <div id="scroll-progress" class="scroll-progress" aria-hidden="true"></div>

        {/* === HEADER === */}
        <header id="main-header" class="site-head" role="banner">
          <div class="site-head-in">
            <a href="/" class="brand" aria-label="서울365치과 홈으로 이동">
              <span class="brand-mark"><img src="/static/logo-v2.png" alt="" width="174" height="180" decoding="async" /></span>
              <span class="brand-text"><span class="brand-ko">서울365치과</span><span class="brand-en">SEOUL 365 DENTAL</span></span>
            </a>

            <nav class="nav" aria-label="메인 네비게이션">
              <ul>
                {NAV.map(n => (
                  <li><a href={n.href} aria-current={reqPath === n.href || reqPath.startsWith(n.href + '/') ? 'page' : undefined}>{n.label}</a></li>
                ))}
              </ul>
            </nav>

            <div class="head-actions">
              <span class={`status-chip head-only${todayHours.open ? ' is-open' : ''}`} id="clinic-status-badge" data-status><span class="dot" aria-hidden="true"></span><span class="txt">{todayHours.text}</span></span>
              <a href={CLINIC.phoneTel} class="head-tel" aria-label="전화 상담 032-432-0365"><Icon name="phone" />{CLINIC.phone}</a>
              {/* Auth — app.js 가 로그인 상태에 따라 토글 */}
              <div id="auth-nav" class="head-auth">
                <a href="/login" id="auth-login-btn">로그인</a>
                <a href="/register" id="auth-register-btn">회원가입</a>
              </div>
              <div id="auth-user" class="head-auth hidden">
                <span id="auth-user-name"></span>
                <button id="auth-logout-btn" type="button" aria-label="로그아웃"><Icon name="logout" size={16} /></button>
              </div>
              <a href="/reservation" class="btn btn-primary btn-sm head-cta"><Icon name="calendar" />예약하기</a>
              <button id="mobile-menu-btn" class="burger" type="button" aria-label="메뉴 열기" aria-expanded="false" aria-controls="mobile-menu"><span></span><span></span><span></span></button>
            </div>
          </div>

          {/* 모바일 드로어 */}
          <div id="mobile-menu" class="drawer" hidden role="navigation" aria-label="모바일 네비게이션">
            <div class="drawer-top">
              <span class={`status-chip${todayHours.open ? ' is-open' : ''}`} id="mobile-clinic-status" data-status><span class="dot" aria-hidden="true"></span><span class="txt">{todayHours.text}</span></span>
              <a href={CLINIC.phoneTel}>{CLINIC.phone}</a>
            </div>
            <ul class="drawer-list">
              <li><a href="/"><span>홈</span><span class="mono">HOME</span></a></li>
              {NAV.map(n => (
                <li><a href={n.href}><span>{n.label}</span><span class="mono">{n.en}</span></a></li>
              ))}
            </ul>
            <div class="drawer-hours">
              {HOURS.map(h => (<><span>{h.day}</span><span class="mono">{h.time}</span></>))}
            </div>
            <div class="drawer-cta">
              <a href="/reservation" class="btn btn-primary"><Icon name="calendar" />예약하기</a>
              <a href={CLINIC.phoneTel} class="btn btn-light"><Icon name="phone" />전화 상담</a>
            </div>
            <div id="mobile-auth-nav" class="drawer-auth"><a href="/login">로그인</a><a href="/register">회원가입</a></div>
            <div id="mobile-auth-user" class="drawer-auth hidden"><span id="mobile-user-name"></span><button id="mobile-logout-btn" type="button">로그아웃</button></div>
          </div>
        </header>

        {/* === MAIN CONTENT === */}
        <main id="main-content" role="main">{children}</main>

        {/* === FOOTER === */}
        <footer class="foot" role="contentinfo">
          <div class="foot-in">
            <div class="foot-top">
              <div>
                <a href="/" class="brand" aria-label="서울365치과 홈">
                  <span class="brand-mark"><img src="/static/logo-v2.png" alt="" width="174" height="180" loading="lazy" decoding="async" /></span>
                  <span class="brand-text"><span class="brand-ko">서울365치과</span><span class="brand-en">SEOUL 365 DENTAL</span></span>
                </a>
                <p class="foot-slogan">{MESSAGING.brandSlogan}</p>
                <p>서울대 출신 5인 원장 · 365일 진료 · 자체 기공실</p>
                <p>{CLINIC.address}<br />{CLINIC.nearStation}</p>
                <div class="foot-social">
                  <a href={CLINIC.instagram} target="_blank" rel="noopener noreferrer nofollow" aria-label="Instagram에서 서울365치과 보기"><Icon name="instagram" /></a>
                  <a href={CLINIC.naverBlog} target="_blank" rel="noopener noreferrer nofollow" aria-label="네이버 블로그에서 서울365치과 보기"><NaverMark size={15} /></a>
                  <a href={CLINIC.kakao} target="_blank" rel="noopener noreferrer nofollow" aria-label="카카오톡으로 서울365치과 상담하기"><KakaoMark size={17} /></a>
                  <a href={CLINIC.naverBooking} target="_blank" rel="noopener noreferrer nofollow" aria-label="네이버 예약"><Icon name="calendar" /></a>
                </div>
              </div>

              <nav aria-label="진료 메뉴">
                <span class="foot-h" role="heading" aria-level="3">진료</span>
                <ul>
                  {[
                    { name: '전체임플란트', slug: 'full-implant' },
                    { name: '임플란트', slug: 'implant' },
                    { name: '치아교정', slug: 'orthodontics' },
                    { name: '인비절라인', slug: 'invisalign' },
                    { name: '수면진료', slug: 'sedation' },
                    { name: '심미치료', slug: 'cosmetic' },
                  ].map(t => (<li><a href={`/treatments/${t.slug}`}>{t.name}</a></li>))}
                  {/* 2026-09-29: 링크가 거의 없던 응급·야간 진료 안내 페이지 연결 */}
                  <li><a href="/emergency">응급 진료</a></li>
                  <li><a href="/night-clinic">야간 진료</a></li>
                </ul>
              </nav>

              <nav aria-label="안내 메뉴">
                <span class="foot-h" role="heading" aria-level="3">안내</span>
                <ul>
                  <li><a href="/doctors">의료진</a></li>
                  <li><a href="/info">내원안내</a></li>
                  <li><a href="/blog">블로그</a></li>
                  <li><a href="/faq">FAQ</a></li>
                  <li><a href="/prices">가격표</a></li>
                  <li><a href="/answers">자주 묻는 질문 직답</a></li>
                  <li><a href="/encyclopedia">치과 백과사전</a></li>
                  <li><a href="/why-us">서울365를 선택하는 이유</a></li>
                </ul>
              </nav>

              <div>
                <span class="foot-h" role="heading" aria-level="3">진료시간</span>
                <div class="foot-hours">
                  {HOURS.map(h => (
                    <div><span>{h.day}</span><span class="mono">{h.time}</span></div>
                  ))}
                  <span class="cont"><Icon name="clock" size={14} />점심시간 없이 연속 진료</span>
                </div>
              </div>
            </div>

            {/* 사업자 정보 */}
            <div class="foot-legal">
              <p><span>서울365치과의원</span><span>대표자 박준규</span><span>사업자등록번호 395-37-00559</span><span>개업일 2019.05.01</span><span>업태 보건업 및 사회복지서비스업</span><span>종목 치과의원</span></p>
              <p><span>소재지 {CLINIC.address}</span><span>전화 {CLINIC.phone}</span><span>이메일 seoul365dental@gmail.com</span></p>
            </div>

            {/* 지역 SEO 내부링크 */}
            <nav class="foot-areas" aria-label="인천 지역별 치과 안내">
              <p>서울365치과 인근 지역 안내</p>
              <div>
                {/* 구월동 = "구월동 치과" 허브(정확 앵커), 허브 자신에서는 자기 링크 생략 (2026-10-08) */}
                {AREAS.filter(a => !(a.slug === 'guwol-dong' && canonicalUrl === 'https://seoul365dc.kr/area/guwol-dong')).map(a => (
                  <a href={`/area/${a.slug}`}>{a.slug === 'guwol-dong' ? '구월동 치과' : `${a.name}치과`}</a>
                ))}
                <a href="/area">전체 지역 보기 →</a>
              </div>
            </nav>

            <div class="foot-bottom">
              <span>&copy; 2019-{currentYear} 서울365치과의원. All rights reserved.</span>
              <span>
                <a href="/privacy">개인정보처리방침</a>
                <a href="/terms">이용약관</a>
                <a href="/consultations/check">문의 답변 확인</a>
                <a href="/sitemap.xml">사이트맵</a>
              </span>
            </div>
          </div>
        </footer>

        {/* === MOBILE BOTTOM BAR === */}
        <nav class="mbar mobile-cta-bar" aria-label="빠른 연락">
          <a href={CLINIC.phoneTel} aria-label="전화 상담"><Icon name="phone" /><span>전화</span></a>
          <a href={CLINIC.kakao} target="_blank" rel="noopener noreferrer nofollow" aria-label="카카오톡 상담"><KakaoMark size={21} /><span>카카오톡</span></a>
          <a href="/reservation" class="mbar-primary" aria-label="상담 예약하기"><Icon name="calendar" /><span>예약</span></a>
          <a href={CLINIC.naverBlog} class="mbar-naver" target="_blank" rel="noopener noreferrer" aria-label="네이버 블로그"><NaverMark size={19} /><span>블로그</span></a>
          <a href="/info#directions" aria-label="오시는 길 안내"><Icon name="pin" /><span>길찾기</span></a>
        </nav>

        {/* === DESKTOP FLOATING === */}
        <div class="fab-col" aria-label="빠른 연락 버튼">
          <a href={CLINIC.naverBlog} class="fab fab-naver" target="_blank" rel="noopener noreferrer" aria-label="네이버 블로그 바로가기"><NaverMark size={18} /></a>
          <a href={CLINIC.kakao} class="fab fab-kakao" target="_blank" rel="noopener noreferrer nofollow" aria-label="카카오톡 상담"><KakaoMark size={20} /></a>
          <a href={CLINIC.phoneTel} class="fab fab-phone" aria-label="전화 상담 032-432-0365"><Icon name="phone" /></a>
          <button type="button" class="fab fab-top" id="fab-top" aria-label="페이지 맨 위로 이동"><Icon name="arrowUp" /></button>
        </div>

        {/* === SCRIPTS === */}
        <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js" defer></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js" defer></script>
        <script src={`/static/app.js?v=${__APP_JS_V__}`} defer></script>
        {isHome && <script src={`/static/immersive.js?v=${__IMMERSIVE_JS_V__}`} defer></script>}
      </body>
    </html>
  )
})
