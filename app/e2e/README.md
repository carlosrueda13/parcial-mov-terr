# Pruebas de extremo a extremo

Recorren la app en un navegador real: las 878 preguntas con su respuesta, todas las rutas, botones y secciones, las 19 fichas, trampas y pares, boletos, simulacro (incluido el cronómetro) y la vista móvil.

```
cd app
npm run build
npx vite preview --port 4173 --host 127.0.0.1 &
mkdir -p /tmp/shots
PLAYWRIGHT_PATH=/ruta/a/playwright/index.mjs node e2e/partA.mjs      # 878 preguntas (VIEW=movil para móvil)
node e2e/partB.mjs    # navegación, mapa, zonas, rutas inexistentes, escritorio y móvil
node e2e/partC1.mjs   # fichas
node e2e/partC2.mjs   # trampas y pares
node e2e/partC3.mjs   # boletos
node e2e/partC4.mjs   # simulacro
node e2e/partC5.mjs   # práctica: configuración y persistencia
```

Los scripts anteriores terminan con la línea `COMPROBACIONES: N correctas de N`. Las capturas salen en `/tmp/shots`.

`node e2e/repaso.mjs` comprueba las 100 preguntas en Chromium, la corrección, los reintentos, la persistencia, el simulacro y los filtros móviles. Usa el resultado de `npm run build` directamente y puede ejecutarse sin el servidor de vista previa.

`node e2e/comprension.mjs` comprueba las preguntas de comprensión: opción múltiple con 4 a 6 opciones, bloques V/F, corrección, explicaciones y simulacro. Resultado vigente: 82 de 82.

`PLAYWRIGHT_PATH=/ruta/a/playwright/index.mjs node e2e/figuras.mjs` comprueba los ejercicios de completar y las figuras: visita cada lectura que los tiene, verifica que el esquema se dibuje, los huecos y el banco de términos, que los marcadores numerados coincidan con los huecos, el flujo de Comprobar y la corrección por hueco, los bloques V/F con figura, el simulacro «Estilo del control» y que Boletos no incluya huecos. Resultado vigente: 1073 de 1073, sin errores de consola ni de red.

Nota: `partA`, `partB`, `partC1` a `partC5` y `repaso` tienen cifras fijas del banco anterior (878 preguntas, 745 trampas, 319 pares, 1.197 boletos) y fallan por esas cifras tras añadir las preguntas de comprensión y los cambios de ChatGPT; no se han actualizado.
