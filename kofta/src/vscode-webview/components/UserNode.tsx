import React from "react";
import { tw } from "twind";
import { MicOff } from "react-feather";
import { User } from "../types";
import { Avatar } from "./Avatar";
import GlassesDoge from "../../assets/glasses-doge.png";
import RegularDoge from "../../assets/regular-doge.png";

interface UserNodeProps {
  u: User;
  isMuted: boolean;
  isMod: boolean;
  isCreator: boolean;
  isSpeaker: boolean;
  isSpeaking?: boolean;
  onClick: () => void;
}

export const UserNode: React.FC<UserNodeProps> = ({
  u,
  isMuted,
  onClick,
  isMod,
  isSpeaker,
  isCreator,
  isSpeaking,
}) => {
  let prefix = null;
  if (isCreator) {
    prefix = (
      <img
        src={GlassesDoge}
        alt="room creator"
        style={{ height: 18, width: 18, marginLeft: 4, marginBottom: 6 }}
      />
    );
  } else if (isMod) {
    prefix = (
      <img
        src={RegularDoge}
        alt="room mod"
        style={{ height: 18, width: 18, marginLeft: 4, marginBottom: 5 }}
      />
    );
  }
  return (
    <button
      className={tw`flex flex-col items-center`}
      onClick={onClick}
      key={u.id}
    >
      <div className={tw`relative`}>
        <Avatar
          usernameForErrorImg={u.username}
          circle
          size={70}
          active={isSpeaking}
          src={u.avatarUrl}
        />
        {isMuted && isSpeaker ? (
          <div
            className={tw`absolute -bottom-2 -right-2 bg-button rounded-full p-1`}
          >
            <MicOff color="white" size={16} name="mute" />
          </div>
        ) : null}
      </div>
      <div className={tw`mt-2 flex items-center`}>
        <div style={{ fontSize: 14 }}>
          {(u.displayName || "").split(" ")[0]?.slice(0, 9)}
        </div>
        {prefix}
      </div>
    </button>
  );
};
