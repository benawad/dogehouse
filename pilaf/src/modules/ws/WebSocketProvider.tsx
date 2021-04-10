import { raw } from "@dogehouse/kebab";
import React, { useEffect, useMemo, useState } from "react";
import { useTokenStore } from "../auth/useTokenStore";

interface WebSocketProviderProps {
  shouldConnect: boolean;
}

type V = raw.Connection | null;

export const WebSocketContext = React.createContext<{ conn: V }>({
  conn: null,
});

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({
  shouldConnect,
  children,
}) => {
  const hasTokens = useTokenStore((s) => s.accessToken && s.refreshToken);
  const [conn, setConn] = useState<V>(null);

  useEffect(() => {
    if (!conn && shouldConnect && hasTokens) {
      const { accessToken, refreshToken } = useTokenStore.getState();
      raw
        .connect(accessToken, refreshToken, {
          url: "wss://api.dogehouse.tv/socket",
          // url: apiBaseUrl.replace("http", "ws") + "/socket",
        })
        .then((x) => {
          setConn(x);
        })
        .catch((err) => console.log(err));
    }
  }, [conn, shouldConnect, hasTokens]);

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
    <WebSocketContext.Provider value={useMemo(() => ({ conn }), [conn])}>
      {children}
    </WebSocketContext.Provider>
  );
};
