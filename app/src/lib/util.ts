export function barajar<T>(a: T[]): T[] {
  const r = a.slice();
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
}

export const pad2 = (n: number) => String(n).padStart(2, '0');
export const clave = (semana: number, lectura: string) => `s${pad2(semana)}-${lectura}`;
export const hoyClave = (t: number = Date.now()) => {
  const d = new Date(t);
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
};
export const reloj = (seg: number) => `${pad2(Math.floor(seg / 60))}:${pad2(seg % 60)}`;
export const pct = (a: number, b: number) => (b > 0 ? Math.round((a / b) * 100) : 0);
export const plural = (n: number, uno: string, varios: string) => `${n} ${n === 1 ? uno : varios}`;
