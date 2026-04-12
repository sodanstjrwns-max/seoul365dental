import { jsxRenderer } from 'hono/jsx-renderer'
import { CLINIC, HOURS } from './data/clinic'
import { MESSAGING } from './data/brand'

// SEO/AEO Optimized Renderer — v3.0
// - Rich Schema.org (Dentist + MedicalOrganization + WebSite + Speakable)
// - Complete OG + Twitter meta
// - Dynamic GA4/GTM/Search Console/Naver/Bing integration
// - Semantic HTML, Accessibility, AEO

// Global SEO settings cache (set by middleware in index.tsx)
let _currentSeoSettings: Record<string, string> = {};
export function setCurrentSeoSettings(s: Record<string, string>) { _currentSeoSettings = s; }

export const renderer = jsxRenderer(({ children, title, description, canonical, jsonLd }) => {
  const pageTitle = title || `서울365치과 | 인천 구월동 임플란트·인비절라인·교정·수면진료 365일 야간진료`;
  const pageDesc = description || `인천 구월동 서울365치과. 서울대 출신 5인 원장 협진, 365일·야간21시 진료. 임플란트·인비절라인 투명교정·수면진료 전문. 032-432-0365`;
  const canonicalUrl = canonical || 'https://seoul365dc.kr';
  const ogImage = 'https://seoul365dc.kr/static/og-image.png';

  // Dynamic SEO/Analytics settings (from DB or env via global cache)
  const seo = _currentSeoSettings || {};
  const ga4Id = seo.GA4_MEASUREMENT_ID || '';
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
    "copyrightYear": "2019",
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
    "logo": "https://seoul365dc.kr/static/logo-v2.png",
    "priceRange": "₩₩~₩₩₩",
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
      "latitude": "37.4482",
      "longitude": "126.7042",
    },
    "hasMap": "https://www.google.com/maps?q=37.4482,126.7042",
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
      { "@type": "MedicalProcedure", "name": "임플란트", "procedureType": "SurgicalProcedure" },
      { "@type": "MedicalProcedure", "name": "치아교정", "procedureType": "NonSurgicalProcedure" },
      { "@type": "MedicalProcedure", "name": "수면진료", "procedureType": "SurgicalProcedure" },
      { "@type": "MedicalProcedure", "name": "전체임플란트", "procedureType": "SurgicalProcedure" },
      { "@type": "MedicalProcedure", "name": "인비절라인", "procedureType": "NonSurgicalProcedure" },
      { "@type": "MedicalProcedure", "name": "심미치료", "procedureType": "NonSurgicalProcedure" },
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "bestRating": "5",
      "ratingCount": "2150",
      "reviewCount": "1840",
    },
    "review": [
      {
        "@type": "Review",
        "reviewRating": { "@type": "Rating", "ratingValue": "5" },
        "author": { "@type": "Person", "name": "김O영" },
        "reviewBody": "스케일링부터 임플란트까지, 자세한 설명과 친절한 진료에 늘 감사드립니다. 365일 진료라 바쁜 직장인에게 최고입니다.",
      },
      {
        "@type": "Review",
        "reviewRating": { "@type": "Rating", "ratingValue": "5" },
        "author": { "@type": "Person", "name": "이O수" },
        "reviewBody": "전체임플란트 수술 받았습니다. 수면진료라 전혀 무섭지 않았고, 자체 기공실이 있어서 보철물 맞춤이 정말 빠르고 정확했습니다.",
      },
    ],
    "sameAs": [
      CLINIC.instagram,
      CLINIC.naverBlog,
      CLINIC.kakao,
      CLINIC.naverBooking,
    ],
    "areaServed": {
      "@type": "GeoCircle",
      "geoMidpoint": { "@type": "GeoCoordinates", "latitude": "37.4482", "longitude": "126.7042" },
      "geoRadius": "15000",
    },
    "slogan": MESSAGING.brandSlogan,
    "knowsAbout": [
      "임플란트", "전체임플란트", "디지털풀아치", "전체 치아 복원 임플란트", "치아교정", "인비절라인",
      "인비절라인 투명교정", "인비절라인 인증의", "인천 인비절라인", "투명교정",
      "수면진료", "무통마취", "심미치료", "충치치료", "신경치료",
      "소아치과", "자체기공실", "즉시로딩", "MUA",
      "인천치과", "구월동치과", "남동구치과", "인천임플란트", "인천치아교정",
      "인천수면치과", "인천야간치과", "인천소아치과", "인천전체임플란트", "인천투명교정",
    ],
    // Speakable for AEO (AI engines extracting quick answers)
    "speakable": {
      "@type": "SpeakableSpecification",
      "cssSelector": ["h1", ".hero-sub", ".section-headline", "[itemprop='name']", "[itemprop='text']"],
    },
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
    "employee": [
      { "@type": "Physician", "@id": "https://seoul365dc.kr/doctors/park-junkyu#physician", "name": "박준규", "jobTitle": "대표원장" },
      { "@type": "Physician", "@id": "https://seoul365dc.kr/doctors/choi-dabin#physician", "name": "최다빈", "jobTitle": "원장" },
      { "@type": "Physician", "@id": "https://seoul365dc.kr/doctors/jung-moonhee#physician", "name": "정문희", "jobTitle": "원장" },
      { "@type": "Physician", "@id": "https://seoul365dc.kr/doctors/sang-sehoon#physician", "name": "상세훈", "jobTitle": "원장" },
      { "@type": "Physician", "@id": "https://seoul365dc.kr/doctors/ha-nuri#physician", "name": "하누리", "jobTitle": "원장" },
    ],
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
    "parentOrganization": { "@type": "Organization", "name": "서울365치과의원" },
  };

  // Organization schema (supplementary corporate identity)
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://seoul365dc.kr/#organization",
    "name": "서울365치과의원",
    "url": "https://seoul365dc.kr",
    "logo": {
      "@type": "ImageObject",
      "url": "https://seoul365dc.kr/static/logo-v2.png",
      "width": 512,
      "height": 512
    },
    "image": ogImage,
    "sameAs": [
      CLINIC.instagram,
      CLINIC.naverBlog,
      CLINIC.kakao,
      CLINIC.naverBooking,
    ],
    "founder": { "@type": "Person", "name": "박준규" },
    "foundingDate": "2019",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+82-32-432-0365",
      "contactType": "customer service",
      "availableLanguage": ["Korean", "English"]
    }
  };

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
    "description": "치과가 무서워서 미뤄온 분들이 다시는 미루지 않아도 되는 병원.",
    "url": "https://seoul365dc.kr",
  };

  // Event schema — special promotions/ongoing service
  const eventSchema = {
    "@context": "https://schema.org",
    "@type": "Event",
    "@id": "https://seoul365dc.kr/#free-ct-event",
    "name": "서울365치과 무료 CT 정밀진단 이벤트",
    "description": "첫 내원 시 무료 CT 촬영으로 정밀 진단을 받아보세요. 서울대 출신 5인 전문의가 직접 진단합니다.",
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
        <meta name="keywords" content="인천치과, 구월동치과, 남동구치과, 인천임플란트, 구월동임플란트, 인천치아교정, 인비절라인, 인천인비절라인, 구월동인비절라인, 투명교정, 인천투명교정, 인비절라인비용, 인비절라인가격, 수면진료, 전체임플란트, 디지털풀아치, 인천전체임플란트, 서울365치과, 인천교정, 야간진료치과, 365일치과, 자체기공실, 무통마취, 인천소아치과, 심미치료, 신경치료, 서울대치과, 인천수면치과, 간석동치과, 만수동치과, 논현동치과, 인천서구치과, 부평치과, 인천남동구임플란트, 구월동교정, 인천라미네이트, 인천충치치료, 인천야간치과, 인천응급치과" />
        <link rel="canonical" href={canonicalUrl} />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow" />

        {/* === LANGUAGE & GEO === */}
        <meta http-equiv="content-language" content="ko-KR" />
        <link rel="alternate" hreflang="ko-KR" href={canonicalUrl} />
        <link rel="alternate" hreflang="x-default" href={canonicalUrl} />
        <meta name="geo.region" content="KR-28" />
        <meta name="geo.placename" content="인천 남동구 구월동" />
        <meta name="geo.position" content="37.4482;126.7042" />
        <meta name="ICBM" content="37.4482, 126.7042" />

        {/* === THEME & ICONS === */}
        <meta name="theme-color" content="#040B18" />
        <meta name="msapplication-TileColor" content="#040B18" />
        <meta name="apple-mobile-web-app-title" content="서울365치과" />
        <link rel="icon" type="image/x-icon" href="/static/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/static/favicon-32x32.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/static/apple-touch-icon.png" />

        {/* === OPEN GRAPH === */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="서울365치과의원" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="서울365치과 - 인천 구월동 서울대 출신 5인 전문의 치과" />
        <meta property="og:locale" content="ko_KR" />

        {/* === TWITTER/X === */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDesc} />
        <meta name="twitter:image" content={ogImage} />
        <meta name="twitter:image:alt" content="서울365치과 - 인천 구월동 서울대 출신 5인 전문의 치과" />

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

        {/* === PRECONNECT === */}
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin />
        <link rel="dns-prefetch" href="https://cdn.jsdelivr.net" />
        <link rel="dns-prefetch" href="https://www.youtube-nocookie.com" />

        {/* === CRITICAL: Preload cursor logo for instant display === */}
        <link rel="preload" href="/static/cursor-logo.png" as="image" type="image/png" />

        {/* === FONTS (non-blocking) === */}
        <link rel="preload" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css" as="style" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css" media="print" onload="this.media='all'" />

        {/* === CSS LIBS (FontAwesome non-blocking) === */}
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet" media="print" onload="this.media='all'" />
        <noscript><link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet" /></noscript>

        {/* === MAIN STYLESHEET (Tailwind + custom, built at compile time) === */}
        <link href="/static/style.css" rel="stylesheet" />

        {/* === STRUCTURED DATA (JSON-LD) === */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(websiteSchema)}} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(dentistSchema)}} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(organizationSchema)}} />
        {jsonLd && (Array.isArray(jsonLd)
          ? jsonLd.map((ld: any) => <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(ld)}} />)
          : <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}} />
        )}
      </head>
      <body class="font-sans text-gray-900 bg-white antialiased">

        {/* === GTM NOSCRIPT FALLBACK === */}
        {gtmId && <noscript><iframe src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`} height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>}

        {/* === SKIP NAVIGATION (접근성) === */}
        <a href="#main-content" class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:bg-white focus:px-4 focus:py-2 focus:rounded-lg focus:shadow-lg focus:text-primary focus:font-semibold">
          메인 콘텐츠로 바로가기
        </a>

        {/* === SCROLL PROGRESS === */}
        <div id="scroll-progress" class="scroll-progress" role="progressbar" aria-label="페이지 스크롤 진행률"></div>

        {/* === CUSTOM CURSOR (Desktop only — inline style, no Tailwind dependency) === */}
        <div id="cursor-dot" class="cursor-dot" style="display:none" aria-hidden="true"></div>
        <div id="cursor-ring" class="cursor-ring" style="display:none" aria-hidden="true"></div>

        {/* === PREMIUM HEADER === */}
        <header id="main-header" class="header-premium" role="banner">
          <nav class="max-w-[1400px] mx-auto px-5 md:px-8 h-[72px] flex items-center justify-between" role="navigation" aria-label="메인 네비게이션">
            {/* Logo */}
            <a href="/" class="flex items-center gap-2.5 group relative z-10" aria-label="서울365치과 홈으로 이동">
              <img src="/static/logo-v2.png" alt="서울365치과" class="header-logo w-10 h-10 object-contain transition-all duration-500 group-hover:scale-110" />
              <div class="flex flex-col leading-none">
                <span class="logo-text text-[1.05rem] font-extrabold tracking-tight text-gray-900">서울365치과</span>
                <span class="logo-text text-[0.6rem] font-medium text-gray-400 tracking-[0.15em] mt-0.5">SEOUL 365 DENTAL</span>
              </div>
            </a>

            {/* Desktop Nav */}
            <div class="hidden lg:flex items-center gap-7">
              {[
                { href: '/treatments', label: '진료안내' },
                { href: '/doctors', label: '의료진' },
                { href: '/cases/gallery', label: '치료사례' },
                { href: '/blog', label: '블로그' },
                { href: '/faq', label: 'FAQ' },
                { href: '/notices', label: '공지사항' },
                { href: '/info', label: '내원안내' },
              ].map(item => (
                <a href={item.href} class="nav-link link-underline text-[0.88rem] font-medium text-gray-600 hover:text-primary transition-colors" data-cursor-hover>{item.label}</a>
              ))}
            </div>

            {/* Desktop CTA */}
            <div class="hidden lg:flex items-center gap-3">
              <div class="flex items-center gap-1.5 text-[0.75rem] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full" id="clinic-status-badge">
                <span class="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                <span>진료중</span>
              </div>
              <a href={CLINIC.phoneTel} class="nav-link flex items-center gap-1.5 text-[0.82rem] font-medium text-gray-500 hover:text-primary transition-colors" data-cursor-hover aria-label="전화 상담 032-432-0365">
                <i class="fa-solid fa-phone text-[0.7rem]" aria-hidden="true"></i> {CLINIC.phone}
              </a>
              {/* Auth buttons — dynamically updated by JS */}
              <div id="auth-nav" class="flex items-center gap-2">
                <a href="/login" id="auth-login-btn" class="nav-link flex items-center gap-1.5 text-[0.82rem] font-medium text-gray-500 hover:text-primary transition-colors" data-cursor-hover>
                  <i class="fa-solid fa-right-to-bracket text-[0.7rem]" aria-hidden="true"></i> 로그인
                </a>
                <a href="/register" id="auth-register-btn" class="btn-premium btn-premium-outline text-[0.82rem] px-4 py-2" data-cursor-hover>
                  <i class="fa-solid fa-user-plus text-[0.7rem]" aria-hidden="true"></i> 회원가입
                </a>
              </div>
              <div id="auth-user" class="hidden flex items-center gap-2">
                <span id="auth-user-name" class="text-[0.82rem] font-medium text-gray-600"></span>
                <button id="auth-logout-btn" class="nav-link text-[0.82rem] font-medium text-gray-400 hover:text-red-500 transition-colors" data-cursor-hover aria-label="로그아웃">
                  <i class="fa-solid fa-right-from-bracket text-[0.7rem]" aria-hidden="true"></i>
                </button>
              </div>
              <a href="/reservation" class="btn-premium btn-premium-fill text-[0.82rem] px-5 py-2.5" data-cursor-hover>
                <i class="fa-solid fa-calendar-check text-[0.75rem]" aria-hidden="true"></i> 예약하기
              </a>
            </div>

            {/* Mobile Menu Btn */}
            <button id="mobile-menu-btn" class="lg:hidden mobile-menu-icon p-2 text-gray-700 relative z-10" aria-label="모바일 메뉴 열기" aria-expanded="false" aria-controls="mobile-menu">
              <i class="fa-solid fa-bars text-xl" aria-hidden="true"></i>
            </button>
          </nav>

          {/* Mobile Menu */}
          <div id="mobile-menu" class="hidden lg:hidden absolute top-full left-0 right-0 bg-navy/95 backdrop-blur-xl border-t border-white/10" role="navigation" aria-label="모바일 네비게이션">
            <div class="max-w-[1400px] mx-auto px-5 py-4 space-y-0.5">
              {/* Mobile Status Badge */}
              <div class="flex items-center gap-2 px-4 py-2 mb-2">
                <div class="flex items-center gap-1.5 text-[0.75rem] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full" id="mobile-clinic-status">
                  <span class="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                  <span>진료중</span>
                </div>
                <a href={CLINIC.phoneTel} class="text-[0.8rem] font-medium text-white/50">
                  <i class="fa-solid fa-phone text-[0.65rem] mr-1" aria-hidden="true"></i>{CLINIC.phone}
                </a>
              </div>
              {[
                { href: '/', label: '홈', icon: 'fa-house' },
                { href: '/treatments', label: '진료안내', icon: 'fa-teeth' },
                { href: '/doctors', label: '의료진', icon: 'fa-user-doctor' },
                { href: '/cases/gallery', label: '치료사례', icon: 'fa-images' },
                { href: '/blog', label: '블로그', icon: 'fa-pen-nib' },
                { href: '/faq', label: 'FAQ', icon: 'fa-circle-question' },
                { href: '/notices', label: '공지사항', icon: 'fa-bullhorn' },
                { href: '/info', label: '내원안내', icon: 'fa-hospital' },
              ].map(item => (
                <a href={item.href} class="flex items-center gap-3 py-3.5 px-4 text-white/80 font-medium text-[0.95rem] rounded-2xl hover:bg-white/5 transition-colors">
                  <i class={`fa-solid ${item.icon} text-[#00E5FF]/60 w-5 text-center text-sm`} aria-hidden="true"></i>
                  {item.label}
                </a>
              ))}
              <div class="pt-3 pb-1 space-y-2">
                <div id="mobile-auth-nav" class="grid grid-cols-2 gap-2">
                  <a href="/login" class="btn-premium btn-premium-outline text-[0.82rem] py-3 justify-center text-white/70 border-white/20">
                    <i class="fa-solid fa-right-to-bracket text-[0.7rem]" aria-hidden="true"></i> 로그인
                  </a>
                  <a href="/register" class="btn-premium btn-premium-outline text-[0.82rem] py-3 justify-center text-white/70 border-white/20">
                    <i class="fa-solid fa-user-plus text-[0.7rem]" aria-hidden="true"></i> 회원가입
                  </a>
                </div>
                <div id="mobile-auth-user" class="hidden text-center py-2">
                  <span id="mobile-user-name" class="text-sm font-medium text-white/70"></span>
                  <button id="mobile-logout-btn" class="ml-2 text-sm text-white/40 hover:text-red-400">로그아웃</button>
                </div>
                <div class="grid grid-cols-2 gap-2">
                  <a href={CLINIC.phoneTel} class="btn-premium btn-premium-outline text-[0.82rem] py-3 justify-center text-white/70 border-white/20">
                    <i class="fa-solid fa-phone text-[0.7rem]" aria-hidden="true"></i> 전화상담
                  </a>
                  <a href="/reservation" class="btn-premium btn-premium-fill text-[0.82rem] py-3 justify-center">
                    <i class="fa-solid fa-calendar-check text-[0.7rem]" aria-hidden="true"></i> 예약하기
                  </a>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* === MAIN CONTENT === */}
        <main id="main-content" role="main">{children}</main>

        {/* === PREMIUM FOOTER === */}
        <footer class="bg-navy pb-28 md:pb-0 relative overflow-hidden" role="contentinfo">
          {/* Aurora footer accent */}
          <div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#0066FF]/30 to-transparent" aria-hidden="true"></div>
          <div class="absolute top-0 left-1/4 w-1/2 h-64 bg-[#0066FF]/[0.03] blur-[100px] pointer-events-none" aria-hidden="true"></div>

          <div class="max-w-[1400px] mx-auto px-5 md:px-8 relative">
            {/* Top */}
            <div class="py-16 md:py-20 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8">
              {/* Brand */}
              <div class="md:col-span-4">
                <a href="/" class="flex items-center gap-2.5 mb-6" aria-label="서울365치과 홈">
                  <img src="/static/logo-v2.png" alt="서울365치과" class="w-10 h-10 object-contain" />
                  <div class="flex flex-col leading-none">
                    <span class="text-[1.05rem] font-extrabold text-white tracking-tight">서울365치과</span>
                    <span class="text-[0.6rem] font-medium text-white/25 tracking-[0.15em] mt-0.5">SEOUL 365 DENTAL</span>
                  </div>
                </a>
                <p class="text-sm leading-relaxed text-white/35 max-w-xs">
                  {MESSAGING.brandSlogan}<br/>
                  서울대 출신 5인 원장 · 365일 진료 · 자체 기공실.
                </p>
                <div class="flex gap-2.5 mt-6">
                  {[
                    { href: CLINIC.instagram, icon: 'fa-brands fa-instagram', label: 'Instagram에서 서울365치과 보기' },
                    { href: CLINIC.naverBlog, icon: 'fa-solid fa-n', label: '네이버 블로그에서 서울365치과 보기' },
                    { href: CLINIC.kakao, icon: 'fa-solid fa-comment', label: '카카오톡으로 서울365치과 상담하기' },
                  ].map(s => (
                    <a href={s.href} target="_blank" rel="noopener noreferrer nofollow" class="w-10 h-10 rounded-full bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-white/30 hover:text-[#00E5FF] hover:bg-[#0066FF]/10 hover:border-[#0066FF]/20 transition-all text-sm" aria-label={s.label} data-cursor-hover>
                      <i class={s.icon} aria-hidden="true"></i>
                    </a>
                  ))}
                </div>
              </div>

              {/* Navigation */}
              <nav class="md:col-span-2" aria-label="진료 메뉴">
                <span class="block text-[0.68rem] font-bold text-[#0066FF]/40 tracking-[0.2em] uppercase mb-5" role="heading" aria-level="3">진료</span>
                <ul class="space-y-3 text-[0.85rem]">
                  {[
                    { name: '전체임플란트', slug: 'full-implant' },
                    { name: '교정', slug: 'orthodontics' },
                    { name: '수면진료', slug: 'sedation' },
                    { name: '심미치료', slug: 'cosmetic' },
                  ].map(t => (
                    <li><a href={`/treatments/${t.slug}`} class="text-white/35 hover:text-[#00E5FF] transition-colors">{t.name}</a></li>
                  ))}
                </ul>
              </nav>

              <nav class="md:col-span-2" aria-label="안내 메뉴">
                <span class="block text-[0.68rem] font-bold text-[#0066FF]/40 tracking-[0.2em] uppercase mb-5" role="heading" aria-level="3">안내</span>
                <ul class="space-y-3 text-[0.85rem]">
                  <li><a href="/doctors" class="text-white/35 hover:text-[#00E5FF] transition-colors">의료진</a></li>
                  <li><a href="/info" class="text-white/35 hover:text-[#00E5FF] transition-colors">내원안내</a></li>
                  <li><a href="/blog" class="text-white/35 hover:text-[#00E5FF] transition-colors">블로그</a></li>
                  <li><a href="/faq" class="text-white/35 hover:text-[#00E5FF] transition-colors">FAQ</a></li>
                </ul>
              </nav>

              {/* Hours */}
              <div class="md:col-span-4">
                <span class="block text-[0.68rem] font-bold text-[#0066FF]/40 tracking-[0.2em] uppercase mb-5" role="heading" aria-level="3">진료시간</span>
                <div class="space-y-0 text-[0.85rem]">
                  {HOURS.map(h => (
                    <div class="flex justify-between items-center py-2.5 border-b border-white/[0.04]">
                      <span class="text-white/40">{h.day}</span>
                      <span class="text-white/70 font-semibold tabular-nums">{h.time}</span>
                    </div>
                  ))}
                  <div class="pt-3 flex items-center gap-2">
                    <span class="w-1.5 h-1.5 bg-[#0066FF] rounded-full animate-pulse" aria-hidden="true"></span>
                    <span class="text-[#00E5FF] text-[0.78rem] font-semibold">점심시간 없이 연속 진료</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Business Info */}
            <div class="border-t border-white/[0.04] pt-6 pb-3">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-[0.72rem] text-white/20 leading-relaxed">
                <div class="space-y-1.5">
                  <div class="flex flex-wrap gap-x-1">
                    <span class="text-white/30 font-semibold">서울365치과의원</span>
                    <span class="text-white/10">|</span>
                    <span>대표자: 박준규</span>
                  </div>
                  <div class="flex flex-wrap gap-x-1">
                    <span>사업자등록번호: 395-37-00559</span>
                    <span class="text-white/10">|</span>
                    <span>개업일: 2019.05.01</span>
                  </div>
                  <div>
                    <span>업태: 보건업 및 사회복지서비스업</span>
                    <span class="text-white/10 mx-1">|</span>
                    <span>종목: 치과의원</span>
                  </div>
                </div>
                <div class="space-y-1.5">
                  <div>
                    <span>소재지: {CLINIC.address}</span>
                  </div>
                  <div class="flex flex-wrap gap-x-1">
                    <span>전화: {CLINIC.phone}</span>
                    <span class="text-white/10">|</span>
                    <span>이메일: seoul365dental@gmail.com</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Copyright & Links */}
            <div class="border-t border-white/[0.04] py-5 flex flex-col md:flex-row justify-between gap-3 text-[0.72rem] text-white/15">
              <span>&copy; 2019-2026 서울365치과의원. All rights reserved.</span>
              <div class="flex gap-4">
                <a href="/privacy" class="hover:text-white/50 transition-colors">개인정보처리방침</a>
                <a href="/terms" class="hover:text-white/50 transition-colors">이용약관</a>
                <a href="/sitemap.xml" class="hover:text-white/50 transition-colors">사이트맵</a>
              </div>
            </div>
          </div>
        </footer>

        {/* === MOBILE BOTTOM CTA === */}
        <div class="md:hidden fixed bottom-0 left-0 right-0 z-50 mobile-cta-bar safe-bottom" role="complementary" aria-label="빠른 연락">
          <div class="grid grid-cols-4">
            <a href={CLINIC.phoneTel} class="flex flex-col items-center justify-center py-3 text-gray-400 active:bg-gray-50 transition-colors" aria-label="전화 상담">
              <i class="fa-solid fa-phone text-[1.1rem]" aria-hidden="true"></i>
              <span class="text-[10px] mt-1 font-medium">전화</span>
            </a>
            <a href={CLINIC.kakao} target="_blank" rel="noopener noreferrer nofollow" class="flex flex-col items-center justify-center py-3 text-gray-400 active:bg-gray-50 transition-colors" aria-label="카카오톡 상담">
              <i class="fa-solid fa-comment text-[1.1rem]" aria-hidden="true"></i>
              <span class="text-[10px] mt-1 font-medium">카카오톡</span>
            </a>
            <a href="/reservation" class="flex flex-col items-center justify-center py-3 bg-gradient-to-r from-[#0066FF] to-[#2979FF] text-white relative overflow-hidden" aria-label="상담 예약하기">
              <div class="absolute inset-0 bg-gradient-to-r from-[#00E5FF]/0 via-white/10 to-[#00E5FF]/0 animate-shimmer-slow" aria-hidden="true"></div>
              <i class="fa-solid fa-calendar-check text-[1.1rem] relative z-10" aria-hidden="true"></i>
              <span class="text-[10px] mt-1 font-bold relative z-10">예약</span>
            </a>
            <a href="/info#directions" class="flex flex-col items-center justify-center py-3 text-gray-400 active:bg-gray-50 transition-colors" aria-label="오시는 길 안내">
              <i class="fa-solid fa-location-dot text-[1.1rem]" aria-hidden="true"></i>
              <span class="text-[10px] mt-1 font-medium">길찾기</span>
            </a>
          </div>
        </div>

        {/* === DESKTOP FLOATING CTA === */}
        <div class="hidden md:flex fixed bottom-8 right-8 z-40 flex-col gap-3" aria-label="빠른 연락 버튼">
          <a href={CLINIC.kakao} target="_blank" rel="noopener noreferrer nofollow" class="floating-btn bg-[#FEE500] text-[#3C1E1E] rounded-2xl flex items-center justify-center" aria-label="카카오톡 상담" style="width:52px;height:52px;" data-cursor-hover>
            <i class="fa-solid fa-comment text-lg" aria-hidden="true"></i>
          </a>
          <a href={CLINIC.phoneTel} class="floating-btn bg-gradient-to-br from-[#0066FF] to-[#2979FF] text-white rounded-2xl flex items-center justify-center relative overflow-hidden" aria-label="전화 상담 032-432-0365" style="width:52px;height:52px;" data-cursor-hover>
            <i class="fa-solid fa-phone text-lg relative z-10" aria-hidden="true"></i>
            <div class="absolute inset-0 rounded-2xl electric-border-glow" aria-hidden="true"></div>
          </a>
          <button onclick="window.scrollTo({top:0,behavior:'smooth'})" class="floating-btn bg-gray-900/90 text-white rounded-2xl flex items-center justify-center backdrop-blur-sm" aria-label="페이지 맨 위로 이동" style="width:52px;height:52px;" data-cursor-hover>
            <i class="fa-solid fa-arrow-up" aria-hidden="true"></i>
          </button>
        </div>

        {/* === SCRIPTS === */}
        <script src="/static/app.js" defer></script>
      </body>
    </html>
  )
})
