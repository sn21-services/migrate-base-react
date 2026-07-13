import type { AxiosResponse } from 'axios';

import { instanceApi } from '@/api/base-api';
import { type ApiResponse } from '@/types/app.types';

import {
  type TypeAuthProfile,
  type UserInfoType,
  AuthEndpoints,
} from '@/features/auth';

export const postAuthProfileApi = (
  payload: TypeAuthProfile
): Promise<AxiosResponse<ApiResponse<UserInfoType>>> => {
  return instanceApi.post(AuthEndpoints.AUTH_PROFILE, payload);
};
