import { useRouter } from "next/router";
import React from "react";
import { useDeafStore } from "../../global-stores/useDeafStore";
import { useMuteStore } from "../../global-stores/useMuteStore";
import { useCurrentRoomFromCache } from "../../shared-hooks/useCurrentRoomFromCache";
import { useCurrentRoomInfo } from "../../shared-hooks/useCurrentRoomInfo";
import { useLeaveRoom } from "../../shared-hooks/useLeaveRoom";
import { useSetDeaf } from "../../shared-hooks/useSetDeaf";
import { useSetMute } from "../../shared-hooks/useSetMute";
import { MinimizedRoomCard } from "../../ui/MinimizedRoomCard";

export const MinimizedRoomCardController: React.FC = ({}) => {
  const data = useCurrentRoomFromCache();
  const { canSpeak } = useCurrentRoomInfo();
  const { leaveRoom, isLoading } = useLeaveRoom();
  const { muted } = useMuteStore();
  const { deafened } = useDeafStore();
  const setMute = useSetMute();
  const setDeaf = useSetDeaf();
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
          isDeafened: deafened,
          isSpeaker: canSpeak,
          isMuted: muted,
          leave: () => {
            leaveRoom();
          },
          switchDeafened: () => {
            setDeaf(!deafened);
          },
          switchMuted: () => {
            setMute(!muted);
          },
        },
      }}
    />
  );
};
