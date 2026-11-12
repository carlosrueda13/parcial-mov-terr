# Ficha fuente: Committee of the Transport Access Manual (2020), Transport Access Manual: A Guide for Measuring Connection between People and Places, cap. 1 (pp. 16-21) y cap. 3 (pp. 45-57)

Referencia: Committee of the Transport Access Manual (2020). Transport Access Manual: A Guide for Measuring Connection between People and Places. First printing, November 2020. Publicado por el propio Committee of the Transport Access Manual (autor "CoTAM" en los metadatos del PDF); licencia Apache 2.0; maquetación con tufte-latex; 229 páginas; en inglés. La portada muestra "45-Minute Accessibility by Transit" en Sídney, del informe Access across Australia (2019). El programa del curso lo cita como "Transport Access Manual" (2020).

Alcance obligatorio (programa, semana 7): pp. 16-21 y 45-57. En el PDF entregado la página impresa coincide con la página del PDF (desfase 0). pp. 16-21: final de la introducción del capítulo 1 "Concepts" (p. 16), sección 1.1 (p. 17), 1.2 (pp. 18-19) y 1.3 (pp. 20-21, con la Fig. 1.2 a página completa). pp. 45-57: capítulo 3 "Measures" desde su apertura (p. 45), 3.1 Primal Measures (pp. 46-52), 3.2 Dual Measures (pp. 53-56) y la Fig. 3.3 (p. 57). La p. 58 está en blanco y el capítulo 4 empieza en la p. 59. NO son lectura obligatoria: 1.4 Access and Equity en adelante (desde la p. 22), el capítulo 2 "Uses", el capítulo 4 "Calculations" (desde la p. 59) en adelante y los apéndices. Se leyeron además, solo como contexto y marcadas así en la ficha, la p. 15 (apertura del capítulo 1) y la p. 44 (sección 2.10).

Estado de lectura: completo (pp. 16-21 y 45-57). El PDF tiene capa de texto y se leyó entero con ella (pdftotext, una página por archivo, en modo de maquetación y en modo de lectura). Las Figs. 1.1, 1.2, 3.1, 3.2 y 3.3, la Tabla 3.1 y las ecuaciones 3.1 a 3.11 se verificaron contra la imagen (110 a 300 dpi).

Correcciones: no hubo OCR. La capa de texto pierde los subíndices, los símbolos griegos y los símbolos sobre las letras de las ecuaciones (A_j con círculo, A_i con g, Q con sombrero, A_i con prima); se transcriben de la imagen. Los dos marcadores de la Tabla 3.1 son una daga (†, observed trips) y un círculo con cruz (⊕, best model fit).

