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

Cada script termina con la línea `COMPROBACIONES: N correctas de N`. Las capturas salen en `/tmp/shots`.
