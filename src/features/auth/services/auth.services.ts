import { useMutation } from '@tanstack/react-query';

import { useAuthStore } from '@/features/auth/stores/auth.store';
import {
  type GENDER,
  Login,
  type TypeAuthProfile,
  type TypeLogin,
  type UserInfoType,
  postAuthProfileApi,
} from '@/features/auth';
import { useNavigate } from 'react-router';
import { message } from 'antd';
import type { AxiosError } from 'axios';

export const useAuthProfile = () => {
  const { setAuth } = useAuthStore();

  return useMutation({
    mutationKey: ['postAuthProfileApi'],
    mutationFn: async (payload: TypeAuthProfile) => {
      const res = await postAuthProfileApi(payload);
      return res.data.data;
    },
    onSuccess: data => {
      setAuth(data);
    },
  });
};

const GENDER_MAP: Record<string, GENDER> = {
  male: 'Male',
  female: 'Female',
};

export const useLogin = () => {
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();
  return useMutation({
    mutationKey: ['postLoginApi'],
    mutationFn: async (payload: TypeLogin): Promise<UserInfoType> => {
      const res = await Login(payload);
      const rawData = res.data;

      return {
        ...rawData,
        gender: GENDER_MAP[rawData.gender.toLowerCase()] ?? 'Other',
      };
    },
    onSuccess: (data: UserInfoType) => {
      setAuth(data);
      message.success('Đăng nhập thành công!');
      navigate('/');
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const errorMsg =
        error?.response?.data?.message ??
        'Tên đăng nhập hoặc mật khẩu không đúng!';
      message.error(errorMsg);
    },
  });
};
//Sửa
