import { Provider } from "jotai";
import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { WebviewApp } from "./vscode-webview/App";
import { MuteTitleUpdater } from "./vscode-webview/components/MuteTitleUpdater";
import { setup } from "twind";

setup({
  darkMode: "media",
  theme: {
    fontFamily: {
      sans: ["Heebo", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
      mono: ["Menlo", "Monaco", "Courier New", "monospace"],
    },
    extend: {
      colors: {
        "vsc-bg": "#1e1e1e",
      },
    },
  },
  variants: {
  },
  plugins: {},
});

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
