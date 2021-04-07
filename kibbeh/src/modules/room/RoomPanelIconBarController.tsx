import { Room, RoomUser } from "@dogehouse/kebab";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useCurrentRoomIdStore } from "../../global-stores/useCurrentRoomIdStore";
import { useMuteStore } from "../../global-stores/useMuteStore";
import { useCurrentRoomInfo } from "../../shared-hooks/useCurrentRoomInfo";
import { useLeaveRoom } from "../../shared-hooks/useLeaveRoom";
import { useScreenType } from "../../shared-hooks/useScreenType";
import { useSetMute } from "../../shared-hooks/useSetMute";
import { useTypeSafePrefetch } from "../../shared-hooks/useTypeSafePrefetch";
import { RoomPanelIconBar } from "../../ui/RoomPanelIconBar";
import { RoomChat } from "./chat/RoomChat";
import { RoomChatInput } from "./chat/RoomChatInput";
import { RoomChatList } from "./chat/RoomChatList";
import { RoomChatMentions } from "./chat/RoomChatMentions";
import { useRoomChatStore } from "./chat/useRoomChatStore";
import { RoomSettingsModal } from "./RoomSettingModal";

interface RoomPanelIconBarControllerProps {
  room: Room;
  users: RoomUser[];
}

export const RoomPanelIconBarController: React.FC<RoomPanelIconBarControllerProps> = ({
  room,
  users,
}) => {
  const { muted } = useMuteStore();
  const setMute = useSetMute();
  const { canSpeak, isCreator } = useCurrentRoomInfo();
  const { leaveRoom } = useLeaveRoom();
  const { push } = useRouter();
  const prefetch = useTypeSafePrefetch();
  const { currentRoomId } = useCurrentRoomIdStore();
  const [roomId, setRoomId] = useState("");
  const [open, toggleOpen] = useRoomChatStore((s) => [s.open, s.toggleOpen]);
  const screenType = useScreenType();

  return (
    <div className="flex-col w-full">
      <RoomSettingsModal onRequestClose={() => setRoomId("")} roomId={roomId} />
      <RoomPanelIconBar
        onToggleChat={() => toggleOpen()}
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
      {(screenType === "fullscreen" || screenType === "1-cols") && open ? (
        <div
          className={`flex flex-1 w-full overflow-y-auto bg-primary-800 h-full rounded-8`}
        >
          <div className={`flex flex-1 w-full flex-col mt-4`}>
            <RoomChatList room={room} />
            <RoomChatMentions users={users} />
            <RoomChatInput users={users} />
          </div>
        </div>
      ) : null}
    </div>
  );
};
