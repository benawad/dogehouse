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

import { MobileNav } from "../ui/MobileNav";
import {SmSolidHome, SmSolidCalendar, SmSolidPlus, SmSolidCompass, SmSolidFriends} from "../icons"

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
      <MobileNav
        items={[
          {
            targetPath: "/home",
            icon: <SmSolidHome />,
          },{
            targetPath: "/home",
            icon: <SmSolidCalendar />,
          },
          {
            targetPath: "/home",
            icon: <SmSolidPlus />,
          },
          {
            targetPath: "/home",
            icon: <SmSolidCompass />,
          },
          {
            targetPath: "/home",
            icon: <SmSolidFriends />,
          },
        ]}
      />
    </WebSocketProvider>
  );
}

export default App;
