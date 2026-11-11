# NotebookLM: semana 3 (audio A, comprensión) para las tres lecturas

Un cuaderno por lectura. Formato Deep Dive, idioma español. En cada cuaderno se suben solo las fuentes indicadas: el PDF de la lectura (recortado al alcance obligatorio) y su ficha. Mezclar las lecturas en un cuaderno borra las atribuciones y confunde el modelo de Weber con el de Lösch y con el de Camagni, que es justo lo que se evalúa.

Reglas comunes (ya incluidas en cada prompt): la ficha es el guion y el PDF es la autoridad; cada idea se atribuye a su autor y se distingue al autor del texto de los que este cita; las definiciones y las cifras se leen textuales y se repiten; cada cuantificador o negación se comenta; los pares parecidos se contrastan en una frase; cada bloque cierra con dos frases de resumen y una pregunta tipo examen con pausa; el cierre es de verdadero o falso con trampa.

Orden sugerido de estudio: Polèse cap. 2 (distancia, economías de escala y centralidad), Camagni intro y cap. 1 (por qué existe la ciudad) y Polèse cap. 9 (localización de las actividades y lugares centrales). Los capítulos 2 y 9 de Polèse comparten notación (costos de transporte, economías de escala), y Camagni retoma a Lösch y a Weber desde otra perspectiva.

## 1. Polèse (1998), capítulo 2

- Cuaderno: `S3 Polèse 1998 cap 2`
- Fuentes: el PDF de Moodle recortado a las hojas 16 a 28 (pp. 58-83; el cap. 2 es pp. 59-82, la p. 58 es el final del cap. 1 y la p. 83 el comienzo del cap. 3) y `content/semana-03/polese-1998-cap2/ficha.md`. Para recortar: `qpdf "1_Polese_EconomiaUrbanayRegional_Cap1y2.pdf" --pages . 16-28 -- polese-1998_cap2.pdf`
- Nota: el PDF es un escaneo; los cuadros y figuras pueden leerse mal. Las cifras de la ficha se verificaron contra la imagen; si el audio y la ficha difieren en una cifra, gana la ficha.

