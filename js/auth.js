
document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('#login-form');
  const emailEl = document.querySelector('#email');
  const passEl = document.querySelector('#password');
  const msg = document.querySelector('#msg');

  if(form){
    form.addEventListener('submit', (e)=>{
      e.preventDefault();
      const email = (emailEl.value||'').trim().toLowerCase();
      const pass = passEl.value||'';

      const allowed = (window.APP_CONFIG?.allowedEmails||[]).map(s=>s.toLowerCase());
      if(!allowed.includes(email)){
        msg.textContent = "Correo no autorizado.";
        msg.style.color = "#ff8080";
        return;
      }
      // Nota: clave no se valida contra servidor (solo demo). Puedes cambiarla si quieres.
      if(pass.length < 3){
        msg.textContent = "Ingresa una clave válida (3+ caracteres).";
        msg.style.color = "#ffd166";
        return;
      }
      localStorage.setItem('auth','ok');
      localStorage.setItem('who', email);
      location.href = "acciones.html";
    });
  }

  // Footer year
  const y = document.querySelector('.year');
  if(y) y.textContent = new Date().getFullYear();
});
