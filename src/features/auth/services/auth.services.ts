import { useMutation } from '@tanstack/react-query';

import { useAuthStore } from '@/features/auth/stores/auth.store';
import { type TypeAuthProfile, postAuthProfileApi } from '@/features/auth';

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
