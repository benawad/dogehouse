import { wsend } from "../../createWebsocket";
import { modalPrompt } from "../../app/components/PromptModal";

export const renameRoomAndMakePublic = (currentName: string) => {
  modalPrompt(
    "Set public room name",
    (roomName) => {
      if (roomName) {
        wsend({ op: "make_room_public", d: { newName: roomName } });
      }
    },
    currentName
  );
};
