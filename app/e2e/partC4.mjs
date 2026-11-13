import { launch, BASE, indice, banco, check, vigilar, norm, resumen, results } from './lib.mjs';
import fs from 'fs';
const browser = await launch();
const bancos = indice.lecturas.map((f) => ({ f, b: banco(f) }));
const porEnun = new Map();
let vfTotal = 0, abTotal = 0;
for (const { f, b } of bancos) for (const p of b.preguntas) {
  const esVF = p.tipo === 'vf' && typeof p.verdadera === 'boolean';
  porEnun.set(norm(p.enunciado), { ...p, esVF, lectura: f.lectura, semana: f.semana });
  if (esVF) vfTotal++; else abTotal++;
}
const disponibles = { completo: 878, vf: vfTotal, abiertas: abTotal };
check('Simulacro: banco con 54 V/F efectivas y 824 abiertas', vfTotal === 54 && abTotal === 824, `${vfTotal}/${abTotal}`);
const semDisp = (s) => bancos.filter((x) => x.f.semana === s).reduce((a, x) => a + x.b.preguntas.length, 0);
const leerProg = (page) => page.evaluate(() => JSON.parse(localStorage.getItem('mt.prog.v1') || '{}'));
const pct = (a, b) => (b ? Math.round((a / b) * 100) : 0);

const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await ctx.newPage();
vigilar(page, 'simulacro');
const chip = (grupo, t) => page.locator(`[aria-label="${grupo}"] button`, { hasText: t });
const info = async () => norm(await page.locator('section[aria-label="Configurar simulacro"] .row.center .muted').textContent());
const empezar = page.getByRole('button', { name: 'Empezar el simulacro' });
await page.goto(`${BASE}/simulacro`);
await empezar.waitFor();
await page.waitForFunction(() => /preguntas,/.test(document.querySelector('section[aria-label="Configurar simulacro"]')?.textContent || ''));
check('Simulacro: título', norm(await page.locator('h1').textContent()) === 'Hora pico');
check('Simulacro: 4 tipos y 3 cantidades', (await page.locator('[aria-label="Tipo de simulacro"] button').count()) === 4 && (await page.locator('[aria-label="Cantidad de preguntas"] button').count()) === 3);
check('Simulacro: por defecto 20 preguntas / 20 minutos', (await info()) === '20 preguntas, 20 minutos (1 por pregunta)', await info());
check('Simulacro: sin intentos no muestra historial', (await page.locator('section[aria-label="Intentos anteriores"]').count()) === 0);
for (const c of [10, 30, 20]) {
  await chip('Cantidad de preguntas', String(c)).click();
  check(`Simulacro: cantidad ${c}`, (await chip('Cantidad de preguntas', String(c)).getAttribute('aria-pressed')) === 'true' && (await info()) === `${c} preguntas, ${c} minutos (1 por pregunta)`, await info());
}
await chip('Tipo de simulacro', 'Solo verdadero o falso').click();
check('Simulacro: solo V/F con 20', (await info()) === '20 preguntas, 20 minutos (1 por pregunta)', await info());
await chip('Tipo de simulacro', 'Por semana').click();
check('Simulacro: por semana muestra el selector', (await page.locator('select').count()) === 1 && (await page.locator('select option').count()) === 8);
for (const s of [1, 2, 8]) {
  await page.locator('select').selectOption(String(s));
  const e = Math.min(20, semDisp(s));
  await page.waitForFunction((t) => (document.querySelector('section[aria-label="Configurar simulacro"] .row.center .muted')?.textContent || '').startsWith(t), `${e} preguntas`, { timeout: 4000 }).catch(() => {});
  check(`Simulacro: semana ${s} ofrece ${e}`, (await info()).startsWith(`${e} preguntas, ${e} minutos`), await info());
}
await chip('Tipo de simulacro', 'Completo').click();
await chip('Cantidad de preguntas', '10').click();

