import { launch, BASE, ROOT, indice, banco, check, vigilar, norm, resumen, results } from './lib.mjs';
import fs from 'fs';

const browser = await launch();
const lecturasMeta = {};
for (const n of [1,2,3,4,5,6,7,8]) {
  lecturasMeta[n] = JSON.parse(fs.readFileSync(`${ROOT}/content/semana-0${n}/lecturas.json`, 'utf8'));
}
const txt = async (loc) => norm(await loc.first().textContent());
const sinHorizontal = (page) => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1);

const listo = (page) => page.waitForFunction(() => document.querySelector('main h1, main .pregunta') && !document.querySelector('main p.empty[role="status"]'));
const esperarH1 = (page, pref) => page.waitForFunction((p) => (document.querySelector('main h1')?.textContent || '').trim().startsWith(p), pref);
const rutaRe = (r) => new RegExp(r === '/' ? '#/$' : r.replace(/\//g, '\\/') + '$');
async function nueva(ctx, etiqueta, ruta) {
  const page = await ctx.newPage();
  vigilar(page, etiqueta);
  await page.goto(`${BASE}${ruta}`);
  return page;
}

for (const modo of [{ n: 'escritorio', w: 1280, h: 900 }, { n: 'movil', w: 390, h: 844 }]) {
  console.log(`== ${modo.n}`);
  const movil = modo.n === 'movil';
  const ctx = await browser.newContext({ viewport: { width: modo.w, height: modo.h } });
  const P = (s) => `[${modo.n}] ${s}`;

  // ---------- Mapa ----------
  let page = await nueva(ctx, modo.n + ':mapa', '/');
  await page.waitForSelector('h1');
  check(P('Mapa: título'), (await txt(page.locator('h1'))).startsWith('Pinta todo el mapa'));
  check(P('Mapa: insignia de días'), /Parcial en \d+ días?/.test(await txt(page.locator('.badge-days'))), await txt(page.locator('.badge-days')));
  const dias = Number(/(\d+)/.exec(await txt(page.locator('.badge-days')))[1]);
  const esperado = Math.ceil((new Date('2026-11-21T00:00:00-05:00') - Date.now()) / 86400000);
  check(P('Mapa: días restantes calculados bien'), dias === esperado, `${dias} vs ${esperado}`);
  const mapaVisible = page.locator(movil ? '.map-mob svg' : '.map-desk svg');
  const mapaOculto = page.locator(movil ? '.map-desk svg' : '.map-mob svg');
  check(P('Mapa: el mapa correcto es visible'), await mapaVisible.isVisible());
  check(P('Mapa: el otro mapa está oculto'), !(await mapaOculto.isVisible()));
  const zonas = mapaVisible.locator('a');
  check(P('Mapa: 8 zonas clicables'), (await zonas.count()) === 8, await zonas.count());
  for (let s = 1; s <= 8; s++) {
    const a = mapaVisible.locator(`a[href="#/semana/${s}"]`);
    check(P(`Mapa: zona S${s} con nombre accesible`), (await a.getAttribute('aria-label'))?.startsWith(`Semana ${s},`), await a.getAttribute('aria-label'));
    await a.click();
    await page.waitForURL(rutaRe(`/semana/${s}`));
    await esperarH1(page, `Semana ${s}:`);
    const h = await txt(page.locator('h1'));
    check(P(`Mapa: clic en zona S${s} abre Semana ${s}`), h.startsWith(`Semana ${s}:`) && page.url().endsWith(`/semana/${s}`), `${h} ${page.url()}`);
    await page.goBack();
    await page.waitForSelector(movil ? '.map-mob' : '.map-desk');
  }
  // Secciones del mapa
  for (const sec of ['Mapa de las ocho semanas', 'Tu tarjeta de viajero', 'Misión de hoy', 'Lo que más fallas', 'Para entender', 'Para practicar']) {
    check(P(`Mapa: sección "${sec}"`), (await page.locator(`section[aria-label="${sec}"]`).count()) === 1);
  }
  check(P('Mapa: resumen móvil/escritorio presente'), (await page.locator('ul.statsmob').count()) === 1);
  check(P('Mapa: leyenda de 4 elementos'), (await page.locator('ul.legend li').count()) === 4);
  const mision = page.locator('section[aria-label="Misión de hoy"] ol li a');
  check(P('Mapa: misión de hoy con 3 pasos'), (await mision.count()) === 3);
  const hrefsMision = await mision.evaluateAll((a) => a.map((x) => x.getAttribute('href')));
  check(P('Mapa: pasos de misión apuntan a rutas válidas'), hrefsMision.every((h) => /^#\/(leer|trampas|practica|boletos)/.test(h)), hrefsMision.join(' '));
  check(P('Mapa: resumen de preguntas = 878'), (await page.locator('main').textContent()).includes('Hay 878 preguntas en el banco; 878 ya tienen respuesta'));
  // Tarjetas de acceso
  const acc = {
    'Leer las fichas': '#/leer', Practicar: '#/practica', 'Trampas y pares': '#/trampas', Boletos: '#/boletos', 'Hora pico': '#/simulacro',
  };
  for (const [t, h] of Object.entries(acc)) {
    const a = page.locator(`a.acceso:has(h3:text-is("${t}"))`);
    check(P(`Mapa: tarjeta "${t}" enlaza a ${h}`), (await a.getAttribute('href')) === h, await a.getAttribute('href'));
    await a.click();
    await page.waitForURL(rutaRe(h.slice(1)));
    await esperarH1(page, { '#/leer': 'Fichas de lectura', '#/practica': 'Practicar', '#/trampas': 'Trampas y pares', '#/boletos': 'Boletos de repaso', '#/simulacro': 'Hora pico' }[h]);
    check(P(`Mapa: tarjeta "${t}" navega`), page.url().includes(h.slice(1)), page.url());
    await page.goBack();
    await page.waitForSelector(movil ? '.map-mob' : '.map-desk');
  }
  const esc = page.locator('.acceso.off');
  check(P('Mapa: tarjeta Escuchar deshabilitada y rotulada'), (await esc.count()) === 1 && (await esc.getAttribute('aria-disabled')) === 'true' && (await esc.textContent()).includes('Audio pendiente'));
  const tr = await txt(page.locator('a.acceso:has(h3:text-is("Trampas y pares"))'));
  check(P('Mapa: totales de trampas y pares correctos'), tr.includes('745 trampas, 319 pares'), tr);
  check(P('Mapa: sin desbordamiento horizontal'), await sinHorizontal(page));
  await page.screenshot({ path: `/tmp/shots/b-mapa-${modo.n}.png`, fullPage: true });

  // ---------- Navegación principal ----------
  const navSel = movil ? 'nav.bottomnav' : 'nav.nav';
  const otroNav = movil ? 'nav.nav' : 'nav.bottomnav';
  check(P('Nav: el menú correcto es visible'), await page.locator(navSel).isVisible());
  check(P('Nav: el otro menú está oculto'), !(await page.locator(otroNav).isVisible()));
  const items = [['Mapa', '/', 'Pinta todo el mapa'], ['Leer', '/leer', 'Fichas de lectura'], ['Practicar', '/practica', 'Practicar'], ['Boletos', '/boletos', 'Boletos de repaso'], ['Trampas', '/trampas', 'Trampas y pares'], ['Simulacro', '/simulacro', 'Hora pico']];
  check(P('Nav: 6 entradas'), (await page.locator(`${navSel} a`).count()) === 6);
  for (const [t, ruta, h1] of items) {
    await page.locator(`${navSel} a`, { hasText: t }).click();
    await page.waitForURL(rutaRe(ruta));
    await esperarH1(page, h1);
    if (ruta === '/trampas') await page.waitForSelector('li.trampa');
    const h = await txt(page.locator('h1'));
    const activo = await page.locator(`${navSel} a.active`).textContent();
    check(P(`Nav: "${t}" -> ${ruta}`), h.startsWith(h1) && norm(activo) === t && (await page.locator(`${navSel} a[aria-current="page"]`).count()) === 1, `${h} | activo=${norm(activo)}`);
    check(P(`Nav: "${t}" sin desbordamiento horizontal`), await sinHorizontal(page));
    const titulo = await page.title();
    check(P(`Nav: "${t}" actualiza el título del documento`), titulo.endsWith('| Movilidad y Territorio'), titulo);
  }
  // logo vuelve al inicio
  await page.locator('a.brand').click();
  await page.waitForSelector('h1');
  check(P('Logo vuelve al mapa'), page.url().endsWith('#/') || page.url().endsWith('/#/'), page.url());
  check(P('Enlace "Saltar al contenido" existe'), (await page.locator('a.sr[href="#contenido"]').count()) === 1);
  await page.close();

  // ---------- Zonas S1..S8 ----------
  for (let s = 1; s <= 8; s++) {
    const meta = lecturasMeta[s];
    page = await nueva(ctx, `${modo.n}:zona${s}`, `/semana/${s}`);
    await page.waitForSelector('h1');
    check(P(`Zona S${s}: título con el tema`), (await txt(page.locator('h1'))) === `Semana ${s}: ${meta.tema}`, await txt(page.locator('h1')));
    const est = page.locator('button.estacion');
    check(P(`Zona S${s}: ${meta.lecturas.length} estaciones`), (await est.count()) === meta.lecturas.length, await est.count());
    for (let i = 0; i < meta.lecturas.length; i++) {
      const l = meta.lecturas[i];
      const fila = indice.lecturas.find((f) => f.lectura === l.id);
      await est.nth(i).click();
      check(P(`Zona S${s}: estación ${i + 1} queda activa`), (await est.nth(i).getAttribute('aria-pressed')) === 'true');
      const panel = page.locator('section.sign');
      if (!fila) {
        const ptxt = await txt(panel);
        check(P(`Zona S${s}: ${l.id} sin PDF muestra aviso`), ptxt.includes('Falta el PDF de esta lectura'), ptxt.slice(0, 120));
        check(P(`Zona S${s}: ${l.id} muestra "PDF pendiente" en la estación`), (await est.nth(i).textContent()).includes('PDF pendiente'));
        continue;
      }
      const tiles = panel.locator('.tiles > *');
      check(P(`Zona S${s}/${l.id}: 6 estaciones de trabajo`), (await tiles.count()) === 6, await tiles.count());
      const destinos = [
        ['Leer la ficha', `#/leer/${fila.semana}/${fila.lectura}`, true],
        ['Practicar', `#/practica?semana=${fila.semana}&lectura=${fila.lectura}&ir=1`, fila.respondibles > 0],
        ['Boletos', `#/boletos?semana=${fila.semana}&lectura=${fila.lectura}`, true],
        ['Trampas y pares', `#/trampas?lectura=${fila.lectura}`, true],
        ['Verdadero o falso', `#/practica?semana=${fila.semana}&lectura=${fila.lectura}&tipo=vf&n=todas&ir=1`, fila.vf_directas > 0],
        ['Escuchar', null, false],
      ];
      for (const [nombre, href, activo] of destinos) {
        const t = tiles.filter({ hasText: nombre }).first();
        const real = await t.getAttribute('href');
        check(P(`Zona S${s}/${l.id}: "${nombre}" ${activo ? 'habilitado' : 'deshabilitado'}`), activo ? real === href : real === null && (await t.getAttribute('aria-disabled')) === 'true', `${real}`);
      }
      // Navegar por cada tile habilitado y volver
      for (const [nombre, href, activo] of destinos) {
        if (!activo) continue;
        await panel.locator('.tiles a', { hasText: nombre }).first().click();
        await page.waitForSelector('h1, .pregunta, .empty, .leer');
        await page.waitForTimeout(150);
        const url = page.url();
        const cont = await txt(page.locator('main'));
        let ok = url.endsWith(href.slice(1).replace('&ir=1', '')) && cont.length > 50;
        if (nombre === 'Practicar' || nombre === 'Verdadero o falso') ok = ok && (await page.locator('.pregunta').count()) === 1;
        if (nombre === 'Leer la ficha') { await page.waitForSelector('article.prose'); ok = ok && (await txt(page.locator('article.prose'))).length > 500; }
        if (nombre === 'Trampas y pares') { await page.waitForSelector('ul li.trampa'); ok = ok && (await page.locator('li.trampa').count()) === fila.trampas; }
        if (nombre === 'Boletos') { ok = ok && (await page.getByRole('button', { name: 'Empezar el repaso' }).count()) === 1; }
        check(P(`Zona S${s}/${l.id}: "${nombre}" abre su pantalla`), ok, `${url} ${nombre === 'Trampas y pares' ? await page.locator('li.trampa').count() + ' vs ' + fila.trampas : ''}`);
        await page.goBack();
        await page.waitForSelector('button.estacion');
        // goBack reinicia la estación elegida; vuelve a seleccionarla
        await page.locator('button.estacion').nth(i).click();
      }
    }
    const pie = page.locator('.row.g16 a.btn');
    check(P(`Zona S${s}: botones de pie`), (await pie.count()) === 2 && (await pie.nth(0).getAttribute('href')) === `#/practica?semana=${s}&n=todas&ir=1` && (await pie.nth(1).getAttribute('href')) === `#/trampas?semana=${s}`);
    await page.locator('a.back').click();
    await page.waitForSelector(movil ? '.map-mob' : '.map-desk');
    check(P(`Zona S${s}: "Volver al mapa" funciona`), page.url().endsWith('#/') || page.url().endsWith('/#/'));
    await page.goBack();
    await page.waitForSelector('h1');
    check(P(`Zona S${s}: sin desbordamiento horizontal`), await sinHorizontal(page));
    if (s === 4 || s === 8) await page.screenshot({ path: `/tmp/shots/b-zona${s}-${modo.n}.png`, fullPage: true });
    await page.close();
  }

  // ---------- Rutas inexistentes ----------
  page = await nueva(ctx, modo.n + ':404', '/semana/9');
  await page.waitForSelector('main');
  check(P('Semana inexistente muestra aviso'), (await txt(page.locator('main'))).includes('La semana 9 no existe'));
  await page.goto(`${BASE}/leer/1/noexiste`);
  await page.waitForTimeout(500);
  check(P('Ficha inexistente muestra aviso'), (await txt(page.locator('main'))).includes('No se encontró la ficha'), await txt(page.locator('main')));
  await page.goto(`${BASE}/ruta-que-no-existe`);
  await page.waitForTimeout(400);
  check(P('Ruta desconocida vuelve al mapa'), /#\/$/.test(page.url()), page.url());
  await page.close();
  await ctx.close();
}
fs.writeFileSync('/tmp/partB.json', JSON.stringify(results));
resumen();
await browser.close();
