import React from "react";
import { MinimizedRoomCard } from "../../components/minimizedRoomCard/MinimizedRoomCard";
import { useCurrentRoomIdStore } from "../../global-stores/useCurrentRoomIdStore";
import { useMuteStore } from "../../global-stores/useMuteStore";
import * as RootNavigation from "../../navigation/RootNavigation";
import { useSetMute } from "../../shared-hooks/useSetMute";
import { useTypeSafeQuery } from "../../shared-hooks/useTypeSafeQuery";
import { useOnRoomPage } from "./useOnRoomPage";

interface MinimizedRoomCardControllerProps {}

const MinimizedRoomCardController: React.FC<MinimizedRoomCardControllerProps> = () => {
  const setInternalMute = useSetMute();
  const muted = useMuteStore((s) => s.muted);
  const { currentRoomId } = useCurrentRoomIdStore();
  const { data } = useTypeSafeQuery(["joinRoomAndGetInfo", currentRoomId], {}, [
    currentRoomId,
  ]);

  const { onRoomPage } = useOnRoomPage();

  if (onRoomPage || !currentRoomId || !data || "error" in data) {
    return null;
  }

  const { room } = data;
  const dt = new Date(room.inserted_at);

  return (
    <MinimizedRoomCard
      onPress={() => RootNavigation.navigate("Room", { roomId: currentRoomId })}
      room={{
        name: room.name,
        // @TODO: Get avatars from `peoplePreviewList` when they are available
        speakerAvatars: [],
        roomStartedAt: dt,
        myself: {
          isDeafened: false,
          isMuted: muted,
          switchMuted: () => {
            setInternalMute(!muted);
          },
        },
      }}
      style={{
        position: "absolute",
        bottom: 90,
        right: 20,
        zIndex: 10,
      }}
    />
  );
};

export default MinimizedRoomCardController;
