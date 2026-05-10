import { lazy } from 'react';

export const routes = [
  {
    path: '/',
    component: lazy(() => import('@/pages/DashboardPage')),
  },
  {
    path: '/users',
    component: lazy(() => import('@/pages/UserPage')),
  },
  {
    path: '/products',
    component: lazy(() => import('@/pages/ProductPage')),
  },
];
