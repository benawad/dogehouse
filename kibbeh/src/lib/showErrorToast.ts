import { useErrorToastStore } from "../modules/errors/useErrorToastStore";

export const showErrorToast = (m: string) => {
  console.log("showErrorToast: ", m);
  useErrorToastStore.getState().showToast({ message: m });
};
