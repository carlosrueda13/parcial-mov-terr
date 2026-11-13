// Pruebas de extremo a extremo con Playwright. Requieren la app en http://127.0.0.1:4173
// (cd app && npm run build && npx vite preview --port 4173 --host 127.0.0.1).
// Variables opcionales: PLAYWRIGHT_PATH (módulo de playwright) y CHROME_PATH (ejecutable de Chrome).
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
const { chromium } = await import(process.env.PLAYWRIGHT_PATH || 'playwright');
export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
export const BASE = 'http://127.0.0.1:4173/#';
export const indice = JSON.parse(fs.readFileSync(`${ROOT}/content/banco/index.json`, 'utf8'));
export function banco(f) {
  return JSON.parse(fs.readFileSync(`${ROOT}/content/banco/semana-${String(f.semana).padStart(2, '0')}/${f.lectura}.json`, 'utf8'));
}
export const results = [];
export const errores = [];
export function check(name, ok, detail = '') {
  results.push({ name, ok: !!ok, detail: String(detail).slice(0, 300) });
  if (!ok) console.log('  FAIL', name, '::', String(detail).slice(0, 300));
}
export async function launch() {
  return chromium.launch({ executablePath: process.env.CHROME_PATH || '/usr/bin/google-chrome', args: ['--no-sandbox'] });
}
export function vigilar(page, etiqueta) {
  page.on('console', (m) => { if (['error', 'warning'].includes(m.type())) errores.push(`[${etiqueta}] console.${m.type()}: ${m.text()}`); });
  page.on('pageerror', (e) => errores.push(`[${etiqueta}] pageerror: ${e.message}`));
  page.on('requestfailed', (r) => errores.push(`[${etiqueta}] requestfailed: ${r.url()}`));
  page.on('response', (r) => { if (r.status() >= 400) errores.push(`[${etiqueta}] HTTP ${r.status()}: ${r.url()}`); });
}
export const norm = (s) => (s ?? '').replace(/\s+/g, ' ').trim();
export function resumen() {
  const ok = results.filter((r) => r.ok).length;
  console.log(`\nCOMPROBACIONES: ${ok} correctas de ${results.length}; fallidas: ${results.length - ok}; errores de consola/red: ${errores.length}`);
  for (const e of [...new Set(errores)].slice(0, 20)) console.log('  ', e);
}
