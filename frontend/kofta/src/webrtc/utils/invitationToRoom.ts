import { wsend } from "../../createWebsocket";
import { History } from "history";
import { modalConfirm } from "../../vscode-webview/components/ConfirmModal";

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
  modalConfirm(
    `${displayName} invited you to a room, would you like to join?`, () => {
    wsend({ op: "join_room", d: { roomId } });
    history.push("/room/" + roomId);
    }
  );
};
