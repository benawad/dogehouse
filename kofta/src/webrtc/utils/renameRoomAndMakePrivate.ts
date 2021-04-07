import { wsend } from "../../createWebsocket";
import { modalPrompt } from "../../app/components/PromptModal";

export const renameRoomAndMakePrivate = (currentName: string, t) => {
  modalPrompt(
    t("components.modals.roomSettingsModal.renamePrivate"),
    (roomName) => {
      if (roomName) {
        wsend({ op: "make_room_private", d: { newName: roomName } });
      }
    },
    currentName
  );
};
