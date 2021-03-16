import React from "react";
import "../styles/globals.css";
import { AppProps } from "next/app";
import { WebSocketProvider } from "../modules/ws/WebSocketProvider";
import { PageComponent } from "../types/PageComponent";

function App({ Component, pageProps }: AppProps) {
  return (
    <WebSocketProvider
      shouldConnect={!!(Component as PageComponent<unknown>).ws}
    >
      <Component {...pageProps} />
    </WebSocketProvider>
  );
}

export default App;
