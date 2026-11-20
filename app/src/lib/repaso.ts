import preguntas from '../../../content/repaso-parcial.json';
import type { Item } from './data';
import { barajar } from './util';

export const REPASO = preguntas as Item[];

export function muestraRepaso(items: Item[], cantidad: number): Item[] {
  const porSemana = new Map<number, Item[]>();
  for (const item of barajar(items)) {
    const semana = porSemana.get(item.semana);
    if (semana) semana.push(item);
    else porSemana.set(item.semana, [item]);
  }
  const rondas: Item[] = [];
  const grupos = [...porSemana.values()];
  for (let i = 0; rondas.length < Math.min(items.length, cantidad); i++) {
    rondas.push(...grupos.flatMap((grupo) => grupo[i] ? [grupo[i]] : []));
  }
  return barajar(rondas.slice(0, cantidad));
}
