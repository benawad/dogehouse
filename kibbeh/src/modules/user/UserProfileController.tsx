import isElectron from "is-electron";
import { useRouter } from "next/router";
import React from "react";
import { isServer } from "../../lib/isServer";
import { useTypeSafeQuery } from "../../shared-hooks/useTypeSafeQuery";
import { useTypeSafeTranslation } from "../../shared-hooks/useTypeSafeTranslation";
import { Button } from "../../ui/Button";
import { CenterLoader } from "../../ui/CenterLoader";
import { InfoText } from "../../ui/InfoText";
import { VerticalUserInfoWithFollowButton } from "./VerticalUserInfoWithFollowButton";

interface UserProfileControllerProps {}

const isMac = process.platform === "darwin";

export const UserProfileController: React.FC<UserProfileControllerProps> = ({}) => {
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

  if (isLoading) {
    return <CenterLoader />;
  }

  if (!data) {
    return <InfoText>could not find user</InfoText>;
  }

  return (
    <>
      <VerticalUserInfoWithFollowButton
        idOrUsernameUsedForQuery={data.username}
        user={data}
      />
      <div className={`pt-6 flex`}>
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
        <Button size="small" onClick={() => push(`/sound-effect-settings`)}>
          {t("pages.myProfile.soundSettings")}
        </Button>
      </div>
    </>
  );
};
