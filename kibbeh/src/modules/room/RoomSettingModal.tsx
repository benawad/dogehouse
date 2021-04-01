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
        <div className={`flex-col w-full`}>
          <label className={`flex items-center my-8`} htmlFor="auto-speaker">
            <input
              checked={!data.autoSpeaker}
              onChange={(e) => {
                const autoSpeaker = !e.target.checked;
                updater(["joinRoomAndGetInfo", roomId!], (d) =>
                  !d ? d : { ...d, autoSpeaker }
                );
                conn.mutation.setAutoSpeaker(autoSpeaker);
              }}
              id="auto-speaker"
              type="checkbox"
            />
            <span className={`ml-2 text-primary-100`}>
              {t("components.modals.roomSettingsModal.requirePermission")}
            </span>
          </label>
          <BlockedFromRoomUsers />
        </div>
      )}
    </Modal>
  );
};
