# NotebookLM: semana 1, CEPAL 2024 (audio A, comprensión)

## Cuaderno

- Nombre: `S1 CEPAL 2024 pp54-73`
- Fuentes a subir (solo estas dos):
  1. El PDF recortado a las páginas obligatorias: `cepal-2024_pp54-73.pdf` (20 páginas; son las pp. 56-75 del PDF completo de Moodle). No subir el informe completo: NotebookLM mezclaría capítulos que no se evalúan.
  2. `content/semana-01/cepal-2024/ficha.md`
- Formato: Deep Dive. Idioma: español.
- Para recortar el PDF desde cero: `qpdf "Informe urbano ALC (CEPAL, 2024).pdf" --pages . 56-75 -- cepal-2024_pp54-73.pdf`

## Por qué este texto necesita un prompt distinto

El capítulo está lleno de cifras, porcentajes, años y nombres de ciudades. En el examen, un número cambiado o una ciudad intercambiada es la trampa. El prompt obliga a decir cada cifra completa y con su unidad, a no redondear, y a separar lo que afirma la CEPAL de lo que cita de otras fuentes.

## Prompt (copiar completo en el cuadro de instrucciones)

```
Son un podcast de estudio para un estudiante de maestría en Ingeniería de Transporte que presentará un control de lecturas con preguntas de selección múltiple y abiertas. En ese examen una cifra, una ciudad o una palabra distinta decide cuál opción es la correcta. El estudiante ya conoce el tema general y necesita precisión, no una introducción.

FUENTES. La ficha de estudio es el guion y el PDF es la autoridad. El PDF contiene solo las páginas obligatorias del Informe urbano de América Latina y el Caribe 2024 de la CEPAL (capítulo II sobre movilidad urbana sostenible, conclusiones y bibliografía). Sigan el orden de la ficha. Si algo de la ficha no coincide con el PDF, gana el PDF. No traigan datos de otros informes, de otras lecturas ni de su propio conocimiento.

REGLAS DE FIDELIDAD
1. Digan cada cifra completa, con su unidad, su año y su ciudad o país. No redondeen ni aproximen. Si el texto dice "casi un tercio" y "31%", digan las dos cosas y expliquen cuál es cuál.
2. Cuando una cifra tenga una pareja con la que se pueda confundir, dígan la pareja a continuación y marquen la diferencia. Ejemplos de parejas: 5% frente a 76% en Santiago; 4,7% del gasto en transporte público frente a "cercano a 5%" en servicios de transporte; caída de 40% a 80% en 2020 frente a metros todavía 15% a 30% por debajo en 2023; Santiago con la mitad de la flota a batería frente a Santiago más Bogotá con más del 80%; 1.100 millones de dólares para 3.400 buses frente a casi 5 mil millones para unos 15 mil.
3. Atribuyan cada dato a su fuente. Distingan lo que afirma la CEPAL de lo que cita de Estupiñan y la CAF, SLoCaT, Rivas y colaboradores del BID, Biderman y colaboradores, Samaniego y colaboradores, E-Bus Radar y las encuestas origen-destino de cada ciudad. Nunca atribuyan a la CEPAL lo que es de otra fuente.
4. Separen lo que dice el texto de lo que se puede inferir, y avisen cuando infieran. No inventen explicaciones ni ejemplos que no estén en el PDF.
5. Cada vez que aparezca un cuantificador o una negación (siempre, solo, casi, más bien, la mayoría, todas, ninguna, excepto, hasta), señálenlo y digan qué afirma el texto y qué no afirma. Ejemplos del texto: "siempre varios minutos más largos"; "en cinco de las seis ciudades"; "solo Buenos Aires presenta un patrón más equitativo"; "más bien influenciada".
6. Los cuadros y gráficos se leen completos, fila por fila, indicando de qué ciudad o país es cada valor. Si un valor del gráfico no se puede leer con seguridad en el PDF, digan que no se puede leer con seguridad en vez de inventarlo.
7. No confundan estos pares: ciudades (Bogotá, Buenos Aires, Ciudad de México, Montevideo, Santiago, São Paulo) y qué dato corresponde a cada una; BRT y metro; buses a batería y trolebuses; compromiso climático a 2030 y a 2050; flota de buses y flota privada; estrato bajo y estrato alto; tiempo de viaje y distancia de viaje.

ESTRUCTURA
Sigan los bloques de la ficha: introducción; A, desigualdades de la movilidad urbana (reparto modal y motorización, ingreso, tiempo y distancia, género y cuidado, costo, ciudad de 15 minutos); B, pandemia; C, flota, electromovilidad, metas e inversión; conclusiones. Al cerrar cada bloque den un resumen de dos frases. Luego planteen una pregunta tipo examen con tres o cuatro opciones que difieran en una cifra o en una ciudad, digan "piénsalo", hagan una pausa y respondan explicando por qué cada opción tentadora es incorrecta.

CIERRE. Terminen con seis afirmaciones de verdadero o falso, cada una con una trampa de una cifra o de una palabra, y resuélvanlas una por una citando la página del informe y de quién es el dato.

FORMA. Ritmo pausado, claro, sin chistes largos ni relleno, sin saltarse bloques. La precisión importa más que la brevedad: prefieran repetir una cifra a omitirla. No opinen sobre el informe ni lo critiquen.
```

## Después de generar

1. Descargar el audio y guardarlo en `media/semana-01/cepal-A.mp3` (esa carpeta no se sube al repositorio).
2. Verificar la fidelidad: transcribir el audio y comparar cada cifra con la ficha y el PDF. En este texto el riesgo principal es una cifra o una ciudad cambiada.
3. Si el audio queda muy largo o mezcla cifras, generar dos audios separados: uno con introducción y bloque A, otro con bloques B y C más conclusiones.

## Pendientes de esta lectura

- Probar el prompt y ajustar según el resultado. La primera versión no está probada.
- Del Gráfico 34 solo se pueden asignar con seguridad tres valores finales; la ficha lo indica. Revisar el PDF a mano si se quiere más detalle.
