import axios, {
  type AxiosResponse,
  type InternalAxiosRequestConfig,
  type AxiosError,
} from 'axios';
import createAuthRefreshInterceptor from 'axios-auth-refresh';

import { STATUS_CODE } from '@/constants/app.constants';
import { toSnakeCase, toCamel } from '@/helpers/convert-object.helpers';
import { useAuthStore } from '@/features/auth/stores/auth.store';
import { AuthEndpoints } from '@/features/auth';

const BASE_URL_API = import.meta.env.VITE_BASE_API;

export const instanceApi = axios.create({
  baseURL: BASE_URL_API,
  headers: {
    'Content-Type': 'application/json',
  },
});

const requestInterceptor = (
  req: InternalAxiosRequestConfig & {
    custom?: { isFormData?: boolean; skipSnakeCase: boolean };
  }
) => {
  const token = useAuthStore.getState().accessToken;
  const headers = {
    ...req.headers,
    Authorization: token ? `Bearer ${token}` : req.headers?.Authorization,
    'Content-Type': req?.custom?.isFormData
      ? 'multipart/form-data'
      : 'application/json',
  } as InternalAxiosRequestConfig['headers'];

  return {
    ...req,
    headers,
    params:
      req.params && !req.paramsSerializer
        ? toSnakeCase(req.params, true)
        : req.params,
    data: req?.custom?.skipSnakeCase ? req.data : toSnakeCase(req.data, true),
  };
};

const responseInterceptor = (res: AxiosResponse) => {
  res.data = toCamel(res.data);
  return res;
};

const errorInterceptor = (error: AxiosError) => {
  if (error && error.response) {
    return Promise.reject(error.response);
  }
  return Promise.reject(error);
};

const refreshAuthLogic = async (failedRequest: AxiosError) => {
  const refreshToken = useAuthStore.getState().refreshToken;

  if (!refreshToken) {
    useAuthStore.getState().logout();
    return Promise.reject(failedRequest);
  }

  try {
    const res = await axios.post(
      AuthEndpoints.REFRESH,
      toSnakeCase(
        {
          refreshToken,
          expiresInMins: 30,
        },
        true
      ),
      {
        baseURL: BASE_URL_API,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const camelData = toCamel(res.data);
    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
      camelData;

    useAuthStore.getState().setTokens({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      user: camelData,
    });

    if (failedRequest.response?.config?.headers) {
      failedRequest.response.config.headers.Authorization = `Bearer ${newAccessToken}`;
    }

    return Promise.resolve();
  } catch (refreshError) {
    useAuthStore.getState().logout();
    return Promise.reject(refreshError);
  }
};

instanceApi.interceptors.request.use(requestInterceptor);

createAuthRefreshInterceptor(instanceApi, refreshAuthLogic, {
  statusCodes: [STATUS_CODE.UNAUTHORIZED],
});

instanceApi.interceptors.response.use(responseInterceptor, errorInterceptor);
