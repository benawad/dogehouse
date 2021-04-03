import React from "react";
import "../styles/globals.css";
import { AppProps } from "next/app";
import { QueryClientProvider } from "react-query";
import { WebSocketProvider } from "../modules/ws/WebSocketProvider";
import { PageComponent } from "../types/PageComponent";
import { queryClient } from "../lib/queryClient";
import { isServer } from "../lib/isServer";
import { init_i18n } from "../lib/i18n";
import { SoundEffectPlayer } from "../modules/sound-effects/SoundEffectPlayer";
import ReactModal from "react-modal";
import { ErrorToastController } from "../modules/errors/ErrorToastController";
import { WebRtcApp } from "../modules/webrtc/WebRtcApp";
import { MainWsHandlerProvider } from "../shared-hooks/useMainWsHandler";
import NProgress from "nprogress";
import Router from "next/router";
import "nprogress/nprogress.css";
import { KeybindListener } from "../modules/keyboard-shortcuts/KeybindListener";
import { InvitedToJoinRoomModal } from "../shared-components/InvitedToJoinRoomModal";
import { ConfirmModal } from "../shared-components/ConfirmModal";

if (!isServer) {
  init_i18n();
}

Router.events.on("routeChangeStart", () => {
  NProgress.start();
});
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

ReactModal.setAppElement("#__next");

function App({ Component, pageProps }: AppProps) {
  if (isServer && (Component as PageComponent<unknown>).ws) {
    return null;
  }

  return (
    <WebSocketProvider
      shouldConnect={!!(Component as PageComponent<unknown>).ws}
    >
      <QueryClientProvider client={queryClient}>
        <MainWsHandlerProvider>
          <Component {...pageProps} />
          <SoundEffectPlayer />
          <ErrorToastController />
          <WebRtcApp />
          <KeybindListener />
          <InvitedToJoinRoomModal />
          <ConfirmModal />
        </MainWsHandlerProvider>
      </QueryClientProvider>
    </WebSocketProvider>
  );
}

export default App;
