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
