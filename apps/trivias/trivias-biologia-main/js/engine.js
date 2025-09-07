
/* Engine básico con Apps Script + PIE + Guía + Registro */
let cfg = { sheetUrl: null, appsScriptUrl: null, columns: {}, teacherApiKey: null };
let PROFILE = { rut:'', nombres:'', apellidos:'', curso:'', email:'', pie_estado:'ninguno', pie_diagnostico:'', paes:'no' };
let QUIZ = { items:[], area:'', activity:'', startedAt:null, endedAt:null, completed:false };
let RESP = [];

/* Utilidades */
function $(s){ return document.querySelector(s); }
function getUrlParam(k){ try{ return new URLSearchParams(window.location.search).get(k); }catch(e){ return null; } }
function normalizeDx(dx){ if(!dx) return []; return dx.toString().toUpperCase().split(/[,\/*;|]/).map(s=>s.trim()).filter(Boolean); }

/* Cargar config */
async function loadConfig(){
  const conf = await fetch('./config.json', {cache:'no-store'}).then(r=>r.json());
  cfg.sheetUrl = conf.studentsSheetUrl || null;
  cfg.appsScriptUrl = conf.appsScriptUrl || null;
  cfg.columns = conf.columns || {};
  cfg.teacherApiKey = conf.teacherApiKey || null;
}
loadConfig();

/* Render perfil/resumen */
function renderProfile(){
  $('#profile').textContent = `Alumno: ${PROFILE.nombres||''} ${PROFILE.apellidos||''} · Curso: ${PROFILE.curso||''} · PIE: ${PROFILE.pie_estado||'ninguno'} · PAES: ${PROFILE.paes||'no'}`;
}
function applyAccommodations(){
  const dxs = normalizeDx(PROFILE.pie_diagnostico);
  const tags = [];
  if(PROFILE.pie_estado && PROFILE.pie_estado!=='ninguno') tags.push(`PIE: ${PROFILE.pie_estado}`);
  if(dxs.length) tags.push(`Dx: ${dxs.join(', ')}`);
  $('#accom').textContent = tags.join(' · ');
  // Timer sugerido
  const minutes = dxs.includes('TDAH') ? 25 : dxs.includes('TEL') ? 30 : dxs.includes('TEA') ? 35 : 20;
  $('#t_suggest').textContent = `${minutes} min`; $('#timerBox').classList.remove('hidden');
}
/* Preview de diagnóstico via ?dx=TDAH|TEL|TEA */
document.addEventListener('DOMContentLoaded', ()=>{
  const dx = getUrlParam('dx'); if(dx){ PROFILE.pie_estado='transitorio'; PROFILE.pie_diagnostico = dx.toUpperCase(); applyAccommodations(); }
});

/* GET alumno por RUT desde Apps Script */
async function fetchStudentFromAppsScript(rutRaw){
  if(!cfg.appsScriptUrl || cfg.appsScriptUrl.startsWith('REEMPLAZA')) return null;
  const rut = rutRaw.replace(/\./g,'').toUpperCase();
  const url = cfg.appsScriptUrl + (cfg.appsScriptUrl.includes('?') ? '&' : '?') + 'rut=' + encodeURIComponent(rut);
  const res = await fetch(url, { method:'GET', cache:'no-store' });
  if(!res.ok) throw new Error('Apps Script HTTP '+res.status);
  return await res.json();
}

/* Verificar y completar perfil */
async function verifyStudent(){
  PROFILE.rut = $('#i_rut').value.trim();
  PROFILE.nombres = $('#i_nombres').value.trim();
  PROFILE.apellidos = $('#i_apellidos').value.trim();
  PROFILE.curso = $('#i_curso').value.trim();
  PROFILE.email = $('#i_email').value.trim();

  try{
    const as = await fetchStudentFromAppsScript(PROFILE.rut);
    if(as && as.found){
      PROFILE.nombres = PROFILE.nombres || as.Nombres || '';
      PROFILE.apellidos = PROFILE.apellidos || as.Apellidos || '';
      PROFILE.curso = PROFILE.curso || as.Curso || '';
      PROFILE.email = PROFILE.email || as.Email || '';
      PROFILE.pie_estado = (as.PIE_Estado||'ninguno').toLowerCase();
      PROFILE.pie_diagnostico = as.PIE_Diagnostico||'';
      PROFILE.paes = (as.PAES||'no').toLowerCase();
    }
  }catch(e){ console.warn('Apps Script falló:', e); }

  renderProfile();
  applyAccommodations();
  return true;
}

/* Armar trivia mínima (demo) */
async function buildQuiz(){
  const area = $('#area').value; const activity = $('#activity').value;
  QUIZ.area = area; QUIZ.activity = activity; QUIZ.startedAt = new Date(); QUIZ.completed=false;
  // Preguntas demo (reemplaza con tu banco)
  const bank = [
    {id:'q1', type:'mcq', text:'¿Qué organelo produce energía en células eucariontes?', options:['Cloroplasto','Mitocondria','Ribosoma','Aparato de Golgi'], answer:1, exp:'Las mitocondrias generan ATP mediante respiración celular.'},
    {id:'q2', type:'tf',  text:'Las células procariontes tienen núcleo definido.', answer:false, exp:'No tienen núcleo; su ADN está en el nucleoide.'},
    {id:'q3', type:'short', text:'Explica cómo la forma de una neurona se relaciona con su función.', exp:'Las prolongaciones (axón y dendritas) facilitan la conducción de impulsos a larga distancia y conexiones múltiples.'},
    {id:'q4', type:'match', text:'Relaciona organelo y función', pairs:{'Cloroplasto':'Fotosíntesis','Ribosoma':'Síntesis de proteínas','Lisosoma':'Digestión celular'}}
  ];
  QUIZ.items = bank;
  const qwrap = $('#quiz'); qwrap.innerHTML='';
  bank.forEach(q=>{
    const div=document.createElement('div'); div.className='q card'; div.dataset.qid=q.id;
    if(q.type==='mcq'){
      div.innerHTML = `<div class="qt">${q.text}</div>` + q.options.map((t,i)=>`<label class="opt"><input type="radio" name="${q.id}" value="${i}"/> ${t}</label>`).join('') + `<div id="${q.id}_exp" class="small hidden">${q.exp||''}</div>`;
    }else if(q.type==='tf'){
      div.innerHTML = `<div class="qt">${q.text}</div><label class="opt"><input type="radio" name="${q.id}" value="true"/> Verdadero</label><label class="opt"><input type="radio" name="${q.id}" value="false"/> Falso</label><div id="${q.id}_exp" class="small hidden">${q.exp||''}</div>`;
    }else if(q.type==='short'){
      div.innerHTML = `<div class="qt">${q.text}</div><textarea name="${q.id}" rows="3" placeholder="Escribe tu respuesta..."></textarea><div id="${q.id}_exp" class="small hidden">${q.exp||''}</div>`;
    }else if(q.type==='match'){
      const opts = Object.values(q.pairs).map(v=>`<option value="${v}">${v}</option>`).join('');
      div.innerHTML = `<div class="qt">${q.text}</div>` + Object.keys(q.pairs).map(k=>`<div class="row"><div style="min-width:160px">${k}</div><select name="${q.id}__${k}"><option value="">—</option>${opts}</select></div>`).join('') + `<div id="${q.id}_exp" class="small hidden">${q.exp||''}</div>`;
    }
    qwrap.appendChild(div);
  });
  $('#quizWrap').classList.remove('hidden');
}

/* Start */
async function startQuiz(){
  await verifyStudent();
  await buildQuiz();
}

/* Calificar + registro (POST) */
async function sendLogToAppsScript(payload){
  try{
    if(!cfg.appsScriptUrl || cfg.appsScriptUrl.startsWith('REEMPLAZA')) return false;
    await fetch(cfg.appsScriptUrl, { method:'POST', headers:{'Content-Type':'text/plain'}, body: JSON.stringify(payload) });
    return true;
  }catch(e){ console.warn('Fallo registro:', e); return false; }
}
function grade(){
  let score=0,totalAuto=0; RESP=[];
  QUIZ.items.forEach(q=>{
    const res = { qid:q.id, type:q.type, correct:null, given:null };
    if(q.type==='mcq'){ totalAuto++; const v=(document.querySelector(`input[name="${q.id}"]:checked`)||{}).value; res.given = (v!==undefined&&v!=='')? Number(v) : null; res.correct = (res.given===q.answer); if(res.correct) score++; }
    else if(q.type==='tf'){ totalAuto++; const v=(document.querySelector(`input[name="${q.id}"]:checked`)||{}).value; res.given = (v==='true'); res.correct = (res.given===q.answer); if(res.correct) score++; }
    else if(q.type==='match'){ totalAuto++; let ok=0, need=Object.keys(q.pairs).length; for(const left of Object.keys(q.pairs)){ const sel=document.querySelector(`select[name="${q.id}__${left}"]`); const val=sel? sel.value : ''; if(val===q.pairs[left]) ok++; } res.given = ok+' / '+need; res.correct = (ok===need); if(res.correct) score++; }
    else if(q.type==='short'){ res.given = (document.querySelector(`textarea[name="${q.id}"]`)||{}).value||''; res.correct=null; }
    RESP.push(res);
    const exp = document.getElementById(q.id+'_exp'); if(exp) exp.classList.remove('hidden');
  });
  const pct = totalAuto? Math.round(100*score/totalAuto) : 0;
  document.getElementById('score').textContent = `${score} / ${totalAuto} (${pct}%)`;
  QUIZ.completed=true; QUIZ.endedAt = new Date();

  const payload = { rut:PROFILE.rut, nombres:PROFILE.nombres, apellidos:PROFILE.apellidos, curso:PROFILE.curso, email:PROFILE.email, pie_estado:PROFILE.pie_estado, pie_diagnostico:PROFILE.pie_diagnostico, paes:PROFILE.paes, area:QUIZ.area, activity:QUIZ.activity, score,totalAuto,pct,itemsCount:QUIZ.items.length, startedAt:QUIZ.startedAt?QUIZ.startedAt.toISOString():null, endedAt:QUIZ.endedAt?QUIZ.endedAt.toISOString():null, userAgent:navigator.userAgent, resp:RESP };
  try{ sendLogToAppsScript(payload); }catch(e){}
  return {score,totalAuto,pct};
}

/* PDF + Email */
async function toPDF(){
  if(!window.jspdf || !window.jspdf.jsPDF){ alert('jsPDF no cargó'); return; }
  const doc = new window.jspdf.jsPDF();
  doc.setFontSize(12);
  doc.text(`Trivias CN08 OA02 — ${new Date().toLocaleString()}`, 10, 10);
  doc.text(`Alumno: ${PROFILE.nombres} ${PROFILE.apellidos} | Curso: ${PROFILE.curso}`, 10, 18);
  doc.text(`PIE: ${PROFILE.pie_estado} (${PROFILE.pie_diagnostico}) | PAES: ${PROFILE.paes}`, 10, 26);
  let y=36;
  QUIZ.items.forEach((q,i)=>{
    const line = `${i+1}. ${q.text}`;
    doc.text(line.substring(0,95), 10, y); y+=6;
  });
  const fname = `${(PROFILE.rut||'RUT')}_${QUIZ.area||'area'}_${new Date().toISOString().slice(0,10)}.pdf`.replace(/[^a-z0-9_\-.]/gi,'_');
  doc.save(fname);
}
function sendEmail(){
  if(!window.emailjs){ alert('EmailJS no está disponible. Configura tu service/template.'); return; }
  alert('Enviar email: configura EmailJS en engine.js');
}

/* Guía */
function openGuide(){
  const ov = document.getElementById('guideOverlay');
  const card = document.getElementById('guideCard');
  const steps = document.getElementById('guideSteps');
  const dxs = normalizeDx(PROFILE.pie_diagnostico);
  const base = ['1) Completa RUT y datos.','2) Elige ambiente y actividad.','3) Presiona “Comenzar trivia”.','4) Responde una a la vez.','5) “Terminar y corregir” y descarga PDF/envía correo.'];
  const tdah = ['Consejo TDAH: usa el Modo foco (menos distracciones). Trabaja en bloques cortos.'];
  const tel = ['Consejo TEL: usa 🔊 para escuchar la pregunta. Lee “Idea central” si aparece.'];
  const tea = ['Consejo TEA: el orden de preguntas es estable. Puedes abrir esta guía cuando necesites.'];
  const arr = base.concat(dxs.includes('TDAH')?tdah:[], dxs.includes('TEL')?tel:[], dxs.includes('TEA')?tea:[]);
  steps.innerHTML = arr.map(t=>`<div>${t}</div>`).join('');
  const cardEl = document.getElementById('guideCard');
  cardEl.classList.remove('guide-tdah','guide-tel','guide-tea');
  if(dxs.includes('TDAH')) cardEl.classList.add('guide-tdah');
  else if(dxs.includes('TEL')) cardEl.classList.add('guide-tel');
  else if(dxs.includes('TEA')) cardEl.classList.add('guide-tea');
  ov.style.display='block'; card.classList.remove('hidden');
}
function closeGuide(){
  document.getElementById('guideOverlay').style.display='none';
  document.getElementById('guideCard').classList.add('hidden');
}
window.openGuide = openGuide; window.closeGuide = closeGuide;

/* Accesibilidad simples */
function onToggleDyslexia(){ document.body.style.letterSpacing = (document.body.style.letterSpacing?'':'0.02em'); }
function onToggleContrast(){ document.body.classList.toggle('contrast'); }


// ===== Opcional: helpers no destructivos =====

// Si tu motor ya define grade(), toPDF(), sendEmail(), no necesitas nada aquí.
// Estos helpers solo muestran un aviso si aún no están listos, pero ya los
// envolvimos desde index.html en safeGrade/safePDF/safeEmail.

// Si quieres que la Guía se cierre con ESC:
window.addEventListener('keydown', (ev)=>{
  if(ev.key === 'Escape'){
    const card = document.getElementById('guideCard');
    if(card && !card.classList.contains('hidden')) window.closeGuide();
  }
});

// Si quieres enfocar el botón Guía al cerrar (accesibilidad):
window.addEventListener('close-guide', ()=>{
  const btn = document.querySelector('.btn-guide');
  btn?.focus?.();
});

