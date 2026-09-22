/* ==========================================================================
   Ðoil — main.js

   01. 연도 자동 표기
   02. 헤더 상태 전환 + 스크롤 진행 바
   03. 스크롤 등장 애니메이션 (IntersectionObserver)
   04. HOW TO USE — 스크롤 연동 4스텝
   05. FAQ 아코디언
   06. 버튼 리플
   07. (삭제됨 — CSS 호버로 대체)
   08. 히어로 체크리스트 데모
   ========================================================================== */

(function(){
  "use strict";
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.getElementById('yr').textContent = new Date().getFullYear();

  /* ----- 02. 헤더 상태 전환 + 스크롤 진행 바 ----- */
  var nav = document.getElementById('nav'), bar = document.getElementById('bar'), ticking = false;
  function onScroll(){
    var y = window.scrollY || document.documentElement.scrollTop;
    nav.classList.toggle('is-stuck', y > 24);
    var h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (h > 0 ? Math.min(100, (y / h) * 100) : 0) + '%';
    updateHow(y);
    ticking = false;
  }
  window.addEventListener('scroll', function(){
    if(!ticking){ ticking = true; window.requestAnimationFrame(onScroll); }
  }, {passive:true});

  /* ----- 03. 스크롤 등장 애니메이션 ----- */
  var io = new IntersectionObserver(function(es){
    es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
  }, {threshold:.12, rootMargin:'0px 0px -8% 0px'});
  document.querySelectorAll('[data-rv]').forEach(function(el){ io.observe(el); });

  /* ----- 04. HOW TO USE — 스크롤 진행률을 4스텝으로 나눠 전환 ----- */
  var track   = document.getElementById('howTrack'),
      steps   = [].slice.call(document.querySelectorAll('#steps .step')),
      screens = [].slice.call(document.querySelectorAll('#screens .scr')),
      rails   = [].slice.call(document.querySelectorAll('#rail i')),
      N = steps.length, current = -1;

  function sizeTrack(){ track.style.height = (N * window.innerHeight) + 'px'; onScroll(); }

  function setStep(i, localP){
    if(i !== current){
      current = i;
      steps.forEach(function(s,k){ s.classList.toggle('act', k === i); });
      screens.forEach(function(s,k){ s.classList.toggle('act', k === i); });
    }
    rails.forEach(function(r,k){
      r.classList.toggle('done', k < i);
      r.classList.toggle('act', k === i);
      if(k === i) r.style.setProperty('--p', (localP*100).toFixed(1) + '%');
    });
  }

  function updateHow(y){
    if(!track) return;
    var top  = y + track.getBoundingClientRect().top,
        span = track.offsetHeight - window.innerHeight;
    if(span <= 0) return;
    var p = Math.max(0, Math.min(0.9999, (y - top) / span));
    var idx = Math.floor(p * N);
    setStep(Math.min(idx, N - 1), (p * N) - idx);
  }
  window.addEventListener('resize', sizeTrack);
  sizeTrack();

  /* ----- 05. FAQ 아코디언 ----- */
  document.querySelectorAll('.q').forEach(function(q){
    var btn = q.querySelector('button'), panel = q.querySelector('.a');
    btn.addEventListener('click', function(){
      var open = q.classList.contains('open');
      document.querySelectorAll('.q.open').forEach(function(o){
        o.classList.remove('open'); o.querySelector('.a').style.maxHeight = null;
      });
      if(!open){ q.classList.add('open'); panel.style.maxHeight = panel.scrollHeight + 'px'; }
    });
  });

  /* ----- 06. 버튼 리플 ----- */
  document.querySelectorAll('.btn, .store').forEach(function(b){
    b.addEventListener('click', function(e){
      if(reduce) return;
      var r = b.getBoundingClientRect(), s = Math.max(r.width, r.height), d = document.createElement('span');
      d.className = 'ripple';
      d.style.width = d.style.height = s + 'px';
      d.style.left = (e.clientX - r.left - s/2) + 'px';
      d.style.top  = (e.clientY - r.top  - s/2) + 'px';
      b.appendChild(d);
      setTimeout(function(){ d.remove(); }, 620);
    });
  });

  /* ----- 07. (삭제) 카드 포인터 틸트 -----
     pointermove 마다 getBoundingClientRect() 로 레이아웃을 다시 계산하고
     인라인 transform 을 덮어써서 CSS 트랜지션과 충돌 → 버벅임의 원인이었습니다.
     카드 호버 효과는 전부 CSS(.bx:hover)로만 처리합니다.                        */

  /* ----- 08. 히어로 체크리스트 데모 애니메이션 ----- */
  if(!reduce){
    var ticks = document.querySelectorAll('.hero .todo .tick'), t = 1;
    setInterval(function(){ if(ticks[t]) ticks[t].classList.toggle('on'); t = t === 1 ? 2 : 1; }, 2600);
  }
})();
