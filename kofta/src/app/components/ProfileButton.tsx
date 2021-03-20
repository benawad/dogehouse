import React from "react";
import { useMeQuery } from "../utils/useMeQuery";
import { Avatar } from "./Avatar";

interface ProfileButtonProps {
  size?: number;
  circle?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export const ProfileButton: React.FC<ProfileButtonProps> = ({
  size = 41,
  circle,
  onClick
}) => {
  const { me } = useMeQuery();
  return me ? (
    <button onClick={onClick}>
      <Avatar circle={circle} size={size} src={me.avatarUrl} />
    </button>
  ) : null;
};
