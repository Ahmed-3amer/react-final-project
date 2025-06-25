import { isTokenExpire } from "@/api";
import { refreshTokeAPI } from "@/api/auth";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create()(
  persist(
    (set, get) => ({
      token: null,
      refreshToken: null,
      loading: false,
      setTokens: (tokens) => set({ ...tokens }),
      clear: () => set({ token: null, refreshToken: null }),
      isValidTokens: async () => {
        set({ loading: true });
        const { token, refreshToken, clear } = get();
        if (isTokenExpire(token) && isTokenExpire(refreshToken)) {
          clear();
          return false;
        }
        if (!isTokenExpire(token) || !isTokenExpire(refreshToken)) {
          if (isTokenExpire(token)) {
            try {
              const res = await refreshTokeAPI({ refreshToken });
              set({ ...res.data });
            } catch {
              clear();
              return false;
            }
          }
          return true;
        }
        clear();
        set({ loading: false });
        return false;
      },
    }),
    {
      name: "auth-store",
    }
  )
);
