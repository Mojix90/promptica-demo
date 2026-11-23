(function(){
  var msg='این یک دموی نمایشی است. خرید، ورود، جست‌وجو و ارسال دیدگاه پس از نصب قالب روی وردپرس کار می‌کنند.';
  function toast(){
    var t=document.getElementById('pdemo-toast');
    if(!t){t=document.createElement('div');t.id='pdemo-toast';t.setAttribute('role','status');
      t.style.cssText='position:fixed;z-index:99999;bottom:24px;left:50%;transform:translateX(-50%);max-width:92vw;background:#1e1e31;color:#fff;padding:14px 18px;border-radius:14px;font:14px/1.9 inherit;box-shadow:0 12px 40px #0004;text-align:center;direction:rtl;transition:opacity .3s';
      document.body.appendChild(t);}
    t.textContent=msg;t.style.opacity='1';clearTimeout(t._h);t._h=setTimeout(function(){t.style.opacity='0'},4200);
  }
  document.addEventListener('submit',function(e){e.preventDefault();toast();},true);
  document.addEventListener('click',function(e){
    var a=e.target.closest&&e.target.closest('a[href],button[name="add-to-cart"]');
    if(!a)return;
    var h=a.getAttribute('href')||'';
    if(a.tagName==='BUTTON'||/add-to-cart=|\/checkout\/|lost-password|customer-logout|\/feed\//.test(h)){e.preventDefault();toast();}
  },true);
})();
/* Demo-only: HeroAI runner simulation + floating "buy" bar. */
(function(){
  var BUY='https://www.zhaket.com/web/promptica', HOME='/promptica-demo/';
  var sample='studio product photo of a matte black countertop coffee maker on a seamless warm cream background, soft box lighting from the left, subtle contact shadow, steam curling from the cup, ultra sharp, commercial e-commerce style --ar 1:1 --v 6\n\nسه نسخهٔ جایگزین:\n۱. نمای ۴۵ درجه با نور پشت برای برجسته شدن لبه‌های فلزی\n۲. ترکیب‌بندی مینیمال با فضای خالی سمت راست برای متن تبلیغ\n۳. نسخهٔ لایف‌استایل روی کانتر چوبی روشن با فنجان سرامیکی';
  document.addEventListener('click',function(e){
    var b=e.target.closest&&e.target.closest('.promptica-hero-run'); if(!b)return;
    e.preventDefault(); e.stopImmediatePropagation();
    var box=b.closest('.promptica-hero'), out=box.querySelector('.promptica-hero-out'), label=b.textContent;
    b.disabled=true; b.textContent='در حال اجرا…'; out.hidden=false; out.textContent=''; out.classList.add('is-loading');
    setTimeout(function(){
      out.classList.remove('is-loading'); var i=0;
      var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
      if(reduce){out.textContent=sample;b.disabled=false;b.textContent=label;return;}
      (function step(){ i+=6; out.textContent=sample.slice(0,i); if(i<sample.length){requestAnimationFrame(step);} else {b.disabled=false;b.textContent=label;} })();
    },1100);
  },true);
  function bar(){
    if(document.getElementById('pdemo-bar'))return;
    var d=document.createElement('div'); d.id='pdemo-bar'; d.setAttribute('role','region'); d.setAttribute('aria-label','دموی قالب پرامپتیکا');
    d.innerHTML='<a href="'+HOME+'" class="pdemo-back">معرفی قالب</a><a href="'+BUY+'" class="pdemo-buy" target="_blank" rel="noopener">خرید از ژاکت</a>';
    var st=document.createElement('style');
    st.textContent='#pdemo-bar{position:fixed;z-index:9998;left:18px;bottom:18px;display:flex;gap:6px;padding:6px;background:#1e1e31f2;border-radius:14px;box-shadow:0 10px 30px #0003;font-family:Vazirmatn,Tahoma,sans-serif;direction:rtl}#pdemo-bar a{font-size:12px;font-weight:700;padding:8px 12px;border-radius:10px;color:#fff;text-decoration:none}#pdemo-bar .pdemo-buy{background:#635bdb}#pdemo-bar .pdemo-back:hover{background:#ffffff1a}#pdemo-bar a:focus-visible{outline:2px solid #a9a3ff;outline-offset:2px}@media(max-width:560px){#pdemo-bar{left:10px;bottom:10px}}';
    document.head.appendChild(st); document.body.appendChild(d);
  }
  if(document.readyState!=='loading')bar(); else document.addEventListener('DOMContentLoaded',bar);
})();
