import { JoinRoomAndGetInfoResponse, wrap } from "@dogehouse/kebab";
import React, { useContext } from "react";
import { useMuteStore } from "../../global-stores/useMuteStore";
import { SolidMegaphone } from "../../icons";
import { modalConfirm } from "../../shared-components/ConfirmModal";
import { useConn } from "../../shared-hooks/useConn";
import { BoxedIcon } from "../../ui/BoxedIcon";
import { RoomAvatar } from "../../ui/RoomAvatar";
import { UserPreviewModalContext } from "./UserPreviewModalProvider";

export const useSplitUsersIntoSections = ({
  room,
  users,
  activeSpeakerMap,
  muteMap,
}: JoinRoomAndGetInfoResponse) => {
  const conn = useConn();
  const { muted } = useMuteStore();
  const { setData } = useContext(UserPreviewModalContext);
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

    if (isCreator || u.roomPermissions?.isMod) {
      flair = (
        <img
          src={isCreator ? `/emotes/coolhouse.png` : `/emotes/dogehouse.png`}
          alt={isCreator ? `admin` : `mod`}
          style={{ marginLeft: 4, marginTop: 4 }}
          className={`w-3 h-3 ml-1`}
        />
      );
    }

    // for (let i = 0; i < 50; i++) {
    arr.push(
      <RoomAvatar
        // key={u.id + i}
        key={u.id}
        src={u.avatarUrl}
        username={u.username}
        activeSpeaker={canSpeak && !isMuted && u.id in activeSpeakerMap}
        muted={canSpeak && isMuted}
        onClick={() => {
          setData({ userId: u.id });
        }}
        flair={flair}
      />
    );
    // }
  });

  if (canIAskToSpeak) {
    speakers.push(
      // match avatar size
      <BoxedIcon
        key="megaphone"
        onClick={() => {
          modalConfirm("Would you like to ask to speak?", () => {
            wrap(conn).mutation.askToSpeak();
          });
        }}
        style={{ width: 50, height: 50 }}
        circle
      >
        {/* @todo add right icon */}
        <SolidMegaphone />
      </BoxedIcon>
    );
  }

  return { speakers, listeners, askingToSpeak, canIAskToSpeak };
};
