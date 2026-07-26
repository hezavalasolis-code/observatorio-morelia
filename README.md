# Observatorio Forestal (Peri)urbano de Morelia

Mapa web interactivo de la **pérdida de vegetación 1990–2023** en las 4 ANP periurbanas de Morelia
(cerros del Águila, Pico Azul–La Escalera, Punhuato y Quinceo), con proyección de riesgo (Random Forest),
comparación satelital 2003↔2025 y zonificación del PMDU.

- **Autor:** M.C.S. Héctor Eduardo Zavala Solís · Posgrado en Geografía, CIGA-UNAM
- **Licencia:** CC BY-NC-ND 4.0 (ver `LICENSE.txt`)

## Cómo citar
Zavala Solís, H. E. (2026). *Observatorio Forestal (Peri)urbano de Morelia*. Posgrado en Geografía, CIGA-UNAM.

## Archivos
- `observatorio_standalone.html` — versión autocontenida (abrir con doble clic).
- `index.html` + carpeta `data/` — versión para publicar en la web.
- `build_data.py`, `build_html.py` — scripts de generación de capas y ensamblado.

## Fuentes de datos
- Imágenes **Landsat 5/7/8/9** Colección 2, reflectancia superficial (USGS) — dominio público.
- Algoritmo **LandTrendr** (Kennedy et al., 2018).
- **Zonificación secundaria PMDU** de Morelia (IMPLAN).
- **GHSL** — Global Human Settlement Layer (Comisión Europea) — CC BY.
- Basemap **Esri World Imagery**; mapa base **CARTO / OpenStreetMap** (ODbL).

Cada fuente conserva su licencia; verifica sus términos antes de republicar (en particular Esri World Imagery y el PMDU).

## Publicación (GitHub Pages)
Sube `index.html` y la carpeta `data/` a un repositorio y activa GitHub Pages. Se sirve por HTTPS.

### Seguridad recomendada — Subresource Integrity (SRI)
Leaflet y Chart.js se cargan desde cdnjs. Para blindar el sitio ante un CDN comprometido, agrega
`integrity="sha512-…"` y `crossorigin="anonymous"` a esas etiquetas `<script>`/`<link>`.
Copia los hashes SRI oficiales desde https://cdnjs.com (cada archivo tiene un botón **Copy SRI**).
