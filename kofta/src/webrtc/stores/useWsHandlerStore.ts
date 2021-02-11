import create from "zustand";
import { combine } from "zustand/middleware";

export const useWsHandlerStore = create(
  combine(
    {
      handlerMap: {} as Record<string, (d: any) => void>,
    },
    (set) => ({
      addMultipleWsListener: (x: Record<string, (d: any) => void>) => {
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
      set,
    })
  )
);
