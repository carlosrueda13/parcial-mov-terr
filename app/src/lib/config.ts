// Fecha del parcial (hora de Bogotá). Se usa para el conteo y para acotar los intervalos de repaso.
export const FECHA_PARCIAL = new Date('2026-11-21T00:00:00-05:00');
export const META_SIMULACRO = 60;

export function diasRestantes(ahora: number = Date.now()): number {
  return Math.max(0, Math.ceil((FECHA_PARCIAL.getTime() - ahora) / 86400000));
}

// Nombre corto de cada lectura para tarjetas y listas.
export const ETIQUETAS: Record<string, string> = {
  'gutierrez-2013': 'Gutiérrez',
  'cepal-2024': 'CEPAL (2024)',
  'montanez-delgado-1998': 'Montañez y Delgado',
  'santos-2000': 'Santos, cap. 2',
  'polese-1998-cap1': 'Polèse, cap. 1',
  'polese-1998-cap2': 'Polèse, cap. 2',
  'polese-1998-cap9': 'Polèse, cap. 9',
  'camagni-2005-intro-cap1': 'Camagni, intro y cap. 1',
  'polese-1998-cap10': 'Polèse, cap. 10',
  'camagni-2005-cap2': 'Camagni, cap. 2',
  'cuervo-gonzalez-cap8': 'Cuervo y González, cap. 8',
  'cuervo-gonzalez-cap9': 'Cuervo y González, cap. 9',
  'leon-ruiz-2016': 'León y Ruiz (2016)',
  'contreras-ruiz-2026': 'Contreras y Ruiz (2026)',
  'sdp-2014-region-metropolitana': 'SDP (2014)',
  'avellaneda-dextre-2014-cap1': 'Avellaneda y Dextre, cap. 1',
  'herce-2009-cap1-2': 'Herce, caps. I y II',
  'transport-access-manual-2020': 'Transport Access Manual',
  'fernandez-2023-cap1-2': 'Fernández (2023)',
  'viana-cerqueira-2026': 'Viana Cerqueira et al.',
};

// Rótulo de cada zona en el mapa.
export const ZONAS: { semana: number; nombre: string }[] = [
  { semana: 1, nombre: 'Gutiérrez, CEPAL' },
  { semana: 2, nombre: 'Santos, Polèse' },
  { semana: 3, nombre: 'Polèse, Camagni' },
  { semana: 4, nombre: 'Polèse, Camagni' },
  { semana: 5, nombre: 'Cuervo, León' },
  { semana: 6, nombre: 'SDP, Contreras' },
  { semana: 7, nombre: 'Herce, Avellaneda' },
  { semana: 8, nombre: 'Fernández, Viana' },
];

export const RANGOS = [
  { km: 0, nombre: 'Peatón' },
  { km: 10, nombre: 'Usuario de bus' },
  { km: 25, nombre: 'Ciclista' },
  { km: 50, nombre: 'Planificador' },
  { km: 100, nombre: 'Director de movilidad' },
];
// Un kilómetro por cada 5 respuestas bien contestadas.
export const ACIERTOS_POR_KM = 5;
