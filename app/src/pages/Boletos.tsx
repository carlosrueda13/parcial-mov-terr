import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Barra, Cargando, Chips } from '../components/ui';
import { INDICE, etiqueta } from '../lib/data';
import { useContenido } from '../lib/hooks';
import { calificarBoleto, fallada, usarProg } from '../lib/store';
import { CALIFICACIONES, textoCuando } from '../lib/srs';
import { barajar, plural } from '../lib/util';

type Boleto = { id: string; esPregunta: boolean; frente: string; dorso: string; ref: string | null; semana: number; lectura: string };
type Mazo = 'hoy' | 'fallas' | 'todos';

const COLORES = ['#FFC629', '#D6E6F5', '#D3EBE1', '#FFEFB8'];

function Cara({ dorso, children, lateral }: { dorso?: boolean; children: React.ReactNode; lateral: React.ReactNode }) {
  const fondo = dorso ? '#FFFFFF' : '#FFC629';
  return (
    <div className={`face${dorso ? ' face-back' : ''}`}>
      <svg className="bg" viewBox="0 0 720 400" preserveAspectRatio="none" aria-hidden="true">
        <path d="M16 4 H704 Q716 4 716 16 V176 A24 24 0 0 0 716 224 V384 Q716 396 704 396 H16 Q4 396 4 384 V224 A24 24 0 0 0 4 176 V16 Q4 4 16 4 Z" fill={fondo} stroke="#0E2230" strokeWidth="4" strokeLinejoin="round" />
        <path d="M556 22 V378" stroke="#0E2230" strokeWidth="3" strokeDasharray="5 6" />
      </svg>
      <div className="izq">{children}</div>
      <div className="der">{lateral}</div>
    </div>
  );
}

