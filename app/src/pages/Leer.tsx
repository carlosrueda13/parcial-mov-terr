import { marked } from 'marked';
import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Cargando, Vacio } from '../components/ui';
import { cargarFicha, etiqueta, filaDe } from '../lib/data';
import { marcarLeida, usarProg } from '../lib/store';

type Seccion = { id: string; titulo: string; html: string };

function partir(md: string): { cabecera: string; secciones: Seccion[] } {
  const lineas = md.replace(/\r\n/g, '\n').split('\n');
  const trozos: { titulo: string; lineas: string[] }[] = [];
  let cab: string[] = [];
  let actual: { titulo: string; lineas: string[] } | null = null;
  let enCodigo = false;
  for (const l of lineas) {
    if (/^```/.test(l)) enCodigo = !enCodigo;
    const m = !enCodigo && /^##\s+(.*)$/.exec(l);
    if (m) {
      actual = { titulo: m[1].trim(), lineas: [l] };
      trozos.push(actual);
    } else if (actual) actual.lineas.push(l);
    else cab.push(l);
  }
  return {
    cabecera: marked.parse(cab.join('\n'), { async: false }) as string,
    secciones: trozos.map((t, i) => ({
      id: `sec-${i + 1}`,
      titulo: t.titulo.replace(/[*_`]/g, ''),
      html: marked.parse(t.lineas.join('\n'), { async: false }) as string,
    })),
  };
}

export default function Leer() {
  const { semana, lectura } = useParams();
  const s = Number(semana);
  const prog = usarProg();
  const [md, setMd] = useState<string | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    setMd(null);
    setError(false);
    cargarFicha(s, lectura!).then(setMd).catch(() => setError(true));
  }, [s, lectura]);

  const doc = useMemo(() => (md ? partir(md) : null), [md]);
  const fila = filaDe(lectura!);
  const leida = !!prog.leidas[lectura!];

  if (error) {
    return (
      <div className="page narrow">
        <Link className="back" to="/leer">Volver a las fichas</Link>
        <Vacio>No se encontró la ficha de esta lectura.</Vacio>
      </div>
    );
  }

  return (
    <div className="page narrow">
      <Link className="back" to={`/semana/${s}`}>Volver a la semana {s}</Link>
      {!doc ? (
        <Cargando texto="Cargando la ficha" />
      ) : (
        <div className="leer">
          <aside aria-label="Contenido de la ficha">
            <nav className="toc" aria-label="Secciones de la ficha">
              {doc.secciones.map((x) => (
                <button key={x.id} type="button" onClick={() => document.getElementById(x.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
                  {x.titulo}
                </button>
              ))}
            </nav>
            <select className="tocsel" aria-label="Ir a una sección" defaultValue="" onChange={(e) => { document.getElementById(e.target.value)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); e.target.value = ''; }}>
              <option value="" disabled>Ir a una sección</option>
              {doc.secciones.map((x) => <option key={x.id} value={x.id}>{x.titulo}</option>)}
            </select>
          </aside>
          <article className="prose" aria-label={`Ficha de ${etiqueta(lectura!)}`}>
            <div dangerouslySetInnerHTML={{ __html: doc.cabecera }} />
            {doc.secciones.map((x) => (
              <section key={x.id} id={x.id} dangerouslySetInnerHTML={{ __html: x.html }} />
            ))}
            <hr />
            <div className="row g12">
              <button type="button" className={`press btn ${leida ? 'paper' : 'blue'}`} onClick={() => marcarLeida(lectura!, !leida)}>
                {leida ? 'Marcada como leída. Deshacer' : 'Marcar como leída'}
              </button>
              {fila && <Link className="press btn yellow" to={`/practica?semana=${s}&lectura=${lectura}&ir=1`}>Practicar esta lectura</Link>}
              {fila && <Link className="press btn paper" to={`/trampas?lectura=${lectura}`}>Ver trampas y pares</Link>}
            </div>
          </article>
        </div>
      )}
    </div>
  );
}
