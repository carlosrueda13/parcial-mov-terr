import { diasRestantes } from './config';

// Calificaciones: 0 Otra vez, 1 Difícil, 2 Bien, 3 Fácil.
export const CALIFICACIONES = [
  { k: 0, etiqueta: 'Otra vez' },
  { k: 1, etiqueta: 'Difícil' },
  { k: 2, etiqueta: 'Bien' },
  { k: 3, etiqueta: 'Fácil' },
];

export function siguienteCaja(r: number, caja: number): number {
  if (r === 0) return 0;
  if (r === 1) return Math.max(1, Math.min(caja, 1));
  if (r === 2) return caja + 1;
  return caja + 2;
}

// Los intervalos se acotan por los días que faltan para el parcial.
export function intervaloDias(r: number, caja: number): number {
  const tope = Math.max(1, Math.floor(diasRestantes() * 0.4));
  if (r === 0) return 0;
  if (r === 1) return Math.min(1, tope);
  const base = Math.pow(2, Math.max(0, siguienteCaja(r, caja) - 1));
  return Math.min(tope, Math.max(1, base));
}

export function textoCuando(r: number, caja: number): string {
  const d = intervaloDias(r, caja);
  if (d === 0) return 'hoy';
  if (d === 1) return 'mañana';
  return `en ${d} días`;
}
