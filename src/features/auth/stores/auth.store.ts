import { createJSONStorage, persist } from 'zustand/middleware';
import { create } from 'zustand';

import type { UserInfoType } from '@/features/auth';

type AuthState = {
  user: UserInfoType | null;
  accessToken: string | null;
  refreshToken: string | null;

  setAuth: (user: UserInfoType) => void;
  setTokens: (Tokens: {
    accessToken: string;
    refreshToken: string;
    user: UserInfoType;
  }) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      setAuth: user =>
        set({
          user,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
        }),

      setTokens: ({ accessToken, refreshToken, user }) =>
        set(state => ({
          accessToken,
          refreshToken,
          user: user ?? state.user,
        })),
      logout: () => {
        set({ accessToken: null, refreshToken: null, user: null });
        useAuthStore.persist.clearStorage();
      },
    }),
    {
      name: 'auth',
      partialize: state => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
      storage: createJSONStorage(() => localStorage),
    }
  )
);
