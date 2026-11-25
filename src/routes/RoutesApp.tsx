import { lazy, Suspense } from 'react';
import { Navigate, useRoutes } from 'react-router';
import { Spin } from 'antd';

import { LIST_ROUTES } from '@/routes/routes.config';
import DefaultLayout from '@/layouts/DefaultLayout';
import type { RouteItemDef } from '@/types/routes.types';
import { useAuthStore } from '@/features/auth';
const NotFound = lazy(() => import('@/components/NotFound/NotFound'));

const PUBLIC_PATH = ['/login'];

const createRoute = (route: RouteItemDef, accessToken: string | null) => {
  const Layout = route.layout ?? DefaultLayout;
  const Page = route.Component ?? NotFound;
  const isPublicRoute = PUBLIC_PATH.includes(route.path ?? '');

  if (!accessToken && !isPublicRoute) {
    return {
      path: route.path,
      element: <Navigate to="/login" replace />,
    };
  }
  if (accessToken && isPublicRoute) {
    return {
      path: route.path,
      element: <Navigate to="/" replace />,
    };
  }
  return {
    path: route.path,
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<Spin fullscreen />}>
            <Page />
          </Suspense>
        ),
      },
    ],
  };
};

const RoutesApp = () => {
  const accessToken = useAuthStore(state => state.accessToken);
  const routes = LIST_ROUTES.map(route => createRoute(route, accessToken));
  return useRoutes(routes);
};

export default RoutesApp;
