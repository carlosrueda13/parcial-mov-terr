# Arquitectura propuesta

Estado: decisiones tomadas por Carlos el 10-nov-2026: VM en OCI, videos con Remotion, parcial el 21-nov-2026.
Quedan por confirmar el dispositivo principal de estudio y los detalles de cuenta en OCI y Cloudflare.
La prioridad es que el contenido de estudio esté bien hecho; la infraestructura debe costar lo menos posible
en tiempo y mantenimiento.

Plazo real: el parcial es el 21 de noviembre de 2026, 11 días después de esta decisión. La plataforma debe
estar usable pronto para que sirva de algo; por eso se construye primero un mínimo (importar contenido, reproducir
audio, quiz con retroalimentación y simulacro) y el resto se añade solo si hay tiempo.

## Resumen

| Capa | Propuesta | Costo | Alternativa |
|---|---|---|---|
| Frontend | Cloudflare Pages, desplegado desde este repositorio | Gratis | GitHub Pages |
| Backend | Contenedor Docker (API + base de datos + proxy HTTPS) en una VM de OCI | Prueba de 300 USD / Always Free | Workers + D1 + R2 sin VM |
| Medios | Disco de la VM o almacenamiento de objetos | Incluido | R2 |
| Contenido | JSON y Markdown versionados en el repositorio, importados por la API | Gratis | |
| Video | Remotion (React), renderizado en el entorno de desarrollo, publicado como archivo | Gratis | |
| Audio | NotebookLM (lo genera Carlos con los prompts de `prompts/notebooklm/`) | Gratis | |

## Frontend

- Cloudflare Pages. Plan gratuito: ancho de banda ilimitado, 500 builds por mes, 1 build simultáneo, 100 dominios
  personalizados por proyecto. Las funciones de Pages se cuentan contra el plan gratuito de Workers
  (100.000 solicitudes por día). Fuente: <https://pages.cloudflare.com/> y
  <https://temps.sh/blog/cloudflare-pages-free-tier-limits-2026>.
- El despliegue es por git: cada push a `main` genera un build. Con unos pocos cambios al día quedamos muy por
  debajo de 500 builds.
- El frontend es la implementación en código del diseño aprobado (canvas de 10 tableros). Pensado para móvil
  como dispositivo principal de escucha y para escritorio como dispositivo de práctica; el dispositivo
  principal de Carlos está por confirmar.

## Backend

Opción A, con VM en OCI (elegida por Carlos):

- Docker Compose con tres servicios: API (TypeScript; Fastify o NestJS), base de datos (SQLite o Postgres) y Caddy
  para HTTPS automático.
- SQLite es suficiente para un usuario y 3 semanas, y evita operar un servidor de base de datos. Postgres solo si
  se prevé más de un usuario.
- Los audios y videos se sirven desde disco con rangos HTTP (necesario para adelantar y retomar un audio).
- Despliegue por pull: la VM ejecuta `git pull && docker compose up -d --build`, a mano o con un temporizador.
  El entorno de desarrollo de Claude no tiene SSH directo a la VM, así que el despliegue debe iniciarse desde la VM
  o desde un workflow de GitHub Actions.

Opción B, sin VM (alternativa honesta):

- Cloudflare Workers + D1 + R2. No hay servidor que mantener ni parchear, y el costo de ancho de banda es cero
  en Pages. Es más simple de operar para 3 semanas, a costa de reescribir la API para Workers.
- Plan de respaldo: si el registro en OCI falla o la VM no se puede crear a tiempo, pasar a la opción B sin perder
  el contenido, que vive en el repositorio.

## Proveedor de VM

Decisión: OCI (Oracle Cloud). La información de AWS se conserva abajo solo como referencia; no se usará.

AWS, plan gratuito (credit-based), descartado por decisión de Carlos:

- Los clientes nuevos reciben 100 USD en créditos al registrarse y pueden ganar hasta 100 USD más. El plan
  gratuito dura 6 meses o hasta agotar los créditos, lo que ocurra primero. Cuando termina, la cuenta se cierra.
  Fuentes: <https://aws.amazon.com/start-here/> y <https://aws.amazon.com/free/free-tier-faqs/>.
- Solo aplica a clientes nuevos: quien ya tuvo una cuenta de AWS no es elegible. Si Carlos tuvo alguna, esta
  opción no está disponible.
- Alcanza de sobra para 3 semanas con una instancia pequeña, pero hay que fijar una alerta de presupuesto y
  cerrar la cuenta o apagar la VM al terminar.

OCI (Oracle Cloud):

- Prueba de 300 USD válida por 30 días, más servicios Always Free. Fuente: <https://www.oracle.com/cloud/free/>.
- Los límites Always Free de Ampere A1 aparecen con valores distintos según la fuente: la página de Oracle lista
  hasta 4 OCPU y 24 GB, y un artículo de 2026 informa una reducción a 2 OCPU y 12 GB desde junio de 2026. Verificar al
  registrarse. Fuentes: <https://developer.oracle.com/free.html> y
  <https://fullmetalbrackets.com/blog/oci-free-tier-breakdown>.
- Riesgo conocido: en muchas regiones es difícil aprovisionar una instancia Ampere A1 por falta de capacidad
  ("out of capacity"). Fuente: <https://selfhost.it.com/blog/oci-free-tier-breakdown>.
- Las cuentas inactivas 30 días o más pueden suspenderse (misma página de Oracle).

Consecuencias para OCI:

- Con la prueba de 300 USD se pueden crear formas normales (x86) sin depender de la capacidad Always Free de
  Ampere A1, así que conviene elegir una forma x86 pequeña en lugar de insistir en A1.
- La prueba dura 30 días y el parcial es en 11, así que alcanza. Después de la prueba la VM debe apagarse o
  migrarse a Always Free si se quiere conservar.
- Elegir la región al registrarse (no se puede cambiar después) y fijar una alerta de presupuesto.
- Si el registro o la creación de la VM fallan, usar la opción B.

## Modelo de datos (borrador)

- `lectura` (semana, autor, año, páginas obligatorias, estado)
- `ficha` (lectura, bloques)
- `pregunta` (lectura, tipo, enunciado, opciones, respuesta, trampa, dificultad, referencia de página)
- `boleto` (lectura, concepto, contraste)
- `frase_trampa` (lectura, afirmación, verdadera/falsa, palabra clave)
- `par_senales` (conceptos A y B, regla de diferencia)
- `simulacro` (alcance, preguntas, duración)
- `intento` (simulacro, respuestas, tiempo)
- `progreso` (pregunta, aciertos, última vez, tipo de trampa fallada)

## Qué se versiona y qué no

- Sí: fichas, bancos de preguntas, prompts, esquemas, código y diseño.
- No: PDFs de las lecturas, audios, videos, bases de datos y variables de entorno (ver `.gitignore`).

## Cuentas y accesos que debe crear Carlos

- Repositorio en GitHub: ya creado (`carlosrueda13/parcial-mov-terr`).
- Cuenta de Cloudflare (frontend).
- Cuenta de OCI (VM) para la opción A. Requiere verificación con tarjeta; eso lo hace Carlos directamente.
- Ninguna contraseña ni clave se comparte por chat ni se guarda en el repositorio.
