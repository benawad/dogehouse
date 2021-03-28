import { useRouter } from "next/router";
import React from "react";
import { useMuteStore } from "../../global-stores/useMuteStore";
import { useCurrentRoomInfo } from "../../shared-hooks/useCurrentRoomInfo";
import { useSetMute } from "../../shared-hooks/useSetMute";
import { useTypeSafeMutation } from "../../shared-hooks/useTypeSafeMutation";
import { RoomPanelIconBar } from "../../ui/RoomPanelIconBar";

interface RoomPanelIconBarControllerProps {}

export const RoomPanelIconBarController: React.FC<RoomPanelIconBarControllerProps> = ({}) => {
  const { muted } = useMuteStore();
  const setMute = useSetMute();
  const { canSpeak } = useCurrentRoomInfo();
  const { mutateAsync: leaveRoom } = useTypeSafeMutation("leaveRoom");
  const { push } = useRouter();

  return (
    <RoomPanelIconBar
      mute={
        canSpeak ? { isMuted: muted, onMute: () => setMute(!muted) } : undefined
      }
      onLeaveRoom={() => {
        push("/dashboard");
        leaveRoom([]);
      }}
    />
  );
};
