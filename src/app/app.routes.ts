import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { Layout } from './layout/layout';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },

  // ✅ Login FUERA del layout → sin navbar ni sidebar
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/pages/login/login').then((m) => m.LoginComponent),
  },

  // ✅ Todo lo protegido DENTRO del layout → con navbar y sidebar
  {
    path: '',
    component: Layout,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/pages/home/home').then((m) => m.HomeComponent),
      },
      {
        path: 'transport-movements',
        loadComponent: () =>
          import('./features/transport-movements/pages/transport-movements/transport-movements')
            .then((m) => m.TransportMovementsComponent),
      },
      // Agrega aquí las rutas futuras (clientes, conductores, reportes, etc.)
    ],
  },

  { path: '**', redirectTo: 'login' },
];