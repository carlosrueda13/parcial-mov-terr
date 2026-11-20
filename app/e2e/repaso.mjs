import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { BASE, ROOT, errores, indice, launch, norm, vigilar } from './lib.mjs';

const preguntas = JSON.parse(fs.readFileSync(path.join(ROOT, 'content/repaso-parcial.json'), 'utf8'));
const porEnunciado = new Map(preguntas.map((p) => [p.enunciado, p]));
const lecturas = new Map();
for (let semana = 1; semana <= 8; semana++) {
  const carpeta = 'semana-' + String(semana).padStart(2, '0');
  const meta = JSON.parse(fs.readFileSync(path.join(ROOT, 'content', carpeta, 'lecturas.json'), 'utf8'));
  for (const lectura of meta.lecturas) lecturas.set(lectura.id, semana);
}
assert.equal(preguntas.length, 100);
assert.equal(porEnunciado.size, 100);
assert.equal(new Set(preguntas.map((p) => p.id)).size, 100);
assert.equal(new Set(preguntas.map((p) => p.lectura)).size, lecturas.size);
assert.deepEqual(
  Array.from({ length: 8 }, (_, i) => preguntas.filter((p) => p.semana === i + 1).length),
  [12, 12, 12, 13, 13, 12, 13, 13],
);
for (const p of preguntas) {
  assert.equal(lecturas.get(p.lectura), p.semana);
  assert.ok(p.id.startsWith('repaso-') && p.respuesta.trim() && p.referencia.trim());
  if (p.tipo === 'opcion') {
    assert.equal(new Set(p.opciones).size, 4);
    assert.ok(Number.isInteger(p.correcta) && p.opciones[p.correcta]);
  } else if (p.tipo === 'vf') {
    assert.equal(typeof p.verdadera, 'boolean');
  } else {
    assert.equal(p.tipo, 'abierta');
  }
}

// Sirve el mismo build de producción en Chromium, sin depender del puerto local.
const dist = path.join(ROOT, 'app', 'dist');
const browser = await launch();
async function pagina(opciones) {
  const context = await browser.newContext(opciones);
  await context.route('http://127.0.0.1:4173/**', async (route) => {
    const { pathname } = new URL(route.request().url());
    const relativo = pathname === '/' ? 'index.html' : pathname.slice(1);
    const archivo = path.resolve(dist, relativo);
    if (!archivo.startsWith(dist + path.sep) || !fs.existsSync(archivo)) {
      await route.fulfill({ status: 404 });
      return;
    }
    await route.fulfill({ path: archivo });
  });
  const page = await context.newPage();
  vigilar(page, opciones.isMobile ? 'repaso móvil' : 'repaso escritorio');
  return page;
}

