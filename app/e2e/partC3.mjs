import { launch, BASE, indice, banco, check, vigilar, norm, resumen, results } from './lib.mjs';
import fs from 'fs';
const browser = await launch();
const bancos = indice.lecturas.map((f) => ({ f, b: banco(f) }));
const DIA = 86400000;
const universo = new Map(); // id -> {frente, dorso, esPregunta, lectura}
for (const { f, b } of bancos) {
  for (const p of b.preguntas) universo.set(p.id, { frente: norm(p.enunciado), dorso: norm(p.respuesta), esPregunta: true, tipoVF: p.tipo === 'vf' && typeof p.verdadera === 'boolean', lectura: f.lectura, semana: f.semana });
  for (const p of b.pares) universo.set(p.id, { frente: norm(`¿En qué se diferencian? ${p.par}`), dorso: norm(p.diferencia), esPregunta: false, lectura: f.lectura, semana: f.semana });
}
const porFrente = new Map([...universo].map(([id, v]) => [v.frente, id]));
check('Universo de boletos = 878 preguntas + 319 pares', universo.size === 878 + 319 && porFrente.size === universo.size, `${universo.size}/${porFrente.size}`);
const dias = Math.max(0, Math.ceil((new Date('2026-11-21T00:00:00-05:00') - Date.now()) / DIA));
const tope = Math.max(1, Math.floor(dias * 0.4));
const sigCaja = (r, c) => (r === 0 ? 0 : r === 1 ? Math.max(1, Math.min(c, 1)) : r === 2 ? c + 1 : c + 2);
const interv = (r, c) => (r === 0 ? 0 : r === 1 ? Math.min(1, tope) : Math.min(tope, Math.max(1, Math.pow(2, Math.max(0, sigCaja(r, c) - 1)))));
const cuando = (d) => (d === 0 ? 'hoy' : d === 1 ? 'mañana' : `en ${d} días`);
const leerProg = (page) => page.evaluate(() => JSON.parse(localStorage.getItem('mt.prog.v1') || '{}'));
const num = (s) => Number(/(\d+)/.exec(s)[1]);

const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await ctx.newPage();
vigilar(page, 'boletos');
const estado = async () => norm(await page.locator('section[aria-label="Elegir mazo"] .row.center .muted').textContent());
const btnEmpezar = page.getByRole('button', { name: 'Empezar el repaso' });
await page.goto(`${BASE}/boletos`);
await btnEmpezar.waitFor();
await page.waitForFunction(() => /boletos? disponibles?/.test(document.querySelector('section[aria-label="Elegir mazo"]')?.textContent || ''));
check('Boletos: título y mazos', norm(await page.locator('h1').textContent()) === 'Boletos de repaso' && (await page.locator('[aria-label="Mazo"] button').count()) === 3);
check('Boletos: hoy = 1197 disponibles', num(await estado()) === 1197, await estado());
await page.locator('[aria-label="Mazo"] button', { hasText: 'Con fallas' }).click();
await page.waitForTimeout(200);
check('Boletos: sin fallas avisa y bloquea', (await estado()).includes('Aún no tienes boletos con fallas') && (await btnEmpezar.isDisabled()));
await page.locator('[aria-label="Mazo"] button', { hasText: 'Todos' }).click();
await page.waitForTimeout(200);
check('Boletos: mazo Todos = 1197', num(await estado()) === 1197 && page.url().includes('mazo=todos'), await estado());
await page.locator('[aria-label="Mazo"] button', { hasText: 'Para hoy' }).click();
// filtros
for (const s of [3, 5, 8]) {
  await page.locator('select').nth(0).selectOption(String(s));
  const esp = bancos.filter((x) => x.f.semana === s).reduce((a, x) => a + x.b.preguntas.length + x.b.pares.length, 0);
  await page.waitForFunction((n) => (document.querySelector('section[aria-label="Elegir mazo"] .row.center .muted')?.textContent || '').startsWith(`${n} `), esp, { timeout: 4000 }).catch(() => {});
  check(`Boletos: filtro semana ${s} = ${esp}`, num(await estado()) === esp, await estado());
}
{
  const x = bancos.find((y) => y.f.lectura === 'polese-1998-cap10');
  await page.locator('select').nth(0).selectOption('4');
  await page.locator('select').nth(1).selectOption(x.f.lectura);
  const esp = x.b.preguntas.length + x.b.pares.length;
  await page.waitForFunction((n) => (document.querySelector('section[aria-label="Elegir mazo"] .row.center .muted')?.textContent || '').startsWith(`${n} `), esp, { timeout: 4000 }).catch(() => {});
  check(`Boletos: filtro lectura Polèse cap. 10 = ${esp}`, num(await estado()) === esp, await estado());
}
await page.goto(`${BASE}/boletos?semana=2&lectura=santos-2000`);
await btnEmpezar.waitFor();
check('Boletos: enlace profundo con semana y lectura', (await page.locator('select').nth(1).inputValue()) === 'santos-2000');
await page.goto(`${BASE}/boletos`);
await btnEmpezar.waitFor();
await page.waitForFunction(() => /1197/.test(document.querySelector('section[aria-label="Elegir mazo"]')?.textContent || ''));

