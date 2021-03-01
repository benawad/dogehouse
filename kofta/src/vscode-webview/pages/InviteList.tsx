import { useAtom } from "jotai";
import React, { useRef } from "react";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { wsend } from "../../createWebsocket";
import { useCurrentRoomStore } from "../../webrtc/stores/useCurrentRoomStore";
import { inviteListAtom } from "../atoms";
import { Avatar } from "../components/Avatar";
import { Backbar } from "../components/Backbar";
import { BodyWrapper } from "../components/BodyWrapper";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { InviteButton } from "../components/InviteButton";
import { Wrapper } from "../components/Wrapper";

interface InviteListProps {}

export const InviteList: React.FC<InviteListProps> = () => {
  const history = useHistory();
  const [{ nextCursor, users }] = useAtom(inviteListAtom);
  const { currentRoom: room } = useCurrentRoomStore();
  const path = `/room/${room?.id}`;
  const url = window.location.origin + path;
  const inputRef = useRef<HTMLInputElement>(null);

  if (!room) {
    return (
      <Wrapper>
        <Backbar />
        <BodyWrapper>
          <Button onClick={() => history.push("/")}>room gone, go back</Button>
        </BodyWrapper>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <Backbar actuallyGoBack />
      <BodyWrapper>
        {room.isPrivate ? null : (
          <>
            {!navigator.share ? (
              <div className={`text-2xl mb-2`}>share link to room</div>
            ) : null}
            <div className={`mb-8 flex`}>
              <Input readOnly ref={inputRef} value={url} />
              <Button
                variant="small"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({ url });
                  } else {
                    inputRef.current?.select();
                    document.execCommand("copy");
                    toast("copied to clipboard", { type: "success" });
                  }
                }}
              >
                {!navigator.share ? "copy" : "share link to room"}
              </Button>
            </div>
          </>
        )}
        {users.length ? (
          <div className={`my-4 text-2xl`}>
            You can invite your followers that are online:
          </div>
        ) : (
          <div className={`my-4 text-2xl`}>
            When your followers are online, they will show up here.
          </div>
        )}
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
                history.push(`/user`, u);
              }}
              className={`ml-4`}
            >
              <div className={`text-lg`}>{u.displayName}</div>
              <div>@{u.username}</div>
            </button>
            <div className={`ml-auto`}>
              <InviteButton
                onClick={() => {
                  wsend({
                    op: "invite_to_room",
                    d: {
                      userId: u.id,
                    },
                  });
                }}
              />
            </div>
          </div>
        ))}
        {nextCursor ? (
          <div className={`flex justify-center my-10`}>
            <Button
              variant="small"
              onClick={() =>
                wsend({
                  op: "fetch_invite_list",
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
