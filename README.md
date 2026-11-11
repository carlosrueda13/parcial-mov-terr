# Parcial Movilidad y Territorio

Plataforma de estudio para el control de lecturas del curso Movilidad y Territorio (Maestría en Transporte, UNAL).
El parcial cubre las lecturas obligatorias hasta la semana 8, vale 27% de la nota y es el 21 de noviembre de 2026.
El formato es selección múltiple más preguntas abiertas, con diferencias sutiles entre opciones.

## Qué hay en el repositorio

| Carpeta | Contenido |
|---|---|
| `docs/` | Programa de lecturas, arquitectura y pipeline de contenido |
| `content/semana-NN/` | Metadatos por lectura, fichas fuente y bancos de preguntas (JSON o Markdown) |
| `prompts/notebooklm/` | Guía y prompts para generar los audios en NotebookLM |
| `design/` | Referencia del diseño aprobado (canvas) |
| `media/` | Audios y videos. No se versionan (ver `.gitignore`) |

Las lecturas (PDF) tampoco se versionan. Viven en la carpeta local del curso.

## Estado

- Semana 1: Gutiérrez (completo) y CEPAL (pp. 54-73) leídos en su totalidad, con ficha y prompt de NotebookLM cada uno (prompts sin probar).
- Semanas 2 a 8: sin iniciar. Faltan tres lecturas obligatorias que no están en la carpeta local: Contreras y Ruiz 2026 (sem. 6), Fernández 2023 y Viana Cerqueira et al. 2026 (sem. 8).
- Plataforma (backend y frontend): diseño aprobado, código sin iniciar. Decisiones: VM en OCI, frontend en Cloudflare Pages, videos con Remotion.

## Método de contenido

1. Cada lectura se convierte en una ficha fuente con páginas, términos exactos, contrastes y catálogo de trampas.
2. La ficha y el PDF se suben a NotebookLM. La ficha es el guion; el PDF es la autoridad.
3. Se verifica la fidelidad del audio contra el PDF antes de publicarlo.
4. El mismo contenido alimenta el banco de preguntas, los boletos, las frases trampa y los simulacros.

Detalle en `docs/PIPELINE-CONTENIDO.md`. Arquitectura propuesta en `docs/ARQUITECTURA.md`.
