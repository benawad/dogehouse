import { useRouter } from "next/router";
import React from "react";
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
  const router = useRouter();

  if (!data || "error" in data) {
    return null;
  }

  const { room } = data;
  const dt = new Date(room.inserted_at);

  return (
    <MinimizedRoomCard
      onFullscreenClick={() => router.push(`/room/${room.id}`)}
      leaveLoading={isLoading}
      room={{
        name: room.name,
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
