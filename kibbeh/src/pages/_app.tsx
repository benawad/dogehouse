import React from "react";
import "../styles/globals.css";
import { AppProps } from "next/app";
import { QueryClientProvider } from "react-query";
import { ToastContainer } from "react-toastify";
import { WebSocketProvider } from "../modules/ws/WebSocketProvider";
import { PageComponent } from "../types/PageComponent";
import { queryClient } from "../lib/queryClient";
import { isServer } from "../lib/isServer";
import { init_i18n } from "../lib/i18n";
import { SoundEffectPlayer } from "../modules/sound-effects/SoundEffectPlayer";
import ReactModal from "react-modal";

if (!isServer) {
  init_i18n();
}

ReactModal.setAppElement("#__next");

function App({ Component, pageProps }: AppProps) {
  return (
    <WebSocketProvider
      shouldConnect={!!(Component as PageComponent<unknown>).ws}
    >
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
        <ToastContainer />
        <SoundEffectPlayer />
      </QueryClientProvider>
    </WebSocketProvider>
  );
}

export default App;
