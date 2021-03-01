import React from "react";
import { MicOff } from "react-feather";
import { BaseUser } from "../types";
import { Avatar } from "./Avatar";
import GlassesDoge from "../../assets/glasses-doge.png";
import RegularDoge from "../../assets/regular-doge.png";

interface UserNodeProps {
  u: BaseUser;
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
        style={{ marginLeft: 4, marginBottom: 6 }}
        className={`w-4 h-4 ml-1 mb-1.5`}
      />
    );
  } else if (isMod) {
    prefix = (
      <img
        src={RegularDoge}
        alt="room mod"
        style={{ marginLeft: 4, marginBottom: 6 }}
        className={`w-4 h-4 ml-1 mb-1.5`}
      />
    );
  }
  return (
    <button
      className={`flex flex-col items-center`}
      onClick={onClick}
      key={u.id}
    >
      <div className={`relative`}>
        <Avatar
          usernameForErrorImg={u.username}
          circle
          size={70}
          active={isSpeaking}
          src={u.avatarUrl}
        />
        {isMuted && (isCreator || isSpeaker) ? (
          <div
            className={`absolute -bottom-2 -right-2 bg-blue-500 rounded-full p-1`}
          >
            <MicOff color="white" size={16} name="mute" />
          </div>
        ) : null}
      </div>
      <div className={`mt-2 flex w-full justify-center items-center truncate`}>
        <span className={`text-sm truncate`}>
          {(u.displayName || u.username).trim().split(" ")[0]}
        </span>
        {prefix}
      </div>
    </button>
  );
};
