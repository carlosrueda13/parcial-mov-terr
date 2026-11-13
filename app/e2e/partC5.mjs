import { launch, BASE, indice, banco, check, vigilar, norm, resumen, results } from './lib.mjs';
import fs from 'fs';
const browser = await launch();
const bancos = indice.lecturas.map((f) => ({ f, b: banco(f) }));
const eff = (p) => p.tipo === 'vf' && typeof p.verdadera === 'boolean';
const cuenta = (xs, fn) => xs.reduce((a, x) => a + fn(x), 0);
const num = (s) => Number(/(\d+)/.exec(s)[1]);
const leerProg = (page) => page.evaluate(() => JSON.parse(localStorage.getItem('mt.prog.v1') || '{}'));

for (const modo of [{ n: 'escritorio', w: 1280, h: 900 }, { n: 'movil', w: 390, h: 844 }]) {
  const ctx = await browser.newContext({ viewport: { width: modo.w, height: modo.h } });
  const page = await ctx.newPage();
  vigilar(page, 'practica-' + modo.n);
  const P = (s) => `[${modo.n}] Practicar: ${s}`;
  const disp = async () => norm(await page.locator('section[aria-label="Configurar práctica"] .row.center .muted').textContent());
  const empezar = page.getByRole('button', { name: 'Empezar práctica' });
  const chip = (g, t) => page.locator(`[aria-label="${g}"] button`, { hasText: t });
  const espera = (n) => page.waitForFunction((t) => (document.querySelector('section[aria-label="Configurar práctica"] .row.center .muted')?.textContent || '').startsWith(t), `${n} pregunta`, { timeout: 4000 }).catch(() => {});

  await page.goto(`${BASE}/practica`);
  await empezar.waitFor();
  await espera(878);
  check(P('título y 878 disponibles'), norm(await page.locator('h1').textContent()) === 'Practicar' && num(await disp()) === 878, await disp());
  check(P('3 grupos de chips'), (await page.locator('[aria-label="Tipo de pregunta"] button').count()) === 3 && (await page.locator('[aria-label="Selección"] button').count()) === 3 && (await page.locator('[aria-label="Cantidad"] button').count()) === 3);
  // tipo
  await chip('Tipo de pregunta', 'Verdadero o falso').click();
  await espera(54);
  check(P('tipo V/F = 54'), num(await disp()) === 54 && page.url().includes('tipo=vf'), await disp());
  await chip('Tipo de pregunta', 'Abiertas').click();
  await espera(824);
  check(P('tipo abiertas = 824'), num(await disp()) === 824, await disp());
  await chip('Tipo de pregunta', 'Todas').click();
  // sin respuesta / las que fallé
  await chip('Selección', 'Las que fallé').click();
  await page.waitForFunction(() => /No hay preguntas con esta selección/.test(document.body.textContent));
  check(P('"Las que fallé" sin fallas bloquea el botón'), await empezar.isDisabled());
  await chip('Selección', 'Sin responder').click();
  await espera(878);
  check(P('"Sin responder" = 878 al inicio'), num(await disp()) === 878, await disp());
  await chip('Selección', 'Todas').click();
  // semana y lectura
  for (const s of [1, 4, 7]) {
    await page.locator('select').nth(0).selectOption(String(s));
    const e = cuenta(bancos.filter((x) => x.f.semana === s), (x) => x.b.preguntas.length);
    await espera(e);
    check(P(`semana ${s} = ${e}`), num(await disp()) === e, await disp());
    check(P(`semana ${s}: lecturas del selector`), (await page.locator('select').nth(1).locator('option').count()) === 1 + bancos.filter((x) => x.f.semana === s).length);
  }
  // lectura con V/F
  await page.locator('select').nth(0).selectOption('6');
  await page.locator('select').nth(1).selectOption('sdp-2014-region-metropolitana');
  await chip('Tipo de pregunta', 'Verdadero o falso').click();
  await espera(9);
  check(P('SDP con tipo V/F = 9 (las 3 que matizan salen como abiertas)'), num(await disp()) === 9, await disp());
  await chip('Tipo de pregunta', 'Todas').click();
  // cantidad 10
  await page.goto(`${BASE}/practica`);
  await empezar.waitFor();
  await chip('Cantidad', '10').click();
  await empezar.click();
  await page.waitForSelector('.pregunta');
  check(P('cantidad 10 -> sesión de 10'), norm(await page.locator('.pill.blue').textContent()) === 'Pregunta 1 de 10');
  await page.getByRole('button', { name: 'Terminar práctica' }).click();
  await empezar.waitFor();
  check(P('"Terminar práctica" vuelve a la configuración'), (await page.locator('section[aria-label="Configurar práctica"]').count()) === 1);
  await chip('Cantidad', '20').click();
  await empezar.click();
  await page.waitForSelector('.pregunta');
  check(P('cantidad 20 -> sesión de 20'), norm(await page.locator('.pill.blue').textContent()) === 'Pregunta 1 de 20');
  check(P('barra de avance presente'), (await page.locator('[role="img"][aria-label^="Avance de la práctica"]').count()) === 1);
  // responder 3 preguntas y terminar: "Las que fallé" ahora tiene contenido
  for (let i = 0; i < 3; i++) {
    const sec = page.locator('.pregunta');
    if (await sec.getByRole('button', { name: 'Verdadero', exact: true }).count()) await sec.getByRole('button', { name: 'Falso', exact: true }).click();
    else { await sec.getByRole('button', { name: 'Mostrar la respuesta' }).click(); await sec.getByRole('button', { name: 'No la sabía', exact: true }).click(); }
    await sec.getByRole('button', { name: 'Siguiente', exact: true }).click();
  }
  const p3 = await leerProg(page);
  const falladas = Object.values(p3.q).filter((q) => q.n > 0 && !q.last).length;
  await page.getByRole('button', { name: 'Terminar práctica' }).click();
  await empezar.waitFor();
  await chip('Selección', 'Las que fallé').click();
  await espera(falladas);
  check(P('"Las que fallé" refleja lo fallado'), num(await disp()) >= 1 && num(await disp()) === falladas, `${await disp()} vs ${falladas}`);
  await chip('Selección', 'Sin responder').click();
  await espera(878 - Object.keys(p3.q).length);
  check(P('"Sin responder" descuenta lo respondido'), num(await disp()) === 878 - Object.keys(p3.q).length, `${await disp()} vs ${878 - Object.keys(p3.q).length}`);
  // persistencia tras recargar
  await page.reload();
  await empezar.waitFor();
  const p4 = await leerProg(page);
  check(P('el progreso persiste tras recargar'), Object.keys(p4.q).length === Object.keys(p3.q).length && p4.aciertos === p3.aciertos);
  await page.getByRole('link', { name: /Mapa/ }).first().click().catch(() => {});
  await page.goto(`${BASE}/`);
  await page.waitForSelector(modo.n === 'movil' ? '.map-mob' : '.map-desk');
  check(P('el mapa refleja la práctica (racha de 1 día)'), (await page.locator('section.tarjeta').innerText()).includes('1 día seguido'));
  // flujo de resultado: Nueva práctica y Volver al mapa
  await page.goto(`${BASE}/practica?semana=1&lectura=cepal-2024&n=todas&ir=1`);
  await page.waitForSelector('.pregunta');
  for (let i = 0; i < 7; i++) {
    const sec = page.locator('.pregunta');
    await sec.getByRole('button', { name: 'Mostrar la respuesta' }).click();
    await sec.getByRole('button', { name: 'La sabía', exact: true }).click();
    await sec.getByRole('button', { name: i < 6 ? 'Siguiente' : 'Ver resultado', exact: true }).click();
  }
  check(P('resultado 7 de 7 sin falladas'), norm(await page.locator('h1').textContent()) === '7 de 7' && (await page.getByText('Sin fallas en esta ronda.').count()) === 1 && (await page.getByRole('button', { name: 'Repetir las que fallé' }).count()) === 0);
  await page.getByRole('button', { name: 'Nueva práctica' }).click();
  await empezar.waitFor();
  check(P('"Nueva práctica" vuelve a la configuración'), (await page.locator('section[aria-label="Configurar práctica"]').count()) === 1);
  await page.goto(`${BASE}/practica?semana=1&lectura=cepal-2024&n=todas&ir=1`);
  await page.waitForSelector('.pregunta');
  for (let i = 0; i < 7; i++) { const sec = page.locator('.pregunta'); await sec.getByRole('button', { name: 'Mostrar la respuesta' }).click(); await sec.getByRole('button', { name: 'La sabía', exact: true }).click(); await sec.getByRole('button', { name: i < 6 ? 'Siguiente' : 'Ver resultado', exact: true }).click(); }
  await page.getByRole('link', { name: 'Volver al mapa' }).click();
  await page.waitForSelector(modo.n === 'movil' ? '.map-mob' : '.map-desk');
  check(P('"Volver al mapa" desde el resultado'), page.url().endsWith('#/'));
  // Dominio: dos aciertos seguidos suben el dominio de la zona S1 (CEPAL: 7 de 15 respondibles)
  await page.goto(`${BASE}/semana/1`);
  await page.waitForSelector('button.estacion');
  const dom = norm(await page.locator('button.estacion').first().innerText());
  const dom2 = norm(await page.locator('button.estacion').nth(1).innerText());
  const esperado = (id) => { const f = indice.lecturas.find((x) => x.lectura === id); return f; };
  check(P('zona S1: CEPAL aparece con % dominado tras 2 aciertos'), /(\d+)% dominado/.test(dom + dom2), `${dom} | ${dom2}`);
  await page.waitForTimeout(100);
  if (modo.n === 'escritorio') await page.screenshot({ path: '/tmp/shots/c-zona-progreso.png', fullPage: true });
  await ctx.close();
}
fs.writeFileSync('/tmp/partC5.json', JSON.stringify(results));
resumen();
await browser.close();
