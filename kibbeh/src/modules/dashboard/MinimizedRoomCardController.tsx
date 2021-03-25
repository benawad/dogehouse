import { Room } from "@dogehouse/kebab";
import React, { useMemo } from "react";
import { useCurrentRoomIdStore } from "../../global-stores/useCurrentRoomIdStore";
import { useMuteStore } from "../../global-stores/useMuteStore";
import { useCurrentRoomInfo } from "../../shared-hooks/useCurrentRoomInfo";
import { useSetMute } from "../../shared-hooks/useSetMute";
import { useTypeSafeMutation } from "../../shared-hooks/useTypeSafeMutation";
import { useTypeSafeQuery } from "../../shared-hooks/useTypeSafeQuery";
import { MinimizedRoomCard } from "../../ui/MinimizedRoomCard";

interface MinimizedRoomCardControllerProps {
  roomId: string;
}

export const MinimizedRoomCardController: React.FC<MinimizedRoomCardControllerProps> = ({
  roomId,
}) => {
  const { data } = useTypeSafeQuery(["joinRoomAndGetInfo", roomId]);
  const { canSpeak } = useCurrentRoomInfo();
  const { mutateAsync: leaveRoom, isLoading } = useTypeSafeMutation(
    "leaveRoom"
  );
  const { muted } = useMuteStore();
  const setMute = useSetMute();

  if (!data || "error" in data) {
    return null;
  }

  const { room } = data;
  const dt = new Date(room.inserted_at);

  return (
    <MinimizedRoomCard
      leaveLoading={isLoading}
      room={{
        name: room.name,
        url: `/room/${room.id}`,
        speakers: room.peoplePreviewList.slice(0, 3).map((s) => s.displayName),
        roomStartedAt: dt,
        myself: {
          isDeafened: false,
          isSpeaker: canSpeak,
          isMuted: muted,
          leave: () => {
            leaveRoom([]);
          },
          switchDeafened: () => {},
          switchMuted: () => {
            setMute(!muted);
          },
        },
      }}
    />
  );
};
