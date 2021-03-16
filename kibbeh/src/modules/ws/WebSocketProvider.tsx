import React, { useEffect, useMemo, useState } from "react";
import { raw } from "@dogehouse/kebab";
import { useTokenStore } from "../auth/useTokenStore";
import { apiBaseUrl } from "../../lib/constants";

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
          url: apiBaseUrl.replace("http", "ws") + "/socket",
        })
        .then((x) => setConn(x))
        .catch((err) => console.log(err));
    }
  }, [conn, shouldConnect, hasTokens]);

  return (
    <WebSocketContext.Provider value={useMemo(() => ({ conn }), [conn])}>
      {children}
    </WebSocketContext.Provider>
  );
};
