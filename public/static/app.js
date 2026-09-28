// Seoul365 Dental — Main App JS

// ── Progressive Enhancement Gate ─────────────
// IntersectionObserver가 정상 지원되는 환경에서만 애니메이션 숨김 시작 상태로 진입.
// 네이버/카카오/삼성 인앱 브라우저 일부 또는 구형 안드로이드에서 미지원 시 텍스트는 그대로 표시됨.
(function(){
  try {
    if ('IntersectionObserver' in window && 'IntersectionObserverEntry' in window) {
      document.documentElement.classList.add('js-anim-ready');
    }
  } catch(e) { /* 보수적으로 통과 → 텍스트는 항상 보임 */ }
  // 안전망: 2.5초 후에도 .visible 안 붙은 reveal 요소가 있으면 강제 노출
  // (혹시 IO 등록 누락된 케이스 대비)
  setTimeout(function(){
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-3d, .reveal-blur, .reveal-pop, .reveal-elastic, .reveal-rotate, .text-split, .text-words, .stagger-cascade, .stagger-children').forEach(function(el){
      if(!el.classList.contains('visible')){
        var rect = el.getBoundingClientRect();
        // 이미 화면 위쪽에 지나갔거나 현재 보이는 영역이면 .visible 강제 부여
        if(rect.top < window.innerHeight && rect.bottom > 0){
          el.classList.add('visible');
        }
      }
    });
  }, 2500);
})();

// ── Admin page layout cleanup ──────────────────
(function(){if(window.location.pathname.startsWith('/admin')){var mh=document.getElementById('main-header');if(mh)mh.style.display='none';document.querySelectorAll('footer').forEach(function(el){el.style.display='none'});document.querySelectorAll('.mobile-cta-bar').forEach(function(el){el.style.display='none'});document.querySelectorAll('.floating-btn').forEach(function(el){if(el.parentElement)el.parentElement.style.display='none'});var cd=document.getElementById('cursor-dot');if(cd)cd.style.display='none';var cr=document.getElementById('cursor-ring');if(cr)cr.style.display='none';var s=document.createElement('style');s.textContent='body,body *,body *::before,body *::after{cursor:auto!important}a,button,select,[role=button]{cursor:pointer!important}input,textarea{cursor:text!important}';document.head.appendChild(s);var sp=document.getElementById('scroll-progress');if(sp)sp.style.display='none';document.body.style.overflow='auto'}})();

// Clinic Open/Close Status
(function(){var hours={0:{open:14,close:18},1:{open:10,close:21},2:{open:10,close:21},3:{open:10,close:21},4:{open:10,close:21},5:{open:10,close:19},6:{open:10,close:14}};function updateStatus(){var now=new Date();var kst=new Date(now.toLocaleString('en-US',{timeZone:'Asia/Seoul'}));var day=kst.getDay(),h=kst.getHours(),m=kst.getMinutes(),t=h+m/60;var s=hours[day];var isOpen=s&&t>=s.open&&t<s.close;document.querySelectorAll('#clinic-status-badge, #mobile-clinic-status').forEach(function(el){var dot=el.querySelector('span:first-child');var txt=el.querySelector('span:last-child');if(isOpen){el.className=el.className.replace(/text-gray-\S+|bg-gray-\S+/g,'').replace(/text-emerald-\S+|bg-emerald-\S+/g,'');el.classList.add('text-emerald-600','bg-emerald-50');if(dot)dot.className='w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse';if(txt)txt.textContent='진료중'}else{el.className=el.className.replace(/text-emerald-\S+|bg-emerald-\S+/g,'');el.classList.add('text-gray-500','bg-gray-100');if(dot)dot.className='w-1.5 h-1.5 bg-gray-400 rounded-full';if(txt)txt.textContent='진료종료'}})}updateStatus();setInterval(updateStatus,60000)})();

