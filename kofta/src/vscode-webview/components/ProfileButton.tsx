import { useAtom } from "jotai";
import React from "react";
import { useHistory } from "react-router-dom";
import { wsend } from "../../createWebsocket";
import { meAtom } from "../atoms";
import { Avatar } from "./Avatar";

interface ProfileButtonProps {}

export const ProfileButton: React.FC<ProfileButtonProps> = ({}) => {
  const [me] = useAtom(meAtom);
  const history = useHistory();
  return me ? (
    <button
      onClick={() => history.push("/me")}
      style={{ paddingLeft: 9, paddingRight: 9 }}
    >
      <Avatar size={41} src={me.avatarUrl} />
    </button>
  ) : null;
};
