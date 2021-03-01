import React from "react";
import { X } from "react-feather";
import { wsend } from "../../createWebsocket";
import { useCurrentRoomStore } from "../../webrtc/stores/useCurrentRoomStore";
import { renameRoomAndMakePrivate } from "../../webrtc/utils/renameRoomAndMakePrivate";
import { renameRoomAndMakePublic } from "../../webrtc/utils/renameRoomAndMakePublic";
import { BlockedFromRoomUsers } from "./BlockedFromRoomUsers";
import { Button } from "./Button";
import { Modal } from "./Modal";

interface RoomSettingsModalProps {
  open: boolean;
  onRequestClose: () => void;
}

export const RoomSettingsModal: React.FC<RoomSettingsModalProps> = ({
  open,
  onRequestClose,
}) => {
  const { currentRoom, setCurrentRoom } = useCurrentRoomStore();
  return (
    <Modal isOpen={open} onRequestClose={onRequestClose}>
      <button
        onClick={() => {
          onRequestClose();
        }}
        className={`p-2 -ml-3`}
      >
        <X />
      </button>
      {currentRoom ? (
        <>
          <label className={`flex items-center my-8`} htmlFor="auto-speaker">
            <input
              checked={!currentRoom.autoSpeaker}
              onChange={(e) => {
                setCurrentRoom((cr) =>
                  !cr
                    ? cr
                    : {
                        ...cr,
                        autoSpeaker: !e.target.checked,
                      }
                );
                wsend({
                  op: "set_auto_speaker",
                  d: { value: !e.target.checked },
                });
              }}
              id="auto-speaker"
              type="checkbox"
            />
            <span className={`ml-2`}>require permission to speak</span>
          </label>
          {currentRoom.isPrivate ? (
            <Button
              onClick={() => {
                renameRoomAndMakePublic(currentRoom.name);
                onRequestClose();
              }}
            >
              make room public
            </Button>
          ) : (
            <Button
              onClick={() => {
                renameRoomAndMakePrivate(currentRoom.name);
                onRequestClose();
              }}
            >
              make room private
            </Button>
          )}
          {open ? <BlockedFromRoomUsers /> : null}
        </>
      ) : null}
    </Modal>
  );
};
