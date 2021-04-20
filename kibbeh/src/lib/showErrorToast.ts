import { useErrorToastStore } from "../modules/errors/useErrorToastStore";
import { ToastDurations } from "../ui/Toast";

export const showErrorToast = (m: string, duration?: ToastDurations, button?: JSX.Element, onClose?: () => void) => {
  console.log("showErrorToast: ", m);
  useErrorToastStore.getState().showErrorToast({ message: m, duration, button, onClose });
};
