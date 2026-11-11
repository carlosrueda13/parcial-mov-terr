# Guía para prompts de audio en NotebookLM

Esta guía explica qué debe tener un prompt para que el audio sirva para un parcial con preguntas de
diferencias sutiles. Cada prompt de la carpeta sigue esta estructura.

## El problema que hay que controlar

NotebookLM convierte las fuentes en una conversación entre dos locutores. Eso ayuda a entender, pero tiene
tres riesgos para este examen:

1. Parafrasea y pierde la palabra exacta. Un examen de diferencias sutiles castiga justo eso.
2. Mezcla lo que dice el autor con lo que dice un autor que este cita.
3. Rellena con ejemplos propios que no están en el texto.

## Cómo se controla

1. Se sube una ficha fuente junto al PDF. La ficha (preparada con la lectura completa) fija la estructura, las
   definiciones y las trampas. El PDF queda como autoridad si hay diferencias. El prompt solo ordena cómo usarlas.
2. Se usa un prompt por lectura, no por semana. Mezclar lecturas en un audio borra las atribuciones.
3. Después de generar el audio, se verifica la fidelidad: se transcribe y se compara con el PDF. Ver
   `docs/PIPELINE-CONTENIDO.md`.

## Lo que todo prompt debe incluir

1. Audiencia y objetivo. Estudiante de maestría que presentará un control de lecturas con preguntas cerradas y
   abiertas donde una palabra decide la respuesta. No es una introducción al tema.
2. Jerarquía de fuentes. La ficha es el guion; el PDF es la autoridad; si difieren, gana el PDF.
3. Alcance exacto. Solo las páginas obligatorias. Ignorar el resto del documento.
4. Reglas de fidelidad:
   - atribuir cada idea a su autor, y distinguir al autor del texto de los que este cita;
   - decir las definiciones de forma textual, despacio, anunciando que son textuales, y repetirlas después;
   - separar lo que dice el texto de lo que se infiere;
   - no agregar ejemplos que no estén en el texto.
5. Regla de cuantificadores y negaciones. Cada vez que aparezca siempre, nunca, únicamente, principalmente,
   todos, algunos, no, salvo o similares, los locutores deben decir qué afirma el autor y qué no afirma.
6. Regla de contrastes. Para cada par de conceptos parecidos, una frase explícita de diferencia.
7. Estructura en bloques, en el orden de la ficha, con un resumen de dos líneas al cierre de cada bloque.
8. Pausas de práctica. Al final de cada bloque, una pregunta tipo examen, un "piénsalo" y la respuesta con la
   razón por la que cada opción tentadora es incorrecta.
9. Cierre con afirmaciones de verdadero o falso con trampa y su resolución.
10. Tono y forma. Español, ritmo pausado, sin chistes largos ni relleno, sin saltarse bloques.
11. Prohibiciones. No traer otras lecturas del curso, no opinar, no resumir por encima.

## Ajustes de la herramienta (verificados en noviembre de 2026)

- Formatos disponibles: Deep Dive, Brief, Critique y Debate.
- Hay un cuadro de instrucciones para orientar a los locutores.
- Las opciones de duración (más corto, por defecto, más largo) pueden estar disponibles solo en inglés. En
  español, la profundidad se controla desde el prompt: pedir recorrer todos los bloques y preferir repetir
  antes que omitir.
- No verifiqué el límite de caracteres del cuadro de instrucciones. Si el prompt es muy largo y la herramienta
  lo corta, se mueve el detalle a la ficha y el prompt queda corto.

## Familia de audios por lectura

| Audio | Formato | Para qué sirve | Cuándo se escucha |
|---|---|---|---|
| A. Comprensión | Deep Dive | Entender la lectura completa, con trampas marcadas | Primera pasada |
| B. Repaso corto | Brief | Recordar tesis y definiciones en pocos minutos | Modo trayecto, antes de dormir |
| C. Examen oral | Deep Dive con pausas de pregunta | Responder en voz alta antes de oír la respuesta | Segunda pasada |
| D. Confrontación | Debate o Critique | Contrastar dos lecturas de la misma semana | Cierre de semana |
