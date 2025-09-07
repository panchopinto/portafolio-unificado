
/* === AntiCopy Pack === */
(function(){
  const MSG = { copy:'Copiado deshabilitado', ctx:'Botón derecho deshabilitado', sel:'Selección de texto deshabilitada', dev:'Atajo deshabilitado' };

  document.addEventListener('DOMContentLoaded', ()=>{ document.body.classList.add('anticopy'); ensureWatermark(); ensureToast(); renderWM(); });

  let WM_TEXT = defaultText();
  function defaultText(){ const t=document.title||'Trivias', d=new Date().toLocaleString(); return `${t} · ${d}`; }
  function ensureWatermark(){ if(document.getElementById('anticopyWM')) return; const wm=document.createElement('div'); wm.id='anticopyWM'; document.body.appendChild(wm); }
  function renderWM(){ const wm=document.getElementById('anticopyWM'); if(!wm) return; wm.innerHTML=''; const H=window.innerHeight; const step=120; for(let y=-H; y<H*2; y+=step){ const div=document.createElement('div'); div.className='line'; div.style.top=y+'px'; div.textContent=(' '+WM_TEXT+' ').repeat(10); wm.appendChild(div); } }
  window.setWatermarkText = function(txt){ WM_TEXT=(txt||'').trim()||defaultText(); renderWM(); };
  window.addEventListener('resize', renderWM);

  const prof=document.getElementById('profile');
  if(prof){ const mo=new MutationObserver(()=>{ const t=prof.textContent||''; if(t.trim().length>0){ setWatermarkText(t.replace(/\s+/g,' ')); } }); mo.observe(prof,{childList:true,subtree:true,characterData:true}); }

  function ensureToast(){ if(document.getElementById('anticopyToast')) return; const d=document.createElement('div'); d.id='anticopyToast'; document.body.appendChild(d); }
  let toastTimer=null; function toast(s){ ensureToast(); const d=document.getElementById('anticopyToast'); if(!d) return; d.textContent=s; d.classList.add('show'); clearTimeout(toastTimer); toastTimer=setTimeout(()=>d.classList.remove('show'), 1200); }

  document.addEventListener('contextmenu', (e)=>{ if(e.target && (e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA')) return; e.preventDefault(); toast(MSG.ctx); }, {capture:true});
  document.addEventListener('dragstart', (e)=>{ e.preventDefault(); }, true);
  ['copy','cut'].forEach(type=>{ document.addEventListener(type, (e)=>{ const tag=(e.target&&e.target.tagName)||''; if(tag==='INPUT'||tag==='TEXTAREA'){ return; } e.preventDefault(); toast(MSG.copy); }); });
  document.addEventListener('keydown', function(e){
    if( (e.ctrlKey||e.metaKey) && (e.key==='p' || e.key==='P') ) return;
    if( e.key==='F5' ) return;
    if( e.key==='F12' ) { e.preventDefault(); toast(MSG.dev); return; }
    if( (e.ctrlKey||e.metaKey) && e.shiftKey && ['I','C','J','i','c','j'].includes(e.key) ){ e.preventDefault(); toast(MSG.dev); return; }
    if( (e.ctrlKey||e.metaKey) && ['S','U','s','u'].includes(e.key) ){ e.preventDefault(); toast(MSG.dev); return; }
    const tag=(document.activeElement&&document.activeElement.tagName)||''; const inField=(tag==='INPUT'||tag==='TEXTAREA');
    if(!inField && (e.ctrlKey||e.metaKey) && ['C','X','A','c','x','a'].includes(e.key)){ e.preventDefault(); toast(MSG.sel); return; }
  }, {capture:true});
  document.addEventListener('keyup', (e)=>{ if(e.key==='PrintScreen'){ toast('Captura detectada: los contenidos llevan marca de agua'); } });
})();