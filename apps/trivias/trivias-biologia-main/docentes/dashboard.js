async function loadConfig(){ return fetch('../config.json').then(r=>r.json()); }
const $ = s=>document.querySelector(s);
const toCSV = rows => { if(!rows.length) return ''; const header=Object.keys(rows[0]); const esc=v=>`"${String(v).replace(/"/g,'""')}"`; return [header.join(','), ...rows.map(r=>header.map(k=>esc(r[k]??'')).join(','))].join('\n'); };
function median(a){ if(!a.length) return 0; const b=[...a].sort((x,y)=>x-y); const m=Math.floor(b.length/2); return b.length%2?b[m]:(b[m-1]+b[m])/2; }
async function fetchResults(cfg){
  const u = new URL(cfg.appsScriptUrl); u.searchParams.set('mode','results');
  const key = ($('#i_key').value || cfg.teacherApiKey || '').trim(); if(!key){ alert('Falta API Key'); return {ok:false, rows:[]}; }
  u.searchParams.set('key', key);
  if($('#i_from').value) u.searchParams.set('from', $('#i_from').value);
  if($('#i_to').value) u.searchParams.set('to', $('#i_to').value);
  if($('#i_curso').value) u.searchParams.set('curso', $('#i_curso').value);
  if($('#i_rut').value) u.searchParams.set('rut', $('#i_rut').value);
  if($('#i_pie').value) u.searchParams.set('pie', $('#i_pie').value);
  if($('#i_paes').value) u.searchParams.set('paes', $('#i_paes').value);
  if($('#i_area').value) u.searchParams.set('area', $('#i_area').value);
  if($('#i_activity').value) u.searchParams.set('activity', $('#i_activity').value);
  u.searchParams.set('limit','1000');
  const res = await fetch(u.toString(), {cache:'no-store'});
  if(!res.ok){ alert('Error '+res.status+' al consultar resultados.'); return {ok:false, rows:[]}; }
  return res.json();
}
function renderTable(rows){
  const tb = $('#tbl tbody'); tb.innerHTML='';
  rows.forEach(r=>{
    const tr=document.createElement('tr');
    const pct = Number(r.Pct||0);
    tr.innerHTML = `
      <td>${r.Timestamp||''}</td><td>${r.RUT||''}</td><td>${r.Nombres||''}</td><td>${r.Apellidos||''}</td>
      <td>${r.Curso||''}</td><td>${r.PIE_Estado||''}</td><td>${r.PIE_Diagnostico||''}</td><td>${r.PAES||''}</td>
      <td>${r.Area||''}</td><td>${r.Activity||''}</td><td>${pct}</td><td>${r.Score||''}</td><td>${r.TotalAuto||''}</td><td>${r.ItemsCount||''}</td>`;
    tb.appendChild(tr);
  });
}
function updateKPIs(rows){
  $('#k_count').textContent = rows.length;
  const pcts = rows.map(r=>Number(r.Pct||0)).filter(x=>!isNaN(x));
  const avg = pcts.length? Math.round(pcts.reduce((a,b)=>a+b,0)/pcts.length) : 0;
  const med = Math.round(median(pcts));
  $('#k_avg').textContent = avg; $('#k_med').textContent = med;
}
async function main(){
  const cfg = await loadConfig();
  document.getElementById('btnBuscar').onclick = async ()=>{
    const out = await fetchResults(cfg); if(!out.ok){ return; } renderTable(out.rows||[]); updateKPIs(out.rows||[]);
  };
  document.getElementById('btnExport').onclick = ()=>{
    const rows = Array.from(document.querySelectorAll('#tbl tbody tr')).map(tr=>{
      const c = tr.querySelectorAll('td');
      return { Timestamp:c[0].textContent, RUT:c[1].textContent, Nombres:c[2].textContent, Apellidos:c[3].textContent, Curso:c[4].textContent, PIE_Estado:c[5].textContent, PIE_Diagnostico:c[6].textContent, PAES:c[7].textContent, Area:c[8].textContent, Activity:c[9].textContent, Pct:c[10].textContent, Score:c[11].textContent, TotalAuto:c[12].textContent, ItemsCount:c[13].textContent };
    });
    const csv = toCSV(rows); const blob = new Blob([csv], {type:'text/csv;charset=utf-8'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='resultados_filtrados.csv'; a.click();
  };
}
document.addEventListener('DOMContentLoaded', main);