// ---------- Simulacro completo con 10 ----------
async function recorrer(N, { estrategia, tipoEsperado }) {
  const vistas = [];
  const info1 = [];
  for (let i = 0; i < N; i++) {
    const sec = page.locator('section.pregunta');
    const lab = await sec.getAttribute('aria-label');
    if (lab !== `Pregunta ${i + 1} de ${N}`) info1.push(`aria-label ${lab}`);
    const enun = norm(await sec.locator('.texto').textContent());
    const q = porEnun.get(enun);
    if (!q) { info1.push(`enunciado desconocido q${i + 1}`); vistas.push(null); await page.getByRole('button', { name: 'Siguiente', exact: true }).click().catch(() => {}); continue; }
    vistas.push(q);
    const tag = norm(await sec.locator('.tag').nth(1).textContent());
    if ((tag === 'Verdadero o falso') !== q.esVF) info1.push(`${q.id}: tipo ${tag}`);
    if (q.esVF) {
      const e = estrategia(i, q);
      if (e === 'correcta' || e === 'incorrecta') {
        const v = e === 'correcta' ? q.verdadera : !q.verdadera;
        const b = sec.getByRole('button', { name: v ? 'Verdadero' : 'Falso', exact: true });
        await b.click();
        if ((await b.getAttribute('aria-pressed')) !== 'true') info1.push(`${q.id}: no se marca`);
      }
    } else {
      const e = estrategia(i, q);
      if (e === 'texto') {
        await sec.locator('textarea').fill(`Mi respuesta ${i + 1}`);
      }
    }
    if (i < N - 1) await page.getByRole('button', { name: 'Siguiente', exact: true }).click();
  }
  return { vistas, info1 };
}

