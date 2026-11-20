import type { ReactNode } from 'react';

// Esquemas propios de los modelos del curso (no son copias de las figuras de los libros).
// Cada figura declara los puntos donde un ejercicio de "ubicar" pone un marcador numerado y los
// grupos de etiquetas que se pueden ocultar (`ocultos`) para que el marcador no delate la respuesta.

type Dibujo = (ver: (grupo: string) => boolean) => ReactNode;
type Def = { alt: string; w: number; h: number; puntos: Record<string, [number, number]>; dibujo: Dibujo };

const INK = 'var(--ink, #111)';
const MUTED = 'var(--muted, #555)';

type TP = { x: number; y: number; children: ReactNode; ancla?: 'start' | 'middle' | 'end'; peso?: number; tam?: number; color?: string };
const T = ({ x, y, children, ancla = 'start', peso = 600, tam = 14, color = INK }: TP) => (
  <text x={x} y={y} textAnchor={ancla} fontSize={tam} fontWeight={peso} fill={color} style={{ fontFamily: 'inherit' }}>{children}</text>
);
const Ejes = ({ x0, y0, x1, y1, ex, ey, mostrar = true }: { x0: number; y0: number; x1: number; y1: number; ex: string; ey: string; mostrar?: boolean }) => (
  <g>
    <defs>
      <marker id="flecha" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
        <path d="M0 0 L10 5 L0 10 z" fill={INK} />
      </marker>
    </defs>
    <line x1={x0} y1={y0} x2={x1} y2={y0} stroke={INK} strokeWidth={2.5} markerEnd="url(#flecha)" />
    <line x1={x0} y1={y0} x2={x0} y2={y1} stroke={INK} strokeWidth={2.5} markerEnd="url(#flecha)" />
    {mostrar && <T x={x1 - 4} y={y0 + 22} ancla="end" color={MUTED}>{ex}</T>}
    {mostrar && <T x={x0 + 8} y={y1 + 6} color={MUTED}>{ey}</T>}
  </g>
);
const Dash = ({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) => (
  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={MUTED} strokeWidth={1.5} strokeDasharray="5 5" />
);

// ---------- Índice de Intensidad de Metropolización (León-Ruiz 2016) ----------
const iim: Def = {
  alt: 'Evolución teórica del Índice de Intensidad de Metropolización: eje vertical con valores 1 y 2, tres fases en el eje del tiempo y cinco curvas en forma de U, de la a a la e.',
  w: 680, h: 410,
  puntos: { '1': [160, 378], '2': [340, 378], '3': [520, 378], '4': [330, 176], '5': [335, 281], '6': [400, 331] },
  dibujo: (ver) => (
    <g>
      <rect x={70} y={30} width={180} height={310} fill="#000" opacity={0.03} />
      <rect x={250} y={30} width={180} height={310} fill="#000" opacity={0.08} />
      <rect x={430} y={30} width={170} height={310} fill="#000" opacity={0.14} />
      <Ejes x0={70} y0={340} x1={640} y1={20} ex="Tiempo" ey="IIM" />
      <Dash x1={70} y1={170} x2={640} y2={170} /><Dash x1={70} y1={300} x2={640} y2={300} />
      <T x={52} y={175} ancla="end">2</T><T x={52} y={305} ancla="end">1</T>
      <path d="M170 45 Q 320 310 490 40" fill="none" stroke={INK} strokeWidth={2.5} />
      <path d="M120 100 Q 340 396 560 100" fill="none" stroke={INK} strokeWidth={2.5} />
      <path d="M110 225 Q 335 335 570 225" fill="none" stroke={INK} strokeWidth={2.5} />
      <path d="M265 310 Q 400 345 570 250" fill="none" stroke={INK} strokeWidth={2.5} />
      <path d="M90 255 Q 260 335 400 330" fill="none" stroke={INK} strokeWidth={2.5} />
      <T x={496} y={40} peso={800}>a</T><T x={566} y={98} peso={800}>b</T><T x={578} y={226} peso={800}>c</T>
      <T x={578} y={262} peso={800}>d</T><T x={408} y={334} peso={800}>e</T>
      {ver('fases') && (<>
        <T x={160} y={378} ancla="middle" tam={13}>Fase I: consolidación urbana</T>
        <T x={340} y={378} ancla="middle" tam={13}>Fase II: transición</T>
        <T x={520} y={378} ancla="middle" tam={13}>Fase III: metropolización</T>
      </>)}
    </g>
  ),
};

// ---------- Rango-tamaño (Cuervo-González, anexo 8.1) ----------
const rango: Def = {
  alt: 'Gráfico de rango-tamaño con logaritmos: una recta descendente que corta el eje vertical en A, con las ciudades como puntos cercanos a la recta; la ciudad mayor queda por encima de la recta.',
  w: 680, h: 370,
  puntos: { '1': [50, 80], '2': [460, 215], '3': [145, 50], '4': [300, 148] },
  dibujo: (ver) => (
    <g>
      <Ejes x0={80} y0={310} x1={640} y1={20} ex="Log R (rango; 1 = ciudad mayor)" ey="Log P (población)" />
      <line x1={80} y1={80} x2={600} y2={290} stroke={INK} strokeWidth={3} />
      {[[150, 108], [210, 140], [270, 150], [330, 180], [390, 197], [450, 235], [520, 250]].map(([x, y]) => <circle key={x} cx={x} cy={y} r={5} fill={INK} />)}
      <circle cx={112} cy={76} r={7} fill="#e11d48" stroke={INK} strokeWidth={1.5} />
      <circle cx={80} cy={80} r={4} fill={INK} />
      {ver('etiquetas') && (<>
        <T x={92} y={100} tam={14}>A</T>
        <T x={430} y={216} tam={14}>pendiente = −q</T>
        <T x={128} y={62} tam={13}>ciudad mayor (real)</T>
        <T x={300} y={158} tam={13} color={MUTED}>recta rango-tamaño</T>
      </>)}
    </g>
  ),
};

// ---------- Von Thünen: renta ofrecida y áreas de localización (Camagni cap. 2, fig. 2.1) ----------
const vonthunen: Def = {
  alt: 'Modelo de Von Thünen: renta frente a distancia, tres rectas decrecientes (a, b y c) con intercepto distinto; la renta efectiva es la envolvente superior; abajo, tres áreas concéntricas de localización alrededor del centro.',
  w: 680, h: 420,
  puntos: { '1': [62, 50], '2': [570, 172], '3': [90, 150], '4': [272, 108], '5': [520, 150], '6': [112, 182], '7': [158, 218], '8': [226, 290] },
  dibujo: (ver) => (
    <g>
      <Ejes x0={90} y0={150} x1={640} y1={20} ex="Distancia δ" ey="Renta" mostrar={ver('ejes')} />
      <line x1={90} y1={35} x2={215} y2={150} stroke={MUTED} strokeWidth={2} />
      <line x1={90} y1={80} x2={380} y2={150} stroke={MUTED} strokeWidth={2} />
      <line x1={90} y1={115} x2={520} y2={150} stroke={MUTED} strokeWidth={2} />
      <polyline points="90,35 156.3,96 308.8,132.8 520,150" fill="none" stroke={INK} strokeWidth={5} />
      <Dash x1={156.3} y1={96} x2={156.3} y2={150} /><Dash x1={308.8} y1={132.8} x2={308.8} y2={150} />
      {[[46, '#cbd5e1'], [120, '#e2e8f0'], [236, '#f1f5f9']].reverse().map(([r, c]) => (
        <path key={String(r)} d={`M90 ${150 + (r as number)} A ${r} ${r} 0 0 0 ${90 + (r as number)} 150 L90 150 Z`} fill={c as string} stroke={INK} strokeWidth={2} />
      ))}
      {ver('curvas') && (<>
        <T x={124} y={62} tam={14}>r(a)</T><T x={206} y={98} tam={14}>r(b)</T><T x={420} y={126} tam={14}>r(c)</T>
      </>)}
      {ver('areas') && (<>
        <T x={100} y={186} tam={14} peso={800}>a</T><T x={152} y={216} tam={14} peso={800}>b</T><T x={222} y={290} tam={14} peso={800}>c</T>
      </>)}
      {ver('ejes') && (<>
        <T x={82} y={172} ancla="end" tam={12} color={MUTED}>Centro</T>
        <T x={430} y={172} tam={12} color={MUTED}>δmax (renta cero)</T>
        <T x={330} y={44} tam={12} color={MUTED}>trazo grueso = renta efectiva</T>
      </>)}
    </g>
  ),
};

// ---------- Curvas de renta alrededor de un punto central (Polèse cap. 10, fig. 10.3) ----------
const polese103: Def = {
  alt: 'Curvas de renta de guisantes, trigo y pasto alrededor de un punto central, con la renta efectiva como envolvente, y abajo el plano de utilización del suelo con tres anillos concéntricos.',
  w: 680, h: 440,
  puntos: { '1': [385, 108], '2': [430, 146], '3': [540, 160], '4': [320, 314], '5': [320, 266], '6': [320, 232], '7': [400, 150] },
  dibujo: (ver) => (
    <g>
      <line x1={60} y1={190} x2={620} y2={190} stroke={INK} strokeWidth={2.5} />
      <line x1={320} y1={190} x2={320} y2={40} stroke={MUTED} strokeWidth={1.5} strokeDasharray="5 5" />
      <path d="M320 70 L440 190 M320 70 L200 190" stroke={MUTED} strokeWidth={2} fill="none" />
      <path d="M320 110 L480 190 M320 110 L160 190" stroke={MUTED} strokeWidth={2} fill="none" />
      <path d="M320 158 L610 190 M320 158 L30 190" stroke={MUTED} strokeWidth={2} fill="none" />
      <polyline points="30,190 196.8,171.6 240,150 320,70 400,150 443.2,171.6 610,190" fill="none" stroke={INK} strokeWidth={5} />
      <Dash x1={240} y1={150} x2={240} y2={190} /><Dash x1={400} y1={150} x2={400} y2={190} />
      <Dash x1={196.8} y1={171.6} x2={196.8} y2={190} /><Dash x1={443.2} y1={171.6} x2={443.2} y2={190} />
      <ellipse cx={320} cy={314} rx={230} ry={100} fill="#f1f5f9" stroke={INK} strokeWidth={2} />
      <ellipse cx={320} cy={314} rx={123} ry={62} fill="#e2e8f0" stroke={INK} strokeWidth={2} />
      <ellipse cx={320} cy={314} rx={80} ry={40} fill="#cbd5e1" stroke={INK} strokeWidth={2} />
      <T x={620} y={212} ancla="end" tam={12} color={MUTED}>km</T>
      {ver('cifras') && (<>
        <T x={320} y={208} ancla="middle" tam={12} color={MUTED}>0</T>
        <T x={400} y={208} ancla="middle" tam={12} color={MUTED}>5</T>
        <T x={440} y={208} ancla="middle" tam={12} color={MUTED}>7,5</T>
        <T x={480} y={208} ancla="middle" tam={12} color={MUTED}>10</T>
        <T x={308} y={78} ancla="end" tam={12} color={MUTED}>$75</T>
        <T x={308} y={118} ancla="end" tam={12} color={MUTED}>$50</T>
        <T x={407} y={184} tam={12} color={MUTED}>$25</T>
      </>)}
      {ver('curvas') && (<>
        <T x={296} y={60} ancla="end">Guisantes</T><T x={410} y={112}>Trigo</T><T x={470} y={166}>Pasto, ganadería</T>
      </>)}
      {ver('anillos') && (<>
        <T x={320} y={318} ancla="middle">Guisantes</T><T x={320} y={270} ancla="middle">Trigo</T><T x={320} y={236} ancla="middle">Pasto, ganadería</T>
      </>)}
      {ver('ejes') && <T x={320} y={430} ancla="middle" tam={13} color={MUTED}>Plano de utilización del suelo</T>}
    </g>
  ),
};

// ---------- Hipótesis de los sectores de Hoyt (Camagni cap. 2, fig. 2.9) ----------
const CX = 320, CY = 200;
const pol = (r: number, g: number): [number, number] => [CX + r * Math.cos((g * Math.PI) / 180), CY + r * Math.sin((g * Math.PI) / 180)];
const cuña = (g1: number, g2: number, r: number) => {
  const [x1, y1] = pol(r, g1); const [x2, y2] = pol(r, g2);
  return `M${CX} ${CY} L${x1.toFixed(1)} ${y1.toFixed(1)} A ${r} ${r} 0 0 1 ${x2.toFixed(1)} ${y2.toFixed(1)} Z`;
};
const SECTORES: { z: string; g1: number; g2: number; r: number; fill: string }[] = [
  { z: '2', g1: -115, g2: -65, r: 175, fill: '#94a3b8' },
  { z: '3', g1: -175, g2: -115, r: 130, fill: '#fca5a5' },
  { z: '3', g1: -65, g2: -5, r: 130, fill: '#fca5a5' },
  { z: '4', g1: -5, g2: 60, r: 130, fill: '#fde68a' },
  { z: '4', g1: 120, g2: 185, r: 130, fill: '#fde68a' },
  { z: '5', g1: 60, g2: 120, r: 175, fill: '#86efac' },
];
const hoyt: Def = {
  alt: 'Hipótesis de los sectores de Hoyt: un círculo central (distrito central de negocios) y sectores que salen del centro: industria ligera y almacenes, residencias de clases pobres, medias y ricas.',
  w: 780, h: 410,
  puntos: { '1': [320, 200], '2': [320, 80], '3': [250, 151], '4': [395, 239], '5': [320, 318] },
  dibujo: (ver) => (
    <g>
      {SECTORES.map((s, i) => <path key={i} d={cuña(s.g1, s.g2, s.r)} fill={s.fill} stroke={INK} strokeWidth={2} />)}
      <circle cx={CX} cy={CY} r={26} fill="#fff" stroke={INK} strokeWidth={2.5} />
      {ver('numeros') && (<>
        <T x={CX} y={CY + 5} ancla="middle" peso={800}>1</T>
        {SECTORES.map((s, i) => {
          const [x, y] = pol(s.r * 0.66, (s.g1 + s.g2) / 2);
          return <T key={i} x={x} y={y + 5} ancla="middle" peso={800}>{s.z}</T>;
        })}
      </>)}
      {ver('leyenda') && (
        <g>
          <T x={500} y={80} tam={13}>1  Distrito central de negocios</T>
          <T x={500} y={102} tam={13}>2  Industria ligera y almacenes</T>
          <T x={500} y={124} tam={13}>3  Residencias de clases pobres</T>
          <T x={500} y={146} tam={13}>4  Residencias de clases medias</T>
          <T x={500} y={168} tam={13}>5  Residencias de clases ricas</T>
        </g>
      )}
    </g>
  ),
};

// ---------- Distancia y costo de transporte (Polèse cap. 2, fig. 2.1) ----------
const costotransporte: Def = {
  alt: 'Relación entre distancia y costo: desde el punto de producción i, el costo total por unidad T (producción más transporte) sube con la distancia; la franja inferior es el costo de producción por unidad y la cuña superior el costo de transporte por unidad.',
  w: 700, h: 370,
  puntos: { '1': [58, 252], '2': [58, 163], '3': [330, 330], '4': [480, 330], '5': [500, 103], '6': [380, 205], '7': [300, 276], '8': [90, 330] },
  dibujo: (ver) => (
    <g>
      <rect x={90} y={250} width={390} height={50} fill="#cbd5e1" />
      <polygon points="90,250 480,250 480,105" fill="#e2e8f0" />
      <Ejes x0={90} y0={300} x1={640} y1={20} ex="Distancia (km)" ey="Precio o costo por unidad" />
      <line x1={90} y1={250} x2={520} y2={96} stroke={INK} strokeWidth={4} />
      <Dash x1={90} y1={250} x2={480} y2={250} /><Dash x1={90} y1={161} x2={330} y2={161} /><Dash x1={90} y1={105} x2={480} y2={105} />
      <Dash x1={330} y1={161} x2={330} y2={300} /><Dash x1={480} y1={105} x2={480} y2={300} />
      {ver('niveles') && (<><T x={86} y={254} ancla="end">P1</T><T x={86} y={165} ancla="end">P2</T><T x={86} y={109} ancla="end">P3</T></>)}
      {ver('puntos') && (<><T x={90} y={322} ancla="middle">i</T><T x={330} y={322} ancla="middle">d</T><T x={480} y={322} ancla="middle">d'</T></>)}
      {ver('etiquetas') && (<>
        <T x={526} y={90}>T = costo total</T>
        <T x={380} y={190} ancla="middle" tam={13}>Costo de transporte por unidad</T>
        <T x={380} y={278} ancla="middle" tam={13}>Costo de producción por unidad</T>
      </>)}
    </g>
  ),
};

// ---------- Costo de transporte y economías de escala (Polèse cap. 2, fig. 2.3) ----------
const escalas: Def = {
  alt: 'Costo por unidad frente a la cantidad producida: el costo medio de producción baja con las economías de escala, el costo de transporte por unidad sube en línea recta y el costo total T forma una U cuyo mínimo está en Q2.',
  w: 800, h: 370,
  puntos: { '1': [560, 112], '2': [560, 238], '3': [560, 44], '4': [320, 326] },
  dibujo: (ver) => (
    <g>
      <Ejes x0={90} y0={300} x1={600} y1={20} ex="Cantidad producida y distancia" ey="Costo" />
      <line x1={90} y1={300} x2={560} y2={110} stroke={INK} strokeWidth={3} />
      <path d="M110 60 C 170 170, 260 200, 320 207 S 480 228, 560 236" fill="none" stroke={INK} strokeWidth={3} />
      <path d="M110 52 C 150 110, 230 120, 320 114 C 420 108, 500 70, 560 46" fill="none" stroke={INK} strokeWidth={3} strokeDasharray="1 0" />
      <Dash x1={320} y1={114} x2={320} y2={300} />
      {ver('puntos') && (<><T x={320} y={322} ancla="middle">Q2</T></>)}
      {ver('etiquetas') && (<>
        <T x={572} y={46}>T = costo total por unidad</T>
        <T x={572} y={114}>Costo de transporte por unidad</T>
        <T x={572} y={240}>Costo medio de producción</T>
        <T x={572} y={258} tam={12} color={MUTED}>(economías de escala sin límite)</T>
      </>)}
    </g>
  ),
};

// ---------- Área de mercado y centralidad geográfica (Polèse cap. 2, fig. 2.4) ----------
const areamercado: Def = {
  alt: 'Arriba, el plano de un lugar central i con su área de mercado: un consumidor A dentro y uno B fuera. Abajo, el costo unitario con economías de escala (P1 en i) que sube hasta el nivel P2 de la producción dispersa en el límite D del área de mercado.',
  w: 680, h: 430,
  puntos: { '1': [560, 236], '2': [200, 330], '3': [430, 372], '4': [368, 106], '5': [468, 92], '6': [296, 100] },
  dibujo: (ver) => (
    <g>
      <ellipse cx={320} cy={110} rx={110} ry={72} fill="#e2e8f0" stroke={INK} strokeWidth={2} strokeDasharray="6 4" />
      <circle cx={320} cy={110} r={7} fill={INK} />
      <circle cx={352} cy={92} r={6} fill="#2563eb" stroke={INK} strokeWidth={1.5} />
      <circle cx={450} cy={78} r={6} fill="#e11d48" stroke={INK} strokeWidth={1.5} />
      {ver('puntos') && (<><T x={308} y={132} ancla="end" peso={800}>i</T><T x={364} y={88}>A</T><T x={462} y={74}>B</T></>)}
      <Ejes x0={90} y0={390} x1={640} y1={200} ex="Distancia" ey="Costo" />
      <polyline points="210,250 320,330 430,250" fill="none" stroke={INK} strokeWidth={4} />
      <Dash x1={90} y1={250} x2={620} y2={250} /><Dash x1={90} y1={330} x2={320} y2={330} />
      <Dash x1={210} y1={250} x2={210} y2={390} /><Dash x1={320} y1={330} x2={320} y2={390} /><Dash x1={430} y1={250} x2={430} y2={390} />
      {ver('puntos') && (<><T x={210} y={410} ancla="middle">D</T><T x={320} y={410} ancla="middle">i</T><T x={430} y={410} ancla="middle">D</T></>)}
      {ver('niveles') && (<>
        <T x={84} y={254} ancla="end">P2</T><T x={84} y={334} ancla="end">P1</T>
        <T x={450} y={244} tam={12}>P2: sin economías de escala</T>
        <T x={340} y={346} tam={12}>P1: en i, con economías de escala</T>
      </>)}
    </g>
  ),
};

export const FIGURAS: Record<string, Def> = { iim, rango, vonthunen, polese103, hoyt, costotransporte, escalas, areamercado };
export const TITULO_FIGURA: Record<string, string> = {
  iim: 'Evolución teórica del IIM',
  rango: 'Función rango-tamaño',
  vonthunen: 'Renta y localización de tres producciones (Von Thünen)',
  polese103: 'Curvas de renta alrededor de un punto central',
  hoyt: 'Estructura urbana según los sectores de Hoyt',
  costotransporte: 'Distancia y costo de transporte',
  escalas: 'Costo de transporte y economías de escala',
  areamercado: 'Área de mercado y centralidad geográfica',
};

function Marca({ x, y, id }: { x: number; y: number; id: string }) {
  return (
    <g data-marca={id}>
      <circle cx={x} cy={y} r={15} fill="#fde047" stroke={INK} strokeWidth={3} />
      <text x={x} y={y + 5} textAnchor="middle" fontSize={15} fontWeight={900} fill={INK} style={{ fontFamily: 'inherit' }}>{id}</text>
    </g>
  );
}

export function Figura({ id, marcas = [], ocultos = [] }: { id: string; marcas?: string[]; ocultos?: string[] }) {
  const f = FIGURAS[id];
  if (!f) return null;
  const ver = (g: string) => !ocultos.includes(g);
  return (
    <figure className="col g8" style={{ margin: 0, maxWidth: 760 }} data-figura={id}>
      <svg viewBox={`0 0 ${f.w} ${f.h}`} role="img" aria-label={f.alt} style={{ width: '100%', height: 'auto', background: 'var(--paper, #fff)', border: `3px solid ${INK}`, borderRadius: 18 }}>
        <title>{TITULO_FIGURA[id]}</title>
        {f.dibujo(ver)}
        {marcas.map((m) => (f.puntos[m] ? <Marca key={m} id={m} x={f.puntos[m][0]} y={f.puntos[m][1]} /> : null))}
      </svg>
      <figcaption className="muted" style={{ fontSize: 15 }}>{TITULO_FIGURA[id]} (esquema de estudio)</figcaption>
    </figure>
  );
}
