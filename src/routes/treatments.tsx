import { Hono } from 'hono'
import type { Bindings } from '../lib/types'
import { CLINIC } from '../data/clinic'
import { treatments, getTreatmentBySlug, treatmentCategories } from '../data/treatments'
import { TREATMENT_EMPATHY } from '../data/brand'

const treatmentRoutes = new Hono<{ Bindings: Bindings }>()

treatmentRoutes.get('/treatments', (c) => {
  return c.render(
    <>
      <section class="treatment-hero">
        <div class="relative z-10 max-w-[1400px] mx-auto px-5 md:px-8 py-28 md:py-36">
          <h1 class="section-headline text-white mb-4 reveal" style="transition-delay:0.4s">서울365치과 전체 진료 안내</h1>
          <p class="hero-sub text-white/35 max-w-xl reveal" style="transition-delay:0.6s">각 분야 전문의가 최적의 치료를 제안합니다.</p>
        </div>
      </section>

      <section class="section-lg bg-mesh">
        <div class="max-w-[1400px] mx-auto px-5 md:px-8">
          {treatmentCategories.map(cat => (
            <div class="mb-16 last:mb-0">
              <div class="flex items-center gap-3 mb-7 reveal">
                <div class="icon-circle icon-circle-sm">
                  <i class={`fa-solid ${cat.icon}`}></i>
                </div>
                <h2 class="text-xl font-bold text-gray-900">{cat.name}</h2>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 stagger-children">
                {cat.treatments.map(t => (
                  <a href={`/treatments/${t.slug}`} class="glass-card p-5 group block" data-cursor-hover>
                    <div class="flex items-center gap-3">
                      <div class="icon-circle icon-circle-sm flex-shrink-0">
                        <i class={`fa-solid ${t.icon} text-sm`}></i>
                      </div>
                      <div class="min-w-0">
                        <h3 class="font-bold text-gray-900 text-sm group-hover:text-[#0066FF] transition-colors truncate">{t.name}</h3>
                        <p class="text-xs text-gray-400 truncate">{t.shortDesc}</p>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>,
    {
      title: '전체 진료 안내 | 서울365치과 인천 구월동',
      description: '서울365치과 전체 진료 안내. 임플란트·교정·수면진료·심미치료·소아치과. 서울대 5인 전문의. 032-432-0365',
      canonical: 'https://seoul365dc.kr/treatments',
      jsonLd: [
        {
          "@context": "https://schema.org", "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "홈", "item": "https://seoul365dc.kr" },
            { "@type": "ListItem", "position": 2, "name": "전체 진료", "item": "https://seoul365dc.kr/treatments" }
          ]
        },
        // CollectionPage — treatment listing
        {
          "@context": "https://schema.org",
          "@type": ["CollectionPage", "MedicalWebPage"],
          "name": "서울365치과 전체 진료 안내",
          "description": "서울365치과에서 제공하는 모든 치과 진료 안내. 임플란트, 교정, 수면진료, 심미치료, 소아치과 등.",
          "url": "https://seoul365dc.kr/treatments",
          "isPartOf": { "@id": "https://seoul365dc.kr/#website" },
          "about": { "@id": "https://seoul365dc.kr/#dentist" },
          "specialty": "Dentistry",
          "inLanguage": "ko-KR"
        },
        // ItemList — all treatments
        {
          "@context": "https://schema.org",
          "@type": "ItemList",
          "name": "서울365치과 전체 진료 목록",
          "numberOfItems": treatments.length,
          "itemListElement": treatments.map((t: any, i: number) => ({
            "@type": "ListItem",
            "position": i + 1,
            "name": t.name,
            "url": `https://seoul365dc.kr/treatments/${t.slug}`,
            "item": {
              "@type": "MedicalProcedure",
              "name": t.name,
              "description": t.metaDesc,
              "procedureType": t.slug.includes('orthodontic') || t.slug.includes('invisalign') ? "NonSurgicalProcedure" : "SurgicalProcedure",
              "bodyLocation": "Oral cavity"
            }
          }))
        },
        // MedicalWebPage — treatment listing specifics
        {
          "@context": "https://schema.org",
          "@type": "MedicalWebPage",
          "name": "서울365치과 전체 진료 안내",
          "url": "https://seoul365dc.kr/treatments",
          "lastReviewed": new Date().toISOString().split('T')[0],
          "reviewedBy": { "@type": "Physician", "name": "박준규", "worksFor": { "@id": "https://seoul365dc.kr/#dentist" } },
          "specialty": "Dentistry",
          "speakable": {
            "@type": "SpeakableSpecification",
            "cssSelector": ["h1", "h2", ".section-headline"]
          },
        },
        // Service — dental service listing
        {
          "@context": "https://schema.org",
          "@type": "Service",
          "name": "서울365치과 종합 치과 진료",
          "description": "서울365치과에서 제공하는 전체 치과 진료 안내. 임플란트, 교정, 수면진료, 심미치료, 소아치과 등.",
          "provider": { "@id": "https://seoul365dc.kr/#dentist" },
          "serviceType": "치과 진료",
          "areaServed": { "@type": "City", "name": "인천광역시" },
          "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "진료 카테고리",
            "itemListElement": treatmentCategories.map((cat: any) => ({
              "@type": "OfferCatalog",
              "name": cat.name,
              "itemListElement": cat.treatments.map((t: any) => ({
                "@type": "Offer",
                "itemOffered": { "@type": "MedicalProcedure", "name": t.name, "url": `https://seoul365dc.kr/treatments/${t.slug}` }
              }))
            }))
          }
        },
      ]
    }
  )
})

// ============================================================
// TREATMENT DETAIL
// ============================================================
treatmentRoutes.get('/treatments/:slug', (c) => {
  const slug = c.req.param('slug');
  const t = getTreatmentBySlug(slug);
  if (!t) return c.notFound();
  const empathy = TREATMENT_EMPATHY[slug];

  return c.render(
    <>
      {/* Hero — Persona-based Empathy */}
      <section class="treatment-hero">
        <div class="relative z-10 max-w-[1400px] mx-auto px-5 md:px-8 py-28 md:py-36">

          {empathy ? (
            <>
              <h1 class="hero-display text-white mb-5 reveal" style="font-size:clamp(2rem,6vw,4.5rem);transition-delay:0.4s;white-space:pre-line">{empathy.heroTagline}</h1>
              <p class="hero-sub text-white/40 max-w-2xl mb-8 reveal" style="transition-delay:0.6s">{empathy.heroSub}</p>
            </>
          ) : (
            <>
              <h1 class="hero-display text-white mb-5 reveal" style="font-size:clamp(2rem,6vw,4.5rem);transition-delay:0.4s">{t.heroTitle}</h1>
              <p class="hero-sub text-white/35 max-w-2xl mb-8 reveal" style="transition-delay:0.6s">{t.heroSub}</p>
            </>
          )}
          <div class="flex flex-wrap gap-3 reveal" style="transition-delay:0.8s">
            <a href="/reservation" class="btn-premium btn-premium-fill" data-cursor-hover><i class="fa-solid fa-calendar-check"></i> 상담 예약</a>
            <a href="/info" class="btn-premium btn-premium-white" data-cursor-hover><i class="fa-solid fa-won-sign"></i> 비용 안내</a>
          </div>
        </div>
      </section>

      {/* Concerns */}
      <section class="section-lg bg-mesh">
        <div class="max-w-4xl mx-auto px-5 md:px-8">
          <div class="text-center mb-14 reveal">
            <span class="section-eyebrow text-[#0066FF] mb-3 block">FOR YOU</span>
            <h2 class="section-sub-headline text-gray-900">{t.name}, 이런 고민 있으신가요?</h2>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 stagger-children">
            {t.concerns.map(concern => (
              <div class="glass-card p-5 flex items-start gap-3">
                <div class="w-8 h-8 rounded-lg bg-[#0066FF]/8 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <i class="fa-solid fa-circle-check text-[#0066FF] text-sm"></i>
                </div>
                <p class="text-gray-700 text-[0.9rem] leading-relaxed">{concern}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Types */}
      <section class="section-lg bg-white">
        <div class="max-w-[1400px] mx-auto px-5 md:px-8">
          <div class="text-center mb-14 reveal">
            <span class="section-eyebrow text-[#0066FF] mb-3 block">TYPES</span>
            <h2 class="section-sub-headline text-gray-900">서울365치과 {t.name} 종류</h2>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-5 stagger-children">
            {t.types.map(type => (
              <div class="premium-card p-7 tilt-card">
                <h3 class="font-bold text-gray-900 text-lg mb-3">{type.name}</h3>
                <p class="text-gray-500 text-[0.9rem] leading-relaxed">{type.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Detail Sections — 상세 정보 */}
      {t.detailSections && t.detailSections.length > 0 && (
        <section class="section-lg bg-mesh">
          <div class="max-w-4xl mx-auto px-5 md:px-8">
            <div class="text-center mb-14 reveal">
              <span class="section-eyebrow text-[#0066FF] mb-3 block">DETAILS</span>
              <h2 class="section-sub-headline text-gray-900">{t.name} 상세 정보</h2>
            </div>
            <div class="space-y-5 stagger-children">
              {t.detailSections.map(section => (
                <div class="glass-card p-7">
                  <div class="flex items-start gap-4">
                    {section.icon && (
                      <div class="icon-circle flex-shrink-0">
                        <i class={`fa-solid ${section.icon}`}></i>
                      </div>
                    )}
                    <div>
                      <h3 class="font-bold text-gray-900 text-lg mb-3">{section.title}</h3>
                      <p class="text-gray-600 text-[0.9rem] leading-[1.85]">{section.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Why Us */}
      <section class="section-lg bg-mesh">
        <div class="max-w-[1400px] mx-auto px-5 md:px-8">
          <div class="text-center mb-14 reveal">
            <span class="section-eyebrow text-[#0066FF] mb-3 block">WHY US</span>
            <h2 class="section-sub-headline text-gray-900">왜 서울365치과의 {t.name}인가요?</h2>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children">
            {t.whyUs.map(w => (
              <div class="glass-card p-7 group tilt-card">
                <div class="icon-circle mb-5">
                  <i class={`fa-solid ${w.icon}`}></i>
                </div>
                <h3 class="font-bold text-gray-900 mb-2 group-hover:text-[#0066FF] transition-colors">{w.title}</h3>
                <p class="text-gray-500 text-[0.9rem] leading-relaxed">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      {t.comparisonTable && t.comparisonTable.length > 0 && t.comparisonHeaders && (
        <section class="section-lg bg-white">
          <div class="max-w-4xl mx-auto px-5 md:px-8">
            <div class="text-center mb-14 reveal">
              <span class="section-eyebrow text-[#0066FF] mb-3 block">COMPARE</span>
              <h2 class="section-sub-headline text-gray-900">{t.name} 비교</h2>
            </div>
            <div class="glass-card overflow-hidden reveal">
              <div class="overflow-x-auto">
                <table class="w-full text-sm">
                  <thead>
                    <tr class="bg-gradient-to-r from-[#0066FF]/5 to-[#0066FF]/10">
                      {t.comparisonHeaders.map((h: string) => (
                        <th class="px-4 py-4 text-left font-bold text-gray-800 whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {t.comparisonTable.map((row, i) => (
                      <tr class={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                        <td class="px-4 py-3.5 font-semibold text-gray-800 whitespace-nowrap">{row.item}</td>
                        {row.values.map((v: string) => (
                          <td class="px-4 py-3.5 text-gray-600">{v}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Process */}
      <section class="section-lg bg-white" itemscope itemtype="https://schema.org/HowTo">
        <meta itemprop="name" content={`${t.name} 치료 과정`} />
        <meta itemprop="description" content={`서울365치과의 ${t.name} 치료는 다음 단계로 진행됩니다.`} />
        <meta itemprop="totalTime" content="PT1H" />
        <div class="max-w-3xl mx-auto px-5 md:px-8">
          <div class="text-center mb-14 reveal">
            <span class="section-eyebrow text-[#0066FF] mb-3 block">PROCESS</span>
            <h2 class="section-sub-headline text-gray-900">{t.name} 치료 과정</h2>
          </div>
          <div class="space-y-0 stagger-children">
            {t.process.map((step, i) => (
              <div class="timeline-line flex gap-5 pb-8" itemprop="step" itemscope itemtype="https://schema.org/HowToStep">
                <meta itemprop="position" content={String(i + 1)} />
                <div class="timeline-dot" aria-label={`${i + 1}단계`}>{i + 1}</div>
                <div class="pt-3">
                  <h3 class="font-bold text-gray-900" itemprop="name">{step.step}</h3>
                  {step.desc && <p class="text-gray-500 text-sm mt-1" itemprop="text">{step.desc}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Warnings & Aftercare */}
      {(t.warnings && t.warnings.length > 0) || (t.aftercare && t.aftercare.length > 0) ? (
        <section class="section-lg bg-mesh">
          <div class="max-w-4xl mx-auto px-5 md:px-8">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 stagger-children">
              {/* Warnings */}
              {t.warnings && t.warnings.length > 0 && (
                <div class="glass-card p-7">
                  <div class="flex items-center gap-3 mb-5">
                    <div class="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                      <i class="fa-solid fa-triangle-exclamation text-amber-500"></i>
                    </div>
                    <h3 class="font-bold text-gray-900 text-lg">주의사항</h3>
                  </div>
                  <ul class="space-y-3">
                    {t.warnings.map(w => (
                      <li class="flex items-start gap-2.5 text-[0.9rem] text-gray-600 leading-relaxed">
                        <i class="fa-solid fa-circle-exclamation text-amber-400 text-xs mt-1.5 flex-shrink-0"></i>
                        {w}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {/* Aftercare */}
              {t.aftercare && t.aftercare.length > 0 && (
                <div class="glass-card p-7">
                  <div class="flex items-center gap-3 mb-5">
                    <div class="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                      <i class="fa-solid fa-heart-pulse text-emerald-500"></i>
                    </div>
                    <h3 class="font-bold text-gray-900 text-lg">치료 후 관리</h3>
                  </div>
                  <ul class="space-y-3">
                    {t.aftercare.map(a => (
                      <li class="flex items-start gap-2.5 text-[0.9rem] text-gray-600 leading-relaxed">
                        <i class="fa-solid fa-check-circle text-emerald-400 text-xs mt-1.5 flex-shrink-0"></i>
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </section>
      ) : null}

      {/* Patient Cases */}
      {t.patientCases && t.patientCases.length > 0 && (
        <section class="section-lg bg-white">
          <div class="max-w-4xl mx-auto px-5 md:px-8">
            <div class="text-center mb-14 reveal">
              <span class="section-eyebrow text-[#0066FF] mb-3 block">CASES</span>
              <h2 class="section-sub-headline text-gray-900">{t.name} 치료 사례</h2>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5 stagger-children">
              {t.patientCases.map(pc => (
                <div class="glass-card p-7 group hover:border-[#0066FF]/20 transition-all">
                  <div class="flex items-center gap-3 mb-3">
                    <span class="px-3 py-1 bg-[#0066FF]/8 text-[#0066FF] text-xs font-semibold rounded-full">{pc.tag}</span>
                  </div>
                  <h3 class="font-bold text-gray-900 mb-2 group-hover:text-[#0066FF] transition-colors">{pc.title}</h3>
                  <p class="text-gray-500 text-[0.9rem] leading-relaxed">{pc.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Materials */}
      {t.materials && t.materials.length > 0 && (
        <section class="section-lg bg-mesh">
          <div class="max-w-4xl mx-auto px-5 md:px-8">
            <div class="text-center mb-14 reveal">
              <span class="section-eyebrow text-[#0066FF] mb-3 block">MATERIALS</span>
              <h2 class="section-sub-headline text-gray-900">사용 재료 및 장비</h2>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
              {t.materials.map(m => (
                <div class="glass-card p-5 flex flex-col">
                  {m.grade && <span class="text-[0.7rem] font-semibold text-[#0066FF] uppercase tracking-wider mb-2">{m.grade}</span>}
                  <h3 class="font-bold text-gray-900 text-[0.95rem] mb-1.5">{m.name}</h3>
                  <p class="text-gray-500 text-[0.85rem] leading-relaxed">{m.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section class="section-lg bg-white" itemscope itemtype="https://schema.org/FAQPage">
        <div class="max-w-3xl mx-auto px-5 md:px-8">
          <div class="text-center mb-14 reveal">
            <span class="section-eyebrow text-[#0066FF] mb-3 block">FAQ</span>
            <h2 class="section-sub-headline text-gray-900">{t.name} 자주 묻는 질문</h2>
          </div>
          <div class="space-y-3 stagger-children">
            {t.faq.map(faq => (
              <div class="faq-item" itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
                <button class="faq-toggle w-full text-left px-6 py-5 flex items-center justify-between hover:bg-gray-50/50 transition-colors" data-cursor-hover>
                  <h3 class="font-semibold text-gray-800 text-[0.9rem] pr-4" itemprop="name">{faq.q}</h3>
                  <i class="fa-solid fa-chevron-down text-gray-300 text-sm faq-icon flex-shrink-0"></i>
                </button>
                <div class="hidden px-6 pb-5" itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
                  <p class="text-gray-500 text-[0.9rem] leading-relaxed" itemprop="text">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section class="cta-dark section-md">
        <div class="relative z-10 max-w-4xl mx-auto px-5 md:px-8 text-center reveal-blur">
          <h2 class="text-2xl md:text-3xl font-bold text-white mb-4">지금 바로 상담 예약하세요</h2>
          <p class="text-white/35 mb-8">{t.name}에 대해 자세히 상담받아 보세요.</p>
          <div class="flex flex-wrap justify-center gap-3">
            <a href={CLINIC.phoneTel} class="btn-premium btn-premium-white" data-cursor-hover><i class="fa-solid fa-phone"></i> 전화 상담</a>
            <a href={CLINIC.kakao} target="_blank" rel="noopener" class="btn-premium" style="background:#FEE500;color:#3C1E1E;border:none;" data-cursor-hover><i class="fa-solid fa-comment"></i> 카카오톡</a>
            <a href="/reservation" class="btn-premium btn-premium-fill" data-cursor-hover><i class="fa-solid fa-calendar-check"></i> 예약하기</a>
          </div>
        </div>
      </section>

      {/* Related Treatments */}
      {t.relatedSlugs && t.relatedSlugs.length > 0 && (
        <section class="section-md bg-mesh">
          <div class="max-w-4xl mx-auto px-5 md:px-8">
            <div class="text-center mb-10 reveal">
              <span class="section-eyebrow text-[#0066FF] mb-3 block">RELATED</span>
              <h2 class="text-xl font-bold text-gray-900">관련 진료 안내</h2>
            </div>
            <div class="flex flex-wrap justify-center gap-3 stagger-children">
              {t.relatedSlugs.map(rs => {
                const related = getTreatmentBySlug(rs);
                return related ? (
                  <a href={`/treatments/${related.slug}`} class="glass-card px-5 py-3 flex items-center gap-2.5 hover:border-[#0066FF]/30 transition-all group" data-cursor-hover>
                    <i class={`fa-solid ${related.icon} text-[#0066FF] text-sm`}></i>
                    <span class="font-medium text-gray-700 group-hover:text-[#0066FF] transition-colors text-[0.9rem]">{related.name}</span>
                    <i class="fa-solid fa-arrow-right text-xs text-gray-300 group-hover:text-[#0066FF] transition-colors"></i>
                  </a>
                ) : null;
              })}
            </div>
          </div>
        </section>
      )}
    </>,
    {
      title: t.metaTitle,
      description: t.metaDesc,
      canonical: `https://seoul365dc.kr/treatments/${t.slug}`,
      jsonLd: [
        // MedicalWebPage
        {
          "@context": "https://schema.org",
          "@type": "MedicalWebPage",
          "name": t.metaTitle,
          "description": t.metaDesc,
          "url": `https://seoul365dc.kr/treatments/${t.slug}`,
          "isPartOf": { "@id": "https://seoul365dc.kr/#website" },
          "about": { "@type": "MedicalProcedure", "name": t.name },
          "specialty": "Dentistry",
          "lastReviewed": new Date().toISOString().split('T')[0],
          "reviewedBy": { "@type": "Physician", "name": "박준규", "worksFor": { "@id": "https://seoul365dc.kr/#dentist" } },
          "inLanguage": "ko-KR"
        },
        // MedicalProcedure (detailed)
        {
          "@context": "https://schema.org", "@type": "MedicalProcedure",
          "@id": `https://seoul365dc.kr/treatments/${t.slug}#procedure`,
          "name": t.name,
          "procedureType": t.slug.includes('orthodontic') || t.slug.includes('invisalign') ? "NonSurgicalProcedure" : "SurgicalProcedure",
          "bodyLocation": "Oral cavity",
          "description": t.metaDesc,
          "howPerformed": t.process?.map((s: any) => s.step).join(' → '),
          "preparation": "정밀 CT 촬영 및 디지털 스캔 진단",
          "followup": "정기 검진 및 유지 관리",
          "status": "EventScheduled",
          "recognizingAuthority": { "@type": "Organization", "name": "대한치과의사협회" },
          "relevantSpecialty": { "@type": "MedicalSpecialty", "name": "Dentistry" },
          "study": { "@type": "MedicalStudy", "studySubject": { "@type": "MedicalEntity", "name": t.name } },
        },
        // MedicalCondition (what this treatment addresses)
        {
          "@context": "https://schema.org",
          "@type": "MedicalCondition",
          "name": `${t.name} 적응증`,
          "description": t.concerns?.join('. '),
          "possibleTreatment": {
            "@type": "MedicalProcedure",
            "name": t.name,
            "url": `https://seoul365dc.kr/treatments/${t.slug}`
          },
          "signOrSymptom": t.concerns?.map((c: string) => ({
            "@type": "MedicalSignOrSymptom",
            "name": c
          })),
        },
        // Service + Offer
        {
          "@context": "https://schema.org",
          "@type": "Service",
          "name": `${t.name} - 서울365치과`,
          "description": t.metaDesc,
          "provider": { "@id": "https://seoul365dc.kr/#dentist" },
          "serviceType": "치과 진료",
          "areaServed": { "@type": "City", "name": "인천광역시" },
          "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": `${t.name} 종류`,
            "itemListElement": t.types?.map((type: any) => ({
              "@type": "Offer",
              "itemOffered": { "@type": "Service", "name": type.name, "description": type.desc }
            }))
          }
        },
        // HowTo (treatment process)
        {
          "@context": "https://schema.org", "@type": "HowTo",
          "name": `${t.name} 치료 과정`,
          "description": `서울365치과의 ${t.name} 치료는 다음 단계로 진행됩니다.`,
          "totalTime": "PT1H",
          "tool": [
            { "@type": "HowToTool", "name": "CT 촬영기" },
            { "@type": "HowToTool", "name": "디지털 스캐너" },
            { "@type": "HowToTool", "name": "네비게이션 가이드" }
          ],
          "step": t.process?.map((step: any, i: number) => ({
            "@type": "HowToStep",
            "position": i + 1,
            "name": step.step,
            "text": step.desc || step.step,
            "url": `https://seoul365dc.kr/treatments/${t.slug}#step-${i + 1}`
          }))
        },
        // BreadcrumbList
        {
          "@context": "https://schema.org", "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "홈", "item": "https://seoul365dc.kr" },
            { "@type": "ListItem", "position": 2, "name": "진료안내", "item": "https://seoul365dc.kr/treatments" },
            { "@type": "ListItem", "position": 3, "name": t.name, "item": `https://seoul365dc.kr/treatments/${t.slug}` }
          ]
        },
        // FAQPage (treatment-specific)
        ...(t.faq ? [{
          "@context": "https://schema.org", "@type": "FAQPage",
          "mainEntity": t.faq.map((f: any) => ({
            "@type": "Question", "name": f.q,
            "acceptedAnswer": { "@type": "Answer", "text": f.a }
          }))
        }] : []),
        // MedicalDevice — equipment used for this treatment
        {
          "@context": "https://schema.org",
          "@type": "MedicalDevice",
          "name": `${t.name} 진료 장비`,
          "description": `서울365치과 ${t.name} 진료에 사용되는 의료 장비`,
          "manufacturer": [
            { "@type": "Organization", "name": "오스템 임플란트" },
            { "@type": "Organization", "name": "3Shape" },
          ],
          "purpose": `${t.name} 치료를 위한 정밀 진단 및 수술`,
        },
        // MedicalIndication — who should get this treatment
        {
          "@context": "https://schema.org",
          "@type": "ApprovedIndication",
          "name": `${t.name} 적응증`,
          "description": t.concerns?.join('; '),
          "recognizingAuthority": { "@type": "Organization", "name": "대한치과의사협회" },
        },
        // TherapeuticProcedure — detailed treatment info for AEO
        {
          "@context": "https://schema.org",
          "@type": "TherapeuticProcedure",
          "name": t.name,
          "description": t.metaDesc,
          "procedureType": t.slug.includes('orthodontic') || t.slug.includes('invisalign') ? "NonSurgicalProcedure" : "SurgicalProcedure",
          "bodyLocation": "Oral cavity",
          "howPerformed": t.process?.map((s: any) => s.step).join(' → '),
          "preparation": "정밀 CT 촬영 및 디지털 스캔 진단 → 치료 계획 수립 → 마취 확인",
          "followup": "정기 검진 및 유지 관리 프로그램",
          "status": "https://schema.org/ActiveActionStatus",
          "doseSchedule": {
            "@type": "ReportedDoseSchedule",
            "doseUnit": "회",
            "frequency": t.process?.length ? `${t.process.length}단계 치료` : "개별 상담 후 결정",
          },
          "drug": [
            { "@type": "Drug", "name": "리도카인 (국소마취제)", "drugClass": { "@type": "DrugClass", "name": "Local anesthetic" } },
          ],
          "legalStatus": "의료기관에서만 시행 가능한 의료 행위",
          "recognizingAuthority": { "@type": "Organization", "name": "보건복지부" },
        },
        // Speakable for this treatment page (AEO)
        {
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": t.metaTitle,
          "speakable": {
            "@type": "SpeakableSpecification",
            "cssSelector": ["h1", ".hero-sub", "h2", "[itemprop='name']", "[itemprop='text']"]
          },
          "url": `https://seoul365dc.kr/treatments/${t.slug}`,
        },
      ]
    }
  )
})


export default treatmentRoutes
