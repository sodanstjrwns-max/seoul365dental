/* 서울365치과 — app.js v7 (2026-11-04 전면 리디자인)
   헤더·드로어·진료 상태(KST)·등장 연출(IntersectionObserver)·카운터·FAQ(옛 버튼형)·로그인 상태·소개 영상.
   메인 스크롤 연출은 immersive.js(GSAP). 팝업 시스템 v4 는 이 파일 끝에 그대로 둔다.
   원칙: 글자는 전부 HTML 그대로. html.mx(동작 줄이기 아님 + IO 지원)일 때만 CSS 가 숨김 시작하고 여기서 노출한다. */
(function () {
  'use strict';
  var d = document, w = window, html = d.documentElement;
  var $ = function (s, c) { return (c || d).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || d).querySelectorAll(s)); };
  var mx = html.classList.contains('mx');

  // ── 관리자 화면: 공용 크롬 숨김
  if (location.pathname.indexOf('/admin') === 0) {
    ['#main-header', 'footer', '.mobile-cta-bar', '.fab-col', '#scroll-progress'].forEach(function (s) { $$(s).forEach(function (el) { el.style.display = 'none'; }); });
    d.body.style.paddingBottom = '0';
  }

  // ── 헤더: 스크롤 상태 · 아래로 내리면 숨김/올리면 표시 · 진행선 · 맨 위로 버튼
  var header = $('#main-header'), progress = $('#scroll-progress'), fabTop = $('#fab-top');
  var lastY = w.scrollY, ticking = false;
  function onScroll() {
    var y = w.scrollY;
    if (header) {
      header.classList.toggle('scrolled', y > 8);
      if (!header.classList.contains('menu-open')) {
        if (y > lastY + 6 && y > 160) header.classList.add('hide');
        else if (y < lastY - 6 || y < 80) header.classList.remove('hide');
      }
    }
    if (progress) { var h = html.scrollHeight - w.innerHeight; progress.style.transform = 'scaleX(' + (h > 0 ? y / h : 0) + ')'; }
    if (fabTop) fabTop.classList.toggle('show', y > 600);
    lastY = y; ticking = false;
  }
  w.addEventListener('scroll', function () { if (!ticking) { requestAnimationFrame(onScroll); ticking = true; } }, { passive: true });
  onScroll();
  if (fabTop) fabTop.addEventListener('click', function () { w.scrollTo({ top: 0, behavior: 'smooth' }); });

  // ── 모바일 드로어
  var mmBtn = $('#mobile-menu-btn'), menu = $('#mobile-menu');
  function setMenu(open) {
    if (!menu || !mmBtn) return;
    menu.hidden = !open;
    mmBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    mmBtn.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
    d.body.classList.toggle('menu-open', open);
    if (header) { header.classList.toggle('menu-open', open); if (open) header.classList.remove('hide'); }
  }
  if (mmBtn && menu) {
    mmBtn.addEventListener('click', function () { setMenu(menu.hidden); });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    d.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !menu.hidden) setMenu(false); });
    w.addEventListener('resize', function () { if (w.innerWidth > 1100 && !menu.hidden) setMenu(false); });
  }

  // ── 진료 상태(KST): 상태 칩 · 히어로 시간 카드 · 요일 막대 '오늘'
  //    월..일 = [10,21]x4, [10,19], [10,14], [14,18]  (공휴일은 일요일 시간과 같다 — 요일 판별만 한다)
  var HOURS = [[10, 21], [10, 21], [10, 21], [10, 21], [10, 19], [10, 14], [14, 18]];
  var pad = function (n) { return (n < 10 ? '0' : '') + n; };
  function kst() { var t = new Date(Date.now() + 9 * 3600000); return { day: t.getUTCDay(), h: t.getUTCHours(), m: t.getUTCMinutes() }; }
  function tick() {
    var k = kst(), idx = k.day === 0 ? 6 : k.day - 1, hh = HOURS[idx], now = k.h + k.m / 60;
    var open = now >= hh[0] && now < hh[1];
    var text = open ? '진료중 · ' + pad(hh[1]) + ':00까지' : (now < hh[0] ? '오늘 ' + pad(hh[0]) + ':00 진료 시작' : '오늘 진료 종료');
    $$('[data-status]').forEach(function (el) { el.classList.toggle('is-open', open); var t = el.querySelector('.txt'); if (t) t.textContent = text; });
    $$('[data-clock]').forEach(function (el) { el.textContent = pad(k.h) + ':' + pad(k.m); });
    $$('[data-timecard]').forEach(function (el) {
      el.classList.toggle('is-open', open);
      var t = el.querySelector('[data-tc-text]'), c = el.querySelector('[data-tc-close]');
      if (t) t.textContent = open ? '지금 진료중' : (now < hh[0] ? '진료 시작 전' : '오늘 진료 종료');
      if (c) c.textContent = open ? '~ ' + pad(hh[1]) + ':00' : '오늘 ' + pad(hh[0]) + ':00–' + pad(hh[1]) + ':00';
    });
    $$('.wk-col').forEach(function (el) { el.classList.toggle('today', +el.getAttribute('data-day') === idx); });
  }
  tick(); setInterval(tick, 30000);

  // ── 등장 연출: IntersectionObserver. html.mx 가 아니면 CSS 가 아무것도 숨기지 않으므로 할 일이 없다.
  var LEGACY = '.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-3d, .reveal-blur, .reveal-pop, .reveal-elastic, .reveal-rotate, .text-split, .text-words, .img-reveal, .line-draw, .stagger-children, .stagger-cascade';
  var NEW = '[data-rv], [data-rv-group], [data-on], .hl[data-rv="lines"]';
  function show(el) { if (el.matches(NEW)) el.classList.add('on'); else el.classList.add('visible'); }
  if (mx) {
    var targets = $$(NEW + ', ' + LEGACY).filter(function (el) { return !el.closest('.hero'); }); // 홈 히어로는 immersive.js 타임라인이 맡는다
    if ('IntersectionObserver' in w) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting) { show(en.target); io.unobserve(en.target); } });
      }, { threshold: 0.06, rootMargin: '0px 0px -6% 0px' });
      targets.forEach(function (el) { io.observe(el); });
    } else targets.forEach(show);
    // 안전망: 2.5초 뒤에도 화면 안에 있는데 숨어 있으면 노출(IO 누락·인앱 브라우저 대비)
    setTimeout(function () {
      targets.forEach(function (el) {
        if (el.classList.contains('on') || el.classList.contains('visible')) return;
        var r = el.getBoundingClientRect(); if (r.top < w.innerHeight && r.bottom > 0) show(el);
      });
    }, 2500);
    // #앵커로 들어온 경우: 해당 블록과 그 위는 즉시 노출
    if (location.hash) { try { var tgt = $(location.hash); if (tgt) { targets.forEach(function (el) { if (el.compareDocumentPosition(tgt) & Node.DOCUMENT_POSITION_FOLLOWING || tgt.contains(el)) show(el); }); } } catch (e) {} }
  }

  // ── 카운터 [data-count] (data-prefix / data-suffix 지원 — 하위페이지 옛 .stat-number 호환)
  function countUp(el) {
    if (el.dataset.done) return; el.dataset.done = '1';
    var target = parseFloat(el.getAttribute('data-count')); if (isNaN(target)) return;
    var pre = el.getAttribute('data-prefix') || '', suf = el.getAttribute('data-suffix') || '';
    var dec = target % 1 ? 1 : 0, t0 = null, dur = 1400;
    function step(ts) {
      if (!t0) t0 = ts;
      var p = Math.min((ts - t0) / dur, 1), e = 1 - Math.pow(1 - p, 4);
      el.textContent = pre + (target * e).toFixed(dec) + suf;
      if (p < 1) requestAnimationFrame(step); else el.textContent = pre + target.toFixed(dec) + suf;
    }
    requestAnimationFrame(step);
  }
  var counters = $$('[data-count]');
  if (counters.length && mx && 'IntersectionObserver' in w) {
    var cio = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { countUp(en.target); cio.unobserve(en.target); } }); }, { threshold: 0.4 });
    counters.forEach(function (el) { cio.observe(el); });
  }

  // ── FAQ(옛 버튼형 아코디언 — 하위페이지)
  $$('.faq-toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var content = this.nextElementSibling, icon = this.querySelector('.faq-icon'), expanded = content && !content.classList.contains('hidden');
      $$('.faq-toggle').forEach(function (o) {
        if (o === btn || !o.nextElementSibling) return;
        o.nextElementSibling.classList.add('hidden'); var oi = o.querySelector('.faq-icon'); if (oi) oi.classList.remove('rotate-180'); o.setAttribute('aria-expanded', 'false');
      });
      if (content) content.classList.toggle('hidden');
      if (icon) icon.classList.toggle('rotate-180');
      this.setAttribute('aria-expanded', String(!expanded));
    });
  });

  // ── 로그인 상태
  (function () {
    fetch('/api/auth/me').then(function (r) { return r.json(); }).then(function (data) {
      if (!(data && data.ok && data.user)) return;
      var nav = $('#auth-nav'), user = $('#auth-user'), name = $('#auth-user-name');
      if (nav) nav.classList.add('hidden'); if (user) user.classList.remove('hidden'); if (name) name.textContent = data.user.name + '님';
      var mn = $('#mobile-auth-nav'), mu = $('#mobile-auth-user'), mname = $('#mobile-user-name');
      if (mn) mn.classList.add('hidden'); if (mu) mu.classList.remove('hidden'); if (mname) mname.textContent = data.user.name + '님';
    }).catch(function () {});
    ['#auth-logout-btn', '#mobile-logout-btn'].forEach(function (s) {
      var b = $(s); if (b) b.addEventListener('click', function () { fetch('/api/auth/logout', { method: 'POST' }).then(function () { location.reload(); }); });
    });
  })();

  // ── 소개 영상(YouTube): 화면 가까이 오면 iframe 주입(화면을 덮도록 크기 계산), 음소거 토글, 벗어나면 일시정지
  (function () {
    var wrap = $('#yt-player-wrap'), poster = $('#yt-poster'), sec = $('#video-section'); if (!wrap || !sec) return;
    var muted = true, iframe = null, injected = false, ID = 'gB_yiatcwAc';
    function fit() {
      if (!iframe) return;
      var cw = sec.clientWidth, ch = sec.clientHeight, iw, ih;
      if (cw / ch > 16 / 9) { iw = cw; ih = cw * 9 / 16; } else { ih = ch; iw = ch * 16 / 9; }
      iframe.style.width = Math.ceil(iw) + 'px'; iframe.style.height = Math.ceil(ih) + 'px';
    }
    function inject() {
      if (injected) return; injected = true;
      iframe = d.createElement('iframe'); iframe.id = 'yt-iframe'; iframe.allow = 'autoplay; encrypted-media';
      iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin'); iframe.title = '서울365치과 소개 영상';
      iframe.style.cssText = 'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);pointer-events:none;border:0;';
      iframe.src = 'https://www.youtube-nocookie.com/embed/' + ID + '?autoplay=1&mute=1&controls=0&showinfo=0&rel=0&loop=1&playlist=' + ID + '&playsinline=1&modestbranding=1&iv_load_policy=3&disablekb=1&fs=0&cc_load_policy=0&enablejsapi=1';
      iframe.addEventListener('load', function () { if (poster) setTimeout(function () { poster.style.opacity = '0'; setTimeout(function () { poster.style.display = 'none'; }, 1000); }, 600); });
      wrap.appendChild(iframe); fit();
    }
    w.addEventListener('resize', fit);
    function cmd(f, a) { if (!iframe || !iframe.contentWindow) return; try { iframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func: f, args: a || [] }), '*'); } catch (e) {} }
    var btn = $('#yt-sound-toggle'), label = $('#yt-sound-label');
    if (btn) btn.addEventListener('click', function () {
      muted = !muted;
      if (muted) cmd('mute'); else { cmd('unMute'); cmd('setVolume', [80]); }
      btn.classList.toggle('on', !muted); btn.setAttribute('aria-pressed', String(!muted));
      if (label) label.textContent = muted ? '소리 켜기' : '소리 끄기';
    });
    if (!('IntersectionObserver' in w)) { inject(); return; }
    var lazy = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { inject(); lazy.disconnect(); } }); }, { rootMargin: '200px 0px' });
    lazy.observe(sec);
    var vis = new IntersectionObserver(function (es) { es.forEach(function (en) { if (!iframe) return; cmd(en.isIntersecting ? 'playVideo' : 'pauseVideo'); }); }, { threshold: 0.1 });
    vis.observe(sec);
  })();
})();

