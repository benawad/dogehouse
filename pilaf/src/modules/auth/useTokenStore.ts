// TODO Token should not be store in unsecure AsyncStorage
import AsyncStorage from "@react-native-async-storage/async-storage";
import create from "zustand";
import { combine } from "zustand/middleware";
import { accessToken, refreshToken } from "../../../tokens";
const accessTokenKey = "@toum/token";
const refreshTokenKey = "@toum/refresh-token";

export const useTokenStore = create(
  combine(
    {
      accessToken,
      refreshToken,
    },
    (set) => ({
      setTokens: async (x: { accessToken: string; refreshToken: string }) => {
        try {
          await AsyncStorage.setItem(accessTokenKey, x.accessToken);
          await AsyncStorage.setItem(refreshTokenKey, x.refreshToken);
        } catch {}

        set(x);
      },
      loadTokens: async () => {
        try {
          let accessToken = await AsyncStorage.getItem(accessTokenKey);
          accessToken = accessToken || "";
          let refreshToken = await AsyncStorage.getItem(refreshTokenKey);
          refreshToken = refreshToken || "";
          set({ accessToken, refreshToken });
        } catch {}
      },
    })
  )
);
// export const useTokenStore = create(
//   combine(getDefaultValues(), (set) => ({
//     setTokens: (x: { accessToken: string; refreshToken: string }) => {
//       try {
//         localStorage.setItem(accessTokenKey, x.accessToken);
//         localStorage.setItem(refreshTokenKey, x.refreshToken);
//       } catch {}

//       set(x);
//     },
//   }))
// );
