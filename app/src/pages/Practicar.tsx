import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { BloqueVF, bloqueAciertos, bloqueCompleto } from '../components/BloqueVF';
import { Opciones, ordenInicial } from '../components/Opciones';
import { Barra, Chips, Cargando } from '../components/ui';
import { INDICE, Item, NOMBRE_NIVEL, SEMANAS, TIPO_PREGUNTA, etiqueta } from '../lib/data';
import { useContenido } from '../lib/hooks';
import { REPASO, muestraRepaso } from '../lib/repaso';
import { QStat, fallada, registrarRespuesta, usarProg } from '../lib/store';
import { barajar, plural } from '../lib/util';

type Modo = 'todas' | 'fallas' | 'nuevas';
type Tipo = 'todas' | 'comprension' | Item['tipo'];
const esComprension = (i: Item) => i.tipo === 'opcion' || i.tipo === 'vfbloque';

function armar(items: Item[], q: Record<string, QStat>, modo: Modo, tipo: Tipo): Item[] {
  let r = items;
  if (tipo === 'comprension') r = r.filter(esComprension);
  else if (tipo !== 'todas') r = r.filter((i) => i.tipo === tipo);
  if (modo === 'fallas') r = r.filter((i) => fallada(q[i.id]));
  if (modo === 'nuevas') r = r.filter((i) => !q[i.id]);
  return r;
}

