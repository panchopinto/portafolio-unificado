
document.addEventListener('DOMContentLoaded', ()=>{
  const ok = localStorage.getItem('auth') === 'ok';
  if(!ok){ location.href = 'index.html'; return; }
  // pintar año footer
  const y = document.querySelector('.year');
  if(y) y.textContent = new Date().getFullYear();
  const who = localStorage.getItem('who') || '';
  const whoSpans = document.querySelectorAll('.who');
  whoSpans.forEach(s => s.textContent = who);
});