// Sesión
await btnEmpezar.click();
await page.waitForSelector('.flipper');
check('Boletos: sesión de 20 (mazo hoy)', norm(await page.locator('.pill.blue').textContent()) === 'Boleto 1 de 20', await page.locator('.pill.blue').textContent());
check('Boletos: sin voltear no hay calificaciones', (await page.locator('.califica').count()) === 0 && (await page.getByText('Piensa la respuesta y voltea el boleto para comprobarla.').count()) === 1);
const vistos = new Set();
let ok = 0, malos = [];
for (let i = 0; i < 20; i++) {
  const frente = norm(await page.locator('.face:not(.face-back) .q').textContent());
  const id = porFrente.get(frente);
  if (!id) { malos.push(`boleto ${i + 1}: frente desconocido ${frente.slice(0, 50)}`); break; }
  if (vistos.has(id)) malos.push(`${id} repetido`);
  vistos.add(id);
  const u = universo.get(id);
  const dorso = norm(await page.locator('.face-back .a').textContent());
  if (dorso !== u.dorso) malos.push(`${id}: dorso distinto`);
  const etq = norm(await page.locator('.face:not(.face-back) .der').textContent());
  if (!etq.startsWith(u.esPregunta ? 'Concepto' : 'Par')) malos.push(`${id}: etiqueta lateral ${etq}`);
  const flip = page.locator('.flipper');
  if (i === 0) {
    const bt = page.getByRole('button', { name: 'Voltear el boleto' });
    await bt.click();
    const tr = await flip.getAttribute('style');
    if (!/rotateY\(180deg\)/.test(tr)) malos.push('no voltea');
    if ((await page.getByRole('button', { name: 'Ver el frente' }).getAttribute('aria-pressed')) !== 'true') malos.push('aria-pressed del botón');
    if ((await page.locator('.califica button').count()) !== 4) malos.push('no aparecen 4 calificaciones');
    await page.getByRole('button', { name: 'Ver el frente' }).click();
    const tr2 = await flip.getAttribute('style');
    if (/rotateY\(180deg\)/.test(tr2) || (await page.locator('.califica').count()) !== 0) malos.push('no vuelve al frente');
    await page.getByRole('button', { name: 'Escuchar' }).click();
    await page.getByRole('button', { name: 'Voltear el boleto' }).click();
  } else {
    await page.getByRole('button', { name: 'Voltear el boleto' }).click();
  }
  const r = i % 4;
  const antes = (await leerProg(page)).c?.[id];
  const caja0 = antes?.caja ?? 0;
  const botones = page.locator('.califica button');
  const textoBtn = norm(await botones.nth(r).textContent());
  const etiquetas = ['Otra vez', 'Difícil', 'Bien', 'Fácil'];
  if (!textoBtn.startsWith(etiquetas[r]) || !textoBtn.includes(`Vuelve ${cuando(interv(r, caja0))}`)) malos.push(`${id}: botón ${textoBtn} esperado ${etiquetas[r]} Vuelve ${cuando(interv(r, caja0))}`);
  const antesQ = (await leerProg(page)).q?.[id];
  await botones.nth(r).click();
  const p = await leerProg(page);
  const c = p.c?.[id];
  if (!c) { malos.push(`${id}: sin registro SRS`); continue; }
  if (c.caja !== sigCaja(r, caja0)) malos.push(`${id}: caja ${c.caja} vs ${sigCaja(r, caja0)}`);
  const dd = Math.round((c.due - c.t) / 1000);
  if (Math.abs(dd - interv(r, caja0) * 86400) > 2) malos.push(`${id}: intervalo ${dd}s vs ${interv(r, caja0)} días`);
  if ((c.fallas) !== (r === 0 ? 1 : 0)) malos.push(`${id}: fallas ${c.fallas}`);
  if (u.esPregunta) {
    const q = p.q?.[id];
    if (!q || q.last !== (r >= 2) || q.n !== (antesQ?.n ?? 0) + 1) malos.push(`${id}: progreso de pregunta ${JSON.stringify(q)}`);
  } else if (p.q?.[id]) malos.push(`${id}: un par no debe crear progreso de pregunta`);
  // A los 5 boletos, terminar a mitad y volver a empezar
  if (i === 4) {
    await page.getByRole('button', { name: 'Terminar repaso' }).click();
    await btnEmpezar.waitFor();
    const e = await estado();
    const progAhora = await leerProg(page);
    const futuros = Object.values(progAhora.c).filter((x) => x.due > Date.now()).length;
    if (num(e) !== 1197 - futuros) malos.push(`tras 5 boletos quedan ${num(e)} vs ${1197 - futuros}`);
    await btnEmpezar.click();
    await page.waitForSelector('.flipper');
    // la nueva cola es otra: reinicia el conteo
    const pill = norm(await page.locator('.pill.blue').textContent());
    if (!pill.startsWith('Boleto 1 de ')) malos.push(`pill tras reiniciar: ${pill}`);
    ok = i + 1;
    break;
  }
}
check('Boletos: primera tanda (voltear, dorso correcto, calificar, SRS, Terminar repaso)', malos.length === 0, malos.slice(0, 5).join(' || '));
// Segunda sesión completa hasta el final
const n2 = num(norm(await page.locator('.pill.blue').textContent()).replace('Boleto 1 de ', ''));
check('Boletos: segunda sesión de 20', n2 === 20, n2);
const malos2 = [];
for (let i = 0; i < n2; i++) {
  await page.getByRole('button', { name: 'Voltear el boleto' }).click();
  const frente = norm(await page.locator('.face:not(.face-back) .q').textContent());
  const id = porFrente.get(frente);
  const u = universo.get(id);
  if (norm(await page.locator('.face-back .a').textContent()) !== u.dorso) malos2.push(`${id}: dorso`);
  const r = [2, 3, 0, 1][i % 4];
  await page.locator('.califica button').nth(r).click();
}
check('Boletos: segunda sesión sin errores', malos2.length === 0, malos2.slice(0, 3).join(' || '));
check('Boletos: fin de repaso muestra resumen', norm(await page.locator('h1').textContent()) === 'Repaso terminado' && norm(await page.locator('section[aria-label="Repaso terminado"] .lead').textContent()).startsWith('Validaste 20 boletos'), norm(await page.locator('section[aria-label="Repaso terminado"] .lead').textContent()));
await page.screenshot({ path: '/tmp/shots/c-boletos-fin.png' });
await page.getByRole('button', { name: 'Elegir otro mazo' }).click();
await btnEmpezar.waitFor();
let p = await leerProg(page);
const ahora = Date.now();
const idsConFalla = [...universo.keys()].filter((id) => (p.c?.[id]?.fallas ?? 0) > 0 || (p.q?.[id] && p.q[id].n > 0 && !p.q[id].last));
await page.locator('[aria-label="Mazo"] button', { hasText: 'Con fallas' }).click();
await page.waitForTimeout(250);
check('Boletos: mazo "Con fallas" cuenta lo fallado', num(await estado()) === idsConFalla.length && idsConFalla.length > 0, `${await estado()} vs ${idsConFalla.length}`);
await btnEmpezar.click();
await page.waitForSelector('.flipper');
const nF = num(norm(await page.locator('.pill.blue').textContent()).replace('Boleto 1 de ', ''));
check('Boletos: sesión "Con fallas" arranca con las falladas', nF === Math.min(40, idsConFalla.length), nF);
const fr = norm(await page.locator('.face:not(.face-back) .q').textContent());
check('Boletos: el primer boleto de "Con fallas" realmente falló', idsConFalla.includes(porFrente.get(fr)));
await page.getByRole('button', { name: 'Terminar repaso' }).click();
// mazo todos: primera sesión de 40
await page.locator('[aria-label="Mazo"] button', { hasText: 'Todos' }).click();
await btnEmpezar.click();
await page.waitForSelector('.flipper');
check('Boletos: mazo "Todos" arma sesión de 40', norm(await page.locator('.pill.blue').textContent()) === 'Boleto 1 de 40');
await page.getByRole('button', { name: 'Terminar repaso' }).click();
// Fin: Volver al mapa desde el resumen
await page.goto(`${BASE}/boletos`);
await btnEmpezar.waitFor();
await btnEmpezar.click();
await page.waitForSelector('.flipper');
for (let i = 0; i < 20; i++) { await page.getByRole('button', { name: 'Voltear el boleto' }).click(); await page.locator('.califica button').nth(3).click(); }
await page.getByRole('link', { name: 'Volver al mapa' }).click();
await page.waitForSelector('.map-desk');
check('Boletos: "Volver al mapa" desde el resumen', page.url().endsWith('#/'));

