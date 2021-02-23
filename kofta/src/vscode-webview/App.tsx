import { useAtom } from "jotai";
import queryString from "query-string";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { QueryClientProvider } from "react-query";
import { createWebSocket, wsend } from "../createWebsocket";
import { useSocketStatus } from "../webrtc/stores/useSocketStatus";
import { useVoiceStore } from "../webrtc/stores/useVoiceStore";
import { useWsHandlerStore } from "../webrtc/stores/useWsHandlerStore";
import { setCurrentRoomAtom, setMeAtom } from "./atoms";
import { Button } from "./components/Button";
import { CenterLayout } from "./components/CenterLayout";
import { KeybindListener } from "./components/KeybindListener";
import { RegularAnchor } from "./components/RegularAnchor";
import { Wrapper } from "./components/Wrapper";
import { Login } from "./pages/Login";
import { queryClient } from "./queryClient";
import { Router } from "./Router";
import { roomToCurrentRoom } from "./utils/roomToCurrentRoom";
import { useTokenStore } from "./utils/useTokenStore";
import { NotificationAudioRender } from "./modules/room-chat/NotificationAudioRender";

interface AppProps {}

export const WebviewApp: React.FC<AppProps> = () => {
  const isDeviceSupported = useVoiceStore((s) => !!s.device);
  const hasTokens = useTokenStore((s) => !!s.accessToken && !!s.refreshToken);
  const wsKilledByServer = useSocketStatus(
    (s) => s.status === "closed-by-server"
  );
  const [, setMe] = useAtom(setMeAtom);
  const [, setCurrentRoom] = useAtom(setCurrentRoomAtom);
  useState(() => {
    useWsHandlerStore.getState().addWsListener("auth-good", (d) => {
      setMe(d.user);
      if (d.currentRoom) {
        setCurrentRoom(() => roomToCurrentRoom(d.currentRoom));
        wsend({ op: "get_current_room_users", d: {} });
      }
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

  if (!isDeviceSupported) {
    return (
      <CenterLayout>
        <Wrapper>
          <div className={`mb-4 mt-8 text-xl`}>
            Your device is currently not supported. You can create an{" "}
            <RegularAnchor href="https://github.com/benawad/dogehouse/issues">
              issue on GitHub
            </RegularAnchor>{" "}
            and I will try adding support for your device.
          </div>
        </Wrapper>
      </CenterLayout>
    );
  }

  if (wsKilledByServer) {
    return (
      <CenterLayout>
        <Wrapper>
          <div className={`mb-4 mt-8 text-xl`}>
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
      <NotificationAudioRender />
      <Router />
      <KeybindListener />
    </QueryClientProvider>
  );
};
