import React from "react";
import { useWrappedConn } from "../../shared-hooks/useConn";
import { useTypeSafeQuery } from "../../shared-hooks/useTypeSafeQuery";
import { useTypeSafeTranslation } from "../../shared-hooks/useTypeSafeTranslation";
import { useTypeSafeUpdateQuery } from "../../shared-hooks/useTypeSafeUpdateQuery";
import { InfoText } from "../../ui/InfoText";
import { Modal } from "../../ui/Modal";
import { BlockedFromRoomUsers } from "./BlockedFromRoomUsers";

interface RoomSettingsModalProps {
  onRequestClose: () => void;
  roomId: string;
}

export const RoomSettingsModal: React.FC<RoomSettingsModalProps> = ({
  onRequestClose,
  roomId,
}) => {
  const conn = useWrappedConn();
  const { data } = useTypeSafeQuery(
    ["joinRoomAndGetInfo", roomId],
    {
      enabled: !!roomId,
      refetchOnMount: "always",
    },
    [roomId]
  );
  const updater = useTypeSafeUpdateQuery();
  const { t } = useTypeSafeTranslation();
  return (
    <Modal isOpen={!!roomId} onRequestClose={onRequestClose}>
      {!data || "error" in data ? (
        <InfoText>something went wrong</InfoText>
      ) : (
        <div className={`flex flex-col w-full`}>
          {/* require ask to speak */}
          <label className={`flex items-center my-1`} htmlFor="auto-speaker">
            <input
              checked={!data.autoSpeaker}
              onChange={(e) => {
                const autoSpeaker = !e.target.checked;
                updater(["joinRoomAndGetInfo", roomId!], (d) =>
                  !d ? d : { ...d, autoSpeaker }
                );
                conn.mutation.roomUpdate({ autoSpeaker });
              }}
              id="auto-speaker"
              type="checkbox"
            />
            <span className={`ml-2 text-primary-100`}>
              {t("components.modals.roomSettingsModal.requirePermission")}
            </span>
          </label>

          <label className={`flex items-center my-1`} htmlFor="chat-cooldown">
            <input
              defaultValue={data.room.chatCooldown}
              className={`rounded-8 bg-primary-700 h-6`}
              onChange={(e) => {
                const chatCooldown = Number(e.target.value);
                if (chatCooldown > 1) {
                  updater(["joinRoomAndGetInfo", roomId!], (d) =>
                    !d ? d : { ...d, chatCooldown }
                  );
                  conn.mutation.roomUpdate({ chatCooldown });
                } else {
                  e.target.value = "1";
                }
              }}
              id="chat-cooldown"
              type="number"
            />
            <span className={`ml-2 text-primary-100`}>
              Chat Cooldown (seconds)
            </span>
          </label>

          {/* chat disabled */}
          <label className={`flex items-center my-1`} htmlFor="chat-disabled">
            <input
              checked={data.chatMode === "disabled"}
              onChange={(e) => {
                const chatMode = e.target.checked ? "disabled" : "default";
                updater(["joinRoomAndGetInfo", roomId!], (d) =>
                  !d ? d : { ...d, chatMode }
                );
                conn.mutation.roomUpdate({ chatMode });
              }}
              id="chat-disabled"
              type="checkbox"
            />
            <span className={`ml-2 text-primary-100`}>
              {t("components.modals.roomSettingsModal.chatDisabled")}
            </span>
          </label>
          <BlockedFromRoomUsers />
        </div>
      )}
    </Modal>
  );
};
