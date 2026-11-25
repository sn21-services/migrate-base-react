import axios, {
  type AxiosResponse,
  type InternalAxiosRequestConfig,
  type AxiosError,
} from 'axios';

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

//Quản lý hàng đợi khi refreshToken
let isRefreshing = false;
let failQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failQueue = [];
};

const requestInterceptor = (
  req: InternalAxiosRequestConfig & {
    custom?: { isFormData?: boolean };
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
    params: toSnakeCase(req.params, true),
    data: toSnakeCase(req.data, true),
  };
};

const responseInterceptor = (res: AxiosResponse) => {
  res.data = toCamel(res.data);
  return res;
};

const errorInterceptor = async (error: AxiosError) => {
  const originalRequest = error.config as InternalAxiosRequestConfig & {
    retry?: boolean;
  };
  if (error && error.response) {
    const status = error.response.status;

    if (
      status === STATUS_CODE.UNAUTHORIZED &&
      originalRequest &&
      !originalRequest.retry
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failQueue.push({
            resolve: (newToken: string) => {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              resolve(instanceApi(originalRequest));
            },
            reject: err => reject(err),
          });
        });
      }
      originalRequest.retry = true;
      isRefreshing = true;

      const refreshToken = useAuthStore.getState().refreshToken;
      if (!refreshToken) {
        useAuthStore.getState().logout();
        return Promise.reject(error.response);
      }

      try {
        const res = await axios.post(
          AuthEndpoints.REFRESH,
          {
            refreshToken,
            expiresInMins: 30,
          },
          {
            baseURL: BASE_URL_API,
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
          res.data;

        useAuthStore.getState().setTokens({
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        });
        processQueue(null, newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return instanceApi(originalRequest);
      } catch (error) {
        processQueue(error, null);
        useAuthStore.getState().logout();
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error.response);
  }
  return Promise.reject(error);
};

instanceApi.interceptors.request.use(requestInterceptor);
instanceApi.interceptors.response.use(responseInterceptor, errorInterceptor);