await empezar.click();
await page.waitForSelector('section.pregunta');
const N1 = 10;
const reloj0 = norm(await page.locator('[role="timer"]').textContent());
check('Simulacro: cronómetro arranca en 10:00', reloj0 === '10:00' || reloj0 === '9:59', reloj0);
await page.waitForTimeout(2200);
const reloj1 = norm(await page.locator('[role="timer"]').textContent());
check('Simulacro: el cronómetro avanza', reloj1 !== reloj0 && /^\d+:\d{2}$/.test(reloj1), `${reloj0} -> ${reloj1}`);
check('Simulacro: "Anterior" deshabilitado en la primera', await page.getByRole('button', { name: 'Anterior', exact: true }).isDisabled());
check('Simulacro: mapa de 10 preguntas con la 1 activa', (await page.locator('.navgrid button').count()) === 10 && (await page.locator('.navgrid button[aria-current="step"]').getAttribute('aria-label')) === 'Pregunta 1');
// marcar para revisar
const marcar = page.getByRole('button', { name: /Marcar para revisar|Marcada para revisar/ });
await marcar.click();
check('Simulacro: marcar para revisar', norm(await marcar.textContent()) === 'Marcada para revisar' && (await page.locator('.navgrid button').first().getAttribute('aria-label')).includes('marcada') && (await page.locator('.navgrid .flagdot').count()) === 1);
await marcar.click();
check('Simulacro: desmarcar', norm(await marcar.textContent()) === 'Marcar para revisar' && (await page.locator('.navgrid .flagdot').count()) === 0);
await marcar.click(); // dejar marcada la 1
// V/F: alternar respuesta
// Se recorre con estrategia: pares correctas, impares incorrectas, abiertas con texto en pares
const estr = (i, q) => (q.esVF ? (i % 2 === 0 ? 'correcta' : 'incorrecta') : i % 2 === 0 ? 'texto' : 'nada');
const rec = await recorrer(N1, { estrategia: estr });
check('Simulacro: recorrido y respuestas', rec.info1.length === 0, rec.info1.slice(0, 4).join(' || '));
check('Simulacro: "Siguiente" deshabilitado en la última', await page.getByRole('button', { name: 'Siguiente', exact: true }).isDisabled());
// toggle V/F: pulsar de nuevo la opción la deselecciona
const ultima = rec.vistas[N1 - 1];
if (ultima?.esVF) {
  const v = (N1 - 1) % 2 === 0 ? ultima.verdadera : !ultima.verdadera;
  const b = page.locator('section.pregunta').getByRole('button', { name: v ? 'Verdadero' : 'Falso', exact: true });
  await b.click();
  check('Simulacro: pulsar de nuevo deselecciona', (await b.getAttribute('aria-pressed')) === 'false');
  await b.click();
}
// mapa de preguntas: ir a una específica
await page.locator('.navgrid button').nth(3).click();
check('Simulacro: el mapa de preguntas navega', norm(await page.locator('section.pregunta .tag').first().textContent()) === 'Pregunta 4 de 10' && (await page.locator('.navgrid button[aria-current="step"]').getAttribute('aria-label')).startsWith('Pregunta 4'));
await page.locator('.navgrid button').nth(0).click();
check('Simulacro: la pregunta marcada conserva la marca', norm(await marcar.textContent()) === 'Marcada para revisar');
// texto conservado al volver
const primerAb = rec.vistas.findIndex((q, i) => q && !q.esVF && i % 2 === 0);
if (primerAb >= 0) {
  await page.locator('.navgrid button').nth(primerAb).click();
  check('Simulacro: el texto escrito se conserva', (await page.locator('textarea').inputValue()) === `Mi respuesta ${primerAb + 1}`);
}
const sinCont = rec.vistas.reduce((a, q, i) => a + (q && (q.esVF || i % 2 === 0) ? 1 : 0), 0);
const resumenTxt = norm(await page.locator('aside .card.sm .muted').textContent());
check('Simulacro: contador de respondidas', resumenTxt === `${sinCont} respondidas, ${N1 - sinCont} sin responder.` || resumenTxt === `${sinCont} respondida, ${N1 - sinCont} sin responder.`, `${resumenTxt} vs ${sinCont}`);
await page.screenshot({ path: '/tmp/shots/c-simulacro-run.png' });
// Entregar -> diálogo -> seguir
await page.getByRole('button', { name: 'Entregar', exact: true }).click();
const dlg = page.getByRole('alertdialog', { name: 'Confirmar entrega' });
check('Simulacro: diálogo de entrega con preguntas sin responder', (await dlg.textContent()).includes(`Te quedan ${N1 - sinCont} preguntas sin responder.`) || (await dlg.textContent()).includes(`Te quedan ${N1 - sinCont} pregunta sin responder.`), norm(await dlg.textContent()));
await dlg.getByRole('button', { name: 'Seguir' }).click();
check('Simulacro: "Seguir" cierra el diálogo y conserva el simulacro', (await dlg.count()) === 0 && (await page.locator('section.pregunta').count()) === 1);
await page.getByRole('button', { name: 'Entregar', exact: true }).click();
await dlg.getByRole('button', { name: 'Entregar ahora' }).click();

