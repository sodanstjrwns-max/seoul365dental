/* 서울365치과 메인 스크롤 연출 v6 (GSAP 3.12 ScrollTrigger) — "낮과 밤, 365" (2026-11-04)
   - 글자는 전부 HTML 그대로(크롤러·AEO 영향 0). html.mx(동작 줄이기 아님 + IO 지원) + GSAP 로드 성공(html.gs)일 때만 동작.
     아니면 CSS 는 아무것도 숨기지 않는다. 그라데이션 글씨 없음 → 낱말 분할 투명 사고(2026-11-01 대구) 없음.
   - 히어로 인트로(줄 마스크) → 시간 레일(낮→밤, PC 고정 스크럽) → 약속 카드 스택 → 영상 전원 ON
     → 의료진 가로 레일(PC 고정) → 사진 시차 → 세 줄 요약 낱말 밝힘 → 상담 밴드 상승.
   - 휠 관성 스크롤(Lenis)은 쓰지 않는다. 고정(pin) 구간은 PC 에서만. */
(function () {
  var html = document.documentElement;
  if (!html.classList.contains('mx') || !window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  html.classList.add('gs');
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return gsap.utils.toArray((c || document).querySelectorAll(s)); };
  var mobile = matchMedia('(max-width: 1023px)').matches;
  var pad = function (n) { return (n < 10 ? '0' : '') + n; };

  // ── 1. 히어로 인트로 (로드 직후 1회): 제목 세 줄이 마스크 아래에서 올라오고, 사진은 살짝 줌 아웃, 시간 카드가 뒤따른다
  var hero = $('.hero');
  if (hero) {
    var lines = $$('.hero .hl-in'), items = $$('.hero [data-hero]:not([data-hero="media"]):not([data-hero="wm"])');
    var media = $('.hero [data-hero="media"]'), wm = $('.hero [data-hero="wm"]'), frameImg = $('.hero-frame img'), tcard = $('.hero .time-card');
    var tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    tl.to(lines, { y: 0, duration: 1.15, stagger: 0.12 }, 0.05)
      .fromTo(items, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.9, stagger: 0.08 }, 0.35)
      .fromTo(media, { opacity: 0, y: 30, scale: 0.98 }, { opacity: 1, y: 0, scale: 1, duration: 1.3 }, 0.25)
      .fromTo(frameImg, { scale: 1.14 }, { scale: 1.04, duration: 1.8, ease: 'power2.out' }, 0.25)
      .fromTo(tcard, { opacity: 0, y: 14, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.8 }, 0.9)
      .fromTo(wm, { opacity: 0, x: 60 }, { opacity: 1, x: 0, duration: 1.6, ease: 'power2.out' }, 0.2);
    // 끝 상태 보장: 탭이 숨겨져 타임라인이 밀려도 2.8초 뒤엔 전부 보인다
    setTimeout(function () { if (tl.progress() < 1) tl.progress(1); }, 2800);
    // 스크롤 깊이: 글은 빨리 흐려지고, 사진은 천천히 물러나고, 워터마크는 반대로 떠오른다
    if (!mobile) {
      var heroST = { trigger: hero, start: 'top top', end: 'bottom top', scrub: true };
      gsap.to('.hero-copy', { y: -90, opacity: 0.1, ease: 'none', scrollTrigger: heroST });
      gsap.to('.hero-media', { y: 50, scale: 0.96, ease: 'none', scrollTrigger: heroST });
      if (wm) gsap.to(wm, { y: -140, ease: 'none', scrollTrigger: heroST });
    }
  }

  // ── 2. 시간 레일: 10:00 → 21:00 이 채워지며 종이색이 밤색으로 (PC: 섹션 고정 160%, 모바일: 고정 없이 스크럽)
  var tb = $('[data-tb]');
  if (tb) {
    var digits = $('[data-tb-digits]', tb), marks = $$('.tb-mark', tb), pin = $('.tb-pin', tb);
    var state = { p: 0 };
    function render() {
      var p = state.p;
      tb.style.setProperty('--p', p.toFixed(4));
      var mins = Math.round(p * 11 * 60), h = 10 + Math.floor(mins / 60), m = mins % 60;
      if (digits) digits.textContent = pad(h) + ':' + pad(m);
      tb.classList.toggle('night', p > 0.58);
      marks.forEach(function (mk) { mk.classList.toggle('lit', p >= +mk.getAttribute('data-mark') - 0.01); });
    }
    render();
    gsap.to(state, { p: 1, ease: 'none', onUpdate: render, scrollTrigger: mobile
      ? { trigger: tb, start: 'top 72%', end: 'bottom 75%', scrub: 0.4 }
      : { trigger: tb, start: 'top top', end: '+=160%', pin: pin, pinSpacing: true, scrub: 0.6, anticipatePin: 1 } });
  }

  // ── 3. 세 가지 약속: 다음 카드가 올라오면 앞 카드는 살짝 작아지며 물러난다(카드 자체는 CSS sticky)
  var prs = $$('.pr-card');
  prs.forEach(function (card, i) {
    var next = prs[i + 1]; if (!next) return;
    gsap.to(card, { scale: 0.95, opacity: 0.72, ease: 'none', scrollTrigger: { trigger: next, start: 'top bottom', end: 'top top+=' + (88 + i * 16), scrub: true } });
  });

  // ── 4. 소개 영상: 둥근 창에서 가장자리까지 켜진다(전원 ON). 포스터는 천천히 물러난다
  var video = $('[data-video]');
  if (video) {
    var r = mobile ? 22 : 30;
    gsap.fromTo(video, { clipPath: mobile ? 'inset(5% 5% 5% 5% round ' + r + 'px)' : 'inset(10% 8% 10% 8% round ' + r + 'px)' },
      { clipPath: 'inset(0% 0% 0% 0% round ' + r + 'px)', ease: 'none', scrollTrigger: { trigger: video, start: 'top 88%', end: 'top 22%', scrub: 0.5 } });
    var poster = $('#yt-poster', video);
    if (poster) gsap.fromTo(poster, { scale: 1.15 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: video, start: 'top bottom', end: 'bottom top', scrub: true } });
  }

  // ── 5. 의료진 가로 레일 (PC: 섹션이 지나가는 동안 레일이 옆으로 흐른다 — 고정(pin) 없음: 고정 전환 프레임이 CLS 로 잡혀 제외. 모바일: 네이티브 스냅 스크롤)
  var dr = $('[data-dr]'), track = $('[data-dr-track]');
  if (dr && track && !mobile) {
    var dist = function () { return Math.max(0, track.scrollWidth - window.innerWidth + 48); };
    gsap.to(track, { x: function () { return -dist(); }, ease: 'none',
      scrollTrigger: { trigger: dr, start: 'top 85%', end: 'bottom 15%', scrub: 0.5, invalidateOnRefresh: true } });
  }

  // ── 6. 사진 시차: 약속 카드·구월동 카드 사진이 틀 안에서 천천히 흐른다
  $$('.pr-media img, .gw-card-img img').forEach(function (img) {
    gsap.fromTo(img, { yPercent: -6, scale: 1.14 }, { yPercent: 6, scale: 1.14, ease: 'none',
      scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
  });

  // ── 7. 세 줄 요약: 스크롤에 맞춰 낱말에 하나씩 불이 들어온다(이 문단은 단색 글씨만 — 분할 안전)
  var sum = $('[data-summary]');
  if (sum) {
    var words = [];
    $$(':scope > p', sum).forEach(function (p) {
      var parts = p.textContent.split(/(\s+)/); p.textContent = '';
      parts.forEach(function (wd) {
        if (!wd) return;
        if (/^\s+$/.test(wd)) { p.appendChild(document.createTextNode(wd)); return; }
        var s = document.createElement('span'); s.className = 'mx-lit'; s.textContent = wd; p.appendChild(s); words.push(s);
      });
    });
    if (words.length) gsap.fromTo(words, { opacity: 0.16 }, { opacity: 1, stagger: 0.08, ease: 'none', scrollTrigger: { trigger: sum, start: 'top 78%', end: 'bottom 50%', scrub: true } });
  }

  // ── 8. 상담 밴드: 문구 묶음이 아래에서 올라선다
  var cta = $('.cta-band .wrap-n');
  if (cta) gsap.fromTo(cta, { y: mobile ? 30 : 70 }, { y: 0, ease: 'none', scrollTrigger: { trigger: '.cta-band', start: 'top bottom', end: 'top 35%', scrub: true } });

  // 폰트·이미지가 늦게 와도 위치 다시 계산
  window.addEventListener('load', function () { ScrollTrigger.refresh(); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
})();
