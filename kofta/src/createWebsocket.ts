import ReconnectingWebSocket from "reconnecting-websocket";
import { useTokenStore } from "./app/utils/useTokenStore";
import { showErrorToast } from "./app/utils/showErrorToast";
import { apiBaseUrl } from "./app/constants";
import { useSocketStatus } from "./webrtc/stores/useSocketStatus";
import { useWsHandlerStore } from "./webrtc/stores/useWsHandlerStore";
import { useVoiceStore } from "./webrtc/stores/useVoiceStore";
import { useMuteStore } from "./webrtc/stores/useMuteStore";
import { uuidv4 } from "./webrtc/utils/uuidv4";
import { WsParam } from "./app/types";
import { useCurrentRoomStore } from "./webrtc/stores/useCurrentRoomStore";
import { toast } from "react-toastify";
import { queryClient } from "./app/queryClient";

let ws: ReconnectingWebSocket | null;
let authGood = false;
let lastMsg = "";

export const auth_query = "auth";

window.addEventListener("online", () => {
	if (ws && ws.readyState === ws.CLOSED) {
		toast("reconnecting...", { type: "info" });
		console.log("online triggered, calling ws.reconnect()");
		ws.reconnect();
	}
});

export const closeWebSocket = () => {
	ws?.close();
};

export const createWebSocket = (force?: boolean) => {
	console.log("createWebSocket ");
	if (!force && ws) {
		console.log("ws already connected");
		return;
	} else {
		console.log("new ws instance incoming");
	}
	const { accessToken, refreshToken } = useTokenStore.getState();

	if (!accessToken || !refreshToken) {
		return;
	}

	useSocketStatus.getState().setStatus("connecting");

	ws = new ReconnectingWebSocket(
		apiBaseUrl.replace("http", "ws") + "/socket",
		undefined,
		{ connectionTimeout: 15000 }
	);

	ws.addEventListener("close", ({ code, reason }) => {
		const { setStatus } = useSocketStatus.getState();
		authGood = false;
		if (code === 4001) {
			console.log("clearing tokens");
			useWsHandlerStore.getState().authHandler?.(null);
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

		queryClient.prefetchQuery(
			auth_query,
			() =>
				wsAuthFetch({
					op: auth_query,
					d: {
						accessToken,
						refreshToken,
						reconnectToVoice,
						currentRoomId: useCurrentRoomStore.getState().currentRoom?.id,
						muted: useMuteStore.getState().muted,
						platform: "web",
					},
				}),
			{ staleTime: 0 }
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
				const {
					handlerMap,
					fetchResolveMap,
					authHandler,
				} = useWsHandlerStore.getState();
				if (json.op === "auth-good") {
					if (lastMsg) {
						ws?.send(lastMsg);
						lastMsg = "";
					}
					authGood = true;
					useSocketStatus.getState().setStatus("auth-good");
					if (authHandler) {
						authHandler(json.d);
					} else {
						console.error("something went wrong, authHandler is null");
					}
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

export const wsAuthFetch = <T>(d: WsParam) => {
	return new Promise<T>((res, rej) => {
		if (!ws || ws.readyState !== ws.OPEN) {
			rej(new Error("can't connect to server"));
		} else {
			setTimeout(() => {
				rej(new Error("request timed out"));
			}, 10000); // 10 secs
			useWsHandlerStore.getState().addAuthHandler((d) => {
				if (d) {
					res(d);
				}
			});
			ws?.send(JSON.stringify(d));
		}
	});
};

export const wsFetch = <T>(d: WsParam) => {
	return new Promise<T>((res, rej) => {
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

export const wsMutation = (d: WsParam) => wsFetch(d);
export const wsMutationThrowError = (d: WsParam) =>
	wsFetch(d).then((x: any) => {
		if (x.error) {
			throw new Error(x.error);
		}

		return x;
	});
