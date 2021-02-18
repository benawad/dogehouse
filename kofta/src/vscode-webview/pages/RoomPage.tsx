import { useAtom } from "jotai";
import React, { useState } from "react";
import { Redirect, useRouteMatch } from "react-router-dom";
import { tw } from "twind";
import { wsend } from "../../createWebsocket";
import { useMuteStore } from "../../webrtc/stores/useMuteStore";
import { currentRoomAtom, meAtom, myCurrentRoomInfoAtom } from "../atoms";
import { Backbar } from "../components/Backbar";
import { BottomVoiceControl } from "../components/BottomVoiceControl";
import { CircleButton } from "../components/CircleButton";
import { modalConfirm } from "../components/ConfirmModal";
import { ProfileButton } from "../components/ProfileButton";
import { ProfileModal } from "../components/ProfileModal";
import { modalPrompt } from "../components/PromptModal";
import { RoomUserNode } from "../components/RoomUserNode";
import { Wrapper } from "../components/Wrapper";
import { Codicon } from "../svgs/Codicon";
import { User } from "../types";
import { isUuid } from "../utils/isUuid";

interface RoomPageProps {}

export const RoomPage: React.FC<RoomPageProps> = () => {
  const {
    params: { id },
  } = useRouteMatch<{ id: string }>();
  const [userProfileId, setUserProfileId] = useState("");
  const [room] = useAtom(currentRoomAtom);
  const { muted } = useMuteStore();
  const [me] = useAtom(meAtom);
  const [
    { isMod: iAmMod, isCreator: iAmCreator, canSpeak: iCanSpeak },
  ] = useAtom(myCurrentRoomInfoAtom);

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
        <div>loading...</div>
      </Wrapper>
    );
  }

  const profile = room.users.find((x) => x.id === userProfileId);

  const speakers: User[] = [];
  const unansweredHands: User[] = [];
  const listeners: User[] = [];

  room.users.forEach((u) => {
    if (u.id === room.creatorId || u.canSpeakForRoomId === room.id) {
      speakers.push(u);
    } else if (u.id in room.raiseHandMap) {
      unansweredHands.push(u);
    } else {
      listeners.push(u);
    }
  });

  // if (iAmCreator) {
  //   Object.keys(room.raiseHandMap).forEach((id) => {
  //     if (room.raiseHandMap[id] === -1) {
  //       const u = room.users.find((x) => x.id === id);
  //       if (u && u.id !== me?.id && u.canSpeakForRoomId !== room.id) {
  //         unansweredHands.push(u);
  //       }
  //     }
  //   });
  // }

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
      <Backbar>
        <button
          disabled={!iAmCreator}
          onClick={() => {
            modalPrompt("Edit Room Name", (name) => {
              if (name) {
                wsend({ op: "edit_room_name", d: { name } });
              }
            });
          }}
          style={{
            fontSize: "calc(var(--vscode-font-size)*1.3)",
            display: "block",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
          className={tw`flex-1 text-center flex items-center justify-center text-2xl`}
        >
          {room.name.slice(0, 50)}
        </button>
        <ProfileButton />
      </Backbar>
      <Wrapper>
        <div
          style={{
            width: "100%",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, 90px)",
            gap: 20,
          }}
        >
          <div
            style={{
              fontSize: 20,
              marginLeft: 10,
              gridColumn: "1/-1",
              color: "#fff",
            }}
          >
            Speakers ({speakers.length})
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
          {!iCanSpeak && me && !(me.id in room.raiseHandMap) ? (
            <div className={tw`flex flex-col items-center`}>
              <CircleButton
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
            <div
              style={{
                fontSize: 20,
                marginLeft: 10,
                gridColumn: "1/-1",
                color: "#fff",
              }}
            >
              Requesting to speak ({unansweredHands.length})
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
              style={{
                fontSize: 20,
                marginLeft: 10,
                marginTop: 10,
                gridColumn: "1/-1",
                color: "#fff",
              }}
            >
              Listeners ({listeners.length})
            </div>
          ) : null}
          {listeners.map((u) => (
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
        </div>
      </Wrapper>
      <BottomVoiceControl />
    </>
  );
};
