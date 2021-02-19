import { Provider } from "jotai";
import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./css/reset.css";
import "./css/vars.css";
import "./css/vscode.css";
import { WebviewApp } from "./vscode-webview/App";
import { MuteTitleUpdater } from "./vscode-webview/components/MuteTitleUpdater";
import { setup } from "twind";

interface WebviewWrapperProps {}

setup({
  theme: {
    fontFamily: {
      sans: ["var(--vscode-font-family)"],
      serif: ["var(--vscode-font-family)"],
    },
    borderColor: {
      tmpBo1: "#CCCCCC",
    },
    textColor: {
      tmpC1: "#A6A6A6",
      tmpC2: "#333333",
      tmpC3: "#FEFEFE",
      tmpC4: "#0B78E3",
      input: "var(--vscode-input-foreground)",
      error: "var(--vscode-inputValidation-errorBorder)",
    },
    backgroundColor: {
      tmpBg1: "#262626",
      tmpBg2: "#333333",
      tmpBg3: "#666666",
      tmpBg4: "#595959",
      input: "var(--vscode-input-background)",
      buttonHover: "var(--vscode-button-hoverBackground)",
      button: "var(--vscode-button-background)",
      buttonHoverRed: "var(--vscode-errorForeground)",
      buttonRed: "var(--vscode-inputValidation-errorBorder)",
      buttonHoverSecondary: "var(--vscode-button-secondaryHoverBackground)",
      buttonSecondary: "var(--vscode-button-secondaryBackground)",
    },
  },
});

export const WebviewWrapper: React.FC<WebviewWrapperProps> = () => {
  return (
    <Provider>
      <WebviewApp />
      <ToastContainer />
      <MuteTitleUpdater />
    </Provider>
  );
};