// Custom Cursor (Desktop only — SNU crest mark)
if(window.innerWidth>1024&&window.matchMedia('(pointer:fine)').matches){var dot=document.getElementById('cursor-dot');var ring=document.getElementById('cursor-ring');if(dot&&ring){var preImg=new Image();preImg.src='/static/cursor-logo.png';var mx=-100,my=-100,rx=-100,ry=-100,visible=false;document.addEventListener('mousemove',function(e){mx=e.clientX;my=e.clientY;dot.style.left=mx+'px';dot.style.top=my+'px';if(!visible){visible=true;dot.style.display='block';ring.style.display='block'}});(function animateRing(){rx+=(mx-rx)*0.12;ry+=(my-ry)*0.12;ring.style.left=rx+'px';ring.style.top=ry+'px';requestAnimationFrame(animateRing)})();document.querySelectorAll('a, button, [data-cursor-hover], input, textarea, select').forEach(function(el){el.addEventListener('mouseenter',function(){dot.classList.add('hovering');ring.classList.add('hovering')});el.addEventListener('mouseleave',function(){dot.classList.remove('hovering');ring.classList.remove('hovering')})})}}else{document.body.style.cursor='auto'}

// Scroll Progress
window.addEventListener('scroll',function(){var h=document.documentElement.scrollHeight-window.innerHeight;var p=h>0?window.scrollY/h:0;var bar=document.getElementById('scroll-progress');if(bar)bar.style.transform='scaleX('+p+')';},{passive:true});

// Mobile menu
var mmBtn=document.getElementById('mobile-menu-btn');if(mmBtn)mmBtn.addEventListener('click',function(){var menu=document.getElementById('mobile-menu');var icon=this.querySelector('i');var expanded=!menu.classList.contains('hidden');menu.classList.toggle('hidden');this.setAttribute('aria-expanded',!expanded);icon.className=menu.classList.contains('hidden')?'fa-solid fa-bars text-xl':'fa-solid fa-xmark text-xl'});

// Header scroll
var header=document.getElementById('main-header');if(header)window.addEventListener('scroll',function(){if(window.scrollY>50)header.classList.add('scrolled');else header.classList.remove('scrolled')},{passive:true});

// IntersectionObserver for scroll animations
var revealObserver=new IntersectionObserver(function(entries){entries.forEach(function(entry){if(entry.isIntersecting)entry.target.classList.add('visible')})},{threshold:0.05,rootMargin:'0px 0px -40px 0px'});
document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-3d, .reveal-blur, .stagger-children, .img-reveal, .highlight-word').forEach(function(el){revealObserver.observe(el)});

// FAQ accordion
document.querySelectorAll('.faq-toggle').forEach(function(btn){btn.addEventListener('click',function(){var content=this.nextElementSibling;var icon=this.querySelector('.faq-icon');var expanded=!content.classList.contains('hidden');document.querySelectorAll('.faq-toggle').forEach(function(other){if(other!==btn){other.nextElementSibling.classList.add('hidden');var oi=other.querySelector('.faq-icon');if(oi)oi.classList.remove('rotate-180');other.setAttribute('aria-expanded','false')}});content.classList.toggle('hidden');if(icon)icon.classList.toggle('rotate-180');this.setAttribute('aria-expanded',!expanded)})});

// Animated counter
function animateCounters(){document.querySelectorAll('[data-count]').forEach(function(el){if(el.dataset.animated)return;el.dataset.animated='true';var target=parseFloat(el.dataset.count);var suffix=el.dataset.suffix||'';var prefix=el.dataset.prefix||'';var decimals=(target%1!==0)?1:0;var current=0;var duration=2200;var step=target/(duration/16);var counter=setInterval(function(){current+=step;if(current>=target){current=target;clearInterval(counter)}el.textContent=prefix+current.toFixed(decimals)+suffix},16)})}
var counterObserver=new IntersectionObserver(function(entries){entries.forEach(function(entry){if(entry.isIntersecting){animateCounters();counterObserver.disconnect()}})},{threshold:0.3});
var counterEl=document.querySelector('[data-counter-section]');if(counterEl)counterObserver.observe(counterEl);

