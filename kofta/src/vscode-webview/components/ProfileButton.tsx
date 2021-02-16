import { useAtom } from "jotai";
import React from "react";
import { useHistory } from "react-router-dom";
import { meAtom } from "../atoms";
import { Avatar } from "./Avatar";
import { tw } from "twind";

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
  return me ? (
    <button
      onClick={() => history.push("/me")}
      style={{ paddingLeft: 9, paddingRight: 9 }}
      className={tw`focus:outline-none`}
    >
      <Avatar circle={circle} size={size} src={me.avatarUrl} />
    </button>
  ) : null;
};
