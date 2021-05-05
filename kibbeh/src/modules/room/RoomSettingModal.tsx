import { ChatMode } from "@dogehouse/kebab";
import React from "react";
import { useWrappedConn } from "../../shared-hooks/useConn";
import { useCurrentRoomFromCache } from "../../shared-hooks/useCurrentRoomFromCache";
import { useTypeSafeTranslation } from "../../shared-hooks/useTypeSafeTranslation";
import { useTypeSafeUpdateQuery } from "../../shared-hooks/useTypeSafeUpdateQuery";
import { InfoText } from "../../ui/InfoText";
import { Modal } from "../../ui/Modal";
import { NativeSelect } from "../../ui/NativeSelect";
import { BlockedFromRoomUsers } from "./BlockedFromRoomUsers";

interface RoomSettingsModalProps {
  open: boolean;
  onRequestClose: () => void;
}

const options = [
  { label: "enabled", value: "default" },
  { label: "disabled", value: "disabled" },
  { label: "follower only", value: "follower_only" },
];

export const RoomSettingsModal: React.FC<RoomSettingsModalProps> = ({
  open,
  onRequestClose,
}) => {
  const conn = useWrappedConn();
  const data = useCurrentRoomFromCache();
  const updater = useTypeSafeUpdateQuery();
  const { t } = useTypeSafeTranslation();

  return (
    <Modal isOpen={open} onRequestClose={onRequestClose}>
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
                updater(["joinRoomAndGetInfo", data.room.id], (d) =>
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

          {/* chat disabled */}
          <label className={`mt-2`} htmlFor="chat-mode">
            <div className={`text-primary-100 mb-1`}>Chat</div>
            <NativeSelect
              value={data.room.chatMode}
              onChange={(e) => {
                const chatMode = e.target.value as ChatMode;
                updater(["joinRoomAndGetInfo", data.room.id], (d) => {
                  return !d || "error" in d
                    ? d
                    : { ...d, room: { ...d.room, chatMode } };
                });
                conn.mutation.roomUpdate({ chatMode });
              }}
              id="chat-mode"
            >
              {options.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}&nbsp;&nbsp;&nbsp;
                </option>
              ))}
            </NativeSelect>
          </label>
          <BlockedFromRoomUsers />
        </div>
      )}
    </Modal>
  );
};
