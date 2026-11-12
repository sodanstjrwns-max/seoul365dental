// ============================================================
// 🌍 v3 SUPER UPGRADE — Multilingual SEO (송도 외국인 타겟)
// 영어/중국어 매트릭스 — Songdo expats & medical tourism
// ============================================================
import { Hono } from 'hono'
import type { Bindings } from '../lib/types'
import { Icon } from '../lib/icons'

const intlRoutes = new Hono<{ Bindings: Bindings }>()

// ────────────────────────────────────────────────
// ENGLISH — /en
// ────────────────────────────────────────────────
intlRoutes.get('/en', (c) => {
  const canonicalUrl = 'https://seoul365dc.kr/en';

  const dentistSchema = {
    "@context": "https://schema.org",
    "@type": "Dentist",
    "name": "Seoul 365 Dental Clinic",
    "url": canonicalUrl,
    "telephone": "+82-32-432-0365",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "138 Yesul-ro, Ito Tower 2F #212",
      "addressLocality": "Namdong-gu, Incheon",
      "addressCountry": "KR",
      "postalCode": "21556",
    },
    "geo": { "@type": "GeoCoordinates", "latitude": "37.4482", "longitude": "126.7042" },
    "inLanguage": ["ko-KR", "en", "zh"],
    "openingHours": ["Mo-Th 10:00-21:00", "Fr 10:00-19:00", "Sa 10:00-14:00", "Su 14:00-18:00"],
    "priceRange": "$$",
  };

  return c.render(
    <div class="intl" lang="en">
      <section class="phead" aria-labelledby="intl-h1">
        <div class="wrap phead-in">
          <div class="phead-text">
            <p class="eyebrow">FOR INTERNATIONAL PATIENTS</p>
            <h1 id="intl-h1" class="display-xl">Seoul 365 Dental Clinic</h1>
            <p class="lead">
              Premium dental care in Incheon — English-speaking dentists from Seoul National University.
              Open 365 days a year. Implants · Invisalign · Sedation dentistry.
            </p>
            <div class="phead-cta">
              <a href="tel:+82324320365" class="btn btn-white">
                <Icon name="phone" /> Call +82-32-432-0365
              </a>
              <a href="/reservation" class="btn btn-light">
                <Icon name="calendar" /> Book Consultation
              </a>
            </div>
          </div>
          <div class="phead-aside">
            <div class="fact-card">
              <h3 class="eyebrow">Clinic Information</h3>
              <table class="intl-info">
                <tbody>
                  <tr><td>Address</td><td>138 Yesul-ro, Ito Tower 2F #212, Namdong-gu, Incheon</td></tr>
                  <tr><td>Phone</td><td>+82-32-432-0365</td></tr>
                  <tr><td>Hours</td><td>Mon-Thu 10:00-21:00 / Fri 10:00-19:00 / Sat 10:00-14:00 / Sun 14:00-18:00</td></tr>
                  <tr><td>Subway</td><td>Arts Center Station (Incheon Line 1), right across from Exit 6</td></tr>
                  <tr><td>Languages</td><td>Korean (primary), English (basic), translation service available</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section class="sec">
        <div class="wrap">
          <div class="type-grid" data-rv-group>
            {[
              { title: 'Dental Implants', desc: 'Osstem ₩640K · Straumann ₩1.29M. 5-doctor collaboration. CT-guided surgery.' },
              { title: 'Invisalign', desc: 'Certified Invisalign provider. AI-based ClinCheck. From ₩3.5M (Express).' },
              { title: 'Sedation Dentistry', desc: 'Conscious sedation for dental anxiety. Safe for implants & extractions. +₩200K.' },
            ].map((item, i) => (
              <div class="card type-card">
                <span class="n mono">{String(i + 1).padStart(2, '0')}</span>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section class="sec" style="padding-top:0">
        <div class="wrap tx-two">
          <div class="sec-head" data-rv>
            <h2 class="display-2">Why Seoul 365 Dental?</h2>
          </div>
          <ul class="check-list intl-checks" data-rv-group>
            {[
              'Open 365 days/year (weekdays until 9 PM, Sundays 2~6 PM)',
              '5 dentists graduated from Seoul National University Dental College',
              'In-house dental lab for faster prosthetics',
              'Korean & English consultation available',
              'Located in Guwol-dong (right across from Arts Center Station Exit 6)',
              'Easy access from Songdo International City (25 min by subway)',
              'CT diagnostic equipment & 3D oral scanner',
            ].map(line => (
              <li>
                <Icon name="check" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section class="cta-band" aria-labelledby="intl-cta">
        <div class="wrap-n" style="text-align:center;position:relative">
          <h3 id="intl-cta" class="display-xl" data-rv>Schedule Your Visit</h3>
          <p class="lead" data-rv>English-speaking staff available. Free consultation.</p>
          <div class="cta-actions" data-rv-group>
            <a href="/reservation" class="btn btn-primary btn-lg">
              <Icon name="calendar" /> Book Online
            </a>
            <a href="tel:+82324320365" class="btn btn-white btn-lg mono">
              <Icon name="phone" /> +82-32-432-0365
            </a>
          </div>
        </div>
      </section>
    </div>,
    {
      title: 'Seoul 365 Dental Clinic | Implants, Invisalign in Incheon',
      description: 'English-friendly dental clinic in Incheon. Seoul National University dentists. Open 365 days. Implants from ₩640K. Invisalign certified. Located near Songdo International City.',
      canonical: canonicalUrl,
      keywords: 'incheon dentist english, songdo dentist, korea dental implant, invisalign incheon, expat dentist korea, english dentist incheon, seoul national university dentist',
      jsonLd: [dentistSchema],
    }
  );
});

// ────────────────────────────────────────────────
// CHINESE (Simplified) — /zh
// ────────────────────────────────────────────────
intlRoutes.get('/zh', (c) => {
  const canonicalUrl = 'https://seoul365dc.kr/zh';

  const dentistSchema = {
    "@context": "https://schema.org",
    "@type": "Dentist",
    "name": "首尔365牙科诊所",
    "alternateName": "Seoul 365 Dental Clinic",
    "url": canonicalUrl,
    "telephone": "+82-32-432-0365",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "艺术路138号 Ito大厦 2楼 212号",
      "addressLocality": "仁川市南洞区",
      "addressCountry": "KR",
    },
    "geo": { "@type": "GeoCoordinates", "latitude": "37.4482", "longitude": "126.7042" },
    "inLanguage": ["zh-CN", "ko-KR"],
  };

  return c.render(
    <div class="intl intl-zh" lang="zh-Hans">
      <section class="phead" aria-labelledby="intl-h1">
        <div class="wrap phead-in">
          <div class="phead-text">
            <p class="eyebrow">国际患者服务</p>
            <h1 id="intl-h1" class="display-xl">首尔365牙科诊所</h1>
            <p class="lead">
              仁川优质牙科 · 首尔大学毕业的5位医师协诊 · 全年365天营业<br/>
              种植牙 · 隐适美 · 睡眠麻醉牙科
            </p>
            <div class="phead-cta">
              <a href="tel:+82324320365" class="btn btn-white">
                <Icon name="phone" /> 电话 +82-32-432-0365
              </a>
              <a href="/reservation" class="btn btn-light">
                <Icon name="calendar" /> 预约咨询
              </a>
            </div>
          </div>
          <div class="phead-aside">
            <div class="fact-card">
              <h3 class="eyebrow">诊所信息</h3>
              <table class="intl-info">
                <tbody>
                  <tr><td>地址</td><td>仁川市南洞区艺术路138号 Ito大厦2楼212号</td></tr>
                  <tr><td>电话</td><td>+82-32-432-0365</td></tr>
                  <tr><td>营业时间</td><td>周一~四 10:00-21:00 / 周五 10:00-19:00 / 周六 10:00-14:00 / 周日 14:00-18:00</td></tr>
                  <tr><td>地铁</td><td>仁川1号线 艺术会馆站6号出口对面</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section class="sec">
        <div class="wrap">
          <div class="type-grid" data-rv-group>
            {[
              { title: '种植牙', desc: '奥齿泰64万韩元 · 士卓曼129万韩元起。5位医师协诊,CT引导手术。' },
              { title: '隐适美', desc: '隐适美认证医师。AI智能ClinCheck诊断。Express起价350万韩元。' },
              { title: '睡眠麻醉', desc: '意识镇静麻醉。安全用于种植牙和拔牙。+20万韩元。' },
            ].map((item, i) => (
              <div class="card type-card">
                <span class="n mono">{String(i + 1).padStart(2, '0')}</span>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section class="sec" style="padding-top:0">
        <div class="wrap tx-two">
          <div class="sec-head" data-rv>
            <h2 class="display-2">为什么选择<span class="intl-nb">首尔365牙科?</span></h2>
          </div>
          <ul class="check-list intl-checks" data-rv-group>
            {[
              '全年365天营业(平日至21点,周日14~18点)',
              '5位首尔大学齿科大学毕业的医师协诊',
              '自有牙科技工室 — 更快的修复体制作',
              '位于九月洞(艺术会馆站6号出口对面)',
              '从松岛国际城市方便到达(地铁25分钟)',
              'CT精密诊断设备 + 3D口腔扫描仪',
            ].map(line => (
              <li>
                <Icon name="check" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section class="cta-band" aria-labelledby="intl-cta">
        <div class="wrap-n" style="text-align:center;position:relative">
          <h3 id="intl-cta" class="display-xl" data-rv>预约就诊</h3>
          <p class="lead" data-rv>免费咨询 · 中文翻译可提供</p>
          <div class="cta-actions" data-rv-group>
            <a href="/reservation" class="btn btn-primary btn-lg">
              <Icon name="calendar" /> 在线预约
            </a>
            <a href="tel:+82324320365" class="btn btn-white btn-lg mono">
              <Icon name="phone" /> +82-32-432-0365
            </a>
          </div>
        </div>
      </section>
    </div>,
    {
      title: '首尔365牙科诊所 | 仁川种植牙·隐适美·睡眠麻醉',
      description: '仁川优质牙科诊所。首尔大学毕业医师。全年365天营业。种植牙64万韩元起。隐适美认证。位于松岛国际城市附近。',
      canonical: canonicalUrl,
      keywords: '仁川牙科, 韩国种植牙, 韩国隐适美, 仁川牙医, 松岛牙科, 首尔365牙科',
      jsonLd: [dentistSchema],
    }
  );
});

export default intlRoutes
