/**
 * MENÚ DE LA APLICACIÓN (una sola fuente)
 * - El sidebar se arma con esto.
 * - El título de la barra superior sale de aquí según la ruta activa.
 * - roles: quién lo ve. Sin roles = todos los usuarios con sesión.
 *   1 Administrador · 2 Auxiliar · 3 Afiliado · 4 Coordinador de mantenimiento
 * Íconos: trazos SVG (atributo d) en viewBox 0 0 24 24.
 */

export interface NavLink {
  label: string;
  route: string;
  icon: string[];
  roles?: number[];
}

export interface NavGroup {
  id: string;
  label: string;
  icon: string[];
  roles?: number[];
  items: NavLink[];
}

// ── Íconos ───────────────────────────────────────────────────────────────
const I = {
  dashboard: ['M3 3h7v7H3z', 'M14 3h7v7h-7z', 'M14 14h7v7h-7z', 'M3 14h7v7H3z'],
  truck: [
    'M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2',
    'M15 18H9',
    'M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62l-3.48-4.35A1 1 0 0 0 17.52 8H14',
    'M5 18a2 2 0 1 0 4 0a2 2 0 1 0-4 0',
    'M15 18a2 2 0 1 0 4 0a2 2 0 1 0-4 0',
  ],
  route: [
    'M14.1 5.55a2 2 0 0 0 1.8 0l3.66-1.83A1 1 0 0 1 21 4.62v12.76a1 1 0 0 1-.55.9l-4.56 2.27a2 2 0 0 1-1.78 0l-4.22-2.1a2 2 0 0 0-1.78 0l-3.66 1.83A1 1 0 0 1 3 19.38V6.62a1 1 0 0 1 .55-.9l4.56-2.27a2 2 0 0 1 1.78 0z',
    'M15 5.76v15', 'M9 3.24v15',
  ],
  wrench: ['M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z'],
  fuel: [
    'M3 22h12', 'M4 9h10',
    'M14 22V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v18',
    'M14 13h2a2 2 0 0 1 2 2v2a2 2 0 0 0 2 2a2 2 0 0 0 2-2V9.83a2 2 0 0 0-.59-1.42L18 5',
  ],
  hammer: [
    'm15 12-8.37 8.37a1 1 0 1 1-3-3L12 9',
    'm18 15 4-4',
    'm21.5 11.5-1.91-1.91A2 2 0 0 1 19 8.17V7l-2.26-2.26a6 6 0 0 0-4.2-1.76L9 2.96l.92.82A6.18 6.18 0 0 1 12 8.4V10l2 2h1.17a2 2 0 0 1 1.42.59L18.5 14.5',
  ],
  calendarCheck: ['M8 2v4', 'M16 2v4', 'M3 10h18', 'M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z', 'm9 16 2 2 4-4'],
  receipt: [
    'M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z',
    'M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8',
    'M12 17.5v-11',
  ],
  database: ['M3 5a9 3 0 1 0 18 0a9 3 0 1 0-18 0', 'M3 5v14a9 3 0 0 0 18 0V5', 'M3 12a9 3 0 0 0 18 0'],
  dollar: ['M12 2v20', 'M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6'],
  ship: [
    'M12 10.19V14', 'M12 2v3',
    'M19 13V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6',
    'M19.38 20A11.6 11.6 0 0 0 21 14l-8.19-3.64a2 2 0 0 0-1.62 0L3 14a11.6 11.6 0 0 0 2.81 7.76',
    'M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1s1.2 1 2.5 1c2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1',
  ],
  building: [
    'M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z',
    'M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2',
    'M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2',
    'M10 6h4', 'M10 10h4', 'M10 14h4', 'M10 18h4',
  ],
  briefcase: ['M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16', 'M4 6h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z'],
  user: ['M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2', 'M8 7a4 4 0 1 0 8 0a4 4 0 1 0-8 0'],
  container: ['M2 7h20v12H2z', 'M6 7v12', 'M10 7v12', 'M14 7v12', 'M18 7v12'],
  list: ['M3 6h.01', 'M3 12h.01', 'M3 18h.01', 'M8 6h13', 'M8 12h13', 'M8 18h13'],
  warehouse: [
    'M22 8.35V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8.35a2 2 0 0 1 1.26-1.85l8-3.2a2 2 0 0 1 1.48 0l8 3.2A2 2 0 0 1 22 8.35Z',
    'M6 18h12', 'M6 14h12', 'M6 22V10h12v12',
  ],
  users: [
    'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2',
    'M5 7a4 4 0 1 0 8 0a4 4 0 1 0-8 0',
    'M22 21v-2a4 4 0 0 0-3-3.87', 'M16 3.13a4 4 0 0 1 0 7.75',
  ],
  target: ['M2 12a10 10 0 1 0 20 0a10 10 0 1 0-20 0', 'M6 12a6 6 0 1 0 12 0a6 6 0 1 0-12 0', 'M10 12a2 2 0 1 0 4 0a2 2 0 1 0-4 0'],
  tag: [
    'M12.59 2.59A2 2 0 0 0 11.17 2H4a2 2 0 0 0-2 2v7.17a2 2 0 0 0 .59 1.42l8.7 8.7a2.43 2.43 0 0 0 3.42 0l6.58-6.58a2.43 2.43 0 0 0 0-3.42z',
    'M7 7.5a.5.5 0 1 0 1 0a.5.5 0 1 0-1 0',
  ],
  plate: ['M3 7h18a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1z', 'M6 12h.01', 'M10 12h8'],
  userCheck: ['M2 21a8 8 0 0 1 13.29-6', 'M6 8a5 5 0 1 0 10 0a5 5 0 1 0-10 0', 'm16 19 2 2 4-4'],
  sliders: ['M4 21v-7', 'M4 10V3', 'M12 21v-9', 'M12 8V3', 'M20 21v-5', 'M20 12V3', 'M2 14h4', 'M10 8h4', 'M18 16h4'],
};

