import React, { useEffect, useMemo, useRef, useState } from "react";
import { raw, User } from "@dogehouse/kebab";
import { useTokenStore } from "../auth/useTokenStore";
import { apiBaseUrl } from "../../lib/constants";
import { useRouter } from "next/router";
import { showErrorToast } from "../../lib/showErrorToast";
import { useMuteStore } from "../../global-stores/useMuteStore";
import { useCurrentRoomIdStore } from "../../global-stores/useCurrentRoomIdStore";
import { useVoiceStore } from "../webrtc/stores/useVoiceStore";
import { Connection } from "@dogehouse/kebab/lib/raw";

interface WebSocketProviderProps {
  shouldConnect: boolean;
}

type V = raw.Connection | null;

export const WebSocketContext = React.createContext<{
  conn: V;
  setUser: (u: User) => void;
  setConn: (u: Connection | null) => void;
}>({
  conn: null,
  setUser: () => {},
  setConn: () => {},
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
      isConnecting.current = true;
      raw
        .connect("", "", {
          url: apiBaseUrl.replace("http", "ws") + "/socket",
          getAuthOptions: () => {
            const { accessToken, refreshToken } = useTokenStore.getState();
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
            // the index page nulls the conn
            // if you switch this, make sure to null the conn at the new location
            replace("/");
            // @todo do something better
            showErrorToast(
              "You can only have 1 tab of DogeHouse open at a time"
            );
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
        .then((x) => {
          setConn(x);
          if (x.initialCurrentRoomId) {
            useCurrentRoomIdStore
              .getState()
              // if an id exists already, that means they are trying to join another room
              // just let them join the other room rather than overwriting it
              .setCurrentRoomId((id) => id || x.initialCurrentRoomId!);
          }
        })
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
          setConn,
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
