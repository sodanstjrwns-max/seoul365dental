import { Hono } from 'hono'
import { HubA } from '../lib/hub-links'
import { kstYmd } from '../lib/column-seo'
import type { Bindings } from '../lib/types'
import { CLINIC } from '../data/clinic'
import { treatments, getTreatmentBySlug, treatmentCategories } from '../data/treatments'
import { TREATMENT_EMPATHY } from '../data/brand'
import { initAdminTables } from '../lib/db'
import { AREAS, getAreasSorted } from '../data/areas'
import { MATRIX_TREATMENT_SLUGS } from '../data/area-treatment'
import { CONTENT_DATES, LEAD_REVIEWER } from '../lib/content-dates'
import { doctors } from '../data/doctors'
import { Icon, KakaoMark } from '../lib/icons'
import { matrixCardImage } from '../lib/guwol-cards'

// 진료 페이지 상단 핵심 답변 — 기존 본문 첫 상세 섹션('○○란?')의 앞 2문장 (새 주장 없음, 2026-09-29)
function txAnswer(t: any): string {
  const src: string = t.detailSections?.[0]?.content || t.heroSub || t.metaDesc
  const sentences = src.split(/(?<=[.!?])\s+/).filter(Boolean)
  return sentences.slice(0, 2).join(' ')
}
const REVIEWER_REF = { "@type": "Physician", "@id": LEAD_REVIEWER.id, "name": LEAD_REVIEWER.name, "jobTitle": LEAD_REVIEWER.jobTitle }

const treatmentRoutes = new Hono<{ Bindings: Bindings }>()

