import React, { useEffect, useLayoutEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import { createWebSocket } from "../createWebsocket";
import { useSocketStatus } from "../webrtc/stores/useSocketStatus";
import { useVoiceStore } from "../webrtc/stores/useVoiceStore";
import { WebRtcApp } from "../webrtc/WebRtcApp";
import { CenterLayout } from "./components/CenterLayout";
import { DeviceNotSupported } from "./components/DeviceNotSupported";
import { MicPermissionBanner } from "./components/MicPermissionBanner";
import { PageWrapper } from "./components/PageWrapper";
import { WsKilledMessage } from "./components/WsKilledMessage";
import { RoomChat } from "./modules/room-chat/RoomChat";
import { Routes } from "./Routes";
import { useOverlayStore } from "./utils/useOverlayStore";
import { useSaveTokensFromQueryParams } from "./utils/useSaveTokensFromQueryParams";
import { useTokenStore } from "./utils/useTokenStore";
import isElectron from "is-electron";

interface AppProps { }

export const App: React.FC<AppProps> = () => {
  const isDeviceSupported = useVoiceStore((s) => !!s.device);
  const hasTokens = useTokenStore((s) => !!s.accessToken && !!s.refreshToken);
  const wsKilledByServer = useSocketStatus(
    (s) => s.status === "closed-by-server"
  );
  useState(() => (hasTokens ? createWebSocket() : null));
  useLayoutEffect(() => {
    if (hasTokens) {
      createWebSocket();
      useOverlayStore.getState();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasTokens]);

  useEffect(() => {
    if (isElectron()) {
      const ipcRenderer = window.require("electron").ipcRenderer;
      ipcRenderer.send("@dogehouse/loaded", "kofta");
    }
  }, [])

  useSaveTokensFromQueryParams();

  if (!isDeviceSupported) {
    return <DeviceNotSupported />;
  }

  if (wsKilledByServer) {
    return <WsKilledMessage />;
  }

  return (
    <BrowserRouter>
      <WebRtcApp />
      <PageWrapper>
        <CenterLayout>
          <Routes />
          <MicPermissionBanner />
        </CenterLayout>
        <RoomChat sidebar />
      </PageWrapper>
    </BrowserRouter>
  );
};
