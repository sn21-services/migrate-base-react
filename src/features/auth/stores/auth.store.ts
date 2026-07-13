import { createJSONStorage, persist } from 'zustand/middleware';
import { create } from 'zustand';

import type { UserInfoType } from '@/features/auth';

type AuthState = {
  user: UserInfoType | null;
  accessToken: string | null;

  setAuth: (user: UserInfoType) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      user: null,
      accessToken: null,
      setAuth: user =>
        set({
          user,
          accessToken: user.accessToken,
        }),
      logout: () => {
        set({ accessToken: null, user: null });
        useAuthStore.persist.clearStorage();
      },
    }),
    {
      name: 'auth',
      partialize: state => ({
        accessToken: state.accessToken,
      }),
      storage: createJSONStorage(() => localStorage),
    }
  )
);
