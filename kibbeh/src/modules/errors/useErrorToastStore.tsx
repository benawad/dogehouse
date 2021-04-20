import React from "react";
import create from "zustand";
import { combine } from "zustand/middleware";
import { v4 } from "uuid";
import { ToastDurations } from "../../ui/Toast";

type Toast = {
  id: string;
  button?: React.ReactNode;
  duration?: ToastDurations;
  onClose?: () => void;
  message: string;
};

export const useErrorToastStore = create(
  combine(
    {
      toasts: [] as Toast[],
    },
    (set) => ({
      hideToast: (id: string) =>
        set((x) => ({ toasts: x.toasts.filter((y) => y.id !== id) })),
      showErrorToast: (t: Omit<Toast, "id">) =>
        set((x) => ({ toasts: [...x.toasts, { ...t, id: v4() }] })),
    })
  )
);
