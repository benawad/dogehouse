import { useAtom } from "jotai";
import React from "react";
import { useHistory } from "react-router-dom";
import { tw } from "twind";
import { wsend } from "../../createWebsocket";
import { currentRoomAtom, followingOnlineAtom } from "../atoms";
import { Avatar } from "../components/Avatar";
import { Backbar } from "../components/Backbar";
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
      <div className={tw`mb-4`}>
        List of users online that are not in a private room and you follow.
      </div>
      {users.length === 0 ? <div>no users found</div> : null}
      {users.map((u) => (
        <div
          style={{ borderBottom: "1px solid var( --vscode-dropdown-border)" }}
          className={tw`flex py-4 px-2 items-center`}
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
            className={tw`ml-4 flex-1 text-left`}
          >
            <div
              style={{
                fontSize: "calc(var(--vscode-font-size)*1.1)",
              }}
            >
              {u.displayName}
            </div>
            <div style={{ color: "" }}>
              {u.currentRoom ? u.currentRoom.name : "online"}
            </div>
          </button>
          {u.followsYou ? (
            <div style={{ marginLeft: "auto" }}>
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
        <div className={tw`flex justify-center my-10`}>
          <Button
            variant="small"
            onClick={() =>
              wsend({ op: "fetch_following_online", d: { cursor: nextCursor } })
            }
          >
            load more
          </Button>
        </div>
      ) : null}
    </Wrapper>
  );
};
