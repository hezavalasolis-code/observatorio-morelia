# Observatorio Forestal de Morelia

Sitio web de la **pérdida de bosque y matorral en el municipio de Morelia, 2006–2024**: dónde se detecta,
en qué tipo de suelo del Programa Municipal de Desarrollo Urbano (PMDU) 2022-2041 ocurre y cuánta
superficie representa, con su margen de error. Es un ejercicio de investigación científica, no un
documento legal.

- **En línea:** https://hezavalasolis-code.github.io/observatorio-morelia/
- **Autor:** M.C.S. Héctor Eduardo Zavala Solís · Posgrado en Geografía, CIGA-UNAM
- **Licencia:** CC BY-NC-ND 4.0 (ver `LICENSE.txt`)

## Cómo citar
Zavala Solís, H. E. (2026). *Observatorio Forestal de Morelia*. Posgrado en Geografía, CIGA-UNAM.

## Páginas
- `index.html` — portada, con tres cifras que se leen de `data/estadisticas.json`.
- `mapa.html` — mapa interactivo: buscador y ficha del lugar, pérdida por año y por tipo, tipos de suelo
  del PMDU, áreas naturales protegidas, comparador 2003 ↔ 2025 y el modo «Verificar el estado actual».
- `datos.html` — tablas y gráficas de la superficie perdida (áreas ajustadas por error, con intervalo de
  95 %), exactitud del mapa, descargas y método.
- `participacion.html` — historial de cada persona registrada: verificaciones, aportes y territorios.
- `acerca.html` — quién lo hace, qué se puede afirmar con los datos y qué no, y cómo citar.
- `privacidad.html` — aviso de privacidad. `moderacion.html` — solo para cuentas de administración.
- `nav.js`, `comun.css` — menú, acceso y estilos comunes. `aportes.html` redirige a `mapa.html`.
- `observatorio_standalone.html` — copia autocontenida del mapa (abrir con doble clic; sin participación).

## Datos (`data/`)
Los archivos de `data/` se generan con scripts que no forman parte de este repositorio y no se editan a
mano. `manifest.json` describe la corrida (versión, parámetros, exactitud y muestra) y
`estadisticas.json` trae las superficies que publica el sitio. Las capas del mapa están simplificadas
para dibujarse: no sirven para medir ni para deslindar un predio, y no llevan superficie como atributo.

## Imágenes (`img/`)
Icono del sitio, imagen de vista previa para redes (`vista-previa.png`) e imagen de la portada
(`portada.jpg`). Las imágenes del comparador 2003 ↔ 2025 viven en `data/` (`sat_2003.jpg`,
`sat_2025.jpg`); si existe `data/comparador.json`, de ahí salen su recuadro y su fuente.

## Fuentes
- Imágenes **Landsat 5, 7, 8 y 9**, Colección 2, reflectancia superficial (USGS) — dominio público.
- Algoritmo **LandTrendr** (Kennedy et al., 2018), en Google Earth Engine.
- Estimación de superficies y exactitud con el estimador de **Stehman (2014)** sobre una muestra de
  706 puntos de referencia fotointerpretados.
- **Áreas naturales protegidas y zonificación del PMDU** de Morelia 2022-2041 (IMPLAN).
- Mapas base e imagen de satélite de **Esri** (Canvas Dark Gray, World Imagery); búsqueda de
  direcciones con **Nominatim / OpenStreetMap** (ODbL).

Cada fuente conserva su licencia; verifica sus términos antes de republicar (en particular Esri World
Imagery y la cartografía del PMDU).

## Tecnología
Sitio estático en GitHub Pages. Leaflet 1.9.4 y Leaflet-Geoman 2.18.3 para el mapa; las gráficas son
SVG sin librerías; Supabase (`supabase-js` 2.45.4) para el registro y la participación. Las librerías se
cargan desde CDN con versión fija; queda pendiente añadirles `integrity` (SRI).
