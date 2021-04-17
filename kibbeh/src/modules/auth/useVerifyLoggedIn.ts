import { useRouter } from "next/router";
import { useEffect } from "react";
import { useTokenStore } from "./useTokenStore";

export const useVerifyLoggedIn = () => {
  const { replace, query, pathname } = useRouter();
  const { id } = query;
  const hasTokens = useTokenStore((s) => !!(s.accessToken && s.refreshToken));

  useEffect(() => {
    if (!hasTokens) {
      if (id) {
        replace(`/?next=/room/${id}`);
      } else {
        replace(pathname);
      }
    }
  }, [hasTokens, id, replace, pathname]);

  return hasTokens;
};