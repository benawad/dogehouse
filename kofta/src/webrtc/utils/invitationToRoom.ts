import { wsend } from "../../createWebsocket";
import { History } from "history";
import { modalConfirm } from "../../vscode-webview/components/ConfirmModal";
import { useSoundEffectStore } from "../../vscode-webview/modules/sound-effects/useSoundEffectStore";

export const invitationToRoom = (
  {
    roomId,
    displayName,
  }: {
    roomId: string;
    displayName: string;
  },
  history: History
) => {
  useSoundEffectStore.getState().playSoundEffect("roomInvite");
  modalConfirm(
    `${displayName} invited you to a room, would you like to join?`,
    () => {
      wsend({ op: "join_room", d: { roomId } });
      history.push("/room/" + roomId);
    }
  );
};
