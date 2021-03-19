import React, { useMemo, useState } from "react";
import { Redirect, useRouteMatch } from "react-router-dom";
import { wsend } from "../../createWebsocket";
import { useCurrentRoomStore } from "../../webrtc/stores/useCurrentRoomStore";
import { useMuteStore } from "../../webrtc/stores/useMuteStore";
import { useCurrentRoomInfo } from "../atoms";
import { Backbar } from "../components/Backbar";
import { BodyWrapper } from "../components/BodyWrapper";
import { BottomVoiceControl } from "../components/BottomVoiceControl";
import { Button } from "../components/Button";
import { CircleButton } from "../components/CircleButton";
import { modalConfirm } from "../components/ConfirmModal";
import { CreateRoomModal } from "../components/CreateRoomModal";
import { ProfileButton } from "../components/ProfileButton";
import { ProfileModal } from "../components/ProfileModal";
import { RoomUserNode } from "../components/RoomUserNode";
import { Wrapper } from "../components/Wrapper";
import { useShouldFullscreenChat } from "../modules/room-chat/useShouldFullscreenChat";
import { Codicon } from "../svgs/Codicon";
import { BaseUser } from "../types";
import { isUuid } from "../utils/isUuid";
import { useTimeElapsed } from "../utils/timeElapsed";
import { useMeQuery } from "../utils/useMeQuery";
import { useTypeSafeTranslation } from "../utils/useTypeSafeTranslation";

interface RoomPageProps {}

export const RoomPage: React.FC<RoomPageProps> = () => {
  const {
    params: { id },
  } = useRouteMatch<{ id: string }>();
  const [userProfileId, setUserProfileId] = useState("");
  const { currentRoom: room } = useCurrentRoomStore();
  const insertedAtDate = useMemo(
    () => (room?.inserted_at ? new Date(room.inserted_at) : null),
    [room?.inserted_at]
  );
  const { timeElapsed, rocketIcon, rocketStatus } = useTimeElapsed(
    insertedAtDate
  );
  const { muted } = useMuteStore();
  const { me } = useMeQuery();
  const {
    isMod: iAmMod,
    isCreator: iAmCreator,
    canSpeak: iCanSpeak,
  } = useCurrentRoomInfo();
  const fullscreenChatOpen = useShouldFullscreenChat();
  const [showCreateRoomModal, setShowCreateRoomModal] = useState(false);
  const [listenersPage, setListenersPage] = useState(1);
  const pageSize = 25;
  const { t } = useTypeSafeTranslation();
  // useEffect(() => {
  //   if (room?.users.length) {
  //     setUserProfileId(room.users[0].id);
  //     wsend({ op: "follow_info", d: { userId: room.users[0].id } });
  //   }
  // }, []);

  if (!isUuid(id)) {
    return <Redirect to="/" />;
  }

  if (!room) {
    return (
      <Wrapper>
        <Backbar />
        <BodyWrapper>
          <div>{t("common.loading")}</div>
        </BodyWrapper>
      </Wrapper>
    );
  }

  const profile = room.users.find((x) => x.id === userProfileId);

  const speakers: BaseUser[] = [];
  const unansweredHands: BaseUser[] = [];
  const listeners: BaseUser[] = [];
  let canIAskToSpeak = false;

  room.users.forEach((u) => {
    if (u.id === room.creatorId || u.roomPermissions?.isSpeaker) {
      speakers.push(u);
    } else if (u.roomPermissions?.askedToSpeak) {
      unansweredHands.push(u);
    } else {
      canIAskToSpeak = true;
      listeners.push(u);
    }
  });

  const listenersShown = listeners.slice(0, listenersPage * pageSize);
  return (
    <>
      <ProfileModal
        iAmCreator={iAmCreator}
        iAmMod={iAmMod}
        isMe={profile?.id === me?.id}
        room={room}
        onClose={() => setUserProfileId("")}
        profile={profile}
      />
      {fullscreenChatOpen ? null : (
        <Backbar>
          <div className={`flex flex-col justify-center w-full`}>
            <button
              disabled={!iAmCreator}
              onClick={() => setShowCreateRoomModal(true)}
              className={`text-2xl truncate max-w-lg text-center px-2`}
            >
              {room.name}
            </button>
            {rocketStatus && (
              <div className={`text-center text-sm`}>
                {rocketIcon} {rocketStatus} &nbsp;
                <span className="opacity-50">({timeElapsed})</span>
              </div>
            )}
          </div>
          <div className="ml-auto pr-2">
            <ProfileButton />
          </div>
        </Backbar>
      )}
      <Wrapper>
        <BodyWrapper>
          <div
            style={{
              gridTemplateColumns: "repeat(auto-fit, 90px)",
            }}
            className={`w-full grid gap-5 mb-24`}
          >
            <div className={`col-span-full text-xl ml-2.5 text-white`}>
              {t("pages.room.speakers")} ({speakers.length})
            </div>
            {speakers.map((u) => (
              <RoomUserNode
                key={u.id}
                room={room}
                u={u}
                muted={muted}
                setUserProfileId={setUserProfileId}
                me={me}
                profile={profile}
              />
            ))}
            {!iCanSpeak && me && canIAskToSpeak ? (
              <div className={`flex flex-col items-center`}>
                <CircleButton
                  title="Request to speak"
                  size={70}
                  onClick={() => {
                    modalConfirm("Would you like to ask to speak?", () => {
                      wsend({ op: "ask_to_speak", d: {} });
                    });
                  }}
                >
                  <Codicon width={36} height={36} name="megaphone" />
                </CircleButton>
              </div>
            ) : null}
            {unansweredHands.length ? (
              <div className={`col-span-full text-xl ml-2.5 text-white`}>
                {t("pages.room.requestingToSpeak")} ({unansweredHands.length})
              </div>
            ) : null}
            {unansweredHands.map((u) => (
              <RoomUserNode
                key={u.id}
                room={room}
                u={u}
                muted={muted}
                setUserProfileId={setUserProfileId}
                me={me}
                profile={profile}
              />
            ))}
            {listeners.length ? (
              <div
                className={`flex col-span-full text-xl mt-2.5 ml-2.5 text-white`}
              >
                {t("pages.room.listeners")} ({listeners.length})
              </div>
            ) : null}
            {listenersShown.map((u) => (
              <RoomUserNode
                key={u.id}
                room={room}
                u={u}
                muted={muted}
                setUserProfileId={setUserProfileId}
                me={me}
                profile={profile}
              />
            ))}
            {listenersShown.length < listeners.length && (
              <div className={`flex col-span-full`}>
                <Button
                  variant="slim"
                  onClick={() => setListenersPage((page) => page + 1)}
                >
                  {t("common.loadMore")}
                </Button>
              </div>
            )}
          </div>
        </BodyWrapper>
      </Wrapper>
      <BottomVoiceControl />

      {/* Edit room */}
      {showCreateRoomModal ? (
        <CreateRoomModal
          onRequestClose={() => setShowCreateRoomModal(false)}
          name={room.name}
          description={room.description}
          isPrivate={room.isPrivate}
          edit={true}
        />
      ) : null}
    </>
  );
};