try {
  const page = await pagina({ viewport: { width: 1280, height: 900 } });
  await page.goto(BASE + '/practica');
  await page.getByText('878 preguntas disponibles', { exact: true }).waitFor();
  await page.goto(BASE + '/');
  await page.getByRole('link', { name: 'Practicar las 100' }).click();
  await page.getByText('100 preguntas disponibles', { exact: true }).waitFor();
  await page.getByRole('button', { name: 'Empezar práctica' }).click();

  const vista = page.locator('section.pregunta');
  const opciones = vista.getByRole('group', { name: 'Opciones de respuesta' }).getByRole('button');
  const preguntaVisible = async () => {
    const p = porEnunciado.get(norm(await vista.locator('.texto').textContent()));
    assert.ok(p, 'El enunciado visible debe pertenecer al banco de repaso');
    return p;
  };
  const vistas = new Set();
  let fallo;
  for (let i = 0; i < preguntas.length; i++) {
    const p = await preguntaVisible();
    assert.ok(!vistas.has(p.id), 'La práctica completa no repite preguntas');
    vistas.add(p.id);
    const respuesta = vista.getByRole('status');
    if (p.tipo === 'opcion') {
      const incorrecta = !fallo;
      if (incorrecta) fallo = p;
      await opciones.nth(incorrecta ? (p.correcta + 1) % 4 : p.correcta).click();
      assert.ok((await respuesta.textContent()).includes(incorrecta ? 'Incorrecto' : 'Correcto'));
      assert.ok((await respuesta.textContent()).includes(p.opciones[p.correcta]));
    } else if (p.tipo === 'vf') {
      await vista.getByRole('button', { name: p.verdadera ? 'Verdadero' : 'Falso', exact: true }).click();
      assert.ok((await respuesta.textContent()).includes('Correcto'));
    } else {
      await vista.getByRole('button', { name: 'Mostrar la respuesta' }).click();
      await vista.getByRole('button', { name: 'La sabía', exact: true }).click();
    }
    assert.ok((await respuesta.textContent()).includes(p.respuesta));
    assert.ok((await respuesta.textContent()).includes(p.referencia));
    await vista.getByRole('button', { name: i === 99 ? 'Ver resultado' : 'Siguiente', exact: true }).click();
  }
  await page.getByRole('heading', { name: '99 de 100' }).waitFor();
  await page.getByRole('button', { name: 'Repetir las que fallé' }).click();
  assert.equal((await preguntaVisible()).id, fallo.id);
  await opciones.nth(fallo.correcta).click();
  await vista.getByRole('button', { name: 'Ver resultado' }).click();
  await page.getByRole('heading', { name: '1 de 1' }).waitFor();
  await page.getByRole('link', { name: 'Volver al mapa' }).click();
  const progreso = page.getByText('100 preguntas de las ocho semanas. Llevas 100 respondidas.');
  await progreso.waitFor();
  await page.reload();
  await progreso.waitFor();

  await page.getByRole('link', { name: 'Hacer simulacro de repaso' }).click();
  const cantidades = page.getByRole('group', { name: 'Cantidad de preguntas' });
  await cantidades.getByRole('button', { name: '100', exact: true }).click();
  await page.getByText('100 preguntas, 100 minutos (1 por pregunta)').waitFor();
  await cantidades.getByRole('button', { name: '10', exact: true }).click();
  await page.getByRole('button', { name: 'Empezar el simulacro' }).click();
  const semanas = new Set();
  let aciertos = 0;
  for (let i = 0; i < 10; i++) {
    const p = await preguntaVisible();
    semanas.add(p.semana);
    assert.equal(await vista.getByText('Respuesta correcta').count(), 0);
    if (p.tipo === 'opcion') {
      await opciones.nth(p.correcta).click();
      aciertos++;
    } else if (p.tipo === 'vf') {
      await vista.getByRole('button', { name: p.verdadera ? 'Verdadero' : 'Falso', exact: true }).click();
      aciertos++;
    }
    if (i < 9) await vista.getByRole('button', { name: 'Siguiente', exact: true }).click();
  }
  assert.equal(semanas.size, 8);
  await page.getByRole('button', { name: 'Entregar', exact: true }).click();
  await page.getByRole('button', { name: 'Entregar ahora' }).click();
  await page.getByRole('heading', { level: 1 }).waitFor();
  if (await page.getByRole('heading', { name: 'Corrige tus abiertas' }).count()) {
    for (const boton of await page.getByRole('button', { name: 'No la tenía' }).all()) await boton.click();
    await page.getByRole('button', { name: 'Ver el balance' }).click();
  }
  await page.getByRole('heading', { name: aciertos + ' de 10' }).waitFor();

  await page.getByRole('button', { name: 'Otro simulacro' }).click();
  await page.getByRole('button', { name: 'Solo cerradas', exact: true }).click();
  const cerradas = preguntas.filter((p) => p.tipo !== 'abierta');
  const cantidadCerradas = cerradas.length;
  await cantidades.getByRole('button', { name: String(cantidadCerradas), exact: true }).click();
  await page.getByText(`${cantidadCerradas} preguntas, ${cantidadCerradas} minutos (1 por pregunta)`).waitFor();
  await page.getByRole('button', { name: 'Empezar el simulacro' }).click();
  const tiposContestados = new Set();
  for (let i = 0; i < cantidadCerradas; i++) {
    const p = await preguntaVisible();
    assert.notEqual(p.tipo, 'abierta');
    assert.equal(await vista.locator('textarea').count(), 0);
    if (!tiposContestados.has(p.tipo)) {
      if (p.tipo === 'opcion') await opciones.nth(p.correcta).click();
      if (p.tipo === 'vf') await vista.getByRole('button', { name: p.verdadera ? 'Verdadero' : 'Falso', exact: true }).click();
      tiposContestados.add(p.tipo);
    }
    if (tiposContestados.size === 2) break;
    if (i < cantidadCerradas - 1) await vista.getByRole('button', { name: 'Siguiente', exact: true }).click();
  }
  assert.deepEqual(tiposContestados, new Set(['opcion', 'vf']));
  await page.getByRole('button', { name: 'Entregar', exact: true }).click();
  await page.getByRole('button', { name: 'Entregar ahora' }).click();
  await page.getByRole('heading', { name: `2 de ${cantidadCerradas}` }).waitFor();
  const revision = page.getByRole('region', { name: 'Revisión de preguntas' });
  assert.equal(await revision.getByText('Respuesta correcta', { exact: true }).count(), cantidadCerradas);

  await page.getByRole('button', { name: 'Otro simulacro' }).click();
  await page.getByRole('button', { name: 'Por semana', exact: true }).click();
  await page.getByRole('combobox').selectOption('8');
  await cantidades.getByRole('button', { name: '30', exact: true }).click();
  const cerradasS8 = cerradas.filter((p) => p.semana === 8).length
    + indice.lecturas.filter((f) => f.semana === 8).reduce((n, f) => n + f.vf_directas, 0);
  await page.getByText(`${cerradasS8} preguntas, ${cerradasS8} minutos (1 por pregunta)`).waitFor();
  await page.getByRole('button', { name: 'Empezar el simulacro' }).click();
  for (let i = 0; i < cerradasS8; i++) {
    await vista.getByText('Semana 8', { exact: true }).waitFor();
    assert.equal(await vista.locator('textarea').count(), 0);
    if (i < cerradasS8 - 1) await vista.getByRole('button', { name: 'Siguiente', exact: true }).click();
  }

  const movil = await pagina({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await movil.addInitScript(() => {
    localStorage.setItem('mt.prog.v1', JSON.stringify({
      q: { 'repaso-s08-07': { n: 1, ok: 1, last: true, t: 0 } },
    }));
  });
  await movil.goto(BASE + '/semana/8');
  await movil.getByRole('button', { name: /Viana Cerqueira/ }).click();
  await movil.getByRole('link', { name: /Practicar esta lectura/ }).click();
  assert.equal(await movil.getByLabel('Lectura', { exact: true }).inputValue(), 'viana-cerqueira-2026');
  await movil.getByRole('button', { name: 'Sin responder', exact: true }).click();
  await movil.getByText('4 preguntas disponibles', { exact: true }).waitFor();
  await movil.getByRole('button', { name: 'Selección única' }).click();
  await movil.getByText('3 preguntas disponibles', { exact: true }).waitFor();
  await movil.getByRole('button', { name: 'Empezar práctica' }).click();
  await movil.getByText('Pregunta 1 de 3', { exact: true }).waitFor();
  assert.ok(await movil.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  assert.deepEqual(errores, []);
  console.log('Repaso comprobado: 100 preguntas, progreso persistente, simulacro de las ocho semanas, solo cerradas con nota automática y filtros en móvil.');
} finally {
  await browser.close();
}