// Hero — Premium Constellation + Aurora
(function(){
var canvas=document.getElementById('hero-particles');if(!canvas)return;
var ctx=canvas.getContext('2d');var w,h,t=0;
var dpr=Math.min(window.devicePixelRatio||1,2);
function resize(){w=canvas.parentElement.offsetWidth;h=canvas.parentElement.offsetHeight;canvas.width=w*dpr;canvas.height=h*dpr;canvas.style.width=w+'px';canvas.style.height=h+'px';ctx.setTransform(dpr,0,0,dpr,0,0)}
resize();window.addEventListener('resize',resize);

// Constellation nodes — sparse, elegant
var nodes=[];var N=Math.min(Math.floor(w*h/25000),50);
for(var i=0;i<N;i++){nodes.push({x:Math.random()*w,y:Math.random()*h,r:Math.random()*1.2+0.3,vx:(Math.random()-0.5)*0.15,vy:(Math.random()-0.5)*0.15,phase:Math.random()*Math.PI*2,speed:0.003+Math.random()*0.005})}

// Floating light motes — very subtle
var motes=[];for(var i=0;i<25;i++){motes.push({x:Math.random()*w,y:Math.random()*h,vy:-0.08-Math.random()*0.15,r:Math.random()*0.8+0.2,o:Math.random()*0.15+0.03,phase:Math.random()*Math.PI*2})}

var mx=-9999,my=-9999,tmx=-9999,tmy=-9999;
canvas.parentElement.addEventListener('mousemove',function(e){var r=canvas.parentElement.getBoundingClientRect();tmx=e.clientX-r.left;tmy=e.clientY-r.top});
canvas.parentElement.addEventListener('mouseleave',function(){tmx=-9999;tmy=-9999});

function draw(){
t+=0.016;
// Smooth mouse lerp
mx+=(tmx-mx)*0.04;my+=(tmy-my)*0.04;
ctx.clearRect(0,0,w,h);

// Layer 1: Mouse aurora glow — soft radial gradient that follows cursor
if(mx>0&&mx<w&&my>0&&my<h){
  var ag=ctx.createRadialGradient(mx,my,0,mx,my,280);
  ag.addColorStop(0,'rgba(0,102,255,0.06)');
  ag.addColorStop(0.4,'rgba(0,180,255,0.025)');
  ag.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle=ag;ctx.fillRect(0,0,w,h);
  // Second layer — warmer accent
  var ag2=ctx.createRadialGradient(mx+60,my-40,0,mx+60,my-40,180);
  ag2.addColorStop(0,'rgba(0,229,255,0.03)');
  ag2.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle=ag2;ctx.fillRect(0,0,w,h);
}

// Layer 2: Constellation nodes
for(var i=0;i<nodes.length;i++){
  var n=nodes[i];
  n.x+=n.vx;n.y+=n.vy;
  if(n.x<-20)n.x=w+20;if(n.x>w+20)n.x=-20;
  if(n.y<-20)n.y=h+20;if(n.y>h+20)n.y=-20;
  // Pulse opacity
  var pulse=0.25+Math.sin(t*n.speed*60+n.phase)*0.15;
  // Mouse proximity brightening
  var dx=n.x-mx,dy=n.y-my,dm=Math.sqrt(dx*dx+dy*dy);
  if(dm<200)pulse+=0.3*(1-dm/200);
  // Gentle repulsion
  if(dm<150&&dm>1){n.x+=dx/dm*0.3;n.y+=dy/dm*0.3}
  // Draw node with soft glow
  ctx.beginPath();ctx.arc(n.x,n.y,n.r+0.3,0,Math.PI*2);
  ctx.fillStyle='rgba(180,210,255,'+Math.min(pulse,0.7)+')';ctx.fill();
  // Outer halo
  if(n.r>0.8){ctx.beginPath();ctx.arc(n.x,n.y,n.r*4,0,Math.PI*2);ctx.fillStyle='rgba(0,102,255,'+(pulse*0.06)+')';ctx.fill()}
}

// Layer 3: Constellation lines — only connect nearby nodes, very faint
ctx.lineWidth=0.4;
for(var i=0;i<nodes.length;i++){
  for(var j=i+1;j<nodes.length;j++){
    var dx=nodes[i].x-nodes[j].x,dy=nodes[i].y-nodes[j].y,d=dx*dx+dy*dy;
    if(d<22000){
      var dist=Math.sqrt(d);var alpha=0.04*(1-dist/148);
      // Brighten lines near mouse
      var midX=(nodes[i].x+nodes[j].x)/2,midY=(nodes[i].y+nodes[j].y)/2;
      var md=Math.sqrt((midX-mx)*(midX-mx)+(midY-my)*(midY-my));
      if(md<200)alpha+=0.06*(1-md/200);
      ctx.beginPath();ctx.moveTo(nodes[i].x,nodes[i].y);ctx.lineTo(nodes[j].x,nodes[j].y);
      ctx.strokeStyle='rgba(100,160,255,'+Math.min(alpha,0.15)+')';ctx.stroke();
    }
  }
}

// Layer 4: Rising light motes — like dust in sunlight
for(var i=0;i<motes.length;i++){
  var m=motes[i];
  m.y+=m.vy;m.x+=Math.sin(t*0.5+m.phase)*0.12;
  if(m.y<-10){m.y=h+10;m.x=Math.random()*w}
  var mo=m.o*(0.5+Math.sin(t*1.5+m.phase)*0.5);
  ctx.beginPath();ctx.arc(m.x,m.y,m.r,0,Math.PI*2);
  ctx.fillStyle='rgba(200,220,255,'+mo+')';ctx.fill();
}

requestAnimationFrame(draw)}
draw()})();

