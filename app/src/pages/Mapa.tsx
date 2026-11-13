import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Barra, Rombo } from '../components/ui';
import { IcAudio } from '../components/icons';
import { ZONAS, diasRestantes } from '../lib/config';
import { INDICE, etiqueta, filasDeSemana, prefijoPreguntas, semanaMeta } from '../lib/data';
import { estadisticasPrefijo, kilometros, racha, rango, usarProg } from '../lib/store';
import { pct, plural } from '../lib/util';

// Polígonos y rótulos tomados del tablero de diseño aprobado.
const POLI_ESC: Record<number, { p: string; x: number; y: number }> = {
  1: { p: '30,40 200,24 225,120 212,250 44,262 24,140', x: 54, y: 123 },
  2: { p: '250,30 420,40 438,150 424,262 250,248 237,130', x: 274, y: 119 },
  3: { p: '462,24 640,34 651,140 630,250 470,262 450,120', x: 489, y: 119 },
  4: { p: '676,40 850,24 864,130 846,262 680,250 663,150', x: 699, y: 119 },
  5: { p: '676,310 846,298 864,420 850,536 680,522 663,410', x: 699, y: 394 },
  6: { p: '466,298 640,312 651,430 636,536 462,520 450,410', x: 484, y: 394 },
  7: { p: '250,312 424,298 438,420 420,520 254,536 237,400', x: 269, y: 389 },
  8: { p: '40,298 212,312 225,410 200,530 30,520 24,400', x: 54, y: 389 },
};
const POLI_MOV: Record<number, { p: string; x: number; y: number; corto: string }> = {
  1: { p: '14,10 158,6 172,51 164,104 18,100 8,55', x: 18, y: 15, corto: 'Gutiérrez' },
  2: { p: '194,10 338,6 352,51 344,104 198,100 188,55', x: 198, y: 15, corto: 'Santos' },
  3: { p: '194,114 338,110 352,155 344,208 198,204 188,159', x: 198, y: 119, corto: 'Polèse' },
  4: { p: '14,114 158,110 172,155 164,208 18,204 8,159', x: 18, y: 119, corto: 'Camagni' },
  5: { p: '14,218 158,214 172,259 164,312 18,308 8,263', x: 18, y: 223, corto: 'Cuervo' },
  6: { p: '194,218 338,214 352,259 344,312 198,308 188,263', x: 198, y: 223, corto: 'SDP' },
  7: { p: '194,322 338,318 352,363 344,416 198,412 188,367', x: 198, y: 327, corto: 'Herce' },
  8: { p: '14,322 158,318 172,363 164,416 18,412 8,367', x: 18, y: 327, corto: 'Fernández' },
};

type Zona = { semana: number; nombre: string; dom: number; total: number; fallas: number; intentos: number; pct: number };
const estadoDe = (z: Zona) => (z.intentos === 0 && z.dom === 0 ? 'sin' : z.pct >= 80 ? 'dominada' : 'curso');
const textoEstado = (z: Zona) =>
  estadoDe(z) === 'sin' ? 'sin empezar' : `dominio ${z.pct} por ciento`;

function Defs({ zonas }: { zonas: Zona[] }) {
  return (
    <defs>
      <pattern id="fog" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <rect width="12" height="12" fill="#E4EBED" />
        <line x1="0" y1="0" x2="0" y2="12" stroke="#AFC1C9" strokeWidth="3" />
      </pattern>
      {zonas.map((z) => {
        const o = Math.max(0, Math.min(1, z.pct / 100));
        const verde = estadoDe(z) === 'dominada';
        const c = verde ? '#00704A' : '#0B5CAD';
        return (
          <linearGradient key={z.semana} id={`g${z.semana}`} x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor={c} />
            <stop offset={o} stopColor={c} />
            <stop offset={o} stopColor="#F8FAFA" />
            <stop offset="1" stopColor="#F8FAFA" />
          </linearGradient>
        );
      })}
    </defs>
  );
}

function relleno(z: Zona) {
  return estadoDe(z) === 'sin' ? 'url(#fog)' : `url(#g${z.semana})`;
}

