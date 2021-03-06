import { useAtom } from "jotai";
import React, { useLayoutEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import { createWebSocket, wsend } from "../createWebsocket";
import { useCurrentRoomStore } from "../webrtc/stores/useCurrentRoomStore";
import { useSocketStatus } from "../webrtc/stores/useSocketStatus";
import { useVoiceStore } from "../webrtc/stores/useVoiceStore";
import { useWsHandlerStore } from "../webrtc/stores/useWsHandlerStore";
import { WebRtcApp } from "../webrtc/WebRtcApp";
import { setMeAtom } from "./atoms";
import { CenterLayout } from "./components/CenterLayout";
import { DeviceNotSupported } from "./components/DeviceNotSupported";
import { MicPermissionBanner } from "./components/MicPermissionBanner";
import { WsKilledMessage } from "./components/WsKilledMessage";
import { RoomChat } from "./modules/room-chat/RoomChat";
import { Login } from "./pages/Login";
import { Routes } from "./Routes";
import { roomToCurrentRoom } from "./utils/roomToCurrentRoom";
import { useSaveTokensFromQueryParams } from "./utils/useSaveTokensFromQueryParams";
import { useTokenStore } from "./utils/useTokenStore";

interface AppProps {}

export const App: React.FC<AppProps> = () => {
	const isDeviceSupported = useVoiceStore((s) => !!s.device);
	const hasTokens = useTokenStore((s) => !!s.accessToken && !!s.refreshToken);
	const wsKilledByServer = useSocketStatus(
		(s) => s.status === "closed-by-server"
	);
	const [, setMe] = useAtom(setMeAtom);
	const setCurrentRoom = useCurrentRoomStore((x) => x.setCurrentRoom);
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

	useSaveTokensFromQueryParams();

	if (!hasTokens) {
		return <Login />;
	}

	if (!isDeviceSupported) {
		return <DeviceNotSupported />;
	}

	if (wsKilledByServer) {
		return <WsKilledMessage />;
	}

	return (
		<BrowserRouter>
			<WebRtcApp />
			<div className={`mx-auto max-w-5xl w-full h-full flex relative`}>
				<CenterLayout>
					<Routes />
					<MicPermissionBanner />
				</CenterLayout>
				<RoomChat sidebar />
			</div>
		</BrowserRouter>
	);
};
