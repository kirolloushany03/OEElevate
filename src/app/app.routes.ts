import { Routes } from '@angular/router';
import { loggedInGuard, loggedOutGuard } from './auth/logged-in.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard',
  },
  {
    path: '',
    loadComponent: () => import('./layout/layout.component').then(m => m.LayoutComponent),
    children: [
      {
        path: 'dashboard',
        pathMatch: 'full',
        loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'machines',
        pathMatch: 'full',
        loadComponent: () => import('./machines/machines.component').then(m => m.MachinesComponent)
      }
    ],
    canActivate: [loggedInGuard]
  },
  {
    path: '',
    children: [
      {
        path: 'login',
        loadComponent: () => import('./auth/pages/login/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'sign-up',
        loadComponent: () => import('./auth/pages/sign-up/sign-up.component').then(m => m.SignUpComponent)
      }
    ],
    canActivate: [loggedOutGuard]
  }
];
