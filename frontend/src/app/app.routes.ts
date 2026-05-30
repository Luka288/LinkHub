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
    ],
  },
];
