
async function sha256Hex(str){
  const enc = new TextEncoder().encode(str);
  const buf = await crypto.subtle.digest("SHA-256", enc);
  const arr = Array.from(new Uint8Array(buf));
  return arr.map(b => b.toString(16).padStart(2, "0")).join("");
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('#login-form');
  const emailEl = document.querySelector('#email');
  const passEl = document.querySelector('#password');
  const msg = document.querySelector('#msg');

  if(form){
    form.addEventListener('submit', async (e)=>{
      e.preventDefault();
      msg.textContent = "";
      const email = (emailEl.value||'').trim().toLowerCase();
      const pass = passEl.value||'';

      // Validar correo en whitelist
      const allowed = (CONFIG?.allowedEmails||[]).map(s=>s.toLowerCase());
      if(!allowed.includes(email)){
        msg.textContent = "Correo no autorizado.";
        msg.style.color = "#ff8080";
        return;
      }

      // Validar hash de acceso
      try{
        const hash = await sha256Hex(pass);
        if(hash !== CONFIG.accessCodeHash){
          msg.textContent = "Código de acceso incorrecto.";
          msg.style.color = "#ffd166";
          return;
        }
      }catch(err){
        console.error(err);
        msg.textContent = "Error al validar el acceso.";
        msg.style.color = "#ff8080";
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
