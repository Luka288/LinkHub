import { Routes } from '@angular/router';

export const routes: Routes = [
  // unprotected public route
  {
    path: '',
    loadComponent: () =>
      import('./layouts/public-layout/public-layout').then(
        (m) => m.PublicLayout,
      ),
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
            loadComponent: () =>
              import('./features/auth/components/login/login').then(
                (m) => m.Login,
              ),
          },

          {
            path: 'register',
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
];
