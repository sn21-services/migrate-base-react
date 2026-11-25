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

const errorInterceptor = (error: AxiosError) => {
  if (error && error.response) {
    return Promise.reject(error.response);
  }
  return Promise.reject(error);
};

// 3. Hàm xử lý tự động Refresh Token cho axios-auth-refresh
const refreshAuthLogic = async (failedRequest: AxiosError) => {
  const refreshToken = useAuthStore.getState().refreshToken;

  if (!refreshToken) {
    useAuthStore.getState().logout();
    return Promise.reject(failedRequest);
  }

  try {
    // Dùng axios gốc để gọi API refresh, tránh kích hoạt vòng lặp interceptor
    const res = await axios.post(
      AuthEndpoints.REFRESH,
      toSnakeCase(
        {
          refreshToken,
          expiresInMins: 30,
        },
        true
      ), // Chuyển payload sang snake_case giống requestInterceptor
      {
        baseURL: BASE_URL_API,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    // Chuyển dữ liệu trả về sang camelCase giống responseInterceptor
    const camelData = toCamel(res.data);
    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
      camelData;

    useAuthStore.getState().setTokens({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });

    // Cập nhật token mới cho request vừa bị lỗi 401 để thư viện tự gọi lại
    if (failedRequest.response?.config?.headers) {
      failedRequest.response.config.headers.Authorization = `Bearer ${newAccessToken}`;
    }

    return Promise.resolve();
  } catch (refreshError) {
    useAuthStore.getState().logout();
    return Promise.reject(refreshError);
  }
};

// 4. Đăng ký các Interceptors (Lưu ý: đăng ký createAuthRefreshInterceptor trước errorInterceptor)
instanceApi.interceptors.request.use(requestInterceptor);

createAuthRefreshInterceptor(instanceApi, refreshAuthLogic, {
  statusCodes: [STATUS_CODE.UNAUTHORIZED],
});

instanceApi.interceptors.response.use(responseInterceptor, errorInterceptor);
