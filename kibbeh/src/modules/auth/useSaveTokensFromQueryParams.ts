import { useEffect } from "react";
import { useRouter } from "next/router";
import { useTokenStore } from "./useTokenStore";

export const useSaveTokensFromQueryParams = () => {
  const { query: params, push } = useRouter();

  useEffect(() => {
    if (
      typeof params.accessToken === "string" &&
      typeof params.refreshToken === "string" &&
      params.accessToken &&
      params.refreshToken
    ) {
      useTokenStore.getState().setTokens({
        accessToken: params.accessToken,
        refreshToken: params.refreshToken,
      });
      push("/lounge");
    }
  }, [params, push]);
};
