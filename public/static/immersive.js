/* 서울365치과 메인 스크롤 몰입 연출 (GSAP ScrollTrigger) — '전류가 흐르는 365' 테마
   - 이 사이트는 이미 등장 효과(reveal 계열·글자 분할·커서·틸트·카운터)가 많다 → 등장은 그대로 두고,
     스크롤에 묶인 깊이·속도·불 켜짐만 가볍게 더한다
   - 기존 reveal 계열은 모양을 바꾸지 않고 .visible 을 ScrollTrigger 로도 붙여, 빠른 스크롤·#앵커로 건너뛴 블록도 반드시 보이게 한다
   - 글자는 모두 HTML에 그대로(크롤러·AEO 영향 없음). 동작 줄이기 사용자는 아무것도 하지 않는다
   - 휠 관성 스크롤은 쓰지 않는다(가로 레일·전후 비교 슬라이더 조작과 겹치지 않게) */
(function () {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!window.gsap || !window.ScrollTrigger || !document.querySelector('.hero-premium')) return;
  gsap.registerPlugin(ScrollTrigger);
  start();

  function start() {
  document.documentElement.classList.add('mx');
  var mobile = matchMedia('(max-width: 767px)').matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return gsap.utils.toArray((c || document).querySelectorAll(s)); };
  function scrub(target, from, to, st) {
    if (!target) return;
    return gsap.fromTo(target, from, Object.assign({ ease: 'none', scrollTrigger: Object.assign({ scrub: true }, st) }, to));
  }
  // 화면에 들어오면 한 번 재생 — 지나쳐도 onEnter 가 불려 끝 상태를 보장한다
  var TIMING = ['duration', 'ease', 'stagger', 'delay'];
  function enter(targets, vars, trigger, start) {
    var list = gsap.utils.toArray(targets);
    if (!list.length) return;
    var from = {}, to = { opacity: 1, y: 0, scale: 1, paused: true,
      onStart: function () { gsap.set(list, { transition: 'none' }); },
      onComplete: function () { gsap.set(list, { clearProps: 'opacity,transform,transition,clipPath,boxShadow' }); } };
    Object.keys(vars).forEach(function (k) { (TIMING.indexOf(k) > -1 ? to : from)[k] = vars[k]; });
    if ('clipPath' in from) to.clipPath = 'inset(0% 0% 0% 0% round 0px)';
    if ('boxShadow' in from) to.boxShadow = vars.boxTo;
    delete from.boxTo;
    var tw = gsap.fromTo(list, from, to);
    ScrollTrigger.create({ trigger: trigger || list[0], start: start || 'top 88%', once: true, onEnter: function () {
      tw.play();
      setTimeout(function () { if (tw.progress() < 1) tw.progress(1); }, (tw.totalDuration() + 0.6) * 1000);
    } });
  }

  // ── 히어로: 내려가면 글은 빨리 떠오르며 흐려지고, 원장 사진은 천천히 — 깊이
  var hero = $('.hero-premium');
  var cols = $$('.hero-premium > .relative.z-10 > div > div');
  if (cols[0]) scrub(cols[0], { y: 0, opacity: 1 }, { y: mobile ? -50 : -140, opacity: 0.15 }, { trigger: hero, start: 'top top', end: 'bottom top' });
  if (cols[1] && !mobile) scrub(cols[1], { y: 0, scale: 1 }, { y: 60, scale: 0.94 }, { trigger: hero, start: 'top top', end: 'bottom top' });
  $$('.orb', hero).forEach(function (o, i) { scrub(o, { yPercent: 0 }, { yPercent: (i % 2 ? -60 : 50) }, { trigger: hero, start: 'top top', end: 'bottom top' }); });

  // ── 키워드 띠: 스크롤 속도만큼 전류가 튀듯 기울었다가 바로 선다
  var band = $('section[role="marquee"]');
  if (band) {
    var inner = band.firstElementChild || band;
    var skewTo = gsap.quickTo(inner, 'skewX', { duration: 0.35, ease: 'power3' });
    ScrollTrigger.create({ trigger: band, start: 'top bottom', end: 'bottom top',
      onUpdate: function (self) { skewTo(gsap.utils.clamp(-9, 9, self.getVelocity() / -220)); },
      onLeave: function () { skewTo(0); }, onLeaveBack: function () { skewTo(0); } });
  }

  // ── 소개 영상: 둥근 화면에서 가장자리까지 한 번에 켜진다(전원 ON), 포스터는 천천히 물러남
  var video = $('#video-section');
  if (video) {
    enter(video, { clipPath: mobile ? 'inset(4% 4% 4% 4% round 22px)' : 'inset(9% 11% 9% 11% round 40px)', duration: 1.4, ease: 'expo.inOut' }, video, 'top 75%');
    scrub($('#yt-poster', video), { scale: 1.18 }, { scale: 1 }, { trigger: video, start: 'top bottom', end: 'bottom top' });
  }

  // ── 구월동 진료 카드 6장: 전류가 흐르듯 왼쪽 위부터 차례로 불이 들어온다(파란 테두리 번쩍 → 제자리)
  var gw = $('.gw-cards');
  if (gw) {
    var cards = $$('.gw-card', gw);
    enter(cards, { y: 40, opacity: 0, boxShadow: '0 0 0 2px rgba(0,102,255,.9), 0 0 36px rgba(0,229,255,.55)', boxTo: '0 2px 12px rgba(0,40,120,.05)',
      duration: 1.1, ease: 'power3.out', stagger: { each: 0.09, grid: 'auto', from: 'start' } }, gw, 'top 86%');
    $$('.gw-card-img', gw).forEach(function (box) {
      box.classList.add('mx-par');
      gsap.fromTo(box, { '--mx-y': '-6%', '--mx-s': 1.16 }, { '--mx-y': '6%', '--mx-s': 1.16, ease: 'none',
        scrollTrigger: { trigger: box, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
  }

  // ── 의료진 5인: 사진이 카드 안에서 위로 천천히 흐른다(시차)
  $$('a[href^="/doctors/"] img').forEach(function (img) {
    var box = img.parentElement;
    if (!box || !img.closest('main .tilt-card')) return;
    box.classList.add('mx-par');
    gsap.fromTo(box, { '--mx-y': '-5%', '--mx-s': 1.1 }, { '--mx-y': '5%', '--mx-s': 1.1, ease: 'none',
      scrollTrigger: { trigger: box, start: 'top bottom', end: 'bottom top', scrub: true } });
  });

  // ── 세 줄 요약: 스크롤에 맞춰 낱말에 하나씩 불이 들어온다
  var summary = $$('main section .reveal-elastic').filter(function (el) { return el.querySelectorAll(':scope > p').length >= 2; })[0];
  if (summary) {
    summary.classList.remove('reveal-elastic');
    var words = [];
    $$(':scope > p', summary).forEach(function (p) {
      var parts = p.textContent.split(/(\s+)/);
      p.textContent = '';
      parts.forEach(function (w) {
        if (!w) return;
        if (/^\s+$/.test(w)) { p.appendChild(document.createTextNode(w)); return; }
        var s = document.createElement('span'); s.className = 'mx-lit'; s.textContent = w; p.appendChild(s); words.push(s);
      });
    });
    gsap.fromTo(words, { opacity: 0.14 }, { opacity: 1, stagger: 0.1, ease: 'none',
      scrollTrigger: { trigger: summary, start: 'top 80%', end: 'bottom 45%', scrub: true } });
  }

  // ── 마지막 상담: 어두운 무대의 빛 덩어리가 커지며 다가오고, 문구 묶음이 아래에서 올라선다
  var cta = $('section.cta-dark');
  if (cta) {
    scrub($('.morph-blob', cta), { scale: 0.45, opacity: 0.4 }, { scale: 1.25, opacity: 1 }, { trigger: cta, start: 'top bottom', end: 'center center' });
    scrub($('.relative.z-10', cta), { y: mobile ? 30 : 90 }, { y: 0 }, { trigger: cta, start: 'top bottom', end: 'top 30%' });
  }

  // ── 기존 등장 효과는 모양 그대로, ScrollTrigger 로도 .visible 을 붙여 건너뛴 블록이 숨은 채 남지 않게
  var REVEALS = '.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-3d, .reveal-blur, .reveal-pop, .reveal-elastic, .reveal-rotate, .text-split, .text-words, .stagger-cascade, .stagger-children, .img-reveal, .highlight-word, .line-draw, .divider-animated';
  $$(REVEALS).forEach(function (el) {
    if (el.closest('.hero-premium')) return;
    ScrollTrigger.create({ trigger: el, start: 'top 95%', once: true, onEnter: function () { el.classList.add('visible'); } });
  });

  window.addEventListener('load', function () { ScrollTrigger.refresh(); });
  }
})();
