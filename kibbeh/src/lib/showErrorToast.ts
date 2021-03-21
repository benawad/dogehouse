import { useErrorToastStore } from "../modules/errors/useErrorToastStore";

export const showErrorToast = (m: string) => {
  useErrorToastStore.getState().showToast({ message: m });
};