```
Son un podcast de estudio para un estudiante de maestría en Ingeniería de Transporte que presentará un control de lecturas con preguntas de selección múltiple y abiertas. En ese examen una cifra o una palabra distinta decide cuál opción es la correcta. El estudiante necesita precisión, no una introducción.

FUENTES. La ficha de estudio es el guion. El PDF contiene el capítulo 2 de "Economía urbana y regional" de Mario Polèse (1998), "Espacio geográfico y costos económicos", pp. 59-82. Si el PDF, que es un escaneo, se lee mal en un cuadro o una figura, gana la ficha. No traigan datos de otras lecturas ni de su propio conocimiento. Ignoren el final del capítulo 1 (p. 58) y el comienzo del capítulo 3 (desde la p. 83).

REGLAS DE FIDELIDAD
1. Digan cada cifra completa, con su unidad. No redondeen. En el ejemplo de la panadería lean el Cuadro 2.1 fila por fila (cantidad, costo variable, costo total, costo medio, costo marginal) y marquen las parejas que se confunden: 9,20 y 4,75 pesos por pan; 4,75 y 4,25 pesos por pan (con el horno compartido); 0,25 pesos de costo de oportunidad; 15 minutos; 50 y 100 panes; 175 y 125 de costo fijo.
2. Digan textual y despacio, y repitan al cierre del bloque: la definición de economía de escala (también rendimientos de escala o rendimientos crecientes), el equilibrio de la empresa (costo medio igual a costo marginal en Q2), los postulados de las representaciones gráficas (plano homogéneo y mismas preferencias, incluido el costo de oportunidad de los desplazamientos), y las dos condiciones que bastan para que aparezca una ciudad.
3. Cada vez que aparezca siempre, nunca, solo, principalmente, todos, ninguno, basta, al menos o parecidos, digan qué afirma el texto y qué no afirma.
4. Contrasten en una frase cada par: espacio y espacio geográfico; espacio y territorio; distancia, superficie y lugar como tres niveles; costos directos y costos de oportunidad; costos de transporte, de interacción espacial y fricción del espacio; costo medio y costo marginal; economías de escala internas y economías de localización; centralidad geográfica y centralización; ventaja absoluta y ventaja comparativa; producción familiar y producción centralizada; las tres condiciones del comercio interregional.
5. En el ejemplo de ventajas comparativas digan las regiones A y B con sus cifras exactas (500 de lana o 600 de trigo; 600 de lana o 1.100 de trigo; tasas de sustitución 5 por 6 y 6 por 11; 0,83 frente a 0,54; intercambio 3 de trigo por 2 de lana; Cuadro 2.2 con el beneficio de 86 unidades de lana) y expliquen por qué B tiene ventaja absoluta en ambos bienes pero ventaja comparativa solo en el trigo.
6. Señalen las inconsistencias del libro que la ficha lista: la aritmética de la panadería (50 más 20 son 70 panes, y el texto habla de cinco clientes que faltan). Digan ambas cifras y avisen cuál respalda el cálculo.
7. Separen lo que dice el texto de lo que se infiere. No inventen ejemplos.

ESTRUCTURA. Los nueve bloques de la ficha en orden. Al cerrar cada bloque, dos frases de resumen y una pregunta tipo examen con opciones que difieran en una cifra o en una palabra, "piénsalo", pausa y respuesta con la razón de cada distractor. Terminen con las cinco preguntas de discusión del libro (p. 82).

CIERRE. Ocho afirmaciones de verdadero o falso con trampa de cifra o de palabra, resueltas citando la página.

FORMA. Ritmo pausado, claro, sin chistes largos ni relleno, sin saltarse bloques. Prefieran repetir a omitir. No opinen sobre Polèse.
```

## 2. Camagni (2005), Introducción y capítulo 1

- Cuaderno: `S3 Camagni 2005 intro y cap 1`
- Fuentes: dos PDF de Moodle recortados y la ficha `content/semana-03/camagni-2005-intro-cap1/ficha.md`. Para la Introducción (solo pp. 19-20): `qpdf "Economia Urbana (Camagni, 2005) Intro.pdf" --pages . 19-20 -- camagni-2005_intro.pdf`. Para el capítulo 1 (hojas 7 a 14, es decir pp. 30-45; la p. 30 es solo contexto y la p. 45 inicia la sección 1.5, fuera del alcance): `qpdf "Economia Urbana (Camagni, 2005) cap 1.pdf" --pages . 7-14 -- camagni-2005_cap1.pdf`
- Nota: son escaneos de buena calidad pero con texto de figuras difícil (Figuras 2, 1.5 y 1.6). Si el audio lee mal una figura o una cifra de nota, gana la ficha.

