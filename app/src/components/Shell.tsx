import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { diasRestantes } from '../lib/config';
import { kilometros, racha, rango, usarProg } from '../lib/store';
import { plural } from '../lib/util';
import { IcBoleto, IcLeer, IcMapa, IcPracticar, IcReloj, IcTrampa, Logo } from './icons';

const NAV = [
  { to: '/', label: 'Mapa', icon: IcMapa, mapa: true },
  { to: '/leer', label: 'Leer', icon: IcLeer },
  { to: '/practica', label: 'Practicar', icon: IcPracticar },
  { to: '/boletos', label: 'Boletos', icon: IcBoleto },
  { to: '/trampas', label: 'Trampas', icon: IcTrampa },
  { to: '/simulacro', label: 'Simulacro', icon: IcReloj },
];

function titulo(path: string) {
  if (path === '/' ) return 'Mapa del parcial';
  if (path.startsWith('/semana')) return 'Zona';
  if (path.startsWith('/leer')) return 'Leer';
  if (path.startsWith('/practica')) return 'Practicar';
  if (path.startsWith('/boletos')) return 'Boletos';
  if (path.startsWith('/trampas')) return 'Trampas y pares';
  if (path.startsWith('/simulacro')) return 'Hora pico';
  return 'Movilidad y Territorio';
}

function activo(item: (typeof NAV)[number], path: string) {
  if (item.mapa) return path === '/' || path.startsWith('/semana');
  return path === item.to || path.startsWith(item.to + '/');
}

export default function Shell() {
  const { pathname } = useLocation();
  const prog = usarProg();
  const km = kilometros(prog);
  const dias = diasRestantes();
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = `${titulo(pathname)} | Movilidad y Territorio`;
  }, [pathname]);
  return (
    <>
      <a href="#contenido" className="sr">Saltar al contenido</a>
      <header className="topbar">
        <Link to="/" className="brand d" aria-label="Movilidad y Territorio, inicio">
          <Logo />
          <span>Movilidad<br />y Territorio</span>
        </Link>
        <span className="mobtitle d">{titulo(pathname)}</span>
        <nav className="nav" aria-label="Principal">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} className={activo(n, pathname) ? 'active' : ''} aria-current={activo(n, pathname) ? 'page' : undefined}>
              {n.label}
            </Link>
          ))}
        </nav>
        <span className="topmeta">
          <span className="hide-m">{rango(km).actual.nombre}, {km} km, {plural(racha(prog), 'día seguido', 'días seguidos')}</span>
          <span className="badge-days">{dias > 0 ? `Parcial en ${plural(dias, 'día', 'días')}` : 'Parcial hoy'}</span>
        </span>
      </header>
      <main id="contenido">
        <Outlet />
      </main>
      <nav className="bottomnav" aria-label="Secciones">
        {NAV.map((n) => {
          const Ic = n.icon;
          return (
            <Link key={n.to} to={n.to} className={activo(n, pathname) ? 'active' : ''} aria-current={activo(n, pathname) ? 'page' : undefined}>
              <Ic />
              {n.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
