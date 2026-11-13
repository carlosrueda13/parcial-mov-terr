import { useSyncExternalStore } from 'react';
import { ACIERTOS_POR_KM, RANGOS } from './config';
import { intervaloDias, siguienteCaja } from './srs';
import { hoyClave } from './util';

const KEY = 'mt.prog.v1';
const DIA = 86400000;

export type QStat = { n: number; ok: number; last: boolean; t: number };
export type CStat = { caja: number; due: number; fallas: number; n: number; t: number };
export type Sim = {
  ts: number;
  tipo: string;
  total: number;
  ok: number;
  seg: number;
  porLectura: Record<string, [number, number]>;
  falladas: string[];
};
export type Prog = {
  q: Record<string, QStat>;
  c: Record<string, CStat>;
  sims: Sim[];
  dias: Record<string, number>;
  leidas: Record<string, boolean>;
  aciertos: number;
};

const vacio = (): Prog => ({ q: {}, c: {}, sims: [], dias: {}, leidas: {}, aciertos: 0 });

function cargar(): Prog {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...vacio(), ...JSON.parse(raw) };
  } catch {
    /* almacenamiento no disponible */
  }
  return vacio();
}

let prog: Prog = cargar();
const subs = new Set<() => void>();

function emitir(next: Prog) {
  prog = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(prog));
  } catch {
    /* sin almacenamiento: el progreso vive solo en memoria */
  }
  subs.forEach((f) => f());
}

export function usarProg(): Prog {
  return useSyncExternalStore(
    (f) => {
      subs.add(f);
      return () => subs.delete(f);
    },
    () => prog,
  );
}

export function registrarRespuesta(id: string, ok: boolean) {
  const prev = prog.q[id] ?? { n: 0, ok: 0, last: false, t: 0 };
  const dia = hoyClave();
  emitir({
    ...prog,
    q: { ...prog.q, [id]: { n: prev.n + 1, ok: prev.ok + (ok ? 1 : 0), last: ok, t: Date.now() } },
    dias: { ...prog.dias, [dia]: (prog.dias[dia] ?? 0) + 1 },
    aciertos: prog.aciertos + (ok ? 1 : 0),
  });
}

// Corrige la última respuesta de una pregunta abierta autocalificada después de entregar.
export function corregirUltima(id: string, ok: boolean) {
  const prev = prog.q[id];
  if (!prev || prev.last === ok) return;
  emitir({
    ...prog,
    q: { ...prog.q, [id]: { ...prev, ok: Math.max(0, prev.ok + (ok ? 1 : -1)), last: ok } },
    aciertos: Math.max(0, prog.aciertos + (ok ? 1 : -1)),
  });
}

export function calificarBoleto(id: string, r: number, esPregunta: boolean) {
  const prev = prog.c[id] ?? { caja: 0, due: 0, fallas: 0, n: 0, t: 0 };
  const caja = siguienteCaja(r, prev.caja);
  const c: CStat = {
    caja,
    fallas: prev.fallas + (r === 0 ? 1 : 0),
    n: prev.n + 1,
    due: Date.now() + intervaloDias(r, prev.caja) * DIA,
    t: Date.now(),
  };
  const dia = hoyClave();
  const siguiente: Prog = { ...prog, c: { ...prog.c, [id]: c } };
  if (esPregunta) {
    const q = prog.q[id] ?? { n: 0, ok: 0, last: false, t: 0 };
    const ok = r >= 2;
    siguiente.q = { ...prog.q, [id]: { n: q.n + 1, ok: q.ok + (ok ? 1 : 0), last: ok, t: Date.now() } };
    siguiente.aciertos = prog.aciertos + (ok ? 1 : 0);
  } else if (r >= 2) {
    siguiente.aciertos = prog.aciertos + 1;
  }
  siguiente.dias = { ...prog.dias, [dia]: (prog.dias[dia] ?? 0) + 1 };
  emitir(siguiente);
}

export function guardarSim(s: Sim) {
  emitir({ ...prog, sims: [...prog.sims, s] });
}

export function marcarLeida(lectura: string, leida: boolean) {
  emitir({ ...prog, leidas: { ...prog.leidas, [lectura]: leida } });
}

export function reiniciarTodo() {
  emitir(vacio());
}

// ---- Derivados ----

export const dominada = (q?: QStat) => !!q && q.ok >= 2 && q.last;
export const fallada = (q?: QStat) => !!q && q.n > 0 && !q.last;

export function kilometros(p: Prog): number {
  return Math.floor(p.aciertos / ACIERTOS_POR_KM);
}

export function rango(km: number) {
  let actual = RANGOS[0];
  let siguiente: (typeof RANGOS)[number] | null = null;
  for (let i = 0; i < RANGOS.length; i++) {
    if (km >= RANGOS[i].km) {
      actual = RANGOS[i];
      siguiente = RANGOS[i + 1] ?? null;
    }
  }
  return { actual, siguiente };
}

export function racha(p: Prog, ahora: number = Date.now()): number {
  let n = 0;
  let t = ahora;
  if (!p.dias[hoyClave(t)]) t -= DIA;
  while (p.dias[hoyClave(t)]) {
    n++;
    t -= DIA;
  }
  return n;
}

export function estadisticasPrefijo(p: Prog, prefijo: string) {
  let dom = 0;
  let intentos = 0;
  let fallas = 0;
  for (const id in p.q) {
    if (!id.startsWith(prefijo)) continue;
    const q = p.q[id];
    if (dominada(q)) dom++;
    if (fallada(q)) fallas++;
    intentos += q.n;
  }
  return { dom, intentos, fallas };
}
