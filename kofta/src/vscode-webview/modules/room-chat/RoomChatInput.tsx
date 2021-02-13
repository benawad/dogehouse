import { useAtom } from "jotai";
import React, { useState } from "react";
import { tw } from "twind";
import { wsend } from "../../../createWebsocket";
import { meAtom } from "../../atoms";
import { useRoomChatStore } from "./useRoomChatStore";

interface ChatInputProps {}

export const RoomChatInput: React.FC<ChatInputProps> = ({}) => {
  const [message, setMessage] = useState("");
  const [me] = useAtom(meAtom);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!me) {
          return;
        }
        if (me.id in useRoomChatStore.getState().bannedUserIdMap) {
          window.alert("you got banned from chat");
          return;
        }
        const tmp = message;
        setMessage("");
        wsend({
          op: "send_room_chat_msg",
          d: { tokens: [{ t: "text", v: tmp }] },
        });
      }}
      className={tw`bg-tmpBg1 pb-8 px-8 pt-1`}
    >
      <input
        maxLength={512}
        placeholder="Send a message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className={tw`text-tmpC1 bg-tmpBg4 px-4 py-3 rounded text-lg`}
      />
    </form>
  );
};
