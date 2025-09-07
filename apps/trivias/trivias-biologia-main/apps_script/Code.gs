// ===== API (unificada) — Code.gs =====
const SHEET_ID   = 'REEMPLAZA_CON_TU_SHEET_ID';
const SHEET_NAME = 'Alumnos';
const RESULTS_SHEET = 'Resultados';

function doGet(e){
  const mode = (e.parameter.mode || 'student').toLowerCase();
  if(mode === 'results'){ return getResults(e); }
  return getStudent(e);
}

function getStudent(e){
  const rutParam = (e.parameter.rut || '').replace(/\./g,'').toUpperCase();
  if(!rutParam) return _json({ found:false, error:'missing_rut' });

  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sh = ss.getSheetByName(SHEET_NAME);
  const data = sh.getDataRange().getValues();
  const header = data.shift();
  const idx = _mapIdx(header);

  const row = data.find(r => String(r[idx.RUT]).replace(/\./g,'').toUpperCase() === rutParam);
  if(!row) return _json({ found:false });

  const payload = {
    found: true,
    RUT: row[idx.RUT], Nombres: row[idx.Nombres], Apellidos: row[idx.Apellidos],
    Curso: row[idx.Curso], Email: row[idx.Email],
    PIE_Estado: row[idx.PIE_Estado], PIE_Diagnostico: row[idx.PIE_Diagnostico], PAES: row[idx.PAES]
  };
  return _json(payload);
}

function getResults(e){
  if(!_checkKey(e)) return _unauthorized();
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sh = ss.getSheetByName(RESULTS_SHEET);
  if(!sh) return _json({ ok:true, rows: [] });

  const values = sh.getDataRange().getValues();
  if(values.length < 2) return _json({ ok:true, rows: [] });
  const header = values.shift();
  const rows = values.map(r => _rowToObj(header, r));

  const from = e.parameter.from ? new Date(e.parameter.from + 'T00:00:00') : null;
  const to   = e.parameter.to   ? new Date(e.parameter.to   + 'T23:59:59') : null;
  const curso = e.parameter.curso || ''; const rut = e.parameter.rut || ''; const pie = e.parameter.pie || '';
  const paes  = e.parameter.paes || ''; const area = e.parameter.area || ''; const activity = e.parameter.activity || '';

  let filtered = rows.filter(o => {
    if(from || to){
      const ts = _parseDate(o['Timestamp']);
      if(from && ts < from) return false;
      if(to && ts > to) return false;
    }
    if(curso && String(o['Curso']||'').toLowerCase().indexOf(curso.toLowerCase()) === -1) return false;
    if(rut && String(o['RUT']||'').toUpperCase() !== rut.replace(/\./g,'').toUpperCase()) return false;
    if(pie && String(o['PIE_Estado']||'').toLowerCase() !== pie.toLowerCase()) return false;
    if(paes && String(o['PAES']||'').toLowerCase() !== paes.toLowerCase()) return false;
    if(area && String(o['Area']||'').toLowerCase() !== area.toLowerCase()) return false;
    if(activity && String(o['Activity']||'').toUpperCase() !== activity.toUpperCase()) return false;
    return true;
  });
  filtered.sort((a,b)=> _parseDate(b['Timestamp']) - _parseDate(a['Timestamp']));
  const limit = Math.min( Number(e.parameter.limit||1000), 5000 );
  filtered = filtered.slice(0, limit);
  return _json({ ok:true, rows: filtered });
}

function doPost(e){
  try{
    var body = e.postData && e.postData.contents ? e.postData.contents : '{}';
    var data = JSON.parse(body);
    var ss = SpreadsheetApp.openById(SHEET_ID);
    var sh = ss.getSheetByName(RESULTS_SHEET);
    if(!sh){ sh = ss.insertSheet(RESULTS_SHEET); }
    var header = ['Timestamp','RUT','Nombres','Apellidos','Curso','Email','PIE_Estado','PIE_Diagnostico','PAES','Area','Activity','Score','TotalAuto','Pct','ItemsCount','StartedAt','EndedAt','UserAgent','RespJSON'];
    if(sh.getLastRow() === 0){ sh.appendRow(header); }
    var row = [ new Date(), data.rut||'', data.nombres||'', data.apellidos||'', data.curso||'', data.email||'',
      data.pie_estado||'', data.pie_diagnostico||'', data.paes||'', data.area||'', data.activity||'',
      data.score||0, data.totalAuto||0, data.pct||0, data.itemsCount||0, data.startedAt||'', data.endedAt||'', data.userAgent||'', JSON.stringify(data.resp||[]) ];
    sh.appendRow(row);
    return _json({ok:true});
  }catch(err){ return _json({ok:false, error:String(err)}); }
}

/* Helpers */
function _rowToObj(header, row){ const o={}; for(var i=0;i<header.length;i++){ o[header[i]]=row[i]; } if(o['Pct']!==undefined){ o['Pct']=Number(o['Pct']); } return o; }
function _parseDate(v){ if(v instanceof Date) return v; if(typeof v === 'string') return new Date(v); return new Date(v); }
function _mapIdx(header){ const need=['RUT','Nombres','Apellidos','Curso','Email','PIE_Estado','PIE_Diagnostico','PAES']; const idx={}; need.forEach(h=>{ const i=header.indexOf(h); if(i===-1) throw new Error('Falta '+h); idx[h]=i; }); return idx; }
function _json(obj){ return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON); }
function _unauthorized(){ return ContentService.createTextOutput(JSON.stringify({ok:false,error:'unauthorized'})).setMimeType(ContentService.MimeType.JSON); }
function _checkKey(e){ const key=(e.parameter.key||'').trim(); const SCRIPT_KEY=PropertiesService.getScriptProperties().getProperty('API_KEY')||''; return SCRIPT_KEY && key && key===SCRIPT_KEY; }
function setApiKey(){ const key='CAMBIA-ESTE-VALOR'; PropertiesService.getScriptProperties().setProperty('API_KEY', key); return 'OK'; }
