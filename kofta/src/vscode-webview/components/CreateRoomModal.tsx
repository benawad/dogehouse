import React, { useState } from "react";
import { wsend } from "../../createWebsocket";
import { Button } from "./Button";
import { Input } from "./Input";
import { Modal } from "./Modal";

interface CreateRoomModalProps {
  onRequestClose: () => void;
  name?: string;
  description?: string;
  isPrivate?: boolean;
  edit?: boolean;
}

export const CreateRoomModal: React.FC<CreateRoomModalProps> = ({
  onRequestClose,
  name: currentName,
  description: currentDescription,
  isPrivate,
  edit,
}) => {
  const [name, setName] = useState(currentName || "");
  const [description, setDescription] = useState(currentDescription || "");
  const [privacy, setPrivacy] = useState(isPrivate ? "private" : "public");

  return (
    <Modal isOpen onRequestClose={onRequestClose}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (name) {
            onRequestClose();
            wsend({
              op: edit ? "edit_room" : "create-room",
              d: { roomName: name, description, value: privacy },
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
        <div className="mt-3">
          <Input
            maxLength={255}
            placeholder="room description"
            autoFocus
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            textarea
          />
        </div>
        <div className={`flex mt-8 items-center`}>
          <select
            className={`border border-simple-gray-3c`}
            value={privacy}
            onChange={(e) => setPrivacy(e.target.value)}
          >
            <option value="public" className={`bg-simple-gray-3c`}>
              public
            </option>
            <option value="private" className={`bg-simple-gray-3c`}>
              private
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
            cancel
          </Button>
          <Button type="submit" className={`ml-1.5`}>
            ok
          </Button>
        </div>
      </form>
    </Modal>
  );
};
