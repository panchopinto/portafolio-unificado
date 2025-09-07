ANTICOPY PACK — Proyecto AR Biología (v1)
==========================================
Última actualización: 2025-09-03T12:59:28.036253

Qué incluye
-----------
- **css/anticopy.css**: desactiva selección, arrastre de imágenes y estiliza el *watermark* y el *toast*.
- **js/anticopy.js**: bloquea menú derecho, copia/corte, atajos comunes (DevTools, guardar, ver código), y
  dibuja una **marca de agua** diagonal que se personaliza con el texto del perfil (#profile) si existe.

Cómo instalar en tu página
--------------------------
1) Copia **css/anticopy.css** y **js/anticopy.js** en tus carpetas `css/` y `js/` del proyecto.
2) En tu `<head>`, después de tu `styles.css`, agrega:
   <link rel="stylesheet" href="./css/anticopy.css"/>
3) Antes (o justo antes) de cargar tu `engine.js`, agrega:
   <script src="./js/anticopy.js"></script>

Compatibilidad y notas
----------------------
- **Imprimir (Ctrl+P)** NO se bloquea (para que sigas generando PDFs).
- En **inputs/textarea** se permite seleccionar/copiar (accesibilidad).
- **PrintScreen** no se puede bloquear, pero verán la **marca de agua** superpuesta.
- Si tu página tiene un `#profile` que muestra Alumno/Curso/Email, la marca de agua se personaliza sola.
  Si no, puedes llamar manualmente: `setWatermarkText('Texto personalizado')`.

Personalizaciones
-----------------
- Cambia opacidad de la marca de agua en `#anticopyWM` (propiedad `opacity`).
- Cambia tamaño/color de texto en la regla `#anticopyWM .line`.
- Si no quieres bloquear `Ctrl+A` (seleccionar todo), borra 'A'/'a' del arreglo en anticopy.js.

Soporte
-------
Hecho para el repositorio de *Trivias CN08 OA 02* y compatible con la página de *Células (AR/VR)*.
