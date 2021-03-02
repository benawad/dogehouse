import { useAtom } from "jotai";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { wsend } from "../../createWebsocket";
import { useCurrentRoomStore } from "../../webrtc/stores/useCurrentRoomStore";
import { publicRoomsAtom } from "../atoms";
import { BodyWrapper } from "../components/BodyWrapper";
import { BottomVoiceControl } from "../components/BottomVoiceControl";
import { Button } from "../components/Button";
import { CircleButton } from "../components/CircleButton";
import { CreateRoomModal } from "../components/CreateRoomModal";
import { ProfileButton } from "../components/ProfileButton";
import { RoomCard } from "../components/RoomCard";
import { Wrapper } from "../components/Wrapper";
import { Logo } from "../svgs/Logo";
import { PeopleIcon } from "../svgs/PeopleIcon";
import { useTranslation } from 'react-i18next';

interface HomeProps {}

export const Home: React.FC<HomeProps> = () => {
  const history = useHistory();
  const { currentRoom } = useCurrentRoomStore();
  const [{ publicRooms: rooms, nextCursor }] = useAtom(publicRoomsAtom);
  const [showCreateRoomModal, setShowCreateRoomModal] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (rooms.length < 15) {
      wsend({ op: "get_top_public_rooms", d: { cursor: 0 } });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`flex flex-col flex-1`}>
      <Wrapper>
        <BodyWrapper>
          <div className={`mb-10 mt-8`}>
            <Logo />
          </div>
          <div className={`mb-6 flex justify-center`}>
            <div className={`mr-4`}>
              <CircleButton
                onClick={() => {
                  wsend({ op: "fetch_following_online", d: { cursor: 0 } });
                  history.push("/following-online");
                }}
              >
                <PeopleIcon width={30} height={30} fill="#fff" />
              </CircleButton>
            </div>
            <div className={`ml-2`}>
              <ProfileButton circle size={60} />
            </div>
          </div>
          {currentRoom ? (
            <div className={`my-8`}>
              <RoomCard
                active
                onClick={() => history.push("/room/" + currentRoom.id)}
                room={currentRoom}
                currentRoomId={currentRoom.id}
              />
            </div>
          ) : null}
          {rooms.map((r) =>
            r.id === currentRoom?.id ? null : (
              <div className={`mt-4`} key={r.id}>
                <RoomCard
                  onClick={() => {
                    wsend({ op: "join_room", d: { roomId: r.id } });
                    history.push("/room/" + r.id);
                  }}
                  room={r}
                  currentRoomId={currentRoom?.id}
                />
              </div>
            )
          )}
          {nextCursor ? (
            <div className={`flex justify-center my-10`}>
              <Button
                variant="small"
                onClick={() =>
                  wsend({
                    op: "get_top_public_rooms",
                    d: { cursor: nextCursor },
                  })
                }
              >
                {t("common.loadMore")}
              </Button>
            </div>
          ) : null}
          <div style={{ height: 40 }} />
        </BodyWrapper>
      </Wrapper>
      <BottomVoiceControl>
        <div className={`mb-8 flex px-5`}>
          <Button
            variant="slim"
            dogeProbability={0.01}
            onClick={() => {
              setShowCreateRoomModal(true);
            }}
          >
            <h3 className={`text-2xl`}>{t("pages.home.createRoom")}</h3>
          </Button>
        </div>
      </BottomVoiceControl>
      {showCreateRoomModal ? (
        <CreateRoomModal onRequestClose={() => setShowCreateRoomModal(false)} />
      ) : null}
    </div>
  );
};
