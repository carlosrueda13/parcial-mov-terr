import indice from '../../../content/banco/index.json';
import { ETIQUETAS } from './config';
import { clave } from './util';

export type Nivel = 'contraste' | 'aplicacion' | 'interpretacion' | 'calculo' | 'grafica' | 'causa';
export type Pregunta = {
  id: string;
  n_ficha: number | null;
  tipo: 'vf' | 'abierta' | 'mcq' | 'vfbloque' | 'completar';
  enunciado: string;
  respuesta: string | null;
  referencia: string | null;
  estado: 'completa' | 'sin_respuesta';
  verdadera?: boolean | null;
  explicacion?: string;
  // Solo mcq (comprensión): se barajan al mostrarlas.
  afirmaciones?: Afirmacion[]; // solo vfbloque
  // Solo completar: huecos con su respuesta (índice en banco), texto con {id} y figura con marcadores.
  huecos?: Hueco[];
  banco?: string[];
  texto?: string;
  figura?: string;
  ocultos?: string[];
  opciones?: string[];
  correcta?: number;
  errores?: (string | null)[];
  concepto?: string;
  nivel?: Nivel;
  clase?: string | null;
};
export type Hueco = { id: string; correcta: number; explicacion: string };
export type Afirmacion = { texto: string; verdadera: boolean; explicacion: string };
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
  mcq?: number;
  completar?: number;
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
  enunciado: string;
  respuesta: string;
  referencia: string | null;
  // Retroalimentación opcional (las preguntas de comprensión la traen; las del repaso no).
  explicacion?: string | null;
  concepto?: string;
  nivel?: Nivel;
  clase?: string | null;
  // Figura (esquema) que acompaña a la pregunta; ver components/Figura.tsx.
  figura?: string;
} & (
  | { tipo: 'vf'; verdadera: boolean }
  | { tipo: 'abierta' }
  | { tipo: 'opcion'; opciones: string[]; correcta: number; errores?: (string | null)[] }
  | { tipo: 'vfbloque'; afirmaciones: Afirmacion[] }
  | { tipo: 'completar'; huecos: Hueco[]; banco: string[]; texto?: string; ocultos?: string[] }
);

export const TIPO_PREGUNTA: Record<Item['tipo'], string> = {
  vf: 'Verdadero o falso',
  abierta: 'Abierta',
  opcion: 'Selección única',
  vfbloque: 'Bloque de afirmaciones V/F',
  completar: 'Completar o ubicar',
};

export const NOMBRE_NIVEL: Record<Nivel, string> = {
  contraste: 'Contraste de conceptos',
  aplicacion: 'Aplicación a un caso',
  interpretacion: 'Interpretación',
  calculo: 'Cálculo',
  grafica: 'Lectura de gráfica',
  causa: 'Causa y consecuencia',
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
    .map((p): Item => {
      const base = {
        id: p.id, semana: b.semana, lectura: b.lectura,
        enunciado: p.enunciado, respuesta: p.respuesta as string, referencia: p.referencia,
        explicacion: p.explicacion ?? null, concepto: p.concepto, nivel: p.nivel, clase: p.clase ?? null,
        ...(p.figura ? { figura: p.figura } : {}),
      };
      if (p.tipo === 'mcq' && p.opciones && typeof p.correcta === 'number') {
        return { ...base, tipo: 'opcion', opciones: p.opciones, correcta: p.correcta, errores: p.errores };
      }
      if (p.tipo === 'completar' && p.huecos?.length && p.banco?.length) {
        return { ...base, tipo: 'completar', huecos: p.huecos, banco: p.banco, texto: p.texto, ocultos: p.ocultos };
      }
      if (p.tipo === 'vfbloque' && p.afirmaciones?.length) {
        return { ...base, tipo: 'vfbloque', afirmaciones: p.afirmaciones };
      }
      // Un V/F cuya respuesta matiza ("el texto lo dice, pero...") se trata como pregunta abierta.
      return p.tipo === 'vf' && typeof p.verdadera === 'boolean'
        ? { ...base, tipo: 'vf', verdadera: p.verdadera }
        : { ...base, tipo: 'abierta' };
    });
}

// Las preguntas de ficha llevan -q y las de comprensión -m; las trampas (-t) y pares (-p) no se registran en prog.q.
export const prefijoPreguntas = (semana: number, lectura: string) => `${clave(semana, lectura)}-`;
