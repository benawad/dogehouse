import { useAtom } from "jotai";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { currentRoomAtom, publicRoomsAtom } from "../atoms";
import { RoomCard } from "../components/RoomCard";
import { Wrapper } from "../components/Wrapper";
import { BottomVoiceControl } from "../components/BottomVoiceControl";
import { Button } from "../components/Button";
import { wsend } from "../../createWebsocket";
import { Logo } from "../svgs/Logo";
import { CreateRoomModal } from "../components/CreateRoomModal";
import { ProfileButton } from "../components/ProfileButton";
import { PeopleIcon } from "../svgs/PeopleIcon";
import { CircleButton } from "../components/CircleButton";
import { BodyWrapper } from "../components/BodyWrapper";

interface HomeProps {}

export const Home: React.FC<HomeProps> = () => {
  const history = useHistory();
  const [currentRoom] = useAtom(currentRoomAtom);
  const [{ publicRooms: rooms, nextCursor }] = useAtom(publicRoomsAtom);
  const [showCreateRoomModal, setShowCreateRoomModal] = useState(false);

  useEffect(() => {
    if (rooms.length < 15) {
      wsend({ op: "get_top_public_rooms", d: { cursor: 0 } });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`grid grid-rows-fr-auto flex-1`}>
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
                load more
              </Button>
            </div>
          ) : null}
        </BodyWrapper>
      </Wrapper>
      <BottomVoiceControl>
        <div className={`mb-8 flex px-5`}>
          <Button
            variant="slim"
            onClick={() => {
              setShowCreateRoomModal(true);
            }}
          >
            <h3 className={`text-2xl`}>Create Room</h3>
          </Button>
        </div>
      </BottomVoiceControl>
      {showCreateRoomModal ? (
        <CreateRoomModal onRequestClose={() => setShowCreateRoomModal(false)} />
      ) : null}
    </div>
  );
};
