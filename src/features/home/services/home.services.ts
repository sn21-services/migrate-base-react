import { useQuery } from '@tanstack/react-query';

import { getTodoListApi } from '@/features/home';
import type { QueryParams } from '@/features/home/types/home.types';

export const useGetTodoList = (params: QueryParams) => {
  return useQuery({
    queryKey: ['getTodoListApi'],
    queryFn: () => getTodoListApi(params),
  });
};
