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
