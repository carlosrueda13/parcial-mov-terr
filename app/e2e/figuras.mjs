// Preguntas con figura y ejercicios de completar / ubicar: Practicar y Hora pico.
import { BASE, banco, check, indice, launch, norm, resumen, vigilar } from './lib.mjs';

const FIG = ['iim', 'rango', 'vonthunen', 'polese103', 'hoyt', 'costotransporte', 'escalas', 'areamercado'];
const filas = indice.lecturas.filter((f) => (f.completar ?? 0) > 0 || banco(f).preguntas.some((p) => p.figura));
const br = await launch();
const page = await br.newPage({ viewport: { width: 1280, height: 900 } });
vigilar(page, 'figuras');

const todas = filas.flatMap((f) => banco(f).preguntas.filter((p) => ['mcq', 'vfbloque', 'completar'].includes(p.tipo)).map((p) => ({ f, p })));
const conFigura = todas.filter((x) => x.p.figura);
const completar = todas.filter((x) => x.p.tipo === 'completar');
check('El banco tiene ejercicios de completar', completar.length >= 20, String(completar.length));
check('Cada figura declarada existe en el catálogo', conFigura.every((x) => FIG.includes(x.p.figura)));
check('Las ocho figuras se usan al menos una vez', FIG.every((id) => conFigura.some((x) => x.p.figura === id)), FIG.filter((id) => !conFigura.some((x) => x.p.figura === id)).join(','));

let figuras = 0, ubicar = 0, textos = 0;
for (const f of filas) {
  const comp = banco(f).preguntas.filter((p) => ['mcq', 'vfbloque', 'completar'].includes(p.tipo));
  await page.goto(`${BASE}/practica?semana=${f.semana}&lectura=${f.lectura}&n=todas&ir=1`);
  await page.waitForSelector('.pregunta');
  for (let i = 0; i < comp.length; i++) {
    const enun = norm(await page.locator('.pregunta .texto').innerText());
    const item = comp.find((p) => norm(p.enunciado) === enun);
    check(`Practicar muestra una pregunta conocida (${f.lectura} ${i + 1})`, !!item, enun.slice(0, 60));
    if (!item) break;
    const nFig = await page.locator('[data-figura]').count();
    check(`figura mostrada solo si el ítem la declara (${item.id})`, item.figura ? nFig === 1 : nFig === 0, `${nFig}`);
    if (item.figura) {
      figuras++;
      check(`figura correcta (${item.id})`, (await page.locator('[data-figura]').first().getAttribute('data-figura')) === item.figura);
      check(`la figura tiene texto alternativo (${item.id})`, ((await page.locator('[data-figura] svg').first().getAttribute('aria-label')) ?? '').length > 30);
    }
    if (item.tipo === 'completar') {
      const k = item.huecos.length;
      check(`selects = huecos (${item.id})`, (await page.locator('select[data-hueco]').count()) === k, `${await page.locator('select[data-hueco]').count()} vs ${k}`);
      check(`banco de términos completo (${item.id})`, (await page.locator('[aria-label="Banco de términos"] li').count()) === item.banco.length);
      if (item.texto) {
        textos++;
        check(`texto con huecos en línea (${item.id})`, (await page.locator('[data-texto-completar] select[data-hueco]').count()) === k);
        check(`sin texto no hay marcadores sueltos (${item.id})`, (await page.locator('[data-marca]').count()) === 0);
      } else {
        ubicar++;
        check(`un marcador numerado por hueco (${item.id})`, (await page.locator('[data-marca]').count()) === k, `${await page.locator('[data-marca]').count()} vs ${k}`);
        const ids = await page.locator('[data-marca]').evaluateAll((els) => els.map((e) => e.getAttribute('data-marca')));
        check(`los marcadores coinciden con los ids de los huecos (${item.id})`, JSON.stringify(ids.sort()) === JSON.stringify(item.huecos.map((h) => h.id).sort()), ids.join(','));
      }
      check(`Comprobar está deshabilitado al inicio (${item.id})`, await page.getByRole('button', { name: 'Comprobar' }).isDisabled());
      // acierta todos menos el último
      for (let j = 0; j < k; j++) {
        const h = item.huecos[j];
        let v = h.correcta;
        if (j === k - 1) v = (h.correcta + 1) % item.banco.length;
        await page.locator(`select[data-hueco="${h.id}"]`).selectOption(String(v));
        if (j < k - 1) check(`Comprobar sigue deshabilitado con huecos vacíos (${item.id}/${j})`, await page.getByRole('button', { name: 'Comprobar' }).isDisabled());
      }
      check(`Comprobar se habilita con todos los huecos llenos (${item.id})`, await page.getByRole('button', { name: 'Comprobar' }).isEnabled());
      await page.getByRole('button', { name: 'Comprobar' }).click();
      await page.waitForSelector('[role=status]');
      const r = norm(await page.locator('[role=status]').first().innerText());
      check(`puntaje parcial (${item.id})`, r.includes(`${k - 1} de ${k} huecos bien`), r.slice(0, 100));
      const corr = norm(await page.locator('[aria-label="Corrección por hueco"]').innerText());
      check(`corrección con la explicación de cada hueco (${item.id})`, item.huecos.every((h) => corr.includes(norm(h.explicacion).slice(0, 25))));
      check(`corrección dice la respuesta del hueco fallado (${item.id})`, corr.includes(`Respuesta: ${item.banco[item.huecos[k - 1].correcta]}`));
      check(`los selects quedan bloqueados tras comprobar (${item.id})`, await page.locator('select[data-hueco]').first().isDisabled());
    } else if (item.tipo === 'mcq') {
      const textosOpc = await page.locator('button.opt').allInnerTexts();
      check(`opciones mostradas (${item.id})`, textosOpc.length === item.opciones.length);
      await page.locator('button.opt').first().click();
      await page.waitForSelector('[role=status]');
    } else {
      const k = item.afirmaciones.length;
      for (let j = 0; j < k; j++) await page.locator(`button[data-vf="${j}-${item.afirmaciones[j].verdadera ? 'v' : 'f'}"]`).click();
      await page.getByRole('button', { name: 'Comprobar' }).click();
      await page.waitForSelector('[role=status]');
      const r = norm(await page.locator('[role=status]').first().innerText());
      check(`bloque con figura: todo correcto (${item.id})`, r.includes(`${k} de ${k} afirmaciones bien`), r.slice(0, 80));
    }
    await page.getByRole('button', { name: i + 1 < comp.length ? 'Siguiente' : 'Ver resultado', exact: true }).click();
  }
}
check('Se vieron figuras en Practicar', figuras >= 20, String(figuras));
check('Hay ejercicios de ubicar y de completar texto', ubicar >= 8 && textos >= 20, `ubicar=${ubicar} texto=${textos}`);

