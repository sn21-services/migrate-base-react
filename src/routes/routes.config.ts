import { HOME_ROUTES } from '@/features/home';
import { AUTH_ROUTES } from '@/features/auth';
import { TODO_ROUTES } from '@/features/todolist/routes/todoList.routes';
import { PRODUCT_ROUTE } from '@/features/product/routes/product.route';

export const LIST_ROUTES = [
  ...HOME_ROUTES,
  ...AUTH_ROUTES,
  ...TODO_ROUTES,
  ...PRODUCT_ROUTE,
];