// ====== POPUP NOTICE SYSTEM v4 (여러 개 동시 표시) ======
// 이미지 팝업만 표시 · 최대 5개 (고정 우선 → 최신순, /api/popup-notices 의 popups 배열)
//  - PC(≥768px): 딤 배경 한 장 위에 카드 나란히(줄바꿈 허용). 카드별 × / 닫기 / 오늘 하루 보지 않기
//  - 모바일(≤767px): 우상단 "이벤트·공지 보기" 칩(기존 compact 모드) → 탭하면 한 장씩 넘겨보기
// "오늘 하루 보지 않기" → 쿠키 popup_dismissed_{YYYY-MM-DD(KST)} 에 해당 카드 id만 추가(기존 키 형식 유지)
(function(){
  if(window.location.pathname !== '/' && window.location.pathname !== '') return;
  if(window.location.pathname.startsWith('/admin')) return;
  if(window.__popupNoticeLoaded) return;
  window.__popupNoticeLoaded = true;
  // 이전 팝업 잔여물 제거
  ['popup-notice-overlay','popup-notice-card','p365-popups'].forEach(function(id){
    var el = document.getElementById(id); if(el && el.parentNode) el.parentNode.removeChild(el);
  });

  var MAX = 5;
  function getCookie(name){
    var match = document.cookie.match(new RegExp('(?:^|;\\s*)' + name + '=([^;]*)'));
    return match ? decodeURIComponent(match[1]) : null;
  }
  function setCookie(name, val, days){
    var d = new Date(); d.setTime(d.getTime() + days*86400000);
    document.cookie = name + '=' + encodeURIComponent(val) + ';path=/;expires=' + d.toUTCString() + ';SameSite=Lax';
  }
  function esc(s){
    return String(s == null ? '' : s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
  }

  var today = new Date(Date.now()+9*3600000).toISOString().split('T')[0];
  var cookieName = 'popup_dismissed_' + today;
  function dismissedIds(){ var v = getCookie(cookieName); return v ? v.split(',') : []; }
  function hideToday(id){
    var ids = dismissedIds();
    if(ids.indexOf(String(id)) === -1) ids.push(String(id));
    setCookie(cookieName, ids.join(','), 1);
  }

  var CSS = ''
    + '#p365-popups{position:fixed;inset:0;z-index:99990;display:flex;padding:24px;overflow-y:auto;overscroll-behavior:contain;background:rgba(8,18,40,.55);opacity:0;transition:opacity .3s ease}'
    + '#p365-popups[hidden]{display:none!important}'
    + '#p365-popups.show{opacity:1}'
    + '#p365-popups:not(.show){pointer-events:none}'
    + '#p365-popups .p365-stack{margin:auto;display:flex;flex-wrap:wrap;gap:16px;justify-content:center;align-items:flex-start;max-width:100%}'
    + '#p365-popups .p365-card{position:relative;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 20px 50px rgba(0,0,0,.25);width:520px;max-width:100%;display:flex;flex-direction:column;transform:translateY(-10px);transition:opacity .3s ease,transform .35s cubic-bezier(.16,1,.3,1)}'
    + '#p365-popups.n2 .p365-card{width:440px}#p365-popups.n3 .p365-card{width:380px}'
    + '#p365-popups.show .p365-card{transform:translateY(0)}'
    + '#p365-popups .p365-card.out{opacity:0;transform:translateY(-10px) scale(.97)}'
    + '#p365-popups .p365-img img{width:100%;max-height:68vh;display:block;object-fit:contain;background:#fff}'
    + '#p365-popups .p365-x{position:absolute;top:10px;right:10px;width:44px;height:44px;border-radius:50%;background:rgba(0,0,0,.4);border:none;color:#fff;font-size:20px;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .2s;z-index:2}'
    + '#p365-popups .p365-x:hover{background:rgba(0,0,0,.6)}'
    + '#p365-popups .p365-foot{padding:6px 12px 6px 16px;display:flex;align-items:center;justify-content:space-between;gap:8px;background:#fff;flex:none}'
    + '#p365-popups .p365-hide{display:flex;align-items:center;gap:6px;min-height:44px;padding:0;background:none;border:none;cursor:pointer;font-size:12px;color:#999}'
    + '#p365-popups .p365-hide:hover{color:#555}'
    + '#p365-popups .p365-hide input{width:15px;height:15px;accent-color:#1E4BD8;pointer-events:none;margin:0}'
    + '#p365-popups .p365-close{min-height:36px;background:none;border:1px solid #ddd;padding:6px 16px;border-radius:8px;font-size:12px;font-weight:600;color:#666;cursor:pointer;transition:background .2s}'
    + '#p365-popups .p365-close:hover{background:#f5f5f5}'
    + '#p365-popups :focus-visible{outline:2px solid #1E4BD8;outline-offset:2px}'
    + '#p365-popups .p365-chip,#p365-popups .p365-nav{display:none}'
    // 모바일 compact 칩 (기존 compact 모드 유지: 우상단 88px, 260px, 흰 카드)
    + '#p365-popups.compact{inset:88px 16px auto auto;padding:0;background:none;overflow:visible;width:260px;max-width:calc(100vw - 32px)}'
    + '#p365-popups.compact .p365-stack,#p365-popups.compact .p365-nav{display:none}'
    + '#p365-popups.compact .p365-chip{display:block;position:relative;width:100%;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 20px 50px rgba(0,0,0,.25)}'
    + '#p365-popups .p365-expand{display:block;min-height:48px;width:100%;padding:12px 52px 12px 16px;border:0;background:#fff;color:#0050cc;font-size:14px;font-weight:700;text-align:left;cursor:pointer}'
    + '#p365-popups .p365-count{display:inline-flex;align-items:center;justify-content:center;min-width:22px;height:22px;margin-left:6px;padding:0 6px;border-radius:99px;background:#1E4BD8;color:#fff;font-size:12px;font-weight:800;vertical-align:1px}'
    + '#p365-popups .p365-chip .p365-x{top:2px;right:2px;background:none;color:#999}'
    + '#p365-popups .p365-chip .p365-x:hover{background:#f2f5fa;color:#333}'
    // 모바일 한 장씩 보기
    + '#p365-popups.single{flex-direction:column;align-items:center;padding:16px}'
    + '#p365-popups.single .p365-stack{margin:auto auto 0;width:100%;max-width:420px;flex-wrap:nowrap}'
    + '#p365-popups.single .p365-card{display:none;width:100%}'
    + '#p365-popups.single .p365-card.active{display:flex;animation:p365In .25s ease}'
    + '#p365-popups.single .p365-img img{max-height:calc(100svh - 190px)}'
    + '#p365-popups.single .p365-nav{display:flex;align-items:center;justify-content:center;gap:14px;margin:12px auto auto}'
    + '#p365-popups.single .p365-nav[hidden]{display:none}'
    + '#p365-popups .p365-nav button{width:44px;height:44px;border-radius:50%;border:none;background:#fff;color:#0050cc;font-size:24px;line-height:1;cursor:pointer;box-shadow:0 4px 14px rgba(0,0,0,.25)}'
    + '#p365-popups .p365-ind{min-width:64px;text-align:center;font-size:14px;font-weight:700;color:#fff;letter-spacing:.04em;text-shadow:0 1px 4px rgba(0,0,0,.5)}'
    + '@keyframes p365In{from{opacity:0;transform:translateX(var(--p365-dx,0))}to{opacity:1;transform:none}}'
    + '@media(prefers-reduced-motion:reduce){#p365-popups,#p365-popups .p365-card{transition:none}#p365-popups.single .p365-card.active{animation:none}}';

  function cardHtml(n){
    var id = Number(n.id);
    var title = n.title || '공지사항';
    return '<div class="p365-card" id="p365-card-' + id + '" data-id="' + id + '" role="group" aria-label="' + esc(title) + '">'
      + '<button type="button" class="p365-x" data-act="close" aria-label="' + esc(title) + ' 팝업 닫기">&times;</button>'
      + '<div class="p365-img"><img src="' + esc(n.image) + '" alt="' + esc(title) + '" /></div>'
      + '<div class="p365-foot">'
      +   '<button type="button" class="p365-hide" data-act="hide"><input type="checkbox" tabindex="-1" aria-hidden="true" /><span>오늘 하루 보지 않기</span></button>'
      +   '<button type="button" class="p365-close" data-act="close">닫기</button>'
      + '</div>'
      + '</div>';
  }

  fetch('/api/popup-notices')
    .then(function(r){ return r.json(); })
    .then(function(data){
      if(!data || !data.ok) return;
      // popups(최대 5개) 우선, 구버전 응답이면 notices 사용
      var list = Array.isArray(data.popups) ? data.popups : (data.notices || []);
      var hidden = dismissedIds();
      list = list.filter(function(n){
        return n && n.image && String(n.image).length > 5 && hidden.indexOf(String(n.id)) === -1;
      }).slice(0, MAX);
      if(list.length === 0) return;
      if(document.getElementById('p365-popups')) return;

      var ov = document.createElement('div');
      ov.id = 'p365-popups';
      ov.setAttribute('role','dialog');
      ov.setAttribute('aria-modal','true');
      ov.setAttribute('aria-label','병원 소식');
      ov.hidden = true;
      ov.innerHTML = '<style>' + CSS + '</style>'
        + '<div class="p365-chip"><button type="button" class="p365-expand" aria-expanded="false" aria-controls="p365-stack">이벤트·공지 보기</button>'
        + '<button type="button" class="p365-x" data-act="close-all" aria-label="공지 닫기">&times;</button></div>'
        + '<div class="p365-stack" id="p365-stack">' + list.map(cardHtml).join('') + '</div>'
        + '<div class="p365-nav" hidden><button type="button" class="p365-prev" aria-label="이전 소식">&lsaquo;</button>'
        + '<span class="p365-ind" aria-live="polite">1 / ' + list.length + '</span>'
        + '<button type="button" class="p365-next" aria-label="다음 소식">&rsaquo;</button></div>';
      document.body.appendChild(ov);

      var stack = ov.querySelector('.p365-stack'), nav = ov.querySelector('.p365-nav'),
          ind = ov.querySelector('.p365-ind'), chip = ov.querySelector('.p365-expand');
      var mq = matchMedia('(max-width:767px)');
      var compact = mq.matches, idx = 0, prevOverflow = '', locked = false, closed = false;

      function cards(){ return Array.prototype.slice.call(stack.querySelectorAll('.p365-card:not(.out)')); }
      // 스크롤 잠금 (2026-10-31 CLS 수정)
      //  - 스크롤바가 자리를 차지하는 환경(PC 크롬: 사이트 6px 스크롤바, 윈도 기본 스크롤바)에서 body overflow:hidden 을 걸면
      //    스크롤바가 사라져 페이지 폭이 바뀌고 화면 전체가 옆으로 밀린다(scrollbar-gutter 는 커스텀 스크롤바에서 자리를 지키지 못함).
      //    → 이때는 overflow 를 건드리지 않고, 화면 전체를 덮는 오버레이(overscroll-behavior:contain)가 휠·키 스크롤을 붙잡는다.
      //  - 스크롤바가 자리를 차지하지 않는 환경(모바일·맥 오버레이 스크롤바)은 기존대로 body overflow:hidden.
      var softLock = false;
      function lock(){
        if(locked) return; locked = true;
        softLock = (window.innerWidth - document.documentElement.clientWidth) > 0;
        if(softLock) return;
        prevOverflow = document.body.style.overflow; document.body.style.overflow = 'hidden';
      }
      function unlock(){ if(locked){ if(!softLock) document.body.style.overflow = prevOverflow; locked = false; softLock = false; } }
      ov.addEventListener('wheel', function(e){
        if(locked && softLock && ov.scrollHeight <= ov.clientHeight + 1) e.preventDefault();
      }, {passive:false});
      function setCountClass(){
        var n = cards().length;
        ov.classList.toggle('n2', n === 2);
        ov.classList.toggle('n3', n >= 3);
      }
      function updateChip(){
        var n = cards().length;
        chip.innerHTML = '이벤트·공지 보기' + (n > 1 ? '<span class="p365-count">' + n + '</span>' : '');
        chip.setAttribute('aria-label', '이벤트·공지 ' + n + '건 보기');
      }
      function show(i, dir){
        var cs = cards(); if(!cs.length) return;
        idx = (i + cs.length) % cs.length;
        cs.forEach(function(c, k){
          c.classList.toggle('active', k === idx);
          c.style.setProperty('--p365-dx', dir ? (dir*40) + 'px' : '0');
        });
        ind.textContent = (idx + 1) + ' / ' + cs.length;
        nav.hidden = cs.length < 2;
      }
      function focusFirst(){
        var c = ov.classList.contains('single') ? stack.querySelector('.p365-card.active') : cards()[0];
        var b = c && c.querySelector('.p365-x');
        if(b){ try{ b.focus({preventScroll:true}); }catch(e){ b.focus(); } }
      }
      function applyMode(){
        setCountClass();
        if(compact){
          ov.classList.add('compact'); ov.classList.remove('single');
          ov.setAttribute('role','region'); ov.removeAttribute('aria-modal');
          updateChip(); return;
        }
        ov.classList.remove('compact');
        ov.setAttribute('role','dialog'); ov.setAttribute('aria-modal','true');
        ov.classList.toggle('single', mq.matches);
        if(mq.matches) show(idx, 0);
      }
      function open(){
        applyMode();
        ov.hidden = false;
        var reveal = function(){ if(!closed) ov.classList.add('show'); };
        requestAnimationFrame(reveal); setTimeout(reveal, 400); // rAF가 멈춘 백그라운드 탭 대비
        if(!compact){ lock(); setTimeout(focusFirst, 60); }
      }
      function closeAll(){
        if(closed) return; closed = true;
        ov.classList.remove('show'); unlock();
        setTimeout(function(){ if(ov.parentNode) ov.parentNode.removeChild(ov); }, 320);
      }
      function removeCard(c, instant){
        if(!c || c.classList.contains('out')) return;
        c.classList.add('out');
        var single = ov.classList.contains('single');
        var left = cards().length;
        if(!left){ closeAll(); return; }
        if(single || instant || compact){ if(c.parentNode) c.parentNode.removeChild(c); if(single) show(Math.min(idx, left-1), 0); }
        else setTimeout(function(){ if(c.parentNode) c.parentNode.removeChild(c); }, 260);
        updateChip();
        if(!compact) setTimeout(focusFirst, (single || instant) ? 0 : 270);
      }

      // 이미지 로드 실패 카드는 조용히 제거
      Array.prototype.slice.call(stack.querySelectorAll('img')).forEach(function(img){
        img.addEventListener('error', function(){ removeCard(img.closest('.p365-card'), true); });
      });

      stack.addEventListener('click', function(e){
        var b = e.target.closest && e.target.closest('[data-act]');
        if(!b){ if(e.target === stack && !ov.classList.contains('single')) closeAll(); return; }
        e.preventDefault();
        var c = b.closest('.p365-card');
        if(b.getAttribute('data-act') === 'hide'){
          var cb = b.querySelector('input'); if(cb) cb.checked = true;
          hideToday(c.getAttribute('data-id'));
        }
        removeCard(c);
      });
      ov.querySelector('[data-act="close-all"]').addEventListener('click', closeAll);
      chip.addEventListener('click', function(){
        compact = false; chip.setAttribute('aria-expanded','true');
        applyMode(); lock(); focusFirst();
      });
      ov.querySelector('.p365-prev').addEventListener('click', function(){ show(idx-1, -1); focusFirst(); });
      ov.querySelector('.p365-next').addEventListener('click', function(){ show(idx+1, 1); focusFirst(); });
      // 모바일 스와이프
      var sx = 0, sy = 0, tracking = false;
      stack.addEventListener('touchstart', function(e){
        if(!ov.classList.contains('single') || e.touches.length !== 1) return;
        tracking = true; sx = e.touches[0].clientX; sy = e.touches[0].clientY;
      }, {passive:true});
      stack.addEventListener('touchend', function(e){
        if(!tracking) return; tracking = false;
        var t = e.changedTouches[0], dx = t.clientX - sx, dy = t.clientY - sy;
        if(Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)*1.3){ if(dx < 0) show(idx+1, 1); else show(idx-1, -1); }
      }, {passive:true});
      ov.addEventListener('click', function(e){ if(e.target === ov && !compact) closeAll(); });
      document.addEventListener('keydown', function(e){
        if(closed || ov.hidden) return;
        if(e.key === 'Escape') closeAll();
        else if(ov.classList.contains('single') && !compact){
          if(e.key === 'ArrowRight') show(idx+1, 1); else if(e.key === 'ArrowLeft') show(idx-1, -1);
        }
      });
      var onMq = function(){ if(!compact && !closed) applyMode(); };
      if(mq.addEventListener) mq.addEventListener('change', onMq); else if(mq.addListener) mq.addListener(onMq);
      // 팝업 이미지의 크기를 알게 된 뒤(naturalWidth — 파일 앞부분만 받아도 정해짐) 또는 실패·4초 초과 시 연다.
      // 숨긴 채(display:none) 기다리므로 이미지가 들어오며 카드 크기가 바뀌어도 화면이 움직이지 않는다 (CLS 방지 2026-10-31)
      var imgs = Array.prototype.slice.call(stack.querySelectorAll('img')), opened = false, waitStart = Date.now();
      function openOnce(){ if(opened || closed) return; opened = true; if(cards().length) open(); else closeAll(); }
      (function waitSized(){
        if(opened || closed) return;
        var ready = imgs.every(function(img){ return img.complete || img.naturalWidth > 0; });
        if(ready || Date.now() - waitStart > 4000) openOnce(); else setTimeout(waitSized, 50);
      })();
    })
    .catch(function(e){ /* 팝업 로드 실패 시 무시 */ });
})();