// Fase de corrección
const abiertas = rec.vistas.filter((q) => q && !q.esVF);
await page.waitForSelector('h1');
const h1g = norm(await page.locator('h1').textContent());
check('Simulacro: con abiertas pasa a "Corrige tus abiertas"', h1g === 'Corrige tus abiertas', h1g);
const lis = page.locator('ul.col.g20 > li.pregunta');
check(`Simulacro: ${abiertas.length} abiertas por corregir`, (await lis.count()) === abiertas.length, await lis.count());
check('Simulacro: "Ver el balance" deshabilitado al inicio', await page.getByRole('button', { name: 'Ver el balance' }).isDisabled() && (await page.getByText(`Faltan ${abiertas.length} abiertas por corregir.`).count() + await page.getByText(`Faltan ${abiertas.length} abierta por corregir.`).count()) === 1);
const malosG = [];
let tenia = 0;
for (let k = 0; k < abiertas.length; k++) {
  const li = lis.nth(k);
  const enun = norm(await li.locator('p.d').textContent());
  const q = porEnun.get(enun);
  if (!q) { malosG.push(`enunciado desconocido ${k}`); continue; }
  const idxOriginal = rec.vistas.findIndex((v) => v && v.id === q.id);
  const escrito = idxOriginal % 2 === 0 ? `Mi respuesta ${idxOriginal + 1}` : 'Sin respuesta';
  const lo = norm(await li.locator('p.muted').textContent());
  if (lo !== escrito) malosG.push(`${q.id}: lo respondido "${lo}" vs "${escrito}"`);
  const fic = norm(await li.locator('.respuesta .t').textContent());
  if (fic !== norm(q.respuesta)) malosG.push(`${q.id}: respuesta de la ficha distinta`);
  const si = k % 2 === 0;
  await li.getByRole('button', { name: si ? 'La tenía' : 'No la tenía', exact: true }).click();
  if ((await li.getByRole('button', { name: si ? 'La tenía' : 'No la tenía', exact: true }).getAttribute('aria-pressed')) !== 'true') malosG.push(`${q.id}: aria-pressed`);
  if (si) tenia++;
  if (k === 0) {
    // cambiar de opinión
    await li.getByRole('button', { name: 'No la tenía', exact: true }).click();
    await li.getByRole('button', { name: 'La tenía', exact: true }).click();
  }
}
check('Simulacro: autocorrección muestra lo escrito y la ficha', malosG.length === 0, malosG.slice(0, 3).join(' || '));
await page.screenshot({ path: '/tmp/shots/c-simulacro-grade.png', fullPage: true });
check('Simulacro: "Ver el balance" se habilita al corregir todas', !(await page.getByRole('button', { name: 'Ver el balance' }).isDisabled()));
await page.getByRole('button', { name: 'Ver el balance' }).click();
await page.waitForSelector('section[aria-label="Balance del simulacro"]');

