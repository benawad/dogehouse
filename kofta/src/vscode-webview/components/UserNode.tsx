import React from "react";
import { tw } from "twind";
import { Codicon } from "../svgs/Codicon";
import { MuteIcon } from "../svgs/MuteIcon";
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
  raisedHand: boolean;
  onClick: () => void;
}

export const UserNode: React.FC<UserNodeProps> = ({
  u,
  isMuted,
  onClick,
  isMod,
  isSpeaker,
  isCreator,
  raisedHand,
  isSpeaking,
}) => {
  let prefix = null;
  if (isCreator) {
    prefix = (
      <img
        src={GlassesDoge}
        alt="room creator"
        style={{ height: 18, width: 18, marginRight: 4, marginBottom: 6 }}
      />
    );
  } else if (isMod) {
    prefix = (
      <img
        src={RegularDoge}
        alt="room mod"
        style={{ height: 18, width: 18, marginRight: 4, marginBottom: 5 }}
      />
    );
  } else if (raisedHand) {
    prefix = (
      <Codicon
        style={{ marginRight: 2, height: 16, width: 16 }}
        name="feedback"
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
        <Avatar size={70} active={isSpeaking} src={u.avatarUrl} />
        {isMuted && isSpeaker ? (
          <div
            className={tw`absolute -bottom-2 -right-2 bg-button rounded-full p-1`}
          >
            <MuteIcon
              fill="white"
              style={{ height: 16, width: 16 }}
              name="mute"
            />
          </div>
        ) : null}
      </div>
      <div className={tw`mt-2 flex items-center`}>
        {prefix}
        <div style={{ fontSize: 14 }}>
          {(u.displayName || "").split(" ")[0]?.slice(0, 9)}
        </div>
      </div>
    </button>
  );
};
