import React, { useState } from "react";
import ReactModal from "react-modal";
import { tw } from "twind";
import { wsend } from "../../createWebsocket";
import { Button } from "./Button";

interface CreateRoomModalProps {
  onRequestClose: () => void;
}

const customStyles = {
  overlay: {
    backgroundColor: "rgba(0,0,0,.5)",
  },
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#262626",
    border: "none",
    width: "100%",
    maxWidth: 500,
  },
};

export const CreateRoomModal: React.FC<CreateRoomModalProps> = ({
  onRequestClose,
}) => {
  const [name, setName] = useState("");
  const [privacy, setPrivacy] = useState("public");
  return (
    <ReactModal style={customStyles} isOpen onRequestClose={onRequestClose}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (name) {
            wsend({
              op: "create-room",
              d: { roomName: name, value: privacy },
            });
          }
        }}
      >
        <h3 className={tw`text-2xl mb-10`}>Room name:</h3>
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div className={tw`flex mt-8`}>
          <div className={tw`mr-4`}>privacy: </div>
          <select value={privacy} onChange={(e) => setPrivacy(e.target.value)}>
            <option value="public">public</option>
            <option value="private">private</option>
          </select>
        </div>
        <div className={tw`flex mt-8`}>
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
    </ReactModal>
  );
};
