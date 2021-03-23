import { Room } from "@dogehouse/kebab";
import React, { useMemo } from "react";
import { useCurrentRoomIdStore } from "../../global-stores/useCurrentRoomIdStore";
import { useMuteStore } from "../../global-stores/useMuteStore";
import { useCurrentRoomInfo } from "../../shared-hooks/useCurrentRoomInfo";
import { useSetMute } from "../../shared-hooks/useSetMute";
import { useTypeSafeMutation } from "../../shared-hooks/useTypeSafeMutation";
import { MinimizedRoomCard } from "../../ui/MinimizedRoomCard";

interface MinimizedRoomCardControllerProps {
  room: Room;
}

export const MinimizedRoomCardController: React.FC<MinimizedRoomCardControllerProps> = ({
  room,
}) => {
  const { muted } = useMuteStore();
  const { canSpeak } = useCurrentRoomInfo();
  const dt = useMemo(() => new Date(room.inserted_at), [room.inserted_at]);
  const { mutateAsync: leaveRoom, isLoading } = useTypeSafeMutation(
    "leaveRoom"
  );
  const setMute = useSetMute();
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
          leave: async () => {
            const resp = await leaveRoom([]);
            useCurrentRoomIdStore
              .getState()
              .setCurrentRoom((cr) =>
                cr && cr.id === resp.roomId ? null : cr
              );
            // @todo leave voice room
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
