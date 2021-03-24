import React from "react";
import { useHistory } from "react-router-dom";
import { useMeQuery } from "../utils/useMeQuery";
import { Avatar } from "./Avatar";


interface ProfileButtonProps {
  size?: number;
  circle?: boolean;
}

export const ProfileButton: React.FC<ProfileButtonProps> = ({
  size = 41,
  circle,
}) => {
  const { me } = useMeQuery();
  const history = useHistory();
  return me ? (
    <button title={me.username} onClick={() => history.push("/me")}>
      <Avatar circle={circle} size={size} src={me.avatarUrl} />
    </button>
  ) : null;
};
