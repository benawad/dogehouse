import { useAtom } from "jotai";
import queryString from "query-string";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { setup, tw } from "twind";
import { createWebSocket } from "../createWebsocket";
import { useSocketStatus } from "../webrtc/stores/useSocketStatus";
import { useWsHandlerStore } from "../webrtc/stores/useWsHandlerStore";
import { setMeAtom } from "./atoms";
import { Button } from "./components/Button";
import { CenterLayout } from "./components/CenterLayout";
import { KeybindListener } from "./components/KeybindListener";
import { Wrapper } from "./components/Wrapper";
import { apiBaseUrl } from "./constants";
import { Login } from "./pages/Login";
import { Router } from "./Router";
import { showErrorToast } from "./utils/showErrorToast";
import { useTokenStore } from "./utils/useTokenStore";

setup({
  theme: {
    fontFamily: {
      sans: ["var(--vscode-font-family)"],
      serif: ["var(--vscode-font-family)"],
    },
    borderColor: {
      tmpBo1: "#CCCCCC",
    },
    textColor: {
      tmpC1: "#A6A6A6",
      tmpC2: "#333333",
      tmpC3: "#FEFEFE",
      tmpC4: "#0B78E3",
      input: "var(--vscode-input-foreground)",
    },
    backgroundColor: {
      tmpBg1: "#262626",
      tmpBg2: "#333333",
      tmpBg3: "#666666",
      tmpBg4: "#595959",
      input: "var(--vscode-input-background)",
      buttonHover: "var(--vscode-button-hoverBackground)",
      button: "var(--vscode-button-background)",
      buttonHoverRed: "var(--vscode-errorForeground)",
      buttonRed: "var(--vscode-inputValidation-errorBorder)",
      buttonHoverSecondary: "var(--vscode-button-secondaryHoverBackground)",
      buttonSecondary: "var(--vscode-button-secondaryBackground)",
    },
  },
});

const defaultQueryFn = async ({ queryKey }: { queryKey: string }) => {
  const { accessToken, refreshToken } = useTokenStore.getState();
  const r = await fetch(`${apiBaseUrl}${queryKey[0]}`, {
    headers: {
      "X-Access-Token": accessToken,
      "X-Refresh-Token": refreshToken,
    },
  });
  if (r.status !== 200) {
    throw new Error(await r.text());
  }
  const _accessToken = r.headers.get("access-token");
  const _refreshToken = r.headers.get("refresh-token");
  if (_accessToken && _refreshToken) {
    useTokenStore.getState().setTokens({
      accessToken: _accessToken,
      refreshToken: _refreshToken,
    });
  }
  return await r.json();
};

const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      onError: e => {
        if ("message" in (e as Error)) {
          showErrorToast((e as Error).message);
        }
      },
    },
    queries: {
      retry: false,
      staleTime: 60 * 1000 * 5,
      onError: e => {
        if ("message" in (e as Error)) {
          showErrorToast((e as Error).message);
        }
      },
      queryFn: defaultQueryFn,
    },
  },
});

interface AppProps {}

export const WebviewApp: React.FC<AppProps> = () => {
  const hasTokens = useTokenStore(s => !!s.accessToken && !!s.refreshToken);
  const wsKilledByServer = useSocketStatus(
    s => s.status === "closed-by-server",
  );
  const [, setMe] = useAtom(setMeAtom);
  useState(() => {
    useWsHandlerStore.getState().addWsListener("auth-good", d => {
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
