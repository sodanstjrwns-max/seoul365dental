// ============================================================
// 🌍 v3 SUPER UPGRADE — Multilingual SEO (송도 외국인 타겟)
// 영어/중국어 매트릭스 — Songdo expats & medical tourism
// ============================================================
import { Hono } from 'hono'
import type { Bindings } from '../lib/types'

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
    "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.9", "ratingCount": "2150" },
  };

  return c.render(
    <section class="min-h-screen bg-white">
      <div class="hero-premium" style="min-height:60vh">
        <div class="hero-grid"></div>
        <div class="orb orb-1"></div>
        <div class="orb orb-2"></div>
        <div class="relative z-10 max-w-4xl mx-auto px-5 text-center" style="padding-top:18vh">
          <p class="text-[#00E5FF] text-xs font-bold tracking-[0.3em] uppercase mb-4">FOR INTERNATIONAL PATIENTS</p>
          <h1 class="text-3xl md:text-5xl font-black text-white mb-4">Seoul 365 Dental Clinic</h1>
          <p class="text-white/60 text-base md:text-lg max-w-2xl mx-auto mb-6">
            Premium dental care in Incheon — English-speaking dentists from Seoul National University.
            Open 365 days a year. Implants · Invisalign · Sedation dentistry.
          </p>
          <div class="flex flex-wrap justify-center gap-3">
            <a href="tel:+82324320365" class="px-6 py-3 rounded-xl bg-white text-[#0066FF] font-bold">
              <i class="fa-solid fa-phone mr-2"></i> Call +82-32-432-0365
            </a>
            <a href="/reservation" class="px-6 py-3 rounded-xl bg-white/10 border border-white/30 text-white font-bold">
              <i class="fa-solid fa-calendar-check mr-2"></i> Book Consultation
            </a>
          </div>
        </div>
      </div>

      <div class="max-w-4xl mx-auto px-5 md:px-8 py-16">
        <div class="grid md:grid-cols-3 gap-6 mb-16">
          {[
            { icon: 'fa-tooth', title: 'Dental Implants', desc: 'Osstem ₩640K · Straumann ₩1.29M. 5-doctor collaboration. CT-guided surgery.' },
            { icon: 'fa-grin', title: 'Invisalign', desc: 'Certified Invisalign provider. AI-based ClinCheck. From ₩3.5M (Express).' },
            { icon: 'fa-bed', title: 'Sedation Dentistry', desc: 'Conscious sedation for dental anxiety. Safe for implants & extractions. +₩200K.' },
          ].map(item => (
            <div class="p-6 rounded-2xl border border-gray-100">
              <i class={`fa-solid ${item.icon} text-[#0066FF] text-3xl mb-4`}></i>
              <h3 class="font-bold text-gray-900 mb-2">{item.title}</h3>
              <p class="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <h2 class="text-2xl font-bold text-gray-900 mb-6">Why Seoul 365 Dental?</h2>
        <div class="space-y-3 mb-12">
          {[
            'Open 365 days/year (weekdays until 9 PM, Sundays 2~6 PM)',
            '5 dentists graduated from Seoul National University Dental College',
            'In-house dental lab for faster prosthetics',
            'Korean & English consultation available',
            'Located in Guwol-dong (3 min walk from Arts Center Station Exit 5)',
            'Easy access from Songdo International City (25 min by subway)',
            'CT diagnostic equipment & 3D oral scanner',
            'Patient reviews: 4.9/5 (2,150+ reviews)',
          ].map(line => (
            <div class="flex items-start gap-3">
              <i class="fa-solid fa-check-circle text-[#0066FF] mt-1"></i>
              <span class="text-gray-700">{line}</span>
            </div>
          ))}
        </div>

        <div class="p-6 rounded-2xl bg-gray-50 mb-12">
          <h3 class="font-bold text-gray-900 mb-4">Clinic Information</h3>
          <table class="w-full text-sm">
            <tbody>
              <tr class="border-b border-gray-200"><td class="py-2 font-semibold text-gray-500 w-1/3">Address</td><td class="py-2">138 Yesul-ro, Ito Tower 2F #212, Namdong-gu, Incheon</td></tr>
              <tr class="border-b border-gray-200"><td class="py-2 font-semibold text-gray-500">Phone</td><td class="py-2">+82-32-432-0365</td></tr>
              <tr class="border-b border-gray-200"><td class="py-2 font-semibold text-gray-500">Hours</td><td class="py-2">Mon-Thu 10:00-21:00 / Fri 10:00-19:00 / Sat 10:00-14:00 / Sun 14:00-18:00</td></tr>
              <tr class="border-b border-gray-200"><td class="py-2 font-semibold text-gray-500">Subway</td><td class="py-2">Arts Center Station (Incheon Line 1) Exit 5, 3 min walk</td></tr>
              <tr><td class="py-2 font-semibold text-gray-500">Languages</td><td class="py-2">Korean (primary), English (basic), translation service available</td></tr>
            </tbody>
          </table>
        </div>

        <div class="p-8 rounded-3xl bg-gradient-to-br from-[#0066FF] to-[#2979FF] text-white text-center">
          <h3 class="text-2xl font-black mb-2">Schedule Your Visit</h3>
          <p class="text-white/80 text-sm mb-5">English-speaking staff available. Free consultation.</p>
          <div class="flex flex-wrap justify-center gap-2">
            <a href="/reservation" class="px-5 py-3 rounded-xl bg-white text-[#0066FF] font-bold text-sm">
              <i class="fa-solid fa-calendar-check mr-1.5"></i> Book Online
            </a>
            <a href="tel:+82324320365" class="px-5 py-3 rounded-xl bg-white/10 border border-white/30 text-white font-bold text-sm">
              <i class="fa-solid fa-phone mr-1.5"></i> +82-32-432-0365
            </a>
          </div>
        </div>
      </div>
    </section>,
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
    "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.9", "ratingCount": "2150" },
  };

  return c.render(
    <section class="min-h-screen bg-white">
      <div class="hero-premium" style="min-height:60vh">
        <div class="hero-grid"></div>
        <div class="orb orb-1"></div>
        <div class="orb orb-2"></div>
        <div class="relative z-10 max-w-4xl mx-auto px-5 text-center" style="padding-top:18vh">
          <p class="text-[#00E5FF] text-xs font-bold tracking-[0.3em] uppercase mb-4">国际患者服务</p>
          <h1 class="text-3xl md:text-5xl font-black text-white mb-4">首尔365牙科诊所</h1>
          <p class="text-white/60 text-base md:text-lg max-w-2xl mx-auto mb-6">
            仁川优质牙科 · 首尔大学毕业的5位医师协诊 · 全年365天营业<br/>
            种植牙 · 隐适美 · 睡眠麻醉牙科
          </p>
          <div class="flex flex-wrap justify-center gap-3">
            <a href="tel:+82324320365" class="px-6 py-3 rounded-xl bg-white text-[#0066FF] font-bold">
              <i class="fa-solid fa-phone mr-2"></i> 电话 +82-32-432-0365
            </a>
            <a href="/reservation" class="px-6 py-3 rounded-xl bg-white/10 border border-white/30 text-white font-bold">
              <i class="fa-solid fa-calendar-check mr-2"></i> 预约咨询
            </a>
          </div>
        </div>
      </div>

      <div class="max-w-4xl mx-auto px-5 md:px-8 py-16">
        <div class="grid md:grid-cols-3 gap-6 mb-16">
          {[
            { icon: 'fa-tooth', title: '种植牙', desc: '奥齿泰64万韩元 · 士卓曼129万韩元起。5位医师协诊,CT引导手术。' },
            { icon: 'fa-grin', title: '隐适美', desc: '隐适美认证医师。AI智能ClinCheck诊断。Express起价350万韩元。' },
            { icon: 'fa-bed', title: '睡眠麻醉', desc: '意识镇静麻醉。安全用于种植牙和拔牙。+20万韩元。' },
          ].map(item => (
            <div class="p-6 rounded-2xl border border-gray-100">
              <i class={`fa-solid ${item.icon} text-[#0066FF] text-3xl mb-4`}></i>
              <h3 class="font-bold text-gray-900 mb-2">{item.title}</h3>
              <p class="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <h2 class="text-2xl font-bold text-gray-900 mb-6">为什么选择首尔365牙科?</h2>
        <div class="space-y-3 mb-12">
          {[
            '全年365天营业(平日至21点,周日14~18点)',
            '5位首尔大学齿科大学毕业的医师协诊',
            '自有牙科技工室 — 更快的修复体制作',
            '位于九月洞(艺术会馆站5号出口步行3分钟)',
            '从松岛国际城市方便到达(地铁25分钟)',
            'CT精密诊断设备 + 3D口腔扫描仪',
            '患者评价: 4.9/5(2,150+评价)',
          ].map(line => (
            <div class="flex items-start gap-3">
              <i class="fa-solid fa-check-circle text-[#0066FF] mt-1"></i>
              <span class="text-gray-700">{line}</span>
            </div>
          ))}
        </div>

        <div class="p-6 rounded-2xl bg-gray-50 mb-12">
          <h3 class="font-bold text-gray-900 mb-4">诊所信息</h3>
          <table class="w-full text-sm">
            <tbody>
              <tr class="border-b border-gray-200"><td class="py-2 font-semibold text-gray-500 w-1/3">地址</td><td class="py-2">仁川市南洞区艺术路138号 Ito大厦2楼212号</td></tr>
              <tr class="border-b border-gray-200"><td class="py-2 font-semibold text-gray-500">电话</td><td class="py-2">+82-32-432-0365</td></tr>
              <tr class="border-b border-gray-200"><td class="py-2 font-semibold text-gray-500">营业时间</td><td class="py-2">周一~四 10:00-21:00 / 周五 10:00-19:00 / 周六 10:00-14:00 / 周日 14:00-18:00</td></tr>
              <tr><td class="py-2 font-semibold text-gray-500">地铁</td><td class="py-2">仁川1号线 艺术会馆站5号出口 步行3分钟</td></tr>
            </tbody>
          </table>
        </div>

        <div class="p-8 rounded-3xl bg-gradient-to-br from-[#0066FF] to-[#2979FF] text-white text-center">
          <h3 class="text-2xl font-black mb-2">预约就诊</h3>
          <p class="text-white/80 text-sm mb-5">免费咨询 · 中文翻译可提供</p>
          <div class="flex flex-wrap justify-center gap-2">
            <a href="/reservation" class="px-5 py-3 rounded-xl bg-white text-[#0066FF] font-bold text-sm">
              <i class="fa-solid fa-calendar-check mr-1.5"></i> 在线预约
            </a>
            <a href="tel:+82324320365" class="px-5 py-3 rounded-xl bg-white/10 border border-white/30 text-white font-bold text-sm">
              <i class="fa-solid fa-phone mr-1.5"></i> +82-32-432-0365
            </a>
          </div>
        </div>
      </div>
    </section>,
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
