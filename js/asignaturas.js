// ASIGNATURAS MODAL (auto-inyectado)
(function(){
  function $(sel){ return document.querySelector(sel); }
  const modal = $("#modalAsignaturas");
  const closeBtn = $("#closeAsignaturas");
  const btn = document.querySelector("#btnAsignaturas, a[data-action='asignaturas']");
  if(!modal){ return; }
  function open(){ modal.style.display = "block"; modal.setAttribute("aria-hidden","false"); }
  function close(){ modal.style.display = "none"; modal.setAttribute("aria-hidden","true"); }
  if(closeBtn) closeBtn.addEventListener("click", close);
  if(btn) btn.addEventListener("click", function(e){ e.preventDefault(); open(); });
  window.addEventListener("click", function(e){ if(e.target === modal){ close(); } });
  window.addEventListener("keydown", function(e){ if(e.key==="Escape"){ close(); } });
})();


// Inject PIE controls into modal header if present
(function(){
  const modal = document.querySelector('#modalAsignaturas .modal-content');
  if(!modal) return;
  const controls = document.createElement('div');
  controls.className = 'pie-controls';
  controls.innerHTML = `
    <span>Elige tu fondo:</span>
    <a href="#" class="badge" data-theme="default">Default</a>
    <a href="#" class="badge" data-theme="protanopia">Protanopia</a>
    <a href="#" class="badge" data-theme="deuteranopia">Deuteranopia</a>
    <a href="#" class="badge" data-theme="tritanopia">Tritanopia</a>
  `;
  modal.insertBefore(controls, modal.querySelector('.subjects-grid'));
  // highlight active on open
  setTimeout(()=>{
    const t = document.documentElement.getAttribute('data-pie-theme') || 'default';
    document.querySelectorAll('.pie-controls .badge').forEach(b=>{
      b.classList.toggle('active', b.dataset.theme===t);
    });
  }, 0);
})();
