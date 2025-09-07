(()=>{
  // Disable right-click on images/canvas/video to make casual copying harder
  document.addEventListener('contextmenu', (e)=>{
    if (e.target.closest('canvas, img, video, .a-canvas, model-viewer')) e.preventDefault();
  }, {capture:true});

  // Block drag saving of images
  document.addEventListener('dragstart', (e)=>{
    if (e.target.closest('img, canvas, video, .a-canvas, model-viewer')) e.preventDefault();
  }, {capture:true});

  // Append attribution on copy
  document.addEventListener('copy', (e)=>{
    try{
      const sel = window.getSelection ? (''+window.getSelection()) : '';
      const add = '\n\n— Fuente: AR Biología • https://panchopinto.github.io/cartas-ar-biologia\n© 2025 Pancho Pinto. Reproducción no autorizada.';
      if (sel && e.clipboardData){ e.clipboardData.setData('text/plain', sel + add); e.preventDefault(); }
    }catch{}
  });
})();