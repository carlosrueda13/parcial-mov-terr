# Repaso del parcial de Movilidad y Territorio

El [programa](PROGRAMA-LECTURAS.md) fija las lecturas obligatorias hasta la semana 8. Esta guía usa 13 archivos de transcripción correspondientes a 11 fechas de clase. Las dos partes del 27 de octubre se leen juntas y para el 3 de noviembre se usa la versión más extensa. Las capturas del control sobre Milán permiten practicar el formato de pregunta y el nivel de precisión. El artículo de Milán se trabajó en clase y su carácter evaluable para este parcial requiere confirmación en el aula.

## Respuestas de las dos capturas

| Pregunta | Respuesta sustentada | Qué cambia la respuesta |
| --- | --- | --- |
| 1. Cinco afirmaciones, en orden | **F · V · F · V · V** | Los tiempos del transporte privado se relacionan principalmente con vivienda reciente y con la aparición de nuevas pautas de movilidad. La dispersión reduce la eficiencia, la competitividad y la cuota del transporte público. El impacto de la movilidad es **mayor** en desarrollos dispersos, de baja densidad, recientes o de especialización residencial. La última afirmación se refiere al suelo consumido **por vivienda**. |
| 2. Tipología que falta en la clasificación | **B. Revitalización urbana** | Las cinco categorías son relleno, extensión contigua, desarrollo lineal, dispersión (*sprawl*) y grandes proyectos. La opción «Expansión» es imprecisa si se lee sola. La clase la usa para el tipo disperso y esa lectura hace coherentes las opciones. |
| 3. Idea que sustenta el índice | **C. La demanda de movilidad es un componente importante del impacto ambiental del desarrollo urbano** | La marca visible estaba en B. El artículo cuantifica por separado el consumo de suelo y el impacto de la movilidad. El segundo se construye ponderando viajes al trabajo por **modo y duración**, por municipio de origen. |

