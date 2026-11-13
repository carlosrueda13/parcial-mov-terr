import { launch, BASE, indice, banco, check, vigilar, norm, resumen, results } from './lib.mjs';
import fs from 'fs';

const browser = await launch();
const ctx = await browser.newContext({ viewport: process.env.VIEW === 'movil' ? { width: 390, height: 844 } : { width: 1280, height: 900 } });
let totalVistas = 0, totalEsperadas = 0;
const detalle = [];

for (const f of indice.lecturas) {
  const b = banco(f);
  const items = b.preguntas.filter((p) => p.estado === 'completa' && p.respuesta);
  const porEnun = new Map(items.map((p) => [norm(p.enunciado), p]));
  check(`[${f.lectura}] enunciados únicos en el banco`, porEnun.size === items.length, `${porEnun.size} vs ${items.length}`);
  check(`[${f.lectura}] todas las preguntas del banco tienen respuesta`, items.length === b.preguntas.length && items.length === f.respondibles, `${items.length}/${b.preguntas.length}/${f.respondibles}`);

  const page = await ctx.newPage();
  vigilar(page, f.lectura);
  await page.goto(`${BASE}/practica?semana=${f.semana}&lectura=${f.lectura}&n=todas&ir=1`);
  await page.waitForSelector('.pregunta', { timeout: 15000 });
  const pill = norm(await page.locator('.pill.blue').first().textContent());
  const N = Number(/de (\d+)/.exec(pill)?.[1]);
  check(`[${f.lectura}] Practicar arranca con todas sus preguntas`, N === items.length, `${pill} vs ${items.length}`);

  const vistas = new Set();
  let esperadoOk = 0, fallas = 0, vf = 0, ab = 0, malas = [];
  for (let i = 0; i < N; i++) {
    const sec = page.locator('.pregunta');
    const enun = norm(await sec.locator('.texto').textContent());
    const p = porEnun.get(enun);
    if (!p) { malas.push(`q${i + 1}: enunciado no está en el banco: ${enun.slice(0, 60)}`); break; }
    if (vistas.has(p.id)) malas.push(`${p.id} repetida`);
    vistas.add(p.id);
    const tags = norm(await sec.locator('.tag').allTextContents().then((a) => a.join('|')));
    const esVF = p.tipo === 'vf' && typeof p.verdadera === 'boolean';
    if (esVF !== tags.includes('Verdadero o falso')) malas.push(`${p.id}: etiqueta de tipo ${tags}`);
    if (await page.locator('.respuesta').count()) malas.push(`${p.id}: la respuesta se ve antes de pedirla`);

    if (esVF) {
      vf++;
      const acierta = i % 2 === 0;
      const eleg = acierta ? p.verdadera : !p.verdadera;
      await sec.getByRole('button', { name: eleg ? 'Verdadero' : 'Falso', exact: true }).click();
      const resp = page.locator('.respuesta');
      await resp.waitFor();
      if (!(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1))) malas.push(`${p.id}: desbordamiento horizontal`);
      const veredicto = norm(await resp.locator('.d').textContent());
      if (veredicto !== (acierta ? 'Correcto' : 'Incorrecto')) malas.push(`${p.id}: veredicto ${veredicto}`);
      const txt = norm(await resp.locator('.t').textContent());
      if (txt !== norm(p.respuesta)) malas.push(`${p.id}: respuesta mostrada distinta`);
      if (p.referencia && !norm(await resp.textContent()).includes(norm(p.referencia))) malas.push(`${p.id}: sin referencia`);
      const dis = await sec.getByRole('button', { name: 'Verdadero', exact: true }).isDisabled();
      if (!dis) malas.push(`${p.id}: botones no se bloquean`);
      if (acierta) esperadoOk++; else fallas++;
    } else {
      ab++;
      await sec.getByRole('button', { name: 'Mostrar la respuesta' }).click();
      const resp = page.locator('.respuesta');
      await resp.waitFor();
      const txt = norm(await resp.locator('.t').textContent());
      if (!txt) malas.push(`${p.id}: respuesta vacía`);
      if (txt !== norm(p.respuesta)) malas.push(`${p.id}: respuesta mostrada distinta`);
      if (p.referencia && !norm(await resp.textContent()).includes(norm(p.referencia))) malas.push(`${p.id}: sin referencia`);
      if (!(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1))) malas.push(`${p.id}: desbordamiento horizontal`);
      const sabia = i % 3 !== 0;
      await sec.getByRole('button', { name: sabia ? 'La sabía' : 'No la sabía', exact: true }).click();
      if (sabia) esperadoOk++; else fallas++;
    }
    await sec.getByRole('button', { name: i + 1 < N ? 'Siguiente' : 'Ver resultado', exact: true }).click();
  }
  if (malas.length) check(`[${f.lectura}] recorrido de preguntas`, false, malas.slice(0, 4).join(' || '));
  else check(`[${f.lectura}] recorrido de ${N} preguntas (${vf} V/F, ${ab} abiertas)`, true);
  check(`[${f.lectura}] se vieron todas las preguntas una vez`, vistas.size === items.length, `${vistas.size}/${items.length}`);

  const h1 = norm(await page.locator('h1').first().textContent());
  check(`[${f.lectura}] resultado final correcto`, h1 === `${esperadoOk} de ${N}`, `${h1} vs ${esperadoOk} de ${N}`);
  const hayRepetir = await page.getByRole('button', { name: 'Repetir las que fallé' }).count();
  check(`[${f.lectura}] botón "Repetir las que fallé" según fallas`, (hayRepetir > 0) === (fallas > 0), `fallas=${fallas}, botón=${hayRepetir}`);
  if (fallas > 0) {
    await page.getByRole('button', { name: 'Repetir las que fallé' }).click();
    await page.waitForSelector('.pregunta');
    const p2 = norm(await page.locator('.pill.blue').first().textContent());
    check(`[${f.lectura}] repetir las falladas trae ${fallas}`, p2 === `Pregunta 1 de ${fallas}`, p2);
  }
  const prog = await page.evaluate(() => JSON.parse(localStorage.getItem('mt.prog.v1') || '{}'));
  const guardadas = Object.keys(prog.q || {}).filter((k) => k.startsWith(items[0].id.split('-q')[0] + '-q')).length;
  check(`[${f.lectura}] progreso guardado en localStorage`, guardadas === items.length, `${guardadas}/${items.length}`);
  totalVistas += vistas.size; totalEsperadas += items.length;
  detalle.push(`${f.lectura}: ${N} (${vf} vf, ${ab} ab)`);
  await page.close();
}
check('Total de preguntas recorridas = 878', totalVistas === 878 && totalEsperadas === 878, `${totalVistas}/${totalEsperadas}`);
console.log(detalle.join('\n'));
fs.writeFileSync('/tmp/partA-'+(process.env.VIEW||'esc')+'.json', JSON.stringify(results));
resumen();
await browser.close();
