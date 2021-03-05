import * as React from "react";
import { Modal } from "./Modal";
import create from "zustand";
import { combine } from "zustand/middleware";
import { Button } from "./Button";
import { useTypeSafeTranslation } from "../utils/useTypeSafeTranslation";

interface Props {}

const useAlertModalStore = create(
	combine(
		{
			message: "",
			isOpen: false,
		},
		(set) => ({
			close: () => set({ isOpen: false, message: "" }),
			set,
		})
	)
);

export const modalAlert = (message: string) => {
	useAlertModalStore.getState().set({ isOpen: true, message });
};

export const AlertModal: React.FC<Props> = () => {
	const { isOpen, message, close } = useAlertModalStore();
	const { t } = useTypeSafeTranslation();
	return (
		<Modal isOpen={isOpen} onRequestClose={() => close()}>
			<div>{message}</div>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					close();
				}}
			>
				<div className={`flex mt-12`}>
					<Button type="submit">{t("common.ok")}</Button>
				</div>
			</form>
		</Modal>
	);
};
