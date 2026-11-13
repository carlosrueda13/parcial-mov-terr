import { ReactNode } from 'react';

export function Rombo({ size = 44, signo = '!' }: { size?: number; signo?: string }) {
  return (
    <svg width={size} height={size} viewBox="-24 -24 48 48" aria-hidden="true" style={{ flex: 'none' }}>
      <rect x="-15" y="-15" width="30" height="30" transform="rotate(45)" fill="#FFC629" stroke="#0E2230" strokeWidth="3.5" />
      <text x="0" y="8" textAnchor="middle" fontFamily="Overpass, sans-serif" fontSize="24" fontWeight="900" fill="#0E2230">
        {signo}
      </text>
    </svg>
  );
}

export function Barra({ valor, oscura = false, etiqueta }: { valor: number; oscura?: boolean; etiqueta: string }) {
  const v = Math.max(0, Math.min(100, valor));
  return (
    <div className={`bar${oscura ? ' dark' : ''}`} role="img" aria-label={`${etiqueta}: ${v} por ciento`}>
      <div style={{ width: `${v}%` }} />
    </div>
  );
}

export function Cargando({ texto = 'Cargando contenido' }: { texto?: string }) {
  return <p className="empty" role="status">{texto}</p>;
}

export function Vacio({ children }: { children: ReactNode }) {
  return <div className="card empty">{children}</div>;
}

export function Chips<T extends string | number>({
  opciones,
  valor,
  onChange,
  etiqueta,
}: {
  opciones: { v: T; t: string }[];
  valor: T;
  onChange: (v: T) => void;
  etiqueta: string;
}) {
  return (
    <div className="row g8" role="group" aria-label={etiqueta}>
      {opciones.map((o) => (
        <button key={String(o.v)} type="button" className="chip" aria-pressed={valor === o.v} onClick={() => onChange(o.v)}>
          {o.t}
        </button>
      ))}
    </div>
  );
}