// ---- Una vista de cada figura (ocultos respetados) ----
await page.goto(`${BASE}/practica?semana=3&lectura=polese-1998-cap2&n=todas&ir=1`);
await page.waitForSelector('.pregunta');

// ---- Hora pico: Estilo del control con completar ----
await page.goto(`${BASE}/simulacro`);
await page.getByRole('button', { name: 'Estilo del control' }).click();
await page.getByRole('button', { name: '30', exact: true }).click();
await page.getByRole('button', { name: 'Empezar el simulacro' }).click();
await page.waitForSelector('.pregunta');
let vistosC = 0, n = 0;
for (let guard = 0; guard < 80; guard++) {
  const nSel = await page.locator('select[data-hueco]').count();
  if (nSel > 0) {
    vistosC++;
    for (let j = 0; j < nSel; j++) await page.locator('select[data-hueco]').nth(j).selectOption('0');
  } else if ((await page.locator('ol[aria-label="Afirmaciones"]').count()) > 0) {
    const k = await page.locator('ol[aria-label="Afirmaciones"] > li').count();
    for (let j = 0; j < k; j++) await page.locator(`button[data-vf="${j}-v"]`).click();
  } else if ((await page.locator('button.opt').count()) > 0) {
    await page.locator('button.opt').first().click();
  }
  n++;
  const sig = page.getByRole('button', { name: 'Siguiente', exact: true });
  if (await sig.isDisabled()) break;
  await sig.click();
}
check('Hora pico: recorre preguntas, incluidos huecos', n >= 10, `n=${n} completar=${vistosC}`);
check('Hora pico: aparece al menos un completar en 30 preguntas', vistosC >= 1, `completar=${vistosC}`);
await page.getByRole('button', { name: 'Entregar', exact: true }).click();
await page.getByRole('button', { name: 'Entregar ahora' }).click();
await page.waitForSelector('text=Revisión');
const bal = norm(await page.locator('main, .page').first().innerText());
check('Hora pico: balance con nota', /\d+ de \d+/.test(bal));
check('Hora pico: la revisión muestra la corrección por hueco', vistosC === 0 || (await page.locator('[aria-label="Corrección por hueco"]').count()) >= 1);

// ---- Boletos no incluye completar ----
await page.goto(`${BASE}/boletos`);
await page.waitForTimeout(300);
check('Boletos no muestra selects de completar', (await page.locator('select[data-hueco]').count()) === 0);

await br.close();
resumen();
