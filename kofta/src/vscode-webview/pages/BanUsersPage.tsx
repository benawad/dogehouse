import { useAtom } from "jotai";
import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { tw } from "twind";
import { wsend } from "../../createWebsocket";
import { meAtom } from "../atoms";
import { Backbar } from "../components/Backbar";
import { Button } from "../components/Button";
import { Wrapper } from "../components/Wrapper";

interface SearchUsersProps {}

export const BanUsersPage: React.FC<SearchUsersProps> = ({}) => {
  const [me] = useAtom(meAtom);
  const [username, setUsername] = useState("");
  const [reason, setReason] = useState("");

  if (!me) {
    return null;
  }

  if (me.username !== "benawad") {
    return <Redirect to="/" />;
  }

  return (
    <Wrapper style={{ marginBottom: "auto" }}>
      <Backbar />
      <div style={{ padding: "0 var(--container-paddding)" }}>
        <input
          className={tw`mb-8`}
          autoFocus
          placeholder="username to ban..."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className={tw`mb-16`}
          autoFocus
          placeholder="reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
        <Button
          onClick={() => {
            if (username && reason) {
              wsend({
                op: "ban",
                d: {
                  username,
                  reason,
                },
              });
            }
          }}
        >
          ban
        </Button>
      </div>
    </Wrapper>
  );
};
