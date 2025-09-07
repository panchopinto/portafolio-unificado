# Célula Animal — i18n + QR + Draco (fallback)

Incluye:
- `index.html` — landing con **selector de idioma (ES/EN)** y **QR** para RA y visor con etiquetas.
- `viewer.html` — visor 3D con fallback a Draco (`Celula_animal_draco.glb` si existe).
- `viewer_hotspots.html` — visor 3D con etiquetas y fallback a Draco.
- `arjs-demo/animal_glb.html` — RA con cámara como fondo y fallback a Draco.
- `assets/models/Celula_animal.glb` — modelo actual (sin compresión).
- `assets/models/Celula_animal_draco.glb` — *(opcional)* modelo comprimido Draco (si lo agregas).
- `assets/data/hotspots.json` — etiquetas editables.

## Cómo generar GLB con Draco
Usa **glTF-Transform** o **gltf-pipeline** en tu PC:

### Opción A: glTF-Transform (recomendado)
```
npm i -g @gltf-transform/cli
gltf-transform optimize Celula_animal.glb Celula_animal_draco.glb   --draco.mesh-compression   --texture-compress webp   --gzip
```
Copia `Celula_animal_draco.glb` a `assets/models/`. El sitio intentará cargarlo primero y, si no existe, usará `Celula_animal.glb`.

### Opción B: gltf-pipeline
```
npm i -g gltf-pipeline
gltf-pipeline -i Celula_animal.glb -o Celula_animal_draco.glb -d
```

## Notas
- Los QR apuntan a:
  - RA: https://panchopinto.github.io/cartas-ar-biologia/arjs-demo/animal_glb.html
  - 3D con etiquetas: https://panchopinto.github.io/cartas-ar-biologia/viewer_hotspots.html
- El selector de idioma persiste en `localStorage`.


# Aviso legal

© 2025 Pancho Pinto — Proyecto AR Biología. Todos los derechos reservados.

Queda prohibida la copia, redistribución o adaptación de los contenidos, modelos 3D, imágenes y código aquí publicados sin autorización expresa por escrito.

**Canary:** Proyecto AR Biología — build:__BUILD_DATE__ — hash:__BUILD_HASH__
