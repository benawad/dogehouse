import React, { useState } from "react";
import { tw } from "twind";
import { wsend } from "../../createWebsocket";
import { Button } from "./Button";
import { Input } from "./Input";
import { Modal } from "./Modal";

interface CreateRoomModalProps {
  onRequestClose: () => void;
}

export const CreateRoomModal: React.FC<CreateRoomModalProps> = ({
  onRequestClose,
}) => {
  const [name, setName] = useState("");
  const [privacy, setPrivacy] = useState("public");
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
          placeholder="room name"
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div className={tw`flex mt-8 items-center`}>
          <select value={privacy} onChange={(e) => setPrivacy(e.target.value)}>
            <option
              style={{ background: "var(--vscode-dropdown-background)" }}
              value="public"
            >
              public
            </option>
            <option
              style={{ background: "var(--vscode-dropdown-background)" }}
              value="private"
            >
              private
            </option>
          </select>
        </div>
        <div className={tw`flex mt-12`}>
          <Button
            type="button"
            onClick={onRequestClose}
            style={{ marginRight: 8 }}
            color="secondary"
          >
            cancel
          </Button>
          <Button type="submit" style={{ marginLeft: 8 }}>
            ok
          </Button>
        </div>
      </form>
    </Modal>
  );
};
