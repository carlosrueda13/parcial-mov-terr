import { Link } from 'react-router-dom';
import { SEMANAS, etiqueta, filaDe } from '../lib/data';
import { usarProg } from '../lib/store';

export default function LeerIndice() {
  const prog = usarProg();
  return (
    <div className="page narrow">
      <div className="col g8" style={{ maxWidth: 820 }}>
        <h1 className="h1 m d">Fichas de lectura</h1>
        <p className="lead">Una ficha por lectura, con resumen por secciones, trampas, pares de diferencias y preguntas modelo. Las páginas citadas son las del documento original.</p>
      </div>
      {SEMANAS.map((s) => (
        <section key={s.semana} className="col g12" aria-label={`Semana ${s.semana}`}>
          <h2 className="h2 d">Semana {s.semana}: {s.tema}</h2>
          <ul className="col g12">
            {s.lecturas.map((l) => {
              const f = filaDe(l.id);
              return (
                <li key={l.id}>
                  {f ? (
                    <Link className="press tile" to={`/leer/${s.semana}/${l.id}`} style={{ minHeight: 0 }}>
                      <span style={{ flex: 1 }}>
                        <b className="d">{etiqueta(l.id)}</b>
                        <small>{l.autor}. {l.titulo}</small>
                      </span>
                      {prog.leidas[l.id] && <span className="pill green">Leída</span>}
                    </Link>
                  ) : (
                    <div className="tile off" style={{ minHeight: 0 }}>
                      <span style={{ flex: 1 }}><b className="d">{etiqueta(l.id)}</b><small>{l.autor}. {l.titulo}</small></span>
                      <span className="pill red">PDF pendiente</span>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
