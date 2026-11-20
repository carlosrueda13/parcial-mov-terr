import { Fragment } from 'react';
import type { Item } from '../lib/data';
import { Figura } from './Figura';

const INK = 'var(--ink)';

export type ItemCompletar = Extract<Item, { tipo: 'completar' }>;
export type RespCompletar = (number | undefined)[];

// Ejercicio de completar un texto o ubicar etiquetas en una figura. Cada hueco se llena con un término del banco.
// `respuestas[i]` es el índice del banco elegido para el hueco i (undefined mientras no se elige).
export function Completar({
  item,
  respuestas,
  onResponder,
  revelar = false,
}: {
  item: ItemCompletar;
  respuestas: RespCompletar;
  onResponder?: (i: number, v: number | undefined) => void;
  revelar?: boolean;
}) {
  const ids = item.huecos.map((h) => h.id);
  const idx = (id: string) => ids.indexOf(id);

  const selector = (i: number) => {
    const h = item.huecos[i];
    const r = respuestas[i];
    const ok = r === h.correcta;
    return (
      <select
        aria-label={`Hueco ${h.id}`}
        data-hueco={h.id}
        value={r === undefined ? '' : String(r)}
        disabled={revelar}
        onChange={(e) => onResponder?.(i, e.target.value === '' ? undefined : Number(e.target.value))}
        style={{
          fontSize: 17, fontWeight: 700, padding: '6px 8px', borderRadius: 12, maxWidth: '100%',
          border: `3px solid ${revelar ? (ok ? 'var(--green)' : 'var(--red)') : INK}`,
          background: revelar ? (ok ? 'var(--greenSoft)' : 'var(--redSoft)') : 'var(--paper)',
        }}
      >
        <option value="">{`(${h.id}) elige…`}</option>
        {item.banco.map((t, j) => <option key={j} value={j}>{t}</option>)}
      </select>
    );
  };

  const partes = item.texto ? item.texto.split(/(\{[^}]+\})/g) : null;

  return (
    <div className="col g16" style={{ maxWidth: 900 }}>
      {item.figura && <Figura id={item.figura} marcas={partes ? [] : ids} ocultos={item.ocultos} />}

      <div className="col g8" aria-label="Banco de términos">
        <b>Banco de términos</b>
        <ul className="row g8" style={{ flexWrap: 'wrap', listStyle: 'none', padding: 0 }}>
          {item.banco.map((t, j) => <li key={j} className="pill">{t}</li>)}
        </ul>
      </div>

      {partes ? (
        <p style={{ fontSize: 19, lineHeight: 2.1 }} data-texto-completar>
          {partes.map((p, k) => {
            const m = /^\{([^}]+)\}$/.exec(p);
            if (!m) return <Fragment key={k}>{p}</Fragment>;
            const i = idx(m[1]);
            return i < 0 ? <Fragment key={k}>{p}</Fragment> : <span key={k}><b>({m[1]})</b> {selector(i)} </span>;
          })}
        </p>
      ) : (
        <ol className="col g8" style={{ listStyle: 'none', padding: 0 }} aria-label="Puntos de la figura">
          {item.huecos.map((h, i) => (
            <li key={h.id} className="row center g12" style={{ flexWrap: 'wrap' }}>
              <span className="pill" style={{ background: '#fde047' }}><b>Punto {h.id}</b></span>
              {selector(i)}
            </li>
          ))}
        </ol>
      )}

      {revelar && (
        <ul className="col g8" style={{ listStyle: 'none', padding: 0 }} aria-label="Corrección por hueco">
          {item.huecos.map((h, i) => {
            const ok = respuestas[i] === h.correcta;
            return (
              <li key={h.id} style={{ border: `3px solid ${ok ? 'var(--green)' : 'var(--red)'}`, background: ok ? 'var(--greenSoft)' : 'var(--redSoft)', borderRadius: 14, padding: '10px 14px', fontSize: 17 }}>
                <b>{h.id}.</b> {ok ? 'Correcto' : `Respuesta: ${item.banco[h.correcta]}`}
                {!ok && respuestas[i] !== undefined && <> (elegiste «{item.banco[respuestas[i] as number]}»)</>}. {h.explicacion}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export const completarCompleto = (item: ItemCompletar, r: RespCompletar | undefined) =>
  !!r && item.huecos.every((_, i) => r[i] !== undefined);
export const completarAciertos = (item: ItemCompletar, r: RespCompletar | undefined) =>
  item.huecos.filter((h, i) => r?.[i] === h.correcta).length;