// Operating status v2
(function(){function updateStatus(){var now=new Date(),day=now.getDay(),h=now.getHours(),m=now.getMinutes(),t=h*60+m;var text='',open=false;if(day>=1&&day<=4){open=t>=600&&t<1260;text=open?'진료중 · 21시까지':'진료 종료'}else if(day===5){open=t>=600&&t<1140;text=open?'진료중 · 19시까지':'진료 종료'}else if(day===6){open=t>=600&&t<840;text=open?'진료중 · 14시까지':'진료 종료'}else{open=t>=840&&t<1080;text=open?'진료중 · 18시까지':'진료 종료'}document.querySelectorAll('[data-status]').forEach(function(el){el.innerHTML=open?'<span class="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span><span class="font-semibold">'+text+'</span>':'<span class="w-2 h-2 bg-gray-500 rounded-full"></span><span class="text-white/40">'+text+'</span>'})}updateStatus();setInterval(updateStatus,60000)})();

// 3D Tilt effect on cards (Desktop)
if(window.innerWidth>768){document.querySelectorAll('.tilt-card').forEach(function(card){card.addEventListener('mousemove',function(e){var rect=card.getBoundingClientRect();var x=(e.clientX-rect.left)/rect.width-0.5;var y=(e.clientY-rect.top)/rect.height-0.5;card.style.transform='perspective(1000px) rotateY('+(x*10)+'deg) rotateX('+(-y*10)+'deg) scale(1.02)'});card.addEventListener('mouseleave',function(){card.style.transform='perspective(1000px) rotateY(0) rotateX(0) scale(1)';card.style.transition='transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'});card.addEventListener('mouseenter',function(){card.style.transition='none'})})}

// Magnetic buttons (Desktop)
if(window.innerWidth>1024){document.querySelectorAll('.btn-magnetic').forEach(function(btn){btn.addEventListener('mousemove',function(e){var rect=btn.getBoundingClientRect();var x=e.clientX-rect.left-rect.width/2;var y=e.clientY-rect.top-rect.height/2;btn.style.transform='translate('+(x*0.3)+'px, '+(y*0.3)+'px)'});btn.addEventListener('mouseleave',function(){btn.style.transform='translate(0, 0)'})})}

// Auth state
(async function(){try{var res=await fetch('/api/auth/me');var data=await res.json();if(data.ok&&data.user){var nav=document.getElementById('auth-nav');var userEl=document.getElementById('auth-user');var nameEl=document.getElementById('auth-user-name');if(nav)nav.classList.add('hidden');if(userEl){userEl.classList.remove('hidden');userEl.classList.add('flex')}if(nameEl)nameEl.textContent=data.user.name+'님';var mobileNav=document.getElementById('mobile-auth-nav');var mobileUser=document.getElementById('mobile-auth-user');var mobileName=document.getElementById('mobile-user-name');if(mobileNav)mobileNav.classList.add('hidden');if(mobileUser)mobileUser.classList.remove('hidden');if(mobileName)mobileName.textContent=data.user.name+'님'}}catch(e){}})();

