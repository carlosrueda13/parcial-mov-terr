import { launch, BASE, ROOT, indice, check, vigilar, norm, resumen, results } from './lib.mjs';
import fs from 'fs';

const browser = await launch();
const fichaMd = (f) => fs.readFileSync(`${ROOT}/content/semana-${String(f.semana).padStart(2, '0')}/${f.lectura}/ficha.md`, 'utf8');
function titulos(md) {
  const out = []; let cod = false;
  for (const l of md.replace(/\r\n/g, '\n').split('\n')) {
    if (/^```/.test(l)) cod = !cod;
    const m = !cod && /^##\s+(.*)$/.exec(l);
    if (m) out.push(m[1].trim().replace(/[*_`]/g, ''));
  }
  return out;
}
const quieto = (page) => page.waitForFunction(() => { const y = window.scrollY; const p = window.__y; window.__y = y; return p === y; }, null, { polling: 200, timeout: 8000 });
const enVista = (page, id) => page.evaluate((i) => { const r = document.getElementById(i).getBoundingClientRect(); return r.top; }, id);

for (const modo of [{ n: 'escritorio', w: 1280, h: 900 }, { n: 'movil', w: 390, h: 844 }]) {
  const movil = modo.n === 'movil';
  const ctx = await browser.newContext({ viewport: { width: modo.w, height: modo.h } });
  console.log('==', modo.n);
  for (const f of indice.lecturas) {
    const P = (s) => `[${modo.n}] ficha ${f.lectura}: ${s}`;
    const md = fichaMd(f);
    const tit = titulos(md);
    const page = await ctx.newPage();
    vigilar(page, `${modo.n}:ficha:${f.lectura}`);
    await page.goto(`${BASE}/leer/${f.semana}/${f.lectura}`);
    await page.waitForSelector('article.prose');
    const textoArt = await page.locator('article.prose').innerText();
    check(P('tiene contenido sustancial'), textoArt.length > 1500, textoArt.length);
    check(P(`secciones = ${tit.length}`), (await page.locator('article.prose section[id^="sec-"]').count()) === tit.length, await page.locator('article.prose section[id^="sec-"]').count());
    const tocBtns = await page.locator('nav.toc button').allTextContents();
    check(P('índice lateral con los mismos títulos'), tocBtns.length === tit.length && tocBtns.every((t, i) => norm(t) === norm(tit[i])), `${tocBtns.length}/${tit.length}`);
    const opts = await page.locator('select.tocsel option').allTextContents();
    check(P('selector móvil con las secciones'), opts.length === tit.length + 1, opts.length);
    check(P('sin Markdown crudo (## o **)'), !/(^|\n)##\s/.test(textoArt) && !textoArt.includes('**'), textoArt.match(/.{20}(\*\*|##).{20}/)?.[0]);
    const fundidas = await page.evaluate(() => [...document.querySelectorAll('article.prose p')].filter((p) => /\n\s*\d+\.\s/.test(p.innerHTML)).length);
    check(P('listas numeradas no quedan fundidas en un párrafo'), fundidas === 0, fundidas);
    check(P('sin tablas crudas con |---'), !/\|\s*-{3,}/.test(textoArt));
    check(P('Cabecera visible (h1 de la ficha)'), (await page.locator('article.prose h1').count()) >= 1);
    // sección de preguntas modelo: una por pregunta
    const idxPM = tit.findIndex((t) => /preguntas modelo/i.test(t));
    check(P('tiene sección "Preguntas modelo"'), idxPM >= 0);
    if (idxPM >= 0) {
      const sec = page.locator(`#sec-${idxPM + 1}`);
      const li = await sec.locator('li').count();
      check(P(`preguntas modelo listadas (${f.preguntas})`), li === f.preguntas, `${li} vs ${f.preguntas}`);
      const t = await sec.innerText();
      check(P('las preguntas modelo muestran su respuesta entre paréntesis'), (t.match(/\(/g) || []).length >= f.preguntas * 0.9, `${(t.match(/\(/g) || []).length} paréntesis`);
    }
    // sin desbordamiento horizontal
    check(P('sin desbordamiento horizontal'), await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), await page.evaluate(() => document.documentElement.scrollWidth));
    // navegación por el índice
    if (!movil) {
      check(P('índice lateral visible'), await page.locator('nav.toc').isVisible());
      const idxs = [...new Set([0, Math.floor(tit.length / 2), tit.length - 1])];
      for (const i of idxs) {
        await page.locator('nav.toc button').nth(i).click();
        await quieto(page);
        const top = await enVista(page, `sec-${i + 1}`);
        const max = await page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight - window.scrollY);
        const cab = await page.evaluate(() => { const h = document.querySelector('header.topbar'); return getComputedStyle(h).position === 'sticky' || getComputedStyle(h).position === 'fixed' ? h.getBoundingClientRect().height : 0; });
        check(P(`índice lleva a la sección ${i + 1}`), (top >= cab - 5 && top < modo.h * 0.6) || max < 5, `top=${Math.round(top)} cab=${cab} restante=${Math.round(max)}`);
      }
    } else {
      check(P('selector de secciones visible en móvil'), await page.locator('select.tocsel').isVisible());
      const i = Math.min(2, tit.length - 1);
      await page.locator('select.tocsel').selectOption(`sec-${i + 1}`);
      await quieto(page);
      const top = await enVista(page, `sec-${i + 1}`);
      const max = await page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight - window.scrollY);
      const cab = await page.evaluate(() => { const h = document.querySelector('header.topbar'); return getComputedStyle(h).position === 'sticky' || getComputedStyle(h).position === 'fixed' ? h.getBoundingClientRect().height : 0; });
      check(P(`selector móvil lleva a la sección ${i + 1}`), (top >= cab - 5 && top < modo.h * 0.6) || max < 5, `top=${Math.round(top)} cab=${cab}`);
    }
    // marcar como leída
    if (!movil) {
      const btn = page.getByRole('button', { name: /Marcar como leída|Marcada como leída/ });
      const t0 = norm(await btn.textContent());
      check(P('estado inicial "Marcar como leída"'), t0 === 'Marcar como leída', t0);
      await btn.click();
      const t1 = norm(await btn.textContent());
      const p1 = await page.evaluate((l) => JSON.parse(localStorage.getItem('mt.prog.v1')).leidas[l], f.lectura);
      check(P('marcar como leída cambia el botón y guarda'), t1 === 'Marcada como leída. Deshacer' && p1 === true, `${t1} ${p1}`);
      // El último queda sin marcar; los demás quedan marcados para probar "Leída" en listados
    }
    // enlaces de pie
    const pr = page.locator('article.prose a.btn', { hasText: 'Practicar esta lectura' });
    const tp = page.locator('article.prose a.btn', { hasText: 'Ver trampas y pares' });
    check(P('enlace Practicar esta lectura'), (await pr.getAttribute('href')) === `#/practica?semana=${f.semana}&lectura=${f.lectura}&ir=1`, await pr.getAttribute('href'));
    check(P('enlace Ver trampas y pares'), (await tp.getAttribute('href')) === `#/trampas?lectura=${f.lectura}`, await tp.getAttribute('href'));
    const volver = await page.locator('a.back').getAttribute('href');
    check(P('enlace de regreso a la semana'), volver === `#/semana/${f.semana}`, volver);
    if (!movil && f.lectura === 'gutierrez-2013') await page.screenshot({ path: '/tmp/shots/c-ficha-gutierrez.png' });
    if (movil && f.lectura === 'gutierrez-2013') await page.screenshot({ path: '/tmp/shots/c-ficha-gutierrez-mov.png' });
    // Probar los enlaces de pie una vez (primera lectura)
    if (!movil && f.lectura === 'gutierrez-2013') {
      await pr.click();
      await page.waitForSelector('.pregunta');
      check(P('"Practicar esta lectura" abre la práctica'), page.url().includes('/practica') && (await page.locator('.pill.blue').first().textContent()).includes(`de ${f.preguntas}`) || page.url().includes('/practica'));
      await page.goBack();
      await page.waitForSelector('article.prose');
      await page.locator('article.prose a.btn', { hasText: 'Ver trampas y pares' }).click();
      await page.waitForSelector('li.trampa');
      check(P('"Ver trampas y pares" abre las trampas filtradas'), (await page.locator('li.trampa').count()) === f.trampas, await page.locator('li.trampa').count());
      await page.goBack();
      await page.waitForSelector('article.prose');
      await page.locator('a.back').click();
      await page.waitForSelector('button.estacion');
      check(P('"Volver a la semana" abre la zona'), page.url().endsWith(`/semana/${f.semana}`));
    }
    await page.close();
  }
  if (!movil) {
    // La lectura marcada se refleja en el índice, en la zona y en la misión
    const page = await ctx.newPage();
    vigilar(page, 'leidas');
    await page.goto(`${BASE}/leer`);
    await page.waitForSelector('ul li a.tile');
    const pills = await page.locator('a.tile .pill.green').count();
    check('Índice de fichas marca las leídas', pills === 19, pills);
    check('Índice de fichas: 19 fichas y 1 pendiente', (await page.locator('a.tile').count()) === 19 && (await page.locator('div.tile.off .pill.red').count()) === 1);
    check('Índice: 8 semanas', (await page.locator('section[aria-label^="Semana"]').count()) === 8);
    await page.goto(`${BASE}/semana/1`);
    await page.waitForSelector('button.estacion');
    check('Zona S1 muestra "Leída" en las estaciones', (await page.locator('button.estacion .pill.green').count()) === 2);
    // Deshacer una
    await page.goto(`${BASE}/leer/1/gutierrez-2013`);
    await page.waitForSelector('article.prose');
    await page.getByRole('button', { name: 'Marcada como leída. Deshacer' }).click();
    check('Deshacer lectura vuelve a "Marcar como leída"', norm(await page.getByRole('button', { name: /leída/ }).textContent()) === 'Marcar como leída');
    await page.goto(`${BASE}/leer`);
    await page.waitForSelector('a.tile');
    check('Índice: tras deshacer quedan 18 leídas', (await page.locator('a.tile .pill.green').count()) === 18);
    // El estado persiste tras recargar
    await page.reload();
    await page.waitForSelector('a.tile');
    check('Lo leído persiste tras recargar', (await page.locator('a.tile .pill.green').count()) === 18);
    await page.close();
  }
  await ctx.close();
}
fs.writeFileSync('/tmp/partC1.json', JSON.stringify(results));
resumen();
await browser.close();
