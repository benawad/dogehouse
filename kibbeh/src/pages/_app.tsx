import React, { useEffect } from "react";
import "../styles/globals.css";
import "../styles/electron-header.css";
import "../styles/banner-button.css";
import "../styles/date-time-picker.css";
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
import isElectron from "is-electron";
import Head from "next/head";
import { useHostStore } from "../global-stores/useHostStore";

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
  // keep this here as long as this version is still in dev.
  // baklava listens to this event to re-size it's window
  useEffect(() => {
    if (isElectron()) {
      const ipcRenderer = window.require("electron").ipcRenderer;
      ipcRenderer.send("@dogehouse/loaded", "kibbeh");
      ipcRenderer.send("@app/hostPlatform");
      ipcRenderer.on(
        "@app/hostPlatform",
        (
          event: any,
          platform: { isLinux: boolean; isWin: boolean; isMac: boolean }
        ) => {
          useHostStore.getState().setData(platform);
        }
      );
      document.documentElement.style.setProperty(
        "--screen-height-reduction",
        "38px"
      );
    }
  }, []);

  if (
    isServer &&
    !Component.getInitialProps &&
    (Component as PageComponent<unknown>).ws
  ) {
    return null;
  }

  return (
    <WebSocketProvider
      shouldConnect={!!(Component as PageComponent<unknown>).ws}
    >
      <QueryClientProvider client={queryClient}>
        <MainWsHandlerProvider>
          <Head>
            <link rel="icon" href="/favicon.ico" type="image/x-icon" />
            <link rel="manifest" href="/manifest.json" />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1, user-scalable=no, user-scalable=0"
            />
            <link rel="apple-touch-icon" href="/img/doge.png"></link>
            <link rel="apple-touch-startup-image" href="img/doge512.png" />
          </Head>
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
