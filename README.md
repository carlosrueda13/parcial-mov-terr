# Parcial Movilidad y Territorio

Plataforma de estudio para el control de lecturas del curso Movilidad y Territorio (Maestría en Transporte, UNAL).
El parcial cubre las lecturas obligatorias hasta la semana 8, vale 27% de la nota y es el 21 de noviembre de 2026.
El formato es selección múltiple más preguntas abiertas, con diferencias sutiles entre opciones.

## Qué hay en el repositorio

| Carpeta | Contenido |
|---|---|
| `app/` | Frontend (Vite, React, TypeScript). Lee `content/` directamente |
| `docs/` | Programa de lecturas, arquitectura y pipeline de contenido |
| `content/semana-NN/` | Metadatos por lectura y fichas fuente (Markdown) |
| `content/banco/` | Banco estructurado por lectura (preguntas, trampas, pares), generado de las fichas. No se edita a mano |
| `content/schema/` | Esquema JSON del banco |
| `scripts/` | `build_banco.py` regenera `content/banco/` a partir de las fichas |
| `prompts/notebooklm/` | Guía y prompts para generar los audios en NotebookLM |
| `design/` | Referencia del diseño aprobado (canvas) |
| `media/` | Audios y videos. No se versionan (ver `.gitignore`) |

Las lecturas (PDF) tampoco se versionan. Viven en la carpeta local del curso.

## Estado

- Semana 1: Gutiérrez (completo) y CEPAL (pp. 54-73) leídos en su totalidad, con ficha y prompt de NotebookLM cada uno (prompts sin probar).
- Semana 2: Montañez y Delgado, Santos cap. 2 y Polèse cap. 1 leídos completos, con ficha, lecturas.json y prompts.
- Semana 3: Polèse cap. 2, Polèse cap. 9 (hasta p. 313) y Camagni (intro pp. 19-20 y cap. 1 pp. 31-44) leídos completos, con ficha, lecturas.json y prompts.
- Semana 4: Polèse cap. 10 (completo) y Camagni cap. 2 (pp. 51-56 y 64-70; capítulo leído completo) leídos, con ficha, lecturas.json y prompts.
- Semana 5: Cuervo y González cap. 8 (pp. 278-294; capítulo leído completo), cap. 9 (completo, pp. 295-352) y León y Ruiz 2016 (completo) leídos, con ficha, lecturas.json y prompts (el cap. 9 en dos audios).
- Semana 6: Contreras y Ruiz 2026 (completo) y SDP 2014 (pp. 73-115) leídos completos, con ficha, lecturas.json y prompts (dos audios cada uno).
- Semana 7: Avellaneda y Dextre cap. 1, Herce caps. I y II y Transport Access Manual (pp. 16-21 y 45-57) leídos completos, con ficha, lecturas.json y prompts (Herce en tres audios; el Manual en dos).
- Semana 8: Fernández 2023, caps. 1 y 2 (pp. 5-50), leído completo, con ficha, lecturas.json y prompts (tres audios). Falta Viana Cerqueira et al. (2026): el PDF debe aportarse.
- Banco estructurado (13-nov): 878 preguntas modelo, 745 trampas y 319 pares extraídos de las 19 fichas, validados contra el esquema. Las 878 preguntas tienen respuesta. Las 151 de las semanas 1 a 4 se redactaron desde el cuerpo de cada ficha; donde la ficha solo da el rango de la sección, la página citada es ese rango.
- El banco no trae opciones de selección múltiple: los distractores se redactarán después a partir de trampas y pares.
- Frontend local (13-nov): mapa de zonas, lector de fichas, práctica (V/F y abiertas), boletos con repetición espaciada, trampas y pares, y simulacro cronometrado. El progreso se guarda en el navegador (localStorage). Para ejecutarlo: `cd app && npm install && npm run dev`.
- Aún no implementado: capas de lectura, dos señales, palabra trampa, audio, selección múltiple con opciones y simulacros semanal y acumulado por tipo de trampa. Viana Cerqueira et al. (2026) aparece como PDF pendiente.
- Despliegue pendiente: frontend en Cloudflare Pages (directorio raíz `app`, comando `npm run build`, salida `dist`) y backend de sincronización en OCI. Decisiones: VM en OCI, frontend en Cloudflare Pages, videos con Remotion.

## Método de contenido

1. Cada lectura se convierte en una ficha fuente con páginas, términos exactos, contrastes y catálogo de trampas.
2. La ficha y el PDF se suben a NotebookLM. La ficha es el guion; el PDF es la autoridad.
3. Se verifica la fidelidad del audio contra el PDF antes de publicarlo.
4. El mismo contenido alimenta el banco de preguntas, los boletos, las frases trampa y los simulacros.

Detalle en `docs/PIPELINE-CONTENIDO.md`. Arquitectura propuesta en `docs/ARQUITECTURA.md`.
