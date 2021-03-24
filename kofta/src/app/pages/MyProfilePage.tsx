import React from "react";
import { useHistory } from "react-router-dom";
import { closeWebSocket } from "../../createWebsocket";
import { Backbar } from "../components/Backbar";
import { BodyWrapper } from "../components/BodyWrapper";
import { Button } from "../components/Button";
import { modalConfirm } from "../components/ConfirmModal";
import { UserProfile } from "../components/UserProfile";
import { Wrapper } from "../components/Wrapper";
import { useMeQuery } from "../utils/useMeQuery";
import { useTokenStore } from "../utils/useTokenStore";
import { useTypeSafeTranslation } from "../utils/useTypeSafeTranslation";
import isElectron from "is-electron";
import { useRoomChatStore } from "../modules/room-chat/useRoomChatStore";

interface MyProfilePageProps { }

const isMac = process.platform === 'darwin';

export const MyProfilePage: React.FC<MyProfilePageProps> = ({ }) => {
  const { me } = useMeQuery();
  const history = useHistory();
  const { t } = useTypeSafeTranslation();
  const setOpenChat = useRoomChatStore((s) => s.setOpen);

  return (
    <Wrapper>
      <Backbar actuallyGoBack>
        <div className={`ml-auto flex items-center`}>
          <Button
            className={`m-2.5`}
            onClick={() => {
              modalConfirm("Are you sure you want to logout?", () => {
                setOpenChat(false);
                history.push("/");
                closeWebSocket();
                useTokenStore
                  .getState()
                  .setTokens({ accessToken: "", refreshToken: "" });
              });
            }}
            variant="small"
          >
            {t("pages.myProfile.logout")}
          </Button>
        </div>
      </Backbar>
      <BodyWrapper>
        {me ? (
          <UserProfile profile={me} />
        ) : (
          <div>{t("pages.myProfile.probablyLoading")}</div>
        )}
        <div className={`pt-6 flex`}>
          <Button
            style={{ marginRight: "10px" }}
            variant="small"
            onClick={() => history.push(`/voice-settings`)}
          >
            {t("pages.myProfile.voiceSettings")}
          </Button>
          {
            isElectron() && !isMac ? <Button
              style={{ marginRight: "10px" }}
              variant="small"
              onClick={() => history.push(`/overlay-settings`)}
            >
              {t("pages.myProfile.overlaySettings")}
          </Button> : null
          }
          <Button
            variant="small"
            onClick={() => history.push(`/sound-effect-settings`)}
          >
            {t("pages.myProfile.soundSettings")}
          </Button>
        </div>
        {/* <div className={`pt-6 flex`}>
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
						{t("pages.myProfile.deleteAccount")}
					</Button>
				</div> */}
      </BodyWrapper>
    </Wrapper>
  );
};
