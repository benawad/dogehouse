import { Room, RoomUser } from "@dogehouse/kebab";
import { useRouter } from "next/router";
import React, { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useCurrentRoomIdStore } from "../../global-stores/useCurrentRoomIdStore";
import { useMuteStore } from "../../global-stores/useMuteStore";
import { useDeafStore } from "../../global-stores/useDeafStore";
import { useCurrentRoomInfo } from "../../shared-hooks/useCurrentRoomInfo";
import { useLeaveRoom } from "../../shared-hooks/useLeaveRoom";
import { useScreenType } from "../../shared-hooks/useScreenType";
import { useSetMute } from "../../shared-hooks/useSetMute";
import { useSetDeaf } from "../../shared-hooks/useSetDeaf";
import { useTypeSafePrefetch } from "../../shared-hooks/useTypeSafePrefetch";
import { useTypeSafeTranslation } from "../../shared-hooks/useTypeSafeTranslation";
import { RoomPanelIconBar } from "../../ui/RoomPanelIconBar";
import { RoomChat } from "./chat/RoomChat";
import { RoomChatInput } from "./chat/RoomChatInput";
import { RoomChatList } from "./chat/RoomChatList";
import { RoomChatMentions } from "./chat/RoomChatMentions";
import { useRoomChatStore } from "./chat/useRoomChatStore";
import { RoomSettingsModal } from "./RoomSettingModal";
import { SolidPlus } from "../../icons";

interface RoomPanelIconBarControllerProps {
  room: Room;
  users: RoomUser[];
}

export const RoomPanelIconBarController: React.FC<RoomPanelIconBarControllerProps> = ({
  room,
  users,
}) => {
  const { t } = useTypeSafeTranslation();
  const { muted } = useMuteStore();
  const setMute = useSetMute();
  const { deafened } = useDeafStore();
  const setDeaf = useSetDeaf();
  const { canSpeak, isCreator } = useCurrentRoomInfo();
  const { leaveRoom } = useLeaveRoom();
  const { push } = useRouter();
  const prefetch = useTypeSafePrefetch();
  const { currentRoomId } = useCurrentRoomIdStore();
  const [roomId, setRoomId] = useState("");
  const [open, toggleOpen] = useRoomChatStore((s) => [s.open, s.toggleOpen]);
  const screenType = useScreenType();
  const userMap = useMemo(() => {
    const map: Record<string, RoomUser> = {};
    users.forEach((u) => {
      map[u.id] = u;
    });
    return map;
  }, [users]);

  return (
    <div className="flex flex-col w-full">
      <RoomSettingsModal onRequestClose={() => setRoomId("")} roomId={roomId} />
      <RoomPanelIconBar
        onToggleChat={() => toggleOpen()}
        mute={
          canSpeak
            ? { isMuted: muted, onMute: () => setMute(!muted) }
            : undefined
        }
        deaf={{ isDeaf: deafened, onDeaf: () => setDeaf(!deafened) }}
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
      {(screenType === "fullscreen" || screenType === "1-cols") && open
        ? createPortal(
            // this is kind of hard to embed in the page
            // so tmp solution of portaling this and absolute positioning for fullscreen
            <div
              className={`flex absolute flex-col w-full z-30 bg-primary-800 h-full rounded-8`}
            >
              <button
                onClick={() => toggleOpen()}
                className="flex justify-between items-center w-full text-primary-100 p-4 text-2xl"
              >
                <span>{t("modules.roomChat.title")}</span>
                {/* Just a temporary solution to make close chat ux better, until we have the design in figma */}
                <SolidPlus className={`transform rotate-45`} />
              </button>
              <div className="flex overflow-y-auto flex-1">
                <div className={`flex flex-1 w-full flex-col mt-4`}>
                  <RoomChatList room={room} userMap={userMap} />
                  <RoomChatMentions users={users} />
                  <RoomChatInput users={users} />
                </div>
              </div>
            </div>,
            document.querySelector("#__next")!
          )
        : null}
    </div>
  );
};
