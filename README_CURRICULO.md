# Alineación Curricular (PIE + PAES)

Este repositorio está configurado para ajustar demos AR/RV/3D/Trivias a:
- **PIE (Programa de Integración Escolar, 6° básico a 4° medio):** accesibilidad visual (filtros daltonismo), co-docencia, adecuaciones y apoyos.
- **PAES (4° medio):** temarios y habilidades evaluadas por prueba (Competencia Lectora, Matemática M1/M2, Ciencias, Historia y Cs. Sociales).

## Dónde editar
- `demos/3d-historia.html`: selector de **patrimonio 3D (CC0)** + badges OA/PAES/PIE.
- `apps/siamp/index.html`: **SIAMP embebido** via iframe.
- `apps/celulas/cartas-ar-biologia-main/`: AR Células (CN08 OA02).
- `apps/trivias/trivias-biologia-main/`: Trivias Biología (etiquetar por temario PAES).

## PIE (Accesibilidad)
- Cambia tema rápido con **Alt+1..4**: Default, Protanopia, Deuteranopia, Tritanopia.
- Persistencia por `localStorage` en `js/pie-theme.js`.
- El filtro aplica sobre imágenes, `<canvas>`, `<model-viewer>` y escenas A-Frame/AR.js.

## PAES (Sugerencias)
- **Historia 3D**: selecciona 1–3 piezas CC0 (e.g., *Wright Flyer*, *Shuttle Discovery*, *Cosmic Buddha*).
- **Ciencias**: CN08 OA02 (célula) ya enlazado; añade sistemas del cuerpo y genética básica para 2°–4° medio.
- **Lenguaje/Matemática**: crear bancos de preguntas por competencia (Lectora; M1/M2), niveles y distractores.
