import { useAtom } from "jotai";
import React from "react";
import { useHistory } from "react-router-dom";
import { closeWebSocket, wsend } from "../../createWebsocket";
import { meAtom } from "../atoms";
import { Backbar } from "../components/Backbar";
import { BodyWrapper } from "../components/BodyWrapper";
import { Button } from "../components/Button";
import { modalConfirm } from "../components/ConfirmModal";
import { UserProfile } from "../components/UserProfile";
import { Wrapper } from "../components/Wrapper";
import { useTokenStore } from "../utils/useTokenStore";

interface MyProfilePageProps {}

export const MyProfilePage: React.FC<MyProfilePageProps> = ({}) => {
  const [me] = useAtom(meAtom);
  const history = useHistory();
  return (
    <Wrapper>
      <Backbar actuallyGoBack>
        <div className={`ml-auto flex items-center`}>
          <Button
            className={`m-2.5`}
            onClick={() => {
              modalConfirm("Are you sure you want to logout?", () => {
                history.push("/");
                closeWebSocket();
                useTokenStore
                  .getState()
                  .setTokens({ accessToken: "", refreshToken: "" });
              });
            }}
            variant="small"
          >
            logout
          </Button>
        </div>
      </Backbar>
      <BodyWrapper>
        {me ? <UserProfile profile={me} /> : <div>probably loading...</div>}
        <div className={`pt-6 flex`}>
          <Button
            style={{ marginRight: "10px" }}
            variant="small"
            onClick={() => history.push(`/voice-settings`)}
          >
            go to voice settings
          </Button>
          <Button
            variant="small"
            onClick={() => history.push(`/sound-effect-settings`)}
          >
            go to sound settings
          </Button>
        </div>
        <div className={`pt-6 flex`}>
          <Button
            variant="small"
            color="red"
            onClick={() => {
              modalConfirm(
                "Are you sure you want to permanently delete your account?",
                () => {
                  wsend({ op: "delete_account", d: {} });
                }
              );
            }}
          >
            delete account
          </Button>
        </div>
      </BodyWrapper>
    </Wrapper>
  );
};