// ── Enlaces sueltos (arriba del todo) ────────────────────────────────────
export const NAV_TOP: NavLink[] = [
  { label: 'Dashboard', route: '/dashboard', icon: I.dashboard },
];

// ── Grupos ───────────────────────────────────────────────────────────────
export const NAV_GROUPS: NavGroup[] = [
  {
    id: 'operaciones',
    label: 'Operaciones',
    icon: I.route,
    roles: [1, 2, 3],
    items: [
      { label: 'Movimientos', route: '/transport-movements', icon: I.truck },
    ],
  },
  {
    id: 'mantenimiento',
    label: 'Mantenimiento',
    icon: I.wrench,
    roles: [1, 4],
    items: [
      { label: 'Combustible', route: '/fuel-logs', icon: I.fuel },
      { label: 'Mantenimientos', route: '/maintenances', icon: I.hammer },
      { label: 'Control de vehículos', route: '/vehicle-downtime', icon: I.calendarCheck },
    ],
  },
  {
    id: 'facturacion',
    label: 'Facturación',
    icon: I.receipt,
    roles: [1, 2, 3],
    items: [
      { label: 'Facturación', route: '/billing', icon: I.receipt },
    ],
  },
  {
    id: 'maestros',
    label: 'Maestros',
    icon: I.database,
    roles: [1],
    items: [
      { label: 'Tarifas de flete', route: '/freight-rates', icon: I.dollar },
      { label: 'Líneas navieras', route: '/shipping-lines', icon: I.ship },
      { label: 'Clientes', route: '/clients', icon: I.building },
      { label: 'Empresas de transporte', route: '/transport-companies', icon: I.briefcase },
      { label: 'Conductores', route: '/drivers', icon: I.user },
      { label: 'Contenedores', route: '/containers', icon: I.container },
      { label: 'Operaciones', route: '/operations', icon: I.list },
      { label: 'Patios', route: '/yards', icon: I.warehouse },
      { label: 'Auxiliares de transporte', route: '/transport-assistants', icon: I.users },
      { label: 'Vehículos', route: '/vehicles', icon: I.truck },
      { label: 'Presupuestos afiliados', route: '/affiliate-budget', icon: I.target },
      { label: 'Tipos de mantenimiento', route: '/maintenance-types', icon: I.tag },
      { label: 'Placas de tráiler', route: '/trailer-plates', icon: I.plate },
      { label: 'Usuarios', route: '/users', icon: I.userCheck },
      { label: 'Parámetros PYG', route: '/pyg-parameters', icon: I.sliders },
    ],
  },
];

/** Nombres de los roles (barra superior) */
export const ROLE_LABELS: Record<number, string> = {
  1: 'Administrador',
  2: 'Auxiliar',
  3: 'Afiliado',
  4: 'Coord. mantenimiento',
};

/** Busca la opción del menú que corresponde a una URL (para el título) */
export function findNavByUrl(url: string): { item: NavLink; group: NavGroup | null } | null {
  const path = url.split('?')[0].split('#')[0];
  let best: { item: NavLink; group: NavGroup | null } | null = null;

  const check = (item: NavLink, group: NavGroup | null) => {
    if (path === item.route || path.startsWith(item.route + '/')) {
      if (!best || item.route.length > best.item.route.length) best = { item, group };
    }
  };

  NAV_TOP.forEach(i => check(i, null));
  NAV_GROUPS.forEach(g => g.items.forEach(i => check(i, g)));
  return best;
}