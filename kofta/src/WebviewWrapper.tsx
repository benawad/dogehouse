import { Provider } from "jotai";
import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./css/reset.css";
import "./css/vars.css";
import "./css/vscode.css";
import { WebviewApp } from "./vscode-webview/App";
import { MuteTitleUpdater } from "./vscode-webview/components/MuteTitleUpdater";

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
