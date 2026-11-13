# Pipeline de contenido por semana

Cada semana pasa por los mismos pasos. Un paso no empieza hasta que el anterior esté cerrado.

## 1. Lectura exacta

- Se lee solo el alcance obligatorio de `docs/PROGRAMA-LECTURAS.md`.
- Se trabaja con el PDF completo. El extractor de Moodle recorta a 60.000 caracteres, así que cualquier lectura
  larga necesita el PDF original en la carpeta local o subido al chat.
- Se registra en `content/semana-NN/lecturas.json` el estado de lectura de cada texto (completa, parcial, pendiente).

## 2. Ficha fuente por lectura

Archivo: `content/semana-NN/<lectura>/ficha.md`. Contiene:

- tesis en una frase;
- bloques en el orden del texto, con páginas;
- definiciones textuales entre comillas (cortas) y paráfrasis para el resto;
- tabla de autores citados y qué aporta cada uno;
- catálogo de trampas probables (inversiones, cuantificadores, atribuciones cruzadas, términos con doble uso);
- preguntas modelo.

## 3. Paquete de contenido

`python3 scripts/build_banco.py` extrae de cada ficha las secciones "Preguntas modelo", "Trampas probables" y "Pares que se confunden" a `content/banco/<semana>/<lectura>.json` (esquema en `content/schema/banco.schema.json`). La ficha sigue siendo la fuente: se corrige la ficha y se regenera.

A partir de la ficha se produce, con esquema validado:

| Pieza | Descripción |
|---|---|
| Preguntas | Selección múltiple y abiertas, con tipo de trampa, dificultad y referencia de página |
| Boletos | Tarjetas cortas de concepto y contraste |
| Frases trampa | Afirmaciones de verdadero o falso con la palabra que las vuelve falsas |
| Pares de señales | Conceptos parecidos que se deben distinguir |
| Capas | Una misma idea explicada en tres niveles de profundidad |

## 4. Audios en NotebookLM

- Un cuaderno por lectura, con dos fuentes: el PDF y la ficha.
- Prompt de `prompts/notebooklm/semana-NN-<lectura>.md`, construido según `_guia-de-prompts.md`.
- Audios por lectura: A comprensión, B repaso corto, C examen oral. Al cierre de la semana, D confrontación entre lecturas.
- La generación la hace Carlos en NotebookLM. Se puede evaluar automatizar el navegador con Claude in Chrome; no está verificado.

## 5. Verificación de fidelidad

Antes de publicar un audio:

1. Transcribirlo (Whisper en local).
2. Compararlo con el PDF y la ficha: definiciones, atribuciones, cuantificadores, ejemplos inventados.
3. Si hay distorsiones, se ajusta el prompt o la ficha y se regenera. Un audio con errores no se publica.

Esta verificación importa porque el examen castiga diferencias de una palabra y NotebookLM parafrasea.

## 6. Videos

- Guion por lectura a partir de la ficha (concepto, contraste, ejemplo del texto).
- Producción por separado. La herramienta de video por confirmar con Carlos ("Remake" podría ser Remotion).

## 7. Carga en la plataforma

- El contenido se valida contra el esquema y se importa en la API.
- Los audios y videos se suben al almacenamiento de medios; las rutas quedan en el JSON de la lectura.

## 8. Simulacros

- Dos simulacros por semana con las preguntas de esa semana.
- Simulacros globales acumulativos desde la semana 4, con mezcla de lecturas para forzar la atribución correcta.
- Los fallos alimentan un repaso espaciado por trampa, no solo por tema.

## Calendario de trabajo

El plazo de uso es de unas 3 semanas. El parcial no tiene fecha confirmada. Con ocho semanas de lecturas, el ritmo
realista es cerrar una o dos semanas de contenido por sesión de trabajo y construir la plataforma en paralelo
sobre las semanas ya cerradas. La fecha del parcial ordena la prioridad: las semanas se estudian en orden y los
simulacros globales entran al final.
