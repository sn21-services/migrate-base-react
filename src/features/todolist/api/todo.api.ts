import type { AxiosResponse } from 'axios';
import type { TodoFormValues, TodoList } from '../types/todolist.types';
import { instanceApi } from '@/api/base-api';
import { TodoEndPoints } from '../constants/todo.endpoints';

export const TodoListApi = (
  params?: Partial<TodoList>
): Promise<AxiosResponse<TodoList[]>> => {
  return instanceApi.get(TodoEndPoints.GET_LIST, { params });
};

export const createTodoApi = (
  data: TodoFormValues
): Promise<AxiosResponse<TodoList>> => {
  return instanceApi.post(TodoEndPoints.CREATE, data);
};

export const updateTodoApi = (
  id: string,
  data: Partial<TodoList>
): Promise<AxiosResponse<TodoList>> => {
  return instanceApi.put(TodoEndPoints.UPDATE(id), data);
};

export const deletedTodoApi = (id: string): Promise<AxiosResponse> => {
  return instanceApi.delete(TodoEndPoints.DELETE(id));
};
