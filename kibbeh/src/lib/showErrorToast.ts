import { toast } from "react-toastify";

export const showErrorToast = (m: string) => {
  toast(m, {
    type: "error",
  });
};
