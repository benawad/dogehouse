import { useTokenStore } from "../modules/auth/useTokenStore";
import { apiBaseUrl } from "./constants";
import fetch from "isomorphic-fetch";

export const defaultQueryFn = async ({ queryKey }: { queryKey: string }) => {
  const { accessToken, refreshToken } = useTokenStore.getState();

  const r = await fetch(`${apiBaseUrl}${queryKey}`, {
    headers: {
      "X-Access-Token": accessToken,
      "X-Refresh-Token": refreshToken,
    },
  });

  if (r.status !== 200) {
    throw new Error(await r.text());
  }
  const _accessToken = r.headers.get("access-token");
  const _refreshToken = r.headers.get("refresh-token");

  if (_accessToken && _refreshToken) {
    useTokenStore.getState().setTokens({
      accessToken: _accessToken,
      refreshToken: _refreshToken,
    });
  }

  return await r.json();
};
