import { useEffect } from "react";
import { useRouter } from "next/router";
import { useTokenStore } from "./useTokenStore";
import { loginNextPathKey } from "../../lib/constants";
import { showErrorToast } from "../../lib/showErrorToast";

export const useSaveTokensFromQueryParams = () => {
  const { query: params, push } = useRouter();

  useEffect(() => {
    if (typeof params.error === "string" && params.error) {
      showErrorToast(params.error);
    }
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
      let nextPath = "/dash";
      try {
        const possibleNextPath = localStorage.getItem(loginNextPathKey);
        if (possibleNextPath && possibleNextPath.startsWith("/")) {
          nextPath = possibleNextPath;
          localStorage.setItem(loginNextPathKey, "");
        }
      } catch {}
      // Push to next path after auto redirect to /dash (100 msecs is unoticeable)
      setTimeout(() => push(nextPath), 100);
    }
  }, [params, push]);
};
