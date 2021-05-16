import { ChatMode } from "@dogehouse/kebab";
import React from "react";
import { useWrappedConn } from "../../shared-hooks/useConn";
import { useCurrentRoomFromCache } from "../../shared-hooks/useCurrentRoomFromCache";
import { useTypeSafeTranslation } from "../../shared-hooks/useTypeSafeTranslation";
import { useTypeSafeUpdateQuery } from "../../shared-hooks/useTypeSafeUpdateQuery";
import { InfoText } from "../../ui/InfoText";
import { Input } from "../../ui/Input";
import { Modal } from "../../ui/Modal";
import { NativeSelect } from "../../ui/NativeSelect";
import { BlockedFromRoomUsers } from "./BlockedFromRoomUsers";

interface RoomSettingsModalProps {
  open: boolean;
  onRequestClose: () => void;
}

export const RoomSettingsModal: React.FC<RoomSettingsModalProps> = ({
  open,
  onRequestClose,
}) => {
  const conn = useWrappedConn();
  const data = useCurrentRoomFromCache();
  const updater = useTypeSafeUpdateQuery();
  const { t } = useTypeSafeTranslation();

  const options = [
    {
      label: t("components.modals.roomSettingsModal.chat.enabled"),
      value: "default",
    },
    {
      label: t("components.modals.roomSettingsModal.chat.disabled"),
      value: "disabled",
    },
    {
      label: t("components.modals.roomSettingsModal.chat.followerOnly"),
      value: "follower_only",
    },
  ];

  return (
    <Modal isOpen={open} onRequestClose={onRequestClose}>
      {!data || "error" in data ? (
        <InfoText>something went wrong</InfoText>
      ) : (
        <div className={`flex flex-col w-full`}>
          {/* require ask to speak */}
          <label className={`flex items-center my-1`} htmlFor="auto-speaker">
            <input
              checked={!data.room.autoSpeaker}
              onChange={(e) => {
                const autoSpeaker = !e.target.checked;
                updater(["joinRoomAndGetInfo", data.room.id], (d) =>
                  !d || "error" in d
                    ? d
                    : { ...d, room: { ...d.room, autoSpeaker } }
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

          <label className={`items-center my-1`} htmlFor="chat-cooldown">
            <div className={`text-primary-100 mb-1`}>
              {t("components.modals.roomSettingsModal.chatCooldown")}
            </div>
            <Input
              defaultValue={data.room.chatThrottle}
              className={`rounded-8 bg-primary-700 h-6`}
              onBlur={(e) => {
                const chatThrottle = Number(e.target.value);
                if (chatThrottle >= 0) {
                  updater(["joinRoomAndGetInfo", data.room.id], (d) =>
                    !d ? d : { ...d, chatThrottle }
                  );
                  conn.mutation.roomUpdate({ chatThrottle });
                }
              }}
              onChange={(e) => {
                const chatThrottle = Number(e.target.value);
                if (chatThrottle >= 0) {
                  updater(["joinRoomAndGetInfo", data.room.id], (d) =>
                    !d ? d : { ...d, chatThrottle }
                  );
                }
              }}
              id="chat-cooldown"
              type="number"
            />
          </label>

          {/* chat disabled */}
          <label className={`mt-2`} htmlFor="chat-mode">
            <div className={`text-primary-100 mb-1`}>
              {t("components.modals.roomSettingsModal.chat.label")}
            </div>
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
