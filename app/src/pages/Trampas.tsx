import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Cargando, Chips, Rombo } from '../components/ui';
import { INDICE, etiqueta } from '../lib/data';
import { useContenido } from '../lib/hooks';
import { plural } from '../lib/util';

type Vista = 'trampas' | 'pares';

const sinAcentos = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

export default function Trampas() {
  const [sp, setSp] = useSearchParams();
  const vista = (sp.get('vista') || 'trampas') as Vista;
  const semana = Number(sp.get('semana') || 0);
  const lectura = sp.get('lectura') || '';
  const [busca, setBusca] = useState('');

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

  const q = sinAcentos(busca.trim());
  const trampas = useMemo(() => (contenido?.trampas ?? []).filter((t) => !q || sinAcentos(`${t.texto} ${t.grupo ?? ''}`).includes(q)), [contenido, q]);
  const pares = useMemo(() => (contenido?.pares ?? []).filter((p) => !q || sinAcentos(`${p.par} ${p.diferencia}`).includes(q)), [contenido, q]);

  // Agrupa por lectura y, dentro, por grupo temático.
  const porLectura = useMemo(() => {
    const m = new Map<string, Map<string, typeof trampas>>();
    for (const t of trampas) {
      const g = m.get(t.lectura) ?? new Map();
      const k = t.grupo ?? 'Sin grupo';
      g.set(k, [...(g.get(k) ?? []), t]);
      m.set(t.lectura, g);
    }
    return m;
  }, [trampas]);
  const paresPorLectura = useMemo(() => {
    const m = new Map<string, typeof pares>();
    for (const p of pares) m.set(p.lectura, [...(m.get(p.lectura) ?? []), p]);
    return m;
  }, [pares]);

  const semanas = Array.from(new Set(INDICE.lecturas.map((f) => f.semana)));
  const lecturasDeSemana = INDICE.lecturas.filter((f) => !semana || f.semana === semana);
  const orden = (id: string) => INDICE.lecturas.findIndex((f) => f.lectura === id);

  return (
    <div className="page narrow">
      <div className="col g8" style={{ maxWidth: 860 }}>
        <h1 className="h1 m d">Trampas y pares</h1>
        <p className="lead">Lo que el parcial cambia con sutileza. Las trampas son afirmaciones que parecen ciertas y no lo son; los pares son conceptos que se confunden.</p>
      </div>

      <section className="card col g16" aria-label="Filtros">
        <Chips etiqueta="Vista" valor={vista} onChange={(v) => poner('vista', v, 'trampas')} opciones={[{ v: 'trampas', t: 'Trampas' }, { v: 'pares', t: 'Pares' }]} />
        <div className="row g16">
          <label className="col g8" style={{ flex: '1 1 200px' }}>
            <b>Semana</b>
            <select value={semana} onChange={(e) => poner('semana', e.target.value, '0')}>
              <option value={0}>Todas las semanas</option>
              {semanas.map((s) => <option key={s} value={s}>Semana {s}</option>)}
            </select>
          </label>
          <label className="col g8" style={{ flex: '2 1 280px' }}>
            <b>Lectura</b>
            <select value={lectura} onChange={(e) => poner('lectura', e.target.value)}>
              <option value="">Todas las lecturas</option>
              {lecturasDeSemana.map((f) => <option key={f.lectura} value={f.lectura}>S{f.semana}: {etiqueta(f.lectura)}</option>)}
            </select>
          </label>
          <label className="col g8" style={{ flex: '2 1 280px' }}>
            <b>Buscar</b>
            <input type="search" value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Una palabra o concepto" />
          </label>
        </div>
        {contenido && (
          <p className="muted">
            {vista === 'trampas' ? plural(trampas.length, 'trampa', 'trampas') : plural(pares.length, 'par', 'pares')}
          </p>
        )}
      </section>

      {!contenido ? (
        <Cargando />
      ) : vista === 'trampas' ? (
        trampas.length === 0 ? (
          <p className="empty">Ninguna trampa coincide con el filtro.</p>
        ) : (
          [...porLectura.entries()].sort((a, b) => orden(a[0]) - orden(b[0])).map(([id, grupos]) => (
            <section key={id} className="col g16" aria-label={etiqueta(id)}>
              <div className="row center between g12">
                <h2 className="h2 d">{etiqueta(id)}</h2>
                <Link className="chip" to={`/leer/${INDICE.lecturas.find((f) => f.lectura === id)?.semana}/${id}`}>Abrir la ficha</Link>
              </div>
              {[...grupos.entries()].map(([g, lista]) => (
                <div key={g} className="grupo">
                  {g !== 'Sin grupo' && <h3 className="d">{g}</h3>}
                  <ul className="col g8">
                    {lista.map((t) => (
                      <li key={t.id} className="trampa">
                        <span className="rombo"><Rombo size={30} /></span>
                        <span>{t.texto}{t.referencia && <> <span className="pill">{t.referencia}</span></>}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>
          ))
        )
      ) : pares.length === 0 ? (
        <p className="empty">Ningún par coincide con el filtro.</p>
      ) : (
        [...paresPorLectura.entries()].sort((a, b) => orden(a[0]) - orden(b[0])).map(([id, lista]) => (
          <section key={id} className="col g12" aria-label={etiqueta(id)}>
            <h2 className="h2 d">{etiqueta(id)}</h2>
            <ul className="col g12">
              {lista.map((p) => (
                <li key={p.id} className="par"><b>{p.par}</b><span>{p.diferencia}</span></li>
              ))}
            </ul>
          </section>
        ))
      )}
    </div>
  );
}
