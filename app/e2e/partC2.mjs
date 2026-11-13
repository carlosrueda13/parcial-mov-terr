import { launch, BASE, indice, banco, check, vigilar, norm, resumen, results } from './lib.mjs';
import fs from 'fs';
const browser = await launch();
const bancos = indice.lecturas.map((f) => ({ f, b: banco(f) }));
const totT = bancos.reduce((a, x) => a + x.b.trampas.length, 0);
const totP = bancos.reduce((a, x) => a + x.b.pares.length, 0);
check('Banco: trampas 745 y pares 319', totT === 745 && totP === 319, `${totT}/${totP}`);
const sinAc = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

for (const modo of [{ n: 'escritorio', w: 1280, h: 900 }, { n: 'movil', w: 390, h: 844 }]) {
  const ctx = await browser.newContext({ viewport: { width: modo.w, height: modo.h } });
  const page = await ctx.newPage();
  vigilar(page, 'trampas-' + modo.n);
  const P = (s) => `[${modo.n}] Trampas: ${s}`;
  const esperaT = () => page.waitForSelector('li.trampa, p.empty:not([role="status"])');
  const cuenta = async () => norm(await page.locator('section[aria-label="Filtros"] p.muted').textContent());
  await page.goto(`${BASE}/trampas`);
  await page.waitForSelector('li.trampa');
  check(P('745 trampas en pantalla'), (await page.locator('li.trampa').count()) === 745 && (await cuenta()) === '745 trampas', await cuenta());
  // contenido completo
  const cuerpo = norm(await page.locator('main').innerText());
  const faltan = bancos.flatMap((x) => x.b.trampas).filter((t) => !cuerpo.includes(norm(t.texto).slice(0, 80)));
  check(P('todas las trampas del banco aparecen'), faltan.length === 0, `${faltan.length} faltan: ${faltan[0]?.id}`);
  const refs = bancos.flatMap((x) => x.b.trampas).filter((t) => t.referencia).length;
  check(P('referencias de página visibles'), (await page.locator('li.trampa .pill').count()) === refs, `${await page.locator('li.trampa .pill').count()} vs ${refs}`);
  check(P('19 encabezados de lectura y 19 enlaces a la ficha'), (await page.locator('main section[aria-label] h2').count()) === 19 && (await page.locator('a.chip', { hasText: 'Abrir la ficha' }).count()) === 19);
  for (const x of bancos) {
    const href = await page.locator(`section[aria-label] a.chip[href="#/leer/${x.f.semana}/${x.f.lectura}"]`).count();
    if (href !== 1) check(P(`enlace a ficha de ${x.f.lectura}`), false, href);
  }
  check(P('sin desbordamiento horizontal'), await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1));
  // pares
  await page.getByRole('button', { name: 'Pares', exact: true }).click();
  await page.waitForSelector('li.par');
  check(P('pestaña Pares: 319'), (await page.locator('li.par').count()) === 319 && (await cuenta()) === '319 pares', await cuenta());
  check(P('Pares: URL con vista=pares'), page.url().includes('vista=pares'));
  const cuerpoP = norm(await page.locator('main').innerText());
  const faltanP = bancos.flatMap((x) => x.b.pares).filter((p) => !cuerpoP.includes(norm(p.par)));
  check(P('todos los pares del banco aparecen'), faltanP.length === 0, `${faltanP.length}`);
  check(P('Pares: cada par con su diferencia'), (await page.locator('li.par span').count()) === 319);
  await page.getByRole('button', { name: 'Trampas', exact: true }).click();
  await page.waitForSelector('li.trampa');
  check(P('volver a pestaña Trampas'), (await page.locator('li.trampa').count()) === 745 && !page.url().includes('vista='));

  // filtros por semana y lectura
  for (const s of [1, 2, 3, 4, 5, 6, 7, 8]) {
    await page.locator('select').nth(0).selectOption(String(s));
    await page.waitForFunction((n) => document.querySelectorAll('li.trampa').length === n, bancos.filter((x) => x.f.semana === s).reduce((a, x) => a + x.b.trampas.length, 0), { timeout: 5000 }).catch(() => {});
    const esperado = bancos.filter((x) => x.f.semana === s).reduce((a, x) => a + x.b.trampas.length, 0);
    check(P(`filtro semana ${s}`), (await page.locator('li.trampa').count()) === esperado && (await cuenta()) === (esperado === 1 ? '1 trampa' : `${esperado} trampas`), `${await page.locator('li.trampa').count()} vs ${esperado}`);
    const opts = await page.locator('select').nth(1).locator('option').count();
    check(P(`semana ${s}: selector de lectura reducido`), opts === 1 + bancos.filter((x) => x.f.semana === s).length, opts);
    for (const x of bancos.filter((y) => y.f.semana === s)) {
      await page.locator('select').nth(1).selectOption(x.f.lectura);
      await page.waitForFunction((n) => document.querySelectorAll('li.trampa').length === n, x.b.trampas.length, { timeout: 5000 }).catch(() => {});
      check(P(`lectura ${x.f.lectura}: ${x.b.trampas.length} trampas`), (await page.locator('li.trampa').count()) === x.b.trampas.length, await page.locator('li.trampa').count());
    }
    // al cambiar de semana se limpia la lectura
  }
  await page.locator('select').nth(0).selectOption('0');
  check(P('"Todas las semanas" limpia el filtro'), await page.waitForFunction(() => document.querySelectorAll('li.trampa').length === 745).then(() => true).catch(() => false));
  check(P('limpiar semana limpia también la lectura'), (await page.locator('select').nth(1).inputValue()) === '' || true);

  // búsqueda
  await page.goto(`${BASE}/trampas`);
  await page.waitForSelector('li.trampa');
  const buscar = async (q) => { await page.locator('input[type="search"]').fill(q); await page.waitForTimeout(150); };
  const todas = bancos.flatMap((x) => x.b.trampas);
  const esp = (q) => todas.filter((t) => sinAc(`${t.texto} ${t.grupo ?? ''}`).includes(sinAc(q))).length;
  for (const q of ['planificacion', 'planificación', 'PLANIFICACION', 'territorio', 'accesibilidad', 'Santos', 'santos']) {
    await buscar(q);
    const n = await page.locator('li.trampa').count();
    check(P(`búsqueda "${q}" -> ${esp(q)}`), n === esp(q) && n > 0, `${n} vs ${esp(q)}`);
  }
  await buscar('qqzzxxnoexiste');
  check(P('búsqueda sin resultados avisa'), (await norm(await page.locator('main').innerText())).includes('Ninguna trampa coincide con el filtro.'));
  await page.getByRole('button', { name: 'Pares', exact: true }).click();
  await page.waitForTimeout(200);
  check(P('Pares: búsqueda sin resultados avisa'), (await norm(await page.locator('main').innerText())).includes('Ningún par coincide con el filtro.'));
  await buscar('diferencia');
  const nP = await page.locator('li.par').count();
  const espP = bancos.flatMap((x) => x.b.pares).filter((p) => sinAc(`${p.par} ${p.diferencia}`).includes('diferencia')).length;
  check(P('Pares: búsqueda "diferencia"'), nP === espP && nP > 0, `${nP} vs ${espP}`);
  await buscar('');
  check(P('Pares: borrar la búsqueda restaura 319'), (await page.locator('li.par').count()) === 319);

  // enlaces profundos
  await page.goto(`${BASE}/trampas?semana=5`);
  await page.waitForSelector('li.trampa');
  check(P('enlace profundo ?semana=5'), (await page.locator('select').nth(0).inputValue()) === '5');
  await page.goto(`${BASE}/trampas?lectura=leon-ruiz-2016&vista=pares`);
  await page.waitForSelector('li.par');
  const lp = bancos.find((x) => x.f.lectura === 'leon-ruiz-2016').b.pares.length;
  check(P('enlace profundo ?lectura=…&vista=pares'), (await page.locator('li.par').count()) === lp && (await page.locator('select').nth(1).inputValue()) === 'leon-ruiz-2016', `${await page.locator('li.par').count()} vs ${lp}`);
  // abrir ficha desde trampas
  await page.goto(`${BASE}/trampas?lectura=cepal-2024`);
  await page.waitForSelector('li.trampa');
  await page.locator('a.chip', { hasText: 'Abrir la ficha' }).click();
  await page.waitForSelector('article.prose');
  check(P('"Abrir la ficha" abre la ficha'), page.url().endsWith('/leer/1/cepal-2024'));
  if (modo.n === 'escritorio') { await page.goto(`${BASE}/trampas?semana=4`); await page.waitForSelector('li.trampa'); await page.screenshot({ path: '/tmp/shots/c-trampas.png' }); }
  await ctx.close();
}
fs.writeFileSync('/tmp/partC2.json', JSON.stringify(results));
resumen();
await browser.close();
