import create from "zustand";
import { combine } from "zustand/middleware";

type Handler = (d: any) => void;

export const useWsHandlerStore = create(
  combine(
    {
      handlerMap: {} as Record<string, Handler>,
      fetchResolveMap: {} as Record<string, Handler>,
      authHandler: null as null | Handler,
    },
    (set) => ({
      addAuthHandler: (authHandler: Handler | null) => set({ authHandler }),
      addMultipleWsListener: (x: Record<string, Handler>) => {
        set((s) => ({
          handlerMap: {
            ...s.handlerMap,
            ...x,
          },
        }));
        return () =>
          set((s) => {
            const newMap = { ...s.handlerMap };
            Object.keys(x).forEach((k) => {
              delete newMap[k];
            });
            return {
              handlerMap: newMap,
            };
          });
      },
      addWsListener: (op: string, fn: (d: any) => void) => {
        return set((s) => ({
          handlerMap: {
            ...s.handlerMap,
            [op]: fn,
          },
        }));
      },
      addWsListenerOnce: (op: string, fn: (d: any) => void) => {
        return set((s) => ({
          handlerMap: {
            ...s.handlerMap,
            [op]: (dx: any) => {
              fn(dx);
              set(({ handlerMap: { [op]: _, ...handlerMap } }) => ({
                handlerMap,
              }));
            },
          },
        }));
      },
      clearFetchListener: (id: string) => {
        return set(({ fetchResolveMap: { [id]: _, ...fetchResolveMap } }) => ({
          fetchResolveMap,
        }));
      },
      addFetchListener: (id: string, fn: (d: any) => void) => {
        return set((s) => ({
          fetchResolveMap: {
            ...s.fetchResolveMap,
            [id]: (dx: any) => {
              fn(dx);
              set(({ fetchResolveMap: { [id]: _, ...fetchResolveMap } }) => ({
                fetchResolveMap,
              }));
            },
          },
        }));
      },
      set,
    })
  )
);
