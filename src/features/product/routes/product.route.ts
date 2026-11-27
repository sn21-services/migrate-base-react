import type { RouteItemDef } from '@/types/routes.types';
import { ProductPathEnum } from '../constants/product.path';
import { lazy } from 'react';

const PRODUCTS_SCREEN: RouteItemDef = {
  id: 'PRODUCTS',
  path: ProductPathEnum.PRODUCTS,
  Component: lazy(() => import('@/features/product/screens/product/products')),
};
export const PRODUCT_ROUTE = [PRODUCTS_SCREEN];
