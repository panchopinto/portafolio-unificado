/*! edu-telemetry.js — Telemetría educativa (respetuosa con privacidad)
 *  Uso: <script src="./assets/js/edu-telemetry.js" defer
 *               data-endpoint="https://TU-ENDPOINT"
 *               data-project="AR-BIO"
 *               data-ask-name="off"
 *               data-sample="1.0"></script>
 *  • Respeta Do Not Track por defecto
 *  • No recolecta datos sensibles ni identifica usuarios sin consentimiento
 */
(function(){
  'use strict';
  var script = document.currentScript || (function(){
    var all = document.getElementsByTagName('script');
    for (var i=all.length-1;i>=0;i--){ if ((all[i].src||'').indexOf('edu-telemetry.js')!==-1) return all[i]; }
    return null;
  })();
  if (!script) return;

  var cfg = {
    endpoint: (script.dataset.endpoint || '').trim(),
    project:  (script.dataset.project  || 'AR-BIO').trim(),
    askName:  (script.dataset.askName  || 'off').toLowerCase() === 'on',
    sample:   Math.max(0, Math.min(1, parseFloat(script.dataset.sample || '1.0') || 1.0)),
    allowDnt: (script.dataset.allowDnt || 'false').toLowerCase() === 'true'
  };

  if (!cfg.endpoint || /^https:\/\/TU-ENDPOINT/i.test(cfg.endpoint)) {
    // Endpoint no configurado → no hacemos nada
    return;
  }

  // Respeta DNT (Do Not Track) salvo que config lo sobreescriba
  var dnt = (navigator.doNotTrack || window.doNotTrack || navigator.msDoNotTrack);
  if (!cfg.allowDnt && (dnt === '1' || dnt === 'yes')) {
    return;
  }

  // Muestra/oculta debug en consola si añades ?debugtelemetry=1
  var DEBUG = /[?&]debugtelemetry=1\b/.test(location.search);

  // Sampling simple
  if (Math.random() > cfg.sample) return;

  // Identificador de sesión simple (no PII)
  function sid(){
    try{
      var s = sessionStorage.getItem('edu_sid');
      if (s) return s;
      s = 's_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
      sessionStorage.setItem('edu_sid', s);
      return s;
    }catch(_e){
      return 's_' + Math.random().toString(36).slice(2);
    }
  }

  // Nombre opcional (con consentimiento explícito y almacenamiento local)
  function getName(){
    try{
      var n = localStorage.getItem('edu_name');
      if (n) return n;
      if (cfg.askName) {
        n = prompt('Nombre (opcional): escribe tu nombre si deseas asociar tu visita a una clase/curso. Puedes dejarlo en blanco.');
        if (n && n.trim()) {
          localStorage.setItem('edu_name', n.trim());
          return n.trim();
        }
      }
    }catch(_e){}
    return null;
  }

  // Datos del dispositivo/navegador (no sensibles)
  function gather(){
    var nav = performance && performance.getEntriesByType ? performance.getEntriesByType('navigation') : null;
    var n0 = nav && nav[0] ? nav[0] : null;
    var cn = document.querySelector('meta[name="canary"]');
    var conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection || {};
    var tz = (Intl && Intl.DateTimeFormat && Intl.DateTimeFormat().resolvedOptions().timeZone) || null;

    return {
      project: cfg.project,
      ts: new Date().toISOString(),
      session: sid(),
      name: getName(), // puede ser null
      page: location.pathname + location.search,
      ref: document.referrer || null,
      lang: navigator.language || null,
      tz: tz,
      ua: navigator.userAgent || null,
      platform: navigator.platform || null,
      screen: {w: screen && screen.width || null, h: screen && screen.height || null, dpr: window.devicePixelRatio || 1},
      viewport: {w: window.innerWidth, h: window.innerHeight},
      device: {memory: navigator.deviceMemory || null, cores: navigator.hardwareConcurrency || null},
      network: {type: conn.effectiveType || null, downlink: conn.downlink || null, rtt: conn.rtt || null, saveData: !!conn.saveData},
      canary: cn ? cn.content : null,
      perf: n0 ? {
        type: n0.type,
        startTime: n0.startTime,
        domContentLoaded: n0.domContentLoadedEventEnd || null,
        load: n0.loadEventEnd || null,
        transferSize: n0.transferSize || null,
        decodedBodySize: n0.decodedBodySize || null
      } : null
    };
  }

  // Envío con sendBeacon (o fetch keepalive)
  function send(kind, data){
    var payload = {
      kind: kind,
      data: data,
      site: location.host
    };
    var blob = new Blob([JSON.stringify(payload)], {type:'application/json'});

    var ok = false;
    if (navigator.sendBeacon) {
      try { ok = navigator.sendBeacon(cfg.endpoint, blob); } catch(_e){ ok = false; }
    }
    if (!ok) {
      try {
        fetch(cfg.endpoint, { method:'POST', body: JSON.stringify(payload), headers:{'Content-Type':'application/json'}, keepalive:true, mode:'no-cors' });
      } catch(_e){ /* ignore */ }
    }
    if (DEBUG) console.log('[edu-telemetry] sent', kind, payload);
  }

  // Evento de vista de página
  function onReady(fn){
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn, {once:true});
    else fn();
  }
  onReady(function(){ send('pageview', gather()); });

  // Clicks en botones/enlaces principales (ligero)
  document.addEventListener('click', function(ev){
    var t = ev.target && (ev.target.closest && ev.target.closest('a,button'));
    if (!t) return;
    var info = {
      id: t.id || null,
      role: t.getAttribute('role') || null,
      tag: t.tagName,
      text: (t.textContent||'').trim().slice(0,80) || null,
      href: t.tagName === 'A' ? (t.getAttribute('href') || t.href || null) : null,
      page: location.pathname + location.search,
      ts: new Date().toISOString(),
      session: sid()
    };
    send('click', info);
  }, {passive:true});

  // Envío al cerrar (garantizado con sendBeacon)
  window.addEventListener('visibilitychange', function(){
    if (document.visibilityState === 'hidden') {
      send('ping', {ts: new Date().toISOString(), session: sid(), page: location.pathname + location.search});
    }
  });
})();
