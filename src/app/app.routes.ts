import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { Layout } from './layout/layout';
import { roleGuard } from './core/guards/role-guard';

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
        canActivate: [roleGuard([1, 3])]
      },
      {
        path: 'transport-movements',
        loadComponent: () =>
          import('./features/transport-movements/pages/transport-movements/transport-movements')
            .then((m) => m.TransportMovementsComponent),
        canActivate: [roleGuard([1, 2, 3])]
      },
      {
      path: 'freight-rates',
        loadComponent: () =>
          import('./features/masters/freight-rates/pages/freight-rates')
            .then((m) => m.FreightRates),
            canActivate: [roleGuard([1])]
      },
      {
      path: 'shipping-lines',
        loadComponent: () =>
          import('./features/masters/shipping-lines/pages/shipping-lines/shipping-lines')
            .then((m) => m.ShippingLinesComponent),
            canActivate: [roleGuard([1])]
      },
      {
      path: 'clients',
        loadComponent: () =>
          import('./features/masters/clients/pages/clients/clients')
            .then((m) => m.ClientsComponent),
            canActivate: [roleGuard([1])]
      },
      {
      path: 'transport-companies',
        loadComponent: () =>
          import('./features/masters/transport-companies/pages/transport-companies/transport-companies')
            .then((m) => m.TransportCompaniesComponent),
            canActivate: [roleGuard([1])]
      },
      {
      path: 'drivers',
        loadComponent: () =>
          import('./features/masters/drivers/pages/drivers/drivers')
            .then((m) => m.DriversComponent),
            canActivate: [roleGuard([1])]
      },
      {
      path: 'containers',
        loadComponent: () =>
          import('./features/masters/containers/pages/containers/containers')
            .then((m) => m.ContainersComponent),
            canActivate: [roleGuard([1])]
      },
      {
      path: 'operations',
        loadComponent: () =>
          import('./features/masters/operations/pages/operations/operations')
            .then((m) => m.OperationsComponent),
            canActivate: [roleGuard([1])]
      },
      {
      path: 'yards',
        loadComponent: () =>
          import('./features/masters/yards/pages/yards/yards')
            .then((m) => m.YardsComponent),
            canActivate: [roleGuard([1])]
      },
      {
      path: 'transport-assistants',
        loadComponent: () =>
          import('./features/masters/transport-assistants/pages/transport-assistants/transport-assistants')
            .then((m) => m.TransportAssistantsComponent),
            canActivate: [roleGuard([1])]
      },
      {
      path: 'vehicles',
        loadComponent: () =>
          import('./features/masters/vehicles/pages/vehicles/vehicles')
            .then((m) => m.VehiclesComponent),
            canActivate: [roleGuard([1])]
      },
      {
      path: 'users',
        loadComponent: () =>
          import('./features/masters/users/pages/users/users')
            .then((m) => m.UsersComponent),
            canActivate: [roleGuard([1])]
      },
      {
      path: 'affiliate-budget',
        loadComponent: () =>
          import('./features/masters/affiliate-budget/pages/affiliate-budget/affiliate-budget')
            .then((m) => m.AffiliateBudgetComponent),
            canActivate: [roleGuard([1])]
      }
    ],
  },

  { path: '**', redirectTo: 'login' },
];