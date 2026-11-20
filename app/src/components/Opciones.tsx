import type { Item } from '../lib/data';

export type ItemOpcion = Extract<Item, { tipo: 'opcion' }>;

// Opciones de una pregunta de comprensión. `orden` es la permutación de índices originales que se muestra.
// Sin `revelar`, solo se elige (simulacro). Con `revelar`, marca la correcta y explica por qué falla la elegida.
export function Opciones({
  item,
  orden,
  elegida,
  onElegir,
  revelar = false,
  bloqueada = false,
}: {
  item: ItemOpcion;
  orden: number[];
  elegida: number | undefined;
  onElegir?: (original: number) => void;
  revelar?: boolean;
  bloqueada?: boolean;
}) {
  const ops = item.opciones;
  return (
    <div className="col g12" style={{ maxWidth: 860 }} role="group" aria-label="Opciones de respuesta">
      {orden.map((orig, pos) => {
        const sel = elegida === orig;
        const esCorrecta = orig === item.correcta;
        let fondo = sel ? 'var(--blue)' : 'var(--paper)';
        let color = sel ? '#fff' : 'var(--ink)';
        let borde = 'var(--ink)';
        if (revelar) {
          if (esCorrecta) { fondo = 'var(--greenSoft)'; color = 'var(--ink)'; borde = 'var(--green)'; }
          else if (sel) { fondo = 'var(--redSoft)'; color = 'var(--ink)'; borde = 'var(--red)'; }
          else { fondo = 'var(--paper)'; color = 'var(--muted)'; borde = 'var(--line)'; }
        }
        return (
          <div key={orig} className="col g8">
            <button
              type="button"
              className="opt press"
              data-op={pos}
              aria-pressed={sel}
              disabled={bloqueada}
              style={{ background: fondo, color, border: `3px solid ${borde}`, opacity: 1 }}
              onClick={() => onElegir?.(orig)}
            >
              <span className="d" style={{ fontWeight: 900, minWidth: 28 }}>{String.fromCharCode(65 + pos)}</span>
              <span style={{ flex: 1 }}>{ops[orig]}</span>
              {revelar && esCorrecta && <span className="pill green">Correcta</span>}
              {revelar && sel && !esCorrecta && <span className="pill red">Tu respuesta</span>}
            </button>
            {revelar && sel && !esCorrecta && item.errores?.[orig] && (
              <p className="respuesta mal" style={{ padding: '12px 18px', fontSize: 17 }}><b>Por qué falla.</b> {item.errores[orig]}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}

export const ordenInicial = (n: number): number[] => Array.from({ length: n }, (_, i) => i);