// Logout handlers
var lb=document.getElementById('auth-logout-btn');if(lb)lb.addEventListener('click',async function(){await fetch('/api/auth/logout',{method:'POST'});window.location.reload()});
var mlb=document.getElementById('mobile-logout-btn');if(mlb)mlb.addEventListener('click',async function(){await fetch('/api/auth/logout',{method:'POST'});window.location.reload()});

// YouTube Background Video — Lazy iframe inject
(function(){var wrap=document.getElementById('yt-player-wrap');var poster=document.getElementById('yt-poster');var videoSection=document.getElementById('video-section');if(!wrap||!videoSection)return;var isMuted=true,iframe=null,injected=false;function injectIframe(){if(injected)return;injected=true;iframe=document.createElement('iframe');iframe.id='yt-iframe';iframe.allow='autoplay; encrypted-media';iframe.setAttribute('allowfullscreen','false');iframe.setAttribute('referrerpolicy','strict-origin-when-cross-origin');iframe.title='서울365치과 소개 영상';var mob=window.innerWidth<768;iframe.style.cssText=mob?'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:100%;height:56.25vw;pointer-events:none;border:0;':'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:100vw;height:56.25vw;min-height:100%;min-width:177.78vh;pointer-events:none;border:0;';iframe.src='https://www.youtube-nocookie.com/embed/gB_yiatcwAc?autoplay=1&mute=1&controls=0&showinfo=0&rel=0&loop=1&playlist=gB_yiatcwAc&playsinline=1&modestbranding=1&iv_load_policy=3&disablekb=1&fs=0&cc_load_policy=0&enablejsapi=1';iframe.addEventListener('load',function(){if(poster){setTimeout(function(){poster.style.opacity='0';setTimeout(function(){poster.style.display='none'},1000)},600)}});wrap.appendChild(iframe)}var lazyObs=new IntersectionObserver(function(entries){entries.forEach(function(entry){if(entry.isIntersecting){injectIframe();lazyObs.disconnect()}})},{rootMargin:'200px 0px'});lazyObs.observe(videoSection);function postCmd(cmd,args){if(!iframe||!iframe.contentWindow)return;try{iframe.contentWindow.postMessage(JSON.stringify({event:'command',func:cmd,args:args||[]}),'*')}catch(e){}}var toggleBtn=document.getElementById('yt-sound-toggle');var soundIcon=document.getElementById('yt-sound-icon');var soundLabel=document.getElementById('yt-sound-label');if(toggleBtn){toggleBtn.addEventListener('click',function(){if(isMuted){postCmd('unMute');postCmd('setVolume',[80]);isMuted=false;if(soundIcon)soundIcon.className='fa-solid fa-volume-high text-sm';if(soundLabel)soundLabel.textContent='소리 끄기'}else{postCmd('mute');isMuted=true;if(soundIcon)soundIcon.className='fa-solid fa-volume-xmark text-sm';if(soundLabel)soundLabel.textContent='소리 켜기'}})}var vidObs=new IntersectionObserver(function(entries){entries.forEach(function(entry){if(!iframe)return;if(entry.isIntersecting)postCmd('playVideo');else postCmd('pauseVideo')})},{threshold:0.1});vidObs.observe(videoSection)})();

// Parallax on scroll + Scroll velocity skew + Multi-depth parallax
var ticking=false;var lastScroll=0;var scrollVelocity=0;
window.addEventListener('scroll',function(){if(!ticking){requestAnimationFrame(function(){var scrolled=window.scrollY;
// Parallax
document.querySelectorAll('.parallax-slow').forEach(function(el){el.style.transform='translateY('+(scrolled*0.08)+'px)'});
document.querySelectorAll('.parallax-fast').forEach(function(el){el.style.transform='translateY('+(scrolled*-0.05)+'px)'});
// Multi-depth parallax layers
document.querySelectorAll('.parallax-depth-1').forEach(function(el){el.style.transform='translateY('+(scrolled*0.03)+'px)'});
document.querySelectorAll('.parallax-depth-2').forEach(function(el){el.style.transform='translateY('+(scrolled*0.06)+'px)'});
document.querySelectorAll('.parallax-depth-3').forEach(function(el){el.style.transform='translateY('+(scrolled*0.1)+'px)'});
// Scroll velocity-based skew
scrollVelocity=(scrolled-lastScroll)*0.15;scrollVelocity=Math.max(-4,Math.min(4,scrollVelocity));
document.querySelectorAll('.scroll-skew').forEach(function(el){el.style.transform='skewY('+scrollVelocity+'deg)'});
lastScroll=scrolled;ticking=false});ticking=true}},{passive:true});

