import { useAtom } from "jotai";
import React from "react";
import { useHistory } from "react-router-dom";
import { meAtom } from "../atoms";
import { Avatar } from "./Avatar";
import { useRoomChatStore } from "../modules/room-chat/useRoomChatStore";

interface ProfileButtonProps {
  size?: number;
  circle?: boolean;
}

export const ProfileButton: React.FC<ProfileButtonProps> = ({
  size = 41,
  circle,
}) => {
  const [me] = useAtom(meAtom);
  const history = useHistory();
  const [open, toggleOpen] = useRoomChatStore((s) => [s.open, s.toggleOpen]);
  return me ? (
    <button
      onClick={() => {
        if (open) toggleOpen();
        history.push("/me");
      }}
      style={{ paddingLeft: 9, paddingRight: 9 }}
    >
      <Avatar circle={circle} size={size} src={me.avatarUrl} />
    </button>
  ) : null;
};
