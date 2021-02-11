import { useAtom } from "jotai";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { tw } from "twind";
import { wsend } from "../../createWebsocket";
import { useMuteStore } from "../../webrtc/stores/useMuteStore";
import { currentRoomAtom, meAtom, myCurrentRoomInfoAtom } from "../atoms";
import { Avatar } from "../components/Avatar";
import { Backbar } from "../components/Backbar";
import { BottomVoiceControl } from "../components/BottomVoiceControl";
import { Button } from "../components/Button";
import { ProfileModal } from "../components/ProfileModal";
import { UserNode } from "../components/UserNode";
import { Wrapper } from "../components/Wrapper";
import { Codicon } from "../svgs/Codicon";
import { User } from "../types";

interface RoomPageProps {}

export const RoomPage: React.FC<RoomPageProps> = () => {
  const [userProfileId, setUserProfileId] = useState("");
  const history = useHistory();
  const [room, setRoom] = useAtom(currentRoomAtom);
  const { muted } = useMuteStore();
  const [me] = useAtom(meAtom);
  const [{ isMod: iAmMod, isCreator: iAmCreator }] = useAtom(
    myCurrentRoomInfoAtom
  );

  // useEffect(() => {
  //   if (room?.users.length) {
  //     setUserProfileId(room.users[0].id);
  //     wsend({ op: "follow_info", d: { userId: room.users[0].id } });
  //   }
  // }, []);

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
  const listeners: User[] = [];

  room.users.forEach((u) => {
    if (u.id === room.creatorId || u.canSpeakForRoomId === room.id) {
      speakers.push(u);
    } else {
      listeners.push(u);
    }
  });

  const unansweredHands: User[] = [];

  if (iAmCreator) {
    Object.keys(room.raiseHandMap).forEach((id) => {
      if (room.raiseHandMap[id] === -1) {
        const u = room.users.find((x) => x.id === id);
        if (u && u.id !== me?.id && u.canSpeakForRoomId !== room.id) {
          unansweredHands.push(u);
        }
      }
    });
  }

  return (
    <>
      {unansweredHands.length ? (
        <div
          className={tw`absolute top-0 w-full z-10`}
          style={{
            backgroundColor: "var(--vscode-dropdown-border)",
            padding: "16px var(--container-paddding)",
          }}
        >
          {unansweredHands.map((u, i) => (
            <div
              style={{
                borderBottom:
                  i < unansweredHands.length - 1
                    ? "1px solid var(--vscode-breadcrumb-background)"
                    : "",
              }}
              key={u.id}
              className={tw`flex items-center py-4`}
            >
              <Avatar src={u.avatarUrl} />
              <div className={tw`flex-1 ml-4`}>
                <span className={tw`font-semibold`}>{u.displayName}</span> would
                like to speak
              </div>
              <div>
                <Button
                  onClick={() => {
                    wsend({
                      op: "add_speaker_from_hand",
                      d: {
                        userId: u.id,
                      },
                    });
                    setRoom((r) =>
                      !r
                        ? r
                        : {
                            ...r,
                            raiseHandMap: { ...r.raiseHandMap, [u.id]: 1 },
                          }
                    );
                  }}
                  variant="small"
                >
                  allow
                </Button>
              </div>
              <div className={tw`ml-2`}>
                <Button
                  onClick={() => {
                    wsend({ op: "decline_hand", d: { userId: u.id } });
                    setRoom((r) =>
                      !r
                        ? r
                        : {
                            ...r,
                            raiseHandMap: { ...r.raiseHandMap, [u.id]: 0 },
                          }
                    );
                  }}
                  color="red"
                  variant="small"
                >
                  decline
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : null}
      <ProfileModal
        iAmCreator={iAmCreator}
        iAmMod={iAmMod}
        isMe={profile?.id === me?.id}
        room={room}
        onClose={() => setUserProfileId("")}
        profile={profile}
      />
      <Wrapper>
        <Backbar to="/">
          <button
            className={tw`hover:bg-buttonHover p-2`}
            onClick={() => history.push("/")}
          >
            <Codicon name="arrowLeft" />
          </button>
          <div
            style={{
              fontSize: "calc(var(--vscode-font-size)*1.1)",
            }}
            className={tw`flex-1 text-center flex items-center justify-center font-semibold`}
          >
            {room.name}
          </div>
          <div className={tw`flex`}>
            <button
              className={tw`hover:bg-buttonHover p-2 pr-3`}
              onClick={() => {
                wsend({ op: "fetch_invite_list", d: { cursor: 0 } });
                history.push("/invite");
              }}
            >
              <Codicon name="plus" />
            </button>
            <button
              className={tw`hover:bg-buttonHover p-2  pl-3`}
              onClick={() => {
                history.push("/voice-settings");
              }}
            >
              <Codicon name="cog" />
            </button>
          </div>
        </Backbar>
        <div
          style={{
            width: "100%",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, 90px)",
            justifyContent: "center",
            gap: 20,
          }}
        >
          {speakers.map((u) => (
            <UserNode
              u={u}
              isMuted={me?.id === u.id ? muted : room.muteMap[u.id]}
              isCreator={u.id === room.creatorId}
              isSpeaking={u.id in room.activeSpeakerMap}
              isMod={u.modForRoomId === room.id}
              isSpeaker={u.canSpeakForRoomId === room.id}
              raisedHand={false}
              key={u.id}
              onClick={() => {
                if (u.id === profile?.id) {
                  setUserProfileId("");
                } else {
                  if (
                    (u.youAreFollowing === undefined ||
                      u.youAreFollowing === null) &&
                    me?.id !== u.id
                  ) {
                    wsend({ op: "follow_info", d: { userId: u.id } });
                  }
                  setUserProfileId(u.id);
                }
              }}
            />
          ))}
          {listeners.length ? (
            <div
              style={{
                marginTop: 10,
                gridColumn: "1/-1",
                color: "var(--vscode-descriptionForeground)",
              }}
            >
              Listeners
            </div>
          ) : null}
          {listeners.map((u) => (
            <UserNode
              u={u}
              isMuted={room.muteMap[u.id]}
              isCreator={u.id === room.creatorId}
              isMod={u.modForRoomId === room.id}
              isSpeaker={u.canSpeakForRoomId === room.id}
              raisedHand={u.id in room.raiseHandMap}
              key={u.id}
              onClick={() => {
                if (u.id === profile?.id) {
                  setUserProfileId("");
                } else {
                  if (
                    (u.youAreFollowing === undefined ||
                      u.youAreFollowing === null) &&
                    me?.id !== u.id
                  ) {
                    wsend({ op: "follow_info", d: { userId: u.id } });
                  }
                  setUserProfileId(u.id);
                }
              }}
            />
          ))}
        </div>
      </Wrapper>
      <BottomVoiceControl />
    </>
  );
};
