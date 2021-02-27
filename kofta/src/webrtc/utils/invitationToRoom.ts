import { wsend } from "../../createWebsocket";
import { History } from "history";
import { useSoundEffectStore } from "../../vscode-webview/modules/sound-effects/useSoundEffectStore";
import {
  invitedToRoomConfirm,
  UserPreviewInfo,
} from "../../vscode-webview/components/InvitedToJoinRoomModal";

export const invitationToRoom = (
  {
    roomId,
    roomName,
    ...userInfo
  }: {
    roomId: string;
    roomName: string;
  } & UserPreviewInfo,
  history: History
) => {
  useSoundEffectStore.getState().playSoundEffect("roomInvite");
  invitedToRoomConfirm(roomName, userInfo, () => {
    wsend({ op: "join_room", d: { roomId } });
    history.push("/room/" + roomId);
  });
};
