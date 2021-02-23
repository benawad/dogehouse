import { useAtom } from "jotai";
import React from "react";
import { useHistory } from "react-router-dom";
<<<<<<< HEAD
import { wsend } from "../../createWebsocket";
=======
import { tw } from "twind";
import { wsend } from "@dogehouse/feta/createWebsocket";
>>>>>>> 76e5e6ddabfa381984235042bbfd5056e7372c0d
import { currentRoomAtom, followingOnlineAtom } from "../atoms";
import { Avatar } from "../components/Avatar";
import { Backbar } from "../components/Backbar";
import { BodyWrapper } from "../components/BodyWrapper";
import { Button } from "../components/Button";
import { Wrapper } from "../components/Wrapper";

interface FriendListProps {}

export const FollowingOnlineList: React.FC<FriendListProps> = () => {
  const history = useHistory();
  const [{ users, nextCursor }] = useAtom(followingOnlineAtom);
  const [currentRoom] = useAtom(currentRoomAtom);

  return (
    <Wrapper>
      <Backbar />
      <BodyWrapper>
        <div className={`mb-4 text-2xl`}>
          List of users online that are not in a private room and you follow.
        </div>
        {users.length === 0 ? <div>no users found</div> : null}
        {users.map((u) => (
          <div
            className={`border-b border-solid border-simple-gray-3c flex py-4 px-2 items-center`}
            key={u.id}
          >
            <button onClick={() => history.push(`/user`, u)}>
              <Avatar src={u.avatarUrl} />
            </button>
            <button
              onClick={() => {
                if (u.currentRoom) {
                  if (u.currentRoom.id !== currentRoom?.id) {
                    wsend({ op: "join_room", d: { roomId: u.currentRoom.id } });
                  }
                  history.push("/room/" + u.currentRoom.id);
                }
              }}
              className={`ml-4 flex-1 text-left`}
            >
              <div className={`text-lg`}>
                {u.displayName}
              </div>
              <div style={{ color: "" }}>
                {u.currentRoom ? u.currentRoom.name : "online"}
              </div>
            </button>
            {u.followsYou ? (
              <div className={`ml-auto`}>
                <Button
                  onClick={() => {
                    wsend({
                      op: "create-room",
                      d: {
                        roomName: "My Private Room",
                        value: "private",
                        userIdToInvite: u.id,
                      },
                    });
                  }}
                  variant="small"
                >
                  start a private room with them
                </Button>
              </div>
            ) : null}
          </div>
        ))}
        {nextCursor ? (
          <div className={`flex justify-center my-10`}>
            <Button
              variant="small"
              onClick={() =>
                wsend({
                  op: "fetch_following_online",
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
  );
};
