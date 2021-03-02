import React, { useState } from "react";
import { wsend } from "../../createWebsocket";
import { Button } from "./Button";
import { Input } from "./Input";
import { Modal } from "./Modal";
import { useTranslation } from 'react-i18next';

interface CreateRoomModalProps {
  onRequestClose: () => void;
}

export const CreateRoomModal: React.FC<CreateRoomModalProps> = ({
  onRequestClose,
}) => {
  const [name, setName] = useState("");
  const [privacy, setPrivacy] = useState("public");
  const { t } = useTranslation();
  return (
    <Modal isOpen onRequestClose={onRequestClose}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (name) {
            onRequestClose();
            wsend({
              op: "create-room",
              d: { roomName: name, value: privacy },
            });
          }
        }}
      >
        <Input
          maxLength={255}
          placeholder="room name"
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div className={`flex mt-8 items-center`}>
          <select
            className={`border border-simple-gray-3c`}
            value={privacy}
            onChange={(e) => setPrivacy(e.target.value)}
          >
            <option value="public" className={`bg-simple-gray-3c`}>
              {t("components.modals.createRoomModal.public")}
            </option>
            <option value="private" className={`bg-simple-gray-3c`}>
              {t("components.modals.createRoomModal.private")}
            </option>
          </select>
        </div>
        <div className={`flex mt-12`}>
          <Button
            type="button"
            onClick={onRequestClose}
            className={`mr-1.5`}
            color="secondary"
          >
            {t("common.cancel")}
          </Button>
          <Button type="submit" className={`ml-1.5`}>
            {t("common.ok")}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
