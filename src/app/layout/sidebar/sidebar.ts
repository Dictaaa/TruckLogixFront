import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { inject } from '@angular/core';
import { HasRoleDirective } from '../../core/directives/has-role';

interface NavItem {
  label: string;
  route: string;
  icon: string;
  badge?: number;
}

interface NavGroup {
  label: string;
  icon: string;
  children: NavItem[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, HasRoleDirective],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.scss'],
})
export class Sidebar {
  @Input() open = true;

  private router = inject(Router);

  mastersOpen = false;

 mainItems: NavItem[] = [
  {
    label: 'Dashboard',
    route: '/dashboard',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>`
  },
  {
    label: 'Movimientos',
    route: '/transport-movements',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="14" width="18" height="8" rx="2"/><rect x="20" y="17" width="5" height="5" rx="1"/><circle cx="7" cy="22" r="2.5"/><circle cx="17" cy="22" r="2.5"/><path d="M6 14V10a2 2 0 0 1 2-2h7l4 4"/></svg>`
  },
];

masterItems: NavItem[] = [
  {
    label: 'Tarifas de Flete',
    route: '/freight-rates',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`
  },
  {
    label: 'Líneas Navieras',
    route: '/shipping-lines',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 17l4-8 4 4 3-6 4 10"/><path d="M3 21h18"/></svg>`
  },
  {
    label: 'Clientes',
    route: '/clients',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>`
  },
  {
    label: 'Empresas Transporte',
    route: '/transport-companies',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>`
  },
  {
    label: 'Conductores',
    route: '/drivers',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M3 21a9 9 0 0 1 18 0"/></svg>`
  },
  {
    label: 'Contenedores',
    route: '/containers',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M2 12h20M12 7v14"/></svg>`
  },
  {
    label: 'Operaciones',
    route: '/operations',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2v-4M9 21H5a2 2 0 0 1-2-2v-4m0 0h18"/></svg>`
  },
  {
    label: 'Patios',
    route: '/yards',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`
  },
  {
    label: 'Auxiliares Transporte',
    route: '/transport-assistants',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`
  },
  {
    label: 'Vehículos',
    route: '/vehicles',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="14" width="18" height="8" rx="2"/><path d="M6 14V10a2 2 0 0 1 2-2h7l4 4"/><circle cx="7" cy="22" r="2"/><circle cx="17" cy="22" r="2"/></svg>`
  },
  {
    label: 'Presupuestos Afiliados',
    route: '/affiliate-budget',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="14" width="18" height="8" rx="2"/><path d="M6 14V10a2 2 0 0 1 2-2h7l4 4"/><circle cx="7" cy="22" r="2"/><circle cx="17" cy="22" r="2"/></svg>`
  },
  {
  label: 'Combustible',
  route: '/fuel-logs',
  icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M3 22V8l9-6 9 6v14H3z"/>
    <path d="M12 22V12H8v10"/>
    <path d="M16 22v-4a2 2 0 0 0-2-2h-4"/>
  </svg>`
},
  {
    label: 'Usuarios',
    route: '/users',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`
  },
];

  systemItems: NavItem[] = [
    // {
    //   label: 'Configuración',
    //   route: '/configuracion',
    //   icon: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/></svg>`
    // }
  ];

  isMasterActive(): boolean {
    return this.masterItems.some(item => this.router.url.startsWith(item.route));
  }

  toggleMasters(): void {
    this.mastersOpen = !this.mastersOpen;
  }
}