function MapaEscritorio({ zonas, objetivo }: { zonas: Zona[]; objetivo: number }) {
  return (
    <svg viewBox="0 0 900 560" role="group" aria-label="Mapa con las 8 semanas del parcial">
      <Defs zonas={zonas} />
      <path d="M0 292 C120 262 220 318 340 290 S560 262 680 292 S820 306 900 280" fill="none" stroke="#A8C7D1" strokeWidth="18" strokeLinecap="round" />
      {zonas.map((z) => {
        const g = POLI_ESC[z.semana];
        const sin = estadoDe(z) === 'sin';
        return (
          <Link key={z.semana} to={`/semana/${z.semana}`} aria-label={`Semana ${z.semana}, ${z.nombre}, ${textoEstado(z)}${z.fallas ? ', con preguntas falladas por repasar' : ''}`}>
            <polygon points={g.p} fill={relleno(z)} stroke="#0E2230" strokeOpacity={sin ? 0.55 : 1} strokeWidth="3" strokeDasharray={sin ? '9 7' : undefined} strokeLinejoin="round" />
          </Link>
        );
      })}
      <polyline points="120,150 340,145 555,145 765,145 765,420 550,420 335,415 120,415" fill="none" stroke="#0E2230" strokeWidth="6" strokeLinecap="round" strokeDasharray="1 12" />
      <g fontFamily="Overpass, sans-serif" aria-hidden="true" pointerEvents="none">
        {zonas.map((z) => {
          const g = POLI_ESC[z.semana];
          return (
            <g key={z.semana}>
              <rect x={g.x} y={g.y} width="132" height="54" rx="10" fill="#F8FAFA" stroke="#0E2230" strokeWidth="2.5" />
              <text x={g.x + 12} y={g.y + 24} fontSize="22" fontWeight="900" fill="#0E2230">S{z.semana}</text>
              <text x={g.x + 122} y={g.y + 24} fontSize="15" fontWeight="800" fill="#0E2230" textAnchor="end">{z.pct}%</text>
              <text x={g.x + 12} y={g.y + 44} fontSize="12.5" fontWeight="700" fill="#0E2230" fontFamily="Atkinson Hyperlegible, sans-serif">{z.nombre}</text>
            </g>
          );
        })}
      </g>
      {zonas.filter((z) => z.fallas > 0).map((z) => {
        const g = POLI_ESC[z.semana];
        return (
          <g key={`a${z.semana}`} aria-hidden="true" transform={`translate(${g.x + 150},${g.y - 67})`}>
            <rect x="-15" y="-15" width="30" height="30" transform="rotate(45)" fill="#FFC629" stroke="#0E2230" strokeWidth="3" />
            <text x="0" y="6" textAnchor="middle" fontFamily="Overpass, sans-serif" fontSize="18" fontWeight="900" fill="#0E2230">!</text>
          </g>
        );
      })}
      <g aria-hidden="true" transform={`translate(${POLI_ESC[objetivo].x + 66 - 340},${POLI_ESC[objetivo].y - 23 - 100})`}>
        <g className="bob">
          <circle cx="340" cy="100" r="12" fill="#FFC629" stroke="#0E2230" strokeWidth="3.5" />
          <path d="M333 109 L340 121 L347 109 Z" fill="#FFC629" stroke="#0E2230" strokeWidth="3" strokeLinejoin="round" />
        </g>
      </g>
    </svg>
  );
}

