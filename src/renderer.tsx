import { jsxRenderer } from 'hono/jsx-renderer'
import { CLINIC, HOURS } from './data/clinic'
import { MESSAGING } from './data/brand'

// SEO/AEO Optimized Renderer — v2.0
// - Rich Schema.org (Dentist + MedicalOrganization + WebSite + Speakable)
// - Complete OG + Twitter meta
// - Semantic HTML (header/main/footer with role attributes)
// - Accessibility enhancements (aria-labels, lang, skip-nav)
// - Robots, geo meta, hreflang

export const renderer = jsxRenderer(({ children, title, description, canonical, jsonLd }) => {
  const pageTitle = title || `서울365치과 | 인천 구월동 치과 - 서울대 5인 전문의, 365일 진료`;
  const pageDesc = description || `인천 구월동 서울365치과. 서울대 출신 5인 원장, 365일 진료, 자체 기공실 보유. 임플란트·교정·수면진료. 032-432-0365`;
  const canonicalUrl = canonical || 'https://seoul365dental.com';
  const ogImage = 'https://seoul365dental.com/static/og-image.jpg';

  // WebSite schema for sitelinks searchbox (AEO/SEO)
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://seoul365dental.com/#website",
    "name": "서울365치과의원",
    "alternateName": ["Seoul 365 Dental", "서울365치과", "서울삼육오치과"],
    "url": "https://seoul365dental.com",
    "inLanguage": "ko-KR",
    "publisher": { "@id": "https://seoul365dental.com/#dentist" },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://seoul365dental.com/treatments?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    },
    "copyrightHolder": { "@id": "https://seoul365dental.com/#dentist" },
    "copyrightYear": "2019",
  };

  // Dentist + MedicalOrganization combined schema
  const dentistSchema = {
    "@context": "https://schema.org",
    "@type": ["Dentist", "MedicalOrganization", "LocalBusiness"],
    "@id": "https://seoul365dental.com/#dentist",
    "name": "서울365치과의원",
    "alternateName": "Seoul 365 Dental Clinic",
    "description": "인천 구월동 서울대 출신 5인 전문의 협진 치과. 365일 진료, 자체 기공실, 수면진료, 무통마취. 임플란트·교정·심미치료 전문.",
    "url": "https://seoul365dental.com",
    "telephone": "+82-32-432-0365",
    "email": "seoul365dental@gmail.com",
    "image": ogImage,
    "logo": "https://seoul365dental.com/static/logo.png",
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
      { "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday"], "opens": "10:00", "closes": "21:00" },
      { "dayOfWeek": "Friday", "opens": "10:00", "closes": "19:00" },
      { "dayOfWeek": "Saturday", "opens": "10:00", "closes": "14:00" },
      { "dayOfWeek": "Sunday", "opens": "14:00", "closes": "18:00" },
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
      "임플란트", "전체임플란트", "올온X", "치아교정", "인비절라인",
      "수면진료", "무통마취", "심미치료", "충치치료", "신경치료",
      "소아치과", "자체기공실", "즉시로딩", "MUA",
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
      { "@type": "Physician", "@id": "https://seoul365dental.com/doctors/park-junkyu#physician", "name": "박준규", "jobTitle": "대표원장" },
      { "@type": "Physician", "@id": "https://seoul365dental.com/doctors/choi-dabin#physician", "name": "최다빈", "jobTitle": "원장" },
      { "@type": "Physician", "@id": "https://seoul365dental.com/doctors/jung-moonhee#physician", "name": "정문희", "jobTitle": "원장" },
      { "@type": "Physician", "@id": "https://seoul365dental.com/doctors/sang-sehoon#physician", "name": "상세훈", "jobTitle": "원장" },
      { "@type": "Physician", "@id": "https://seoul365dental.com/doctors/ha-nuri#physician", "name": "하누리", "jobTitle": "원장" },
    ],
    // Potential reservation action
    "potentialAction": [
      {
        "@type": "ReserveAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://seoul365dental.com/reservation",
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
    "@id": "https://seoul365dental.com/#organization",
    "name": "서울365치과의원",
    "url": "https://seoul365dental.com",
    "logo": {
      "@type": "ImageObject",
      "url": "https://seoul365dental.com/static/logo.png",
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
    "@id": "https://seoul365dental.com/#navigation",
    "name": "서울365치과 사이트 메뉴",
    "itemListElement": [
      { "@type": "SiteNavigationElement", "position": 1, "name": "홈", "url": "https://seoul365dental.com" },
      { "@type": "SiteNavigationElement", "position": 2, "name": "진료안내", "url": "https://seoul365dental.com/treatments" },
      { "@type": "SiteNavigationElement", "position": 3, "name": "의료진", "url": "https://seoul365dental.com/doctors" },
      { "@type": "SiteNavigationElement", "position": 4, "name": "비용안내", "url": "https://seoul365dental.com/pricing" },
      { "@type": "SiteNavigationElement", "position": 5, "name": "치료사례", "url": "https://seoul365dental.com/cases/gallery" },
      { "@type": "SiteNavigationElement", "position": 6, "name": "오시는길", "url": "https://seoul365dental.com/directions" },
      { "@type": "SiteNavigationElement", "position": 7, "name": "FAQ", "url": "https://seoul365dental.com/faq" },
      { "@type": "SiteNavigationElement", "position": 8, "name": "상담예약", "url": "https://seoul365dental.com/reservation" },
    ]
  };

  // MedicalBusiness schema — supplementary medical-specific markup
  const medicalBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    "@id": "https://seoul365dental.com/#medical-business",
    "name": "서울365치과의원",
    "url": "https://seoul365dental.com",
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
          { "@type": "Offer", "itemOffered": { "@type": "MedicalProcedure", "name": "올온X 임플란트" } },
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
    "@id": "https://seoul365dental.com/#brand",
    "name": "서울365치과",
    "alternateName": ["Seoul 365 Dental", "서울삼육오치과"],
    "logo": "https://seoul365dental.com/static/logo.png",
    "slogan": MESSAGING.brandSlogan,
    "description": "치과가 무서워서 미뤄온 분들이 다시는 미루지 않아도 되는 병원.",
    "url": "https://seoul365dental.com",
  };

  // Event schema — special promotions/ongoing service
  const eventSchema = {
    "@context": "https://schema.org",
    "@type": "Event",
    "@id": "https://seoul365dental.com/#free-ct-event",
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
    "organizer": { "@id": "https://seoul365dental.com/#dentist" },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "KRW",
      "availability": "https://schema.org/InStock",
      "url": "https://seoul365dental.com/reservation",
      "validFrom": "2026-01-01",
    },
    "isAccessibleForFree": true,
  };

  // MedicalClinic schema — emphasizes clinical facility info
  const medicalClinicSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    "@id": "https://seoul365dental.com/#clinic",
    "name": "서울365치과의원",
    "url": "https://seoul365dental.com",
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
    "@id": "https://seoul365dental.com/#health-topics",
    "about": [
      { "@type": "MedicalCondition", "name": "치아 상실", "possibleTreatment": { "@type": "MedicalProcedure", "name": "임플란트" } },
      { "@type": "MedicalCondition", "name": "부정교합", "possibleTreatment": { "@type": "MedicalProcedure", "name": "치아교정" } },
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
        <meta name="theme-color" content="#0066FF" />
        <meta name="msapplication-TileColor" content="#0066FF" />
        <meta name="apple-mobile-web-app-title" content="서울365치과" />

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

        {/* === NAVER VERIFICATION (placeholder) === */}
        <meta name="naver-site-verification" content="placeholder" />

        {/* === PRECONNECT === */}
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin />
        <link rel="dns-prefetch" href="https://cdn.jsdelivr.net" />
        <link rel="dns-prefetch" href="https://www.youtube-nocookie.com" />

        {/* === FONTS === */}
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css" />

        {/* === CSS + JS LIBS === */}
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet" />

        <script dangerouslySetInnerHTML={{__html: `
          tailwind.config = {
            theme: {
              extend: {
                colors: {
                  primary: { DEFAULT: '#0066FF', bright: '#2979FF', dark: '#0050CC', light: '#E3F0FF', lighter: '#F0F7FF' },
                  navy: { DEFAULT: '#040B18', light: '#0A1628', lighter: '#111827' },
                  accent: '#00E5FF',
                  cyan: '#00E5FF',
                },
                fontFamily: {
                  sans: ['Pretendard Variable', 'Pretendard', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'Roboto', 'Helvetica Neue', 'sans-serif'],
                },
              }
            }
          }
        `}} />

        <link href="/static/style.css" rel="stylesheet" />

        {/* === STRUCTURED DATA (JSON-LD) === */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(websiteSchema)}} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(dentistSchema)}} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(organizationSchema)}} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(navigationSchema)}} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(medicalBusinessSchema)}} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(brandSchema)}} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(eventSchema)}} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(medicalClinicSchema)}} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(healthTopicSchema)}} />
        {jsonLd && (Array.isArray(jsonLd)
          ? jsonLd.map((ld: any) => <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(ld)}} />)
          : <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}} />
        )}
      </head>
      <body class="font-sans text-gray-900 bg-white antialiased">

        {/* === SKIP NAVIGATION (접근성) === */}
        <a href="#main-content" class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:bg-white focus:px-4 focus:py-2 focus:rounded-lg focus:shadow-lg focus:text-primary focus:font-semibold">
          메인 콘텐츠로 바로가기
        </a>

        {/* === PRELOADER === */}
        <div id="preloader" class="preloader" aria-hidden="true">
          <div class="preloader-logo">
            <i class="fa-solid fa-tooth text-white text-2xl"></i>
          </div>
          <p class="text-white/20 text-xs font-semibold tracking-[0.3em] uppercase mt-5">Seoul 365 Dental</p>
          <div class="preloader-bar">
            <div class="preloader-bar-inner"></div>
          </div>
        </div>

        {/* === SCROLL PROGRESS === */}
        <div id="scroll-progress" class="scroll-progress" role="progressbar" aria-label="페이지 스크롤 진행률"></div>

        {/* === CUSTOM CURSOR (Desktop only) === */}
        <div id="cursor-dot" class="cursor-dot hidden lg:block" aria-hidden="true"></div>
        <div id="cursor-ring" class="cursor-ring hidden lg:block" aria-hidden="true"></div>

        {/* === PREMIUM HEADER === */}
        <header id="main-header" class="header-premium" role="banner">
          <nav class="max-w-[1400px] mx-auto px-5 md:px-8 h-[72px] flex items-center justify-between" role="navigation" aria-label="메인 네비게이션">
            {/* Logo */}
            <a href="/" class="flex items-center gap-2.5 group relative z-10" aria-label="서울365치과 홈으로 이동">
              <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0066FF] to-[#00E5FF] flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-[#0066FF]/30 logo-pulse">
                <i class="fa-solid fa-tooth text-white text-sm" aria-hidden="true"></i>
              </div>
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
                { href: '/pricing', label: '비용안내' },
                { href: '/cases/gallery', label: '치료사례' },
                { href: '/directions', label: '오시는길' },
                { href: '/faq', label: 'FAQ' },
              ].map(item => (
                <a href={item.href} class="nav-link link-underline text-[0.88rem] font-medium text-gray-600 hover:text-primary transition-colors" data-cursor-hover>{item.label}</a>
              ))}
            </div>

            {/* Desktop CTA */}
            <div class="hidden lg:flex items-center gap-3">
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
          <div id="mobile-menu" class="hidden lg:hidden absolute top-full left-0 right-0 glass-white border-t border-gray-100/50" role="navigation" aria-label="모바일 네비게이션">
            <div class="max-w-[1400px] mx-auto px-5 py-4 space-y-0.5">
              {[
                { href: '/', label: '홈', icon: 'fa-house' },
                { href: '/treatments', label: '진료안내', icon: 'fa-teeth' },
                { href: '/doctors', label: '의료진', icon: 'fa-user-doctor' },
                { href: '/pricing', label: '비용안내', icon: 'fa-won-sign' },
                { href: '/cases/gallery', label: '치료사례', icon: 'fa-images' },
                { href: '/directions', label: '오시는길', icon: 'fa-location-dot' },
                { href: '/faq', label: 'FAQ', icon: 'fa-circle-question' },
              ].map(item => (
                <a href={item.href} class="flex items-center gap-3 py-3.5 px-4 text-gray-700 font-medium text-[0.95rem] rounded-2xl hover:bg-primary/5 transition-colors">
                  <i class={`fa-solid ${item.icon} text-primary/60 w-5 text-center text-sm`} aria-hidden="true"></i>
                  {item.label}
                </a>
              ))}
              <div class="pt-3 pb-1 space-y-2">
                <div id="mobile-auth-nav" class="grid grid-cols-2 gap-2">
                  <a href="/login" class="btn-premium btn-premium-outline text-[0.82rem] py-3 justify-center">
                    <i class="fa-solid fa-right-to-bracket text-[0.7rem]" aria-hidden="true"></i> 로그인
                  </a>
                  <a href="/register" class="btn-premium btn-premium-outline text-[0.82rem] py-3 justify-center">
                    <i class="fa-solid fa-user-plus text-[0.7rem]" aria-hidden="true"></i> 회원가입
                  </a>
                </div>
                <div id="mobile-auth-user" class="hidden text-center py-2">
                  <span id="mobile-user-name" class="text-sm font-medium text-gray-600"></span>
                  <button id="mobile-logout-btn" class="ml-2 text-sm text-gray-400 hover:text-red-500">로그아웃</button>
                </div>
                <div class="grid grid-cols-2 gap-2">
                  <a href={CLINIC.phoneTel} class="btn-premium btn-premium-outline text-[0.82rem] py-3 justify-center">
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
                  <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0066FF] to-[#00E5FF] flex items-center justify-center">
                    <i class="fa-solid fa-tooth text-white text-sm" aria-hidden="true"></i>
                  </div>
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
                    <a href={s.href} target="_blank" rel="noopener noreferrer" class="w-10 h-10 rounded-full bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-white/30 hover:text-[#00E5FF] hover:bg-[#0066FF]/10 hover:border-[#0066FF]/20 transition-all text-sm" aria-label={s.label} data-cursor-hover>
                      <i class={s.icon} aria-hidden="true"></i>
                    </a>
                  ))}
                </div>
              </div>

              {/* Navigation */}
              <nav class="md:col-span-2" aria-label="진료 메뉴">
                <h2 class="text-[0.68rem] font-bold text-[#0066FF]/40 tracking-[0.2em] uppercase mb-5">진료</h2>
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
                <h2 class="text-[0.68rem] font-bold text-[#0066FF]/40 tracking-[0.2em] uppercase mb-5">안내</h2>
                <ul class="space-y-3 text-[0.85rem]">
                  <li><a href="/doctors" class="text-white/35 hover:text-[#00E5FF] transition-colors">의료진</a></li>
                  <li><a href="/pricing" class="text-white/35 hover:text-[#00E5FF] transition-colors">비용안내</a></li>
                  <li><a href="/directions" class="text-white/35 hover:text-[#00E5FF] transition-colors">오시는길</a></li>
                  <li><a href="/faq" class="text-white/35 hover:text-[#00E5FF] transition-colors">FAQ</a></li>
                </ul>
              </nav>

              {/* Hours */}
              <div class="md:col-span-4">
                <h2 class="text-[0.68rem] font-bold text-[#0066FF]/40 tracking-[0.2em] uppercase mb-5">진료시간</h2>
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

            {/* Bottom */}
            <div class="border-t border-white/[0.04] py-6 flex flex-col md:flex-row justify-between gap-3 text-[0.72rem] text-white/15">
              <div class="flex flex-wrap gap-x-4 gap-y-1">
                <span>서울365치과의원</span>
                <span>대표 박준규</span>
                <span>사업자등록번호: 문의</span>
                <span>{CLINIC.address}</span>
                <span>{CLINIC.phone}</span>
              </div>
              <div class="flex gap-4">
                <a href="/privacy" class="hover:text-white/50 transition-colors">개인정보처리방침</a>
                <a href="/terms" class="hover:text-white/50 transition-colors">이용약관</a>
                <a href="/sitemap.xml" class="hover:text-white/50 transition-colors">사이트맵</a>
                <span>&copy; 2026 Seoul 365 Dental</span>
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
            <a href={CLINIC.kakao} target="_blank" rel="noopener noreferrer" class="flex flex-col items-center justify-center py-3 text-gray-400 active:bg-gray-50 transition-colors" aria-label="카카오톡 상담">
              <i class="fa-solid fa-comment text-[1.1rem]" aria-hidden="true"></i>
              <span class="text-[10px] mt-1 font-medium">카카오톡</span>
            </a>
            <a href="/reservation" class="flex flex-col items-center justify-center py-3 bg-gradient-to-r from-[#0066FF] to-[#2979FF] text-white relative overflow-hidden" aria-label="상담 예약하기">
              <div class="absolute inset-0 bg-gradient-to-r from-[#00E5FF]/0 via-white/10 to-[#00E5FF]/0 animate-shimmer-slow" aria-hidden="true"></div>
              <i class="fa-solid fa-calendar-check text-[1.1rem] relative z-10" aria-hidden="true"></i>
              <span class="text-[10px] mt-1 font-bold relative z-10">예약</span>
            </a>
            <a href="/directions" class="flex flex-col items-center justify-center py-3 text-gray-400 active:bg-gray-50 transition-colors" aria-label="오시는 길 안내">
              <i class="fa-solid fa-location-dot text-[1.1rem]" aria-hidden="true"></i>
              <span class="text-[10px] mt-1 font-medium">길찾기</span>
            </a>
          </div>
        </div>

        {/* === DESKTOP FLOATING CTA === */}
        <div class="hidden md:flex fixed bottom-8 right-8 z-40 flex-col gap-3" aria-label="빠른 연락 버튼">
          <a href={CLINIC.kakao} target="_blank" rel="noopener noreferrer" class="floating-btn bg-[#FEE500] text-[#3C1E1E] rounded-2xl flex items-center justify-center" aria-label="카카오톡 상담" style="width:52px;height:52px;" data-cursor-hover>
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
        <script dangerouslySetInnerHTML={{__html: `
          // Preloader
          window.addEventListener('load', () => {
            setTimeout(() => {
              document.getElementById('preloader')?.classList.add('hidden');
              document.body.style.overflow = '';
            }, 1600);
          });

          // Custom Cursor (Desktop only)
          if (window.innerWidth > 1024) {
            const dot = document.getElementById('cursor-dot');
            const ring = document.getElementById('cursor-ring');
            let mx = 0, my = 0, rx = 0, ry = 0;

            document.addEventListener('mousemove', (e) => {
              mx = e.clientX; my = e.clientY;
              if (dot) { dot.style.left = mx + 'px'; dot.style.top = my + 'px'; }
            });

            function animateRing() {
              rx += (mx - rx) * 0.12;
              ry += (my - ry) * 0.12;
              if (ring) { ring.style.left = rx + 'px'; ring.style.top = ry + 'px'; }
              requestAnimationFrame(animateRing);
            }
            animateRing();

            document.querySelectorAll('a, button, [data-cursor-hover], input, textarea, select').forEach(el => {
              el.addEventListener('mouseenter', () => { dot?.classList.add('hovering'); ring?.classList.add('hovering'); });
              el.addEventListener('mouseleave', () => { dot?.classList.remove('hovering'); ring?.classList.remove('hovering'); });
            });
          }

          // Scroll Progress
          window.addEventListener('scroll', () => {
            const h = document.documentElement.scrollHeight - window.innerHeight;
            const p = h > 0 ? window.scrollY / h : 0;
            const bar = document.getElementById('scroll-progress');
            if (bar) bar.style.transform = 'scaleX(' + p + ')';
          }, { passive: true });

          // Mobile menu
          document.getElementById('mobile-menu-btn')?.addEventListener('click', function() {
            const menu = document.getElementById('mobile-menu');
            const icon = this.querySelector('i');
            const expanded = !menu.classList.contains('hidden');
            menu.classList.toggle('hidden');
            this.setAttribute('aria-expanded', !expanded);
            if (menu.classList.contains('hidden')) {
              icon.className = 'fa-solid fa-bars text-xl';
            } else {
              icon.className = 'fa-solid fa-xmark text-xl';
            }
          });

          // Header scroll
          const header = document.getElementById('main-header');
          window.addEventListener('scroll', () => {
            if (window.scrollY > 50) header.classList.add('scrolled');
            else header.classList.remove('scrolled');
          }, { passive: true });

          // IntersectionObserver for scroll animations
          const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                entry.target.classList.add('visible');
              }
            });
          }, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' });

          document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-3d, .reveal-blur, .stagger-children, .img-reveal, .highlight-word').forEach(el => {
            revealObserver.observe(el);
          });

          // FAQ accordion
          document.querySelectorAll('.faq-toggle').forEach(btn => {
            btn.addEventListener('click', function() {
              const content = this.nextElementSibling;
              const icon = this.querySelector('.faq-icon');
              const expanded = !content.classList.contains('hidden');
              document.querySelectorAll('.faq-toggle').forEach(other => {
                if (other !== this) {
                  other.nextElementSibling.classList.add('hidden');
                  other.querySelector('.faq-icon')?.classList.remove('rotate-180');
                  other.setAttribute('aria-expanded', 'false');
                }
              });
              content.classList.toggle('hidden');
              icon?.classList.toggle('rotate-180');
              this.setAttribute('aria-expanded', !expanded);
            });
          });

          // Animated counter
          function animateCounters() {
            document.querySelectorAll('[data-count]').forEach(el => {
              if (el.dataset.animated) return;
              el.dataset.animated = 'true';
              const target = parseFloat(el.dataset.count);
              const suffix = el.dataset.suffix || '';
              const prefix = el.dataset.prefix || '';
              const decimals = (target % 1 !== 0) ? 1 : 0;
              let current = 0;
              const duration = 2200;
              const step = target / (duration / 16);
              const counter = setInterval(() => {
                current += step;
                if (current >= target) {
                  current = target;
                  clearInterval(counter);
                }
                el.textContent = prefix + current.toFixed(decimals) + suffix;
              }, 16);
            });
          }

          const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                animateCounters();
                counterObserver.disconnect();
              }
            });
          }, { threshold: 0.3 });
          const counterEl = document.querySelector('[data-counter-section]');
          if (counterEl) counterObserver.observe(counterEl);

          // Hero particles — ELECTRIC BLUE
          (function initParticles() {
            const canvas = document.getElementById('hero-particles');
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            let w, h, particles = [];
            function resize() {
              w = canvas.width = canvas.parentElement.offsetWidth;
              h = canvas.height = canvas.parentElement.offsetHeight;
            }
            resize();
            window.addEventListener('resize', resize);

            for (let i = 0; i < 70; i++) {
              particles.push({
                x: Math.random() * w,
                y: Math.random() * h,
                r: Math.random() * 2 + 0.5,
                dx: (Math.random() - 0.5) * 0.5,
                dy: (Math.random() - 0.5) * 0.5,
                o: Math.random() * 0.5 + 0.15,
                c: Math.random() > 0.3 ? '0,102,255' : '0,229,255'
              });
            }

            let mouseX = -999, mouseY = -999;
            canvas.parentElement.addEventListener('mousemove', (e) => {
              const rect = canvas.parentElement.getBoundingClientRect();
              mouseX = e.clientX - rect.left;
              mouseY = e.clientY - rect.top;
            });

            function draw() {
              ctx.clearRect(0, 0, w, h);
              particles.forEach(p => {
                p.x += p.dx; p.y += p.dy;
                if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
                if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;

                const dmx = p.x - mouseX;
                const dmy = p.y - mouseY;
                const dm = Math.sqrt(dmx*dmx + dmy*dmy);
                if (dm < 120) {
                  p.x += (dmx / dm) * 2;
                  p.y += (dmy / dm) * 2;
                }

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(' + p.c + ',' + p.o + ')';
                ctx.fill();

                if (p.r > 1.2) {
                  ctx.beginPath();
                  ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
                  ctx.fillStyle = 'rgba(' + p.c + ',' + (p.o * 0.1) + ')';
                  ctx.fill();
                }
              });
              for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                  const dx = particles[i].x - particles[j].x;
                  const dy = particles[i].y - particles[j].y;
                  const dist = Math.sqrt(dx*dx + dy*dy);
                  if (dist < 140) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = 'rgba(0,102,255,' + (0.08 * (1 - dist/140)) + ')';
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                  }
                }
              }
              requestAnimationFrame(draw);
            }
            draw();
          })();

          // Operating status
          function updateStatus() {
            const now = new Date();
            const day = now.getDay();
            const h = now.getHours(), m = now.getMinutes();
            const t = h * 60 + m;
            let text = '', open = false;
            if (day >= 1 && day <= 4) { open = t >= 600 && t < 1260; text = open ? '진료중 · 21시까지' : '진료 종료'; }
            else if (day === 5) { open = t >= 600 && t < 1140; text = open ? '진료중 · 19시까지' : '진료 종료'; }
            else if (day === 6) { open = t >= 600 && t < 840; text = open ? '진료중 · 14시까지' : '진료 종료'; }
            else { open = t >= 840 && t < 1080; text = open ? '진료중 · 18시까지' : '진료 종료'; }
            document.querySelectorAll('[data-status]').forEach(el => {
              el.innerHTML = open
                ? '<span class="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span><span class="font-semibold">' + text + '</span>'
                : '<span class="w-2 h-2 bg-gray-500 rounded-full"></span><span class="text-white/40">' + text + '</span>';
            });
          }
          updateStatus();
          setInterval(updateStatus, 60000);

          // 3D Tilt effect on cards (Desktop)
          if (window.innerWidth > 768) {
            document.querySelectorAll('.tilt-card').forEach(card => {
              card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                card.style.transform = 'perspective(1000px) rotateY(' + (x*10) + 'deg) rotateX(' + (-y*10) + 'deg) scale(1.02)';
              });
              card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateY(0) rotateX(0) scale(1)';
                card.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
              });
              card.addEventListener('mouseenter', () => {
                card.style.transition = 'none';
              });
            });
          }

          // Magnetic buttons (Desktop)
          if (window.innerWidth > 1024) {
            document.querySelectorAll('.btn-magnetic').forEach(btn => {
              btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = 'translate(' + (x * 0.3) + 'px, ' + (y * 0.3) + 'px)';
              });
              btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translate(0, 0)';
              });
            });
          }

          // Auth state
          (async function checkAuth() {
            try {
              const res = await fetch('/api/auth/me');
              const data = await res.json();
              if (data.ok && data.user) {
                const nav = document.getElementById('auth-nav');
                const userEl = document.getElementById('auth-user');
                const nameEl = document.getElementById('auth-user-name');
                if (nav) nav.classList.add('hidden');
                if (userEl) { userEl.classList.remove('hidden'); userEl.classList.add('flex'); }
                if (nameEl) nameEl.textContent = data.user.name + '님';

                const mobileNav = document.getElementById('mobile-auth-nav');
                const mobileUser = document.getElementById('mobile-auth-user');
                const mobileName = document.getElementById('mobile-user-name');
                if (mobileNav) mobileNav.classList.add('hidden');
                if (mobileUser) { mobileUser.classList.remove('hidden'); }
                if (mobileName) mobileName.textContent = data.user.name + '님';
              }
            } catch {}
          })();

          // Logout handlers
          document.getElementById('auth-logout-btn')?.addEventListener('click', async function() {
            await fetch('/api/auth/logout', { method: 'POST' });
            window.location.reload();
          });
          document.getElementById('mobile-logout-btn')?.addEventListener('click', async function() {
            await fetch('/api/auth/logout', { method: 'POST' });
            window.location.reload();
          });

          // YouTube Background Video — Lazy iframe inject
          (function initYTPlayer() {
            var wrap = document.getElementById('yt-player-wrap');
            var poster = document.getElementById('yt-poster');
            var videoSection = document.getElementById('video-section');
            if (!wrap || !videoSection) return;

            var isMuted = true;
            var iframe = null;
            var injected = false;

            function injectIframe() {
              if (injected) return;
              injected = true;

              iframe = document.createElement('iframe');
              iframe.id = 'yt-iframe';
              iframe.allow = 'autoplay; encrypted-media';
              iframe.setAttribute('allowfullscreen', 'false');
              iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
              iframe.title = '서울365치과 소개 영상';
              iframe.style.cssText = 'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:100vw;height:56.25vw;min-height:100vh;min-width:177.78vh;pointer-events:none;border:0;';

              var params = [
                'autoplay=1','mute=1','controls=0','showinfo=0','rel=0',
                'loop=1','playlist=gB_yiatcwAc','playsinline=1',
                'modestbranding=1','iv_load_policy=3','disablekb=1',
                'fs=0','cc_load_policy=0','enablejsapi=1'
              ].join('&');

              iframe.src = 'https://www.youtube-nocookie.com/embed/gB_yiatcwAc?' + params;

              iframe.addEventListener('load', function() {
                if (poster) {
                  setTimeout(function() {
                    poster.style.opacity = '0';
                    setTimeout(function() { poster.style.display = 'none'; }, 1000);
                  }, 600);
                }
              });

              wrap.appendChild(iframe);
            }

            var lazyObs = new IntersectionObserver(function(entries) {
              entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                  injectIframe();
                  lazyObs.disconnect();
                }
              });
            }, { rootMargin: '200px 0px' });
            lazyObs.observe(videoSection);

            function postCmd(cmd, args) {
              if (!iframe || !iframe.contentWindow) return;
              try {
                iframe.contentWindow.postMessage(JSON.stringify({
                  event: 'command', func: cmd, args: args || []
                }), '*');
              } catch(e) {}
            }

            var toggleBtn = document.getElementById('yt-sound-toggle');
            var soundIcon = document.getElementById('yt-sound-icon');
            var soundLabel = document.getElementById('yt-sound-label');

            if (toggleBtn) {
              toggleBtn.addEventListener('click', function() {
                if (isMuted) {
                  postCmd('unMute');
                  postCmd('setVolume', [80]);
                  isMuted = false;
                  if (soundIcon) soundIcon.className = 'fa-solid fa-volume-high text-sm';
                  if (soundLabel) soundLabel.textContent = '소리 끄기';
                } else {
                  postCmd('mute');
                  isMuted = true;
                  if (soundIcon) soundIcon.className = 'fa-solid fa-volume-xmark text-sm';
                  if (soundLabel) soundLabel.textContent = '소리 켜기';
                }
              });
            }

            var vidObs = new IntersectionObserver(function(entries) {
              entries.forEach(function(entry) {
                if (!iframe) return;
                if (entry.isIntersecting) {
                  postCmd('playVideo');
                } else {
                  postCmd('pauseVideo');
                }
              });
            }, { threshold: 0.1 });
            vidObs.observe(videoSection);
          })();

          // Parallax on scroll
          let ticking = false;
          window.addEventListener('scroll', () => {
            if (!ticking) {
              requestAnimationFrame(() => {
                const scrolled = window.scrollY;
                document.querySelectorAll('.parallax-slow').forEach(el => {
                  el.style.transform = 'translateY(' + (scrolled * 0.08) + 'px)';
                });
                document.querySelectorAll('.parallax-fast').forEach(el => {
                  el.style.transform = 'translateY(' + (scrolled * -0.05) + 'px)';
                });
                ticking = false;
              });
              ticking = true;
            }
          }, { passive: true });
        `}} />
      </body>
    </html>
  )
})
