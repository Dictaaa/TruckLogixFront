import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface NavItem {
  label: string;
  route: string;
  icon: string;
  badge?: number;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.scss'],
})
export class Sidebar {
  @Input() open = true;

  mainItems: NavItem[] = [
    {
      label: 'Dashboard',
      route: '/dashboard',
      icon: `<svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>`
    },
    {
      label: 'Movimientos',
      route: '/transport-movements',
      icon: `<svg viewBox="0 0 24 24"><rect x="2" y="14" width="18" height="8" rx="2"/><rect x="20" y="17" width="5" height="5" rx="1"/><circle cx="7" cy="22" r="2.5"/><circle cx="17" cy="22" r="2.5"/><path d="M6 14V10a2 2 0 0 1 2-2h7l4 4"/></svg>`,
      badge: 12
    },
    // {
    //   label: 'Clientes',
    //   route: '/clientes',
    //   icon: `<svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`
    // },
    // {
    //   label: 'Conductores',
    //   route: '/conductores',
    //   icon: `<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="5"/><path d="M3 21a9 9 0 0 1 18 0"/><path d="M9 13l1.5 4 1.5-2 1.5 2 1.5-4"/></svg>`
    // },
    // {
    //   label: 'Reportes',
    //   route: '/reportes',
    //   icon: `<svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="16" y2="17"/><line x1="8" y1="9" x2="10" y2="9"/></svg>`
    // },
    {
      label: 'Tarifas de Flete',
      route: '/freight-rates',
      icon: `<svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`
    }
  ];

  systemItems: NavItem[] = [
    {
      label: 'Configuración',
      route: '/configuracion',
      icon: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/></svg>`
    }
  ];
}
