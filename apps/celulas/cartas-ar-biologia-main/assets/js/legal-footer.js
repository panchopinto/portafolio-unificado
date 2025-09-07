// assets/js/legal-footer.js
// Inyecta meta "canary" en <head> + footer legal fijo en <body>
// ⚠️ Actualiza CANARY_DATE y CANARY_HASH en cada release
(() => {
  const CANARY_DATE = '2025-08-27';
  const CANARY_HASH = 'build-v3_FAPA-PROTOTYPE-K9999'; // p.ej. git rev corto

  // Meta canary (head) — crea o sobreescribe
  try {
    let meta = document.querySelector('meta[name="canary"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'canary';
      document.head.appendChild(meta);
    }
    meta.content = `Proyecto AR Biología — build:${CANARY_DATE} — hash:${CANARY_HASH}`;
  } catch {}

  // Footer legal (body)
  function addFooter() {
    if (window.NO_LEGAL_FOOTER) return;              // opcional: desactivar por página
    if (document.getElementById('legalFooter')) return;

    const yearStart = 2025;
    const y = new Date().getFullYear();
    const yearText = y > yearStart ? `${yearStart}–${y}` : `${y}`;

    const f = document.createElement('div');
    f.id = 'legalFooter';
    f.textContent =
      window.LEGAL_FOOTER_TEXT ||
      `© ${yearText} Pancho Pinto — Prohibida la copia y distribución de contenido`;
    f.style.cssText = [
      'position:fixed','left:10px','bottom:10px','z-index:99999',
      'padding:4px 8px','border:1px solid rgba(255,255,255,.25)',
      'background:rgba(0,0,0,.35)','color:#cfe6ff',
      'font:600 11px system-ui','border-radius:8px','backdrop-filter:blur(2px)'
    ].join(';');
    document.body.appendChild(f);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addFooter);
  } else {
    addFooter();
  }
})();
