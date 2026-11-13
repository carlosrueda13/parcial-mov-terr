import { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Shell from './components/Shell';
import { Cargando } from './components/ui';
import Mapa from './pages/Mapa';

const Zona = lazy(() => import('./pages/Zona'));
const LeerIndice = lazy(() => import('./pages/LeerIndice'));
const Leer = lazy(() => import('./pages/Leer'));
const Practicar = lazy(() => import('./pages/Practicar'));
const Boletos = lazy(() => import('./pages/Boletos'));
const Trampas = lazy(() => import('./pages/Trampas'));
const Simulacro = lazy(() => import('./pages/Simulacro'));

export default function App() {
  return (
    <Suspense fallback={<Cargando />}>
      <Routes>
        <Route element={<Shell />}>
          <Route index element={<Mapa />} />
          <Route path="semana/:n" element={<Zona />} />
          <Route path="leer" element={<LeerIndice />} />
          <Route path="leer/:semana/:lectura" element={<Leer />} />
          <Route path="practica" element={<Practicar />} />
          <Route path="boletos" element={<Boletos />} />
          <Route path="trampas" element={<Trampas />} />
          <Route path="simulacro" element={<Simulacro />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