export default function Boletos() {
  const [sp, setSp] = useSearchParams();
  const prog = usarProg();
  const semana = Number(sp.get('semana') || 0);
  const lectura = sp.get('lectura') || '';
  const mazo = (sp.get('mazo') || 'hoy') as Mazo;

  const filas = useMemo(
    () => INDICE.lecturas.filter((f) => (!semana || f.semana === semana) && (!lectura || f.lectura === lectura)),
    [semana, lectura],
  );
  const contenido = useContenido(filas);

  const poner = (k: string, v: string, def = '') => {
    const nuevo = new URLSearchParams(sp);
    if (v === def) nuevo.delete(k);
    else nuevo.set(k, v);
    if (k === 'semana') nuevo.delete('lectura');
    setSp(nuevo, { replace: true });
  };

  const boletos: Boleto[] = useMemo(() => {
    if (!contenido) return [];
    return [
      ...contenido.items.map<Boleto>((i) => ({ id: i.id, esPregunta: true, frente: i.enunciado, dorso: i.respuesta, ref: i.referencia, semana: i.semana, lectura: i.lectura })),
      ...contenido.pares.map<Boleto>((p) => ({ id: p.id, esPregunta: false, frente: `¿En qué se diferencian? ${p.par}`, dorso: p.diferencia, ref: null, semana: p.semana, lectura: p.lectura })),
    ];
  }, [contenido]);

  const ahora = Date.now();
  const candidatos = useMemo(() => {
    const hoy = (b: Boleto) => {
      const c = prog.c[b.id];
      return !c || c.due <= ahora;
    };
    if (mazo === 'fallas') return boletos.filter((b) => (prog.c[b.id]?.fallas ?? 0) > 0 || fallada(prog.q[b.id]));
    if (mazo === 'todos') return boletos;
    return boletos.filter(hoy);
  }, [boletos, mazo, prog.c, prog.q]);

  const [cola, setCola] = useState<Boleto[] | null>(null);
  const [idx, setIdx] = useState(0);
  const [volteado, setVolteado] = useState(false);
  const [hechos, setHechos] = useState(0);
  const [colorIdx] = useState(() => Math.floor(Math.random() * COLORES.length));
  const dorsoRef = useRef<HTMLDivElement>(null);

  const iniciar = () => {
    // Primero los vencidos o con fallas, luego los nuevos; mezclados dentro de cada grupo.
    const vistos = candidatos.filter((b) => prog.c[b.id]);
    const nuevos = candidatos.filter((b) => !prog.c[b.id]);
    const lista = [...barajar(vistos), ...barajar(nuevos)].slice(0, mazo === 'hoy' ? 20 : 40);
    setCola(lista);
    setIdx(0);
    setVolteado(false);
    setHechos(0);
  };

  useEffect(() => {
    setCola(null);
  }, [mazo, semana, lectura]);

  const hablar = (texto: string) => {
    try {
      const s = window.speechSynthesis;
      if (!s) return;
      s.cancel();
      const u = new SpeechSynthesisUtterance(texto);
      u.lang = 'es-CO';
      s.speak(u);
    } catch {
      /* sin síntesis de voz */
    }
  };

  const semanas = Array.from(new Set(INDICE.lecturas.map((f) => f.semana)));
  const lecturasDeSemana = INDICE.lecturas.filter((f) => !semana || f.semana === semana);
  const vencidos = Object.values(prog.c).filter((c) => c.due <= ahora).length;

  if (!cola) {
    return (
      <div className="page narrow">
        <div className="col g8" style={{ maxWidth: 820 }}>
          <h1 className="h1 m d">Boletos de repaso</h1>
          <p className="lead">Cada boleto es una pregunta con respuesta o un par de conceptos parecidos. Lo que falles vuelve pronto; lo que domines, más tarde. Los intervalos se acortan a medida que se acerca el parcial.</p>
        </div>
        <section className="card col g20" aria-label="Elegir mazo">
          <div className="col g8">
            <b>Mazo</b>
            <Chips etiqueta="Mazo" valor={mazo} onChange={(v) => poner('mazo', v, 'hoy')} opciones={[{ v: 'hoy', t: 'Para hoy' }, { v: 'fallas', t: 'Con fallas' }, { v: 'todos', t: 'Todos' }]} />
          </div>
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
          {!contenido ? (
            <Cargando />
          ) : (
            <div className="row center g16">
              <button type="button" className="press btn blue sign" disabled={candidatos.length === 0} onClick={iniciar}>Empezar el repaso</button>
              <span className="muted">
                {candidatos.length ? `${plural(candidatos.length, 'boleto disponible', 'boletos disponibles')}` : mazo === 'fallas' ? 'Aún no tienes boletos con fallas' : 'No hay boletos para hoy'}
                {mazo === 'hoy' && vencidos > 0 ? `, ${plural(vencidos, 'vencido', 'vencidos')}` : ''}
              </span>
            </div>
          )}
        </section>
      </div>
    );
  }

  if (idx >= cola.length) {
    return (
      <div className="page narrow">
        <section className="card col g20" aria-label="Repaso terminado">
          <h1 className="h1 m d">Repaso terminado</h1>
          <p className="lead">Validaste {plural(hechos, 'boleto', 'boletos')}. Los que calificaste con Otra vez vuelven hoy.</p>
          <div className="row g16">
            <button type="button" className="press btn blue sign" onClick={() => setCola(null)}>Elegir otro mazo</button>
            <Link className="press btn paper" to="/">Volver al mapa</Link>
          </div>
        </section>
      </div>
    );
  }

  const b = cola[idx];
  const caja = prog.c[b.id]?.caja ?? 0;
  const color = COLORES[colorIdx];
  void color;
  const calificar = (r: number) => {
    calificarBoleto(b.id, r, b.esPregunta);
    setHechos((h) => h + 1);
    setVolteado(false);
    setIdx((i) => i + 1);
  };

  return (
    <div className="page narrow">
      <div className="row center between g12">
        <button type="button" className="back" style={{ background: 'none', border: 0, cursor: 'pointer', fontSize: 17 }} onClick={() => setCola(null)}>Terminar repaso</button>
        <span className="pill blue">Boleto {idx + 1} de {cola.length}</span>
      </div>
      <Barra valor={(idx / cola.length) * 100} etiqueta="Avance del repaso" />

      <div className="flip-perspective">
        <div className="flipper" style={{ transform: volteado ? 'rotateY(180deg)' : 'none' }}>
          <Cara
            lateral={<><b className="d" style={{ fontSize: 15 }}>{b.esPregunta ? 'Concepto' : 'Par'}</b><span style={{ fontSize: 13 }}>{etiqueta(b.lectura)}</span></>}
          >
            <p className="q d">{b.frente}</p>
          </Cara>
          <Cara
            dorso
            lateral={<><b className="d" style={{ fontSize: 15 }}>Respuesta</b>{b.ref && <span style={{ fontSize: 13 }}>{b.ref}</span>}</>}
          >
            <p className="a" ref={dorsoRef as any}>{b.dorso}</p>
          </Cara>
        </div>
      </div>

      <div className="row g12">
        <button type="button" className="press btn sm paper" onClick={() => setVolteado((v) => !v)} aria-pressed={volteado}>
          {volteado ? 'Ver el frente' : 'Voltear el boleto'}
        </button>
        <button type="button" className="press btn sm paper" onClick={() => hablar(volteado ? b.dorso : b.frente)}>Escuchar</button>
      </div>

      {volteado ? (
        <div className="col g12">
          <p><b>¿Cómo te fue?</b></p>
          <div className="califica">
            {CALIFICACIONES.map((c) => (
              <button
                key={c.k}
                type="button"
                className={`press ${c.k === 0 ? 'sign-red' : c.k === 1 ? 'sign-ink' : c.k === 2 ? 'sign' : 'sign-green'}`}
                onClick={() => calificar(c.k)}
              >
                <b className="d" style={{ fontSize: 18 }}>{c.etiqueta}</b>
                <small>Vuelve {textoCuando(c.k, caja)}</small>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <p className="muted">Piensa la respuesta y voltea el boleto para comprobarla.</p>
      )}
    </div>
  );
}
