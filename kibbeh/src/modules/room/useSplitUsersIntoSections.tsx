import { JoinRoomAndGetInfoResponse, wrap } from "@dogehouse/kebab";
import React, { useContext } from "react";
import { useMuteStore } from "../../global-stores/useMuteStore";
import { useDeafStore } from "../../global-stores/useDeafStore";
import { SolidSimpleMegaphone } from "../../icons";
import { modalConfirm } from "../../shared-components/ConfirmModal";
import { useConn } from "../../shared-hooks/useConn";
import { BoxedIcon } from "../../ui/BoxedIcon";
import { RoomAvatar } from "../../ui/RoomAvatar";
import { UserPreviewModalContext } from "./UserPreviewModalProvider";
import { Emote } from "./chat/Emote";
import { useScreenType } from "../../shared-hooks/useScreenType";

export const useSplitUsersIntoSections = ({
  room,
  users,
  activeSpeakerMap,
  muteMap,
  deafMap,
}: JoinRoomAndGetInfoResponse) => {
  const conn = useConn();
  const { muted } = useMuteStore();
  const { deafened } = useDeafStore();
  const { setData } = useContext(UserPreviewModalContext);
  const screenType = useScreenType();
  const speakers: React.ReactNode[] = [];
  const askingToSpeak: React.ReactNode[] = [];
  const listeners: React.ReactNode[] = [];
  let canIAskToSpeak = false;

  users.forEach((u) => {
    let arr = listeners;
    if (u.id === room.creatorId || u.roomPermissions?.isSpeaker) {
      arr = speakers;
    } else if (u.roomPermissions?.askedToSpeak) {
      arr = askingToSpeak;
    } else if (u.id === conn.user.id) {
      canIAskToSpeak = true;
    }

    let flair: React.ReactNode | undefined = undefined;

    const isCreator = u.id === room.creatorId;
    const isSpeaker = !!u.roomPermissions?.isSpeaker;
    const canSpeak = isCreator || isSpeaker;
    const isMuted = conn.user.id === u.id ? muted : muteMap[u.id];
    const isDeafened = conn.user.id === u.id ? deafened : deafMap[u.id];

    if (isCreator || u.roomPermissions?.isMod) {
      flair = (
        <Emote
          emote={isCreator ? "coolhouse" : "dogehouse"}
          alt={isCreator ? `admin` : `mod`}
          title={isCreator ? `Admin` : `Mod`}
          style={{ marginLeft: 4 }}
          className={`w-3 h-3 ml-1`}
        />
      );
    }

    // for (let i = 0; i < 50; i++) {
    arr.push(
      <RoomAvatar
        // key={u.id + i}
        id={u.id}
        canSpeak={canSpeak}
        isMe={u.id === conn.user.id}
        key={u.id}
        src={u.avatarUrl}
        username={u.username}
        isBot={!!u.botOwnerId}
        activeSpeaker={
          canSpeak && !isMuted && !isDeafened && u.id in activeSpeakerMap
        }
        muted={canSpeak && isMuted && !isDeafened}
        deafened={isDeafened}
        onClick={() => {
          setData({ userId: u.id });
        }}
        flair={flair}
      />
    );
    // }
  });

  if (canIAskToSpeak && screenType !== "fullscreen") {
    speakers.push(
      <div key="megaphone" className={`flex justify-center`}>
        <BoxedIcon
          onClick={() => {
            modalConfirm("Would you like to ask to speak?", () => {
              wrap(conn).mutation.askToSpeak();
            });
          }}
          style={{ width: 60, height: 60 }}
          circle
          className="flex-shrink-0"
          title="Request to speak"
        >
          <SolidSimpleMegaphone width={20} height={20} />
        </BoxedIcon>
      </div>
    );
  }

  return { speakers, listeners, askingToSpeak, canIAskToSpeak };
};
