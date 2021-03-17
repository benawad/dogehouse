import React from "react";
import "../styles/globals.css";
import { AppProps } from "next/app";
import { QueryClientProvider } from "react-query";
import { ToastContainer } from "react-toastify";
import { WebSocketProvider } from "../modules/ws/WebSocketProvider";
import { PageComponent } from "../types/PageComponent";
import { queryClient } from "../lib/queryClient";

function App({ Component, pageProps }: AppProps) {
  return (
    <WebSocketProvider
      shouldConnect={!!(Component as PageComponent<unknown>).ws}
    >
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
        <ToastContainer />
      </QueryClientProvider>
    </WebSocketProvider>
  );
}

export default App;
