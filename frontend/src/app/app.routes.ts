import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { guestGuard } from './core/guards/guest-guard';

export const routes: Routes = [
  // unprotected public route
  {
    path: '',
    loadComponent: () =>
      import('./layouts/public-layout/public-layout').then(
        (m) => m.PublicLayout,
      ),
    canActivate: [guestGuard],
    children: [
      {
        path: '',
        title: 'LinkHub | Home',
        loadComponent: () => import('./features/home/home').then((m) => m.Home),
      },

      {
        path: 'auth',
        title: 'LinkHub | Authorize',
        loadComponent: () => import('./features/auth/auth').then((m) => m.Auth),

        children: [
          {
            path: 'login',
            data: { mode: 'login' },
            loadComponent: () =>
              import('./features/auth/components/login/login').then(
                (m) => m.Login,
              ),
          },

          {
            path: 'register',
            data: { mode: 'register' },
            loadComponent: () =>
              import('./features/auth/components/register/register').then(
                (m) => m.Register,
              ),
          },

          {
            path: '**',
            redirectTo: 'login',
            pathMatch: 'full',
          },
        ],
      },
    ],
  },

  // protected dashboard routes
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./layouts/private-layout/private-layout').then(
        (m) => m.PrivateLayout,
      ),
    canActivate: [authGuard],
    children: [
      {
        path: 'links',
        title: 'LinkHub | Links',
        loadComponent: () =>
          import('./features/links/links').then((m) => m.Links),
      },

      {
        path: 'appearance',
        title: 'LinkHub | Appearance',
        loadComponent: () =>
          import('./features/appearance/appearance').then((m) => m.Appearance),
      },

      // redirect to HOME page of protected routes (links)
      {
        path: '',
        redirectTo: 'links',
        pathMatch: 'full',
      },
    ],
  },

  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];
