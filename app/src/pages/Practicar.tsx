import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Barra, Chips, Cargando, Vacio } from '../components/ui';
import { INDICE, Item, etiqueta } from '../lib/data';
import { useContenido } from '../lib/hooks';
import { fallada, registrarRespuesta, usarProg } from '../lib/store';
import { barajar, plural } from '../lib/util';

type Modo = 'todas' | 'fallas' | 'nuevas';
type Tipo = 'todas' | 'vf' | 'abierta';

function armar(items: Item[], q: Record<string, any>, modo: Modo, tipo: Tipo): Item[] {
  let r = items;
  if (tipo !== 'todas') r = r.filter((i) => i.tipo === tipo);
  if (modo === 'fallas') r = r.filter((i) => fallada(q[i.id]));
  if (modo === 'nuevas') r = r.filter((i) => !q[i.id]);
  return r;
}

export default function Practicar() {
  const [sp, setSp] = useSearchParams();
  const prog = usarProg();
  const semana = Number(sp.get('semana') || 0);
  const lectura = sp.get('lectura') || '';
  const modo = (sp.get('modo') || 'todas') as Modo;
  const tipo = (sp.get('tipo') || 'todas') as Tipo;
  const n = sp.get('n') || '10';

  const filas = useMemo(
    () => INDICE.lecturas.filter((f) => (!semana || f.semana === semana) && (!lectura || f.lectura === lectura)),
    [semana, lectura],
  );
  const contenido = useContenido(filas);

  const poner = (k: string, v: string, def = '') => {
    const nuevo = new URLSearchParams(sp);
    nuevo.delete('ir');
    if (v === def) nuevo.delete(k);
    else nuevo.set(k, v);
    if (k === 'semana') nuevo.delete('lectura');
    setSp(nuevo, { replace: true });
    setCola(null);
  };

  // Estado de la sesión
  const [cola, setCola] = useState<Item[] | null>(null);
  const [idx, setIdx] = useState(0);
  const [eleccion, setEleccion] = useState<boolean | null>(null);
  const [revelada, setRevelada] = useState(false);
  const [calificada, setCalificada] = useState<boolean | null>(null);
  const [aciertos, setAciertos] = useState(0);
  const [falladas, setFalladas] = useState<Item[]>([]);
  const guardia = useRef(false);

  const disponibles = useMemo(() => (contenido ? armar(contenido.items, prog.q, modo, tipo) : []), [contenido, prog.q, modo, tipo]);

  const empezar = (lista: Item[]) => {
    setCola(lista);
    setIdx(0);
    setEleccion(null);
    setRevelada(false);
    setCalificada(null);
    setAciertos(0);
    setFalladas([]);
  };
  const iniciar = () => {
    const base = barajar(disponibles);
    empezar(n === 'todas' ? base : base.slice(0, Number(n)));
  };

  // Inicio automático desde enlaces de otras pantallas.
  useEffect(() => {
    if (!contenido || !sp.get('ir') || guardia.current) return;
    guardia.current = true;
    const nuevo = new URLSearchParams(sp);
    nuevo.delete('ir');
    setSp(nuevo, { replace: true });
    const base = barajar(armar(contenido.items, prog.q, modo, tipo));
    empezar(n === 'todas' ? base : base.slice(0, Number(n)));
  }, [contenido]);

  const lecturasDeSemana = INDICE.lecturas.filter((f) => !semana || f.semana === semana);
  const semanas = Array.from(new Set(INDICE.lecturas.map((f) => f.semana)));

  // ---- Pantalla de configuración ----
  if (!cola) {
    return (
      <div className="page narrow">
        <div className="col g8" style={{ maxWidth: 820 }}>
          <h1 className="h1 m d">Practicar</h1>
          <p className="lead">Elige qué preguntas quieres y empieza. Cada respuesta queda registrada para el dominio del mapa.</p>
        </div>
        <section className="card col g20" aria-label="Configurar práctica">
          <div className="row g16">
            <label className="col g8" style={{ flex: '1 1 220px' }}>
              <b>Semana</b>
              <select value={semana} onChange={(e) => poner('semana', e.target.value, '0')}>
                <option value={0}>Todas las semanas</option>
                {semanas.map((s) => <option key={s} value={s}>Semana {s}</option>)}
              </select>
            </label>
            <label className="col g8" style={{ flex: '2 1 300px' }}>
              <b>Lectura</b>
              <select value={lectura} onChange={(e) => poner('lectura', e.target.value)}>
                <option value="">Todas las lecturas</option>
                {lecturasDeSemana.map((f) => <option key={f.lectura} value={f.lectura}>S{f.semana}: {etiqueta(f.lectura)}</option>)}
              </select>
            </label>
          </div>
          <div className="col g8"><b>Tipo</b><Chips etiqueta="Tipo de pregunta" valor={tipo} onChange={(v) => poner('tipo', v, 'todas')} opciones={[{ v: 'todas', t: 'Todas' }, { v: 'vf', t: 'Verdadero o falso' }, { v: 'abierta', t: 'Abiertas' }]} /></div>
          <div className="col g8"><b>Cuáles</b><Chips etiqueta="Selección" valor={modo} onChange={(v) => poner('modo', v, 'todas')} opciones={[{ v: 'todas', t: 'Todas' }, { v: 'fallas', t: 'Las que fallé' }, { v: 'nuevas', t: 'Sin responder' }]} /></div>
          <div className="col g8"><b>Cantidad</b><Chips etiqueta="Cantidad" valor={n} onChange={(v) => poner('n', v, '10')} opciones={[{ v: '10', t: '10' }, { v: '20', t: '20' }, { v: 'todas', t: 'Todas' }]} /></div>
          {!contenido ? (
            <Cargando />
          ) : (
            <div className="row center g16">
              <button type="button" className="press btn blue sign" disabled={disponibles.length === 0} onClick={iniciar}>
                Empezar práctica
              </button>
              <span className="muted">{disponibles.length ? `${plural(disponibles.length, 'pregunta disponible', 'preguntas disponibles')}` : 'No hay preguntas con esta selección'}</span>
            </div>
          )}
        </section>
        <p className="muted" style={{ fontSize: 15, maxWidth: 820 }}>
          Solo aparecen preguntas con respuesta en la ficha. Las afirmaciones cuya respuesta matiza el texto se muestran como preguntas abiertas.
        </p>
      </div>
    );
  }

  // ---- Fin de la sesión ----
  if (idx >= cola.length) {
    return (
      <div className="page narrow">
        <section className="card col g20" aria-label="Resultado de la práctica">
          <h1 className="h1 m d">{aciertos} de {cola.length}</h1>
          <Barra valor={cola.length ? (aciertos / cola.length) * 100 : 0} oscura etiqueta="Aciertos" />
          <p className="lead">{falladas.length ? `Fallaste ${plural(falladas.length, 'pregunta', 'preguntas')}. Repítelas ahora para fijarlas.` : 'Sin fallas en esta ronda.'}</p>
          <div className="row g16">
            {falladas.length > 0 && <button type="button" className="press btn blue sign" onClick={() => empezar(barajar(falladas))}>Repetir las que fallé</button>}
            <button type="button" className="press btn yellow" onClick={() => setCola(null)}>Nueva práctica</button>
            <Link className="press btn paper" to="/">Volver al mapa</Link>
          </div>
        </section>
      </div>
    );
  }

  // ---- Pregunta ----
  const it = cola[idx];
  const respondida = it.tipo === 'vf' ? eleccion !== null : calificada !== null;
  const correcta = it.tipo === 'vf' ? eleccion === it.verdadera : calificada === true;

  const elegir = (v: boolean) => {
    if (eleccion !== null) return;
    setEleccion(v);
    const ok = v === it.verdadera;
    registrarRespuesta(it.id, ok);
    if (ok) setAciertos((a) => a + 1);
    else setFalladas((f) => [...f, it]);
  };
  const calificar = (ok: boolean) => {
    if (calificada !== null) return;
    setCalificada(ok);
    registrarRespuesta(it.id, ok);
    if (ok) setAciertos((a) => a + 1);
    else setFalladas((f) => [...f, it]);
  };
  const siguiente = () => {
    setIdx((i) => i + 1);
    setEleccion(null);
    setRevelada(false);
    setCalificada(null);
  };

  return (
    <div className="page narrow">
      <div className="row center between g12">
        <button type="button" className="back" style={{ background: 'none', border: 0, cursor: 'pointer', fontSize: 17 }} onClick={() => setCola(null)}>Terminar práctica</button>
        <span className="pill blue">Pregunta {idx + 1} de {cola.length}</span>
      </div>
      <Barra valor={(idx / cola.length) * 100} etiqueta="Avance de la práctica" />
      <section className="pregunta" aria-label={`Pregunta ${idx + 1}`}>
        <div className="row g8">
          <span className="tag">S{it.semana}: {etiqueta(it.lectura)}</span>
          <span className="tag">{it.tipo === 'vf' ? 'Verdadero o falso' : 'Abierta'}</span>
        </div>
        <p className="texto d">{it.enunciado}</p>

        {it.tipo === 'vf' && (
          <div className="vf">
            <button type="button" className="press sign-green" style={{ borderRadius: 18 }} disabled={eleccion !== null} onClick={() => elegir(true)}>Verdadero</button>
            <button type="button" className="press sign-red" style={{ borderRadius: 18 }} disabled={eleccion !== null} onClick={() => elegir(false)}>Falso</button>
          </div>
        )}
        {it.tipo === 'abierta' && !revelada && (
          <div className="row g16">
            <button type="button" className="press btn sign-ink" onClick={() => setRevelada(true)}>Mostrar la respuesta</button>
            <span className="muted" style={{ alignSelf: 'center' }}>Piénsala primero y luego compárala.</span>
          </div>
        )}

        {(it.tipo === 'vf' ? respondida : revelada) && (
          <div className={`respuesta ${it.tipo === 'vf' ? (correcta ? 'ok' : 'mal') : 'neutral'}`} role="status">
            {it.tipo === 'vf' && <p className="d" style={{ fontSize: 24, fontWeight: 900 }}>{correcta ? 'Correcto' : 'Incorrecto'}</p>}
            <p className="t">{it.respuesta}</p>
            {it.referencia && <p><span className="pill">{it.referencia}</span></p>}
          </div>
        )}

        {it.tipo === 'abierta' && revelada && calificada === null && (
          <div className="col g12">
            <p><b>¿Qué tan completa fue tu respuesta?</b></p>
            <div className="autograde">
              <button type="button" className="press sign-green" onClick={() => calificar(true)}>La sabía</button>
              <button type="button" className="press sign-red" onClick={() => calificar(false)}>No la sabía</button>
            </div>
          </div>
        )}

        {respondida && (
          <div className="row g16">
            <button type="button" className="press btn blue sign" onClick={siguiente}>{idx + 1 < cola.length ? 'Siguiente' : 'Ver resultado'}</button>
          </div>
        )}
      </section>
    </div>
  );
}
