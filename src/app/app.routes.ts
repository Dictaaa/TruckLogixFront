import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },

  {
    path: 'login',
    loadComponent: () => import('./features/auth/pages/login/login').then((m) => m.LoginComponent),
  },
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./features/dashboard/pages/home/home').then((m) => m.HomeComponent),
  },
  {
    path: 'transport',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./features/transport-movements/pages/transport-movements/transport-movements').then((m) => m.TransportMovementsComponent),
  },
];