function MapaMovil({ zonas, objetivo }: { zonas: Zona[]; objetivo: number }) {
  return (
    <svg viewBox="0 0 360 422" role="group" aria-label="Mapa con las 8 semanas del parcial">
      <Defs zonas={zonas} />
      <path d="M90 55 H270 V159 H90 V263 H270 V367 H90" fill="none" stroke="#0E2230" strokeWidth="5" strokeLinecap="round" strokeDasharray="1 10" />
      {zonas.map((z) => {
        const g = POLI_MOV[z.semana];
        const sin = estadoDe(z) === 'sin';
        return (
          <Link key={z.semana} to={`/semana/${z.semana}`} aria-label={`Semana ${z.semana}, ${z.nombre}, ${textoEstado(z)}`}>
            <polygon points={g.p} fill={relleno(z)} stroke="#0E2230" strokeOpacity={sin ? 0.6 : 1} strokeWidth="3" strokeLinejoin="round" />
            <rect x={g.x} y={g.y} width="144" height="34" rx="9" fill="#F8FAFA" stroke="#0E2230" strokeWidth="2.5" />
            <text x={g.x + 9} y={g.y + 24} fontFamily="Overpass, sans-serif" fontSize="20" fontWeight="900" fill="#0E2230">S{z.semana}</text>
            <text x={g.x + 42} y={g.y + 22} fontFamily="Atkinson Hyperlegible, sans-serif" fontSize="14" fontWeight="700" fill="#0E2230">{g.corto}</text>
            <text x={g.x + 137} y={g.y + 23} textAnchor="end" fontFamily="Overpass, sans-serif" fontSize="16" fontWeight="900" fill="#0E2230">{z.pct}%</text>
          </Link>
        );
      })}
      {zonas.filter((z) => z.fallas > 0).map((z) => {
        const g = POLI_MOV[z.semana];
        return (
          <g key={`a${z.semana}`} aria-hidden="true" transform={`translate(${g.x + 130},${g.y + 63})`}>
            <rect x="-14" y="-14" width="28" height="28" transform="rotate(45)" fill="#FFC629" stroke="#0E2230" strokeWidth="3" />
            <text x="0" y="7" textAnchor="middle" fontFamily="Overpass, sans-serif" fontSize="20" fontWeight="900" fill="#0E2230">!</text>
          </g>
        );
      })}
      <g aria-hidden="true" transform={`translate(${POLI_MOV[objetivo].x + 40 - 236},${POLI_MOV[objetivo].y + 61 - 76})`}>
        <g className="bob">
          <circle cx="236" cy="76" r="11" fill="#FFC629" stroke="#0E2230" strokeWidth="3.5" />
          <path d="M229 84 L236 96 L243 84 Z" fill="#FFC629" stroke="#0E2230" strokeWidth="3" strokeLinejoin="round" />
        </g>
      </g>
    </svg>
  );
}

