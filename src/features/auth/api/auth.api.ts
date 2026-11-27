import type { AxiosRequestConfig, AxiosResponse } from 'axios';

import { instanceApi } from '@/api/base-api';
import { type ApiResponse } from '@/types/app.types';

import {
  type LoginResponseType,
  type RefreshTokenPayload,
  type RefreshTokenResponse,
  type TypeAuthProfile,
  type TypeLogin,
  type UserInfoType,
  AuthEndpoints,
} from '@/features/auth';

export const postAuthProfileApi = (
  payload: TypeAuthProfile
): Promise<AxiosResponse<ApiResponse<UserInfoType>>> => {
  return instanceApi.post(AuthEndpoints.AUTH_PROFILE, payload);
};

export const Login = (
  payload: TypeLogin
): Promise<AxiosResponse<LoginResponseType>> => {
  return instanceApi.post(AuthEndpoints.LOGIN, payload);
};

export const Refresh = (
  payload: RefreshTokenPayload
): Promise<AxiosResponse<RefreshTokenResponse>> =>
  instanceApi.post(AuthEndpoints.REFRESH, payload, {
    skipAuthRefresh: true,
  } as AxiosRequestConfig);
