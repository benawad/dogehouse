import { useAtom } from "jotai";
import React from "react";
import { useHistory } from "react-router-dom";
import { tw } from "twind";
import { closeWebSocket } from "../../createWebsocket";
import { meAtom } from "../atoms";
import { Backbar } from "../components/Backbar";
import { BodyWrapper } from "../components/BodyWrapper";
import { Button } from "../components/Button";
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
        <div className={tw`ml-auto flex items-center`}>
          <Button
            style={{ marginRight: "9px" }}
            onClick={() => {
              history.push("/");
              closeWebSocket();
              useTokenStore
                .getState()
                .setTokens({ accessToken: "", refreshToken: "" });
            }}
            variant="small"
          >
            logout
          </Button>
        </div>
      </Backbar>
              <BodyWrapper>
      {me ? <UserProfile profile={me} /> : <div>probably loading...</div>}
      <div className={tw`pt-6`}>
        <Button variant="small" onClick={() => history.push(`/voice-settings`)}>
          go to voice settings
        </Button>
      </div>
              </BodyWrapper>
    </Wrapper>
  );
};
