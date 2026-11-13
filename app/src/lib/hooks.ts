import { useEffect, useMemo, useState } from 'react';
import { Banco, FilaIndice, Item, Par, Trampa, cargarBancos, itemsDe } from './data';

// Carga los bancos de las lecturas pedidas. Devuelve null mientras carga.
export function useBancos(filas: FilaIndice[]): Banco[] | null {
  const [bancos, setBancos] = useState<Banco[] | null>(null);
  const clave = filas.map((f) => f.lectura).join('|');
  useEffect(() => {
    let vivo = true;
    setBancos(null);
    cargarBancos(filas).then((b) => vivo && setBancos(b));
    return () => {
      vivo = false;
    };
  }, [clave]);
  return bancos;
}

export function useContenido(filas: FilaIndice[]) {
  const bancos = useBancos(filas);
  return useMemo(() => {
    if (!bancos) return null;
    const items: Item[] = [];
    const trampas: (Trampa & { semana: number; lectura: string })[] = [];
    const pares: (Par & { semana: number; lectura: string })[] = [];
    for (const b of bancos) {
      items.push(...itemsDe(b));
      for (const t of b.trampas) trampas.push({ ...t, semana: b.semana, lectura: b.lectura });
      for (const p of b.pares) pares.push({ ...p, semana: b.semana, lectura: b.lectura });
    }
    return { items, trampas, pares };
  }, [bancos]);
}
