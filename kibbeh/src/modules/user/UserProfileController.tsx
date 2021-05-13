import isElectron from "is-electron";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { isServer } from "../../lib/isServer";
import { usePreloadPush } from "../../shared-components/ApiPreloadLink";
import { useConn } from "../../shared-hooks/useConn";
import { useTypeSafeQuery } from "../../shared-hooks/useTypeSafeQuery";
import { useTypeSafeTranslation } from "../../shared-hooks/useTypeSafeTranslation";
import { useTypeSafeUpdateQuery } from "../../shared-hooks/useTypeSafeUpdateQuery";
import { Button } from "../../ui/Button";
import { CenterLoader } from "../../ui/CenterLoader";
import { InfoText } from "../../ui/InfoText";
import { UserProfile } from "../../ui/UserProfile";
import { EditProfileModal } from "./EditProfileModal";
import { VerticalUserInfoWithFollowButton } from "./VerticalUserInfoWithFollowButton";

interface UserProfileControllerProps {}

const isMac = process.platform === "darwin";

export const UserProfileController: React.FC<UserProfileControllerProps> = ({}) => {
  const conn = useConn();
  const { t } = useTypeSafeTranslation();
  const { push } = useRouter();
  const { query } = useRouter();
  const { data, isLoading } = useTypeSafeQuery(
    ["getUserProfile", query.username as string],
    {
      enabled:
        typeof query.username === "string" && !!query.username && !isServer,
      refetchOnMount: "always",
    },
    [query.username as string]
  );

  // commented this out as rn this shows up all the time
  useEffect(() => {
    if (isElectron()) {
      const ipcRenderer = window.require("electron").ipcRenderer;
      ipcRenderer.send("@rpc/page", {
        page: "profile",
        opened: true,
        modal: false,
        data: query.username,
      });
      return () => {
        ipcRenderer.send("@rpc/page", {
          page: "profile",
          opened: false,
          modal: false,
          data: query.username,
        });
      };
    }
  }, [query]);

  if (isLoading) {
    return <CenterLoader />;
  }

  if (!data || ("error" in data && data.error.includes("could not find"))) {
    return <InfoText>{t("pages.myProfile.couldNotFindUser")}</InfoText>;
  } else if ("error" in data && data.error.includes("blocked")) {
    return <InfoText>You have been blocked by this user.</InfoText>;
  } else if ("error" in data) {
    return <InfoText>{data.error}</InfoText>;
  }

  return (
    <>
      <UserProfile user={data} isCurrentUser={data.id === conn.user.id} />
      {data.id === conn.user.id && (
        <div className={`pt-6 pb-6 flex`}>
          <Button
            style={{ marginRight: "10px" }}
            size="small"
            onClick={() => push(`/voice-settings`)}
          >
            {t("pages.myProfile.voiceSettings")}
          </Button>
          {isElectron() && !isMac ? (
            <Button
              style={{ marginRight: "10px" }}
              size="small"
              onClick={() => push(`/overlay-settings`)}
            >
              {t("pages.myProfile.overlaySettings")}
            </Button>
          ) : null}
          <Button
            style={{ marginRight: "10px" }}
            size="small"
            onClick={() => push(`/sound-effect-settings`)}
          >
            {t("pages.myProfile.soundSettings")}
          </Button>
          <Button size="small" onClick={() => push(`/privacy-settings`)}>
            {t("pages.myProfile.privacySettings")}
          </Button>
        </div>
      )}
    </>
  );
};
