
// PIE Theme persistence + toggles
(function(){
  const KEY = "pieTheme";
  function apply(theme){
    document.documentElement.setAttribute('data-pie-theme', theme);
    try{ localStorage.setItem(KEY, theme); }catch(e){}
    document.querySelectorAll('.pie-controls .badge').forEach(b=>{
      b.classList.toggle('active', b.dataset.theme===theme);
    });
  }
  const saved = (localStorage.getItem(KEY) || 'default');
  apply(saved);
  document.addEventListener('click', (e)=>{
    const btn = e.target.closest('.pie-controls .badge');
    if(btn){
      e.preventDefault();
      apply(btn.dataset.theme);
    }
  });
  // export for demos
  window.__setPIETheme = apply;
})();
