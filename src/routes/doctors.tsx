import { Hono } from 'hono'
import type { Bindings } from '../lib/types'
import { CLINIC } from '../data/clinic'
import { doctors, getDoctorBySlug } from '../data/doctors'
import { getTreatmentBySlug } from '../data/treatments'
import { DOCTOR_STORIES } from '../data/brand'

const doctorRoutes = new Hono<{ Bindings: Bindings }>()

doctorRoutes.get('/doctors', (c) => {
  return c.render(
    <>
      <section class="relative overflow-hidden" style="min-height:clamp(480px,60vw,700px)">
        {/* Team Photo Background — full visible */}
        <div class="absolute inset-0 z-0">
          <img src="/static/team-photo.jpg" alt="서울365치과 의료진 단체사진" class="w-full h-full object-cover object-center" loading="eager" />
          <div class="absolute inset-0" style="background:linear-gradient(to top, #040B18 0%, rgba(4,11,24,0.7) 30%, rgba(4,11,24,0.35) 60%, rgba(4,11,24,0.5) 100%)"></div>
        </div>
        <div class="relative z-10 max-w-[1400px] mx-auto px-5 md:px-8 pt-28 md:pt-36 pb-12">
          <h1 class="section-headline text-white mb-4 reveal" style="transition-delay:0.4s;text-shadow:0 2px 20px rgba(0,0,0,0.5)">서울365치과 의료진 소개</h1>
          <p class="hero-sub text-white/60 max-w-xl reveal" style="transition-delay:0.6s;text-shadow:0 1px 10px rgba(0,0,0,0.5)">서울대 출신 5인 원장이 하나의 케이스를 함께 봅니다.</p>
          <p class="text-white/30 text-sm mt-4 reveal" style="transition-delay:0.75s">
            <i class="fa-solid fa-users text-[#0066FF]/50 mr-2"></i>원장 5인 · 전문 스태프 20여 명이 함께합니다.
          </p>
        </div>
      </section>

      <section class="section-lg bg-mesh">
        <div class="max-w-[1400px] mx-auto px-5 md:px-8">
          {/* All 5 Doctors — Equal Cards */}
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 stagger-children">
            {doctors.map((doc, i) => (
              <a href={`/doctors/${doc.slug}`} class="premium-card block group overflow-hidden relative" style="border-radius:1.5rem" data-cursor-hover>
                {/* Lead badge */}
                {i === 0 && <div class="absolute top-4 left-4 z-20 bg-[#0066FF] text-white text-[0.6rem] font-bold px-2.5 py-1 rounded-full shadow-lg">LEAD</div>}
                {/* Photo area with solid unified background */}
                <div class="relative overflow-hidden" style="background:#dbe8f8;padding-top:120%">
                  <img
                    src={doc.photo}
                    alt={`${doc.name} ${doc.title} 프로필 사진 - 서울365치과`}
                    title={`서울365치과 ${doc.name} ${doc.title}`}
                    class="absolute inset-0 w-full h-full object-contain object-bottom group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                    onerror={`this.onerror=null;this.src='${doc.photoFallback}'`}
                  />
                </div>
                {/* Info */}
                <div class="p-5 pt-3 text-center">
                  <h2 class="font-bold text-gray-900 text-xl">{doc.name}</h2>
                  <p class="text-[#0066FF] text-sm font-semibold mt-1">{doc.title}</p>
                  <div class="flex flex-wrap justify-center gap-1.5 mt-3">
                    {doc.specialties.slice(0, 3).map(s => (
                      <span class="text-[0.65rem] bg-[#0066FF]/8 text-[#0066FF] px-2.5 py-0.5 rounded-full font-medium">{s}</span>
                    ))}
                  </div>
                  <p class="text-gray-400 text-xs mt-3 line-clamp-1">{doc.education[0]}</p>
                  {doc.credentials[0] && <p class="text-[#0066FF]/60 text-xs mt-1 line-clamp-1">{doc.credentials[0]}</p>}
                  <p class="text-gray-400 text-[0.75rem] mt-3 italic line-clamp-2 leading-relaxed">"{doc.philosophy.split('.')[0]}."</p>
                  <div class="mt-4 text-sm text-[#0066FF] font-semibold group-hover:gap-2 transition-all flex items-center justify-center gap-1.5">
                    프로필 보기 <i class="fa-solid fa-arrow-right text-xs group-hover:translate-x-1 transition-transform"></i>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>,
    {
      title: '의료진 소개 | 서울365치과 서울대 5인 전문의',
      description: '서울365치과 의료진. 서울대 치대 출신 5인 원장 협진. 통합치의학·보존과·교정과 전문의. 인천 구월동. 032-432-0365',
      canonical: 'https://seoul365dc.kr/doctors',
      jsonLd: [
        {
          "@context": "https://schema.org", "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "홈", "item": "https://seoul365dc.kr" },
            { "@type": "ListItem", "position": 2, "name": "의료진", "item": "https://seoul365dc.kr/doctors" }
          ]
        },
        // AboutPage — doctors listing
        {
          "@context": "https://schema.org",
          "@type": ["AboutPage", "MedicalWebPage"],
          "name": "서울365치과 의료진 소개",
          "description": "서울365치과 의료진. 서울대학교 치과대학 출신 5인 원장이 한 팀으로 협진합니다.",
          "url": "https://seoul365dc.kr/doctors",
          "isPartOf": { "@id": "https://seoul365dc.kr/#website" },
          "about": { "@id": "https://seoul365dc.kr/#dentist" },
          "inLanguage": "ko-KR"
        },
        // ItemList — all doctors
        {
          "@context": "https://schema.org",
          "@type": "ItemList",
          "name": "서울365치과 의료진 목록",
          "description": "서울대 출신 5인 원장이 하나의 케이스를 함께 봅니다",
          "numberOfItems": doctors.length,
          "itemListElement": doctors.map((doc: any, i: number) => ({
            "@type": "ListItem",
            "position": i + 1,
            "url": `https://seoul365dc.kr/doctors/${doc.slug}`,
            "item": {
              "@type": "Physician",
              "name": doc.name,
              "jobTitle": doc.title,
              "image": `https://seoul365dc.kr${doc.photo}`,
              "medicalSpecialty": doc.specialties,
              "description": doc.philosophy.split('.')[0] + '.',
              "worksFor": { "@id": "https://seoul365dc.kr/#dentist" },
              "alumniOf": { "@type": "CollegeOrUniversity", "name": "서울대학교 치과대학" }
            }
          }))
        },
        // MedicalOrganization — team image
        {
          "@context": "https://schema.org",
          "@type": "ImageObject",
          "name": "서울365치과 의료진 단체사진",
          "url": "https://seoul365dc.kr/static/team-photo.jpg",
          "description": "서울365치과 의료진 단체사진 - 서울대 출신 5인 원장",
          "representativeOfPage": true
        },
        // MedicalOrganization — team composition
        {
          "@context": "https://schema.org",
          "@type": "MedicalOrganization",
          "name": "서울365치과 의료진",
          "description": "서울대학교 치과대학 출신 5인 원장이 한 팀으로 협진하는 인천 구월동 치과",
          "url": "https://seoul365dc.kr/doctors",
          "medicalSpecialty": ["Dentistry", "Implantology", "Orthodontics", "Endodontics", "Prosthodontics"],
          "employee": doctors.map((doc: any) => ({
            "@type": "Physician",
            "name": doc.name,
            "jobTitle": doc.title,
            "image": `https://seoul365dc.kr${doc.photo}`,
            "medicalSpecialty": doc.specialties,
            "alumniOf": { "@type": "CollegeOrUniversity", "name": "서울대학교 치과대학" },
            "url": `https://seoul365dc.kr/doctors/${doc.slug}`,
          })),
          "numberOfEmployees": { "@type": "QuantitativeValue", "value": 5, "unitText": "원장" },
        },
        // Speakable for AEO (doctors page)
        {
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "의료진 소개 | 서울365치과",
          "url": "https://seoul365dc.kr/doctors",
          "speakable": {
            "@type": "SpeakableSpecification",
            "cssSelector": ["h1", "h2", "blockquote", ".hero-sub"]
          }
        },
        // EducationalOrganization — alma mater emphasis (AEO)
        {
          "@context": "https://schema.org",
          "@type": "CollegeOrUniversity",
          "name": "서울대학교 치과대학",
          "alternateName": "Seoul National University School of Dentistry",
          "alumni": doctors.map((doc: any) => ({
            "@type": "Person",
            "name": doc.name,
            "jobTitle": doc.title,
            "worksFor": { "@id": "https://seoul365dc.kr/#dentist" }
          })),
        },
      ]
    }
  )
})

// ============================================================
// DOCTOR PROFILE
// ============================================================
doctorRoutes.get('/doctors/:slug', (c) => {
  const slug = c.req.param('slug');
  const doc = getDoctorBySlug(slug);
  if (!doc) return c.notFound();
  const story = DOCTOR_STORIES[slug];

  return c.render(
    <>
      <section class="treatment-hero">
        <div class="relative z-10 max-w-[1400px] mx-auto px-5 md:px-8 py-28 md:py-36">

          <div class="md:flex items-center gap-8 reveal" style="transition-delay:0.4s">
            <div class="w-32 h-32 rounded-full overflow-hidden border-2 border-[#0066FF]/20 flex-shrink-0 mx-auto md:mx-0 mb-6 md:mb-0" style="box-shadow:0 0 30px rgba(0,102,255,0.15);background:#dbe8f8">
              <img 
                src={doc.photo} 
                alt={`${doc.name} ${doc.titleShort} 프로필 사진`}
                class="w-full h-full object-contain object-bottom" 
                loading="eager"
                onerror={`this.onerror=null;this.src='${doc.photoFallback}'`}
              />
            </div>
            <div class="text-center md:text-left">
              <h1 class="text-3xl md:text-4xl font-bold text-white">{doc.h1}</h1>
              {story && (
                <p class="text-[#00E5FF] text-sm font-semibold mt-2 italic">"{story.principle}"</p>
              )}
              <div class="flex flex-wrap justify-center md:justify-start gap-2 mt-4">
                {doc.specialties.map(s => <span class="text-[0.75rem] bg-white/[0.06] text-white/60 px-3 py-1.5 rounded-full border border-white/[0.06]">{s}</span>)}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="section-lg bg-mesh">
        <div class="max-w-4xl mx-auto px-5 md:px-8">
          <h2 class="sr-only">프로필 상세</h2>
          {/* Story-type Introduction */}
          {story ? (
            <div class="mb-14 reveal">
              <div class="premium-card p-8 md:p-10">
                <h3 class="font-bold text-gray-900 text-lg mb-6 flex items-center gap-2">
                  <i class="fa-solid fa-book-open text-[#0066FF]"></i> 소개
                </h3>
                <div class="text-gray-600 text-[0.95rem] leading-[1.9] space-y-4">
                  {story.storyIntro.split('\n\n').map(paragraph => (
                    <p>{paragraph}</p>
                  ))}
                </div>
                {/* 3-line profile summary */}
                <div class="mt-8 pt-6 border-t border-gray-100">
                  <div class="flex flex-wrap gap-3">
                    {story.profileSummary.map(line => (
                      <div class="flex items-start gap-2 text-sm text-gray-500">
                        <i class="fa-solid fa-check text-[#0066FF] text-xs mt-1 flex-shrink-0"></i>
                        <span>{line}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <blockquote class="text-xl text-gray-600 italic border-l-3 border-[#0066FF] pl-6 mb-14 leading-relaxed reveal" style="border-left-width:3px">
              "{doc.philosophy}"
            </blockquote>
          )}

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 stagger-children">
            <div class="glass-card p-7">
              <h3 class="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2"><i class="fa-solid fa-graduation-cap text-[#0066FF]"></i> 학력</h3>
              <ul class="space-y-2.5">{doc.education.map(e => <li class="text-gray-600 flex items-start gap-2.5 text-[0.9rem]"><span class="w-1 h-1 bg-[#0066FF] rounded-full mt-2.5 flex-shrink-0"></span>{e}</li>)}</ul>
            </div>

            {doc.credentials.length > 0 && (
              <div class="glass-card p-7">
                <h3 class="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2"><i class="fa-solid fa-certificate text-[#0066FF]"></i> 자격/전문의</h3>
                <ul class="space-y-2.5">{doc.credentials.map(e => <li class="text-gray-600 flex items-start gap-2.5 text-[0.9rem]"><span class="w-1 h-1 bg-[#0066FF] rounded-full mt-2.5 flex-shrink-0"></span>{e}</li>)}</ul>
              </div>
            )}

            <div class="glass-card p-7">
              <h3 class="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2"><i class="fa-solid fa-briefcase text-[#0066FF]"></i> 경력</h3>
              <ul class="space-y-2.5">{doc.career.map(e => <li class="text-gray-600 flex items-start gap-2.5 text-[0.9rem]"><span class="w-1 h-1 bg-[#0066FF] rounded-full mt-2.5 flex-shrink-0"></span>{e}</li>)}</ul>
            </div>

            {doc.societies.length > 0 && (
              <div class="glass-card p-7">
                <h3 class="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2"><i class="fa-solid fa-users text-[#0066FF]"></i> 학회</h3>
                <ul class="space-y-2.5">{doc.societies.map(e => <li class="text-gray-600 flex items-start gap-2.5 text-[0.9rem]"><span class="w-1 h-1 bg-[#0066FF] rounded-full mt-2.5 flex-shrink-0"></span>{e}</li>)}</ul>
              </div>
            )}
          </div>

          {/* Treatment Links */}
          <div class="mt-12 reveal">
            <h3 class="font-bold text-gray-900 text-lg mb-5 flex items-center gap-2"><i class="fa-solid fa-stethoscope text-[#0066FF]"></i> 담당 치료</h3>
            <div class="flex flex-wrap gap-3">
              {doc.treatmentLinks.map(link => {
                const treat = getTreatmentBySlug(link.split('/').pop()!);
                return treat ? (
                  <a href={link} class="btn-premium btn-premium-outline text-sm px-5 py-2.5" data-cursor-hover>
                    <i class={`fa-solid ${treat.icon} text-xs`}></i> {treat.name}
                  </a>
                ) : null;
              })}
            </div>
          </div>
        </div>
      </section>

      <section class="cta-dark section-md">
        <div class="relative z-10 max-w-4xl mx-auto px-5 md:px-8 text-center reveal-blur">
          <h2 class="text-2xl md:text-3xl font-bold text-white mb-4">{doc.name} {doc.titleShort}에게 상담받기</h2>
          <div class="flex flex-wrap justify-center gap-3 mt-6">
            <a href={CLINIC.phoneTel} class="btn-premium btn-premium-white" data-cursor-hover><i class="fa-solid fa-phone"></i> 전화 상담</a>
            <a href="/reservation" class="btn-premium btn-premium-fill" data-cursor-hover><i class="fa-solid fa-calendar-check"></i> 예약하기</a>
          </div>
        </div>
      </section>
    </>,
    {
      title: doc.metaTitle,
      description: doc.metaDesc,
      canonical: `https://seoul365dc.kr/doctors/${doc.slug}`,
      jsonLd: [
        // Physician (detailed)
        {
          "@context": "https://schema.org", "@type": "Physician",
          "@id": `https://seoul365dc.kr/doctors/${doc.slug}#physician`,
          "name": doc.name, "jobTitle": doc.title,
          "description": doc.philosophy,
          "image": `https://seoul365dc.kr${doc.photo}`,
          "medicalSpecialty": doc.specialties,
          "alumniOf": doc.education.map((edu: string) => ({
            "@type": "EducationalOrganization",
            "name": edu
          })),
          "worksFor": { "@type": "Dentist", "@id": "https://seoul365dc.kr/#dentist", "name": "서울365치과의원", "url": "https://seoul365dc.kr" },
          "knowsAbout": doc.specialties,
          "hasCredential": doc.credentials.map((cred: string) => ({
            "@type": "EducationalOccupationalCredential",
            "credentialCategory": cred,
          })),
          "memberOf": doc.societies.map((soc: string) => ({
            "@type": "Organization",
            "name": soc
          })),
          "hasOccupation": {
            "@type": "Occupation",
            "name": "치과의사",
            "occupationalCategory": "29-1021",
            "qualifications": doc.credentials.join(', '),
            "skills": doc.specialties.join(', '),
          },
          "availableService": doc.specialties.map((s: string) => ({
            "@type": "MedicalProcedure", "name": s
          })),
          "url": `https://seoul365dc.kr/doctors/${doc.slug}`,
        },
        // ProfilePage
        {
          "@context": "https://schema.org",
          "@type": "ProfilePage",
          "name": `${doc.name} ${doc.title} 프로필`,
          "url": `https://seoul365dc.kr/doctors/${doc.slug}`,
          "mainEntity": { "@id": `https://seoul365dc.kr/doctors/${doc.slug}#physician` },
          "isPartOf": { "@id": "https://seoul365dc.kr/#website" },
          "inLanguage": "ko-KR",
          "dateModified": new Date().toISOString().split('T')[0]
        },
        // BreadcrumbList
        {
          "@context": "https://schema.org", "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "홈", "item": "https://seoul365dc.kr" },
            { "@type": "ListItem", "position": 2, "name": "의료진", "item": "https://seoul365dc.kr/doctors" },
            { "@type": "ListItem", "position": 3, "name": doc.name, "item": `https://seoul365dc.kr/doctors/${doc.slug}` }
          ]
        },
        // Person schema (supplementary)
        {
          "@context": "https://schema.org",
          "@type": "Person",
          "name": doc.name,
          "jobTitle": doc.title,
          "image": `https://seoul365dc.kr${doc.photo}`,
          "worksFor": { "@id": "https://seoul365dc.kr/#dentist" },
          "alumniOf": { "@type": "CollegeOrUniversity", "name": "서울대학교 치과대학" },
          "nationality": { "@type": "Country", "name": "KR" },
          "knowsLanguage": ["ko", "en"],
        },
        // EducationalOccupationalCredential — detailed credentials
        ...(doc.credentials.length > 0 ? [{
          "@context": "https://schema.org",
          "@type": "ItemList",
          "name": `${doc.name} 자격 및 인증`,
          "itemListElement": doc.credentials.map((cred: string, i: number) => ({
            "@type": "ListItem",
            "position": i + 1,
            "item": {
              "@type": "EducationalOccupationalCredential",
              "credentialCategory": cred,
              "recognizedBy": { "@type": "Organization", "name": "보건복지부" },
            }
          }))
        }] : []),
        // MedicalScholarlyArticle — doctor's expertise signal (AEO)
        {
          "@context": "https://schema.org",
          "@type": "MedicalScholarlyArticle",
          "name": `${doc.name} ${doc.title} — 진료 철학과 전문 분야`,
          "author": { "@type": "Physician", "name": doc.name, "@id": `https://seoul365dc.kr/doctors/${doc.slug}#physician` },
          "about": doc.specialties.map((s: string) => ({ "@type": "MedicalEntity", "name": s })),
          "publisher": { "@id": "https://seoul365dc.kr/#dentist" },
          "inLanguage": "ko-KR",
          "datePublished": "2024-01-01",
        },
        // Speakable for AEO (doctor detail page)
        {
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": doc.metaTitle,
          "url": `https://seoul365dc.kr/doctors/${doc.slug}`,
          "speakable": {
            "@type": "SpeakableSpecification",
            "cssSelector": ["h1", "h3", "blockquote", ".hero-sub"]
          }
        },
        // Occupation schema — structured job data
        {
          "@context": "https://schema.org",
          "@type": "Occupation",
          "name": "치과의사",
          "occupationalCategory": "29-1021.00",
          "qualifications": doc.credentials.join(', ') || '서울대학교 치과대학 졸업',
          "skills": doc.specialties.join(', '),
          "estimatedSalary": { "@type": "MonetaryAmountDistribution", "currency": "KRW" },
          "occupationLocation": { "@type": "City", "name": "인천광역시" },
        },
      ]
    }
  )
})


export default doctorRoutes
