
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


// Keyboard shortcuts for PIE themes: Alt+1..4
(function(){
  const map = { "1":"default", "2":"protanopia", "3":"deuteranopia", "4":"tritanopia" };
  window.addEventListener('keydown', (e)=>{
    if(e.altKey && map[e.key]){
      if(typeof window.__setPIETheme === 'function'){
        window.__setPIETheme(map[e.key]);
      }else{
        document.documentElement.setAttribute('data-pie-theme', map[e.key]);
        try{ localStorage.setItem('pieTheme', map[e.key]); }catch(_){}
      }
    }
  });
})();