Inconsistencias y rarezas del original (se explican en los bloques):
1. Fig. 1.2 frente al texto de la p. 20: el texto dice que el parque regional se alcanza "in 20 minutes by bicycle". En la figura, las dos flechas verdes (bicicleta) que llegan a los iconos de árbol dicen 10 mins; el único 20 mins de la figura va en una flecha morada (automóvil). Se cumplen las otras dos: cancha de baloncesto a 10 minutos caminando (flecha amarilla) y hospital a 10 minutos en bus (flecha naranja).
2. Tabla 3.1, columna "At Cij = 0": la logística dice "0.5*", pero la nota aclara que f = 0,5 cuando C_ij = t_i, no en C_ij = 0. Power (Gravity) y Tanner traen f = 0 en C_ij = 0, aunque sus exponentes típicos son negativos (α = −1,835 y −0,63), con los que la expresión no está definida en 0 (de la ficha, no del libro). Log-normal dice "undefined".
3. Fig. 3.1 frente a Tabla 3.1: la leyenda de la figura trae "Gaussian" y "Step", que no son filas de la tabla; la tabla trae "Exponential-normal", "Power (Gravity)" y "Logistic", que no están en la figura. El "Step" dibujado tiene cuatro niveles (1,0 hasta 10 minutos; 0,5 hasta 30; 0,2 hasta 40; 0,1 hasta 60), distinto de la función binaria de la Ec. 3.2. La curva Tanner de la figura arranca cerca de 0,9 en t = 0, mientras la tabla da f = 0. El texto no da los parámetros de la figura. De la ficha, no del libro: la curva exponencial coincide con β = −0,054 (0,58 a 10 minutos, 0,20 a 30).
4. Impedancia "decreasing": el texto dice que la impedancia debe ser una función decreciente del tiempo y la nota 21 corrige: "More accurately, impedance must be non-increasing". En la Fig. 3.1 la curva log-normal sube de 0 a 1 en el primer minuto y solo después decrece (de la ficha, no del libro).
5. Dual, criterio de parada: la Ec. 3.10 exige que la suma de oportunidades incluidas sea mayor o igual a Ω (≥ Ω). El diagrama de la Fig. 3.2 sigue sumando mientras ω_i + O_k ≤ Ω y, cuando la condición falla, imprime A'_i sin incluir la zona que cruzó el umbral. Los dos criterios dan resultados distintos (ejemplo en Cálculos). El texto dice "until the threshold number of jobs (Ω) is reached".
6. Dual, salida: la Ec. 3.9 minimiza una suma (Σ O_j · Q_ij · C_ij) y la Ec. 3.8 escribe A'_i = Q̂_ij C_ij sin aclarar si la salida es suma o máximo; el algoritmo de la Fig. 3.2 devuelve el máximo (A'_i ← max(A'_i, C_ik)), es decir, el tiempo del destino más lejano incluido.
7. Acceso competitivo, promedio 1,0: el texto dice que, con oferta y demanda balanceadas, "the average level of competitive access will be exactly 1.0". El promedio que da exactamente 1,0 es el ponderado por la demanda (D_i), no el promedio simple de las zonas (cuenta en Cálculos; de la ficha, no del libro).
8. "Gravity" se usa con dos sentidos: como nombre de la familia ("Weighted cumulative opportunities measures (or gravity)", p. 48) y como una función concreta de la Tabla 3.1 ("Power (Gravity)", f = C^α).
9. Notación del acceso competitivo: la capa de texto escribe A_j, pero el símbolo impreso es A_j con un círculo (acceso en el destino, Ec. 3.4); A_i^g es el acceso competitivo del origen (Ec. 3.6). La nota 35 usa los dos símbolos.
10. Referencias cruzadas a secciones fuera del rango: nota 5 (p. 16) "See section 1.5"; nota 17 (p. 47) "See section 2.3" (estándares); nota 39 (p. 53) "See subsection 2.4.1" (pint-of-milk y acceso digital). El texto obligatorio no las desarrolla.
11. El texto de las pp. 45-56 no remite a la Fig. 3.3; solo aparece su leyenda en la p. 57 (Minneapolis-St. Paul, travelsheds en transporte público, 8 AM, bloque censal de origen 270531261003046, fuente Accessibility Observatory 2017).
12. Erratas menores: "But it worth recognising" (p. 48), "difficult to meaningful compare" (p. 56), "(Cui and Levinson Cui and Levinson)" en el pie de la Fig. 3.2, "straight-forward" (p. 47).

## Tesis en una frase

El propósito del transporte es conectar a las personas con bienes, servicios y actividades, así que lo que debe medirse es el acceso (cuántos lugares de interés se alcanzan en un tiempo o costo dado) y no solo la movilidad (qué tan lejos o qué tan rápido se viaja); el Manual explica la diferencia, propone un modelo de retroalimentación entre acceso, velocidad, actividad y dinero, y presenta dos familias de medidas: las primales (oportunidades alcanzables: acumuladas, ponderadas y competitivas) y las duales (tiempo necesario para alcanzar un número dado de oportunidades).

## Mapa del texto

| Páginas | Contenido |
|---|---|
| p. 15 (contexto) | Apertura del capítulo 1: "What's the point of transport?"; definición de access; notas 1 y 2 |
| p. 16 | Propósito del Manual, estructura no lineal, preguntas que responde el acceso, "movement as a means, not an end" |
| p. 17 | 1.1 Access and Mobility: Clearing Up the Confusion (AASHTO, acceso al sistema de transporte, Midtown Manhattan frente a Laramie) |
| pp. 18-19 | 1.2 Fundamental Model of Access, Fig. 1.1 (Access, Speed, Activity, Money; seis lazos interiores y cuatro exteriores) |
| pp. 20-21 | 1.3 Access, Movement, and Place; Fig. 1.2 (vecindario de 10, 15 o 20 minutos; modos por color) |
| p. 44 (contexto) | 2.10 Predictor of Travel Behavior (acceso como predictor de la conducta de viaje y del reparto modal) |
| p. 45 | Apertura del capítulo 3: medidas primales y duales |
| pp. 46-47 | 3.1 Primal Measures; ecuación de Hansen (3.1); 3.1.1 Cumulative Opportunities (3.2) |
| pp. 48-50 | 3.1.2 Weighted Cumulative Opportunities; Fig. 3.1; Ec. 3.3; Tabla 3.1; effective opportunities; cómo escoger y calibrar β |
| pp. 51-52 | 3.1.3 Competitive Access Measures (Ecs. 3.4 a 3.6) |
| pp. 53-56 | 3.2 Dual Measures: 3.2.1 Single Opportunity (3.7); 3.2.2 Multiple Opportunities (3.8 a 3.11); Fig. 3.2 |
| p. 57 | Fig. 3.3: travelsheds en transporte público, Minneapolis-St. Paul |

## Bloque 1. Propósito del Manual y preguntas que responde el acceso (p. 15 de contexto y p. 16)

- Contexto (p. 15, fuera del rango obligatorio): el transporte busca conectar a las personas con bienes, servicios y actividades (escuelas, empleos, tiendas, restaurantes, hospitales, conciertos, reuniones sociales, parques, senderos). Esa definición reconoce problemas más amplios que los que suelen considerar los analistas: las necesidades de movilidad de quienes no conducen (modos asequibles e inclusivos que no exijan licencia) y el efecto del uso del suelo sobre las distancias y las opciones de viaje. De ahí, comunidades más compactas y multimodales, y un cambio de una planificación orientada a la movilidad a una orientada al acceso ("a shift from mobility- to access-oriented transport planning and engineering").
- Contexto (p. 15): access (nota 1: access y accessibility se usan indistintamente) es la capacidad de las personas de alcanzar bienes, servicios y actividades. La movilidad cuenta, pero el acceso considera también otros factores de capacidad, la ubicación de las oportunidades, los patrones de uso del suelo, la calidad y la asequibilidad de las opciones de transporte y la capacidad de las personas de usarlas. Alguien puede tener buen acceso con calles congestionadas y lentas, o tener bajo acceso viviendo junto a una vía principal sin congestión si sus destinos están lejos o desconectados. Nota 2: access management es otra cosa, regular la entrada a calles locales y accesos desde vías mayores (Gluck y Lorenz 2010).
- p. 16: el Manual es una guía para cuantificar y evaluar el acceso, dirigida a profesionales y a público interesado. Su estructura es no lineal, "akin to a hypertext", así que no hace falta leerlo en secuencia; el Apéndice H lista recursos adicionales (nota 3).
- Preguntas que el acceso ayuda a responder (siete, p. 16): qué grupos tienen acceso por debajo o por encima del promedio; qué tan bien el sistema de transit ayuda a los trabajadores a llegar a empleos (nota 4: transit es equivalente a public transport); si mi negocio está ubicado para atraer un buen grupo de empleados; qué barrios tienen mejores o peores opciones de entretenimiento y restaurantes cerca; cuántos estudiantes pueden ir caminando o en bicicleta a un colegio posible; si tengo un hospital a 30 minutos en ambulancia; si los bomberos pueden llegar a mi casa en 12 minutos.
- Idea central de la p. 16: "access sees movement as a means, not an end". El fin es la capacidad de participar en la actividad que el viajero quiere (nota 5 remite a la sección 1.5).

## Bloque 2. 1.1 Access and Mobility: Clearing Up the Confusion (p. 17)

- Definiciones del Manual: mobility es el movimiento de personas y bienes de aquí a allá, cuánto puede alguien recorrer en un tiempo dado (es lo que perciben los usuarios desde la primera persona). Access es qué lugares puede alcanzar en ese tiempo: cuántos bienes, servicios, destinos o interacciones sociales.
- AASHTO, A Policy on the Geometric Design of Streets and Highways (AASHTO 2018, el Green Book, guía principal de diseño de calles y carreteras en Estados Unidos): usa mobility y access como los dos ejes de la clasificación funcional de las vías. Las vías tienen dos funciones: mobility (la vía mueve tráfico) y access (la vía da acceso al suelo adyacente). Las arterias, grandes, deberían tener alta movilidad y bajo acceso; las vías locales, baja movilidad y alto acceso. En la definición de AASHTO no importa el uso del suelo, "it just matters that a driver can park there". La definición del Manual es distinta: no se trata solo del acceso de vehículos a predios, sino del acceso de diferentes personas a una diversidad de lugares.
- Segunda confusión: el acceso al propio sistema de transporte. Los planificadores preguntan "How many people live within 10 minutes of a bus stop?", es decir, si las personas acceden al transporte público. Pero pocos viajan en bus por el bus mismo, sino para ir a un lugar de interés. Las paradas y estaciones pueden analizarse como destinos, pero no son los más importantes. El Manual no se centra en llegar a partes del sistema de transporte sino en llegar a los lugares de interés.
- Midtown Manhattan (NYC DOT 2018, Mobility Report): velocidad promedio del tráfico vehicular de menos de 8 km/h (5 mph); quien parte de Midtown y maneja media hora probablemente no llega lejos, pero la cantidad de lugares que alcanza en 30 minutos es grande: alto acceso y relativamente baja movilidad.
- Laramie, Wyoming: en media hora se cubre mucha distancia, pero el número de destinos alcanzables es una fracción de los de Manhattan. Nueva York tiene más de 350 pizzerías; Laramie, menos de una docena. No es solo pizza: también hay más oferta laboral y más posibilidades de amistad o de amor.

## Bloque 3. 1.2 Fundamental Model of Access y Fig. 1.1 (pp. 18-19)

- La Fig. 1.1 es una forma de pensar cómo interactúan con Access las redes de transporte ("Speed"), los sistemas de uso del suelo y de demanda de viaje ("Activity") y el sistema financiero ("Money"). Es una simplificación ("obviously a simplification"), pero aclara.
- Flujo principal, lazo de retroalimentación positiva verde, conexiones exteriores del diagrama: más Activity genera más Money; más Money financia más infraestructura y aumenta Speed; mayor Speed aumenta Access; más Access produce más Activity ("More begets more").
- Interior del diagrama, seis conexiones:
  - Positiva, Access a Money (línea central de arriba abajo, verde, con saltos): crear acceso genera ingresos, que pueden capturarse con captura de valor del suelo (nota 6, Medda 2012); la gente paga un premio por estar en un lugar con más oportunidades, separado del premio por llegar más rápido y de los ingresos que generan las actividades adicionales.
  - Positiva, Activity a Access (cuadrante superior derecho, p. 19): más gente en un lugar, más gente alcanzable por otros, mayor acceso.
  - Positiva, Speed a Money (cuadrante inferior izquierdo): a mayor velocidad la gente paga más, "people pay a premium for faster travel" (nota 7, Owen et al. 2014), en teoría porque usa el tiempo ahorrado en otra cosa o, a largo plazo, para reubicarse con más espacio y suelo más barato.
  - Negativa, Activity a Speed (línea central de derecha a izquierda, roja): externalidades negativas de aglomeración y congestión (más gente en la vía, más congestión; más gente en el bus, embarques y desembarques más lentos).
  - Negativa, Money a Activity (inferior derecha, roja): lo más caro se consume menos; si se encarece viajar o desarrollar suelo, hay menos de eso.
  - Negativa, Access a Speed (superior izquierda): aunque la velocidad aumenta el acceso, el acceso disminuye la velocidad; no por aglomeración sino por las fricciones de ubicarse en un lugar que da acceso. Ejemplo: una autopista urbana, aunque no esté congestionada, es más lenta que una rural (menor velocidad de diseño, más curvas por haberse adaptado a un entorno construido, más rampas de entrada y salida). Igual para trenes, buses, bicicletas y caminar (semáforos en cada cuadra).
- Sin los amortiguadores (dampeners) las ciudades serían solo un sistema de retroalimentación positiva y convergerían "to a single point in space", pero no lo hacen.
- Conteo de la figura (verificado contra la imagen): diez flechas; cuatro exteriores, todas positivas (Speed a Access, Access a Activity, Activity a Money, Money a Speed) y seis interiores (tres positivas y tres negativas). En total siete positivas y tres negativas.

## Bloque 4. 1.3 Access, Movement, and Place y Fig. 1.2 (pp. 20-21)

- La Fig. 1.2 muestra la relación física entre acceso, movimiento y lugar, y ilustra la idea del vecindario de 10, 15 o 20 minutos.
- Movement (o mobility): capacidad de las personas de moverse en el espacio, que suele medirse por el tiempo. Colores de modos en la figura: amarillo caminar (incluye sillas de ruedas y cochecitos), verde bicicleta, naranja bus, azul tren, morado automóvil. Los modos más rápidos permiten un espacio de actividad más amplio. Nota 8: D = R · T, T = D/R.
- De qué depende el movimiento: la velocidad depende del diseño de la vía y del nivel de tráfico; la distancia, de la direccionalidad o circuity de la red; la movilidad además reconoce el costo monetario del viaje respecto del ingreso y lo que la gente sabe o percibe de la red (depende de información y percepción).
- Place: ubicación, tipo e intensidad de las actividades (oportunidades) disponibles; en la figura, lugares, servicios y actividades en negro. A veces se usa para lo mismo land use (el patrón de actividades en el territorio) o destinations.
- Ejemplo de la p. 20: una cancha de baloncesto se alcanza en 10 minutos caminando, un parque regional en 20 minutos en bicicleta y un hospital en 10 minutos en bus desde el origen. Las líneas discontinuas son isocronas (líneas de igual tiempo de viaje desde el origen), aquí de 10, 20 y 30 minutos caminando. El ciclista llega en 10 minutos tan lejos como se camina en 20. (Ver inconsistencia 1: en la figura las flechas en bicicleta a los parques dicen 10 mins.)
- Conclusión de la p. 20: "what matters isn't how fast people move, it's about how many things they can reach". Movilidad y mover rápido es parte de la respuesta, pero también lo son el lugar, la proximidad y el uso del suelo; si se organizan bien ciudades y regiones, lo que típicamente se mide para evaluar la movilidad (velocidad y congestión) importa mucho menos. Lo que se mide en su lugar es el acceso.
- p. 21: solo la Fig. 1.2. Contenido verificado de la imagen: origen en un círculo gris al centro; flechas de colores por modo con etiquetas de 5, 10, 15 y 20 mins; arcos azules de tren con escala de marcas; círculos discontinuos concéntricos (las isocronas de 10, 20 y 30 minutos caminando que menciona el texto). Las actividades se dibujan con iconos en negro (hospital, cancha de baloncesto, restaurante, gimnasio, parques, campo de golf, oficinas, entre otros).

## Bloque 5. Apertura del capítulo 3: primal y dual (p. 45)

- Las medidas de accesibilidad se agrupan en dos categorías (Cui y Levinson 2020): primal measures (sección 3.1), como las oportunidades acumuladas, "opportunity-denominated": examinan cuántas oportunidades se alcanzan en un tiempo (o costo) dado; dual measures (sección 3.2), "time- or cost-denominated": consideran cuánto tiempo toma (cuánto cuesta) alcanzar un conjunto dado de oportunidades.
- A grandes rasgos: las primales describen la amplitud de oportunidades disponible; las duales, el costo de viajar a un conjunto específico de oportunidades. El capítulo también discute ventajas y desventajas de cada medida.
- Contexto (p. 44, sección 2.10, fuera del rango obligatorio): el acceso es un predictor importante de la conducta de viaje; quienes viven en zonas de alto acceso hacen viajes más cortos porque hay opciones cerca (Levinson 1998); el acceso relativo por modo ayuda a predecir el reparto modal (alto acceso en transit frente a automóvil, más probabilidad de alta participación del transit; Owen y Levinson 2015, Wu et al. 2019; igual con el acceso peatonal y los viajes a pie). Las métricas de acceso se incluyen en los modelos de planificación estratégica de las organizaciones metropolitanas; ejemplo: UrbanSim/ActivitySim, de código abierto y basado en actividades (Waddell et al. 2018). Sirven como resultado final y como resultado intermedio en un sistema de retroalimentación.

## Bloque 6. 3.1 Primal measures, ecuación de Hansen y 3.1.1 Cumulative Opportunities (pp. 46-47)

- Origen del concepto de potencial u oportunidad de interacción: Carey (1867), Principles of Social Science. Walter Hansen (1959) lo usó para describir el acceso a oportunidades y definió accessibility como "the potential of opportunities for interaction".
- Ecuación de Hansen (3.1): A_i = Σ_j O_j · f(C_ij). A_i: acceso desde la ubicación i; O_j: número de oportunidades en el destino j; C_ij: costo de viaje de i a j; f(C_ij): función de impedancia. Se ha usado para empleos (Linneker y Spence 1992), servicios minoristas (Guy 1983) y otras personas (Patton y Clark 1970).
- Tres tipos de medidas primales: Cumulative Opportunities (3.1.1), cuentan las oportunidades dentro de un travelshed (nota 10: travelshed equivale al área encerrada por una isocrona, cuyo límite es un tiempo de viaje dado desde el origen); Weighted Cumulative Opportunities (3.1.2), valoran más las oportunidades cercanas; Competitive Measures (3.1.3), consideran la competencia entre viajeros por un conjunto limitado de oportunidades.
- 3.1.1: cuenta las oportunidades alcanzables dentro de una distancia, tiempo u otro costo. La impedancia es una función binaria (nota 13: dichotomy [1, 0], también función binaria o indicadora), Ec. 3.2: f(C_ij) = 1 si C_ij ≤ t; si no, f(C_ij) = 0.
- Ventajas (3): requiere relativamente pocos datos; el concepto de lo alcanzable en cierto tiempo lo entienden los no especialistas (juntas decisorias sin expertos en transporte); el resultado tiene el mismo significado en distintos tiempos y lugares, lo que permite comparar, hacer seguimiento y benchmarking.
- Desventajas (2): un único tiempo de corte puede causar edge effects (nota 14: sección 5.1) cuando un gran grupo de destinos queda justo después del corte; ejemplo del texto: con un corte estricto de 45 minutos, lugares a 44 minutos de esa zona tendrían más acceso que lugares a 46 minutos; además, la elección del corte puede alterar el ranking de lugares por acceso relativo (Pereira 2019). Aun así, en la mayoría de los casos prácticos los edge effects son menores y la medida da una imagen precisa; la arbitrariedad se mitiga examinando un rango de umbrales (es sencillo reportar varios, nota 16: 5, 10, 15, ..., 60 minutos; los umbrales suelen anclarse a conductas observadas o a números redondos, como 15, 30, 45 y 60 minutos para viajes al trabajo). Segunda desventaja: no hay un estándar obvio (nota 17: sección 2.3) del número adecuado de oportunidades accesibles; el objetivo suele definirse por comparación entre lugares, contextos o tiempos.

## Bloque 7. 3.1.2 Weighted Cumulative Opportunities, Fig. 3.1, Tabla 3.1 y calibración de β (pp. 48-50)

- Concepto: las medidas ponderadas (o gravity, nota 18) descuentan las oportunidades por su distancia, tiempo o costo de viaje, en lugar de usar cortes estrictos. Las funciones de impedancia (nota 19: antes "distance decay functions"; hoy se prefiere "impedance" porque se consideran tiempo y otros costos) reconocen que el valor de una oportunidad es menor si es más costosa de alcanzar. Nota 18: las primeras funciones de impedancia se basaron en la ley de gravedad de Newton, con una atracción que decrece con el cuadrado de la distancia; por eso se llaman "gravity-type".
- Práctica común: usar funciones estimadas en el componente de elección de destino (distribución de viajes) de un strategic planning model (nota 20: también modelos de planificación del transporte urbanos, regionales o metropolitanos, modelos de demanda de viaje o de cuatro etapas). El único requisito: la impedancia debe ser decreciente respecto del tiempo (nota 21: más exactamente, no creciente). Es una cumulativa ponderada en que las oportunidades cercanas pesan más.
- Forma más usada, exponencial negativa (Ec. 3.3): f(C_ij) = e^(β·C_ij), con β < 0 por determinar. Algunos sostienen que representa mejor la conducta humana (Handy y Niemeier 1997; Wilson 1971), pero hay otras funciones y cada una tiene adeptos (nota 23: Feldman et al. 2012; Geurs y Van Wee 2004; Reggiani et al. 2011).
- Con tiempo cero el peso es 1 (f(C_ij = 0) = 1), así que las medidas exponenciales negativas pueden verse como el equivalente de cierta cantidad de oportunidades justo en la puerta de la casa: effective opportunities. Suelen presentarse en términos comparativos más que absolutos; para compararlas conviene reescalarlas a un rango como 0-100 (Geurs y Van Wee 2004).
- Fig. 3.1 (Common Impedance Functions): peso (0 a 1) frente al tiempo de viaje (0 a 60 minutos); siete curvas: Exponential, Gaussian, Log-normal, Exponential-square-root, Generalized Exp, Tanner y Step.
- Tabla 3.1 (Alternative Impedance Function Expressions), nueve filas con expresión, valor en C_ij = 0 y valores típicos de α y β:
  - Cum. Opportunities: 1 si C_ij ≤ t, si no 0; f(0) = 1.
  - Exponential: e^(β·C); f(0) = 1; β = −0,008† y −0,054⊕.
  - Exponential-normal: e^(β·C²); f(0) = 1; β = −1,2·10⁻⁵† y −0,001⊕.
  - Exponential-square-root: e^(β·√C); f(0) = 1; β = −0,261† y −0,44⊕.
  - Generalized Exp.: e^(β·C^α); f(0) = 1; α = 1,8⊕, β = −0,002⊕.
  - Power (Gravity): C^α; f(0) = 0; α = −1,835†.
  - Tanner: C^α · e^(β·C); f(0) = 0; α = −0,63⊕, β = −0,5⊕.
  - Log-normal: e^(β·ln²(C)); indefinida en 0; β = −0,178† y −0,16⊕.
  - Logistic: 1 − 1/(1 + e^(−κ(C − t_i))); "0.5*"; sin valores típicos. Es una curva en S invertida, centrada en un punto de inflexión t_i, que pondera con un factor cercano a 1 las oportunidades próximas al origen y con uno cercano a 0 las lejanas; f = 0,5 cuando C_ij = t_i.
  - Leyenda: † observed trips (Reggiani et al. 2011); ⊕ best model fit (Feldman et al. 2012; Wu et al. 2019).
- Ventaja (1): considera todo el rango de tiempos de viaje en lugar de solo si está por encima o por debajo de un corte, lo que se parece más a la conducta humana: un destino a 31 minutos se valora más que uno a 59, y uno a 61 es solo marginalmente peor que uno a 59.
- Desventajas (3):
  - Escoger la función de impedancia y estimar sus parámetros. Aun con la exponencial negativa, β varía mucho entre contextos (nota 25: Haynes et al. 1984). Opciones: tomar β del componente de elección de destino del strategic planning model (El-Geneidy y Levinson 2006), idealmente por propósito de viaje (Martínez y Viegas 2013), modo y hora del día; calibrarlo con un método simplificado a partir de tiempos de viaje medianos observados por propósito, modo o población (Merlin 2020); si hay una matriz origen-destino, ajustar un modelo de elección de destino (Papa y Coppola 2012); tomar β de una región similar (McArthur et al. 2011), sin garantía de buen ajuste local. Si nada de esto es viable, estimar el parámetro puede ser prohibitivo y conviene usar una medida acumulada.
  - Es menos interpretable que la acumulada (con la acumulada es claro qué significa cierta cantidad de empleos en cierto número de minutos); puede ayudar explicar y usar las effective opportunities. Nota 31: igual que la acumulada, supone que cada destino de un tipo es fungible y ofrece el mismo atractivo.
  - Depende de la fórmula de impedancia, que varía de lugar a lugar y de tiempo a tiempo: no es transferible de forma significativa entre ciudades ni entre años, y no hay garantía de que el coeficiente de hoy siga siendo válido dentro de diez años.

## Bloque 8. 3.1.3 Competitive Access Measures (pp. 51-52)

- Las acumuladas y las ponderadas solo consideran la oferta. Muchas oportunidades son rivales (rival): si la persona A ocupa un empleo, no está disponible para B. En esos casos conviene una medida competitiva.
- Ejemplo de Nueva York: los parques rara vez están llenos, así que una medida acumulada o ponderada puede captar bien el acceso a parques; las camas de hospital deben medirse respecto del nivel de población (puede haber muchas camas cerca, pero todas ocupadas), por lo que debe considerarse oferta y demanda.
- Empleo: solo un candidato puede llenar cada vacante. Hay algo de evidencia de que el empleo se mide mejor con una medida competitiva (Shen 1998), en particular para poblaciones de menores ingresos (Merlin y Hu 2017a).
- Método: descontar cada oportunidad de oferta por la cantidad de demanda por esa oportunidad en su ubicación; extiende la Ec. 3.1. La razón se expresa como oportunidades alcanzables desde una ubicación, descontadas por el nivel de demanda que tiene acceso potencial a ellas: suma el "supply to demand ratio" de cada destino sujeto a impedancia. La razón basada en destinos difiere de la basada en orígenes porque tiene en cuenta la fuente de la demanda. Adaptado de Shen (1998), Ecs. 3.4 a 3.6, en tres pasos:
  1. Acceso en el destino (A_j con círculo) a la demanda (D_i), por ejemplo cuántos trabajadores pueden llegar al lugar de trabajo: A_j = Σ_i D_i · f(C_ji), con i de 1 a I (Ec. 3.4).
  2. Descuento de las oportunidades del destino j por competencia: g(O_j) = O_j / A_j (Ec. 3.5).
  3. Acceso competitivo a empleos desde i: A_i^g = Σ_j g(O_j) · f(C_ij), con j de 1 a J (Ec. 3.6).
- Ventajas (2): considera la competencia por destinos, más fiel cuando las oportunidades son limitadas (el empleo puede describirse mejor así; nota 35, Merlin y Hu 2017b: los empleos están más concentrados espacialmente que la población, así que la variación de A_i es mayor que la de A_j; en el extremo, si no hay variación en A_j, A_i y A_i^g son equivalentes); exige poco más datos que las acumuladas o ponderadas y la fórmula de descuento funciona con ambas; si la demanda y la oferta totales están balanceadas en el área de análisis, el nivel promedio de acceso competitivo es exactamente 1,0 (nota 36, Allen y Farber 2017: lugares con acceso competitivo mayor que 1,0 tienen acceso superior y menor que 1,0, inferior; mejora las medidas tradicionales de balance empleo-trabajador, Cervero 1989 y 1996, porque no se limita a fronteras jurisdiccionales).
- Desventajas (3): requiere más cálculo que las acumuladas; es más difícil de interpretar porque es una razón y no una cantidad tangible (se interpreta en sentido comparativo, como las ponderadas); un lugar con muchas oportunidades y alta demanda no es comparable con uno de pocas oportunidades y mínima demanda (Knox 1978), y aun así la razón daría resultados similares para ambos.
- Cierre de la sección (p. 52): si medidas más simples dan la misma orientación de política que las competitivas, deben preferirse las simples.

## Bloque 9. 3.2 Dual Measures: single y multiple opportunities (pp. 53-56)

- Las medidas duales son denominadas por el tiempo requerido para alcanzar un número dado de oportunidades (nota 38: terminología de Cui y Levinson 2020). La medida primal es la más común en la práctica de planificación y en la literatura académica. Hay dos tipos: la dual para una sola oportunidad y la dual para varias.
- 3.2.1 Single Opportunity: el caso más simple es el pint-of-milk test (nota 39, sección 2.4.1): si se puede comprar un litro de leche (pinta) a menos de 10 minutos caminando desde la casa. Se responde hallando cuántos minutos toma llegar a la tienda más cercana que venda leche; si es menos de 10 minutos, se pasa la prueba. El umbral es 1 oportunidad (pregunta binaria) y el acceso se mide por el tiempo hasta la tienda más cercana. Ec. 3.7: A'_i = min(C_i1, C_i2, ..., C_ij) para todo j tal que O_j > 0. Si el umbral sube, se requiere más cálculo (3.2.2).
- 3.2.2 Multiple Opportunities: se entiende con la idea de travelshed o isocrona. En el acceso primal el tamaño de las isocronas (el tiempo) es fijo y el número de oportunidades dentro es la medida; en el dual la isocrona se sigue expandiendo hasta cubrir un número umbral de oportunidades, y el tiempo de esa isocrona expandida es la medida.
- Formulación (Ecs. 3.8 a 3.11): A'_i = Q̂_ij · C_ij (3.8), donde Q̂_ij sale de argmin sobre Q_ij de Σ_j O_j · Q_ij · C_ij (3.9; nota 40: argmin identifica los elementos del dominio donde la función se minimiza), sujeto a Σ_j O_j · Q_ij ≥ Ω (3.10) y Q_ij ∈ {0, 1} (3.11). A'_i: accesibilidad dual del origen i; Ω: umbral de oportunidades; Q̂_ij: matriz de incidencia que indica el destino j que tiene la Ω-ésima oportunidad más cercana para el origen i; Q_ij: celdas de esa matriz, 1 si el destino j está en el conjunto, 0 si no. Es una solución genérica.
- Procedimiento algorítmico (Fig. 3.2, diagrama de flujo, fuente Cui y Levinson): para una ubicación i, una vez conocidos los empleos por zona y los tiempos entre zonas. C_i es una fila de la matriz de tiempos con solo los tiempos desde i, ordenados de menor a mayor (de 1 a K, K = J, índice k); O tiene el contenido de la matriz de empleos O_j reordenado en la misma secuencia; ω_i es una variable temporal con los destinos (por ejemplo empleos) acumulados en la iteración k. Inicio: A'_i = 0, ω_i = 0. Mientras k ≤ K y ω_i + O_k ≤ Ω: ω_i ← ω_i + O_k y A'_i ← max(A'_i, C_ik), k ← k + 1; si no, imprime A'_i y termina. El texto explica que el algoritmo itera por zonas de 1 a k aumentando gradualmente el costo, sumando empleos de las zonas más fáciles de alcanzar hacia las más lejanas hasta llegar al umbral Ω, y que el costo de viaje en esa iteración es la salida. El Apéndice E trae un script en R (fuera del rango).
- Relación primal-dual: si la medición es suficientemente precisa, la medida primal (A) de oportunidades alcanzables en t minutos se corresponde directamente con la dual que dice que toma t minutos cubrir A oportunidades (Breheny 1978).
- Ventajas (2): es intuitiva y se alinea con la percepción del público viajero; es fácil de percibir para comparar entre lugares y ciudades, mientras que en las primales pequeños cambios en el umbral de tiempo pueden causar variaciones grandes en el número de oportunidades y las diferencias entre ciudades pueden ser extremas; una medida en minutos da una escala más fácil de percibir y comparar. Puede cuantificarse como el costo en tiempo de completar ciertas tareas (una compra, una visita al dentista), lo que evita fijar un umbral arbitrario de oportunidades; el concepto podría extenderse a las compras en línea y otras formas de acceso digital (subsección 2.4.1).
- Desventajas (3): sin una buena referencia, fijar un umbral de oportunidades mayor que 1 suele ser arbitrario; hay poco consenso sobre el número o rango mínimo de oportunidades de cada tipo para mantener plena participación en la sociedad, y el tiempo solo puede no reflejar la necesidad o preferencia (el lugar principal de compras no tiene por qué ser el más cercano a casa; Burns y Warren 1995); el cálculo es menos directo que el de las primales cuando las oportunidades superan una; las duales son un campo de investigación activa, así que sus buenas prácticas y su relación con la conducta de viaje están menos establecidas que las de las primales.

## Bloque 10. Fig. 3.3, travelsheds en Minneapolis-St. Paul (p. 57)

- Mapa titulado "Minneapolis-St. Paul", con "Origin Census Block 270531261003046". Leyenda "Travelsheds (Transit, 8AM)" con seis clases de color, 10, 20, 30, 40, 50 y 60 minutos, y el bloque censal de origen señalado con una flecha. Fuente: Accessibility Observatory (2017). Pie: "Minneapolis - Travelsheds by Transit".
- Lectura del mapa (de la imagen): las áreas de menor tiempo son las más claras y quedan cerca del origen; las de 60 minutos forman una mancha irregular, no un círculo, de modo que la isocrona de transporte público no es circular y su forma depende de la red.
- El texto de las pp. 45-56 no la menciona; es una ilustración de travelshed (nota 10, p. 46) y de la expansión de la isocrona del acceso dual.

## Figuras, tablas y ecuaciones verificadas contra la imagen

- Fig. 1.1 (p. 18): Access (arriba), Activity (derecha), Money (abajo), Speed (izquierda). Exteriores: Speed a Access (+), Access a Activity (+), Activity a Money (+), Money a Speed (+). Interiores: Access a Money (+, verde con saltos), Activity a Access (+, verde delgada), Speed a Money (+, verde punteada), Activity a Speed (−, roja gruesa), Money a Activity (−, roja delgada), Access a Speed (−, roja punteada).
- Fig. 1.2 (p. 21): origen gris al centro; círculos discontinuos concéntricos; arcos azules de tren con escala de marcas; colores de modo según el texto de la p. 20; minutos en las flechas (ver inconsistencia 1).
- Ec. 3.1 (p. 46): A_i = Σ_j O_j f(C_ij). Ec. 3.2 (p. 47): f(C_ij) = 1 si C_ij ≤ t, si no 0. Ec. 3.3 (p. 48): f(C_ij) = e^(β C_ij).
- Fig. 3.1 (p. 48): siete curvas, eje de peso de 0 a 1, tiempo de 0 a 60 minutos; "Step" con niveles 1,0 / 0,5 / 0,2 / 0,1 y cortes en 10, 30 y 40 minutos.
- Tabla 3.1 (p. 49): nueve filas, con las expresiones y los valores típicos transcritos arriba.
- Ecs. 3.4 a 3.6 (pp. 51-52): A_j (círculo) = Σ_{i=1..I} D_i f(C_ji); g(O_j) = O_j / A_j (círculo); A_i^g = Σ_{j=1..J} g(O_j) f(C_ij).
- Ec. 3.7 (p. 53): A'_i = min(C_i1, C_i2, ..., C_ij) ∀ j tal que O_j > 0. Ecs. 3.8 a 3.11 (p. 54): ver bloque 9.
- Fig. 3.2 (p. 55): diagrama de flujo con inicialización (A'_i = 0, ω_i = 0, vectores C_i y O), decisión k ≤ K, decisión ω_i + O_k ≤ Ω, actualización ω_i ← ω_i + O_k y A'_i ← max(A'_i, C_ik), incremento k ← k + 1, salida "Print A'_i" y fin.
- Fig. 3.3 (p. 57): ver bloque 10.
- Totales de la parte leída: 11 ecuaciones (3.1 a 3.11), 5 figuras (1.1, 1.2, 3.1, 3.2, 3.3), 1 tabla (3.1); 3 medidas primales y 2 tipos de duales.

## Cálculos y comprobaciones

De la ficha, no del libro:
- Fig. 1.1: 10 flechas, 7 positivas y 3 negativas (4 exteriores positivas; 6 interiores: 3 positivas y 3 negativas).
- Exponencial negativa de la Tabla 3.1: con β = −0,054 (best fit), f(10) = 0,583, f(30) = 0,198, f(45) = 0,088, f(60) = 0,039; con β = −0,008 (observed trips), f(10) = 0,923, f(30) = 0,787, f(60) = 0,619. La curva azul de la Fig. 3.1 (0,58 a 10 minutos, 0,2 a 30, 0,04 a 60) coincide con β = −0,054.
- Ejemplo de las tres lecturas con O = (100, 200, 300, 400) a C = (5, 10, 15, 20) minutos: acumulada con t = 15, A = 600; con t = 14, A = 300 (un minuto de diferencia reduce a la mitad: el edge effect). Ponderada exponencial con β = −0,054: 100·0,763 + 200·0,583 + 300·0,445 + 400·0,340 = 462,2 effective opportunities. Dual con Ω = 500: según la Ec. 3.10 (≥ Ω) las sumas son 100, 300 y 600, y A'_i = 15 minutos; según el diagrama de la Fig. 3.2 (≤ Ω) se llega a ω = 300 y A'_i = 10, porque 300 + 300 = 600 > 500 detiene el ciclo. Con Ω = 1 y una primera zona con 3 tiendas, el diagrama imprime 0 (0 + 3 > 1).
- Acceso competitivo, caso balanceado: D = (600, 400), O = (300, 700), f = 1 para todos los pares: A_j = 1000 en ambos destinos, g = (0,3; 0,7) y A_i^g = 1,0 en cada origen (oferta total 1000 = demanda total 1000). Caso con alcance parcial (el origen 1 solo llega al destino 1): A_j = (1000, 400), g = (0,3; 1,75), A_i^g = (0,3; 2,05). Promedio ponderado por la demanda: (600·0,3 + 400·2,05)/1000 = 1,0; promedio simple de las zonas: 1,175. De ahí la inconsistencia 7.
- Logística con κ = 0,2 y t_i = 30: f(0) = 0,9975 y f(30) = 0,5, de modo que "0.5*" corresponde a C = t_i y no a C = 0.
- 5 mph = 8,05 km/h, coherente con "8 km/h (5 mph)".
- Umbrales de la nota 16: de 5 a 60 minutos de 5 en 5 son 12 umbrales; para viajes al trabajo, 15, 30, 45 y 60 (4).
- Inventario de listas: siete preguntas del acceso (p. 16); cinco colores de modo (p. 20); diez flechas en la Fig. 1.1; tres medidas primales, dos tipos de duales; nueve funciones en la Tabla 3.1 (siete curvas en la Fig. 3.1); tres ventajas y dos desventajas de la acumulada; una ventaja y tres desventajas de la ponderada; dos ventajas y tres desventajas de la competitiva; dos ventajas y tres desventajas de la dual.

## Pares que se confunden

| Par | Diferencia |
|---|---|
| Mobility y access (Manual) | Mobility: cuánto puede alguien recorrer en un tiempo dado (movimiento de personas y bienes de aquí a allá). Access: qué lugares puede alcanzar en ese tiempo |
| Access (Manual) y "access" de AASHTO | AASHTO: una de las dos funciones de la vía (da acceso al suelo adyacente; no importa el uso del suelo). Manual: acceso de diferentes personas a una diversidad de lugares |
| Access y access to the transport system | Lo segundo es, por ejemplo, vivir a menos de 10 minutos de una parada; el Manual mide llegar a lugares de interés, no a partes del sistema |
| Access y access management | Access management regula la entrada a calles locales y accesos desde vías mayores (Gluck y Lorenz 2010) |
| Access y accessibility | Se usan indistintamente (nota 1, p. 15) |
| Midtown Manhattan y Laramie | Midtown: alto acceso y baja movilidad (menos de 8 km/h). Laramie: se cubre mucha distancia pero se alcanzan pocos destinos |
| Activity a Speed y Access a Speed (Fig. 1.1) | Los dos son negativos. El primero es aglomeración y congestión; el segundo, las fricciones de ubicarse en un lugar con acceso (autopista urbana menos congestionada pero más lenta que una rural) |
| Lazo exterior y conexiones interiores (Fig. 1.1) | Exterior: Activity a Money a Speed a Access a Activity, todo positivo. Interiores: tres positivas (Access a Money, Activity a Access, Speed a Money) y tres negativas |
| Movement y place (Fig. 1.2) | Movement: capacidad de moverse en el espacio (modo, velocidad, circuity, costo, información). Place: ubicación, tipo e intensidad de actividades (land use, destinations) |
| Primal y dual | Primal: oportunidades alcanzables en un tiempo o costo dado (amplitud). Dual: tiempo o costo para alcanzar un número dado de oportunidades |
| Cumulative, weighted cumulative y competitive | Acumulada: cuenta dentro de un corte (binaria). Ponderada: descuenta por impedancia. Competitiva: descuenta la oferta por la demanda que la alcanza |
| Travelshed e isochrone | Equivalentes (nota 10): el área cuyo límite es un tiempo de viaje dado desde el origen |
| Impedance, distance decay y gravity-type | Impedance es el término general (tiempo y otros costos); distance decay es el nombre histórico; gravity-type viene de la ley de gravedad de Newton |
| Strategic planning model y sus sinónimos | Urban, regional o metropolitan transportation planning model, travel demand model, four-step model (nota 20) |
| Decreasing y non-increasing | El texto dice decreciente; la nota 21 corrige: no creciente |
| Observed trips (†) y best model fit (⊕) | Dos fuentes de los valores típicos de la Tabla 3.1: Reggiani et al. 2011; Feldman et al. 2012 y Wu et al. 2019 |
| Opportunities rivales y no rivales | Rivales: empleos, camas de hospital (competitiva). No rivales en la práctica: parques (acumulada o ponderada) |
| A_j (círculo) y A_i^g | A_j: acceso en el destino a la demanda (Ec. 3.4). A_i^g: acceso competitivo del origen (Ec. 3.6) |
| Single y multiple opportunities (dual) | Single: mínimo del tiempo a destinos con O_j > 0 (Ec. 3.7). Multiple: isocrona que se expande hasta cubrir Ω (Ecs. 3.8 a 3.11) |
| Edge effect y arbitrariedad del umbral | Edge effect: un gran grupo de destinos justo después del corte. Arbitrariedad: la elección del corte puede cambiar el ranking de lugares |
| Effective opportunities y número de oportunidades en el travelshed | Effective: equivalente en oportunidades junto a la puerta (peso 1 en tiempo 0). Número en el travelshed: la medida acumulada |
| Ecuación de Hansen y modelo gravitacional completo | La Ec. 3.1 es la forma general A_i = Σ O_j f(C_ij); cada medida primal es un caso según f |
| Pint-of-milk test y dual multiple | Pint-of-milk: umbral de 1 oportunidad, binaria; el tiempo al mínimo da la medida. Multiple: umbral mayor que 1 |

## Trampas probables de examen

Acceso, movilidad y el modelo de la Fig. 1.1
1. Access (Manual) es qué lugares se alcanzan en un tiempo dado; mobility es qué tanto se recorre (p. 17). No intercambiar.
2. El Manual no se centra en llegar a paradas o estaciones ("How many people live within 10 minutes of a bus stop?"); mide llegar a lugares de interés (p. 17).
3. AASHTO: dos funciones de la vía, mobility y access; arterias, alta movilidad y bajo acceso; locales, baja movilidad y alto acceso (p. 17). Para AASHTO no importa el uso del suelo. Error típico: atribuirle al Manual la clasificación funcional.
4. Midtown Manhattan: menos de 8 km/h (5 mph), alto acceso y baja movilidad. Laramie: mucha distancia en media hora, pocos destinos. Más de 350 pizzerías en Nueva York frente a menos de una docena en Laramie (p. 17). No invertir los casos.
5. Access management es otra cosa (nota 2); access y accessibility son intercambiables (nota 1).
6. El fin del transporte no es el movimiento sino la actividad: "movement as a means, not an end" (p. 16).
7. Las siete preguntas de la p. 16: grupos con acceso por encima o debajo del promedio, transit y empleos, ubicación del negocio, entretenimiento y restaurantes, estudiantes caminando o en bicicleta, hospital a 30 minutos en ambulancia, bomberos a 12 minutos. No mezclar cifras (30 y 12).
8. Fig. 1.1: Speed, Activity, Access y Money. Flujo principal: Activity a Money a Speed a Access a Activity, todo positivo (más begets más). Tres negativas: Activity a Speed (congestión), Money a Activity (lo caro se consume menos), Access a Speed (fricciones de ubicarse en lugares con acceso).
9. Las tres positivas interiores: Access a Money (captura de valor del suelo), Activity a Access, Speed a Money (la gente paga un premio por viajar más rápido). Sin amortiguadores las ciudades convergerían a un punto.
10. La velocidad aumenta el acceso, pero el acceso reduce la velocidad: no por aglomeración sino por fricciones (autopista urbana frente a rural, semáforos en cada cuadra).

Movimiento, lugar y vecindario de 10 minutos
11. Colores: amarillo caminar (incluye sillas de ruedas y cochecitos), verde bicicleta, naranja bus, azul tren, morado automóvil (p. 20).
12. D = R · T; T = D/R (nota 8). La velocidad depende del diseño de la vía y del tráfico; la distancia, de la directness o circuity; la movilidad además depende del costo respecto del ingreso y de información y percepción.
13. Ejemplo textual: cancha a 10 minutos caminando, parque regional a 20 minutos en bicicleta, hospital a 10 minutos en bus; las isocronas son de 10, 20 y 30 minutos caminando; el ciclista llega en 10 minutos tan lejos como se camina en 20 (p. 20). La figura muestra 10 mins en bicicleta a los parques (inconsistencia 1): si la pregunta es sobre el texto, 20; si es sobre la figura, 10.
14. Lo que importa no es qué tan rápido se mueven las personas sino cuántas cosas pueden alcanzar; lo que se mide en lugar de velocidad y congestión es el acceso (p. 20).

Primal frente a dual
15. Primal: opportunity-denominated. Dual: time- o cost-denominated (p. 45). Primales, amplitud de oportunidades; duales, costo de llegar a un conjunto específico.
16. Tres medidas primales: cumulative, weighted cumulative y competitive. Dos tipos de dual: single y multiple opportunity.
17. Hansen (1959): accessibility como "the potential of opportunities for interaction"; Carey (1867) fue la descripción temprana del potencial. Usos de la Ec. 3.1: empleos (Linneker y Spence 1992), servicios minoristas (Guy 1983), otras personas (Patton y Clark 1970). No intercambiar autores.
18. Términos de la Ec. 3.1: A_i acceso desde i; O_j oportunidades en el destino j; C_ij costo de viajar de i a j; f(C_ij) función de impedancia.

Acumulada
19. Impedancia binaria: 1 si C_ij ≤ t, si no 0 (Ec. 3.2). Ventajas: pocos datos, comprensible para juntas no expertas, significado consistente entre tiempos y lugares.
20. Desventajas: edge effects (ejemplo 44 y 46 minutos con un corte de 45), el corte afecta el ranking (Pereira 2019) y no hay un estándar del número correcto de oportunidades. El texto añade que en la mayoría de los casos prácticos los edge effects son menores y que se mitiga con varios umbrales.
21. Umbrales de ejemplo: 5, 10, ..., 60 minutos (nota 16); para viajes al trabajo, 15, 30, 45 y 60.

Ponderada
22. También se llama gravity; las primeras funciones se basaron en la ley de gravedad de Newton (atracción decrece con el cuadrado de la distancia). Nombre histórico: distance decay; hoy, impedance.
23. Requisito de la impedancia: decreciente (más exacto, no creciente, nota 21). Forma más común: exponencial negativa, e^(β C_ij) con β < 0 (Ec. 3.3).
24. Tiempo cero, peso 1: effective opportunities; conviene reescalar a 0-100 para comparar.
25. Desventajas: elegir función y parámetros (β varía entre contextos), menos interpretable, no transferible entre ciudades ni años. Opciones de calibración: tomar β del strategic planning model (por propósito, modo, hora), método simplificado con tiempos de viaje medianos (Merlin 2020), ajustar un modelo de elección de destino con la matriz origen-destino (Papa y Coppola 2012), tomar de una región similar (McArthur et al. 2011); si no, usar acumulada.
26. Tabla 3.1: ocho funciones además de la acumulada; † observed trips (Reggiani et al. 2011); ⊕ best model fit (Feldman et al. 2012; Wu et al. 2019). La exponencial: β = −0,008† y −0,054⊕. Power: α = −1,835†. Generalized Exp.: α = 1,8, β = −0,002. Tanner: α = −0,63, β = −0,5. Log-normal: indefinida en 0.
27. Nota 31: tanto la acumulada como la ponderada suponen que cada destino de un tipo es fungible y ofrece el mismo atractivo.
28. Ventaja de la ponderada: 31 minutos se valora más que 59, y 61 es solo marginalmente peor que 59.

Competitiva
29. Se usa cuando las oportunidades son rivales (empleos, camas de hospital); parques rara vez llenos no lo requieren (ejemplo de Nueva York).
30. Tres pasos: A_j a la demanda (Ec. 3.4), g(O_j) = O_j / A_j (Ec. 3.5) y A_i^g = Σ g(O_j) f(C_ij) (Ec. 3.6). Adaptado de Shen (1998).
31. Con oferta y demanda balanceadas, el promedio es exactamente 1,0; mayor que 1,0, acceso superior; menor, inferior (Allen y Farber 2017). Mejora el balance empleo-trabajador (Cervero 1989; 1996) porque no se limita a fronteras jurisdiccionales.
32. Desventajas: más cálculo; es una razón, difícil de interpretar; lugares con muchas oportunidades y alta demanda frente a pocas y mínima demanda dan razones similares (Knox 1978).
33. Cierre de 3.1.3: si las simples dan la misma orientación de política, preferir las simples.
34. Evidencia a favor para empleo (Shen 1998), en especial de menores ingresos (Merlin y Hu 2017a).

Dual
35. Pint-of-milk test: umbral de 1 oportunidad, tiempo a la tienda más cercana, aprobada si es menos de 10 minutos caminando. Ec. 3.7: mínimo de C_ij entre destinos con O_j > 0.
36. Múltiples oportunidades: la isocrona se expande hasta cubrir Ω; el tiempo de esa isocrona es la medida. En la primal, el tiempo es fijo y se cuentan oportunidades.
37. Ecs. 3.8 a 3.11: argmin sobre Q_ij, restricción Σ O_j Q_ij ≥ Ω, Q_ij ∈ {0, 1}; la notación es A'_i, Ω y Q̂_ij (matriz de incidencia). El algoritmo de la Fig. 3.2 ordena C_i de menor a mayor y reordena O igual; ω_i acumula; salida A'_i = max(A'_i, C_ik).
38. Relación primal-dual (Breheny 1978): A oportunidades en t minutos corresponde a t minutos para A oportunidades.
39. Ventajas de la dual: intuitiva, escala en minutos comparable entre ciudades, costo en tiempo de tareas (compras, dentista), extensible a lo digital. Desventajas: umbral mayor que 1 arbitrario, poco consenso del mínimo de oportunidades, el tiempo solo puede no reflejar preferencias (Burns y Warren 1995), cálculo menos directo y campo de investigación activa.

Figura 3.3
40. Minneapolis-St. Paul, travelsheds en transporte público a las 8 AM, de 10 a 60 minutos, bloque censal de origen 270531261003046, fuente Accessibility Observatory (2017).

## Preguntas modelo para el banco

Formato: enunciado, opciones cuando aplica, y la respuesta entre paréntesis con la página. (V/F) marca verdadero o falso.

1. ¿Qué busca el transporte según el Manual? (Conectar a las personas con bienes, servicios y actividades; p. 15, contexto.)
2. (V/F) Para el Manual, access y accessibility se usan indistintamente. (Verdadero; nota 1, p. 15.)
3. ¿Cómo describe el Manual el cambio de enfoque? (De una planificación orientada a la movilidad a una orientada al acceso; p. 15, contexto.)
4. ¿Qué es access management? (Regular la entrada a calles locales y accesos desde vías mayores; nota 2, p. 15.)
5. ¿Qué sugiere el Manual sobre su estructura de lectura? (Es no lineal, como un hipertexto, y no hace falta leerlo en secuencia; p. 16.)
6. ¿Dónde lista el Manual recursos adicionales? (Apéndice H; nota 3, p. 16.)
7. ¿Qué es transit según la nota 4? (Equivalente a public transport; p. 16.)
8. ¿Cuántos ejemplos de preguntas que responde el acceso lista la p. 16? (Siete.)
9. ¿En cuánto tiempo deberían poder llegar los bomberos en el ejemplo de la p. 16? (12 minutos.)
10. ¿Qué distancia en tiempo de ambulancia se menciona para el hospital? (30 minutos; p. 16.)
11. ¿Qué dice el Manual del movimiento frente al acceso? (El acceso ve el movimiento como un medio, no como un fin; p. 16.)
12. ¿Cuál es el fin según el Manual? (La capacidad de participar en la actividad que el viajero busca; p. 16.)
13. ¿Cómo define el Manual mobility? (El movimiento de personas y bienes de aquí a allá: cuánto puede alguien recorrer en un tiempo dado; p. 17.)
14. ¿Cómo define el Manual access en la sección 1.1? (Qué lugares puede alcanzar alguien en ese tiempo; cuántos bienes, servicios, destinos o interacciones sociales; p. 17.)
15. ¿Qué es el Green Book? (A Policy on the Geometric Design of Streets and Highways, de AASHTO, 2018; p. 17.)
16. ¿Qué dos funciones de la vía usa AASHTO? (Mobility y access; p. 17.)
17. (V/F) Según AASHTO, las arterias deben tener bajo acceso y alta movilidad. (Verdadero; p. 17.)
18. (V/F) Según el Manual, el uso del suelo es lo central en la definición de acceso de AASHTO. (Falso: para AASHTO no importa el uso del suelo, solo que un conductor pueda estacionar; p. 17.)
19. ¿Qué otra confusión señala el Manual con el término access? (La de acceder al propio sistema de transporte, por ejemplo vivir a menos de 10 minutos de una parada; p. 17.)
20. ¿Qué velocidad promedio reporta el Mobility Report de NYC DOT 2018 para el tráfico de Midtown Manhattan? (Menos de 8 km/h, 5 mph; p. 17.)
21. ¿Qué caso representa alto acceso y relativamente baja movilidad? (Midtown Manhattan; p. 17.)
22. ¿Cuántas pizzerías tiene Nueva York según el texto y cuántas Laramie? (Más de 350 y menos de una docena; p. 17.)
23. ¿Qué ilustra Laramie, Wyoming? (Mucha distancia cubierta en media hora pero pocos destinos alcanzables; p. 17.)
24. ¿Qué tres sistemas interactúan con Access en la Fig. 1.1? (Redes de transporte, Speed; uso del suelo y demanda de viaje, Activity; sistema financiero, Money; p. 18.)
25. ¿Qué es el flujo principal del modelo? (Más Activity genera más Money, más Money financia infraestructura y aumenta Speed, mayor Speed aumenta Access y más Access produce más Activity; p. 18.)
26. ¿Qué expresión usa el texto para el lazo positivo principal? ("More begets more"; p. 18.)
27. ¿Qué representa la línea central de Access a Money? (Captura de valor del suelo: la gente paga un premio por ubicarse donde hay más oportunidades; p. 18.)
28. (V/F) La conexión de Activity a Access es positiva. (Verdadero; más gente, más acceso; p. 19.)
29. ¿Por qué la conexión de Speed a Money es positiva? (Porque la gente paga un premio por viajar más rápido, en teoría por el tiempo que ahorra; p. 19.)
30. ¿Qué evitan los dampeners? (Que las ciudades converjan a un solo punto en el espacio; p. 19.)
31. ¿Qué representa la conexión negativa de Activity a Speed? (Aglomeración y congestión; p. 19.)
32. ¿Qué representa la conexión negativa de Money a Activity? (Lo que es más caro se consume menos; p. 19.)
33. ¿Qué representa la conexión negativa de Access a Speed? (Las fricciones de ubicarse en un lugar con acceso; p. 19.)
34. ¿Qué ejemplo da el texto para Access a Speed? (Una autopista urbana, aunque no esté congestionada, es más lenta que una rural; p. 19.)
35. ¿Cuántas conexiones positivas y negativas tiene la Fig. 1.1? (Siete positivas y tres negativas; de la figura, p. 18.)
36. ¿Qué mide la Fig. 1.2? (La relación física entre acceso, movimiento y lugar, y el vecindario de 10, 15 o 20 minutos; p. 20.)
37. ¿Qué color representa cada modo en la Fig. 1.2? (Amarillo caminar, verde bicicleta, naranja bus, azul tren, morado automóvil; p. 20.)
38. ¿Qué incluye caminar en la figura? (Viajes en silla de ruedas y con cochecitos; p. 20.)
39. ¿Cuál es la relación D, R y T de la nota 8? (D = R · T; T = D/R; p. 20.)
40. ¿De qué depende la velocidad de viaje y de qué la distancia? (La velocidad, del diseño de la vía y el tráfico; la distancia, de la directness o circuity de la red; p. 20.)
41. ¿Qué más reconoce la movilidad según el texto? (El costo monetario respecto del ingreso y lo que la gente sabe o percibe de la red; p. 20.)
42. ¿Qué mide place? (Ubicación, tipo e intensidad de las actividades disponibles; p. 20.)
43. ¿Qué otros términos usa el texto para el mismo concepto de place? (Land use y destinations; p. 20.)
44. Según el texto de la p. 20, ¿a qué distancia en bicicleta queda el parque regional del ejemplo? (A 20 minutos; la figura lo rotula 10 mins.)
45. ¿Qué indican las líneas discontinuas de la Fig. 1.2? (Isocronas de 10, 20 y 30 minutos caminando; p. 20.)
46. ¿Cuánto llega el ciclista en 10 minutos comparado con caminar? (Tan lejos como se camina en 20 minutos; p. 20.)
47. ¿Qué dice el texto que debe medirse en lugar de velocidad y congestión? (El acceso; p. 20.)
48. (V/F) Según la p. 20, lo que importa es qué tan rápido se mueve la gente. (Falso: lo que importa es cuántas cosas pueden alcanzar.)
49. ¿Cómo se agrupan las medidas de accesibilidad en el capítulo 3? (Primal y dual; p. 45.)
50. ¿Qué miden las medidas primales? (Cuántas oportunidades se alcanzan en un tiempo o costo dado; opportunity-denominated; p. 45.)
51. ¿Qué miden las duales? (Cuánto tiempo o costo toma alcanzar un conjunto dado de oportunidades; p. 45.)
52. ¿Qué describen a grandes rasgos las primales y las duales? (Primales, la amplitud de oportunidades; duales, el costo de viajar a un conjunto específico; p. 45.)
53. ¿Quién describió tempranamente el potencial u oportunidad de interacción? (Carey, 1867, Principles of Social Science; p. 46.)
54. ¿Cómo definió Hansen la accesibilidad? (Como el potencial de oportunidades para la interacción; 1959; p. 46.)
55. Escriba la ecuación de Hansen. (A_i = Σ_j O_j f(C_ij); p. 46.)
56. ¿Qué significan O_j y C_ij? (Oportunidades en el destino j y costo de viaje de i a j; p. 46.)
57. ¿Para qué se ha usado la ecuación de Hansen? (Empleos, servicios minoristas y otras personas; p. 46.)
58. ¿Qué es un travelshed? (El área encerrada por una isocrona, cuyo límite es un tiempo de viaje dado desde el origen; nota 10, p. 46.)
59. ¿Cuál es la impedancia de una medida acumulada? (Binaria: 1 si C_ij ≤ t, si no 0; Ec. 3.2, p. 47.)
60. Nombre dos ventajas de la medida de oportunidades acumuladas. (Pocos datos; la entienden los no especialistas; significado consistente para comparar; p. 47.)
61. ¿Qué es un edge effect? (Un gran grupo de destinos justo después del corte que cambia el resultado; p. 47.)
62. En el ejemplo del texto, ¿qué lugares tendrían más acceso con un corte de 45 minutos? (Los que están a 44 minutos del grupo de destinos frente a los de 46; p. 47.)
63. ¿Cómo se mitiga la arbitrariedad del corte? (Examinando un rango de umbrales; p. 47.)
64. ¿Qué umbrales típicos se anclan para viajes al trabajo? (15, 30, 45 y 60 minutos; nota 16, p. 47.)
65. (V/F) Existe un estándar claro del número correcto de oportunidades accesibles. (Falso; p. 47.)
66. ¿Cómo se define la medida ponderada? (Descuenta las oportunidades según su distancia, tiempo o costo; p. 48.)
67. ¿Con qué nombre histórico se conocen las medidas ponderadas y por qué? (Gravity-type; las primeras funciones se basaron en la ley de gravedad de Newton; nota 18, p. 48.)
68. ¿Qué requisito debe cumplir la impedancia? (Ser decreciente, o más exactamente no creciente, respecto del tiempo; nota 21, p. 48.)
69. ¿Cuál es la función de impedancia más usada? (Exponencial negativa, e^(β C_ij), con β < 0; Ec. 3.3, p. 48.)
70. ¿Qué son las effective opportunities? (El equivalente de cierto número de oportunidades justo en la puerta, con peso 1 en tiempo cero; p. 49.)
71. ¿Qué rango se sugiere para reescalar? (0 a 100; p. 49, Geurs y Van Wee 2004.)
72. ¿Qué valores típicos de β da la Tabla 3.1 para la exponencial? (−0,008 de observed trips y −0,054 de best model fit; p. 49.)
73. ¿Qué parámetros trae la función Generalized Exp. en la Tabla 3.1? (α = 1,8 y β = −0,002; p. 49.)
74. ¿Qué indica el símbolo † y el ⊕ en la Tabla 3.1? (†, observed trips, Reggiani et al. 2011; ⊕, best model fit, Feldman et al. 2012 y Wu et al. 2019; p. 49.)
75. ¿Cómo es la función logística y qué significa 0.5*? (Curva en S invertida con punto de inflexión t_i; f = 0,5 cuando C_ij = t_i; p. 49.)
76. ¿Cuál es la ventaja de la medida ponderada? (Considera todo el rango de tiempos; p. 49.)
77. ¿Qué dificultad principal tiene la medida ponderada? (Elegir la función de impedancia y estimar sus parámetros; p. 50.)
78. ¿De dónde puede tomarse β si hay un modelo estratégico? (Del componente de elección de destino o distribución de viajes; p. 50.)
79. ¿Qué método simplificado se propone para calibrar β? (Con tiempos de viaje medianos observados por propósito, modo o población; Merlin 2020; p. 50.)
80. (V/F) Las medidas ponderadas son transferibles entre ciudades y años. (Falso; p. 50.)
81. ¿Qué suponen las acumuladas y las ponderadas de los destinos de un tipo? (Que son fungibles y ofrecen el mismo atractivo; nota 31, p. 50.)
82. ¿Qué significa que una oportunidad sea rival? (Que si una persona la ocupa no queda disponible para otra; p. 51.)
83. ¿Qué ejemplo usa el texto para contrastar parques y camas de hospital? (Los parques rara vez están llenos; las camas hay que medirlas respecto de la población; p. 51.)
84. ¿En qué se basa el acceso competitivo? (Descuenta cada oportunidad por la demanda que tiene acceso a ella; p. 51.)
85. ¿De quién se adapta la formulación de las Ecs. 3.4 a 3.6? (Shen 1998; nota 34, p. 51.)
86. ¿Qué calcula la Ec. 3.4? (El acceso en el destino a la demanda: A_j = Σ_i D_i f(C_ji); p. 51.)
87. ¿Qué calcula la Ec. 3.5? (El descuento por competencia g(O_j) = O_j / A_j; p. 52.)
88. ¿Qué calcula la Ec. 3.6? (El acceso competitivo A_i^g = Σ_j g(O_j) f(C_ij); p. 52.)
89. ¿Qué pasa con el promedio de acceso competitivo si oferta y demanda están balanceadas? (Es exactamente 1,0; p. 52.)
90. ¿Qué significa un acceso competitivo mayor que 1,0? (Acceso superior; menor que 1,0, inferior; nota 36, p. 52.)
91. ¿Qué mejora el acceso competitivo respecto del balance empleo-trabajador? (No se limita a fronteras jurisdiccionales; nota 36, p. 52.)
92. Nombre dos desventajas del acceso competitivo. (Más cálculo y mayor dificultad de interpretación por ser una razón; también lugares con muchas oportunidades y alta demanda dan razones parecidas a otros con pocas y baja demanda; p. 52.)
93. ¿Qué recomienda el texto si las medidas simples dan la misma orientación de política? (Preferir las simples; p. 52.)
94. ¿Cómo se denomina una medida dual? (Por el tiempo requerido para alcanzar un número dado de oportunidades; p. 53.)
95. ¿Qué es el pint-of-milk test? (Si se puede comprar un litro de leche a menos de 10 minutos caminando desde la casa; p. 53.)
96. ¿Cuál es el umbral de oportunidades en el pint-of-milk test? (1; p. 53.)
97. ¿Qué calcula la Ec. 3.7? (El mínimo de C_ij para todo j con O_j > 0; p. 53.)
98. ¿Qué cambia entre el acceso primal y el dual en cuanto a las isocronas? (En el primal el tamaño es fijo y se cuentan oportunidades; en el dual la isocrona se expande hasta cubrir un umbral; pp. 53-54.)
99. ¿Qué es Ω en la formulación dual? (El umbral de oportunidades; p. 54.)
100. ¿Qué restricción impone la Ec. 3.10? (Σ_j O_j Q_ij ≥ Ω; p. 54.)
101. ¿Qué valores toma Q_ij? (0 o 1; Ec. 3.11, p. 54.)
102. ¿Cómo deben estar ordenados los tiempos C_i en el algoritmo? (De menor a mayor, de las ubicaciones más cercanas a las más lejanas; p. 54.)
103. ¿Qué es ω_i? (Una variable temporal con los destinos acumulados en la iteración k; p. 55.)
104. ¿Qué actualiza el algoritmo en cada iteración? (ω_i ← ω_i + O_k y A'_i ← max(A'_i, C_ik); Fig. 3.2, p. 55.)
105. ¿Dónde está el script en R para calcular el acceso dual? (Apéndice E; p. 55.)
106. ¿Qué relación hay entre las medidas primal y dual? (Con medición suficientemente precisa, A oportunidades en t minutos corresponde a t minutos para A oportunidades; Breheny 1978, p. 55.)
107. Nombre dos ventajas de la medida dual. (Es intuitiva y se alinea con la percepción del público; facilita comparar entre ciudades; se cuantifica como el costo en tiempo de tareas; pp. 55-56.)
108. ¿Por qué es arbitrario fijar un umbral mayor que 1? (Hay poco consenso sobre el mínimo de oportunidades para la plena participación; p. 56.)
109. ¿Por qué el tiempo solo puede no reflejar la preferencia? (Porque el lugar principal de compras no tiene por qué ser el más cercano a casa; Burns y Warren 1995, p. 56.)
110. (V/F) Las buenas prácticas de las medidas duales están más establecidas que las de las primales. (Falso; p. 56.)
111. ¿Qué muestra la Fig. 3.3? (Travelsheds en transporte público a las 8 AM en Minneapolis-St. Paul, de 10 a 60 minutos, para un bloque censal de origen; fuente Accessibility Observatory 2017; p. 57.)

Preguntas sobre inconsistencias (para saber qué responder según el texto o la figura):
112. ¿Qué dice la Tabla 3.1 sobre f en C_ij = 0 para Power (Gravity) y Tanner? (0; p. 49.)
113. En la Fig. 3.1, ¿qué función aparece en la leyenda y no en la Tabla 3.1? (Gaussian y Step; pp. 48-49.)
114. ¿Cuál es el criterio de la Ec. 3.10 y cuál el del diagrama de la Fig. 3.2? (La ecuación pide Σ ≥ Ω; el diagrama sigue mientras ω_i + O_k ≤ Ω; pp. 54-55.)
