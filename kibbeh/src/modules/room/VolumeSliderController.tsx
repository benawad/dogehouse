import React from "react";
import { useConsumerStore } from "../../global-stores/useConsumerStore";
import { useTypeSafeTranslation } from "../../shared-hooks/useTypeSafeTranslation";
import { VolumeSlider } from "../../ui/VolumeSlider";

interface VolumeSliderControllerProps {
  userId: string;
}

export const VolumeSliderController: React.FC<VolumeSliderControllerProps> = ({
  userId,
}) => {
  const { consumerMap, setVolume } = useConsumerStore();
  const consumerInfo = consumerMap[userId];
  const { t } = useTypeSafeTranslation();
  if (!consumerInfo) {
    return (
      <div className={`text-primary-300 justify-center w-full py-2`}>
        {t("components.userVolumeSlider.noAudioMessage")}
      </div>
    );
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
