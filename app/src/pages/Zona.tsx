import { ReactNode, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Barra, Rombo, Vacio } from '../components/ui';
import { IcAudio, IcBoleto, IcLeer, IcPracticar } from '../components/icons';
import { etiqueta, filaDe, prefijoPreguntas, semanaMeta } from '../lib/data';
import { estadisticasPrefijo, usarProg } from '../lib/store';
import { pct, plural } from '../lib/util';

function Tile({ to, color, icono, titulo, detalle }: { to?: string; color: string; icono: ReactNode; titulo: string; detalle: string }) {
  const cuerpo = (
    <>
      <span className="ico" style={{ background: color }}>{icono}</span>
      <span><b className="d">{titulo}</b><small>{detalle}</small></span>
    </>
  );
  return to ? (
    <Link className="press tile" to={to}>{cuerpo}</Link>
  ) : (
    <div className="tile off" aria-disabled="true">{cuerpo}</div>
  );
}

export default function Zona() {
  const { n } = useParams();
  const semana = Number(n);
  const meta = semanaMeta(semana);
  const prog = usarProg();
  const [sel, setSel] = useState<string | null>(null);

  if (!meta) {
    return (
      <div className="page narrow">
        <Link className="back" to="/">Volver al mapa</Link>
        <Vacio>La semana {n} no existe.</Vacio>
      </div>
    );
  }
  const actual = meta.lecturas.find((l) => l.id === sel) ?? meta.lecturas[0];
  const fila = filaDe(actual.id);
  const q = fila ? `semana=${fila.semana}&lectura=${fila.lectura}` : '';
  const est = fila ? estadisticasPrefijo(prog, prefijoPreguntas(fila.semana, fila.lectura)) : null;

  return (
    <div className="page narrow">
      <Link className="back" to="/">Volver al mapa</Link>
      <div className="col g8" style={{ maxWidth: 900 }}>
        <h1 className="h1 m d">Semana {semana}: {meta.tema}</h1>
        <p className="lead">Elige una lectura y trabaja sus estaciones. Se completa con las preguntas que domines.</p>
      </div>

      <section aria-label="Lecturas de la semana" className="col g12">
        <div className="estaciones">
          <span className="linea" aria-hidden="true" />
          {meta.lecturas.map((l, i) => {
            const f = filaDe(l.id);
            const e = f ? estadisticasPrefijo(prog, prefijoPreguntas(f.semana, f.lectura)) : null;
            const p = f && e ? pct(e.dom, f.respondibles) : 0;
            const activa = l.id === actual.id;
            return (
              <button key={l.id} type="button" className="estacion" aria-pressed={activa} onClick={() => setSel(l.id)}>
                <span className="num d">{i + 1}</span>
                <b className="d" style={{ fontSize: 21, lineHeight: 1.1 }}>{etiqueta(l.id)}</b>
                {f ? (
                  <>
                    <Barra valor={p} etiqueta={`Dominio de ${etiqueta(l.id)}`} />
                    <span className="muted" style={{ fontSize: 15 }}>{p}% dominado, {plural(f.respondibles, 'pregunta', 'preguntas')}</span>
                  </>
                ) : (
                  <span className="pill red">PDF pendiente</span>
                )}
                {prog.leidas[l.id] && <span className="pill green">Leída</span>}
              </button>
            );
          })}
        </div>
      </section>

      <section aria-label={`Estaciones de ${etiqueta(actual.id)}`} className="sign" style={{ padding: '34px 36px 40px', display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div className="col g8">
          <h2 className="d" style={{ fontSize: 34, fontWeight: 900, lineHeight: 1.05 }}>{etiqueta(actual.id)}</h2>
          <p style={{ fontSize: 17, maxWidth: 900 }}>{actual.autor}. {actual.titulo}</p>
          {actual.alcance && <p style={{ fontSize: 15, opacity: 0.9 }}>Alcance: {actual.alcance}</p>}
        </div>
        {fila ? (
          <div className="tiles">
            <Tile to={`/leer/${fila.semana}/${fila.lectura}`} color="var(--yellow)" icono={<IcLeer />} titulo="Leer la ficha" detalle={prog.leidas[actual.id] ? 'Marcada como leída' : 'Secciones con páginas del original'} />
            <Tile to={fila.respondibles ? `/practica?${q}&ir=1` : undefined} color="var(--greenSoft)" icono={<IcPracticar />} titulo="Practicar" detalle={fila.respondibles ? `${plural(fila.respondibles, 'pregunta', 'preguntas')} con respuesta${est && est.fallas ? `, ${est.fallas} falladas` : ''}` : 'Las preguntas de esta lectura aún no tienen respuesta'} />
            <Tile to={`/boletos?${q}`} color="var(--blueSoft)" icono={<IcBoleto />} titulo="Boletos" detalle="Repaso espaciado de esta lectura" />
            <Tile to={`/trampas?lectura=${fila.lectura}`} color="var(--yellow)" icono={<Rombo size={44} />} titulo="Trampas y pares" detalle={`${plural(fila.trampas, 'trampa', 'trampas')}, ${plural(fila.pares, 'par', 'pares')}`} />
            <Tile to={fila.vf_directas ? `/practica?${q}&tipo=vf&n=todas&ir=1` : undefined} color="var(--redSoft)" icono={<IcPracticar />} titulo="Verdadero o falso" detalle={fila.vf_directas ? `${plural(fila.vf_directas, 'afirmación', 'afirmaciones')} del banco` : 'Esta lectura no tiene afirmaciones'} />
            <Tile color="var(--line)" icono={<IcAudio />} titulo="Escuchar" detalle="Audio pendiente" />
          </div>
        ) : (
          <div className="respuesta" style={{ background: '#fff', color: 'var(--ink)', border: '3px solid var(--ink)' }}>
            <p className="t d">Falta el PDF de esta lectura</p>
            <p>{actual.estado?.nota ?? 'Esta lectura aún no tiene ficha.'} No se prepara material sin leer el documento completo.</p>
          </div>
        )}
      </section>

      <div className="row g16">
        <Link className="press btn yellow" to={`/practica?semana=${semana}&n=todas&ir=1`}>Practicar toda la semana {semana}</Link>
        <Link className="press btn paper" to={`/trampas?semana=${semana}`}>Ver las trampas de la semana</Link>
      </div>
    </div>
  );
}
