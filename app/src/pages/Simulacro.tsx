import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { BloqueVF, bloqueAciertos, bloqueCompleto } from '../components/BloqueVF';
import { Completar, RespCompletar, completarAciertos, completarCompleto } from '../components/Completar';
import { Figura } from '../components/Figura';
import { Opciones, ordenInicial } from '../components/Opciones';
import { Barra, Cargando, Chips } from '../components/ui';
import { INDICE, Item, TIPO_PREGUNTA, etiqueta } from '../lib/data';
import { useContenido } from '../lib/hooks';
import { REPASO, muestraRepaso } from '../lib/repaso';
import { guardarSim, registrarRespuesta, usarProg } from '../lib/store';
import { barajar, pct, plural, reloj } from '../lib/util';

type Tipo = 'completo' | 'semana' | 'comprension' | 'vf' | 'abiertas' | 'repaso';
type Fase = 'config' | 'run' | 'grade' | 'result';
type Resp = boolean | number | string | (boolean | undefined)[] | RespCompletar | undefined;
const esComprension = (i: Item) => i.tipo === 'opcion' || i.tipo === 'vfbloque' || i.tipo === 'completar';
// Una respuesta cuenta como dada si es distinta de vacío; un bloque V/F, si tiene todas sus afirmaciones marcadas.
const hecha = (p: Item, r: Resp) => p.tipo === 'vfbloque' ? bloqueCompleto(p, r as (boolean | undefined)[] | undefined)
  : p.tipo === 'completar' ? completarCompleto(p, r as RespCompletar | undefined)
  : r !== undefined && r !== '';

const TIPOS: { v: Tipo; t: string }[] = [
  { v: 'completo', t: 'Completo' },
  { v: 'semana', t: 'Por semana' },
  { v: 'comprension', t: 'Estilo del control' },
  { v: 'vf', t: 'Solo verdadero o falso' },
  { v: 'abiertas', t: 'Solo abiertas' },
  { v: 'repaso', t: 'Repaso del parcial' },
];
const NOMBRE_TIPO: Record<Tipo, string> = { completo: 'completo', semana: 'por semana', comprension: 'estilo del control', vf: 'verdadero o falso', abiertas: 'abiertas', repaso: 'de repaso del parcial' };
const SEG_POR_PREGUNTA = 60;
const segDe = (p: Item) => (p.tipo === 'vfbloque' || p.tipo === 'completar' ? SEG_POR_PREGUNTA * 2 : SEG_POR_PREGUNTA);

// En 'completo' y 'por semana', la mayor parte del examen son preguntas de comprensión (como en el control), si las hay.
function mezclar(lista: Item[], cantidad: number): Item[] {
  const comp = barajar(lista.filter(esComprension));
  const resto = barajar(lista.filter((i) => !esComprension(i)));
  const nComp = Math.min(comp.length, Math.round(cantidad * 0.7));
  const tomadas = [...comp.slice(0, nComp), ...resto.slice(0, cantidad - nComp)];
  const sobran = [...comp.slice(nComp), ...resto.slice(cantidad - nComp)];
  return barajar([...tomadas, ...sobran].slice(0, cantidad));
}

function Medidor({ valor }: { valor: number }) {
  const grados = (Math.max(0, Math.min(100, valor)) * 180) / 100 - 90;
  return (
    <svg viewBox="0 0 240 140" role="img" aria-label={`Resultado: ${valor} por ciento`} style={{ width: '100%', maxWidth: 360 }}>
      <path d="M20 120 A100 100 0 0 1 220 120" fill="none" stroke="#BFCDD3" strokeWidth="22" strokeLinecap="round" />
      <path d="M20 120 A100 100 0 0 1 92 24" fill="none" stroke="#C8102E" strokeWidth="22" strokeLinecap="round" />
      <path d="M92 24 A100 100 0 0 1 148 24" fill="none" stroke="#FFC629" strokeWidth="22" />
      <path d="M148 24 A100 100 0 0 1 220 120" fill="none" stroke="#00704A" strokeWidth="22" strokeLinecap="round" />
      <g className="needle" style={{ transformOrigin: '120px 120px', transform: `rotate(${grados}deg)` }}>
        <line x1="120" y1="120" x2="120" y2="38" stroke="#0E2230" strokeWidth="6" strokeLinecap="round" />
      </g>
      <circle cx="120" cy="120" r="10" fill="#0E2230" />
    </svg>
  );
}

