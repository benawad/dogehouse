import { raw } from "@dogehouse/kebab";
import { useCurrentRoomIdStore } from "../global-stores/useCurrentRoomIdStore";
import { useTokenStore } from "../modules/auth/useTokenStore";
import { closeVoiceConnections } from "../modules/webrtc/closeVoiceConnections";

export const disconnectWebRTC = (roomId: string | null = null) => {
  closeVoiceConnections(roomId);
};

export const disconnectEverything = (conn: raw.Connection) => {
  conn.close();
  useCurrentRoomIdStore.getState().setCurrentRoomId(null);
  useTokenStore.getState().setTokens({ accessToken: "", refreshToken: "" });
  disconnectWebRTC();
};
