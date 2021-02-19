import { useAtom } from "jotai";
import queryString from "query-string";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { QueryClientProvider } from "react-query";
import { tw } from "twind";
import { createWebSocket } from "../createWebsocket";
import { useSocketStatus } from "../webrtc/stores/useSocketStatus";
import { useWsHandlerStore } from "../webrtc/stores/useWsHandlerStore";
import { setMeAtom } from "./atoms";
import { Button } from "./components/Button";
import { CenterLayout } from "./components/CenterLayout";
import { KeybindListener } from "./components/KeybindListener";
import { Wrapper } from "./components/Wrapper";
import { Login } from "./pages/Login";
import { queryClient } from "./queryClient";
import { Router } from "./Router";
import { useTokenStore } from "./utils/useTokenStore";

interface AppProps {}

export const WebviewApp: React.FC<AppProps> = () => {
  const hasTokens = useTokenStore((s) => !!s.accessToken && !!s.refreshToken);
  const wsKilledByServer = useSocketStatus(
    (s) => s.status === "closed-by-server"
  );
  const [, setMe] = useAtom(setMeAtom);
  useState(() => {
    useWsHandlerStore.getState().addWsListener("auth-good", (d) => {
      setMe(d.user);
    });
  });
  useState(() => (hasTokens ? createWebSocket() : null));

  useLayoutEffect(() => {
    if (hasTokens) {
      createWebSocket();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasTokens]);

  useEffect(() => {
    const params = queryString.parse(window.location.search);
    if (
      typeof params.accessToken === "string" &&
      typeof params.refreshToken === "string" &&
      params.accessToken &&
      params.refreshToken
    ) {
      useTokenStore.getState().setTokens({
        accessToken: params.accessToken,
        refreshToken: params.refreshToken,
      });
      window.history.replaceState({}, document.title, "/");
    }
  }, []);

  if (!hasTokens) {
    return <Login />;
  }

  if (wsKilledByServer) {
    return (
      <CenterLayout>
        <Wrapper>
          <div
            style={{ fontSize: "calc(var(--vscode-font-size)*1.2)" }}
            className={tw`mb-4 mt-8`}
          >
            Websocket was killed by the server. This usually happens when you
            open the website in another tab.
          </div>
          <Button
            onClick={() => {
              createWebSocket();
            }}
          >
            reconnect
          </Button>
        </Wrapper>
      </CenterLayout>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <KeybindListener />
    </QueryClientProvider>
  );
};
