import React from "react";
import { useConsumerStore } from "../../webrtc/stores/useConsumerStore";
import { VolumeSlider } from "./VolumeSlider";
import { useTranslation } from 'react-i18next';

interface UserVolumeSliderProps {
  userId: string;
}

export const UserVolumeSlider: React.FC<UserVolumeSliderProps> = ({
  userId,
}) => {
  const { consumerMap, setVolume } = useConsumerStore();
  const consumerInfo = consumerMap[userId];
  const { t } = useTranslation();
  if (!consumerInfo) {
    return <div>{t("components.userVolumeSlider.noAudioMessage")}</div>;
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
