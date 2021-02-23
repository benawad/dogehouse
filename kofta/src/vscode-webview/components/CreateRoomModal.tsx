import React, { useState } from "react";
<<<<<<< HEAD
import { wsend } from "../../createWebsocket";
=======
import { tw } from "twind";
import { wsend } from "@dogehouse/feta/createWebsocket";
>>>>>>> 76e5e6ddabfa381984235042bbfd5056e7372c0d
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
          maxLength={255}
          placeholder="room name"
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div className={`flex mt-8 items-center`}>
          <select className={`border border-simple-gray-3c`} value={privacy} onChange={(e) => setPrivacy(e.target.value)}>
            <option
              value="public"
              className={`bg-simple-gray-3c`}
            >
              public
            </option>
            <option
              value="private"
              className={`bg-simple-gray-3c`}
            >
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