export default function Mapa() {
  const prog = usarProg();
  const zonas: Zona[] = useMemo(
    () =>
      ZONAS.map((z) => {
        let dom = 0, total = 0, fallas = 0, intentos = 0;
        for (const f of filasDeSemana(z.semana)) {
          const e = estadisticasPrefijo(prog, prefijoPreguntas(f.semana, f.lectura));
          dom += e.dom; fallas += e.fallas; intentos += e.intentos; total += f.respondibles;
        }
        return { ...z, dom, total, fallas, intentos, pct: pct(dom, total) };
      }),
    [prog],
  );

  const totalDom = zonas.reduce((a, z) => a + z.dom, 0);
  const totalResp = zonas.reduce((a, z) => a + z.total, 0);
  const avance = pct(totalDom, totalResp);
  const km = kilometros(prog);
  const { actual, siguiente } = rango(km);
  const dias = racha(prog);
  const avanceRango = siguiente ? pct(km - actual.km, siguiente.km - actual.km) : 100;

  // Zona recomendada: la que tiene menos dominio entre las que tienen preguntas.
  const objetivo = [...zonas].filter((z) => z.total > 0).sort((a, b) => a.pct - b.pct || a.semana - b.semana)[0] ?? zonas[0];
  const meta = semanaMeta(objetivo.semana);
  const sinLeer = meta?.lecturas.find((l) => l.ficha && !prog.leidas[l.id]);
  const vencidos = Object.values(prog.c).filter((c) => c.due <= Date.now()).length;

  const masFalladas = INDICE.lecturas
    .map((f) => ({ f, ...estadisticasPrefijo(prog, prefijoPreguntas(f.semana, f.lectura)) }))
    .filter((x) => x.fallas > 0)
    .sort((a, b) => b.fallas - a.fallas)
    .slice(0, 3);
  const totalFallas = masFalladas.reduce((a, x) => a + x.fallas, 0);

  const ultimo = prog.sims[prog.sims.length - 1];
  const dRest = diasRestantes();

  return (
    <div className="page">
      <div className="row" style={{ alignItems: 'flex-start', gap: 32 }}>
        <section aria-label="Mapa de las ocho semanas" className="col g16" style={{ flex: '2 1 640px', minWidth: 0 }}>
          <div className="col g8" style={{ maxWidth: 720 }}>
            <h1 className="h1 d">Pinta todo el mapa antes del parcial</h1>
            <p className="lead">Cada zona es una semana de lecturas y se llena a medida que dominas sus preguntas. Entra primero a la que tenga menos color.</p>
          </div>

          <ul className="statsmob" aria-label="Resumen">
            <li><p className="d">{km} km</p><p>{actual.nombre}</p></li>
            <li><p className="d">{plural(dias, 'día', 'días')}</p><p>Racha</p></li>
            <li><p className="d">{avance}%</p><p>Avance global</p></li>
          </ul>

          <div className="mapa-wrap map-desk"><MapaEscritorio zonas={zonas} objetivo={objetivo.semana} /></div>
          <div className="map-mob"><MapaMovil zonas={zonas} objetivo={objetivo.semana} /></div>

          <ul className="legend" aria-label="Leyenda">
            <li><svg width="30" height="22" aria-hidden="true"><rect x="1.5" y="1.5" width="27" height="19" rx="4" fill="#00704A" stroke="#0E2230" strokeWidth="2" /></svg>Dominada, 80% o más</li>
            <li><svg width="30" height="22" aria-hidden="true"><rect x="1.5" y="1.5" width="27" height="19" rx="4" fill="#F8FAFA" stroke="#0E2230" strokeWidth="2" /><rect x="1.5" y="11" width="27" height="9.5" rx="3" fill="#0B5CAD" /></svg>En curso, se llena de abajo hacia arriba</li>
            <li><svg width="30" height="22" aria-hidden="true"><rect x="1.5" y="1.5" width="27" height="19" rx="4" fill="#E4EBED" stroke="#0E2230" strokeOpacity=".55" strokeWidth="2" strokeDasharray="5 4" /></svg>Sin empezar</li>
            <li><svg width="24" height="24" viewBox="-14 -14 28 28" aria-hidden="true"><rect x="-9" y="-9" width="18" height="18" transform="rotate(45)" fill="#FFC629" stroke="#0E2230" strokeWidth="2.5" /></svg>Tiene preguntas falladas por repasar</li>
          </ul>
          <p className="muted" style={{ fontSize: 15 }}>
            El dominio de una zona es la parte de sus preguntas que has contestado bien al menos dos veces y acertaste la última. Hay {INDICE.totales.preguntas} preguntas en el banco; {totalResp} ya tienen respuesta y entran al dominio.
          </p>
        </section>

        <div className="col g24" style={{ flex: '1 1 340px', minWidth: 0 }}>
          <section className="tarjeta" aria-label="Tu tarjeta de viajero">
            <div className="franja"><span style={{ background: 'var(--blue)' }} /><span style={{ background: 'var(--green)' }} /><span style={{ background: 'var(--yellow)' }} /><span style={{ background: 'var(--red)' }} /></div>
            <p style={{ fontSize: 15, color: '#BCD0DA' }}>Tu tarjeta de viajero</p>
            <h2 className="d" style={{ fontSize: 38, fontWeight: 900, lineHeight: 1 }}>{actual.nombre}</h2>
            <p style={{ fontSize: 18 }}>
              {siguiente ? <>Te faltan <b>{siguiente.km - km} km</b> para llegar a {siguiente.nombre}.</> : 'Llegaste al rango más alto.'}
            </p>
            <div role="img" aria-label={`Avance hacia el siguiente rango: ${avanceRango} por ciento`} style={{ height: 12, borderRadius: 6, background: 'rgba(255,255,255,.22)' }}>
              <div style={{ width: `${avanceRango}%`, height: 12, borderRadius: 6, background: 'var(--yellow)' }} />
            </div>
            <p style={{ fontSize: 15, color: '#D3E1E8' }}>
              Cada 5 respuestas bien contestadas suman 1 km. Llevas {km} km y {plural(dias, 'día seguido', 'días seguidos')}. Dominio global: {avance}%.
            </p>
          </section>

          <section className="sign-green mision" aria-label="Misión de hoy">
            <h2 className="d" style={{ fontSize: 28, fontWeight: 900, lineHeight: 1.1 }}>
              Misión de hoy: zona de la semana {objetivo.semana}
            </h2>
            <ol>
              <li>
                <span className="n d">1</span>
                {sinLeer ? (
                  <Link className="press" to={`/leer/${objetivo.semana}/${sinLeer.id}`}><b>Lee la ficha de {etiqueta(sinLeer.id)}</b><small>Márcala como leída al terminar</small></Link>
                ) : (
                  <Link className="press" to={`/trampas?semana=${objetivo.semana}`}><b>Repasa las trampas de la semana {objetivo.semana}</b><small>Lo que el parcial cambia con sutileza</small></Link>
                )}
              </li>
              <li>
                <span className="n d">2</span>
                <Link className="press" to={`/practica?semana=${objetivo.semana}&n=10&ir=1`}><b>Responde 10 preguntas de la semana {objetivo.semana}</b><small>Verdadero o falso y abiertas</small></Link>
              </li>
              <li>
                <span className="n d">3</span>
                <Link className="press" to="/boletos"><b>{vencidos > 0 ? `Valida ${Math.min(vencidos, 12)} boletos de repaso` : 'Abre tus boletos de repaso'}</b><small>{vencidos > 0 ? `${plural(vencidos, 'vencido', 'vencidos')} hoy` : 'Conceptos y pares de diferencias'}</small></Link>
              </li>
            </ol>
          </section>

          <section className="plate" aria-label="Lo que más fallas" style={{ padding: '26px 28px 28px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div className="row center g12" style={{ flexWrap: 'nowrap' }}>
              <Rombo size={46} />
              <h2 className="d" style={{ fontSize: 23, fontWeight: 900, lineHeight: 1.1 }}>
                {masFalladas.length ? 'Lo que más fallas' : 'Sin errores registrados'}
              </h2>
            </div>
            {masFalladas.length ? (
              <>
                <p>Tienes {plural(totalFallas, 'pregunta fallada', 'preguntas falladas')} en estas lecturas:</p>
                <ul className="col g8">
                  {masFalladas.map((x) => (
                    <li key={x.f.lectura}>
                      <Link to={`/practica?semana=${x.f.semana}&lectura=${x.f.lectura}&modo=fallas&ir=1`} className="press btn sm" style={{ width: '100%', justifyContent: 'space-between', background: 'var(--ink)', color: '#fff' }}>
                        <span>{etiqueta(x.f.lectura)}</span><span>{x.fallas}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p>Cuando falles una pregunta aparecerá aquí la lectura a la que debes volver.</p>
            )}
          </section>
        </div>
      </div>

      <section aria-label="Para entender" className="col g20">
        <h2 className="h2 d">Para entender cada lectura</h2>
        <div className="row" style={{ gap: 28 }}>
          <Link className="press sign acceso" to="/leer" style={{ flex: '1 1 440px', minHeight: 230 }}>
            <h3 className="d">Leer las fichas</h3>
            <p>La ficha de cada lectura con sus secciones, trampas y pares de diferencias, citando las páginas del original.</p>
            <p className="pie">{INDICE.lecturas.length} lecturas con ficha</p>
          </Link>
          <div className="sign-ink acceso off" aria-disabled="true" style={{ flex: '1 1 440px', minHeight: 230 }}>
            <div className="row center g12" style={{ flexWrap: 'nowrap' }}><span style={{ filter: 'invert(1)' }}><IcAudio /></span><h3 className="d">Escuchar</h3></div>
            <p>Audio de cada lectura con el texto a la vista. Aún no hay audios generados.</p>
            <p className="pie">Audio pendiente</p>
          </div>
        </div>
      </section>

      <section aria-label="Para practicar" className="col g20">
        <h2 className="h2 d">Para practicar hasta que no falles</h2>
        <div className="row" style={{ gap: 28 }}>
          <Link className="press sign acceso" to="/practica">
            <h3 className="d">Practicar</h3>
            <p>Verdadero o falso y preguntas abiertas por semana o lectura.</p>
            <p className="pie">{totalResp} preguntas con respuesta</p>
          </Link>
          <Link className="press plate acceso" to="/trampas">
            <Rombo />
            <h3 className="d">Trampas y pares</h3>
            <p>Las trampas de cada lectura y las diferencias sutiles entre conceptos parecidos.</p>
            <p className="pie">{INDICE.totales.trampas} trampas, {INDICE.totales.pares} pares</p>
          </Link>
          <Link className="press acceso paper" to="/boletos">
            <h3 className="d">Boletos</h3>
            <p>Conceptos que vuelven según lo que olvidas, con intervalos ajustados a los días que quedan.</p>
            <p className="pie">{vencidos > 0 ? `${plural(vencidos, 'boleto vencido', 'boletos vencidos')}` : 'Sin boletos vencidos'}</p>
          </Link>
          <Link className="press sign-ink acceso" to="/simulacro">
            <h3 className="d">Hora pico</h3>
            <p>Simulacro con cronómetro, sin ver la respuesta hasta entregar.</p>
            <p className="pie">{ultimo ? `Último intento: ${ultimo.ok} de ${ultimo.total}` : 'Aún sin intentos'}</p>
          </Link>
        </div>
        <p className="muted" style={{ fontSize: 15 }}>
          {dRest > 0 ? `Faltan ${plural(dRest, 'día', 'días')} para el parcial.` : 'El parcial es hoy.'}
        </p>
      </section>
    </div>
  );
}
