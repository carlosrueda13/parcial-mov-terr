const base = { width: 26, height: 26, viewBox: '0 0 24 24', fill: 'none', stroke: '#0E2230', strokeWidth: 2.4, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true } as any;

export const IcMapa = () => (
  <svg {...base}><path d="M12 21 C7 15 5 12 5 9 A7 7 0 0 1 19 9 C19 12 17 15 12 21 Z" /><circle cx="12" cy="9" r="2.5" /></svg>
);
export const IcLeer = () => (
  <svg {...base}><path d="M4 5 H10 A2 2 0 0 1 12 7 V20 A2 2 0 0 0 10 18 H4 Z" /><path d="M20 5 H14 A2 2 0 0 0 12 7 V20 A2 2 0 0 1 14 18 H20 Z" /></svg>
);
export const IcPracticar = () => (
  <svg {...base}><rect x="5.5" y="5.5" width="13" height="13" transform="rotate(45 12 12)" /><path d="M12 9.5 V13.5" /><path d="M12 16 V16.2" /></svg>
);
export const IcBoleto = () => (
  <svg {...base}><path d="M3 6 H21 V10 A2 2 0 0 0 21 14 V18 H3 V14 A2 2 0 0 0 3 10 Z" /><path d="M14.5 7 V17" strokeDasharray="1 3" /></svg>
);
export const IcTrampa = () => (
  <svg {...base}><path d="M12 3 L22 20 H2 Z" /><path d="M12 10 V14" /><path d="M12 16.8 V17" /></svg>
);
export const IcReloj = () => (
  <svg {...base}><circle cx="12" cy="13" r="8" /><path d="M12 8 V13 L15 15" /><path d="M9 2.5 H15" /></svg>
);
export const IcAudio = () => (
  <svg {...base}><path d="M4 15 V12 A8 8 0 0 1 20 12 V15" /><rect x="3" y="14" width="4" height="7" rx="1.5" /><rect x="17" y="14" width="4" height="7" rx="1.5" /></svg>
);
export const Logo = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" aria-hidden="true">
    <rect width="40" height="40" rx="9" fill="#00704A" />
    <rect x="3" y="3" width="34" height="34" rx="6" fill="none" stroke="#fff" strokeWidth="2" />
    <path d="M9 28 L16 14 L24 24 L31 11" fill="none" stroke="#FFC629" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