// Balance esperado
let okEsp = 0;
rec.vistas.forEach((q, i) => { if (q && q.esVF && i % 2 === 0) okEsp++; });
okEsp += tenia;
const h1r = norm(await page.locator('section[aria-label="Balance del simulacro"] h1').textContent());
check('Simulacro: balance correcto', h1r === `${okEsp} de ${N1}`, `${h1r} vs ${okEsp} de ${N1}`);
const nota = pct(okEsp, N1);
const lead = norm(await page.locator('section[aria-label="Balance del simulacro"] .lead').textContent());
check('Simulacro: porcentaje y veredicto', lead.startsWith(`${nota}% de aciertos en `) && (nota >= 80 ? lead.includes('Lista para el parcial') : nota >= 60 ? lead.includes('Vas bien') : lead.includes('Todavía hay huecos')), lead);
check('Simulacro: medidor accesible', (await page.locator('svg[role="img"]').first().getAttribute('aria-label')) === `Resultado: ${nota} por ciento`);
const porLec = await page.locator('section[aria-label="Resultado por lectura"] li .row.between span').allTextContents();
const sumas = porLec.map((t) => /^(\d+) de (\d+)$/.exec(norm(t))).map((m) => [Number(m[1]), Number(m[2])]);
check('Simulacro: "Por lectura" suma el total', sumas.reduce((a, s) => a + s[1], 0) === N1 && sumas.reduce((a, s) => a + s[0], 0) === okEsp, JSON.stringify(sumas));
check('Simulacro: revisión lista todas', (await page.locator('section[aria-label="Revisión de preguntas"] li.par').count()) === N1);
check('Simulacro: aciertos y fallos en la revisión', (await page.locator('li.par .pill.green').count()) === okEsp && (await page.locator('li.par .pill.red').count()) === N1 - okEsp);
const vfRev = await page.locator('li.par', { hasText: 'Tu respuesta:' }).count();
check('Simulacro: V/F muestran "Tu respuesta"', vfRev === rec.vistas.filter((q) => q?.esVF).length, vfRev);
await page.locator('[aria-label="Filtro de revisión"] button', { hasText: 'Solo falladas' }).click();
check('Simulacro: filtro "Solo falladas"', (await page.locator('section[aria-label="Revisión de preguntas"] li.par').count()) === N1 - okEsp && (okEsp === N1 || (await page.locator('li.par .pill.green').count()) === 0));
await page.locator('[aria-label="Filtro de revisión"] button', { hasText: 'Todas' }).click();
check('Simulacro: filtro "Todas" restaura', (await page.locator('section[aria-label="Revisión de preguntas"] li.par').count()) === N1);
await page.screenshot({ path: '/tmp/shots/c-simulacro-result.png', fullPage: true });
let p = await leerProg(page);
check('Simulacro: se guardó un intento', p.sims?.length === 1 && p.sims[0].total === N1 && p.sims[0].ok === okEsp && p.sims[0].falladas.length === N1 - okEsp, JSON.stringify(p.sims?.[0]).slice(0, 200));
check('Simulacro: cada pregunta contó una vez en el progreso', rec.vistas.every((q) => q && p.q?.[q.id]?.n === 1), rec.vistas.filter((q) => q && p.q?.[q.id]?.n !== 1).length);
check('Simulacro: el progreso refleja acierto o fallo', rec.vistas.every((q, i) => { const a = q.esVF ? i % 2 === 0 : (abiertas.findIndex((x) => x.id === q.id) % 2 === 0); return p.q[q.id].last === a; }));
// Recargar el resultado no duplica
await page.getByRole('button', { name: 'Otro simulacro' }).click();
await empezar.waitFor();
p = await leerProg(page);
check('Simulacro: "Otro simulacro" no duplica el intento', p.sims.length === 1);
check('Simulacro: historial con el intento', (await page.locator('section[aria-label="Intentos anteriores"] li').count()) === 1 && norm(await page.locator('section[aria-label="Intentos anteriores"] li b').first().textContent()).startsWith(`${okEsp} de ${N1} (${nota}%)`), norm(await page.locator('section[aria-label="Intentos anteriores"]').innerText()).slice(0, 150));

// ---------- Solo V/F: sin fase de corrección ----------
await chip('Tipo de simulacro', 'Solo verdadero o falso').click();
await chip('Cantidad de preguntas', '10').click();
await empezar.click();
await page.waitForSelector('section.pregunta');
const rec2 = await recorrer(10, { estrategia: (i) => (i < 7 ? 'correcta' : 'nada') });
check('Simulacro V/F: recorrido', rec2.info1.length === 0 && rec2.vistas.every((q) => q?.esVF), rec2.info1.join('|'));
await page.getByRole('button', { name: 'Entregar', exact: true }).click();
await page.getByRole('alertdialog').getByRole('button', { name: 'Entregar ahora' }).click();
await page.waitForSelector('section[aria-label="Balance del simulacro"]');
check('Simulacro V/F: salta directo al balance (7 de 10)', norm(await page.locator('section[aria-label="Balance del simulacro"] h1').textContent()) === '7 de 10');
check('Simulacro V/F: sin respuesta aparece como "sin responder"', (await page.locator('li.par', { hasText: 'Tu respuesta: sin responder' }).count()) === 3);
await page.getByRole('link', { name: 'Volver al mapa' }).click();
await page.waitForSelector('.map-desk');
check('Simulacro: "Volver al mapa" y último intento en el mapa', (await page.locator('a.acceso', { hasText: 'Hora pico' }).innerText()).includes('Último intento: 7 de 10'), await page.locator('a.acceso', { hasText: 'Hora pico' }).innerText());

