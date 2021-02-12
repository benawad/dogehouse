import { Provider } from "jotai";
import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { tw } from "twind";
import "./css/reset.css";
import "./css/vars.css";
import "./css/vscode.css";
import { WebviewApp } from "./vscode-webview/App";
import { MicPermissionBanner } from "./vscode-webview/components/MicPermissionBanner";
import { MuteTitleUpdater } from "./vscode-webview/components/MuteTitleUpdater";
import { useMicPermErrorStore } from "./webrtc/stores/useMicPermErrorStore";

interface WebviewWrapperProps {}

export const WebviewWrapper: React.FC<WebviewWrapperProps> = () => {
  const { error } = useMicPermErrorStore();

  return (
    <Provider>
      <div
        className={tw`max-w-screen-sm mx-auto w-full h-full flex flex-col relative`}
      >
        {error ? <MicPermissionBanner /> : null}
        <WebviewApp />
      </div>
      <ToastContainer />
      <MuteTitleUpdater />
    </Provider>
  );
};
