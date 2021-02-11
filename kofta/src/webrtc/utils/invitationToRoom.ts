import { wsend } from "../../createWebsocket";
import { History } from "history";

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
  const y = window.confirm(
    `${displayName} invited you to a room, would you like to join?`
  );

  if (y) {
    wsend({ op: "join_room", d: { roomId } });
    history.push("/room/" + roomId);
  }
};