export default function Simulacro() {
  const prog = usarProg();
  const [params] = useSearchParams();
  const [tipo, setTipo] = useState<Tipo>(params.get('banco') === 'parcial' ? 'repaso' : 'completo');
  const [semana, setSemana] = useState(1);
  const [cantidad, setCantidad] = useState<number>(20);
  const [soloCerradas, setSoloCerradas] = useState(false);
  const permiteElegirFormato = tipo !== 'vf' && tipo !== 'abiertas' && tipo !== 'comprension';
  const cerradas = permiteElegirFormato && soloCerradas;
  const equilibrarPorSemana = tipo === 'repaso' || cerradas;

  const filas = useMemo(() => tipo === 'repaso' ? [] : INDICE.lecturas.filter((f) => tipo !== 'semana' || f.semana === semana), [tipo, semana]);
  const contenido = useContenido(filas);

  const [fase, setFase] = useState<Fase>('config');
  const [preg, setPreg] = useState<Item[]>([]);
  const [resp, setResp] = useState<Record<string, Resp>>({});
  const [marcadas, setMarcadas] = useState<Record<string, boolean>>({});
  const [idx, setIdx] = useState(0);
  const [restante, setRestante] = useState(0);
  const [total, setTotal] = useState(0);
  const [confirmar, setConfirmar] = useState(false);
  const [notas, setNotas] = useState<Record<string, boolean>>({});
  const [ordenes, setOrdenes] = useState<Record<string, number[]>>({});
  const [soloFalladas, setSoloFalladas] = useState(false);
  const [usados, setUsados] = useState(0);
  const fin = useRef(0);
  const guardado = useRef(false);

  const disponibles = useMemo(() => {
    const banco = tipo === 'repaso' ? REPASO : contenido?.items ?? [];
    if (cerradas) {
      const repasoAdicional = tipo === 'repaso' ? [] : REPASO.filter((i) => tipo !== 'semana' || i.semana === semana);
      return [...banco, ...repasoAdicional].filter((i) => i.tipo !== 'abierta');
    }
    if (tipo === 'comprension') return banco.filter(esComprension);
    if (tipo === 'vf') return banco.filter((i) => i.tipo === 'vf');
    if (tipo === 'abiertas') return banco.filter((i) => i.tipo === 'abierta');
    return banco;
  }, [cerradas, contenido, semana, tipo]);

  const iniciar = () => {
    const lista = equilibrarPorSemana ? muestraRepaso(disponibles, cantidad)
      : tipo === 'completo' || tipo === 'semana' ? mezclar(disponibles, cantidad)
      : barajar(disponibles).slice(0, cantidad);
    setPreg(lista);
    setOrdenes(Object.fromEntries(lista.flatMap((p) => p.tipo === 'opcion' ? [[p.id, barajar(ordenInicial(p.opciones.length))]] : [])));
    setResp({});
    setMarcadas({});
    setNotas({});
    setIdx(0);
    setConfirmar(false);
    setSoloFalladas(false);
    const seg = lista.reduce((t, p) => t + segDe(p), 0);
    setTotal(seg);
    setRestante(seg);
    fin.current = Date.now() + seg * 1000;
    guardado.current = false;
    setFase('run');
  };

  const entregar = () => {
    const usado = Math.min(total, total - Math.max(0, Math.round((fin.current - Date.now()) / 1000)));
    setUsados(usado);
    setConfirmar(false);
    setFase(preg.some((p) => p.tipo === 'abierta') ? 'grade' : 'result');
  };

  useEffect(() => {
    if (fase !== 'run') return;
    const t = setInterval(() => {
      const r = Math.max(0, Math.round((fin.current - Date.now()) / 1000));
      setRestante(r);
      if (r <= 0) entregar();
    }, 500);
    return () => clearInterval(t);
  }, [fase, preg]);

  const acierta = (p: Item): boolean => {
    if (p.tipo === 'abierta') return !!notas[p.id];
    if (p.tipo === 'vfbloque') return bloqueAciertos(p, resp[p.id] as (boolean | undefined)[] | undefined) === p.afirmaciones.length;
    if (p.tipo === 'completar') return completarAciertos(p, resp[p.id] as RespCompletar | undefined) === p.huecos.length;
    return resp[p.id] === (p.tipo === 'opcion' ? p.correcta : p.verdadera);
  };
  const ok = preg.filter(acierta).length;

  // Guardar el intento una sola vez al llegar al balance.
  useEffect(() => {
    if (fase !== 'result' || guardado.current) return;
    guardado.current = true;
    const porLectura: Record<string, [number, number]> = {};
    const falladas: string[] = [];
    for (const p of preg) {
      const a = acierta(p);
      registrarRespuesta(p.id, a);
      const [o, t] = porLectura[p.lectura] ?? [0, 0];
      porLectura[p.lectura] = [o + (a ? 1 : 0), t + 1];
      if (!a) falladas.push(p.id);
    }
    const nombre = cerradas ? `${NOMBRE_TIPO[tipo]} · solo cerradas` : NOMBRE_TIPO[tipo];
    guardarSim({ ts: Date.now(), tipo: nombre, total: preg.length, ok, seg: usados, porLectura, falladas });
  }, [fase]);

  // ---------- Configuración ----------
  if (fase === 'config') {
    const ultimo = prog.sims[prog.sims.length - 1];
    const cantidades = [10, 20, 30].map((v) => ({ v, t: String(v) }));
    if (tipo === 'repaso') cantidades.push({ v: REPASO.length, t: String(disponibles.length) });
    const cantidadReal = Math.min(cantidad, disponibles.length);
    const minutos = Math.round(cantidadReal * SEG_POR_PREGUNTA / 60);
    return (
      <div className="page narrow">
        <div className="col g8" style={{ maxWidth: 860 }}>
          <h1 className="h1 m d">Hora pico</h1>
          <p className="lead">
            {cerradas || tipo === 'comprension' ? 'Selección múltiple y bloques de verdadero o falso. La nota se calcula automáticamente al entregar.' : 'Simulacro con cronómetro. Revisa las respuestas al entregar.'}
          </p>
        </div>
        <section className="card col g20" aria-label="Configurar simulacro">
          <div className="col g8"><b>Tipo</b><Chips etiqueta="Tipo de simulacro" valor={tipo} onChange={(v) => {
            setTipo(v);
            if (v !== 'repaso' && cantidad > 30) setCantidad(20);
          }} opciones={TIPOS} /></div>
          {tipo === 'semana' && (
            <label className="col g8" style={{ maxWidth: 260 }}>
              <b>Semana</b>
              <select value={semana} onChange={(e) => setSemana(Number(e.target.value))}>
                {Array.from(new Set(INDICE.lecturas.map((f) => f.semana))).map((s) => <option key={s} value={s}>Semana {s}</option>)}
              </select>
            </label>
          )}
          {permiteElegirFormato && (
            <div className="col g8">
              <b>Formato</b>
              <Chips etiqueta="Formato de preguntas" valor={cerradas ? 'cerradas' : 'todos'}
                onChange={(v) => setSoloCerradas(v === 'cerradas')}
                opciones={[{ v: 'todos', t: 'Todos los formatos' }, { v: 'cerradas', t: 'Solo cerradas' }]} />
            </div>
          )}
          <div className="col g8"><b>Preguntas</b><Chips<number> etiqueta="Cantidad de preguntas" valor={cantidad} onChange={setCantidad} opciones={cantidades} /></div>
          {tipo !== 'repaso' && !contenido ? (
            <Cargando />
          ) : (
            <div className="row center g16">
              <button type="button" className="press btn blue sign" disabled={disponibles.length === 0} onClick={iniciar}>Empezar el simulacro</button>
              <span className="muted">
                {cantidadReal ? `${cantidadReal} preguntas, unos ${minutos} minutos (1 por pregunta; 2 por bloque V/F)` : 'No hay preguntas con esta selección'}
              </span>
            </div>
          )}
        </section>
        {prog.sims.length > 0 && (
          <section className="col g12" aria-label="Intentos anteriores">
            <h2 className="h2 d">Tus intentos</h2>
            <ul className="col g8">
              {[...prog.sims].reverse().slice(0, 8).map((s) => (
                <li key={s.ts} className="par">
                  <b>{s.ok} de {s.total} ({pct(s.ok, s.total)}%), simulacro {s.tipo}</b>
                  <span>{new Date(s.ts).toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' })}, {reloj(s.seg)} usados</span>
                </li>
              ))}
            </ul>
            {ultimo && <p className="muted">Cada intento queda en tu progreso y suma a la racha y a los kilómetros del mapa.</p>}
          </section>
        )}
      </div>
    );
  }

  // ---------- En curso ----------
  if (fase === 'run') {
    const p = preg[idx];
    const elegida = resp[p.id];
    const respondidas = preg.filter((x) => hecha(x, resp[x.id])).length;
    const sin = preg.length - respondidas;
    return (
      <div className="page narrow">
        <div className="row" style={{ alignItems: 'flex-start', gap: 28 }}>
          <section className="pregunta" style={{ flex: '2 1 560px', minWidth: 0 }} aria-label={`Pregunta ${idx + 1} de ${preg.length}`}>
            <div className="row g8 center between">
              <div className="row g8">
                <span className="tag">Pregunta {idx + 1} de {preg.length}</span>
                <span className="tag">{TIPO_PREGUNTA[p.tipo]}</span>
                {equilibrarPorSemana && <span className="tag">Semana {p.semana}</span>}
              </div>
              <button type="button" className="chip" aria-pressed={!!marcadas[p.id]} onClick={() => setMarcadas((m) => ({ ...m, [p.id]: !m[p.id] }))}>
                {marcadas[p.id] ? 'Marcada para revisar' : 'Marcar para revisar'}
              </button>
            </div>
            <p className="texto d">{p.enunciado}</p>
            {p.figura && p.tipo !== 'completar' && <Figura id={p.figura} />}
            {p.tipo === 'completar' && (
              <Completar item={p} respuestas={(elegida as RespCompletar | undefined) ?? []}
                onResponder={(i, v) => setResp((r) => { const c = [...((r[p.id] as RespCompletar | undefined) ?? [])]; c[i] = v; return { ...r, [p.id]: c }; })} />
            )}
            {p.tipo === 'opcion' && (
              <Opciones item={p} orden={ordenes[p.id] ?? ordenInicial(p.opciones.length)} elegida={typeof elegida === 'number' ? elegida : undefined}
                onElegir={(v) => setResp((r) => ({ ...r, [p.id]: r[p.id] === v ? undefined : v }))} />
            )}
            {p.tipo === 'vfbloque' && (
              <BloqueVF item={p} respuestas={(elegida as (boolean | undefined)[] | undefined) ?? []}
                onResponder={(i, v) => setResp((r) => { const c = [...((r[p.id] as (boolean | undefined)[] | undefined) ?? [])]; c[i] = c[i] === v ? undefined : v; return { ...r, [p.id]: c }; })} />
            )}
            {p.tipo === 'vf' && (
              <div className="col g12" style={{ maxWidth: 760 }}>
                {[{ v: true, t: 'Verdadero' }, { v: false, t: 'Falso' }].map((o) => {
                  const sel = resp[p.id] === o.v;
                  return (
                    <button
                      key={String(o.v)}
                      type="button"
                      className="opt press"
                      aria-pressed={sel}
                      style={{ background: sel ? 'var(--blue)' : 'var(--paper)', color: sel ? '#fff' : 'var(--ink)', border: '3px solid var(--ink)' }}
                      onClick={() => setResp((r) => ({ ...r, [p.id]: sel ? undefined : o.v }))}
                    >
                      <span className="d" style={{ fontWeight: 900 }}>{o.t}</span>
                    </button>
                  );
                })}
              </div>
            )}
            {p.tipo === 'abierta' && (
              <label className="col g8">
                <b>Tu respuesta</b>
                <textarea rows={6} value={(resp[p.id] as string) ?? ''} onChange={(e) => setResp((r) => ({ ...r, [p.id]: e.target.value }))} placeholder="Escribe con tus palabras, citando lo que recuerdes del texto" style={{ width: '100%', lineHeight: 1.45 }} />
              </label>
            )}
            <div className="row g12">
              <button type="button" className="press btn sm paper" disabled={idx === 0} onClick={() => setIdx(idx - 1)}>Anterior</button>
              <button type="button" className="press btn sm blue sign" disabled={idx === preg.length - 1} onClick={() => setIdx(idx + 1)}>Siguiente</button>
            </div>
          </section>

          <aside className="col g16" style={{ flex: '1 1 300px', minWidth: 0 }} aria-label="Tiempo y mapa de preguntas">
            <div className="sign-ink" style={{ padding: '22px 24px 26px' }}>
              <p style={{ fontSize: 15 }}>Tiempo restante</p>
              <p className="cron d" role="timer" aria-live="off">{reloj(restante)}</p>
            </div>
            <div className="card sm col g12">
              <b>Mapa de preguntas</b>
              <div className="navgrid">
                {preg.map((x, i) => {
                  const hechaX = hecha(x, resp[x.id]);
                  const actual = i === idx;
                  return (
                    <button
                      key={x.id}
                      type="button"
                      aria-label={`Pregunta ${i + 1}${hechaX ? ', respondida' : ''}${marcadas[x.id] ? ', marcada' : ''}`}
                      aria-current={actual ? 'step' : undefined}
                      onClick={() => setIdx(i)}
                      style={{ background: actual ? 'var(--yellow)' : hechaX ? 'var(--blue)' : '#fff', color: hechaX && !actual ? '#fff' : 'var(--ink)', border: '3px solid var(--ink)' }}
                    >
                      {i + 1}
                      {marcadas[x.id] && <span className="flagdot" />}
                    </button>
                  );
                })}
              </div>
              <p className="muted" style={{ fontSize: 15 }}>{plural(respondidas, 'respondida', 'respondidas')}, {sin} sin responder.</p>
            </div>
            {!confirmar ? (
              <button type="button" className="press btn sign-red" onClick={() => setConfirmar(true)}>Entregar</button>
            ) : (
              <div className="card sm col g12" role="alertdialog" aria-label="Confirmar entrega">
                <p><b>{sin > 0 ? `Te quedan ${plural(sin, 'pregunta', 'preguntas')} sin responder.` : 'Respondiste todas las preguntas.'}</b> Al entregar no podrás cambiar tus respuestas.</p>
                <div className="row g12">
                  <button type="button" className="press btn sm sign-red" onClick={entregar}>Entregar ahora</button>
                  <button type="button" className="press btn sm paper" onClick={() => setConfirmar(false)}>Seguir</button>
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    );
  }

  // ---------- Autocorrección de abiertas ----------
  if (fase === 'grade') {
    const abiertas = preg.filter((p) => p.tipo === 'abierta');
    const pendientes = abiertas.filter((p) => notas[p.id] === undefined).length;
    return (
      <div className="page narrow">
        <div className="col g8" style={{ maxWidth: 860 }}>
          <h1 className="h1 m d">Corrige tus abiertas</h1>
          <p className="lead">Compara cada respuesta con la de la ficha y marca si la tenías completa. Una respuesta incompleta cuenta como no sabida.</p>
        </div>
        <ul className="col g20">
          {abiertas.map((p, i) => (
            <li key={p.id} className="pregunta" style={{ gap: 16 }}>
              <span className="tag" style={{ alignSelf: 'flex-start' }}>{i + 1} de {abiertas.length}, {etiqueta(p.lectura)}</span>
              <p className="d" style={{ fontSize: 24, fontWeight: 800 }}>{p.enunciado}</p>
              <div className="col g8"><b>Lo que respondiste</b><p className="muted" style={{ whiteSpace: 'pre-wrap' }}>{(resp[p.id] as string)?.trim() || 'Sin respuesta'}</p></div>
              <div className="respuesta neutral"><b>Respuesta de la ficha</b><p className="t">{p.respuesta}</p>{p.referencia && <p><span className="pill">{p.referencia}</span></p>}</div>
              <div className="autograde">
                <button type="button" className="press sign-green" aria-pressed={notas[p.id] === true} style={{ outline: notas[p.id] === true ? '4px solid var(--ink)' : undefined }} onClick={() => setNotas((n) => ({ ...n, [p.id]: true }))}>La tenía</button>
                <button type="button" className="press sign-red" aria-pressed={notas[p.id] === false} style={{ outline: notas[p.id] === false ? '4px solid var(--ink)' : undefined }} onClick={() => setNotas((n) => ({ ...n, [p.id]: false }))}>No la tenía</button>
              </div>
            </li>
          ))}
        </ul>
        <div className="row center g16">
          <button type="button" className="press btn blue sign" disabled={pendientes > 0} onClick={() => setFase('result')}>Ver el balance</button>
          {pendientes > 0 && <span className="muted">Faltan {plural(pendientes, 'abierta', 'abiertas')} por corregir.</span>}
        </div>
      </div>
    );
  }

  // ---------- Balance ----------
  const porLectura: Record<string, [number, number]> = {};
  for (const p of preg) {
    const [o, t] = porLectura[p.lectura] ?? [0, 0];
    porLectura[p.lectura] = [o + (acierta(p) ? 1 : 0), t + 1];
  }
  const nota = pct(ok, preg.length);
  const veredicto = nota >= 80 ? 'Lista para el parcial en esta selección' : nota >= 60 ? 'Vas bien, repasa las falladas' : 'Todavía hay huecos, vuelve a las fichas';
  const lista = soloFalladas ? preg.filter((p) => !acierta(p)) : preg;

  return (
    <div className="page narrow">
      <section className="card row center" style={{ gap: 32 }} aria-label="Balance del simulacro">
        <div style={{ flex: '1 1 300px', display: 'flex', justifyContent: 'center' }}><Medidor valor={nota} /></div>
        <div className="col g12" style={{ flex: '2 1 360px' }}>
          <h1 className="h1 m d">{ok} de {preg.length}</h1>
          <p className="lead">{nota}% de aciertos en {reloj(usados)} de {reloj(total)}. {veredicto}.</p>
          <div className="row g12">
            <button type="button" className="press btn blue sign" onClick={() => { setFase('config'); }}>Otro simulacro</button>
            <Link className="press btn paper" to="/">Volver al mapa</Link>
          </div>
        </div>
      </section>

      <section className="col g12" aria-label="Resultado por lectura">
        <h2 className="h2 d">Por lectura</h2>
        <ul className="col g12">
          {Object.entries(porLectura).map(([id, [o, t]]) => (
            <li key={id} className="col g8">
              <div className="row between"><b>{etiqueta(id)}</b><span>{o} de {t}</span></div>
              <Barra valor={pct(o, t)} oscura etiqueta={etiqueta(id)} />
            </li>
          ))}
        </ul>
      </section>

      <section className="col g16" aria-label="Revisión de preguntas">
        <div className="row center between g12">
          <h2 className="h2 d">Revisión</h2>
          <Chips etiqueta="Filtro de revisión" valor={soloFalladas ? 'f' : 't'} onChange={(v) => setSoloFalladas(v === 'f')} opciones={[{ v: 't', t: 'Todas' }, { v: 'f', t: 'Solo falladas' }]} />
        </div>
        {lista.length === 0 && <p className="empty">No fallaste ninguna.</p>}
        <ul className="col g12">
          {lista.map((p) => {
            const a = acierta(p);
            const elegida = resp[p.id];
            return (
              <li key={p.id} className="par" style={{ borderColor: a ? 'var(--green)' : 'var(--red)' }}>
                <div className="row g8">
                  <span className={`pill ${a ? 'green' : 'red'}`}>{a ? 'Acierto' : 'Fallo'}</span>
                  <span className="tag">{etiqueta(p.lectura)}</span>
                  {p.referencia && <span className="pill">{p.referencia}</span>}
                </div>
                <b>{p.enunciado}</b>
                {p.tipo === 'vf' && <>
                  <span className="muted">Tu respuesta: {elegida === undefined ? 'sin responder' : elegida ? 'Verdadero' : 'Falso'}</span>
                  <span><b>Respuesta correcta</b> · {p.verdadera ? 'Verdadero' : 'Falso'}</span>
                </>}
                {p.tipo === 'opcion' && <>
                  <span className="muted">Tu respuesta: {typeof elegida === 'number' ? p.opciones[elegida] : 'sin responder'}</span>
                  <span><b>Respuesta correcta</b> · {p.opciones[p.correcta]}</span>
                  {typeof elegida === 'number' && elegida !== p.correcta && p.errores?.[elegida] && <span><b>Por qué falla la que elegiste.</b> {p.errores[elegida]}</span>}
                </>}
                {p.tipo === 'vfbloque' && <BloqueVF item={p} respuestas={(elegida as (boolean | undefined)[] | undefined) ?? []} revelar />}
                {p.tipo === 'completar' && <Completar item={p} respuestas={(elegida as RespCompletar | undefined) ?? []} revelar />}
                {p.tipo !== 'vfbloque' && p.tipo !== 'completar' && <span>{p.tipo === 'opcion' ? p.explicacion ?? p.respuesta : p.respuesta}</span>}
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
