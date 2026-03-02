import { Routes } from '@angular/router';
import { Landing } from './features/landing/landing';
import { Link } from './features/link/link';
import { Design } from './features/design/design';
import { Account } from './features/account/account';
import { dashboardLayout } from './layout/dashboad/dashboard';
import { Insight } from './features/insight/insight';

export const routes: Routes = [
  {
    path: '',
    component: Landing,
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then((m) => m.Login),
  },
  {
    path: 'admin/login',
    loadComponent: () =>
      import('./features/admin/auth/login/login').then((m) => m.AdminLogin),
  },
  {
    path: 'admin/dashboard',
    loadComponent: () =>
      import('./features/admin/dashboard/dashboard').then((m) => m.AdminDashboard),
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register').then((m) => m.Register),
  },
  {
    path: 'username',
    loadComponent: () => import('./features/username/username').then((m) => m.Username),
  },
  {
    path: 'home',
    loadComponent: () => import('./layout/home/home').then((m) => m.HomeLayout),
  },
  {
    path: 'dashboard',
    component: dashboardLayout,
    children: [
      { path: '', redirectTo: 'link', pathMatch: 'full' },
      { path: 'link', component: Link, data: { name: 'Link', rightSidebar: true } },
      { path: 'design', component: Design, data: { name: 'Design', rightSidebar: true } },
      { path: 'insight', component: Insight, data: { name: 'Insights', rightSidebar: false } },
      { path: 'account', component: Account, data: { name: 'Account', rightSidebar: false } },
    ],
  },
];
