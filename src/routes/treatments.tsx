import { Hono } from 'hono'
import type { Bindings } from '../lib/types'
import { CLINIC } from '../data/clinic'
import { treatments, getTreatmentBySlug, treatmentCategories } from '../data/treatments'
import { TREATMENT_EMPATHY } from '../data/brand'
import { initAdminTables } from '../lib/db'

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

      {/* 치과 백과사전 */}
      <section class="section-lg bg-white">
        <div class="max-w-4xl mx-auto px-5 md:px-8">
          <div class="text-center mb-14 reveal">
            <span class="section-eyebrow text-[#0066FF] mb-3 block">ENCYCLOPEDIA</span>
            <h2 class="section-sub-headline text-gray-900">치과 백과사전</h2>
            <p class="text-gray-400 text-sm mt-3">치과 진료에 대해 알아두면 좋은 핵심 지식을 정리했습니다.</p>
          </div>

          <div class="space-y-10 stagger-children">

            {/* 임플란트 */}
            <article class="reveal" itemscope itemtype="https://schema.org/MedicalWebPage">
              <h3 class="font-bold text-gray-900 text-lg mb-3 flex items-center gap-2">
                <i class="fa-solid fa-tooth text-[#0066FF] text-sm"></i>
                <span itemprop="name">임플란트 (Dental Implant)</span>
              </h3>
              <div class="text-gray-600 text-[0.9rem] leading-[1.95] space-y-2" itemprop="text">
                <p>임플란트는 상실된 자연 치아를 대체하는 인공 치아 시술입니다. 티타늄 소재의 인공 치근(픽스쳐)을 잇몸뼈에 심고, 그 위에 지대주(어버트먼트)와 보철물(크라운)을 연결하는 3단계 구조로 이루어집니다. 잇몸뼈와 티타늄이 결합하는 골유착(Osseointegration) 과정이 핵심이며, 통상 2~6개월이 소요됩니다.</p>
                <p><strong>전체임플란트</strong>는 다수의 치아를 한꺼번에 회복하는 시술로, All-on-4·All-on-6 공법이 대표적입니다. 최소 4~6개의 픽스쳐로 전악(위턱 또는 아래턱 전체)을 지지하며, 잔존 골량이 부족한 환자도 경사 식립(Tilted Implant)을 통해 뼈이식 없이 진행할 수 있습니다. <strong>즉시로딩(Immediate Loading)</strong>은 수술 당일 임시 보철을 장착해 저작 기능을 즉시 회복하는 기술이며, MUA(Multi-Unit Abutment)를 사용합니다.</p>
                <p><strong>네비게이션 임플란트</strong>는 CBCT(콘빔CT) 데이터를 기반으로 3D 가이드를 제작해 최소 절개, 최소 출혈로 식립하는 디지털 가이드 수술법입니다. 수술 시간이 단축되고 회복이 빠릅니다. 골이식이 필요한 경우에는 GBR(Guided Bone Regeneration), 상악동거상술(Sinus Lift) 등이 병행될 수 있습니다.</p>
              </div>
            </article>

            <hr class="border-gray-100" />

            {/* 치아교정 */}
            <article class="reveal" itemscope itemtype="https://schema.org/MedicalWebPage">
              <h3 class="font-bold text-gray-900 text-lg mb-3 flex items-center gap-2">
                <i class="fa-solid fa-teeth text-[#0066FF] text-sm"></i>
                <span itemprop="name">치아교정 (Orthodontics)</span>
              </h3>
              <div class="text-gray-600 text-[0.9rem] leading-[1.95] space-y-2" itemprop="text">
                <p>치아교정은 부정교합(Malocclusion)을 바로잡아 심미성과 저작 기능을 개선하는 치료입니다. 교정 장치에 따라 메탈 브래킷, 세라믹(클리피씨), 투명교정(인비절라인)으로 나뉩니다.</p>
                <p><strong>인비절라인(Invisalign)</strong>은 SmartTrack 소재의 투명 정렬장치(얼라이너)를 2주마다 교체하며 치아를 이동시킵니다. 3D ClinCheck 시뮬레이션으로 교정 전·후 결과를 미리 확인할 수 있고, 탈착이 가능해 식사와 칫솔질에 제약이 없습니다. 디지털 구강스캔(iTero)을 통해 치아 이동 계획을 정밀하게 설계합니다.</p>
                <p><strong>소아·청소년 교정</strong>은 성장기의 골격 발달을 활용하여 최적의 시기에 개입하는 것이 핵심입니다. 유치에서 영구치로 교환되는 혼합치열기(만 7~12세)가 1차 교정의 적기이며, 악골 성장을 유도하는 기능성 장치와 공간유지장치를 활용합니다.</p>
              </div>
            </article>

            <hr class="border-gray-100" />

            {/* 보존/근관치료 */}
            <article class="reveal" itemscope itemtype="https://schema.org/MedicalWebPage">
              <h3 class="font-bold text-gray-900 text-lg mb-3 flex items-center gap-2">
                <i class="fa-solid fa-shield-halved text-[#0066FF] text-sm"></i>
                <span itemprop="name">보존치료와 신경치료</span>
              </h3>
              <div class="text-gray-600 text-[0.9rem] leading-[1.95] space-y-2" itemprop="text">
                <p><strong>충치(우식증, Dental Caries)</strong>는 구강 내 세균이 음식물의 당분을 분해하면서 생성하는 산(酸)에 의해 치아 경조직(법랑질→상아질→치수)이 파괴되는 질환입니다. 초기에는 레진 충전으로 간단히 수복하고, 범위가 넓으면 인레이·온레이, 더 진행되면 크라운으로 치아 전체를 감싸 보호합니다.</p>
                <p><strong>신경치료(근관치료, Root Canal Treatment)</strong>는 충치나 외상으로 치수(신경·혈관 조직)가 감염·괴사된 경우, 감염 조직을 제거하고 근관을 세척·성형한 뒤 생체 적합 재료(MTA, 거타퍼차)로 충전하는 시술입니다. 미세현미경을 사용하면 육안으로 보이지 않는 부근관, 만곡 근관까지 정밀하게 치료할 수 있습니다.</p>
                <p><strong>재신경치료</strong>는 기존 신경치료가 불완전했거나 재감염된 경우 시행합니다. 이전 충전물을 제거하고 새로 소독·충전하며, 통상적인 방법으로 해결되지 않으면 치근단절제술(Apicoectomy)로 치근 끝의 감염 조직을 외과적으로 제거합니다.</p>
              </div>
            </article>

            <hr class="border-gray-100" />

            {/* 심미/미백 */}
            <article class="reveal" itemscope itemtype="https://schema.org/MedicalWebPage">
              <h3 class="font-bold text-gray-900 text-lg mb-3 flex items-center gap-2">
                <i class="fa-solid fa-star text-[#0066FF] text-sm"></i>
                <span itemprop="name">심미치료와 미백</span>
              </h3>
              <div class="text-gray-600 text-[0.9rem] leading-[1.95] space-y-2" itemprop="text">
                <p><strong>라미네이트(Veneer)</strong>는 치아 전면에 0.3~0.5mm 두께의 세라믹을 부착하여 색상, 형태, 간격을 개선하는 시술입니다. 최소 삭제로 자연치아 구조를 보존하면서 심미적 결과를 얻을 수 있습니다. IPS e.max 등 고강도 리튬디실리케이트 소재를 사용하며, <strong>세렉(CEREC) 원데이</strong> 시스템을 활용하면 CAD/CAM 기술로 당일 보철 제작·장착이 가능합니다.</p>
                <p><strong>치아미백</strong>은 과산화수소(Hydrogen Peroxide) 또는 과산화요소(Carbamide Peroxide) 성분으로 법랑질 내부의 착색 물질을 산화·분해하는 시술입니다. 전문가 미백(In-office)은 고농도 약제와 광활성화 장비를 사용해 1~2회 방문으로 즉각적인 효과를 얻으며, 자가 미백(Home Bleaching)은 개인 맞춤 트레이에 저농도 약제를 넣어 2~4주간 착용합니다.</p>
              </div>
            </article>

            <hr class="border-gray-100" />

            {/* 수면진료/마취 */}
            <article class="reveal" itemscope itemtype="https://schema.org/MedicalWebPage">
              <h3 class="font-bold text-gray-900 text-lg mb-3 flex items-center gap-2">
                <i class="fa-solid fa-bed text-[#0066FF] text-sm"></i>
                <span itemprop="name">수면진료와 무통마취</span>
              </h3>
              <div class="text-gray-600 text-[0.9rem] leading-[1.95] space-y-2" itemprop="text">
                <p><strong>수면진료(의식하진정법, Conscious Sedation)</strong>는 정맥 내 진정제(미다졸람, 프로포폴 등)를 투여하여 반의식 상태에서 치과 치료를 진행하는 방법입니다. 환자는 의료진의 지시에 반응할 수 있지만 불안과 공포를 느끼지 않으며, 치료 과정을 거의 기억하지 못합니다. 생체 징후(혈압, 심박수, 산소포화도)를 실시간 모니터링하며, 치과 공포증(Dental Phobia) 환자나 장시간 수술에 적용됩니다.</p>
                <p><strong>무통마취</strong>는 컴퓨터 제어 마취기(Computer-Controlled Local Anesthesia)를 사용하여 약액 주입 속도와 압력을 정밀하게 조절함으로써 마취 시 통증을 최소화합니다. 표면마취 후 극세침(33G)으로 진행하기 때문에 바늘이 들어가는 순간의 찌릿한 통증도 크게 줄어듭니다.</p>
              </div>
            </article>

            <hr class="border-gray-100" />

            {/* 잇몸/외과 */}
            <article class="reveal" itemscope itemtype="https://schema.org/MedicalWebPage">
              <h3 class="font-bold text-gray-900 text-lg mb-3 flex items-center gap-2">
                <i class="fa-solid fa-hand-holding-medical text-[#0066FF] text-sm"></i>
                <span itemprop="name">잇몸치료와 구강외과</span>
              </h3>
              <div class="text-gray-600 text-[0.9rem] leading-[1.95] space-y-2" itemprop="text">
                <p><strong>치주질환(잇몸병, Periodontal Disease)</strong>은 치태(Plaque)와 치석(Calculus)에 의해 잇몸 조직과 잇몸뼈가 파괴되는 질환입니다. 초기에는 스케일링과 치근활택술(SRP: Scaling and Root Planing)로 관리하고, 진행된 경우 치주소파술이나 치주 판막수술을 시행합니다. 6개월마다 정기 스케일링이 예방의 핵심입니다.</p>
                <p><strong>사랑니 발치</strong>는 제3대구치가 매복(Impacted)되어 주변 치아에 충치, 잇몸 염증, 치아 흡수 등을 유발할 때 시행합니다. 파노라마·CBCT 촬영으로 하치조신경(IAN)과의 거리를 사전에 확인하며, 완전 매복·수평 매복의 경우 치조골 삭제 후 분할 발치합니다.</p>
                <p><strong>턱관절 장애(TMD)</strong>는 악관절 디스크 변위, 근막통증 증후군 등으로 인한 개구 장애, 관절음, 안면 통증을 포함합니다. 교합 안정 장치(스플린트), 물리치료, 행동 교정 등 보존적 치료가 우선이며, 이갈이(Bruxism)에는 나이트가드를 처방합니다.</p>
              </div>
            </article>

          </div>

          <div class="mt-14 text-center reveal">
            <p class="text-gray-300 text-xs">※ 본 백과사전은 일반적인 치과 정보 제공 목적이며, 정확한 진단과 치료 계획은 반드시 전문의와의 상담을 통해 결정하셔야 합니다.</p>
          </div>
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
treatmentRoutes.get('/treatments/:slug', async (c) => {
  const slug = c.req.param('slug');
  const t = getTreatmentBySlug(slug);
  if (!t) return c.notFound();
  const empathy = TREATMENT_EMPATHY[slug];

  // Fetch published Before/After cases for this treatment from DB
  let dbCases: any[] = [];
  try {
    await initAdminTables(c.env.DB);
    const result = await c.env.DB.prepare(
      'SELECT id, treatment_slug, title, patient_age, patient_gender, tag, doctor_name, description, duration, before_image, after_image, sort_order, view_count, created_at FROM before_after_cases WHERE is_published = 1 AND treatment_slug = ? ORDER BY sort_order DESC, created_at DESC'
    ).bind(slug).all();
    dbCases = result.results || [];
  } catch {}

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

      {/* Before & After Cases from DB */}
      {dbCases.length > 0 && (
        <section class="section-lg bg-white">
          <div class="max-w-5xl mx-auto px-5 md:px-8">
            <div class="text-center mb-14 reveal">
              <span class="section-eyebrow text-[#0066FF] mb-3 block">BEFORE &amp; AFTER</span>
              <h2 class="section-sub-headline text-gray-900">{t.name} 실제 치료 사례</h2>
              <p class="text-gray-400 text-sm mt-3">실제 환자분의 치료 전후 사진입니다. 클릭하여 상세히 확인하세요.</p>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children" id="txCasesGrid">
              {dbCases.map((cs: any, idx: number) => (
                <div class="premium-card overflow-hidden group cursor-pointer hover:shadow-xl transition-all duration-300 tx-case-card" onclick={`openTxCaseModal(${idx})`}>
                  {/* Thumbnail — Before/After split */}
                  <div class="aspect-[4/3] bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
                    {cs.before_image && cs.after_image ? (
                      <div class="absolute inset-0 flex">
                        <div class="w-1/2 overflow-hidden border-r-2 border-white relative">
                          <img src={cs.before_image} alt="Before" class="absolute inset-0 w-full h-full object-cover" style="max-width:none;width:200%" loading="lazy" />
                          <span class="absolute top-2.5 left-2.5 text-[0.55rem] font-bold tracking-widest uppercase text-white bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded">Before</span>
                        </div>
                        <div class="w-1/2 overflow-hidden relative">
                          <img src={cs.after_image} alt="After" class="absolute inset-0 w-full h-full object-cover" style="max-width:none;width:200%;margin-left:-100%" loading="lazy" />
                          <span class="absolute top-2.5 right-2.5 text-[0.55rem] font-bold tracking-widest uppercase text-white bg-[#0066FF]/70 backdrop-blur-sm px-2 py-0.5 rounded">After</span>
                        </div>
                      </div>
                    ) : cs.after_image ? (
                      <img src={cs.after_image} alt="After" class="w-full h-full object-cover" loading="lazy" />
                    ) : cs.before_image ? (
                      <img src={cs.before_image} alt="Before" class="w-full h-full object-cover" loading="lazy" />
                    ) : (
                      <div class="w-full h-full flex items-center justify-center">
                        <i class="fa-solid fa-images text-gray-200 text-3xl"></i>
                      </div>
                    )}
                    {/* Hover overlay */}
                    <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                      <div class="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 backdrop-blur-sm rounded-full w-11 h-11 flex items-center justify-center shadow-lg">
                        <i class="fa-solid fa-expand text-[#0066FF]"></i>
                      </div>
                    </div>
                  </div>
                  {/* Card Info */}
                  <div class="p-4">
                    <div class="flex items-center gap-2 mb-1.5">
                      <span class="text-[0.65rem] bg-[#0066FF]/8 text-[#0066FF] px-2 py-0.5 rounded-full font-semibold">{cs.tag}</span>
                      {cs.duration && <span class="text-[0.6rem] text-gray-400"><i class="fa-regular fa-clock mr-0.5"></i>{cs.duration}</span>}
                    </div>
                    <h3 class="font-bold text-gray-900 text-[0.85rem] group-hover:text-[#0066FF] transition-colors line-clamp-1">{cs.title}</h3>
                    <p class="text-[0.75rem] text-gray-400 mt-1">담당: {cs.doctor_name}{cs.patient_age ? ` · ${cs.patient_age}` : ''}{cs.patient_gender && cs.patient_gender !== '선택안함' ? ` ${cs.patient_gender}` : ''}</p>
                  </div>
                </div>
              ))}
            </div>
            <div class="text-center mt-8 reveal">
              <a href="/cases/gallery" class="inline-flex items-center gap-2 text-[#0066FF] hover:text-[#0052cc] font-semibold text-sm transition" data-cursor-hover>
                전체 치료 사례 보기 <i class="fa-solid fa-arrow-right text-xs"></i>
              </a>
            </div>
            <p class="text-[0.7rem] text-gray-300 text-center mt-6">※ 개인에 따라 치료 결과가 다를 수 있습니다. 모든 사례는 환자 동의 하에 게시되었습니다.</p>
          </div>
        </section>
      )}

      {/* Treatment Case Modal */}
      {dbCases.length > 0 && (
        <>
          <div id="txCaseModal" class="fixed inset-0 z-[100] hidden" onclick="closeTxCaseModal(event)">
            <div class="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
            <div class="relative z-10 flex items-center justify-center min-h-screen p-4 md:p-8">
              <div class="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onclick="event.stopPropagation()">
                {/* Modal Header */}
                <div class="sticky top-0 bg-white/95 backdrop-blur-sm z-10 flex items-center justify-between px-6 py-4 border-b border-gray-100">
                  <div class="flex items-center gap-2">
                    <span id="txModalTag" class="text-[0.7rem] bg-[#0066FF]/8 text-[#0066FF] px-2.5 py-0.5 rounded-full font-semibold"></span>
                    <span id="txModalDuration" class="text-[0.65rem] text-gray-400"></span>
                  </div>
                  <div class="flex items-center gap-2">
                    <button onclick="navTxCase(-1)" class="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition" title="이전 사례"><i class="fa-solid fa-chevron-left text-gray-500 text-sm"></i></button>
                    <button onclick="navTxCase(1)" class="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition" title="다음 사례"><i class="fa-solid fa-chevron-right text-gray-500 text-sm"></i></button>
                    <button onclick="closeTxCaseModal()" class="w-9 h-9 rounded-full bg-gray-100 hover:bg-red-100 hover:text-red-500 flex items-center justify-center transition ml-1" title="닫기"><i class="fa-solid fa-xmark text-gray-500 text-sm"></i></button>
                  </div>
                </div>
                {/* Before/After Comparison */}
                <div class="p-6">
                  <div class="grid grid-cols-2 gap-3 mb-6">
                    <div class="relative rounded-2xl overflow-hidden bg-gray-50 aspect-[4/3]">
                      <img id="txModalBefore" src="" alt="Before" class="w-full h-full object-cover" />
                      <span class="absolute top-3 left-3 text-[0.65rem] font-bold tracking-widest uppercase text-white bg-black/50 backdrop-blur-sm px-3 py-1 rounded-lg">Before</span>
                    </div>
                    <div class="relative rounded-2xl overflow-hidden bg-gray-50 aspect-[4/3]">
                      <img id="txModalAfter" src="" alt="After" class="w-full h-full object-cover" />
                      <span class="absolute top-3 right-3 text-[0.65rem] font-bold tracking-widest uppercase text-white bg-[#0066FF]/80 backdrop-blur-sm px-3 py-1 rounded-lg">After</span>
                    </div>
                  </div>
                  <h2 id="txModalTitle" class="text-xl font-bold text-gray-900 mb-3"></h2>
                  <p id="txModalDesc" class="text-gray-600 text-sm leading-relaxed mb-4"></p>
                  <div class="flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-500 bg-gray-50 rounded-xl px-5 py-4">
                    <span id="txModalDoctor"><i class="fa-solid fa-user-doctor text-[#0066FF]/60 mr-1.5"></i></span>
                    <span id="txModalPatient"><i class="fa-solid fa-user text-[#0066FF]/60 mr-1.5"></i></span>
                    <span id="txModalDur"><i class="fa-regular fa-clock text-[#0066FF]/60 mr-1.5"></i></span>
                  </div>
                  <div class="mt-6 text-center">
                    <p class="text-gray-400 text-xs mb-3">비슷한 고민을 가지고 계신가요?</p>
                    <a href="/reservation" class="inline-flex items-center gap-2 bg-[#0066FF] hover:bg-[#0052cc] text-white font-bold text-sm px-6 py-3 rounded-xl transition">
                      <i class="fa-solid fa-calendar-check text-xs"></i> 무료 상담 예약
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <script dangerouslySetInnerHTML={{__html: `
            var txCases = ${JSON.stringify(dbCases.map((cs: any) => ({
              id: cs.id, title: cs.title, tag: cs.tag, duration: cs.duration || '',
              description: cs.description || '', doctor_name: cs.doctor_name || '',
              patient_age: cs.patient_age || '', patient_gender: cs.patient_gender || '',
              before_image: cs.before_image || '', after_image: cs.after_image || '',
            })))};
            var txCurrentIdx = 0;

            function openTxCaseModal(idx) {
              txCurrentIdx = idx;
              renderTxModal();
              document.getElementById('txCaseModal').classList.remove('hidden');
              document.body.style.overflow = 'hidden';
              var c = txCases[idx];
              if (c && c.id) fetch('/api/cases/' + c.id + '/view', { method: 'POST' }).catch(function(){});
            }

            function closeTxCaseModal(e) {
              if (e && e.target && e.target.closest && e.target.closest('[onclick="event.stopPropagation()"]')) return;
              document.getElementById('txCaseModal').classList.add('hidden');
              document.body.style.overflow = '';
            }

            function navTxCase(dir) {
              txCurrentIdx = (txCurrentIdx + dir + txCases.length) % txCases.length;
              renderTxModal();
            }

            function renderTxModal() {
              var c = txCases[txCurrentIdx];
              if (!c) return;
              document.getElementById('txModalTag').textContent = c.tag;
              document.getElementById('txModalDuration').textContent = c.duration || '';
              document.getElementById('txModalBefore').src = c.before_image || '';
              document.getElementById('txModalAfter').src = c.after_image || '';
              document.getElementById('txModalTitle').textContent = c.title;
              document.getElementById('txModalDesc').textContent = c.description || '상세 설명이 없습니다.';
              document.getElementById('txModalDoctor').innerHTML = '<i class="fa-solid fa-user-doctor text-[#0066FF]/60 mr-1.5"></i>담당: ' + c.doctor_name;
              var patientText = (c.patient_age || '') + (c.patient_gender && c.patient_gender !== '선택안함' ? ' ' + c.patient_gender : '');
              document.getElementById('txModalPatient').innerHTML = '<i class="fa-solid fa-user text-[#0066FF]/60 mr-1.5"></i>' + patientText;
              document.getElementById('txModalDur').innerHTML = '<i class="fa-regular fa-clock text-[#0066FF]/60 mr-1.5"></i>' + (c.duration || '-');
              document.getElementById('txModalDur').style.display = c.duration ? '' : 'none';
              document.getElementById('txModalPatient').style.display = patientText.trim() ? '' : 'none';
            }

            document.addEventListener('keydown', function(e) {
              if (document.getElementById('txCaseModal').classList.contains('hidden')) return;
              if (e.key === 'Escape') closeTxCaseModal();
              if (e.key === 'ArrowLeft') navTxCase(-1);
              if (e.key === 'ArrowRight') navTxCase(1);
            });
          `}} />
        </>
      )}

      {/* Static Patient Cases fallback (when no DB cases) */}
      {dbCases.length === 0 && t.patientCases && t.patientCases.length > 0 && (
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
      <section class="section-lg bg-white">
        <div class="max-w-3xl mx-auto px-5 md:px-8">
          <div class="text-center mb-14 reveal">
            <span class="section-eyebrow text-[#0066FF] mb-3 block">FAQ</span>
            <h2 class="section-sub-headline text-gray-900">{t.name} 자주 묻는 질문</h2>
          </div>
          <div class="space-y-3 stagger-children">
            {t.faq.map(faq => (
              <div class="faq-item">
                <button class="faq-toggle w-full text-left px-6 py-5 flex items-center justify-between hover:bg-gray-50/50 transition-colors" data-cursor-hover>
                  <h3 class="font-semibold text-gray-800 text-[0.9rem] pr-4">{faq.q}</h3>
                  <i class="fa-solid fa-chevron-down text-gray-300 text-sm faq-icon flex-shrink-0"></i>
                </button>
                <div class="hidden px-6 pb-5">
                  <p class="text-gray-500 text-[0.9rem] leading-relaxed">{faq.a}</p>
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
          "name": `${t.name} 자주 묻는 질문`,
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
