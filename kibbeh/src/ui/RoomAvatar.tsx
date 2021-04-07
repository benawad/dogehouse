import React from "react";
import { SingleUser } from "./UserAvatar";

interface RoomAvatarProps {
  activeSpeaker?: boolean;
  muted?: boolean;
  username: string;
  flair?: React.ReactNode;
  src: string;
  onClick?: () => void;
}

export const RoomAvatar: React.FC<RoomAvatarProps> = ({
  src,
  username,
  flair,
  muted,
  onClick,
  activeSpeaker,
}) => {
  return (
    <button className={`flex-col items-center`} onClick={onClick}>
      <SingleUser
        activeSpeaker={activeSpeaker}
        size="md"
        src={src}
        muted={muted}
        username={username}
      />
      <div>
        <span className={`truncate text-primary-100 mt-1 text-xs`}>
          {username}
        </span>
        {flair}
      </div>
    </button>
  );
};