// ---------- Solo abiertas, todas contestadas, ninguna sabida ----------
await page.goto(`${BASE}/simulacro`);
await empezar.waitFor();
check('Simulacro: el historial persiste tras navegar (2 intentos)', (await page.locator('section[aria-label="Intentos anteriores"] li').count()) === 2);
await chip('Tipo de simulacro', 'Solo abiertas').click();
await chip('Cantidad de preguntas', '10').click();
await empezar.click();
await page.waitForSelector('section.pregunta');
const rec3 = await recorrer(10, { estrategia: () => 'texto' });
await page.getByRole('button', { name: 'Entregar', exact: true }).click();
check('Simulacro: diálogo con todas respondidas', (await page.getByRole('alertdialog').textContent()).includes('Respondiste todas las preguntas.'));
await page.getByRole('alertdialog').getByRole('button', { name: 'Entregar ahora' }).click();
await page.waitForSelector('ul.col.g20 > li.pregunta');
const lis3 = page.locator('ul.col.g20 > li.pregunta');
for (let k = 0; k < 10; k++) await lis3.nth(k).getByRole('button', { name: 'No la tenía', exact: true }).click();
await page.getByRole('button', { name: 'Ver el balance' }).click();
await page.waitForSelector('section[aria-label="Balance del simulacro"]');
check('Simulacro abiertas: 0 de 10 con veredicto de huecos', norm(await page.locator('section[aria-label="Balance del simulacro"] h1').textContent()) === '0 de 10' && (await page.locator('section[aria-label="Balance del simulacro"] .lead').textContent()).includes('Todavía hay huecos'));
await page.locator('[aria-label="Filtro de revisión"] button', { hasText: 'Solo falladas' }).click();
check('Simulacro abiertas: 10 falladas en la revisión', (await page.locator('section[aria-label="Revisión de preguntas"] li.par').count()) === 10);
// Ahora un simulacro con 10 aciertos para ver "No fallaste ninguna"
await page.getByRole('button', { name: 'Otro simulacro' }).click();
await empezar.waitFor();
await chip('Tipo de simulacro', 'Por semana').click();
await page.locator('select').selectOption('1');
await chip('Cantidad de preguntas', '10').click();
await empezar.click();
await page.waitForSelector('section.pregunta');
await recorrer(10, { estrategia: () => 'nada' });
await page.getByRole('button', { name: 'Entregar', exact: true }).click();
await page.getByRole('alertdialog').getByRole('button', { name: 'Entregar ahora' }).click();
await page.waitForSelector('ul.col.g20 > li.pregunta');
const lis4 = page.locator('ul.col.g20 > li.pregunta');
const n4 = await lis4.count();
check('Simulacro por semana: 10 abiertas de la semana 1', n4 === 10);
const lecturasS1 = new Set(bancos.filter((x) => x.f.semana === 1).map((x) => x.f.lectura));
const enS1 = (await lis4.locator('.tag').allTextContents()).every((t) => /Gutiérrez|CEPAL/.test(t));
check('Simulacro por semana: todas son de la semana 1', enS1);
for (let k = 0; k < n4; k++) await lis4.nth(k).getByRole('button', { name: 'La tenía', exact: true }).click();
await page.getByRole('button', { name: 'Ver el balance' }).click();
await page.waitForSelector('section[aria-label="Balance del simulacro"]');
check('Simulacro: 10 de 10 y lista de verdad', norm(await page.locator('section[aria-label="Balance del simulacro"] h1').textContent()) === '10 de 10' && (await page.locator('section[aria-label="Balance del simulacro"] .lead').textContent()).includes('Lista para el parcial'));
await page.locator('[aria-label="Filtro de revisión"] button', { hasText: 'Solo falladas' }).click();
check('Simulacro: "No fallaste ninguna."', (await page.getByText('No fallaste ninguna.').count()) === 1);
p = await leerProg(page);
check('Simulacro: 4 intentos guardados', p.sims.length === 4, p.sims.length);

