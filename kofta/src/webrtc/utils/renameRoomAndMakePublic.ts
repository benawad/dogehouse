import { wsend } from "../../createWebsocket";
import { modalPrompt } from "../../app/components/PromptModal";

export const renameRoomAndMakePublic = (currentName: string, t) => {
  console.log(t("components.modals.roomSettingsModal.renamePublic"));
  modalPrompt(
    t("components.modals.roomSettingsModal.renamePublic"),
    (roomName) => {
      if (roomName) {
        wsend({ op: "make_room_public", d: { newName: roomName } });
      }
    },
    currentName
  );
};