export default function Practicar() {
  const [sp, setSp] = useSearchParams();
  const prog = usarProg();
  const semana = Number(sp.get('semana') || 0);
  const lectura = sp.get('lectura') || '';
  const esRepaso = sp.get('banco') === 'parcial';
  const modo = (sp.get('modo') || 'todas') as Modo;
  const tipoUrl = sp.get('tipo') as Tipo | null;
  const n = sp.get('n') || '10';

  const filas = useMemo(
    () => esRepaso ? [] : INDICE.lecturas.filter((f) => (!semana || f.semana === semana) && (!lectura || f.lectura === lectura)),
    [esRepaso, semana, lectura],
  );
  const contenido = useContenido(filas);
  const items = useMemo(() => esRepaso
    ? REPASO.filter((i) => (!semana || i.semana === semana) && (!lectura || i.lectura === lectura))
    : contenido?.items ?? null, [esRepaso, semana, lectura, contenido]);

  // Si las lecturas elegidas tienen preguntas de comprensión (estilo del control), esas son las que se muestran primero.
  const tipo: Tipo = tipoUrl ?? (!esRepaso && items?.some(esComprension) ? 'comprension' : 'todas');

  const poner = (k: string, v: string, def = '') => {
    const nuevo = new URLSearchParams(sp);
    nuevo.delete('ir');
    if (v === def) nuevo.delete(k);
    else nuevo.set(k, v);
    if (k === 'semana') nuevo.delete('lectura');
    if (k === 'banco') {
      nuevo.delete('lectura');
      nuevo.delete('tipo');
    }
    setSp(nuevo, { replace: true });
    setCola(null);
  };

  // Estado de la sesión
  const [cola, setCola] = useState<Item[] | null>(null);
  const [idx, setIdx] = useState(0);
  const [eleccion, setEleccion] = useState<boolean | number | null>(null);
  const [orden, setOrden] = useState<number[]>([]);
  const [bloque, setBloque] = useState<(boolean | undefined)[]>([]);
  const [bloqueRevelado, setBloqueRevelado] = useState(false);
  const [revelada, setRevelada] = useState(false);
  const [calificada, setCalificada] = useState<boolean | null>(null);
  const [aciertos, setAciertos] = useState(0);
  const [falladas, setFalladas] = useState<Item[]>([]);
  const guardia = useRef(false);

  const disponibles = useMemo(() => items ? armar(items, prog.q, modo, tipo) : [], [items, prog.q, modo, tipo]);

  const empezar = (lista: Item[]) => {
    setCola(lista);
    setIdx(0);
    setEleccion(null);
    setRevelada(false);
    setCalificada(null);
    setAciertos(0);
    setFalladas([]);
    setBloque([]);
    setBloqueRevelado(false);
    setOrden(lista[0]?.tipo === 'opcion' ? barajar(ordenInicial(lista[0].opciones.length)) : []);
  };
  const iniciar = () => {
    const cantidad = n === 'todas' ? disponibles.length : Number(n);
    empezar(esRepaso ? muestraRepaso(disponibles, cantidad) : barajar(disponibles).slice(0, cantidad));
  };

  // Inicio automático desde enlaces de otras pantallas.
  useEffect(() => {
    if (!sp.get('ir')) {
      guardia.current = false;
      return;
    }
    if (!items || guardia.current) return;
    guardia.current = true;
    const nuevo = new URLSearchParams(sp);
    nuevo.delete('ir');
    setSp(nuevo, { replace: true });
    if (disponibles.length) iniciar();
  }, [items, sp, disponibles]);

  const lecturasDeSemana = SEMANAS.filter((s) => !semana || s.semana === semana).flatMap(
    (s) => s.lecturas.filter((l) => esRepaso ? REPASO.some((i) => i.lectura === l.id) : INDICE.lecturas.some((f) => f.lectura === l.id))
      .map((l) => ({ semana: s.semana, lectura: l.id })),
  );
  const tipos: { v: Tipo; t: string }[] = [{ v: 'todas', t: 'Todas' }, { v: 'vf', t: 'Verdadero o falso' }, { v: 'abierta', t: 'Abiertas' }];
  if (!esRepaso && items?.some(esComprension)) {
    tipos.unshift({ v: 'comprension', t: 'Comprensión (estilo del control)' });
  }

  // ---- Pantalla de configuración ----
  if (!cola) {
    return (
      <div className="page narrow">
        <div className="col g8" style={{ maxWidth: 820 }}>
          <h1 className="h1 m d">{esRepaso ? 'Repaso del parcial' : 'Practicar'}</h1>
          <p className="lead">{esRepaso ? `${REPASO.length} preguntas nuevas de las ocho semanas, con respuestas explicadas.` : 'Elige qué preguntas quieres y empieza. Cada respuesta queda registrada para el dominio del mapa.'}</p>
        </div>
        <section className="card col g20" aria-label="Configurar práctica">
          <div className="col g8"><b>Banco</b><Chips etiqueta="Banco de preguntas" valor={esRepaso ? 'parcial' : ''} onChange={(v) => poner('banco', v)} opciones={[{ v: '', t: 'Banco de lecturas' }, { v: 'parcial', t: 'Repaso del parcial' }]} /></div>
          <div className="row g16">
            <label className="col g8" style={{ flex: '1 1 220px' }}>
              <b>Semana</b>
              <select aria-label="Semana" value={semana} onChange={(e) => poner('semana', e.target.value, '0')}>
                <option value={0}>Todas las semanas</option>
                {SEMANAS.map(({ semana: s }) => <option key={s} value={s}>Semana {s}</option>)}
              </select>
            </label>
            <label className="col g8" style={{ flex: '2 1 300px' }}>
              <b>Lectura</b>
              <select aria-label="Lectura" value={lectura} onChange={(e) => poner('lectura', e.target.value)}>
                <option value="">Todas las lecturas</option>
                {lecturasDeSemana.map((f) => <option key={f.lectura} value={f.lectura}>S{f.semana}: {etiqueta(f.lectura)}</option>)}
              </select>
            </label>
          </div>
          <div className="col g8"><b>Tipo</b><Chips<Tipo> etiqueta="Tipo de pregunta" valor={tipo} onChange={(v) => poner('tipo', v, '__')} opciones={tipos} /></div>
          <div className="col g8"><b>Cuáles</b><Chips etiqueta="Selección" valor={modo} onChange={(v) => poner('modo', v, 'todas')} opciones={[{ v: 'todas', t: 'Todas' }, { v: 'fallas', t: 'Las que fallé' }, { v: 'nuevas', t: 'Sin responder' }]} /></div>
          <div className="col g8"><b>Cantidad</b><Chips etiqueta="Cantidad" valor={n} onChange={(v) => poner('n', v, '10')} opciones={[{ v: '10', t: '10' }, { v: '20', t: '20' }, { v: 'todas', t: 'Todas' }]} /></div>
          {!items ? (
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
          {esRepaso ? 'Las rondas de varias semanas reparten las preguntas entre ellas. Puedes repetir las que fallaste o continuar con las que te faltan.' : 'Solo aparecen preguntas con respuesta en la ficha. Las afirmaciones cuya respuesta matiza el texto se muestran como preguntas abiertas.'}
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
  const esAbierta = it.tipo === 'abierta';
  const esBloque = it.tipo === 'vfbloque';
  const solucion = it.tipo === 'opcion' ? it.correcta : it.tipo === 'vf' ? it.verdadera : null;
  const respondida = esAbierta ? calificada !== null : esBloque ? bloqueRevelado : eleccion !== null;
  const correcta = esAbierta ? calificada === true : esBloque ? it.afirmaciones.every((a, i) => bloque[i] === a.verdadera) : eleccion === solucion;

  const elegir = (v: boolean | number) => {
    if (eleccion !== null) return;
    setEleccion(v);
    const ok = v === solucion;
    registrarRespuesta(it.id, ok);
    if (ok) setAciertos((a) => a + 1);
    else setFalladas((f) => [...f, it]);
  };
  const comprobarBloque = () => {
    if (it.tipo !== 'vfbloque' || bloqueRevelado || !bloqueCompleto(it, bloque)) return;
    setBloqueRevelado(true);
    const ok = bloqueAciertos(it, bloque) === it.afirmaciones.length;
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
    const sig = cola[idx + 1];
    setIdx((i) => i + 1);
    setEleccion(null);
    setRevelada(false);
    setCalificada(null);
    setBloque([]);
    setBloqueRevelado(false);
    setOrden(sig?.tipo === 'opcion' ? barajar(ordenInicial(sig.opciones.length)) : []);
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
          <span className="tag">{TIPO_PREGUNTA[it.tipo]}</span>
          {it.nivel && <span className="tag">{NOMBRE_NIVEL[it.nivel]}</span>}
        </div>
        <p className="texto d">{it.enunciado}</p>

        {it.tipo === 'vf' && (
          <div className="vf">
            <button type="button" className="press sign-green" style={{ borderRadius: 18 }} disabled={eleccion !== null} onClick={() => elegir(true)}>Verdadero</button>
            <button type="button" className="press sign-red" style={{ borderRadius: 18 }} disabled={eleccion !== null} onClick={() => elegir(false)}>Falso</button>
          </div>
        )}
        {it.tipo === 'opcion' && (
          <Opciones item={it} orden={orden.length ? orden : ordenInicial(it.opciones.length)} elegida={typeof eleccion === 'number' ? eleccion : undefined} onElegir={elegir} revelar={respondida} bloqueada={respondida} />
        )}
        {it.tipo === 'vfbloque' && (
          <>
            <BloqueVF item={it} respuestas={bloque} revelar={bloqueRevelado} onResponder={(i, v) => setBloque((b) => { const c = [...b]; c[i] = v; return c; })} />
            {!bloqueRevelado && (
              <div className="row g16">
                <button type="button" className="press btn blue sign" disabled={!bloqueCompleto(it, bloque)} onClick={comprobarBloque}>Comprobar</button>
                <span className="muted" style={{ alignSelf: 'center' }}>Marca las {it.afirmaciones.length} afirmaciones.</span>
              </div>
            )}
          </>
        )}
        {it.tipo === 'abierta' && !revelada && (
          <div className="row g16">
            <button type="button" className="press btn sign-ink" onClick={() => setRevelada(true)}>Mostrar la respuesta</button>
            <span className="muted" style={{ alignSelf: 'center' }}>Piénsala primero y luego compárala.</span>
          </div>
        )}

        {(esAbierta ? revelada : respondida) && (
          <div className={`respuesta ${esAbierta ? 'neutral' : correcta ? 'ok' : 'mal'}`} role="status">
            {!esAbierta && <p className="d" style={{ fontSize: 24, fontWeight: 900 }}>{it.tipo === 'vfbloque' ? `${bloqueAciertos(it, bloque)} de ${it.afirmaciones.length} afirmaciones bien` : correcta ? 'Correcto' : 'Incorrecto'}</p>}
            {it.tipo === 'opcion' && !it.explicacion && <p><b>Respuesta correcta</b> · {it.opciones[it.correcta]}</p>}
            {it.tipo !== 'vfbloque' && <p className="t">{it.tipo === 'opcion' ? it.explicacion ?? it.respuesta : it.respuesta}</p>}
            {it.concepto && <p className="muted" style={{ fontSize: 16 }}><b>Concepto:</b> {it.concepto}</p>}
            {it.clase && <p><span className="pill blue">Clase {it.clase}</span></p>}
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
