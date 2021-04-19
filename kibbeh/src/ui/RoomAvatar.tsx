import React from "react";
import { useDebugAudioStore } from "../global-stores/useDebugAudio";
import { AudioDebugAvatar } from "../modules/debugging/AudioDebugAvatar";
import { SingleUser } from "./UserAvatar";

interface RoomAvatarProps {
  isMe?: boolean;
  id?: string;
  canSpeak?: boolean;
  activeSpeaker?: boolean;
  muted?: boolean;
  username: string;
  flair?: React.ReactNode;
  src: string;
  onClick?: () => void;
}

export const RoomAvatar: React.FC<RoomAvatarProps> = ({
  isMe,
  src,
  username,
  flair,
  muted,
  onClick,
  canSpeak,
  id,
  activeSpeaker,
}) => {
  const { debugAudio } = useDebugAudioStore();
  const avatar = (
    <SingleUser
      activeSpeaker={activeSpeaker}
      size="lg"
      src={src}
      muted={muted}
      username={username}
    />
  );
  return (
    <button className={`flex flex-col items-center`} onClick={onClick}>
      {!isMe && canSpeak && id && debugAudio ? (
        <AudioDebugAvatar id={id}>{avatar}</AudioDebugAvatar>
      ) : (
        avatar
      )}
      <div className={`flex items-center mt-2`}>
        <span className={`truncate text-primary-100 text-sm block`}>
          {username}
        </span>
        {flair}
      </div>
    </button>
  );
};