// Efectos en el mapa
p = await leerProg(page);
const vencidos = Object.values(p.c).filter((c) => c.due <= Date.now()).length;
const km = Math.floor(p.aciertos / 5);
const mision = norm(await page.locator('section[aria-label="Misión de hoy"]').innerText());
if (vencidos > 0) check('Mapa: misión muestra boletos vencidos', mision.includes(`Valida ${Math.min(vencidos, 12)} boletos de repaso`) && mision.includes(`${vencidos} vencido`), mision.slice(-120));
check('Mapa: kilómetros según aciertos', norm(await page.locator('ul.statsmob li').first().innerText()).startsWith(`${km} km`) || (await page.locator('section.tarjeta').innerText()).includes(`Llevas ${km} km`), `${km} km, aciertos ${p.aciertos}`);
check('Mapa: racha de 1 día', (await page.locator('section.tarjeta').innerText()).includes('1 día seguido'), (await page.locator('section.tarjeta').innerText()).slice(-120));
const fallasQ = Object.values(p.q).filter((q) => q.n > 0 && !q.last).length;
const lista = await page.locator('section[aria-label="Lo que más fallas"]').innerText();
check('Mapa: "Lo que más fallas" refleja las preguntas falladas', fallasQ === 0 ? lista.includes('Sin errores') : lista.includes('Tienes') , `${fallasQ} falladas; ${norm(lista).slice(0, 80)}`);
const enlacesFallas = await page.locator('section[aria-label="Lo que más fallas"] a').count();
if (fallasQ > 0) {
  check('Mapa: enlaces de fallas a práctica de falladas', enlacesFallas >= 1 && enlacesFallas <= 3, enlacesFallas);
  await page.locator('section[aria-label="Lo que más fallas"] a').first().click();
  await page.waitForSelector('.pregunta');
  check('Mapa: "Lo que más fallas" abre práctica con sus falladas', /de \d+/.test(await page.locator('.pill.blue').first().textContent()));
  await page.goBack();
}
await page.screenshot({ path: '/tmp/shots/c-mapa-con-progreso.png', fullPage: true });
fs.writeFileSync('/tmp/partC3.json', JSON.stringify(results));
resumen();
await browser.close();
