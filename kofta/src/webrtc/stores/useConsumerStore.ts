import { Consumer } from "mediasoup-client/lib/types";
import create from "zustand";
import { combine } from "zustand/middleware";

export const useConsumerStore = create(
  combine(
    {
      consumers: [] as Consumer[],
    },
    (set) => ({
      add: (c: Consumer) => set((s) => ({ consumers: [...s.consumers, c] })),
      closeAll: () =>
        set((s) => {
          s.consumers.forEach((c) => !c.closed && c.close());
          return {
            consumers: [],
          };
        }),
      closeByProducerId: (producerId: string) =>
        set((s) => ({
          consumers: s.consumers.filter((c) => {
            if (c.appData.producerId === producerId && !c.closed) {
              c.close();
              return false;
            }
            return true;
          }),
        })),
    })
  )
);
