(function(){
  'use strict';
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = matchMedia('(hover: hover) and (pointer: fine)').matches;

  // Mobile menu
  var mb = document.querySelector('.menu-btn'), nav = document.getElementById('nav');
  if (mb && nav) {
    mb.addEventListener('click', function(){
      var open = nav.classList.toggle('open');
      mb.setAttribute('aria-expanded', open ? 'true' : 'false');
      mb.setAttribute('aria-label', open ? 'بستن منو' : 'باز کردن منو');
    });
    nav.addEventListener('click', function(e){ if (e.target.tagName === 'A') { nav.classList.remove('open'); mb.setAttribute('aria-expanded','false'); } });
    document.addEventListener('keydown', function(e){ if (e.key === 'Escape' && nav.classList.contains('open')) { nav.classList.remove('open'); mb.setAttribute('aria-expanded','false'); mb.focus(); } });
  }

  // Tabs (gallery)
  var tabs = [].slice.call(document.querySelectorAll('.g-tabs [role="tab"]'));
  function select(t){
    tabs.forEach(function(o){
      var on = o === t;
      o.setAttribute('aria-selected', on ? 'true' : 'false');
      o.tabIndex = on ? 0 : -1;
      document.getElementById(o.getAttribute('aria-controls')).hidden = !on;
    });
  }
  tabs.forEach(function(t, i){
    t.addEventListener('click', function(){ select(t); });
    t.addEventListener('keydown', function(e){
      var d = e.key === 'ArrowLeft' ? 1 : e.key === 'ArrowRight' ? -1 : 0; // RTL
      if (!d) return;
      e.preventDefault();
      var n = tabs[(i + d + tabs.length) % tabs.length]; select(n); n.focus();
    });
  });

  // Atropos 3D tilt (desktop pointer only)
  if (window.Atropos && fine && !reduce) {
    document.querySelectorAll('.atropos').forEach(function(el){
      window.Atropos({ el: el, activeOffset: 30, shadow: false, highlight: true, rotateXMax: 10, rotateYMax: 10 });
    });
  }

  // GSAP reveal + course progress
  var bar = document.querySelector('.t-course .bar');
  if (!window.gsap || reduce) {
    document.documentElement.classList.remove('js');
    if (bar) bar.style.width = '75%';
    return;
  }
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.batch('[data-reveal]', {
    start: 'top 88%', once: true,
    onEnter: function(els){ gsap.to(els, { opacity: 1, y: 0, duration: .8, ease: 'power3.out', stagger: .08, overwrite: true }); }
  });
  if (bar) gsap.to(bar, { width: '75%', duration: 1.6, ease: 'power2.out', scrollTrigger: { trigger: bar, start: 'top 90%', once: true } });
  gsap.from('.hero-copy > *', { opacity: 0, y: 18, duration: .9, ease: 'power3.out', stagger: .09 });
  gsap.from('.stage', { opacity: 0, y: 30, scale: .97, duration: 1.1, ease: 'power3.out', delay: .2 });
  gsap.fromTo('.float-chip', { y: 0 }, { y: -8, duration: 2.2, ease: 'sine.inOut', yoyo: true, repeat: -1 });
})();
