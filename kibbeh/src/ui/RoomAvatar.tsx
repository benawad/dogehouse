import React from "react";
import { useDebugAudioStore } from "../global-stores/useDebugAudio";
import { AudioDebugAvatar } from "../modules/debugging/AudioDebugAvatar";
import { useTypeSafeTranslation } from "../shared-hooks/useTypeSafeTranslation";
import { SingleUser } from "./UserAvatar";

interface RoomAvatarProps {
  isMe?: boolean;
  id?: string;
  canSpeak?: boolean;
  activeSpeaker?: boolean;
  muted?: boolean;
  deafened?: boolean;
  username: string;
  flair?: React.ReactNode;
  src: string;
  isBot?: boolean;
  onClick?: () => void;
}

export const RoomAvatar: React.FC<RoomAvatarProps> = ({
  isMe,
  src,
  username,
  flair,
  muted,
  deafened,
  onClick,
  canSpeak,
  id,
  activeSpeaker,
  isBot,
}) => {
  const { t } = useTypeSafeTranslation();
  const { debugAudio } = useDebugAudioStore();
  const avatar = (
    <SingleUser
      activeSpeaker={activeSpeaker}
      size="lg"
      src={src}
      muted={muted}
      isBot={isBot}
      deafened={deafened}
      username={username}
      hover={true}
    />
  );
  return (
    <button
      data-testid={`room:user:node:${username}`}
      className={`flex flex-col items-center`}
      onClick={onClick}
    >
      {!isMe && canSpeak && id && debugAudio ? (
        <AudioDebugAvatar id={id}>{avatar}</AudioDebugAvatar>
      ) : (
        avatar
      )}
      <div className={`flex items-center mt-2 ${deafened ? "opacity-60" : ""}`}>
        <span className={`truncate text-primary-100 text-sm block`}>
          {username}
        </span>
        {flair}
      </div>
    </button>
  );
};
