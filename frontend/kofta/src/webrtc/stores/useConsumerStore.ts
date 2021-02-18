import { Consumer } from "mediasoup-client/lib/types";
import create from "zustand";
import { combine } from "zustand/middleware";

export const useConsumerStore = create(
  combine(
    {
      consumerMap: {} as Record<string, { consumer: Consumer; volume: number }>,
    },
    (set) => ({
      setVolume: (userId: string, volume: number) => {
        set((s) =>
          userId in s.consumerMap
            ? {
                consumerMap: {
                  ...s.consumerMap,
                  [userId]: {
                    ...s.consumerMap[userId],
                    volume,
                  },
                },
              }
            : s
        );
      },
      add: (c: Consumer, userId: string) =>
        set((s) => {
          let volume = 100;
          if (userId in s.consumerMap) {
            const x = s.consumerMap[userId];
            volume = x.volume;
            x.consumer.close();
          }
          return {
            consumerMap: {
              ...s.consumerMap,
              [userId]: { consumer: c, volume },
            },
          };
        }),
      closeAll: () =>
        set((s) => {
          Object.values(s.consumerMap).forEach(
            ({ consumer: c }) => !c.closed && c.close()
          );
          return {
            consumerMap: {},
          };
        }),
    })
  )
);
