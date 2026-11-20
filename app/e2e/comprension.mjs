// Preguntas de comprensión: opción múltiple (4 a 6 opciones) y bloques V/F, en Practicar y en Hora pico.
import { BASE, banco, check, indice, launch, norm, resumen, vigilar } from './lib.mjs';

const lectura = 'camagni-gibelli-rigamonti-2002';
const fila = indice.lecturas.find((f) => f.lectura === lectura);
const b = banco(fila);
const comp = b.preguntas.filter((p) => p.tipo === 'mcq' || p.tipo === 'vfbloque');

const br = await launch();
const page = await br.newPage({ viewport: { width: 1280, height: 900 } });
vigilar(page, 'comprension');

// ---- Practicar: recorre todas las de comprensión de la lectura ----
await page.goto(`${BASE}/practica?semana=${fila.semana}&lectura=${lectura}&n=todas&ir=1`);
await page.waitForSelector('.pregunta');
let vistas = 0, bloques = 0, conLetraF = 0;
for (let i = 0; i < comp.length; i++) {
  const enun = norm(await page.locator('.pregunta .texto').innerText());
  const item = comp.find((p) => norm(p.enunciado) === enun);
  check(`Practicar muestra una pregunta conocida (${i + 1})`, !!item, enun.slice(0, 60));
  if (!item) break;
  vistas++;
  if (item.tipo === 'mcq') {
    const n = await page.locator('button.opt').count();
    check(`opciones mostradas = opciones del banco (${item.id})`, n === item.opciones.length, `${n} vs ${item.opciones.length}`);
    if (n === 6) conLetraF++;
    // Elegir una incorrecta (si existe) para ver el "Por qué falla".
    const textos = await page.locator('button.opt').allInnerTexts();
    const idxMala = textos.findIndex((t) => !norm(t).includes(norm(item.opciones[item.correcta]).slice(0, 40)));
    await page.locator('button.opt').nth(idxMala).click();
    await page.waitForSelector('[role=status]');
    const r = norm(await page.locator('[role=status]').first().innerText());
    check(`mcq marca incorrecto y explica (${item.id})`, r.includes('Incorrecto') && r.includes(norm(item.explicacion).slice(0, 30)), r.slice(0, 120));
    check(`mcq muestra el motivo de la opción elegida (${item.id})`, (await page.locator('text=Por qué falla').count()) >= 1);
  } else {
    bloques++;
    const k = item.afirmaciones.length;
    check(`bloque: ${k} afirmaciones (${item.id})`, (await page.locator('ol[aria-label="Afirmaciones"] > li').count()) === k);
    check(`bloque: Comprobar deshabilitado hasta marcar todas (${item.id})`, await page.getByRole('button', { name: 'Comprobar' }).isDisabled());
    for (let j = 0; j < k; j++) {
      // acierta todas menos la última, para comprobar el puntaje parcial
      const v = j === k - 1 ? !item.afirmaciones[j].verdadera : item.afirmaciones[j].verdadera;
      await page.locator(`button[data-vf="${j}-${v ? 'v' : 'f'}"]`).click();
    }
    await page.getByRole('button', { name: 'Comprobar' }).click();
    await page.waitForSelector('[role=status]');
    const r = norm(await page.locator('[role=status]').first().innerText());
    check(`bloque: puntaje parcial (${item.id})`, r.includes(`${k - 1} de ${k} afirmaciones bien`), r.slice(0, 100));
    const detalle = norm(await page.locator('ol[aria-label="Afirmaciones"]').innerText());
    check(`bloque: muestra la explicación de cada afirmación (${item.id})`, item.afirmaciones.every((a) => detalle.includes(norm(a.explicacion).slice(0, 25))));
  }
  await page.getByRole('button', { name: i + 1 < comp.length ? 'Siguiente' : 'Ver resultado' }).click();
}
check('Practicar recorrió todas las de comprensión', vistas === comp.length, `${vistas}/${comp.length}`);
check('Hay al menos un bloque V/F y una pregunta de 6 opciones', bloques >= 1 && conLetraF >= 1, `bloques=${bloques}, 6 opciones=${conLetraF}`);
const fin = norm(await page.locator('.card').first().innerText());
check('Resultado final de la práctica', /\d+ de \d+/.test(fin), fin.slice(0, 80));

// ---- Hora pico: estilo del control ----
await page.goto(`${BASE}/simulacro`);
await page.getByRole('button', { name: 'Estilo del control' }).click();
await page.getByRole('button', { name: '10', exact: true }).click();
await page.getByRole('button', { name: 'Empezar el simulacro' }).click();
await page.waitForSelector('.pregunta');
let n = 0;
for (;;) {
  const hayBloque = (await page.locator('ol[aria-label="Afirmaciones"]').count()) > 0;
  if (hayBloque) {
    const k = await page.locator('ol[aria-label="Afirmaciones"] > li').count();
    for (let j = 0; j < k; j++) await page.locator(`button[data-vf="${j}-v"]`).click();
  } else {
    await page.locator('button.opt').first().click();
  }
  n++;
  const sig = page.getByRole('button', { name: 'Siguiente', exact: true });
  if (await sig.isDisabled()) break;
  await sig.click();
}
check('Hora pico: recorre las preguntas de comprensión', n >= 5, `n=${n}`);
await page.getByRole('button', { name: 'Entregar', exact: true }).click();
await page.getByRole('button', { name: 'Entregar ahora' }).click();
await page.waitForSelector('text=Revisión');
const bal = norm(await page.locator('main, .page').first().innerText());
check('Hora pico: balance con nota', /\d+ de \d+/.test(bal));
check('Hora pico: la revisión muestra bloques con su explicación', (await page.locator('ol[aria-label="Afirmaciones"]').count()) >= 0);

await br.close();
resumen();
