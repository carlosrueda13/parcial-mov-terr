import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Barra, Cargando, Chips } from '../components/ui';
import { INDICE, Item, etiqueta } from '../lib/data';
import { useContenido } from '../lib/hooks';
import { guardarSim, registrarRespuesta, usarProg } from '../lib/store';
import { barajar, pct, plural, reloj } from '../lib/util';

type Tipo = 'completo' | 'semana' | 'vf' | 'abiertas';
type Fase = 'config' | 'run' | 'grade' | 'result';
type Resp = boolean | string | undefined;

const TIPOS: { v: Tipo; t: string }[] = [
  { v: 'completo', t: 'Completo' },
  { v: 'semana', t: 'Por semana' },
  { v: 'vf', t: 'Solo verdadero o falso' },
  { v: 'abiertas', t: 'Solo abiertas' },
];
const NOMBRE_TIPO: Record<Tipo, string> = { completo: 'completo', semana: 'por semana', vf: 'verdadero o falso', abiertas: 'abiertas' };
const SEG_POR_PREGUNTA = 60;

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
  const [tipo, setTipo] = useState<Tipo>('completo');
  const [semana, setSemana] = useState(1);
  const [cantidad, setCantidad] = useState<number>(20);

  const filas = useMemo(() => INDICE.lecturas.filter((f) => tipo !== 'semana' || f.semana === semana), [tipo, semana]);
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
  const [soloFalladas, setSoloFalladas] = useState(false);
  const [usados, setUsados] = useState(0);
  const fin = useRef(0);
  const guardado = useRef(false);

  const disponibles = useMemo(() => {
    if (!contenido) return [];
    return contenido.items.filter((i) => (tipo === 'vf' ? i.tipo === 'vf' : tipo === 'abiertas' ? i.tipo === 'abierta' : true));
  }, [contenido, tipo]);

  const iniciar = () => {
    const lista = barajar(disponibles).slice(0, cantidad);
    setPreg(lista);
    setResp({});
    setMarcadas({});
    setNotas({});
    setIdx(0);
    setConfirmar(false);
    setSoloFalladas(false);
    const seg = lista.length * SEG_POR_PREGUNTA;
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

  const acierta = (p: Item): boolean => (p.tipo === 'vf' ? resp[p.id] === p.verdadera : !!notas[p.id]);
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
    guardarSim({ ts: Date.now(), tipo: NOMBRE_TIPO[tipo], total: preg.length, ok, seg: usados, porLectura, falladas });
  }, [fase]);

  // ---------- Configuración ----------
  if (fase === 'config') {
    const ultimo = prog.sims[prog.sims.length - 1];
    return (
      <div className="page narrow">
        <div className="col g8" style={{ maxWidth: 860 }}>
          <h1 className="h1 m d">Hora pico</h1>
          <p className="lead">Simulacro con cronómetro. No ves la respuesta hasta entregar y, al final, corriges tus abiertas contra la ficha.</p>
        </div>
        <section className="card col g20" aria-label="Configurar simulacro">
          <div className="col g8"><b>Tipo</b><Chips etiqueta="Tipo de simulacro" valor={tipo} onChange={(v) => setTipo(v as Tipo)} opciones={TIPOS} /></div>
          {tipo === 'semana' && (
            <label className="col g8" style={{ maxWidth: 260 }}>
              <b>Semana</b>
              <select value={semana} onChange={(e) => setSemana(Number(e.target.value))}>
                {Array.from(new Set(INDICE.lecturas.map((f) => f.semana))).map((s) => <option key={s} value={s}>Semana {s}</option>)}
              </select>
            </label>
          )}
          <div className="col g8"><b>Preguntas</b><Chips etiqueta="Cantidad de preguntas" valor={cantidad} onChange={(v) => setCantidad(Number(v))} opciones={[{ v: 10, t: '10' }, { v: 20, t: '20' }, { v: 30, t: '30' }]} /></div>
          {!contenido ? (
            <Cargando />
          ) : (
            <div className="row center g16">
              <button type="button" className="press btn blue sign" disabled={disponibles.length === 0} onClick={iniciar}>Empezar el simulacro</button>
              <span className="muted">
                {disponibles.length ? `${Math.min(cantidad, disponibles.length)} preguntas, ${Math.min(cantidad, disponibles.length)} minutos (1 por pregunta)` : 'No hay preguntas con esta selección'}
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
            {ultimo && <p className="muted">Los aciertos y fallas de cada intento también cuentan para el dominio del mapa.</p>}
          </section>
        )}
      </div>
    );
  }

  // ---------- En curso ----------
  if (fase === 'run') {
    const p = preg[idx];
    const respondidas = preg.filter((x) => resp[x.id] !== undefined && resp[x.id] !== '').length;
    const sin = preg.length - respondidas;
    return (
      <div className="page narrow">
        <div className="row" style={{ alignItems: 'flex-start', gap: 28 }}>
          <section className="pregunta" style={{ flex: '2 1 560px', minWidth: 0 }} aria-label={`Pregunta ${idx + 1} de ${preg.length}`}>
            <div className="row g8 center between">
              <div className="row g8">
                <span className="tag">Pregunta {idx + 1} de {preg.length}</span>
                <span className="tag">{p.tipo === 'vf' ? 'Verdadero o falso' : 'Abierta'}</span>
              </div>
              <button type="button" className="chip" aria-pressed={!!marcadas[p.id]} onClick={() => setMarcadas((m) => ({ ...m, [p.id]: !m[p.id] }))}>
                {marcadas[p.id] ? 'Marcada para revisar' : 'Marcar para revisar'}
              </button>
            </div>
            <p className="texto d">{p.enunciado}</p>
            {p.tipo === 'vf' ? (
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
            ) : (
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
                  const hecha = resp[x.id] !== undefined && resp[x.id] !== '';
                  const actual = i === idx;
                  return (
                    <button
                      key={x.id}
                      type="button"
                      aria-label={`Pregunta ${i + 1}${hecha ? ', respondida' : ''}${marcadas[x.id] ? ', marcada' : ''}`}
                      aria-current={actual ? 'step' : undefined}
                      onClick={() => setIdx(i)}
                      style={{ background: actual ? 'var(--yellow)' : hecha ? 'var(--blue)' : '#fff', color: hecha && !actual ? '#fff' : 'var(--ink)', border: '3px solid var(--ink)' }}
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
            return (
              <li key={p.id} className="par" style={{ borderColor: a ? 'var(--green)' : 'var(--red)' }}>
                <div className="row g8">
                  <span className={`pill ${a ? 'green' : 'red'}`}>{a ? 'Acierto' : 'Fallo'}</span>
                  <span className="tag">{etiqueta(p.lectura)}</span>
                  {p.referencia && <span className="pill">{p.referencia}</span>}
                </div>
                <b>{p.enunciado}</b>
                {p.tipo === 'vf' && <span className="muted">Tu respuesta: {resp[p.id] === undefined ? 'sin responder' : resp[p.id] ? 'Verdadero' : 'Falso'}</span>}
                <span>{p.respuesta}</span>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
