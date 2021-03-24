import React from "react";
import { useMuteStore } from "../../global-stores/useMuteStore";
import { useCurrentRoomInfo } from "../../shared-hooks/useCurrentRoomInfo";
import { useSetMute } from "../../shared-hooks/useSetMute";
import { RoomPanelIconBar } from "../../ui/RoomPanelIconBar";

interface RoomPanelIconBarControllerProps {}

export const RoomPanelIconBarController: React.FC<RoomPanelIconBarControllerProps> = ({}) => {
  const { muted } = useMuteStore();
  const setMute = useSetMute();
  const { canSpeak } = useCurrentRoomInfo();
  return (
    <RoomPanelIconBar
      mute={
        canSpeak ? { isMuted: muted, onMute: () => setMute(!muted) } : undefined
      }
      onLeaveRoom={() => {}}
    />
  );
};