// ====== MICRO-INTERACTION ENHANCEMENTS v6 ======

// 1. Text Split Animation — split text-split elements into individual chars
document.querySelectorAll('.text-split').forEach(function(el){
  if(el.dataset.split) return; el.dataset.split='true';
  var text=el.textContent||'';var html='';
  for(var i=0;i<text.length;i++){
    if(text[i]===' ') html+=' ';
    else html+='<span class="char" style="transition-delay:'+(i*0.03)+'s">'+text[i]+'</span>';
  }
  el.innerHTML=html;
});

// 2. Word-by-word reveal — split text-words elements into words
document.querySelectorAll('.text-words').forEach(function(el){
  if(el.dataset.wordsplit) return; el.dataset.wordsplit='true';
  var words=(el.textContent||'').split(/\s+/);var html='';
  words.forEach(function(w,i){
    if(w) html+='<span class="word" style="transition-delay:'+(i*0.06)+'s">'+w+'</span> ';
  });
  el.innerHTML=html.trim();
});

// 3. Enhanced IntersectionObserver — include new animation classes
var enhancedObserver=new IntersectionObserver(function(entries){entries.forEach(function(entry){if(entry.isIntersecting){entry.target.classList.add('visible');
// Trigger counter bounce on stat numbers
if(entry.target.classList.contains('stat-number')){entry.target.classList.add('counter-bounce');setTimeout(function(){entry.target.classList.remove('counter-bounce')},500)}
}})},{threshold:0.05,rootMargin:'0px 0px -40px 0px'});
document.querySelectorAll('.text-split, .text-words, .line-draw, .divider-animated, .reveal-rotate, .stagger-cascade, .reveal-pop, .reveal-elastic').forEach(function(el){enhancedObserver.observe(el)});

// 4. Ripple effect on click — for buttons with .ripple-effect class
document.addEventListener('click',function(e){
  var btn=e.target.closest('.ripple-effect');if(!btn) return;
  var rect=btn.getBoundingClientRect();var ripple=document.createElement('span');ripple.className='ripple';
  var size=Math.max(rect.width,rect.height)*2;ripple.style.width=ripple.style.height=size+'px';
  ripple.style.left=(e.clientX-rect.left-size/2)+'px';ripple.style.top=(e.clientY-rect.top-size/2)+'px';
  btn.appendChild(ripple);setTimeout(function(){ripple.remove()},600);
});

// 5. Glow trail — mouse-following glow on .glow-trail cards
document.querySelectorAll('.glow-trail').forEach(function(card){
  card.addEventListener('mousemove',function(e){
    var rect=card.getBoundingClientRect();var before=card.querySelector(':before')||card;
    card.style.setProperty('--glow-x',(e.clientX-rect.left)+'px');
    card.style.setProperty('--glow-y',(e.clientY-rect.top)+'px');
    // Use CSS custom properties for glow position
    if(card.style.cssText.indexOf('--glow-x')!==-1){
      var pseudo=getComputedStyle(card,':before');
      card.style.cssText+=';--glow-x:'+(e.clientX-rect.left)+'px;--glow-y:'+(e.clientY-rect.top)+'px';
    }
  });
});

