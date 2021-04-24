import { QueryClient } from "react-query";
import { showErrorToast } from "./showErrorToast";
import { defaultQueryFn } from "./defaultQueryFn";

export const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      onError: (e) => {
        if ("message" in (e as Error)) {
          showErrorToast((e as Error).message);
        }
      },
    },
    queries: {
      retry: false,
      staleTime: 60 * 1000 * 5,
      onError: (e) => {
        if ("message" in (e as Error)) {
          showErrorToast((e as Error).message);
        }
      },
      queryFn: defaultQueryFn as any,
    },
  },
});
