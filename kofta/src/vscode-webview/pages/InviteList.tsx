import { useAtom } from "jotai";
import React from "react";
import { Link, useHistory } from "react-router-dom";
import { tw } from "twind";
import { wsend } from "../../createWebsocket";
import { currentRoomAtom, inviteListAtom } from "../atoms";
import { Avatar } from "../components/Avatar";
import { Backbar } from "../components/Backbar";
import { Button } from "../components/Button";
import { InviteButton } from "../components/InviteButton";
import { Wrapper } from "../components/Wrapper";

interface InviteListProps {}

export const InviteList: React.FC<InviteListProps> = () => {
  const history = useHistory();
  const [{ nextCursor, users }] = useAtom(inviteListAtom);
  const [room] = useAtom(currentRoomAtom);
  const path = `/room/${room?.id}`;
  const url = window.location.origin + path;

  if (!room) {
    return (
      <Wrapper>
        <Backbar />
        <Button onClick={() => history.push("/")}>room gone, go back</Button>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <Backbar />
      {room.isPrivate ? null : (
        <div className={tw`mb-8 text-2xl`}>
          Share the link to your room:{" "}
          <Link
            style={{
              color: "var(--vscode-textLink-foreground)",
            }}
            to={path}
          >
            {url}
          </Link>
        </div>
      )}
      {users.length ? (
        <div className={tw`my-4 text-2xl`}>
          You can invite users who are online and follow you:
        </div>
      ) : null}
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
              history.push(`/user`, u);
            }}
            className={tw`ml-4`}
          >
            <div
              style={{
                fontSize: "calc(var(--vscode-font-size)*1.1)",
              }}
            >
              {u.displayName}
            </div>
            <div>@{u.username}</div>
          </button>
          <div style={{ marginLeft: "auto" }}>
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
        <div className={tw`flex justify-center my-10`}>
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
    </Wrapper>
  );
};
