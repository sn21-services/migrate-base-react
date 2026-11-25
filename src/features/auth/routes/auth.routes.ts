import { lazy } from 'react';

import type { RouteItemDef } from '@/types/routes.types';
import { AuthPathsEnum } from '@/features/auth';
import { AuthLayout } from '@/layouts';

const LOGIN_SCREEN: RouteItemDef = {
  id: 'LOGIN',
  path: AuthPathsEnum.LOGIN,
  Component: lazy(
    () => import('@/features/auth/screens/LoginScreen/LoginScreen')
  ),
  layout: AuthLayout,
};

export const AUTH_ROUTES = [LOGIN_SCREEN];
