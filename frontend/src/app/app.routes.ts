import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'LinkHub | Home',
    loadComponent: () => import('./features/home/home').then((m) => m.Home),
  },
];
