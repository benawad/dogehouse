import React from "react";
import create from "zustand";
import { combine } from "zustand/middleware";
import { v4 } from "uuid";
import { BannerDurations } from "../../ui/Banner";

type Banner = {
  id: string;
  button?: React.ReactNode;
  duration?: BannerDurations;
  onClose?: () => void;
  message: string;
};

export const useBannerStore = create(
  combine(
    {
      banners: [] as Banner[],
    },
    (set) => ({
      hideBanner: (id: string) =>
        set((x) => ({ banners: x.banners.filter((y) => y.id !== id) })),
      showBanner: (b: Omit<Banner, "id">) =>
        set((x) => ({ banners: [...x.banners, { ...b, id: v4() }] })),
    })
  )
);
