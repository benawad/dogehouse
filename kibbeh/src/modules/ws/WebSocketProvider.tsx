import React, { useEffect, useMemo, useRef, useState } from "react";
import { BaseUser, raw, User } from "@dogehouse/kebab";
import { useTokenStore } from "../auth/useTokenStore";
import { apiBaseUrl } from "../../lib/constants";
import { useRouter } from "next/router";
import { showErrorToast } from "../../lib/showErrorToast";
import { useMuteStore } from "../../global-stores/useMuteStore";
import { useCurrentRoomIdStore } from "../../global-stores/useCurrentRoomIdStore";
import { useVoiceStore } from "../webrtc/stores/useVoiceStore";

interface WebSocketProviderProps {
  shouldConnect: boolean;
}

type V = raw.Connection | null;

export const WebSocketContext = React.createContext<{
  conn: V;
  setUser: (u: User) => void;
}>({
  conn: null,
  setUser: () => {},
});

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({
  shouldConnect,
  children,
}) => {
  const hasTokens = useTokenStore((s) => s.accessToken && s.refreshToken);
  const [conn, setConn] = useState<V>(null);
  const { replace } = useRouter();
  const isConnecting = useRef(false);

  useEffect(() => {
    if (!conn && shouldConnect && hasTokens && !isConnecting.current) {
      raw
        .connect("", "", {
          url: apiBaseUrl.replace("http", "ws") + "/socket",
          getAuthOptions: () => {
            const { accessToken, refreshToken } = useTokenStore.getState();
            isConnecting.current = true;
            const { recvTransport, sendTransport } = useVoiceStore.getState();

            const reconnectToVoice = !recvTransport
              ? true
              : recvTransport.connectionState !== "connected" &&
                sendTransport?.connectionState !== "connected";

            console.log({
              reconnectToVoice,
              recvState: recvTransport?.connectionState,
              sendState: sendTransport?.connectionState,
            });

            return {
              accessToken,
              refreshToken,
              reconnectToVoice,
              currentRoomId: useCurrentRoomIdStore.getState().currentRoomId,
              muted: useMuteStore.getState().muted,
            };
          },
          onConnectionTaken: () => {
            replace("/");
            // @todo do something better
            showErrorToast(
              "You can only have 1 tab of DogeHouse open at a time"
            );
            setConn(null);
          },
          onClearTokens: () => {
            console.log("clearing tokens...");
            replace("/");
            useTokenStore
              .getState()
              .setTokens({ accessToken: "", refreshToken: "" });
            setConn(null);
          },
        })
        .then((x) => setConn(x))
        .catch((err) => {
          if (err.code === 4001) {
            replace(`/?next=${window.location.pathname}`);
          }
        })
        .finally(() => {
          isConnecting.current = false;
        });
    }
  }, [conn, shouldConnect, hasTokens, replace]);

  useEffect(() => {
    if (!conn) {
      return;
    }

    return conn.addListener<{
      refreshToken: string;
      accessToken: string;
    }>("new-tokens", ({ refreshToken, accessToken }) => {
      useTokenStore.getState().setTokens({
        accessToken,
        refreshToken,
      });
    });
  }, [conn]);

  return (
    <WebSocketContext.Provider
      value={useMemo(
        () => ({
          conn,
          setUser: (u: User) => {
            if (conn) {
              setConn({
                ...conn,
                user: u,
              });
            }
          },
        }),
        [conn]
      )}
    >
      {children}
    </WebSocketContext.Provider>
  );
};
