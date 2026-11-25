import type { RouteItemDef } from '@/types/routes.types';
import { lazy } from 'react';
import { TodoPath } from '../constants/todo.paths';

const TODOLIST_SCREEN: RouteItemDef = {
  id: 'TODOLIST',
  path: TodoPath.TODO,
  Component: lazy(() => import('@/features/todolist/screens/TodoListScreen')),
};

export const TODO_ROUTES = [TODOLIST_SCREEN];
