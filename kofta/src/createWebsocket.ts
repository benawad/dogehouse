import ReconnectingWebSocket from "reconnecting-websocket";
import { useTokenStore } from "./vscode-webview/utils/useTokenStore";
import { showErrorToast } from "./vscode-webview/utils/showErrorToast";
import { apiBaseUrl } from "./vscode-webview/constants";
import { useSocketStatus } from "./webrtc/stores/useSocketStatus";
import { useWsHandlerStore } from "./webrtc/stores/useWsHandlerStore";
import { useVoiceStore } from "./webrtc/stores/useVoiceStore";
import { useMuteStore } from "./webrtc/stores/useMuteStore";
import { uuidv4 } from "./webrtc/utils/uuidv4";
import { WsParam } from "./vscode-webview/types";

let ws: ReconnectingWebSocket | null;
let authGood = false;
let lastMsg = "";

export const closeWebSocket = () => {
  ws?.close();
};

export const createWebSocket = () => {
  console.log("createWebSocket ");
  if (ws) {
    console.log("ws already connected");
    return;
  } else {
    console.log("new ws instance incoming");
  }

  useSocketStatus.getState().setStatus("connecting");

  ws = new ReconnectingWebSocket(apiBaseUrl.replace("http", "ws") + "/socket");
  const { accessToken, refreshToken } = useTokenStore.getState();

  ws.addEventListener("close", ({ code, reason }) => {
    const { setStatus } = useSocketStatus.getState();
    authGood = false;
    if (code === 4001) {
      console.log("clearing tokens");
      useTokenStore.getState().setTokens({ accessToken: "", refreshToken: "" });
      ws?.close();
      ws = null;
      setStatus("closed");
    } else if (code === 4003) {
      ws?.close();
      ws = null;
      setStatus("closed-by-server");
    } else if (code === 4004) {
      ws?.close();
      ws = null;
    } else {
      // @todo do more of a status bar thing
      setStatus("closed");
    }
    console.log("ws closed", code, reason);
  });
  ws.addEventListener("open", () => {
    useSocketStatus.getState().setStatus("open");
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

    ws?.send(
      JSON.stringify({
        op: "auth",
        d: {
          accessToken,
          refreshToken,
          reconnectToVoice,
          muted: useMuteStore.getState().muted,
          platform: "web",
        },
      })
    );
    // @todo do more of a status bar thing
    // toast("connected", { type: "success" });
    console.log("ws opened");
    const id = setInterval(() => {
      if (ws && ws.readyState !== ws.CLOSED) {
        ws.send("ping");
      } else {
        clearInterval(id);
      }
    }, 8000);
  });

  ws.addEventListener("message", (e) => {
    // console.log(e.data);
    const json = JSON.parse(e.data as string);

    if (e.data === '"pong"') {
      return;
    }

    switch (json.op) {
      case "new-tokens": {
        useTokenStore.getState().setTokens({
          accessToken: json.d.accessToken,
          refreshToken: json.d.refreshToken,
        });
        break;
      }
      case "error": {
        showErrorToast(json.d);
        break;
      }
      default: {
        const { handlerMap, fetchResolveMap } = useWsHandlerStore.getState();
        if (json.op === "auth-good") {
          if (lastMsg) {
            ws?.send(lastMsg);
            lastMsg = "";
          }
          authGood = true;
        }
        // console.log("ws: ", json.op);
        if (json.op in handlerMap) {
          handlerMap[json.op](json.d);
        } else if (
          json.op === "fetch_done" &&
          json.fetchId &&
          json.fetchId in fetchResolveMap
        ) {
          fetchResolveMap[json.fetchId](json.d);
        }
        break;
      }
    }
  });
};

export const wsend = (d: { op: string; d: any }) => {
  if (!authGood || !ws || ws.readyState !== ws.OPEN) {
    console.log("ws not ready");
    lastMsg = JSON.stringify(d);
  } else {
    ws?.send(JSON.stringify(d));
  }
};

export const wsFetch = (d: WsParam) => {
  return new Promise((res, rej) => {
    if (!authGood || !ws || ws.readyState !== ws.OPEN) {
      rej(new Error("can't connect to server"));
    } else {
      const fetchId = uuidv4();
      setTimeout(() => {
        useWsHandlerStore.getState().clearFetchListener(fetchId);
        rej(new Error("request timed out"));
      }, 10000); // 10 secs
      useWsHandlerStore.getState().addFetchListener(fetchId, (d) => {
        res(d);
      });
      ws?.send(JSON.stringify({ ...d, fetchId }));
    }
  });
};