// 6. Enhanced animated counter with easing
function animateCounterEnhanced(el){
  if(el.dataset.animated) return; el.dataset.animated='true';
  var target=parseFloat(el.dataset.count);var suffix=el.dataset.suffix||'';var prefix=el.dataset.prefix||'';
  var decimals=(target%1!==0)?1:0;var duration=2400;var start=performance.now();
  function easeOutExpo(t){return t===1?1:1-Math.pow(2,-10*t)}
  function update(now){
    var elapsed=now-start;var progress=Math.min(elapsed/duration,1);var eased=easeOutExpo(progress);
    var current=eased*target;el.textContent=prefix+current.toFixed(decimals)+suffix;
    if(progress<1) requestAnimationFrame(update);
    else{el.textContent=prefix+target.toFixed(decimals)+suffix;el.classList.add('counter-bounce')}
  }
  requestAnimationFrame(update);
}
// Override old counter with enhanced version
var counterObserver2=new IntersectionObserver(function(entries){entries.forEach(function(entry){if(entry.isIntersecting){
  entry.target.querySelectorAll('[data-count]').forEach(animateCounterEnhanced);counterObserver2.unobserve(entry.target)}})},{threshold:0.3});
var counterSections=document.querySelectorAll('[data-counter-section]');counterSections.forEach(function(s){counterObserver2.observe(s)});

// 7. Smooth section reveal with progress tracking
var sectionProgress=new IntersectionObserver(function(entries){entries.forEach(function(entry){
  if(entry.isIntersecting){
    var fill=entry.target.querySelector('.scroll-fill');
    if(fill){var ratio=Math.min(entry.intersectionRatio*2,1);fill.style.width=(ratio*100)+'%'}
  }
})},{threshold:[0,0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9,1]});
document.querySelectorAll('[data-section-progress]').forEach(function(el){sectionProgress.observe(el)});

// 8. Enhanced magnetic buttons (stronger + bounce back)
if(window.innerWidth>1024){document.querySelectorAll('.btn-magnetic-strong').forEach(function(btn){
  btn.addEventListener('mousemove',function(e){var rect=btn.getBoundingClientRect();var x=e.clientX-rect.left-rect.width/2;var y=e.clientY-rect.top-rect.height/2;
  btn.style.transform='translate('+(x*0.4)+'px, '+(y*0.4)+'px) scale(1.05)'});
  btn.addEventListener('mouseleave',function(){btn.style.transform='translate(0, 0) scale(1)'})
})}

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
    + '#p365-popups .p365-hide input{width:15px;height:15px;accent-color:#0066FF;pointer-events:none;margin:0}'
    + '#p365-popups .p365-close{min-height:36px;background:none;border:1px solid #ddd;padding:6px 16px;border-radius:8px;font-size:12px;font-weight:600;color:#666;cursor:pointer;transition:background .2s}'
    + '#p365-popups .p365-close:hover{background:#f5f5f5}'
    + '#p365-popups :focus-visible{outline:2px solid #0066FF;outline-offset:2px}'
    + '#p365-popups .p365-chip,#p365-popups .p365-nav{display:none}'
    // 모바일 compact 칩 (기존 compact 모드 유지: 우상단 88px, 260px, 흰 카드)
    + '#p365-popups.compact{inset:88px 16px auto auto;padding:0;background:none;overflow:visible;width:260px;max-width:calc(100vw - 32px)}'
    + '#p365-popups.compact .p365-stack,#p365-popups.compact .p365-nav{display:none}'
    + '#p365-popups.compact .p365-chip{display:block;position:relative;width:100%;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 20px 50px rgba(0,0,0,.25)}'
    + '#p365-popups .p365-expand{display:block;min-height:48px;width:100%;padding:12px 52px 12px 16px;border:0;background:#fff;color:#0050cc;font-size:14px;font-weight:700;text-align:left;cursor:pointer}'
    + '#p365-popups .p365-count{display:inline-flex;align-items:center;justify-content:center;min-width:22px;height:22px;margin-left:6px;padding:0 6px;border-radius:99px;background:#0066FF;color:#fff;font-size:12px;font-weight:800;vertical-align:1px}'
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
      function lock(){ if(!locked){ prevOverflow = document.body.style.overflow; document.body.style.overflow = 'hidden'; locked = true; } }
      function unlock(){ if(locked){ document.body.style.overflow = prevOverflow; locked = false; } }
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
      open();
    })
    .catch(function(e){ /* 팝업 로드 실패 시 무시 */ });
})();