treatmentRoutes.get('/treatments', (c) => {
  return c.render(
    <>
      {/* 페이지 히어로 — 분류 바로가기 */}
      <section class="phead" aria-labelledby="tx-h1">
        <div class="wrap phead-in">
          <div class="phead-text">
            <nav class="crumb" aria-label="현재 위치"><ol><li><a href="/">홈</a></li><li aria-current="page">진료안내</li></ol></nav>
            <p class="eyebrow">Treatments · {treatments.length} services</p>
            <h1 id="tx-h1" class="display-xl">서울365치과 전체 진료 안내</h1>
            <p class="lead hero-sub">각 분야 전문의가 최적의 치료를 제안합니다.</p>
            <div class="phead-cta">
              <a href="/reservation" class="btn btn-primary"><Icon name="calendar" />상담 예약</a>
              <a href="/info#pricing" class="btn btn-light">비용 안내</a>
            </div>
          </div>
          <div class="phead-aside">
            <nav class="phead-jump" aria-label="진료 분류 바로가기">
              {treatmentCategories.map((cat, i) => (
                <a href={`#cat-${i + 1}`}>{cat.name}<small>{cat.treatments.length}</small></a>
              ))}
            </nav>
          </div>
        </div>
      </section>

      <section class="sec">
        <div class="wrap">
          {treatmentCategories.map((cat, ci) => (
            <div class="cat-block" id={`cat-${ci + 1}`}>
              <div class="sec-head-row">
                <div class="sec-head" data-rv>
                  <p class="eyebrow">{String(ci + 1).padStart(2, '0')} / Category</p>
                  <h2 class="display-2">{cat.name}</h2>
                </div>
                <span class="mono t-mute" style="font-size:.8rem">{cat.treatments.length} 진료</span>
              </div>
              <ul class="tx-tiles" data-rv-group>
                {cat.treatments.map(t => (
                  <li>
                    <a href={`/treatments/${t.slug}`} class="tx-tile">
                      <span class="tx-tile-name">{t.name}</span>
                      <span class="tx-tile-desc">{t.shortDesc}</span>
                      <Icon name="arrowUpRight" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* 백과사전 링크 */}
      <section class="sec-tight" style="background:var(--card)">
        <div class="wrap-n">
          <a href="/encyclopedia" class="card enc-card hover" data-rv>
            <Icon name="book" />
            <div>
              <h3>치과 백과사전</h3>
              <p>임플란트, 교정, 충치, 신경치료 등 치과 진료에 대한 핵심 지식을 한눈에 확인하세요.</p>
            </div>
            <span class="arrow-link">자세히 보기<Icon name="arrow" /></span>
          </a>
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
          "lastReviewed": CONTENT_DATES.treatments,
          "reviewedBy": REVIEWER_REF,
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
          "areaServed": [
            { "@type": "City", "name": "인천광역시" },
            { "@type": "AdministrativeArea", "name": "인천 남동구" },
            { "@type": "AdministrativeArea", "name": "인천 구월동" },
            { "@type": "AdministrativeArea", "name": "인천 부평구" },
            { "@type": "AdministrativeArea", "name": "인천 서구" },
            { "@type": "AdministrativeArea", "name": "인천 미추홀구" },
            { "@type": "AdministrativeArea", "name": "인천 연수구" },
          ],
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
  const answer = txAnswer(t);
  const reviewed = CONTENT_DATES.treatments;
  const pageUrl = `https://seoul365dc.kr/treatments/${t.slug}`;

  // Fetch published Before/After cases for this treatment from DB
  let dbCases: any[] = [];
  try {
    await initAdminTables(c.env.DB);
    const result = await c.env.DB.prepare(
      'SELECT id, treatment_slug, title, patient_age, patient_gender, tag, doctor_name, description, duration, before_image, after_image, sort_order, view_count, created_at FROM before_after_cases WHERE is_published = 1 AND treatment_slug = ? ORDER BY sort_order DESC, created_at DESC'
    ).bind(slug).all();
    dbCases = result.results || [];
  } catch {}

  // 같은 진료 최신 칼럼 (진료 ↔ 칼럼 내부 링크, 2026-10-03)
  let txPosts: any[] = [];
  try {
    const rp = await c.env.DB.prepare('SELECT slug, title, excerpt, created_at FROM blog_posts WHERE is_published = 1 AND treatment_slug = ? ORDER BY created_at DESC LIMIT 5').bind(slug).all();
    txPosts = rp.results || [];
  } catch {}

  const heroImg = matrixCardImage(t.slug);
  const doctor = doctors.find(d => d.slug === t.doctorSlug);
  const stepTitle = (s: string) => s.replace(/^\d+\s*단계\s*[:：]\s*/, '');
  const isFixture = ['implant', 'full-implant', 'digital-full-arch', 'implant-revision'].includes(t.slug);

  return c.render(
    <>
      {/* 페이지 히어로 — 공감 문구(있으면) + 담당 원장·사실 카드 */}
      <section class="phead" aria-labelledby="tx-h1">
        <div class="wrap phead-in">
          <div class="phead-text">
            <nav class="crumb" aria-label="현재 위치"><ol><li><a href="/">홈</a></li><li><a href="/treatments">진료안내</a></li><li aria-current="page">{t.name}</li></ol></nav>
            <p class="eyebrow">{t.category} · {t.name}</p>
            {empathy ? (
              <>
                <h1 id="tx-h1" class="display-xl" style="white-space:pre-line">{empathy.heroTagline}</h1>
                <p class="lead hero-sub">{empathy.heroSub}</p>
              </>
            ) : (
              <>
                <h1 id="tx-h1" class="display-xl">{t.heroTitle}</h1>
                <p class="lead hero-sub">{t.heroSub}</p>
              </>
            )}
            <div class="phead-cta">
              <a href="/reservation" class="btn btn-primary"><Icon name="calendar" />상담 예약</a>
              <a href="/info#pricing" class="btn btn-light">비용 안내</a>
              <a href={CLINIC.phoneTel} class="btn btn-light mono"><Icon name="phone" />{CLINIC.phone}</a>
            </div>
          </div>
          <aside class="phead-aside" aria-label={`${t.name} 진료 정보`}>
            {heroImg && (
              <div class="phead-img"><img src={heroImg} alt={`서울365치과 ${t.name} 안내 사진`} width="1200" height="630" loading="eager" decoding="async" /></div>
            )}
            <div class="fact-card">
              {doctor && (
                <a href={`/doctors/${doctor.slug}`} class="fact-doc">
                  <img src={doctor.photo} alt="" width="52" height="52" loading="lazy" decoding="async" onerror={`this.onerror=null;this.src='${doctor.photoFallback}'`} />
                  <span><small>담당 원장</small><b>{doctor.name} {doctor.titleShort}</b></span>
                  <Icon name="arrow" />
                </a>
              )}
              <dl class="fact-rows">
                <div><dt>진료 분류</dt><dd>{t.category}</dd></div>
                <div><dt>진료 시간</dt><dd>월–목 10–21시 · 금 –19시 · 토 –14시 · 일·공휴 14–18시</dd></div>
                <div><dt>최종 검토</dt><dd><time datetime={reviewed}>{reviewed}</time></dd></div>
              </dl>
            </div>
          </aside>
        </div>
      </section>

      {/* 핵심 답변 + 감수 줄 (AEO 답변 우선 블록, 2026-09-29) */}
      <section class="sec-tight" style="background:var(--card)">
        <div class="wrap">
          <div class="answer-card" data-rv>
            <p class="eyebrow">{t.name} 핵심 요약</p>
            <p id="tx-answer" class="answer-a">{answer}</p>
            <p class="tx-reviewer answer-rev"><Icon name="check" size={14} />감수: <a href="/doctors/park-junkyu">{LEAD_REVIEWER.name} {LEAD_REVIEWER.jobTitle}</a> · 최종 검토 <time datetime={reviewed}>{reviewed}</time></p>
          </div>
        </div>
      </section>

      {/* 이런 고민 */}
      <section class="sec" aria-labelledby="h-concern">
        <div class="wrap">
          <div class="sec-head" data-rv>
            <p class="eyebrow">For you</p>
            <h2 id="h-concern" class="display-2">{t.name}, 이런 고민 있으신가요?</h2>
          </div>
          <ul class="check-list" data-rv-group>
            {t.concerns.map(concern => <li><Icon name="check" /><span>{concern}</span></li>)}
          </ul>
        </div>
      </section>

      {/* 종류 */}
      <section class="sec" style="background:var(--card)" aria-labelledby="h-types">
        <div class="wrap">
          <div class="sec-head" data-rv>
            <p class="eyebrow">Types</p>
            <h2 id="h-types" class="display-2">서울365치과 {t.name} 종류</h2>
          </div>
          <div class="type-grid" data-rv-group>
            {t.types.map((type, i) => (
              <div class="card type-card">
                <span class="n mono">{String(i + 1).padStart(2, '0')}</span>
                <h3>{type.name}</h3>
                <p>{type.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 상세 정보 */}
      {t.detailSections && t.detailSections.length > 0 && (
        <section class="sec" aria-labelledby="h-detail">
          <div class="wrap tx-two">
            <div class="sec-head tx-sticky" data-rv>
              <p class="eyebrow">Details</p>
              <h2 id="h-detail" class="display-2">{t.name} 상세 정보</h2>
            </div>
            <div class="detail-list">
              {t.detailSections.map(section => (
                <div class="detail-row" data-rv>
                  <h3>{section.title}</h3>
                  <p>{section.content}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 왜 서울365 */}
      <section class="sec" style="background:var(--card)" aria-labelledby="h-why">
        <div class="wrap">
          <div class="sec-head" data-rv>
            <p class="eyebrow">Why us</p>
            <h2 id="h-why" class="display-2">왜 서울365치과의 {t.name}인가요?</h2>
          </div>
          <div class="why-grid" data-rv-group>
            {t.whyUs.map((w, i) => (
              <div class="why-item">
                <span class="n mono">{String(i + 1).padStart(2, '0')}</span>
                <h3>{w.title}</h3>
                <p>{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 비교 표 */}
      {t.comparisonTable && t.comparisonTable.length > 0 && t.comparisonHeaders && (
        <section class="sec" aria-labelledby="h-cmp">
          <div class="wrap-n">
            <div class="sec-head" data-rv>
              <p class="eyebrow">Compare</p>
              <h2 id="h-cmp" class="display-2">{t.name} 비교</h2>
            </div>
            <div class="table-wrap" data-rv>
              <table class="cmp-table">
                <thead><tr>{t.comparisonHeaders.map((h: string) => <th scope="col">{h}</th>)}</tr></thead>
                <tbody>
                  {t.comparisonTable.map(row => (
                    <tr><th scope="row">{row.item}</th>{row.values.map((v: string) => <td>{v}</td>)}</tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* 치료 과정 (HowTo 마이크로데이터 유지, #step-N 앵커) */}
      <section class="sec" style="background:var(--card)" itemscope itemtype="https://schema.org/HowTo" aria-labelledby="h-proc">
        <meta itemprop="name" content={`${t.name} 치료 과정`} />
        <meta itemprop="description" content={`서울365치과의 ${t.name} 치료는 다음 단계로 진행됩니다.`} />
        <meta itemprop="totalTime" content="PT1H" />
        <div class="wrap tx-two">
          <div class="sec-head tx-sticky" data-rv>
            <p class="eyebrow">Process</p>
            <h2 id="h-proc" class="display-2">{t.name} 치료 과정</h2>
            <p class="lead">{t.process.length}단계로 진행합니다. 각 단계마다 충분히 설명드리고 다음으로 넘어갑니다.</p>
          </div>
          <ol class="steps">
            {t.process.map((step, i) => (
              <li class="step" id={`step-${i + 1}`} itemprop="step" itemscope itemtype="https://schema.org/HowToStep" data-rv>
                <meta itemprop="position" content={String(i + 1)} />
                <meta itemprop="name" content={step.step} />
                <span class="step-n mono" aria-label={`${i + 1}단계`}>{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h3>{stepTitle(step.step)}</h3>
                  {step.desc && <p itemprop="text">{step.desc}</p>}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 주의사항 · 치료 후 관리 */}
      {(t.warnings && t.warnings.length > 0) || (t.aftercare && t.aftercare.length > 0) ? (
        <section class="sec">
          <div class="wrap note-grid" data-rv-group>
            {t.warnings && t.warnings.length > 0 && (
              <div class="card note-card warn">
                <h3><span class="dot" aria-hidden="true"></span>주의사항</h3>
                <ul>{t.warnings.map(w => <li>{w}</li>)}</ul>
              </div>
            )}
            {t.aftercare && t.aftercare.length > 0 && (
              <div class="card note-card care">
                <h3><span class="dot" aria-hidden="true"></span>치료 후 관리</h3>
                <ul>{t.aftercare.map(a => <li>{a}</li>)}</ul>
              </div>
            )}
          </div>
        </section>
      ) : null}

      {/* 치료 사례 (DB) */}
      {dbCases.length > 0 && (
        <section class="sec" style="background:var(--card)" aria-labelledby="h-cases">
          <div class="wrap">
            <div class="sec-head-row">
              <div class="sec-head" data-rv>
                <p class="eyebrow">Before &amp; After</p>
                <h2 id="h-cases" class="display-2">{t.name} 실제 치료 사례</h2>
                <p class="lead">실제 환자분의 치료 전후 사진입니다. 클릭하여 상세히 확인하세요.</p>
              </div>
              <a href="/cases/gallery" class="arrow-link" data-rv>전체 치료 사례 보기<Icon name="arrow" /></a>
            </div>
            <div class="case-grid" id="txCasesGrid" data-rv-group>
              {dbCases.map((cs: any, idx: number) => (
                <div class="card case-card hover tx-case-card" onclick={`openTxCaseModal(${idx})`} role="button" tabindex={0}>
                  <div class="case-ph">
                    {cs.before_image ? <img src={cs.before_image} alt={`${t.name} 치료 전`} loading="lazy" decoding="async" /> : <span class="ph-empty">BEFORE</span>}
                    <span class="lab">Before</span>
                  </div>
                  <div class="card-body">
                    <span class="tag">{cs.tag}{cs.duration ? ` · ${cs.duration}` : ''}</span>
                    <h3><a href={`/cases/${cs.id}`} onclick="event.stopPropagation()">{cs.title}</a></h3>
                    <p class="meta">담당: {cs.doctor_name}{cs.patient_age ? ` · ${cs.patient_age}` : ''}{cs.patient_gender && cs.patient_gender !== '선택안함' ? ` ${cs.patient_gender}` : ''}</p>
                  </div>
                </div>
              ))}
            </div>
            <p class="fine" style="text-align:center;margin-top:1.4rem">※ 개인에 따라 치료 결과가 다를 수 있습니다. 모든 사례는 환자 동의 하에 게시되었습니다.</p>
          </div>
        </section>
      )}

      {/* 관련 칼럼 (같은 진료 최신 5편) */}
      {txPosts.length > 0 && (
        <section class="sec-tight" aria-labelledby="h-posts">
          <div class="wrap-n">
            <div class="sec-head" data-rv style="margin-bottom:1.2rem">
              <p class="eyebrow">Columns</p>
              <h2 id="h-posts" class="display-2">{t.name} 관련 칼럼</h2>
            </div>
            <ul class="post-list" data-rv>
              {txPosts.map((bp: any) => (
                <li><a href={`/blog/${bp.slug}`}><span>{bp.title}</span><time datetime={kstYmd(bp.created_at)}>{kstYmd(bp.created_at)}</time></a></li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Treatment Case Modal */}
      {dbCases.length > 0 && (
        <>
          <div id="txCaseModal" class="case-modal hidden" role="dialog" aria-modal="true" aria-labelledby="txModalTitle" onclick="closeTxCaseModal(event)">
            <div class="case-modal-box" onclick="event.stopPropagation()">
              {/* Modal Header */}
              <div class="case-modal-head">
                <div class="l">
                  <span id="txModalTag" class="tag"></span>
                  <span id="txModalDuration" class="case-dur"></span>
                </div>
                <div class="r">
                  <button type="button" class="prev" onclick="navTxCase(-1)" title="이전 사례" aria-label="이전 사례"><Icon name="chevron" /></button>
                  <button type="button" onclick="navTxCase(1)" title="다음 사례" aria-label="다음 사례"><Icon name="chevron" /></button>
                  <button type="button" onclick="closeTxCaseModal()" title="닫기" aria-label="닫기"><Icon name="close" /></button>
                </div>
              </div>
              {/* Before/After Comparison */}
              <div class="case-modal-body">
                <div class="case-pair">
                  <div class="case-shot">
                    <img id="txModalBefore" src="" alt={`${t.name} 치료 전`} />
                    <span class="lab">Before</span>
                  </div>
                  <div class="case-shot">
                    <img id="txModalAfter" src="" alt={`${t.name} 치료 후`} />
                    <span class="lab after">After</span>
                  </div>
                </div>
                <h2 id="txModalTitle" class="case-modal-t"></h2>
                <p id="txModalDesc" class="case-modal-d"></p>
                <div class="case-modal-meta">
                  <span id="txModalDoctor"></span>
                  <span id="txModalPatient"></span>
                  <span id="txModalDur"></span>
                </div>
                <div class="case-modal-cta">
                  <p>비슷한 고민을 가지고 계신가요?</p>
                  <a href="/reservation" class="btn btn-primary"><Icon name="calendar" />무료 상담 예약</a>
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
              document.getElementById('txModalDoctor').textContent = '담당: ' + c.doctor_name;
              var patientText = (c.patient_age || '') + (c.patient_gender && c.patient_gender !== '선택안함' ? ' ' + c.patient_gender : '');
              document.getElementById('txModalPatient').textContent = patientText;
              document.getElementById('txModalDur').textContent = c.duration || '-';
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

      {/* 2026-10-16: 정적 환자 사례 문구(치료경험담처럼 읽힘) 제거 — 원장 등록 DB 사례만 표시 */}

      {/* Materials / Fixture Guide */}
      {t.materials && t.materials.length > 0 && (
        <section class="sec" aria-labelledby="h-mat" itemScope itemType="https://schema.org/ItemList">
          <meta itemProp="name" content={`${t.name} 사용 재료 및 픽스처`} />
          <div class="wrap">
            <div class="sec-head center" data-rv>
              <p class="eyebrow">
                {['implant','full-implant','digital-full-arch','implant-revision'].includes(t.slug) ? 'FIXTURE GUIDE' : 'MATERIALS'}
              </p>
              <h2 id="h-mat" class="display-2">
                {['implant','full-implant','digital-full-arch','implant-revision'].includes(t.slug) ? '임플란트 픽스처 안내' : '사용 재료 및 장비'}
              </h2>
              {['implant','full-implant','digital-full-arch'].includes(t.slug) && (
                <p class="lead">CT 정밀 진단 후 뼈 상태·위치·예산에 맞는 최적의 픽스처를 추천드립니다.</p>
              )}
            </div>

            {/* 픽스처 상세 필드가 있는 경우: 확장된 카드 레이아웃 */}
            {t.materials.some(m => m.price || m.origin || m.surface) ? (
              <div class="mat-list" data-rv-group>
                {t.materials.map((m, idx) => (
                  <article class="card mat-card" itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                    <meta itemProp="position" content={String(idx + 1)} />
                    <div itemProp="item" itemScope itemType="https://schema.org/Product">
                      <header class="mat-head">
                        <div>
                          {m.grade && <span class="tag">{m.grade}</span>}
                          <h3 itemProp="name">{m.name}</h3>
                          {m.origin && <small>{m.origin}</small>}
                        </div>
                        {m.price && (
                          <span class="mat-price" itemProp="offers" itemScope itemType="https://schema.org/Offer">
                            <meta itemProp="priceCurrency" content="KRW" />
                            <span itemProp="price">{m.price}</span>
                          </span>
                        )}
                      </header>
                      <p class="mat-desc" itemProp="description">{m.desc}</p>
                      {(m.surface || m.connection || m.feature || m.bestFor) && (
                        <dl class="mat-specs">
                          {m.surface && <div><dt>표면처리</dt><dd>{m.surface}</dd></div>}
                          {m.connection && <div><dt>연결방식</dt><dd>{m.connection}</dd></div>}
                          {m.feature && <div><dt>주요 특징</dt><dd>{m.feature}</dd></div>}
                          {m.bestFor && <div class="best"><dt>추천 대상</dt><dd>{m.bestFor}</dd></div>}
                        </dl>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              /* 기존 간단한 카드 레이아웃 (비임플란트 페이지) */
              <div class="mat-grid" data-rv-group>
                {t.materials.map(m => (
                  <div class="card mat-tile">
                    {m.grade && <span class="tag">{m.grade}</span>}
                    <h3>{m.name}</h3>
                    <p>{m.desc}</p>
                  </div>
                ))}
              </div>
            )}

            {/* 픽스처 페이지 안내 문구 */}
            {['implant','full-implant','digital-full-arch'].includes(t.slug) && (
              <p class="fine mat-note" data-rv>
                모든 픽스처는 식약처 인증 정품만 사용하며, 보증서를 발급해 드립니다. 정확한 비용은 CT 진단 후 안내됩니다.
              </p>
            )}
          </div>
        </section>
      )}

      {/* FAQ — details(크롤러에 열림), 문구는 FAQPage JSON-LD 와 동일 */}
      <section class="sec" style="background:var(--card)" aria-labelledby="h-faq">
        <div class="wrap-n">
          <div class="sec-head center" data-rv>
            <p class="eyebrow">FAQ</p>
            <h2 id="h-faq" class="display-2">{t.name} 자주 묻는 질문</h2>
          </div>
          <div data-rv-group>
            {t.faq.map((faq, i) => (
              <details class="fq" open={i === 0 ? true : undefined}>
                <summary><h3>{faq.q}</h3><span class="pm" aria-hidden="true"><Icon name="plus" /></span></summary>
                <div class="fq-a"><p>{faq.a}</p></div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 상담 밴드 */}
      <section class="cta-band" aria-label="상담 안내">
        <div class="wrap-n" style="text-align:center;position:relative">
          <p class="eyebrow eyebrow-light no-bar" style="justify-content:center" data-rv>Consultation</p>
          <h2 class="display-xl" data-rv>지금 바로 상담 예약하세요</h2>
          <p class="lead" data-rv>{t.name}에 대해 자세히 상담받아 보세요.</p>
          <div class="cta-actions" data-rv-group>
            <a href={CLINIC.phoneTel} class="btn btn-white btn-lg"><Icon name="phone" />전화 상담</a>
            <a href={CLINIC.kakao} target="_blank" rel="noopener noreferrer nofollow" class="btn btn-kakao btn-lg"><KakaoMark size={18} />카카오톡</a>
            <a href="/reservation" class="btn btn-primary btn-lg"><Icon name="calendar" />예약하기</a>
          </div>
          {/* 오시는 길·진료 안내 — "구월동 치과" 허브 링크 (2026-10-08) */}
          <p class="cta-meta" data-rv>{t.name} 진료 위치·주차·진료시간은 <HubA cls="cta-link" /> 안내에서 확인하실 수 있습니다.</p>
        </div>
      </section>

      {/* 지역별 {진료} SEO 그리드 — 매트릭스 진입로 (핵심 진료만 노출) */}
      {MATRIX_TREATMENT_SLUGS.includes(t.slug as any) && (
        <section class="sec" style="background:var(--paper-2)" aria-labelledby="h-area">
          <div class="wrap">
            <div class="sec-head center" data-rv>
              <p class="eyebrow">By area</p>
              <h2 id="h-area" class="display-2">지역별 {t.name} 안내 — 우리 동네에서 가까운 곳</h2>
              <p class="lead">인천 {AREAS.length}개 지역에서 서울365치과 {t.name} 받으러 오시는 거리·시간 안내</p>
            </div>
            <div class="area-chips" style="justify-content:center" data-rv>
              {getAreasSorted().map(a => (
                <a href={`/area/${a.slug}/${t.slug}`} title={`${a.name} ${t.name}`}>{a.name} {t.name}<small>{a.distKm === 0 ? '도보 3분' : `${a.distKm}km · ${a.travelMin}분`}</small></a>
              ))}
            </div>
            <p class="fine" style="text-align:center;margin-top:1.4rem">모든 지역에서 동일한 {t.name} 진료 · 예술회관역 6번 출구 맞은편</p>
          </div>
        </section>
      )}

      {/* 관련 진료 */}
      {t.relatedSlugs && t.relatedSlugs.length > 0 && (
        <section class="sec-tight" aria-labelledby="h-rel">
          <div class="wrap-n" style="text-align:center">
            <div class="sec-head center" data-rv style="margin-bottom:1.2rem">
              <p class="eyebrow">Related</p>
              <h2 id="h-rel" class="display-2">관련 진료 안내</h2>
            </div>
            <div class="tx-all" style="justify-content:center" data-rv>
              {t.relatedSlugs.map(rs => {
                const related = getTreatmentBySlug(rs);
                return related ? <a href={`/treatments/${related.slug}`}>{related.name}</a> : null;
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
      dateModified: reviewed,
      jsonLd: [
        // MedicalWebPage
        {
          "@context": "https://schema.org",
          "@type": "MedicalWebPage",
          "@id": `${pageUrl}#webpage`,
          "name": t.metaTitle,
          "description": t.metaDesc,
          "url": pageUrl,
          "isPartOf": { "@id": "https://seoul365dc.kr/#website" },
          "about": { "@id": `${pageUrl}#procedure` },
          "specialty": "Dentistry",
          "lastReviewed": reviewed,
          "dateModified": reviewed,
          "reviewedBy": REVIEWER_REF,
          "publisher": { "@id": "https://seoul365dc.kr/#dentist" },
          "speakable": {
            "@type": "SpeakableSpecification",
            "cssSelector": ["h1", "#tx-answer"]
          },
          "inLanguage": "ko-KR"
        },
        // MedicalProcedure (detailed)
        {
          "@context": "https://schema.org", "@type": "MedicalProcedure",
          "@id": `https://seoul365dc.kr/treatments/${t.slug}#procedure`,
          "name": t.name,
          "procedureType": t.slug.includes('orthodontic') || t.slug.includes('invisalign') ? "NonSurgicalProcedure" : "SurgicalProcedure",
          "bodyLocation": "Oral cavity",
          "description": answer,
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
          "areaServed": [
            { "@type": "City", "name": "인천광역시" },
            { "@type": "AdministrativeArea", "name": "인천 남동구" },
            { "@type": "AdministrativeArea", "name": "인천 구월동" },
          ],
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
        // MedicalDevice — equipment & fixtures used for this treatment
        ...(t.materials && t.materials.some(m => m.price || m.origin) ? 
          t.materials.filter(m => m.price).map(m => ({
            "@context": "https://schema.org",
            "@type": "MedicalDevice",
            "name": m.name,
            "description": m.desc,
            ...(m.origin ? { "manufacturer": { "@type": "Organization", "name": m.origin } } : {}),
            ...(m.surface ? { "material": m.surface } : {}),
            "purpose": `${t.name} 치료용 임플란트 픽스처`,
            ...(m.price ? { "offers": { "@type": "Offer", "priceCurrency": "KRW", "price": m.price, "availability": "https://schema.org/InStock" } } : {}),
          })) : [{
            "@context": "https://schema.org",
            "@type": "MedicalDevice",
            "name": `${t.name} 진료 장비`,
            "description": `서울365치과 ${t.name} 진료에 사용되는 의료 장비`,
            "manufacturer": [
              { "@type": "Organization", "name": "오스템 임플란트" },
              { "@type": "Organization", "name": "3Shape" },
            ],
            "purpose": `${t.name} 치료를 위한 정밀 진단 및 수술`,
          }]
        ),
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
      ]
    }
  )
})


export default treatmentRoutes
