import type { Item } from '../lib/data';

export type ItemBloque = Extract<Item, { tipo: 'vfbloque' }>;

// Bloque de afirmaciones verdadero/falso, como en el control: cada afirmación se marca por separado.
// `respuestas[i]` es undefined mientras no se elige. Con `revelar`, marca cada una y explica por qué.
export function BloqueVF({
  item,
  respuestas,
  onResponder,
  revelar = false,
}: {
  item: ItemBloque;
  respuestas: (boolean | undefined)[];
  onResponder?: (i: number, v: boolean) => void;
  revelar?: boolean;
}) {
  return (
    <ol className="col g12" style={{ maxWidth: 900, listStyle: 'none', padding: 0 }} aria-label="Afirmaciones">
      {item.afirmaciones.map((a, i) => {
        const r = respuestas[i];
        const acierta = r === a.verdadera;
        const borde = revelar ? (acierta ? 'var(--green)' : 'var(--red)') : 'var(--ink)';
        const fondo = revelar ? (acierta ? 'var(--greenSoft)' : 'var(--redSoft)') : 'var(--paper)';
        return (
          <li key={i} className="col g8" style={{ border: `3px solid ${borde}`, background: fondo, borderRadius: 18, padding: '14px 18px' }}>
            <p style={{ fontSize: 18, lineHeight: 1.4 }}><b>{i + 1}.</b> {a.texto}</p>
            <div className="row g8" role="group" aria-label={`Afirmación ${i + 1}`}>
              {[{ v: true, t: 'Verdadero' }, { v: false, t: 'Falso' }].map((o) => {
                const sel = r === o.v;
                const esLaCorrecta = revelar && a.verdadera === o.v;
                return (
                  <button
                    key={String(o.v)}
                    type="button"
                    className="chip press"
                    data-vf={`${i}-${o.v ? 'v' : 'f'}`}
                    aria-pressed={sel}
                    disabled={revelar}
                    style={{
                      background: sel ? (revelar ? (acierta ? 'var(--green)' : 'var(--red)') : 'var(--blue)') : 'var(--paper)',
                      color: sel ? '#fff' : 'var(--ink)',
                      border: `3px solid ${esLaCorrecta ? 'var(--green)' : 'var(--ink)'}`,
                      opacity: 1,
                    }}
                    onClick={() => onResponder?.(i, o.v)}
                  >
                    {o.t}{esLaCorrecta ? ' (correcta)' : ''}
                  </button>
                );
              })}
            </div>
            {revelar && <p style={{ fontSize: 17 }}><b>{a.verdadera ? 'Verdadera.' : 'Falsa.'}</b> {a.explicacion}</p>}
          </li>
        );
      })}
    </ol>
  );
}

export const bloqueCompleto = (item: ItemBloque, r: (boolean | undefined)[] | undefined) =>
  !!r && item.afirmaciones.every((_, i) => r[i] !== undefined);
export const bloqueAciertos = (item: ItemBloque, r: (boolean | undefined)[] | undefined) =>
  item.afirmaciones.filter((a, i) => r?.[i] === a.verdadera).length;