// ---------- Cronómetro: vence y entrega solo ----------
const ctx2 = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const pg = await ctx2.newPage();
vigilar(pg, 'simulacro-reloj');
await pg.clock.install();
await pg.goto(`${BASE}/simulacro`);
await pg.getByRole('button', { name: 'Empezar el simulacro' }).waitFor();
await pg.locator('[aria-label="Tipo de simulacro"] button', { hasText: 'Solo verdadero o falso' }).click();
await pg.locator('[aria-label="Cantidad de preguntas"] button', { hasText: '10' }).click();
await pg.getByRole('button', { name: 'Empezar el simulacro' }).click();
await pg.waitForSelector('[role="timer"]');
await pg.clock.fastForward('09:00');
check('Cronómetro: a los 9 minutos queda 1:00 aprox.', /^(01:00|00:5\d)$/.test(norm(await pg.locator('[role="timer"]').textContent())), norm(await pg.locator('[role="timer"]').textContent()));
await pg.clock.fastForward('01:30');
await pg.waitForSelector('section[aria-label="Balance del simulacro"]', { timeout: 5000 }).catch(() => {});
check('Cronómetro: al vencer se entrega solo', (await pg.locator('section[aria-label="Balance del simulacro"]').count()) === 1, await pg.locator('main').innerText().then((t) => t.slice(0, 80)));
check('Cronómetro: simulacro vencido sin respuestas = 0 de 10', norm(await pg.locator('section[aria-label="Balance del simulacro"] h1').textContent()) === '0 de 10');
const pp = await pg.evaluate(() => JSON.parse(localStorage.getItem('mt.prog.v1')));
check('Cronómetro: tiempo usado = tiempo total (600 s)', pp.sims?.[0]?.seg === 600, pp.sims?.[0]?.seg);
await ctx2.close();

// ---------- Móvil ----------
const ctxM = await browser.newContext({ viewport: { width: 390, height: 844 } });
const pm = await ctxM.newPage();
vigilar(pm, 'simulacro-movil');
await pm.goto(`${BASE}/simulacro`);
await pm.getByRole('button', { name: 'Empezar el simulacro' }).waitFor();
await pm.locator('[aria-label="Tipo de simulacro"] button', { hasText: 'Completo' }).click();
await pm.locator('[aria-label="Cantidad de preguntas"] button', { hasText: '10' }).click();
await pm.getByRole('button', { name: 'Empezar el simulacro' }).click();
await pm.waitForSelector('section.pregunta');
check('Simulacro móvil: sin desbordamiento en curso', await pm.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), await pm.evaluate(() => document.documentElement.scrollWidth));
await pm.screenshot({ path: '/tmp/shots/c-simulacro-run-mov.png', fullPage: true });
await pm.getByRole('button', { name: 'Entregar', exact: true }).click();
await pm.getByRole('alertdialog').getByRole('button', { name: 'Entregar ahora' }).click();
await pm.waitForTimeout(400);
if (await pm.locator('ul.col.g20 > li.pregunta').count()) {
  check('Simulacro móvil: sin desbordamiento al corregir', await pm.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1));
  const ls = pm.locator('ul.col.g20 > li.pregunta');
  for (let k = 0; k < (await ls.count()); k++) await ls.nth(k).getByRole('button', { name: 'No la tenía', exact: true }).click();
  await pm.getByRole('button', { name: 'Ver el balance' }).click();
}
await pm.waitForSelector('section[aria-label="Balance del simulacro"]');
check('Simulacro móvil: sin desbordamiento en el balance', await pm.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), await pm.evaluate(() => document.documentElement.scrollWidth));
await pm.screenshot({ path: '/tmp/shots/c-simulacro-result-mov.png', fullPage: true });
await ctxM.close();

fs.writeFileSync('/tmp/partC4.json', JSON.stringify(results));
resumen();
await browser.close();
