import { useAtom } from "jotai";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { currentRoomAtom, publicRoomsAtom } from "../atoms";
import { RoomCard } from "../components/RoomCard";
import { Wrapper } from "../components/Wrapper";
import { BottomVoiceControl } from "../components/BottomVoiceControl";
import { tw } from "twind";
import { Button } from "../components/Button";
import { wsend } from "../../createWebsocket";
import { createRoomPrompt } from "../utils/createRoomPrompt";
import { Logo } from "../svgs/Logo";
import { CreateRoomModal } from "../components/CreateRoomModal";

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

  // useEffect(() => {
  //   if (currentRoom) {
  //     history.push("/room", { room: currentRoom });
  //   }
  // }, [currentRoom]);

  return (
    <>
      <Wrapper>
        <div className={tw`mb-10`}>
          <Logo />
        </div>
        <div className={tw`mb-6`}>
          <Button
            onClick={() => {
              wsend({ op: "fetch_following_online", d: { cursor: 0 } });
              history.push("/following-online");
            }}
          >
            friends
          </Button>
        </div>
        <div className={tw`mb-4 flex`}>
          <Button
            onClick={() => {
              setShowCreateRoomModal(true);
              // createRoomPrompt("public");
            }}
          >
            create room
          </Button>
          {/* <Button
            style={{ marginLeft: 10 }}
            onClick={() => {
              createRoomPrompt("private");
            }}
          >
            create private room
          </Button> */}
        </div>
        {currentRoom ? (
          <div className={tw`my-8`}>
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
            <div className={tw(`mt-4`)} key={r.id}>
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
          <div className={tw`flex justify-center my-10`}>
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
      </Wrapper>
      <BottomVoiceControl />
      {showCreateRoomModal ? (
        <CreateRoomModal onRequestClose={() => setShowCreateRoomModal(false)} />
      ) : null}
    </>
  );
};
