import React from "react";
import { useAtom } from "jotai";
import { PopoverMenu, MenuItem } from "../../components/PopoverMenu";
import { MoreVertical } from "react-feather";
import { meAtom, currentRoomAtom, myCurrentRoomInfoAtom } from "../../atoms";
import { RoomChatMessage } from "./useRoomChatStore";
import { wsend } from "../../../createWebsocket";

interface RoomChatMessageMenuProps {
  menuIconId?: string;
  message: RoomChatMessage;
}

export const RoomChatMessageMenu: React.FC<RoomChatMessageMenuProps> = ({
  menuIconId,
  message,
}) => {
  const [room] = useAtom(currentRoomAtom);
  const [{ isMod: iAmMod, isCreator: iAmCreator }] = useAtom(
    myCurrentRoomInfoAtom
  );
  const [me] = useAtom(meAtom);
  const [isOpen, setOpen] = React.useState(false);

  function deleteMessage() {
    wsend({
      op: "delete_room_chat_message",
      d: {
        messageId: message.id,
      },
    });
  }

  return me?.id === message.userId ||
    iAmCreator ||
    (iAmMod && room?.creatorId !== message.userId) ? (
    <PopoverMenu
      isOpen={isOpen}
      setOpen={setOpen}
      trigger={
        <MoreVertical
          size={15}
          className={`cursor-pointer ${
            menuIconId !== message.id && !isOpen ? "invisible" : "visible"
          }`}
        />
      }
    >
      <MenuItem onClick={deleteMessage}>Delete</MenuItem>
      {(iAmCreator || iAmMod) && me?.id !== message.userId ? (
        <MenuItem>Delete all</MenuItem>
      ) : null}
    </PopoverMenu>
  ) : null;
};
