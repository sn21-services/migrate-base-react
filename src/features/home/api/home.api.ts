import type { AxiosResponse } from 'axios';

import { instanceApi } from '@/api/base-api';

import { HomeEndpoints } from '@/features/home';
import type { QueryParams } from '@/features/home/types/home.types';

export const getTodoListApi = (params: QueryParams): Promise<AxiosResponse> => {
  return instanceApi.get(HomeEndpoints.GET_LIST, { params });
};