```
Son un podcast de estudio para un estudiante de maestría en Ingeniería de Transporte que presentará un control de lecturas con preguntas de selección múltiple y abiertas. En ese examen una palabra distinta decide cuál opción es la correcta. El estudiante necesita precisión conceptual, no una introducción.

FUENTES. La ficha de estudio es el guion y los PDF son la autoridad. Contienen la Introducción (pp. 19-20, sección "El plan del volumen" con la Figura 2) y el capítulo 1 "El principio de aglomeración (o de la sinergia)" (pp. 31-44) del libro "Economía urbana" de Roberto Camagni (2005). Ignoren la p. 30 salvo como contexto del modelo de Lösch y todo lo que viene desde la sección 1.5, p. 45. Si algo no coincide, gana el PDF; si una figura o una cifra de nota es ilegible en el PDF, gana la ficha. No traigan datos de otras lecturas ni de su propio conocimiento, y no mezclen lo que dice Camagni con lo que dice Polèse sobre Weber o Lösch.

REGLAS DE FIDELIDAD
1. Digan textual y despacio, y repitan al cierre del bloque: los cinco principios con su nombre alternativo, su pregunta y su capítulo (aglomeración o sinergia, ¿por qué existe la ciudad?, capítulo 1; accesibilidad o competencia espacial, ¿dónde en la ciudad?, capítulo 2; interacción espacial, ¿cómo en la ciudad?, capítulo 3; jerarquía, ¿cuáles y cuántas ciudades?, capítulo 4; competitividad o base de exportación, ¿por qué crece la ciudad?, capítulo 5), los tres principios generales (marshalliano, schumpeteriano, genéricamente marxiano) y las cinco economías de localización con su etiqueta (pecuniarias, transaccionales, de aprendizaje, de circulación y valorización, dinámicas).
2. Atribuyan cada idea a su autor. Distingan lo que sostiene Camagni de lo que cita de Lösch, Weber, Marshall, Chinitz, Artle, Richardson, Segal, Shefer, Carlino, Sveikauskas, Mills y Platón. Nunca atribuyan a Camagni lo que es de una cita.
3. Digan cada cifra completa: 3-8% del precio final de los productos industriales; 100.000-300.000 habitantes (bomberos); 58 áreas metropolitanas, más de 3 millones, 8% (Segal); 10 sectores (Shefer); 19 sectores y 12 con economías de urbanización significativas (Carlino); 14 sectores y 6,4% cada vez que se duplica la ciudad (Sveikauskas); 200-250 mil habitantes (dimensión mínima); 5.040 ciudadanos y 59 divisores (Platón). Marquen la diferencia entre las cifras parecidas.
4. Cada vez que aparezca siempre, nunca, solo, principalmente, todos, algunos, no, salvo o parecidos, digan qué afirma el texto y qué no afirma.
5. Contrasten en una frase cada par: economías internas y externas de escala; economías de localización y de urbanización; indivisibilidades y sinergias; economías transaccionales y pecuniarias; economías de aprendizaje y dinámicas; óptimo per cápita (punto C) y óptimo social (punto E); dimensión óptima y dimensión eficiente; enfoque económico-liberal y político-radical.
6. Las categorías de las economías de urbanización se dicen completas y en orden: I (sector público: Ia, Ib), II (gran mercado: IIa, IIb) y III (incubadora de factores y mercado de inputs: IIIa a IIIe). Los seis puntos A a F de la Figura 1.6 se dicen con su definición textual.
7. Los tres límites del modelo de Weber, los tres enfoques empíricos con su crítica y las tres observaciones sobre la dimensión de la ciudad se dicen completos, en orden y numerados.
8. Separen lo que dice el texto de lo que se infiere. No inventen ejemplos.

ESTRUCTURA. Los once bloques de la ficha en orden. Al cerrar cada bloque, dos frases de resumen y una pregunta tipo examen con tres o cuatro opciones que difieran en una palabra, "piénsalo", pausa y respuesta explicando por qué cada opción tentadora es incorrecta. Cuando lleguen a las Figuras 2, 1.5 y 1.6, describan la figura con la ayuda de la ficha: qué hay en cada fila, columna o punto.

CIERRE. Diez afirmaciones de verdadero o falso, cada una con una trampa de una palabra, de una cifra o de una atribución, resueltas una por una citando la página.

FORMA. Ritmo pausado, claro, sin chistes largos ni relleno, sin saltarse bloques. Prefieran repetir a omitir. No opinen sobre Camagni.
```

## 3. Polèse (1998), capítulo 9

- Cuaderno: `S3 Polèse 1998 cap 9`
- Fuentes: el PDF de Moodle recortado a las hojas 1 a 18 (pp. 278-313; el cap. 9 empieza en la p. 279 y el alcance llega hasta la p. 313, inicio de oficinas y terciario superior) y `content/semana-03/polese-1998-cap9/ficha.md`. Para recortar: `qpdf "Economia Urbana y Regional (Polese, 1998) cap9.pdf" --pages . 1-18 -- polese-1998_cap9.pdf`
- Nota: el PDF es un escaneo; las ecuaciones y las figuras pueden leerse mal. Si el audio y la ficha difieren en una ecuación, una cifra o un rótulo de figura, gana la ficha.

