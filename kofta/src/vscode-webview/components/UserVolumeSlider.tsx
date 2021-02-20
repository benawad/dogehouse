import React from "react";
import { useConsumerStore } from "../../webrtc/stores/useConsumerStore";
import { VolumeSlider } from "./VolumeSlider";

interface UserVolumeSliderProps {
  userId: string;
}

export const UserVolumeSlider: React.FC<UserVolumeSliderProps> = ({
  userId,
}) => {
  const { consumerMap, setVolume } = useConsumerStore();
  const consumerInfo = consumerMap[userId];
  if (!consumerInfo) {
    return <div>no audio consumer for some reason</div>;
  }

  return (
    <VolumeSlider
      label
      max="200"
      volume={consumerInfo.volume}
      onVolume={(n) => setVolume(userId, n)}
    />
  );
};
