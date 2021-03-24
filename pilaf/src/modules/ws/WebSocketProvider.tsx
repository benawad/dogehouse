import { raw } from "@dogehouse/kebab";
import React, { useEffect, useMemo, useState } from "react";
import { apiBaseUrl } from "../../constants/env";
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
      console.log(accessToken, refreshToken);
      raw
        .connect(accessToken, refreshToken, {
          url: apiBaseUrl.replace("http", "ws") + "/socket",
        })
        .then((x) => {
          setConn(x);
          console.log("-------");
          console.log(x);
        })
        .catch((err) => console.log(err));
      console.log("SHOULD CONNECT");
    }
  }, [conn, shouldConnect, hasTokens]);

  return (
    <WebSocketContext.Provider value={useMemo(() => ({ conn }), [conn])}>
      {children}
    </WebSocketContext.Provider>
  );
};
