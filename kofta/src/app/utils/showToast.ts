import { toast } from "react-toastify";

export const showErrorToast = (m: string) => {
	toast(m, {
		type: "error",
	});
};

export const showSuccessToast = (m: string) => {
	toast(m, {
		type: "success",
	});
};

export const showInfoToast = (m: string) => {
	toast(m, {
		type: "info",
	});
};
