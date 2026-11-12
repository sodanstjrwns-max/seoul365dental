import { Hono } from 'hono'
import { CONTENT_DATES } from '../lib/content-dates'
import type { Bindings } from '../lib/types'
import { CLINIC } from '../data/clinic'
import { doctors, getDoctorBySlug } from '../data/doctors'
import { getTreatmentBySlug } from '../data/treatments'
import { DOCTOR_STORIES } from '../data/brand'
import { Icon } from '../lib/icons'

const doctorRoutes = new Hono<{ Bindings: Bindings }>()

doctorRoutes.get('/doctors', (c) => {
  return c.render(
    <>
      <section class="phead" aria-labelledby="dr-h1">
        <div class="wrap phead-in">
          <div class="phead-text">
            <nav class="crumb" aria-label="현재 위치"><ol><li><a href="/">홈</a></li><li aria-current="page">의료진</li></ol></nav>
            <p class="eyebrow">Our doctors · {doctors.length}</p>
            <h1 id="dr-h1" class="display-xl">서울365치과 의료진 소개</h1>
            <p class="lead hero-sub">서울대 출신 원장들이 하나의 케이스를 함께 봅니다.</p>
            <p class="t-mute" style="font-size:.92rem;margin:0 0 1.6rem">서울대 출신 원장 · 전문 스태프 20여 명이 함께합니다.</p>
            <div class="phead-cta">
              <a href="/reservation" class="btn btn-primary"><Icon name="calendar" />상담 예약</a>
              <a href={CLINIC.phoneTel} class="btn btn-light mono"><Icon name="phone" />{CLINIC.phone}</a>
            </div>
          </div>
          <div class="phead-aside">
            <div class="phead-img wide"><img src="/static/team-photo.jpg" alt="서울365치과 의료진 단체사진" width="1024" height="683" loading="eager" decoding="async" /></div>
          </div>
        </div>
      </section>

      <section class="sec">
        <div class="wrap">
          <div class="dr-grid" data-rv-group>
            {doctors.map((doc, i) => (
              <a href={`/doctors/${doc.slug}`} class="card dr-tile hover">
                <div class="dr-tile-ph">
                  {i === 0 && <span class="lead-badge">LEAD</span>}
                  <img src={doc.photo} alt={`${doc.name} ${doc.title} 프로필 사진 - 서울365치과`} title={`서울365치과 ${doc.name} ${doc.title}`} width="797" height="1024" loading="lazy" decoding="async" onerror={`this.onerror=null;this.src='${doc.photoFallback}'`} />
                </div>
                <div class="dr-tile-body">
                  <span class="tag">{doc.title}</span>
                  <h2>{doc.name}</h2>
                  <p class="sp">{doc.specialties.slice(0, 3).join(' · ')}</p>
                  <p class="edu">{doc.education[0]}{doc.credentials[0] ? ` · ${doc.credentials[0]}` : ''}</p>
                  <blockquote>“{doc.philosophy.split('.')[0]}.”</blockquote>
                  <span class="arrow-link">프로필 보기<Icon name="arrow" /></span>
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
            "cssSelector": ["h1", ".hero-sub", "h2"]
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
  // 2026-11-11 원장 요청으로 프로필을 내린 원장 — 옛 주소는 의료진 목록으로 보낸다
  if (slug === 'sang-sehoon') return c.redirect('/doctors', 301);
  const doc = getDoctorBySlug(slug);
  if (!doc) return c.notFound();
  const story = DOCTOR_STORIES[slug];
  // h1 "이름 직함 – 소속/전문의"를 두 줄로(글자는 그대로, 대시는 화면에서만 숨김) — 의미 중간 줄바꿈 방지
  const h1Parts = doc.h1.split(/\s[–-]\s/);

  return c.render(
    <>
      <section class="phead" aria-labelledby="doc-h1">
        <div class="wrap phead-in">
          <div class="phead-text">
            <nav class="crumb" aria-label="현재 위치"><ol><li><a href="/">홈</a></li><li><a href="/doctors">의료진</a></li><li aria-current="page">{doc.name}</li></ol></nav>
            <p class="eyebrow">{doc.title}</p>
            <h1 id="doc-h1" class="display-xl">{h1Parts.length === 2 ? <><span class="block">{h1Parts[0]}</span><span class="sr-only"> – </span><span class="block h1-sub">{h1Parts[1]}</span></> : doc.h1}</h1>
            {story && <p class="lead quote">“{story.principle}”</p>}
            <div class="chips">{doc.specialties.map(s => <span class="chip">{s}</span>)}</div>
            <div class="phead-cta">
              <a href="/reservation" class="btn btn-primary"><Icon name="calendar" />예약하기</a>
              <a href={CLINIC.phoneTel} class="btn btn-light mono"><Icon name="phone" />{CLINIC.phone}</a>
            </div>
          </div>
          <div class="phead-aside">
            <div class="prof-photo">
              <img src={doc.photo} alt={`${doc.name} ${doc.titleShort} 프로필 사진`} width="797" height="1024" loading="eager" decoding="async" onerror={`this.onerror=null;this.src='${doc.photoFallback}'`} />
            </div>
          </div>
        </div>
      </section>

      <section class="sec">
        <div class="wrap-n">
          <h2 class="sr-only">프로필 상세</h2>
          {story ? (
            <div class="card prose-card" data-rv>
              <h3 class="box-h">소개</h3>
              {story.storyIntro.split('\n\n').map(paragraph => <p>{paragraph}</p>)}
              <ul class="check-list compact">
                {story.profileSummary.map(line => <li><Icon name="check" /><span>{line}</span></li>)}
              </ul>
            </div>
          ) : (
            <blockquote class="quote-big" data-rv>“{doc.philosophy}”</blockquote>
          )}

          <div class="prof-grid" data-rv-group>
            <div class="card prof-box">
              <h3 class="box-h">학력</h3>
              <ul>{doc.education.map(e => <li>{e}</li>)}</ul>
            </div>
            {doc.credentials.length > 0 && (
              <div class="card prof-box">
                <h3 class="box-h">자격 / 전문의</h3>
                <ul>{doc.credentials.map(e => <li>{e}</li>)}</ul>
              </div>
            )}
            <div class="card prof-box">
              <h3 class="box-h">경력</h3>
              <ul>{doc.career.map(e => <li>{e}</li>)}</ul>
            </div>
            {doc.societies.length > 0 && (
              <div class="card prof-box">
                <h3 class="box-h">학회</h3>
                <ul>{doc.societies.map(e => <li>{e}</li>)}</ul>
              </div>
            )}
          </div>

          <div class="prof-tx" data-rv>
            <h3 class="box-h">담당 치료</h3>
            <div class="tx-all">
              {doc.treatmentLinks.map(link => {
                const treat = getTreatmentBySlug(link.split('/').pop()!);
                return treat ? <a href={link}>{treat.name}</a> : null;
              })}
            </div>
          </div>
        </div>
      </section>

      <section class="cta-band" aria-label="상담 안내">
        <div class="wrap-n" style="text-align:center;position:relative">
          <p class="eyebrow eyebrow-light no-bar" style="justify-content:center" data-rv>Consultation</p>
          <h2 class="display-xl" data-rv>{doc.name} {doc.titleShort}에게 상담받기</h2>
          <div class="cta-actions" style="margin-top:2rem" data-rv-group>
            <a href={CLINIC.phoneTel} class="btn btn-white btn-lg"><Icon name="phone" />전화 상담</a>
            <a href="/reservation" class="btn btn-primary btn-lg"><Icon name="calendar" />예약하기</a>
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
          "dateModified": CONTENT_DATES.doctors
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
          "alumniOf": { "@type": "CollegeOrUniversity", "name": (doc.education[0] || '서울대학교 치과대학').replace(/\s*(졸업|우등졸업|수련|석사|박사).*$/, '') },
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
            "cssSelector": story ? ["h1", "h3"] : ["h1", "blockquote", "h3"]
          }
        },
        // Occupation schema — structured job data
        {
          "@context": "https://schema.org",
          "@type": "Occupation",
          "name": "치과의사",
          "occupationalCategory": "29-1021.00",
          "qualifications": doc.credentials.join(', ') || (doc.education[0] || '서울대학교 치과대학 졸업'),
          "skills": doc.specialties.join(', '),
          "estimatedSalary": { "@type": "MonetaryAmountDistribution", "currency": "KRW" },
          "occupationLocation": { "@type": "City", "name": "인천광역시" },
        },
      ]
    }
  )
})


export default doctorRoutes