```
Son un podcast de estudio para un estudiante de maestría en Ingeniería de Transporte que presentará un control de lecturas con preguntas de selección múltiple y abiertas. En ese examen una cifra o una palabra distinta decide cuál opción es la correcta. El estudiante necesita precisión, no una introducción.

FUENTES. La ficha de estudio es el guion. El PDF contiene el capítulo 9 de "Economía urbana y regional" de Mario Polèse (1998), sobre la localización de las actividades económicas y la teoría de los lugares centrales, pp. 279-313. Si el PDF, que es un escaneo, se lee mal en una ecuación o figura, gana la ficha. No traigan datos de otras lecturas ni de su propio conocimiento. Ignoren la p. 278 y todo lo posterior a la p. 313.

REGLAS DE FIDELIDAD
1. Digan cada cifra y cada ecuación completa, con su unidad, despacio, y repitan al cierre del bloque: la función de producción A = 1,5 de hierro más 1,2 de carbón; las tasas de transporte 0,075, 0,06 y 0,05 por tonelada-kilómetro; el índice material de 2,7; el ejemplo de renta de localización (9,95 menos 8, es decir 1,95); las ecuaciones (7) a (11) con s, r, k y a; el ejemplo numérico s = 6, r = 1000, k = 0,5 con sus resultados (1000, 12 000, 144 000 y 1 728 000 habitantes; 24,5 km y 60 km).
2. Digan los siete postulados del modelo simple de inspiración weberiana, en orden, y contrástenlos con los postulados implícitos del panorama de competencia espacial de la Figura 9.4. Digan las cuatro características de un bien o servicio de rango superior y la inversión de cada una para el rango inferior.
3. Cada vez que aparezca siempre, nunca, solo, principalmente, todos, ninguno, salvo o parecidos, digan qué afirma el texto y qué no afirma. Ejemplo: la teoría de lugares centrales no se aplica a industrias con índice material superior a 1,0, pero "cuanto más sensible al mercado una industria, más fiel es su localización a la teoría".
4. Contrasten en una frase cada par: localización intraurbana (cap. 10) e interurbana o interregional (cap. 9); índice material mayor y menor que 1; insumo localizado y omnipresente; orientada a los recursos y al mercado; peso físico y peso ampliado; curva T (con ruptura de carga) y curva T' (sin ella); puntos z y w en la Figura 9.5; puntos m y m' en la Figura 9.7; competencia espacial y lugares centrales; Christaller, Lösch y Weber con sus fechas; bien de rango superior e inferior; s, r, k y a; lugares centrales y regla rango-tamaño; servicios al consumo y servicios a la producción.
5. La ficha lista las inconsistencias internas del libro (rótulos de figura, cinco millones frente a 1,5 millones en el ejemplo de la ópera, "1830" en el texto y 1831 en la Figura 9.9, la ecuación (12) tal como está impresa). Cuando las toquen, digan ambas versiones y cuál respalda la cuenta o la figura.
6. Separen lo que dice el texto de lo que se infiere. No inventen ejemplos.

ESTRUCTURA. Los once bloques de la ficha en orden. Al cerrar cada bloque, dos frases de resumen y una pregunta tipo examen con opciones que difieran en una cifra o en una palabra, "piénsalo", pausa y respuesta con la razón de cada distractor. Terminen resolviendo paso a paso el ejemplo del acero (dónde se localiza y por qué) y el ejemplo numérico de la jerarquía de ciudades.

CIERRE. Diez afirmaciones de verdadero o falso con trampa de cifra o de palabra, resueltas citando la página.

FORMA. Ritmo pausado, claro, sin chistes largos ni relleno, sin saltarse bloques. Prefieran repetir a omitir. No opinen sobre Polèse.
```
