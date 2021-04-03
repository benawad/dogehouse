import { useRouter } from "next/router";
import React, { useState } from "react";
import { useCurrentRoomIdStore } from "../../global-stores/useCurrentRoomIdStore";
import { useMuteStore } from "../../global-stores/useMuteStore";
import { useCurrentRoomInfo } from "../../shared-hooks/useCurrentRoomInfo";
import { useLeaveRoom } from "../../shared-hooks/useLeaveRoom";
import { useSetMute } from "../../shared-hooks/useSetMute";
import { useTypeSafePrefetch } from "../../shared-hooks/useTypeSafePrefetch";
import { RoomPanelIconBar } from "../../ui/RoomPanelIconBar";
import { RoomSettingsModal } from "./RoomSettingModal";

interface RoomPanelIconBarControllerProps {}

export const RoomPanelIconBarController: React.FC<RoomPanelIconBarControllerProps> = ({}) => {
  const { muted } = useMuteStore();
  const setMute = useSetMute();
  const { canSpeak, isCreator } = useCurrentRoomInfo();
  const { leaveRoom } = useLeaveRoom();
  const { push } = useRouter();
  const prefetch = useTypeSafePrefetch();
  const { currentRoomId } = useCurrentRoomIdStore();
  const [roomId, setRoomId] = useState("");

  return (
    <>
      <RoomSettingsModal onRequestClose={() => setRoomId("")} roomId={roomId} />
      <RoomPanelIconBar
        mute={
          canSpeak
            ? { isMuted: muted, onMute: () => setMute(!muted) }
            : undefined
        }
        onLeaveRoom={() => {
          push("/dash");
          leaveRoom();
        }}
        onInvitePeopleToRoom={() => {
          push(`/room/[id]/invite`, `/room/${currentRoomId}/invite`);
        }}
        onRoomSettings={
          isCreator
            ? () => {
                prefetch(["getBlockedFromRoomUsers", 0]);
                setRoomId(currentRoomId!);
              }
            : undefined
        }
      />
    </>
  );
};
