import { useToastStore } from "../modules/toast/useToastStore";
import { ToastDurations } from "../ui/ErrorToast";

export const showToast = (m: string, duration?: ToastDurations, button?: JSX.Element, onClose?: () => void) => {
  console.log("showToast: ", m);
  useToastStore.getState().showToast({ message: m, duration, button, onClose });
};
