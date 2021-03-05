import { Provider } from "jotai";
import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { WebviewApp } from "./app/App";
import { MuteTitleUpdater } from "./app/components/MuteTitleUpdater";

interface WebviewWrapperProps {}

export const WebviewWrapper: React.FC<WebviewWrapperProps> = () => {
	return (
		<Provider>
			<WebviewApp />
			<ToastContainer />
			<MuteTitleUpdater />
		</Provider>
	);
};
