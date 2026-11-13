import indice from '../../../content/banco/index.json';
import { ETIQUETAS } from './config';
import { clave } from './util';

export type Pregunta = {
  id: string;
  n_ficha: number;
  tipo: 'vf' | 'abierta';
  enunciado: string;
  respuesta: string | null;
  referencia: string | null;
  estado: 'completa' | 'sin_respuesta';
  verdadera?: boolean | null;
  explicacion?: string;
};
export type Trampa = { id: string; n_ficha: number; grupo: string | null; texto: string; referencia: string | null };
export type Par = { id: string; par: string; diferencia: string };
export type Banco = {
  semana: number;
  lectura: string;
  autor: string | null;
  titulo: string | null;
  alcance: string | null;
  fuente: string;
  preguntas: Pregunta[];
  trampas: Trampa[];
  pares: Par[];
};
export type FilaIndice = {
  semana: number;
  lectura: string;
  autor: string | null;
  titulo: string | null;
  archivo: string;
  preguntas: number;
  trampas: number;
  pares: number;
  respondibles: number;
  vf: number;
  vf_directas: number;
};
export type LecturaMeta = {
  id: string;
  autor: string;
  titulo: string;
  alcance: string;
  ficha: string | null;
  estado?: { leida?: string; nota?: string };
};
export type SemanaMeta = { semana: number; tema: string; lecturas: LecturaMeta[] };

// Elemento de práctica ya normalizado: solo preguntas con respuesta.
export type Item = {
  id: string;
  semana: number;
  lectura: string;
  tipo: 'vf' | 'abierta';
  enunciado: string;
  respuesta: string;
  referencia: string | null;
  verdadera: boolean | null;
  explicacion: string | null;
};

export const INDICE = indice as { totales: { preguntas: number; trampas: number; pares: number }; lecturas: FilaIndice[] };

const metaModulos = import.meta.glob('../../../content/semana-*/lecturas.json', { eager: true, import: 'default' });
export const SEMANAS: SemanaMeta[] = (Object.values(metaModulos) as SemanaMeta[]).sort((a, b) => a.semana - b.semana);

const cargadoresBanco = import.meta.glob('../../../content/banco/semana-*/*.json', { import: 'default' });
const cargadoresFicha = import.meta.glob('../../../content/semana-*/*/ficha.md', { query: '?raw', import: 'default' });

const cacheBanco = new Map<string, Promise<Banco>>();
export function cargarBanco(semana: number, lectura: string): Promise<Banco> {
  const ruta = `../../../content/banco/semana-${String(semana).padStart(2, '0')}/${lectura}.json`;
  let p = cacheBanco.get(ruta);
  if (!p) {
    const f = cargadoresBanco[ruta];
    p = f ? (f() as Promise<Banco>) : Promise.reject(new Error(`Sin banco para ${lectura}`));
    cacheBanco.set(ruta, p);
  }
  return p;
}

export async function cargarBancos(filas: FilaIndice[]): Promise<Banco[]> {
  return Promise.all(filas.map((f) => cargarBanco(f.semana, f.lectura)));
}

export function cargarFicha(semana: number, lectura: string): Promise<string> {
  const ruta = `../../../content/semana-${String(semana).padStart(2, '0')}/${lectura}/ficha.md`;
  const f = cargadoresFicha[ruta];
  return f ? (f() as Promise<string>) : Promise.reject(new Error(`Sin ficha para ${lectura}`));
}

export const etiqueta = (id: string) => ETIQUETAS[id] ?? id;
export const filasDeSemana = (n: number) => INDICE.lecturas.filter((l) => l.semana === n);
export const filaDe = (lectura: string) => INDICE.lecturas.find((l) => l.lectura === lectura);
export const semanaMeta = (n: number) => SEMANAS.find((s) => s.semana === n);

export function itemsDe(b: Banco): Item[] {
  return b.preguntas
    .filter((p) => p.estado === 'completa' && p.respuesta)
    .map((p) => ({
      id: p.id,
      semana: b.semana,
      lectura: b.lectura,
      // Un V/F cuya respuesta matiza ("el texto lo dice, pero...") se trata como pregunta abierta.
      tipo: p.tipo === 'vf' && typeof p.verdadera === 'boolean' ? 'vf' : 'abierta',
      enunciado: p.enunciado,
      respuesta: p.respuesta as string,
      referencia: p.referencia,
      verdadera: p.verdadera ?? null,
      explicacion: p.explicacion ?? null,
    }));
}

export const prefijoPreguntas = (semana: number, lectura: string) => `${clave(semana, lectura)}-q`;
