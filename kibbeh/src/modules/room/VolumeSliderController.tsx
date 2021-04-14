import React from "react";
import { useTypeSafeTranslation } from "../../shared-hooks/useTypeSafeTranslation";
import { VolumeSlider } from "../../ui/VolumeSlider";
import { useConsumerStore } from "../webrtc/stores/useConsumerStore";

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
      <div className={`flex text-primary-300 justify-center w-full py-2`}>
        {t("components.userVolumeSlider.noAudioMessage")}
      </div>
    );
  }

  return (
    <div className="flex mt-1 w-full px-4">
      <VolumeSlider
        label
        max={200}
        volume={consumerInfo.volume}
        onDoubleClick={() => setVolume(userId, 100)}
        onVolume={(n) => setVolume(userId, n)}
      />
    </div>
  );
};