En la primera afirmación hay dos cambios que la vuelven falsa. El resumen da un peso mayor a la urbanización reciente que al tamaño o la densidad, y vincula el hallazgo con pautas que difieren de las del pasado. La cuarta y la quinta pueden ser verdaderas a la vez. La cuarta compara tipos de expansión y la quinta compara el consumo unitario de suelo entre momentos. [Camagni, Gibelli y Rigamonti, pp. 199, 204, 206–207 y 213–215](https://blog.richmond.edu/roadandrail/files/2012/02/roadurban2.pdf).

## Milán en cuatro distinciones

| Distinción | Cómo responder |
| --- | --- |
| Relleno, extensión y dispersión | El relleno ocupa vacíos dentro de la huella. La extensión crece justo en el borde de esa huella. La dispersión genera fragmentos separados. El desarrollo lineal sigue ejes y un gran proyecto implica una actuación de tamaño considerable e independiente del tejido existente. |
| Suelo por vivienda e impacto de movilidad | Una tipología puede mostrar un resultado favorable en suelo por vivienda y uno desfavorable en movilidad. Los grandes proyectos ilustran esa diferencia en el artículo. |
| Densidad bruta y neta | En esta publicación, la bruta divide los habitantes entre toda el área municipal y la neta entre el área construida. Ambas se expresan en habitantes por km². El denominador depende de la definición del autor. |
| Empleos y residentes | Empleos localizados en el municipio divididos entre habitantes residentes. Por ejemplo, 30.000 empleos y 60.000 residentes dan 0,5 empleos por residente. En el modelo, una relación más alta se asocia con menor impacto de movilidad, manteniendo las demás variables constantes. |

En la tabla 2, la densidad neta y la razón empleos/residentes entran en logaritmos, con coeficientes negativos en las dos estimaciones. El índice dependiente está en nivel. Con un coeficiente de −0,079 para densidad neta, duplicarla cambia la predicción en $-0{,}079\ln 2\approx -0{,}055$ unidades del índice. Con un coeficiente de −0,073 para empleos/residentes, aumentar esa razón un 1 % cambia la predicción en $-0{,}073\ln 1{,}01\approx -0{,}00073$ unidades. En ambos cálculos las demás variables se mantienen fijas. [Camagni et al., tabla 2, sección 3.3.2 y apéndice A](https://blog.richmond.edu/roadandrail/files/2012/02/roadurban2.pdf).

## Hansen, Fernández y centralidades sociales

En una formulación habitual de Hansen, $A_i=\sum_j O_j f(c_{ij})$. El índice suma las oportunidades $O_j$ de cada destino y las pondera por una función de la impedancia desde el origen $i$. Si se escribe $f(c)=e^{-\beta c}$, con $\beta>0$, el peso cae con el costo. Si se escribe $f(c)=e^{bc}$, el mismo decaimiento exige $b<0$. Primero se identifica la ecuación y luego se interpreta el signo.

Fernández estimó coeficientes por zona para viajes de trabajo en Bogotá. Un resultado débil o de signo contrario al decaimiento esperado invita a revisar el ajuste y el contexto. La tesis discute que un viajero cautivo puede sostener desplazamientos largos por la obligación de llegar al empleo y por la falta de alternativas. Los flujos de la matriz origen–destino son viajes observados y pueden coexistir con accesibilidad baja. El capítulo 2 amplía el análisis a trabajo, estudio, salud y recreación y cultura. Examina, entre otras condiciones, el tiempo, la espera, el acceso, las etapas, los sobrecostos y la experiencia del viaje. [Fernández, caps. 1–2, pp. 17–50](../content/semana-08/fernandez-2023-cap1-2/ficha.md).

Para explicar la estimación, la tesis usa los viajes al trabajo de la Encuesta de Movilidad de Bogotá 2019, el tiempo reportado y una regresión por mínimos cuadrados por UTAM. Hay una cautela algebraica en las pp. 20–21. El logaritmo de una suma de aportes se conserva como logaritmo de la suma. La última ecuación impresa, que lo convierte en suma de logaritmos, requiere una especificación distinta. [Fernández, cap. 1, pp. 19–27](../content/semana-08/fernandez-2023-cap1-2/ficha.md).

En la clase del 17 de noviembre se discutió un índice orientado a la desventaja de acceso: **0 indica mejor accesibilidad y 1 peor accesibilidad** en ese ejercicio. La normalización fija la escala y la definición le da sentido al signo. Confirma siempre la dirección antes de interpretar una diferencia entre zonas. Esta convención tampoco determina la escala de Hansen.

Viana Cerqueira et al. aplican un análisis de componentes principales por motivo de viaje en cada ciudad y luego usan LISA sobre los puntajes para detectar agrupamientos espaciales (p. 1562). El **índice de diversidad (DCI)** registra la variedad de grupos y modos que atrae una centralidad. El **índice diferencial (DfCI)** se centra en mujeres, personas mayores, personas de bajos ingresos y modos activos. La figura 5 y su interpretación muestran que varias centralidades periféricas tienen valores altos en ambos índices (pp. 1570–1572). En el juego, **Semana 8 → Viana Cerqueira et al. → Practicar esta lectura** lleva a las preguntas sobre el artículo. [Viana Cerqueira et al., *Urban Studies*, 63(7), 1557–1575](https://doi.org/10.1177/00420980251362648).

## Dónde repasar cada tema en las clases

| Fecha | Qué debes poder hacer | Tramo de la transcripción |
| --- | --- | --- |
| 29 sep. | Explicar por qué Christaller representa áreas de mercado jerárquicas con hexágonos. | 57:17–59:05 |
| 2 oct. | Calcular la renta residual, leer la pendiente de cada cultivo y ubicar el cruce de las rentas ofrecidas. | 06:52–15:40 y 21:57 |
| 9 oct. | Dar un ejemplo en doble vía. Un cambio en el transporte modifica los usos del suelo, y la nueva ocupación modifica la demanda de viajes. | 00:00–02:08 y 43:34 |
| 13 oct. | Leer la función rango–tamaño y distinguir $q$, el tamaño teórico de la primera ciudad, el IPT, el IPU y el ICC. | 01:23:14–01:27:47 |
| 16 oct. | Interpretar el nivel de primacía frente a su cambio en el tiempo y relacionar el poblamiento con la red urbana colombiana. | 04:43–06:18 y 33:22–55:25 |
| 20 oct. | Explicar cómo una estructura con cuatro polos puede coexistir con primacía de Bogotá. Reconocer la metropolización por relaciones funcionales. | 14:42–17:35 y 01:30:42–01:33:58 |
| 27 oct. | Elegir una escala territorial según el fenómeno y explicar cómo el loteo informal puede marcar la trama y el acceso. | Parte 1, 10:21–12:00 y 38:34–41:38. Parte 2, 12:10. |
| 3 nov. | Reconocer las tipologías de Milán, separar suelo y movilidad, e interpretar los coeficientes de la tabla. | Versión completa, 23:56–26:32, 46:36–47:08 y 01:29:00–01:31:36. |
| 6 nov. | Diferenciar funciones básicas, condiciones de acceso y centralidades de diversidad y diferenciales. | 14:03–20:16, 46:06–50:05 y 01:14:04–01:16:27 |
| 10 nov. | Explicar cómo se estima el parámetro de impedancia y qué relación puede tener el resultado con los viajes de usuarios cautivos. | 43:53–47:02 y 01:23:10–01:24:10 |
| 17 nov. | Leer en qué dirección se mueve un índice de accesibilidad y distinguir su escala de análisis de la escala de un estudio metropolitano. | 11:38–13:53 y 23:24–26:17 |

## Simulacro de 12 ítems

Dedica 20 minutos al primer intento. En cada V/F falso, cambia la palabra o fragmento que altera el sentido.

### Selección única

1. Se construyen viviendas sobre lotes vacantes dentro de la huella consolidada. ¿Qué patrón ejemplifica en Milán? **A** Extensión contigua · **B** Dispersión · **C** Relleno · **D** Desarrollo lineal.
2. ¿Qué datos se ponderan conjuntamente para construir el índice de impacto de movilidad de Milán? **A** Densidad y edad de edificios · **B** Modo y duración de los viajes al trabajo · **C** Suelo consumido y número de viviendas · **D** Empleos y residentes.
3. La primera ciudad tiene 8 millones de habitantes, las tres siguientes suman 6 millones y el país tiene 50 millones. ¿Qué valores corresponden al IPT y al ICC, respectivamente? **A** 16 % y 1,33 · **B** 16 % y 0,57 · **C** 75 % y 1,33 · **D** 57,1 % y 0,16.
4. Un área atrae especialmente a personas mayores para trámites y compras, mientras su mezcla de grupos es limitada. ¿Qué indicador responde más directamente a ese patrón? **A** Centralidades de diversidad · **B** IPT · **C** Centralidades diferenciales · **D** Densidad neta.

### Verdadero o falso

5. La densidad neta del estudio de Milán divide la población entre toda el área municipal.
6. Si $f(c)=e^{-\beta c}$ y $\beta>0$, una mayor impedancia reduce el aporte de cada destino con oportunidades positivas.
7. Si el consumo de suelo por vivienda disminuye con el tiempo, el impacto ambiental de la movilidad también debe disminuir.
8. Un municipio puede integrarse funcionalmente con el núcleo metropolitano aunque persistan discontinuidades en la huella construida.
9. En una regresión con el índice en nivel y $\ln(\text{densidad neta})$ como regresor, el coeficiente de la densidad es una elasticidad constante del índice.
10. En el ejercicio del 17 de noviembre, si el índice pasa de 0,3 a 0,6, la accesibilidad empeora según la orientación definida allí.

### Preguntas abiertas

11. Un cultivo tiene $p=100$, $c=40$, $\tau=2$, $x=10$. Calcula la renta ofertada a 10 km, la pendiente y la distancia en la que la renta llega a cero. Si otro cultivo ofrece 450 a 10 km, ¿cuál gana esa localización bajo el modelo?
12. En una zona periférica aparecen muchos viajes al trabajo de más de 90 minutos. Explica qué información aporta la matriz origen–destino, cómo podría interpretarse ese patrón desde la tesis de Fernández y qué dos variables, además del tiempo a bordo, revisarías para evaluar las dificultades de acceso.

### Respuestas razonadas

| Ítem | Respuesta |
| --- | --- |
| 1 | **C.** El rasgo decisivo es que los lotes vacantes se ubican dentro del tejido existente. |
| 2 | **B.** El modo y la duración determinan la ponderación de cada viaje al trabajo. La densidad y la edad del parque construido entran en el análisis explicativo. |
| 3 | **A.** $8/50=0{,}16$ y $8/6\approx1{,}33$. La primera ciudad supera la población combinada de las tres siguientes. [Cuervo y González, cap. 8, pp. 292–294](../content/semana-05/cuervo-gonzalez-cap8/ficha.md). |
| 4 | **C.** La señal es la atracción de un grupo específico. |
| 5 | **F.** Sustituye «toda el área municipal» por «el área construida». |
| 6 | **V.** El término $e^{-\beta c}$ decrece al aumentar $c$ para un $\beta$ positivo. |
| 7 | **F.** Cada resultado usa un indicador diferente. Los grandes proyectos de Milán muestran por qué conviene leerlos por separado. |
| 8 | **V.** Los desplazamientos, el empleo o el abastecimiento pueden integrar áreas físicamente discontinuas. |
| 9 | **F.** El coeficiente mide un cambio del índice en unidades por cambio en el logaritmo del regresor. Para un aumento de 1 % en densidad, el efecto aproximado es $0{,}01\beta$ unidades del índice. |
| 10 | **V.** En ese ejercicio, los valores más altos representan mayor dificultad de acceso. |
| 11 | $r(10)=(100-40-2\cdot10)10=400$. La pendiente es $-\tau x=-20$ unidades de renta por km y la renta se agota a 30 km. A 10 km se localiza el segundo cultivo porque ofrece 450. [Camagni, cap. 2, pp. 53–56](../content/semana-04/camagni-2005-cap2/ficha.md). |
| 12 | La matriz cuenta viajes observados entre orígenes y destinos. La concentración de viajes largos puede ser compatible con dependencia del empleo lejano y con pocas opciones de localización o transporte. Para evaluar el acceso también sirven, por ejemplo, la espera, los transbordos, el sobrecosto o la experiencia de viaje. La existencia de viajes largos por sí sola deja abierta la explicación de cada caso. |
