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
    path: '/users/:userId',
    component: lazy(() => import('@/pages/UserDetailPage')),
  },
  {
    path: '/products',
    component: lazy(() => import('@/pages/ProductPage')),
  },
  {
    path: '/products/:productId',
    component: lazy(() => import('@/pages/ProductDetailPage')),
  },
];
