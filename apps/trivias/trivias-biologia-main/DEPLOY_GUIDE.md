# Guía de despliegue (Trivias CN08 OA02)
Actualizado: 2025-09-03

## Contenido
- Front-end: index.html, css/styles.css, js/engine.js
- AntiCopy: css/anticopy.css, js/anticopy.js
- Apps Script: apps_script/Code.gs, README_APPS_SCRIPT.txt
- Dashboard: docentes/dashboard.html/css/js
- Config: config.json

## Pasos
1) Apps Script: pega Code.gs en tu proyecto ligado al Sheet (configura SHEET_ID y SHEET_NAME), ejecuta setApiKey(), implementa webapp (/exec).
2) En config.json pega appsScriptUrl y teacherApiKey.
3) Abre index.html y prueba con un RUT existente.
4) Verifica hoja “Resultados” al corregir (POST).
5) Abre docentes/dashboard.html y consulta con tu API_KEY.
