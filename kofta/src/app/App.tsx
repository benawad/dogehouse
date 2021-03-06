import React, { useLayoutEffect, useState } from "react";
import { useQuery } from "react-query";
import { BrowserRouter } from "react-router-dom";
import {
	auth_query,
	createWebSocket,
	wsAuthFetch,
	wsend,
} from "../createWebsocket";
import { useCurrentRoomStore } from "../webrtc/stores/useCurrentRoomStore";
import { useMuteStore } from "../webrtc/stores/useMuteStore";
import { useSocketStatus } from "../webrtc/stores/useSocketStatus";
import { useVoiceStore } from "../webrtc/stores/useVoiceStore";
import { WebRtcApp } from "../webrtc/WebRtcApp";
import { CenterLayout } from "./components/CenterLayout";
import { DeviceNotSupported } from "./components/DeviceNotSupported";
import { MicPermissionBanner } from "./components/MicPermissionBanner";
import { PageWrapper } from "./components/PageWrapper";
import { WsKilledMessage } from "./components/WsKilledMessage";
import { RoomChat } from "./modules/room-chat/RoomChat";
import { Routes } from "./Routes";
import { roomToCurrentRoom } from "./utils/roomToCurrentRoom";
import { useSaveTokensFromQueryParams } from "./utils/useSaveTokensFromQueryParams";
import { useTokenStore } from "./utils/useTokenStore";

interface AppProps {}

export const App: React.FC<AppProps> = () => {
	const isDeviceSupported = useVoiceStore((s) => !!s.device);
	const hasTokens = useTokenStore((s) => !!s.accessToken && !!s.refreshToken);
	const authIsGood = useSocketStatus((s) => s.status === "auth-good");
	const wsKilledByServer = useSocketStatus(
		(s) => s.status === "closed-by-server"
	);

	useState(() => (hasTokens ? createWebSocket() : null));
	useLayoutEffect(() => {
		if (hasTokens) {
			createWebSocket();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [hasTokens]);

	const { isLoading } = useQuery<any>(
		auth_query,
		() => {
			const { accessToken, refreshToken } = useTokenStore.getState();
			// I think this will probably only run in dev
			console.log(
				"AUTH_QUERY RUNNING, I HOPE YOU ARE NOT IN PROD LOL (nothing bad happens if you are, probably)"
			);
			return wsAuthFetch({
				op: auth_query,
				d: {
					accessToken,
					refreshToken,
					reconnectToVoice: false,
					currentRoomId: useCurrentRoomStore.getState().currentRoom?.id,
					muted: useMuteStore.getState().muted,
					platform: "web",
				},
			});
		},
		{
			onSuccess: (d) => {
				if (d?.currentRoom) {
					useCurrentRoomStore
						.getState()
						.setCurrentRoom(() => roomToCurrentRoom(d.currentRoom));
					wsend({ op: "get_current_room_users", d: {} });
				}
			},
			enabled: hasTokens && authIsGood,
			staleTime: Infinity,
		}
	);

	useSaveTokensFromQueryParams();

	if (isLoading) {
		return null;
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
			<PageWrapper>
				<CenterLayout>
					<Routes />
					<MicPermissionBanner />
				</CenterLayout>
				<RoomChat sidebar />
			</PageWrapper>
		</BrowserRouter>
	);
};
